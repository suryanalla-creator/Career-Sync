import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { seedSchoolDatabase } from './seedSchoolData';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'careersync.db');
export const db = new DatabaseSync(DB_PATH);

// Enable performance PRAGMAs & WAL mode for high concurrency
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA cache_size = -64000;
  PRAGMA temp_store = MEMORY;
`);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT,
      organization TEXT,
      avatar TEXT,
      phone TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      college TEXT,
      degree TEXT,
      department TEXT,
      graduation_year INTEGER,
      location TEXT,
      bio TEXT,
      cgpa REAL,
      profile_completion INTEGER,
      overall_score INTEGER,
      technical_score INTEGER,
      soft_score INTEGER,
      readiness_score INTEGER,
      is_verified INTEGER,
      career_interests TEXT,
      preferred_job_roles TEXT,
      preferred_industries TEXT,
      resume_url TEXT,
      socials TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      logo TEXT,
      location TEXT NOT NULL,
      work_mode TEXT NOT NULL,
      required_skills TEXT NOT NULL,
      preferred_skills TEXT,
      salary_or_stipend TEXT NOT NULL,
      experience TEXT,
      duration TEXT,
      deadline TEXT NOT NULL,
      match_percentage INTEGER DEFAULT 85,
      description TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      applicants_count INTEGER DEFAULT 0,
      posted_date TEXT NOT NULL,
      company_details TEXT,
      created_by TEXT,
      career_role_ids TEXT,
      target_roles TEXT,
      eligible_branches TEXT,
      min_skill_score INTEGER DEFAULT 70,
      min_cgpa REAL DEFAULT 7.0,
      min_match_percentage INTEGER DEFAULT 60,
      min_verified_certs INTEGER DEFAULT 0,
      benchmark_notes TEXT
    );

    CREATE TABLE IF NOT EXISTS saved_opportunities (
      user_id TEXT NOT NULL,
      opportunity_id TEXT NOT NULL,
      saved_at TEXT NOT NULL,
      PRIMARY KEY (user_id, opportunity_id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      opportunity_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      logo TEXT,
      type TEXT NOT NULL,
      applied_date TEXT NOT NULL,
      current_stage TEXT NOT NULL,
      stage_timeline TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      name TEXT NOT NULL,
      avatar TEXT,
      college TEXT NOT NULL,
      degree TEXT NOT NULL,
      department TEXT NOT NULL,
      graduation_year INTEGER NOT NULL,
      location TEXT NOT NULL,
      skill_score INTEGER NOT NULL,
      match_score INTEGER NOT NULL,
      top_skills TEXT NOT NULL,
      certifications_count INTEGER NOT NULL,
      internship_experience TEXT NOT NULL,
      status TEXT NOT NULL,
      is_verified INTEGER NOT NULL,
      cgpa REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shortlists (
      recruiter_id TEXT NOT NULL,
      candidate_id TEXT NOT NULL,
      shortlisted_at TEXT NOT NULL,
      PRIMARY KEY (recruiter_id, candidate_id)
    );

    CREATE TABLE IF NOT EXISTS learning_programs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      provider TEXT NOT NULL,
      logo TEXT,
      duration TEXT NOT NULL,
      level TEXT NOT NULL,
      skills_gained TEXT NOT NULL,
      has_certification INTEGER NOT NULL,
      rating REAL NOT NULL,
      enrolled_count INTEGER NOT NULL,
      deadline TEXT,
      description TEXT NOT NULL,
      mode TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS program_enrollments (
      user_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      enrolled_at TEXT NOT NULL,
      PRIMARY KEY (user_id, program_id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      organizer TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      seats_remaining INTEGER NOT NULL,
      speakers TEXT,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      user_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      registered_at TEXT NOT NULL,
      PRIMARY KEY (user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      action_url TEXT
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      contact_name TEXT NOT NULL,
      contact_avatar TEXT NOT NULL,
      contact_role TEXT NOT NULL,
      contact_type TEXT NOT NULL,
      last_message TEXT,
      last_message_time TEXT,
      unread_count INTEGER DEFAULT 0,
      online INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_avatar TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      is_read INTEGER DEFAULT 1,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessment_scores (
      user_id TEXT PRIMARY KEY,
      completed INTEGER DEFAULT 1,
      technical INTEGER NOT NULL,
      soft INTEGER NOT NULL,
      overall INTEGER NOT NULL,
      category_scores TEXT NOT NULL,
      submitted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL,
      github_url TEXT,
      demo_url TEXT,
      skills_demonstrated TEXT,
      completion_date TEXT,
      verified INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      provider TEXT NOT NULL,
      logo TEXT,
      issue_date TEXT NOT NULL,
      expiry_date TEXT,
      credential_id TEXT NOT NULL,
      verification_status TEXT NOT NULL,
      skills TEXT
    );

    CREATE TABLE IF NOT EXISTS internships (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      company TEXT NOT NULL,
      logo TEXT,
      role TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      mentor TEXT,
      mentor_designation TEXT,
      progress_percentage INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      tasks TEXT,
      feedback TEXT,
      certificate_issued INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS placement_drives (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      logo TEXT,
      role TEXT NOT NULL,
      salary_package TEXT NOT NULL,
      eligible_branches TEXT NOT NULL,
      drive_date TEXT NOT NULL,
      status TEXT NOT NULL,
      total_eligible INTEGER NOT NULL,
      applied INTEGER NOT NULL,
      shortlisted INTEGER NOT NULL,
      interviews INTEGER NOT NULL,
      offers INTEGER NOT NULL,
      joined INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS collaboration_initiatives (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      partner_organization TEXT NOT NULL,
      logo TEXT,
      institution TEXT NOT NULL,
      start_date TEXT NOT NULL,
      duration TEXT NOT NULL,
      status TEXT NOT NULL,
      lead_coordinator TEXT NOT NULL,
      impact_metrics TEXT,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mentee_course_enrollments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      course_title TEXT NOT NULL,
      course_mode TEXT NOT NULL,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      student_avatar TEXT,
      department TEXT NOT NULL,
      usn TEXT,
      cgpa REAL,
      applied_at TEXT NOT NULL,
      statement_of_purpose TEXT,
      permission_status TEXT NOT NULL DEFAULT 'pending',
      permission_decided_at TEXT,
      mentor_id TEXT,
      mentor_name TEXT,
      started_at TEXT,
      progress_percentage INTEGER DEFAULT 0,
      current_module TEXT,
      completed_assignments INTEGER DEFAULT 0,
      total_assignments INTEGER DEFAULT 5,
      assessment_score REAL,
      last_active_at TEXT,
      mentor_notes TEXT,
      is_certified INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_mentee_course_course_id ON mentee_course_enrollments(course_id);
    CREATE INDEX IF NOT EXISTS idx_mentee_course_student_id ON mentee_course_enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_mentee_course_status ON mentee_course_enrollments(permission_status);

    -- ==========================================
    -- HIGH-PERFORMANCE INSTITUTIONAL INDEXES
    -- ==========================================
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_student_profiles_dept ON student_profiles(department);
    CREATE INDEX IF NOT EXISTS idx_student_profiles_grad_year ON student_profiles(graduation_year);
    CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
    CREATE INDEX IF NOT EXISTS idx_opportunities_work_mode ON opportunities(work_mode);
    CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
    CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON applications(opportunity_id);
    CREATE INDEX IF NOT EXISTS idx_applications_stage ON applications(current_stage);
    CREATE INDEX IF NOT EXISTS idx_candidates_dept ON candidates(department);
    CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(skill_score);
    CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
    CREATE INDEX IF NOT EXISTS idx_learning_programs_category ON learning_programs(category);
    CREATE INDEX IF NOT EXISTS idx_program_enrollments_user ON program_enrollments(user_id);
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    CREATE INDEX IF NOT EXISTS idx_event_reg_user ON event_registrations(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_certifications_user ON certifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_internships_user ON internships(user_id);
    CREATE INDEX IF NOT EXISTS idx_placement_drives_status ON placement_drives(status);

    -- ==========================================
    -- ADMIN VERIFICATION & AUDIT TABLES
    -- ==========================================
    CREATE TABLE IF NOT EXISTS pending_verifications (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      organization TEXT NOT NULL,
      title TEXT,
      phone TEXT,
      location TEXT,
      website TEXT,
      sector_or_type TEXT,
      accreditation_or_size TEXT,
      certificate_data TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      rejection_reason TEXT,
      default_temp_password TEXT,
      submitted_at TEXT NOT NULL,
      reviewed_at TEXT,
      reviewed_by TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_pending_verifications_role ON pending_verifications(role);
    CREATE INDEX IF NOT EXISTS idx_pending_verifications_status ON pending_verifications(status);

    CREATE TABLE IF NOT EXISTS login_audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      role TEXT NOT NULL,
      device_name TEXT NOT NULL,
      ip_address TEXT,
      location TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT DEFAULT 'Success'
    );
    CREATE INDEX IF NOT EXISTS idx_login_audit_logs_role ON login_audit_logs(role);
    CREATE INDEX IF NOT EXISTS idx_login_audit_logs_timestamp ON login_audit_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_login_audit_logs_user_email ON login_audit_logs(user_email);

    CREATE TABLE IF NOT EXISTS dispatched_emails (
      id TEXT PRIMARY KEY,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT,
      subject TEXT NOT NULL,
      body_html TEXT NOT NULL,
      temp_password TEXT,
      status TEXT NOT NULL DEFAULT 'Sent',
      sent_at TEXT NOT NULL,
      error_message TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_dispatched_emails_recipient ON dispatched_emails(recipient_email);
  `);

  try { db.exec('ALTER TABLE candidates ADD COLUMN student_id TEXT;'); } catch {}
  try { db.exec('CREATE INDEX IF NOT EXISTS idx_candidates_student_id ON candidates(student_id);'); } catch {}
  try {
    db.exec(`
      UPDATE candidates 
      SET student_id = '#84920' || printf('%05d', CAST(REPLACE(id, 'cand-', '') AS INTEGER))
      WHERE student_id IS NULL OR student_id = '';
    `);
  } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN career_role_ids TEXT;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN target_roles TEXT;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN eligible_branches TEXT;'); } catch {}
  try { db.exec("ALTER TABLE opportunities ADD COLUMN status TEXT DEFAULT 'Active';"); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN is_closed INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN closed_reason TEXT;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN closed_at TEXT;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN min_skill_score INTEGER DEFAULT 70;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN min_cgpa REAL DEFAULT 7.0;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN min_match_percentage INTEGER DEFAULT 60;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN min_verified_certs INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE opportunities ADD COLUMN benchmark_notes TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN eligible_branches TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN career_role_ids TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN target_roles TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN requirements TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN prerequisites TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN max_seats INTEGER;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN created_by TEXT;'); } catch {}
  try { db.exec("ALTER TABLE learning_programs ADD COLUMN status TEXT DEFAULT 'Live & Accepting';"); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN is_closed INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN closed_reason TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN closed_at TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN hiring_advantage TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN stipend_or_cost TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN mentor_name TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN venue_or_link TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN syllabus_modules TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN schedule_timing TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN department TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN certificate_template_title TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN certificate_signatory_name TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN certificate_signatory_title TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN certificate_badge_url TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN certificate_credential_prefix TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN certificate_citation TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN certificate_template_style TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN auto_issue_certificate INTEGER DEFAULT 1;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN issued_certificate_id TEXT;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN certificate_issued_at TEXT;'); } catch {}

  // Mentor Video posting columns
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN video_url TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN video_title TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN video_duration TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN videos_json TEXT;'); } catch {}
  try { db.exec('ALTER TABLE learning_programs ADD COLUMN posted_date TEXT;'); } catch {}

  // Proctoring & Test columns for mentee enrollments
  try { db.exec("ALTER TABLE mentee_course_enrollments ADD COLUMN test_status TEXT DEFAULT 'not_started';"); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN test_score REAL;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN test_violations_count INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN is_disqualified INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN disqualification_reason TEXT;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN test_completed_at TEXT;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN stopped_at_seconds INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE mentee_course_enrollments ADD COLUMN completed_modules_json TEXT;'); } catch {}

  // Backfill topic-specific video URLs and metadata for all courses with 100% verified working audio
  try {
    // Full-Stack Web Engineering
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/nu_pCVPKzTk',
          video_title = 'Lecture 1: Modern Full-Stack Web Architecture, React 18 & RESTful APIs',
          video_duration = '55 mins'
      WHERE id = 'lp-inst-1';
    `).run();

    // Embedded Systems & IoT Robotics Workshop
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/hnj-7XwTYRI',
          video_title = 'Lab 1: Embedded Microcontroller Architecture & Sensor Interfacing',
          video_duration = '48 mins'
      WHERE id = 'lp-inst-2';
    `).run();

    // Applied Machine Learning & MLOps in Production
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/GIsg-ZUy0MY',
          video_title = 'Masterclass: End-to-End MLOps, PyTorch Models & Production Deployment',
          video_duration = '52 mins'
      WHERE id = 'lp-inst-3';
    `).run();

    // Competitive Programming & Advanced Data Structures
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/RBSGKlAvoiM',
          video_title = 'Session 1: Advanced Dynamic Programming & Graph Theory Algorithms',
          video_duration = '60 mins'
      WHERE id = 'lp-inst-4';
    `).run();

    // Cloud Architecture & AWS Certified Solutions Professional
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/SOTamWNgDKc',
          video_title = 'Module 1: Enterprise AWS Cloud Architecture, VPC & Core Infrastructure',
          video_duration = '65 mins'
      WHERE id = 'lp-1';
    `).run();

    // Deep Learning & LLM Systems: From Zero to Production
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/kCc8FmEb1nY',
          video_title = 'Lecture 1: Deep Learning & Transformers Architecture from Scratch',
          video_duration = '75 mins'
      WHERE id = 'lp-2';
    `).run();

    // Universal keyword-based updates for all courses in learning_programs with working audio
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/kCc8FmEb1nY',
          video_title = 'Lecture 1: Generative AI, Transformers & LLM Architecture',
          video_duration = '75 mins'
      WHERE title LIKE '%Generative AI%' OR title LIKE '%LLM%' OR title LIKE '%Deep Learning%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/SOTamWNgDKc',
          video_title = 'Module 1: Enterprise AWS Cloud Architecture, VPC & Core Services',
          video_duration = '65 mins'
      WHERE title LIKE '%AWS%' OR title LIKE '%Cloud Solutions%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/RBSGKlAvoiM',
          video_title = 'Session 1: Advanced Dynamic Programming & Graph Theory Algorithms',
          video_duration = '60 mins'
      WHERE title LIKE '%Data Structures%' OR title LIKE '%Competitive Coding%' OR title LIKE '%Competitive Programming%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/L1ung0wil9Y',
          video_title = 'Lecture 1: Digital VLSI Circuit Design, SystemVerilog & UVM',
          video_duration = '46 mins'
      WHERE title LIKE '%VLSI%' OR title LIKE '%SystemVerilog%' OR title LIKE '%Silicon%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/GIsg-ZUy0MY',
          video_title = 'Masterclass: End-to-End MLOps, PyTorch Models & Production Deployment',
          video_duration = '52 mins'
      WHERE title LIKE '%Machine Learning%' OR title LIKE '%MLOps%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/fqMOX6JJhGo',
          video_title = 'Lab 1: Docker Containerization, Kubernetes Pods & Microservice Orchestration',
          video_duration = '50 mins'
      WHERE title LIKE '%Kubernetes%' OR title LIKE '%Docker%' OR title LIKE '%DevOps%' OR title LIKE '%Cloud Native%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/3Kq1MIfTWCE',
          video_title = 'Masterclass: Offensive Cybersecurity, SIEM Threat Hunting & SOC Defense',
          video_duration = '58 mins'
      WHERE title LIKE '%Cybersecurity%' OR title LIKE '%Threat Hunting%' OR title LIKE '%SIEM%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/3SAxXUIre28',
          video_title = 'Module 1: Electric Vehicle Powertrain, BMS Architecture & Motor Drives',
          video_duration = '47 mins'
      WHERE title LIKE '%Electric Vehicle%' OR title LIKE '%Battery Tech%' OR title LIKE '%Powertrain%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/4m9j6hlbf4g',
          video_title = 'Module 1: Building Information Modeling (BIM) & Structural Systems',
          video_duration = '52 mins'
      WHERE title LIKE '%Building Information Modeling%' OR title LIKE '%BIM%' OR title LIKE '%Revit%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/502ILHjX9EE',
          video_title = 'Lecture 1: Agile Product Management, User Journeys & OKR Frameworks',
          video_duration = '45 mins'
      WHERE title LIKE '%Product Management%' OR title LIKE '%Sprint Planning%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/HAnw168huqA',
          video_title = 'Masterclass: Executive Communication, Technical Storytelling & Leadership',
          video_duration = '42 mins'
      WHERE title LIKE '%Executive Communication%' OR title LIKE '%Soft Skills%' OR title LIKE '%Interview Mastery%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/nu_pCVPKzTk',
          video_title = 'Lecture 1: Modern Full-Stack Web Architecture, React 18 & RESTful APIs',
          video_duration = '55 mins'
      WHERE title LIKE '%Full Stack%' OR title LIKE '%React%' OR title LIKE '%Web Development%' OR title LIKE '%fullstack%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/hnj-7XwTYRI',
          video_title = 'Lab 1: Embedded Microcontroller Architecture & Sensor Interfacing',
          video_duration = '48 mins'
      WHERE title LIKE '%Embedded%' OR title LIKE '%IoT%' OR title LIKE '%Robotics%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/fqMOX6JJhGo',
          video_title = 'Module 1: Distributed Systems Architecture, Microservices & Container Orchestration',
          video_duration = '55 mins'
      WHERE title LIKE '%Distributed Systems%' OR title LIKE '%Microservices%';
    `).run();

    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/SOTamWNgDKc',
          video_title = 'Module 1: Advanced Cloud Solutions Architecture & Infrastructure',
          video_duration = '60 mins'
      WHERE title LIKE '%Cloud Engineering%';
    `).run();

    // Catch-all for any newly created or untyped courses
    db.prepare(`
      UPDATE learning_programs
      SET video_url = 'https://www.youtube.com/embed/nu_pCVPKzTk',
          video_title = 'Lecture 1: Technical Systems Architecture & Foundations',
          video_duration = '50 mins'
      WHERE video_url IS NULL OR video_url = '';
    `).run();
  } catch (err) {
    console.error('Failed to backfill video URLs:', err);
  }

  seedDataIfEmpty();
  seedExtraTablesIfEmpty();
  ensureAdminAndAuditData();
}

