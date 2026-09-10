import React, { useState } from 'react';
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  Building
} from 'lucide-react';
import { mockInstitutionStats } from '../../data/mockData';

export const SkillGapAnalyticsView: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('2026');

  const detailedGaps = [
    {
      skill: 'Cloud Architecture (AWS / GCP)',
      category: 'Cloud & Infrastructure',
      laggingCount: 680,
      gapPercentage: 61,
      avgScore: 48,
      recommendedRemedy: 'Mandate 4-week AWS Academy Solutions Architect Lab course in 7th Semester.'
    },
    {
      skill: 'Distributed System Design & Scalability',
      category: 'Software Engineering',
      laggingCount: 590,
      gapPercentage: 53,
      avgScore: 52,
      recommendedRemedy: 'Partner with TechNova Staff Architects for 3 weekend live design sprints.'
    },
    {
      skill: 'Containerization & Docker Orchestration',
      category: 'DevOps',
      laggingCount: 510,
      gapPercentage: 46,
      avgScore: 56,
      recommendedRemedy: 'Integrate Docker CLI labs into Advanced Operating Systems curriculum.'
    },
    {
      skill: 'Machine Learning Pipelines & MLOps',
      category: 'Data & AI',
      laggingCount: 440,
      gapPercentage: 39,
      avgScore: 59,
      recommendedRemedy: 'Sponsor 50 student voucher seats for DeepLearning.AI Specialization.'
    },
    {
      skill: 'Structured Technical Writing & Client Communication',
      category: 'Soft Skills',
      laggingCount: 380,
      gapPercentage: 34,
      avgScore: 62,
      recommendedRemedy: 'Schedule weekly corporate mock presentations with Deloitte mentors.'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-1 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Curriculum Deficiency Telemetry
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Cohort Skill Gap Matrix & Intervention Engine
          </h1>
          <p className="text-xs text-slate-500">
            Identify discrepancies between academic syllabus outcomes and live campus recruitment cutoffs.
          </p>
        </div>

        <button
          onClick={() => alert('Bridge-course plan dispatched to Academic Council for board of studies review.')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4" />
          Deploy Recommended Bridge Courses
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-slate-600 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400" /> Filter Analytics:
        </span>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
        >
          <option value="All">All Departments</option>
          <option value="CSE">Computer Science & Engineering</option>
          <option value="AI">AI & Data Science</option>
          <option value="ISE">Information Science</option>
          <option value="ECE">Electronics & Communication</option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
        >
          <option value="2026">Graduating Batch of 2026 (Final Year)</option>
          <option value="2027">Batch of 2027 (Pre-Final Year)</option>
        </select>
      </div>

      {/* Deep Dive Gap Cards */}
      <div className="space-y-4">
        {detailedGaps.map((gap, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-amber-400 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                  {gap.category}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  {gap.gapPercentage}% of Cohort Lagging
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900">{gap.skill}</h2>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                <strong className="text-slate-800">AI Remediation Plan:</strong> {gap.recommendedRemedy}
              </p>
            </div>

            <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Students Impacted</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{gap.laggingCount}</p>
                <span className="text-[10px] text-slate-500 font-semibold">Average: {gap.avgScore}%</span>
              </div>

              <button
                onClick={() => alert(`Launching automated bridge assignment cohort for ${gap.skill}`)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                Launch Bridge Lab
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
