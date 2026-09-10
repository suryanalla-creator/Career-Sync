import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Users,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IndustryDashboard: React.FC = () => {
  const { setActiveTab } = useApp();

  const funnelMetrics = [
    { stage: 'Total Inflow', count: 145, percentage: '100%', color: 'bg-blue-600' },
    { stage: 'Shortlisted', count: 48, percentage: '33%', color: 'bg-indigo-600' },
    { stage: 'Technical Assessment', count: 28, percentage: '19%', color: 'bg-purple-600' },
    { stage: 'Final Interviews', count: 14, percentage: '10%', color: 'bg-amber-600' },
    { stage: 'Offers Extended', count: 6, percentage: '4.1%', color: 'bg-emerald-600' }
  ];

  const demandedSkills = [
    { skill: 'Python / PyTorch', demand: 94, hiringCount: '18 Openings' },
    { skill: 'React & TypeScript', demand: 91, hiringCount: '14 Openings' },
    { skill: 'SQL & Data Warehousing', demand: 88, hiringCount: '12 Openings' },
    { skill: 'Cloud (AWS / Azure)', demand: 85, hiringCount: '10 Openings' },
    { skill: 'Docker & Kubernetes', demand: 78, hiringCount: '8 Openings' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              Corporate Talent Portal • TechNova Solutions
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Enterprise Recruitment & Pipeline Analytics
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl leading-relaxed">
              3 active campus placement drives across Tier-1 universities. Direct candidate matching pipeline active.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('post-job')}
              className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>
            <button
              onClick={() => setActiveTab('candidate-search')}
              className="px-4 py-2.5 bg-purple-800/80 hover:bg-purple-800 text-white text-xs font-bold rounded-xl border border-purple-400/30 transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Search Candidates
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('post-job')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-purple-400 transition-all"
        >
          <span className="text-xs font-semibold text-slate-500">Active Jobs</span>
          <p className="text-3xl font-black text-slate-900 mt-1">8</p>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">SDE-I, Data Analyst, Cloud</span>
        </div>

        <div
          onClick={() => setActiveTab('post-internship')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
        >
          <span className="text-xs font-semibold text-slate-500">Active Internships</span>
          <p className="text-3xl font-black text-blue-600 mt-1">12</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Summer 2026 Batch</span>
        </div>

        <div
          onClick={() => setActiveTab('candidate-search')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-400 transition-all"
        >
          <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
          <p className="text-3xl font-black text-indigo-600 mt-1">145</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">+24 today from Apex Tech</span>
        </div>

        <div
          onClick={() => setActiveTab('candidate-search')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-all"
        >
          <span className="text-xs font-semibold text-slate-500">Shortlisted for Rounds</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">32</p>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">14 in Technical Interviews</span>
        </div>
      </div>

      {/* Recruitment Funnel & Demanded Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recruitment Funnel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Campus Recruitment Funnel</h2>
              <p className="text-xs text-slate-500">Real-time candidate progression through screening stages</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
              Conversion: 4.1%
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {funnelMetrics.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{stage.count} candidates</span>
                    <span className="text-slate-400 text-[11px]">({stage.percentage})</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`${stage.color} h-full rounded-full transition-all`} style={{ width: stage.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Most Demanded Skills */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Highest In-Demand Skills</h2>
            <p className="text-xs text-slate-500">Competencies specified across active job specs</p>
          </div>

          <div className="space-y-3">
            {demandedSkills.map((sk, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{sk.skill}</p>
                  <p className="text-[10px] text-slate-500">{sk.hiringCount}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-purple-700">{sk.demand}%</span>
                  <span className="text-[10px] text-slate-400 block">demand index</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
