import React from 'react';
import {
  X,
  GraduationCap,
  Briefcase,
  Building2,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthRole } from '../../types';

export const GetStartedModal: React.FC = () => {
  const {
    isGetStartedModalOpen,
    setIsGetStartedModalOpen,
    setSelectedAuthRole,
    setPageView
  } = useApp();

  if (!isGetStartedModalOpen) return null;

  const roles = [
    {
      id: 'student' as AuthRole,
      title: 'Student',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200 hover:border-blue-500',
      tag: '45,000+ Enrolled',
      desc: 'Build skills, take assessments, discover internships, apply for jobs & connect with industry mentors.',
      keyPoints: ['Skill-Gap Diagnostics', 'Career Roadmaps', '1-Click Job Applies']
    },
    {
      id: 'industry' as AuthRole,
      title: 'Industry',
      icon: Briefcase,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200 hover:border-purple-500',
      tag: '850+ Hiring Partners',
      desc: 'Hire verified students, post jobs/internships with AI suggestions, search pre-screened talent & sponsor R&D.',
      keyPoints: ['90%+ Match Search', 'AI Job Spec Generator', 'Campus Placement Funnels']
    },
    {
      id: 'institution' as AuthRole,
      title: 'Institution',
      icon: Building2,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200 hover:border-amber-500',
      tag: '180+ Universities',
      desc: 'Institutional analytics, cohort skill gap heatmaps, campus recruitment drive funnels & corporate MoU tracking.',
      keyPoints: ['Student Readiness Matrix', 'Recruitment Automation', 'MoU Lifecycle Tracking']
    }
  ];

  const handleLoginRole = (role: AuthRole) => {
    setSelectedAuthRole(role);
    setIsGetStartedModalOpen(false);
    setPageView('login');
  };

  const handleRegisterRole = (role: AuthRole) => {
    setSelectedAuthRole(role);
    setIsGetStartedModalOpen(false);
    setPageView('register');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                How will you use CAREER SYNC?
              </h2>
              <p className="text-xs text-slate-500">
                Choose your role to access customized tools, workflows, and opportunities
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGetStartedModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className={`p-5 rounded-2xl border-2 ${r.border} bg-white transition-all shadow-xs flex flex-col justify-between space-y-3 group hover:shadow-md`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl ${r.bg} ${r.color} flex items-center justify-center font-bold`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {r.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {r.tag}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {r.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {r.keyPoints.map((kp, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                          ✓ {kp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Login / Register / Direct Explore */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoginRole(r.id)}
                      className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-500" />
                      <span>Login</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRegisterRole(r.id)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-between px-6">
          <span>Ready to build your career ecosystem?</span>
          <button
            onClick={() => {
              setIsGetStartedModalOpen(false);
              setSelectedAuthRole('student');
              setPageView('register');
            }}
            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
