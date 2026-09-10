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

    const programs = rows.map(r => ({
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
      isEnrolled: enrolledSet.has(r.id)
    }));

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
      stipendOrCost
    } = req.body;

    if (!title || !category || !duration) {
      return res.status(400).json({ error: 'Title, category, and duration are required.' });
    }

    const progId = `lp-${Date.now()}`;
    const userOrg = req.user?.organization || provider || 'TechNova Corporate Academy';
    const userLogo = req.user?.avatar || logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';

    const safeSkills = Array.isArray(skillsGained) ? skillsGained : (typeof skillsGained === 'string' ? skillsGained.split(',').map(s => s.trim()).filter(Boolean) : []);
    const safeRequirements = Array.isArray(requirements) ? requirements : (typeof requirements === 'string' ? requirements.split('\n').map(s => s.trim()).filter(Boolean) : []);
    const safeBranches = Array.isArray(eligibleBranches) ? eligibleBranches : ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'];

    db.prepare(`
      INSERT INTO learning_programs (
        id, title, category, provider, logo, duration, level, skills_gained,
        has_certification, rating, enrolled_count, deadline, description, mode,
        eligible_branches, career_role_ids, target_roles, requirements, prerequisites,
        max_seats, created_by, status, hiring_advantage, stipend_or_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      progId,
      title,
      category || 'Bootcamp',
      userOrg,
      userLogo,
      duration,
      level || 'Intermediate',
      JSON.stringify(safeSkills),
      hasCertification !== false ? 1 : 0,
      4.9,
      0,
      deadline || 'Open Enrolment',
      description || 'Comprehensive industry training curriculum and hands-on capstone sprint.',
      mode || 'Live Online',
      JSON.stringify(safeBranches),
      JSON.stringify(careerRoleIds || []),
      JSON.stringify(targetRoles || []),
      JSON.stringify(safeRequirements),
      prerequisites || 'Basic programming fundamentals and curiosity to build.',
      maxSeats ? parseInt(String(maxSeats), 10) : 100,
      req.user?.id || 'usr-industry-1',
      status || 'Live & Accepting',
      hiringAdvantage || 'Top 10% performers receive direct interview shortlist for campus placement',
      stipendOrCost || 'Free Sponsored Access'
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
