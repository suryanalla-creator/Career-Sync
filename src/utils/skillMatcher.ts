import { SkillMatchResult } from '../types';

/**
 * Normalizes a skill string for comparison
 */
function clean(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s/+&#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Related skill keywords map to allow intelligent matching across synonymous or composite skill terms
 */
const SKILL_ALIASES: Record<string, string[]> = {
  python: ['python', 'py', 'django', 'fastapi', 'flask', 'ai/ml systems', 'machine learning', 'pytorch', 'tensorflow', 'pandas', 'numpy'],
  sql: ['sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'sql & relational dbs', 'relational database', 'data modeling', 'database', 'rdbms'],
  postgresql: ['postgresql', 'postgres', 'sql', 'sql & relational dbs', 'rdbms'],
  mysql: ['mysql', 'sql', 'sql & relational dbs', 'relational database'],
  mongodb: ['mongodb', 'nosql', 'document db', 'database'],
  redis: ['redis', 'caching', 'in-memory db', 'nosql'],
  react: ['react', 'react.js', 'react & typescript', 'reactjs', 'frontend', 'next.js'],
  'next.js': ['next.js', 'nextjs', 'react', 'frontend', 'ssr'],
  typescript: ['typescript', 'ts', 'react & typescript', 'javascript'],
  javascript: ['javascript', 'js', 'es6', 'frontend', 'react', 'typescript', 'node.js'],
  'node.js': ['node.js', 'nodejs', 'node', 'express', 'backend', 'full stack'],
  express: ['express', 'node.js', 'backend', 'restful apis'],
  'c++': ['c++', 'cpp', 'c/c++', 'object-oriented programming', 'dsa', 'data structures'],
  java: ['java', 'core java', 'spring boot', 'spring', 'oop', 'dsa'],
  'spring boot': ['spring boot', 'spring', 'java', 'backend', 'microservices'],
  docker: ['docker', 'docker & kubernetes', 'containerization', 'docker & containerization', 'containers', 'devops'],
  kubernetes: ['kubernetes', 'k8s', 'docker & kubernetes', 'container orchestration', 'cloud & devops'],
  aws: ['aws', 'amazon web services', 'azure / aws', 'cloud infrastructure (aws/gcp)', 'aws cloud foundations', 'cloud', 'cloud computing'],
  azure: ['azure', 'azure / aws', 'cloud infrastructure (aws/gcp)', 'cloud', 'cloud computing'],
  gcp: ['gcp', 'google cloud', 'cloud infrastructure (aws/gcp)', 'cloud'],
  'cloud infrastructure': ['cloud infrastructure (aws/gcp)', 'aws', 'azure', 'gcp', 'cloud devops', 'cloud'],
  'system design': ['system design & scalability', 'microservices & system design', 'microservices', 'distributed systems', 'system architecture'],
  microservices: ['microservices & system design', 'system design & scalability', 'microservices', 'distributed systems'],
  'ci/cd': ['ci/cd pipelines', 'ci/cd', 'devops', 'continuous integration', 'github actions', 'jenkins'],
  fastapi: ['fastapi', 'restful apis', 'rest apis', 'python', 'backend'],
  'restful apis': ['restful apis', 'rest apis', 'api', 'fastapi', 'backend', 'api development'],
  pytorch: ['pytorch', 'machine learning', 'ai/ml systems', 'deep learning', 'neural networks'],
  tensorflow: ['tensorflow', 'machine learning', 'deep learning', 'ai/ml systems', 'keras'],
  'machine learning': ['machine learning', 'ai/ml systems', 'pytorch', 'tensorflow', 'data analytics', 'data science', 'scikit-learn'],
  'deep learning': ['deep learning', 'neural networks', 'pytorch', 'tensorflow', 'machine learning'],
  'natural language processing': ['natural language processing', 'nlp', 'llm', 'transformers', 'genai'],
  'genai': ['generative ai', 'genai', 'llm', 'large language models', 'prompt engineering', 'ai/ml systems'],
  linux: ['linux', 'bash', 'unix', 'shell scripting', 'operating systems'],
  'tailwind css': ['tailwind css', 'tailwind', 'css3', 'css', 'frontend'],
  css3: ['css3', 'css', 'tailwind css', 'frontend'],
  html5: ['html5', 'html', 'frontend', 'web development'],
  'data analytics': ['data analytics', 'data analysis', 'sql', 'python', 'business intelligence', 'power bi', 'tableau'],
  'power bi': ['power bi', 'business intelligence', 'data analytics', 'dax', 'dashboarding'],
  'data engineering': ['data engineering', 'python', 'sql', 'etl pipelines', 'data modeling', 'spark', 'data pipelines'],
  'team communication': ['team communication', 'communication', 'leadership', 'soft skills', 'presentation'],
  communication: ['communication', 'team communication', 'soft skills', 'presentation'],
  'problem solving': ['problem solving', 'dsa', 'data structures & algorithms', 'analytical thinking'],
  dsa: ['dsa', 'data structures & algorithms', 'problem solving', 'competitive programming', 'c++', 'java', 'python'],
  git: ['git', 'version control', 'github', 'gitlab', 'collaborative development']
};

/**
 * Checks if a required skill is matched by any skill in the candidate skills list
 */
export function isSkillEquivalent(requiredSkill: string, candidateSkill: string): boolean {
  if (!requiredSkill || !candidateSkill) return false;
  const reqClean = clean(requiredSkill);
  const candClean = clean(candidateSkill);

  // Exact match
  if (reqClean === candClean) return true;

  // Substring match
  if (reqClean.length >= 3 && candClean.includes(reqClean)) return true;
  if (candClean.length >= 3 && reqClean.includes(candClean)) return true;

  // Check alias map
  for (const [key, aliases] of Object.entries(SKILL_ALIASES)) {
    const keyClean = clean(key);
    const reqMatchesKey = reqClean === keyClean || reqClean.includes(keyClean) || aliases.some(a => reqClean === clean(a) || reqClean.includes(clean(a)));
    const candMatchesKey = candClean === keyClean || candClean.includes(keyClean) || aliases.some(a => candClean === clean(a) || candClean.includes(clean(a)));

    if (reqMatchesKey && candMatchesKey) return true;
  }

  // Token overlap (e.g. "Docker & Containerization" vs "Docker")
  const reqTokens = reqClean.split(' ').filter(t => t.length > 2);
  const candTokens = candClean.split(' ').filter(t => t.length > 2);
  const overlap = reqTokens.some(rt => candTokens.includes(rt));
  if (overlap && (reqTokens.length <= 2 || candTokens.length <= 2)) return true;

  return false;
}

/**
 * Calculates an accurate, mathematically grounded skill match for an opportunity
 */
export function calculateAccurateMatch(
  requiredSkills: string[],
  preferredSkills: string[] = [],
  studentSkills: string[] = [],
  verifiedSkills: string[] = []
): SkillMatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      verifiedMatches: [],
      totalRequired: 0
    };
  }

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const verifiedMatches: string[] = [];

  for (const req of requiredSkills) {
    // Check if verified with a certificate first
    const isVerified = verifiedSkills.some(v => isSkillEquivalent(req, v));
    if (isVerified) {
      verifiedMatches.push(req);
      matchedSkills.push(req);
      continue;
    }

    // Check if present in base student skills
    const isMatched = studentSkills.some(s => isSkillEquivalent(req, s));
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  const totalRequired = requiredSkills.length;
  const matchedCount = matchedSkills.length;

  // Base score from required skills: (matched / total) * 100
  let calculatedScore = Math.round((matchedCount / totalRequired) * 100);

  // Bonus for verified certificates: +2% per verified skill (up to +6%)
  const verifiedBonus = Math.min(6, verifiedMatches.length * 2);

  // Preferred skills bonus: +2% for each preferred skill matched (up to +4%)
  let preferredBonus = 0;
  if (preferredSkills && preferredSkills.length > 0) {
    const allKnownSkills = [...studentSkills, ...verifiedSkills];
    const preferredMatches = preferredSkills.filter(pref =>
      allKnownSkills.some(k => isSkillEquivalent(pref, k))
    ).length;
    preferredBonus = Math.min(4, preferredMatches * 2);
  }

  const finalScore = Math.min(100, Math.max(0, calculatedScore + verifiedBonus + preferredBonus));

  return {
    matchPercentage: finalScore,
    matchedSkills,
    missingSkills,
    verifiedMatches,
    totalRequired
  };
}

