import React from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';

export const ConsultancyView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Industry Consultancy Projects</h1>
        <p className="text-sm text-slate-500 mt-1">Manage institutional consultancy assignments and industry contracts.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Smart Factory IoT Optimization</p>
              <p className="text-xs text-slate-500">TechNova Solutions • Active</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> In Progress
          </span>
        </div>
      </div>
    </div>
  );
};
