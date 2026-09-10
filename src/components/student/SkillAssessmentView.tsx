import React from 'react';
import { SkillProfileView } from './SkillProfileView';

/**
 * SkillAssessmentView now routes into the unified Skill Profile & Assessment Center.
 * Kept as a drop-in backward-compatible component with initialMode="assessment".
 */
export const SkillAssessmentView: React.FC = () => {
  return <SkillProfileView initialMode="assessment" />;
};
