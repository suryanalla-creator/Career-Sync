import { Opportunity, LearningProgram } from '../types';
import { CAREER_ROLE_OPTIONS, CareerRoleOption } from '../data/careerRolesData';
import { isSkillEquivalent } from './skillMatcher';

export interface BTechBranchInfo {
  id: string;
  name: string;
  shortCode: string;
  aliases: string[];
}

export const BTECH_BRANCHES: BTechBranchInfo[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    shortCode: 'CSE',
    aliases: ['cse', 'computer science', 'computer science & engineering', 'cs', 'comp sci']
  },
  {
    id: 'it',
    name: 'Information Technology',
    shortCode: 'IT',
    aliases: ['it', 'information technology', 'information science', 'ise']
  },
  {
    id: 'aids',
    name: 'Artificial Intelligence & Data Science',
    shortCode: 'AI & DS',
    aliases: ['ai & ds', 'artificial intelligence & data science', 'ai/ml', 'data science', 'ai', 'aiml']
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering',
    shortCode: 'ECE',
    aliases: ['ece', 'electronics & communication', 'electronics & communication engineering', 'electronics']
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics Engineering',
    shortCode: 'EEE',
    aliases: ['eee', 'electrical & electronics', 'electrical engineering', 'electrical']
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    shortCode: 'ME',
    aliases: ['me', 'mechanical engineering', 'mechanical', 'mech', 'mechatronics']
  },
  {
    id: 'ce',
    name: 'Civil Engineering',
    shortCode: 'CE',
    aliases: ['ce', 'civil engineering', 'civil']
  }
];

export interface RoleBranchMatchDetails {
  isCareerRoleMatch: boolean;
  isBranchEligible: boolean;
  roleMatchBadgeText?: string;
  branchEligibilityBadgeText?: string;
  matchGrade: 'perfect' | 'role_match' | 'branch_match' | 'general';
  scoreBoost: number;
}

/**
 * Normalizes a branch string and checks if candidate branch matches any target branch pattern
 */
export function isBranchEquivalent(targetBranch: string, candidateBranch: string): boolean {
  const normTarget = targetBranch.toLowerCase().trim();
  const normCand = candidateBranch.toLowerCase().trim();

  if (normTarget === normCand) return true;
  if (normCand === 'all' || normCand === 'all b.tech branches' || normCand === 'all engineering') return true;
  if (normTarget === 'all' || normTarget === 'all b.tech branches') return true;

  // Find info from BTECH_BRANCHES
  const branchInfo = BTECH_BRANCHES.find(b =>
    b.name.toLowerCase() === normTarget ||
    b.shortCode.toLowerCase() === normTarget ||
    b.aliases.some(a => normTarget.includes(a))
  );

  if (branchInfo) {
    if (branchInfo.aliases.some(a => normCand.includes(a)) || normCand.includes(branchInfo.shortCode.toLowerCase())) {
      return true;
    }
  }

  // Substring fallback
  if (normCand.length >= 3 && normTarget.includes(normCand)) return true;
  if (normTarget.length >= 3 && normCand.includes(normTarget)) return true;

  return false;
}

/**
 * Checks if an opportunity matches the target career role and studied B-Tech branch
 */
