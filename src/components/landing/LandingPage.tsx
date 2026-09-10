import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Compass,
  Award,
  Users,
  Zap,
  Layers,
  Network,
  BookMarked,
  BriefcaseBusiness,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const {
    navigateToRole,
    setPageView,
    setIsGetStartedModalOpen,
    setActiveTab
  } = useApp();


  const workflowSteps = [
    { num: '01', title: 'Create Profile', desc: 'Register with your academic USN or corporate email and build your profile.' },
    { num: '02', title: 'Assess / Define Skills', desc: 'Complete adaptive 15-min assessments or publish job requirement specifications.' },
    { num: '03', title: 'Discover Opportunities', desc: 'AI engine connects candidates to high-compatibility internships, jobs, and projects.' },
    { num: '04', title: 'Connect', desc: 'Schedule 1-on-1 mentorship sessions, candidate interviews, or industry consultations.' },
    { num: '05', title: 'Collaborate', desc: 'Execute live capstones, sponsored research R&D, corporate labs, and hackathons.' },
    { num: '06', title: 'Grow', desc: 'Track outcomes with real-time placement stats, project submissions, and institutional analytics.' }
  ];

  const platformFeatures = [
    { title: 'Skill Intelligence', icon: Zap, color: 'text-blue-600 bg-blue-50', desc: 'Algorithmic assessment of technical competencies with automated skill-gap radar.' },
    { title: 'Curated Jobs', icon: BriefcaseBusiness, color: 'text-emerald-600 bg-emerald-50', desc: 'Direct openings from tech firms with transparent match percentages.' },
    { title: 'Internship Tracker', icon: Award, color: 'text-purple-600 bg-purple-50', desc: 'Milestone tracking, weekly mentor reviews, and AICTE credit alignment.' },
    { title: 'Learning Roadmaps', icon: BookMarked, color: 'text-amber-600 bg-amber-50', desc: 'Visual milestones from fundamentals to cloud-native microservices.' },
    { title: 'Industry Mentorship', icon: Users, color: 'text-indigo-600 bg-indigo-50', desc: 'Direct access to senior tech architects for portfolio and resume feedback.' },
    { title: 'Research Calls', icon: Layers, color: 'text-rose-600 bg-rose-50', desc: 'Sponsored corporate R&D problem statements with active consulting budgets.' },
    { title: 'Industry Projects', icon: Network, color: 'text-teal-600 bg-teal-50', desc: 'Real-world problem challenges with live APIs and industry guidance.' },
    { title: 'Placement Drives', icon: Building, color: 'text-cyan-600 bg-cyan-50', desc: 'Automated recruitment funnel management from student eligibility to offer letters.' }
  ];

  const stats = [
    { label: 'Students', value: '4,850+' },
    { label: 'Industry Partners', value: '126+' },
    { label: 'Internships', value: '342+' },
    { label: 'Placement Rate', value: '84%' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 shadow-2xs mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            CAREER SYNC Portal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Bridging Skills, <span className="text-blue-600">Academia</span> & Industry.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            One platform connecting students, industries, and educational institutions to build skills, create opportunities, and strengthen industry readiness.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setPageView('assessment');
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Assess My Skills</span>
            </button>

            <button
              onClick={() => {
                setPageView('opportunities');
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Explore Opportunities</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3 Connected Stakeholder Portals
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Skill-Gap Engine
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Digital Portfolios &amp; Resumes
            </span>
          </div>
        </div>
      </section>

      {/* 2. HOW CAREER SYNC WORKS — 6 STEPS (ABOUT) */}
      <section id="about-section" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              The Collaboration Pipeline
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              How CAREER SYNC Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A streamlined, 6-step lifecycle that aligns academia with real-world industry impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((ws, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/30 transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-600/60 group-hover:text-blue-600 transition-colors">
                    {ws.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 font-bold text-xs">
                    ✓
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {ws.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ws.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES — 8 CORE PILLARS */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Unified Feature Matrix
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Complete Capabilities for Modern Collaboration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Every tool required to assess, learn, recruit, collaborate, and manage outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((pf, idx) => {
              const Icon = pf.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${pf.color} flex items-center justify-center font-bold`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{pf.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pf.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Join the Collaborative Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Build the Future of Academia & Industry Together.
          </h2>

          <p className="text-base text-blue-100/90 max-w-xl mx-auto leading-relaxed">
            Connect students, corporate recruiters, and institutional leaders in one centralized portal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsGetStartedModalOpen(true)}
              className="px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-black shadow-lg shadow-black/10 transition-all hover:scale-105"
            >
              Get Started
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('about-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-blue-800/80 hover:bg-blue-800 text-white rounded-xl text-xs font-bold border border-blue-400/30 transition-all"
            >
              Explore CAREER SYNC
            </button>
          </div>
        </div>
      </section>

      {/* 8. ENTERPRISE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <Sparkles className="w-5 h-5 text-blue-400" />
                CAREER SYNC
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                One platform connecting students, industries, and educational institutions.
              </p>
              <p className="text-[11px] text-slate-500 italic">
                “Bridging Skills, Academia & Industry.”
              </p>
            </div>

            {/* Students */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Students</p>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => { navigateToRole('student'); setActiveTab('skill-profile'); }} className="hover:text-white">Skill Profile & Assessment</button></li>
                <li><button onClick={() => { navigateToRole('student'); setActiveTab('jobs'); }} className="hover:text-white">Job Market</button></li>
                <li><button onClick={() => { navigateToRole('student'); setActiveTab('internships'); }} className="hover:text-white">Internships</button></li>
                <li><button onClick={() => { navigateToRole('student'); setActiveTab('learning'); }} className="hover:text-white">Learning Paths</button></li>
                <li><button onClick={() => { navigateToRole('student'); setActiveTab('portfolio'); }} className="hover:text-white">Digital Portfolio</button></li>
              </ul>
            </div>

            {/* Industries */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Industries</p>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => { navigateToRole('industry'); setActiveTab('candidate-search'); }} className="hover:text-white">Hire Talent</button></li>
                <li><button onClick={() => { navigateToRole('industry'); setActiveTab('post-job'); }} className="hover:text-white">Post Jobs</button></li>
                <li><button onClick={() => { navigateToRole('industry'); setActiveTab('post-internship'); }} className="hover:text-white">Post Internships</button></li>
                <li><button onClick={() => { navigateToRole('industry'); setActiveTab('industry-programs'); }} className="hover:text-white">Training Programs</button></li>
              </ul>
            </div>

            {/* Institutions */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Institutions</p>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => { navigateToRole('institution'); setActiveTab('students-mgmt'); }} className="hover:text-white">Student Analytics</button></li>
                <li><button onClick={() => { navigateToRole('institution'); setActiveTab('placements'); }} className="hover:text-white">Placement Drives</button></li>
                <li><button onClick={() => { navigateToRole('institution'); setActiveTab('skill-gaps'); }} className="hover:text-white">Skill Gap Matrix</button></li>
                <li><button onClick={() => { navigateToRole('institution'); setActiveTab('collab-hub'); }} className="hover:text-white">Industry MoUs</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 CAREER SYNC Platform Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Career Sync Platform.'); }} className="hover:text-white">Terms</a>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: All student data protected with AES-256 encryption.'); }} className="hover:text-white">Privacy</a>
              <a href="#security" onClick={(e) => { e.preventDefault(); alert('Security: SOC2 Type II Certified.'); }} className="hover:text-white">Security</a>
              <a href="#support" onClick={(e) => { e.preventDefault(); alert('Help Center: support@careersync.edu.in'); }} className="hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