/**
 * Calculates profile completion percentage with high mathematical precision
 */
export function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.name && profile.name.trim().length > 0) score += 15;
  if (profile.bio && profile.bio.trim().length > 20) score += 15;
  else if (profile.bio && profile.bio.trim().length > 0) score += 8;
  if (profile.phone && profile.phone.trim().length > 5) score += 10;
  if (profile.location && profile.location.trim().length > 0) score += 10;
  if (profile.college && profile.college.trim().length > 0) score += 10;
  if (profile.department && profile.department.trim().length > 0) score += 10;
  if (profile.socials?.github || profile.github) score += 10;
  if (profile.socials?.linkedin || profile.linkedin) score += 10;
  if (profile.resumeUrl || profile.portfolioFileName || profile.portfolioUrl) score += 10;
  return Math.min(100, Math.max(10, score));
}

export interface MissingProfileItem {
  id: string;
  label: string;
  description: string;
  category: 'Personal' | 'Academic' | 'Professional' | 'Links';
  points: number;
}

/**
 * Returns exact items student needs to complete to achieve 100% profile strength
 */
export function getMissingProfileItems(profile: any): MissingProfileItem[] {
  if (!profile) return [];
  const missing: MissingProfileItem[] = [];

  if (!profile.bio || profile.bio.trim().length < 20) {
    missing.push({
      id: 'bio',
      label: 'Professional Bio',
      description: 'Add a 2-3 sentence career summary (min 20 characters)',
      category: 'Personal',
      points: 15
    });
  }
  if (!profile.resumeUrl && !profile.portfolioFileName && !profile.portfolioUrl) {
    missing.push({
      id: 'resume',
      label: 'ATS Resume / CV',
      description: 'Upload your verified resume PDF or portfolio document',
      category: 'Professional',
      points: 10
    });
  }
  if (!profile.phone || profile.phone.trim().length <= 5) {
    missing.push({
      id: 'phone',
      label: 'Mobile Contact',
      description: 'Add your direct phone number for recruiter calls & SMS updates',
      category: 'Personal',
      points: 10
    });
  }
  if (!profile.location || profile.location.trim().length === 0) {
    missing.push({
      id: 'location',
      label: 'City & Location',
      description: 'Specify your current city or relocation preferences',
      category: 'Personal',
      points: 10
    });
  }
  if (!profile.college || profile.college.trim().length === 0) {
    missing.push({
      id: 'college',
      label: 'College / University',
      description: 'Add your university or autonomous institute name',
      category: 'Academic',
      points: 10
    });
  }
  if (!profile.department || profile.department.trim().length === 0) {
    missing.push({
      id: 'department',
      label: 'Department / Branch',
      description: 'Select your standardized degree specialization',
      category: 'Academic',
      points: 10
    });
  }
  if (!profile.socials?.github && !profile.github) {
    missing.push({
      id: 'github',
      label: 'GitHub Profile',
      description: 'Connect your GitHub repository to show proof of code',
      category: 'Links',
      points: 10
    });
  }
  if (!profile.socials?.linkedin && !profile.linkedin) {
    missing.push({
      id: 'linkedin',
      label: 'LinkedIn Profile',
      description: 'Connect your professional network profile URL',
      category: 'Links',
      points: 10
    });
  }

  return missing;
}

