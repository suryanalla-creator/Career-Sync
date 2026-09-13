import { Router } from 'express';
import { db } from '../db';
import { authenticateToken, optionalAuth } from './auth';

export const applicationsRouter = Router();

// GET APPLICATIONS
// GET APPLICATIONS
applicationsRouter.get('/', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    const requestedRole = req.query.role || (req.headers['x-role'] as string);
    const role = requestedRole || req.user?.role || (req.query.opportunityId ? 'industry' : 'student');
    const filterOppId = req.query.opportunityId;

    let rows: any[] = [];
    if (role === 'industry' || filterOppId) {
      // Industry sees applications for their organization or created opportunities
      const userOrg = req.query.organization || req.user?.organization || (userId ? db.prepare('SELECT organization FROM users WHERE id = ?').get(userId)?.organization : null);
      
      let query = `
        SELECT a.*, o.title as opp_title, o.organization as opp_org,
               c.id as cand_id, c.student_id as cand_student_id, c.avatar as cand_avatar,
               c.college as cand_college, c.degree as cand_degree, c.department as cand_department,
               c.graduation_year as cand_grad_year, c.cgpa as cand_cgpa, c.skill_score as cand_skill_score,
               c.match_score as cand_match_score, c.top_skills as cand_top_skills, c.is_verified as cand_verified,
               p.cgpa as prof_cgpa, p.college as prof_college, p.department as prof_department,
               p.degree as prof_degree, p.graduation_year as prof_grad_year, p.overall_score as prof_score,
               p.avatar as prof_avatar
        FROM applications a
        LEFT JOIN opportunities o ON a.opportunity_id = o.id
        LEFT JOIN candidates c ON a.user_id = c.id OR a.student_name = c.name
        LEFT JOIN student_profiles p ON a.user_id = p.user_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filterOppId) {
        query += ' AND a.opportunity_id = ?';
        params.push(filterOppId);
      } else if (userOrg && userOrg !== 'All') {
        query += ' AND (o.organization LIKE ? OR a.company LIKE ? OR o.created_by = ?)';
        params.push(`%${userOrg}%`, `%${userOrg}%`, userId || '');
      }

      query += ' ORDER BY a.rowid DESC';
      rows = db.prepare(query).all(...params);
    } else {
      // Students see strictly their own applications
      const targetUserId = userId || 'usr-student-1';
      rows = db.prepare(`
        SELECT * FROM applications
        WHERE user_id = ?
        ORDER BY rowid DESC
      `).all(targetUserId);
    }

    const applications = rows.map(r => {
      const studentId = r.cand_student_id || (r.user_id && r.user_id.startsWith('cand-') 
        ? `#84920${r.user_id.replace(/\D/g, '').padStart(5, '0')}` 
        : '#8492019482');

      const topSkills = r.cand_top_skills ? JSON.parse(r.cand_top_skills) : ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

      return {
        id: r.id,
        opportunityId: r.opportunity_id,
        title: r.title,
        company: r.company,
        logo: r.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        type: r.type,
        appliedDate: r.applied_date,
        currentStage: r.current_stage,
        stageTimeline: JSON.parse(r.stage_timeline || '[]'),
        notes: r.notes || undefined,
        studentName: r.student_name,
        studentEmail: r.student_email,
        candidateId: r.cand_id || r.user_id || 'cand-01',
        studentId,
        avatar: r.cand_avatar || r.prof_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        college: r.cand_college || r.prof_college || 'Apex Institute of Technology',
        degree: r.cand_degree || r.prof_degree || 'B.Tech',
        department: r.cand_department || r.prof_department || 'Computer Science & Engineering',
        graduationYear: r.cand_grad_year || r.prof_grad_year || 2026,
        cgpa: r.cand_cgpa || r.prof_cgpa || 8.9,
        skillScore: r.cand_skill_score || r.prof_score || 92,
        matchScore: r.cand_match_score || 94,
        topSkills,
        isVerified: Boolean(r.cand_verified !== undefined ? r.cand_verified : 1)
      };
    });

    return res.json({ applications });
  } catch (err: any) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ error: err.message });
  }
});

