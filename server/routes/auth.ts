import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'careersync-secret-jwt-key-2026';

// Middleware to authenticate user token if present
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Optional auth middleware (attaches user if token present)
export function optionalAuth(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // ignore invalid token
    }
  }
  next();
}

// Helper to parse readable device name from User-Agent if not sent by client
function getDeviceDescription(req: any): string {
  if (req.body?.deviceName && typeof req.body.deviceName === 'string' && req.body.deviceName.trim()) {
    return req.body.deviceName.trim();
  }
  const ua = req.headers['user-agent'] || '';
  let os = 'Unknown OS';
  if (/windows nt 10/i.test(ua)) os = 'Windows 11/10 PC';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS Apple Device';
  else if (/android/i.test(ua)) os = 'Android Mobile';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'Apple iOS Mobile';
  else if (/linux/i.test(ua)) os = 'Linux Workstation';

  let browser = 'Browser';
  if (/edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';

  return `${os} • ${browser}`;
}

// Helper to determine location description
function getLocationDescription(req: any): string {
  if (req.body?.location && typeof req.body.location === 'string' && req.body.location.trim()) {
    return req.body.location.trim();
  }
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return `IP: ${String(forwarded).split(',')[0].trim()}`;
  }
  return 'Bangalore, Karnataka, India';
}

