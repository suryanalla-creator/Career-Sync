import {
  StudentProfile,
  Opportunity,
  LearningProgram,
  ApplicationTrackerItem,
  InternshipRecord,
  ProjectItem,
  CertificationItem,
  Mentor,
  EventItem,
  Conversation,
  NotificationItem,
  AssessmentQuestion,
  Candidate,
  PlacementDrive,
  CollaborationInitiative,
  SkillCategoryScore,
  SkillGapAnalysis,
  CareerPathNode
} from '../types';

export const mockStudentProfile: StudentProfile = {
  id: 'std-101',
  studentId: '#8492019482',
  name: 'Student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'student@careersync.com',
  phone: '',
  college: 'Apex Institute of Technology, Bangalore',
  degree: 'Bachelor of Technology (B.Tech)',
  department: 'Computer Science & Engineering',
  graduationYear: 2026,
  location: '',
  bio: '',
  cgpa: 0,
  profileCompletion: 20,
  careerInterests: ['Full Stack Development', 'AI/ML Systems', 'Cloud DevOps', 'Data Engineering'],
  preferredJobRoles: ['Software Engineer', 'AI/ML Engineer', 'Full Stack Developer', 'Cloud Associate'],
  preferredIndustries: ['Information Technology', 'Fintech', 'HealthTech', 'SaaS'],
  resumeUrl: '',
  overallSkillScore: 0,
  technicalSkillScore: 0,
  softSkillScore: 0,
  industryReadinessScore: 0,
  isVerified: false,
  socials: {
    github: '',
    linkedin: '',
    portfolio: ''
  }
};

export const mockAcademicianProfile: any = {
  id: 'acad-01',
  name: 'Dr. Ramesh Sharma',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  email: 'ramesh.sharma@apextech.edu.in',
  phone: '+91 98765 12345',
  college: 'Apex Institute of Technology, Bangalore',
  department: 'Computer Science & Engineering',
  designation: 'Professor & Head of Department',
  experienceYears: 18,
  specialization: ['Artificial Intelligence', 'Distributed Systems'],
  qualification: 'Ph.D. in Computer Science',
  publicationsCount: 24,
  patentsCount: 3,
  consultancyProjectsCount: 5,
  fdpsAttendedCount: 12
};

export const mockSkillBreakdown: SkillCategoryScore[] = [
  { category: 'Technical Skills', score: 82, benchmark: 75 },
  { category: 'Data & AI', score: 76, benchmark: 68 },
  { category: 'Communication', score: 88, benchmark: 72 },
  { category: 'Problem Solving', score: 85, benchmark: 78 },
  { category: 'System Architecture', score: 64, benchmark: 74 }
];

export const mockSkillGapAnalysis: SkillGapAnalysis = {
  strengths: ['Python', 'SQL & Relational DBs', 'React & TypeScript', 'RESTful APIs', 'Team Communication'],
  skillsToImprove: ['Cloud Computing (AWS/GCP)', 'Distributed System Design', 'Docker & Kubernetes', 'Vector DBs / RAG'],
  recommendedSkills: [
    {
      name: 'Cloud Computing (AWS/Azure)',
      importance: 'High',
      demandGrowth: '+38% YoY',
      reason: 'Required by 85% of your target Software Engineer and Backend roles.'
    },
    {
      name: 'Microservices & Docker',
      importance: 'High',
      demandGrowth: '+29% YoY',
      reason: 'Essential for modern full-stack development and campus placement tests.'
    },
    {
      name: 'System Design & Scalability',
      importance: 'Medium',
      demandGrowth: '+24% YoY',
      reason: 'Core topic asked during Tier-1 product company technical interviews.'
    }
  ]
};

export const mockCareerPathRoadmap: CareerPathNode[] = [
  {
    id: 'cp-1',
    stepNumber: 1,
    title: 'CS Core Fundamentals',
    roleLevel: 'College Core Foundation',
    requiredSkills: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'DBMS', 'OS Concepts'],
    currentSkillLevel: 88,
    targetSkillLevel: 85,
    recommendedCourses: ['Advanced DSA in C++/Java', 'Database Systems Engineering'],
    recommendedCertifications: ['LeetCode Top 150 Badge', 'HackerRank Problem Solving (Gold)'],
    recommendedProjects: ['Custom In-Memory Key-Value Store', 'B-Tree Database Indexer'],
    relevantJobRoles: ['SDE Intern', 'Software Trainee'],
    status: 'completed'
  },
  {
    id: 'cp-2',
    stepNumber: 2,
    title: 'Modern Web & API Engineering',
    roleLevel: 'Full Stack Foundation',
    requiredSkills: ['React', 'TypeScript', 'Node.js/Express', 'PostgreSQL', 'RESTful Design'],
    currentSkillLevel: 84,
    targetSkillLevel: 80,
    recommendedCourses: ['Production TypeScript & Next.js', 'Clean Architecture APIs'],
    recommendedCertifications: ['Meta Front-End Developer Professional Certificate'],
    recommendedProjects: ['Career Sync Portal UI', 'Campus Marketplace Platform'],
    relevantJobRoles: ['Full Stack Developer', 'Frontend Engineer'],
    status: 'completed'
  },
  {
    id: 'cp-3',
    stepNumber: 3,
    title: 'Cloud & DevOps Acceleration',
    roleLevel: 'Industry Ready Associate',
    requiredSkills: ['AWS Core Services', 'Docker Containers', 'CI/CD Pipelines', 'Linux Shell'],
    currentSkillLevel: 62,
    targetSkillLevel: 78,
    recommendedCourses: ['AWS Cloud Solutions Architect Path', 'Docker & Kubernetes Bootcamp'],
    recommendedCertifications: ['AWS Certified Cloud Practitioner', 'Docker Certified Associate'],
    recommendedProjects: ['Containerized Microservice Deployment on AWS ECS'],
    relevantJobRoles: ['Junior DevOps Engineer', 'Cloud Software Associate'],
    status: 'in-progress'
  },
  {
    id: 'cp-4',
    stepNumber: 4,
    title: 'AI Integration & Microservices',
    roleLevel: 'Product-Grade Software Engineer',
    requiredSkills: ['System Design', 'LLM Prompt Engineering & APIs', 'Redis Caching', 'Event-Driven Kafka'],
    currentSkillLevel: 45,
    targetSkillLevel: 80,
    recommendedCourses: ['Grokking Modern System Design', 'Building LLM Apps with LangChain'],
    recommendedCertifications: ['Google Cloud Generative AI Engineer Badge'],
    recommendedProjects: ['Real-Time Analytics Pipeline with Kafka & Redis'],
    relevantJobRoles: ['Software Engineer II', 'AI Solutions Engineer'],
    status: 'target'
  }
];

