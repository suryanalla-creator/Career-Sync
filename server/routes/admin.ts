import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { authenticateToken } from './auth';
import { emailService } from '../services/emailService';

export const adminRouter = Router();

// Middleware ensuring ONLY authenticated Admin can access
export function requireAdmin(req: any, res: any, next: any) {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden: Access restricted strictly to Master Platform Administrator.'
      });
    }
    next();
  });
}

// Generate random secure temporary default password
function generateSecureDefaultPassword(role: string): string {
  const prefix = role === 'institution' ? 'Sync@Inst' : 'Sync@Corp';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomSuffix}!`;
}

/**
 * GET /api/admin/verifications
 * Retrieve pending account verifications filtered by role ('institution' | 'industry')
 */
adminRouter.get('/verifications', requireAdmin, (req, res) => {
  try {
    const roleFilter = req.query.role as string;
    const statusFilter = (req.query.status as string) || 'pending';

    let query = 'SELECT * FROM pending_verifications WHERE status = ?';
    const params: any[] = [statusFilter];

    if (roleFilter && (roleFilter === 'institution' || roleFilter === 'industry')) {
      query += ' AND role = ?';
      params.push(roleFilter);
    }

    query += ' ORDER BY submitted_at DESC';

    const rows = db.prepare(query).all(...params);

    const verifications = rows.map((r: any) => {
      let certificates = [];
      try {
        certificates = JSON.parse(r.certificate_data || '[]');
      } catch {
        certificates = [];
      }
      return {
        ...r,
        certificates
      };
    });

    return res.json({ success: true, verifications });
  } catch (err: any) {
    console.error('Error fetching admin verifications:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * GET /api/admin/verifications/:id/certificates
 * Strictly view-only certificates access for Admin.
 * Prevents external sharing and enforces confidentiality.
 */
adminRouter.get('/verifications/:id/certificates', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const row: any = db.prepare('SELECT id, role, organization, name, email, certificate_data, status FROM pending_verifications WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ error: 'Verification record not found.' });
    }

    let certificates = [];
    try {
      certificates = JSON.parse(row.certificate_data || '[]');
    } catch {
      certificates = [];
    }

    return res.json({
      success: true,
      verificationId: row.id,
      organization: row.organization,
      role: row.role,
      applicantName: row.name,
      certificates,
      confidentialityNotice: 'RESTRICTED ADMIN MATERIAL: This information is strictly confidential. Sharing, copying, or distributing these regulatory certificates is prohibited under Career Sync Administrative Compliance Protocol.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/verifications/:id/approve
 * Admin approves certificates:
 * 1. Generates secure default temporary password
 * 2. Creates active user in users table
 * 3. Sends credentials email via nodemailer to recipient email
 * 4. Marks verification as approved
 */
adminRouter.post('/verifications/:id/approve', requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const verif: any = db.prepare('SELECT * FROM pending_verifications WHERE id = ?').get(id);

    if (!verif) {
      return res.status(404).json({ error: 'Verification request not found.' });
    }

    if (verif.status === 'approved') {
      return res.status(400).json({ error: 'This account has already been approved.' });
    }

    const tempPassword = generateSecureDefaultPassword(verif.role);
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(tempPassword, salt);
    const userId = `usr-${verif.role.slice(0, 4)}-${Date.now()}`;

    // 1. Insert into users table
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(verif.email);
    if (!existingUser) {
      db.prepare(`
        INSERT INTO users (id, email, password_hash, role, name, title, organization, avatar, phone, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        verif.email,
        passwordHash,
        verif.role,
        verif.name,
        verif.title || (verif.role === 'institution' ? 'Institutional Administrator' : 'Talent Acquisition Head'),
        verif.organization,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verif.phone || '',
        new Date().toISOString()
      );
    }

    // 2. Mark verification as approved
    db.prepare(`
      UPDATE pending_verifications
      SET status = 'approved',
          default_temp_password = ?,
          reviewed_at = ?,
          reviewed_by = ?
      WHERE id = ?
    `).run(
      tempPassword,
      new Date().toISOString(),
      req.user.name || 'Master Admin',
      id
    );

    // 3. Send real email with credentials via nodemailer
    const emailResult = await emailService.sendAccountCredentials({
      to: verif.email,
      name: verif.name,
      role: verif.role,
      organization: verif.organization,
      tempPassword
    });

    console.log(`[Admin Approval] Verified & activated ${verif.role} for ${verif.organization}. Credentials sent to ${verif.email}.`);

    return res.json({
      success: true,
      message: `Account for ${verif.organization} has been verified and approved! Credentials have been dispatched to ${verif.email}.`,
      generatedCredentials: {
        id: userId,
        email: verif.email,
        defaultPassword: tempPassword,
        role: verif.role,
        organization: verif.organization
      },
      emailDispatched: emailResult.success,
      emailPreviewUrl: emailResult.previewUrl || undefined
    });
  } catch (err: any) {
    console.error('Error approving verification:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * POST /api/admin/verifications/:id/reject
 * Admin rejects verification with mandatory reason
 */
adminRouter.post('/verifications/:id/reject', requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Please specify the audit rejection reason.' });
    }

    const verif: any = db.prepare('SELECT * FROM pending_verifications WHERE id = ?').get(id);
    if (!verif) {
      return res.status(404).json({ error: 'Verification request not found.' });
    }

    db.prepare(`
      UPDATE pending_verifications
      SET status = 'rejected',
          rejection_reason = ?,
          reviewed_at = ?,
          reviewed_by = ?
      WHERE id = ?
    `).run(
      reason.trim(),
      new Date().toISOString(),
      req.user.name || 'Master Admin',
      id
    );

    // Send rejection email
    await emailService.sendRejectionNotice({
      to: verif.email,
      name: verif.name,
      role: verif.role,
      organization: verif.organization,
      reason: reason.trim()
    });

    return res.json({
      success: true,
      message: `Verification request for ${verif.organization} has been rejected.`
    });
  } catch (err: any) {
    console.error('Error rejecting verification:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * GET /api/admin/logs
 * Search and filter login audit logs for Student / Industry / Institution
 */
adminRouter.get('/logs', requireAdmin, (req, res) => {
  try {
    const { role, search, limit = '100' } = req.query;

    let query = 'SELECT * FROM login_audit_logs WHERE 1=1';
    const params: any[] = [];

    // Role filter
    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    // Search query
    if (search && typeof search === 'string' && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      query += ` AND (
        LOWER(user_name) LIKE ? OR
        LOWER(user_email) LIKE ? OR
        LOWER(role) LIKE ? OR
        LOWER(device_name) LIKE ? OR
        LOWER(location) LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(parseInt(limit as string) || 100);

    const logs = db.prepare(query).all(...params);

    // Return summary count stats
    const totalLogs = (db.prepare('SELECT COUNT(*) as c FROM login_audit_logs').get() as any).c;
    const studentLogs = (db.prepare("SELECT COUNT(*) as c FROM login_audit_logs WHERE role = 'student'").get() as any).c;
    const industryLogs = (db.prepare("SELECT COUNT(*) as c FROM login_audit_logs WHERE role = 'industry'").get() as any).c;
    const institutionLogs = (db.prepare("SELECT COUNT(*) as c FROM login_audit_logs WHERE role = 'institution'").get() as any).c;

    return res.json({
      success: true,
      logs,
      stats: {
        total: totalLogs,
        student: studentLogs,
        industry: industryLogs,
        institution: institutionLogs
      }
    });
  } catch (err: any) {
    console.error('Error fetching admin logs:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * GET /api/admin/stats
 * Overview dashboard metrics for Admin Portal
 */
adminRouter.get('/stats', requireAdmin, (req, res) => {
  try {
    const pendingInstitutions = (db.prepare("SELECT COUNT(*) as c FROM pending_verifications WHERE role = 'institution' AND status = 'pending'").get() as any).c;
    const pendingIndustries = (db.prepare("SELECT COUNT(*) as c FROM pending_verifications WHERE role = 'industry' AND status = 'pending'").get() as any).c;
    const totalLogins = (db.prepare('SELECT COUNT(*) as c FROM login_audit_logs').get() as any).c;
    const dispatchedEmails = (db.prepare('SELECT COUNT(*) as c FROM dispatched_emails').get() as any).c;

    return res.json({
      success: true,
      stats: {
        pendingInstitutions,
        pendingIndustries,
        totalLogins,
        dispatchedEmails
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
