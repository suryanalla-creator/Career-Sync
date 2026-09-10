import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Award, Users, FileText } from 'lucide-react';

export const AcademicianDashboard: React.FC = () => {
  const { academicianProfile } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {academicianProfile?.name || 'Faculty Member'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {academicianProfile?.designation || 'Academician'} • {academicianProfile?.college || 'Institution'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Publications</p>
            <p className="text-lg font-bold text-slate-800">{academicianProfile?.publicationsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Patents</p>
            <p className="text-lg font-bold text-slate-800">{academicianProfile?.patentsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">FDPs</p>
            <p className="text-lg font-bold text-slate-800">{academicianProfile?.fdpsAttendedCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Consultancy</p>
            <p className="text-lg font-bold text-slate-800">{academicianProfile?.consultancyProjectsCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};