export const mockOpportunities: Opportunity[] = [
  // 1. FDP Sponsored Fellowship
  {
    id: 'opp-6',
    type: 'fdp',
    title: 'Industry Immersion: Cloud-Native Microservices & AI Engineering',
    organization: 'Infosys Springboard & Apex Tech',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    location: 'Mysore Campus / Virtual',
    workMode: 'Hybrid',
    requiredSkills: ['Distributed Computing', 'Cloud Architecture', 'Curriculum Design', 'Docker'],
    salaryOrStipend: 'Sponsored Industry Fellowship + Certificate',
    duration: '2 Weeks (Full-time intensive)',
    deadline: '28 Sep 2026',
    matchPercentage: 96,
    description: 'A national professional development initiative on modern cloud deployment, observability, and gen-AI microservices.',
    responsibilities: [
      'Attend daily live architecture labs conducted by Infosys Chief System Architects',
      'Refactor curriculum modules to reflect 2026 industry standards',
      'Develop an industry-sponsored Capstone project template for final year students'
    ],
    eligibility: 'Open to engineering graduates, researchers, and technical leads across India.',
    applicantsCount: 68,
    postedDate: '3 days ago',
    isSaved: true,
    appliedStatus: null,
    careerRoleIds: ['cloud-devops-engineer'],
    targetRoles: ['Cloud & DevOps Engineer'],
    eligibleBranches: ['All B.Tech Branches', 'Computer Science & Engineering'],
    companyDetails: {
      size: '300,000+ employees',
      industry: 'IT & Digital Transformation',
      website: 'https://infosys.com',
      rating: 4.4
    }
  },
  // 22. Consultancy Grant (Tata Motors)
  {
    id: 'opp-7',
    type: 'consultancy',
    title: 'Industrial IoT Telemetry Optimization & Predictive Maintenance',
    organization: 'Tata Motors R&D',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    location: 'Pune / Remote',
    workMode: 'Hybrid',
    requiredSkills: ['Edge Computing', 'Sensor Fusion', 'Time-Series Machine Learning', 'MATLAB/Python'],
    salaryOrStipend: '₹6,50,000 Consultancy Grant',
    duration: '4 Months Project',
    deadline: '20 Oct 2026',
    matchPercentage: 91,
    description: 'Seeking researchers and technical experts to formulate mathematical filtering and edge inferencing models for EV battery degradation telemetry.',
    responsibilities: [
      'Develop real-time noise reduction filters for CAN bus sensor data streams',
      'Validate remaining useful life (RUL) prediction algorithms against physical test rigs',
      'Deliver final technical report and co-author joint intellectual property patent'
    ],
    eligibility: 'Researchers and postgraduates in Electrical, CSE, or Mechanical Engineering with demonstrated signal processing and ML publications.',
    applicantsCount: 14,
    postedDate: '5 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['embedded-iot-engineer', 'robotics-engineer'],
    targetRoles: ['Embedded Systems & IoT Engineer', 'Robotics & Automation Engineer'],
    eligibleBranches: ['Electrical & Electronics Engineering', 'Mechanical Engineering', 'Computer Science & Engineering'],
    companyDetails: {
      size: '75,000+ employees',
      industry: 'Automotive & Clean Mobility',
      website: 'https://tatamotors.com',
      rating: 4.5
    }
  },
  // 23. Joint Research (Accenture Labs)
  {
    id: 'opp-8',
    type: 'research',
    title: 'Joint Research: Responsible AI & Agentic Hallucination Mitigation',
    organization: 'Accenture Labs & IIT Bangalore',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore / Remote',
    workMode: 'Hybrid',
    requiredSkills: ['LLMs', 'Formal Verification', 'Natural Language Processing', 'Research Methodology'],
    salaryOrStipend: '₹15,00,000 Joint Research Budget',
    duration: '12 Months',
    deadline: '30 Oct 2026',
    matchPercentage: 95,
    description: 'Joint research project investigating guardrail architectures, semantic truth probes, and constraint decoding in enterprise reasoning agents.',
    responsibilities: [
      'Conduct rigorous experimental benchmarking on enterprise hallucination datasets',
      'Co-advise 2 funded PhD research scholars and student interns',
      'Publish high-impact findings at ACL, NeurIPS, or IEEE Trans on Software Engineering'
    ],
    eligibility: 'Researchers with active AI labs and proven peer-reviewed publications in NLP/ML.',
    applicantsCount: 21,
    postedDate: '1 week ago',
    isSaved: true,
    appliedStatus: null,
    careerRoleIds: ['nlp-engineer', 'ai-ml-engineer'],
    targetRoles: ['GenAI & NLP Specialist', 'AI & Machine Learning Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science'],
    companyDetails: {
      size: '700,000+ employees',
      industry: 'Global Professional Services & Innovation Labs',
      website: 'https://accenture.com',
      rating: 4.6
    }
  }
];

