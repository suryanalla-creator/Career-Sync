import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  ActivePageView,
  AuthRole,
  StudentProfile,
  Opportunity,
  ApplicationTrackerItem,
  NotificationItem,
  Conversation,
  LearningProgram,
  VerifiedCertificate,
  VerifiedSkillItem,
  InternshipCertificateItem,
  SkillMatchResult
} from '../types';
import {
  mockStudentProfile,
  mockOpportunities,
  mockApplications,
  mockNotifications,
  mockConversations,
  mockLearningPrograms,
  mockAcademicianProfile,
  mockSkillGapAnalysis
} from '../data/mockData';
import { api, getStoredUser, setStoredAuth } from '../services/api';
import { calculateAccurateMatch, isSkillEquivalent } from '../utils/skillMatcher';
import { CAREER_ROLE_OPTIONS, CareerRoleOption } from '../data/careerRolesData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  pageView: ActivePageView;
  setPageView: (view: ActivePageView) => void;
  selectedAuthRole: AuthRole;
  setSelectedAuthRole: (role: AuthRole) => void;
  isGetStartedModalOpen: boolean;
  setIsGetStartedModalOpen: (open: boolean) => void;
  navigateToRole: (role: AuthRole) => void;
  loginUser: (role: AuthRole, email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  registerUser: (role: AuthRole, data: any) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentProfile: StudentProfile;
  setStudentProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  academicianProfile?: any;
  setAcademicianProfile?: React.Dispatch<React.SetStateAction<any>>;
  opportunities: Opportunity[];
  applications: ApplicationTrackerItem[];
  learningPrograms: LearningProgram[];
  notifications: NotificationItem[];
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (opp: Opportunity | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isMessagesOpen: boolean;
  setIsMessagesOpen: (open: boolean) => void;
  isPhoneCallOpen: boolean;
  setIsPhoneCallOpen: (open: boolean) => void;
  activeCallContact: {
    name: string;
    role: string;
    avatar: string;
    phone?: string;
    company?: string;
  } | null;
  setActiveCallContact: (contact: {
    name: string;
    role: string;
    avatar: string;
    phone?: string;
    company?: string;
  } | null) => void;
  startPhoneCall: (contact?: {
    name: string;
    role: string;
    avatar: string;
    phone?: string;
    company?: string;
  }) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingGuideOpen: boolean;
  setIsOnboardingGuideOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  assessmentScores: {
    completed: boolean;
    technical: number;
    soft: number;
    overall: number;
    categoryScores?: Record<string, number>;
  };
  setAssessmentScores: React.Dispatch<React.SetStateAction<{
    completed: boolean;
    technical: number;
    soft: number;
    overall: number;
    categoryScores?: Record<string, number>;
  }>>;
  shortlistedCandidates: string[];
  toggleShortlistCandidate: (id: string) => void;
  toggleSaveOpportunity: (id: string) => void;
  applyToOpportunity: (opportunity: Opportunity) => void;
  enrollInProgram: (programId: string) => void;
  publishProgram: (programData: Partial<LearningProgram>) => Promise<{ success: boolean; message: string; program?: LearningProgram }>;
  updateOpportunityStatus: (id: string, status: 'Active' | 'Closed' | 'Draft' | 'Archived', closedReason?: string) => Promise<{ success: boolean; message: string }>;
  updateProgramStatus: (id: string, status: 'Live & Accepting' | 'Upcoming' | 'Closed' | 'Archived', closedReason?: string) => Promise<{ success: boolean; message: string }>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendMessage: (conversationId: string, text: string, attachment?: { name: string; size: string; url: string }) => void;
  triggerConfetti: () => void;
  refreshData: () => Promise<void>;
  certificates: VerifiedCertificate[];
  gapSkills: string[];
  verifiedSkillNames: string[];
  allStudentSkills: string[];
  uploadSkillCertificate: (skillName: string, fileName: string, fileDataUrl?: string, mimeType?: string) => void;
  removeSkillCertificate: (certId: string) => void;
  addGapSkill: (skillName: string) => void;
  removeGapSkill: (skillName: string) => void;
  selectedCareerRoleId: string;
  setSelectedCareerRoleId: (roleId: string) => void;
  activeCareerRole: CareerRoleOption;
  roleRequiredSkills: string[];
  skillsWeHave: string[];
  getOpportunityMatch: (opportunity: Opportunity) => SkillMatchResult;
  internshipCertificates: InternshipCertificateItem[];
  addInternshipCertificate: (item: InternshipCertificateItem) => void;
  verifiedSkills: VerifiedSkillItem[];
  addVerifiedSkill: (skill: VerifiedSkillItem) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to generate a 10-digit unique student ID starting with # (e.g. #8492019482)
export const generateUniqueStudentId = (): string => {
  const min = 1000000000;
  const max = 9999999999;
  const num = Math.floor(min + Math.random() * (max - min + 1));
  return `#${num}`;
};

const BASE_STUDENT_SKILLS: string[] = [];
const createTimestampToken = (prefix: string) => `${prefix}-${Date.now()}`;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('landing');
  const [pageView, setPageViewState] = useState<ActivePageView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['students', 'industries', 'institutions', 'login', 'register', 'forgot-password'].includes(hash)) {
        return hash as ActivePageView;
      }
      if (hash === 'opportunities') return 'opportunities';
      if (hash === 'assessment') return 'assessment';
    }
    return 'landing';
  });
  const [selectedAuthRole, setSelectedAuthRole] = useState<AuthRole>('student');
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('career_sync_student_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.studentId || !parsed.studentId.startsWith('#') || parsed.studentId.length !== 11) {
            parsed.studentId = generateUniqueStudentId();
          }
          if (parsed.name === 'Ananya Rao') {
            parsed.name = 'Student';
          }
          if (parsed.cgpa === 8.92) {
            parsed.cgpa = 0;
          }
          if (parsed.industryReadinessScore === 88 || parsed.industryReadinessScore === 92) {
            parsed.industryReadinessScore = 0;
          }
          if (parsed.isVerified) {
            parsed.isVerified = false;
          }
          if (parsed.overallSkillScore === undefined || parsed.overallSkillScore === 84) {
            parsed.overallSkillScore = 0;
          }
          if (parsed.technicalSkillScore === undefined || parsed.technicalSkillScore === 82) {
            parsed.technicalSkillScore = 0;
          }
          if (parsed.softSkillScore === undefined || parsed.softSkillScore === 86) {
            parsed.softSkillScore = 0;
          }
          if (parsed.industryReadinessScore === undefined) {
            parsed.industryReadinessScore = 0;
          }
          return parsed;
        } catch (e) {
          // fallback to defaults
        }
      }
    }
    return {
      ...mockStudentProfile,
      studentId: mockStudentProfile.studentId || '#8492019482'
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && studentProfile) {
      localStorage.setItem('career_sync_student_profile', JSON.stringify(studentProfile));
    }
  }, [studentProfile]);
  const [academicianProfile, setAcademicianProfile] = useState<any>(mockAcademicianProfile);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>(mockApplications);
  const [learningPrograms, setLearningPrograms] = useState<LearningProgram[]>(mockLearningPrograms);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  
  // UI Dialog States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isPhoneCallOpen, setIsPhoneCallOpen] = useState(false);
  const [activeCallContact, setActiveCallContact] = useState<{
    name: string;
    role: string;
    avatar: string;
    phone?: string;
    company?: string;
  } | null>({
    name: 'Priya Sen',
    role: 'University Talent Acquisition @ TechNova',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    company: 'TechNova'
  });

  const startPhoneCall = (contact?: {
    name: string;
    role: string;
    avatar: string;
    phone?: string;
    company?: string;
  }) => {
    if (contact) {
      setActiveCallContact(contact);
    } else if (!activeCallContact) {
      setActiveCallContact({
        name: 'Priya Sen',
        role: 'University Talent Acquisition @ TechNova',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98765 43210',
        company: 'TechNova'
      });
    }
    setIsPhoneCallOpen(true);
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingGuideOpen, setIsOnboardingGuideOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Recruiter & Shortlist State
  const [shortlistedCandidates, setShortlistedCandidates] = useState<string[]>(['cand-01']);
  
  // Skill assessment completion state
  const [assessmentScores, setAssessmentScores] = useState<{
    completed: boolean;
    technical: number;
    soft: number;
    overall: number;
    categoryScores?: Record<string, number>;
  }>({
    completed: false,
    technical: 0,
    soft: 0,
    overall: 0,
    categoryScores: {}
  });

  // Certificate & Skill Gap State
  const [certificates, setCertificates] = useState<VerifiedCertificate[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careersync_certificates');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  // Persist certificates
  useEffect(() => {
    try {
      localStorage.setItem('careersync_certificates', JSON.stringify(certificates));
    } catch (e) {}
  }, [certificates]);

  // Verified Skills State (Base certified skills + custom added + uploaded)
  const [verifiedSkills, setVerifiedSkills] = useState<VerifiedSkillItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careersync_verified_skills');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('careersync_verified_skills', JSON.stringify(verifiedSkills));
    } catch (e) {}
  }, [verifiedSkills]);

  const addVerifiedSkill = useCallback((skill: VerifiedSkillItem) => {
    setVerifiedSkills(prev => {
      const exists = prev.some(s => s.name.toLowerCase() === skill.name.toLowerCase());
      if (exists) {
        return prev.map(s => s.name.toLowerCase() === skill.name.toLowerCase() ? skill : s);
      }
      return [skill, ...prev];
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }, []);

  // Selected Career Role State - dynamically synchronized across Roadmap, Jobs, Internships, and Skill Profile
  const [selectedCareerRoleId, setSelectedCareerRoleIdState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careersync_selected_career_role');
      if (saved) return saved;
    }
    return 'fullstack-engineer';
  });

  const setSelectedCareerRoleId = useCallback((roleId: string) => {
    setSelectedCareerRoleIdState(roleId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('careersync_selected_career_role', roleId);
    }
  }, []);

  // Active Career Role Object derived from CAREER_ROLE_OPTIONS
  const activeCareerRole = useMemo<CareerRoleOption>(() => {
    return CAREER_ROLE_OPTIONS.find(r => r.id === selectedCareerRoleId) || CAREER_ROLE_OPTIONS[0];
  }, [selectedCareerRoleId]);

  // All unique skills required by this specific career role (core skills + milestone skills)
  const roleRequiredSkills = useMemo<string[]>(() => {
    const combined = [
      ...activeCareerRole.keySkills,
      ...activeCareerRole.milestones.flatMap(m => m.requiredSkills)
    ];
    return Array.from(new Set(combined));
  }, [activeCareerRole]);

  const verifiedSkillNames = useMemo(() => certificates.map(c => c.skillName), [certificates]);

  // All skills the student currently has (base + certificates + verifiedSkills)
  const skillsWeHave = useMemo<string[]>(() => {
    const certSkills = certificates.map(c => c.skillName);
    const vSkills = verifiedSkills.map(s => s.name);
    return Array.from(new Set([...BASE_STUDENT_SKILLS, ...certSkills, ...vSkills]));
  }, [certificates, verifiedSkills]);

  const allStudentSkills = skillsWeHave;

  // Helper to check if a required skill is possessed by the student
  const isSkillPossessed = useCallback((reqSkill: string) => {
    return skillsWeHave.some(ourSkill =>
      ourSkill.toLowerCase() === reqSkill.toLowerCase() ||
      isSkillEquivalent(reqSkill, ourSkill)
    );
  }, [skillsWeHave]);

  // Dismissed and custom gap skills state
  const [dismissedGapSkills, setDismissedGapSkills] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careersync_dismissed_gap_skills');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  const [customGapSkills, setCustomGapSkills] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careersync_custom_gap_skills');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('careersync_dismissed_gap_skills', JSON.stringify(dismissedGapSkills));
    } catch (e) {}
  }, [dismissedGapSkills]);

  useEffect(() => {
    try {
      localStorage.setItem('careersync_custom_gap_skills', JSON.stringify(customGapSkills));
    } catch (e) {}
  }, [customGapSkills]);

  // Identified Skill Gaps: STRICTLY based on the active career role!
  // Calculated by comparing skills we have and skills that career role required.
  const gapSkills = useMemo<string[]>(() => {
    // 1. Skills the career role requires that the student does NOT possess
    const roleGaps = roleRequiredSkills.filter(reqSkill => !isSkillPossessed(reqSkill));

    // 2. Filter out dismissed gaps
    const filteredRoleGaps = roleGaps.filter(
      s => !dismissedGapSkills.some(d => d.toLowerCase() === s.toLowerCase())
    );

    // 3. User-added custom gaps that are not yet possessed
    const filteredCustomGaps = customGapSkills.filter(
      s => !isSkillPossessed(s) && !dismissedGapSkills.some(d => d.toLowerCase() === s.toLowerCase())
    );

    return Array.from(new Set([...filteredRoleGaps, ...filteredCustomGaps]));
  }, [roleRequiredSkills, isSkillPossessed, dismissedGapSkills, customGapSkills]);

  const addGapSkill = useCallback((skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    setCustomGapSkills(prev => Array.from(new Set([...prev, trimmed])));
    setDismissedGapSkills(prev => prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase()));
  }, []);

  const removeGapSkill = useCallback((skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    setDismissedGapSkills(prev => Array.from(new Set([...prev, trimmed.toLowerCase()])));
    setCustomGapSkills(prev => prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase()));
  }, []);

  const uploadSkillCertificate = useCallback((
    skillName: string,
    fileName: string,
    fileDataUrl?: string,
    mimeType?: string
  ) => {
    const newCert: VerifiedCertificate = {
      id: `cert-${Date.now()}`,
      skillName,
      fileName,
      fileDataUrl,
      mimeType: mimeType || (fileName.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
      uploadedAt: 'Today',
      issuer: 'Verified Upload Proof'
    };

    setCertificates(prev => {
      const filtered = prev.filter(c => c.skillName.toLowerCase() !== skillName.toLowerCase());
      return [newCert, ...filtered];
    });

    // Also update verifiedSkills
    setVerifiedSkills(prev => {
      const exists = prev.some(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (exists) {
        return prev.map(s => s.name.toLowerCase() === skillName.toLowerCase() ? {
          ...s,
          fileName,
          fileDataUrl,
          issuer: 'Verified Upload Proof'
        } : s);
      }
      return [
        {
          id: `vsk-${Date.now()}`,
          name: skillName,
          category: 'Technical',
          score: 88,
          level: 'Advanced',
          sourceDescription: 'Uploaded Credential Proof',
          issuer: 'Verified Credential Issuer',
          fileName,
          fileDataUrl,
          recruiterImpact: 'High'
        },
        ...prev
      ];
    });

    // Clear custom gap skill if present
    setCustomGapSkills(prev => prev.filter(s => s.toLowerCase() !== skillName.toLowerCase()));

    // Dynamically boost technical and overall score
    setStudentProfile(prev => ({
      ...prev,
      overallSkillScore: Math.min(99, prev.overallSkillScore + 3),
      technicalSkillScore: Math.min(99, prev.technicalSkillScore + 4)
    }));

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }, []);

  const removeSkillCertificate = useCallback((certId: string) => {
    setCertificates(prev => {
      const cert = prev.find(c => c.id === certId);
      if (cert) {
        // If it was dismissed before, un-dismiss so it surfaces back into gap skills for the career role!
        setDismissedGapSkills(d => d.filter(s => s.toLowerCase() !== cert.skillName.toLowerCase()));
      }
      return prev.filter(c => c.id !== certId);
    });
  }, []);

  // Certified Internships State
  const [internshipCertificates, setInternshipCertificates] = useState<InternshipCertificateItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careersync_internship_certificates');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('careersync_internship_certificates', JSON.stringify(internshipCertificates));
    } catch (e) {}
  }, [internshipCertificates]);

  const addInternshipCertificate = useCallback((item: InternshipCertificateItem) => {
    setInternshipCertificates(prev => [item, ...prev]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  }, []);

  // Accurate Match Calculation function for any opportunity
  const getOpportunityMatch = useCallback((opportunity: Opportunity): SkillMatchResult => {
    return calculateAccurateMatch(
      opportunity.requiredSkills || [],
      opportunity.preferredSkills || [],
      skillsWeHave,
      verifiedSkillNames
    );
  }, [skillsWeHave, verifiedSkillNames]);

  // Function to load all live data from backend

  const refreshData = useCallback(async () => {
    try {
      const [opps, apps, prof, notifs, convs, progs, assess] = await Promise.allSettled([
        api.opportunities.getAll(),
        api.applications.getAll(),
        api.students.getProfile(),
        api.common.getNotifications(),
        api.common.getConversations(),
        api.common.getPrograms(),
        api.students.getAssessment()
      ]);

      if (opps.status === 'fulfilled' && opps.value) setOpportunities(opps.value);
      if (apps.status === 'fulfilled' && apps.value) setApplications(apps.value);
      if (prof.status === 'fulfilled' && prof.value) setStudentProfile(prof.value);
      if (notifs.status === 'fulfilled' && notifs.value) setNotifications(notifs.value);
      if (convs.status === 'fulfilled' && convs.value) setConversations(convs.value);
      if (progs.status === 'fulfilled' && progs.value) setLearningPrograms(progs.value);
      if (assess.status === 'fulfilled' && assess.value) {
        setAssessmentScores(assess.value);
      }
    } catch (err) {
      console.warn('Could not sync all endpoints from backend, relying on local state cache:', err);
    }
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    refreshData();

    // Check if user was previously logged in
    const stored = getStoredUser();
    if (stored && stored.role) {
      // Optional: restore role if user visits portal
      if (window.location.hash.startsWith('#/student') || window.location.hash.startsWith('#/industry') || window.location.hash.startsWith('#/institution')) {
        setRoleState(stored.role);
        setPageViewState('portal');
      }
    }
  }, [refreshData]);

  // Sync hash with pageView
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['login', 'register', 'forgot-password', 'students', 'industries', 'institutions', 'opportunities', 'assessment'].includes(hash)) {
        setPageViewState(hash as ActivePageView);
        setRoleState('landing');
      } else if (hash === '' || hash === 'landing') {
        setPageViewState('landing');
        setRoleState('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setPageView = (view: ActivePageView) => {
    setPageViewState(view);
    if (view === 'landing') {
      setRoleState('landing');
      window.location.hash = '';
    } else if (view === 'portal') {
      window.location.hash = `#/${role}`;
    } else {
      window.location.hash = `#/${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToRole = (authRole: AuthRole) => {
    setRoleState(authRole);
    setPageViewState('portal');
    setActiveTab('dashboard');
    window.location.hash = `#/${authRole}/dashboard`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = async (authRole: AuthRole, email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.auth.login(authRole, email, pass);
      if (res && res.success) {
        // Clear old cached profile so that the fresh authenticated profile is loaded
        if (typeof window !== 'undefined') {
          localStorage.removeItem('career_sync_student_profile');
        }
        navigateToRole(authRole);
        triggerConfetti();
        try { await refreshData(); } catch {}
        return { success: true, message: res.message || 'Welcome back! Redirecting to your dashboard…' };
      }
      return { success: false, message: res?.message || 'Invalid email or password.' };
    } catch (err: any) {
      const errorMsg = err?.message || 'Invalid email or password.';
      console.warn('Authentication rejected:', errorMsg);

      // Only if the server is physically offline (network error), check STRICT matching demo credentials
      const isNetworkError = errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError');
      if (isNetworkError) {
        const normalizedEmail = email.toLowerCase().trim();
        const isDemoStudent = authRole === 'student' && normalizedEmail === 'student@careersync.com' && pass === 'student123';
        const isDemoIndustry = authRole === 'industry' && normalizedEmail === 'industry@careersync.com' && pass === 'industry123';
        const isDemoInstitution = authRole === 'institution' && normalizedEmail === 'institution@careersync.com' && pass === 'admin123';

        if (isDemoStudent || isDemoIndustry || isDemoInstitution) {
          setStoredAuth(createTimestampToken('demo-token'), {
            id: `usr-${authRole}-1`,
            email: normalizedEmail,
            role: authRole,
            name: authRole === 'student' ? 'Student' : authRole === 'industry' ? 'Vikramaditya Sen' : 'Dr. Ramesh Sharma'
          });
          navigateToRole(authRole);
          triggerConfetti();
          return { success: true, message: 'Signed in via demo credentials.' };
        }
      }

      return { success: false, message: errorMsg };
    }
  };

  const registerUser = async (authRole: AuthRole, data: any): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.auth.register(authRole, data);
      if (res && res.success) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('career_sync_student_profile');
        }
        if (authRole === 'student') {
          const uniqueId = generateUniqueStudentId();
          setStudentProfile({
            id: createTimestampToken('std'),
            studentId: uniqueId,
            name: data.fullName || 'Student',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            email: data.email || '',
            phone: data.mobile || '',
            college: data.college || 'Apex Institute of Technology, Bangalore',
            degree: data.degree || 'Bachelor of Technology (B.Tech)',
            department: data.department || 'Computer Science & Engineering',
            graduationYear: parseInt(data.graduationYear) || 2026,
            location: data.location || '',
            bio: '',
            cgpa: 0,
            profileCompletion: 20,
            overallSkillScore: 0,
            technicalSkillScore: 0,
            softSkillScore: 0,
            industryReadinessScore: 0,
            isVerified: false,
            careerInterests: [],
            preferredJobRoles: [],
            preferredIndustries: [],
            resumeUrl: '',
            socials: { github: '', linkedin: '', portfolio: '' }
          });
          setCertificates([]);
          setInternshipCertificates([]);
          setApplications([]);
          setAssessmentScores({
            completed: false,
            technical: 0,
            soft: 0,
            overall: 0,
            categoryScores: {}
          });
          // Predefined user-friendly instructions modal automatically appears for newly registered accounts
          setIsOnboardingGuideOpen(true);
        }
        navigateToRole(authRole);
        triggerConfetti();
        try { await refreshData(); } catch {}
        return { success: true, message: res.message || 'Account created successfully!' };
      }
      return { success: false, message: res?.message || 'Registration failed' };
    } catch (err: any) {
      const errorMsg = err?.message || 'Registration failed. Please check the details and try again.';
      console.warn('Registration rejected:', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logoutUser = () => {
    api.auth.logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('career_sync_student_profile');
      localStorage.removeItem('careersync_certificates');
      localStorage.removeItem('careersync_verified_skills');
      localStorage.removeItem('careersync_internship_certificates');
      localStorage.removeItem('careersync_custom_gap_skills');
      localStorage.removeItem('careersync_dismissed_gap_skills');
    }
    setCertificates([]);
    setVerifiedSkills([]);
    setInternshipCertificates([]);
    setApplications([]);
    setAssessmentScores({
      completed: false,
      technical: 0,
      soft: 0,
      overall: 0,
      categoryScores: {}
    });
    setStudentProfile(mockStudentProfile);
    setRoleState('landing');
    setPageViewState('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas not supported
    }
  };

  const toggleSaveOpportunity = async (id: string) => {
    // Optimistic UI update
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === id ? { ...opp, isSaved: !opp.isSaved } : opp
      )
    );
    try {
      await api.opportunities.toggleSave(id);
    } catch (err) {
      console.error('Failed to toggle save opportunity:', err);
    }
  };

  const applyToOpportunity = async (opportunity: Opportunity) => {
    // Optimistic UI update
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === opportunity.id ? { ...opp, appliedStatus: 'applied' } : opp
      )
    );

    try {
      await api.applications.apply(opportunity.id);
      const updatedApps = await api.applications.getAll();
      setApplications(updatedApps);
      const updatedNotifs = await api.common.getNotifications();
      setNotifications(updatedNotifs);
      triggerConfetti();
    } catch (err: any) {
      console.error('Failed to submit application to backend:', err);
    }
  };

  const enrollInProgram = async (programId: string) => {
    setLearningPrograms(prev =>
      prev.map(prog =>
        prog.id === programId ? { ...prog, isEnrolled: true, enrolledCount: prog.enrolledCount + 1 } : prog
      )
    );
    try {
      await api.common.enrollProgram(programId);
      triggerConfetti();
    } catch (err) {
      console.error('Failed to enroll in program:', err);
    }
  };

  const publishProgram = async (programData: Partial<LearningProgram>): Promise<{ success: boolean; message: string; program?: LearningProgram }> => {
    try {
      const res = await api.common.createProgram(programData);
      if (res && res.success && res.program) {
        setLearningPrograms(prev => [res.program, ...prev]);
        triggerConfetti();
        try {
          const updatedNotifs = await api.common.getNotifications();
          setNotifications(updatedNotifs);
        } catch {}
        return { success: true, message: res.message, program: res.program };
      }
      return { success: false, message: res?.message || 'Could not publish program.' };
    } catch (err: any) {
      // Optimistic fallback for local preview
      const fallbackProgram: LearningProgram = {
        id: `lp-${Date.now()}`,
        title: programData.title || 'Untitled Program',
        category: (programData.category as any) || 'Bootcamp',
        provider: programData.provider || 'TechNova Corporate Academy',
        logo: programData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        duration: programData.duration || '4 Weeks',
        level: programData.level || 'Intermediate',
        skillsGained: programData.skillsGained || [],
        hasCertification: programData.hasCertification !== false,
        rating: 4.9,
        enrolledCount: 0,
        deadline: programData.deadline || 'Open Enrolment',
        description: programData.description || '',
        mode: programData.mode || 'Live Online',
        eligibleBranches: programData.eligibleBranches || ['Computer Science & Engineering'],
        requirements: programData.requirements || [],
        prerequisites: programData.prerequisites || '',
        maxSeats: programData.maxSeats || 100,
        status: programData.status || 'Live & Accepting',
        hiringAdvantage: programData.hiringAdvantage || '',
        stipendOrCost: programData.stipendOrCost || 'Free Sponsored Access',
        isEnrolled: false
      };
      setLearningPrograms(prev => [fallbackProgram, ...prev]);
      triggerConfetti();
      return { success: true, message: 'Program published locally!', program: fallbackProgram };
    }
  };

  const updateOpportunityStatus = async (
    id: string,
    status: 'Active' | 'Closed' | 'Draft' | 'Archived',
    closedReason?: string
  ): Promise<{ success: boolean; message: string }> => {
    const isClosed = status === 'Closed' || status === 'Archived';
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === id
          ? {
              ...opp,
              status,
              isClosed,
              closedReason: closedReason || opp.closedReason,
              closedAt: isClosed ? new Date().toISOString() : undefined
            }
          : opp
      )
    );

    // If active modal is open with this opportunity, update it too
    setSelectedOpportunity(prev =>
      prev && prev.id === id
        ? {
            ...prev,
            status,
            isClosed,
            closedReason: closedReason || prev.closedReason,
            closedAt: isClosed ? new Date().toISOString() : undefined
          }
        : prev
    );

    try {
      const res = await api.opportunities.updateStatus(id, status, closedReason);
      try { await refreshData(); } catch {}
      return { success: true, message: res.message || `Opportunity updated to ${status}!` };
    } catch (err: any) {
      console.warn('Backend update failed, kept local state:', err);
      return { success: true, message: `Opportunity status updated locally to "${status}"!` };
    }
  };

  const updateProgramStatus = async (
    id: string,
    status: 'Live & Accepting' | 'Upcoming' | 'Closed' | 'Archived',
    closedReason?: string
  ): Promise<{ success: boolean; message: string }> => {
    const isClosed = status === 'Closed' || status === 'Archived';
    setLearningPrograms(prev =>
      prev.map(prog =>
        prog.id === id
          ? {
              ...prog,
              status,
              isClosed,
              closedReason: closedReason || prog.closedReason,
              closedAt: isClosed ? new Date().toISOString() : undefined
            }
          : prog
      )
    );

    try {
      const res = await api.common.updateProgramStatus(id, status, closedReason);
      try { await refreshData(); } catch {}
      return { success: true, message: res.message || `Program updated to ${status}!` };
    } catch (err: any) {
      console.warn('Backend update failed, kept local state:', err);
      return { success: true, message: `Program status updated locally to "${status}"!` };
    }
  };

  const toggleShortlistCandidate = async (id: string) => {
    setShortlistedCandidates(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
    try {
      await api.students.toggleShortlist(id);
    } catch (err) {
      console.error('Failed to toggle candidate shortlist:', err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await api.common.markNotificationRead(id);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await api.common.markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const getContextualReply = (contactName: string, _contactRole: string, userText: string): string => {
    const lower = userText.toLowerCase();
    if (lower.includes('interview') || lower.includes('round') || lower.includes('schedule')) {
      return `Hi Surya! Glad you reached out. For the technical rounds, we focus heavily on algorithmic problem solving, core CS fundamentals, and your capstone project architecture. Let's make sure you're ready!`;
    }
    if (lower.includes('resume') || lower.includes('cv') || lower.includes('portfolio')) {
      return `I've reviewed your CareerSync digital portfolio and resume! Your verified skills and capstone projects stand out. I'd be happy to do a quick 10-minute audio consultation to polish your talking points.`;
    }
    if (lower.includes('call') || lower.includes('phone') || lower.includes('voice') || lower.includes('talk')) {
      return `Absolutely! You can hit the Phone icon in the top header or right here in our conversation to connect directly on a secure voice consultation.`;
    }
    if (lower.includes('skill') || lower.includes('gap') || lower.includes('course')) {
      return `That's a great initiative! Bridging skill gaps with our accredited online courses directly boosts your placement score. Let me know if you want targeted recommendations for top product companies.`;
    }
    if (lower.includes('intern') || lower.includes('job') || lower.includes('offer') || lower.includes('role')) {
      return `We are currently shortlisting high-match candidates for the upcoming campus recruitment drives. Your current readiness profile puts you in a strong tier!`;
    }
    return `Hello Surya! Thanks for connecting. I've noted this down and will keep you updated. Feel free to initiate a direct voice call if you need urgent guidance!`;
  };

  const sendMessage = async (
    conversationId: string,
    text: string,
    attachment?: { name: string; size: string; url: string }
  ) => {
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'std-101',
      senderName: studentProfile?.name || 'Surya',
      senderAvatar: studentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      receiverId: 'fac-202',
      content: trimmed || (attachment ? `Shared attachment: ${attachment.name}` : ''),
      timestamp: 'Just now',
      attachment,
      isRead: true
    };

    // 1. Optimistically append message immediately in local state
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: userMessage.content,
            lastMessageTime: 'Just now',
            messages: [...conv.messages, userMessage]
          };
        }
        return conv;
      })
    );

    // 2. Simulate smart contact response after 1.2 seconds
    setTimeout(() => {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId) {
            const replyContent = getContextualReply(conv.contactName, conv.contactRole, trimmed);
            const replyMsg = {
              id: `reply-${Date.now()}`,
              senderId: conv.contactType === 'recruiter' ? 'rec-1' : 'fac-1',
              senderName: conv.contactName,
              senderAvatar: conv.contactAvatar,
              receiverId: 'std-101',
              content: replyContent,
              timestamp: 'Just now',
              isRead: false
            };
            return {
              ...conv,
              lastMessage: replyContent,
              lastMessageTime: 'Just now',
              unreadCount: (conv.unreadCount || 0) + 1,
              messages: [...conv.messages, replyMsg]
            };
          }
          return conv;
        })
      );
    }, 1200);

    // 3. Optional background API sync (silently handled if offline)
    try {
      await api.common.sendMessage(conversationId, trimmed);
    } catch {
      // Offline fallback: local state already updated
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        pageView,
        setPageView,
        selectedAuthRole,
        setSelectedAuthRole,
        isGetStartedModalOpen,
        setIsGetStartedModalOpen,
        navigateToRole,
        loginUser,
        registerUser,
        logoutUser,
        activeTab,
        setActiveTab,
        studentProfile,
        setStudentProfile,
        academicianProfile,
        setAcademicianProfile,
        opportunities,
        applications,
        learningPrograms,
        notifications,
        conversations,
        activeConversationId,
        setActiveConversationId,
        selectedOpportunity,
        setSelectedOpportunity,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isMessagesOpen,
        setIsMessagesOpen,
        isPhoneCallOpen,
        setIsPhoneCallOpen,
        activeCallContact,
        setActiveCallContact,
        startPhoneCall,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingGuideOpen,
        setIsOnboardingGuideOpen,
        authMode,
        setAuthMode,
        assessmentScores,
        setAssessmentScores,
        shortlistedCandidates,
        toggleShortlistCandidate,
        toggleSaveOpportunity,
        applyToOpportunity,
        enrollInProgram,
        publishProgram,
        updateOpportunityStatus,
        updateProgramStatus,
        markNotificationAsRead,
        markAllNotificationsRead,
        sendMessage,
        triggerConfetti,
        refreshData,
        certificates,
        gapSkills,
        verifiedSkillNames,
        allStudentSkills,
        uploadSkillCertificate,
        removeSkillCertificate,
        addGapSkill,
        removeGapSkill,
        selectedCareerRoleId,
        setSelectedCareerRoleId,
        activeCareerRole,
        roleRequiredSkills,
        skillsWeHave,
        getOpportunityMatch,
        internshipCertificates,
        addInternshipCertificate,
        verifiedSkills,
        addVerifiedSkill
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    return {
      role: 'landing' as UserRole,
      setRole: () => {},
      pageView: 'landing' as ActivePageView,
      setPageView: () => {},
      selectedAuthRole: 'student' as AuthRole,
      setSelectedAuthRole: () => {},
      isGetStartedModalOpen: false,
      setIsGetStartedModalOpen: () => {},
      navigateToRole: () => {},
      loginUser: async () => ({ success: false, message: '' }),
      registerUser: async () => ({ success: false, message: '' }),
      logoutUser: () => {},
      activeTab: 'dashboard',
      setActiveTab: () => {},
      studentProfile: mockStudentProfile,
      setStudentProfile: () => {},
      academicianProfile: mockAcademicianProfile,
      setAcademicianProfile: () => {},
      opportunities: mockOpportunities,
      applications: mockApplications,
      learningPrograms: mockLearningPrograms,
      notifications: mockNotifications,
      conversations: mockConversations,
      activeConversationId: 'conv-1',
      setActiveConversationId: () => {},
      selectedOpportunity: null,
      setSelectedOpportunity: () => {},
      isSearchOpen: false,
      setIsSearchOpen: () => {},
      isNotificationsOpen: false,
      setIsNotificationsOpen: () => {},
      isMessagesOpen: false,
      setIsMessagesOpen: () => {},
      isPhoneCallOpen: false,
      setIsPhoneCallOpen: () => {},
      activeCallContact: null,
      setActiveCallContact: () => {},
      startPhoneCall: () => {},
      isAuthModalOpen: false,
      setIsAuthModalOpen: () => {},
      isOnboardingGuideOpen: false,
      setIsOnboardingGuideOpen: () => {},
      authMode: 'login' as const,
      setAuthMode: () => {},
      assessmentScores: {
        completed: true,
        technical: 82,
        soft: 86,
        overall: 84,
        categoryScores: {
          'Programming': 85,
          'Data & AI': 80,
          'Problem Solving': 88,
          'Communication': 84,
          'Leadership': 82
        }
      },
      setAssessmentScores: () => {},
      shortlistedCandidates: [] as string[],
      toggleShortlistCandidate: () => {},
      toggleSaveOpportunity: () => {},
      applyToOpportunity: () => {},
      enrollInProgram: () => {},
      publishProgram: async () => ({ success: true, message: 'Published' }),
      updateOpportunityStatus: async () => ({ success: true, message: 'Updated' }),
      updateProgramStatus: async () => ({ success: true, message: 'Updated' }),
      markNotificationAsRead: () => {},
      markAllNotificationsRead: () => {},
      sendMessage: () => {},
      triggerConfetti: () => {},
      refreshData: async () => {},
      certificates: [],
      gapSkills: [],
      verifiedSkillNames: [],
      allStudentSkills: [],
      uploadSkillCertificate: () => {},
      removeSkillCertificate: () => {},
      addGapSkill: () => {},
      removeGapSkill: () => {},
      selectedCareerRoleId: 'fullstack-engineer',
      setSelectedCareerRoleId: () => {},
      activeCareerRole: CAREER_ROLE_OPTIONS[0],
      roleRequiredSkills: [],
      skillsWeHave: [],
      getOpportunityMatch: (opp: Opportunity): SkillMatchResult => ({
        matchPercentage: opp.matchPercentage,
        matchedSkills: opp.requiredSkills,
        missingSkills: [],
        verifiedMatches: [],
        totalRequired: opp.requiredSkills.length
      }),
      internshipCertificates: [],
      addInternshipCertificate: () => {},
      verifiedSkills: [],
      addVerifiedSkill: () => {}
    };
  }
  return context;
};

