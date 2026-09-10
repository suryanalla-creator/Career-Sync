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
      eligible_branches TEXT
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

  seedDataIfEmpty();
  seedExtraTablesIfEmpty();
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
    'collaboration_initiatives'
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
    'opp-1',
    'internship',
    'AI/ML Engineering Intern',
    'TechNova Solutions',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    'Hyderabad, India',
    'Hybrid',
    JSON.stringify(['Python', 'PyTorch', 'SQL', 'FastAPI', 'Machine Learning']),
    JSON.stringify(['Docker', 'Vector Embeddings', 'Git']),
    '₹25,000 / month',
    null,
    '6 Months (Summer 2026)',
    '25 Sep 2026',
    94,
    'TechNova Solutions is looking for ambitious AI/ML interns to assist our enterprise AI innovation team in developing generative assistants and predictive models.',
    JSON.stringify([
      'Build and fine-tune NLP models for unstructured document classification',
      'Optimize data pipelines fetching data from PostgreSQL and Snowflake',
      'Implement FastAPI microservices wrapped in Docker containers'
    ]),
    'B.Tech in Computer Science & Engineering, AI & Data Science, or Information Technology graduating in 2026/2027 with minimum 7.5 CGPA.',
    142,
    '2 days ago',
    JSON.stringify({ size: '1,200+ employees', industry: 'Enterprise Software & AI', website: 'https://technovasolutions.io', rating: 4.6 }),
    'usr-industry-1',
    JSON.stringify(['ai-ml-engineer', 'data-scientist', 'nlp-engineer']),
    JSON.stringify(['AI & Machine Learning Engineer', 'Data Scientist', 'GenAI & NLP Specialist']),
    JSON.stringify(['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Information Technology'])
  );

  insertOpp.run(
    'opp-2',
    'job',
    'Software Development Engineer - I (Frontend/Full Stack)',
    'TechNova Solutions',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    'Bangalore, India',
    'Hybrid',
    JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS']),
    JSON.stringify(['Next.js', 'GraphQL', 'AWS']),
    '₹14,50,000 - ₹18,00,000 / annum',
    'Fresher to 1 Year',
    null,
    '15 Oct 2026',
    92,
    'Join our flagship SaaS platform team architecting low-latency dashboard interfaces and high-throughput collaboration workflows.',
    JSON.stringify([
      'Build responsive, highly accessible React interfaces with TypeScript and Tailwind CSS',
      'Design clean REST and GraphQL backend services in Node.js',
      'Write comprehensive unit and integration tests with Jest and Playwright'
    ]),
    'B.Tech in Computer Science & Engineering, Information Technology, or AI & Data Science with strong algorithmic foundation.',
    310,
    '3 days ago',
    JSON.stringify({ size: '1,200+ employees', industry: 'Enterprise Software & AI', website: 'https://technovasolutions.io', rating: 4.6 }),
    'usr-industry-1',
    JSON.stringify(['fullstack-engineer', 'frontend-engineer', 'backend-engineer']),
    JSON.stringify(['Full Stack Software Engineer', 'Frontend Engineer', 'Backend Systems Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'])
  );

  insertOpp.run(
    'opp-3',
    'internship',
    'Cloud DevOps & Platform Intern',
    'Microsoft',
    'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?w=100&auto=format&fit=crop&q=80',
    'Hyderabad / Bangalore',
    'Hybrid',
    JSON.stringify(['Linux', 'Python', 'Azure / AWS', 'Docker', 'Networking']),
    JSON.stringify(['Terraform', 'Kubernetes', 'GitHub Actions']),
    '₹50,000 / month',
    null,
    '3 Months (May - July 2026)',
    '30 Sep 2026',
    88,
    'Gain hands-on immersion with Azure Cloud Infrastructure engineering teams building planetary-scale developer platforms.',
    JSON.stringify([
      'Automate cloud infrastructure testing pipelines using Python and Bash scripts',
      'Construct CI/CD deployment workflows with GitHub Actions',
      'Monitor container clusters with Prometheus and Grafana dashboards'
    ]),
    'B.Tech in CSE, IT, or ECE graduating in 2026/2027 with minimum 8.0 CGPA and solid understanding of OS and Networking.',
    520,
    '4 days ago',
    JSON.stringify({ size: '220,000+ employees', industry: 'Cloud & Enterprise Computing', website: 'https://microsoft.com', rating: 4.8 }),
    null,
    JSON.stringify(['cloud-devops-engineer', 'site-reliability-engineer']),
    JSON.stringify(['Cloud & DevOps Engineer', 'Site Reliability Engineer (SRE)']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'])
  );

  insertOpp.run(
    'opp-4',
    'job',
    'Associate Data & Analytics Consultant',
    'Deloitte',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    'Mumbai / Gurgaon',
    'On-site',
    JSON.stringify(['SQL', 'Power BI', 'Python', 'Data Modeling', 'Business Communication']),
    JSON.stringify(['Snowflake', 'Alteryx', 'Tableau']),
    '₹11,00,000 - ₹13,50,000 / annum',
    'Campus Hire (2026 Batch)',
    null,
    '20 Oct 2026',
    85,
    'Partner with Fortune 500 leadership to transform fragmented corporate telemetry into interactive executive BI cockpits.',
    JSON.stringify([
      'Design dimensional schemas and SQL transformation pipelines',
      'Build executive dashboards in Power BI with drill-through telemetry',
      'Present analytical findings to senior client leadership teams'
    ]),
    'B.Tech across CSE, IT, AI & DS, ECE or any engineering branch with strong analytical skills and minimum 7.0 CGPA.',
    412,
    '1 week ago',
    JSON.stringify({ size: '400,000+ employees', industry: 'Management Consulting & Analytics', website: 'https://deloitte.com', rating: 4.4 }),
    null,
    JSON.stringify(['data-scientist', 'data-engineer']),
    JSON.stringify(['Data Scientist', 'Big Data Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science', 'Electronics & Communication Engineering', 'All B.Tech Branches'])
  );

  insertOpp.run(
    'opp-5',
    'job',
    'Cybersecurity Threat Analyst',
    'Cisco Systems',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    'Bangalore, India',
    'Hybrid',
    JSON.stringify(['Network Security', 'Linux', 'Python', 'Wireshark', 'SIEM Tools']),
    JSON.stringify(['Penetration Testing', 'Cryptography', 'CompTIA Security+']),
    '₹13,00,000 - ₹16,50,000 / annum',
    'Fresher to 1 Year',
    null,
    '05 Nov 2026',
    74,
    'Defend critical enterprise networks from zero-day exploits, analyze malware telemetry, and configure threat response automations.',
    JSON.stringify([
      'Monitor Security Information and Event Management (SIEM) alerts for anomalies',
      'Perform packet level inspection and forensic incident analysis',
      'Script defensive response automations in Python to patch vulnerabilities'
    ]),
    'B.Tech in Computer Science, Information Technology, or Electronics & Communication Engineering graduating in 2026.',
    220,
    '1 week ago',
    JSON.stringify({ size: '80,000+ employees', industry: 'Networking & Cybersecurity', website: 'https://cisco.com', rating: 4.7 }),
    null,
    JSON.stringify(['cybersecurity-analyst']),
    JSON.stringify(['Cybersecurity Analyst & Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'])
  );

  insertOpp.run(
    'opp-9',
    'job',
    'Full Stack Engineer - Payment Experience',
    'Razorpay',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    'Bangalore / Hybrid',
    'Hybrid',
    JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis']),
    JSON.stringify(['Next.js', 'Kafka', 'Docker']),
    '₹18,00,000 - ₹22,00,000 / annum',
    'Fresher (2026 Batch)',
    null,
    '28 Oct 2026',
    91,
    'Scale payment checkout gateways handling over 10,000 transactions per second. Build resilient UI widgets and secure financial microservices.',
    JSON.stringify([
      'Architect fast, low-friction checkout React components loaded by millions of consumers',
      'Develop idempotent payment processing services with Node.js and PostgreSQL',
      'Set up caching layers and circuit breakers with Redis'
    ]),
    'B.Tech in CSE or IT with high proficiency in JavaScript/TypeScript and database systems.',
    284,
    '4 days ago',
    JSON.stringify({ size: '3,000+ employees', industry: 'Fintech & Payments', website: 'https://razorpay.com', rating: 4.5 }),
    null,
    JSON.stringify(['fullstack-engineer', 'backend-engineer', 'frontend-engineer']),
    JSON.stringify(['Full Stack Software Engineer', 'Backend Systems Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology'])
  );

  insertOpp.run(
    'opp-10',
    'internship',
    'Frontend Engineering Intern (Consumer Web)',
    'Swiggy',
    'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=100&auto=format&fit=crop&q=80',
    'Bangalore, India',
    'Hybrid',
    JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Web Performance']),
    JSON.stringify(['Next.js', 'Jest', 'Figma to Code']),
    '₹40,000 / month',
    null,
    '6 Months (Jan - June 2026)',
    '12 Oct 2026',
    95,
    'Work alongside leading consumer engineers optimizing real-time order tracking, sub-second web render times, and responsive mobile-web experiences.',
    JSON.stringify([
      'Build performant React components with sub-second First Contentful Paint',
      'Manage global state with Redux Toolkit and optimize re-renders',
      'Implement accessible design system components adhering to WCAG 2.1'
    ]),
    'B.Tech in Computer Science & Engineering, Information Technology, or AI & Data Science graduating in 2026 or 2027.',
    380,
    '3 days ago',
    JSON.stringify({ size: '6,000+ employees', industry: 'Hyperlocal Delivery & Consumer Tech', website: 'https://swiggy.com', rating: 4.4 }),
    null,
    JSON.stringify(['frontend-engineer', 'fullstack-engineer', 'ui-ux-designer']),
    JSON.stringify(['Frontend Engineer - React & UI', 'Full Stack Software Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'])
  );

  insertOpp.run(
    'opp-11',
    'job',
    'Associate Data Scientist',
    'Fractal Analytics',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    'Mumbai / Bangalore',
    'Hybrid',
    JSON.stringify(['Python', 'SQL', 'Scikit-Learn', 'Statistics', 'Data Visualization']),
    JSON.stringify(['PyTorch', 'MLflow', 'Tableau']),
    '₹12,00,000 - ₹15,00,000 / annum',
    'Campus Hire (2026 Batch)',
    null,
    '22 Oct 2026',
    90,
    'Build predictive machine learning models and experimentation pipelines for Fortune 500 healthcare and retail clients.',
    JSON.stringify([
      'Perform exploratory data analysis and feature engineering on petabyte datasets',
      'Train, validate, and benchmark supervised and unsupervised ML algorithms',
      'Collaborate with engineering teams to deploy models via REST APIs'
    ]),
    'B.Tech in CSE, AI & DS, IT, or ECE with strong statistical foundation and coding skills.',
    215,
    '5 days ago',
    JSON.stringify({ size: '4,500+ employees', industry: 'AI & Enterprise Analytics', website: 'https://fractal.ai', rating: 4.5 }),
    null,
    JSON.stringify(['data-scientist', 'ai-ml-engineer']),
    JSON.stringify(['Data Scientist', 'AI & Machine Learning Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Information Technology', 'Electronics & Communication Engineering'])
  );

  insertOpp.run(
    'opp-12',
    'internship',
    'Generative AI & LLM Research Intern',
    'Google Research India',
    'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    'Bangalore, India',
    'On-site',
    JSON.stringify(['Python', 'PyTorch', 'Transformers', 'LLMs', 'Algorithms']),
    JSON.stringify(['JAX', 'CUDA', 'Research Papers']),
    '₹75,000 / month',
    null,
    '6 Months',
    '01 Nov 2026',
    86,
    'Investigate reasoning capabilities, multilingual alignment, and retrieval-augmented generation in next-generation transformer models.',
    JSON.stringify([
      'Conduct rigorous benchmarks on domain-specific LLM reasoning datasets',
      'Implement prompt distillation and parameter-efficient fine-tuning (PEFT)',
      'Publish research findings in top-tier conferences (NeurIPS/ACL/EMNLP)'
    ]),
    'B.Tech/Dual Degree students in CSE or AI & Data Science with proven deep learning projects and high academic standing (>8.5 CGPA).',
    460,
    '1 week ago',
    JSON.stringify({ size: '180,000+ employees', industry: 'AI & Technology Research', website: 'https://research.google', rating: 4.9 }),
    null,
    JSON.stringify(['nlp-engineer', 'ai-ml-engineer', 'data-scientist']),
    JSON.stringify(['GenAI & NLP Specialist', 'AI & Machine Learning Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Artificial Intelligence & Data Science'])
  );

  insertOpp.run(
    'opp-15',
    'internship',
    'Embedded Firmware & Microcontroller Intern',
    'Texas Instruments',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    'Bangalore, India',
    'On-site',
    JSON.stringify(['Embedded C', 'ARM Cortex-M', 'I2C/SPI/UART', 'RTOS', 'Oscilloscopes']),
    JSON.stringify(['C++', 'Python Scripting', 'PCB Debugging']),
    '₹45,000 / month',
    null,
    '6 Months (Summer 2026)',
    '18 Oct 2026',
    84,
    'Work with Texas Instruments microcontroller division developing low-power device drivers, hardware abstraction layers, and sensor interfaces for industrial automation.',
    JSON.stringify([
      'Write low-latency Embedded C peripheral drivers for MSPM0 and SimpleLink processors',
      'Debug bus timing with logic analyzers and oscilloscopes in hardware labs',
      'Implement FreeRTOS task scheduling for multi-sensor data acquisition'
    ]),
    'B.Tech in Electronics & Communication Engineering (ECE), Electrical & Electronics (EEE), or CSE with strong microcontrollers foundation.',
    168,
    '4 days ago',
    JSON.stringify({ size: '30,000+ employees', industry: 'Semiconductor & Embedded Systems', website: 'https://ti.com', rating: 4.6 }),
    null,
    JSON.stringify(['embedded-iot-engineer']),
    JSON.stringify(['Embedded Systems & IoT Engineer']),
    JSON.stringify(['Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Computer Science & Engineering'])
  );

  insertOpp.run(
    'opp-16',
    'job',
    'Associate VLSI Design & Verification Engineer',
    'Qualcomm',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80',
    'Hyderabad / Bangalore',
    'On-site',
    JSON.stringify(['SystemVerilog', 'Verilog', 'Digital Electronics', 'UVM', 'FPGA']),
    JSON.stringify(['Python', 'Perl', 'Static Timing Analysis (STA)']),
    '₹16,00,000 - ₹21,00,000 / annum',
    'Fresher (Campus 2026)',
    null,
    '30 Oct 2026',
    82,
    'Join Qualcomm Snapdragon silicon engineering teams designing and verifying high-speed digital blocks, cellular modems, and low-power ASIC cores.',
    JSON.stringify([
      'Develop SystemVerilog and UVM testbenches for IP block verification',
      'Execute code coverage and functional coverage simulations',
      'Analyze logic synthesis and timing constraint closure with EDA tools'
    ]),
    'B.Tech in Electronics & Communication Engineering (ECE) or Electrical & Electronics Engineering (EEE) with minimum 7.5 CGPA.',
    230,
    '1 week ago',
    JSON.stringify({ size: '50,000+ employees', industry: 'Wireless Semiconductors & Telecommunications', website: 'https://qualcomm.com', rating: 4.6 }),
    null,
    JSON.stringify(['vlsi-engineer', 'embedded-iot-engineer']),
    JSON.stringify(['VLSI & Silicon Design Engineer', 'Embedded Systems & IoT Engineer']),
    JSON.stringify(['Electronics & Communication Engineering', 'Electrical & Electronics Engineering'])
  );

  insertOpp.run(
    'opp-17',
    'internship',
    'IoT Systems & Connected Mobility Intern',
    'Bosch Global Software Technologies',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80',
    'Bangalore / Coimbatore',
    'Hybrid',
    JSON.stringify(['Embedded C', 'IoT Protocols (MQTT/CoAP)', 'Python', 'Sensors', 'Linux']),
    JSON.stringify(['Bluetooth Low Energy (BLE)', 'AWS IoT Core', 'CAN Bus']),
    '₹35,000 / month',
    null,
    '6 Months (Summer 2026)',
    '20 Oct 2026',
    86,
    'Engineer edge telematics gateway firmware connecting electric two-wheelers and industrial machines to cloud telemetry dashboards.',
    JSON.stringify([
      'Implement MQTT telemetry publish-subscribe stacks on ESP32 and STM32 chips',
      'Interface temperature, vibration, and CAN bus sensors with low power sleep cycles',
      'Build end-to-end integration tests with AWS IoT Core message brokers'
    ]),
    'B.Tech in ECE, EEE, or CSE graduating in 2026 or 2027.',
    195,
    '5 days ago',
    JSON.stringify({ size: '35,000+ employees', industry: 'Automotive & Industrial IoT', website: 'https://bosch.in', rating: 4.5 }),
    null,
    JSON.stringify(['embedded-iot-engineer', 'robotics-engineer']),
    JSON.stringify(['Embedded Systems & IoT Engineer', 'Robotics & Automation Engineer']),
    JSON.stringify(['Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Computer Science & Engineering'])
  );

  insertOpp.run(
    'opp-19',
    'job',
    'Robotics & Automation Engineer - EV Manufacturing',
    'Tata Motors Electric Mobility',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    'Pune / Sanand',
    'On-site',
    JSON.stringify(['Robotics (ROS/ROS2)', 'PLC Programming', 'MATLAB/Simulink', 'Python', 'Kinematics']),
    JSON.stringify(['Computer Vision', 'SCADA', 'Industrial Sensors']),
    '₹10,50,000 - ₹13,50,000 / annum',
    'Fresher (Campus 2026)',
    null,
    '08 Nov 2026',
    80,
    'Program robotic arms, automated guided vehicles (AGVs), and battery assembly lines for India’s premier electric vehicle manufacturing plants.',
    JSON.stringify([
      'Program and calibrate 6-axis KUKA/ABB robotic arms on EV battery pack assembly lines',
      'Implement ROS2 path planning and obstacle avoidance algorithms for warehouse AGVs',
      'Optimize cycle times and safety interlocks with Siemens PLCs'
    ]),
    'B.Tech in Mechanical Engineering, Electrical & Electronics, Mechatronics, or ECE graduating in 2026 with minimum 7.0 CGPA.',
    154,
    '6 days ago',
    JSON.stringify({ size: '75,000+ employees', industry: 'Automotive & Clean Mobility', website: 'https://tatamotors.com', rating: 4.5 }),
    null,
    JSON.stringify(['robotics-engineer']),
    JSON.stringify(['Robotics & Automation Engineer']),
    JSON.stringify(['Mechanical Engineering', 'Electrical & Electronics Engineering', 'Electronics & Communication Engineering'])
  );

  insertOpp.run(
    'opp-20',
    'internship',
    'Autonomous Vehicle & Battery Telemetry Intern',
    'Ola Electric',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80',
    'Bangalore / FutureFactory Krishnagiri',
    'On-site',
    JSON.stringify(['Python', 'MATLAB', 'Sensor Fusion', 'Battery Management Systems (BMS)', 'CAN Bus']),
    JSON.stringify(['C++', 'Machine Learning', 'Thermal Simulation']),
    '₹30,000 / month',
    null,
    '6 Months (Summer 2026)',
    '24 Oct 2026',
    85,
    'Work with battery algorithm research teams formulating state-of-charge (SoC) estimation and thermal runaway early warning models.',
    JSON.stringify([
      'Analyze cell temperature and voltage telemetry from hundreds of fleet vehicles',
      'Develop Kalman filter estimators for accurate State of Charge tracking',
      'Perform hardware-in-the-loop (HIL) battery degradation testing'
    ]),
    'B.Tech in Mechanical Engineering, Electrical & Electronics Engineering, or CSE graduating in 2026/2027.',
    172,
    '5 days ago',
    JSON.stringify({ size: '7,000+ employees', industry: 'Electric Vehicles & Clean Tech', website: 'https://olaelectric.com', rating: 4.3 }),
    null,
    JSON.stringify(['robotics-engineer', 'embedded-iot-engineer']),
    JSON.stringify(['Robotics & Automation Engineer', 'Embedded Systems & IoT Engineer']),
    JSON.stringify(['Mechanical Engineering', 'Electrical & Electronics Engineering', 'Computer Science & Engineering'])
  );

  insertOpp.run(
    'opp-22',
    'job',
    'Smart Infrastructure & Digital Twin Consultant',
    'L&T Technology Services',
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=100&auto=format&fit=crop&q=80',
    'Chennai / Mumbai',
    'Hybrid',
    JSON.stringify(['BIM (Revit/Navisworks)', 'GIS Mapping', 'AutoCAD', 'Python Scripting', 'Project Management']),
    JSON.stringify(['IoT Sensor Integration', 'SQL', 'Digital Twins']),
    '₹8,50,000 - ₹11,00,000 / annum',
    'Fresher (Campus 2026)',
    null,
    '15 Nov 2026',
    78,
    'Transform conventional urban civil infrastructure into connected smart cities utilizing 3D Building Information Modeling (BIM) and spatial GIS analytics.',
    JSON.stringify([
      'Construct federated 3D BIM models for metro rail and airport terminals',
      'Perform clash detection and construction sequencing in Navisworks',
      'Link smart utility sensors with GIS map dashboards for municipal authorities'
    ]),
    'B.Tech in Civil Engineering, Environmental Engineering, or allied engineering disciplines with strong CAD/BIM coursework.',
    135,
    '1 week ago',
    JSON.stringify({ size: '22,000+ employees', industry: 'Engineering R&D & Smart Infrastructure', website: 'https://ltts.com', rating: 4.4 }),
    null,
    JSON.stringify(['product-manager']),
    JSON.stringify(['Associate Product Manager - APM']),
    JSON.stringify(['Civil Engineering', 'Computer Science & Engineering', 'All B.Tech Branches'])
  );

  insertOpp.run(
    'opp-23',
    'internship',
    'Structural BIM & Digital Construction Intern',
    'Afcons Infrastructure Ltd',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=100&auto=format&fit=crop&q=80',
    'Mumbai / Site Projects',
    'On-site',
    JSON.stringify(['AutoCAD', 'Revit Structure', 'STAAD.Pro', 'Structural Analysis', 'Surveying']),
    JSON.stringify(['Civil 3D', 'Drone Photogrammetry', 'Excel Modeling']),
    '₹22,00,0 / month',
    null,
    '4 Months (Summer 2026)',
    '28 Oct 2026',
    81,
    'Immerse on landmark bridge, tunnel, and highway engineering projects utilizing cutting-edge structural modeling and digital construction tools.',
    JSON.stringify([
      'Assist senior structural engineers in STAAD.Pro load analysis and reinforcement detailing',
      'Generate accurate quantity take-offs (BOQ) from Revit Structural models',
      'Participate in on-site quality assurance inspections and concrete curing verification'
    ]),
    'Pre-final and final year B.Tech Civil Engineering students graduating in 2026/2027.',
    98,
    '4 days ago',
    JSON.stringify({ size: '15,000+ employees', industry: 'Infrastructure & Heavy Civil Construction', website: 'https://afcons.com', rating: 4.5 }),
    null,
    JSON.stringify(['product-manager']),
    JSON.stringify(['Associate Product Manager - APM']),
    JSON.stringify(['Civil Engineering'])
  );

  insertOpp.run(
    'opp-24',
    'job',
    'Associate Product Manager (APM Batch 2026)',
    'CRED',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    'Bangalore, India',
    'On-site',
    JSON.stringify(['Product Strategy', 'SQL', 'User Research', 'Data-Driven Decision Making', 'Wireframing']),
    JSON.stringify(['A/B Testing', 'System Design', 'Financial Tech Knowledge']),
    '₹20,00,000 - ₹26,00,000 / annum',
    'Fresher (Graduating 2026)',
    null,
    '05 Nov 2026',
    87,
    'CRED’s flagship APM cohort is seeking high-agency engineering graduates from any branch with sharp first-principles thinking to build premium member rewards and financial commerce features.',
    JSON.stringify([
      'Define product requirement documents (PRDs) for new rewards and financial features',
      'Formulate North Star user metrics and write SQL queries to track funnel drop-offs',
      'Partner daily with engineering, UI/UX design, and compliance leads'
    ]),
    'Graduating B.Tech students across ANY engineering branch (CSE, ECE, ME, Civil, EEE) with proven leadership and structured problem solving.',
    620,
    '3 days ago',
    JSON.stringify({ size: '1,500+ employees', industry: 'Fintech & Consumer Internet', website: 'https://cred.club', rating: 4.7 }),
    null,
    JSON.stringify(['product-manager', 'ui-ux-designer']),
    JSON.stringify(['Associate Product Manager - APM', 'UI/UX Product Designer']),
    JSON.stringify(['All B.Tech Branches', 'Computer Science & Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering', 'Civil Engineering'])
  );

  insertOpp.run(
    'opp-25',
    'internship',
    'UI/UX Product Design Intern',
    'Zoho Corporation',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&auto=format&fit=crop&q=80',
    'Chennai / Tenkasi / Hybrid',
    'Hybrid',
    JSON.stringify(['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems']),
    JSON.stringify(['HTML/CSS', 'Micro-interactions', 'Usability Testing']),
    '₹30,000 / month',
    null,
    '6 Months (Summer 2026)',
    '25 Oct 2026',
    83,
    'Design intuitive, world-class enterprise SaaS interfaces for Zoho suite of cloud software used by over 100 million global users.',
    JSON.stringify([
      'Create high-fidelity interactive prototypes and design specifications in Figma',
      'Conduct 1-on-1 user testing interviews to discover usability bottlenecks',
      'Contribute reusable tokens and components to the unified Zoho Design System'
    ]),
    'B.Tech students from ANY branch with a strong design portfolio demonstrating design thinking and visual craftsmanship.',
    310,
    '4 days ago',
    JSON.stringify({ size: '15,000+ employees', industry: 'Enterprise Cloud SaaS', website: 'https://zoho.com', rating: 4.6 }),
    null,
    JSON.stringify(['ui-ux-designer', 'product-manager']),
    JSON.stringify(['UI/UX Product Designer', 'Associate Product Manager - APM']),
    JSON.stringify(['All B.Tech Branches', 'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'])
  );

  insertOpp.run(
    'opp-26',
    'job',
    'Mobile Application Engineer (iOS & Android)',
    'PhonePe',
    'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=100&auto=format&fit=crop&q=80',
    'Bangalore, India',
    'Hybrid',
    JSON.stringify(['Flutter / React Native', 'Dart / TypeScript', 'Mobile UI', 'REST APIs', 'State Management']),
    JSON.stringify(['Kotlin', 'Swift', 'App Store Deployment']),
    '₹15,00,000 - ₹19,50,000 / annum',
    'Fresher to 1 Year',
    null,
    '10 Nov 2026',
    88,
    'Build fast, rock-solid mobile payment and wealth management journeys deployed to over 500 million registered users.',
    JSON.stringify([
      'Develop pixel-perfect cross-platform mobile screens in Flutter/React Native',
      'Optimize app startup time and minimize APK/IPA binary sizes',
      'Implement offline-first caching and encrypted biometric authentication'
    ]),
    'B.Tech in Computer Science & Engineering, Information Technology, or ECE graduating in 2026.',
    290,
    '5 days ago',
    JSON.stringify({ size: '4,000+ employees', industry: 'Fintech & Digital Commerce', website: 'https://phonepe.com', rating: 4.5 }),
    null,
    JSON.stringify(['mobile-app-developer', 'frontend-engineer']),
    JSON.stringify(['Mobile App Developer - Flutter & React Native', 'Frontend Engineer - React & UI']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'])
  );

  insertOpp.run(
    'opp-27',
    'internship',
    'QA Automation & Reliability Intern',
    'Atlassian',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
    'Bangalore / Remote',
    'Remote',
    JSON.stringify(['Selenium / Cypress / Playwright', 'Python / JavaScript', 'CI/CD', 'API Testing', 'Git']),
    JSON.stringify(['Performance Testing', 'Jira API', 'Docker']),
    '₹55,000 / month',
    null,
    '6 Months (Summer 2026)',
    '20 Oct 2026',
    92,
    'Ensure bulletproof software quality across Jira and Confluence cloud services by constructing end-to-end automated testing pipelines.',
    JSON.stringify([
      'Write reliable end-to-end browser tests in Playwright and Cypress',
      'Construct automated API regression suites integrated into GitHub Actions CI',
      'Conduct load stress testing to identify database query bottlenecks'
    ]),
    'B.Tech in Computer Science or Information Technology graduating in 2026 or 2027.',
    210,
    '1 week ago',
    JSON.stringify({ size: '11,000+ employees', industry: 'Developer Tools & Collaboration Software', website: 'https://atlassian.com', rating: 4.7 }),
    null,
    JSON.stringify(['qa-automation-engineer', 'fullstack-engineer']),
    JSON.stringify(['QA & Test Automation Engineer', 'Full Stack Software Engineer']),
    JSON.stringify(['Computer Science & Engineering', 'Information Technology'])
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
      has_certification, rating, enrolled_count, deadline, description, mode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    'Live Online'
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
    'Live Online'
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
  // Projects, certifications, and internships start empty for authentic student profiles

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
}
