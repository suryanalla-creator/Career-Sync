import {
  Opportunity,
  ApplicationTrackerItem,
  StudentProfile,
  Candidate,
  LearningProgram,
  EventItem,
  NotificationItem,
  Conversation,
  AuthRole,
  InternshipRecord,
  VerificationReport,
  CertificationItem
} from '../types';

const TOKEN_KEY = 'careersync_auth_token';
const USER_KEY = 'careersync_user';

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredAuth = (token: string, user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(USER_KEY);
  return val ? JSON.parse(val) : null;
};

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: async (role: AuthRole, email: string, pass: string) => {
      const data = await request<{ success: boolean; token: string; user: any; message: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ role, email, password: pass })
      });
      if (data.token && data.user) {
        setStoredAuth(data.token, data.user);
      }
      return data;
    },
    register: async (role: AuthRole, payload: any) => {
      const data = await request<{ success: boolean; token: string; user: any; message: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ role, ...payload })
      });
      if (data.token && data.user) {
        setStoredAuth(data.token, data.user);
      }
      return data;
    },
    me: async () => {
      return request<{ user: any }>('/api/auth/me');
    },
    forgotPassword: async (email: string) => {
      return request<{ success: boolean; message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },
    logout: () => {
      clearStoredAuth();
    }
  },

  // Opportunities
  opportunities: {
    getAll: async (params?: { type?: string; search?: string; workMode?: string }) => {
      const query = new URLSearchParams();
      if (params?.type) query.set('type', params.type);
      if (params?.search) query.set('search', params.search);
      if (params?.workMode) query.set('workMode', params.workMode);
      const res = await request<{ opportunities: Opportunity[] }>(`/api/opportunities?${query.toString()}`);
      return res.opportunities;
    },
    getById: async (id: string) => {
      const res = await request<{ opportunity: Opportunity }>(`/api/opportunities/${id}`);
      return res.opportunity;
    },
    create: async (oppData: Partial<Opportunity>) => {
      return request<{ success: boolean; message: string; id: string; opportunity?: Opportunity }>('/api/opportunities', {
        method: 'POST',
        body: JSON.stringify(oppData)
      });
    },
    toggleSave: async (id: string) => {
      return request<{ success: boolean; isSaved: boolean; message: string }>(`/api/opportunities/${id}/save`, {
        method: 'POST'
      });
    },
    updateStatus: async (id: string, status: 'Active' | 'Closed' | 'Draft' | 'Archived', closedReason?: string) => {
      return request<{ success: boolean; message: string; status: string; isClosed: boolean }>(`/api/opportunities/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, closedReason })
      });
    }
  },

  // Applications
  applications: {
    getAll: async (params?: { opportunityId?: string; role?: string; organization?: string }) => {
      const query = new URLSearchParams();
      if (params?.opportunityId) query.set('opportunityId', params.opportunityId);
      if (params?.role) query.set('role', params.role);
      if (params?.organization) query.set('organization', params.organization);
      const res = await request<{ applications: (ApplicationTrackerItem & {
        candidateId?: string;
        studentId?: string;
        avatar?: string;
        college?: string;
        degree?: string;
        department?: string;
        graduationYear?: number;
        cgpa?: number;
        skillScore?: number;
        matchScore?: number;
        topSkills?: string[];
        isVerified?: boolean;
      })[] }>(`/api/applications${query.toString() ? `?${query.toString()}` : ''}`);
      return res.applications;
    },
    apply: async (opportunityId: string, studentDetails?: any) => {
      return request<{ success: boolean; message: string; applicationId: string; application?: any }>('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ opportunityId, ...(studentDetails || {}) })
      });
    },
    updateStage: async (id: string, stage: string, note?: string) => {
      return request<{ success: boolean; message: string; timeline: any[] }>(`/api/applications/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage, note })
      });
    }
  },

  // Student & Recruiter Talent Pool
  students: {
    getProfile: async () => {
      const res = await request<{ profile: StudentProfile }>('/api/students/profile');
      return res.profile;
    },
    updateProfile: async (updates: Partial<StudentProfile>) => {
      return request<{ success: boolean; message: string }>('/api/students/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    getAssessment: async () => {
      const res = await request<{ assessmentScores: any }>('/api/students/assessment');
      return res.assessmentScores;
    },
    submitAssessment: async (scores: { technical: number; soft: number; overall: number; categoryScores?: Record<string, number> }) => {
      return request<{ success: boolean; message: string }>('/api/students/assessment', {
        method: 'POST',
        body: JSON.stringify(scores)
      });
    },
    getCandidates: async (params?: {
      q?: string;
      search?: string;
      studentId?: string;
      skill?: string;
      department?: string;
      minScore?: number;
      minCgpa?: number;
      degree?: string;
      graduationYear?: number | string;
      isVerified?: boolean;
      status?: string;
      sortBy?: string;
      sortOrder?: string;
      onlyApplicants?: boolean;
    }) => {
      const query = new URLSearchParams();
      if (params?.q) query.set('q', params.q);
      if (params?.search) query.set('search', params.search);
      if (params?.studentId) query.set('studentId', params.studentId);
      if (params?.skill) query.set('skill', params.skill);
      if (params?.department) query.set('department', params.department);
      if (params?.minScore) query.set('minScore', String(params.minScore));
      if (params?.minCgpa) query.set('minCgpa', String(params.minCgpa));
      if (params?.degree) query.set('degree', params.degree);
      if (params?.graduationYear) query.set('graduationYear', String(params.graduationYear));
      if (params?.isVerified !== undefined) query.set('isVerified', String(params.isVerified));
      if (params?.status) query.set('status', params.status);
      if (params?.sortBy) query.set('sortBy', params.sortBy);
      if (params?.sortOrder) query.set('sortOrder', params.sortOrder);
      if (params?.onlyApplicants) query.set('onlyApplicants', 'true');
      return request<{ candidates: Candidate[]; shortlists: string[]; totalCount?: number; totalApplicantsCount?: number }>(`/api/students/candidates?${query.toString()}`);
    },
    getCandidateDetails: async (candidateId: string) => {
      return request<{
        profile: any;
        digitalPortfolio: {
          projects: any[];
          certifications: any[];
          internships: any[];
          verifiedSkills: any[];
        };
      }>(`/api/students/candidates/${candidateId}/details`);
    },
    toggleShortlist: async (candidateId: string) => {
      return request<{ success: boolean; isShortlisted: boolean; message: string }>(`/api/students/candidates/${candidateId}/shortlist`, {
        method: 'POST'
      });
    },
    getInternships: async () => {
      const res = await request<{ internships: InternshipRecord[] }>('/api/students/internships');
      return res.internships;
    }
  },

  // Common features
  common: {
    getPrograms: async () => {
      const res = await request<{ programs: LearningProgram[] }>('/api/programs');
      return res.programs;
    },
    createProgram: async (programData: Partial<LearningProgram>) => {
      return request<{ success: boolean; message: string; program: LearningProgram }>('/api/programs', {
        method: 'POST',
        body: JSON.stringify(programData)
      });
    },
    enrollProgram: async (programId: string) => {
      return request<{ success: boolean; message: string }>(`/api/programs/${programId}/enroll`, {
        method: 'POST'
      });
    },
    completeProgram: async (id: string, details?: { studentId?: string; studentName?: string; usn?: string; department?: string }) => {
      return request<{ success: boolean; message: string; certificate?: any; credentialId?: string }>(`/api/programs/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(details || {})
      });
    },
    updateProgramStatus: async (id: string, status: 'Live & Accepting' | 'Upcoming' | 'Closed' | 'Archived', closedReason?: string) => {
      return request<{ success: boolean; message: string; status: string; isClosed: boolean }>(`/api/programs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, closedReason })
      });
    },
    getEvents: async () => {
      const res = await request<{ events: EventItem[] }>('/api/events');
      return res.events;
    },
    registerEvent: async (eventId: string) => {
      return request<{ success: boolean; message: string }>(`/api/events/${eventId}/register`, {
        method: 'POST'
      });
    },
    getNotifications: async () => {
      const res = await request<{ notifications: NotificationItem[] }>('/api/notifications');
      return res.notifications;
    },
    markNotificationRead: async (id: string) => {
      return request<{ success: boolean }>(`/api/notifications/${id}/read`, {
        method: 'PATCH'
      });
    },
    markAllNotificationsRead: async () => {
      return request<{ success: boolean }>('/api/notifications/read-all', {
        method: 'PATCH'
      });
    },
    getConversations: async () => {
      const res = await request<{ conversations: Conversation[] }>('/api/conversations');
      return res.conversations;
    },
    sendMessage: async (conversationId: string, content: string) => {
      return request<{ success: boolean; message: any }>(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
    },
    getPlacements: async () => {
      const res = await request<{ placements: any[] }>('/api/placements');
      return res.placements;
    },
    getCollaborations: async () => {
      const res = await request<{ collaborations: any[] }>('/api/collaborations');
      return res.collaborations;
    }
  },

  // Database Management & Telemetry
  db: {
    getStats: async () => {
      const res = await request<{ success: boolean; stats: any }>('/api/db/stats');
      return res.stats;
    }
  },

  projects: {
    getAll: async () => {
      const res = await request<{ projects: any[] }>('/api/students/projects');
      return res.projects;
    },
    create: async (proj: any) => {
      return request<{ success: boolean; message: string; id: string }>('/api/students/projects', {
        method: 'POST',
        body: JSON.stringify(proj)
      });
    }
  },

  certifications: {
    getAll: async (userId?: string) => {
      const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      const res = await request<{ certifications: CertificationItem[] }>(`/api/students/certifications${q}`);
      return res.certifications || [];
    },
    add: async (payload: Partial<CertificationItem>) => {
      return request<{ success: boolean; certificateId: string }>('/api/students/certifications', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    verify: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/students/certifications/${id}/verify`, {
        method: 'PATCH'
      });
    }
  },

  internships: {
    getAll: async () => {
      const res = await request<{ internships: any[] }>('/api/students/internships');
      return res.internships;
    }
  },

  // Institution & Mentee Courses Management
  courses: {
    getPrograms: async () => {
      const res = await request<{ programs: LearningProgram[] }>('/api/programs');
      return res.programs;
    },
    createProgram: async (data: Partial<LearningProgram>) => {
      return request<{ success: boolean; message: string; program: LearningProgram }>('/api/programs', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    updateStatus: async (id: string, status: 'Live & Accepting' | 'Upcoming' | 'Closed' | 'Archived', closedReason?: string) => {
      return request<{ success: boolean; message: string; status: string; isClosed: boolean; closedReason?: string }>(
        `/api/programs/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status, closedReason })
        }
      );
    },
    getMenteeEnrollments: async (params?: { courseId?: string; status?: string; studentId?: string }) => {
      const query = new URLSearchParams();
      if (params?.courseId) query.append('courseId', params.courseId);
      if (params?.status) query.append('status', params.status);
      if (params?.studentId) query.append('studentId', params.studentId);
      const url = `/api/courses/mentees${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await request<{ mentees: any[] }>(url);
      return res.mentees;
    },
    apply: async (data: {
      courseId: string;
      statementOfPurpose?: string;
      studentName?: string;
      studentEmail?: string;
      department?: string;
      usn?: string;
      cgpa?: number;
    }) => {
      return request<{ success: boolean; message: string; enrollmentId: string }>('/api/courses/apply', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    updatePermission: async (id: string, status: 'approved' | 'declined' | 'pending', mentorNotes?: string) => {
      return request<{ success: boolean; message: string; status: string; permissionDecidedAt: string }>(
        `/api/courses/mentees/${id}/permission`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status, mentorNotes })
        }
      );
    },
    updateProgress: async (
      id: string,
      data: {
        progressPercentage?: number;
        currentModule?: string;
        completedAssignments?: number;
        totalAssignments?: number;
        assessmentScore?: number;
        mentorNotes?: string;
        isCertified?: boolean;
      }
    ) => {
      return request<{ success: boolean; message: string; progressPercentage: number; isCertified: boolean }>(
        `/api/courses/mentees/${id}/progress`,
        {
          method: 'PATCH',
          body: JSON.stringify(data)
        }
      );
    },
    completeProgram: async (id: string, details?: { studentId?: string; studentName?: string; usn?: string; department?: string }) => {
      return request<{ success: boolean; message: string; certificate?: any; credentialId?: string }>(`/api/programs/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(details || {})
      });
    },
    generateTest: async (data: {
      courseId: string;
      courseTitle: string;
      category?: string;
      level?: string;
      skills?: string[];
      studentId?: string;
    }) => {
      return request<{
        success: boolean;
        sessionId: string;
        courseId: string;
        courseTitle: string;
        totalQuestions: number;
        durationMinutes: number;
        durationSeconds: number;
        maxViolations: number;
        provider: string;
        rules: {
          totalQuestions: number;
          timeLimit: string;
          fullscreenRequired: boolean;
          maxFullscreenExits: number;
          disqualificationConsequence: string;
        };
        questions: Array<{
          id: number;
          question: string;
          options: string[];
          topic: string;
          difficulty?: string;
        }>;
      }>('/api/ai/course-assessment', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    submitTest: async (data: {
      sessionId: string;
      courseId: string;
      studentId?: string;
      answers: Record<number, number>;
      violationsCount: number;
      isDisqualified?: boolean;
    }) => {
      return request<{
        success: boolean;
        isDisqualified: boolean;
        score: number;
        totalQuestions: number;
        percentage: number;
        passed: boolean;
        certificateEligible: boolean;
        violationsCount: number;
        feedback: string;
        certificate?: any;
        credentialId?: string;
      }>('/api/ai/course-assessment/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    recordViolation: async (menteeEnrollmentId: string, strikeCount: number, reason?: string) => {
      return request<{
        success: boolean;
        strikeCount: number;
        isDisqualified: boolean;
        testStatus: string;
        message: string;
      }>(`/api/courses/mentees/${menteeEnrollmentId}/record-violation`, {
        method: 'POST',
        body: JSON.stringify({ strikeCount, reason })
      });
    },
    saveProgress: async (courseId: string, data: {
      stoppedAtSeconds: number;
      progressPercentage?: number;
      currentModule?: string;
      completedModules?: Record<string, boolean>;
      studentId?: string;
    }) => {
      return request<{
        success: boolean;
        courseId: string;
        stoppedAtSeconds: number;
        progressPercentage: number;
      }>(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  },

  // Automated Certificate Verification Engine & Issuers
  certificates: {
    verify: async (payload: {
      fileName?: string;
      fileDataUrl?: string;
      mimeType?: string;
      issuer?: string;
      credentialId?: string;
      credentialUrl?: string;
      skillName?: string;
      studentName?: string;
    }) => {
      return request<{ success: boolean; report: VerificationReport }>('/api/certificates/verify', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    getTrustedIssuers: async () => {
      return request<{ success: boolean; issuers: Array<{ name: string; category: string; sampleVerificationUrl?: string }> }>('/api/certificates/trusted-issuers');
    },
    save: async (payload: any) => {
      return request<{ success: boolean; message: string; certificateId: string }>('/api/certificates/save', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  },

  // AI Engine & Question Bank Training Telemetry
  ai: {
    getTrainingStats: async () => {
      return request<{
        success: boolean;
        totalQuestions: number;
        domains: Record<string, number>;
        difficulties: Record<string, number>;
        model: string;
        hasApiKey: boolean;
        status: string;
        updatedAt: string;
      }>('/api/ai/training-stats');
    },
    trainQuestions: async () => {
      return request<{
        success: boolean;
        message: string;
        stats: any;
      }>('/api/ai/train-questions', {
        method: 'POST'
      });
    },
    getTrainedQuestions: async (params?: { domain?: string; difficulty?: string; courseTitle?: string; count?: number }) => {
      const q = new URLSearchParams();
      if (params?.domain) q.set('domain', params.domain);
      if (params?.difficulty) q.set('difficulty', params.difficulty);
      if (params?.courseTitle) q.set('courseTitle', params.courseTitle);
      if (params?.count) q.set('count', String(params.count));
      return request<{
        success: boolean;
        count: number;
        questions: any[];
      }>(`/api/ai/trained-questions?${q.toString()}`);
    }
  }
};

export const apiClient = api;
export default api;