export const mockLearningPrograms: LearningProgram[] = [
  {
    id: 'lp-1',
    title: 'Cloud Architecture & AWS Certified Solutions Professional',
    category: 'Certification',
    provider: 'AWS Academy & TechNova',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
    duration: '8 Weeks (Self-paced + 4 Live Labs)',
    level: 'Intermediate',
    skillsGained: ['Cloud Infrastructure (AWS/GCP)', 'AWS VPC', 'EC2 & S3', 'Serverless Lambda', 'CI/CD Pipelines'],
    hasCertification: true,
    rating: 4.9,
    enrolledCount: 3420,
    deadline: 'Rolling Admission',
    description: 'Master enterprise cloud fundamentals with production labs, architectural case studies, and official voucher preparation.',
    mode: 'Live Online',
    isEnrolled: true,
    videoUrl: 'https://www.youtube.com/embed/SOTamWNgDKc',
    videoTitle: 'Module 1: Enterprise AWS Cloud Architecture, VPC & Core Infrastructure',
    videoDuration: '65 mins',
    careerRoleIds: ['cloud-devops-engineer', 'fullstack-engineer', 'backend-engineer'],
    targetRoles: ['Cloud & DevOps Engineer', 'Full Stack Software Engineer', 'Backend Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering']
  },
  {
    id: 'lp-2',
    title: 'Deep Learning & LLM Systems: From Zero to Production',
    category: 'Bootcamp',
    provider: 'DeepLearning.AI Industry Consortium',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    duration: '10 Weeks',
    level: 'Advanced',
    skillsGained: ['Deep Learning & Neural Networks', 'Transformers', 'PyTorch', 'Fine-tuning', 'Vector Search & RAG'],
    hasCertification: true,
    rating: 4.95,
    enrolledCount: 2890,
    description: 'Build real-world multimodal agents, evaluate context windows, and deploy low-latency inference pipelines on GPUs.',
    mode: 'Live Online',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/kCc8FmEb1nY',
    videoTitle: 'Lecture 1: Deep Learning & Transformers Architecture from Scratch',
    videoDuration: '75 mins',
    careerRoleIds: ['ai-ml-engineer', 'data-scientist', 'data-engineer'],
    targetRoles: ['AI & Machine Learning Engineer', 'Data Scientist', 'Data Engineer'],
    eligibleBranches: ['Artificial Intelligence & Data Science', 'Computer Science & Engineering', 'Information Technology']
  },
  {
    id: 'lp-3',
    title: 'Full Stack Next.js 15, TypeScript & Clean Microservices',
    category: 'Course',
    provider: 'Career Sync Academy & Microsoft Learn',
    logo: 'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?w=100&auto=format&fit=crop&q=80',
    duration: '6 Weeks',
    level: 'Intermediate',
    skillsGained: ['React & TypeScript', 'System Design & Scalability', 'Next.js App Router', 'RESTful APIs', 'Docker & Kubernetes'],
    hasCertification: true,
    rating: 4.8,
    enrolledCount: 4210,
    description: 'Learn modern software engineering patterns used in fast-growing tech scaleups.',
    mode: 'Self-paced',
    isEnrolled: true,
    videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
    videoTitle: 'Lecture 1: Modern Full-Stack Web Architecture, React 18 & Next.js',
    videoDuration: '55 mins',
    careerRoleIds: ['fullstack-engineer', 'frontend-engineer', 'backend-engineer'],
    targetRoles: ['Full Stack Software Engineer', 'Frontend Engineer', 'Backend Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science']
  },
  {
    id: 'lp-4',
    title: 'Enterprise Data Modeling & Modern Snowflake Analytics',
    category: 'Industry Training',
    provider: 'Deloitte Tech Foundry',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    duration: '4 Weeks',
    level: 'Intermediate',
    skillsGained: ['SQL & Relational DBs', 'Snowflake SQL', 'dbt Data Modeling', 'Data Pipelines', 'Apache Spark'],
    hasCertification: true,
    rating: 4.75,
    enrolledCount: 1650,
    description: 'Hands-on enterprise data warehouse engineering curriculum with actual Fortune 500 anonymized datasets.',
    mode: 'Live Online',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/4m9j6hlbf4g',
    videoTitle: 'Module 1: Snowflake Cloud Data Warehousing & Modern Data Pipelines',
    videoDuration: '45 mins',
    careerRoleIds: ['data-engineer', 'data-scientist', 'business-analyst'],
    targetRoles: ['Data Engineer', 'Data Scientist', 'Business Analyst'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science']
  },
  {
    id: 'lp-5',
    title: 'Docker Containers, Kubernetes & Production Cloud-Native CI/CD',
    category: 'Course',
    provider: 'Linux Foundation & Cloud Native Computing Lab',
    logo: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=100&auto=format&fit=crop&q=80',
    duration: '6 Weeks',
    level: 'Intermediate',
    skillsGained: ['Docker & Kubernetes', 'CI/CD Pipelines', 'Linux & Shell', 'Helm & Prometheus', 'GitOps'],
    hasCertification: true,
    rating: 4.85,
    enrolledCount: 2430,
    description: 'Master containerization, pod orchestration, ingress controllers, zero-downtime canary updates, and automated build pipelines.',
    mode: 'Self-paced',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
    videoTitle: 'Lab 1: Docker Containerization, Kubernetes Pods & Microservice Orchestration',
    videoDuration: '50 mins',
    careerRoleIds: ['cloud-devops-engineer', 'fullstack-engineer', 'backend-engineer'],
    targetRoles: ['Cloud & DevOps Engineer', 'Full Stack Software Engineer', 'Backend Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering']
  },
  {
    id: 'lp-6',
    title: 'Digital VLSI Design with SystemVerilog & UVM Verification',
    category: 'Industry Training',
    provider: 'Qualcomm Semiconductor Lab & Cadence',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80',
    duration: '10 Weeks',
    level: 'Advanced',
    skillsGained: ['SystemVerilog', 'Verilog', 'UVM', 'FPGA & ASIC', 'Digital Electronics'],
    hasCertification: true,
    rating: 4.92,
    enrolledCount: 1280,
    description: 'Design and verify complex digital IP blocks. Hands-on testbench creation with SystemVerilog, UVM classes, and code coverage closure.',
    mode: 'Live Online',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/L1ung0wil9Y',
    videoTitle: 'Lecture 1: Digital VLSI Circuit Design, SystemVerilog & UVM Verification',
    videoDuration: '46 mins',
    careerRoleIds: ['vlsi-engineer', 'embedded-iot-engineer'],
    targetRoles: ['VLSI & Silicon Design Engineer', 'Embedded Systems & IoT Engineer'],
    eligibleBranches: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering']
  },
  {
    id: 'lp-7',
    title: 'Embedded Systems Firmware & Industrial Edge IoT Development',
    category: 'Bootcamp',
    provider: 'Bosch Connected Mobility Lab',
    logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80',
    duration: '8 Weeks',
    level: 'Intermediate',
    skillsGained: ['Embedded C', 'FreeRTOS', 'IoT Protocols (MQTT/CoAP)', 'Microcontrollers', 'Device Drivers'],
    hasCertification: true,
    rating: 4.88,
    enrolledCount: 1540,
    description: 'Program ARM Cortex-M microcontrollers, write RTOS peripheral drivers, and stream real-time sensor metrics over low-power wireless meshes.',
    mode: 'Live Online',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/hnj-7XwTYRI',
    videoTitle: 'Lab 1: Embedded Microcontroller Architecture & Sensor Interfacing',
    videoDuration: '48 mins',
    careerRoleIds: ['embedded-iot-engineer', 'robotics-engineer'],
    targetRoles: ['Embedded Systems & IoT Engineer', 'Robotics & Automation Engineer'],
    eligibleBranches: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Computer Science & Engineering']
  },
  {
    id: 'lp-8',
    title: 'Autonomous Robotics, ROS2 & Industrial Control Systems',
    category: 'Course',
    provider: 'Tata Robotics Academy & IEEE Robotics',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    duration: '8 Weeks',
    level: 'Intermediate',
    skillsGained: ['Robotics (ROS/ROS2)', 'Kinematics & Motion Planning', 'MATLAB/Simulink', 'PLC Programming', 'Sensor Fusion'],
    hasCertification: true,
    rating: 4.86,
    enrolledCount: 1120,
    description: 'Program industrial articulated manipulators, mobile AGVs, and ROS2 navigation stacks for modern smart factories.',
    mode: 'Live Online',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/HJAE5Pk8Nyw',
    videoTitle: 'Lab 1: Autonomous Robotics with ROS 2, Kinematics & Sensor Fusion',
    videoDuration: '54 mins',
    careerRoleIds: ['robotics-engineer', 'embedded-iot-engineer'],
    targetRoles: ['Robotics & Automation Engineer', 'Embedded Systems & IoT Engineer'],
    eligibleBranches: ['Mechanical Engineering', 'Electrical & Electronics Engineering', 'Electronics & Communication Engineering', 'Computer Science & Engineering']
  },
  {
    id: 'lp-9',
    title: 'Electric Vehicle Powertrain Engineering, BMS & Motor Drives',
    category: 'Certification',
    provider: 'Apex EV Research Center & ARAI',
    logo: 'https://images.unsplash.com/photo-1558441719-8b489c634a10?w=100&auto=format&fit=crop&q=80',
    duration: '8 Weeks',
    level: 'Intermediate',
    skillsGained: ['EV Powertrain', 'Battery Management Systems (BMS)', 'Motor Control & Inverters', 'MATLAB Simulink', 'CAN Protocol'],
    hasCertification: true,
    rating: 4.89,
    enrolledCount: 980,
    description: 'Comprehensive powertrain dynamics, regenerative braking models, lithium-ion cell balancing, and high-voltage inverter architectures.',
    mode: 'Self-paced',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/3SAxXUIre28',
    videoTitle: 'Module 1: Electric Vehicle Powertrain, BMS Architecture & Motor Drives',
    videoDuration: '47 mins',
    careerRoleIds: ['ev-automotive-engineer', 'robotics-engineer'],
    targetRoles: ['EV & Automotive Systems Engineer', 'Robotics & Automation Engineer'],
    eligibleBranches: ['Electrical & Electronics Engineering', 'Mechanical Engineering', 'Electronics & Communication Engineering']
  },
  {
    id: 'lp-10',
    title: 'Building Information Modeling (BIM) & Structural Revit Engineering',
    category: 'Industry Training',
    provider: 'Autodesk Authorized Academy & L&T Construction',
    logo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=100&auto=format&fit=crop&q=80',
    duration: '6 Weeks',
    level: 'Intermediate',
    skillsGained: ['Revit Architecture', 'Navisworks & BIM 360', 'Structural Analysis (ETABS)', 'AutoCAD 3D', 'Green Building Standards'],
    hasCertification: true,
    rating: 4.82,
    enrolledCount: 760,
    description: 'Master 3D spatial coordination, parametric structural modeling, clash detection, and quantity surveying for major infrastructure projects.',
    mode: 'Self-paced',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/4m9j6hlbf4g',
    videoTitle: 'Module 1: Building Information Modeling (BIM) & 3D Structural Revit',
    videoDuration: '52 mins',
    careerRoleIds: ['civil-bim-engineer', 'structural-engineer'],
    targetRoles: ['Civil & Structural BIM Engineer', 'Infrastructure Engineer'],
    eligibleBranches: ['Civil Engineering']
  },
  {
    id: 'lp-11',
    title: 'Offensive Cybersecurity Operations, SIEM Threat Hunting & SOC',
    category: 'Bootcamp',
    provider: 'Cisco Networking Academy & CyberSec CoE',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    duration: '8 Weeks',
    level: 'Intermediate',
    skillsGained: ['Network Security', 'SIEM & SOC Operations', 'Penetration Testing', 'Incident Response', 'OWASP Top 10'],
    hasCertification: true,
    rating: 4.91,
    enrolledCount: 2150,
    description: 'Live red team vs blue team attack simulations, Wireshark packet inspections, Splunk SIEM alert triage, and cloud perimeter defense.',
    mode: 'Live Online',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
    videoTitle: 'Masterclass: Offensive Cybersecurity, SIEM Threat Hunting & SOC Defense',
    videoDuration: '58 mins',
    careerRoleIds: ['cybersecurity-analyst', 'cloud-devops-engineer'],
    targetRoles: ['Cybersecurity & SOC Analyst', 'Cloud & DevOps Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering']
  },
  {
    id: 'lp-12',
    title: 'Cross-Platform Mobile Engineering with Flutter & Modern Dart',
    category: 'Course',
    provider: 'Google Developer Experts & Meta',
    logo: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&auto=format&fit=crop&q=80',
    duration: '6 Weeks',
    level: 'Intermediate',
    skillsGained: ['Flutter', 'Dart', 'State Management (Bloc/Riverpod)', 'Mobile UI/UX', 'RESTful API Integration'],
    hasCertification: true,
    rating: 4.87,
    enrolledCount: 3100,
    description: 'Build native iOS and Android apps with 60fps animations, local SQLite caching, responsive layouts, and OAuth authentication.',
    mode: 'Self-paced',
    isEnrolled: false,
    videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
    videoTitle: 'Lecture 1: Cross-Platform Mobile Architecture with Flutter & Dart',
    videoDuration: '62 mins',
    careerRoleIds: ['mobile-app-developer', 'frontend-engineer', 'fullstack-engineer'],
    targetRoles: ['Mobile Application Developer', 'Frontend Engineer', 'Full Stack Software Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'All B.Tech Branches']
  }
];

export const mockApplications: ApplicationTrackerItem[] = [];

export const mockInternships: InternshipRecord[] = [];

export const mockProjects: ProjectItem[] = [];

export const mockCertifications: CertificationItem[] = [];


export const mockMentors: Mentor[] = [
  {
    id: 'm-1',
    name: 'Kavita Sundaram',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    company: 'Microsoft',
    role: 'Principal Engineering Manager',
    industry: 'Cloud & Enterprise Tech',
    domain: 'Software Engineering & Scalability',
    experienceYears: 14,
    expertise: ['System Design', 'Career Growth', 'Cloud Migration', 'Leadership'],
    rating: 4.96,
    sessionsConducted: 86,
    availableSlots: 'Tuesdays & Thursdays, 7:00 PM IST',
    bio: 'Passionate about mentoring early-career women engineers and students transitioning into high-impact product engineering roles.'
  },
  {
    id: 'm-2',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'TechNova Solutions',
    role: 'Head of Applied AI Research',
    industry: 'Enterprise AI & SaaS',
    domain: 'Generative AI & Machine Learning',
    experienceYears: 11,
    expertise: ['LLMs & RAG', 'MLOps', 'PyTorch', 'Research to Production'],
    rating: 4.92,
    sessionsConducted: 64,
    availableSlots: 'Saturdays, 11:00 AM IST',
    bio: 'Ex-Google Brain researcher. Helping students build high-value ML capstone projects that attract Tier-1 recruiters.'
  },
  {
    id: 'm-3',
    name: 'Priya Sen',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    company: 'TechNova Solutions',
    role: 'Director of University Talent Acquisition',
    industry: 'Human Resources & Talent',
    domain: 'Resume Review & Interview Strategy',
    experienceYears: 12,
    expertise: ['Resume Polishing', 'Behavioral Interviews', 'Salary Negotiation', 'Campus Hiring'],
    rating: 4.98,
    sessionsConducted: 142,
    availableSlots: 'Wednesdays, 5:30 PM IST',
    bio: 'Reviewed 20,000+ student resumes across India. Here to ensure you highlight what top tech firms actually look for.'
  },
  {
    id: 'm-4',
    name: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    company: 'Deloitte Consulting',
    role: 'Senior Analytics Manager',
    industry: 'Consulting & Strategy',
    domain: 'Data Science & Business Analytics',
    experienceYears: 9,
    expertise: ['Consulting Case Studies', 'SQL & BI', 'Data Storytelling', 'Client Stakeholder Mgmt'],
    rating: 4.88,
    sessionsConducted: 48,
    availableSlots: 'Fridays, 6:00 PM IST',
    bio: 'Assisting analytical students in acing consulting interviews, case frameworks, and real-world stakeholder pitches.'
  }
];

export const mockEvents: EventItem[] = [
  {
    id: 'ev-1',
    title: 'National Hack-for-Impact 2026 (₹5 Lakh Prize Pool)',
    type: 'Hackathon',
    organizer: 'TechNova Solutions & Apex Institute',
    date: '18 - 20 Oct 2026',
    time: '48 Hours Hybrid',
    location: 'Bangalore Campus & Online',
    isRegistered: true,
    seatsRemaining: 45,
    speakers: ['Arjun Mehta (TechNova)', 'Dr. Rajeshwari Raman (Apex Tech)'],
    description: 'Build production-ready prototypes addressing healthcare, climate technology, and educational accessibility using AI and Web3.'
  },
  {
    id: 'ev-2',
    title: 'Masterclass: Cracking FAANG & Tier-1 System Design Interviews',
    type: 'Workshop',
    organizer: 'Career Sync & Microsoft Engineers',
    date: '24 Sep 2026',
    time: '6:00 PM - 8:30 PM IST',
    location: 'Virtual Webinar',
    isRegistered: true,
    seatsRemaining: 120,
    speakers: ['Kavita Sundaram (Microsoft)', 'Rohan Iyer (Staff Architect)'],
    description: 'Learn step-by-step breakdown of rate limiters, caching layers, microservices, and database sharding asked in Tier-1 software interviews.'
  },
  {
    id: 'ev-3',
    title: 'Apex Annual Mega Placement & Internship Fair 2026',
    type: 'Career Fair',
    organizer: 'Institutional Placement Cell',
    date: '15 - 16 Nov 2026',
    time: '9:00 AM - 5:00 PM IST',
    location: 'Apex Convention Center, Bangalore',
    isRegistered: false,
    seatsRemaining: 280,
    speakers: ['45+ Recruiting Companies: TechNova, Microsoft, Deloitte, TCS, Infosys, Cisco'],
    description: 'Direct walk-in interviews, spot offers, and networking stalls for 2026 graduating batch and 2027 internship aspirants.'
  },
  {
    id: 'ev-4',
    title: 'Industry Guest Lecture: Future of Enterprise Agentic AI',
    type: 'Guest Lecture',
    organizer: 'CSE Department & IEEE Student Chapter',
    date: '02 Oct 2026',
    time: '3:00 PM - 4:30 PM IST',
    location: 'Main Auditorium & YouTube Live',
    isRegistered: false,
    seatsRemaining: 85,
    speakers: ['Dr. Vivek Sharma (VP AI Research, Accenture Labs)'],
    description: 'How autonomous AI agents are revolutionizing automated DevOps, software testing, and scientific discovery.'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    contactName: 'Priya Sen',
    contactAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    contactRole: 'University Talent Acquisition @ TechNova',
    contactType: 'recruiter',
    lastMessage: 'Hi Ananya! We loved your hackathon demo. Your Technical Round 1 is scheduled for 12 Sep at 3:30 PM IST.',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    online: true,
    messages: [
      {
        id: 'm1',
        senderId: 'fac-202',
        senderName: 'Priya Sen',
        senderAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
        receiverId: 'std-101',
        content: 'Hello Ananya! Thank you for applying for the SDE-I position at TechNova.',
        timestamp: 'Yesterday 4:15 PM',
        isRead: true
      },
      {
        id: 'm2',
        senderId: 'std-101',
        senderName: 'Ananya Rao',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        receiverId: 'fac-202',
        content: 'Thank you Priya! I am really excited about TechNova’s work in enterprise SaaS and AI workflows.',
        timestamp: 'Yesterday 4:40 PM',
        isRead: true
      },
      {
        id: 'm3',
        senderId: 'fac-202',
        senderName: 'Priya Sen',
        senderAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
        receiverId: 'std-101',
        content: 'Hi Ananya! We loved your hackathon demo. Your Technical Round 1 is scheduled for 12 Sep at 3:30 PM IST.',
        timestamp: 'Today 10:45 AM',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-2',
    contactName: 'Kavita Sundaram',
    contactAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    contactRole: 'Principal Engineering Manager @ Microsoft (Mentor)',
    contactType: 'mentor',
    lastMessage: 'Remember to practice explaining trade-offs between SQL and NoSQL for your interview.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: 'm4',
        senderId: 'm-1',
        senderName: 'Kavita Sundaram',
        senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        receiverId: 'std-101',
        content: 'Remember to practice explaining trade-offs between SQL and NoSQL for your interview.',
        timestamp: 'Yesterday 6:30 PM',
        isRead: true
      }
    ]
  },
  {
    id: 'conv-3',
    contactName: 'Dr. Rajeshwari Raman',
    contactAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    contactRole: 'Lead Research Advisor',
    contactType: 'mentor',
    lastMessage: 'Your cloud benchmarking paper draft looks very solid. Please incorporate the Grafana metrics.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    online: true,
    messages: [
      {
        id: 'm5',
        senderId: 'fac-202',
        senderName: 'Dr. Rajeshwari Raman',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        receiverId: 'std-101',
        content: 'Your cloud benchmarking paper draft looks very solid. Please incorporate the Grafana metrics before Friday.',
        timestamp: 'Sep 7, 2:10 PM',
        isRead: true
      }
    ]
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'Applications',
    title: 'Interview Scheduled with TechNova Solutions',
    message: 'Your Technical Round 1 for SDE-I role is confirmed for 12 Sep 2026, 3:30 PM.',
    timestamp: '25 minutes ago',
    isRead: false,
    actionUrl: 'applications'
  },
  {
    id: 'notif-2',
    category: 'Jobs',
    title: 'New 94% Match: AI/ML Intern @ TechNova',
    message: 'Based on your Python, PyTorch, and SQL assessment scores, a new high-match internship was published.',
    timestamp: '2 hours ago',
    isRead: false,
    actionUrl: 'jobs'
  },
  {
    id: 'notif-3',
    category: 'Learning',
    title: 'New Cloud Architecture Workshop Live',
    message: 'AWS Academy launched free live hands-on container deployment labs for Apex students.',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: 'learning'
  },
  {
    id: 'notif-4',
    category: 'Mentorship',
    title: 'Mentorship Slot Confirmed',
    message: 'Kavita Sundaram accepted your request for System Design career guidance.',
    timestamp: '2 days ago',
    isRead: true,
    actionUrl: 'mentorship'
  },
  {
    id: 'notif-5',
    category: 'System',
    title: '✓ Skill Verification Approved',
    message: 'Your Python & SQL skill badges were officially verified by Apex Examination Cell.',
    timestamp: '3 days ago',
    isRead: true,
    actionUrl: 'skill-profile'
  }
];

export const mockAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    section: 'Programming',
    question: 'In modern JavaScript/TypeScript, what is the primary difference between `Promise.all()` and `Promise.allSettled()`?',
    options: [
      'Promise.all rejects immediately if any promise rejects, while Promise.allSettled waits for all to resolve or reject.',
      'Promise.all executes sequentially, while Promise.allSettled executes concurrently in background workers.',
      'Promise.allSettled only works with HTTP fetch calls, whereas Promise.all is for CPU tasks.',
      'There is no functional difference; they are syntactic aliases.'
    ],
    correctOption: 0,
    explanation: '`Promise.all` short-circuits as soon as any input promise rejects. `Promise.allSettled` waits for all input promises to complete regardless of resolution or rejection.'
  },
  {
    id: 2,
    section: 'Programming',
    question: 'Which SQL index data structure provides logarithmic O(log N) lookup, insertion, and range scanning in relational engines like PostgreSQL?',
    options: [
      'Hash Index',
      'B-Tree Index',
      'Bitmap Index',
      'Bloom Filter'
    ],
    correctOption: 1,
    explanation: 'B-Tree is the default and most versatile index in PostgreSQL and MySQL, providing balanced logarithmic depth and ordered traversal for range scans.'
  },
  {
    id: 3,
    section: 'Data & AI',
    question: 'In modern Transformer-based LLM architectures, what is the primary computational complexity of the standard self-attention mechanism with sequence length N?',
    options: [
      'O(N)',
      'O(N log N)',
      'O(N²)',
      'O(2ᴺ)'
    ],
    correctOption: 2,
    explanation: 'Standard multi-head self-attention computes query-key dot products across all token pairs, resulting in quadratic O(N²) time and memory complexity with respect to context length.'
  },
  {
    id: 4,
    section: 'Data & AI',
    question: 'What technique in Retrieval-Augmented Generation (RAG) is used to convert high-dimensional vectors into discrete clustered subspaces to speed up nearest neighbor searches?',
    options: [
      'Inverted File Index with Product Quantization (IVF-PQ)',
      'One-Hot Encoding',
      'Min-Max Normalization',
      'Backpropagation through time'
    ],
    correctOption: 0,
    explanation: 'IVF-PQ divides high-dimensional vector spaces into coarse clusters (IVF) and compresses vector residuals into compact byte representations (PQ) for fast sub-millisecond approximate nearest neighbor lookup.'
  },
  {
    id: 5,
    section: 'Problem Solving',
    question: 'A distributed system requires high availability and partition tolerance. According to the CAP Theorem, which property must be relaxed during a network partition?',
    options: [
      'Consistency',
      'Availability',
      'Partition Tolerance',
      'Durability'
    ],
    correctOption: 0,
    explanation: 'According to Brewer\'s CAP theorem, in the presence of a network partition (P), a system must trade off between immediate strong Consistency (C) or continuous Availability (A).'
  },
  {
    id: 6,
    section: 'Communication',
    question: 'When presenting a critical production architecture proposal to both senior engineering directors and business stakeholders, what is the most effective communication approach?',
    options: [
      'Dive directly into low-level C++ code snippets and CPU cache lines without context.',
      'Start with the business impact and user problem, followed by high-level system trade-offs and cost implications, reserving deep implementation details for technical appendixes.',
      'Speak only in technical jargon so non-technical stakeholders will not question the estimates.',
      'Avoid sharing potential system failure modes or risks to preserve confidence.'
    ],
    correctOption: 1,
    explanation: 'Effective cross-functional communication leads with business value, strategic trade-offs, and risk mitigations, bridging the gap between executive goals and engineering execution.'
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-01',
    studentId: '#8492019482',
    name: 'Ananya Rao',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'Apex Institute of Technology',
    degree: 'B.Tech',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    location: 'Bangalore',
    skillScore: 94,
    matchScore: 94,
    topSkills: ['React', 'TypeScript', 'Python', 'SQL', 'FastAPI'],
    certificationsCount: 4,
    internshipExperience: 'TechNova Solutions & Apex Data Systems',
    status: 'Shortlisted',
    isVerified: true,
    cgpa: 8.92
  },
  {
    id: 'cand-02',
    studentId: '#9182374650',
    name: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    college: 'National Institute of Engineering',
    degree: 'B.Tech',
    department: 'Information Science & Engineering',
    graduationYear: 2026,
    location: 'Hyderabad',
    skillScore: 91,
    matchScore: 91,
    topSkills: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'PostgreSQL'],
    certificationsCount: 3,
    internshipExperience: '6 Months @ CloudCore',
    status: 'Available',
    isVerified: true,
    cgpa: 8.75
  },
  {
    id: 'cand-03',
    studentId: '#7261940583',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'Apex Institute of Technology',
    degree: 'B.Tech',
    department: 'Artificial Intelligence & Data Science',
    graduationYear: 2026,
    location: 'Bangalore',
    skillScore: 92,
    matchScore: 89,
    topSkills: ['Python', 'TensorFlow', 'PyTorch', 'Data Analytics', 'Snowflake'],
    certificationsCount: 5,
    internshipExperience: '4 Months @ AnalyticsPro',
    status: 'Interviewed',
    isVerified: true,
    cgpa: 9.1
  },
  {
    id: 'cand-04',
    studentId: '#6351029487',
    name: 'Vikramaditya Joshi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    college: 'Vellore Institute of Technology',
    degree: 'B.Tech',
    department: 'Computer Science',
    graduationYear: 2026,
    location: 'Chennai',
    skillScore: 88,
    matchScore: 86,
    topSkills: ['Go', 'Kubernetes', 'Docker', 'Linux', 'gRPC'],
    certificationsCount: 2,
    internshipExperience: '3 Months @ DevPlatform',
    status: 'Available',
    isVerified: true,
    cgpa: 8.4
  },
  {
    id: 'cand-05',
    studentId: '#5241098376',
    name: 'Meera Nambiar',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    college: 'Apex Institute of Technology',
    degree: 'B.Tech',
    department: 'Electronics & Communication',
    graduationYear: 2026,
    location: 'Bangalore',
    skillScore: 85,
    matchScore: 82,
    topSkills: ['Embedded C', 'IoT', 'Python', 'MQTT', 'Circuit Design'],
    certificationsCount: 3,
    internshipExperience: '4 Months @ Bosch R&D',
    status: 'Available',
    isVerified: true,
    cgpa: 8.65
  }
];