/**
 * Calculates comprehensive Industry Readiness Score (weighted combination)
 */
export function calculateReadinessScore(
  skillMatchRate: number,
  assessmentOverall?: number,
  industryReadinessIndex: number = 0,
  hasCompletedAssessment: boolean = false
): number {
  if (hasCompletedAssessment && typeof assessmentOverall === 'number') {
    // 50% Skill Alignment + 30% Proctored Assessment Performance + 20% Academic & Profile Readiness
    return Math.min(100, Math.max(0, Math.round((skillMatchRate * 0.5) + (assessmentOverall * 0.3) + (industryReadinessIndex * 0.2))));
  }
  if (industryReadinessIndex > 0) {
    // 60% Skill Alignment + 40% Industry Benchmark Readiness
    return Math.min(100, Math.max(0, Math.round((skillMatchRate * 0.6) + (industryReadinessIndex * 0.4))));
  }
  // Real authentic skill alignment when unassessed
  return Math.min(100, Math.max(0, Math.round(skillMatchRate)));
}

/**
 * Calculates career role alignment and skill gap breakdown
 */
export function calculateRoleAlignment(roleRequiredSkills: string[], possessedSkills: string[]) {
  if (!roleRequiredSkills || roleRequiredSkills.length === 0) {
    return { alignmentPercentage: 100, possessedSkillsCount: 0, totalRequired: 0, gapSkills: [] };
  }
  const possessed = roleRequiredSkills.filter(req =>
    possessedSkills.some(have => have.toLowerCase() === req.toLowerCase() || isSkillEquivalent(req, have))
  );
  const gaps = roleRequiredSkills.filter(req =>
    !possessedSkills.some(have => have.toLowerCase() === req.toLowerCase() || isSkillEquivalent(req, have))
  );
  const percentage = Math.round((possessed.length / roleRequiredSkills.length) * 100);
  return {
    alignmentPercentage: percentage,
    possessedSkillsCount: possessed.length,
    totalRequired: roleRequiredSkills.length,
    gapSkills: gaps
  };
}

