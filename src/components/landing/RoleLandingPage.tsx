import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthRole } from '../../types';

interface RoleLandingPageProps {
  roleType: AuthRole;
}

export const RoleLandingPage: React.FC<RoleLandingPageProps> = ({ roleType }) => {
  const {
    setPageView,
    setSelectedAuthRole
  } = useApp();

  const handleJoin = () => {
    setSelectedAuthRole(roleType);
    setPageView('register');
  };

  const handleLogin = () => {
    setSelectedAuthRole(roleType);
    setPageView('login');
  };

  const roleConfigs = {
    student: {
      title: 'For Students',
      heroTag: 'From College Classroom to Tier-1 Tech Offer',
      heroDesc: 'Bridge your academic learning with live industry requirements. Complete skill assessments, uncover skill gaps, follow guided career roadmaps, and land top-tier internships and jobs.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: GraduationCap,
      joinCta: 'Join as Student',
      loginCta: 'Login as Student',
      features: [
        {
          title: 'Skill Assessment & Live Scoring',
          desc: '15-minute adaptive technical and problem-solving tests to evaluate your competencies.'
        },
        {
          title: 'AI Skill Gap Analysis',
          desc: 'Pinpoint precise deficiencies against market benchmark requirements for software, cloud, and AI roles.'
        },
        {
          title: 'Interactive Career Roadmaps',
          desc: 'Visual step-by-step milestones from CS core to production-ready microservices and cloud deployment.'
        },
        {
          title: 'Jobs & Internship Marketplace',
          desc: 'High-match roles with transparent skill compatibility radar and 1-click applications.'
        },
        {
          title: 'Digital Portfolio & Resume Builder',
          desc: 'Export clean A4 formatted resumes and share live project repositories with recruiters.'
        },
        {
          title: '1-on-1 Mentorship & Hackathons',
          desc: 'Book guidance sessions with seasoned engineering leaders and register for national hackathons.'
        }
      ],
      stats: [
        { label: 'Enrolled Students', val: '45,000+' },
        { label: 'Average Readiness', val: '84%' },
        { label: 'Active Internships', val: '3,200+' },
        { label: 'Top Offers', val: '₹18.5 LPA' }
      ]
    },
    industry: {
      title: 'For Industries & Recruiters',
      heroTag: 'Direct Pipeline to Skilled & Assessed Student Talent',
      heroDesc: 'Cut campus hiring turnaround by 70%. Post jobs and internships with automated AI skill suggestions, filter candidates by skill match, and sponsor university hackathons.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Briefcase,
      joinCta: 'Join as Industry',
      loginCta: 'Login as Industry',
      features: [
        {
          title: 'Pre-Screened Candidate Search',
          desc: 'Search student talent filtered by coding scores, CGPA, and specific skill competencies.'
        },
        {
          title: 'AI Job & Internship Spec Generator',
          desc: 'Auto-detect and inject requisite skills based on job titles in seconds.'
        },
        {
          title: 'Campus Placement Funnel',
          desc: 'Manage applicants across 5 stages from Screening to Shortlisted, Interview, and Offer Letter.'
        },
        {
          title: 'Corporate Training Academies',
          desc: 'Publish sponsored bootcamps and specialized certificate tracks directly to partner colleges.'
        },
        {
          title: 'Industry Projects & Hackathons',
          desc: 'Sponsor capstone challenges to identify top problem solvers before campus placement season.'
        },
        {
          title: 'Joint R&D Partnerships',
          desc: 'Leverage university research labs and student scholars for specialized prototype development.'
        }
      ],
      stats: [
        { label: 'Hiring Partners', val: '850+' },
        { label: 'Candidate Match Rate', val: '94%' },
        { label: 'Time-to-Hire Saved', val: '70%' },
        { label: 'Active Postings', val: '1,450+' }
      ]
    },
    institution: {
      title: 'For Educational Institutions',
      heroTag: '360° Student Readiness, Placements & Industry MoU Analytics',
      heroDesc: 'Empower placement directors and academic deans with cohort skill gap heatmaps, campus recruitment drive automation, corporate MoU tracking, and NAAC/NIRF accreditation analytics.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Building2,
      joinCta: 'Join as Institution',
      loginCta: 'Login as Institution',
      features: [
        {
          title: 'Cohort Skill Gap Heatmaps',
          desc: 'Detect curriculum deficiencies across branches (CSE, ECE, Mech) and launch 1-click bridge labs.'
        },
        {
          title: 'Campus Placement Drive Management',
          desc: 'Automate recruiter onboarding, eligibility filtering, and offer letter conversions.'
        },
        {
          title: 'Corporate MoU & Joint Lab Hub',
          desc: 'Track MoU expiration dates, corporate funded labs, and measurable collaborative outcomes.'
        },
        {
          title: 'Internship & Attendance Tracking',
          desc: 'Monitor mandatory AICTE 8th-semester industry internships and supervisor evaluations.'
        },
        {
          title: 'NAAC / NIRF Reporting Automation',
          desc: 'Generate exportable compliance reports on industry collaborations, placement ratios, and FDPs.'
        },
        {
          title: 'Student Roster Directory',
          desc: 'Search all enrolled students with quick portfolio inspection and readiness scores.'
        }
      ],
      stats: [
        { label: 'Partner Colleges', val: '180+' },
        { label: 'Average Placement Rate', val: '84%' },
        { label: 'Active Corporate MoUs', val: '126+' },
        { label: 'Students Tracked', val: '45,000+' }
      ]
    }
  };

  const config = roleConfigs[roleType];
  const Icon = config.icon;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Breadcrumb Nav */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => setPageView('landing')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to CAREER SYNC Home</span>
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.badge}`}>
            {config.title}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
              <div className={`w-2 h-2 rounded-full ${config.bg.replace('50', '500')}`} />
              <span>{config.heroTag}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center shadow-md`}>
                <Icon className="w-7 h-7" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {config.title}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {config.heroDesc}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={handleJoin}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>{config.joinCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogin}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>{config.loginCta}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metric Counters */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {config.stats.map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{st.val}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Core Capabilities in the {config.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Purpose-built tools designed to accelerate your academia-industry success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.features.map((f, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Launch Card */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-black">Get Started with CAREER SYNC</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Sign in to your account or register to access career tools, analytics, and collaborative workflows.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/30 flex items-center gap-2"
              >
                <span>{config.loginCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
