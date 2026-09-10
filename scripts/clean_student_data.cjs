const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = path.join(__dirname, '..', 'server', 'data', 'careersync.db');
if (!fs.existsSync(dbPath)) {
  console.log('Database does not exist yet at:', dbPath);
  process.exit(0);
}

const db = new DatabaseSync(dbPath);

console.log('🧹 Purging fake and pre-given student data from database...');
db.exec('BEGIN TRANSACTION;');

// 1. Reset all student profiles to clean, authentic initial state
db.exec(`
  UPDATE student_profiles 
  SET is_verified = 0,
      readiness_score = 0,
      overall_score = 0,
      technical_score = 0,
      soft_score = 0,
      cgpa = 0,
      profile_completion = 20,
      bio = '',
      career_interests = '[]',
      preferred_job_roles = '[]',
      preferred_industries = '[]',
      resume_url = null,
      socials = '{}';
`);

db.prepare("UPDATE student_profiles SET name = 'Student', phone = '', location = '' WHERE user_id = 'usr-student-1'").run();
db.prepare("UPDATE users SET name = 'Student', phone = '' WHERE id = 'usr-student-1'").run();

// 2. Clear tables holding pre-given student credentials, tests, and submissions
db.exec('DELETE FROM assessment_scores;');
db.exec('DELETE FROM certifications;');
db.exec('DELETE FROM internships;');
db.exec('DELETE FROM projects;');
db.exec("DELETE FROM applications WHERE user_id = 'usr-student-1' OR user_id LIKE 'usr-std%';");
db.exec("DELETE FROM saved_opportunities WHERE user_id = 'usr-student-1';");
db.exec("DELETE FROM program_enrollments WHERE user_id = 'usr-student-1';");
db.exec("DELETE FROM event_registrations WHERE user_id = 'usr-student-1';");
db.exec("DELETE FROM notifications WHERE user_id = 'usr-student-1';");
db.exec("DELETE FROM messages WHERE receiver_id = 'usr-student-1' OR sender_id = 'usr-student-1';");

// 3. Reset candidates table to unverified with 0 scores
db.exec(`
  UPDATE candidates 
  SET is_verified = 0,
      skill_score = 0,
      match_score = 0,
      top_skills = '[]',
      certifications_count = 0,
      internship_experience = 'None',
      status = 'Available',
      cgpa = 0;
`);
db.prepare("UPDATE candidates SET name = 'Student' WHERE id = 'cand-01' OR id = 'cand-001'").run();

db.exec('COMMIT;');
console.log('✅ Purge complete! Verifying database counts:');
console.log('assessment_scores:', db.prepare('SELECT COUNT(*) as c FROM assessment_scores').get());
console.log('certifications:', db.prepare('SELECT COUNT(*) as c FROM certifications').get());
console.log('internships:', db.prepare('SELECT COUNT(*) as c FROM internships').get());
console.log('projects:', db.prepare('SELECT COUNT(*) as c FROM projects').get());
console.log('student applications for demo student:', db.prepare("SELECT COUNT(*) as c FROM applications WHERE user_id = 'usr-student-1'").get());
console.log('demo student profile:', db.prepare("SELECT user_id, name, is_verified, readiness_score, cgpa FROM student_profiles WHERE user_id = 'usr-student-1'").get());
