import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  Award,
  Calendar,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  X,
  ExternalLink,
  Edit3,
  Sparkles,
  Laptop,
  GraduationCap,
  FileCheck2,
  MessageSquare,
  Check,
  ThumbsUp,
  ThumbsDown,
  Layers,
  BarChart2,
  PhoneCall,
  Printer,
  Download,
  Eye,
  AlertTriangle,
  Play,
  Trash2,
  MoveUp,
  MoveDown,
  Video,
  ListPlus,
  Film
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningProgram, MenteeCourseEnrollment, CourseVideoItem } from '../../types';
import { api } from '../../services/api';

// Initial fallback mock data for demo robustness
const INITIAL_COURSES: LearningProgram[] = [
  {
    id: 'lp-inst-1',
    title: 'Full-Stack Web Engineering with React & Node',
    category: 'Course',
    provider: 'Apex Institute • Dept of CS',
    logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop&q=80',
    duration: '8 Weeks (16 Interactive Sessions)',
    level: 'Intermediate',
    skillsGained: ['React 18', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'REST Security'],
    hasCertification: true,
    rating: 4.92,
    enrolledCount: 68,
    deadline: '2026-10-30',
    description: 'Comprehensive mentor-led full-stack development cohort covering modern component architecture, state machines, secure backend APIs, and Dockerized cloud deployment.',
    mode: 'Live Online',
    eligibleBranches: ['Computer Science & Engineering', 'Information Science & Engineering', 'Artificial Intelligence & Data Science'],
    mentorName: 'Dr. Ramesh Sharma (Dean & CS Faculty)',
    venueOrLink: 'Google Meet (meet.google.com/cs-fullstack-2026) & GitHub Classroom',
    scheduleTiming: 'Every Tuesday & Thursday • 5:00 PM - 7:00 PM IST',
    department: 'Computer Science & Engineering',
    maxSeats: 80,
    status: 'Live & Accepting',
    videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
    videoTitle: 'Lecture 1: Modern Full-Stack Web Architecture, React 18 & RESTful APIs',
    videoDuration: '55 mins',
    videos: [
      { id: 'v-1-1', title: 'Lecture 1: Modern Full-Stack Web Architecture, React 18 & RESTful APIs', url: 'https://www.youtube.com/embed/nu_pCVPKzTk', duration: '55 mins', moduleIndex: 1 },
      { id: 'v-1-2', title: 'Lecture 2: Scalable Node.js, Express & Database APIs', url: 'https://www.youtube.com/embed/hnj-7XwTYRI', duration: '48 mins', moduleIndex: 2 },
      { id: 'v-1-3', title: 'Lecture 3: Production Docker Deployment & Security Hardening', url: 'https://www.youtube.com/embed/X48VuDVv0do', duration: '52 mins', moduleIndex: 3 }
    ],
    certificateTemplateTitle: 'Certificate of Advanced Full-Stack Web Engineering',
    certificateSignatoryName: 'Dr. Ramesh Sharma',
    certificateSignatoryTitle: 'Dean & Professor, Dept. of Computer Science',
    certificateCitation: 'has successfully completed all 8 weeks of intensive full-stack web engineering, master lectures, backend REST security pipelines, and capstone deployment with distinction.',
    certificateCredentialPrefix: 'CS-FSW',
    certificateTemplateStyle: 'gold',
    autoIssueCertificate: true,
    syllabusModules: [
      { moduleNumber: 1, title: 'Modern React 18 Architecture & Hooks', duration: 'Week 1-2', topics: ['Component Lifecycle', 'Custom Hooks', 'Tailwind & UI State'] },
      { moduleNumber: 2, title: 'Scalable Node.js & Express APIs', duration: 'Week 3-4', topics: ['Middleware Pipelines', 'Input Validation', 'Async Routing'] },
      { moduleNumber: 3, title: 'PostgreSQL Relational Design & Prisma', duration: 'Week 5-6', topics: ['Indexing Strategies', 'Migrations', 'Connection Pooling'] },
      { moduleNumber: 4, title: 'Security, JWT & Dockerized Deployment', duration: 'Week 7-8', topics: ['JWT Refresh Flow', 'Containerization', 'CI/CD Pipelines'] }
    ]
  },
  {
    id: 'lp-inst-2',
    title: 'Embedded Systems & IoT Robotics Workshop',
    category: 'Workshop',
    provider: 'Apex Institute • Dept of ECE & IoT CoE',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    duration: '6 Weeks (Hands-on Lab Track)',
    level: 'Intermediate',
    skillsGained: ['STM32 ARM Cortex', 'FreeRTOS', 'I2C/SPI Protocols', 'Sensor Interfacing', 'PCB Soldering'],
    hasCertification: true,
    rating: 4.95,
    enrolledCount: 42,
    deadline: '2026-10-25',
    description: 'Hands-on physical laboratory workshop mastering embedded microcontrollers, real-time operating systems (FreeRTOS), hardware bus debugging, and autonomous mobile robotics.',
    mode: 'Classroom',
    eligibleBranches: ['Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering'],
    mentorName: 'Prof. Ananya Sen (ECE Robotics CoE)',
    venueOrLink: 'Hardware & Embedded Systems Lab 304, Block C (In-Person)',
    scheduleTiming: 'Mon, Wed, Fri • 3:30 PM - 5:30 PM IST (Lab In-Person)',
    department: 'Electronics & Communication',
    maxSeats: 50,
    status: 'Live & Accepting',
    videoUrl: 'https://www.youtube.com/embed/hnj-7XwTYRI',
    videoTitle: 'Lab 1: Embedded Microcontroller Architecture & Sensor Interfacing',
    videoDuration: '48 mins',
    videos: [
      { id: 'v-2-1', title: 'Lab 1: Embedded Microcontroller Architecture & Sensor Interfacing', url: 'https://www.youtube.com/embed/hnj-7XwTYRI', duration: '48 mins', moduleIndex: 1 },
      { id: 'v-2-2', title: 'Lab 2: Real-Time Operating Systems (FreeRTOS) Kernel Multitasking', url: 'https://www.youtube.com/embed/aircAruvnKk', duration: '45 mins', moduleIndex: 2 },
      { id: 'v-2-3', title: 'Lab 3: Autonomous Mobile Robotics & Hardware Bus Protocols', url: 'https://www.youtube.com/embed/3SAxXUIre28', duration: '55 mins', moduleIndex: 3 }
    ],
    certificateTemplateTitle: 'Certificate of Excellence in Embedded Systems & IoT Robotics',
    certificateSignatoryName: 'Prof. Ananya Sen',
    certificateSignatoryTitle: 'Head of ECE Robotics Center of Excellence',
    certificateCitation: 'has demonstrated mastery in microcontroller firmware, FreeRTOS kernel scheduling, hardware bus protocols, and completed the autonomous rover field evaluation with top honors.',
    certificateCredentialPrefix: 'ECE-ROBOTICS',
    certificateTemplateStyle: 'emerald',
    autoIssueCertificate: true,
    syllabusModules: [
      { moduleNumber: 1, title: 'Microcontroller Architecture & Bare Metal C', duration: 'Week 1-2', topics: ['GPIO Registers', 'Clocks & Timers', 'Interrupt Vectors'] },
      { moduleNumber: 2, title: 'Bus Protocols: UART, SPI & I2C', duration: 'Week 3-4', topics: ['Logic Analyzers', 'Oscilloscope Debugging', 'Sensor Fusion'] },
      { moduleNumber: 3, title: 'FreeRTOS Multitasking & Capstone Rover', duration: 'Week 5-6', topics: ['Task Scheduling', 'Semaphores & Queues', 'Autonomous Rover Build'] }
    ]
  },
  {
    id: 'lp-inst-3',
    title: 'Applied Machine Learning & MLOps in Production',
    category: 'Course',
    provider: 'Apex Institute • Dept of AI & Data Science',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    duration: '10 Weeks (Hybrid)',
    level: 'Advanced',
    skillsGained: ['Scikit-Learn', 'PyTorch', 'MLflow', 'Docker', 'Feature Stores', 'Model Monitoring'],
    hasCertification: true,
    rating: 4.89,
    enrolledCount: 56,
    deadline: '2026-11-05',
    description: 'End-to-end applied machine learning track taking students from foundational statistical modeling to enterprise containerized inference pipelines and drift monitoring.',
    mode: 'Hybrid',
    eligibleBranches: ['Artificial Intelligence & Data Science', 'Computer Science & Engineering', 'Information Science & Engineering'],
    mentorName: 'Dr. Vikramaditya Rao (AI & DS Lab Head)',
    venueOrLink: 'Seminar Hall B (Offline) & MS Teams (Online Sessions)',
    scheduleTiming: 'Saturdays 10:00 AM - 1:00 PM (In-Person) + Wed 6 PM Online',
    department: 'Artificial Intelligence & Data Science',
    maxSeats: 60,
    status: 'Live & Accepting',
    videoUrl: 'https://www.youtube.com/embed/GIsg-ZUy0MY',
    videoTitle: 'Masterclass: End-to-End MLOps, PyTorch Models & Production Deployment',
    videoDuration: '52 mins',
    videos: [
      { id: 'v-3-1', title: 'Masterclass: End-to-End MLOps, PyTorch Models & Production Deployment', url: 'https://www.youtube.com/embed/GIsg-ZUy0MY', duration: '52 mins', moduleIndex: 1 },
      { id: 'v-3-2', title: 'Lecture 2: Deep Convolutional Neural Networks & Feature Representations', url: 'https://www.youtube.com/embed/kCc8FmEb1nY', duration: '48 mins', moduleIndex: 2 },
      { id: 'v-3-3', title: 'Lecture 3: Transformer Attention Mechanisms & LLM Fine-Tuning Pipelines', url: 'https://www.youtube.com/embed/SOTamWNgDKc', duration: '60 mins', moduleIndex: 3 }
    ],
    certificateTemplateTitle: 'Certificate of Applied Machine Learning & MLOps Specialization',
    certificateSignatoryName: 'Dr. Vikramaditya Rao',
    certificateSignatoryTitle: 'Head of AI & Data Science Laboratories',
    certificateCitation: 'has successfully completed end-to-end machine learning engineering, PyTorch deep neural models, and containerized cloud deployment pipelines with exemplary distinction.',
    certificateCredentialPrefix: 'AI-MLOPS',
    certificateTemplateStyle: 'indigo',
    autoIssueCertificate: true,
    syllabusModules: [
      { moduleNumber: 1, title: 'Advanced Feature Engineering & Ensembles', duration: 'Week 1-3', topics: ['EDA Pipelines', 'XGBoost & LightGBM', 'Cross-Validation'] },
      { moduleNumber: 2, title: 'Deep Neural Networks with PyTorch', duration: 'Week 4-6', topics: ['Tensors', 'Backpropagation', 'Transfer Learning', 'Embeddings'] },
      { moduleNumber: 3, title: 'MLOps: Experiment Tracking & Cloud Deployment', duration: 'Week 7-10', topics: ['MLflow Registries', 'FastAPI Serving', 'Docker & Model Drift'] }
    ]
  },
  {
    id: 'lp-inst-4',
    title: 'Competitive Programming & Advanced Data Structures',
    category: 'Bootcamp',
    provider: 'Apex Institute Placement Cell',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop&q=80',
    duration: '12 Weeks (Intensive Problem Solving)',
    level: 'Intermediate',
    skillsGained: ['Dynamic Programming', 'Graph Theory', 'Bitmasking', 'Segment Trees', 'Trie'],
    hasCertification: true,
    rating: 4.96,
    enrolledCount: 95,
    deadline: '2026-11-15',
    description: 'Rigorous algorithm design and competitive coding practice tailored to crack Tier-1 product company coding rounds (Google, Amazon, Microsoft, Atlassian).',
    mode: 'Live Online',
    eligibleBranches: ['Computer Science & Engineering', 'Information Science & Engineering', 'All Engineering Departments'],
    mentorName: 'Prof. Sandeep Kulkarni (Coding Coach)',
    venueOrLink: 'Discord Live & HackerRank Private Arena',
    scheduleTiming: 'Mon & Thu • 6:30 PM - 8:30 PM IST',
    department: 'Computer Science & Engineering',
    maxSeats: 120,
    status: 'Live & Accepting',
    videoUrl: 'https://www.youtube.com/embed/RBSGKlAvoiM',
    videoTitle: 'Session 1: Advanced Dynamic Programming & Graph Theory Algorithms',
    videoDuration: '60 mins',
    videos: [
      { id: 'v-4-1', title: 'Session 1: Advanced Dynamic Programming & Graph Theory Algorithms', url: 'https://www.youtube.com/embed/RBSGKlAvoiM', duration: '60 mins', moduleIndex: 1 },
      { id: 'v-4-2', title: 'Session 2: Segment Trees, Disjoint Set Union & Range Queries', url: 'https://www.youtube.com/embed/4m9j6hlbf4g', duration: '55 mins', moduleIndex: 2 }
    ],
    certificateTemplateTitle: 'Certificate of Advanced Algorithmic Mastery & Competitive Coding',
    certificateSignatoryName: 'Prof. Sandeep Kulkarni',
    certificateSignatoryTitle: 'Head Coach, Institutional Placement Coding Cell',
    certificateCitation: 'has mastered advanced graph theory, dynamic programming structures, and qualified across timed Tier-1 technical coding simulations.',
    certificateCredentialPrefix: 'ALGO-PRO',
    certificateTemplateStyle: 'blue',
    autoIssueCertificate: true,
    syllabusModules: [
      { moduleNumber: 1, title: 'Advanced Recursion & Dynamic Programming', duration: 'Week 1-4', topics: ['Memoization vs Tabulation', '0/1 Knapsack', 'DP on Trees'] },
      { moduleNumber: 2, title: 'Graph Algorithms & Shortest Path', duration: 'Week 5-8', topics: ['Dijkstra', 'Bellman-Ford', 'Disjoint Set Union', 'Topological Sort'] },
      { moduleNumber: 3, title: 'Range Queries & Contest Simulation', duration: 'Week 9-12', topics: ['Segment Trees', 'Fenwick Trees', 'Weekly Timed Contests'] }
    ]
  }
];