export function checkOpportunityRoleAndBranchMatch(
  opp: Opportunity,
  targetRoleId: string,
  studentBranch: string
): RoleBranchMatchDetails {
  const activeRole = CAREER_ROLE_OPTIONS.find(r => r.id === targetRoleId) || CAREER_ROLE_OPTIONS[0];

  // 1. Evaluate Career Role Match
  let isCareerRoleMatch = false;
  let roleMatchBadgeText = undefined;

  if (opp.careerRoleIds && opp.careerRoleIds.includes(targetRoleId)) {
    isCareerRoleMatch = true;
    roleMatchBadgeText = `${activeRole.title} Track`;
  } else if (opp.targetRoles && opp.targetRoles.some(tr => tr.toLowerCase().includes(activeRole.title.toLowerCase()) || activeRole.title.toLowerCase().includes(tr.toLowerCase()))) {
    isCareerRoleMatch = true;
    roleMatchBadgeText = `${activeRole.title} Track`;
  } else {
    // Check title keywords or role skills overlap
    const titleLower = opp.title.toLowerCase();
    const roleTitleWords = activeRole.title.toLowerCase().split(' ').filter(w => w.length > 3 && !['engineer', 'developer', 'specialist'].includes(w));
    const titleMatch = roleTitleWords.some(w => titleLower.includes(w));

    // Check key skills overlap (at least 2 key skills or 40% overlap)
    const requiredLower = opp.requiredSkills.map(s => s.toLowerCase());
    const roleSkillsOverlap = activeRole.keySkills.filter(ks =>
      requiredLower.some(req => req.includes(ks.toLowerCase()) || ks.toLowerCase().includes(req))
    );

    if (titleMatch || roleSkillsOverlap.length >= 2) {
      isCareerRoleMatch = true;
      roleMatchBadgeText = `${activeRole.title} Match`;
    }
  }

  // 2. Evaluate B-Tech Branch Eligibility
  let isBranchEligible = false;
  let branchEligibilityBadgeText = undefined;

  const targetBranch = studentBranch || 'Computer Science & Engineering';

  if (opp.eligibleBranches && opp.eligibleBranches.length > 0) {
    const directBranchMatch = opp.eligibleBranches.some(b => isBranchEquivalent(targetBranch, b));
    if (directBranchMatch) {
      isBranchEligible = true;
      // Get human short names
      if (opp.eligibleBranches.includes('All') || opp.eligibleBranches.includes('All B.Tech Branches')) {
        branchEligibilityBadgeText = 'All B.Tech Branches';
      } else {
        const matchingBranchCodes = opp.eligibleBranches.map(b => {
          const found = BTECH_BRANCHES.find(br => isBranchEquivalent(br.name, b));
          return found ? found.shortCode : b;
        });
        branchEligibilityBadgeText = `B.Tech ${matchingBranchCodes.slice(0, 3).join('/')} Eligible`;
      }
    }
  } else {
    // Check eligibility string text
    const eligLower = (opp.eligibility || '').toLowerCase();
    if (eligLower.includes('all engineering') || eligLower.includes('all branches') || eligLower.includes('open to all')) {
      isBranchEligible = true;
      branchEligibilityBadgeText = 'All B.Tech Branches';
    } else {
      const branchInfo = BTECH_BRANCHES.find(b => isBranchEquivalent(b.name, targetBranch));
      if (branchInfo && branchInfo.aliases.some(a => eligLower.includes(a))) {
        isBranchEligible = true;
        branchEligibilityBadgeText = `B.Tech ${branchInfo.shortCode} Eligible`;
      }
    }
  }

  // If still not determined, default to CSE/IT/All for standard tech roles
  if (!branchEligibilityBadgeText) {
    if (isBranchEligible) {
      branchEligibilityBadgeText = 'Branch Eligible';
    } else if (opp.eligibleBranches && opp.eligibleBranches.length > 0) {
      const codes = opp.eligibleBranches.map(b => {
        const found = BTECH_BRANCHES.find(br => isBranchEquivalent(br.name, b));
        return found ? found.shortCode : b;
      });
      branchEligibilityBadgeText = `Eligible: ${codes.slice(0, 2).join(', ')}`;
    }
  }

  let matchGrade: 'perfect' | 'role_match' | 'branch_match' | 'general' = 'general';
  let scoreBoost = 0;

  if (isCareerRoleMatch && isBranchEligible) {
    matchGrade = 'perfect';
    scoreBoost = 20;
  } else if (isCareerRoleMatch) {
    matchGrade = 'role_match';
    scoreBoost = 12;
  } else if (isBranchEligible) {
    matchGrade = 'branch_match';
    scoreBoost = 6;
  }

  return {
    isCareerRoleMatch,
    isBranchEligible,
    roleMatchBadgeText,
    branchEligibilityBadgeText,
    matchGrade,
    scoreBoost
  };
}

export interface ProgramRoleBranchMatchDetails {
  isCareerRoleMatch: boolean;
  isBranchEligible: boolean;
  bridgesSkillGap: boolean;
  bridgedSkillName?: string;
  roleMatchBadgeText?: string;
  branchEligibilityBadgeText?: string;
  matchGrade: 'perfect' | 'gap_match' | 'role_match' | 'branch_match' | 'general';
  matchScore: number;
}

/**
 * Evaluates how an online course/learning program matches the student's B-Tech branch and career role,
 * and whether it bridges any of their identified skill gaps.
 */
