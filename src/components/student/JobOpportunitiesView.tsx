import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  MapPin,
  Building,
  Target,
  GraduationCap,
  CheckCircle2,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../common/OpportunityCard';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';
import { BTECH_BRANCHES, checkOpportunityRoleAndBranchMatch } from '../../utils/opportunityRoleBranchMatcher';

export const JobOpportunitiesView: React.FC = () => {
  const {
    opportunities,
    setSelectedOpportunity,
    getOpportunityMatch,
    selectedCareerRoleId,
    setSelectedCareerRoleId,
    studentProfile,
    setActiveTab
  } = useApp();

  // Active filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(selectedCareerRoleId || 'fullstack-engineer');
  const [selectedBranch, setSelectedBranch] = useState<string>(studentProfile?.department || 'Computer Science & Engineering');
  const [isTailoredOnly, setIsTailoredOnly] = useState<boolean>(true);
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [minMatch, setMinMatch] = useState(0);

  // Sync when selectedCareerRoleId changes globally
  React.useEffect(() => {
    if (selectedCareerRoleId) {
      setSelectedRoleId(selectedCareerRoleId);
    }
  }, [selectedCareerRoleId]);

  const handleRoleChange = (newRoleId: string) => {
    setSelectedRoleId(newRoleId);
    setSelectedCareerRoleId(newRoleId);
  };

  const activeRole = CAREER_ROLE_OPTIONS.find(r => r.id === selectedRoleId) || CAREER_ROLE_OPTIONS[0];
  const allJobs = opportunities.filter(o => o.type === 'job');

  // Filter and rank jobs according to career role and B-Tech branch
  const filteredJobs = useMemo(() => {
    return allJobs
      .filter((job) => {
        // Work mode filter
        if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
          return false;
        }

        // Match percentage filter
        const match = getOpportunityMatch(job);
        if (match.matchPercentage < minMatch) {
          return false;
        }

        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.organization.toLowerCase().includes(q);
          const matchSkills = job.requiredSkills.some(s => s.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchSkills) return false;
        }

        // Career Role & B-Tech Branch evaluation
        const roleBranchMatch = checkOpportunityRoleAndBranchMatch(job, selectedRoleId, selectedBranch);

        if (isTailoredOnly) {
          // If tailored mode is ON, job must match the target role OR studied branch
          // If strict match (both role and branch match), keep it
          // Or if branch is "All", match role
          const isBranchMatch = selectedBranch === 'All' || roleBranchMatch.isBranchEligible;
          return roleBranchMatch.isCareerRoleMatch && isBranchMatch;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort primarily by role & branch match score boost, then by real skill match
        const matchA = checkOpportunityRoleAndBranchMatch(a, selectedRoleId, selectedBranch);
        const matchB = checkOpportunityRoleAndBranchMatch(b, selectedRoleId, selectedBranch);

        const scoreA = getOpportunityMatch(a).matchPercentage + matchA.scoreBoost;
        const scoreB = getOpportunityMatch(b).matchPercentage + matchB.scoreBoost;

        return scoreB - scoreA;
      });
  }, [allJobs, selectedRoleId, selectedBranch, isTailoredOnly, selectedWorkMode, minMatch, searchQuery, getOpportunityMatch]);

  // Statistics
  const tailoredJobsCount = allJobs.filter(job => {
    const m = checkOpportunityRoleAndBranchMatch(job, selectedRoleId, selectedBranch);
    return m.isCareerRoleMatch && (selectedBranch === 'All' || m.isBranchEligible);
  }).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header with Role & Branch Personalization Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              AI Role & Branch Matched Job Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Full-Time Campus & Graduate Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              Jobs are algorithmically filtered and prioritized to align directly with your chosen <strong className="text-white">Career Role</strong> and your <strong className="text-white">B-Tech Branch Studied</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/15">
            <div className="text-left sm:text-right pr-2">
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">Tailored Matches</span>
              <span className="text-xl font-black text-white">{tailoredJobsCount} of {allJobs.length} Jobs</span>
            </div>
            <button
              onClick={() => setActiveTab('career-path')}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Role Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Role & B-Tech Branch Selection Hub */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Career Role & B-Tech Alignment Filter</h2>
              <p className="text-xs text-slate-500">Fine-tune your job recommendations by role track and engineering discipline</p>
            </div>
          </div>

          {/* Tailored vs All Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setIsTailoredOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isTailoredOnly
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tailored for Me ({tailoredJobsCount})
            </button>
            <button
              onClick={() => setIsTailoredOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                !isTailoredOnly
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Jobs ({allJobs.length})
            </button>
          </div>
        </div>

        {/* Pickers Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Career Role Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              Target Career Role (20 Specialized Paths):
            </label>
            <div className="relative">
              <select
                value={selectedRoleId}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
              >
                {CAREER_ROLE_OPTIONS.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.domain})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400">
              Active domain: <strong className="text-slate-600">{activeRole.domain}</strong> • Avg Package: <strong className="text-slate-600">{activeRole.averageSalary}</strong>
            </p>
          </div>

          {/* B-Tech Branch Studied Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
              B-Tech Branch Studied:
            </label>
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
              >
                <option value="All">All B.Tech Branches (Universal Eligibility)</option>
                {BTECH_BRANCHES.map((b) => (
                  <option key={b.id} value={b.name}>
                    B.Tech in {b.name} ({b.shortCode})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400">
              Your registered branch: <strong className="text-blue-700">{studentProfile?.department || 'Computer Science & Engineering'}</strong>
            </p>
          </div>
        </div>

        {/* Dynamic Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600">
              Showing jobs matching: <strong className="text-indigo-700">{activeRole.title}</strong> &bull; <strong className="text-sky-700">{selectedBranch === 'All' ? 'All Branches' : selectedBranch}</strong>
            </span>
          </div>

          {isTailoredOnly ? (
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              ✓ Smart Tailored View Enabled
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500">
              Showing All Openings (Ranked by role & branch affinity)
            </span>
          )}
        </div>
      </div>

      {/* 3. Search & Additional Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by job title, tech stack (React, Python, Verilog), or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Work Mode */}
        <select
          value={selectedWorkMode}
          onChange={(e) => setSelectedWorkMode(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none w-full md:w-auto"
        >
          <option value="All">All Modes</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
        </select>

        {/* Minimum Match */}
        <select
          value={minMatch}
          onChange={(e) => setMinMatch(Number(e.target.value))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none w-full md:w-auto"
        >
          <option value={0}>Any Match %</option>
          <option value={80}>80%+ AI Match</option>
          <option value={90}>90%+ AI Match</option>
        </select>
      </div>

      {/* 4. Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => (
          <OpportunityCard
            key={job.id}
            opportunity={job}
            filterRoleId={selectedRoleId}
            filterBranch={selectedBranch}
            onViewDetails={(selected) => setSelectedOpportunity(selected)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No jobs match "{activeRole.title}" in "{selectedBranch}"
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try switching to "All Jobs" or adjust your branch filter to see opportunities across adjacent engineering disciplines.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsTailoredOnly(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Show All Available Jobs
            </button>
            <button
              onClick={() => {
                setSelectedBranch('All');
                setSearchQuery('');
                setSelectedWorkMode('All');
              }}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
