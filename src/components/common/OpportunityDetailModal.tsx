import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Share2,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose
}) => {
  const {
    applyToOpportunity,
    toggleSaveOpportunity,
    updateOpportunityStatus,
    triggerConfetti,
    role,
    setPageView,
    setSelectedAuthRole,
    getOpportunityMatch,
    setActiveTab
  } = useApp();

  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  if (!opportunity) return null;

  const isApplied = Boolean(opportunity.appliedStatus);
  const isClosed = Boolean(opportunity.isClosed || opportunity.status === 'Closed' || opportunity.status === 'Archived');
  const isArchived = opportunity.status === 'Archived';

  // Accurate real-time skill matching from AppContext
  const matchResult = getOpportunityMatch(opportunity);
  const accurateMatchPercentage = matchResult.matchPercentage;

  const handleStatusChange = async (newStatus: 'Active' | 'Closed' | 'Archived', reason?: string) => {
    setIsUpdatingStatus(true);
    const res = await updateOpportunityStatus(opportunity.id, newStatus, reason);
    setIsUpdatingStatus(false);
    if (res.success) {
      triggerConfetti();
    } else {
      alert(res.message || 'Failed to update status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-start gap-4">
            <img
              src={opportunity.logo}
              alt={opportunity.organization}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {opportunity.type}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Posted {opportunity.postedDate}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{opportunity.title}</h2>
              <p className="text-sm font-semibold text-slate-600">{opportunity.organization}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Closed / Status Banner */}
          {isClosed && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isArchived
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isArchived ? 'text-slate-600' : 'text-amber-600'}`} />
              <div>
                <h3 className="font-black text-xs sm:text-sm">
                  {isArchived ? 'Total Closed & Archived' : 'Applications & Bookings are Closed'}
                </h3>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                  {opportunity.closedReason || (isArchived
                    ? 'This opportunity has completed its hiring cycle and has been totally closed and archived.'
                    : 'The recruitment team is no longer accepting new applications or bookings for this opening.')}
                </p>
              </div>
            </div>
          )}

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Remuneration</span>
              <span className="text-xs font-bold text-blue-700">{opportunity.salaryOrStipend}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Location & Mode</span>
              <span className="text-xs font-bold text-slate-800">
                {opportunity.location} ({opportunity.workMode})
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Application Deadline</span>
              <span className="text-xs font-bold text-slate-800">{opportunity.deadline}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Applicants</span>
              <span className="text-xs font-bold text-slate-800">{opportunity.applicantsCount} applied</span>
            </div>
          </div>

          {/* AI Compatibility Box - Real-time Accurate Calculation */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center font-black shadow-sm flex-shrink-0">
                <span className="text-base leading-none">{accurateMatchPercentage}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-200">Match</span>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Accurate AI Skill Compatibility Match
                </p>
                <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                  You match <strong className="text-blue-950">{matchResult.matchedSkills.length}</strong> of{' '}
                  <strong className="text-blue-950">{matchResult.totalRequired}</strong> required skills.
                  {matchResult.verifiedMatches.length > 0 && (
                    <span className="text-emerald-700 font-semibold ml-1">
                      ({matchResult.verifiedMatches.length} verified by uploaded certificates).
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right sm:border-l sm:border-blue-200 sm:pl-4 self-start sm:self-auto">
              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                accurateMatchPercentage >= 80
                  ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100/80 text-amber-800 border-amber-300'
              }`}>
                {accurateMatchPercentage >= 80 ? '✓ High Match Eligible' : 'Skill Gap Identified'}
              </span>
            </div>
          </div>

          {/* Career Role Track & B.Tech Branch Eligibility Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Target Career Roles
              </span>
              <div className="flex flex-wrap gap-1">
                {(opportunity.targetRoles && opportunity.targetRoles.length > 0
                  ? opportunity.targetRoles
                  : [opportunity.title]
                ).map((roleName, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {roleName}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                Eligible B-Tech Branches
              </span>
              <div className="flex flex-wrap gap-1">
                {(opportunity.eligibleBranches && opportunity.eligibleBranches.length > 0
                  ? opportunity.eligibleBranches
                  : ['All B.Tech Branches']
                ).map((branch, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100">
                    {branch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Role Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Role Overview</h3>
            <p className="text-slate-600 leading-relaxed">{opportunity.description}</p>
          </div>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Key Responsibilities</h3>
              <ul className="space-y-1.5">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 text-xs leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills Matrix with Verified Badges & Upload Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Required Skills Breakdown</h3>
              <span className="text-xs text-slate-500 font-medium">
                {matchResult.matchedSkills.length}/{matchResult.totalRequired} Matched
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {opportunity.requiredSkills.map((skill, i) => {
                const isVerified = matchResult.verifiedMatches.includes(skill);
                const isMatched = matchResult.matchedSkills.includes(skill);

                return (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                        : isMatched
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {isVerified ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isMatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {skill}
                    <span className="text-[10px] opacity-75 font-normal">
                      {isVerified ? '(Verified)' : isMatched ? '(Profile)' : '(Gap)'}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Skill Gap Bridge Callout if missing skills exist */}
            {matchResult.missingSkills.length > 0 && (
              <div className="mt-3 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Missing Gaps: </span>
                  {matchResult.missingSkills.join(', ')}
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('skill-profile');
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Upload Cert to Bridge Gap
                </button>
              </div>
            )}
          </div>


          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Eligibility Criteria</h3>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              {opportunity.eligibility}
            </p>
          </div>

          {/* Company Brief */}
          {opportunity.companyDetails && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">{opportunity.organization}</p>
                <p className="text-[11px] text-slate-500">
                  {opportunity.companyDetails.industry} • {opportunity.companyDetails.size} • ★ {opportunity.companyDetails.rating}
                </p>
              </div>
              <a
                href={opportunity.companyDetails.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                Website <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (role === 'landing') {
                  onClose();
                  setSelectedAuthRole('student');
                  setPageView('login');
                  return;
                }
                toggleSaveOpportunity(opportunity.id);
              }}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                opportunity.isSaved
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${opportunity.isSaved ? 'fill-blue-600' : ''}`} />
              {opportunity.isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Opportunity link copied to clipboard!');
              }}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Close
            </button>

            {/* Publisher / Recruiter Actions */}
            {(role === 'industry' || role === 'institution') && (
              <>
                {isClosed ? (
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange('Active')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Reopen Applications
                  </button>
                ) : (
                  <>
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Closed', 'Applications reached capacity.')}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Close Applications / Bookings
                    </button>
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange('Archived', 'Cycle complete and archived.')}
                      className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Total Close
                    </button>
                  </>
                )}
              </>
            )}

            {/* Student Candidate Application Actions */}
            {role !== 'industry' && role !== 'institution' && (
              <>
                {isApplied ? (
                  <span className="px-5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Application Submitted
                  </span>
                ) : isClosed ? (
                  <span className="px-5 py-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    Applications Closed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (role === 'landing') {
                        onClose();
                        setSelectedAuthRole('student');
                        setPageView('login');
                        return;
                      }
                      applyToOpportunity(opportunity);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    1-Click Apply Now
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
