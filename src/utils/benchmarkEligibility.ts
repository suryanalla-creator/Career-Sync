import { Opportunity, StudentProfile, BenchmarkCheckItem, OpportunityEligibilityResult } from '../types';

export function evaluateBenchmarkEligibility(
  opportunity: Opportunity,
  studentProfile: StudentProfile | null | undefined,
  skillMatchPercentage: number,
  verifiedCertsCount: number
): OpportunityEligibilityResult {
  const minSkillScore = opportunity.minSkillScore !== undefined && opportunity.minSkillScore !== null
    ? opportunity.minSkillScore
    : 70;

  const minCgpa = opportunity.minCgpa !== undefined && opportunity.minCgpa !== null
    ? opportunity.minCgpa
    : 7.0;

  const minMatchPercentage = opportunity.minMatchPercentage !== undefined && opportunity.minMatchPercentage !== null
    ? opportunity.minMatchPercentage
    : 60;

  const minVerifiedCerts = opportunity.minVerifiedCertificatesCount !== undefined && opportunity.minVerifiedCertificatesCount !== null
    ? opportunity.minVerifiedCertificatesCount
    : (opportunity.requiresVerifiedCertificates ? 1 : 0);

  const studentSkillScore = studentProfile?.overallSkillScore ?? 0;
  const studentCgpa = studentProfile?.cgpa ?? 0;

  const checks: BenchmarkCheckItem[] = [
    {
      id: 'skillScore',
      label: 'Overall Skill Score',
      required: `${minSkillScore}%`,
      current: `${studentSkillScore}%`,
      met: studentSkillScore >= minSkillScore,
      gapMessage: studentSkillScore < minSkillScore
        ? `Skill score is ${studentSkillScore}%, minimum ${minSkillScore}% required (+${minSkillScore - studentSkillScore}% needed)`
        : undefined
    },
    {
      id: 'cgpa',
      label: 'Minimum Academic CGPA',
      required: minCgpa.toFixed(1),
      current: studentCgpa.toFixed(1),
      met: studentCgpa >= minCgpa,
      gapMessage: studentCgpa < minCgpa
        ? `CGPA is ${studentCgpa.toFixed(1)}, minimum ${minCgpa.toFixed(1)} required`
        : undefined
    },
    {
      id: 'matchPercentage',
      label: 'Required Skill Match',
      required: `${minMatchPercentage}%`,
      current: `${skillMatchPercentage}%`,
      met: skillMatchPercentage >= minMatchPercentage,
      gapMessage: skillMatchPercentage < minMatchPercentage
        ? `Matched ${skillMatchPercentage}% of required skills, minimum ${minMatchPercentage}% needed`
        : undefined
    },
    {
      id: 'verifiedCertificates',
      label: 'Verified Skill Credentials',
      required: minVerifiedCerts > 0 ? `${minVerifiedCerts} Verified` : 'Optional',
      current: `${verifiedCertsCount} Verified`,
      met: minVerifiedCerts === 0 || verifiedCertsCount >= minVerifiedCerts,
      gapMessage: minVerifiedCerts > 0 && verifiedCertsCount < minVerifiedCerts
        ? `Requires ${minVerifiedCerts} verified certificate(s), but you currently have ${verifiedCertsCount}`
        : undefined
    }
  ];

  const metCriteria = checks.filter(c => c.met).length;
  const totalCriteria = checks.length;
  const isEligible = metCriteria === totalCriteria;
  const unmetLabels = checks.filter(c => !c.met).map(c => c.label);

  let summaryMessage = '';
  if (isEligible) {
    summaryMessage = 'You meet all minimum industry benchmark criteria and are fully eligible to apply!';
  } else {
    summaryMessage = `You satisfy ${metCriteria} of ${totalCriteria} benchmark criteria. Needs: ${unmetLabels.join(', ')}.`;
  }

  return {
    isEligible,
    totalCriteria,
    metCriteria,
    checks,
    unmetLabels,
    summaryMessage
  };
}
