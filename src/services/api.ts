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
  InternshipRecord
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
      return request<{ success: boolean; message: string; id: string }>('/api/opportunities', {
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
    getAll: async () => {
      const res = await request<{ applications: ApplicationTrackerItem[] }>('/api/applications');
      return res.applications;
    },
    apply: async (opportunityId: string) => {
      return request<{ success: boolean; message: string; applicationId: string }>('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ opportunityId })
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
      return request<{ candidates: Candidate[]; shortlists: string[]; totalCount?: number }>(`/api/students/candidates?${query.toString()}`);
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
    getAll: async () => {
      const res = await request<{ certifications: any[] }>('/api/students/certifications');
      return res.certifications;
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
  }
};

export const apiClient = api;
export default api;
