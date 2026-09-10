import React from 'react';
import { Building2, Award } from 'lucide-react';

export const FacultyInternshipView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Industry Immersion & Sabbaticals</h1>
        <p className="text-sm text-slate-500 mt-1">Short-term industry sabbaticals and corporate research residencies.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Corporate Cloud Architecture Residency</p>
              <p className="text-xs text-slate-500">CloudScale Systems • 4 Weeks Sabbatical</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Funded
          </span>
        </div>
      </div>
    </div>
  );
};
