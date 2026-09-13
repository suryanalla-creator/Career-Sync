import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  BookOpen,
  Award,
  Clock,
  Star,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  ExternalLink,
  Filter,
  Check,
  Zap,
  BadgeCheck,
  FileText,
  AlertCircle,
  AlertTriangle,
  Maximize2,
  X,
  Layers,
  GraduationCap,
  Briefcase,
  Target,
  Compass,
  Printer,
  Download,
  Play,
  CheckSquare,
  MapPin,
  Volume2,
  VolumeX,
  Headphones,
  RotateCcw,
  Save,
  BookmarkCheck,
  Bookmark,
  Calendar,
  Film
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CertificationItem, LearningProgram, CourseTestResult, CourseVideoItem } from '../../types';
import { api } from '../../services/api';
import { CourseProctoredTestModal } from './CourseProctoredTestModal';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';
import {
  BTECH_BRANCHES,
  checkLearningProgramRoleAndBranchMatch,
  ProgramRoleBranchMatchDetails
} from '../../utils/opportunityRoleBranchMatcher';

export interface OnlineCoursesViewProps {
  initialSubBlock?: 'all' | 'courses' | 'certifications' | 'enrolled';
}

export const OnlineCoursesView: React.FC<OnlineCoursesViewProps> = ({ initialSubBlock = 'all' }) => {
  const {
    learningPrograms,
    enrollInProgram,
    triggerConfetti,
    studentProfile,
    selectedCareerRoleId,
    setSelectedCareerRoleId,
    activeCareerRole,
    gapSkills
  } = useApp();

  // Sub-block switcher state: courses vs certifications
  const [activeSubBlock, setActiveSubBlock] = useState<'all' | 'courses' | 'certifications' | 'enrolled'>(initialSubBlock);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Studied B-Tech Branch state (defaults to student profile department, e.g. "Computer Science & Engineering")
  const studentBranch = studentProfile?.department || 'Computer Science & Engineering';
  const [selectedBranch, setSelectedBranch] = useState<string>(studentBranch);

  // Recommendation filter mode: 'recommended' (role & branch) | 'institutional' | 'gaps' | 'all'
  const [recommendationMode, setRecommendationMode] = useState<'recommended' | 'institutional' | 'gaps' | 'all'>('recommended');

  // Live database programs & mentee tracking state
  const [apiPrograms, setApiPrograms] = useState<LearningProgram[]>([]);
  const [menteeEnrollments, setMenteeEnrollments] = useState<Record<string, any>>({});
  const [activeCoursePlayer, setActiveCoursePlayer] = useState<any | null>(null);
  const [viewCertificateForProgram, setViewCertificateForProgram] = useState<{ program: LearningProgram; cert?: any; menteeRecord?: any } | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedModulesState, setCompletedModulesState] = useState<Record<string, boolean>>({});

  // AI Proctored Fullscreen Test State
  const [isProctoredTestOpen, setIsProctoredTestOpen] = useState(false);
  const [activeCourseForTest, setActiveCourseForTest] = useState<LearningProgram | null>(null);

  // Audio controller state & iframe reference
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [videoReloadKey, setVideoReloadKey] = useState<number>(0);
  const [playerInitialStartSeconds, setPlayerInitialStartSeconds] = useState<number>(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);

  // Persistent video playback and progress tracking state
  const [courseProgressMap, setCourseProgressMap] = useState<Record<string, {
    stoppedAtSeconds: number;
    progressPercentage: number;
    completedModules?: Record<string, boolean>;
    lastUpdated?: string;
  }>>(() => {
    try {
      const progressMap: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('career_sync_course_progress_')) {
          const courseId = key.replace('career_sync_course_progress_', '');
          const val = localStorage.getItem(key);
          if (val) {
            progressMap[courseId] = JSON.parse(val);
          }
        }
      }
      return progressMap;
    } catch {
      return {};
    }
  });
  const [currentPlayTime, setCurrentPlayTime] = useState<number>(0);
  const [isTrackingActive, setIsTrackingActive] = useState<boolean>(true);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);
  const [lastActiveCourseId, setLastActiveCourseId] = useState<string>(() => {
    try {
      return localStorage.getItem('career_sync_last_active_course_id') || '';
    } catch {
      return '';
    }
  });

  const activeCoursePlayerRef = useRef<any | null>(null);
  const completedModulesStateRef = useRef<Record<string, boolean>>({});
  const currentPlayTimeRef = useRef<number>(0);
  const isTrackingActiveRef = useRef<boolean>(true);

  useEffect(() => {
    activeCoursePlayerRef.current = activeCoursePlayer;
    completedModulesStateRef.current = completedModulesState;
    currentPlayTimeRef.current = currentPlayTime;
    isTrackingActiveRef.current = isTrackingActive;
  }, [activeCoursePlayer, completedModulesState, currentPlayTime, isTrackingActive]);

  const lastSaveTimestampRef = useRef<number>(0);

  // Helper to format seconds into mm:ss or hh:mm:ss
  const formatSeconds = (totalSec: number): string => {
    if (!totalSec || totalSec <= 0) return '00:00';
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = Math.floor(totalSec % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Synchronous helper to fetch the exact saved resume point for any course
  const getResumeSeconds = useCallback((courseId: string, fallbackSeconds = 0): number => {
    if (!courseId) return fallbackSeconds;
    if (courseProgressMap[courseId]?.stoppedAtSeconds) {
      return courseProgressMap[courseId].stoppedAtSeconds;
    }
    try {
      const raw = localStorage.getItem(`career_sync_course_progress_${courseId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.stoppedAtSeconds === 'number' && parsed.stoppedAtSeconds > 0) {
          return parsed.stoppedAtSeconds;
        }
      }
    } catch {}
    if (menteeEnrollments[courseId]?.stoppedAtSeconds) {
      return menteeEnrollments[courseId].stoppedAtSeconds;
    }
    return fallbackSeconds;
  }, [courseProgressMap, menteeEnrollments]);

  // Load all course progress from localStorage on mount
  useEffect(() => {
    try {
      const progressMap: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('career_sync_course_progress_')) {
          const courseId = key.replace('career_sync_course_progress_', '');
          const val = localStorage.getItem(key);
          if (val) {
            progressMap[courseId] = JSON.parse(val);
          }
        }
      }
      setCourseProgressMap(progressMap);
    } catch {}
  }, []);

  // Sync mentee enrollments into courseProgressMap
  useEffect(() => {
    if (menteeEnrollments && Object.keys(menteeEnrollments).length > 0) {
      setCourseProgressMap(prev => {
        const updated = { ...prev };
        Object.values(menteeEnrollments).forEach((m: any) => {
          if (m?.courseId) {
            const existing = updated[m.courseId];
            const stoppedSec = Math.max(existing?.stoppedAtSeconds || 0, m.stoppedAtSeconds || 0);
            const progPct = Math.max(existing?.progressPercentage || 0, m.progressPercentage || 0);
            updated[m.courseId] = {
              stoppedAtSeconds: stoppedSec,
              progressPercentage: progPct,
              completedModules: existing?.completedModules || m.completedModules,
              lastUpdated: existing?.lastUpdated || m.lastActiveAt || new Date().toISOString()
            };
          }
        });
        return updated;
      });
    }
  }, [menteeEnrollments]);

  // Save progress helper: saves to localStorage, state, and backend API
  const saveCourseProgress = (
    courseId: string,
    seconds: number,
    modules?: Record<string, boolean>,
    explicitPercentage?: number
  ) => {
    if (!courseId) return;
    const safeSeconds = Math.max(0, Math.round(seconds));
    const safePercentage = explicitPercentage !== undefined
      ? Math.max(0, Math.min(100, Math.round(explicitPercentage)))
      : Math.min(95, Math.max(15, Math.round((safeSeconds / 2400) * 100)));

    const record = {
      stoppedAtSeconds: safeSeconds,
      progressPercentage: safePercentage,
      completedModules: modules || completedModulesStateRef.current,
      lastUpdated: new Date().toISOString()
    };

    // 1. Update local courseProgressMap state
    setCourseProgressMap(prev => ({
      ...prev,
      [courseId]: record
    }));

    // 2. Mark menteeEnrollment as approved & enrolled so it's always accessible
    setMenteeEnrollments(prev => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        courseId,
        stoppedAtSeconds: safeSeconds,
        progressPercentage: safePercentage,
        completedModules: modules || completedModulesStateRef.current,
        permissionStatus: 'approved'
      }
    }));

    setLastActiveCourseId(courseId);

    // 3. Persist to localStorage
    try {
      localStorage.setItem(`career_sync_course_progress_${courseId}`, JSON.stringify(record));
      localStorage.setItem('career_sync_last_active_course_id', courseId);
    } catch {}

    // 4. Persist to backend API asynchronously
    api.courses.saveProgress(courseId, {
      stoppedAtSeconds: safeSeconds,
      progressPercentage: safePercentage,
      completedModules: modules || completedModulesStateRef.current
    }).catch(() => {});
  };

  // When activeCoursePlayer is opened:
  useEffect(() => {
    if (activeCoursePlayer) {
      setActiveVideoIndex(0);
      const initialSec = getResumeSeconds(activeCoursePlayer.id, activeCoursePlayer.stoppedAtSeconds || 0);
      setPlayerInitialStartSeconds(initialSec);
      setCurrentPlayTime(initialSec);
      currentPlayTimeRef.current = initialSec;
      setIsTrackingActive(true);
      isTrackingActiveRef.current = true;

      const saved = courseProgressMap[activeCoursePlayer.id] || menteeEnrollments[activeCoursePlayer.id];
      if (saved?.completedModules && Object.keys(saved.completedModules).length > 0) {
        setCompletedModulesState(saved.completedModules);
      } else {
        setCompletedModulesState({
          'mod-1': true,
          'mod-2': initialSec > 600,
          'mod-3': initialSec > 1500,
          'mod-4': initialSec > 2500
        });
      }
    }
  }, [activeCoursePlayer, getResumeSeconds, courseProgressMap, menteeEnrollments]);

  // Real-time playback timer: advances playback time second-by-second while student watches lecture,
  // and silently persists to localStorage & API every 5 seconds without triggering heavy React component re-renders.
  useEffect(() => {
    if (!activeCoursePlayer) return;

    const timer = setInterval(() => {
      if (isTrackingActiveRef.current) {
        setCurrentPlayTime(prev => {
          const next = prev + 1;
          currentPlayTimeRef.current = next;
          return next;
        });

        // Silently persist to localStorage & backend every 5 seconds
        const now = Date.now();
        if (now - lastSaveTimestampRef.current >= 5000 && activeCoursePlayerRef.current) {
          lastSaveTimestampRef.current = now;
          const courseId = activeCoursePlayerRef.current.id;
          const safeSeconds = currentPlayTimeRef.current;
          const safePercentage = Math.min(95, Math.max(15, Math.round((safeSeconds / 2400) * 100)));
          const record = {
            stoppedAtSeconds: safeSeconds,
            progressPercentage: safePercentage,
            completedModules: completedModulesStateRef.current,
            lastUpdated: new Date().toISOString()
          };
          try {
            localStorage.setItem(`career_sync_course_progress_${courseId}`, JSON.stringify(record));
            localStorage.setItem('career_sync_last_active_course_id', courseId);
          } catch {}
          api.courses.saveProgress(courseId, {
            stoppedAtSeconds: safeSeconds,
            progressPercentage: safePercentage,
            completedModules: completedModulesStateRef.current
          }).catch(() => {});
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCoursePlayer]);

  // YouTube postMessage listener to track playback position in real-time if delivered by player
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const rawData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!rawData) return;

        if (rawData.event === 'infoDelivery' && rawData.info) {
          if (typeof rawData.info.currentTime === 'number' && rawData.info.currentTime >= 0) {
            const sec = Math.floor(rawData.info.currentTime);
            setCurrentPlayTime(sec);
            currentPlayTimeRef.current = sec;
          }
          if (rawData.info.playerState === 1) {
            setIsTrackingActive(true);
            isTrackingActiveRef.current = true;
          } else if (rawData.info.playerState === 2) {
            // Video paused on YouTube player
            setIsTrackingActive(false);
            isTrackingActiveRef.current = false;
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Jump to specific playback timestamp (scrubbing / manual skip)
  const handleSeekToTime = (targetSeconds: number) => {
    const safeSec = Math.max(0, Math.round(targetSeconds));
    setCurrentPlayTime(safeSec);
    currentPlayTimeRef.current = safeSec;

    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [safeSec, true] }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      } catch {}
    }

    if (activeCoursePlayerRef.current) {
      saveCourseProgress(
        activeCoursePlayerRef.current.id,
        safeSec,
        completedModulesStateRef.current
      );
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 2000);
    }
  };

  // Save spot and close player modal safely
  const handleClosePlayer = () => {
    if (activeCoursePlayerRef.current) {
      const secToSave = Math.max(currentPlayTimeRef.current, currentPlayTime);
      saveCourseProgress(
        activeCoursePlayerRef.current.id,
        secToSave,
        completedModulesStateRef.current
      );
    }
    setActiveCoursePlayer(null);
  };

  const handleRestartFromBeginning = () => {
    handleSeekToTime(0);
    if (activeCoursePlayer) {
      saveCourseProgress(activeCoursePlayer.id, 0, completedModulesState, 0);
    }
  };

  const handleSaveSpotNow = () => {
    if (activeCoursePlayer) {
      const secToSave = Math.max(currentPlayTime, currentPlayTimeRef.current);
      saveCourseProgress(activeCoursePlayer.id, secToSave, completedModulesState);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 2500);
    }
  };

  const handleUnmuteAndMaxVolume = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
        setIsAudioActive(true);
      } catch (err) {
        console.warn('Unable to send postMessage to YouTube iframe:', err);
      }
    }
  };

  // Robust YouTube video ID extractor supporting all YouTube URL formats and plain IDs
  const extractYouTubeVideoId = (url?: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([^"&?/\s]{11})/);
    return match && match[1] ? match[1] : null;
  };

  const getCourseFallbackVideoId = (courseTitle?: string, skills?: string[]): string => {
    const text = `${courseTitle || ''} ${(skills || []).join(' ')}`.toLowerCase();
    if (text.includes('robotics') || text.includes('ros2') || text.includes('ros') || text.includes('kinematics') || text.includes('industrial control')) {
      return 'HJAE5Pk8Nyw'; // Learn ROS 2: Beginner to Advanced Course (verified active)
    }
    if (text.includes('embedded') || text.includes('iot') || text.includes('stm32') || text.includes('sensor') || text.includes('rtos') || text.includes('microcontroller')) {
      return 'hnj-7XwTYRI'; // Quantum Leaps Embedded Systems
    }
    if (text.includes('machine learning') || text.includes('mlops') || text.includes('scikit') || text.includes('pytorch') || text.includes('data science') || text.includes('model')) {
      return 'GIsg-ZUy0MY'; // freeCodeCamp PyTorch & ML
    }
    if (text.includes('competitive') || text.includes('algorithm') || text.includes('dynamic programming') || text.includes('graph theory') || text.includes('data structures') || text.includes('dsa')) {
      return 'RBSGKlAvoiM'; // freeCodeCamp Data Structures & Algorithms
    }
    if (text.includes('aws') || text.includes('cloud') || text.includes('vpc') || text.includes('solution architect') || text.includes('lambda')) {
      return 'SOTamWNgDKc'; // freeCodeCamp AWS Certified Solutions Architect
    }
    if (text.includes('deep learning') || text.includes('llm') || text.includes('transformer') || text.includes('generative ai') || text.includes('rag')) {
      return 'kCc8FmEb1nY'; // Andrej Karpathy LLMs
    }
    if (text.includes('docker') || text.includes('kubernetes') || text.includes('devops') || text.includes('ci/cd')) {
      return 'fqMOX6JJhGo'; // freeCodeCamp Docker & K8s
    }
    if (text.includes('flutter') || text.includes('mobile') || text.includes('dart') || text.includes('android')) {
      return 'VPvVD8t02U8'; // freeCodeCamp Flutter
    }
    if (text.includes('security') || text.includes('cyber') || text.includes('soc') || text.includes('siem') || text.includes('penetration')) {
      return '3Kq1MIfTWCE'; // freeCodeCamp Cybersecurity
    }
    if (text.includes('vlsi') || text.includes('verilog') || text.includes('semiconductor') || text.includes('uvm')) {
      return 'L1ung0wil9Y'; // MIT OpenCourseWare Digital Circuits
    }
    if (text.includes('snowflake') || text.includes('warehouse') || text.includes('analytics') || text.includes('sql') || text.includes('data engineering')) {
      return '4m9j6hlbf4g'; // freeCodeCamp Data Engineering & SQL
    }
    if (text.includes('electric vehicle') || text.includes('ev ') || text.includes('powertrain') || text.includes('bms')) {
      return '3SAxXUIre28'; // Tesla EV Powertrain & Motors
    }
    if (text.includes('bim') || text.includes('revit') || text.includes('civil') || text.includes('structural')) {
      return '4m9j6hlbf4g'; // Civil & Structural Infrastructure Track
    }
    if (text.includes('agile') || text.includes('scrum') || text.includes('product')) {
      return '502ILHjX9EE'; // Agile Product Ownership
    }
    if (text.includes('communication') || text.includes('presentation') || text.includes('leadership')) {
      return 'HAnw168huqA'; // Stanford GSB Think Fast Talk Smart
    }
    return 'nu_pCVPKzTk'; // freeCodeCamp Full-Stack Web Development
  };

  // Video embed helper supporting YouTube, Vimeo, MP4 with intelligent topic matching & clean privacy-enhanced embed
  const getEmbedVideoUrl = (rawUrl?: string, courseTitle?: string, skills?: string[], startSeconds?: number): string => {
    // If Vimeo URL provided
    if (rawUrl && rawUrl.includes('vimeo.com/')) {
      const vimeoMatch = rawUrl.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    }

    const videoId = extractYouTubeVideoId(rawUrl) || getCourseFallbackVideoId(courseTitle, skills);
    const safeStart = startSeconds && startSeconds > 0 ? Math.floor(startSeconds) : 0;
    const startParam = safeStart > 0 ? `&start=${safeStart}` : '';
    // Use youtube-nocookie.com domain, avoid origin and aggressive autoplay flags that trigger browser & YouTube error 150 blocks
    return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&playsinline=1&modestbranding=1&controls=1${startParam}`;
  };

  const getDirectWatchUrl = (rawUrl?: string, courseTitle?: string, skills?: string[]): string => {
    if (rawUrl && rawUrl.includes('vimeo.com/')) {
      return rawUrl;
    }
    const videoId = extractYouTubeVideoId(rawUrl) || getCourseFallbackVideoId(courseTitle, skills);
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const getDefaultVideoTitle = (courseTitle?: string): string => {
    if (!courseTitle) return 'Mentor Masterclass & Comprehensive Technical Syllabus';
    const text = courseTitle.toLowerCase();
    if (text.includes('embedded') || text.includes('iot')) {
      return 'Lab 1: Embedded Microcontroller Architecture & Sensor Interfacing';
    }
    if (text.includes('machine learning') || text.includes('mlops')) {
      return 'Masterclass: End-to-End MLOps, PyTorch Models & Production Deployment';
    }
    if (text.includes('competitive') || text.includes('algorithm') || text.includes('data structures')) {
      return 'Session 1: Advanced Dynamic Programming & Graph Theory Algorithms';
    }
    if (text.includes('aws') || text.includes('cloud')) {
      return 'Module 1: Enterprise AWS Cloud Architecture, VPC & Core Infrastructure';
    }
    if (text.includes('deep learning') || text.includes('llm')) {
      return 'Lecture 1: Deep Learning & Transformers Architecture from Scratch';
    }
    if (text.includes('docker') || text.includes('kubernetes')) {
      return 'Lab 1: Docker Containerization, Kubernetes Pods & Microservice Orchestration';
    }
    if (text.includes('flutter') || text.includes('mobile')) {
      return 'Lecture 1: Cross-Platform Mobile Architecture with Flutter & Dart';
    }
    if (text.includes('security') || text.includes('cyber')) {
      return 'Masterclass: Offensive Cybersecurity, SIEM Threat Hunting & SOC Defense';
    }
    if (text.includes('vlsi') || text.includes('verilog')) {
      return 'Lecture 1: Digital VLSI Circuit Design, SystemVerilog & UVM Verification';
    }
    if (text.includes('snowflake') || text.includes('warehouse')) {
      return 'Module 1: Snowflake Cloud Data Warehousing & Modern Data Pipelines';
    }
    if (text.includes('electric vehicle') || text.includes('ev ') || text.includes('powertrain')) {
      return 'Module 1: Electric Vehicle Powertrain, BMS Architecture & Motor Drives';
    }
    if (text.includes('bim') || text.includes('revit')) {
      return 'Module 1: Building Information Modeling (BIM) & 3D Structural Revit';
    }
    if (text.includes('full-stack') || text.includes('react') || text.includes('next.js')) {
      return 'Lecture 1: Modern Full-Stack Web Architecture, React 18 & RESTful APIs';
    }
    return `Lecture 1: ${courseTitle} Masterclass & Architecture`;
  };

  // Test passed handler
  const handleTestPassed = async (result: CourseTestResult) => {
    triggerConfetti();

    // 1. Instantly mark 100% completed & certified in local storage and state
    const targetCourseId = activeCourseForTest?.id || activeCoursePlayer?.id;
    if (targetCourseId) {
      const updatedProgress = {
        stoppedAtSeconds: 0,
        progressPercentage: 100,
        completedModules: { ...completedModulesState },
        lastUpdated: new Date().toISOString()
      };
      setCourseProgressMap(prev => ({
        ...prev,
        [targetCourseId]: updatedProgress
      }));
      try {
        localStorage.setItem(`career_sync_course_progress_${targetCourseId}`, JSON.stringify(updatedProgress));
      } catch {}
    }

    // 2. Refresh live database records & certificates
    await loadCourseData();

    // 3. Update active course player if currently open
    if (activeCoursePlayer) {
      setActiveCoursePlayer((prev: any) => ({
        ...prev,
        isCertified: true,
        isCertifiedEffective: true,
        progressPercentage: 100,
        menteeRecord: {
          ...(prev.menteeRecord || {}),
          testStatus: 'passed',
          testScore: result.percentage,
          assessmentScore: result.percentage,
          progressPercentage: 100,
          isCertified: true,
          issuedCertificateId: result.credentialId || result.certificate?.credentialId,
          isDisqualified: false
        }
      }));
    }
  };

  // Direct 1-click certificate view from test results
  const handleClaimCertificateFromTest = (prog: LearningProgram, certData?: any) => {
    setIsProctoredTestOpen(false);
    triggerConfetti();

    const matchingCert = certData || certs.find(c =>
      c.name === (prog.certificateTemplateTitle || prog.title) ||
      c.name?.toLowerCase().includes(prog.title.toLowerCase())
    );

    setViewCertificateForProgram({
      program: prog,
      cert: matchingCert || {
        id: `cert-${prog.id}`,
        name: prog.certificateTemplateTitle || `Certificate of Completion in ${prog.title}`,
        provider: prog.provider,
        logo: prog.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        credentialId: `${prog.certificateCredentialPrefix || 'APEX-CERT-'}${prog.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
        verificationStatus: 'Verified',
        skills: prog.skillsGained
      },
      menteeRecord: {
        progressPercentage: 100,
        isCertified: true,
        issuedCertificateId: matchingCert?.credentialId
      }
    });
  };

  // Test disqualified handler
  const handleTestDisqualified = async (reason: string) => {
    await loadCourseData();
    if (activeCoursePlayer) {
      setActiveCoursePlayer((prev: any) => ({
        ...prev,
        menteeRecord: {
          ...(prev.menteeRecord || {}),
          isDisqualified: true,
          testStatus: 'disqualified',
          testViolationsCount: 3,
          disqualificationReason: reason
        }
      }));
    }
    setIsProctoredTestOpen(false);
  };

  // Certifications state
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [verifyInputId, setVerifyInputId] = useState('');
  const [viewProofCert, setViewProofCert] = useState<CertificationItem | null>(null);
  const [selectedProgramDetails, setSelectedProgramDetails] = useState<LearningProgram | null>(null);

  useEffect(() => {
    if (initialSubBlock) {
      setActiveSubBlock(initialSubBlock);
    }
  }, [initialSubBlock]);

  // Load all live programs, student mentee enrollments, and certifications
  const loadCourseData = useCallback(async () => {
    try {
      // 1. Fetch all learning programs (guarantees newly published institution courses appear)
      const progs = await api.common.getPrograms();
      if (progs && progs.length > 0) {
        setApiPrograms(progs);
      }

      // 2. Fetch student mentee enrollments
      const studentId = studentProfile?.studentId || 'usr-student-1';
      const menteesList = await api.courses.getMenteeEnrollments({ studentId });
      if (menteesList && menteesList.length > 0) {
        const map: Record<string, any> = {};
        menteesList.forEach((m: any) => {
          map[m.courseId] = m;
        });
        setMenteeEnrollments(map);
      }

      // 3. Fetch certifications
      const dbCerts = await api.certifications.getAll();
      if (dbCerts) {
        setCerts(dbCerts);
      }
    } catch (err) {
      console.warn('Could not load course data from API:', err);
    }
  }, [studentProfile, setCerts]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const handleVerify = async (certId: string) => {
    setCerts(prev =>
      prev.map(c => (c.id === certId ? { ...c, verificationStatus: 'Verified' } : c))
    );
    setIsVerifyModalOpen(false);
    setSelectedCert(null);
    triggerConfetti();

    try {
      await api.certifications.verify(certId);
    } catch (err) {
      console.error('Failed to update certification in database:', err);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInputId.trim()) return;

    const matchingCert = certs.find(
      c => c.credentialId?.toLowerCase() === verifyInputId.trim().toLowerCase()
    );

    if (matchingCert) {
      setCerts(prev =>
        prev.map(c =>
          c.id === matchingCert.id ? { ...c, verificationStatus: 'Verified' } : c
        )
      );
      setIsVerifyModalOpen(false);
      setVerifyInputId('');
      triggerConfetti();
    } else {
      alert('Certificate ID not found in institutional cryptographic ledger.');
    }
  };

  const handleAddNewCert = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInputId.trim()) return;

    const newCertItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: selectedCert ? selectedCert.name : 'Industry Verified Specialization',
      provider: selectedCert ? selectedCert.provider : 'Accredited Course Partner',
      logo: selectedCert ? selectedCert.logo : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      issueDate: 'Sep 2026',
      credentialId: verifyInputId.trim(),
      verificationStatus: 'Verified',
      skills: selectedCert ? selectedCert.skills : ['Advanced Engineering', 'Verified Competency']
    };

    setCerts(prev => [newCertItem, ...prev]);
    setIsVerifyModalOpen(false);
    setVerifyInputId('');
    setSelectedCert(null);
    triggerConfetti();
  }, [verifyInputId, selectedCert, setCerts, setIsVerifyModalOpen, setVerifyInputId, setSelectedCert, triggerConfetti]);

  // Direct Course Completion by Student: issues certificate immediately
  const handleCompleteCourseDirectly = useCallback(async (prog: LearningProgram) => {
    setIsCompleting(true);
    try {
      const res = await api.courses.completeProgram(prog.id, {
        studentId: studentProfile?.studentId || 'usr-student-1',
        studentName: studentProfile?.name || 'Student Participant',
        usn: studentProfile?.studentId || '1AP23CS014',
        department: studentProfile?.department || 'Computer Science & Engineering'
      });

      triggerConfetti();

      // Immediately refresh database certs & enrollments
      await loadCourseData();

      // Close player and pop up official certificate directly
      setActiveCoursePlayer(null);
      setViewCertificateForProgram({
        program: prog,
        cert: res?.certificate,
        menteeRecord: {
          progressPercentage: 100,
          isCertified: true,
          issuedCertificateId: res?.credentialId || res?.certificate?.credentialId
        }
      });
    } catch (e) {
      console.warn('Error completing course directly:', e);
      // Fallback local issue
      triggerConfetti();
      setActiveCoursePlayer(null);
      setViewCertificateForProgram({
        program: prog,
        cert: {
          name: prog.certificateTemplateTitle || `Certificate of Completion in ${prog.title}`,
          provider: prog.provider,
          credentialId: `${prog.certificateCredentialPrefix || 'APEX-CERT-'}${Date.now().toString(36).toUpperCase()}`,
          issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
      });
    } finally {
      setIsCompleting(false);
    }
  }, [studentProfile, loadCourseData, triggerConfetti]);

  const courseCategories = [
    'All',
    'Course',
    'Certification Track',
    'Bootcamp',
    'Workshop',
    'Industry Training'
  ];

  // Merge context learningPrograms with live API programs (deduplicating by id)
  const allProgramsList = useMemo(() => {
    const map = new Map<string, LearningProgram>();
    learningPrograms.forEach(p => map.set(p.id, p));
    apiPrograms.forEach(p => map.set(p.id, { ...map.get(p.id), ...p }));
    return Array.from(map.values());
  }, [learningPrograms, apiPrograms]);

  // Enrich every course with match details and mentee enrollment / certification status
  const programsWithMatch = useMemo(() => {
    return allProgramsList.map(prog => {
      const match: ProgramRoleBranchMatchDetails = checkLearningProgramRoleAndBranchMatch(
        prog,
        selectedCareerRoleId,
        selectedBranch,
        gapSkills
      );

      const menteeRecord = menteeEnrollments[prog.id];
      const isInstitutional = Boolean(
        prog.id.startsWith('lp-inst-') ||
        prog.provider?.includes('Apex') ||
        prog.department ||
        prog.mentorName
      );

      const savedProgress = courseProgressMap[prog.id];
      const stoppedAtSeconds = savedProgress?.stoppedAtSeconds || menteeRecord?.stoppedAtSeconds || getResumeSeconds(prog.id, 0);
      const isEnrolledEffective = Boolean(
        prog.isEnrolled ||
        menteeRecord ||
        savedProgress ||
        stoppedAtSeconds > 0 ||
        prog.id === lastActiveCourseId
      );
      const isCertifiedEffective = Boolean(
        menteeRecord?.isCertified ||
        (menteeRecord?.progressPercentage !== undefined && menteeRecord.progressPercentage >= 100) ||
        (savedProgress?.progressPercentage !== undefined && savedProgress.progressPercentage >= 100) ||
        menteeRecord?.testStatus === 'passed' ||
        (menteeRecord?.testScore !== undefined && menteeRecord.testScore >= 60) ||
        certs.some(c => c.name === (prog.certificateTemplateTitle || prog.title) || c.name?.toLowerCase().includes(prog.title.toLowerCase()))
      );

      const effectiveProgress = isCertifiedEffective
        ? 100
        : (savedProgress?.progressPercentage !== undefined
            ? savedProgress.progressPercentage
            : (menteeRecord?.progressPercentage !== undefined ? menteeRecord.progressPercentage : (isEnrolledEffective ? 35 : 0)));

      return {
        ...prog,
        isInstitutional,
        isEnrolled: isEnrolledEffective,
        menteeRecord,
        isCertifiedEffective,
        effectiveProgress,
        stoppedAtSeconds,
        savedProgress,
        match
      };
    });
  }, [allProgramsList, selectedCareerRoleId, selectedBranch, gapSkills, menteeEnrollments, courseProgressMap, certs, lastActiveCourseId, getResumeSeconds]);

  // Find the most recently paused course ready for instant 1-click continuation
  const mostRecentCourse = useMemo(() => {
    if (lastActiveCourseId) {
      const found = programsWithMatch.find(p => p.id === lastActiveCourseId);
      if (found && (found.stoppedAtSeconds > 0 || found.effectiveProgress > 0 || found.isEnrolled)) return found;
    }
    const withProgress = programsWithMatch.filter(p => p.stoppedAtSeconds > 0 || p.effectiveProgress > 0 || p.isEnrolled);
    withProgress.sort((a, b) => (b.stoppedAtSeconds || 0) - (a.stoppedAtSeconds || 0) || (b.effectiveProgress || 0) - (a.effectiveProgress || 0));
    return withProgress[0] || null;
  }, [lastActiveCourseId, programsWithMatch]);

  // Filtered & ranked programs
  const filteredPrograms = useMemo(() => {
    return programsWithMatch
      .filter((prog) => {
        // Category filter
        if (selectedCategory !== 'All') {
          if (selectedCategory === 'Certification Track' && prog.category !== 'Certification') return false;
          if (selectedCategory !== 'Certification Track' && prog.category !== selectedCategory) return false;
        }

        // Search query filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = prog.title.toLowerCase().includes(q);
          const matchProvider = prog.provider.toLowerCase().includes(q);
          const matchSkills = prog.skillsGained.some(s => s.toLowerCase().includes(q));
          if (!matchTitle && !matchProvider && !matchSkills) return false;
        }

        // Recommendation mode filter
        if (recommendationMode === 'recommended') {
          return prog.match.isCareerRoleMatch || prog.match.isBranchEligible || prog.isInstitutional;
        }
        if (recommendationMode === 'institutional') {
          return prog.isInstitutional;
        }
        if (recommendationMode === 'gaps') {
          return prog.match.bridgesSkillGap;
        }

        return true;
      })
      .sort((a, b) => {
        // Prioritize institutional courses and higher match scores
        if (a.isInstitutional && !b.isInstitutional) return -1;
        if (!a.isInstitutional && b.isInstitutional) return 1;
        return b.match.matchScore - a.match.matchScore;
      });
  }, [programsWithMatch, selectedCategory, searchQuery, recommendationMode]);

  const institutionalCount = useMemo(() => {
    return programsWithMatch.filter(p => p.isInstitutional).length;
  }, [programsWithMatch]);

  const recommendedCount = useMemo(() => {
    return programsWithMatch.filter(p => p.match.isCareerRoleMatch || p.match.isBranchEligible).length;
  }, [programsWithMatch]);

  const gapBridgingCount = useMemo(() => {
    return programsWithMatch.filter(p => p.match.bridgesSkillGap).length;
  }, [programsWithMatch]);

  const filteredCerts = certs.filter((cert) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = cert.name.toLowerCase().includes(q);
      const matchProvider = cert.provider.toLowerCase().includes(q);
      const matchSkills = cert.skills.some(s => s.toLowerCase().includes(q));
      const matchId = cert.credentialId.toLowerCase().includes(q);
      if (!matchName && !matchProvider && !matchSkills && !matchId) return false;
    }
    return true;
  });

  const enrolledPrograms = useMemo(() => {
    return programsWithMatch.filter(p => p.isEnrolled);
  }, [programsWithMatch]);
  const verifiedCertsCount = certs.filter(c => c.verificationStatus === 'Verified').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN HEADER BLOCK: ONLINE COURSES & CERTIFICATIONS
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Online Courses Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Accredited Course Certifications
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Online Courses &amp; Certifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Explore interactive curricula, industry bootcamps, and verified certificates designed to bridge skill gaps and boost your campus placement profile.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => {
                setSelectedCert(null);
                setVerifyInputId('');
                setIsVerifyModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Verify Certificate
            </button>
          </div>
        </div>

        {/* Sub-Blocks Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div
            onClick={() => setActiveSubBlock('courses')}
            className="p-3.5 bg-blue-50/60 hover:bg-blue-50 rounded-2xl border border-blue-200/80 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">Courses</span>
              <span className="text-sm font-black text-slate-900">{allProgramsList.length} Online Courses</span>
            </div>
          </div>

          <div
            onClick={() => setActiveSubBlock('certifications')}
            className="p-3.5 bg-emerald-50/60 hover:bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Certifications</span>
              <span className="text-sm font-black text-slate-900">{certs.length} Verified Credentials</span>
            </div>
          </div>

          <div
            onClick={() => setActiveSubBlock('enrolled')}
            className="p-3.5 bg-purple-50/60 hover:bg-purple-50 rounded-2xl border border-purple-200/80 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">My Enrolled Courses</span>
              <span className="text-sm font-black text-slate-900">{enrolledPrograms.length} In Progress</span>
            </div>
          </div>
        </div>

        {/* 1-Click Resume Recent Course Quick-Access Banner */}
        {mostRecentCourse && mostRecentCourse.stoppedAtSeconds > 0 && (
          <div className="p-4 bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-lg border border-indigo-500/40 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-amber-300 flex items-center justify-center font-black shrink-0 border border-indigo-400/30 shadow-inner">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-mono">
                    Paused Lecture Ready
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Stopped at: <strong className="font-mono text-amber-300 font-bold">{formatSeconds(mostRecentCourse.stoppedAtSeconds)}</strong>
                  </span>
                </div>
                <h4 className="font-black text-sm sm:text-base text-white line-clamp-1">
                  {mostRecentCourse.title}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {mostRecentCourse.provider} • {mostRecentCourse.effectiveProgress}% Completed • Click to continue immediately from your save spot
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveCoursePlayer(mostRecentCourse)}
              className="px-5 py-2.5 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 self-start sm:self-auto"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Continue from {formatSeconds(mostRecentCourse.stoppedAtSeconds)}
            </button>
          </div>
        )}

        {/* Branch & Career Role Alignment Ribbon */}
        <div className="p-4 bg-linear-to-r from-blue-50/80 via-indigo-50/50 to-amber-50/70 rounded-2xl border border-blue-200/80 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-2xs">
                  <Compass className="w-3.5 h-3.5" />
                  Branch &amp; Career Role Alignment
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  B.Tech {selectedBranch}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  {activeCareerRole.title}
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Courses and curricula are tailored on the basis of your <strong>{selectedBranch}</strong> B.Tech branch and <strong>{activeCareerRole.title}</strong> career roadmap, prioritizing programs that bridge your active skill gaps.
              </p>
            </div>

            {/* Quick Interactive Selectors */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
              {/* Target Career Role Selector */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <label htmlFor="course-role-select" className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                  Role:
                </label>
                <select
                  id="course-role-select"
                  value={selectedCareerRoleId}
                  onChange={(e) => setSelectedCareerRoleId(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer max-w-[150px] truncate"
                >
                  {CAREER_ROLE_OPTIONS.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* B-Tech Branch Selector */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <label htmlFor="course-branch-select" className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                  Branch:
                </label>
                <select
                  id="course-branch-select"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer max-w-[170px] truncate"
                >
                  <option value="All">All B.Tech Branches</option>
                  {BTECH_BRANCHES.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.shortCode} - {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Filter Tabs for Role & Branch */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-200/50">
            <button
              onClick={() => setRecommendationMode('recommended')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendationMode === 'recommended'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended for My Role &amp; Branch ({recommendedCount})</span>
            </button>

            <button
              onClick={() => setRecommendationMode('institutional')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendationMode === 'institutional'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>🏛️ Institutional &amp; Mentor Courses ({institutionalCount})</span>
            </button>

            <button
              onClick={() => setRecommendationMode('gaps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendationMode === 'gaps'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Bridges My Identified Skill Gaps ({gapBridgingCount})</span>
            </button>

            <button
              onClick={() => setRecommendationMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendationMode === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Courses ({programsWithMatch.length})</span>
            </button>
          </div>
        </div>

        {/* Sub-Blocks Segment Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveSubBlock('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            All Courses &amp; Certifications
          </button>

          <button
            onClick={() => setActiveSubBlock('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'courses'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Courses ({learningPrograms.length})
          </button>

          <button
            onClick={() => setActiveSubBlock('certifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'certifications'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Certifications ({certs.length})
          </button>

          <button
            onClick={() => setActiveSubBlock('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'enrolled'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            My Enrolled Courses ({enrolledPrograms.length})
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          SEARCH & CATEGORY FILTER BAR
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {courseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search courses, certs, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          ONLINE COURSES & CURRICULA
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'courses' || activeSubBlock === 'enrolled') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-r from-blue-50/80 via-indigo-50/60 to-amber-50/60 p-4 rounded-2xl border border-blue-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Online Courses &amp; Bootcamps
                </h2>
                <p className="text-xs text-slate-500">
                  Tailored to B.Tech {selectedBranch} &amp; {activeCareerRole.title} with lab projects and industry mentors.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {mostRecentCourse && (
                <button
                  type="button"
                  onClick={() => setActiveCoursePlayer(mostRecentCourse)}
                  className="px-4 py-2 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-400/20 flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                  title="Click to resume your active course lecture"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>
                    Continue: {mostRecentCourse.title.length > 22 ? `${mostRecentCourse.title.slice(0, 22)}...` : mostRecentCourse.title}
                    {mostRecentCourse.stoppedAtSeconds > 0 ? ` (${formatSeconds(mostRecentCourse.stoppedAtSeconds)})` : ''}
                  </span>
                </button>
              )}
              <span className="text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                {activeSubBlock === 'enrolled' ? enrolledPrograms.length : filteredPrograms.length} Courses Available
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeSubBlock === 'enrolled' ? enrolledPrograms : filteredPrograms).map((prog) => {
              const match = prog.match;
              return (
                <div
                  key={prog.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    prog.isInstitutional
                      ? 'border-purple-300 ring-1 ring-purple-100 bg-linear-to-b from-purple-50/20 to-white'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div>
                    {/* Institutional & Mentor Program Badge */}
                    {prog.isInstitutional && (
                      <div className="mb-2.5 flex items-center justify-between gap-2 p-1.5 px-2.5 bg-purple-50 rounded-xl border border-purple-200">
                        <span className="text-[10px] font-black text-purple-900 flex items-center gap-1 uppercase tracking-wider">
                          🏛️ Institutional Program • Faculty Mentored
                        </span>
                        {prog.department && (
                          <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-100">
                            {prog.department}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Category & Ratings & Match Score */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                        {prog.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {prog.rating}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900 text-white shadow-2xs">
                          {match.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Badges for Skill Gap / Role / Branch */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {match.bridgesSkillGap && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600" />
                          Bridges Gap: {match.bridgedSkillName}
                        </span>
                      )}
                      {match.roleMatchBadgeText && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-blue-600" />
                          {match.roleMatchBadgeText}
                        </span>
                      )}
                      {match.branchEligibilityBadgeText && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-indigo-600" />
                          {match.branchEligibilityBadgeText}
                        </span>
                      )}
                      {(prog.isClosed || prog.status === 'Closed' || prog.status === 'Archived') && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 shadow-2xs">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Bookings Closed
                        </span>
                      )}
                      {((prog.videos && prog.videos.length > 0) || prog.videoUrl) && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <Film className="w-3 h-3 text-blue-600" />
                          {prog.videos && prog.videos.length > 1
                            ? `${prog.videos.length} Lectures`
                            : '1 Lecture'}
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => setActiveCoursePlayer(prog)}
                      className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-blue-600 transition-colors"
                      title="Click to open and resume course"
                    >
                      {prog.title}
                    </h3>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs font-medium text-slate-500 truncate">{prog.provider}</p>
                      {(prog.isEnrolled || prog.stoppedAtSeconds > 0 || prog.savedProgress || prog.effectiveProgress > 0) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCoursePlayer(prog);
                          }}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
                          title="Instant Resume Course"
                        >
                          <Play className="w-3 h-3 fill-slate-950" />
                          {prog.stoppedAtSeconds > 0 ? `Resume (${formatSeconds(prog.stoppedAtSeconds)})` : 'Continue'}
                        </button>
                      )}
                    </div>

                    {/* Mentor & Venue indicator if institutional */}
                    {(prog.mentorName || prog.venueOrLink) && (
                      <div className="mt-2.5 p-2 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-[11px] space-y-0.5">
                        {prog.mentorName && (
                          <div className="flex items-center gap-1.5 text-indigo-900 font-semibold truncate">
                            <span className="text-indigo-600 font-bold">Faculty Mentor:</span> {prog.mentorName}
                          </div>
                        )}
                        {prog.venueOrLink && (
                          <div className="flex items-center gap-1.5 text-slate-600 text-[10.5px] truncate">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{prog.venueOrLink}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-500 my-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {prog.duration}
                      </span>
                      <span>•</span>
                      <span>{prog.level}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{prog.mode}</span>
                      {prog.postedDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Posted: {prog.postedDate}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Skills Gained */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {prog.skillsGained.map((sk, i) => {
                        const isGap = gapSkills.some(g => g.toLowerCase() === sk.toLowerCase());
                        return (
                          <span
                            key={i}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                              isGap
                                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isGap ? `⚡ ${sk}` : sk}
                          </span>
                        );
                      })}
                    </div>

                    {/* Certification & Progress Status */}
                    {prog.isCertifiedEffective ? (
                      <div
                        onClick={() => setActiveCoursePlayer(prog)}
                        className="p-2.5 bg-emerald-50 hover:bg-emerald-100/70 rounded-xl border border-emerald-200 text-[11px] flex items-center justify-between mb-4 cursor-pointer transition-colors"
                        title="Click to review course material"
                      >
                        <div className="flex items-center gap-1.5 text-emerald-900 font-black">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Course Completed • 100%</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                          Certificate Ready
                        </span>
                      </div>
                    ) : (prog.isEnrolled || prog.stoppedAtSeconds > 0 || prog.savedProgress || prog.effectiveProgress > 0) ? (
                      <div
                        onClick={() => setActiveCoursePlayer(prog)}
                        className="mb-4 p-3 bg-linear-to-b from-blue-50/90 to-indigo-50/60 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border-2 border-blue-300 space-y-2 cursor-pointer transition-all shadow-xs group"
                        title="Click to resume course"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse inline-block" />
                            Active Progress
                          </span>
                          <span className="font-black text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-md border border-blue-200">
                            {prog.effectiveProgress}% Completed
                          </span>
                        </div>
                        <div className="w-full h-2 bg-blue-200/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(12, prog.effectiveProgress)}%` }}
                          />
                        </div>
                        {prog.stoppedAtSeconds > 0 && (
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-0.5">
                            <span className="flex items-center gap-1 text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300 font-mono text-[10.5px]">
                              <RotateCcw className="w-3 h-3 text-amber-700" />
                              Stopped at: {formatSeconds(prog.stoppedAtSeconds)}
                            </span>
                            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold border border-emerald-300">
                              ✓ Saved &amp; Ready
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCoursePlayer(prog);
                          }}
                          className="w-full mt-2 py-2 px-3 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs group-hover:shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          {prog.stoppedAtSeconds > 0
                            ? `Continue from ${formatSeconds(prog.stoppedAtSeconds)}`
                            : 'Continue Course Lecture'}
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] flex items-center gap-2 mb-4">
                        <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-emerald-900 font-semibold truncate">
                          Earns: {prog.certificateTemplateTitle || 'Verified Certificate & Skill Badge'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {prog.enrolledCount.toLocaleString()} enrolled
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedProgramDetails(prog)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      {prog.isCertifiedEffective ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveCoursePlayer(prog)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-blue-200"
                            title="Re-enter course workspace"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {prog.stoppedAtSeconds > 0 ? `Resume (${formatSeconds(prog.stoppedAtSeconds)})` : 'Review'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const matchingCert = certs.find(c =>
                                c.name === (prog.certificateTemplateTitle || prog.title) ||
                                c.name?.toLowerCase().includes(prog.title.toLowerCase())
                              );
                              setViewCertificateForProgram({
                                program: prog,
                                cert: matchingCert || {
                                  id: prog.menteeRecord?.issuedCertificateId || `cert-${prog.id}`,
                                  name: prog.certificateTemplateTitle || `Certificate of Completion in ${prog.title}`,
                                  provider: prog.provider,
                                  logo: prog.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
                                  issueDate: prog.menteeRecord?.certificateIssuedAt || 'Recently Issued',
                                  credentialId: prog.menteeRecord?.issuedCertificateId || `${prog.certificateCredentialPrefix || 'APEX-CERT-'}${prog.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
                                  verificationStatus: 'Verified',
                                  skills: prog.skillsGained
                                },
                                menteeRecord: prog.menteeRecord
                              });
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Certificate
                          </button>
                        </div>
                      ) : (prog.isEnrolled || prog.stoppedAtSeconds > 0 || prog.savedProgress || prog.effectiveProgress > 0) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCoursePlayer(prog);
                          }}
                          className="px-3.5 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          {prog.stoppedAtSeconds > 0 ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                              Continue from {formatSeconds(prog.stoppedAtSeconds)}
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              Open Course Workspace
                            </>
                          )}
                        </button>
                      ) : (prog.isClosed || prog.status === 'Closed' || prog.status === 'Archived') ? (
                        <button
                          type="button"
                          onClick={() => setActiveCoursePlayer(prog)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" /> Open Course
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await enrollInProgram(prog.id);
                            } catch {}
                            triggerConfetti();
                            try {
                              await loadCourseData();
                            } catch {}
                            setActiveCoursePlayer(prog);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          {match.bridgesSkillGap ? 'Bridge & Enroll' : 'Enroll & Start'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION: COURSE CERTIFICATIONS
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'certifications' || activeSubBlock === 'enrolled') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Course Certifications &amp; Completed Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Track and showcase your completed online course certificates and skill specializations.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs">
              {filteredCerts.length} Certifications Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCerts.map((cert) => {
              const isVerified = cert.verificationStatus === 'Verified' || cert.verificationStatus === 'Completed';

              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <img src={cert.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 bg-emerald-50 text-emerald-800 border-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{cert.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{cert.provider}</p>

                    <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Certificate ID:</span>
                        <span className="font-mono text-slate-700 font-bold">{cert.credentialId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Issued:</span>
                        <span className="text-slate-700 font-semibold">{cert.issueDate}</span>
                      </div>
                      {cert.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Valid Until:</span>
                          <span className="text-slate-700 font-semibold">{cert.expiryDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills Attached */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {cert.skills.map((s, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      ✓ Certificate Added
                    </span>

                    <button
                      onClick={() => setViewProofCert(cert)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT CERTIFICATE
          ────────────────────────────────────────────────────────────────────────── */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Certificate Details</h3>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewCert} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-blue-900">
                <p className="font-semibold">
                  {selectedCert
                    ? `Adding details for: ${selectedCert.name}`
                    : 'Enter your Certificate ID or completion link from your course provider.'}
                </p>
                <p className="text-[11px] text-blue-700 mt-1">
                  Supports Coursera, AWS, Google Cloud, Meta, edX, and university course certifications.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificate ID / Serial Number
                </label>
                <input
                  type="text"
                  required
                  value={verifyInputId}
                  onChange={(e) => setVerifyInputId(e.target.value)}
                  placeholder="e.g. AWS-CCP-98421094 or COURSERA-782194"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: VIEW CERTIFICATE PROOF
          ────────────────────────────────────────────────────────────────────────── */}
      {viewProofCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Course Certificate Details</h3>
              </div>
              <button
                onClick={() => setViewProofCert(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <img src={viewProofCert.logo} alt="" className="w-16 h-16 rounded-2xl mx-auto object-cover border" />
                <h4 className="text-sm font-black text-slate-900">{viewProofCert.name}</h4>
                <p className="text-xs font-semibold text-slate-500">{viewProofCert.provider}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  ✓ Completed Certificate
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Credential ID:</span>
                  <span className="text-slate-900 font-bold">{viewProofCert.credentialId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Issued Date:</span>
                  <span className="text-slate-700">{viewProofCert.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewProofCert(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Details & Requirements Modal */}
      {selectedProgramDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProgramDetails.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {selectedProgramDetails.category}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                      {selectedProgramDetails.mode}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-1">{selectedProgramDetails.title}</h3>
                  <p className="text-xs font-semibold text-slate-500">By {selectedProgramDetails.provider}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProgramDetails(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs mb-1">About the Program</h4>
                <p className="text-slate-600 leading-relaxed">{selectedProgramDetails.description}</p>
              </div>

              {/* Requirements & Criteria */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h4>Admission Requirements &amp; Eligibility Criteria</h4>
                </div>
                {selectedProgramDetails.requirements && selectedProgramDetails.requirements.length > 0 ? (
                  <ul className="space-y-1.5 pl-1">
                    {selectedProgramDetails.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">Open to all enrolled engineering and technology students with basic programming interest.</p>
                )}
              </div>

              {/* Prerequisites */}
              {selectedProgramDetails.prerequisites && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <h4>Prerequisites &amp; Prior Knowledge</h4>
                  </div>
                  <p className="text-slate-700">{selectedProgramDetails.prerequisites}</p>
                </div>
              )}

              {/* Eligible Branches */}
              {selectedProgramDetails.eligibleBranches && selectedProgramDetails.eligibleBranches.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <h4>Eligible Academic Departments</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgramDetails.eligibleBranches.map((br, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium">
                        {br}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiring Advantage */}
              {selectedProgramDetails.hiringAdvantage && (
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h4>Hiring &amp; Placement Advantage</h4>
                  </div>
                  <p className="text-purple-800 font-medium">{selectedProgramDetails.hiringAdvantage}</p>
                </div>
              )}

              {/* Skills Gained */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Skills You Will Master</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProgramDetails.skillsGained.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Duration: <strong className="text-slate-800">{selectedProgramDetails.duration}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProgramDetails(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
                {((selectedProgramDetails as any).isEnrolled || (selectedProgramDetails as any).stoppedAtSeconds > 0 || (selectedProgramDetails as any).savedProgress || (selectedProgramDetails as any).effectiveProgress > 0) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prog = selectedProgramDetails;
                      setSelectedProgramDetails(null);
                      setActiveCoursePlayer(prog);
                    }}
                    className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {(selectedProgramDetails as any).stoppedAtSeconds > 0
                      ? `Continue from ${formatSeconds((selectedProgramDetails as any).stoppedAtSeconds)}`
                      : 'Continue Course Workspace'}
                  </button>
                ) : (selectedProgramDetails.isClosed || selectedProgramDetails.status === 'Closed' || selectedProgramDetails.status === 'Archived') ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prog = selectedProgramDetails;
                      setSelectedProgramDetails(null);
                      setActiveCoursePlayer(prog);
                    }}
                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Open Course Lectures
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await enrollInProgram(selectedProgramDetails.id);
                      } catch {}
                      const prog = selectedProgramDetails;
                      setSelectedProgramDetails(null);
                      triggerConfetti();
                      try {
                        await loadCourseData();
                      } catch {}
                      setActiveCoursePlayer(prog);
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    Confirm &amp; Start Learning
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: ACTIVE COURSE PLAYER & DIRECT CERTIFICATION WORKSPACE
          ────────────────────────────────────────────────────────────────────────── */}
      {activeCoursePlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col my-auto overflow-hidden">
            {/* Sticky Header: ALWAYS VISIBLE WITH "SAVE & EXIT" */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-5 sm:px-7 py-4 border-b border-slate-200 shadow-xs flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {activeCoursePlayer.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {activeCoursePlayer.mode}
                    </span>
                    {activeCoursePlayer.department && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {activeCoursePlayer.department}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg mt-0.5 leading-tight truncate">
                    {activeCoursePlayer.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 truncate">
                    Offered by <span className="text-slate-800 font-bold">{activeCoursePlayer.provider}</span>
                    {activeCoursePlayer.mentorName && (
                      <> • Faculty Mentor: <span className="text-indigo-600 font-bold">{activeCoursePlayer.mentorName}</span></>
                    )}
                  </p>
                </div>
              </div>

              {/* Primary Top Action: Prominent Save & Exit Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleClosePlayer}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/30 flex items-center gap-2 cursor-pointer transition-all border-2 border-emerald-400 ring-2 ring-emerald-500/20"
                  title="Save playback spot and exit back to courses"
                >
                  <BookmarkCheck className="w-4 h-4 text-white" />
                  <span className="whitespace-nowrap text-white font-extrabold">Save &amp; Exit</span>
                  <span className="font-mono text-[11px] bg-emerald-800 px-2 py-0.5 rounded text-emerald-100 font-bold hidden sm:inline-block">
                    {formatSeconds(currentPlayTime)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleClosePlayer}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-300 shadow-2xs flex items-center justify-center"
                  title="Save progress and close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1">

            {/* Program Logistics Banner */}
            {(activeCoursePlayer.venueOrLink || activeCoursePlayer.duration) && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Total Duration: <strong className="text-slate-800">{activeCoursePlayer.duration}</strong></span>
                </div>
                {activeCoursePlayer.venueOrLink && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="text-slate-600">
                      {activeCoursePlayer.mode === 'Offline Classroom' ? 'Classroom / Lab: ' : 'Live Portal / Link: '}
                      <strong className="text-indigo-700">{activeCoursePlayer.venueOrLink}</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600">Certification: <strong className="text-emerald-700">Immediate Direct Issuance</strong></span>
                </div>
              </div>
            )}

            {/* Mentor Online Lecture & Video Material */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                  Mentor Online Lecture &amp; Video Material
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={getDirectWatchUrl(
                      (activeCoursePlayer.videos?.[activeVideoIndex]?.url) || activeCoursePlayer.videoUrl,
                      (activeCoursePlayer.videos?.[activeVideoIndex]?.title) || activeCoursePlayer.title,
                      activeCoursePlayer.skillsGained
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 shadow-2xs hover:text-red-600"
                    title="Open verified lecture video directly on YouTube in a new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                    <span>Watch on YouTube</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setVideoReloadKey(k => k + 1)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-200 cursor-pointer shadow-2xs"
                    title="Reload player if video gets paused or stuck"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Reload Player</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUnmuteAndMaxVolume}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isAudioActive
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-400/40'
                        : 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                    }`}
                    title="Click to unmute and set YouTube volume to 100%"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {isAudioActive ? '🔊 Sound Active (100%)' : '🔊 Turn Sound On'}
                  </button>
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-slate-400" /> {activeCoursePlayer.videoDuration || '50 mins'}
                  </span>
                </div>
              </div>

              {/* Playback Spot & Continuation Controller Bar */}
              <div className="p-3.5 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl space-y-2.5 shadow-md border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Current Playback Spot:</span>
                        <span className="text-xs font-black text-amber-300 font-mono bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-amber-400/40 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isTrackingActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                          {formatSeconds(currentPlayTime)}
                        </span>
                        {showSavedToast && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Position Saved!
                          </span>
                        )}
                      </div>
                      {activeCoursePlayer && getResumeSeconds(activeCoursePlayer.id, activeCoursePlayer.stoppedAtSeconds || 0) > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10.5px] text-slate-400">
                            Resumed from saved spot: <strong className="text-indigo-300 font-mono">{formatSeconds(getResumeSeconds(activeCoursePlayer.id, activeCoursePlayer.stoppedAtSeconds || 0))}</strong>
                          </p>
                          <button
                            type="button"
                            onClick={() => handleSeekToTime(getResumeSeconds(activeCoursePlayer.id, activeCoursePlayer.stoppedAtSeconds || 0))}
                            className="text-[10px] text-amber-300 hover:text-amber-200 underline font-bold cursor-pointer"
                            title="Re-seek YouTube video to your saved spot"
                          >
                            Re-sync to saved
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsTrackingActive(!isTrackingActive)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        isTrackingActive
                          ? 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-emerald-600 text-white border-emerald-500'
                      }`}
                      title={isTrackingActive ? 'Pause playback timer' : 'Resume playback timer'}
                    >
                      {isTrackingActive ? '⏸ Pause Timer' : '▶ Track'}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestartFromBeginning}
                      className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-700"
                      title="Start over from 00:00"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      0:00
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveSpotNow}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Save current playback spot"
                    >
                      <Save className="w-3 h-3" />
                      Save Spot
                    </button>

                    <button
                      type="button"
                      onClick={handleClosePlayer}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-emerald-400"
                      title="Save spot and exit back to courses"
                    >
                      <BookmarkCheck className="w-4 h-4 text-white" />
                      <span>Save &amp; Exit ({formatSeconds(currentPlayTime)})</span>
                    </button>

                    {(activeCoursePlayer?.isCertifiedEffective || menteeEnrollments[activeCoursePlayer?.id]?.isCertified || menteeEnrollments[activeCoursePlayer?.id]?.testStatus === 'passed' || (courseProgressMap[activeCoursePlayer?.id]?.progressPercentage !== undefined && courseProgressMap[activeCoursePlayer?.id]?.progressPercentage >= 100)) && (
                      <button
                        type="button"
                        onClick={() => {
                          const prog = activeCoursePlayer;
                          const matchingCert = certs.find(c =>
                            c.name === (prog.certificateTemplateTitle || prog.title) ||
                            c.name?.toLowerCase().includes(prog.title.toLowerCase())
                          );
                          setViewCertificateForProgram({
                            program: prog,
                            cert: matchingCert || {
                              id: prog.menteeRecord?.issuedCertificateId || `cert-${prog.id}`,
                              name: prog.certificateTemplateTitle || `Certificate of Completion in ${prog.title}`,
                              provider: prog.provider,
                              logo: prog.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
                              issueDate: prog.menteeRecord?.certificateIssuedAt || 'Recently Issued',
                              credentialId: prog.menteeRecord?.issuedCertificateId || `${prog.certificateCredentialPrefix || 'APEX-CERT-'}${prog.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
                              verificationStatus: 'Verified',
                              skills: prog.skillsGained
                            },
                            menteeRecord: prog.menteeRecord
                          });
                        }}
                        className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/30 border border-amber-300"
                        title="View official verified course certificate"
                      >
                        <Award className="w-4 h-4 text-slate-950" />
                        <span>View Certificate 🎓</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Time Jump / Scrubber Row */}
                <div className="pt-1.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="font-bold text-slate-300">Quick Jump:</span>
                    <button
                      type="button"
                      onClick={() => handleSeekToTime(Math.max(0, currentPlayTime - 300))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-300 hover:text-white font-mono cursor-pointer"
                    >
                      -5m
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeekToTime(Math.max(0, currentPlayTime - 60))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-300 hover:text-white font-mono cursor-pointer"
                    >
                      -1m
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeekToTime(currentPlayTime + 60)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-300 hover:text-white font-mono cursor-pointer"
                    >
                      +1m
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeekToTime(currentPlayTime + 300)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-300 hover:text-white font-mono cursor-pointer"
                    >
                      +5m
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeekToTime(currentPlayTime + 600)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-300 hover:text-white font-mono cursor-pointer"
                    >
                      +10m
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeekToTime(900)}
                      className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-bold font-mono cursor-pointer border border-amber-400/30"
                      title="Set spot directly to 15 minutes"
                    >
                      Set 15:00
                    </button>
                  </div>

                  {/* Scrubber slider */}
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <span className="text-[10px] text-slate-400 font-mono">00:00</span>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(2400, currentPlayTime + 600)}
                      value={currentPlayTime}
                      onChange={(e) => handleSeekToTime(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatSeconds(Math.max(2400, currentPlayTime + 600))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Lectures & Lab Playlist Component (Multi-Video Support) */}
              {(() => {
                const currentVideoList: CourseVideoItem[] = (activeCoursePlayer.videos && Array.isArray(activeCoursePlayer.videos) && activeCoursePlayer.videos.length > 0)
                  ? activeCoursePlayer.videos
                  : [{
                      id: 'vid-fallback-1',
                      title: activeCoursePlayer.videoTitle || getDefaultVideoTitle(activeCoursePlayer.title),
                      url: activeCoursePlayer.videoUrl,
                      duration: activeCoursePlayer.videoDuration || '45 mins',
                      moduleIndex: 1
                    }];

                const safeVideoIndex = Math.min(Math.max(0, activeVideoIndex), Math.max(0, currentVideoList.length - 1));
                const currentActiveVideo = currentVideoList[safeVideoIndex] || currentVideoList[0];

                const handleSwitchVideo = (idx: number) => {
                  setActiveVideoIndex(idx);
                  setPlayerInitialStartSeconds(0);
                  setVideoReloadKey(k => k + 1);
                };

                return (
                  <>
                    {/* Multi-Lecture Playlist Bar if course has multiple videos */}
                    {currentVideoList.length > 1 && (
                      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white space-y-3 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-xs">
                              <Film className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-100">
                                  Course Video Lectures &amp; Playlist
                                </h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                  {currentVideoList.length} Lectures Attached
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Now Playing: <strong className="text-white">Lecture #{safeVideoIndex + 1}</strong> &bull; {currentActiveVideo?.title}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                              type="button"
                              disabled={safeVideoIndex === 0}
                              onClick={() => handleSwitchVideo(safeVideoIndex - 1)}
                              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                            >
                              &larr; Prev Lecture
                            </button>
                            <button
                              type="button"
                              disabled={safeVideoIndex === currentVideoList.length - 1}
                              onClick={() => handleSwitchVideo(safeVideoIndex + 1)}
                              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
                            >
                              Next Lecture &rarr;
                            </button>
                          </div>
                        </div>

                        {/* Interactive Playlist lecture cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                          {currentVideoList.map((vid, vIdx) => {
                            const isCurrent = vIdx === safeVideoIndex;
                            return (
                              <button
                                key={vid.id || vIdx}
                                type="button"
                                onClick={() => handleSwitchVideo(vIdx)}
                                className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-2.5 ${
                                  isCurrent
                                    ? 'bg-blue-950/90 border-blue-500 text-white shadow-md ring-2 ring-blue-500/40'
                                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                    isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                                  }`}>
                                    Lecture #{vIdx + 1}
                                  </span>

                                  {isCurrent ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                      Active Video
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {vid.duration || '45 mins'}
                                    </span>
                                  )}
                                </div>

                                <p className={`text-xs font-semibold line-clamp-2 leading-snug ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                                  {vid.title}
                                </p>

                                <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-slate-700/40 text-slate-400">
                                  <span className="flex items-center gap-1 font-semibold">
                                    <Play className={`w-3 h-3 ${isCurrent ? 'fill-blue-400 text-blue-400' : 'text-slate-400'}`} />
                                    {isCurrent ? 'Playing Now' : 'Click to Switch'}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[10px] text-blue-300 font-mono font-bold">
                                      {vid.duration || '45 mins'}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Audio Notice Helper Banner */}
                    <div className="p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-blue-900 min-w-0">
                        <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-medium text-[11.5px] leading-tight">
                          <strong>Sound tip:</strong> If sound is muted by your browser's autoplay policy, click <strong className="text-amber-700">"Turn Sound On"</strong> or click the speaker icon on the YouTube player.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleUnmuteAndMaxVolume}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer shadow-2xs transition-colors"
                      >
                        Unmute
                      </button>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md aspect-video">
                      <iframe
                        key={`${activeCoursePlayer.id}-${currentActiveVideo?.id || safeVideoIndex}-${videoReloadKey}`}
                        ref={iframeRef}
                        src={getEmbedVideoUrl(
                          currentActiveVideo?.url || activeCoursePlayer.videoUrl,
                          currentActiveVideo?.title || activeCoursePlayer.title,
                          activeCoursePlayer.skillsGained,
                          playerInitialStartSeconds
                        )}
                        title={currentActiveVideo?.title || activeCoursePlayer.videoTitle || getDefaultVideoTitle(activeCoursePlayer.title)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; speaker-selection; fullscreen"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0"
                        onLoad={() => {
                          const resumeSec = playerInitialStartSeconds;
                          try {
                            iframeRef.current?.contentWindow?.postMessage(
                              JSON.stringify({ event: 'listening' }),
                              '*'
                            );
                            if (resumeSec > 0) {
                              setTimeout(() => {
                                try {
                                  iframeRef.current?.contentWindow?.postMessage(
                                    JSON.stringify({ event: 'command', func: 'seekTo', args: [resumeSec, true] }),
                                    '*'
                                  );
                                } catch {}
                              }, 500);
                            }
                          } catch {}
                        }}
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 min-w-0">
                        <span className="font-bold text-blue-700 shrink-0">🎥 Lecture Topic:</span>
                        <span className="font-semibold text-slate-800 truncate">
                          {currentActiveVideo?.title || activeCoursePlayer.videoTitle || getDefaultVideoTitle(activeCoursePlayer.title)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {currentVideoList.length > 1 && (
                          <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            Lecture {safeVideoIndex + 1} of {currentVideoList.length}
                          </span>
                        )}
                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Mentor Video &amp; Sound Ready
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Course Modules Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  Course Modules &amp; Practical Milestones
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  Interactive Learning Workspace
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'mod-1',
                    title: 'Module 1: Foundations, Architecture & Prerequisites',
                    desc: 'Core theoretical understanding, development environment setup, and baseline principles.',
                    duration: 'Week 1-2'
                  },
                  {
                    id: 'mod-2',
                    title: 'Module 2: Hands-on Lab Implementations & Case Studies',
                    desc: 'Practical lab assignments, guided programming exercises, and intermediate challenges.',
                    duration: 'Week 3-4'
                  },
                  {
                    id: 'mod-3',
                    title: 'Module 3: Industry Project & Architecture Review',
                    desc: 'End-to-end practical solution development with faculty code review and feedback.',
                    duration: 'Week 5'
                  },
                  {
                    id: 'mod-4',
                    title: 'Module 4: Final Capstone Assessment & Competency Evaluation',
                    desc: 'Comprehensive evaluation validating mastery in all key competencies required for certification.',
                    duration: 'Week 6'
                  }
                ].map((mod) => {
                  const isChecked = completedModulesState[mod.id] ?? true;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => {
                        const nextChecked = !isChecked;
                        const nextModules = {
                          ...completedModulesState,
                          [mod.id]: nextChecked
                        };
                        setCompletedModulesState(nextModules);
                        if (activeCoursePlayer) {
                          saveCourseProgress(activeCoursePlayer.id, currentPlayTime, nextModules);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors ${
                          isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className={`text-xs font-bold leading-snug ${isChecked ? 'text-emerald-950' : 'text-slate-800'}`}>
                            {mod.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {mod.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                        {mod.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI-Proctored Course Assessment Section */}
            {(() => {
              const activeMenteeRecord = menteeEnrollments[activeCoursePlayer.id] || activeCoursePlayer.menteeRecord;
              const isDisqualified = Boolean(
                activeMenteeRecord?.isDisqualified ||
                activeMenteeRecord?.testStatus === 'disqualified' ||
                (activeMenteeRecord?.testViolationsCount >= 3)
              );
              const hasPassedTest = Boolean(
                activeMenteeRecord?.testStatus === 'passed' ||
                (activeMenteeRecord?.testScore !== undefined && activeMenteeRecord?.testScore >= 60)
              );

              return (
                <div className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                  isDisqualified
                    ? 'bg-rose-50/70 border-rose-300'
                    : hasPassedTest
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-linear-to-br from-indigo-50/60 via-blue-50/40 to-slate-50 border-indigo-200'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isDisqualified
                          ? 'bg-rose-600 text-white'
                          : hasPassedTest
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white'
                      }`}>
                        {isDisqualified ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : hasPassedTest ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">
                            {isDisqualified
                              ? 'Course Disqualified: Proctoring Violation Recorded'
                              : hasPassedTest
                                ? `AI-Proctored Assessment Passed (${activeMenteeRecord.testScore}%)`
                                : 'Mandatory AI-Proctored Final Test'}
                          </h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isDisqualified
                              ? 'bg-rose-600 text-white'
                              : hasPassedTest
                                ? 'bg-emerald-600 text-white'
                                : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {isDisqualified ? '3 STRIKES DISQUALIFIED' : hasPassedTest ? 'PASSED (>=60%)' : '10 AI QUESTIONS • 30 MINS'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {isDisqualified
                            ? 'You exited full-screen mode 3 times during the proctored examination. As stated in the proctoring agreement, you are disqualified from this course. No certification can be issued by the mentor or institution.'
                            : hasPassedTest
                              ? `You demonstrated mastery with a verified test score of ${activeMenteeRecord.testScore}%. Your eligibility has been verified for institutional credential issuance.`
                              : 'Every student receives an exclusive set of 10 AI-curated questions generated dynamically. The exam runs with a 30-minute timer and must be completed in Fullscreen Mode only.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proctoring Rules Summary Banner (for unattempted or pending) */}
                  {!isDisqualified && !hasPassedTest && (
                    <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-[11px] text-slate-600 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>Strict Academic Integrity &amp; Proctoring Rules:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                        <li>Fullscreen mode is mandatory throughout the entire 30-minute test.</li>
                        <li>Exiting fullscreen triggers a warning strike. Exiting <strong>3 times</strong> results in immediate disqualification and permanent revocation of course certification.</li>
                        <li>Questions are unique to each student generated in the backend by AI.</li>
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-200/60">
                    <div className="text-[11px] font-bold text-slate-500">
                      {isDisqualified ? (
                        <span className="text-rose-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Certification Permanently Revoked
                        </span>
                      ) : hasPassedTest ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Test Requirements Fulfilled
                        </span>
                      ) : (
                        <span>Passing Benchmark: 60% (6/10 questions)</span>
                      )}
                    </div>

                    {!isDisqualified && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCourseForTest(activeCoursePlayer);
                          setIsProctoredTestOpen(true);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                          hasPassedTest
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/20'
                        }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        {hasPassedTest ? 'Retake AI Assessment' : 'Take AI-Proctored Test'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Direct Certificate Guarantee Card */}
            {(() => {
              const activeMenteeRecord = menteeEnrollments[activeCoursePlayer.id] || activeCoursePlayer.menteeRecord;
              const isDisqualified = Boolean(
                activeMenteeRecord?.isDisqualified ||
                activeMenteeRecord?.testStatus === 'disqualified' ||
                (activeMenteeRecord?.testViolationsCount >= 3)
              );
              const hasPassedTest = Boolean(
                activeMenteeRecord?.testStatus === 'passed' ||
                (activeMenteeRecord?.testScore !== undefined && activeMenteeRecord?.testScore >= 60)
              );

              return (
                <div className={`p-5 rounded-2xl border space-y-3 ${
                  isDisqualified
                    ? 'bg-rose-50/60 border-rose-200'
                    : hasPassedTest
                      ? 'bg-linear-to-br from-emerald-500/10 via-emerald-50/80 to-teal-50 border-emerald-200/80'
                      : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      isDisqualified
                        ? 'bg-rose-600 text-white'
                        : hasPassedTest
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-400 text-white'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black ${
                        isDisqualified ? 'text-rose-950' : hasPassedTest ? 'text-emerald-950' : 'text-slate-800'
                      }`}>
                        {isDisqualified
                          ? 'Certification Permanently Locked'
                          : hasPassedTest
                            ? 'Direct Course Completion & Instant Certificate Issuance'
                            : 'Course Completion & Verified Certificate'}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isDisqualified
                          ? 'Due to 3 fullscreen proctoring exit violations, academic integrity rules strictly prevent certification from being issued by the mentor, institution, or administration.'
                          : hasPassedTest
                            ? `Evaluation requirements completed. Completing this course will automatically generate your official verified certificate signed by ${activeCoursePlayer.provider} (${activeCoursePlayer.mentorName || 'Faculty Mentor'}).`
                            : 'You must first take and pass (>=60%) the AI-Proctored Final Test above before this course can be completed and your credential issued.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200/60">
                    <div className="text-[11px] font-semibold flex items-center gap-1.5 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certificate Title: <strong>{activeCoursePlayer.certificateTemplateTitle || activeCoursePlayer.title}</strong></span>
                    </div>

                    {isDisqualified ? (
                      <button
                        type="button"
                        disabled
                        className="px-6 py-2.5 bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" /> Certification Locked
                      </button>
                    ) : !hasPassedTest && !activeCoursePlayer.isCertifiedEffective && !(activeMenteeRecord?.isCertified) ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCourseForTest(activeCoursePlayer);
                          setIsProctoredTestOpen(true);
                        }}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Maximize2 className="w-4 h-4" /> Pass AI Test to Unlock Certificate
                      </button>
                    ) : (activeMenteeRecord?.isCertified || activeCoursePlayer.isCertifiedEffective || (courseProgressMap[activeCoursePlayer.id]?.progressPercentage !== undefined && courseProgressMap[activeCoursePlayer.id]?.progressPercentage >= 100)) ? (
                      <button
                        type="button"
                        onClick={() => {
                          const matchingCert = certs.find(c =>
                            c.name === (activeCoursePlayer.certificateTemplateTitle || activeCoursePlayer.title) ||
                            c.name?.toLowerCase().includes(activeCoursePlayer.title.toLowerCase())
                          );
                          setViewCertificateForProgram({
                            program: activeCoursePlayer,
                            cert: matchingCert || {
                              id: activeMenteeRecord?.issuedCertificateId || `cert-${activeCoursePlayer.id}`,
                              name: activeCoursePlayer.certificateTemplateTitle || `Certificate of Completion in ${activeCoursePlayer.title}`,
                              provider: activeCoursePlayer.provider,
                              logo: activeCoursePlayer.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
                              issueDate: activeMenteeRecord?.certificateIssuedAt || 'Recently Issued',
                              credentialId: activeMenteeRecord?.issuedCertificateId || `${activeCoursePlayer.certificateCredentialPrefix || 'APEX-CERT-'}${activeCoursePlayer.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
                              verificationStatus: 'Verified',
                              skills: activeCoursePlayer.skillsGained
                            },
                            menteeRecord: activeMenteeRecord
                          });
                        }}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-emerald-400 ring-2 ring-emerald-500/20"
                      >
                        <Award className="w-4 h-4" />
                        <span>View Official Verified Certificate 🎓</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isCompleting}
                        onClick={() => handleCompleteCourseDirectly(activeCoursePlayer)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 border-2 border-emerald-400"
                      >
                        {isCompleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Issuing Verified Certificate...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4" />
                            Complete Course &amp; Get Certificate Directly
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            </div>

            {/* Sticky Footer: ALWAYS VISIBLE WITH "SAVE & EXIT" */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md z-30 px-5 sm:px-7 py-3.5 border-t border-slate-200 shadow-2xl flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleClosePlayer}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/30 cursor-pointer flex items-center gap-2 transition-all border-2 border-emerald-400 ring-2 ring-emerald-500/20"
                title="Save current playback spot and exit back to courses"
              >
                <BookmarkCheck className="w-4 h-4 text-white" />
                <span className="text-white font-black">Save &amp; Exit Course</span>
                <span className="font-mono text-[11px] bg-emerald-800 px-2 py-0.5 rounded text-emerald-100 font-bold">
                  {formatSeconds(currentPlayTime)}
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {(activeCoursePlayer?.isCertifiedEffective || menteeEnrollments[activeCoursePlayer?.id]?.isCertified || menteeEnrollments[activeCoursePlayer?.id]?.testStatus === 'passed' || (courseProgressMap[activeCoursePlayer?.id]?.progressPercentage !== undefined && courseProgressMap[activeCoursePlayer?.id]?.progressPercentage >= 100)) && (
                  <button
                    type="button"
                    onClick={() => {
                      const prog = activeCoursePlayer;
                      const matchingCert = certs.find(c =>
                        c.name === (prog.certificateTemplateTitle || prog.title) ||
                        c.name?.toLowerCase().includes(prog.title.toLowerCase())
                      );
                      setViewCertificateForProgram({
                        program: prog,
                        cert: matchingCert || {
                          id: prog.menteeRecord?.issuedCertificateId || `cert-${prog.id}`,
                          name: prog.certificateTemplateTitle || `Certificate of Completion in ${prog.title}`,
                          provider: prog.provider,
                          logo: prog.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
                          issueDate: prog.menteeRecord?.certificateIssuedAt || 'Recently Issued',
                          credentialId: prog.menteeRecord?.issuedCertificateId || `${prog.certificateCredentialPrefix || 'APEX-CERT-'}${prog.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
                          verificationStatus: 'Verified',
                          skills: prog.skillsGained
                        },
                        menteeRecord: prog.menteeRecord
                      });
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-400/30 cursor-pointer flex items-center gap-1.5 transition-all border border-amber-300 animate-pulse"
                    title="View your official verified course certificate"
                  >
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>View Official Certificate 🎓</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveSpotNow}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Save playback spot without leaving"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Save Current Spot ({formatSeconds(currentPlayTime)})
                </button>
                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Auto-resumes from <strong className="text-slate-800 font-mono">{formatSeconds(currentPlayTime)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: OFFICIAL ISSUED CERTIFICATE DIPLOMA VIEW
          ────────────────────────────────────────────────────────────────────────── */}
      {viewCertificateForProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[94vh] overflow-y-auto my-auto">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Official Verified Certificate
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Permanently Saved to Digital Portfolio
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => {
                    setViewCertificateForProgram(null);
                    setActiveSubBlock('certifications');
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Award className="w-3.5 h-3.5" /> View in Portfolio
                </button>
                <button
                  onClick={() => setViewCertificateForProgram(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Certificate Diploma Container */}
            <div
              id="printable-certificate"
              className="relative p-8 sm:p-12 rounded-3xl bg-linear-to-b from-amber-50/40 via-white to-amber-50/30 border-8 border-double border-amber-300 ring-2 ring-amber-400/40 shadow-inner text-center space-y-6 overflow-hidden"
            >
              {/* Background Watermark Crest */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <Award className="w-96 h-96 text-amber-900" />
              </div>

              {/* Institution Header */}
              <div className="space-y-1.5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 rounded-full border border-amber-300 text-amber-900 text-[11px] font-extrabold uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Official Academic &amp; Professional Credential
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  {viewCertificateForProgram.program.provider || 'Apex Institute of Technology'}
                </h2>
                <p className="text-xs text-slate-500 tracking-wide font-serif italic">
                  Academic Accreditation Council &amp; Faculty Mentorship Board
                </p>
              </div>

              {/* Certificate Title */}
              <div className="space-y-2 relative z-10 py-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 block">
                  This is proudly presented to
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif border-b-2 border-slate-200 pb-3 max-w-lg mx-auto">
                  {studentProfile?.name || 'Surya Nalla'}
                </h1>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-600 pt-1 font-semibold">
                  <span>USN: <strong className="text-slate-900 font-mono">{studentProfile?.studentId || '1AP23CS014'}</strong></span>
                  <span>•</span>
                  <span>Dept: <strong className="text-slate-900">{studentProfile?.department || selectedBranch}</strong></span>
                </div>
              </div>

              {/* Citation */}
              <div className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-serif relative z-10 space-y-2">
                <p>
                  for successfully completing all prescribed coursework, laboratory assignments, and practical milestones in:
                </p>
                <p className="text-base sm:text-lg font-black text-blue-900 font-sans">
                  {viewCertificateForProgram.cert?.name || viewCertificateForProgram.program.certificateTemplateTitle || viewCertificateForProgram.program.title}
                </p>
                <p className="text-xs text-slate-500 italic max-w-xl mx-auto">
                  {viewCertificateForProgram.program.certificateCitation || 'Demonstrating exceptional diligence, domain mastery, and practical competence according to accredited institutional standards.'}
                </p>
              </div>

              {/* Skills Attached */}
              {viewCertificateForProgram.program.skillsGained && viewCertificateForProgram.program.skillsGained.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 pt-2 relative z-10 max-w-lg mx-auto">
                  {viewCertificateForProgram.program.skillsGained.map((sk, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              )}

              {/* Certificate Signatures & Official Seal */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 items-end gap-4 relative z-10">
                {/* Left: Credential ID & Date */}
                <div className="text-left space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Credential ID</div>
                  <div className="font-mono text-xs font-black text-slate-800">
                    {viewCertificateForProgram.cert?.credentialId || `APEX-CERT-${viewCertificateForProgram.program.id.slice(-6).toUpperCase()}`}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Issued: {viewCertificateForProgram.cert?.issueDate || 'September 2026'}
                  </div>
                </div>

                {/* Center: Gold Official Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-white flex flex-col items-center justify-center text-white">
                      <Award className="w-6 h-6" />
                      <span className="text-[7px] font-black uppercase tracking-wider">SEAL</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider mt-1">
                    Verified Digital Diploma
                  </span>
                </div>

                {/* Right: Signatory */}
                <div className="text-right space-y-1">
                  <div className="font-serif italic text-sm font-bold text-slate-800">
                    {viewCertificateForProgram.program.certificateSignatoryName || viewCertificateForProgram.program.mentorName || 'Dr. K. S. Rao'}
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[10px] uppercase font-bold text-slate-500">
                    {viewCertificateForProgram.program.certificateSignatoryTitle || 'Dean & Program Director'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Status: <strong className="text-emerald-700">Verified &amp; Authenticated</strong>
              </span>
              <button
                onClick={() => setViewCertificateForProgram(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Proctored Fullscreen Test Modal */}
      {isProctoredTestOpen && activeCourseForTest && (
        <CourseProctoredTestModal
          course={activeCourseForTest}
          menteeEnrollmentId={
            menteeEnrollments[activeCourseForTest.id]?.id ||
            (activeCourseForTest as any).menteeRecord?.id ||
            `mentee-${activeCourseForTest.id}`
          }
          studentId={studentProfile?.studentId || 'usr-student-1'}
          onClose={() => {
            setIsProctoredTestOpen(false);
            loadCourseData();
          }}
          onTestPassed={handleTestPassed}
          onClaimCertificate={handleClaimCertificateFromTest}
          onDisqualified={handleTestDisqualified}
        />
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          FLOATING QUICK-RESUME PILL (Always visible anywhere on screen)
          ────────────────────────────────────────────────────────────────────────── */}
      {!activeCoursePlayer && mostRecentCourse && (
        <aside
          aria-label="Continue course"
          className="fixed bottom-6 right-6 z-40 bg-slate-900/95 backdrop-blur-md text-white border-2 border-amber-400 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 animate-in slide-in-from-bottom duration-300 ring-4 ring-amber-400/20"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </div>
          <div className="max-w-[210px] sm:max-w-xs">
            <div className="text-[10px] uppercase font-mono font-black text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              Course in Progress
              {mostRecentCourse.stoppedAtSeconds > 0 && ` • ${formatSeconds(mostRecentCourse.stoppedAtSeconds)}`}
            </div>
            <div className="text-xs font-bold text-white truncate mt-0.5" title={mostRecentCourse.title}>
              {mostRecentCourse.title}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveCoursePlayer(mostRecentCourse)}
            className="px-4 py-2 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-transform active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
            Continue
          </button>
        </aside>
      )}
    </div>
  );
};
