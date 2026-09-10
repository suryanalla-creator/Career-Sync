import { Router } from 'express';
import { db } from '../db';
import { authenticateToken, optionalAuth } from './auth';

export const applicationsRouter = Router();

// GET APPLICATIONS
applicationsRouter.get('/', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role || 'student';

    let rows: any[] = [];
    if (role === 'industry') {
      // Industry sees applications for their organization or created opportunities
      const userOrg = req.user?.organization || (userId ? db.prepare('SELECT organization FROM users WHERE id = ?').get(userId)?.organization : null);
      if (userOrg) {
        rows = db.prepare(`
          SELECT a.*, o.title as opp_title, o.organization as opp_org
          FROM applications a
          LEFT JOIN opportunities o ON a.opportunity_id = o.id
          WHERE o.organization LIKE ? OR a.company LIKE ? OR o.created_by = ?
          ORDER BY a.rowid DESC
        `).all(`%${userOrg}%`, `%${userOrg}%`, userId || '');
      } else {
        rows = db.prepare(`
          SELECT a.*, o.title as opp_title, o.organization as opp_org
          FROM applications a
          LEFT JOIN opportunities o ON a.opportunity_id = o.id
          ORDER BY a.rowid DESC
        `).all();
      }
    } else {
      // Students see strictly their own applications
      const targetUserId = userId || 'usr-student-1';
      rows = db.prepare(`
        SELECT * FROM applications
        WHERE user_id = ?
        ORDER BY rowid DESC
      `).all(targetUserId);
    }

    const applications = rows.map(r => ({
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
      studentEmail: r.student_email
    }));

    return res.json({ applications });
  } catch (err: any) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ error: err.message });
  }
});

// SUBMIT NEW APPLICATION (STRICT AUTH REQUIRED)
applicationsRouter.post('/', authenticateToken, (req: any, res) => {
  try {
    const { opportunityId } = req.body;
    const userId = req.user.id;

    // Fetch student's real name and email from users table to guarantee data integrity
    const userRow: any = db.prepare('SELECT name, email FROM users WHERE id = ?').get(userId);
    const userName = userRow?.name || req.user.name || 'Student';
    const userEmail = userRow?.email || req.user.email || 'student@apextech.edu.in';

    if (!opportunityId) {
      return res.status(400).json({ error: 'Opportunity ID is required.' });
    }

    // Check if already applied
    const existing: any = db.prepare('SELECT id FROM applications WHERE user_id = ? AND opportunity_id = ?').get(userId, opportunityId);
    if (existing) {
      return res.status(409).json({ error: 'You have already applied for this opportunity.' });
    }

    const opp: any = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(opportunityId);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found.' });
    }

    const appId = `app-${Date.now()}`;
    const initialTimeline = [
      { stage: 'Applied', date: 'Just now', completed: true, note: 'Application & Resume submitted via 1-Click Apply.' },
      { stage: 'Screening', date: 'Upcoming', completed: false, note: `Candidate matched with ${opp.match_percentage}% AI score.` },
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
      userName,
      userEmail,
      opp.title,
      opp.organization,
      opp.logo,
      opp.type === 'internship' ? 'Internship' : 'Job',
      'Just now',
      'Applied',
      JSON.stringify(initialTimeline),
      `Applied with ${opp.match_percentage}% AI Skill Profile.`
    );

    // Increment applicants_count in opportunities table
    db.prepare('UPDATE opportunities SET applicants_count = applicants_count + 1 WHERE id = ?').run(opp.id);

    // Create confirmation notification strictly for this student
    db.prepare(`
      INSERT INTO notifications (id, user_id, category, title, message, timestamp, is_read, action_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-${Date.now()}`,
      userId,
      'Applications',
      `Application Sent: ${opp.title}`,
      `Your application to ${opp.organization} has been dispatched. Track interview stages in real-time.`,
      'Just now',
      0,
      'applications'
    );

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: appId
    });
  } catch (err: any) {
    console.error('Error creating application:', err);
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE APPLICATION STAGE (FOR RECRUITER / INDUSTRY)
applicationsRouter.patch('/:id/stage', authenticateToken, (req: any, res) => {
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
