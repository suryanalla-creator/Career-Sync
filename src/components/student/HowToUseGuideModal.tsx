import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  Award,
  GitFork,
  Briefcase,
  FileText,
  ShieldCheck,
  ChevronRight,
  Rocket,
  Compass,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowToUseGuideModal: React.FC = () => {
  const {
    isOnboardingGuideOpen,
    setIsOnboardingGuideOpen,
    setActiveTab,
    role
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingGuideOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      badge: 'Step 1 • Profile Mastery',
      title: 'Complete Your Profile (Unlock 100% Strength)',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      gradient: 'from-blue-600 to-indigo-600',
      summary: 'Your profile is your digital career passport. Recruiters prioritize students with fully verified details.',
      highlights: [
        {
          label: 'Academic Credentials',
          desc: 'Input your college, department, graduation year, and CGPA for automated eligibility matching.'
        },
        {
          label: 'Resume & Digital Portfolio',
          desc: 'Upload your ATS-formatted PDF resume and link GitHub/LinkedIn for recruiter verification.'
        },
        {
          label: '4.8x Higher Shortlist Rate',
          desc: 'Profiles at 100% completion receive top placement in campus drives and industry searches.'
        }
      ],
      tip: 'Tip: Check your dashboard reminder card to see exactly what items are missing!',
      actionLabel: 'Go to Profile Editor',
      actionTab: 'profile'
    },
    {
      stepNumber: 2,
      badge: 'Step 2 • Authentic Verification',
      title: 'Take Proctored Skill Diagnostics',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      gradient: 'from-emerald-600 to-teal-600',
      summary: 'Say goodbye to unverified badges. Career Sync certifies your actual competencies with calibrated evaluations.',
      highlights: [
        {
          label: '15-Minute Diagnostic Test',
          desc: 'Answer timed technical, problem-solving, and domain-specific questions proctored by AI.'
        },
        {
          label: 'Verified Skill Certificates',
          desc: 'Upload external certificates or pass platform quizzes to verify individual skill badges.'
        },
        {
          label: 'Industry Readiness Score',
          desc: 'Calibrate your score (0–100%) against national tier-1 engineering hiring benchmarks.'
        }
      ],
      tip: 'Tip: You can re-take assessments as your skills grow to boost your readiness index!',
      actionLabel: 'Open Skill Assessment Hub',
      actionTab: 'skill-profile'
    },
    {
      stepNumber: 3,
      badge: 'Step 3 • Strategic Roadmaps',
      title: 'Track Career Milestones & Skill Gaps',
      icon: GitFork,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      gradient: 'from-purple-600 to-pink-600',
      summary: 'Pick your dream career path (e.g. Full-Stack Engineer, AI Specialist, Cloud Architect) and conquer the roadmap.',
      highlights: [
        {
          label: 'Milestone Progression',
          desc: 'Step-by-step progression from Beginner Foundations to Production-Ready Architecture.'
        },
        {
          label: 'Identified Skill Gaps',
          desc: 'Automated gap detector highlights exactly what skills you lack for your target role.'
        },
        {
          label: 'Curated Learning Courses',
          desc: 'Direct enrollment in vetted industry courses designed to bridge each specific gap.'
        }
      ],
      tip: 'Tip: Change your target role anytime to see how your current skills map to different industries.',
      actionLabel: 'View Career Roadmap',
      actionTab: 'career-path'
    },
    {
      stepNumber: 4,
      badge: 'Step 4 • Placement Opportunities',
      title: 'Discover AI-Matched Jobs & Internships',
      icon: Briefcase,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      gradient: 'from-amber-600 to-orange-600',
      summary: 'Browse verified campus drives, internships, and corporate openings tailored to your department and skills.',
      highlights: [
        {
          label: 'Transparent Match Scores',
          desc: 'See exactly why you match a role (matched skills vs required skills breakdown).'
        },
        {
          label: '1-Click Fast Apply',
          desc: 'Submit your verified portfolio directly to hiring managers with zero redundant paperwork.'
        },
        {
          label: 'Live Application Tracker',
          desc: 'Real-time stage tracking: Applied → Screening → Technical Round → Interview → Selected.'
        }
      ],
      tip: 'Tip: Filter by "High Match" (80%+) to focus on roles where you have the strongest competitive advantage.',
      actionLabel: 'Explore Opportunities',
      actionTab: 'jobs-internships'
    },
    {
      stepNumber: 5,
      badge: 'Step 5 • Professional Toolkit',
      title: 'ATS Resume Builder & Recruiter Messaging',
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      gradient: 'from-indigo-600 to-blue-600',
      summary: 'Leverage platform superpowers: instant ATS-compliant resumes and direct communication with mentors.',
      highlights: [
        {
          label: 'Built-in ATS Resume Portal',
          desc: 'Auto-populate role keywords, preview clean templates, and export print-ready PDFs or HTML.'
        },
        {
          label: 'Direct Messaging & Voice Consultation',
          desc: 'Chat directly with company recruiters and request mock interviews from academic mentors.'
        },
        {
          label: 'Digital Portfolio Link',
          desc: 'Share a public link showcasing your technical skills, projects, and work experience.'
        }
      ],
      tip: 'Tip: You can re-open this guide anytime by clicking the "How to Use" button in the top navigation bar!',
      actionLabel: 'Go to Dashboard',
      actionTab: 'dashboard'
    }
  ];

  const current = steps[currentStep];
  const Icon = current.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOnboardingGuideOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('careersync_guide_seen', 'true');
    }
  };

  const handleJumpToTab = (tab: string) => {
    setActiveTab(tab);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                How to Use CAREER SYNC
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                  Quick-Start Guide
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Step {currentStep + 1} of {steps.length}: {current.badge}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-5 border-b border-slate-100 bg-slate-50/40">
          {steps.map((s, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={s.stepNumber}
                onClick={() => setCurrentStep(idx)}
                className={`py-2 px-1 text-center transition-all cursor-pointer border-b-2 ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50'
                    : isCompleted
                    ? 'border-emerald-500 hover:bg-slate-100/50'
                    : 'border-transparent hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.stepNumber}
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-bold hidden sm:inline ${
                      isCurrent
                        ? 'text-blue-700'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.badge.split('•')[1]?.trim() || `Step ${s.stepNumber}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Slide Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Main Slide Title & Icon */}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${current.color} shadow-xs`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {current.badge}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                {current.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {current.summary}
              </p>
            </div>
          </div>

          {/* Highlights 3-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {current.highlights.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{h.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Helpful Pro Tip Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5 text-amber-900 text-xs">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{current.tip}</span>
          </div>

          {/* Quick Action Button for current step */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">
                Ready to explore this feature?
              </span>
            </div>
            <button
              onClick={() => handleJumpToTab(current.actionTab)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>{current.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] ${
                isLast
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              {isLast ? (
                <>
                  <span>Get Started Now</span>
                  <Rocket className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Next: Step {currentStep + 2}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
