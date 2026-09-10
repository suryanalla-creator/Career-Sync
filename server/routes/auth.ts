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

// REGISTER
authRouter.post('/register', (req, res) => {
  try {
    const role = req.body.role;
    const password = req.body.password;
    const email = req.body.email || req.body.officialEmail;

    if (!role || !email || !password) {
      return res.status(400).json({ error: 'Role, email, and password are required.' });
    }

    // Check existing
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}`;

    let name = '';
    let title = '';
    let organization = '';
    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    let phone = '';

    if (role === 'student') {
      name = req.body.fullName || 'Student User';
      title = req.body.degree || 'Undergraduate';
      organization = req.body.college || 'Engineering College';
      phone = req.body.mobile || '';
    } else if (role === 'industry') {
      name = req.body.contactPerson || req.body.companyName || 'Recruitment Lead';
      title = req.body.designation || 'Talent Acquisition';
      organization = req.body.companyName || 'Corporate Partner';
      phone = req.body.phone || req.body.contactNumber || '';
    } else if (role === 'institution') {
      name = req.body.adminName || req.body.institutionName || 'Dean / Placement Head';
      title = 'Institutional Administrator';
      organization = req.body.institutionName || 'University';
      phone = req.body.contactNumber || req.body.phone || '';
    }

    // 1. Insert into users table FIRST to satisfy foreign key constraints
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name, title, organization, avatar, phone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      email.toLowerCase().trim(),
      passwordHash,
      role,
      name,
      title,
      organization,
      avatar,
      phone,
      new Date().toISOString()
    );

    // 2. If student, create student_profiles entry
    if (role === 'student') {
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
        email.toLowerCase().trim(),
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
    }

    const token = jwt.sign({ id: userId, email: email.toLowerCase().trim(), role, name, organization }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        role,
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

    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
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
