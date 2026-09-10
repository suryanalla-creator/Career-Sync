export type UserRole = 'landing' | 'student' | 'industry' | 'institution';

export type ActivePageView =
  | 'landing'
  | 'students'
  | 'industries'
  | 'institutions'
  | 'opportunities'
  | 'assessment'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'portal';

export type AuthRole = 'student' | 'industry' | 'institution';

export interface StudentRegistrationData {
  fullName: string;
  email: string;
  mobile: string;
  college: string;
  degree: string;
  department: string;
  graduationYear: string;
  location: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface IndustryRegistrationData {
  companyName: string;
  officialEmail: string;
  contactPerson: string;
  designation: string;
  industrySector: string;
  companySize: string;
  location: string;
  website: string;
  password: string;
  confirmPassword: string;
}

export interface InstitutionRegistrationData {
  institutionName: string;
  institutionType: string;
  officialEmail: string;
  adminName: string;
  contactNumber: string;
  location: string;
  website: string;
  accreditationInfo: string;
  password: string;
  confirmPassword: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  organization?: string;
  isVerified?: boolean;
}

export interface StudentProfile {
  id: string;
  studentId: string; // 10-digit unique student ID started with # (e.g., #8492019482)
  name: string;
  avatar: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  department: string;
  graduationYear: number;
  location: string;
  bio: string;
  cgpa: number;
  profileCompletion: number; // e.g. 85
  careerInterests: string[];
  preferredJobRoles: string[];
  preferredIndustries: string[];
  resumeUrl: string;
  overallSkillScore: number;
  technicalSkillScore: number;
  softSkillScore: number;
  industryReadinessScore: number;
  isVerified: boolean;
  socials: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}
export type AcademicianProfile = any;
export type AcademicianRegistrationData = any;

export interface SkillCategoryScore {
  category: string;
  score: number;
  benchmark: number;
}

export interface SkillItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  score: number; // 0-100
  verified: boolean;
}

export interface SkillGapAnalysis {
  strengths: string[];
  skillsToImprove: string[];
  recommendedSkills: {
    name: string;
    importance: 'High' | 'Medium';
    demandGrowth: string;
    reason: string;
  }[];
}

export interface VerifiedCertificate {
  id: string;
  skillName: string;
  fileName: string;
  fileDataUrl?: string;
  mimeType?: string;
  uploadedAt: string;
  issuer?: string;
}

export interface VerifiedSkillItem {
  id: string;
  name: string;
  category: string;
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sourceDescription?: string;
  issuer?: string;
  credentialId?: string;
  fileName?: string;
  fileDataUrl?: string;
  recruiterImpact?: 'High' | 'Medium';
}

export interface InternshipCertificateItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  period: string;
  mentorName: string;
  mentorTitle: string;
  rating: number;
  credentialId: string;
  ledgerHash: string;
  certificatePdfName: string;
  fileDataUrl?: string;
  skillsDemonstrated: string[];
  recommendationQuote: string;
  status: 'Verified & Authenticated';
}

export interface SkillMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  verifiedMatches: string[];
  totalRequired: number;
}


export interface CareerPathNode {
  id: string;
  stepNumber: number;
  title: string;
  roleLevel: string;
  requiredSkills: string[];
  currentSkillLevel: number;
  targetSkillLevel: number;
  recommendedCourses: string[];
  recommendedCertifications: string[];
  recommendedProjects: string[];
  relevantJobRoles: string[];
  status: 'completed' | 'in-progress' | 'target';
}

export interface Opportunity {
  id: string;
  type: 'job' | 'internship' | 'fdp' | 'consultancy' | 'research' | 'project' | 'apprenticeship';
  title: string;
  organization: string;
  logo: string;
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  requiredSkills: string[];
  preferredSkills?: string[];
  salaryOrStipend: string;
  experience?: string;
  duration?: string;
  deadline: string;
  matchPercentage: number;
  description: string;
  responsibilities: string[];
  eligibility: string;
  applicantsCount: number;
  postedDate: string;
  isSaved?: boolean;
  appliedStatus?: 'applied' | 'screening' | 'shortlisted' | 'interview' | 'selected' | 'rejected' | null;
  careerRoleIds?: string[];
  targetRoles?: string[];
  eligibleBranches?: string[];
  companyDetails?: {
    size: string;
    industry: string;
    website: string;
    rating: number;
  };
  createdBy?: string;
  status?: 'Active' | 'Closed' | 'Draft' | 'Archived';
  isClosed?: boolean;
  closedReason?: string;
  closedAt?: string;
}

