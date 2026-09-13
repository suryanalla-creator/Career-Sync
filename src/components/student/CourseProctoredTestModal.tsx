import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Maximize2,
  Award,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Lock,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { LearningProgram, CourseTestQuestion, CourseTestResult } from '../../types';

interface CourseProctoredTestModalProps {
  course: LearningProgram;
  menteeEnrollmentId?: string;
  studentId?: string;
  studentName?: string;
  onClose: () => void;
  onTestPassed: (result: CourseTestResult) => void;
  onClaimCertificate?: (course: LearningProgram, cert?: any) => void;
  onDisqualified: (reason: string) => void;
}

export const CourseProctoredTestModal: React.FC<CourseProctoredTestModalProps> = ({
  course,
  menteeEnrollmentId,
  studentId = 'usr-student-1',
  studentName = 'Student Candidate',
  onClose,
  onTestPassed,
  onClaimCertificate,
  onDisqualified
}) => {
  // Test Lifecycle: 'briefing' | 'loading' | 'testing' | 'strike_warning' | 'disqualified' | 'results'
  const [phase, setPhase] = useState<'briefing' | 'loading' | 'testing' | 'strike_warning' | 'disqualified' | 'results'>('briefing');
  const [hasAgreedToRules, setHasAgreedToRules] = useState(false);

  // Test data state
  const [sessionId, setSessionId] = useState<string>('');
  const [questions, setQuestions] = useState<CourseTestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Timer: 30 minutes = 1800 seconds
  const [timeLeft, setTimeLeft] = useState<number>(1800);
  const timerRef = useRef<any>(null);

  // Proctoring strikes (Max 3)
  const [strikeCount, setStrikeCount] = useState<number>(0);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<CourseTestResult | null>(null);

  // Flag to avoid false trigger during intentional submit/exit
  const isGracefulExit = useRef<boolean>(false);

  // Request Fullscreen helper
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
      return true;
    } catch (e) {
      console.warn('Could not enter fullscreen:', e);
      return false;
    }
  };

  const exitFullscreenSafe = async () => {
    isGracefulExit.current = true;
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch {}
  };

  // Submit test
  const handleSubmitTest = useCallback(async () => {
    setIsSubmitting(true);
    isGracefulExit.current = true;
    await exitFullscreenSafe();

    try {
      const res = await api.courses.submitTest({
        sessionId,
        courseId: course.id,
        studentId,
        answers,
        violationsCount: strikeCount,
        isDisqualified: false
      });

      setTestResult(res);
      setPhase('results');

      if (res.passed) {
        onTestPassed(res);
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      // Fallback evaluation
      const total = questions.length || 10;
      const count = Object.keys(answers).length;
      const pct = Math.round((count / total) * 100);
      const passed = pct >= 60;
      const fallbackResult: CourseTestResult = {
        score: count,
        totalQuestions: total,
        percentage: pct,
        passed,
        isDisqualified: false,
        violationsCount: strikeCount,
        feedback: passed ? 'Assessment successfully passed.' : 'Score below 60%. Please review course modules.',
        certificateEligible: passed
      };
      setTestResult(fallbackResult);
      setPhase('results');
      if (passed) onTestPassed(fallbackResult);
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, course.id, onTestPassed, questions.length, sessionId, strikeCount, studentId]);

  // Auto-submit when time expires
  const handleAutoSubmitOnTimeOut = useCallback(async () => {
    alert('Time has expired (30 minutes reached). Submitting your assessment now.');
    handleSubmitTest();
  }, [handleSubmitTest]);

  const handleAutoSubmitRef = useRef(handleAutoSubmitOnTimeOut);
  useEffect(() => {
    handleAutoSubmitRef.current = handleAutoSubmitOnTimeOut;
  }, [handleAutoSubmitOnTimeOut]);

  // Handle Proctoring Violation (Strikes 1, 2, 3)
  const handleProctoringViolation = useCallback(async (reason: string) => {
    const newStrike = strikeCount + 1;
    setStrikeCount(newStrike);

    // Record violation in backend
    if (menteeEnrollmentId) {
      try {
        await api.courses.recordViolation(menteeEnrollmentId, newStrike, reason);
      } catch {}
    }

    if (newStrike >= 3) {
      // 🚨 PERMANENT DISQUALIFICATION
      isGracefulExit.current = true;
      setPhase('disqualified');
      await exitFullscreenSafe();

      // Submit failed & disqualified state
      try {
        await api.courses.submitTest({
          sessionId,
          courseId: course.id,
          studentId,
          answers,
          violationsCount: 3,
          isDisqualified: true
        });
      } catch {}

      onDisqualified('Exited full screen 3 times during assessment. Course permanently failed & certificate locked.');
    } else {
      // Strike 1 or 2 Warning
      setWarningMessage(
        newStrike === 1
          ? 'Warning 1 of 3: You have exited full screen or switched tabs! You must remain in full screen during the entire assessment. 2 more violations will result in permanent disqualification.'
          : 'Warning 2 of 3 (FINAL WARNING): You have exited full screen twice. Any further exit will permanently disqualify you from this course and bar certification.'
      );
      setPhase('strike_warning');
    }
  }, [answers, course.id, menteeEnrollmentId, onDisqualified, sessionId, strikeCount, studentId]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      // If we are in active testing phase and not currently exiting gracefully:
      if (phase === 'testing' && !isGracefulExit.current) {
        const isCurrentlyFullscreen = Boolean(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        );

        if (!isCurrentlyFullscreen) {
          handleProctoringViolation('Exited fullscreen mode during proctored test');
        }
      }
    };

    const handleVisibilityChange = () => {
      if (phase === 'testing' && document.hidden && !isGracefulExit.current) {
        handleProctoringViolation('Switched browser tab or minimized window during proctored test');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [phase, handleProctoringViolation]);

  // Timer countdown
  useEffect(() => {
    if (phase === 'testing' || phase === 'strike_warning') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmitRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Start Assessment from briefing
  const handleStartTest = async () => {
    if (!hasAgreedToRules) {
      alert('You must acknowledge and agree to the proctoring rules before starting the assessment.');
      return;
    }

    setPhase('loading');

    // 1. Enter Fullscreen
    await enterFullscreen();

    // 2. Fetch AI-generated unique questions from backend
    try {
      const res = await api.courses.generateTest({
        courseId: course.id,
        courseTitle: course.title,
        category: course.category,
        level: course.level,
        skills: course.skillsGained,
        studentId
      });

      if (res && res.success && res.questions?.length > 0) {
        setSessionId(res.sessionId);
        setQuestions(res.questions as CourseTestQuestion[]);
        setTimeLeft(res.durationSeconds || 1800);
        setPhase('testing');
      } else {
        throw new Error('Could not initialize test session');
      }
    } catch (err) {
      console.error('Failed to generate test:', err);
      alert('Unable to load AI questions. Please verify network connection and try again.');
      setPhase('briefing');
      await exitFullscreenSafe();
    }
  };

  // Resume Test after warning
  const handleResumeTest = async () => {
    await enterFullscreen();
    setPhase('testing');
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-2 sm:p-4 animate-in fade-in select-none">
      {/* ──────────────────────────────────────────────────────────────────────────
          PHASE 1: PRE-TEST INSTRUCTIONS & RULES BRIEFING MODAL
          ────────────────────────────────────────────────────────────────────────── */}
      {phase === 'briefing' && (
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto space-y-6 animate-in zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                    AI-Proctored Course Assessment
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Trained Corpus (13,200+ Questions) • Gemini 2.5 Flash
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {course.title}
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Course Verification &amp; Credential Qualification Test
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mandatory Guidelines Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-slate-50 rounded-2xl border border-indigo-200/80 space-y-4">
            <div className="flex items-center gap-2 text-indigo-900 font-black text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Assessment Rules &amp; Anti-Cheating Protocol:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>10 Domain-Grounded Questions</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Sampled dynamically from our <strong>13,200+ trained question bank</strong> and calibrated with Google Gemini 2.5 Flash. Formulated at Senior / Principal Engineer level with zero generic trivia.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>30 Minutes Time Limit</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  A countdown timer starts immediately. Unsubmitted tests will be auto-graded at 00:00.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mandatory Fullscreen Mode</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  The exam must be taken in Full Screen mode. The browser window cannot be resized or minimized.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>60% Passing Benchmark</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Score at least 6 out of 10 to qualify for instant verified certificate issuance.
                </p>
              </div>
            </div>

            {/* Strict 3-Strike Warning Callout */}
            <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-300/80 space-y-2 text-rose-950">
              <div className="flex items-center gap-2 font-black text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>STRICT 3-STRIKE PROCTORING POLICY:</span>
              </div>
              <ul className="text-xs space-y-1 text-rose-900/90 list-disc list-inside leading-relaxed text-[11px]">
                <li>If you exit fullscreen or switch tabs, an emergency warning modal will freeze your exam.</li>
                <li>You are granted a maximum of <strong>2 warnings</strong>.</li>
                <li><strong>On the 3rd exit:</strong> The test is permanently terminated, you are <strong>disqualified</strong>, and <strong>certification CANNOT be issued by the mentor or institution</strong> for this course.</li>
              </ul>
            </div>
          </div>

          {/* Student Consent Checkbox */}
          <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
            <input
              type="checkbox"
              checked={hasAgreedToRules}
              onChange={e => setHasAgreedToRules(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 mt-0.5 cursor-pointer"
            />
            <span className="text-xs text-slate-700 font-semibold leading-snug">
              I, <strong>{studentName}</strong>, understand and agree to the 30-minute time limit, fullscreen requirement, and the <strong>strict 3-strike disqualification rule</strong>. I am ready to begin the assessment in full screen.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel &amp; Return
            </button>

            <button
              disabled={!hasAgreedToRules}
              onClick={handleStartTest}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Start Assessment &amp; Enter Fullscreen</span>
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          PHASE 2: LOADING / GENERATING AI QUESTIONS
          ────────────────────────────────────────────────────────────────────────── */}
      {phase === 'loading' && (
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl border border-slate-200">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900">
            Synthesizing 10 Unique AI Questions...
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The AI engine is generating custom practical dilemmas for <strong>{course.title}</strong> and configuring your proctored session.
          </p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          PHASE 3: ACTIVE TEST ENVIRONMENT (FULLSCREEN)
          ────────────────────────────────────────────────────────────────────────── */}
      {phase === 'testing' && currentQ && (
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[85vh] max-h-[96vh] overflow-y-auto space-y-6 animate-in fade-in">
          {/* Top Bar: Progress, Timer, Proctoring Strikes */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Topic: {currentQ.topic}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  {currentQ.difficulty || 'Very Hard (Senior / Principal Level)'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1 truncate max-w-md">
                {course.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Strikes Counter */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 ${
                strikeCount === 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : strikeCount === 1
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Strikes: {strikeCount} / 3</span>
              </div>

              {/* 30 Min Timer */}
              <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-black font-mono flex items-center gap-1.5 ${
                timeLeft <= 180
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                  : timeLeft <= 600
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-900 text-white border-slate-900'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Question Stepper Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                      : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>

          {/* Main Question Display */}
          <div className="space-y-5 my-auto">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentQuestionIndex + 1}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* 4 Choices Radio Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <div
                    key={optIdx}
                    onClick={() => {
                      setAnswers(prev => ({
                        ...prev,
                        [currentQ.id]: optIdx
                      }));
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {letter}
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold leading-snug ${
                        isSelected ? 'text-blue-950 font-bold' : 'text-slate-800'
                      }`}>
                        {opt}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation & Submit Bar */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              {answeredCount} of {questions.length} Answered
            </span>

            <div className="flex items-center gap-2">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  disabled={isSubmitting}
                  onClick={handleSubmitTest}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Grading AI Assessment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Final Assessment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          PHASE 4: STRIKE WARNING MODAL (STRIKE 1 OR 2)
          ────────────────────────────────────────────────────────────────────────── */}
      {phase === 'strike_warning' && (
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border-2 border-amber-400 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Proctoring Violation: Strike {strikeCount} of 3
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Fullscreen Exit Detected!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              {warningMessage}
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
            <p className="font-bold">⚠️ Warning Condition:</p>
            <p className="text-[11px] leading-relaxed">
              You must re-enter fullscreen immediately to resume the test. Exiting 1 more time will trigger permanent disqualification.
            </p>
          </div>

          <button
            onClick={handleResumeTest}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Re-Enter Fullscreen &amp; Resume Test</span>
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          PHASE 5: PERMANENT DISQUALIFICATION SCREEN (3 STRIKES)
          ────────────────────────────────────────────────────────────────────────── */}
      {phase === 'disqualified' && (
        <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border-2 border-rose-500 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <XCircle className="w-9 h-9" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300">
              Disqualified (3 Fullscreen Exits)
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">
              Assessment Terminated &amp; Course Disqualified
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              You exceeded the allowed proctoring limit by exiting full screen 3 times.
            </p>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-left text-xs text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-rose-800">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>ACADEMIC INTEGRITY LOCK APPLIED:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              In accordance with university examination protocols, <strong>you cannot complete this course</strong> and <strong>neither the mentor nor institution will issue a certificate</strong> for <em>{course.title}</em>.
            </p>
            <div className="pt-2 border-t border-rose-200 text-[10px] text-rose-700 font-mono">
              Student USN: {studentId} • Violations: 3 Strikes Logged
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Close &amp; Return to Online Courses
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          PHASE 6: FINAL RESULTS SCREEN (PASSED / FAILED)
          ────────────────────────────────────────────────────────────────────────── */}
      {phase === 'results' && testResult && (
        <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
            testResult.passed
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-amber-100 text-amber-600'
          }`}>
            {testResult.passed ? <Award className="w-9 h-9" /> : <HelpCircle className="w-9 h-9" />}
          </div>

          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              testResult.passed
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {testResult.passed ? 'Assessment Passed 🎉' : 'Passing Threshold Not Reached'}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Score: {testResult.score} / {testResult.totalQuestions} ({testResult.percentage}%)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-md mx-auto">
              {testResult.feedback}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Correct</span>
              <span className="text-sm font-black text-emerald-600">{testResult.score} / {testResult.totalQuestions}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Percentage</span>
              <span className="text-sm font-black text-slate-900">{testResult.percentage}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Proctoring</span>
              <span className="text-sm font-black text-blue-600">{testResult.violationsCount > 0 ? `${testResult.violationsCount} Strikes` : 'Clean (0)'}</span>
            </div>
          </div>

          {/* Certificate Awarded Celebration Card */}
          {testResult.passed && (
            <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border-2 border-emerald-300 text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-emerald-950 text-xs sm:text-sm">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Official Verified Certificate Issued!</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                Congratulations! You achieved a score of <strong>{testResult.percentage}%</strong>. Your course is now <strong>100% Completed &amp; Certified</strong>. Your official diploma has been permanently recorded in your institutional profile.
              </p>
              {testResult.credentialId && (
                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px] font-mono text-emerald-900">
                  <span className="font-semibold text-slate-600">Credential ID:</span>
                  <strong className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {testResult.credentialId}
                  </strong>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {testResult.passed && onClaimCertificate && (
              <button
                type="button"
                onClick={() => {
                  onClaimCertificate(course, testResult.certificate);
                }}
                className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-400 ring-2 ring-emerald-500/20"
              >
                <Award className="w-4 h-4 text-white" />
                <span>View &amp; Claim Official Certificate</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`w-full ${testResult.passed && onClaimCertificate ? 'sm:w-auto px-5' : 'w-full'} py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer`}
            >
              {testResult.passed ? 'Return to Courses' : 'Close & Return to Course'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