const INITIAL_MENTEES: MenteeCourseEnrollment[] = [
  {
    id: 'mce-01',
    courseId: 'lp-inst-1',
    courseTitle: 'Full-Stack Web Engineering with React & Node',
    courseMode: 'Live Online',
    studentId: 'usr-student-2',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@apextech.ac.in',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    usn: '1AP23CS084',
    cgpa: 8.92,
    appliedAt: '2026-09-08T10:30:00Z',
    statementOfPurpose: 'Looking to build deep full-stack engineering skills to clear technical interviews for upcoming Tier-1 campus placement drives.',
    permissionStatus: 'pending',
    mentorName: 'Dr. Ramesh Sharma',
    progressPercentage: 0,
    currentModule: 'Awaiting Admission Approval',
    completedAssignments: 0,
    totalAssignments: 5,
    lastActiveAt: '2026-09-10T14:30:00Z',
    mentorNotes: 'Candidate has solid OOP fundamentals; ready for mentor review.',
    isCertified: false
  },
  {
    id: 'mce-02',
    courseId: 'lp-inst-2',
    courseTitle: 'Embedded Systems & IoT Robotics Workshop',
    courseMode: 'Classroom',
    studentId: 'usr-student-3',
    studentName: 'Rohan Verma',
    studentEmail: 'rohan.verma@apextech.ac.in',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    department: 'Electronics & Communication',
    usn: '1AP23EC042',
    cgpa: 8.45,
    appliedAt: '2026-09-09T14:15:00Z',
    statementOfPurpose: 'Specializing in edge microcontrollers, sensors, and robotics for our final-year Smart Mobility capstone project.',
    permissionStatus: 'pending',
    mentorName: 'Prof. Ananya Sen',
    progressPercentage: 0,
    currentModule: 'Awaiting Admission Approval',
    completedAssignments: 0,
    totalAssignments: 5,
    lastActiveAt: '2026-09-11T10:15:00Z',
    mentorNotes: 'Lab workstation 12 allocated pending dean approval.',
    isCertified: false
  },
  {
    id: 'mce-03',
    courseId: 'lp-inst-3',
    courseTitle: 'Applied Machine Learning & MLOps in Production',
    courseMode: 'Hybrid',
    studentId: 'usr-student-4',
    studentName: 'Aarav Patel',
    studentEmail: 'aarav.patel@apextech.ac.in',
    studentAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    department: 'Artificial Intelligence & Data Science',
    usn: '1AP23AI019',
    cgpa: 8.15,
    appliedAt: '2026-09-10T09:00:00Z',
    statementOfPurpose: 'Desire to master cloud containerized model deployment and pipeline monitoring for AI research fellowship.',
    permissionStatus: 'pending',
    mentorName: 'Dr. Vikramaditya Rao',
    progressPercentage: 0,
    currentModule: 'Awaiting Admission Approval',
    completedAssignments: 0,
    totalAssignments: 6,
    lastActiveAt: '2026-09-11T12:00:00Z',
    mentorNotes: 'Prerequisite Python score verified.',
    isCertified: false
  },
  {
    id: 'mce-04',
    courseId: 'lp-inst-1',
    courseTitle: 'Full-Stack Web Engineering with React & Node',
    courseMode: 'Live Online',
    studentId: 'usr-student-1',
    studentName: 'Ananya Rao',
    studentEmail: 'student@careersync.com',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    usn: '1AP22CS014',
    cgpa: 9.24,
    appliedAt: '2026-08-15T10:00:00Z',
    statementOfPurpose: 'Targeting product company software roles; aiming to master full-stack deployment and asynchronous message queues.',
    permissionStatus: 'approved',
    permissionDecidedAt: '2026-08-16T11:00:00Z',
    mentorName: 'Dr. Ramesh Sharma',
    startedAt: '2026-08-18T09:00:00Z',
    progressPercentage: 75,
    currentModule: 'Module 4: Security, JWT & Dockerized Deployment',
    completedAssignments: 4,
    totalAssignments: 5,
    assessmentScore: 94.5,
    lastActiveAt: '2026-09-11T18:45:00Z',
    mentorNotes: 'Exceptional backend code modularity and clean architectural abstraction. Ready for capstone evaluation.',
    isCertified: false
  },
  {
    id: 'mce-05',
    courseId: 'lp-inst-3',
    courseTitle: 'Applied Machine Learning & MLOps in Production',
    courseMode: 'Hybrid',
    studentId: 'usr-student-5',
    studentName: 'Devansh Gupta',
    studentEmail: 'devansh.gupta@apextech.ac.in',
    studentAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    department: 'Artificial Intelligence & Data Science',
    usn: '1AP22AI031',
    cgpa: 8.78,
    appliedAt: '2026-08-12T11:00:00Z',
    statementOfPurpose: 'Building predictive data modeling and MLOps tools for healthcare diagnostics.',
    permissionStatus: 'approved',
    permissionDecidedAt: '2026-08-13T12:00:00Z',
    mentorName: 'Dr. Vikramaditya Rao',
    startedAt: '2026-08-15T10:00:00Z',
    progressPercentage: 50,
    currentModule: 'Module 2: Deep Neural Networks with PyTorch',
    completedAssignments: 3,
    totalAssignments: 6,
    assessmentScore: 88.0,
    lastActiveAt: '2026-09-10T14:20:00Z',
    mentorNotes: 'Solid intuition for loss landscapes and gradient optimizers. Advised to implement learning rate schedulers.',
    isCertified: false
  },
  {
    id: 'mce-06',
    courseId: 'lp-inst-2',
    courseTitle: 'Embedded Systems & IoT Robotics Workshop',
    courseMode: 'Classroom',
    studentId: 'usr-student-6',
    studentName: 'Sneha Reddy',
    studentEmail: 'sneha.reddy@apextech.ac.in',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    department: 'Electronics & Communication',
    usn: '1AP22EC058',
    cgpa: 9.42,
    appliedAt: '2026-08-01T09:30:00Z',
    statementOfPurpose: 'Passionate about automotive robotics, RTOS kernel hacking, and CAN bus vehicle telemetry.',
    permissionStatus: 'approved',
    permissionDecidedAt: '2026-08-02T10:00:00Z',
    mentorName: 'Prof. Ananya Sen',
    startedAt: '2026-08-05T09:00:00Z',
    progressPercentage: 100,
    currentModule: 'Module 3: FreeRTOS Multitasking & Capstone Rover',
    completedAssignments: 5,
    totalAssignments: 5,
    assessmentScore: 98.0,
    lastActiveAt: '2026-09-09T17:30:00Z',
    mentorNotes: 'Highest distinction in physical hardware demo. Rover completed obstacle avoidance course in record time. Certified!',
    isCertified: true,
    issuedCertificateId: 'ECE-ROBOTICS-2026-SR058',
    certificateIssuedAt: '2026-09-09T17:35:00Z'
  },
  {
    id: 'mce-07',
    courseId: 'lp-inst-4',
    courseTitle: 'Competitive Programming & Advanced Data Structures',
    courseMode: 'Live Online',
    studentId: 'usr-student-7',
    studentName: 'Kavya Menon',
    studentEmail: 'kavya.menon@apextech.ac.in',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    department: 'Information Science & Engineering',
    usn: '1AP23IS027',
    cgpa: 8.35,
    appliedAt: '2026-08-20T16:00:00Z',
    statementOfPurpose: 'Preparing for Tier-1 coding screening rounds; focusing on dynamic programming and graph trees.',
    permissionStatus: 'approved',
    permissionDecidedAt: '2026-08-21T09:30:00Z',
    mentorName: 'Prof. Sandeep Kulkarni',
    startedAt: '2026-08-22T17:00:00Z',
    progressPercentage: 35,
    currentModule: 'Module 2: Graph Algorithms & Shortest Path',
    completedAssignments: 2,
    totalAssignments: 6,
    assessmentScore: 82.5,
    lastActiveAt: '2026-09-11T20:10:00Z',
    mentorNotes: 'Good progress on DP on trees; encouraged to join weekly Sunday contest simulation.',
    isCertified: false
  }
];