export function checkLearningProgramRoleAndBranchMatch(
  prog: LearningProgram,
  targetRoleId: string,
  studentBranch: string,
  gapSkills: string[] = []
): ProgramRoleBranchMatchDetails {
  const activeRole = CAREER_ROLE_OPTIONS.find(r => r.id === targetRoleId) || CAREER_ROLE_OPTIONS[0];
  const targetBranch = studentBranch || 'Computer Science & Engineering';

  // 1. Check if program bridges any active identified skill gap
  let bridgesSkillGap = false;
  let bridgedSkillName: string | undefined = undefined;

  for (const gap of gapSkills) {
    const teachesGap = (prog.skillsGained || []).some(
      s => s.toLowerCase() === gap.toLowerCase() || isSkillEquivalent(gap, s)
    ) || prog.title.toLowerCase().includes(gap.toLowerCase());

    if (teachesGap) {
      bridgesSkillGap = true;
      bridgedSkillName = gap;
      break;
    }
  }

  // 2. Evaluate Career Role Match
  let isCareerRoleMatch = false;
  let roleMatchBadgeText: string | undefined = undefined;

  if (prog.careerRoleIds && prog.careerRoleIds.includes(targetRoleId)) {
    isCareerRoleMatch = true;
    roleMatchBadgeText = `${activeRole.title} Track`;
  } else if (prog.targetRoles && prog.targetRoles.some(tr => tr.toLowerCase().includes(activeRole.title.toLowerCase()) || activeRole.title.toLowerCase().includes(tr.toLowerCase()))) {
    isCareerRoleMatch = true;
    roleMatchBadgeText = `${activeRole.title} Track`;
  } else {
    // Check skills overlap with active role
    const progSkillsLower = (prog.skillsGained || []).map(s => s.toLowerCase());
    const roleSkills = [...activeRole.keySkills, ...activeRole.milestones.flatMap(m => m.requiredSkills)];
    const overlapCount = roleSkills.filter(rs =>
      progSkillsLower.some(ps => ps.includes(rs.toLowerCase()) || rs.toLowerCase().includes(ps) || isSkillEquivalent(rs, ps))
    ).length;

    const titleWords = activeRole.title.toLowerCase().split(' ').filter(w => w.length > 3 && !['engineer', 'developer', 'analyst'].includes(w));
    const titleMatches = titleWords.some(w => prog.title.toLowerCase().includes(w));

    if (overlapCount >= 1 || titleMatches) {
      isCareerRoleMatch = true;
      roleMatchBadgeText = `${activeRole.title} Curriculum`;
    }
  }

  // 3. Evaluate B-Tech Branch Eligibility
  let isBranchEligible = false;
  let branchEligibilityBadgeText: string | undefined = undefined;

  if (prog.eligibleBranches && prog.eligibleBranches.length > 0) {
    if (prog.eligibleBranches.includes('All') || prog.eligibleBranches.includes('All B.Tech Branches')) {
      isBranchEligible = true;
      branchEligibilityBadgeText = 'All B.Tech Branches';
    } else {
      const branchMatches = prog.eligibleBranches.some(b => isBranchEquivalent(targetBranch, b));
      if (branchMatches) {
        isBranchEligible = true;
        const matchingBranchCodes = prog.eligibleBranches.map(b => {
          const found = BTECH_BRANCHES.find(br => isBranchEquivalent(br.name, b));
          return found ? found.shortCode : b;
        });
        branchEligibilityBadgeText = `B.Tech ${matchingBranchCodes.slice(0, 2).join('/')} Aligned`;
      }
    }
  } else {
    // Fallback: Infer from title & domain
    const titleLower = prog.title.toLowerCase();
    const branchInfo = BTECH_BRANCHES.find(b => isBranchEquivalent(b.name, targetBranch));
    if (branchInfo) {
      const matchesBranchKeywords = branchInfo.aliases.some(a => titleLower.includes(a));
      if (matchesBranchKeywords) {
        isBranchEligible = true;
        branchEligibilityBadgeText = `B.Tech ${branchInfo.shortCode} Aligned`;
      }
    }
  }

  if (!branchEligibilityBadgeText) {
    if (isBranchEligible) {
      branchEligibilityBadgeText = 'Branch Aligned';
    } else if (prog.eligibleBranches && prog.eligibleBranches.length > 0) {
      const codes = prog.eligibleBranches.map(b => {
        const found = BTECH_BRANCHES.find(br => isBranchEquivalent(br.name, b));
        return found ? found.shortCode : b;
      });
      branchEligibilityBadgeText = `B.Tech ${codes.slice(0, 2).join('/')}`;
    }
  }

  // 4. Determine Match Grade and Composite Score
  let matchGrade: 'perfect' | 'gap_match' | 'role_match' | 'branch_match' | 'general' = 'general';
  let matchScore = 50 + Math.round((prog.rating || 4.5) * 6); // Base 75-80

  if (bridgesSkillGap) {
    matchScore += 25;
  }
  if (isCareerRoleMatch) {
    matchScore += 20;
  }
  if (isBranchEligible) {
    matchScore += 15;
  }

  if (bridgesSkillGap && isCareerRoleMatch && isBranchEligible) {
    matchGrade = 'perfect';
  } else if (bridgesSkillGap) {
    matchGrade = 'gap_match';
  } else if (isCareerRoleMatch && isBranchEligible) {
    matchGrade = 'perfect';
  } else if (isCareerRoleMatch) {
    matchGrade = 'role_match';
  } else if (isBranchEligible) {
    matchGrade = 'branch_match';
  }

  return {
    isCareerRoleMatch,
    isBranchEligible,
    bridgesSkillGap,
    bridgedSkillName,
    roleMatchBadgeText,
    branchEligibilityBadgeText,
    matchGrade,
    matchScore: Math.min(99, matchScore)
  };
}