export const mockPlacementDrives: PlacementDrive[] = [
  {
    id: 'drive-1',
    company: 'TechNova Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role: 'Software Development Engineer - I',
    salaryPackage: '₹14.5 - 18.0 LPA',
    eligibleBranches: ['CSE', 'ISE', 'AI/DS', 'ECE'],
    driveDate: '12 - 14 Sep 2026',
    status: 'Active',
    totalEligible: 420,
    applied: 310,
    shortlisted: 65,
    interviews: 28,
    offers: 14,
    joined: 0
  },
  {
    id: 'drive-2',
    company: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?w=100&auto=format&fit=crop&q=80',
    role: 'Cloud Software Engineer & DevOps Intern',
    salaryPackage: '₹24.0 LPA (PPO)',
    eligibleBranches: ['CSE', 'ISE'],
    driveDate: '28 Sep 2026',
    status: 'Upcoming',
    totalEligible: 280,
    applied: 245,
    shortlisted: 42,
    interviews: 0,
    offers: 0,
    joined: 0
  },
  {
    id: 'drive-3',
    company: 'Deloitte',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    role: 'Associate Analytics Consultant',
    salaryPackage: '₹9.5 - 12.0 LPA',
    eligibleBranches: ['All Engineering Branches + MCA'],
    driveDate: '01 - 04 Sep 2026',
    status: 'Completed',
    totalEligible: 650,
    applied: 520,
    shortlisted: 110,
    interviews: 60,
    offers: 38,
    joined: 35
  },
  {
    id: 'drive-4',
    company: 'Cisco Systems',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    role: 'Cybersecurity Threat Analyst',
    salaryPackage: '₹13.0 - 16.5 LPA',
    eligibleBranches: ['CSE', 'ECE', 'ISE'],
    driveDate: '05 Oct 2026',
    status: 'Upcoming',
    totalEligible: 340,
    applied: 198,
    shortlisted: 0,
    interviews: 0,
    offers: 0,
    joined: 0
  }
];

