import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Upload,
  FileText,
  X,
  BadgeCheck,
  Trash2,
  Eye,
  Plus,
  BarChart3,
  TrendingUp,
  Info,
  Check,
  FileUp,
  ExternalLink,
  Clock,
  RotateCcw,
  Zap,
  Terminal,
  CheckSquare,
  FileEdit,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  XCircle,
  Flame,
  Layers,
  HelpCircle,
  BookOpen,
  Search,
  Filter,
  Briefcase,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockSkillBreakdown, mockSkillGapAnalysis } from '../../data/mockData';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';
import { isSkillEquivalent } from '../../utils/skillMatcher';
import {
  generatePersonalizedAssessment,
  evaluateAssessment,
  AssessmentEvaluationResult
} from '../../data/assessmentBank';
import { AssessmentQuestion, AssessmentQuestionType } from '../../types';
import { api } from '../../services/api';

export interface SkillProfileViewProps {
  initialMode?: 'overview' | 'matrix' | 'assessment' | 'radar' | 'certificates' | 'gaps';
}

export const SkillProfileView: React.FC<SkillProfileViewProps> = ({ initialMode = 'overview' }) => {
  const {
    studentProfile,
    setStudentProfile,
    setActiveTab,
    certificates,
    gapSkills,
    uploadSkillCertificate,
    removeSkillCertificate,
    addGapSkill,
    removeGapSkill,
    assessmentScores,
    setAssessmentScores,
    triggerConfetti,
    setPageView,
    verifiedSkills,
    addVerifiedSkill,
    selectedCareerRoleId,
    setSelectedCareerRoleId,
    activeCareerRole,
    roleRequiredSkills,
    skillsWeHave
  } = useApp();

  // Skills possessed by student that fulfill requirements for this specific career role
  const roleSkillsPossessed = useMemo(() => {
    return roleRequiredSkills.filter(req =>
      skillsWeHave.some(s => s.toLowerCase() === req.toLowerCase() || isSkillEquivalent(req, s))
    );
  }, [roleRequiredSkills, skillsWeHave]);

  // Overall preparedness / alignment percentage for this career role
  const roleAlignmentPercentage = useMemo(() => {
    if (roleRequiredSkills.length === 0) return 100;
    return Math.round((roleSkillsPossessed.length / roleRequiredSkills.length) * 100);
  }, [roleSkillsPossessed.length, roleRequiredSkills.length]);

  // Find which milestone requires a given skill, for rich context in gap cards
  const getSkillRoleContext = (skillName: string) => {
    if (!activeCareerRole || !activeCareerRole.milestones) return `Core Competency for ${activeCareerRole?.title || 'Selected Role'}`;
    for (const milestone of activeCareerRole.milestones) {
      if (milestone.requiredSkills.some(s => s.toLowerCase() === skillName.toLowerCase() || isSkillEquivalent(s, skillName))) {
        return `Milestone Step ${milestone.stepNumber}: ${milestone.title}`;
      }
    }
    return `Core Competency for ${activeCareerRole.title}`;
  };

  // Active view tab inside the unified block
  const [activeMode, setActiveMode] = useState<'overview' | 'matrix' | 'assessment' | 'radar' | 'certificates' | 'gaps'>(initialMode);
  const [isQuizActive, setIsQuizActive] = useState(initialMode === 'assessment');

  // Sync initialMode when prop changes
  useEffect(() => {
    if (initialMode) {
      setActiveMode(initialMode);
      if (initialMode === 'assessment') {
        setIsQuizActive(true);
      }
    }
  }, [initialMode]);

  // Skills Inventory State (Verified Skills & Industry Credentials)
  const [skillMatrixSearch, setSkillMatrixSearch] = useState('');
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('Technical');
  const [customSkillScore, setCustomSkillScore] = useState(85);

  // User-added custom verified skills list
  const [customSkills, setCustomSkills] = useState<Array<{
    id: string;
    name: string;
    category: string;
    score: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    sourceDescription: string;
    issuer?: string;
    credentialId?: string;
    fileName?: string;
    fileDataUrl?: string;
  }>>([]);

  // Verified certified credentials (empty by default; earned via upload or assessment)
  const baseCertifiedSkills = useMemo(() => [] as Array<{
    id: string;
    name: string;
    category: string;
    score: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    issuer?: string;
    credentialId?: string;
    fileName?: string;
    sourceDescription: string;
  }>, []);

  // Verified skills list dynamically merging certified skills and uploaded certificates
  const allSkillsInventory = useMemo(() => {
    // Map of verified certificates from context
    const certsByName = new Map<string, typeof certificates[0]>();
    certificates.forEach(c => {
      certsByName.set(c.skillName.toLowerCase(), c);
    });

    const list: Array<{
      id: string;
      name: string;
      category: string;
      score: number;
      level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
      sourceDescription: string;
      issuer?: string;
      credentialId?: string;
      fileName?: string;
      fileDataUrl?: string;
      recruiterImpact: 'High';
    }> = [];

    // 1. Process Certified Skills
    baseCertifiedSkills.forEach(cs => {
      const matchInCtx = certsByName.get(cs.name.toLowerCase());
      list.push({
        id: cs.id,
        name: cs.name,
        category: cs.category,
        score: cs.score,
        level: cs.level,
        sourceDescription: cs.sourceDescription,
        issuer: matchInCtx?.issuer || cs.issuer,
        credentialId: cs.credentialId,
        fileName: matchInCtx?.fileName || cs.fileName,
        fileDataUrl: matchInCtx?.fileDataUrl,
        recruiterImpact: 'High'
      });
    });

    // 2. Add any certificates in context not yet covered
    certificates.forEach(c => {
      const alreadyAdded = list.some(item => item.name.toLowerCase() === c.skillName.toLowerCase());
      if (!alreadyAdded) {
        list.push({
          id: c.id,
          name: c.skillName,
          category: 'Technical',
          score: 88,
          level: 'Advanced',
          sourceDescription: 'Uploaded Certificate Proof',
          issuer: c.issuer || 'Course / Certificate',
          fileName: c.fileName,
          fileDataUrl: c.fileDataUrl,
          recruiterImpact: 'High'
        });
      }
    });

    // 3. Custom added skills (profile skills)
    customSkills.forEach(csk => {
      list.push({
        id: csk.id,
        name: csk.name,
        category: csk.category,
        score: csk.score,
        level: csk.level,
        sourceDescription: csk.sourceDescription || 'Self-Reported / Profile Entry',
        issuer: csk.issuer || 'Self-Reported',
        credentialId: csk.credentialId,
        fileName: csk.fileName,
        fileDataUrl: csk.fileDataUrl,
        recruiterImpact: 'High'
      });
    });

    return list;
  }, [baseCertifiedSkills, certificates, customSkills]);

  const filteredSkillsInventory = useMemo(() => {
    return allSkillsInventory.filter(s => {
      if (skillMatrixSearch) {
        const q = skillMatrixSearch.toLowerCase();
        const mName = s.name.toLowerCase().includes(q);
        const mCat = s.category.toLowerCase().includes(q);
        const mIss = s.issuer?.toLowerCase().includes(q) || false;
        if (!mName && !mCat && !mIss) return false;
      }
      return true;
    });
  }, [allSkillsInventory, skillMatrixSearch]);

  const handleCreateCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    const newSkillItem = {
      id: `custom-sk-${Date.now()}`,
      name: customSkillName.trim(),
      category: customSkillCategory,
      score: customSkillScore,
      level: customSkillScore >= 90 ? 'Expert' as const : customSkillScore >= 80 ? 'Advanced' as const : 'Intermediate' as const,
      sourceDescription: 'Self-Reported / Profile Entry',
      issuer: 'Self-Reported',
      recruiterImpact: 'High' as const
    };

    setCustomSkills(prev => [newSkillItem, ...prev]);
    addVerifiedSkill(newSkillItem);
    setIsAddSkillModalOpen(false);
    setCustomSkillName('');
    triggerConfetti();
  };

  // Certificate Lightbox & Custom Skill state
  const [previewCert, setPreviewCert] = useState<{ name: string; file: string; mime?: string } | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [activeUploadSkill, setActiveUploadSkill] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Assessment Quiz state
  const [sessionKey, setSessionKey] = useState<string>(() => {
    return (studentProfile?.id || studentProfile?.name || 'student') + '-' + Date.now();
  });

  const questions = useMemo(() => {
    return generatePersonalizedAssessment(sessionKey, 7);
  }, [sessionKey]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<AssessmentEvaluationResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [showDetailedReview, setShowDetailedReview] = useState(true);
  const [fillBlankInput, setFillBlankInput] = useState<string>('');

  const evaluateAndSubmit = useCallback((answers: Record<number, any>) => {
    const evalResult = evaluateAssessment(questions, answers);
    setEvaluation(evalResult);

    setAssessmentScores({
      completed: true,
      technical: evalResult.technicalScore,
      soft: evalResult.softScore,
      overall: evalResult.overallScore,
      categoryScores: evalResult.categoryScores
    });

    setStudentProfile(prev => ({
      ...prev,
      overallSkillScore: evalResult.overallScore,
      technicalSkillScore: evalResult.technicalScore,
      softSkillScore: evalResult.softScore,
      industryReadinessScore: Math.min(100, Math.max(50, evalResult.overallScore + 5))
    }));

    setIsSubmitted(true);
    triggerConfetti();

    // Persist scores to SQLite database via backend API
    api.students.submitAssessment({
      technical: evalResult.technicalScore,
      soft: evalResult.softScore,
      overall: evalResult.overallScore,
      categoryScores: evalResult.categoryScores
    }).catch(err => {
      console.warn('Could not persist assessment to backend:', err);
    });
  }, [questions, setAssessmentScores, setStudentProfile, triggerConfetti]);

  const handleAutoSubmit = useCallback(() => {
    evaluateAndSubmit(userAnswers);
  }, [evaluateAndSubmit, userAnswers]);

  // Sync fillBlankInput with current question answer
  useEffect(() => {
    const currAns = userAnswers[currentIdx];
    if (typeof currAns === 'string') {
      setFillBlankInput(currAns);
    } else {
      setFillBlankInput('');
    }
  }, [currentIdx, userAnswers]);

  // Timer countdown
  useEffect(() => {
    if (!isQuizActive || isSubmitted) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuizActive, isSubmitted, timeLeft, handleAutoSubmit]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ: AssessmentQuestion = questions[currentIdx] || questions[0];
  const totalQ = questions.length;
  const progressPercent = Math.round(((currentIdx + 1) / totalQ) * 100);

  // Single Select & Scenario handler
  const handleSelectSingle = (optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
  };

  // Multi Select handler (toggle)
  const handleToggleMulti = (optionIndex: number) => {
    setUserAnswers(prev => {
      const currentList: number[] = Array.isArray(prev[currentIdx]) ? [...prev[currentIdx]] : [];
      const exists = currentList.indexOf(optionIndex);
      if (exists > -1) {
        currentList.splice(exists, 1);
      } else {
        currentList.push(optionIndex);
      }
      return { ...prev, [currentIdx]: currentList.sort((a, b) => a - b) };
    });
  };

  // Fill in the blank handler
  const handleFillBlankChange = (val: string) => {
    setFillBlankInput(val);
    setUserAnswers(prev => ({ ...prev, [currentIdx]: val }));
  };

  const handleSubmit = () => {
    evaluateAndSubmit(userAnswers);
  };

  const handleStartAssessment = () => {
    setIsQuizActive(true);
    setIsSubmitted(false);
    setActiveMode('assessment');
    setCurrentIdx(0);
    setTimeLeft(900);
  };

  const handleRetake = () => {
    setSessionKey((studentProfile?.id || 'student') + '-' + Math.random().toString(36).substring(2, 9));
    setUserAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setEvaluation(null);
    setTimeLeft(900);
    setFillBlankInput('');
    setIsQuizActive(true);
    setActiveMode('assessment');
  };

  const isCurrentAnswered = () => {
    const ans = userAnswers[currentIdx];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'string') return ans.trim().length > 0;
    return true;
  };

  const answeredCount = Object.keys(userAnswers).filter(k => {
    const v = userAnswers[Number(k)];
    if (v === undefined || v === null) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim().length > 0;
    return true;
  }).length;

  const getQuestionTypeBadge = (type?: AssessmentQuestionType) => {
    switch (type) {
      case 'code-analysis':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Terminal className="w-3 h-3 text-purple-600" />
            Code Analysis & Output
          </span>
        );
      case 'multi-select':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <CheckSquare className="w-3 h-3 text-amber-600" />
            Multiple Answers
          </span>
        );
      case 'fill-blank':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <FileEdit className="w-3 h-3 text-emerald-600" />
            Short Text / Keyword Match
          </span>
        );
      case 'scenario-judgment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Lightbulb className="w-3 h-3 text-indigo-600" />
            Situational Scenario
          </span>
        );
      case 'single-select':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <HelpCircle className="w-3 h-3 text-blue-600" />
            Conceptual Choice
          </span>
        );
    }
  };

  const getDifficultyBadge = (diff?: 'Easy' | 'Medium' | 'Hard', points?: number) => {
    const p = points || 10;
    switch (diff) {
      case 'Hard':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Flame className="w-3 h-3 text-rose-500" /> Hard • {p} pts
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Medium • {p} pts
          </span>
        );
      case 'Easy':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Easy • {p} pts
          </span>
        );
    }
  };

  // Certificate file triggers
  const handleTriggerUpload = (skillName: string) => {
    setActiveUploadSkill(skillName);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadSkill) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      uploadSkillCertificate(activeUploadSkill, file.name, dataUrl, file.type);
      setActiveUploadSkill(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDropUpload = (e: React.DragEvent, skillName: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      uploadSkillCertificate(skillName, file.name, dataUrl, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    addGapSkill(newSkillInput.trim());
    setNewSkillInput('');
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hidden File Input for Certificate Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Certificate Preview Lightbox */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm truncate">{previewCert.name}</h3>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-h-48 text-center">
              {previewCert.file.startsWith('data:image/') ? (
                <img
                  src={previewCert.file}
                  alt={previewCert.name}
                  className="max-h-64 rounded-xl object-contain shadow-xs"
                />
              ) : (
                <div className="space-y-3 py-6">
                  <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">{previewCert.name}</p>
                  <p className="text-[11px] text-slate-400">Uploaded Certificate Document</p>
                  <a
                    href={previewCert.file}
                    download={previewCert.name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
                  >
                    Download Certificate
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewCert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          UNIFIED HEADER BLOCK: SKILL PROFILE & ASSESSMENT
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Skill Profile
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                Adaptive AI Skill Assessment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Skill Profile &amp; Assessment Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Your unified competency center: Take adaptive skill assessments, evaluate career readiness against role requirements, and bridge skill gaps.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            {!isQuizActive ? (
              <button
                onClick={handleStartAssessment}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {assessmentScores.completed ? 'Retake Skill Assessment' : 'Start Skill Assessment'}
              </button>
            ) : (
              <button
                onClick={() => { setIsQuizActive(false); setActiveMode('overview'); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile Hub
              </button>
            )}
          </div>
        </div>

        {/* Segmented Mode Switcher Inside the Unified Block */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => { setActiveMode('overview'); setIsQuizActive(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Unified Overview
          </button>

          <button
            onClick={() => { setActiveMode('matrix'); setIsQuizActive(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'matrix'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Skills Matrix ({allSkillsInventory.length})
          </button>

          <button
            onClick={() => { setActiveMode('assessment'); setIsQuizActive(true); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'assessment'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Interactive Assessment Quiz
          </button>

          <button
            onClick={() => { setActiveMode('radar'); setIsQuizActive(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'radar'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Competency Radar &amp; Benchmarks
          </button>

          <button
            onClick={() => { setActiveMode('certificates'); setIsQuizActive(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'certificates'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            Certificates ({certificates.length})
          </button>

          <button
            onClick={() => { setActiveMode('gaps'); setIsQuizActive(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'gaps'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Pending Gaps ({gapSkills.length})
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          UNIFIED TOP METRICS ROW (SYNCS PROFILE, SKILL MATRIX & ASSESSMENT)
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Overall Score</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-600 mt-1.5">
            {assessmentScores?.completed
              ? `${assessmentScores.overall}%`
              : `${Math.min(100, Math.round((allSkillsInventory.length / (activeCareerRole.keySkills.length || 1)) * 100))}%`}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {assessmentScores?.completed ? 'Calibrated via Assessment' : 'Skills Coverage'}
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Technical Assessment</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-indigo-600 mt-1.5">
            {assessmentScores?.completed ? `${assessmentScores.technical}%` : 'Pending'}
          </p>
          <p className={`text-[11px] font-bold mt-1 ${assessmentScores?.completed ? 'text-emerald-600' : 'text-amber-600'}`}>
            {assessmentScores?.completed ? 'Assessment Completed' : 'Assessment Not Taken'}
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Total Skills</span>
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-1.5">{allSkillsInventory.length}</p>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">Skills Inventory</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Role Skill Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-600 mt-1.5">{gapSkills.length}</p>
          <p className="text-[11px] text-amber-700 font-bold mt-1 truncate" title={`Required for ${activeCareerRole.title}`}>
            For {activeCareerRole.title}
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION: SKILLS MATRIX & INVENTORY
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeMode === 'overview' || activeMode === 'matrix') && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {allSkillsInventory.length} Skills Listed
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                  Skills &amp; Competencies Matrix
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Skills &amp; Competencies Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                All technical and professional skills added to your profile or validated through assessments and certificates.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setIsAddSkillModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-2xs whitespace-nowrap">
                All Skills ({filteredSkillsInventory.length})
              </span>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search skills, domain..."
                value={skillMatrixSearch}
                onChange={(e) => setSkillMatrixSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Skills Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Skill &amp; Domain</th>
                  <th className="py-3 px-4">Status / Source</th>
                  <th className="py-3 px-4">Proficiency &amp; Score</th>
                  <th className="py-3 px-4">Certificate / Proof</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkillsInventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      No skills match the current search.
                    </td>
                  </tr>
                ) : (
                  filteredSkillsInventory.map((sk) => {
                    return (
                      <tr
                        key={sk.id}
                        className="transition-colors hover:bg-slate-50/80 bg-emerald-50/10"
                      >
                        {/* 1. Skill & Domain */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{sk.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/70">
                              {sk.category}
                            </span>
                          </div>
                        </td>

                        {/* 2. Status / Source */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              Active Skill
                            </span>
                            <p className="text-[10px] font-semibold text-slate-500 ml-1">
                              Added to Profile
                            </p>
                          </div>
                        </td>

                        {/* 3. Proficiency & Score */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 w-32 sm:w-40">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-extrabold text-slate-800">{sk.score}%</span>
                              <span className="font-semibold text-slate-500">{sk.level}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${sk.score}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 4. Certificate Proof / Verification Source */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                              <FileText className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                              <span className="truncate max-w-[140px] sm:max-w-[180px]">
                                {sk.fileName || `${sk.name}_Skill`}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              {sk.issuer || sk.sourceDescription || 'Self-Reported'}
                            </p>
                          </div>
                        </td>

                        {/* 5. Level / Priority */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {sk.level || 'Proficient'}
                          </span>
                        </td>

                        {/* 6. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setPreviewCert({
                                name: sk.fileName || `${sk.name} Certificate`,
                                file: sk.fileDataUrl || 'data:text/plain;base64,VmVyaWZpZWQgQ2VydGlmaWNhdGUgRG9jdW1lbnQ='
                              });
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3 h-3" /> View Proof
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          INTEGRATED ASSESSMENT BLOCK: QUIZ RUNNER / SCORECARD
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeMode === 'overview' || activeMode === 'assessment') && (
        <div className="bg-white rounded-3xl border-2 border-purple-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header of the Assessment Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-purple-800 text-xs font-extrabold border border-purple-200 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                Interactive Proctored Assessment
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {isQuizActive && !isSubmitted
                  ? `Question ${currentIdx + 1} of ${totalQ}`
                  : 'Adaptive Skill Assessment & Verification'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isQuizActive && !isSubmitted
                  ? 'Answer the personalized questions below to evaluate real-time industry readiness.'
                  : 'Proctored evaluation tested across Software Architecture, Data & AI, Algorithms, and Situational Scenarios.'}
              </p>
            </div>

            {/* Assessment State Status or Timer */}
            {isQuizActive && !isSubmitted ? (
              <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono self-start sm:self-auto ${
                timeLeft < 180
                  ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                  : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}>
                <Clock className={`w-4 h-4 ${timeLeft < 180 ? 'text-rose-600' : 'text-purple-600'}`} />
                <span className="text-xs font-bold hidden sm:inline">Time Remaining:</span>
                <span className="text-sm font-black">{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Assessment Verified
                </span>
                <button
                  onClick={handleStartAssessment}
                  className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Test
                </button>
              </div>
            )}
          </div>

          {/* If Quiz is in Progress: Interactive Question Runner */}
          {isQuizActive && !isSubmitted ? (
            <div className="space-y-6">
              {/* Progress Bar & Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Question {currentIdx + 1} of {totalQ} ({answeredCount} answered)</span>
                  <span>{progressPercent}% Complete</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getQuestionTypeBadge(currentQ.type)}
                    <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {currentQ.section}
                    </span>
                  </div>
                  {getDifficultyBadge(currentQ.difficulty, currentQ.points)}
                </div>

                {/* Prompt */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Code Snippet if present */}
                {currentQ.codeSnippet && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 p-4 font-mono text-xs text-slate-200">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-purple-400" />
                        Execution Snippet
                      </span>
                      <span>Target Output Analysis</span>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre leading-relaxed">
                      <code>{currentQ.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Scenario Context if present */}
                {currentQ.scenarioContext && (
                  <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-xs text-indigo-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-600" /> Production Scenario Context:
                    </div>
                    <p className="leading-relaxed text-indigo-900/90">{currentQ.scenarioContext}</p>
                  </div>
                )}

                {/* Options / Input based on question type */}
                {currentQ.type === 'fill-blank' ? (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700">Enter your keyword / answer:</label>
                    <input
                      type="text"
                      value={fillBlankInput}
                      onChange={(e) => handleFillBlankChange(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-3.5 bg-white rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-[11px] text-slate-400">Case-insensitive exact concept or keyword match.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options?.map((opt, oIdx) => {
                      const isMulti = currentQ.type === 'multi-select';
                      const currentSelected = userAnswers[currentIdx];
                      const isSelected = isMulti
                        ? Array.isArray(currentSelected) && currentSelected.includes(oIdx)
                        : currentSelected === oIdx;

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => isMulti ? handleToggleMulti(oIdx) : handleSelectSingle(oIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-purple-50 border-purple-400 text-purple-950 ring-1 ring-purple-400 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border transition-colors ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'bg-white border-slate-300 text-transparent'
                          }`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="flex-1 leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation and Submission Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>

                {currentIdx < totalQ - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(prev => Math.min(totalQ - 1, prev + 1))}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Submit Assessment
                  </button>
                )}
              </div>
            </div>
          ) : isSubmitted && evaluation ? (
            /* Results Screen */
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-150">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {evaluation.readinessTier}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Assessment Score: {evaluation.overallScore}% Overall
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1">
                  {evaluation.readinessLabel}. Scores synchronized to your SQLite database and ATS resume profile.
                </p>
              </div>

              {/* Category Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Technical Core</span>
                  <p className="text-xl font-black text-purple-900">{evaluation.technicalScore}%</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">Problem Solving</span>
                  <p className="text-xl font-black text-blue-900">{evaluation.categoryScores['Problem Solving'] ?? evaluation.technicalScore}%</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Communication</span>
                  <p className="text-xl font-black text-emerald-900">{evaluation.softScore}%</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Leadership</span>
                  <p className="text-xl font-black text-amber-900">{evaluation.categoryScores['Leadership'] ?? evaluation.softScore}%</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Adaptive Test
                </button>
                <button
                  onClick={() => setShowDetailedReview(!showDetailedReview)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> {showDetailedReview ? 'Hide Explanations' : 'Review Explanations'}
                </button>
                <button
                  onClick={() => { setIsQuizActive(false); setActiveMode('overview'); }}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Continue to Skill Profile
                </button>
              </div>

              {/* Detailed Review Table */}
              {showDetailedReview && (
                <div className="text-left space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-black text-slate-900">Question-by-Question Diagnostic Review:</h4>
                  <div className="space-y-3">
                    {evaluation.results.map((rev, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                          rev.isCorrect
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900">Question {idx + 1}: {rev.question.question}</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            rev.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {rev.isCorrect ? '✓ Correct' : '✕ Needs Review'}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          <strong>Your Answer:</strong> {rev.userDisplay || 'None'} • <strong>Correct Answer:</strong> {rev.correctDisplay}
                        </p>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          <strong>Explanation:</strong> {rev.question.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Assessment Summary Card when quiz is idle */
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${assessmentScores?.completed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="text-xs font-bold text-purple-900">Proctored Assessment Status:</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${assessmentScores?.completed ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                      {assessmentScores?.completed ? `Score: ${assessmentScores.overall}/100` : 'Pending Assessment'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {assessmentScores?.completed
                      ? 'Personalized evaluation completed across Software Engineering, Data & AI, and Problem Solving. Retaking with new questions updates your profile.'
                      : 'Launch the adaptive 15-minute proctored assessment to verify your competencies and calculate authentic placement ratings.'}
                  </p>
                </div>

                <button
                  onClick={handleStartAssessment}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  {assessmentScores?.completed ? 'Retake 15-Min Test' : 'Launch 15-Min Test'}
                </button>
              </div>

              {/* Assessment Category Breakdown */}
              {assessmentScores?.completed && assessmentScores.categoryScores ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {Object.entries(assessmentScores.categoryScores).map(([cat, score]) => {
                    const numScore = Number(score) || 0;
                    return (
                      <div key={cat} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-500 block truncate">{cat}</span>
                        <span className="text-base font-black text-slate-900">{numScore}%</span>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full" style={{ width: `${numScore}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-600">No test data recorded yet.</p>
                  <p className="text-[11px] text-slate-400">Complete the assessment to generate proctored category breakdowns for your profile.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION: SKILL GAPS — CALCULATED STRICTLY ON BASIS OF CAREER ROLE
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeMode === 'overview' || activeMode === 'gaps') && (
        <div className="bg-white rounded-3xl border-2 border-amber-200/80 p-6 sm:p-7 shadow-xs space-y-6">
          {/* Header & Role Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-100 pb-5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-extrabold border border-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Role-Based Skill Gap Analysis
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  Target Role: {activeCareerRole.title}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Identified Skill Gaps
                <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {gapSkills.length} Required by {activeCareerRole.title}
                </span>
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Skill gaps are evaluated strictly on the basis of your target career role by comparing the skills you have against the {roleRequiredSkills.length} skills required for <strong>{activeCareerRole.title}</strong>. Upload course certificates or add skills below to bridge each gap.
              </p>
            </div>

            {/* Role Switcher & Action Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-start lg:self-center">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
                <label htmlFor="role-select" className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                  Target Role:
                </label>
                <select
                  id="role-select"
                  value={selectedCareerRoleId}
                  onChange={(e) => setSelectedCareerRoleId(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-1"
                >
                  {CAREER_ROLE_OPTIONS.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title} ({role.domain})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('career-path')}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                title="View full milestone curriculum and roadmap for this role"
              >
                <span>Full Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsAddingCustom(!isAddingCustom)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingCustom ? 'Cancel' : 'Add Gap'}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Role Comparison Summary Ribbon */}
          <div className="p-4 bg-linear-to-r from-amber-50/60 via-slate-50 to-blue-50/40 rounded-2xl border border-amber-200/70">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Target Career Role</span>
                <p className="text-xs font-black text-slate-900 truncate mt-0.5" title={activeCareerRole.title}>
                  {activeCareerRole.title}
                </p>
                <span className="text-[10px] text-blue-600 font-semibold">{activeCareerRole.domain}</span>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Role Required Skills</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">{roleRequiredSkills.length}</p>
                <span className="text-[10px] text-slate-500">Core + Milestone Skills</span>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-emerald-200/80">
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Skills We Have</span>
                <p className="text-lg font-black text-emerald-600 mt-0.5">{roleSkillsPossessed.length}</p>
                <span className="text-[10px] text-emerald-700 font-semibold">Possessed</span>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80">
                <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Identified Skill Gaps</span>
                <p className="text-lg font-black text-amber-600 mt-0.5">{gapSkills.length}</p>
                <span className="text-[10px] text-amber-700 font-semibold">Remaining to Bridge</span>
              </div>
            </div>

            {/* Alignment Progress Bar */}
            <div className="mt-3.5 pt-3 border-t border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="w-full sm:flex-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Role Preparedness &amp; Skill Match</span>
                  <span className={roleAlignmentPercentage >= 75 ? 'text-emerald-600' : roleAlignmentPercentage >= 40 ? 'text-amber-600' : 'text-rose-600'}>
                    {roleAlignmentPercentage}% Alignment ({roleSkillsPossessed.length} / {roleRequiredSkills.length} skills)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      roleAlignmentPercentage >= 75
                        ? 'bg-emerald-500'
                        : roleAlignmentPercentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, roleAlignmentPercentage))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Custom skill gap adder form */}
          {isAddingCustom && (
            <form onSubmit={handleAddCustomSkill} className="flex gap-2 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 animate-in fade-in">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="e.g. GraphQL, Flutter, PyTorch, Kubernetes..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Add to Gaps
              </button>
            </form>
          )}

          {/* List of Skills to Upload */}
          {gapSkills.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">
                All Required Skills for {activeCareerRole.title} Are Added!
              </h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                You have satisfied 100% of the required skills for this career role. Try switching your target career role above to evaluate requirements for other tracks, or explore matching campus opportunities.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs-internships')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  View Qualifying Job Opportunities →
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gapSkills.map((skill, idx) => {
                const contextLabel = getSkillRoleContext(skill);
                return (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropUpload(e, skill)}
                    className="group relative flex flex-col justify-between p-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/30 hover:bg-amber-50/70 hover:border-amber-400 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                          <h3 className="text-sm font-black text-slate-900">{skill}</h3>
                        </div>
                        <button
                          onClick={() => removeGapSkill(skill)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Dismiss this skill gap"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100/70 text-amber-800 text-[11px] font-bold mb-2">
                        <Target className="w-3 h-3 text-amber-600" />
                        <span>{contextLabel}</span>
                      </div>

                      <p className="text-xs text-slate-600 mb-4">
                        Required for <strong>{activeCareerRole.title}</strong> technical preparation and campus recruitment drives.
                      </p>
                    </div>

                    {/* Upload Action Zone */}
                    <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(skill)}
                        className="flex-1 py-2.5 bg-white hover:bg-amber-100/70 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all hover:shadow-xs group-hover:border-amber-400 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Upload Certificate File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('online-courses')}
                        className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                        title="Find courses to learn this skill"
                      >
                        Learn
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION: UPLOADED CERTIFICATES & COURSE PROOFS
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeMode === 'overview' || activeMode === 'certificates') && (
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200 mb-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                Certificates &amp; Course Proofs
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Uploaded Certificates &amp; Course Proofs ({certificates.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Certificates and proofs uploaded for your skills and courses.
              </p>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
              Certificate Proofs
            </span>
          </div>

          {certificates.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <FileUp className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No certificates uploaded yet.</p>
              <p className="text-xs text-slate-400">
                Upload a certificate in the <strong>Skill Gap section</strong> to save your course proofs here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                          <BadgeCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 truncate">{cert.skillName}</h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Uploaded
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeSkillCertificate(cert.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove certificate (moves skill back to Gap list)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* File info */}
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-emerald-100 text-xs text-slate-700 mb-2">
                      <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate flex-1 font-semibold text-[11px]">{cert.fileName}</span>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      Uploaded: {cert.uploadedAt} • {cert.issuer || 'Course / Certificate'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-emerald-100/60">
                    {cert.fileDataUrl && (
                      <button
                        onClick={() => setPreviewCert({ name: cert.fileName, file: cert.fileDataUrl!, mime: cert.mimeType })}
                        className="flex-1 py-1.5 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> View Certificate
                      </button>
                    )}
                    <button
                      onClick={() => removeSkillCertificate(cert.id)}
                      className="py-1.5 px-2 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      title="Revert skill to gap"
                    >
                      Move to Gap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION: INDUSTRY BENCHMARK VS STUDENT PROFILE RADAR
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeMode === 'overview' || activeMode === 'radar') && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 mb-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                Industry Benchmark vs. Student Profile
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Student Profile vs. Industry Benchmark Comparison
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time calibration against hiring cutoffs for top engineering &amp; technology enterprises across India.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-auto bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-600 shadow-xs" />
                Student Profile
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-1.5 h-3.5 rounded-xs bg-slate-700" />
                Industry Benchmark
              </span>
            </div>
          </div>

          {/* Competency Bars */}
          <div className="space-y-5">
            {mockSkillBreakdown.map((item, idx) => {
              // Dynamically calibrate to live proctored assessment score for the category if available
              let assessedScore = item.score;
              if (item.category === 'Technical Skills') {
                assessedScore = assessmentScores.categoryScores?.['Programming'] ?? assessmentScores.technical ?? item.score;
              } else if (item.category === 'Data & AI') {
                assessedScore = assessmentScores.categoryScores?.['Data & AI'] ?? item.score;
              } else if (item.category === 'Communication') {
                assessedScore = assessmentScores.categoryScores?.['Communication'] ?? assessmentScores.soft ?? item.score;
              } else if (item.category === 'Problem Solving') {
                assessedScore = assessmentScores.categoryScores?.['Problem Solving'] ?? item.score;
              } else if (item.category === 'Leadership & Collab') {
                assessedScore = assessmentScores.categoryScores?.['Leadership'] ?? item.score;
              } else if (item.category === 'System Architecture') {
                const prog = assessmentScores.categoryScores?.['Programming'] ?? 82;
                const ps = assessmentScores.categoryScores?.['Problem Solving'] ?? 85;
                assessedScore = Math.round((prog + ps) / 2);
              }

              const boost = certificates.length > 0 && idx === 0 ? 4 : 0;
              const currentScore = Math.min(100, assessedScore + boost);
              const delta = currentScore - item.benchmark;
              const isExceeding = delta >= 0;

              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{item.category}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isExceeding
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isExceeding ? `+${delta}% Above Benchmark` : `${delta}% Below Benchmark`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-extrabold text-blue-700">Student: {currentScore}%</span>
                      <span className="text-slate-400 font-medium">|</span>
                      <span className="font-bold text-slate-600">Benchmark Cutoff: {item.benchmark}%</span>
                    </div>
                  </div>

                  {/* Progress bar with Industry Benchmark Marker */}
                  <div className="relative w-full bg-slate-200 h-4 rounded-full overflow-visible">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isExceeding
                          ? 'bg-gradient-to-r from-blue-600 to-emerald-500'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600'
                      }`}
                      style={{ width: `${currentScore}%` }}
                    />
                    <div
                      className="absolute -top-1 -bottom-1 w-1 bg-slate-900 rounded-full shadow-md z-10"
                      style={{ left: `${item.benchmark}%` }}
                      title={`Industry Benchmark Cutoff: ${item.benchmark}%`}
                    >
                      <div className="absolute -top-5 -left-4 text-[9px] font-black bg-slate-900 text-white px-1 py-0.2 rounded shadow-xs pointer-events-none">
                        {item.benchmark}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION: RECOMMENDED COURSES TO BRIDGE GAPS
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recommended Courses to Bridge Gaps for {activeCareerRole.title}
            </h3>
            <p className="text-xs text-slate-500">
              Curated programs targeted at resolving identified skill gaps for your chosen career track
            </p>
          </div>
          <button
            onClick={() => setActiveTab('online-courses')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            Explore All Courses &amp; Certifications <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(gapSkills.length > 0
            ? gapSkills.slice(0, 3).map((skill, idx) => ({
                name: skill,
                importance: idx === 0 ? 'High' : 'Medium',
                demandGrowth: '+38% Role Demand',
                reason: `Direct requirement for ${activeCareerRole.title} (${getSkillRoleContext(skill)}). Verified proof unlocks campus placements.`
              }))
            : mockSkillGapAnalysis.recommendedSkills
          ).map((rec, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    rec.importance === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {rec.importance} Priority
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">{rec.demandGrowth}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{rec.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rec.reason}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleTriggerUpload(rec.name)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Upload Proof
                </button>
                <button
                  onClick={() => setActiveTab('online-courses')}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Find Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: ADD NEW VERIFIED SKILL
          ────────────────────────────────────────────────────────────────────────── */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add New Skill to Profile</h3>
              </div>
              <button
                onClick={() => setIsAddSkillModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Kubernetes, Flutter, PyTorch..."
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category / Domain
                </label>
                <select
                  value={customSkillCategory}
                  onChange={(e) => setCustomSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Technical">Technical / Programming</option>
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend &amp; APIs</option>
                  <option value="Core CS">Core Computer Science</option>
                  <option value="Database">Database &amp; SQL</option>
                  <option value="Cloud &amp; DevOps">Cloud &amp; DevOps</option>
                  <option value="AI &amp; ML">AI &amp; Machine Learning</option>
                  <option value="Soft Skills">Soft Skills &amp; Communication</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Proficiency Score</span>
                  <span className="text-blue-600">{customSkillScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={customSkillScore}
                  onChange={(e) => setCustomSkillScore(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSkillModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Skill to Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
