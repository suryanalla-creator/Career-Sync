import React, { useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  BookOpen,
  Award,
  Building,
  ArrowRight,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../common/OpportunityCard';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';
import { checkOpportunityRoleAndBranchMatch } from '../../utils/opportunityRoleBranchMatcher';
import { AICopilotBot } from './AICopilotBot';

export const RecommendedForYouView: React.FC = () => {
  const {
    opportunities,
    learningPrograms,
    setSelectedOpportunity,
    setActiveTab,
    getOpportunityMatch,
    selectedCareerRoleId,
    studentProfile
  } = useApp();

  const activeRoleId = selectedCareerRoleId || 'fullstack-engineer';
  const activeBranch = studentProfile?.department || 'Computer Science & Engineering';
  const activeRole = CAREER_ROLE_OPTIONS.find(r => r.id === activeRoleId) || CAREER_ROLE_OPTIONS[0];

  const recommendedJobs = opportunities
    .filter(o => o.type === 'job')
    .sort((a, b) => {
      const matchA = checkOpportunityRoleAndBranchMatch(a, activeRoleId, activeBranch);
      const matchB = checkOpportunityRoleAndBranchMatch(b, activeRoleId, activeBranch);
      const scoreA = getOpportunityMatch(a).matchPercentage + matchA.scoreBoost;
      const scoreB = getOpportunityMatch(b).matchPercentage + matchB.scoreBoost;
      return scoreB - scoreA;
    });

  const recommendedInternships = opportunities
    .filter(o => o.type === 'internship')
    .sort((a, b) => {
      const matchA = checkOpportunityRoleAndBranchMatch(a, activeRoleId, activeBranch);
      const matchB = checkOpportunityRoleAndBranchMatch(b, activeRoleId, activeBranch);
      const scoreA = getOpportunityMatch(a).matchPercentage + matchA.scoreBoost;
      const scoreB = getOpportunityMatch(b).matchPercentage + matchB.scoreBoost;
      return scoreB - scoreA;
    });

  const recommendedCourses = learningPrograms.slice(0, 2);

  const recommendedCompanies = useMemo(() => {
    const orgMap: Record<string, { count: number; roleTitles: string[]; logo: string; industry: string }> = {};
    opportunities.forEach(opp => {
      if (!orgMap[opp.organization]) {
        orgMap[opp.organization] = {
          count: 0,
          roleTitles: [],
          logo: opp.logo || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
          industry: opp.type === 'job' ? 'Corporate Technology' : 'Technology Practicum'
        };
      }
      orgMap[opp.organization].count += 1;
      if (orgMap[opp.organization].roleTitles.length < 2) {
        orgMap[opp.organization].roleTitles.push(opp.title);
      }
    });

    return Object.entries(orgMap).slice(0, 3).map(([name, data]) => ({
      name,
      industry: data.industry,
      openingsCount: data.count,
      logo: data.logo,
      reason: `Actively hiring for ${data.roleTitles.join(' and ')} matching ${activeRole.title}.`
    }));
  }, [opportunities, activeRole]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* AI Header Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            AI Algorithmic Personalization
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Curated Recommendations For You
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Recommendations synthesized from your verified skill profile, project code repos, and Tier-1 employer demand benchmarks.
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          AI PLACEMENT COPILOT BOT & TARGET ROLE CONTEXT
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Placement Context & Target Role Snapshot (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Context</h3>
                  <p className="text-sm font-black text-slate-900 truncate max-w-[190px]">{activeRole.title}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activeRole.demand}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Degree &amp; Branch</span>
                <p className="font-extrabold text-slate-800">{studentProfile.department}</p>
                <p className="text-[11px] text-slate-500">B.Tech &bull; {studentProfile.college}</p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold text-blue-500 uppercase">Target Role Key Skills</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(activeRole.keySkills || []).slice(0, 5).map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white text-blue-800 border border-blue-200/80 font-bold text-[10px]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Industry Readiness</span>
                  <span className="text-xs font-black text-purple-800">{studentProfile.industryReadinessScore}%</span>
                </div>
                <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${studentProfile.industryReadinessScore}%` }} />
                </div>
                <p className="text-[10px] text-purple-700 mt-1">
                  Tier-1 Recruiter Ready benchmark score
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setActiveTab('career-path')}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center transition-colors cursor-pointer text-xs"
                >
                  Roadmap
                </button>
                <button
                  onClick={() => setActiveTab('skill-profile')}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center transition-colors cursor-pointer text-xs shadow-xs"
                >
                  Skill Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Placement Copilot Bot (8 Cols) */}
        <div className="lg:col-span-8">
          <AICopilotBot heightClass="h-[520px]" />
        </div>
      </div>

      {/* 1. Recommended Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Recommended Jobs
            </h2>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">
              💡 Recommended because you scored in the 92nd percentile in Python, SQL, and React problem solving.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('jobs')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Explore all jobs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendedJobs.map((job) => (
            <OpportunityCard
              key={job.id}
              opportunity={job}
              onViewDetails={(opp) => setSelectedOpportunity(opp)}
            />
          ))}
        </div>
      </div>

      {/* 2. Recommended Internships */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Recommended Internships
            </h2>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              💡 Recommended because your Capstone project demonstrates production FastAPI & Vector RAG capabilities.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('internships')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Explore all internships
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendedInternships.map((intern) => (
            <OpportunityCard
              key={intern.id}
              opportunity={intern}
              onViewDetails={(opp) => setSelectedOpportunity(opp)}
            />
          ))}
        </div>
      </div>

      {/* 3. Recommended Companies */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600" />
            Top Hiring Companies Matching Your Skill Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedCompanies.map((comp, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={comp.logo} alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                    <p className="text-[11px] text-slate-500">{comp.industry}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {comp.reason}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">{comp.openingsCount} active campus roles</span>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                >
                  View Roles <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