export function ensureAdminAndAuditData() {
  // 1. Single Master Admin Profile
  const existingAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin' OR id = 'admin-root-01'").get();
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('AdminSecure@2026!', salt);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name, title, organization, avatar, phone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'admin-root-01',
      'admin@careersync.com',
      adminHash,
      'admin',
      'System Master Administrator',
      'Chief Platform Auditor & Verifier',
      'CAREER SYNC Central Administration',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      '+91 99000 00001',
      new Date().toISOString()
    );
    console.log('🛡️ Master Admin provisioned: admin@careersync.com (ID: admin-root-01, Pass: AdminSecure@2026!)');
  }

  // 2. Initial Sample Login Audit Logs (Student, Industry, Institution, Admin)
  const logCount = (db.prepare('SELECT COUNT(*) as c FROM login_audit_logs').get() as any).c;
  if (logCount === 0) {
    const insertLog = db.prepare(`
      INSERT INTO login_audit_logs (id, user_id, user_name, user_email, role, device_name, ip_address, location, timestamp, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = Date.now();
    insertLog.run('log-01', 'usr-student-1', 'Ananya Rao', 'student@careersync.com', 'student', 'MacBook Pro 16" (macOS 14.5 / Chrome 128)', '103.212.145.22', 'Bangalore, Karnataka, India', new Date(now - 1000 * 60 * 35).toISOString(), 'Success');
    insertLog.run('log-02', 'usr-industry-1', 'Vikramaditya Sen', 'industry@careersync.com', 'industry', 'Dell Precision 5570 (Windows 11 / Edge 128)', '49.207.180.14', 'Hyderabad, Telangana, India', new Date(now - 1000 * 60 * 120).toISOString(), 'Success');
    insertLog.run('log-03', 'usr-institution-1', 'Dr. Ramesh Sharma', 'institution@careersync.com', 'institution', 'Lenovo ThinkPad X1 (Windows 11 / Chrome 128)', '103.212.145.89', 'Bangalore, Karnataka, India', new Date(now - 1000 * 60 * 240).toISOString(), 'Success');
    insertLog.run('log-04', 'usr-std-0022', 'Krish Gupta', 'krish.gupta22@apextech.edu.in', 'student', 'Samsung Galaxy S24 Ultra (Android 14 / Chrome Mobile)', '152.58.16.4', 'Mysore, Karnataka, India', new Date(now - 1000 * 60 * 480).toISOString(), 'Success');
    insertLog.run('log-05', 'admin-root-01', 'System Master Administrator', 'admin@careersync.com', 'admin', 'Secured Admin Terminal (Ubuntu 24.04 LTS / Chrome 128)', '127.0.0.1', 'Bangalore Central, Karnataka, India', new Date(now - 1000 * 60 * 600).toISOString(), 'Success');
  }

  // 3. Initial Pending Verifications for Admin testing
  const pendingCount = (db.prepare('SELECT COUNT(*) as c FROM pending_verifications').get() as any).c;
  if (pendingCount === 0) {
    const insertPending = db.prepare(`
      INSERT INTO pending_verifications (
        id, role, email, name, organization, title, phone, location, website,
        sector_or_type, accreditation_or_size, certificate_data, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPending.run(
      'verif-inst-001',
      'institution',
      'principal@stxavier-tech.edu.in',
      'Dr. Francis Augustine',
      'St. Xavier Institute of Advanced Technology',
      'Principal & Academic Director',
      '+91 98450 12345',
      'Bangalore, Karnataka, India',
      'https://stxavier-tech.edu.in',
      'Autonomous Engineering College',
      'AICTE Approved • NAAC A++ Accredited • VTU Affiliated',
      JSON.stringify([
        {
          docName: 'AICTE Extension of Approval (EoA) 2025-26',
          issuingAuthority: 'All India Council for Technical Education, New Delhi',
          certNumber: 'AICTE/SW/1-932148201/2025',
          issueDate: '2025-05-18',
          fileUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
          fileType: 'image/jpeg'
        },
        {
          docName: 'Govt. of Karnataka Higher Education Affiliation Certificate',
          issuingAuthority: 'Department of Higher Education, Govt. of Karnataka',
          certNumber: 'ED-84-URT-2024/KA',
          issueDate: '2024-07-10',
          fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
          fileType: 'image/jpeg'
        }
      ]),
      'pending',
      new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    );

    insertPending.run(
      'verif-ind-001',
      'industry',
      'careers@neuralgrid.ai',
      'Aarav Nambiar',
      'NeuralGrid AI Technologies Pvt Ltd',
      'VP of Engineering & Global Talent',
      '+91 98200 67890',
      'Hyderabad, Telangana, India',
      'https://neuralgrid.ai',
      'Artificial Intelligence & Cloud Automation',
      '500-1,000 Employees • DPIIT Recognized Startup',
      JSON.stringify([
        {
          docName: 'Ministry of Corporate Affairs Certificate of Incorporation',
          issuingAuthority: 'Registrar of Companies, Ministry of Corporate Affairs, Govt of India',
          certNumber: 'CIN: U72900KA2022PTC159032',
          issueDate: '2022-03-14',
          fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
          fileType: 'image/jpeg'
        },
        {
          docName: 'GST Registration Certificate (Form GST REG-06)',
          issuingAuthority: 'Goods and Services Tax Network, Govt of India',
          certNumber: 'GSTIN: 29AAACN8491M1ZU',
          issueDate: '2022-04-01',
          fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
          fileType: 'image/jpeg'
        }
      ]),
      'pending',
      new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
    );
  }
}

export function restoreOriginalDemoDatabase() {
  console.log('🔄 Restoring original clean Career Sync demo database...');
  db.exec('BEGIN TRANSACTION;');
  try {
    db.exec(`
      DELETE FROM applications;
      DELETE FROM shortlists;
      DELETE FROM candidates;
      DELETE FROM saved_opportunities;
      DELETE FROM opportunities;
      DELETE FROM program_enrollments;
      DELETE FROM learning_programs;
      DELETE FROM event_registrations;
      DELETE FROM events;
      DELETE FROM notifications;
      DELETE FROM messages;
      DELETE FROM conversations;
      DELETE FROM assessment_scores;
      DELETE FROM projects;
      DELETE FROM certifications;
      DELETE FROM internships;
      DELETE FROM placement_drives;
      DELETE FROM collaboration_initiatives;
      DELETE FROM student_profiles;
      DELETE FROM users;
    `);
    db.exec('COMMIT;');
  } catch (e) {
    db.exec('ROLLBACK;');
    console.error('Failed to clear database during demo restore:', e);
  }

  seedDataIfEmpty(true);
  seedExtraTablesIfEmpty(true);
  return getDatabaseStats();
}

export function reseedSchoolDatabase() {
  seedSchoolDatabase(db);
  return getDatabaseStats();
}

export function getDatabaseStats() {
  const tables = [
    'users',
    'student_profiles',
    'opportunities',
    'saved_opportunities',
    'applications',
    'candidates',
    'shortlists',
    'learning_programs',
    'program_enrollments',
    'events',
    'event_registrations',
    'notifications',
    'conversations',
    'messages',
    'assessment_scores',
    'projects',
    'certifications',
    'internships',
    'placement_drives',
    'collaboration_initiatives',
    'mentee_course_enrollments'
  ];

  const tableStats = tables.map(name => {
    try {
      const row: any = db.prepare(`SELECT COUNT(*) as c FROM ${name}`).get();
      return { table: name, rowCount: row.c };
    } catch {
      return { table: name, rowCount: 0 };
    }
  });

  // Department distribution
  let departmentCounts: any[] = [];
  try {
    departmentCounts = db.prepare(`
      SELECT department, COUNT(*) as count 
      FROM student_profiles 
      GROUP BY department 
      ORDER BY count DESC
    `).all();
  } catch {}

  // Batch distribution
  let batchCounts: any[] = [];
  try {
    batchCounts = db.prepare(`
      SELECT graduation_year, COUNT(*) as count 
      FROM student_profiles 
      GROUP BY graduation_year 
      ORDER BY graduation_year ASC
    `).all();
  } catch {}

  // Application stage distribution
  let applicationStages: any[] = [];
  try {
    applicationStages = db.prepare(`
      SELECT current_stage, COUNT(*) as count 
      FROM applications 
      GROUP BY current_stage 
      ORDER BY count DESC
    `).all();
  } catch {}

  return {
    engine: 'SQLite (Native node:sqlite DatabaseSync with WAL & Indices)',
    filePath: DB_PATH,
    schoolName: 'Apex Institute of Technology (College of Engineering & Management)',
    departmentsCount: departmentCounts.length,
    departments: departmentCounts,
    batches: batchCounts,
    applicationStages,
    tablesCount: tables.length,
    totalRows: tableStats.reduce((sum, t) => sum + t.rowCount, 0),
    tables: tableStats
  };
}

function seedDataIfEmpty(force = false) {
  if (!force) {
    const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    if (userCount > 0) return;
  }

  console.log('🌱 Seeding Career Sync database with demo accounts and initial dataset...');

  const salt = bcrypt.genSaltSync(10);
  const studentHash = bcrypt.hashSync('student123', salt);
  const industryHash = bcrypt.hashSync('industry123', salt);
  const institutionHash = bcrypt.hashSync('admin123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, role, name, title, organization, avatar, phone, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Default demo accounts
  insertUser.run('usr-student-1', 'student@careersync.com', studentHash, 'student', 'Ananya Rao', 'CSE Undergraduate', 'Apex Institute of Technology', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '+91 98765 43210', new Date().toISOString());
  insertUser.run('usr-industry-1', 'industry@careersync.com', industryHash, 'industry', 'Vikramaditya Sen', 'Lead Technical Recruiter', 'TechNova Solutions', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '+91 98765 99887', new Date().toISOString());
  insertUser.run('usr-institution-1', 'institution@careersync.com', institutionHash, 'institution', 'Dr. Ramesh Sharma', 'Dean & Placement Director', 'Apex Institute of Technology', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', '+91 98765 11223', new Date().toISOString());

  // Student Profile
  const insertProfile = db.prepare(`
    INSERT INTO student_profiles (
      id, user_id, name, avatar, email, phone, college, degree, department, graduation_year,
      location, bio, cgpa, profile_completion, overall_score, technical_score, soft_score,
      readiness_score, is_verified, career_interests, preferred_job_roles, preferred_industries,
      resume_url, socials
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProfile.run(
    'prof-student-1',
    'usr-student-1',
    'Student',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'student@careersync.com',
    '',
    'Apex Institute of Technology, Bangalore',
    'Bachelor of Technology (B.Tech)',
    'Computer Science & Engineering',
    2026,
    '',
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
    JSON.stringify({
      github: '',
      linkedin: '',
      portfolio: ''
    })
  );

  // Opportunities
  const insertOpp = db.prepare(`
    INSERT OR REPLACE INTO opportunities (
      id, type, title, organization, logo, location, work_mode, required_skills,
      preferred_skills, salary_or_stipend, experience, duration, deadline, match_percentage,
      description, responsibilities, eligibility, applicants_count, posted_date, company_details, created_by,
      career_role_ids, target_roles, eligible_branches
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOpp.run(
    'opp-6',
    'fdp',
    'Industry Immersion: Cloud-Native Microservices & AI Engineering',
    'Infosys Springboard & Apex Tech',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    'Mysore Campus / Virtual',
    'Hybrid',
    JSON.stringify(['Distributed Computing', 'Cloud Architecture', 'Curriculum Design', 'Docker']),
    null,
    'Sponsored Industry Fellowship + Certificate',
    null,
    '2 Weeks (Full-time intensive)',
    '28 Sep 2026',
    96,
    'A national professional development initiative on modern cloud deployment, observability, and gen-AI microservices.',
    JSON.stringify([
      'Attend daily live architecture labs conducted by Infosys Chief System Architects',
      'Refactor curriculum modules to reflect 2026 industry standards',
      'Develop an industry-sponsored Capstone project template for final year students'
    ]),
    'Open to engineering graduates, researchers, and technical leads across India.',
    68,
    '3 days ago',
    JSON.stringify({ size: '300,000+ employees', industry: 'IT & Digital Transformation', website: 'https://infosys.com', rating: 4.4 }),
    null,
    JSON.stringify(['cloud-devops-engineer']),
    JSON.stringify(['Cloud & DevOps Engineer']),
    JSON.stringify(['All B.Tech Branches', 'Computer Science & Engineering'])
  );

  insertOpp.run(
    'opp-7',
    'consultancy',
    'Industrial IoT Telemetry Optimization & Predictive Maintenance',
    'Tata Motors R&D',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    'Pune / Remote',
    'Hybrid',
    JSON.stringify(['Edge Computing', 'Sensor Fusion', 'Time-Series Machine Learning', 'MATLAB/Python']),
    null,
    '₹6,50,000 Consultancy Grant',
    null,
    '4 Months Project',
    '20 Oct 2026',
    91,
    'Seeking researchers and technical experts to formulate mathematical filtering and edge inferencing models for EV battery degradation telemetry.',
    JSON.stringify([
      'Develop real-time noise reduction filters for CAN bus sensor data streams',
      'Validate remaining useful life (RUL) prediction algorithms against physical test rigs',
      'Deliver final technical report and co-author joint intellectual property patent'
    ]),
    'Researchers and postgraduates in Electrical, CSE, or Mechanical Engineering with demonstrated signal processing and ML publications.',
    14,
    '5 days ago',
    JSON.stringify({ size: '75,000+ employees', industry: 'Automotive & Clean Mobility', website: 'https://tatamotors.com', rating: 4.5 }),
    null,
    JSON.stringify(['embedded-iot-engineer', 'robotics-engineer']),
    JSON.stringify(['Embedded Systems & IoT Engineer', 'Robotics & Automation Engineer']),
    JSON.stringify(['Electrical & Electronics Engineering', 'Mechanical Engineering', 'Computer Science & Engineering'])
  );

  insertOpp.run(
    'opp-8',
    'research',
    'Joint Research: Responsible AI & Agentic Hallucination Mitigation',
    'Accenture Labs & IIT Bangalore',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&auto=format&fit=crop&q=80',
    'Bangalore / Remote',
    'Hybrid',
    JSON.stringify(['LLMs', 'Formal Verification', 'Natural Language Processing', 'Research Methodology']),
    null,
    '₹15,00,000 Joint Research Budget',
    null,
    '12 Months',
    '30 Oct 2026',
    95,
    'Joint research project investigating guardrail architectures, semantic truth probes, and constraint decoding in enterprise reasoning agents.',
    JSON.stringify([
      'Conduct rigorous experimental benchmarking on enterprise hallucination datasets',
      'Co-advise 2 funded PhD research scholars and student interns',
      'Publish high-impact findings at ACL, NeurIPS, or IEEE Trans on Software Engineering'
    ]),
    'Researchers with active AI labs and proven peer-reviewed publications in NLP/ML.',
    21,
    '1 week ago',
    JSON.stringify({ size: '700,000+ employees', industry: 'Global Professional Services & Innovation Labs', website: 'https://accenture.com', rating: 4.6 }),
    null,
    JSON.stringify(['nlp-engineer', 'ai-ml-engineer']),
    JSON.stringify(['GenAI & NLP Specialist', 'AI & Machine Learning Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Artificial Intelligence & Data Science'])
  );

  // Applications
  const insertApp = db.prepare(`
    INSERT INTO applications (
      id, opportunity_id, user_id, student_name, student_email, title, company, logo,
      type, applied_date, current_stage, stage_timeline, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Candidates for recruiter
  const insertCand = db.prepare(`
    INSERT INTO candidates (
      id, student_id, name, avatar, college, degree, department, graduation_year, location,
      skill_score, match_score, top_skills, certifications_count, internship_experience,
      status, is_verified, cgpa
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCand.run('cand-01', '#8492019482', 'Ananya Rao', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Apex Institute of Technology', 'B.Tech', 'Computer Science & Engineering', 2026, 'Bangalore', 94, 94, JSON.stringify(['React', 'TypeScript', 'Python', 'SQL', 'FastAPI']), 4, 'TechNova Solutions & Apex Data Systems', 'Shortlisted', 1, 8.92);
  insertCand.run('cand-02', '#9182374650', 'Rahul Kumar', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', 'National Institute of Engineering', 'B.Tech', 'Information Science & Engineering', 2026, 'Hyderabad', 91, 91, JSON.stringify(['Java', 'Spring Boot', 'AWS', 'Microservices', 'PostgreSQL']), 3, '6 Months @ CloudCore', 'Available', 1, 8.75);
  insertCand.run('cand-03', '#7261940583', 'Priya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Apex Institute of Technology', 'B.Tech', 'Artificial Intelligence & Data Science', 2026, 'Bangalore', 92, 89, JSON.stringify(['Python', 'TensorFlow', 'PyTorch', 'Data Analytics', 'Snowflake']), 5, '4 Months @ AnalyticsPro', 'Interviewed', 1, 9.1);
  insertCand.run('cand-04', '#6351029487', 'Vikramaditya Joshi', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', 'Vellore Institute of Technology', 'B.Tech', 'Computer Science', 2026, 'Chennai', 88, 86, JSON.stringify(['Go', 'Kubernetes', 'Docker', 'Linux', 'gRPC']), 2, '3 Months @ DevPlatform', 'Available', 1, 8.4);
  insertCand.run('cand-05', '#5240918376', 'Meera Nambiar', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Apex Institute of Technology', 'B.Tech', 'Electronics & Communication', 2026, 'Bangalore', 85, 82, JSON.stringify(['Embedded C', 'IoT', 'Python', 'MQTT', 'Circuit Design']), 3, '4 Months @ Bosch R&D', 'Available', 1, 8.65);

  // Recruiter shortlist cand-01
  db.prepare('INSERT INTO shortlists VALUES (?, ?, ?)').run('usr-industry-1', 'cand-01', new Date().toISOString());

  // Learning Programs
  const insertProg = db.prepare(`
    INSERT INTO learning_programs (
      id, title, category, provider, logo, duration, level, skills_gained,
      has_certification, rating, enrolled_count, deadline, description, mode,
      video_url, video_title, video_duration
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProg.run(
    'lp-1',
    'Cloud Architecture & AWS Certified Solutions Professional',
    'Certification',
    'AWS Academy & TechNova',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
    '8 Weeks (Self-paced + 4 Live Labs)',
    'Intermediate',
    JSON.stringify(['AWS VPC', 'EC2 & S3', 'Serverless Lambda', 'IAM Security', 'CloudFormation']),
    1,
    4.9,
    3420,
    'Rolling Admission',
    'Master enterprise cloud fundamentals with production labs, architectural case studies, and official voucher preparation.',
    'Live Online',
    'https://www.youtube.com/embed/SOTamWNgDKc',
    'Module 1: Enterprise AWS Cloud Architecture, VPC & Core Infrastructure',
    '65 mins'
  );

  insertProg.run(
    'lp-2',
    'Deep Learning & LLM Systems: From Zero to Production',
    'Bootcamp',
    'DeepLearning.AI Industry Consortium',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    '10 Weeks',
    'Advanced',
    JSON.stringify(['Transformers', 'PyTorch', 'Fine-tuning', 'Vector Search & RAG', 'LangChain']),
    1,
    4.95,
    5120,
    'Starts 15 Oct 2026',
    'Build production-grade GenAI assistants, retrieval augmented systems, and prompt pipelines with hands-on GPU labs.',
    'Live Online',
    'https://www.youtube.com/embed/kCc8FmEb1nY',
    'Lecture 1: Deep Learning & Transformers Architecture from Scratch',
    '75 mins'
  );

  // Events
  const insertEv = db.prepare(`
    INSERT INTO events (
      id, title, type, organizer, date, time, location, seats_remaining, speakers, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEv.run(
    'ev-1',
    'National Hack-for-Impact 2026 (₹5 Lakh Prize Pool)',
    'Hackathon',
    'TechNova Solutions & Apex Institute',
    '18 - 20 Oct 2026',
    '48 Hours Hybrid',
    'Bangalore Campus & Online',
    45,
    JSON.stringify(['Arjun Mehta (TechNova)', 'Dr. Rajeshwari Raman (Apex Tech)']),
    'Build production-ready prototypes addressing healthcare, climate technology, and educational accessibility using AI and Web3.'
  );

  insertEv.run(
    'ev-2',
    'Masterclass: Cracking FAANG & Tier-1 System Design Interviews',
    'Workshop',
    'Career Sync & Microsoft Engineers',
    '24 Sep 2026',
    '6:00 PM - 8:30 PM IST',
    'Virtual Webinar',
    120,
    JSON.stringify(['Kavita Sundaram (Microsoft)', 'Rohan Iyer (Staff Architect)']),
    'Learn step-by-step breakdown of rate limiters, caching layers, microservices, and database sharding asked in Tier-1 software interviews.'
  );

  console.log('✅ Career Sync database seeding completed successfully!');
}

function seedExtraTablesIfEmpty(force = false) {
  // Seed demo opportunities if empty
  const oppCount = (db.prepare('SELECT COUNT(*) as c FROM opportunities').get() as any).c;
  if (oppCount === 0) {
    const insertOpp = db.prepare(`
      INSERT OR REPLACE INTO opportunities (
        id, type, title, organization, logo, location, work_mode, required_skills,
        preferred_skills, salary_or_stipend, experience, duration, deadline, match_percentage,
        description, responsibilities, eligibility, applicants_count, posted_date, company_details, created_by,
        career_role_ids, target_roles, eligible_branches, status,
        min_skill_score, min_cgpa, min_match_percentage, min_verified_certs, benchmark_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOpp.run(
      'opp-1',
      'job',
      'Software Development Engineer - I (Full Stack)',
      'TechNova Solutions',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      'Bangalore / Hybrid',
      'Hybrid',
      JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL']),
      JSON.stringify(['Docker', 'AWS', 'Next.js', 'Redis']),
      '₹14,00,000 - ₹18,00,000 / annum',
      'Fresher (Batch of 2026)',
      null,
      '2026-10-31',
      92,
      'Join TechNova’s Core Engineering team to build high-scale cloud platforms, distributed GraphQL services, and responsive web experiences.',
      JSON.stringify([
        'Design and ship production React and TypeScript web features',
        'Implement resilient REST and GraphQL microservices in Node.js',
        'Participate in continuous deployment and automated testing pipelines'
      ]),
      'B.Tech in CSE / ISE / AI&DS / ECE with minimum 7.5 CGPA and 78+ verified skill score.',
      14,
      '1 day ago',
      JSON.stringify({ size: '1,000+ employees', industry: 'Software & Technology', website: 'https://technova.io', rating: 4.8 }),
      'usr-industry-1',
      JSON.stringify(['fullstack-engineer', 'frontend-engineer', 'backend-engineer']),
      JSON.stringify(['Software Development Engineer', 'Full-Stack Developer']),
      JSON.stringify(['All B.Tech Branches', 'Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science']),
      'Active',
      78,
      7.5,
      70,
      1,
      'Tier-1 SDE Benchmark: Requires overall skill score ≥ 78%, CGPA ≥ 7.5, skill match ≥ 70%, and at least 1 verified certificate.'
    );

    insertOpp.run(
      'opp-2',
      'internship',
      'Full Stack Engineering Intern (Summer 2026)',
      'TechNova Solutions',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      'Hyderabad / Hybrid',
      'Hybrid',
      JSON.stringify(['React', 'JavaScript', 'Node.js', 'SQL']),
      JSON.stringify(['TypeScript', 'Tailwind CSS', 'Git']),
      '₹30,000 / month',
      'Undergraduate (3rd / 4th Year)',
      '6 Months (Jan - Jun 2026)',
      '2026-10-15',
      88,
      'Hands-on product development internship building student portfolio tools, real-time messaging, and analytics dashboards.',
      JSON.stringify([
        'Develop user-facing UI components in React and modern CSS',
        'Build and test backend database CRUD endpoints',
        'Collaborate with mentors in bi-weekly sprint reviews'
      ]),
      'Pre-final or final year engineering students with active project work and minimum 7.0 CGPA.',
      28,
      '2 days ago',
      JSON.stringify({ size: '1,000+ employees', industry: 'Software & Technology', website: 'https://technova.io', rating: 4.8 }),
      'usr-industry-1',
      JSON.stringify(['fullstack-engineer', 'frontend-engineer']),
      JSON.stringify(['Full Stack Engineering Intern', 'Web Developer Intern']),
      JSON.stringify(['All B.Tech Branches', 'Computer Science & Engineering', 'Information Technology']),
      'Active',
      70,
      7.0,
      60,
      0,
      'Internship Benchmark: Requires skill score ≥ 70%, CGPA ≥ 7.0, and minimum 60% skill match.'
    );

    insertOpp.run(
      'opp-3',
      'job',
      'Cloud DevOps & Platform Engineer',
      'Microsoft',
      'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?w=100&auto=format&fit=crop&q=80',
      'Hyderabad / Bangalore',
      'Hybrid',
      JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD Pipelines']),
      JSON.stringify(['Terraform', 'Python', 'Go', 'Prometheus']),
      '₹24,00,000 - ₹32,00,000 / annum',
      'Fresher to 1 Year',
      null,
      '2026-11-15',
      84,
      'Architect, automate, and scale cloud infrastructure platforms across Azure and multi-cloud environments.',
      JSON.stringify([
        'Author infrastructure-as-code scripts and automated CI/CD pipelines',
        'Manage container orchestration clusters and zero-downtime rollouts',
        'Implement system observability, metrics, and incident alerting'
      ]),
      'B.Tech/M.Tech with strong systems fundamentals, minimum 8.0 CGPA, and 82+ skill score.',
      42,
      '3 days ago',
      JSON.stringify({ size: '200,000+ employees', industry: 'Cloud & Enterprise Tech', website: 'https://microsoft.com', rating: 4.9 }),
      'usr-industry-1',
      JSON.stringify(['cloud-devops-engineer', 'backend-engineer']),
      JSON.stringify(['Cloud DevOps Engineer', 'Site Reliability Engineer']),
      JSON.stringify(['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering']),
      'Active',
      82,
      8.0,
      75,
      1,
      'Enterprise Standard Benchmark: Requires skill score ≥ 82%, CGPA ≥ 8.0, skill match ≥ 75%, and 1+ accredited verified certificate.'
    );

    insertOpp.run(
      'opp-4',
      'internship',
      'AI/ML Systems & Computer Vision Research Intern',
      'Google DeepMind Partner Lab',
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&auto=format&fit=crop&q=80',
      'Bangalore / Remote',
      'Remote',
      JSON.stringify(['Python', 'PyTorch', 'Deep Learning', 'Computer Vision']),
      JSON.stringify(['TensorFlow', 'CUDA', 'OpenCV', 'MLflow']),
      '₹50,000 / month',
      'Undergraduate / Masters Student',
      '6 Months (Spring 2026)',
      '2026-10-20',
      91,
      'Research and deploy cutting-edge deep learning visual transformers and spatial neural representation models.',
      JSON.stringify([
        'Conduct algorithmic experiments on vision transformers and multimodal diffusion models',
        'Profile GPU memory utilization and latency bottlenecks in PyTorch',
        'Co-author research technical reports and open-source benchmarks'
      ]),
      'Students with strong mathematical foundations, minimum 8.5 CGPA, and 85+ skill score.',
      19,
      'Just now',
      JSON.stringify({ size: '5,000+ researchers', industry: 'Artificial Intelligence & Research', website: 'https://deepmind.google', rating: 4.95 }),
      'usr-industry-1',
      JSON.stringify(['data-scientist', 'ai-ml-engineer']),
      JSON.stringify(['AI Research Intern', 'Machine Learning Engineer']),
      JSON.stringify(['Computer Science & Engineering', 'Artificial Intelligence & Data Science']),
      'Active',
      85,
      8.5,
      75,
      1,
      'High-Bar AI Benchmark: Requires skill score ≥ 85%, CGPA ≥ 8.5, skill match ≥ 75%, and 1+ verified certificate.'
    );

    insertOpp.run(
      'opp-5',
      'job',
      'Frontend UI/UX Product Engineer',
      'Atlassian',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
      'Bangalore',
      'On-site',
      JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Web Performance']),
      JSON.stringify(['Next.js', 'Figma', 'GraphQL', 'Jest']),
      '₹18,00,000 - ₹22,00,000 / annum',
      'Fresher (Batch of 2026)',
      null,
      '2026-11-05',
      89,
      'Craft delightful, accessible, high-performance web products used by millions of developers and enterprise teams worldwide.',
      JSON.stringify([
        'Build accessible design system components adhering to W3C standards',
        'Optimize Core Web Vitals (LCP, INP, CLS) across large web surfaces',
        'Collaborate closely with product designers and telemetry engineers'
      ]),
      'B.Tech graduates with strong portfolio/code samples, minimum 7.0 CGPA, and 75+ skill score.',
      23,
      '4 days ago',
      JSON.stringify({ size: '10,000+ employees', industry: 'Enterprise Collaboration Software', website: 'https://atlassian.com', rating: 4.7 }),
      'usr-industry-1',
      JSON.stringify(['frontend-engineer', 'fullstack-engineer']),
      JSON.stringify(['Frontend Engineer', 'UI/UX Developer']),
      JSON.stringify(['All B.Tech Branches', 'Computer Science & Engineering', 'Information Technology']),
      'Active',
      75,
      7.0,
      65,
      0,
      'Standard Product Benchmark: Requires skill score ≥ 75%, CGPA ≥ 7.0, and skill match ≥ 65%.'
    );

    insertOpp.run(
      'opp-6',
      'fdp',
      'Industry Immersion: Cloud-Native Microservices & AI Engineering',
      'Infosys Springboard & Apex Tech',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      'Mysore Campus / Virtual',
      'Hybrid',
      JSON.stringify(['Distributed Computing', 'Cloud Architecture', 'Curriculum Design', 'Docker']),
      JSON.stringify(['Kubernetes', 'FastAPI']),
      'Sponsored Industry Fellowship + Certificate',
      null,
      '2 Weeks (Full-time intensive)',
      '28 Sep 2026',
      96,
      'A national professional development initiative on modern cloud deployment, observability, and gen-AI microservices.',
      JSON.stringify([
        'Attend daily live architecture labs conducted by Infosys Chief System Architects',
        'Refactor curriculum modules to reflect 2026 industry standards',
        'Develop an industry-sponsored Capstone project template for final year students'
      ]),
      'Open to engineering graduates, researchers, and technical leads across India.',
      68,
      '3 days ago',
      JSON.stringify({ size: '300,000+ employees', industry: 'IT & Digital Transformation', website: 'https://infosys.com', rating: 4.4 }),
      'usr-industry-1',
      JSON.stringify(['cloud-devops-engineer']),
      JSON.stringify(['Cloud & DevOps Engineer']),
      JSON.stringify(['All B.Tech Branches', 'Computer Science & Engineering']),
      'Active',
      72,
      7.0,
      60,
      0,
      'Fellowship Benchmark: Open to graduating engineers with 70%+ score.'
    );
  }


  const driveCount = (db.prepare('SELECT COUNT(*) as c FROM placement_drives').get() as any).c;
  if (driveCount === 0) {
    const insertDrive = db.prepare(`
      INSERT INTO placement_drives (id, company, logo, role, salary_package, eligible_branches, drive_date, status, total_eligible, applied, shortlisted, interviews, offers, joined)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertDrive.run('drive-1', 'TechNova Solutions', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Software Development Engineer - I', '₹14.5 - 18.0 LPA', JSON.stringify(['CSE', 'ISE', 'AI/DS', 'ECE']), '18 Oct 2026', 'Active', 240, 185, 48, 22, 14, 12);
    insertDrive.run('drive-2', 'Microsoft', 'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?w=100&auto=format&fit=crop&q=80', 'Cloud DevOps & Platform Engineer', '₹24.0 - 32.0 LPA', JSON.stringify(['CSE', 'ISE', 'AI/DS']), '28 Oct 2026', 'Upcoming', 180, 142, 28, 12, 6, 0);
  }

  const collabCount = (db.prepare('SELECT COUNT(*) as c FROM collaboration_initiatives').get() as any).c;
  if (collabCount === 0) {
    const insertCollab = db.prepare(`
      INSERT INTO collaboration_initiatives (id, title, type, partner_organization, logo, institution, start_date, duration, status, lead_coordinator, impact_metrics, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertCollab.run('col-1', 'TechNova AI Center of Excellence & GPU Cloud Lab', 'Industry Partnership', 'TechNova Solutions', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Apex Institute of Technology', '15 Jul 2026', '3 Years MOU', 'MOU Signed', 'Dr. Ramesh Sharma & Arjun Mehta', '350+ Students Trained, 4 Joint Patents Filed', 'Jointly established advanced machine learning compute lab with 8x NVIDIA H100 SXM5 GPUs.');
  }

  // Ensure institution courses exist in learning_programs
  const instCourse1 = db.prepare('SELECT 1 FROM learning_programs WHERE id = ?').get('lp-inst-1');
  if (!instCourse1) {
    const insertInstProg = db.prepare(`
      INSERT OR REPLACE INTO learning_programs (
        id, title, category, provider, logo, duration, level, skills_gained, has_certification,
        rating, enrolled_count, deadline, description, mode, eligible_branches, mentor_name,
        venue_or_link, syllabus_modules, schedule_timing, department, max_seats, status,
        video_url, video_title, video_duration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertInstProg.run(
      'lp-inst-1',
      'Full-Stack Web Engineering with React & Node',
      'Course',
      'Apex Institute • Dept of CS',
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop&q=80',
      '8 Weeks (16 Interactive Sessions)',
      'Intermediate',
      JSON.stringify(['React 18', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'REST Security']),
      1,
      4.92,
      68,
      '2026-10-30',
      'Comprehensive mentor-led full-stack development cohort covering modern component architecture, state machines, secure backend APIs, and Dockerized cloud deployment.',
      'Live Online',
      JSON.stringify(['Computer Science & Engineering', 'Information Science & Engineering', 'Artificial Intelligence & Data Science']),
      'Dr. Ramesh Sharma (Dean & CS Faculty)',
      'Google Meet (meet.google.com/cs-fullstack-2026) & GitHub Classroom',
      JSON.stringify([
        { moduleNumber: 1, title: 'Modern React 18 Architecture & Hooks', duration: 'Week 1-2', topics: ['Component Lifecycle', 'Custom Hooks', 'Tailwind & UI State'] },
        { moduleNumber: 2, title: 'Scalable Node.js & Express APIs', duration: 'Week 3-4', topics: ['Middleware Pipelines', 'Input Validation', 'Async Routing'] },
        { moduleNumber: 3, title: 'PostgreSQL Relational Design & Prisma', duration: 'Week 5-6', topics: ['Indexing Strategies', 'Migrations', 'Connection Pooling'] },
        { moduleNumber: 4, title: 'Security, JWT & Dockerized Deployment', duration: 'Week 7-8', topics: ['JWT Refresh Flow', 'Containerization', 'CI/CD Pipelines'] }
      ]),
      'Every Tuesday & Thursday • 5:00 PM - 7:00 PM IST',
      'Computer Science & Engineering',
      80,
      'Live & Accepting',
      'https://www.youtube.com/embed/nu_pCVPKzTk',
      'Lecture 1: Modern Full-Stack Web Architecture, React 18 & RESTful APIs',
      '55 mins'
    );

    insertInstProg.run(
      'lp-inst-2',
      'Embedded Systems & IoT Robotics Workshop',
      'Workshop',
      'Apex Institute • Dept of ECE & IoT CoE',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
      '6 Weeks (Hands-on Lab Track)',
      'Intermediate',
      JSON.stringify(['STM32 ARM Cortex', 'FreeRTOS', 'I2C/SPI Protocols', 'Sensor Interfacing', 'PCB Soldering']),
      1,
      4.95,
      42,
      '2026-10-25',
      'Hands-on physical laboratory workshop mastering embedded microcontrollers, real-time operating systems (FreeRTOS), hardware bus debugging, and autonomous mobile robotics.',
      'Classroom',
      JSON.stringify(['Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering']),
      'Prof. Ananya Sen (ECE Robotics CoE)',
      'Hardware & Embedded Systems Lab 304, Block C (In-Person)',
      JSON.stringify([
        { moduleNumber: 1, title: 'Microcontroller Architecture & Bare Metal C', duration: 'Week 1-2', topics: ['GPIO Registers', 'Clocks & Timers', 'Interrupt Vectors'] },
        { moduleNumber: 2, title: 'Bus Protocols: UART, SPI & I2C', duration: 'Week 3-4', topics: ['Logic Analyzers', 'Oscilloscope Debugging', 'Sensor Fusion'] },
        { moduleNumber: 3, title: 'FreeRTOS Multitasking & Capstone Rover', duration: 'Week 5-6', topics: ['Task Scheduling', 'Semaphores & Queues', 'Autonomous Rover Build'] }
      ]),
      'Mon, Wed, Fri • 3:30 PM - 5:30 PM IST (Lab In-Person)',
      'Electronics & Communication',
      50,
      'Live & Accepting',
      'https://www.youtube.com/embed/hnj-7XwTYRI',
      'Lab 1: Embedded Microcontroller Architecture & Sensor Interfacing',
      '48 mins'
    );

    insertInstProg.run(
      'lp-inst-3',
      'Applied Machine Learning & MLOps in Production',
      'Course',
      'Apex Institute • Dept of AI & Data Science',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      '10 Weeks (Hybrid)',
      'Advanced',
      JSON.stringify(['Scikit-Learn', 'PyTorch', 'MLflow', 'Docker', 'Feature Stores', 'Model Monitoring']),
      1,
      4.89,
      56,
      '2026-11-05',
      'End-to-end applied machine learning track taking students from foundational statistical modeling to enterprise containerized inference pipelines and drift monitoring.',
      'Hybrid',
      JSON.stringify(['Artificial Intelligence & Data Science', 'Computer Science & Engineering', 'Information Science & Engineering']),
      'Dr. Vikramaditya Rao (AI & DS Lab Head)',
      'Seminar Hall B (Offline) & MS Teams (Online Sessions)',
      JSON.stringify([
        { moduleNumber: 1, title: 'Advanced Feature Engineering & Ensembles', duration: 'Week 1-3', topics: ['EDA Pipelines', 'XGBoost & LightGBM', 'Cross-Validation'] },
        { moduleNumber: 2, title: 'Deep Neural Networks with PyTorch', duration: 'Week 4-6', topics: ['Tensors', 'Backpropagation', 'Transfer Learning', 'Embeddings'] },
        { moduleNumber: 3, title: 'MLOps: Experiment Tracking & Cloud Deployment', duration: 'Week 7-10', topics: ['MLflow Registries', 'FastAPI Serving', 'Docker & Model Drift'] }
      ]),
      'Saturdays 10:00 AM - 1:00 PM (In-Person) + Wed 6 PM Online',
      'Artificial Intelligence & Data Science',
      60,
      'Live & Accepting',
      'https://www.youtube.com/embed/GIsg-ZUy0MY',
      'Masterclass: End-to-End MLOps, PyTorch Models & Production Deployment',
      '52 mins'
    );

    insertInstProg.run(
      'lp-inst-4',
      'Competitive Programming & Advanced Data Structures',
      'Bootcamp',
      'Apex Institute Placement Cell',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop&q=80',
      '12 Weeks (Intensive Problem Solving)',
      'Intermediate',
      JSON.stringify(['Dynamic Programming', 'Graph Theory', 'Bitmasking', 'Segment Trees', 'Trie']),
      1,
      4.96,
      95,
      '2026-11-15',
      'Rigorous algorithm design and competitive coding practice tailored to crack Tier-1 product company coding rounds (Google, Amazon, Microsoft, Atlassian).',
      'Live Online',
      JSON.stringify(['Computer Science & Engineering', 'Information Science & Engineering', 'All Engineering Departments']),
      'Prof. Sandeep Kulkarni (Coding Coach)',
      'Discord Live & HackerRank Private Arena',
      JSON.stringify([
        { moduleNumber: 1, title: 'Advanced Recursion & Dynamic Programming', duration: 'Week 1-4', topics: ['Memoization vs Tabulation', '0/1 Knapsack', 'DP on Trees'] },
        { moduleNumber: 2, title: 'Graph Algorithms & Shortest Path', duration: 'Week 5-8', topics: ['Dijkstra', 'Bellman-Ford', 'Disjoint Set Union', 'Topological Sort'] },
        { moduleNumber: 3, title: 'Range Queries & Contest Simulation', duration: 'Week 9-12', topics: ['Segment Trees', 'Fenwick Trees', 'Weekly Timed Contests'] }
      ]),
      'Mon & Thu • 6:30 PM - 8:30 PM IST',
      'Computer Science & Engineering',
      120,
      'Live & Accepting',
      'https://www.youtube.com/embed/RBSGKlAvoiM',
      'Session 1: Advanced Dynamic Programming & Graph Theory Algorithms',
      '60 mins'
    );
  }

  // Seed mentee course enrollments if empty
  const menteeCourseCount = (db.prepare('SELECT COUNT(*) as c FROM mentee_course_enrollments').get() as any).c;
  if (menteeCourseCount === 0) {
    const insertMenteeCourse = db.prepare(`
      INSERT INTO mentee_course_enrollments (
        id, course_id, course_title, course_mode, student_id, student_name, student_email,
        student_avatar, department, usn, cgpa, applied_at, statement_of_purpose, permission_status,
        permission_decided_at, mentor_id, mentor_name, started_at, progress_percentage, current_module,
        completed_assignments, total_assignments, assessment_score, last_active_at, mentor_notes, is_certified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Pending Applications
    insertMenteeCourse.run(
      'mce-01',
      'lp-inst-1',
      'Full-Stack Web Engineering with React & Node',
      'Live Online',
      'usr-student-2',
      'Priya Sharma',
      'priya.sharma@apextech.ac.in',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      'Computer Science & Engineering',
      '1AP23CS084',
      8.92,
      '2026-09-08T10:30:00Z',
      'Looking to build deep full-stack engineering skills to clear technical interviews for upcoming Tier-1 campus placement drives.',
      'pending',
      null,
      'usr-institution-1',
      'Dr. Ramesh Sharma',
      null,
      0,
      'Awaiting Admission Approval',
      0,
      5,
      null,
      '2026-09-10T14:30:00Z',
      'Candidate has solid OOP fundamentals; ready for mentor review.',
      0
    );

    insertMenteeCourse.run(
      'mce-02',
      'lp-inst-2',
      'Embedded Systems & IoT Robotics Workshop',
      'Classroom',
      'usr-student-3',
      'Rohan Verma',
      'rohan.verma@apextech.ac.in',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      'Electronics & Communication',
      '1AP23EC042',
      8.45,
      '2026-09-09T14:15:00Z',
      'Specializing in edge microcontrollers, sensors, and robotics for our final-year Smart Mobility capstone project.',
      'pending',
      null,
      'usr-institution-1',
      'Prof. Ananya Sen',
      null,
      0,
      'Awaiting Admission Approval',
      0,
      5,
      null,
      '2026-09-11T10:15:00Z',
      'Lab workstation 12 allocated pending dean approval.',
      0
    );

    insertMenteeCourse.run(
      'mce-03',
      'lp-inst-3',
      'Applied Machine Learning & MLOps in Production',
      'Hybrid',
      'usr-student-4',
      'Aarav Patel',
      'aarav.patel@apextech.ac.in',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      'Artificial Intelligence & Data Science',
      '1AP23AI019',
      8.15,
      '2026-09-10T09:00:00Z',
      'Desire to master cloud containerized model deployment and pipeline monitoring for AI research fellowship.',
      'pending',
      null,
      'usr-institution-1',
      'Dr. Vikramaditya Rao',
      null,
      0,
      'Awaiting Admission Approval',
      0,
      6,
      null,
      '2026-09-11T12:00:00Z',
      'Prerequisite Python score verified.',
      0
    );

    // Approved & Progressing Mentees
    insertMenteeCourse.run(
      'mce-04',
      'lp-inst-1',
      'Full-Stack Web Engineering with React & Node',
      'Live Online',
      'usr-student-1',
      'Ananya Rao',
      'student@careersync.com',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'Computer Science & Engineering',
      '1AP22CS014',
      9.24,
      '2026-08-15T10:00:00Z',
      'Targeting product company software roles; aiming to master full-stack deployment and asynchronous message queues.',
      'approved',
      '2026-08-16T11:00:00Z',
      'usr-institution-1',
      'Dr. Ramesh Sharma',
      '2026-08-18T09:00:00Z',
      75,
      'Module 4: Security, JWT & Dockerized Deployment',
      4,
      5,
      94.5,
      '2026-09-11T18:45:00Z',
      'Exceptional backend code modularity and clean architectural abstraction. Ready for capstone evaluation.',
      0
    );

    insertMenteeCourse.run(
      'mce-05',
      'lp-inst-3',
      'Applied Machine Learning & MLOps in Production',
      'Hybrid',
      'usr-student-5',
      'Devansh Gupta',
      'devansh.gupta@apextech.ac.in',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      'Artificial Intelligence & Data Science',
      '1AP22AI031',
      8.78,
      '2026-08-12T11:00:00Z',
      'Building predictive data modeling and MLOps tools for healthcare diagnostics.',
      'approved',
      '2026-08-13T12:00:00Z',
      'usr-institution-1',
      'Dr. Vikramaditya Rao',
      '2026-08-15T10:00:00Z',
      50,
      'Module 2: Deep Neural Networks with PyTorch',
      3,
      6,
      88.0,
      '2026-09-10T14:20:00Z',
      'Solid intuition for loss landscapes and gradient optimizers. Advised to implement learning rate schedulers.',
      0
    );

    insertMenteeCourse.run(
      'mce-06',
      'lp-inst-2',
      'Embedded Systems & IoT Robotics Workshop',
      'Classroom',
      'usr-student-6',
      'Sneha Reddy',
      'sneha.reddy@apextech.ac.in',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      'Electronics & Communication',
      '1AP22EC058',
      9.42,
      '2026-08-01T09:30:00Z',
      'Passionate about automotive robotics, RTOS kernel hacking, and CAN bus vehicle telemetry.',
      'approved',
      '2026-08-02T10:00:00Z',
      'usr-institution-1',
      'Prof. Ananya Sen',
      '2026-08-05T09:00:00Z',
      100,
      'Module 3: FreeRTOS Multitasking & Capstone Rover',
      5,
      5,
      98.0,
      '2026-09-09T17:30:00Z',
      'Highest distinction in physical hardware demo. Rover completed obstacle avoidance course in record time. Certified!',
      1
    );

    insertMenteeCourse.run(
      'mce-07',
      'lp-inst-4',
      'Competitive Programming & Advanced Data Structures',
      'Live Online',
      'usr-student-7',
      'Kavya Menon',
      'kavya.menon@apextech.ac.in',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      'Information Science & Engineering',
      '1AP23IS027',
      8.35,
      '2026-08-20T16:00:00Z',
      'Preparing for Tier-1 coding screening rounds; focusing on dynamic programming and graph trees.',
      'approved',
      '2026-08-21T09:30:00Z',
      'usr-institution-1',
      'Prof. Sandeep Kulkarni',
      '2026-08-22T17:00:00Z',
      35,
      'Module 2: Graph Algorithms & Shortest Path',
      2,
      6,
      82.5,
      '2026-09-11T20:10:00Z',
      'Good progress on DP on trees; encouraged to join weekly Sunday contest simulation.',
      0
    );
  }
}
