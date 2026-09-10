import React from 'react';
import {
  MapPin,
  Clock,
  Bookmark,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  DollarSign,
  BadgeCheck,
  Check,
  Target,
  GraduationCap
} from 'lucide-react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { checkOpportunityRoleAndBranchMatch } from '../../utils/opportunityRoleBranchMatcher';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: (opp: Opportunity) => void;
  filterRoleId?: string;
  filterBranch?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  filterRoleId,
  filterBranch
}) => {
  const { toggleSaveOpportunity, applyToOpportunity, getOpportunityMatch, selectedCareerRoleId, studentProfile } = useApp();

  // Role and Branch match evaluation
  const activeRoleId = filterRoleId || selectedCareerRoleId || 'fullstack-engineer';
  const activeBranch = filterBranch || studentProfile?.department || 'Computer Science & Engineering';
  const roleBranchMatch = checkOpportunityRoleAndBranchMatch(opportunity, activeRoleId, activeBranch);

  // Accurate real-time skill matching calculation
  const matchResult = getOpportunityMatch(opportunity);
  const accurateMatchPercentage = matchResult.matchPercentage;

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (percentage >= 65) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const isApplied = Boolean(opportunity.appliedStatus);
  const isClosed = Boolean(opportunity.isClosed || opportunity.status === 'Closed' || opportunity.status === 'Archived');
  const isArchived = opportunity.status === 'Archived';

  return (
    <div className={`bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between group relative ${
      isArchived
        ? 'border-slate-300 opacity-80 bg-slate-50/40'
        : isClosed
        ? 'border-amber-200 bg-amber-50/20'
        : 'border-slate-200 hover:border-blue-400 hover:shadow-lg'
    }`}>
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={opportunity.logo}
              alt={opportunity.organization}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {opportunity.title}
              </h3>
              <p className="text-xs font-medium text-slate-600">{opportunity.organization}</p>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveOpportunity(opportunity.id);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              opportunity.isSaved
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            aria-label={opportunity.isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            <Bookmark className={`w-4 h-4 ${opportunity.isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Career Role Track & B-Tech Branch Eligibility Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {roleBranchMatch.roleMatchBadgeText && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Target className="w-3 h-3 text-indigo-600" />
              {roleBranchMatch.roleMatchBadgeText}
            </span>
          )}
          {roleBranchMatch.branchEligibilityBadgeText && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100">
              <GraduationCap className="w-3 h-3 text-sky-600" />
              {roleBranchMatch.branchEligibilityBadgeText}
            </span>
          )}
          {roleBranchMatch.isCareerRoleMatch && roleBranchMatch.isBranchEligible && (
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              ✨ Track Match
            </span>
          )}
        </div>

        {/* Location & Details Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3.5">
          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {opportunity.location}
          </span>
          <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 font-medium">
            {opportunity.workMode}
          </span>
          <span className="flex items-center gap-1 bg-blue-50/50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-100 font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            {opportunity.salaryOrStipend}
          </span>
        </div>

        {/* Required Skills Tags with Accurate Match Badging */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {opportunity.requiredSkills.slice(0, 4).map((skill, i) => {
            const isMatched = matchResult.matchedSkills.includes(skill);
            const isVerified = matchResult.verifiedMatches.includes(skill);

            return (
              <span
                key={i}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                    : isMatched
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={
                  isVerified
                    ? 'Verified with Certificate'
                    : isMatched
                    ? 'Matched from your Profile'
                    : 'Missing skill gap'
                }
              >
                {isVerified ? (
                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                ) : isMatched ? (
                  <Check className="w-3 h-3 text-blue-600" />
                ) : null}
                {skill}
              </span>
            );
          })}
          {opportunity.requiredSkills.length > 4 && (
            <span className="text-[11px] font-medium text-slate-400 px-1 py-0.5">
              +{opportunity.requiredSkills.length - 4} more
            </span>
          )}
        </div>

        {/* Accurate Skill Match Subtext */}
        <div className="text-[11px] text-slate-500 mb-2">
          <span className="font-semibold text-slate-700">
            {matchResult.matchedSkills.length} of {matchResult.totalRequired}
          </span>{' '}
          skills matched
          {matchResult.verifiedMatches.length > 0 && (
            <span className="text-emerald-700 font-semibold ml-1.5">
              ({matchResult.verifiedMatches.length} verified)
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        {/* Accurate Match Percentage Indicator */}
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${getMatchBadgeColor(
              accurateMatchPercentage
            )}`}
          >
            <Sparkles className="w-3 h-3" />
            {accurateMatchPercentage}% Match
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Deadline: {opportunity.deadline}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(opportunity)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            Details
          </button>

          {isApplied ? (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </span>
          ) : isClosed ? (
            <span
              onClick={() => onViewDetails(opportunity)}
              className="px-3 py-1.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
              title="Bookings and applications are closed. Click Details for info."
            >
              Closed
            </span>
          ) : (
            <button
              onClick={() => applyToOpportunity(opportunity)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              Apply
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