export const mockCollaborationInitiatives: CollaborationInitiative[] = [
  {
    id: 'collab-1',
    title: 'Apex - TechNova Center of Excellence in Enterprise Generative AI',
    type: 'Industry Partnership',
    partnerOrganization: 'TechNova Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    institution: 'Apex Institute of Technology',
    startDate: '15 Jan 2026',
    duration: '3 Years MoU',
    status: 'Active',
    leadCoordinator: 'Dr. Rajeshwari Raman & Arjun Mehta',
    impactMetrics: '240 Students Trained, 18 Capstones Mentored, 12 Spot Offers',
    description: 'Jointly equipped GPU computing lab, bi-monthly guest lectures, direct internship pipelines, and co-designed AI electives for 7th semester.'
  },
  {
    id: 'collab-2',
    title: 'Joint EV Powertrain Telemetry Research & Patent Filing',
    type: 'Research',
    partnerOrganization: 'Tata Motors R&D',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    institution: 'Apex Institute of Technology',
    startDate: '01 Mar 2026',
    duration: '18 Months',
    status: 'Active',
    leadCoordinator: 'Dr. K. S. Venkatesh',
    impactMetrics: '₹35 Lakh Research Grant, 2 International Patents Filed',
    description: 'Predictive analytics initiative calculating real-time battery thermal degradation models using automotive sensor logs.'
  },
  {
    id: 'collab-3',
    title: 'Industry Mentorship & Campus Readiness Hackathons',
    type: 'Mentorship',
    partnerOrganization: 'Microsoft Student Developer Community',
    logo: 'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?w=100&auto=format&fit=crop&q=80',
    institution: 'Apex Institute of Technology',
    startDate: '10 Feb 2026',
    duration: 'Ongoing Annual Program',
    status: 'MOU Signed',
    leadCoordinator: 'Priya Sen (Tech Lead) & Placement Cell',
    impactMetrics: '450+ 1-on-1 Mentorship Sessions, 94% Student Satisfaction',
    description: 'Bi-weekly 1-on-1 resume reviews, system design mock interviews, and female developer hackathons.'
  },
  {
    id: 'collab-4',
    title: 'Industry Immersion & Technology Workshop',
    type: 'Workshop',
    partnerOrganization: 'Infosys Springboard',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    institution: 'Apex Institute of Technology',
    startDate: '01 May 2026',
    duration: 'Annual Cycle',
    status: 'Active',
    leadCoordinator: 'Prof. Rajeshwari Raman',
    impactMetrics: '120 Students & Scholars Completed 4-Week Industry Immersion',
    description: 'Allows students and researchers to spend 4 weeks inside corporate engineering pods to upgrade practical skills.'
  }
];

