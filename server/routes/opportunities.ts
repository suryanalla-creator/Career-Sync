import { Router } from 'express';
import { db } from '../db';
import { authenticateToken, optionalAuth } from './auth';

export const opportunitiesRouter = Router();

function parseArraySafe(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [String(val)];
  }
}

// GET ALL OPPORTUNITIES
opportunitiesRouter.get('/', optionalAuth, (req: any, res) => {
  try {
    const { type, search, workMode } = req.query;
    const userId = req.user?.id;

    let sql = 'SELECT * FROM opportunities WHERE 1=1';
    const params: any[] = [];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (workMode && workMode !== 'all') {
      sql += ' AND work_mode = ?';
      params.push(workMode);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR organization LIKE ? OR required_skills LIKE ? OR description LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    sql += ' ORDER BY rowid DESC';

    const rows: any[] = db.prepare(sql).all(...params);

    // Get saved IDs for authentic user only
    const savedRows: any[] = userId ? db.prepare('SELECT opportunity_id FROM saved_opportunities WHERE user_id = ?').all(userId) : [];
    const savedSet = new Set(savedRows.map(r => r.opportunity_id));

    // Get applied IDs for authentic user only
    const appliedRows: any[] = userId ? db.prepare('SELECT opportunity_id, current_stage FROM applications WHERE user_id = ?').all(userId) : [];
    const appliedMap = new Map<string, string>();
    appliedRows.forEach(r => appliedMap.set(r.opportunity_id, r.current_stage.toLowerCase()));

    const opportunities = rows.map(r => {
      const isSaved = savedSet.has(r.id);
      const appliedStatus = appliedMap.get(r.id) || null;

      return {
        id: r.id,
        type: r.type,
        title: r.title,
        organization: r.organization,
        logo: r.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        location: r.location,
        workMode: r.work_mode,
        requiredSkills: parseArraySafe(r.required_skills),
        preferredSkills: parseArraySafe(r.preferred_skills),
        salaryOrStipend: r.salary_or_stipend,
        experience: r.experience,
        duration: r.duration,
        deadline: r.deadline,
        matchPercentage: r.match_percentage,
        description: r.description,
        responsibilities: parseArraySafe(r.responsibilities),
        eligibility: r.eligibility,
        applicantsCount: r.applicants_count,
        postedDate: r.posted_date,
        isSaved,
        appliedStatus,
        careerRoleIds: parseArraySafe(r.career_role_ids || r.careerRoleIds),
        targetRoles: parseArraySafe(r.target_roles || r.targetRoles),
        eligibleBranches: parseArraySafe(r.eligible_branches || r.eligibleBranches),
        companyDetails: r.company_details ? JSON.parse(r.company_details) : undefined,
        createdBy: r.created_by,
        status: r.status || (r.is_closed ? 'Closed' : 'Active'),
        isClosed: Boolean(r.is_closed || r.status === 'Closed' || r.status === 'Archived'),
        closedReason: r.closed_reason || null,
        closedAt: r.closed_at || null
      };
    });

    return res.json({ opportunities });
  } catch (err: any) {
    console.error('Error fetching opportunities:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET SINGLE OPPORTUNITY
opportunitiesRouter.get('/:id', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    const r: any = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(req.params.id);
    if (!r) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const saved: any = userId ? db.prepare('SELECT 1 FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?').get(userId, r.id) : null;
    const app: any = userId ? db.prepare('SELECT current_stage FROM applications WHERE user_id = ? AND opportunity_id = ?').get(userId, r.id) : null;

    return res.json({
      opportunity: {
        id: r.id,
        type: r.type,
        title: r.title,
        organization: r.organization,
        logo: r.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        location: r.location,
        workMode: r.work_mode,
        requiredSkills: parseArraySafe(r.required_skills),
        preferredSkills: parseArraySafe(r.preferred_skills),
        salaryOrStipend: r.salary_or_stipend,
        experience: r.experience,
        duration: r.duration,
        deadline: r.deadline,
        matchPercentage: r.match_percentage,
        description: r.description,
        responsibilities: parseArraySafe(r.responsibilities),
        eligibility: r.eligibility,
        applicantsCount: r.applicants_count,
        postedDate: r.posted_date,
        isSaved: Boolean(saved),
        appliedStatus: app ? app.current_stage.toLowerCase() : null,
        careerRoleIds: parseArraySafe(r.career_role_ids || r.careerRoleIds),
        targetRoles: parseArraySafe(r.target_roles || r.targetRoles),
        eligibleBranches: parseArraySafe(r.eligible_branches || r.eligibleBranches),
        companyDetails: r.company_details ? JSON.parse(r.company_details) : undefined,
        createdBy: r.created_by,
        status: r.status || (r.is_closed ? 'Closed' : 'Active'),
        isClosed: Boolean(r.is_closed || r.status === 'Closed' || r.status === 'Archived'),
        closedReason: r.closed_reason || null,
        closedAt: r.closed_at || null
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// CREATE NEW OPPORTUNITY (POST JOB / INTERNSHIP - ROBUST AUTH WITH DEMO FALLBACK)
opportunitiesRouter.post('/', optionalAuth, (req: any, res) => {
  try {
    const {
      type,
      title,
      organization,
      logo,
      location,
      workMode,
      requiredSkills,
      preferredSkills,
      salaryOrStipend,
      experience,
      duration,
      deadline,
      description,
      responsibilities,
      eligibility,
      companyDetails
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    const id = `opp-${Date.now()}`;
    const userId = req.user?.id || 'usr-industry-1';
    const org = organization || req.user?.organization || 'TechNova Solutions';
    const postLogo = logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';

    const insert = db.prepare(`
      INSERT INTO opportunities (
        id, type, title, organization, logo, location, work_mode, required_skills,
        preferred_skills, salary_or_stipend, experience, duration, deadline, match_percentage,
        description, responsibilities, eligibility, applicants_count, posted_date, company_details, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      type,
      title,
      org,
      postLogo,
      location || 'Bangalore / Hybrid',
      workMode || 'Hybrid',
      JSON.stringify(Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map((s: string) => s.trim()) : ['React', 'TypeScript'])),
      JSON.stringify(Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map((s: string) => s.trim()) : [])),
      salaryOrStipend || (type === 'internship' ? '₹30,000 / month' : '₹12,00,000 - ₹16,00,000 / annum'),
      experience || (type === 'job' ? 'Fresher to 1 Year' : null),
      duration || (type === 'internship' ? '6 Months' : null),
      deadline || '2026-11-30',
      Math.floor(Math.random() * 15) + 85, // 85-99% match
      description || 'Exciting opportunity to build real-world software and collaborate across high-impact product teams.',
      JSON.stringify(Array.isArray(responsibilities) ? responsibilities : [
        'Develop core features, APIs, and microservices.',
        'Collaborate with agile cross-functional teams.',
        'Participate in design and code review cycles.'
      ]),
      eligibility || 'Graduating 2026/2027 in engineering or relevant discipline.',
      0,
      'Just now',
      JSON.stringify(companyDetails || { size: '1,000+ employees', industry: 'Software & Technology', rating: 4.7 }),
      userId
    );

    return res.status(201).json({
      success: true,
      message: `${type === 'internship' ? 'Internship' : 'Job'} posted successfully!`,
      id
    });
  } catch (err: any) {
    console.error('Error creating opportunity:', err);
    return res.status(500).json({ error: err.message });
  }
});

// TOGGLE SAVE OPPORTUNITY (WITH OPTIONAL AUTH FALLBACK)
opportunitiesRouter.post('/:id/save', optionalAuth, (req: any, res) => {
  try {
    const oppId = req.params.id;
    const userId = req.user?.id || 'usr-student-1';

    const existing: any = db.prepare('SELECT 1 FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?').get(userId, oppId);

    if (existing) {
      db.prepare('DELETE FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?').run(userId, oppId);
      return res.json({ success: true, isSaved: false, message: 'Opportunity removed from bookmarks.' });
    } else {
      db.prepare('INSERT INTO saved_opportunities (user_id, opportunity_id, saved_at) VALUES (?, ?, ?)').run(userId, oppId, new Date().toISOString());
      return res.json({ success: true, isSaved: true, message: 'Opportunity saved to bookmarks.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE OPPORTUNITY STATUS / CLOSE BOOKINGS / ARCHIVE
opportunitiesRouter.patch('/:id/status', optionalAuth, (req: any, res) => {
  try {
    const oppId = req.params.id;
    const { status, closedReason } = req.body;

    if (!status || !['Active', 'Closed', 'Draft', 'Archived'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (Active, Closed, Draft, Archived)' });
    }

    const isClosed = status === 'Closed' || status === 'Archived' ? 1 : 0;
    const closedAt = isClosed ? new Date().toISOString() : null;

    const opp: any = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(oppId);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    db.prepare(`
      UPDATE opportunities 
      SET status = ?, is_closed = ?, closed_reason = ?, closed_at = ?
      WHERE id = ?
    `).run(status, isClosed, closedReason || null, closedAt, oppId);

    // If closing, dispatch an audit notification
    if (isClosed) {
      try {
        const notifId = `notif-${Date.now()}`;
        db.prepare(`
          INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read)
          VALUES (?, ?, ?, ?, ?, ?, 0)
        `).run(
          notifId,
          'student-user-1',
          'Application',
          `Opportunity Closed: ${opp.title}`,
          `Applications and bookings for "${opp.title}" by ${opp.organization} are now officially closed.`,
          'Just now'
        );
      } catch (ne) {
        console.warn('Could not insert notification for closed opportunity:', ne);
      }
    }

    return res.json({
      success: true,
      message: `Opportunity status successfully updated to "${status}"!`,
      status,
      isClosed: Boolean(isClosed),
      closedReason: closedReason || null
    });
  } catch (err: any) {
    console.error('Error updating opportunity status:', err);
    return res.status(500).json({ error: err.message });
  }
});

