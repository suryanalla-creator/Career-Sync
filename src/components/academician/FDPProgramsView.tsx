import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';

export const FDPProgramsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Faculty Development Programs</h1>
        <p className="text-sm text-slate-500 mt-1">Explore upcoming specialized FDPs and technical workshops.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Advanced Generative AI for Higher Education</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" /> 5-Day National Workshop • Certified
              </p>
            </div>
          </div>
          <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