export const mockInstitutionStats = {
  totalStudents: 4850,
  industryReadyPercentage: 72,
  activeInternships: 342,
  placementRatePercentage: 84,
  industryPartnersCount: 126,
  studentsWithSkillGaps: 1120,
  topSkillGaps: [
    { skill: 'Cloud Architecture (AWS/Azure)', gapCount: 680, percentage: 61, avgScore: 48 },
    { skill: 'Distributed System Design', gapCount: 590, percentage: 53, avgScore: 52 },
    { skill: 'Containerization & Docker', gapCount: 510, percentage: 46, avgScore: 56 },
    { skill: 'Machine Learning Pipelines', gapCount: 440, percentage: 39, avgScore: 59 },
    { skill: 'Executive Technical Writing', gapCount: 380, percentage: 34, avgScore: 62 }
  ],
  departmentReadiness: [
    { department: 'Computer Science & Eng', readiness: 86, studentsCount: 1240 },
    { department: 'Artificial Intelligence & DS', readiness: 84, studentsCount: 620 },
    { department: 'Information Science', readiness: 81, studentsCount: 780 },
    { department: 'Electronics & Comm', readiness: 69, studentsCount: 950 },
    { department: 'Mechanical Engineering', readiness: 58, studentsCount: 680 },
    { department: 'Civil Engineering', readiness: 52, studentsCount: 580 }
  ]
};
