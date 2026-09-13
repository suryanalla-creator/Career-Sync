import { Router } from 'express';
import { db } from '../db';
import { optionalAuth } from './auth';
import { verifyCertificateOnline, TRUSTED_ISSUERS } from '../services/certificateVerifier';

export const certificatesRouter = Router();

/**
 * GET /api/certificates/trusted-issuers
 * Returns list of trusted certificate issuers and supported credential formats
 */
certificatesRouter.get('/trusted-issuers', (req, res) => {
  try {
    const issuers = TRUSTED_ISSUERS.map(i => ({
      name: i.name,
      category: i.category,
      sampleVerificationUrl: i.sampleVerificationUrl || `https://${i.domains[0]}`
    }));
    return res.json({ success: true, issuers });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/certificates/verify
 * Automated backend verification accessing internet directly
 */
certificatesRouter.post('/verify', optionalAuth, async (req: any, res) => {
  try {
    const {
      fileName,
      fileDataUrl,
      mimeType,
      issuer,
      credentialId,
      credentialUrl,
      skillName,
      studentName: providedStudentName
    } = req.body;

    // Resolve student name: from authenticated user profile or request body
    let studentName = providedStudentName || '';
    const userId = req.user?.id;
    if (!studentName && userId) {
      const userRow: any = db.prepare('SELECT name FROM users WHERE id = ?').get(userId);
      if (userRow?.name) {
        studentName = userRow.name;
      }
    }
    if (!studentName) {
      studentName = 'Aarav Patel'; // Default student in workspace demo if not logged in
    }

    // Run direct online verification
    const report = await verifyCertificateOnline({
      fileName,
      fileDataUrl,
      mimeType,
      issuer,
      credentialId,
      credentialUrl,
      skillName,
      studentName
    });

    return res.json({
      success: true,
      report
    });
  } catch (err: any) {
    console.error('Error during certificate verification:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Verification service failed'
    });
  }
});

/**
 * POST /api/certificates/save
 * Persists verified certificate with verification report & audit trail in database
 */
certificatesRouter.post('/save', optionalAuth, (req: any, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || 'usr-student-1';
    const {
      id = `cert-${Date.now()}`,
      name,
      provider,
      logo,
      issueDate = 'Today',
      expiryDate,
      credentialId,
      credentialUrl,
      verificationStatus,
      trustScore = 0,
      skills = [],
      verificationDetails,
      fileName,
      fileDataUrl
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Certificate name is required' });
    }

    // Insert or replace into certifications
    const existing = db.prepare('SELECT id FROM certifications WHERE id = ?').get(id);

    if (existing) {
      db.prepare(`
        UPDATE certifications SET
          name = ?,
          provider = ?,
          logo = ?,
          issue_date = ?,
          expiry_date = ?,
          credential_id = ?,
          verification_status = ?,
          skills = ?
        WHERE id = ?
      `).run(
        name,
        provider || 'Accredited Issuer',
        logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
        issueDate,
        expiryDate || null,
        credentialId || `ID-${Date.now().toString().slice(-6)}`,
        verificationStatus || 'Verified',
        JSON.stringify(skills),
        id
      );
    } else {
      db.prepare(`
        INSERT INTO certifications (
          id, user_id, name, provider, logo, issue_date, expiry_date,
          credential_id, verification_status, skills
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        userId,
        name,
        provider || 'Accredited Issuer',
        logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
        issueDate,
        expiryDate || null,
        credentialId || `ID-${Date.now().toString().slice(-6)}`,
        verificationStatus || 'Verified',
        JSON.stringify(skills)
      );
    }

    // Also store audit log in student_verified_certificates table
    try {
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
        provider || 'Accredited Issuer',
        credentialId || null,
        credentialUrl || null,
        fileName || null,
        fileDataUrl ? (fileDataUrl.length > 500000 ? fileDataUrl.slice(0, 500000) : fileDataUrl) : null,
        trustScore,
        verificationStatus,
        typeof verificationDetails === 'string' ? verificationDetails : JSON.stringify(verificationDetails || {}),
        new Date().toISOString()
      );
    } catch (auditErr) {
      console.warn('Could not record into student_verified_certificates audit table:', auditErr);
    }

    return res.json({
      success: true,
      message: 'Certificate saved with audit verification',
      certificateId: id
    });
  } catch (err: any) {
    console.error('Error saving certificate:', err);
    return res.status(500).json({ error: err.message });
  }
});
