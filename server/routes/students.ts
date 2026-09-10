import { Router } from 'express';
import { db } from '../db';
import { authenticateToken, optionalAuth } from './auth';

export const studentsRouter = Router();

// GET CURRENT STUDENT PROFILE
studentsRouter.get('/profile', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    let p: any = null;

    if (userId) {
      p = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(userId);

      // If this authenticated student does not have a profile row yet, auto-initialize one for their account
      if (!p && req.user?.role === 'student') {
        const userRow: any = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (userRow) {
          const profId = `prof-${Date.now()}`;
          db.prepare(`
            INSERT INTO student_profiles (
              id, user_id, name, avatar, email, phone, college, degree, department, graduation_year,
              location, bio, cgpa, profile_completion, overall_score, technical_score, soft_score,
              readiness_score, is_verified, career_interests, preferred_job_roles, preferred_industries,
              resume_url, socials
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            profId,
            userId,
            userRow.name,
            userRow.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            userRow.email,
            userRow.phone || '',
            userRow.organization || 'Apex Institute of Technology, Bangalore',
            'Bachelor of Technology (B.Tech)',
            'Computer Science & Engineering',
            2026,
            userRow.location || '',
            '',
            0,
            20,
            0,
            0,
            0,
            0,
            0,
            JSON.stringify([]),
            JSON.stringify([]),
            JSON.stringify([]),
            null,
            JSON.stringify({})
          );
          p = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(userId);
        }
      }
    } else {
      // If purely unauthenticated public visitor, provide the demo profile for viewing
      p = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get('usr-student-1');
    }

    if (!p) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = {
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      email: p.email,
      phone: p.phone,
      college: p.college,
      degree: p.degree,
      department: p.department,
      graduationYear: p.graduation_year,
      location: p.location,
      bio: p.bio,
      cgpa: p.cgpa,
      profileCompletion: p.profile_completion,
      overallSkillScore: p.overall_score,
      technicalSkillScore: p.technical_score,
      softSkillScore: p.soft_score,
      industryReadinessScore: p.readiness_score,
      isVerified: Boolean(p.is_verified),
      careerInterests: JSON.parse(p.career_interests || '[]'),
      preferredJobRoles: JSON.parse(p.preferred_job_roles || '[]'),
      preferredIndustries: JSON.parse(p.preferred_industries || '[]'),
      resumeUrl: p.resume_url,
      socials: JSON.parse(p.socials || '{}')
    };

    return res.json({ profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE STUDENT PROFILE (STRICT AUTH REQUIRED)
studentsRouter.put('/profile', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const { bio, phone, location, cgpa, socials, resumeUrl, profileCompletion, name, avatar } = req.body;

    const existing: any = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(userId);
    if (!existing) {
      return res.status(404).json({ error: 'Profile not found for authenticated user.' });
    }

    db.prepare(`
      UPDATE student_profiles
      SET bio = COALESCE(?, bio),
          phone = COALESCE(?, phone),
          location = COALESCE(?, location),
          cgpa = COALESCE(?, cgpa),
          socials = COALESCE(?, socials),
          resume_url = COALESCE(?, resume_url),
          profile_completion = COALESCE(?, profile_completion),
          name = COALESCE(?, name),
          avatar = COALESCE(?, avatar)
      WHERE user_id = ?
    `).run(
      bio ?? null,
      phone ?? null,
      location ?? null,
      cgpa ?? null,
      socials ? JSON.stringify(socials) : null,
      resumeUrl ?? null,
      profileCompletion ?? null,
      name ?? null,
      avatar ?? null,
      userId
    );

    // Also update the users table name/avatar if provided
    if (name || avatar) {
      db.prepare('UPDATE users SET name = COALESCE(?, name), avatar = COALESCE(?, avatar) WHERE id = ?').run(
        name ?? null,
        avatar ?? null,
        userId
      );
    }

    // Keep candidate search row synchronized if this student is cand-01 / cand-001
    if (userId === 'usr-student-1') {
      db.prepare(`
        UPDATE candidates
        SET name = COALESCE(?, name),
            avatar = COALESCE(?, avatar),
            cgpa = COALESCE(?, cgpa)
        WHERE id = 'cand-01' OR id = 'cand-001'
      `).run(name ?? null, avatar ?? null, cgpa ?? null);
    }

    return res.json({ success: true, message: 'Profile updated successfully!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


// SUBMIT / RETRIEVE SKILL ASSESSMENT SCORES
studentsRouter.get('/assessment', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id || 'usr-student-1';
    const scores: any = db.prepare('SELECT * FROM assessment_scores WHERE user_id = ?').get(userId);

    if (!scores) {
      return res.json({
        assessmentScores: {
          completed: false,
          technical: 0,
          soft: 0,
          overall: 0,
          categoryScores: {}
        }
      });
    }

    return res.json({
      assessmentScores: {
        completed: Boolean(scores.completed),
        technical: scores.technical,
        soft: scores.soft,
        overall: scores.overall,
        categoryScores: JSON.parse(scores.category_scores || '{}')
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

studentsRouter.post('/assessment', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const { technical, soft, overall, categoryScores } = req.body;
    const techScore = Math.max(0, Math.min(100, Math.round(Number(technical) || 0)));
    const softScore = Math.max(0, Math.min(100, Math.round(Number(soft) || 0)));
    const overallScore = Math.max(0, Math.min(100, Math.round(Number(overall) || 0)));

    const existing: any = db.prepare('SELECT user_id FROM assessment_scores WHERE user_id = ?').get(userId);

    if (existing) {
      db.prepare(`
        UPDATE assessment_scores
        SET completed = 1,
            technical = ?,
            soft = ?,
            overall = ?,
            category_scores = ?,
            submitted_at = ?
        WHERE user_id = ?
      `).run(
        techScore,
        softScore,
        overallScore,
        JSON.stringify(categoryScores || {}),
        new Date().toISOString(),
        userId
      );
    } else {
      db.prepare(`
        INSERT INTO assessment_scores (user_id, completed, technical, soft, overall, category_scores, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        1,
        techScore,
        softScore,
        overallScore,
        JSON.stringify(categoryScores || {}),
        new Date().toISOString()
      );
    }

    // Also update student_profiles overall_score
    db.prepare(`
      UPDATE student_profiles
      SET overall_score = ?, technical_score = ?, soft_score = ?, readiness_score = ?
      WHERE user_id = ?
    `).run(overallScore, techScore, softScore, overallScore, userId);

    return res.json({
      success: true,
      message: 'Assessment scores saved and verified on candidate profile!'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// CANDIDATE SEARCH & TALENT SOURCING (FOR INDUSTRY RECRUITERS & FACULTY)
studentsRouter.get('/candidates', optionalAuth, (req: any, res) => {
  try {
    const {
      q,
      search,
      studentId,
      skill,
      department,
      minScore,
      minCgpa,
      degree,
      graduationYear,
      isVerified,
      status,
      sortBy,
      sortOrder
    } = req.query;
    const recruiterId = req.user?.id || 'usr-industry-1';

    let sql = 'SELECT * FROM candidates WHERE 1=1';
    const params: any[] = [];

    if (minScore) {
      const ms = parseInt(minScore as string, 10);
      if (!isNaN(ms)) {
        sql += ' AND skill_score >= ?';
        params.push(ms);
      }
    }

    if (minCgpa) {
      const cg = parseFloat(minCgpa as string);
      if (!isNaN(cg)) {
        sql += ' AND cgpa >= ?';
        params.push(cg);
      }
    }

    if (degree && degree !== 'All') {
      const cleanDegree = degree.split('/')[0].trim();
      sql += ' AND (degree = ? OR degree LIKE ? OR degree LIKE ?)';
      params.push(degree, `%${cleanDegree}%`, `%${degree}%`);
    }

    if (graduationYear && graduationYear !== 'All') {
      const gy = parseInt(graduationYear as string, 10);
      if (!isNaN(gy)) {
        sql += ' AND graduation_year = ?';
        params.push(gy);
      }
    }

    if (isVerified === 'true' || isVerified === '1') {
      sql += ' AND is_verified = 1';
    }

    if (department && department !== 'All') {
      sql += ' AND department = ?';
      params.push(department);
    }

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    const rawSearch = (studentId || q || search || skill || '').toString().trim();
    if (rawSearch) {
      const cleanSearch = rawSearch.replace(/^#/, '').trim();
      sql += ` AND (
        student_id LIKE ? OR
        student_id LIKE ? OR
        id LIKE ? OR
        name LIKE ? OR
        college LIKE ? OR
        department LIKE ? OR
        degree LIKE ? OR
        top_skills LIKE ?
      )`;
      params.push(
        `%${rawSearch}%`,
        `%${cleanSearch}%`,
        `%${rawSearch}%`,
        `%${rawSearch}%`,
        `%${rawSearch}%`,
        `%${rawSearch}%`,
        `%${rawSearch}%`,
        `%${rawSearch}%`
      );
    }

    // Dynamic sorting
    let sortColumn = 'skill_score';
    if (sortBy === 'cgpa') sortColumn = 'cgpa';
    else if (sortBy === 'matchScore' || sortBy === 'match') sortColumn = 'match_score';
    else if (sortBy === 'graduationYear') sortColumn = 'graduation_year';
    else if (sortBy === 'name') sortColumn = 'name';

    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortColumn} ${order}`;

    const rows: any[] = db.prepare(sql).all(...params);

    // Get shortlists for recruiter
    const shortlistedRows: any[] = db.prepare('SELECT candidate_id FROM shortlists WHERE recruiter_id = ?').all(recruiterId);
    const shortlists = shortlistedRows.map(r => r.candidate_id);

    const candidates = rows.map(c => ({
      id: c.id,
      studentId: c.student_id || (c.id ? `#84920${String(c.id).replace(/\D/g, '').padStart(5, '0')}` : '#8492019482'),
      name: c.name,
      avatar: c.avatar,
      college: c.college,
      degree: c.degree,
      department: c.department,
      graduationYear: c.graduation_year,
      location: c.location,
      skillScore: c.skill_score,
      matchScore: c.match_score,
      topSkills: JSON.parse(c.top_skills || '[]'),
      certificationsCount: c.certifications_count,
      internshipExperience: c.internship_experience,
      status: c.status,
      isVerified: Boolean(c.is_verified),
      cgpa: c.cgpa
    }));

    return res.json({ candidates, shortlists, totalCount: candidates.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// TOGGLE CANDIDATE SHORTLIST
studentsRouter.post('/candidates/:id/shortlist', authenticateToken, (req: any, res) => {
  try {
    const candidateId = req.params.id;
    const recruiterId = req.user.id;

    const existing: any = db.prepare('SELECT 1 FROM shortlists WHERE recruiter_id = ? AND candidate_id = ?').get(recruiterId, candidateId);

    if (existing) {
      db.prepare('DELETE FROM shortlists WHERE recruiter_id = ? AND candidate_id = ?').run(recruiterId, candidateId);
      return res.json({ success: true, isShortlisted: false, message: 'Candidate removed from shortlist.' });
    } else {
      db.prepare('INSERT INTO shortlists (recruiter_id, candidate_id, shortlisted_at) VALUES (?, ?, ?)').run(recruiterId, candidateId, new Date().toISOString());
      return res.json({ success: true, isShortlisted: true, message: 'Candidate added to recruiter shortlist.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// PROJECTS
// =======================
studentsRouter.get('/projects', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ projects: [] });
    }
    // STRICT user isolation: only query the current user's projects
    const rows: any[] = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY rowid DESC').all(userId);
    const projects = rows.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      description: r.description,
      technologies: JSON.parse(r.technologies || '[]'),
      githubUrl: r.github_url || undefined,
      demoUrl: r.demo_url || undefined,
      skillsDemonstrated: JSON.parse(r.skills_demonstrated || '[]'),
      completionDate: r.completion_date,
      verified: Boolean(r.verified)
    }));
    return res.json({ projects });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

studentsRouter.post('/projects', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const { title, category, description, technologies, githubUrl, demoUrl } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const techArray = Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((t: string) => t.trim()) : []);
    const id = `proj-${Date.now()}`;
    db.prepare(`
      INSERT INTO projects (id, user_id, title, category, description, technologies, github_url, demo_url, skills_demonstrated, completion_date, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      id,
      userId,
      title,
      category || 'Project',
      description || '',
      JSON.stringify(techArray),
      githubUrl || null,
      demoUrl || null,
      JSON.stringify(techArray),
      new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );

    return res.status(201).json({ success: true, message: 'Project saved to database!', id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// CERTIFICATIONS
// =======================
studentsRouter.get('/certifications', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ certifications: [] });
    }
    // STRICT user isolation: only query the current user's certifications
    const rows: any[] = db.prepare('SELECT * FROM certifications WHERE user_id = ? ORDER BY rowid DESC').all(userId);
    const certifications = rows.map(r => ({
      id: r.id,
      name: r.name,
      provider: r.provider,
      logo: r.logo || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
      issueDate: r.issue_date,
      expiryDate: r.expiry_date || undefined,
      credentialId: r.credential_id,
      verificationStatus: r.verification_status,
      skills: JSON.parse(r.skills || '[]')
    }));
    return res.json({ certifications });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

studentsRouter.patch('/certifications/:id/verify', authenticateToken, (req: any, res) => {
  try {
    const id = req.params.id;
    db.prepare('UPDATE certifications SET verification_status = "Verified" WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Certificate verified!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// INTERNSHIPS
// =======================
studentsRouter.get('/internships', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ internships: [] });
    }
    // STRICT user isolation: only query the current user's internships
    const rows: any[] = db.prepare('SELECT * FROM internships WHERE user_id = ? ORDER BY rowid DESC').all(userId);
    const internships = rows.map(r => ({
      id: r.id,
      company: r.company,
      logo: r.logo || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
      role: r.role,
      startDate: r.start_date,
      endDate: r.end_date,
      mentor: r.mentor,
      mentorDesignation: r.mentor_designation,
      progressPercentage: r.progress_percentage,
      status: r.status,
      tasks: JSON.parse(r.tasks || '[]'),
      feedback: r.feedback || undefined,
      certificateIssued: Boolean(r.certificate_issued)
    }));
    return res.json({ internships });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