// SUBMIT NEW APPLICATION (ROBUST AUTH WITH DEMO FALLBACK & STUDENT DETAILS)
applicationsRouter.post('/', optionalAuth, (req: any, res) => {
  try {
    const {
      opportunityId,
      studentName,
      studentEmail,
      studentId,
      college,
      degree,
      department,
      cgpa,
      avatar,
      topSkills,
      skillScore,
      matchScore
    } = req.body;

    const userId = req.user?.id || req.body.userId || 'usr-student-1';

    if (!opportunityId) {
      return res.status(400).json({ error: 'Opportunity ID is required.' });
    }

    const opp: any = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(opportunityId);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found.' });
    }

    // Check if bookings/applications are closed
    if (opp.is_closed || opp.status === 'Closed' || opp.status === 'Archived') {
      return res.status(400).json({
        error: `Applications and bookings for this ${opp.type || 'opportunity'} are currently closed.`,
        isClosed: true,
        closedReason: opp.closed_reason || 'Application intake closed by the employer.'
      });
    }

    // Check if already applied
    const existing: any = db.prepare('SELECT id FROM applications WHERE user_id = ? AND opportunity_id = ?').get(userId, opportunityId);
    if (existing) {
      return res.json({
        success: true,
        message: 'You have already applied for this opportunity.',
        applicationId: existing.id
      });
    }

    // Fetch student's real name and email
    const userRow: any = db.prepare('SELECT name, email, avatar FROM users WHERE id = ?').get(userId);
    const resolvedName = studentName || userRow?.name || req.user?.name || 'Ananya Sharma';
    const resolvedEmail = studentEmail || userRow?.email || req.user?.email || 'ananya.sharma@apextech.edu.in';
    const resolvedAvatar = avatar || userRow?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    const resolvedStudentId = studentId || '#8492019482';
    const resolvedCollege = college || 'Apex Institute of Technology, Bangalore';
    const resolvedDegree = degree || 'Bachelor of Technology (B.Tech)';
    const resolvedDepartment = department || 'Computer Science & Engineering';
    const resolvedCgpa = cgpa ? Number(cgpa) : 8.9;
    const resolvedSkillScore = skillScore ? Number(skillScore) : 92;
    const resolvedMatchScore = matchScore ? Number(matchScore) : (opp.match_percentage || 94);
    const resolvedTopSkills = Array.isArray(topSkills) ? topSkills : ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

    // Check verified certificates in database for this student
    const certCountRow: any = db.prepare(`
      SELECT COUNT(*) as c FROM certifications 
      WHERE user_id = ? AND verification_status = 'Verified'
    `).get(userId);
    const resolvedVerifiedCertsCount = Number(certCountRow?.c || 0);

    // Validate against Industry Benchmark Requirements
    const unmetCriteria: string[] = [];
    if (opp.min_skill_score !== null && opp.min_skill_score !== undefined && resolvedSkillScore < opp.min_skill_score) {
      unmetCriteria.push(`Skill score ${resolvedSkillScore}% is below required benchmark of ${opp.min_skill_score}%`);
    }
    if (opp.min_cgpa !== null && opp.min_cgpa !== undefined && resolvedCgpa < opp.min_cgpa) {
      unmetCriteria.push(`CGPA ${resolvedCgpa.toFixed(1)} is below required benchmark of ${opp.min_cgpa.toFixed(1)}`);
    }
    if (opp.min_match_percentage !== null && opp.min_match_percentage !== undefined && resolvedMatchScore < opp.min_match_percentage) {
      unmetCriteria.push(`Skill match ${resolvedMatchScore}% is below required benchmark of ${opp.min_match_percentage}%`);
    }
    if (opp.min_verified_certs !== null && opp.min_verified_certs !== undefined && opp.min_verified_certs > 0 && resolvedVerifiedCertsCount < opp.min_verified_certs) {
      unmetCriteria.push(`Requires at least ${opp.min_verified_certs} verified certificate(s), but you currently have ${resolvedVerifiedCertsCount}`);
    }

    if (unmetCriteria.length > 0) {
      return res.status(403).json({
        success: false,
        error: 'You do not currently satisfy the minimum industry benchmark requirements to apply for this opening.',
        unmetCriteria,
        benchmarks: {
          minSkillScore: opp.min_skill_score,
          minCgpa: opp.min_cgpa,
          minMatchPercentage: opp.min_match_percentage,
          minVerifiedCerts: opp.min_verified_certs
        }
      });
    }

    const appId = `app-${Date.now()}`;
    const initialTimeline = [
      { stage: 'Applied', date: 'Just now', completed: true, note: 'Application & Resume submitted via 1-Click Apply.' },
      { stage: 'Screening', date: 'Upcoming', completed: false, note: `Candidate matched with ${resolvedMatchScore}% AI score.` },
      { stage: 'Shortlisted', date: 'Upcoming', completed: false },
      { stage: 'Interview', date: 'Upcoming', completed: false },
      { stage: 'Selected', date: 'Upcoming', completed: false }
    ];

    db.prepare(`
      INSERT INTO applications (
        id, opportunity_id, user_id, student_name, student_email, title, company, logo,
        type, applied_date, current_stage, stage_timeline, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      appId,
      opp.id,
      userId,
      resolvedName,
      resolvedEmail,
      opp.title,
      opp.organization,
      opp.logo,
      opp.type === 'internship' ? 'Internship' : 'Job',
      'Just now',
      'Applied',
      JSON.stringify(initialTimeline),
      `Applied with ${resolvedMatchScore}% AI Skill Profile.`
    );

    // Increment applicants_count in opportunities table
    db.prepare('UPDATE opportunities SET applicants_count = applicants_count + 1 WHERE id = ?').run(opp.id);

    // Upsert candidate record so the student shows up in Candidate Search / Talent Pool
    const existingCand: any = db.prepare('SELECT id FROM candidates WHERE id = ? OR name = ?').get(userId, resolvedName);
    if (!existingCand) {
      db.prepare(`
        INSERT INTO candidates (
          id, student_id, name, avatar, college, degree, department, graduation_year,
          location, skill_score, match_score, top_skills, certifications_count,
          internship_experience, status, is_verified, cgpa
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        resolvedStudentId,
        resolvedName,
        resolvedAvatar,
        resolvedCollege,
        resolvedDegree,
        resolvedDepartment,
        2026,
        'Bangalore, India',
        resolvedSkillScore,
        resolvedMatchScore,
        JSON.stringify(resolvedTopSkills),
        3,
        '6 Months SDE Intern',
        'Available',
        1,
        resolvedCgpa
      );
    }

    // Create confirmation notification for this student
    db.prepare(`
      INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-${Date.now()}-std`,
      userId,
      'Applications',
      `Application Sent: ${opp.title}`,
      `Your application to ${opp.organization} has been dispatched. Track interview stages in real-time.`,
      'Just now',
      0,
      'applications'
    );

    // Create incoming applicant notification for the recruiter / industry
    const recruiterUserId = opp.created_by || 'usr-industry-1';
    db.prepare(`
      INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-${Date.now()}-rec`,
      recruiterUserId,
      'Applications',
      `New Applicant: ${opp.title}`,
      `${resolvedName} (${resolvedDepartment}, CGPA ${resolvedCgpa}) just applied for ${opp.title}.`,
      'Just now',
      0,
      'post-job'
    );

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: appId,
      application: {
        id: appId,
        opportunityId: opp.id,
        title: opp.title,
        company: opp.organization,
        logo: opp.logo,
        type: opp.type === 'internship' ? 'Internship' : 'Job',
        appliedDate: 'Just now',
        currentStage: 'Applied',
        studentName: resolvedName,
        studentEmail: resolvedEmail,
        studentId: resolvedStudentId,
        avatar: resolvedAvatar,
        college: resolvedCollege,
        degree: resolvedDegree,
        department: resolvedDepartment,
        graduationYear: 2026,
        cgpa: resolvedCgpa,
        skillScore: resolvedSkillScore,
        matchScore: resolvedMatchScore,
        topSkills: resolvedTopSkills,
        isVerified: true
      }
    });
  } catch (err: any) {
    console.error('Error creating application:', err);
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE APPLICATION STAGE (FOR RECRUITER / INDUSTRY - OPTIONAL AUTH WITH RECRUITER FALLBACK)
applicationsRouter.patch('/:id/stage', optionalAuth, (req: any, res) => {
  try {
    const { stage, note } = req.body;
    const appId = req.params.id;

    if (!stage) {
      return res.status(400).json({ error: 'Stage is required' });
    }

    const app: any = db.prepare('SELECT * FROM applications WHERE id = ?').get(appId);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const timeline = JSON.parse(app.stage_timeline || '[]');
    const stagesOrder = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected'];
    const currentIdx = stagesOrder.indexOf(stage);

    const updatedTimeline = timeline.map((item: any) => {
      const idx = stagesOrder.indexOf(item.stage);
      if (idx !== -1 && idx <= currentIdx) {
        return {
          ...item,
          completed: true,
          date: item.completed ? item.date : 'Today',
          note: item.stage === stage && note ? note : item.note
        };
      }
      return item;
    });

    db.prepare(`
      UPDATE applications
      SET current_stage = ?, stage_timeline = ?
      WHERE id = ?
    `).run(stage, JSON.stringify(updatedTimeline), appId);

    // Notify student
    db.prepare(`
      INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-${Date.now()}`,
      app.user_id,
      'Applications',
      `Application Update: ${app.title}`,
      `Your application status for ${app.company} has been updated to "${stage}".`,
      'Just now',
      0,
      'applications'
    );

    return res.json({
      success: true,
      message: `Application stage updated to ${stage}`,
      timeline: updatedTimeline
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
