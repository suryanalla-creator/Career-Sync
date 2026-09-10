import React, { ReactNode } from 'react';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthLayoutProps {
  children: ReactNode;
  heading?: string;
  subheading?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heading = 'Welcome back to CAREER SYNC',
  subheading = 'Connect your skills, opportunities, learning, and industry collaboration in one place.'
}) => {
  const { setPageView } = useApp();

  const highlights = [
    {
      icon: Sparkles,
      title: 'Personalized Opportunities',
      desc: 'AI-driven job & internship matching with skill compatibility radar.'
    },
    {
      icon: Award,
      title: 'Skill Intelligence',
      desc: 'Verified technical assessments, gap analysis & tailored roadmaps.'
    },
    {
      icon: Users,
      title: 'Industry Connections',
      desc: 'Direct channels between universities, corporate mentors & recruiters.'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      desc: 'From classroom foundation to tier-1 placement offers and sabbaticals.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      {/* Top Navbar / Back button */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => setPageView('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CAREER SYNC Home</span>
        </button>

        <div className="flex items-center gap-2 sm:hidden">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            CAREER <span className="text-blue-600">SYNC</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* Left Branding & Highlights Panel (Hidden on small screens, elegant on lg) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-10 text-white flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                    CAREER <span className="text-blue-400">SYNC</span>
                  </span>
                  <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                    Academia–Industry Portal
                  </p>
                </div>
              </div>

              {/* Headings */}
              <div className="space-y-2 pt-2">
                <h1 className="text-2xl font-black text-white tracking-tight leading-snug">
                  {heading}
                </h1>
                <p className="text-xs text-slate-300/90 leading-relaxed">
                  {subheading}
                </p>
              </div>

              {/* 4 Feature Highlights */}
              <div className="space-y-4 pt-4">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Proof Metrics */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">850+ Top Recruiters</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Ecosystem</span>
              </div>
            </div>
          </div>

          {/* Right Content Form Section */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white overflow-y-auto max-h-[90vh]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};
