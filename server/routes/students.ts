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

    // Map recent applications to attach applied job details
    const applicationsList: any[] = db.prepare('SELECT opportunity_id, user_id, student_name, title, company, applied_date, current_stage FROM applications ORDER BY rowid DESC').all();
    const appliedMap = new Map<string, any>();
    applicationsList.forEach(a => {
      if (a.user_id && !appliedMap.has(a.user_id)) appliedMap.set(a.user_id, a);
      if (a.student_name && !appliedMap.has(a.student_name.toLowerCase())) appliedMap.set(a.student_name.toLowerCase(), a);
    });

    const onlyApplicants = req.query.onlyApplicants === 'true' || req.query.hasApplied === 'true';

    let candidates = rows.map(c => {
      const app = appliedMap.get(c.id) || (c.name ? appliedMap.get(c.name.toLowerCase()) : null);
      return {
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
        cgpa: c.cgpa,
        appliedJobTitle: app?.title || undefined,
        appliedCompany: app?.company || undefined,
        appliedDate: app?.applied_date || undefined,
        appliedStage: app?.current_stage || undefined,
        appliedOpportunityId: app?.opportunity_id || undefined,
        hasApplied: Boolean(app)
      };
    });

    if (onlyApplicants) {
      candidates = candidates.filter(c => c.hasApplied);
    }

    return res.json({
      candidates,
      shortlists,
      totalCount: candidates.length,
      totalApplicantsCount: candidates.filter(c => c.hasApplied).length
    });
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