export interface LearningProgram {
  id: string;
  title: string;
  category: 'Course' | 'Certification' | 'Workshop' | 'Bootcamp' | 'FDP' | 'Industry Training' | 'Webinar';
  provider: string;
  logo: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsGained: string[];
  hasCertification: boolean;
  rating: number;
  enrolledCount: number;
  deadline?: string;
  description: string;
  mode: 'Self-paced' | 'Live Online' | 'Classroom' | 'Hybrid';
  isEnrolled?: boolean;
  careerRoleIds?: string[];
  targetRoles?: string[];
  eligibleBranches?: string[];
  requirements?: string[];
  prerequisites?: string;
  maxSeats?: number;
  status?: 'Live & Accepting' | 'Upcoming' | 'Closed' | 'Archived';
  isClosed?: boolean;
  closedReason?: string;
  closedAt?: string;
  hiringAdvantage?: string;
  stipendOrCost?: string;
}

export interface ApplicationTrackerItem {
  id: string;
  opportunityId: string;
  title: string;
  company: string;
  logo: string;
  type: 'Job' | 'Internship';
  appliedDate: string;
  currentStage: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  stageTimeline: {
    stage: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Selected';
    date: string;
    completed: boolean;
    note?: string;
  }[];
  notes?: string;
}

export interface InternshipRecord {
  id: string;
  company: string;
  logo: string;
  role: string;
  startDate: string;
  endDate: string;
  mentor: string;
  mentorDesignation: string;
  progressPercentage: number;
  status: 'Active' | 'Completed';
  tasks: {
    id: string;
    title: string;
    done: boolean;
  }[];
  feedback?: string;
  certificateIssued: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Academic' | 'Industry' | 'Hackathon' | 'Capstone' | 'Open Source';
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  skillsDemonstrated: string[];
  completionDate: string;
  verified: boolean;
}

export interface CertificationItem {
  id: string;
  name: string;
  provider: string;
  logo: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationStatus: 'Verified' | 'Completed' | 'Pending Verification';
  skills: string[];
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  company: string;
  role: string;
  industry: string;
  domain: string;
  experienceYears: number;
  expertise: string[];
  rating: number;
  sessionsConducted: number;
  availableSlots: string;
  bio: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Workshop' | 'Hackathon' | 'Guest Lecture' | 'Career Fair' | 'Webinar' | 'Industry Visit' | 'Networking';
  organizer: string;
  date: string;
  time: string;
  location: string;
  isRegistered?: boolean;
  seatsRemaining: number;
  speakers?: string[];
  description: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    url: string;
  };
  isRead: boolean;
}

export interface Conversation {
  id: string;
  contactName: string;
  contactAvatar: string;
  contactRole: string; // "Recruiter at TechNova", "Technical Guide", "Senior Mentor"
  contactType: 'recruiter' | 'mentor' | 'industry';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: MessageItem[];
}

export interface NotificationItem {
  id: string;
  category: 'Applications' | 'Jobs' | 'Internships' | 'Learning' | 'Mentorship' | 'Events' | 'Messages' | 'System';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export type AssessmentQuestionType = 
  | 'single-select'
  | 'multi-select'
  | 'code-analysis'
  | 'fill-blank'
  | 'scenario-judgment';

export interface AssessmentQuestion {
  id: number | string;
  type?: AssessmentQuestionType;
  section: 'Programming' | 'Data & AI' | 'Problem Solving' | 'Communication' | 'Leadership';
  title?: string;
  question: string;
  codeSnippet?: string;
  language?: string;
  options?: string[];
  correctOption?: number;
  correctOptions?: number[];
  acceptedAnswers?: string[];
  placeholder?: string;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  points?: number;
  scenarioContext?: string;
}

export interface Candidate {
  id: string;
  studentId?: string; // 10-digit unique student ID started with #
  name: string;
  avatar: string;
  college: string;
  degree: string;
  department: string;
  graduationYear: number;
  location: string;
  skillScore: number;
  matchScore: number; // dynamic matching for recruiter
  topSkills: string[];
  certificationsCount: number;
  internshipExperience: string;
  status: 'Available' | 'Shortlisted' | 'Interviewed' | 'In Interview' | 'Offered' | 'Placed' | 'Hired';
  isVerified: boolean;
  cgpa: number;
}

export interface PlacementDrive {
  id: string;
  company: string;
  logo: string;
  role: string;
  salaryPackage: string;
  eligibleBranches: string[];
  driveDate: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  totalEligible: number;
  applied: number;
  shortlisted: number;
  interviews: number;
  offers: number;
  joined: number;
}

export interface CollaborationInitiative {
  id: string;
  title: string;
  type: 'Industry Partnership' | 'Mentorship' | 'Guest Lecture' | 'Workshop' | 'Live Project' | 'Hackathon' | 'Research' | 'Consultancy' | 'Industrial Visit';
  partnerOrganization: string;
  logo: string;
  institution: string;
  startDate: string;
  duration: string;
  status: 'Active' | 'Proposed' | 'MOU Signed' | 'Completed';
  leadCoordinator: string;
  impactMetrics: string;
  description: string;
}
