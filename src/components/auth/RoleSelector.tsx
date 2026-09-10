import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Building2
} from 'lucide-react';
import { AuthRole } from '../../types';

interface RoleSelectorProps {
  selectedRole: AuthRole;
  onSelectRole: (role: AuthRole) => void;
  label?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  label = 'Login as'
}) => {
  const roles: {
    id: AuthRole;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    activeBorder: string;
    activeBg: string;
    activeText: string;
  }[] = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      color: 'text-blue-600',
      activeBorder: 'border-blue-600',
      activeBg: 'bg-blue-50 text-blue-700',
      activeText: 'text-blue-700'
    },
    {
      id: 'industry',
      label: 'Industry',
      icon: Briefcase,
      color: 'text-purple-600',
      activeBorder: 'border-purple-600',
      activeBg: 'bg-purple-50 text-purple-700',
      activeText: 'text-purple-700'
    },
    {
      id: 'institution',
      label: 'Institution',
      icon: Building2,
      color: 'text-amber-600',
      activeBorder: 'border-amber-600',
      activeBg: 'bg-amber-50 text-amber-700',
      activeText: 'text-amber-700'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
        {label}:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                isSelected
                  ? `${r.activeBorder} ${r.activeBg} shadow-sm scale-[1.02]`
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? r.color : 'text-slate-400'}`} />
              <span className="truncate">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