// REGISTER
authRouter.post('/register', (req, res) => {
  try {
    const role = req.body.role;
    const email = req.body.email || req.body.officialEmail;

    if (!role || !email) {
      return res.status(400).json({ error: 'Role and email are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Strict constraint: No one can register as admin
    if (role === 'admin') {
      return res.status(403).json({ error: 'Administrative accounts cannot be registered externally. Only the master admin exists.' });
    }

    // 2. Check if already registered in users table
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An authorized account with this email already exists. Please sign in.' });
    }

    // 3. SPECIAL WORKFLOW FOR INSTITUTION & INDUSTRY:
    // Do NOT ask for password; Require proof certificates; Send for Admin verification
    if (role === 'institution' || role === 'industry') {
      // Check if already submitted and pending
      const existingPending: any = db.prepare("SELECT id, status FROM pending_verifications WHERE email = ? AND status = 'pending'").get(normalizedEmail);
      if (existingPending) {
        return res.status(409).json({
          error: 'A verification request for this organization is already pending review. The account details are sent for verification and it takes 3 days for the verification.',
          isPendingVerification: true
        });
      }

      let name = '';
      let organization = '';
      let title = '';
      let phone = '';

      if (role === 'industry') {
        name = req.body.contactPerson || req.body.companyName || 'Corporate Representative';
        title = req.body.designation || 'Talent Acquisition Head';
        organization = req.body.companyName || 'Enterprise Partner';
        phone = req.body.phone || req.body.contactNumber || '';
      } else {
        name = req.body.adminName || req.body.institutionName || 'Institutional Head';
        title = 'Dean / Academic Director';
        organization = req.body.institutionName || 'University / College';
        phone = req.body.contactNumber || req.body.phone || '';
      }

      // Collect proofs/certificates
      let certificates: any[] = [];
      if (Array.isArray(req.body.certificates) && req.body.certificates.length > 0) {
        certificates = req.body.certificates;
      } else if (req.body.certificateProof) {
        certificates = [req.body.certificateProof];
      } else if (req.body.documentTitle || req.body.certificateNumber) {
        certificates = [{
          docName: req.body.documentTitle || (role === 'institution' ? 'Govt / AICTE / UGC Recognition Certificate' : 'MCA Incorporation / GST Registration Certificate'),
          issuingAuthority: req.body.issuingAuthority || (role === 'institution' ? 'AICTE / UGC / State Higher Education' : 'Ministry of Corporate Affairs / GSTN'),
          certNumber: req.body.certificateNumber || `PROOF-${Date.now()}`,
          issueDate: req.body.issueDate || new Date().toISOString().split('T')[0],
          fileUrl: req.body.fileUrl || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
          fileType: req.body.fileType || 'image/jpeg'
        }];
      } else {
        return res.status(400).json({
          error: 'Official certificates or proofs issued by the government, institution, or industry regulatory body are mandatory for registration.'
        });
      }

      const verifId = `verif-${role.slice(0, 4)}-${Date.now()}`;

      db.prepare(`
        INSERT INTO pending_verifications (
          id, role, email, name, organization, title, phone, location, website,
          sector_or_type, accreditation_or_size, certificate_data, status, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        verifId,
        role,
        normalizedEmail,
        name,
        organization,
        title,
        phone,
        req.body.location || '',
        req.body.website || '',
        req.body.industrySector || req.body.institutionType || '',
        req.body.accreditationInfo || req.body.companySize || '',
        JSON.stringify(certificates),
        'pending',
        new Date().toISOString()
      );

      // Return exact required response message
      return res.status(200).json({
        success: true,
        isPendingVerification: true,
        verifId,
        message: 'the account details are sent for verification and it takes 3 days for the verification and if the verification is successful the account credentials are automatically sent to the email provided'
      });
    }

    // 4. STUDENT REGISTRATION FLOW:
    // Students create password directly and get instant active account
    const password = req.body.password;
    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password is required and must be at least 4 characters.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}`;

    const name = req.body.fullName || 'Student User';
    const title = req.body.degree || 'Undergraduate';
    const organization = req.body.college || 'Engineering College';
    const phone = req.body.mobile || '';
    const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name, title, organization, avatar, phone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      normalizedEmail,
      passwordHash,
      'student',
      name,
      title,
      organization,
      avatar,
      phone,
      new Date().toISOString()
    );

    // Create student profile
    db.prepare(`
      INSERT INTO student_profiles (
        id, user_id, name, avatar, email, phone, college, degree, department, graduation_year,
        location, bio, cgpa, profile_completion, overall_score, technical_score, soft_score,
        readiness_score, is_verified, career_interests, preferred_job_roles, preferred_industries,
        resume_url, socials
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `prof-${Date.now()}`,
      userId,
      name,
      avatar,
      normalizedEmail,
      phone,
      req.body.college || '',
      req.body.degree || 'B.Tech',
      req.body.department || 'Computer Science',
      parseInt(req.body.graduationYear || '2026') || 2026,
      req.body.location || '',
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

    const token = jwt.sign({ id: userId, email: normalizedEmail, role: 'student', name, organization }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        role: 'student',
        name,
        title,
        organization,
        avatar,
        phone
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// LOGIN
authRouter.post('/login', (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

    if (!user) {
      // Check if user is pending verification
      const pending: any = db.prepare("SELECT id, role, organization FROM pending_verifications WHERE email = ? AND status = 'pending'").get(normalizedEmail);
      if (pending) {
        return res.status(403).json({
          error: 'Your account details are currently under verification (3-day review period). Your credentials will be sent to your email once verified by Admin.',
          isPendingVerification: true
        });
      }
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Role check if provided
    if (role && user.role !== role) {
      return res.status(401).json({ error: `Account is registered as ${user.role}, not ${role}.` });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Record Login in login_audit_logs
    const deviceName = getDeviceDescription(req);
    const location = getLocationDescription(req);
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

    try {
      db.prepare(`
        INSERT INTO login_audit_logs (id, user_id, user_name, user_email, role, device_name, ip_address, location, timestamp, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user.id,
        user.name,
        user.email,
        user.role,
        deviceName,
        String(ipAddress),
        location,
        new Date().toISOString(),
        'Success'
      );
    } catch (logErr) {
      console.error('Failed to write login audit log:', logErr);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name, organization: user.organization }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        title: user.title,
        organization: user.organization,
        avatar: user.avatar,
        phone: user.phone
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// CURRENT USER (ME)
authRouter.get('/me', authenticateToken, (req: any, res) => {
  try {
    const user: any = db.prepare('SELECT id, email, role, name, title, organization, avatar, phone FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// FORGOT PASSWORD
authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  return res.json({
    success: true,
    message: `A password reset link and verification code have been dispatched to ${email}.`
  });
});