// GET CANDIDATE FULL PROFILE & DIGITAL PORTFOLIO (READ-ONLY FOR RECRUITERS & INDUSTRY)
studentsRouter.get('/candidates/:id/details', optionalAuth, (req: any, res) => {
  try {
    const candId = req.params.id;
    const recruiterId = req.user?.id || 'usr-industry-1';

    // 1. Fetch Candidate or Student Profile
    const candRow: any = db.prepare('SELECT * FROM candidates WHERE id = ? OR student_id = ?').get(candId, candId);
    let profRow: any = null;
    if (candId === 'cand-01' || candId === 'cand-001' || candId === 'usr-student-1') {
      profRow = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get('usr-student-1');
    }

    if (!candRow && !profRow) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    const name = profRow?.name || candRow?.name || 'Student Candidate';
    const avatar = profRow?.avatar || candRow?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    const college = profRow?.college || candRow?.college || 'Apex Institute of Technology, Bangalore';
    const degree = profRow?.degree || candRow?.degree || 'Bachelor of Technology (B.Tech)';
    const department = profRow?.department || candRow?.department || 'Computer Science & Engineering';
    const graduationYear = profRow?.graduation_year || candRow?.graduation_year || 2026;
    const cgpa = profRow?.cgpa || candRow?.cgpa || 8.92;
    const skillScore = profRow?.overall_score || candRow?.skill_score || 92;
    const matchScore = candRow?.match_score || skillScore || 94;
    const isVerified = Boolean(profRow ? profRow.is_verified : candRow?.is_verified);
    const studentId = candRow?.student_id || (candId ? `#84920${String(candId).replace(/\D/g, '').padStart(5, '0')}` : '#8492019482');

    const topSkills = candRow?.top_skills ? JSON.parse(candRow.top_skills) : ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'FastAPI'];

    // Check shortlist status
    const isShortlisted = Boolean(db.prepare('SELECT 1 FROM shortlists WHERE recruiter_id = ? AND candidate_id = ?').get(recruiterId, candId));

    // Profile Data (Tab 1)
    const profile = {
      id: candId,
      studentId,
      name,
      avatar,
      email: profRow?.email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@apextech.edu.in`,
      phone: profRow?.phone || '+91 98450 12893',
      college,
      degree,
      department,
      graduationYear,
      location: profRow?.location || candRow?.location || 'Bangalore, India',
      bio: profRow?.bio || `Aspiring ${department} graduate engineer specializing in modern full-stack development, distributed architecture, and cloud systems. Proven track record in hackathons and academic research projects.`,
      cgpa,
      profileCompletion: profRow?.profile_completion || 95,
      overallSkillScore: skillScore,
      technicalSkillScore: profRow?.technical_score || (skillScore + 2 > 100 ? 100 : skillScore + 2),
      softSkillScore: profRow?.soft_score || (skillScore - 4 < 0 ? 75 : skillScore - 4),
      industryReadinessScore: profRow?.readiness_score || skillScore,
      isVerified,
      isShortlisted,
      matchScore,
      careerInterests: profRow?.career_interests ? JSON.parse(profRow.career_interests) : ['Full Stack Development', 'Cloud Architecture', 'Distributed Systems', 'Applied AI'],
      preferredJobRoles: profRow?.preferred_job_roles ? JSON.parse(profRow.preferred_job_roles) : ['Software Development Engineer', 'Full Stack Developer', 'Cloud Engineer'],
      preferredIndustries: profRow?.preferred_industries ? JSON.parse(profRow.preferred_industries) : ['Enterprise SaaS', 'Fintech', 'Artificial Intelligence'],
      socials: profRow?.socials ? JSON.parse(profRow.socials) : {
        github: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}-dev`,
        linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(/[^a-z]/g, '')}`,
        portfolio: `https://${name.toLowerCase().replace(/[^a-z]/g, '')}.dev`
      }
    };

    // Digital Portfolio Data (Tab 2)
    // 1. Projects
    let projects: any[] = [];
    if (profRow) {
      projects = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY rowid DESC').all('usr-student-1').map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        technologies: JSON.parse(r.technologies || '[]'),
        githubUrl: r.github_url,
        demoUrl: r.demo_url,
        skillsDemonstrated: JSON.parse(r.skills_demonstrated || '[]'),
        completionDate: r.completion_date,
        verified: Boolean(r.verified)
      }));
    }
    if (projects.length === 0) {
      projects = [
        {
          id: `proj-${candId}-1`,
          title: 'Distributed Cloud Analytics & Telemetry Dashboard',
          category: 'Capstone',
          description: 'High-throughput real-time telemetry processing pipeline capable of ingesting 25k events/sec with Sub-second latency and automated anomaly detection.',
          technologies: [topSkills[0] || 'React', topSkills[1] || 'TypeScript', topSkills[2] || 'Node.js', 'PostgreSQL', 'Docker'],
          githubUrl: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}/cloud-telemetry-engine`,
          demoUrl: `https://telemetry-demo.${name.toLowerCase().replace(/[^a-z]/g, '')}.dev`,
          skillsDemonstrated: [topSkills[0] || 'React', topSkills[1] || 'TypeScript', 'System Design', 'Microservices'],
          completionDate: 'May 2026',
          verified: true
        },
        {
          id: `proj-${candId}-2`,
          title: 'AI-Powered Automated Code Reviewer & Security Auditing Bot',
          category: 'Hackathon',
          description: 'Autonomous GitHub Action tool that performs AST analysis and semantic diff reviews, flagging security vulnerabilities and cyclomatic complexity bottlenecks.',
          technologies: [topSkills[2] || 'Python', 'FastAPI', 'OpenAI API', 'GitHub Actions', 'PostgreSQL'],
          githubUrl: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}/audit-bot`,
          demoUrl: `https://audit-bot.${name.toLowerCase().replace(/[^a-z]/g, '')}.dev`,
          skillsDemonstrated: ['Python', 'AST Analysis', 'CI/CD Pipelines', 'API Security'],
          completionDate: 'Jan 2026',
          verified: true
        }
      ];
    }

    // 2. Certifications
    let certifications: any[] = [];
    if (profRow) {
      certifications = db.prepare('SELECT * FROM certifications WHERE user_id = ? ORDER BY rowid DESC').all('usr-student-1').map((r: any) => ({
        id: r.id,
        name: r.name,
        provider: r.provider,
        logo: r.logo || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
        issueDate: r.issue_date,
        expiryDate: r.expiry_date,
        credentialId: r.credential_id,
        verificationStatus: r.verification_status,
        skills: JSON.parse(r.skills || '[]')
      }));
    }
    if (certifications.length === 0) {
      certifications = [
        {
          id: `cert-${candId}-1`,
          name: 'AWS Certified Solutions Architect - Associate',
          provider: 'Amazon Web Services (AWS)',
          logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
          issueDate: 'Jan 2026',
          expiryDate: 'Jan 2029',
          credentialId: `AWS-ARCH-${candId.toUpperCase()}-9481`,
          verificationStatus: 'Verified',
          skills: ['AWS VPC', 'EC2', 'S3', 'Serverless', 'IAM']
        },
        {
          id: `cert-${candId}-2`,
          name: 'Meta Certified Professional Frontend Developer',
          provider: 'Meta & Coursera',
          logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          issueDate: 'Aug 2025',
          expiryDate: 'Lifetime',
          credentialId: `META-FE-${candId.toUpperCase()}-3821`,
          verificationStatus: 'Verified',
          skills: ['React', 'TypeScript', 'State Management', 'Web Accessibility']
        }
      ];
    }

    // 3. Internships
    let internships: any[] = [];
    if (profRow) {
      internships = db.prepare('SELECT * FROM internships WHERE user_id = ? ORDER BY rowid DESC').all('usr-student-1').map((r: any) => ({
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
        feedback: r.feedback,
        certificateIssued: Boolean(r.certificate_issued)
      }));
    }
    if (internships.length === 0) {
      internships = [
        {
          id: `intern-${candId}-1`,
          company: candRow?.internship_experience ? candRow.internship_experience.split('@')[1]?.trim() || 'TechNova Solutions' : 'TechNova Solutions',
          logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          role: 'Full Stack Engineering Intern',
          startDate: 'May 2025',
          endDate: 'Nov 2025',
          mentor: 'Vikram Seth',
          mentorDesignation: 'Staff Engineering Lead',
          progressPercentage: 100,
          status: 'Completed',
          tasks: [
            { id: '1', title: 'Implemented authenticated GraphQL APIs and schema validation', done: true },
            { id: '2', title: 'Migrated legacy client widgets to React 18 concurrent features', done: true },
            { id: '3', title: 'Authored end-to-end integration test suites with Playwright', done: true }
          ],
          feedback: 'Exceptional problem solver with high software craftsmanship. Contributed directly to production code releases with zero regressions.',
          certificateIssued: true
        }
      ];
    }

    // 4. Verified Skills
    const verifiedSkills = topSkills.map((sk: string, idx: number) => ({
      id: `sk-${idx}`,
      name: sk,
      category: idx % 2 === 0 ? 'Core Technical' : 'Framework & Architecture',
      score: Math.max(82, 96 - idx * 3),
      level: (idx === 0 ? 'Expert' : idx < 3 ? 'Advanced' : 'Intermediate') as any,
      verified: true,
      credentialId: `SK-VER-${idx + 100}`
    }));

    return res.json({
      profile,
      digitalPortfolio: {
        projects,
        certifications,
        internships,
        verifiedSkills
      }
    });
  } catch (err: any) {
    console.error('Error fetching candidate details:', err);
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
    const userId = req.user?.id || (req.query?.userId as string) || 'usr-student-1';
    if (!userId) {
      return res.json({ certifications: [] });
    }

    // Ensure audit table exists
    db.prepare(`
      CREATE TABLE IF NOT EXISTS student_verified_certificates (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        skill_name TEXT,
        certificate_title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        credential_id TEXT,
        credential_url TEXT,
        file_name TEXT,
        file_data_url TEXT,
        trust_score INTEGER NOT NULL,
        verification_status TEXT NOT NULL,
        verification_details TEXT,
        verified_at TEXT NOT NULL
      )
    `).run();

    // Query certifications for current user, guest ID, or mock student ID
    const rawRows: any[] = db.prepare(`
      SELECT * FROM certifications 
      WHERE user_id = ? OR user_id = 'usr-student-1' OR user_id = '#8492019482'
      ORDER BY rowid DESC
    `).all(userId);

    // Deduplicate by certificate name
    const seenNames = new Set<string>();
    const rows: any[] = [];
    for (const r of rawRows) {
      if (!seenNames.has(r.name)) {
        seenNames.add(r.name);
        rows.push(r);
      }
    }

    // Fetch audit records if present
    const auditRows: any[] = db.prepare(`
      SELECT * FROM student_verified_certificates 
      WHERE user_id = ? OR user_id = 'usr-student-1' OR user_id = '#8492019482'
    `).all(userId);
    const auditMap = new Map<string, any>();
    auditRows.forEach(a => auditMap.set(a.id, a));

    const certifications = rows.map(r => {
      const audit = auditMap.get(r.id);
      let parsedDetails = undefined;
      try {
        if (audit?.verification_details) {
          parsedDetails = JSON.parse(audit.verification_details);
        }
      } catch {}

      return {
        id: r.id,
        name: r.name,
        provider: r.provider,
        logo: r.logo || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
        issueDate: r.issue_date,
        expiryDate: r.expiry_date || undefined,
        credentialId: r.credential_id,
        credentialUrl: audit?.credential_url || undefined,
        verificationStatus: audit?.verification_status || r.verification_status || 'Verified',
        trustScore: audit?.trust_score ?? (r.verification_status === 'Verified' ? 95 : 75),
        verificationDetails: parsedDetails,
        skills: JSON.parse(r.skills || '[]')
      };
    });

    return res.json({ certifications });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

studentsRouter.post('/certifications', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || 'usr-student-1';
    const {
      id = `cert-${Date.now()}`,
      name,
      provider = 'Accredited Issuer',
      logo,
      issueDate = 'Today',
      expiryDate,
      credentialId = `CERT-${Date.now().toString().slice(-6)}`,
      credentialUrl,
      verificationStatus = 'Verified',
      trustScore = 90,
      skills = [],
      verificationDetails
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Certificate name is required' });
    }

    db.prepare(`
      INSERT OR REPLACE INTO certifications (
        id, user_id, name, provider, logo, issue_date, expiry_date,
        credential_id, verification_status, skills
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      name,
      provider,
      logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      issueDate,
      expiryDate || null,
      credentialId,
      verificationStatus,
      JSON.stringify(skills)
    );

    if (verificationDetails) {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS student_verified_certificates (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          skill_name TEXT,
          certificate_title TEXT NOT NULL,
          issuer TEXT NOT NULL,
          credential_id TEXT,
          credential_url TEXT,
          file_name TEXT,
          file_data_url TEXT,
          trust_score INTEGER NOT NULL,
          verification_status TEXT NOT NULL,
          verification_details TEXT,
          verified_at TEXT NOT NULL
        )
      `).run();

      db.prepare(`
        INSERT OR REPLACE INTO student_verified_certificates (
          id, user_id, skill_name, certificate_title, issuer, credential_id,
          credential_url, file_name, file_data_url, trust_score,
          verification_status, verification_details, verified_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        userId,
        skills[0] || name,
        name,
        provider,
        credentialId,
        credentialUrl || null,
        null,
        null,
        trustScore,
        verificationStatus,
        typeof verificationDetails === 'string' ? verificationDetails : JSON.stringify(verificationDetails),
        new Date().toISOString()
      );
    }

    return res.json({ success: true, certificateId: id });
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

