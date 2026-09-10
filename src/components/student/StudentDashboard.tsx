import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Briefcase,
  GraduationCap,
  BookOpen,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Star,
  Award,
  Bot,
  RotateCcw,
  Zap,
  ShieldCheck,
  FileText,
  Printer,
  Edit3,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';
import { isSkillEquivalent, calculateReadinessScore, calculateProfileCompletion, getMissingProfileItems } from '../../utils/skillMatcher';

export const StudentDashboard: React.FC = () => {
  const {
    studentProfile,
    applications,
    setActiveTab,
    selectedCareerRoleId,
    assessmentScores,
    roleRequiredSkills,
    skillsWeHave,
    triggerConfetti
  } = useApp();

  const activeRoleId = selectedCareerRoleId || 'fullstack-engineer';
  const activeBranch = studentProfile?.department || 'Computer Science & Engineering';
  const activeRole = CAREER_ROLE_OPTIONS.find(r => r.id === activeRoleId) || CAREER_ROLE_OPTIONS[0];

  const activeApp = applications[0];

  // ──────────────────────────────────────────────────────────────────────────
  // Real Dynamic Telemetry & Metric Computations (Mathematically Grounded)
  // ──────────────────────────────────────────────────────────────────────────
  const totalRequired = roleRequiredSkills?.length || 1;
  const possessedRequiredCount = roleRequiredSkills?.filter(req =>
    skillsWeHave?.some(have => have.toLowerCase() === req.toLowerCase() || isSkillEquivalent(req, have))
  ).length || 0;
  const skillMatchRate = Math.min(100, Math.round((possessedRequiredCount / totalRequired) * 100));
  const realReadinessScore = calculateReadinessScore(
    skillMatchRate,
    assessmentScores?.overall,
    studentProfile?.industryReadinessScore ?? 0,
    Boolean(assessmentScores?.completed)
  );

  const realProfileCompletion = useMemo(() => {
    return calculateProfileCompletion(studentProfile);
  }, [studentProfile]);

  const missingProfileItems = useMemo(() => {
    return getMissingProfileItems(studentProfile);
  }, [studentProfile]);

  // ──────────────────────────────────────────────────────────────────────────
  // Embedded ATS Resume Builder State (Strictly bound to studentProfile)
  // ──────────────────────────────────────────────────────────────────────────
  const [resumeName, setResumeName] = useState(studentProfile?.name || '');
  const [resumeEmail, setResumeEmail] = useState(studentProfile?.email || '');
  const [resumePhone, setResumePhone] = useState(studentProfile?.phone || '');
  const [resumeCollege, setResumeCollege] = useState(studentProfile?.college || '');
  const [resumeDegree, setResumeDegree] = useState(studentProfile?.department ? `B.Tech in ${studentProfile.department}` : '');
  const [resumeHeadline, setResumeHeadline] = useState(studentProfile?.department ? `Aspiring ${activeRole.title} | B.Tech ${studentProfile.department}` : `Aspiring ${activeRole.title}`);
  const [resumeSkills, setResumeSkills] = useState(
    skillsWeHave && skillsWeHave.length > 0 ? skillsWeHave.join(', ') : ''
  );
  const [resumeExperience, setResumeExperience] = useState('');
  const [resumeProjects, setResumeProjects] = useState('');
  const [resumeAchievements, setResumeAchievements] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'tech'>('modern');
  const [activeEditorTab, setActiveEditorTab] = useState<'all' | 'personal' | 'skills' | 'experience' | 'projects'>('all');

  // Synchronize resume builder state with authenticated student profile
  useEffect(() => {
    if (studentProfile) {
      setResumeName(studentProfile.name || '');
      setResumeEmail(studentProfile.email || '');
      setResumePhone(studentProfile.phone || '');
      setResumeCollege(studentProfile.college || '');
      setResumeDegree(studentProfile.department ? `B.Tech in ${studentProfile.department}` : '');
      setResumeHeadline(studentProfile.department ? `Aspiring ${activeRole.title} | B.Tech ${studentProfile.department}` : `Aspiring ${activeRole.title}`);
      if (skillsWeHave && skillsWeHave.length > 0 && !resumeSkills) {
        setResumeSkills(skillsWeHave.join(', '));
      }
    }
  }, [studentProfile, activeRole.title, skillsWeHave, resumeSkills]);

  const roleKeywords = activeRole.keySkills || [];
  const matchedKeywords = roleKeywords.filter(k => 
    resumeSkills.toLowerCase().includes(k.toLowerCase()) ||
    resumeProjects.toLowerCase().includes(k.toLowerCase()) ||
    resumeExperience.toLowerCase().includes(k.toLowerCase())
  );
  const keywordMatchPercent = roleKeywords.length > 0
    ? Math.round((matchedKeywords.length / roleKeywords.length) * 100)
    : 100;

  const handleInjectKeywords = () => {
    const missing = roleKeywords.filter(k => !matchedKeywords.includes(k));
    if (missing.length > 0) {
      setResumeSkills(prev => prev ? `${prev}, ${missing.join(', ')}` : missing.join(', '));
      if (triggerConfetti) triggerConfetti();
    }
  };

  const handleAutoFillResume = () => {
    setResumeName(studentProfile?.name || '');
    setResumeEmail(studentProfile?.email || '');
    setResumePhone(studentProfile?.phone || '');
    setResumeCollege(studentProfile?.college || '');
    setResumeDegree(studentProfile?.department ? `B.Tech in ${studentProfile.department}` : '');
    setResumeHeadline(studentProfile?.department ? `Aspiring ${activeRole.title} | B.Tech ${studentProfile.department}` : `Aspiring ${activeRole.title}`);
    setResumeSkills(skillsWeHave && skillsWeHave.length > 0 ? skillsWeHave.join(', ') : '');
    setResumeExperience('');
    setResumeProjects('');
    setResumeAchievements('');
  };

  const printOrSaveResumeOnly = () => {
    const resumeEl = document.getElementById('built-resume-document');
    if (!resumeEl) return;

    // Create a clean, hidden iframe to isolate the resume for printing/saving as PDF
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // Grab all stylesheet rules from the parent document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => node.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeName ? `${resumeName.replace(/\\s+/g, '_')}_Resume` : 'ATS_Resume'}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${styles}
          <style>
            @page {
              size: A4;
              margin: 10mm 15mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #built-resume-document {
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .ats-parser-tag {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div style="padding: 10px 15px;">
            ${resumeEl.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        if (triggerConfetti) triggerConfetti();
      } catch (err) {
        console.error('Error printing isolated resume:', err);
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }
    }, 300);
  };

  const handleSaveResumeFile = () => {
    const resumeEl = document.getElementById('built-resume-document');
    if (!resumeEl) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeName || 'Student'} - Resume</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
    h1 { font-size: 24px; text-transform: uppercase; margin-bottom: 4px; }
    h3 { font-size: 13px; text-transform: uppercase; border-bottom: 1.5px solid #0f172a; padding-bottom: 2px; margin-top: 16px; margin-bottom: 8px; letter-spacing: 0.05em; font-weight: bold; }
    p { margin: 4px 0; font-size: 13px; }
    .row { display: flex; justify-content: space-between; font-weight: bold; }
    .ats-parser-tag { display: none; }
  </style>
</head>
<body>
  ${resumeEl.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeName ? resumeName.replace(/\\s+/g, '_') : 'My'}_ATS_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (triggerConfetti) triggerConfetti();
  };

  const handleCopyResumeText = () => {
    const text = `${resumeName}
${resumeEmail} | ${resumePhone} | ${resumeCollege}
Target Role: ${resumeHeadline}

EDUCATION:
${resumeCollege} - ${resumeDegree} (CGPA: 8.92 / 10.0)

TECHNICAL COMPETENCIES:
${resumeSkills}

EXPERIENCE:
${resumeExperience}

FEATURED PROJECTS:
${resumeProjects}

CERTIFICATIONS & HONORS:
${resumeAchievements}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 33. Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Verified Student • {studentProfile.college}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {studentProfile.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Target Role: <strong className="text-white">{activeRole.title}</strong> &bull; Industry Readiness score is at <strong className="text-white">{realReadinessScore}%</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('skill-profile')}
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Skills &amp; Assessment Hub
            </button>
            <button
              onClick={() => setActiveTab('online-courses')}
              className="px-4 py-2.5 bg-blue-800/80 hover:bg-blue-800 text-white text-xs font-bold rounded-xl border border-blue-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Online Courses
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('resume-building-portal');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Resume Building Portal
            </button>
          </div>
        </div>
      </div>

      {/* Profile Incomplete Reminder Banner (Appears for every student who hasn't completed their profile) */}
      {realProfileCompletion < 100 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/30 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Profile Incomplete: Action Required ({realProfileCompletion}% Completed)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                    Needs Attention
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Your student profile is currently at <strong>{realProfileCompletion}%</strong> strength. Incomplete profiles miss out on verified recruiter shortlists and campus drive recommendations. Complete the {missingProfileItems.length} missing section{missingProfileItems.length !== 1 ? 's' : ''} below to achieve 100% eligibility.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Complete Profile Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar & Metric Summary */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Profile Strength Progress</span>
              <span className="text-amber-700 font-bold">{100 - realProfileCompletion}% remaining to reach 100% placement readiness</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${realProfileCompletion}%` }}
              />
            </div>
          </div>

          {/* Missing Fields Checklist Badges */}
          {missingProfileItems.length > 0 && (
            <div className="pt-2 border-t border-amber-200/50">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Missing Sections to Complete:
              </span>
              <div className="flex flex-wrap gap-2">
                {missingProfileItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab('profile')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300/80 hover:border-amber-500 hover:bg-amber-50 text-slate-800 text-xs font-medium transition-all shadow-2xs group cursor-pointer"
                    title={`Click to fill: ${item.description}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                    <span>{item.label}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
                      +{item.points}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary KPI Cards - 100% Real Dynamically Computed Values */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Overall Skill Score */}
        <div
          onClick={() => setActiveTab('skill-profile')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Overall Skill Score</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {assessmentScores?.completed ? assessmentScores.overall : `${possessedRequiredCount}/${totalRequired}`}
            </span>
            <span className="text-xs text-slate-400">
              {assessmentScores?.completed ? '/ 100' : 'Skills'}
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            {assessmentScores?.completed ? 'Calibrated via Assessment' : 'Verified Skill Inventory'}
          </span>
        </div>

        {/* Industry Readiness */}
        <div
          onClick={() => setActiveTab('skill-profile')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Industry Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{realReadinessScore}%</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              {realReadinessScore >= 80 ? 'Tier-1 Ready' : realReadinessScore >= 60 ? 'Competitive' : 'Developing'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${realReadinessScore}%` }} />
          </div>
        </div>

        {/* Active Applications */}
        <div
          onClick={() => setActiveTab('applications')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Applications</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{applications.length}</span>
            <span className="text-xs text-purple-600 font-bold">
              {applications.filter(a => a.currentStage === 'Interview' || a.currentStage === 'Shortlisted').length} Active Stages
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block truncate">
            {applications.length > 0 ? applications.slice(0, 2).map(a => a.company).join(' • ') : 'No active applications'}
          </span>
        </div>

        {/* Profile Completion */}
        <div
          onClick={() => setActiveTab('profile')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Profile Completion</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{realProfileCompletion}%</span>
            <span className="text-xs text-slate-400 font-semibold">
              {realProfileCompletion >= 90 ? 'Complete' : 'In Progress'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${realProfileCompletion}%` }} />
          </div>
        </div>

        {/* Resume Building Portal KPI */}
        <div
          onClick={() => {
            const el = document.getElementById('resume-building-portal');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Resume Portal</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{keywordMatchPercent}</span>
            <span className="text-xs text-slate-400">/ 100 ATS</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block flex items-center gap-1">
            {keywordMatchPercent >= 80 ? 'High ATS Match' : 'Add Role Keywords'} &rarr;
          </span>
        </div>
      </div>

      {/* Active Application Stage Tracker Bar */}
      {activeApp && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeApp.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  Featured Application Stage
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{activeApp.title} — {activeApp.company}</h3>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('applications')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              Full Timeline <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected'].map((step, idx) => {
              const isPast = idx < 3; // up to shortlisted
              const isCurrent = idx === 3; // interview
              return (
                <div key={step} className="space-y-1.5 text-center">
                  <div className={`h-2 rounded-full transition-all ${
                    isPast ? 'bg-emerald-500' : isCurrent ? 'bg-blue-600 animate-pulse' : 'bg-slate-100'
                  }`} />
                  <span className={`text-[10px] font-bold block ${
                    isPast ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-slate-400'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <strong>Next Step:</strong> {activeApp.notes}
          </p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN 2-COLUMN SECTION: RECOMMENDED JOBS (LEFT) & AI COPILOT BOT (RIGHT)
          ────────────────────────────────────────────────────────────────────────── */}
      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN SECTION: AI PLACEMENT COPILOT & TARGET ROLE HUB
          ────────────────────────────────────────────────────────────────────────── */}
      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN SECTION: TARGET ROLE CONTEXT & AI RECOMMENDATIONS SPOTLIGHT
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Career Target & Placement Context Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Context</h3>
                  <p className="text-sm font-black text-slate-900 truncate max-w-[190px]">{activeRole.title}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activeRole.demand}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Degree &amp; Branch</span>
                <p className="font-extrabold text-slate-800">{studentProfile.department}</p>
                <p className="text-[11px] text-slate-500">B.Tech &bull; {studentProfile.college}</p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold text-blue-500 uppercase">Target Role Key Skills</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(activeRole.keySkills || []).slice(0, 5).map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white text-blue-800 border border-blue-200/80 font-bold text-[10px]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Industry Readiness</span>
                  <span className="text-xs font-black text-purple-800">{studentProfile.industryReadinessScore}%</span>
                </div>
                <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${studentProfile.industryReadinessScore}%` }} />
                </div>
                <p className="text-[10px] text-purple-700 mt-1">
                  Tier-1 Recruiter Ready benchmark score
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setActiveTab('career-path')}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center transition-colors cursor-pointer text-xs"
                >
                  Roadmap
                </button>
                <button
                  onClick={() => setActiveTab('skill-profile')}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center transition-colors cursor-pointer text-xs shadow-xs"
                >
                  Skill Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Recommendations & Placement Copilot Spotlight (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden border border-indigo-800/40 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">AI Placement Copilot &amp; Recommendations</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Active in AI Recommended
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Tuned for {activeRole.title} &bull; B.Tech {studentProfile.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('recommended')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <span>Chat with AI Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div
                onClick={() => setActiveTab('recommended')}
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Curated Roles</span>
                </div>
                <p className="text-sm font-black text-white">Top Match Openings</p>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Jobs &amp; internships filtered by branch &amp; target skills.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('recommended')}
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interview Prep</span>
                </div>
                <p className="text-sm font-black text-white">Interactive Copilot</p>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Ask technical questions, system design tips &amp; HR strategies.
                </p>
              </div>

              <div
                onClick={() => {
                  const el = document.getElementById('resume-building-portal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>ATS Score 96%</span>
                </div>
                <p className="text-sm font-black text-white">Resume Portal</p>
                <p className="text-[11px] text-slate-300 leading-snug">
                  ATS keywords tailored for Tier-1 campus placement rounds.
                </p>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[11px] text-indigo-300">
                💡 AI Placement Bot has been relocated inside the <strong>AI Recommended</strong> tab for focused guidance.
              </span>
              <button
                onClick={() => setActiveTab('recommended')}
                className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                Open AI Recommended Hub &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          RESUME BUILDING PORTAL
          ────────────────────────────────────────────────────────────────────────── */}
      <div id="resume-building-portal" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Portal Header & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Resume Building Portal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                ATS Pass Rate: 96 / 100
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                keywordMatchPercent >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <Zap className="w-3.5 h-3.5" />
                Role Alignment: {keywordMatchPercent}% Match
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Resume Building Portal
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl mt-1">
              Official ATS Resume Builder calibrated for <strong className="text-slate-800">{activeRole.title}</strong> and <strong className="text-slate-800">B.Tech {studentProfile.department}</strong>. Tailor your credentials, inject target keywords, and export a recruiter-approved CV.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAutoFillResume}
              title="Reset fields using current profile and career role data"
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Auto-Fill from Role</span>
            </button>

            <button
              onClick={handleCopyResumeText}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Plain Text</span>
                </>
              )}
            </button>

            <button
              onClick={printOrSaveResumeOnly}
              title="Prints ONLY the built resume page (not the dashboard)"
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Resume</span>
            </button>

            <button
              onClick={printOrSaveResumeOnly}
              title="Save only the built resume as a clean PDF"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save as PDF</span>
            </button>

            <button
              onClick={handleSaveResumeFile}
              title="Save built resume file to your device"
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Save .HTML</span>
            </button>
          </div>
        </div>

        {/* Portal Controls: Template Selector & Role Keyword Optimizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          {/* Template Selector */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              ATS Resume Template Style
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedTemplate('modern')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  selectedTemplate === 'modern'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Modern ATS
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('classic')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  selectedTemplate === 'classic'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Harvard Classic
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('tech')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  selectedTemplate === 'tech'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tech Minimal
              </button>
            </div>
          </div>

          {/* Target Role Keyword Matcher */}
          <div className="lg:col-span-8 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Target Role Keywords ({activeRole.title}) &bull; {matchedKeywords.length}/{roleKeywords.length} Matched
              </label>
              {roleKeywords.length > matchedKeywords.length && (
                <button
                  type="button"
                  onClick={handleInjectKeywords}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  + Inject Missing Skills ({roleKeywords.length - matchedKeywords.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {roleKeywords.map(skill => {
                const isMatched = matchedKeywords.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-white text-slate-500 border-slate-200 line-through opacity-70'
                    }`}
                  >
                    {isMatched ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-slate-400" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Portal Studio Body: Left Editor & Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Controls (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                Resume Content Fields
              </h3>

              {/* Editor Section Switcher */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('all')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    activeEditorTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('personal')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    activeEditorTab === 'personal' ? 'bg-slate-800 text-white' : 'text-slate-600'
                  }`}
                >
                  Contact
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('skills')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    activeEditorTab === 'skills' ? 'bg-slate-800 text-white' : 'text-slate-600'
                  }`}
                >
                  Skills
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('experience')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    activeEditorTab === 'experience' ? 'bg-slate-800 text-white' : 'text-slate-600'
                  }`}
                >
                  Exp
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('projects')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    activeEditorTab === 'projects' ? 'bg-slate-800 text-white' : 'text-slate-600'
                  }`}
                >
                  Projects
                </button>
              </div>
            </div>

            {/* Name */}
            {(activeEditorTab === 'all' || activeEditorTab === 'personal') && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeEmail}
                      onChange={(e) => setResumeEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumePhone}
                      onChange={(e) => setResumePhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                {/* College & Degree */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College &amp; Degree</label>
                  <input
                    type="text"
                    value={resumeCollege}
                    onChange={(e) => setResumeCollege(e.target.value)}
                    placeholder="College Name"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs mb-2"
                  />
                  <input
                    type="text"
                    value={resumeDegree}
                    onChange={(e) => setResumeDegree(e.target.value)}
                    placeholder="Degree & Branch"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
                  />
                </div>
              </>
            )}

            {/* Target Headline */}
            {(activeEditorTab === 'all' || activeEditorTab === 'personal') && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Role Headline</label>
                <input
                  type="text"
                  value={resumeHeadline}
                  onChange={(e) => setResumeHeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
                />
              </div>
            )}

            {/* Technical Skills */}
            {(activeEditorTab === 'all' || activeEditorTab === 'skills') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Technical Competencies</label>
                  <span className="text-[10px] text-emerald-600 font-bold">ATS Keyword Prioritized</span>
                </div>
                <textarea
                  rows={3}
                  value={resumeSkills}
                  onChange={(e) => setResumeSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs leading-relaxed"
                />
              </div>
            )}

            {/* Industrial Experience */}
            {(activeEditorTab === 'all' || activeEditorTab === 'experience') && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industrial Internship / Work Experience</label>
                <textarea
                  rows={3}
                  value={resumeExperience}
                  onChange={(e) => setResumeExperience(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs leading-relaxed"
                />
              </div>
            )}

            {/* Featured Projects */}
            {(activeEditorTab === 'all' || activeEditorTab === 'projects') && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Featured Engineering Projects</label>
                  <textarea
                    rows={2}
                    value={resumeProjects}
                    onChange={(e) => setResumeProjects(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs leading-relaxed"
                  />
                </div>

                {/* Certifications & Honors */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Certifications &amp; Hackathon Honors</label>
                  <textarea
                    rows={2}
                    value={resumeAchievements}
                    onChange={(e) => setResumeAchievements(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs leading-relaxed"
                  />
                </div>
              </>
            )}
          </div>

          {/* Right Column: Live ATS Paper Preview (7 cols) */}
          <div className="lg:col-span-7">
            <div id="built-resume-document" className={`bg-white rounded-2xl border-2 p-7 sm:p-9 shadow-lg text-slate-800 space-y-4 print:p-0 print:border-none print:shadow-none relative transition-all ${
              selectedTemplate === 'classic'
                ? 'font-serif border-slate-300'
                : selectedTemplate === 'tech'
                ? 'font-mono border-slate-300 text-[11px]'
                : 'font-sans border-slate-200 text-xs'
            }`}>
              {/* ATS Parser Watermark */}
              <div className="ats-parser-tag flex items-center justify-between border-b border-slate-200 pb-3 text-[11px] text-slate-400 font-sans">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Format: {selectedTemplate === 'classic' ? 'Harvard Ivy League Standard' : selectedTemplate === 'tech' ? 'Engineering Technical Standard' : 'Modern ATS Product Standard'}
                </span>
                <span>Single Page &bull; 0 Parsing Errors</span>
              </div>

              {/* Resume Header */}
              <div className={`pb-3 space-y-1 ${
                selectedTemplate === 'classic'
                  ? 'text-center border-b-2 border-slate-900'
                  : selectedTemplate === 'tech'
                  ? 'text-left border-b border-slate-800'
                  : 'text-center border-b border-slate-800'
              }`}>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {resumeName || 'Student Name'}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {[resumeEmail, resumePhone, studentProfile.location].filter(Boolean).join(' • ') || 'Contact info not specified'}
                </p>
                {(studentProfile.socials?.linkedin || studentProfile.socials?.github || studentProfile.socials?.portfolio) && (
                  <p className="text-[11px] text-blue-700 font-medium">
                    {[
                      studentProfile.socials?.linkedin ? studentProfile.socials.linkedin.replace('https://', '') : null,
                      studentProfile.socials?.github ? studentProfile.socials.github.replace('https://', '') : null,
                      studentProfile.socials?.portfolio ? studentProfile.socials.portfolio.replace('https://', '') : null
                    ].filter(Boolean).join(' • ')}
                  </p>
                )}
                {resumeHeadline && (
                  <p className="text-xs font-bold text-slate-800 pt-0.5">
                    {resumeHeadline}
                  </p>
                )}
              </div>

              {/* Education */}
              <div className="space-y-1 pt-1">
                <h3 className={`font-black uppercase tracking-wider text-slate-900 pb-0.5 ${
                  selectedTemplate === 'classic'
                    ? 'text-xs border-b border-slate-900 tracking-widest'
                    : selectedTemplate === 'tech'
                    ? 'text-[11px] text-emerald-800 border-b border-slate-400'
                    : 'text-xs border-b border-slate-400'
                }`}>
                  {selectedTemplate === 'tech' ? '> EDUCATION' : 'Education'}
                </h3>
                <div className="flex justify-between font-bold pt-1">
                  <span>{resumeCollege || 'Institutional Affiliation'}</span>
                  <span>{studentProfile.graduationYear ? `Class of ${studentProfile.graduationYear}` : 'Enrolled'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{resumeDegree || 'Degree in Progress'}</span>
                  <span className="font-bold text-slate-800">{studentProfile.cgpa > 0 ? `CGPA: ${studentProfile.cgpa} / 10.0` : 'CGPA: Pending Evaluation'}</span>
                </div>
              </div>

              {/* Technical Competencies */}
              <div className="space-y-1 pt-1">
                <h3 className={`font-black uppercase tracking-wider text-slate-900 pb-0.5 ${
                  selectedTemplate === 'classic'
                    ? 'text-xs border-b border-slate-900 tracking-widest'
                    : selectedTemplate === 'tech'
                    ? 'text-[11px] text-emerald-800 border-b border-slate-400'
                    : 'text-xs border-b border-slate-400'
                }`}>
                  {selectedTemplate === 'tech' ? '> TECHNICAL COMPETENCIES' : 'Technical Competencies'}
                </h3>
                <p className="text-slate-700 leading-relaxed pt-1">
                  {resumeSkills ? (
                    <><strong>Core Frameworks &amp; Tools:</strong> {resumeSkills}</>
                  ) : (
                    <span className="text-slate-400 italic">No technical skills recorded yet. Complete skill tests or add competencies in editor.</span>
                  )}
                </p>
              </div>

              {/* Industrial Experience */}
              <div className="space-y-1 pt-1">
                <h3 className={`font-black uppercase tracking-wider text-slate-900 pb-0.5 ${
                  selectedTemplate === 'classic'
                    ? 'text-xs border-b border-slate-900 tracking-widest'
                    : selectedTemplate === 'tech'
                    ? 'text-[11px] text-emerald-800 border-b border-slate-400'
                    : 'text-xs border-b border-slate-400'
                }`}>
                  {selectedTemplate === 'tech' ? '> INDUSTRIAL EXPERIENCE' : 'Industrial Experience & Internships'}
                </h3>
                {resumeExperience ? (
                  <p className="text-slate-700 leading-relaxed pt-1">
                    {resumeExperience}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-xs pt-1">
                    No verified industrial internships recorded yet.
                  </p>
                )}
              </div>

              {/* Featured Projects */}
              <div className="space-y-1 pt-1">
                <h3 className={`font-black uppercase tracking-wider text-slate-900 pb-0.5 ${
                  selectedTemplate === 'classic'
                    ? 'text-xs border-b border-slate-900 tracking-widest'
                    : selectedTemplate === 'tech'
                    ? 'text-[11px] text-emerald-800 border-b border-slate-400'
                    : 'text-xs border-b border-slate-400'
                }`}>
                  {selectedTemplate === 'tech' ? '> KEY PROJECTS' : 'Key Engineering Projects'}
                </h3>
                {resumeProjects ? (
                  <p className="text-slate-700 leading-relaxed pt-1">
                    {resumeProjects}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-xs pt-1">
                    No engineering projects recorded yet.
                  </p>
                )}
              </div>

              {/* Certifications & Honors */}
              <div className="space-y-1 pt-1">
                <h3 className={`font-black uppercase tracking-wider text-slate-900 pb-0.5 ${
                  selectedTemplate === 'classic'
                    ? 'text-xs border-b border-slate-900 tracking-widest'
                    : selectedTemplate === 'tech'
                    ? 'text-[11px] text-emerald-800 border-b border-slate-400'
                    : 'text-xs border-b border-slate-400'
                }`}>
                  {selectedTemplate === 'tech' ? '> CERTIFICATIONS & HONORS' : 'Verified Certifications & Honors'}
                </h3>
                {resumeAchievements ? (
                  <p className="text-slate-700 leading-relaxed pt-1">
                    {resumeAchievements}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-xs pt-1">
                    No verified certifications or honors recorded yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Next Steps Guidance */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-navy-900 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Sparkles className="w-4 h-4" />
            AI Placement Roadmap
          </div>
          <h3 className="text-base font-bold">Target Role: {activeRole.title}</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Complete the AWS Cloud Practitioner or Meta Frontend certification to boost your selection odds to 98%.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('career-path')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-md cursor-pointer"
        >
          Customize Career Roadmap
        </button>
      </div>
    </div>
  );
};
