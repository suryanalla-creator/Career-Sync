import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, Building, Award } from 'lucide-react';

export const FacultyProfileView: React.FC = () => {
  const { academicianProfile } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
        <img
          src={academicianProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
          alt={academicianProfile?.name || 'Faculty'}
          className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{academicianProfile?.name || 'Faculty Member'}</h1>
          <p className="text-sm font-medium text-slate-500">{academicianProfile?.designation || 'Professor'}</p>
          <p className="text-xs text-slate-400 mt-1">{academicianProfile?.college || 'Institution'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Contact & Academic Details
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{academicianProfile?.email || 'faculty@careersync.com'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{academicianProfile?.phone || '+91 98765 12345'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{academicianProfile?.department || 'Department of Computer Science'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" /> Credentials & Expertise
          </h2>
          <p className="text-xs text-slate-600">
            {academicianProfile?.qualification || 'Ph.D. in Computer Science & Engineering'}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {(academicianProfile?.specialization || ['Artificial Intelligence', 'Data Systems']).map((s: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
