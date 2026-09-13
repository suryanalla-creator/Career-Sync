import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Award, Users, FileText, ArrowRight } from 'lucide-react';

export const AcademicianDashboard: React.FC = () => {
  const { academicianProfile, setActiveTab } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {academicianProfile?.name || 'Faculty Member'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {academicianProfile?.designation || 'Academician'} • {academicianProfile?.college || 'Institution'}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('profile')}
          className="self-start md:self-auto px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
        >
          View Full Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Publications Link Card */}
        <button
          onClick={() => setActiveTab('research')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-left hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Publications</p>
              <p className="text-lg font-bold text-slate-800">{academicianProfile?.publicationsCount || 0}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Patents Link Card */}
        <button
          onClick={() => setActiveTab('research')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-left hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Patents</p>
              <p className="text-lg font-bold text-slate-800">{academicianProfile?.patentsCount || 0}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* FDPs Link Card */}
        <button
          onClick={() => setActiveTab('fdps')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-left hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">FDPs</p>
              <p className="text-lg font-bold text-slate-800">{academicianProfile?.fdpsAttendedCount || 0}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Consultancy Link Card */}
        <button
          onClick={() => setActiveTab('consultancy')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-left hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Consultancy</p>
              <p className="text-lg font-bold text-slate-800">{academicianProfile?.consultancyProjectsCount || 0}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};