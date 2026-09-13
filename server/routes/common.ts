import { Router } from 'express';
import { db, getDatabaseStats, reseedSchoolDatabase, restoreOriginalDemoDatabase } from '../db';
import { authenticateToken, optionalAuth } from './auth';

export const commonRouter = Router();

// =======================
// LEARNING PROGRAMS
// =======================
commonRouter.get('/programs', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    const rows: any[] = db.prepare('SELECT * FROM learning_programs ORDER BY rowid DESC').all();

    const enrolledRows: any[] = userId
      ? db.prepare('SELECT program_id FROM program_enrollments WHERE user_id = ?').all(userId)
      : [];
    const enrolledSet = new Set(enrolledRows.map(r => r.program_id));

    const programs = rows.map(r => {
      let parsedVideos: any[] = [];
      if (r.videos_json) {
        try {
          parsedVideos = JSON.parse(r.videos_json);
        } catch {}
      }
      if ((!parsedVideos || parsedVideos.length === 0) && r.video_url) {
        parsedVideos = [{
          id: 'v-1',
          title: r.video_title || 'Lecture 1: Comprehensive Foundations & Masterclass',
          url: r.video_url,
          duration: r.video_duration || '45 mins'
        }];
      }

      return {
        id: r.id,
        title: r.title,
        category: r.category,
        provider: r.provider,
        logo: r.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        duration: r.duration,
        level: r.level || 'Intermediate',
        skillsGained: JSON.parse(r.skills_gained || '[]'),
        hasCertification: Boolean(r.has_certification),
        rating: r.rating || 4.8,
        enrolledCount: r.enrolled_count || 0,
        deadline: r.deadline || 'Open Enrolment',
        description: r.description || '',
        mode: r.mode || 'Live Online',
        eligibleBranches: JSON.parse(r.eligible_branches || '["Computer Science & Engineering", "Information Technology", "Artificial Intelligence & Data Science"]'),
        careerRoleIds: JSON.parse(r.career_role_ids || '[]'),
        targetRoles: JSON.parse(r.target_roles || '[]'),
        requirements: JSON.parse(r.requirements || '[]'),
        prerequisites: r.prerequisites || 'Basic programming fundamentals and curiosity to build.',
        maxSeats: r.max_seats || 100,
        status: r.status || (r.is_closed ? 'Closed' : 'Live & Accepting'),
        isClosed: Boolean(r.is_closed || r.status === 'Closed' || r.status === 'Archived'),
        closedReason: r.closed_reason || null,
        closedAt: r.closed_at || null,
        hiringAdvantage: r.hiring_advantage || 'Direct interview fast-track for top performers',
        stipendOrCost: r.stipend_or_cost || 'Free for University Students',
        mentorName: r.mentor_name || (r.provider?.includes('Apex') ? 'Institutional Faculty Lead' : undefined),
        venueOrLink: r.venue_or_link || (r.mode === 'Classroom' ? 'Campus Engineering Labs' : 'Virtual Classroom'),
        syllabusModules: r.syllabus_modules ? JSON.parse(r.syllabus_modules) : [],
        scheduleTiming: r.schedule_timing || 'Flexible Schedule',
        department: r.department || (r.provider?.includes('Apex') ? 'Computer Science & Engineering' : undefined),
        certificateTemplateTitle: r.certificate_template_title || `Certificate of Completion & Technical Mastery in ${r.title}`,
        certificateSignatoryName: r.certificate_signatory_name || r.mentor_name || 'Dr. Ramesh Sharma, Dean',
        certificateSignatoryTitle: r.certificate_signatory_title || 'Director of Academic Affairs & CoE',
        certificateBadgeUrl: r.certificate_badge_url || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
        certificateCredentialPrefix: r.certificate_credential_prefix || 'CERT-APEX-',
        certificateCitation: r.certificate_citation || `This certifies that the participant has successfully completed all interactive lectures, laboratory assignments, and milestone evaluations in ${r.title} with verified academic distinction.`,
        certificateTemplateStyle: r.certificate_template_style || 'gold',
        autoIssueCertificate: r.auto_issue_certificate !== undefined ? Boolean(r.auto_issue_certificate) : true,
        videoUrl: r.video_url || (parsedVideos[0]?.url) || null,
        videoTitle: r.video_title || (parsedVideos[0]?.title) || null,
        videoDuration: r.video_duration || (parsedVideos[0]?.duration) || null,
        videos: parsedVideos,
        postedDate: r.posted_date || 'Recently Posted',
        isEnrolled: enrolledSet.has(r.id)
      };
    });

    return res.json({ programs });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUBLISH NEW TRAINING PROGRAM OR WORKSHOP (INDUSTRY / INSTITUTION)
commonRouter.post('/programs', optionalAuth, (req: any, res) => {
  try {
    const {
      title,
      category,
      provider,
      logo,
      duration,
      level,
      skillsGained,
      hasCertification,
      deadline,
      description,
      mode,
      eligibleBranches,
      careerRoleIds,
      targetRoles,
      requirements,
      prerequisites,
      maxSeats,
      status,
      hiringAdvantage,
      stipendOrCost,
      mentorName,
      venueOrLink,
      syllabusModules,
      scheduleTiming,
      department,
      certificateTemplateTitle,
      certificateSignatoryName,
      certificateSignatoryTitle,
      certificateBadgeUrl,
      certificateCredentialPrefix,
      certificateCitation,
      certificateTemplateStyle,
      autoIssueCertificate,
      videoUrl,
      videoTitle,
      videoDuration,
      videos,
      postedDate
    } = req.body;

    if (!title || !category || !duration) {
      return res.status(400).json({ error: 'Title, category, and duration are required.' });
    }

    const progId = `lp-${Date.now()}`;
    const userOrg = req.user?.organization || provider || (req.user?.role === 'institution' ? 'Apex Institute of Technology' : 'TechNova Corporate Academy');
    const userLogo = req.user?.avatar || logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
    const resolvedPostedDate = postedDate || new Date().toISOString().split('T')[0];

    const safeSkills = Array.isArray(skillsGained) ? skillsGained : (typeof skillsGained === 'string' ? skillsGained.split(',').map(s => s.trim()).filter(Boolean) : []);
    const safeRequirements = Array.isArray(requirements) ? requirements : (typeof requirements === 'string' ? requirements.split('\n').map(s => s.trim()).filter(Boolean) : []);
    const safeBranches = Array.isArray(eligibleBranches) ? eligibleBranches : ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'];
    const safeSyllabus = Array.isArray(syllabusModules) ? syllabusModules : [];

    // Multi-video list handling
    const rawVideosList: any[] = Array.isArray(videos) && videos.length > 0 
      ? videos 
      : (videoUrl ? [{ id: `v-${Date.now()}`, title: videoTitle || 'Lecture 1: Comprehensive Masterclass', url: videoUrl, duration: videoDuration || '45 mins' }] : []);
    
    const safeVideos = rawVideosList
      .filter(v => v && (typeof v.url === 'string' ? v.url.trim() : ''))
      .map((v, idx) => ({
        id: v.id || `vid-${Date.now()}-${idx + 1}`,
        title: (v.title || `Lecture ${idx + 1}: Technical Lecture`).trim(),
        url: v.url.trim(),
        duration: (v.duration || '45 mins').trim(),
        moduleIndex: typeof v.moduleIndex === 'number' ? v.moduleIndex : idx + 1
      }));

    const primaryVideo = safeVideos[0] || null;
    const resolvedVideoUrl = primaryVideo?.url || videoUrl || null;
    const resolvedVideoTitle = primaryVideo?.title || videoTitle || null;
    const resolvedVideoDuration = primaryVideo?.duration || videoDuration || '45 mins';

    db.prepare(`
      INSERT INTO learning_programs (
        id, title, category, provider, logo, duration, level, skills_gained,
        has_certification, rating, enrolled_count, deadline, description, mode,
        eligible_branches, career_role_ids, target_roles, requirements, prerequisites,
        max_seats, created_by, status, hiring_advantage, stipend_or_cost,
        mentor_name, venue_or_link, syllabus_modules, schedule_timing, department,
        certificate_template_title, certificate_signatory_name, certificate_signatory_title,
        certificate_badge_url, certificate_credential_prefix, certificate_citation,
        certificate_template_style, auto_issue_certificate,
        video_url, video_title, video_duration, videos_json, posted_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      progId,
      title,
      category || 'Course',
      userOrg,
      userLogo,
      duration,
      level || 'Intermediate',
      JSON.stringify(safeSkills),
      hasCertification !== false ? 1 : 0,
      4.9,
      0,
      deadline || 'Open Enrolment',
      description || 'Comprehensive training curriculum and hands-on capstone sprint.',
      mode || 'Live Online',
      JSON.stringify(safeBranches),
      JSON.stringify(careerRoleIds || []),
      JSON.stringify(targetRoles || []),
      JSON.stringify(safeRequirements),
      prerequisites || 'Basic programming fundamentals and curiosity to build.',
      maxSeats ? parseInt(String(maxSeats), 10) : 100,
      req.user?.id || 'usr-institution-1',
      status || 'Live & Accepting',
      hiringAdvantage || 'Top performers receive direct interview shortlist for campus placement',
      stipendOrCost || 'Free Sponsored Access',
      mentorName || (req.user?.role === 'institution' ? 'Institutional Faculty Lead' : null),
      venueOrLink || (mode === 'Classroom' ? 'Campus Engineering Lab' : 'Virtual Meeting URL'),
      JSON.stringify(safeSyllabus),
      scheduleTiming || 'Flexible Schedule',
      department || 'Computer Science & Engineering',
      certificateTemplateTitle || `Certificate of Completion & Technical Mastery in ${title}`,
      certificateSignatoryName || mentorName || 'Dr. Ramesh Sharma, Dean',
      certificateSignatoryTitle || 'Director of Academic Affairs & CoE',
      certificateBadgeUrl || userLogo,
      certificateCredentialPrefix || 'CERT-APEX-',
      certificateCitation || `This certifies that the participant has successfully completed all coursework, laboratory assignments, and capstone evaluation in ${title} with distinction.`,
      certificateTemplateStyle || 'gold',
      autoIssueCertificate !== false ? 1 : 0,
      resolvedVideoUrl,
      resolvedVideoTitle,
      resolvedVideoDuration,
      JSON.stringify(safeVideos),
      resolvedPostedDate
    );

    // Also dispatch a system notification to students
    try {
      const notifId = `notif-${Date.now()}`;
      db.prepare(`
        INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        notifId,
        'usr-student-1',
        'Learning',
        `New ${category || 'Program'}: ${title}`,
        `${userOrg} published a new ${duration} training program. Check requirements & enroll!`,
        new Date().toISOString(),
        0,
        'online-courses'
      );
    } catch {}

    const newProgram = {
      id: progId,
      title,
      category: category || 'Bootcamp',
      provider: userOrg,
      logo: userLogo,
      duration,
      level: level || 'Intermediate',
      skillsGained: safeSkills,
      hasCertification: hasCertification !== false,
      rating: 4.9,
      enrolledCount: 0,
      deadline: deadline || 'Open Enrolment',
      description: description || 'Comprehensive industry training curriculum and hands-on capstone sprint.',
      mode: mode || 'Live Online',
      eligibleBranches: safeBranches,
      careerRoleIds: careerRoleIds || [],
      targetRoles: targetRoles || [],
      requirements: safeRequirements,
      prerequisites: prerequisites || 'Basic programming fundamentals and curiosity to build.',
      maxSeats: maxSeats ? parseInt(String(maxSeats), 10) : 100,
      status: status || 'Live & Accepting',
      hiringAdvantage: hiringAdvantage || 'Top 10% performers receive direct interview shortlist for campus placement',
      stipendOrCost: stipendOrCost || 'Free Sponsored Access',
      videoUrl: resolvedVideoUrl,
      videoTitle: resolvedVideoTitle,
      videoDuration: resolvedVideoDuration,
      videos: safeVideos,
      postedDate: resolvedPostedDate,
      isClosed: Boolean(status === 'Closed' || status === 'Archived'),
      isEnrolled: false
    };

    return res.json({
      success: true,
      message: `Program "${title}" published successfully across all university portals!`,
      program: newProgram
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.post('/programs/:id/enroll', authenticateToken, (req: any, res) => {
  try {
    const programId = req.params.id;
    const userId = req.user.id;

    const prog: any = db.prepare('SELECT * FROM learning_programs WHERE id = ?').get(programId);
    if (!prog) {
      return res.status(404).json({ error: 'Program not found' });
    }

    if (prog.is_closed || prog.status === 'Closed' || prog.status === 'Archived') {
      return res.status(400).json({ error: 'Enrollment bookings for this program are currently closed.' });
    }

    const existing: any = db.prepare('SELECT 1 FROM program_enrollments WHERE user_id = ? AND program_id = ?').get(userId, programId);

    if (!existing) {
      db.prepare('INSERT INTO program_enrollments VALUES (?, ?, ?)').run(userId, programId, new Date().toISOString());
      db.prepare('UPDATE learning_programs SET enrolled_count = enrolled_count + 1 WHERE id = ?').run(programId);
    }

    return res.json({ success: true, message: 'Successfully enrolled in course!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// STUDENT COMPLETES A PROGRAM & DIRECTLY RECEIVES THE OFFICIAL CERTIFICATE
commonRouter.post('/programs/:id/complete', optionalAuth, (req: any, res) => {
  try {
    const programId = req.params.id;
    const userId = req.user?.id || req.body?.studentId || 'usr-student-1';
    const sName = req.user?.name || req.body?.studentName || 'Student Participant';
    const sUsn = req.body?.usn || '1AP23CS014';
    const sDept = req.body?.department || 'Computer Science & Engineering';

    const prog: any = db.prepare('SELECT * FROM learning_programs WHERE id = ?').get(programId);
    if (!prog) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const now = new Date().toISOString();

    // 1. Ensure enrollment exists
    const existingEnroll: any = db.prepare('SELECT 1 FROM program_enrollments WHERE user_id = ? AND program_id = ?').get(userId, programId);
    if (!existingEnroll) {
      db.prepare('INSERT INTO program_enrollments VALUES (?, ?, ?)').run(userId, programId, now);
      db.prepare('UPDATE learning_programs SET enrolled_count = enrolled_count + 1 WHERE id = ?').run(programId);
    }

    // 2. Generate certificate credentials
    const prefix = prog.certificate_credential_prefix || 'APEX-CERT-';
    const credId = `${prefix}${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const certId = `cert-auto-${Date.now()}`;
    const certTitle = prog.certificate_template_title || `Certificate of Completion in ${prog.title}`;
    const providerName = prog.provider || 'Apex Institute of Technology';
    const logoUrl = prog.certificate_badge_url || prog.logo || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop&q=80';
    const skillsStr = prog.skills_gained || JSON.stringify(['Course Completion', 'Practical Hands-on Mastery']);

    // 3. Insert or update in certifications table for the student
    const existingCert: any = db.prepare('SELECT * FROM certifications WHERE user_id = ? AND name = ?').get(userId, certTitle);
    let finalCert: any = existingCert;
    if (!existingCert) {
      db.prepare(`
        INSERT INTO certifications (
          id, user_id, name, provider, logo, issue_date, expiry_date,
          credential_id, verification_status, skills
        ) VALUES (?, ?, ?, ?, ?, ?, 'Lifetime Credential', ?, 'Verified', ?)
      `).run(
        certId,
        userId,
        certTitle,
        providerName,
        logoUrl,
        now.split('T')[0],
        credId,
        skillsStr
      );
      finalCert = {
        id: certId,
        userId,
        name: certTitle,
        provider: providerName,
        logo: logoUrl,
        issueDate: now.split('T')[0],
        expiryDate: 'Lifetime Credential',
        credentialId: credId,
        verificationStatus: 'Verified',
        skills: JSON.parse(skillsStr)
      };
    }

    // 4. Update or insert mentee_course_enrollments record
    let menteeRecord: any = db.prepare('SELECT * FROM mentee_course_enrollments WHERE course_id = ? AND student_id = ?').get(programId, userId);
    if (menteeRecord) {
      db.prepare(`
        UPDATE mentee_course_enrollments
        SET progress_percentage = 100,
            current_module = 'Course Completed & Certified',
            completed_assignments = total_assignments,
            is_certified = 1,
            issued_certificate_id = ?,
            certificate_issued_at = ?,
            last_active_at = ?
        WHERE id = ?
      `).run(finalCert.id, now, now, menteeRecord.id);
    } else {
      const mceId = `mce-${Date.now()}`;
      db.prepare(`
        INSERT INTO mentee_course_enrollments (
          id, course_id, course_title, course_mode, student_id, student_name, student_email,
          student_avatar, department, usn, cgpa, applied_at, statement_of_purpose, permission_status,
          permission_decided_at, mentor_name, started_at, progress_percentage, current_module,
          completed_assignments, total_assignments, assessment_score, last_active_at, is_certified,
          issued_certificate_id, certificate_issued_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 9.0, ?, 'Enrolled & Completed via Course Player', 'approved', ?, ?, ?, 100, 'Course Completed & Certified', 5, 5, 95.0, ?, 1, ?, ?)
      `).run(
        mceId,
        programId,
        prog.title,
        prog.mode || 'Live Online',
        userId,
        sName,
        req.user?.email || 'student@careersync.com',
        req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        sDept,
        sUsn,
        now,
        now,
        prog.mentor_name || 'Dr. Ramesh Sharma',
        now,
        now,
        finalCert.id,
        now
      );
    }

    // 5. Create congratulations notification
    try {
      const notifId = `notif-${Date.now()}`;
      db.prepare(`
        INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?)
      `).run(
        notifId,
        userId,
        'Achievement',
        'Course Completed! Official Certificate Issued 🎓',
        `Congratulations! You completed "${prog.title}". Your official verified certificate (${finalCert.credentialId || credId}) has been directly issued to your Digital Portfolio!`,
        now,
        'portfolio'
      );
    } catch {}

    return res.json({
      success: true,
      message: 'Course successfully completed! Your official certificate has been issued directly to your profile.',
      certificate: finalCert,
      credentialId: finalCert.credentialId || credId
    });
  } catch (err: any) {
    console.error('Error completing course:', err);
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE LEARNING PROGRAM STATUS / CLOSE ENROLLMENT BOOKINGS / ARCHIVE
commonRouter.patch('/programs/:id/status', optionalAuth, (req: any, res) => {
  try {
    const programId = req.params.id;
    const { status, closedReason } = req.body;

    if (!status || !['Live & Accepting', 'Upcoming', 'Closed', 'Archived'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (Live & Accepting, Upcoming, Closed, Archived)' });
    }

    const isClosed = status === 'Closed' || status === 'Archived' ? 1 : 0;
    const closedAt = isClosed ? new Date().toISOString() : null;

    const prog: any = db.prepare('SELECT * FROM learning_programs WHERE id = ?').get(programId);
    if (!prog) {
      return res.status(404).json({ error: 'Program not found' });
    }

    db.prepare(`
      UPDATE learning_programs 
      SET status = ?, is_closed = ?, closed_reason = ?, closed_at = ?
      WHERE id = ?
    `).run(status, isClosed, closedReason || null, closedAt, programId);

    // If closing, notify enrolled/interested students
    if (isClosed) {
      try {
        const notifId = `notif-${Date.now()}`;
        db.prepare(`
          INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?)
        `).run(
          notifId,
          'usr-student-1',
          'Learning',
          `Bookings Closed: ${prog.title}`,
          `New admissions & bookings for "${prog.title}" by ${prog.provider} have now closed.`,
          new Date().toISOString(),
          'online-courses'
        );
      } catch (ne) {
        console.warn('Notification error on program closing:', ne);
      }
    }

    return res.json({
      success: true,
      message: `Program status successfully updated to "${status}"!`,
      status,
      isClosed: Boolean(isClosed),
      closedReason: closedReason || null
    });
  } catch (err: any) {
    console.error('Error updating program status:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// INSTITUTION MENTEE COURSES & PERMISSIONS
// ==========================================

// GET ALL MENTEE COURSE APPLICATIONS & PROGRESS TRACKING
commonRouter.get('/courses/mentees', optionalAuth, (req: any, res) => {
  try {
    const { courseId, status, studentId } = req.query;
    let query = 'SELECT * FROM mentee_course_enrollments';
    const params: any[] = [];
    const conditions: string[] = [];

    if (courseId && courseId !== 'all') {
      conditions.push('course_id = ?');
      params.push(courseId);
    }
    if (status && status !== 'all') {
      conditions.push('permission_status = ?');
      params.push(status);
    }
    if (studentId && studentId !== 'all') {
      conditions.push('(student_id = ? OR student_id = "usr-student-1" OR student_id = "#8492019482" OR usn = ?)');
      params.push(studentId, studentId);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY rowid DESC';

    const rows: any[] = db.prepare(query).all(...params);
    const mentees = rows.map(r => ({
      id: r.id,
      courseId: r.course_id,
      courseTitle: r.course_title,
      courseMode: r.course_mode,
      studentId: r.student_id,
      studentName: r.student_name,
      studentEmail: r.student_email,
      studentAvatar: r.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      department: r.department,
      usn: r.usn || '1AP23CS001',
      cgpa: r.cgpa || 8.5,
      appliedAt: r.applied_at,
      statementOfPurpose: r.statement_of_purpose || '',
      permissionStatus: r.permission_status,
      permissionDecidedAt: r.permission_decided_at,
      mentorId: r.mentor_id,
      mentorName: r.mentor_name,
      startedAt: r.started_at,
      progressPercentage: r.progress_percentage || 0,
      currentModule: r.current_module || 'Module 1: Orientation & Fundamentals',
      completedAssignments: r.completed_assignments || 0,
      totalAssignments: r.total_assignments || 5,
      assessmentScore: r.assessment_score,
      lastActiveAt: r.last_active_at,
      mentorNotes: r.mentor_notes || '',
      isCertified: Boolean(r.is_certified),
      issuedCertificateId: r.issued_certificate_id,
      certificateIssuedAt: r.certificate_issued_at,
      testStatus: r.test_status || 'not_started',
      testScore: r.test_score !== null && r.test_score !== undefined ? Number(r.test_score) : undefined,
      testViolationsCount: r.test_violations_count || 0,
      isDisqualified: Boolean(r.is_disqualified),
      disqualificationReason: r.disqualification_reason || null,
      testCompletedAt: r.test_completed_at || null,
      stoppedAtSeconds: r.stopped_at_seconds || 0,
      completedModules: r.completed_modules_json ? JSON.parse(r.completed_modules_json) : null
    }));

    return res.json({ mentees });
  } catch (err: any) {
    console.error('Error fetching course mentees:', err);
    return res.status(500).json({ error: err.message });
  }
});

// STUDENT APPLIES FOR COURSE
commonRouter.post('/courses/apply', optionalAuth, (req: any, res) => {
  try {
    const {
      courseId,
      statementOfPurpose,
      studentName,
      studentEmail,
      department,
      usn,
      cgpa
    } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required.' });
    }

    const prog: any = db.prepare('SELECT * FROM learning_programs WHERE id = ?').get(courseId);
    if (!prog) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    if (prog.is_closed || prog.status === 'Closed' || prog.status === 'Archived') {
      return res.status(400).json({
        error: 'Enrollment bookings for this course are currently closed.',
        isClosed: true,
        closedReason: prog.closed_reason || 'Course cohort capacity reached.'
      });
    }

    const studentId = req.user?.id || req.body?.studentId || 'usr-student-1';
    const sName = req.user?.name || studentName || 'Student Applicant';
    const sEmail = req.user?.email || studentEmail || 'student@careersync.com';
    const sAvatar = req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const sDept = department || 'Computer Science & Engineering';

    // Check if already applied
    const existing: any = db.prepare('SELECT id, permission_status FROM mentee_course_enrollments WHERE course_id = ? AND student_id = ?').get(courseId, studentId);
    if (existing) {
      return res.status(400).json({
        error: `You have already applied for this course (Status: ${existing.permission_status}).`
      });
    }

    const mceId = `mce-${Date.now()}`;
    db.prepare(`
      INSERT INTO mentee_course_enrollments (
        id, course_id, course_title, course_mode, student_id, student_name, student_email,
        student_avatar, department, usn, cgpa, applied_at, statement_of_purpose, permission_status,
        mentor_name, progress_percentage, current_module, completed_assignments, total_assignments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, 'Awaiting Admission Approval', 0, 5)
    `).run(
      mceId,
      courseId,
      prog.title,
      prog.mode || 'Live Online',
      studentId,
      sName,
      sEmail,
      sAvatar,
      sDept,
      usn || '1AP23CS' + Math.floor(100 + Math.random() * 899),
      cgpa || 8.8,
      new Date().toISOString(),
      statementOfPurpose || 'Enthusiastic to master advanced industry skills under mentor guidance.',
      prog.mentor_name || 'Institutional Mentor'
    );

    // Notify institution / mentor
    try {
      const notifId = `notif-${Date.now()}`;
      db.prepare(`
        INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?)
      `).run(
        notifId,
        'usr-institution-1',
        'Academic',
        `New Course Application: ${sName}`,
        `${sName} (${sDept}) submitted an application for "${prog.title}". Please review and grant course permission.`,
        new Date().toISOString(),
        'institution-courses'
      );
    } catch {}

    return res.json({
      success: true,
      message: `Your application for "${prog.title}" has been submitted to your institutional mentor for approval!`,
      enrollmentId: mceId
    });
  } catch (err: any) {
    console.error('Error applying for course:', err);
    return res.status(500).json({ error: err.message });
  }
});

// MENTOR / INSTITUTION GRANTS OR DECLINES PERMISSION
commonRouter.patch('/courses/mentees/:id/permission', optionalAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    const { status, mentorNotes } = req.body; // 'approved' | 'declined'

    if (!status || !['approved', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Valid permission status is required (approved, declined, pending).' });
    }

    const record: any = db.prepare('SELECT * FROM mentee_course_enrollments WHERE id = ?').get(id);
    if (!record) {
      return res.status(404).json({ error: 'Mentee enrollment record not found.' });
    }

    const now = new Date().toISOString();
    const startedAt = status === 'approved' && !record.started_at ? now : record.started_at;
    const currentModule = status === 'approved' && record.current_module === 'Awaiting Admission Approval'
      ? 'Module 1: Orientation & Environment Setup'
      : record.current_module;
    const progress = status === 'approved' && record.progress_percentage === 0 ? 5 : record.progress_percentage;

    db.prepare(`
      UPDATE mentee_course_enrollments
      SET permission_status = ?, permission_decided_at = ?, started_at = ?,
          current_module = ?, progress_percentage = ?, mentor_notes = COALESCE(?, mentor_notes),
          last_active_at = ?
      WHERE id = ?
    `).run(status, now, startedAt, currentModule, progress, mentorNotes || null, now, id);

    // If approved, update program enrolled count
    if (status === 'approved') {
      try {
        db.prepare('UPDATE learning_programs SET enrolled_count = enrolled_count + 1 WHERE id = ?').run(record.course_id);
      } catch {}
    }

    // Notify student of decision
    try {
      const notifId = `notif-${Date.now()}`;
      const title = status === 'approved' ? `Course Permission Granted! 🎉` : `Course Application Update`;
      const msg = status === 'approved'
        ? `Your mentor has granted permission for you to attend "${record.course_title}". You can now access syllabus, labs, and track your milestone progress!`
        : `Your application for "${record.course_title}" was declined by mentor. Note: ${mentorNotes || 'Cohort capacity reached.'}`;

      db.prepare(`
        INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?)
      `).run(notifId, record.student_id, 'Academic', title, msg, now, 'online-courses');
    } catch {}

    return res.json({
      success: true,
      message: `Permission for ${record.student_name} updated to "${status}" successfully!`,
      status,
      permissionDecidedAt: now
    });
  } catch (err: any) {
    console.error('Error updating permission:', err);
    return res.status(500).json({ error: err.message });
  }
});

// MENTOR UPDATES MENTEE PROGRESS, MILESTONES & CERTIFICATION
commonRouter.patch('/courses/mentees/:id/progress', optionalAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    const {
      progressPercentage,
      currentModule,
      completedAssignments,
      totalAssignments,
      assessmentScore,
      mentorNotes,
      isCertified
    } = req.body;

    const record: any = db.prepare('SELECT * FROM mentee_course_enrollments WHERE id = ?').get(id);
    if (!record) {
      return res.status(404).json({ error: 'Mentee enrollment record not found.' });
    }

    // ACADEMIC INTEGRITY & PROCTORING CHECK:
    // If student was disqualified due to proctoring violations (e.g. 3 fullscreen exits),
    // neither the mentor nor institution can issue a completion certificate for this course.
    if (record.is_disqualified && (isCertified || progressPercentage >= 100)) {
      return res.status(403).json({
        error: 'Academic Integrity Lock: Certification cannot be issued for this student because they were permanently disqualified for exiting fullscreen 3 times during the proctored course assessment.'
      });
    }

    const now = new Date().toISOString();
    const newProgress = typeof progressPercentage === 'number'
      ? Math.max(0, Math.min(100, Math.round(progressPercentage)))
      : record.progress_percentage;
    const certified = typeof isCertified === 'boolean'
      ? (isCertified ? 1 : 0)
      : (newProgress >= 100 ? 1 : record.is_certified);

    db.prepare(`
      UPDATE mentee_course_enrollments
      SET progress_percentage = ?,
          current_module = COALESCE(?, current_module),
          completed_assignments = COALESCE(?, completed_assignments),
          total_assignments = COALESCE(?, total_assignments),
          assessment_score = COALESCE(?, assessment_score),
          mentor_notes = COALESCE(?, mentor_notes),
          is_certified = ?,
          last_active_at = ?
      WHERE id = ?
    `).run(
      newProgress,
      currentModule !== undefined ? currentModule : null,
      completedAssignments !== undefined ? completedAssignments : null,
      totalAssignments !== undefined ? totalAssignments : null,
      assessmentScore !== undefined ? assessmentScore : null,
      mentorNotes !== undefined ? mentorNotes : null,
      certified,
      now,
      id
    );

    // If course completed or certified, automatically issue official certificate to student's portfolio
    let issuedCertId = record.issued_certificate_id;
    if ((certified || newProgress >= 100) && (!record.is_certified || !record.issued_certificate_id)) {
      try {
        const prog: any = db.prepare('SELECT * FROM learning_programs WHERE id = ?').get(record.course_id);
        const prefix = prog?.certificate_credential_prefix || 'CERT-APEX-CS-';
        const credId = `${prefix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const certId = `cert-auto-${Date.now()}`;
        const certTitle = prog?.certificate_template_title || `Certificate of Completion in ${record.course_title}`;
        const providerName = prog?.provider || 'Apex Institute of Technology';
        const logoUrl = prog?.certificate_badge_url || prog?.logo || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop&q=80';

        // 1. Insert official verified certificate
        db.prepare(`
          INSERT OR REPLACE INTO certifications (
            id, user_id, name, provider, logo, issue_date, credential_id, verification_status, skills
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          certId,
          record.student_id,
          certTitle,
          providerName,
          logoUrl,
          now.split('T')[0],
          credId,
          'Verified',
          prog?.skills_gained || JSON.stringify(['Course Mastery', 'Practical Milestones'])
        );

        // 2. Mark mentee record with certificate
        issuedCertId = credId;
        db.prepare(`
          UPDATE mentee_course_enrollments
          SET issued_certificate_id = ?,
              certificate_issued_at = ?,
              is_certified = 1
          WHERE id = ?
        `).run(credId, now, id);

        // 3. Dispatch celebration notification
        const notifId = `notif-cert-${Date.now()}`;
        db.prepare(`
          INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?)
        `).run(
          notifId,
          record.student_id,
          'Achievement',
          `Certificate Automatically Issued! 🎓`,
          `Congratulations! You completed "${record.course_title}". Your official verified certificate (${credId}) signed by ${prog?.certificate_signatory_name || 'Dean'} has been automatically delivered to your Digital Portfolio!`,
          now,
          'portfolio'
        );
      } catch (ce) {
        console.warn('Auto-issue certificate error:', ce);
      }
    }

    return res.json({
      success: true,
      message: `Progress for ${record.student_name} successfully updated to ${newProgress}%!${(certified || newProgress >= 100) ? ' Certificate automatically issued & delivered to student portfolio.' : ''}`,
      progressPercentage: newProgress,
      isCertified: Boolean(certified),
      issuedCertificateId: issuedCertId
    });
  } catch (err: any) {
    console.error('Error updating mentee progress:', err);
    return res.status(500).json({ error: err.message });
  }
});

// STUDENT SAVES CURRENT VIDEO & COURSE PROGRESS (Resume from where stopped)
commonRouter.post('/courses/:courseId/progress', optionalAuth, (req: any, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id || req.body.studentId || 'usr-student-1';
    const {
      stoppedAtSeconds = 0,
      progressPercentage = 0,
      currentModule,
      completedModules
    } = req.body;

    const existing: any = db.prepare('SELECT id, progress_percentage FROM mentee_course_enrollments WHERE course_id = ? AND student_id = ?').get(courseId, studentId);
    const now = new Date().toISOString();
    const completedModulesJson = completedModules ? JSON.stringify(completedModules) : null;
    const numericSeconds = Math.max(0, Math.round(Number(stoppedAtSeconds) || 0));
    const numericProgress = Math.max(0, Math.min(100, Math.round(Number(progressPercentage) || 0)));

    if (existing) {
      db.prepare(`
        UPDATE mentee_course_enrollments
        SET stopped_at_seconds = ?,
            progress_percentage = MAX(progress_percentage, ?),
            current_module = COALESCE(?, current_module),
            completed_modules_json = COALESCE(?, completed_modules_json),
            last_active_at = ?
        WHERE id = ?
      `).run(
        numericSeconds,
        numericProgress,
        currentModule || null,
        completedModulesJson,
        now,
        existing.id
      );
    } else {
      const prog: any = db.prepare('SELECT * FROM learning_programs WHERE id = ?').get(courseId);
      const student: any = db.prepare('SELECT * FROM users WHERE id = ?').get(studentId) || {};
      const newId = `mce-${Date.now()}`;
      db.prepare(`
        INSERT INTO mentee_course_enrollments (
          id, course_id, course_title, course_mode, student_id, student_name, student_email,
          student_avatar, department, usn, cgpa, applied_at, statement_of_purpose, permission_status,
          mentor_name, progress_percentage, stopped_at_seconds, completed_modules_json, last_active_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'enrolled', ?, ?, ?, ?, ?)
      `).run(
        newId,
        courseId,
        prog?.title || 'Enrolled Course',
        prog?.mode || 'Live Online',
        studentId,
        student.name || 'Surya Nalla',
        student.email || 'surya@careersync.edu',
        student.avatar || '',
        student.department || 'Computer Science & Engineering',
        '1AP23CS001',
        8.8,
        now,
        'Active Enrollment',
        prog?.mentor_name || 'Faculty Lead',
        numericProgress,
        numericSeconds,
        completedModulesJson,
        now
      );
    }

    return res.json({
      success: true,
      courseId,
      stoppedAtSeconds: numericSeconds,
      progressPercentage: numericProgress
    });
  } catch (err: any) {
    console.error('Error saving course progress:', err);
    return res.status(500).json({ error: 'Failed to save course progress.' });
  }
});

// RECORD PROCTORING FULLSCREEN VIOLATION (3 Strikes Rule)
commonRouter.post('/courses/mentees/:id/record-violation', optionalAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    const { strikeCount, reason } = req.body;
    const record: any = db.prepare('SELECT * FROM mentee_course_enrollments WHERE id = ?').get(id);
    if (!record) {
      return res.status(404).json({ error: 'Mentee enrollment record not found.' });
    }

    const currentStrikes = typeof strikeCount === 'number' ? strikeCount : (record.test_violations_count || 0) + 1;
    const isDisqualified = currentStrikes >= 3 ? 1 : (record.is_disqualified ? 1 : 0);
    const testStatus = isDisqualified ? 'disqualified' : (record.test_status === 'passed' ? 'passed' : 'in_progress');
    const disqualificationReason = isDisqualified
      ? (reason || 'Proctoring Violation: Exited full screen 3 times during assessment.')
      : record.disqualification_reason;

    db.prepare(`
      UPDATE mentee_course_enrollments
      SET test_violations_count = ?,
          is_disqualified = ?,
          test_status = ?,
          disqualification_reason = ?,
          last_active_at = ?
      WHERE id = ?
    `).run(currentStrikes, isDisqualified, testStatus, disqualificationReason, new Date().toISOString(), id);

    return res.json({
      success: true,
      strikeCount: currentStrikes,
      isDisqualified: Boolean(isDisqualified),
      testStatus,
      message: isDisqualified
        ? 'Permanent disqualification registered. Course completion and certificate issuance are locked.'
        : `Proctoring strike ${currentStrikes} of 3 recorded.`
    });
  } catch (err: any) {
    console.error('Error recording proctoring violation:', err);
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// EVENTS
// =======================
commonRouter.get('/events', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    const rows: any[] = db.prepare('SELECT * FROM events').all();

    const regRows: any[] = userId
      ? db.prepare('SELECT event_id FROM event_registrations WHERE user_id = ?').all(userId)
      : [];
    const regSet = new Set(regRows.map(r => r.event_id));

    const events = rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      organizer: r.organizer,
      date: r.date,
      time: r.time,
      location: r.location,
      seatsRemaining: r.seats_remaining,
      speakers: JSON.parse(r.speakers || '[]'),
      description: r.description,
      isRegistered: regSet.has(r.id)
    }));

    return res.json({ events });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.post('/events/:id/register', authenticateToken, (req: any, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const existing: any = db.prepare('SELECT 1 FROM event_registrations WHERE user_id = ? AND event_id = ?').get(userId, eventId);

    if (!existing) {
      db.prepare('INSERT INTO event_registrations VALUES (?, ?, ?)').run(userId, eventId, new Date().toISOString());
      db.prepare('UPDATE events SET seats_remaining = MAX(0, seats_remaining - 1) WHERE id = ?').run(eventId);
    }

    return res.json({ success: true, message: 'Event registration confirmed!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// NOTIFICATIONS (STRICT USER ISOLATION)
// =======================
commonRouter.get('/notifications', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id || 'usr-student-1';
    // STRICT user isolation: only query the current user's notifications
    const rows: any[] = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY rowid DESC').all(userId);

    const notifications = rows.map(r => ({
      id: r.id,
      category: r.category,
      title: r.title,
      message: r.message,
      timestamp: r.timestamp,
      isRead: Boolean(r.is_read),
      actionUrl: r.action_url || undefined
    }));

    return res.json({ notifications });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.patch('/notifications/:id/read', authenticateToken, (req: any, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, userId);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.patch('/notifications/read-all', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    // STRICT user isolation: only mark read for the authentic user
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(userId);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// CONVERSATIONS & CHAT
// =======================
commonRouter.get('/conversations', optionalAuth, (req: any, res) => {
  try {
    const convRows: any[] = db.prepare('SELECT * FROM conversations').all();

    const conversations = convRows.map(c => {
      const msgRows: any[] = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY rowid ASC').all(c.id);

      const messages = msgRows.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        senderAvatar: m.sender_avatar,
        receiverId: m.receiver_id,
        content: m.content,
        timestamp: m.timestamp,
        isRead: Boolean(m.is_read)
      }));

      return {
        id: c.id,
        contactName: c.contact_name,
        contactAvatar: c.contact_avatar,
        contactRole: c.contact_role,
        contactType: c.contact_type,
        lastMessage: c.last_message,
        lastMessageTime: c.last_message_time,
        unreadCount: c.unread_count,
        online: Boolean(c.online),
        messages
      };
    });

    return res.json({ conversations });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.post('/conversations/:id/messages', authenticateToken, (req: any, res) => {
  try {
    const convId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    // Fetch user profile name and avatar from users table
    const userRow: any = db.prepare('SELECT name, avatar FROM users WHERE id = ?').get(userId);
    const userName = userRow?.name || req.user.name || 'User';
    const userAvatar = userRow?.avatar || req.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const msgId = `msg-${Date.now()}`;
    const insertMsg = db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, sender_name, sender_avatar, receiver_id, content, timestamp, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertMsg.run(msgId, convId, userId, userName, userAvatar, 'contact', content.trim(), 'Just now');

    db.prepare(`
      UPDATE conversations
      SET last_message = ?, last_message_time = 'Just now'
      WHERE id = ?
    `).run(content.trim(), convId);

    const message = {
      id: msgId,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      receiverId: 'contact',
      content: content.trim(),
      timestamp: 'Just now',
      isRead: true
    };

    return res.status(201).json({ success: true, message });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// DATABASE STATS & DIAGNOSTICS
// =======================
commonRouter.get('/db/stats', (req, res) => {
  try {
    const stats = getDatabaseStats();
    return res.json({ success: true, stats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.post('/db/seed-school', (req, res) => {
  try {
    const stats = reseedSchoolDatabase();
    return res.json({
      success: true,
      message: 'School database successfully re-seeded with 600+ students, 100+ opportunities, and 1,200+ applications!',
      stats
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.post('/db/restore-demo', (req, res) => {
  try {
    const stats = restoreOriginalDemoDatabase();
    return res.json({
      success: true,
      message: 'Original demo database restored successfully!',
      stats
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// PLACEMENTS & COLLABORATIONS
// =======================
commonRouter.get('/placements', (req, res) => {
  try {
    const rows: any[] = db.prepare('SELECT * FROM placement_drives ORDER BY rowid DESC').all();
    const placements = rows.map(r => ({
      id: r.id,
      company: r.company,
      logo: r.logo,
      role: r.role,
      salaryPackage: r.salary_package,
      eligibleBranches: JSON.parse(r.eligible_branches || '[]'),
      driveDate: r.drive_date,
      status: r.status,
      totalEligible: r.total_eligible,
      applied: r.applied,
      shortlisted: r.shortlisted,
      interviews: r.interviews,
      offers: r.offers,
      joined: r.joined
    }));
    return res.json({ placements });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

commonRouter.get('/collaborations', (req, res) => {
  try {
    const rows: any[] = db.prepare('SELECT * FROM collaboration_initiatives ORDER BY rowid DESC').all();
    const collaborations = rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      partnerOrganization: r.partner_organization,
      logo: r.logo,
      institution: r.institution,
      startDate: r.start_date,
      duration: r.duration,
      status: r.status,
      leadCoordinator: r.lead_coordinator,
      impactMetrics: r.impact_metrics,
      description: r.description
    }));
    return res.json({ collaborations });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