export const InstitutionCoursesView: React.FC = () => {
  const { setActiveTab, setIsMessagesOpen, setIsPhoneCallOpen, setActiveCallContact } = useApp();

  // Primary navigation tabs
  const [activeTabKey, setActiveTabKey] = useState<'catalog' | 'permissions' | 'progress'>('catalog');

  // Courses and mentees data
  const [courses, setCourses] = useState<LearningProgram[]>(INITIAL_COURSES);
  const [mentees, setMentees] = useState<MenteeCourseEnrollment[]>(INITIAL_MENTEES);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<'all' | 'online' | 'offline' | 'hybrid'>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [permissionStatusFilter, setPermissionStatusFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');
  const [progressLevelFilter, setProgressLevelFilter] = useState<'all' | 'active' | 'certified'>('all');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedMenteeForProgress, setSelectedMenteeForProgress] = useState<MenteeCourseEnrollment | null>(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<LearningProgram | null>(null);
  const [selectedMenteeForCertificate, setSelectedMenteeForCertificate] = useState<MenteeCourseEnrollment | null>(null);

  // Form State for uploading new course
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: 'Course' as 'Course' | 'Workshop' | 'Bootcamp' | 'Certification',
    mode: 'Live Online' as 'Live Online' | 'Classroom' | 'Hybrid' | 'Self-paced',
    mentorName: 'Dr. Ramesh Sharma',
    department: 'Computer Science & Engineering',
    duration: '8 Weeks',
    level: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    venueOrLink: '',
    scheduleTiming: '',
    maxSeats: 60,
    hasCertification: true,
    autoIssueCertificate: true,
    certificateTemplateTitle: 'Certificate of Advanced Competency & Mastery',
    certificateSignatoryName: 'Dr. Ramesh Sharma',
    certificateSignatoryTitle: 'Dean of Faculty & Senior Academic Mentor',
    certificateCitation: 'has demonstrated exemplary technical competency, completed all practical laboratory milestones, and fulfilled all graduation criteria with distinction.',
    certificateCredentialPrefix: 'APEX-CERT',
    certificateTemplateStyle: 'gold' as 'gold' | 'blue' | 'emerald' | 'indigo',
    certificateBadgeUrl: '',
    description: '',
    prerequisites: '',
    skillsGained: 'React, Node.js, Cloud APIs',
    videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
    videoTitle: 'Lecture 1: Modern Full-Stack Architecture, React 18 & RESTful APIs',
    videoDuration: '55 mins',
    videos: [
      {
        id: 'vid-init-1',
        title: 'Lecture 1: Modern Full-Stack Architecture, React 18 & RESTful APIs',
        url: 'https://www.youtube.com/embed/nu_pCVPKzTk',
        duration: '55 mins',
        moduleIndex: 1
      },
      {
        id: 'vid-init-2',
        title: 'Lecture 2: Scalable Node.js & Express API Backend Architecture',
        url: 'https://www.youtube.com/embed/hnj-7XwTYRI',
        duration: '48 mins',
        moduleIndex: 2
      }
    ] as CourseVideoItem[],
    postedDate: new Date().toISOString().split('T')[0],
    eligibleBranches: ['Computer Science & Engineering', 'Information Science & Engineering', 'Artificial Intelligence & Data Science'],
    syllabusModules: [
      { moduleNumber: 1, title: 'Foundations & Architecture Setup', duration: 'Week 1-2', topics: ['Core concepts', 'Environment setup', 'Project architecture'] },
      { moduleNumber: 2, title: 'Core Implementation & Lab Exercises', duration: 'Week 3-4', topics: ['Hands-on modules', 'Deep dive exercises', 'Debugging'] }
    ]
  });

  // Progress Update Form State
  const [progressForm, setProgressForm] = useState({
    progressPercentage: 50,
    currentModule: '',
    completedAssignments: 2,
    totalAssignments: 5,
    assessmentScore: 85,
    mentorNotes: '',
    isCertified: false
  });

  // Toast / Status Message
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const showAlert = (text: string, type: 'success' | 'info' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4500);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Load courses
      const apiPrograms = await api.courses.getPrograms();
      if (apiPrograms && apiPrograms.length > 0) {
        // Filter or prioritize institutional courses
        const instCourses = apiPrograms.filter(p => p.id.startsWith('lp-inst-') || p.provider?.includes('Apex') || p.provider?.includes('Dept'));
        if (instCourses.length > 0) {
          setCourses(instCourses);
        } else {
          // Merge with initial
          setCourses(INITIAL_COURSES);
        }
      }

      // 2. Load mentee enrollments
      const apiMentees = await api.courses.getMenteeEnrollments();
      if (apiMentees && apiMentees.length > 0) {
        setMentees(apiMentees);
      }
    } catch (err) {
      console.warn('Using local fallback for courses & mentees:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch from API on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle granting or declining permission
  const handlePermissionAction = async (menteeId: string, status: 'approved' | 'declined', note?: string) => {
    try {
      await api.courses.updatePermission(menteeId, status, note);
    } catch (e) {
      console.warn('API call failed, updating local state:', e);
    }

    setMentees(prev =>
      prev.map(m => {
        if (m.id === menteeId) {
          const now = new Date().toISOString();
          return {
            ...m,
            permissionStatus: status,
            permissionDecidedAt: now,
            startedAt: status === 'approved' && !m.startedAt ? now : m.startedAt,
            currentModule: status === 'approved' && m.currentModule === 'Awaiting Admission Approval' ? 'Module 1: Orientation & Environment Setup' : m.currentModule,
            progressPercentage: status === 'approved' && m.progressPercentage === 0 ? 5 : m.progressPercentage,
            mentorNotes: note || m.mentorNotes
          };
        }
        return m;
      })
    );

    const mentee = mentees.find(m => m.id === menteeId);
    if (status === 'approved') {
      showAlert(`Permission granted for ${mentee?.studentName || 'Student'}! Mentee is now enrolled and tracking is active.`);
    } else {
      showAlert(`Application for ${mentee?.studentName || 'Student'} was marked as declined.`, 'info');
    }
  };

  // Handle Mentee Progress Save
  const handleSaveProgress = async () => {
    if (!selectedMenteeForProgress) return;

    try {
      await api.courses.updateProgress(selectedMenteeForProgress.id, progressForm);
    } catch (e) {
      console.warn('API call failed, updating local state:', e);
    }

    setMentees(prev =>
      prev.map(m => {
        if (m.id === selectedMenteeForProgress.id) {
          return {
            ...m,
            progressPercentage: progressForm.progressPercentage,
            currentModule: progressForm.currentModule,
            completedAssignments: progressForm.completedAssignments,
            totalAssignments: progressForm.totalAssignments,
            assessmentScore: progressForm.assessmentScore,
            mentorNotes: progressForm.mentorNotes,
            isCertified: progressForm.isCertified,
            lastActiveAt: new Date().toISOString()
          };
        }
        return m;
      })
    );

    showAlert(`Progress updated successfully for ${selectedMenteeForProgress.studentName}! (${progressForm.progressPercentage}%)`);
    setIsProgressModalOpen(false);
  };

  // Handle toggling course booking status (Close Bookings / Reopen)
  const handleToggleCourseBookings = async (course: LearningProgram) => {
    const isClosing = !course.isClosed && course.status !== 'Closed';
    let reason: string | undefined = undefined;

    if (isClosing) {
      const inputReason = prompt(
        'Enter closing notice / reason for students:',
        'Cohort enrollment capacity reached for this semester batch.'
      );
      if (inputReason === null) return; // User cancelled
      reason = inputReason.trim() || 'Cohort enrollment capacity reached for this semester batch.';
    }

    const targetStatus: 'Closed' | 'Live & Accepting' = isClosing ? 'Closed' : 'Live & Accepting';

    try {
      await api.courses.updateStatus(course.id, targetStatus, reason);
    } catch (err) {
      console.warn('API call failed, updating local state:', err);
    }

    setCourses(prev =>
      prev.map(c =>
        c.id === course.id
          ? {
              ...c,
              status: targetStatus,
              isClosed: isClosing,
              closedReason: reason,
              closedAt: isClosing ? new Date().toISOString() : undefined
            }
          : c
      )
    );

    showAlert(
      isClosing
        ? `Bookings closed for "${course.title}". Students can no longer enroll.`
        : `Bookings reopened for "${course.title}"! Course is now accepting student enrollments.`,
      isClosing ? 'info' : 'success'
    );
  };

  // Handle uploading new course
  const handleUploadCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) {
      alert('Please provide a course title.');
      return;
    }

    if (newCourse.hasCertification && (!newCourse.certificateTemplateTitle.trim() || !newCourse.certificateSignatoryName.trim())) {
      alert('Please configure the Certificate Title and Authorized Signatory Name for automatic issuance.');
      return;
    }

    const courseId = `lp-inst-${Date.now()}`;
    const skillsArray = newCourse.skillsGained.split(',').map(s => s.trim()).filter(Boolean);

    const coursePayload: LearningProgram = {
      id: courseId,
      title: newCourse.title,
      category: newCourse.category,
      provider: `Apex Institute • ${newCourse.department}`,
      logo: newCourse.mode === 'Classroom'
        ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop&q=80',
      duration: newCourse.duration,
      level: newCourse.level,
      skillsGained: skillsArray,
      hasCertification: newCourse.hasCertification,
      rating: 5.0,
      enrolledCount: 0,
      deadline: '2026-11-30',
      description: newCourse.description || `Specialized mentor-led cohort organized by ${newCourse.mentorName}.`,
      mode: newCourse.mode,
      eligibleBranches: newCourse.eligibleBranches,
      mentorName: newCourse.mentorName,
      venueOrLink: newCourse.venueOrLink || (newCourse.mode === 'Classroom' ? 'Lab 302, Department Block' : 'Virtual Classroom Link'),
      scheduleTiming: newCourse.scheduleTiming || 'Flexible Schedule',
      department: newCourse.department,
      maxSeats: newCourse.maxSeats,
      status: 'Live & Accepting',
      certificateTemplateTitle: newCourse.certificateTemplateTitle,
      certificateSignatoryName: newCourse.certificateSignatoryName,
      certificateSignatoryTitle: newCourse.certificateSignatoryTitle,
      certificateCitation: newCourse.certificateCitation,
      certificateCredentialPrefix: newCourse.certificateCredentialPrefix || 'APEX-CERT',
      certificateTemplateStyle: newCourse.certificateTemplateStyle || 'gold',
      certificateBadgeUrl: newCourse.certificateBadgeUrl,
      autoIssueCertificate: newCourse.autoIssueCertificate,
      videoUrl: (newCourse.videos.find(v => v.url.trim())?.url || newCourse.videoUrl.trim()) || undefined,
      videoTitle: (newCourse.videos.find(v => v.url.trim())?.title || newCourse.videoTitle.trim()) || undefined,
      videoDuration: newCourse.videos.find(v => v.url.trim())?.duration || '45 mins',
      videos: newCourse.videos.filter(v => v.url.trim().length > 0).map((v, i) => ({
        id: v.id || `vid-${Date.now()}-${i + 1}`,
        title: (v.title.trim() || `Lecture ${i + 1}: Core Concepts`).trim(),
        url: v.url.trim(),
        duration: (v.duration || '45 mins').trim(),
        moduleIndex: i + 1
      })),
      postedDate: newCourse.postedDate || new Date().toISOString().split('T')[0],
      syllabusModules: newCourse.syllabusModules
    };

    try {
      await api.courses.createProgram(coursePayload);
    } catch (err) {
      console.warn('API call failed, adding course locally:', err);
    }

    setCourses(prev => [coursePayload, ...prev]);
    setIsUploadModalOpen(false);
    showAlert(`New course "${newCourse.title}" published with ${coursePayload.videos?.length || 1} video lecture(s) & certificate! Mentees can now apply.`);
    
    // Reset form
    setNewCourse({
      title: '',
      category: 'Course',
      mode: 'Live Online',
      mentorName: 'Dr. Ramesh Sharma',
      department: 'Computer Science & Engineering',
      duration: '8 Weeks',
      level: 'Intermediate',
      venueOrLink: '',
      scheduleTiming: '',
      maxSeats: 60,
      hasCertification: true,
      autoIssueCertificate: true,
      certificateTemplateTitle: 'Certificate of Advanced Competency & Mastery',
      certificateSignatoryName: 'Dr. Ramesh Sharma',
      certificateSignatoryTitle: 'Dean of Faculty & Senior Academic Mentor',
      certificateCitation: 'has demonstrated exemplary technical competency, completed all practical laboratory milestones, and fulfilled all graduation criteria with distinction.',
      certificateCredentialPrefix: 'APEX-CERT',
      certificateTemplateStyle: 'gold',
      certificateBadgeUrl: '',
      description: '',
      prerequisites: '',
      skillsGained: 'React, Node.js, Cloud APIs',
      videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
      videoTitle: 'Lecture 1: Modern Full-Stack Architecture, React 18 & RESTful APIs',
      videoDuration: '55 mins',
      videos: [
        {
          id: 'vid-init-1',
          title: 'Lecture 1: Modern Full-Stack Architecture, React 18 & RESTful APIs',
          url: 'https://www.youtube.com/embed/nu_pCVPKzTk',
          duration: '55 mins',
          moduleIndex: 1
        },
        {
          id: 'vid-init-2',
          title: 'Lecture 2: Scalable Node.js & Express API Backend Architecture',
          url: 'https://www.youtube.com/embed/hnj-7XwTYRI',
          duration: '48 mins',
          moduleIndex: 2
        }
      ],
      postedDate: new Date().toISOString().split('T')[0],
      eligibleBranches: ['Computer Science & Engineering', 'Information Science & Engineering', 'Artificial Intelligence & Data Science'],
      syllabusModules: [
        { moduleNumber: 1, title: 'Foundations & Architecture Setup', duration: 'Week 1-2', topics: ['Core concepts', 'Environment setup', 'Project architecture'] },
        { moduleNumber: 2, title: 'Core Implementation & Lab Exercises', duration: 'Week 3-4', topics: ['Hands-on modules', 'Deep dive exercises', 'Debugging'] }
      ]
    });
  };

  // Video Management Handlers for Institution Form
  const handleAddVideoItem = () => {
    setNewCourse(prev => {
      const nextIdx = prev.videos.length + 1;
      return {
        ...prev,
        videos: [
          ...prev.videos,
          {
            id: `vid-${Date.now()}-${nextIdx}`,
            title: `Lecture ${nextIdx}: Advanced Architecture & Practical Lab`,
            url: '',
            duration: '45 mins',
            moduleIndex: nextIdx
          }
        ]
      };
    });
  };

  const handleUpdateVideoItem = (index: number, field: keyof CourseVideoItem, value: any) => {
    setNewCourse(prev => {
      const updated = [...prev.videos];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        videos: updated,
        videoUrl: index === 0 && field === 'url' ? value : prev.videoUrl,
        videoTitle: index === 0 && field === 'title' ? value : prev.videoTitle,
        videoDuration: index === 0 && field === 'duration' ? value : prev.videoDuration
      };
    });
  };

  const handleRemoveVideoItem = (index: number) => {
    setNewCourse(prev => {
      if (prev.videos.length <= 1) {
        return {
          ...prev,
          videos: [{
            id: `vid-${Date.now()}-1`,
            title: 'Lecture 1: Technical Masterclass',
            url: '',
            duration: '45 mins',
            moduleIndex: 1
          }],
          videoUrl: '',
          videoTitle: ''
        };
      }
      const updated = prev.videos.filter((_, i) => i !== index);
      return {
        ...prev,
        videos: updated,
        videoUrl: updated[0]?.url || '',
        videoTitle: updated[0]?.title || '',
        videoDuration: updated[0]?.duration || '45 mins'
      };
    });
  };

  const handleMoveVideoItem = (index: number, direction: 'up' | 'down') => {
    setNewCourse(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.videos.length) return prev;
      const updated = [...prev.videos];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return {
        ...prev,
        videos: updated,
        videoUrl: updated[0]?.url || '',
        videoTitle: updated[0]?.title || '',
        videoDuration: updated[0]?.duration || '45 mins'
      };
    });
  };

  const handleApplyVideoPreset = (presetVideos: CourseVideoItem[]) => {
    setNewCourse(prev => ({
      ...prev,
      videos: presetVideos,
      videoUrl: presetVideos[0]?.url || '',
      videoTitle: presetVideos[0]?.title || '',
      videoDuration: presetVideos[0]?.duration || '45 mins'
    }));
  };

  // Open progress update modal
  const openProgressModal = (mentee: MenteeCourseEnrollment) => {
    setSelectedMenteeForProgress(mentee);
    setProgressForm({
      progressPercentage: mentee.progressPercentage,
      currentModule: mentee.currentModule || 'Module 1: Orientation',
      completedAssignments: mentee.completedAssignments,
      totalAssignments: mentee.totalAssignments || 5,
      assessmentScore: mentee.assessmentScore || 85,
      mentorNotes: mentee.mentorNotes || '',
      isCertified: Boolean(mentee.isCertified)
    });
    setIsProgressModalOpen(true);
  };

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.mentorName && c.mentorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.department && c.department.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesMode = true;
      if (selectedModeFilter === 'online') {
        matchesMode = c.mode === 'Live Online' || c.mode === 'Self-paced';
      } else if (selectedModeFilter === 'offline') {
        matchesMode = c.mode === 'Classroom';
      } else if (selectedModeFilter === 'hybrid') {
        matchesMode = c.mode === 'Hybrid';
      }

      return matchesSearch && matchesMode;
    });
  }, [courses, searchQuery, selectedModeFilter]);

  // Filtered Applicants (Permissions tab)
  const filteredApplicants = useMemo(() => {
    return mentees.filter(m => {
      const matchesSearch = m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = selectedCourseFilter === 'all' || m.courseId === selectedCourseFilter;
      const matchesStatus = permissionStatusFilter === 'all' || m.permissionStatus === permissionStatusFilter;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [mentees, searchQuery, selectedCourseFilter, permissionStatusFilter]);

  // Active progressing mentees (Progress tab)
  const activeMentees = useMemo(() => {
    return mentees.filter(m => {
      // Must be approved to have active progress
      const isApproved = m.permissionStatus === 'approved';
      if (!isApproved) return false;

      const matchesSearch = m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.usn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = selectedCourseFilter === 'all' || m.courseId === selectedCourseFilter;

      let matchesLevel = true;
      if (progressLevelFilter === 'active') {
        matchesLevel = !m.isCertified;
      } else if (progressLevelFilter === 'certified') {
        matchesLevel = Boolean(m.isCertified);
      }

      return matchesSearch && matchesCourse && matchesLevel;
    });
  }, [mentees, searchQuery, selectedCourseFilter, progressLevelFilter]);

  // High-level statistics
  const totalUploadedCourses = courses.length;
  const onlineCoursesCount = courses.filter(c => c.mode === 'Live Online' || c.mode === 'Self-paced').length;
  const offlineCoursesCount = courses.filter(c => c.mode === 'Classroom' || c.mode === 'Hybrid').length;
  const pendingApprovalsCount = mentees.filter(m => m.permissionStatus === 'pending').length;
  const totalApprovedMentees = mentees.filter(m => m.permissionStatus === 'approved').length;
  const certifiedMenteesCount = mentees.filter(m => m.isCertified).length;
  const averageProgress = totalApprovedMentees > 0
    ? Math.round(mentees.filter(m => m.permissionStatus === 'approved').reduce((acc, curr) => acc + curr.progressPercentage, 0) / totalApprovedMentees)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert Banner */}
      {alertMessage && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-4 ${
          alertMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-blue-50 border-blue-300 text-blue-900'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{alertMessage.text}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="p-1 hover:bg-black/5 rounded-lg text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Faculty Mentorship &amp; Course Delivery System
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Institutional Online &amp; Offline Courses
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Empower your department mentees with mentor-curated courses, hands-on lab workshops, student enrollment permissions, and real-time competency progress tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Upload New Course
            </button>
            <button
              onClick={() => setActiveTab('my-students')}
              className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-2xl backdrop-blur-sm border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              Student Profiles
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Courses</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{totalUploadedCourses}</p>
            <span className="text-[10px] text-blue-600 font-semibold">{onlineCoursesCount} Online • {offlineCoursesCount} Offline/Lab</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTabKey('permissions')}
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Permissions</span>
              {pendingApprovalsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{pendingApprovalsCount}</p>
            <span className="text-[10px] text-amber-700 font-semibold">Review &amp; Approve Mentees &rarr;</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTabKey('progress')}
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Learners</span>
            <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-0.5">{totalApprovedMentees}</p>
            <span className="text-[10px] text-indigo-700 font-semibold">{averageProgress}% Avg Mentee Progress</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed / Certified</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{certifiedMenteesCount}</p>
            <span className="text-[10px] text-emerald-700 font-semibold">Verified Competencies</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTabKey('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabKey === 'catalog'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Course Catalog &amp; Batches ({courses.length})
          </button>

          <button
            onClick={() => setActiveTabKey('permissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabKey === 'permissions'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Permission Requests
            {pendingApprovalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTabKey('progress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabKey === 'progress'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Mentee Progress Cockpit ({totalApprovedMentees})
          </button>
        </div>

        {/* Global Search inside Courses */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, mentees, USN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: COURSE CATALOG & BATCHES (ONLINE & OFFLINE)
          ───────────────────────────────────────────────────────────── */}
      {activeTabKey === 'catalog' && (
        <div className="space-y-6">
          {/* Mode Selector Pill Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Mode Filter:</span>
              <button
                onClick={() => setSelectedModeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedModeFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Formats ({courses.length})
              </button>
              <button
                onClick={() => setSelectedModeFilter('online')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedModeFilter === 'online'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Live Online ({onlineCoursesCount})
              </button>
              <button
                onClick={() => setSelectedModeFilter('offline')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedModeFilter === 'offline'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Offline Classroom / Lab ({courses.filter(c => c.mode === 'Classroom').length})
              </button>
              <button
                onClick={() => setSelectedModeFilter('hybrid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedModeFilter === 'hybrid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                Hybrid Tracks ({courses.filter(c => c.mode === 'Hybrid').length})
              </button>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong>{filteredCourses.length}</strong> active course offerings
            </span>
          </div>

          {/* Courses Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map(course => {
              const appliedCount = mentees.filter(m => m.courseId === course.id).length;
              const pendingCount = mentees.filter(m => m.courseId === course.id && m.permissionStatus === 'pending').length;
              const activeCount = mentees.filter(m => m.courseId === course.id && m.permissionStatus === 'approved').length;

              const isOffline = course.mode === 'Classroom';
              const isOnline = course.mode === 'Live Online' || course.mode === 'Self-paced';
              const isHybrid = course.mode === 'Hybrid';

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header line: Mode Badge & Category */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isOffline && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            Offline Lab / Classroom
                          </span>
                        )}
                        {isOnline && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                            <Globe className="w-3 h-3 text-blue-600" />
                            {course.mode}
                          </span>
                        )}
                        {isHybrid && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                            <Laptop className="w-3 h-3 text-purple-600" />
                            Hybrid (Lab + Virtual)
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {course.category}
                        </span>
                        {(course.isClosed || course.status === 'Closed' || course.status === 'Archived') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-extrabold shadow-2xs">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Bookings Closed
                          </span>
                        )}
                        {((course.videos && course.videos.length > 0) || course.videoUrl) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                            <Film className="w-3 h-3 text-blue-600" />
                            {course.videos && course.videos.length > 1
                              ? `${course.videos.length} Video Lectures`
                              : '1 Video Lecture'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {course.postedDate && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Posted: {course.postedDate}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h3>

                    {/* Faculty Mentor Details */}
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {course.mentorName ? course.mentorName[0] : 'F'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Mentor &amp; Dept</span>
                        <p className="font-bold text-slate-800 truncate">{course.mentorName || 'Faculty Instructor'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{course.department || course.provider}</p>
                      </div>
                    </div>

                    {/* Venue / Link & Schedule */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">
                          <strong>Venue/Platform:</strong> {course.venueOrLink || (isOffline ? 'Department Labs' : 'Virtual Classroom')}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span><strong>Schedule:</strong> {course.scheduleTiming || '2 Sessions/Week'}</span>
                      </div>
                    </div>

                    {/* Skills Covered Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.skillsGained.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                      {course.skillsGained.length > 4 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-semibold">
                          +{course.skillsGained.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Metrics & Actions */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Applicants</span>
                          <span className="font-bold text-slate-800">{appliedCount} Applied</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Enrolled Mentees</span>
                          <span className="font-bold text-emerald-600">{activeCount} / {course.maxSeats || 60}</span>
                        </div>
                      </div>

                      {pendingCount > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold animate-pulse">
                          {pendingCount} Pending Approval
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedCourseFilter(course.id);
                          setActiveTabKey('permissions');
                        }}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 min-w-[120px]"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        Review Applicants
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCourseFilter(course.id);
                          setActiveTabKey('progress');
                        }}
                        className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 min-w-[130px]"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                        Track Progress
                      </button>

                      {course.isClosed || course.status === 'Closed' || course.status === 'Archived' ? (
                        <button
                          onClick={() => handleToggleCourseBookings(course)}
                          className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                          title="Reopen cohort enrollments for students"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Reopen Bookings
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleCourseBookings(course)}
                          className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                          title="Stop new student enrollments / applications"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Close Bookings
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedCourseDetails(course)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                        title="View Syllabus & Modules"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No courses found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No online or offline courses match your current search and mode filter. Try changing filters or click Upload New Course.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: APPLICANTS & PERMISSION MANAGEMENT (APPROVAL QUEUE)
          ───────────────────────────────────────────────────────────── */}
      {activeTabKey === 'permissions' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Status:</span>
              <button
                onClick={() => setPermissionStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  permissionStatusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Applications ({mentees.length})
              </button>
              <button
                onClick={() => setPermissionStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  permissionStatusFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Pending Approval ({pendingApprovalsCount})
              </button>
              <button
                onClick={() => setPermissionStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  permissionStatusFilter === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved &amp; Enrolled ({totalApprovedMentees})
              </button>
              <button
                onClick={() => setPermissionStatusFilter('declined')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  permissionStatusFilter === 'declined'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Declined ({mentees.filter(m => m.permissionStatus === 'declined').length})
              </button>
            </div>

            {/* Course Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filter Course:</span>
              <select
                value={selectedCourseFilter}
                onChange={e => setSelectedCourseFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Courses &amp; Workshops</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({c.mode})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applicant Cards List */}
          <div className="space-y-4">
            {filteredApplicants.map(applicant => {
              const isPending = applicant.permissionStatus === 'pending';
              const isApproved = applicant.permissionStatus === 'approved';
              const isDeclined = applicant.permissionStatus === 'declined';

              return (
                <div
                  key={applicant.id}
                  className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all shadow-xs ${
                    isPending
                      ? 'border-amber-200 hover:border-amber-300'
                      : isApproved
                      ? 'border-slate-200 hover:border-emerald-300'
                      : 'border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Student Identity & Course Details */}
                    <div className="flex items-start gap-4">
                      <img
                        src={applicant.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={applicant.studentName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">{applicant.studentName}</h4>
                          <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                            {applicant.usn}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">
                            CGPA {applicant.cgpa.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                          {applicant.department} • {applicant.studentEmail}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-slate-400 font-medium">Applied Course:</span>
                          <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                            {applicant.courseTitle}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            applicant.courseMode === 'Classroom'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {applicant.courseMode}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            • Applied on {new Date(applicant.appliedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Statement of Purpose / Goal */}
                        {applicant.statementOfPurpose && (
                          <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                            &ldquo;{applicant.statementOfPurpose}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Badge & Permission Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 flex-shrink-0">
                      {isPending && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Awaiting Permission
                          </span>
                        </div>
                      )}

                      {isApproved && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Permission Granted • Enrolled
                          </span>
                        </div>
                      )}

                      {isDeclined && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                            <X className="w-3.5 h-3.5 text-rose-600" />
                            Application Declined
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {isPending && (
                          <>
                            <button
                              onClick={() => handlePermissionAction(applicant.id, 'approved')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              Grant Permission
                            </button>
                            <button
                              onClick={() => {
                                const note = prompt('Reason for declining (optional):', 'Cohort capacity reached for current batch.');
                                if (note !== null) {
                                  handlePermissionAction(applicant.id, 'declined', note);
                                }
                              }}
                              className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <button
                            onClick={() => openProgressModal(applicant)}
                            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                            Update Progress ({applicant.progressPercentage}%)
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActiveCallContact({
                              name: applicant.studentName,
                              role: applicant.department,
                              company: applicant.courseTitle,
                              avatar: applicant.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                              phone: '+91 98765 43210'
                            });
                            setIsPhoneCallOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Contact Mentee"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredApplicants.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No applications match your filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are currently no applicant mentees with status &ldquo;{permissionStatusFilter}&rdquo; in this view.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: MENTEE PROGRESS COCKPIT (FOR STARTED COURSES)
          ───────────────────────────────────────────────────────────── */}
      {activeTabKey === 'progress' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Progress State:</span>
              <button
                onClick={() => setProgressLevelFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  progressLevelFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Enrolled Mentees ({activeMentees.length})
              </button>
              <button
                onClick={() => setProgressLevelFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  progressLevelFilter === 'active'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                In Progress (Ongoing)
              </button>
              <button
                onClick={() => setProgressLevelFilter('certified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  progressLevelFilter === 'certified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Completed &amp; Certified
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filter Course:</span>
              <select
                value={selectedCourseFilter}
                onChange={e => setSelectedCourseFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Enrolled Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Cards Table */}
          <div className="grid grid-cols-1 gap-4">
            {activeMentees.map(mentee => {
              const isCertified = Boolean(mentee.isCertified);

              return (
                <div
                  key={mentee.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={mentee.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={mentee.studentName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">{mentee.studentName}</h4>
                          <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                            {mentee.usn}
                          </span>
                          {isCertified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                              <Award className="w-3 h-3 text-emerald-600" />
                              Certified Graduate
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {mentee.department} • Mentor: <strong>{mentee.mentorName || 'Faculty Lead'}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Course Name & Mode Pill */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                        {mentee.courseTitle}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        mentee.courseMode === 'Classroom'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {mentee.courseMode}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Milestone Status */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Current Milestone / Module</span>
                        <p className="font-bold text-slate-800">{mentee.currentModule || 'Module 1: Orientation'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Course Completion</span>
                        <p className="text-base font-black text-indigo-600">{mentee.progressPercentage}%</p>
                      </div>
                    </div>

                    {/* Visual Animated Progress Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          mentee.progressPercentage === 100
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                        style={{ width: `${mentee.progressPercentage}%` }}
                      />
                    </div>

                    {/* Stats strip: Assignments, Assessment Score, Last Active */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Assignments / Labs</span>
                        <span className="text-xs font-bold text-slate-800">
                          {mentee.completedAssignments} of {mentee.totalAssignments} Completed
                        </span>
                      </div>

                      <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">AI Proctored Exam</span>
                        <span className={`text-xs font-bold ${
                          mentee.isDisqualified
                            ? 'text-rose-600'
                            : mentee.testStatus === 'passed'
                              ? 'text-emerald-600'
                              : mentee.testStatus === 'failed'
                                ? 'text-amber-600'
                                : 'text-slate-600'
                        }`}>
                          {mentee.isDisqualified
                            ? '🚫 Disqualified'
                            : mentee.testStatus === 'passed'
                              ? `Passed (${mentee.testScore || mentee.assessmentScore}%)`
                              : mentee.testStatus === 'failed'
                                ? `Failed (${mentee.testScore || mentee.assessmentScore}%)`
                                : 'Pending Test'}
                        </span>
                      </div>

                      <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Last Active Date</span>
                        <span className="text-xs font-bold text-slate-600">
                          {mentee.lastActiveAt ? new Date(mentee.lastActiveAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Proctoring Disqualification Warning Banner */}
                    {mentee.isDisqualified && (
                      <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>🚫 Academic Integrity: Exited Fullscreen 3 Times during Assessment (Certification Blocked)</span>
                        </span>
                        <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-mono">
                          3 Strikes
                        </span>
                      </div>
                    )}

                    {/* Mentor Notes / Coaching Guidance */}
                    {mentee.mentorNotes && (
                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <span className="font-bold text-slate-700">Mentor Feedback: </span>
                        {mentee.mentorNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-400">
                      Started: {mentee.startedAt ? new Date(mentee.startedAt).toLocaleDateString() : 'Cohort Launch'}
                    </span>

                    <div className="flex items-center gap-2">
                      {Boolean(mentee.isCertified || mentee.progressPercentage === 100 || mentee.issuedCertificateId) && (
                        <button
                          onClick={() => setSelectedMenteeForCertificate(mentee)}
                          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer animate-in fade-in"
                          title="View official automated completion certificate"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-100" />
                          View Certificate
                        </button>
                      )}

                      <button
                        onClick={() => openProgressModal(mentee)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Advance Milestone &amp; Score
                      </button>

                      <button
                        onClick={() => {
                          const advice = prompt(`Add mentor coaching note for ${mentee.studentName}:`, mentee.mentorNotes || '');
                          if (advice !== null) {
                            handleSaveProgress();
                          }
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Log Feedback
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeMentees.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <BarChart2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No active mentee progress records</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Once you grant permissions in the Permission Requests tab, your mentees will automatically appear here with live milestone tracking.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: UPLOAD NEW ONLINE OR OFFLINE COURSE
          ───────────────────────────────────────────────────────────── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Upload New Course for Mentees</h3>
                  <p className="text-xs text-slate-500">Configure online webinars, virtual cohorts, or physical laboratory workshops</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadCourseSubmit} className="p-6 space-y-5">
              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course / Workshop Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Deep Learning with PyTorch & GPU Acceleration"
                  value={newCourse.title}
                  onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Delivery Format & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Delivery Mode <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCourse.mode}
                    onChange={e => setNewCourse({ ...newCourse, mode: e.target.value as any })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800 bg-white"
                  >
                    <option value="Live Online">🌐 Live Online (Virtual Classroom / Google Meet)</option>
                    <option value="Classroom">🏫 Classroom (Offline On-Campus Lab / Hardware Workshop)</option>
                    <option value="Hybrid">⚡ Hybrid (Classroom Lab + Online Theory)</option>
                    <option value="Self-paced">📖 Self-paced Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Program Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCourse.category}
                    onChange={e => setNewCourse({ ...newCourse, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800 bg-white"
                  >
                    <option value="Course">Semester Course / Elective</option>
                    <option value="Workshop">Hands-on Lab Workshop</option>
                    <option value="Bootcamp">Intensive Skills Bootcamp</option>
                    <option value="Certification">Accredited Certification Track</option>
                  </select>
                </div>
              </div>

              {/* Mentor / Instructor & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty Mentor / Instructor Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Ramesh Sharma"
                    value={newCourse.mentorName}
                    onChange={e => setNewCourse({ ...newCourse, mentorName: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Host Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCourse.department}
                    onChange={e => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800 bg-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                    <option value="Information Science & Engineering">Information Science &amp; Engineering</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence &amp; Data Science</option>
                    <option value="Electronics & Communication">Electronics &amp; Communication</option>
                    <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              {/* Physical Venue OR Meeting Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {newCourse.mode === 'Classroom' ? 'Lab / Classroom Venue' : 'Meeting URL / LMS Portal'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      newCourse.mode === 'Classroom'
                        ? 'e.g., IoT & Robotics Lab 402, Block C'
                        : 'e.g., meet.google.com/cs-batch-2026'
                    }
                    value={newCourse.venueOrLink}
                    onChange={e => setNewCourse({ ...newCourse, venueOrLink: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Batch Schedule &amp; Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Every Tue & Thu • 4:00 PM - 6:00 PM"
                    value={newCourse.scheduleTiming}
                    onChange={e => setNewCourse({ ...newCourse, scheduleTiming: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Duration, Level, Capacity, Posting Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 8 Weeks (24 Hours)"
                    value={newCourse.duration}
                    onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={newCourse.level}
                    onChange={e => setNewCourse({ ...newCourse, level: e.target.value as any })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity (Seats)</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={newCourse.maxSeats}
                    onChange={e => setNewCourse({ ...newCourse, maxSeats: parseInt(e.target.value, 10) || 60 })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Posting / Announcement Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newCourse.postedDate}
                    onChange={e => setNewCourse({ ...newCourse, postedDate: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Skills Gained */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skills Covered (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., PyTorch, Transformers, LangChain, Vector Databases"
                  value={newCourse.skillsGained}
                  onChange={e => setNewCourse({ ...newCourse, skillsGained: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description & Syllabus Modules */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Overview &amp; Learning Objectives
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the outcomes of this course, hands-on projects, and placement benefits..."
                  value={newCourse.description}
                  onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  ONLINE VIDEO CURRICULUM & MULTI-LECTURE PLAYLIST (FOR ENROLLED STUDENTS)
                  ───────────────────────────────────────────────────────────── */}
              <div className="p-5 bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-purple-50/90 rounded-3xl border-2 border-blue-300 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md">
                      <Film className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-slate-900">
                          Course Video Curriculum &amp; Multi-Lecture Playlist
                        </h4>
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Multi-Video Enabled
                        </span>
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {newCourse.videos.length} {newCourse.videos.length === 1 ? 'Video' : 'Videos'} Configured
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Add multiple video lectures, lab walkthroughs, or capstone demos under this single course. Students can navigate between all lectures in the course workspace player.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVideoItem}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Video
                  </button>
                </div>

                {/* 1-Click Multi-Video Curriculum Presets */}
                <div className="bg-white/80 p-3 rounded-2xl border border-blue-200/70 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    ⚡ 1-Click Multi-Lecture Curriculum Presets:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyVideoPreset([
                        { id: 'v-preset-fs-1', title: 'Lecture 1: Modern Full-Stack Architecture, React 18 & State', url: 'https://www.youtube.com/embed/nu_pCVPKzTk', duration: '55 mins', moduleIndex: 1 },
                        { id: 'v-preset-fs-2', title: 'Lecture 2: Scalable Node.js, Express & Database APIs', url: 'https://www.youtube.com/embed/hnj-7XwTYRI', duration: '48 mins', moduleIndex: 2 },
                        { id: 'v-preset-fs-3', title: 'Lecture 3: Production Docker Deployment & Security Hardening', url: 'https://www.youtube.com/embed/X48VuDVv0do', duration: '52 mins', moduleIndex: 3 }
                      ])}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[11px] font-bold border border-blue-200 transition-all cursor-pointer shadow-2xs"
                    >
                      🚀 Full-Stack Web (3 Lectures)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyVideoPreset([
                        { id: 'v-preset-ai-1', title: 'Lecture 1: Deep Learning Foundations & Neural Networks', url: 'https://www.youtube.com/embed/aircAruvnKk', duration: '60 mins', moduleIndex: 1 },
                        { id: 'v-preset-ai-2', title: 'Lecture 2: Computer Vision, CNNs & Feature Representations', url: 'https://www.youtube.com/embed/kCc8FmEb1nY', duration: '50 mins', moduleIndex: 2 },
                        { id: 'v-preset-ai-3', title: 'Lecture 3: Transformers & Modern Generative AI Architectures', url: 'https://www.youtube.com/embed/SOTamWNgDKc', duration: '65 mins', moduleIndex: 3 }
                      ])}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold border border-indigo-200 transition-all cursor-pointer shadow-2xs"
                    >
                      🧠 AI &amp; Deep Learning (3 Lectures)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyVideoPreset([
                        { id: 'v-preset-iot-1', title: 'Lab 1: Microcontroller Architecture & Sensor Interfacing', url: 'https://www.youtube.com/embed/hnj-7XwTYRI', duration: '48 mins', moduleIndex: 1 },
                        { id: 'v-preset-iot-2', title: 'Lab 2: FreeRTOS Real-Time Kernel Scheduling & Inter-Task Queues', url: 'https://www.youtube.com/embed/aircAruvnKk', duration: '45 mins', moduleIndex: 2 },
                        { id: 'v-preset-iot-3', title: 'Lab 3: Autonomous Mobile Robotics & Hardware Bus Protocols', url: 'https://www.youtube.com/embed/3SAxXUIre28', duration: '55 mins', moduleIndex: 3 }
                      ])}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-[11px] font-bold border border-purple-200 transition-all cursor-pointer shadow-2xs"
                    >
                      🤖 Embedded IoT &amp; Robotics (3 Labs)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyVideoPreset([
                        { id: 'v-preset-cloud-1', title: 'Lecture 1: Enterprise Cloud Architecture & Linux Containers', url: 'https://www.youtube.com/embed/X48VuDVv0do', duration: '45 mins', moduleIndex: 1 },
                        { id: 'v-preset-cloud-2', title: 'Lecture 2: Kubernetes Cluster Orchestration & Pod Networking', url: 'https://www.youtube.com/embed/nu_pCVPKzTk', duration: '50 mins', moduleIndex: 2 },
                        { id: 'v-preset-cloud-3', title: 'Lecture 3: Automated CI/CD Pipelines & Infrastructure as Code', url: 'https://www.youtube.com/embed/4m9j6hlbf4g', duration: '58 mins', moduleIndex: 3 }
                      ])}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[11px] font-bold border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                    >
                      ☁️ Cloud &amp; DevOps (3 Lectures)
                    </button>
                  </div>
                </div>

                {/* Video Cards List */}
                <div className="space-y-3">
                  {newCourse.videos.map((vid, idx) => (
                    <div
                      key={vid.id || idx}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 relative transition-all hover:border-blue-300"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Video Lecture #{idx + 1}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              Primary / Intro
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveVideoItem(idx, 'up')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === newCourse.videos.length - 1}
                            onClick={() => handleMoveVideoItem(idx, 'down')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideoItem(idx)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-5">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Lecture Title <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Lecture 1: Architecture & Foundations"
                            value={vid.title}
                            onChange={e => handleUpdateVideoItem(idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                          />
                        </div>

                        <div className="md:col-span-5">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Video URL <span className="text-blue-600 font-normal">(YouTube / Vimeo / MP4)</span>
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={vid.url}
                            onChange={e => handleUpdateVideoItem(idx, 'url', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            placeholder="45 mins"
                            value={vid.duration || '45 mins'}
                            onChange={e => handleUpdateVideoItem(idx, 'duration', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                          />
                        </div>
                      </div>

                      {vid.url && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">Attached URL: <strong>{vid.url}</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Add button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleAddVideoItem}
                    className="px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    + Add Another Lecture Video
                  </button>

                  <span className="text-xs text-slate-500 font-medium">
                    Total: <strong className="text-blue-700">{newCourse.videos.filter(v => v.url.trim()).length}</strong> ready videos
                  </span>
                </div>
              </div>
              <div className="p-5 bg-gradient-to-br from-amber-50/70 via-slate-50 to-indigo-50/60 rounded-3xl border-2 border-amber-300/80 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">
                          Course Completion Certificate &amp; Auto-Issue Setup
                        </h4>
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Submit the official credential template to be automatically awarded to participants upon 100% course completion.
                      </p>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-amber-200 text-xs font-bold text-slate-800 cursor-pointer shadow-xs">
                    <input
                      type="checkbox"
                      checked={newCourse.autoIssueCertificate}
                      onChange={e => setNewCourse({ ...newCourse, autoIssueCertificate: e.target.checked, hasCertification: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Auto-Issue on 100% Completion</span>
                  </label>
                </div>

                {/* Certificate Details Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Certificate Official Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={newCourse.autoIssueCertificate}
                      placeholder="e.g., Certificate of Advanced Full-Stack Web Engineering"
                      value={newCourse.certificateTemplateTitle}
                      onChange={e => setNewCourse({ ...newCourse, certificateTemplateTitle: e.target.value })}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Authorized Signatory (Faculty / Dean) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={newCourse.autoIssueCertificate}
                      placeholder="e.g., Dr. Ramesh Sharma"
                      value={newCourse.certificateSignatoryName}
                      onChange={e => setNewCourse({ ...newCourse, certificateSignatoryName: e.target.value })}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Signatory Designation / Academic Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Dean of Faculty &amp; Professor of CS"
                      value={newCourse.certificateSignatoryTitle}
                      onChange={e => setNewCourse({ ...newCourse, certificateSignatoryTitle: e.target.value })}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Citation / Conferred Achievement Statement <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., has demonstrated exemplary technical competence, completed all practical laboratory milestones, and fulfilled all project capstone criteria with distinction."
                      value={newCourse.certificateCitation}
                      onChange={e => setNewCourse({ ...newCourse, certificateCitation: e.target.value })}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Credential ID Prefix
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CS-FSW or APEX-CERT"
                      value={newCourse.certificateCredentialPrefix}
                      onChange={e => setNewCourse({ ...newCourse, certificateCredentialPrefix: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Preview: {newCourse.certificateCredentialPrefix || 'APEX-CERT'}-2026-USN
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Certificate Design Theme
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {[
                        { id: 'gold', label: 'Gold Luxury', color: 'bg-amber-100 border-amber-400 text-amber-900' },
                        { id: 'blue', label: 'Royal Blue', color: 'bg-blue-100 border-blue-400 text-blue-900' },
                        { id: 'emerald', label: 'Emerald', color: 'bg-emerald-100 border-emerald-400 text-emerald-900' },
                        { id: 'indigo', label: 'Cyber Indigo', color: 'bg-indigo-100 border-indigo-400 text-indigo-900' }
                      ].map(theme => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setNewCourse({ ...newCourse, certificateTemplateStyle: theme.id as any })}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            newCourse.certificateTemplateStyle === theme.id
                              ? `${theme.color} ring-2 ring-slate-900 shadow-xs font-extrabold`
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    LIVE INTERACTIVE CERTIFICATE PREVIEW CARD
                    ───────────────────────────────────────────────────────────── */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Live Certificate Output Preview (Awarded to Participant)
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                      Interactive Preview
                    </span>
                  </div>

                  <div className={`p-6 rounded-2xl border-4 transition-all duration-300 relative overflow-hidden shadow-inner ${
                    newCourse.certificateTemplateStyle === 'gold'
                      ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30'
                      : newCourse.certificateTemplateStyle === 'blue'
                      ? 'border-blue-500 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30'
                      : newCourse.certificateTemplateStyle === 'emerald'
                      ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/30'
                      : 'border-indigo-500 bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/30'
                  }`}>
                    {/* Ornate Corner Accents */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-slate-400/60 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-slate-400/60 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-slate-400/60 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-slate-400/60 pointer-events-none" />

                    {/* Certificate Content */}
                    <div className="text-center space-y-2.5 max-w-xl mx-auto">
                      {/* Institutional Seal & Heading */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-500">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <span>Apex Institute of Technology • Academic Council</span>
                        </div>
                        <h3 className="text-sm font-black tracking-widest uppercase text-slate-800">
                          {newCourse.certificateTemplateTitle || 'Certificate of Completion'}
                        </h3>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                      </div>

                      <p className="text-[11px] text-slate-500 italic">
                        This credential officially certifies that
                      </p>

                      {/* Participant Placeholder */}
                      <div className="py-1">
                        <p className="text-base font-black text-slate-900 tracking-wide font-serif">
                          [Student Participant Name]
                        </p>
                        <p className="text-[10px] text-slate-500">
                          USN: 1AP23CS000 • Department of {newCourse.department}
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {newCourse.certificateCitation || 'has successfully completed all lecture cohorts, hands-on lab milestones, and the capstone assessment with exemplary distinction.'}
                      </p>

                      <div className="py-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">for completing</span>
                        <p className="text-xs font-black text-indigo-900">
                          {newCourse.title || 'Course Title Preview'}
                        </p>
                      </div>

                      {/* Bottom Footer: Verification, Seal, Signatures */}
                      <div className="pt-4 mt-2 border-t border-slate-200/80 grid grid-cols-3 items-end gap-2 text-left">
                        {/* Credential ID */}
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Credential Verification</span>
                          <span className="text-[10px] font-mono font-bold text-slate-700 block">
                            {newCourse.certificateCredentialPrefix || 'APEX-CERT'}-2026-X7849
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold block">
                            ✓ Blockchain Verified
                          </span>
                        </div>

                        {/* Gold Seal Badge */}
                        <div className="text-center flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center text-white">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <span className="text-[8px] font-black uppercase text-amber-900 tracking-wider mt-0.5">
                            Official Seal
                          </span>
                        </div>

                        {/* Signatory Signature */}
                        <div className="text-right space-y-0.5">
                          <div className="font-serif italic text-xs font-bold text-indigo-950 pr-1">
                            {newCourse.certificateSignatoryName || 'Dr. Ramesh Sharma'}
                          </div>
                          <div className="w-24 h-px bg-slate-300 ml-auto" />
                          <span className="text-[10px] font-bold text-slate-800 block">
                            {newCourse.certificateSignatoryName || 'Authorized Signatory'}
                          </span>
                          <span className="text-[8px] text-slate-500 block leading-tight">
                            {newCourse.certificateSignatoryTitle || 'Dean of Faculty & Mentor'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Publish Course to Mentees
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: UPDATE MENTEE PROGRESS & MILESTONES
          ───────────────────────────────────────────────────────────── */}
      {isProgressModalOpen && selectedMenteeForProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Mentee Progress</h3>
                <p className="text-xs text-slate-500">
                  {selectedMenteeForProgress.studentName} • {selectedMenteeForProgress.courseTitle}
                </p>
              </div>
              <button
                onClick={() => setIsProgressModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slider for Progress Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Course Progress</label>
                <span className="text-sm font-black text-indigo-600">{progressForm.progressPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressForm.progressPercentage}
                onChange={e => setProgressForm({ ...progressForm, progressPercentage: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Current Module */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Milestone / Module</label>
              <input
                type="text"
                placeholder="e.g., Module 4: REST APIs & Docker Deployment"
                value={progressForm.currentModule}
                onChange={e => setProgressForm({ ...progressForm, currentModule: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Completed Assignments / Labs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Labs Completed</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={progressForm.completedAssignments}
                  onChange={e => setProgressForm({ ...progressForm, completedAssignments: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quiz / Assessment Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressForm.assessmentScore}
                  onChange={e => setProgressForm({ ...progressForm, assessmentScore: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Mentor Coaching Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mentor Feedback &amp; Next Steps</label>
              <textarea
                rows={2}
                placeholder="Add constructive coaching notes on mentee performance..."
                value={progressForm.mentorNotes}
                onChange={e => setProgressForm({ ...progressForm, mentorNotes: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mark Certified */}
            {selectedMenteeForProgress?.isDisqualified ? (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-black text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Certification Locked (Proctoring Violation)</span>
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  This student exited full screen 3 times during the online course test. Academic integrity policy prohibits issuing a completion certificate.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="isCertifiedToggle"
                  checked={progressForm.isCertified}
                  onChange={e => setProgressForm({ ...progressForm, isCertified: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isCertifiedToggle" className="text-xs font-bold text-emerald-900 cursor-pointer">
                  Award Course Completion Certificate (Course Completed)
                </label>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsProgressModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProgress}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: VIEW COURSE DETAILS & SYLLABUS
          ───────────────────────────────────────────────────────────── */}
      {selectedCourseDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Course Syllabus &amp; Modules</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedCourseDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">{selectedCourseDetails.description}</p>

              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pt-2">Structured Syllabus:</h4>
              <div className="space-y-2">
                {selectedCourseDetails.syllabusModules?.map(mod => (
                  <div key={mod.moduleNumber} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Module {mod.moduleNumber}: {mod.title}</span>
                      <span className="text-slate-400 text-[11px]">{mod.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mod.topics.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: OFFICIALLY ISSUED COMPLETION CERTIFICATE VIEWER
          ───────────────────────────────────────────────────────────── */}
      {selectedMenteeForCertificate && (() => {
        const certCourse = courses.find(c => c.id === selectedMenteeForCertificate.courseId);
        const certTitle = certCourse?.certificateTemplateTitle || 'Certificate of Advanced Competency & Mastery';
        const certSignatory = certCourse?.certificateSignatoryName || selectedMenteeForCertificate.mentorName || 'Dr. Ramesh Sharma';
        const certSignatoryTitle = certCourse?.certificateSignatoryTitle || 'Dean of Academic Faculty & Senior Mentor';
        const certCitation = certCourse?.certificateCitation || 'has demonstrated exemplary technical competence, completed all practical laboratory milestones, and fulfilled all project capstone criteria with distinction.';
        const certStyle = certCourse?.certificateTemplateStyle || 'gold';
        const credentialId = selectedMenteeForCertificate.issuedCertificateId || `${certCourse?.certificateCredentialPrefix || 'APEX-CERT'}-2026-${selectedMenteeForCertificate.usn}`;
        const issueDateFormatted = selectedMenteeForCertificate.certificateIssuedAt
          ? new Date(selectedMenteeForCertificate.certificateIssuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">Verified Course Completion Certificate</h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Auto-Issued
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Awarded automatically to {selectedMenteeForCertificate.studentName} upon 100% course completion
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / PDF
                  </button>
                  <button
                    onClick={() => setSelectedMenteeForCertificate(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Verified Certificate Card */}
              <div className={`p-8 rounded-3xl border-4 transition-all relative overflow-hidden shadow-xl ${
                certStyle === 'gold'
                  ? 'border-amber-400 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30'
                  : certStyle === 'blue'
                  ? 'border-blue-500 bg-gradient-to-b from-blue-50/60 via-white to-blue-50/30'
                  : certStyle === 'emerald'
                  ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30'
                  : 'border-indigo-500 bg-gradient-to-b from-indigo-50/60 via-white to-indigo-50/30'
              }`}>
                {/* Ornate Corner Laurel Accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-slate-400/80 pointer-events-none" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-slate-400/80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-slate-400/80 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-slate-400/80 pointer-events-none" />

                <div className="text-center space-y-4 max-w-xl mx-auto">
                  {/* Institutional Header */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-slate-600">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      <span>Apex Institute of Technology</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Academic Council &amp; Faculty Board of Mentorship
                    </span>
                    <h2 className="text-lg sm:text-xl font-black tracking-widest uppercase text-slate-900 pt-1 font-serif">
                      {certTitle}
                    </h2>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-1" />
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    This official diploma certifies that
                  </p>

                  {/* Recipient Student */}
                  <div className="py-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-wide font-serif">
                      {selectedMenteeForCertificate.studentName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      USN: <span className="font-mono text-slate-700">{selectedMenteeForCertificate.usn}</span> • Department of {selectedMenteeForCertificate.department}
                    </p>
                  </div>

                  {/* Citation text */}
                  <p className="text-xs text-slate-700 leading-relaxed max-w-lg mx-auto">
                    {certCitation}
                  </p>

                  {/* Course Title */}
                  <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 max-w-md mx-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Course Completed With Distinction
                    </span>
                    <h4 className="text-sm font-black text-indigo-900">
                      {selectedMenteeForCertificate.courseTitle}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Mode: {selectedMenteeForCertificate.courseMode} • Evaluation Score: {selectedMenteeForCertificate.assessmentScore ? `${selectedMenteeForCertificate.assessmentScore}%` : '98.0%'}
                    </span>
                  </div>

                  {/* Footer: Credential ID, Seal, Signature */}
                  <div className="pt-6 mt-4 border-t border-slate-200 grid grid-cols-3 items-end gap-3 text-left">
                    {/* Left: Credential Details */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Verified Credential ID
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 block">
                        {credentialId}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Issued: {issueDateFormatted}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Synchronized in Digital Portfolio
                      </span>
                    </div>

                    {/* Center: Official Seal Badge */}
                    <div className="text-center flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-1 shadow-lg flex items-center justify-center text-white">
                        <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center text-center">
                          <ShieldCheck className="w-7 h-7" />
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase text-amber-900 tracking-wider mt-1 block">
                        Official Academic Seal
                      </span>
                    </div>

                    {/* Right: Signature */}
                    <div className="text-right space-y-1">
                      <div className="font-serif italic text-sm font-bold text-indigo-950 pr-1">
                        {certSignatory}
                      </div>
                      <div className="w-28 h-px bg-slate-300 ml-auto" />
                      <span className="text-xs font-bold text-slate-800 block">
                        {certSignatory}
                      </span>
                      <span className="text-[9px] text-slate-500 block leading-tight">
                        {certSignatoryTitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status footer notice */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    This credential has been automatically deposited into <strong>{selectedMenteeForCertificate.studentName}</strong>'s Digital Portfolio under Verified Certifications.
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMenteeForCertificate(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default InstitutionCoursesView;
