import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Handshake,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockInstitutionStats, mockPlacementDrives } from '../../data/mockData';
import { api } from '../../services/api';

export const InstitutionDashboard: React.FC = () => {
  const { setActiveTab } = useApp();
  const [dbStats, setDbStats] = useState<any>(null);

  useEffect(() => {
    api.db.getStats().then((stats: any) => {
      if (stats) setDbStats(stats);
    }).catch(() => {});
  }, []);

  const totalStudentsCount = dbStats?.tables?.find((t: any) => t.table === 'student_profiles')?.rowCount || mockInstitutionStats.totalStudents;
  const departmentsCount = dbStats?.departmentsCount || 8;
  const totalApplications = dbStats?.tables?.find((t: any) => t.table === 'applications')?.rowCount || 1200;
  const totalDrives = dbStats?.tables?.find((t: any) => t.table === 'placement_drives')?.rowCount || 14;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-200 text-xs font-semibold backdrop-blur-xs">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              Apex Institute of Technology • Dean of Placements & Industry Relations
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Readiness & Placement Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
              Active Institutional Cohort: <strong>{totalStudentsCount} Enrolled Students</strong> across {departmentsCount} Departments • {totalApplications} Applications Tracked • {totalDrives} Campus Drives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('my-students')}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              My Students &amp; Progress
            </button>
            <button
              onClick={() => setActiveTab('skill-gaps')}
              className="px-4 py-2.5 bg-white text-amber-950 hover:bg-amber-50 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Skill Gap Analytics
            </button>
            <button
              onClick={() => {
                alert('Generating NAAC / NIRF Institutional Placement & Accreditation Audit Report (PDF/Excel)...');
              }}
              className="px-4 py-2.5 bg-amber-900/80 hover:bg-amber-800 text-white text-xs font-bold rounded-xl border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export NIRF Report
            </button>
          </div>
        </div>
      </div>

      {/* 16. INSTITUTION DASHBOARD: 6 Main Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => setActiveTab('students-mgmt')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Students</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalStudentsCount.toLocaleString()}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">Across {departmentsCount} Departments</span>
        </div>

        <div
          onClick={() => setActiveTab('skill-gaps')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-all"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase">Industry Ready</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{mockInstitutionStats.industryReadyPercentage}%</p>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">+8% YoY Growth</span>
        </div>

        <div
          onClick={() => setActiveTab('placements')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-purple-400 transition-all"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Internships</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{mockInstitutionStats.activeInternships}</p>
          <span className="text-[10px] text-purple-700 font-semibold mt-1 block">Avg Stipend ₹28,500</span>
        </div>

        <div
          onClick={() => setActiveTab('placements')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-amber-400 transition-all"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase">Placement Rate</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{mockInstitutionStats.placementRatePercentage}%</p>
          <span className="text-[10px] text-amber-700 font-bold mt-1 block">Target: 90% by Dec</span>
        </div>

        <div
          onClick={() => setActiveTab('collab-hub')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-400 transition-all"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase">Industry Partners</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{mockInstitutionStats.industryPartnersCount}</p>
          <span className="text-[10px] text-indigo-700 font-semibold mt-1 block">Active Corporate MoUs</span>
        </div>

        <div
          onClick={() => setActiveTab('skill-gaps')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-red-400 transition-all"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase">Students With Gaps</span>
          <p className="text-2xl font-black text-red-600 mt-1">{mockInstitutionStats.studentsWithSkillGaps}</p>
          <span className="text-[10px] text-red-700 font-semibold mt-1 block">Target for Bridge Labs</span>
        </div>
      </div>

      {/* Department-wise Readiness & Top Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Department-Wise Industry Readiness</h2>
              <p className="text-xs text-slate-500">Student cohort benchmark passing rate</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {mockInstitutionStats.departmentReadiness.map((dept, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">{dept.studentsCount} students</span>
                    <span className="font-black text-blue-600">{dept.readiness}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dept.readiness >= 80 ? 'bg-emerald-500' : dept.readiness >= 65 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${dept.readiness}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Top Skill Gaps Identified */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Highest Skill Gaps in Student Cohort</h2>
              <p className="text-xs text-slate-500">Areas flagged by corporate assessment tests</p>
            </div>
            <button
              onClick={() => setActiveTab('skill-gaps')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900"
            >
              Analyze Detail
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {mockInstitutionStats.topSkillGaps.map((gap, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{gap.skill}</h3>
                  <p className="text-[10px] text-slate-500">
                    {gap.gapCount} students lagging • Avg score: {gap.avgScore}%
                  </p>
                </div>
                <span className="text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                  {gap.percentage}% gap
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campus Drives Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Current Campus Placement Drives</h2>
            <p className="text-xs text-slate-500">Real-time drive status, eligibility and offer counts</p>
          </div>
          <button
            onClick={() => setActiveTab('placements')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Placement Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPlacementDrives.map((drive) => (
            <div key={drive.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-3">
                <img src={drive.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{drive.company}</h3>
                  <p className="text-[11px] text-blue-700 font-semibold">{drive.salaryPackage}</p>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Eligible:</span>
                  <span className="font-bold text-slate-800">{drive.totalEligible}</span>
                </div>
                <div className="flex justify-between">
                  <span>Applied:</span>
                  <span className="font-bold text-slate-800">{drive.applied}</span>
                </div>
                <div className="flex justify-between">
                  <span>Offers Made:</span>
                  <span className="font-bold text-emerald-700">{drive.offers} offers</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <span className="font-medium text-slate-500">{drive.driveDate}</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  drive.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {drive.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
