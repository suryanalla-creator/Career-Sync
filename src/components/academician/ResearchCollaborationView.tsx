import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export const ResearchCollaborationView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Joint Research & Sponsored Projects</h1>
        <p className="text-sm text-slate-500 mt-1">Collaborative publications, grant proposals, and joint patent filings.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Autonomous Edge Computing Algorithms</p>
              <p className="text-xs text-slate-500">DST & TechNova Research Initiative • INR 18.5 Lakhs</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        </div>
      </div>
    </div>
  );
};
