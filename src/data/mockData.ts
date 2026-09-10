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
  { category: 'Leadership & Collab', score: 80, benchmark: 70 },
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
  // 1. AI/ML Engineering Intern (TechNova)
  {
    id: 'opp-1',
    type: 'internship',
    title: 'AI/ML Engineering Intern',
    organization: 'TechNova Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    requiredSkills: ['Python', 'PyTorch', 'SQL', 'FastAPI', 'Machine Learning'],
    preferredSkills: ['Docker', 'Vector Embeddings', 'Git'],
    salaryOrStipend: '₹25,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '25 Sep 2026',
    matchPercentage: 94,
    description: 'TechNova Solutions is looking for ambitious AI/ML interns to assist our enterprise AI innovation team in developing generative assistants and predictive models for customer telemetry.',
    responsibilities: [
      'Build and fine-tune NLP models for unstructured document classification',
      'Optimize data pipelines fetching data from PostgreSQL and Snowflake',
      'Implement FastAPI microservices wrapped in Docker containers',
      'Collaborate with Senior ML Engineers and Product Managers during bi-weekly sprints'
    ],
    eligibility: 'B.Tech in Computer Science & Engineering, AI & Data Science, or Information Technology graduating in 2026/2027 with minimum 7.5 CGPA.',
    applicantsCount: 142,
    postedDate: '2 days ago',
    isSaved: true,
    appliedStatus: 'applied',
    careerRoleIds: ['ai-ml-engineer', 'data-scientist', 'nlp-engineer'],
    targetRoles: ['AI & Machine Learning Engineer', 'Data Scientist', 'GenAI & NLP Specialist'],
    eligibleBranches: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Information Technology'],
    companyDetails: {
      size: '1,200+ employees',
      industry: 'Enterprise Software & AI',
      website: 'https://technovasolutions.io',
      rating: 4.6
    }
  },
  // 2. SDE-1 Full Stack (TechNova)
  {
    id: 'opp-2',
    type: 'job',
    title: 'Software Development Engineer - I (Frontend/Full Stack)',
    organization: 'TechNova Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    preferredSkills: ['Next.js', 'GraphQL', 'AWS'],
    salaryOrStipend: '₹14,50,000 - ₹18,00,000 / annum',
    experience: 'Fresher to 1 Year',
    deadline: '15 Oct 2026',
    matchPercentage: 92,
    description: 'Join our flagship SaaS platform team architecting low-latency dashboard interfaces and high-throughput collaboration workflows.',
    responsibilities: [
      'Build responsive, highly accessible React interfaces with TypeScript and Tailwind CSS',
      'Design clean REST and GraphQL backend services in Node.js',
      'Write comprehensive unit and integration tests with Jest and Playwright',
      'Participate in code reviews, architectural discussions, and agile planning'
    ],
    eligibility: 'B.Tech in Computer Science & Engineering, Information Technology, or AI & Data Science with strong algorithmic foundation.',
    applicantsCount: 310,
    postedDate: '3 days ago',
    isSaved: true,
    appliedStatus: 'interview',
    careerRoleIds: ['fullstack-engineer', 'frontend-engineer', 'backend-engineer'],
    targetRoles: ['Full Stack Software Engineer', 'Frontend Engineer', 'Backend Systems Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
    companyDetails: {
      size: '1,200+ employees',
      industry: 'Enterprise Software & AI',
      website: 'https://technovasolutions.io',
      rating: 4.6
    }
  },
  // 3. Cloud DevOps & Platform Intern (Microsoft)
  {
    id: 'opp-3',
    type: 'internship',
    title: 'Cloud DevOps & Platform Intern',
    organization: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?w=100&auto=format&fit=crop&q=80',
    location: 'Hyderabad / Bangalore',
    workMode: 'Hybrid',
    requiredSkills: ['Linux', 'Python', 'Azure / AWS', 'Docker', 'Networking'],
    preferredSkills: ['Terraform', 'Kubernetes', 'GitHub Actions'],
    salaryOrStipend: '₹50,000 / month',
    duration: '3 Months (May - July 2026)',
    deadline: '30 Sep 2026',
    matchPercentage: 88,
    description: 'Gain hands-on immersion with Azure Cloud Infrastructure engineering teams building planetary-scale developer platforms.',
    responsibilities: [
      'Automate cloud infrastructure testing pipelines using Python and Bash scripts',
      'Construct CI/CD deployment workflows with GitHub Actions',
      'Monitor container clusters with Prometheus and Grafana dashboards',
      'Perform security audits on cloud storage buckets and access policies'
    ],
    eligibility: 'B.Tech in CSE, IT, or ECE graduating in 2026/2027 with minimum 8.0 CGPA and solid understanding of OS and Networking.',
    applicantsCount: 520,
    postedDate: '5 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['cloud-devops-engineer', 'site-reliability-engineer'],
    targetRoles: ['Cloud & DevOps Engineer', 'Site Reliability Engineer (SRE)'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    companyDetails: {
      size: '220,000+ employees',
      industry: 'Cloud Computing & Enterprise Technology',
      website: 'https://microsoft.com',
      rating: 4.8
    }
  },
  // 4. Associate Data & Analytics Consultant (Deloitte)
  {
    id: 'opp-4',
    type: 'job',
    title: 'Associate Data & Analytics Consultant',
    organization: 'Deloitte',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    location: 'Mumbai / Gurgaon',
    workMode: 'On-site',
    requiredSkills: ['SQL', 'Python', 'Power BI / Tableau', 'Data Modeling', 'Communication'],
    preferredSkills: ['Snowflake', 'BigQuery', 'Financial Modeling'],
    salaryOrStipend: '₹9,50,000 - ₹12,00,000 / annum',
    experience: 'Fresher (Campus 2026)',
    deadline: '10 Oct 2026',
    matchPercentage: 89,
    description: 'Help global Fortune 500 enterprises transform raw operational datasets into actionable executive insights, automated forecasting models, and regulatory compliance dashboards.',
    responsibilities: [
      'Formulate complex SQL queries and ETL scripts for high-volume enterprise pipelines',
      'Develop interactive executive dashboards in Power BI and Tableau',
      'Perform statistical data validation, trend forecasting, and anomaly detection',
      'Present findings directly to client stakeholders and consulting partners'
    ],
    eligibility: 'B.Tech across CSE, IT, AI & DS, ECE or any engineering branch with strong analytical skills and minimum 7.0 CGPA.',
    applicantsCount: 418,
    postedDate: '4 days ago',
    isSaved: false,
    appliedStatus: 'shortlisted',
    careerRoleIds: ['data-scientist', 'data-engineer'],
    targetRoles: ['Data Scientist', 'Big Data Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science', 'Electronics & Communication Engineering', 'All B.Tech Branches'],
    companyDetails: {
      size: '450,000+ employees',
      industry: 'Management & Technology Consulting',
      website: 'https://deloitte.com',
      rating: 4.5
    }
  },
  // 5. Cybersecurity Threat Analyst (Cisco)
  {
    id: 'opp-5',
    type: 'job',
    title: 'Cybersecurity Threat Analyst',
    organization: 'Cisco Systems',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    requiredSkills: ['Network Security', 'Linux', 'Python', 'Wireshark', 'SIEM Tools'],
    preferredSkills: ['Penetration Testing', 'Cryptography', 'CompTIA Security+'],
    salaryOrStipend: '₹13,00,000 - ₹16,50,000 / annum',
    experience: 'Fresher to 1 Year',
    deadline: '05 Nov 2026',
    matchPercentage: 74,
    description: 'Defend critical enterprise networks from zero-day exploits, analyze malware telemetry, and configure threat response automations.',
    responsibilities: [
      'Monitor Security Information and Event Management (SIEM) alerts for anomalies',
      'Perform packet level inspection and forensic incident analysis',
      'Script defensive response automations in Python to patch vulnerabilities',
      'Write vulnerability mitigation briefings for enterprise security officers'
    ],
    eligibility: 'B.Tech in Computer Science, Information Technology, or Electronics & Communication Engineering graduating in 2026.',
    applicantsCount: 220,
    postedDate: '1 week ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['cybersecurity-analyst'],
    targetRoles: ['Cybersecurity Analyst & Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    companyDetails: {
      size: '80,000+ employees',
      industry: 'Networking & Cybersecurity',
      website: 'https://cisco.com',
      rating: 4.7
    }
  },
  // 6. Full Stack Web Developer (Razorpay)
  {
    id: 'opp-9',
    type: 'job',
    title: 'Full Stack Engineer - Payment Experience',
    organization: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore / Hybrid',
    workMode: 'Hybrid',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    preferredSkills: ['Next.js', 'Kafka', 'Docker'],
    salaryOrStipend: '₹18,00,000 - ₹22,00,000 / annum',
    experience: 'Fresher (2026 Batch)',
    deadline: '28 Oct 2026',
    matchPercentage: 91,
    description: 'Scale payment checkout gateways handling over 10,000 transactions per second. Build resilient UI widgets and secure financial microservices.',
    responsibilities: [
      'Architect fast, low-friction checkout React components loaded by millions of consumers',
      'Develop idempotent payment processing services with Node.js and PostgreSQL',
      'Set up caching layers and circuit breakers with Redis'
    ],
    eligibility: 'B.Tech in CSE or IT with high proficiency in JavaScript/TypeScript and database systems.',
    applicantsCount: 284,
    postedDate: '4 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['fullstack-engineer', 'backend-engineer', 'frontend-engineer'],
    targetRoles: ['Full Stack Software Engineer', 'Backend Systems Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
    companyDetails: {
      size: '3,000+ employees',
      industry: 'Fintech & Payments',
      website: 'https://razorpay.com',
      rating: 4.5
    }
  },
  // 7. Frontend Engineering Intern (Swiggy)
  {
    id: 'opp-10',
    type: 'internship',
    title: 'Frontend Engineering Intern (Consumer Web)',
    organization: 'Swiggy',
    logo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Web Performance'],
    preferredSkills: ['Next.js', 'Jest', 'Figma to Code'],
    salaryOrStipend: '₹40,000 / month',
    duration: '6 Months (Jan - June 2026)',
    deadline: '12 Oct 2026',
    matchPercentage: 95,
    description: 'Work alongside leading consumer engineers optimizing real-time order tracking, sub-second web render times, and responsive mobile-web experiences.',
    responsibilities: [
      'Build performant React components with sub-second First Contentful Paint',
      'Manage global state with Redux Toolkit and optimize re-renders',
      'Implement accessible design system components adhering to WCAG 2.1'
    ],
    eligibility: 'B.Tech in Computer Science & Engineering, Information Technology, or AI & Data Science graduating in 2026 or 2027.',
    applicantsCount: 380,
    postedDate: '3 days ago',
    isSaved: true,
    appliedStatus: null,
    careerRoleIds: ['frontend-engineer', 'fullstack-engineer', 'ui-ux-designer'],
    targetRoles: ['Frontend Engineer - React & UI', 'Full Stack Software Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
    companyDetails: {
      size: '6,000+ employees',
      industry: 'Hyperlocal Delivery & Consumer Tech',
      website: 'https://swiggy.com',
      rating: 4.4
    }
  },
  // 8. Graduate Data Scientist (Fractal Analytics)
  {
    id: 'opp-11',
    type: 'job',
    title: 'Associate Data Scientist',
    organization: 'Fractal Analytics',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    location: 'Mumbai / Bangalore',
    workMode: 'Hybrid',
    requiredSkills: ['Python', 'SQL', 'Scikit-Learn', 'Statistics', 'Data Visualization'],
    preferredSkills: ['PyTorch', 'MLflow', 'Tableau'],
    salaryOrStipend: '₹12,00,000 - ₹15,00,000 / annum',
    experience: 'Fresher (Campus 2026)',
    deadline: '22 Oct 2026',
    matchPercentage: 90,
    description: 'Build predictive machine learning models and experimentation pipelines for Fortune 500 healthcare and retail clients.',
    responsibilities: [
      'Perform exploratory data analysis and feature engineering on petabyte datasets',
      'Train, validate, and benchmark supervised and unsupervised ML algorithms',
      'Collaborate with engineering teams to deploy models via REST APIs'
    ],
    eligibility: 'B.Tech in CSE, AI & DS, IT, or ECE with strong statistical foundation and coding skills.',
    applicantsCount: 215,
    postedDate: '5 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['data-scientist', 'ai-ml-engineer'],
    targetRoles: ['Data Scientist', 'AI & Machine Learning Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Information Technology', 'Electronics & Communication Engineering'],
    companyDetails: {
      size: '4,500+ employees',
      industry: 'AI & Enterprise Analytics',
      website: 'https://fractal.ai',
      rating: 4.5
    }
  },
  // 9. Generative AI & NLP Research Intern (Google Research)
  {
    id: 'opp-12',
    type: 'internship',
    title: 'Generative AI & LLM Research Intern',
    organization: 'Google Research India',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore, India',
    workMode: 'On-site',
    requiredSkills: ['Python', 'PyTorch', 'Transformers', 'LLMs', 'Algorithms'],
    preferredSkills: ['JAX', 'CUDA', 'Research Papers'],
    salaryOrStipend: '₹75,000 / month',
    duration: '6 Months',
    deadline: '01 Nov 2026',
    matchPercentage: 86,
    description: 'Investigate reasoning capabilities, multilingual alignment, and retrieval-augmented generation in next-generation transformer models.',
    responsibilities: [
      'Conduct rigorous benchmarks on domain-specific LLM reasoning datasets',
      'Implement prompt distillation and parameter-efficient fine-tuning (PEFT)',
      'Publish research findings in top-tier conferences (NeurIPS/ACL/EMNLP)'
    ],
    eligibility: 'B.Tech/Dual Degree students in CSE or AI & Data Science with proven deep learning projects and high academic standing (>8.5 CGPA).',
    applicantsCount: 460,
    postedDate: '1 week ago',
    isSaved: true,
    appliedStatus: null,
    careerRoleIds: ['nlp-engineer', 'ai-ml-engineer', 'data-scientist'],
    targetRoles: ['GenAI & NLP Specialist', 'AI & Machine Learning Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science'],
    companyDetails: {
      size: '180,000+ employees',
      industry: 'AI & Technology Research',
      website: 'https://research.google',
      rating: 4.9
    }
  },
  // 10. Embedded Firmware Engineering Intern (Texas Instruments) - ECE / EEE
  {
    id: 'opp-15',
    type: 'internship',
    title: 'Embedded Firmware & Microcontroller Intern',
    organization: 'Texas Instruments',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore, India',
    workMode: 'On-site',
    requiredSkills: ['Embedded C', 'ARM Cortex-M', 'I2C/SPI/UART', 'RTOS', 'Oscilloscopes'],
    preferredSkills: ['C++', 'Python Scripting', 'PCB Debugging'],
    salaryOrStipend: '₹45,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '18 Oct 2026',
    matchPercentage: 84,
    description: 'Work with Texas Instruments microcontroller division developing low-power device drivers, hardware abstraction layers, and sensor interfaces for industrial automation.',
    responsibilities: [
      'Write low-latency Embedded C peripheral drivers for MSPM0 and SimpleLink processors',
      'Debug bus timing with logic analyzers and oscilloscopes in hardware labs',
      'Implement FreeRTOS task scheduling for multi-sensor data acquisition'
    ],
    eligibility: 'B.Tech in Electronics & Communication Engineering (ECE), Electrical & Electronics (EEE), or CSE with strong microcontrollers foundation.',
    applicantsCount: 168,
    postedDate: '4 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['embedded-iot-engineer'],
    targetRoles: ['Embedded Systems & IoT Engineer'],
    eligibleBranches: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Computer Science & Engineering'],
    companyDetails: {
      size: '30,000+ employees',
      industry: 'Semiconductor & Embedded Systems',
      website: 'https://ti.com',
      rating: 4.6
    }
  },
  // 11. Associate VLSI Design & Verification Engineer (Qualcomm) - ECE / EEE
  {
    id: 'opp-16',
    type: 'job',
    title: 'Associate VLSI Design & Verification Engineer',
    organization: 'Qualcomm',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80',
    location: 'Hyderabad / Bangalore',
    workMode: 'On-site',
    requiredSkills: ['SystemVerilog', 'Verilog', 'Digital Electronics', 'UVM', 'FPGA'],
    preferredSkills: ['Python', 'Perl', 'Static Timing Analysis (STA)'],
    salaryOrStipend: '₹16,00,000 - ₹21,00,000 / annum',
    experience: 'Fresher (Campus 2026)',
    deadline: '30 Oct 2026',
    matchPercentage: 82,
    description: 'Join Qualcomm Snapdragon silicon engineering teams designing and verifying high-speed digital blocks, cellular modems, and low-power ASIC cores.',
    responsibilities: [
      'Develop SystemVerilog and UVM testbenches for IP block verification',
      'Execute code coverage and functional coverage simulations',
      'Analyze logic synthesis and timing constraint closure with EDA tools'
    ],
    eligibility: 'B.Tech in Electronics & Communication Engineering (ECE) or Electrical & Electronics Engineering (EEE) with minimum 7.5 CGPA.',
    applicantsCount: 230,
    postedDate: '1 week ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['vlsi-engineer', 'embedded-iot-engineer'],
    targetRoles: ['VLSI & Silicon Design Engineer', 'Embedded Systems & IoT Engineer'],
    eligibleBranches: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering'],
    companyDetails: {
      size: '50,000+ employees',
      industry: 'Wireless Semiconductors & Telecommunications',
      website: 'https://qualcomm.com',
      rating: 4.6
    }
  },
  // 12. IoT Systems & Edge Hardware Intern (Bosch R&D) - ECE / EEE / CSE
  {
    id: 'opp-17',
    type: 'internship',
    title: 'IoT Systems & Connected Mobility Intern',
    organization: 'Bosch Global Software Technologies',
    logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore / Coimbatore',
    workMode: 'Hybrid',
    requiredSkills: ['Embedded C', 'IoT Protocols (MQTT/CoAP)', 'Python', 'Sensors', 'Linux'],
    preferredSkills: ['Bluetooth Low Energy (BLE)', 'AWS IoT Core', 'CAN Bus'],
    salaryOrStipend: '₹35,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '20 Oct 2026',
    matchPercentage: 86,
    description: 'Engineer edge telematics gateway firmware connecting electric two-wheelers and industrial machines to cloud telemetry dashboards.',
    responsibilities: [
      'Implement MQTT telemetry publish-subscribe stacks on ESP32 and STM32 chips',
      'Interface temperature, vibration, and CAN bus sensors with low power sleep cycles',
      'Build end-to-end integration tests with AWS IoT Core message brokers'
    ],
    eligibility: 'B.Tech in ECE, EEE, or CSE graduating in 2026 or 2027.',
    applicantsCount: 195,
    postedDate: '5 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['embedded-iot-engineer', 'robotics-engineer'],
    targetRoles: ['Embedded Systems & IoT Engineer', 'Robotics & Automation Engineer'],
    eligibleBranches: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Computer Science & Engineering'],
    companyDetails: {
      size: '35,000+ employees',
      industry: 'Automotive & Industrial IoT',
      website: 'https://bosch.in',
      rating: 4.5
    }
  },
  // 13. Robotics & Industrial Automation Engineer (Tata Motors Electric) - ME / EEE / ECE
  {
    id: 'opp-19',
    type: 'job',
    title: 'Robotics & Automation Engineer - EV Manufacturing',
    organization: 'Tata Motors Electric Mobility',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    location: 'Pune / Sanand',
    workMode: 'On-site',
    requiredSkills: ['Robotics (ROS/ROS2)', 'PLC Programming', 'MATLAB/Simulink', 'Python', 'Kinematics'],
    preferredSkills: ['Computer Vision', 'SCADA', 'Industrial Sensors'],
    salaryOrStipend: '₹10,50,000 - ₹13,50,000 / annum',
    experience: 'Fresher (Campus 2026)',
    deadline: '08 Nov 2026',
    matchPercentage: 80,
    description: 'Program robotic arms, automated guided vehicles (AGVs), and battery assembly lines for India’s premier electric vehicle manufacturing plants.',
    responsibilities: [
      'Program and calibrate 6-axis KUKA/ABB robotic arms on EV battery pack assembly lines',
      'Implement ROS2 path planning and obstacle avoidance algorithms for warehouse AGVs',
      'Optimize cycle times and safety interlocks with Siemens PLCs'
    ],
    eligibility: 'B.Tech in Mechanical Engineering, Electrical & Electronics, Mechatronics, or ECE graduating in 2026 with minimum 7.0 CGPA.',
    applicantsCount: 154,
    postedDate: '6 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['robotics-engineer'],
    targetRoles: ['Robotics & Automation Engineer'],
    eligibleBranches: ['Mechanical Engineering', 'Electrical & Electronics Engineering', 'Electronics & Communication Engineering'],
    companyDetails: {
      size: '75,000+ employees',
      industry: 'Automotive & Clean Mobility',
      website: 'https://tatamotors.com',
      rating: 4.5
    }
  },
  // 14. Autonomous Systems & EV Battery Intern (Ola Electric) - ME / EEE / CSE
  {
    id: 'opp-20',
    type: 'internship',
    title: 'Autonomous Vehicle & Battery Telemetry Intern',
    organization: 'Ola Electric',
    logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore / FutureFactory Krishnagiri',
    workMode: 'On-site',
    requiredSkills: ['Python', 'MATLAB', 'Sensor Fusion', 'Battery Management Systems (BMS)', 'CAN Bus'],
    preferredSkills: ['C++', 'Machine Learning', 'Thermal Simulation'],
    salaryOrStipend: '₹30,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '24 Oct 2026',
    matchPercentage: 85,
    description: 'Work with battery algorithm research teams formulating state-of-charge (SoC) estimation and thermal runaway early warning models.',
    responsibilities: [
      'Analyze cell temperature and voltage telemetry from hundreds of fleet vehicles',
      'Develop Kalman filter estimators for accurate State of Charge tracking',
      'Perform hardware-in-the-loop (HIL) battery degradation testing'
    ],
    eligibility: 'B.Tech in Mechanical Engineering, Electrical & Electronics Engineering, or CSE graduating in 2026/2027.',
    applicantsCount: 172,
    postedDate: '5 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['robotics-engineer', 'embedded-iot-engineer'],
    targetRoles: ['Robotics & Automation Engineer', 'Embedded Systems & IoT Engineer'],
    eligibleBranches: ['Mechanical Engineering', 'Electrical & Electronics Engineering', 'Computer Science & Engineering'],
    companyDetails: {
      size: '7,000+ employees',
      industry: 'Electric Vehicles & Clean Tech',
      website: 'https://olaelectric.com',
      rating: 4.3
    }
  },
  // 15. Smart City Infrastructure & GIS Consultant (L&T Technology Services) - Civil / All B.Tech
  {
    id: 'opp-22',
    type: 'job',
    title: 'Smart Infrastructure & Digital Twin Consultant',
    organization: 'L&T Technology Services',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=100&auto=format&fit=crop&q=80',
    location: 'Chennai / Mumbai',
    workMode: 'Hybrid',
    requiredSkills: ['BIM (Revit/Navisworks)', 'GIS Mapping', 'AutoCAD', 'Python Scripting', 'Project Management'],
    preferredSkills: ['IoT Sensor Integration', 'SQL', 'Digital Twins'],
    salaryOrStipend: '₹8,50,000 - ₹11,00,000 / annum',
    experience: 'Fresher (Campus 2026)',
    deadline: '15 Nov 2026',
    matchPercentage: 78,
    description: 'Transform conventional urban civil infrastructure into connected smart cities utilizing 3D Building Information Modeling (BIM) and spatial GIS analytics.',
    responsibilities: [
      'Construct federated 3D BIM models for metro rail and airport terminals',
      'Perform clash detection and construction sequencing in Navisworks',
      'Link smart utility sensors with GIS map dashboards for municipal authorities'
    ],
    eligibility: 'B.Tech in Civil Engineering, Environmental Engineering, or allied engineering disciplines with strong CAD/BIM coursework.',
    applicantsCount: 135,
    postedDate: '1 week ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['product-manager'],
    targetRoles: ['Associate Product Manager - APM'],
    eligibleBranches: ['Civil Engineering', 'Computer Science & Engineering', 'All B.Tech Branches'],
    companyDetails: {
      size: '22,000+ employees',
      industry: 'Engineering R&D & Smart Infrastructure',
      website: 'https://ltts.com',
      rating: 4.4
    }
  },
  // 16. Structural BIM & Digital Construction Intern (Afcons Infrastructure) - Civil
  {
    id: 'opp-23',
    type: 'internship',
    title: 'Structural BIM & Digital Construction Intern',
    organization: 'Afcons Infrastructure Ltd',
    logo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=100&auto=format&fit=crop&q=80',
    location: 'Mumbai / Site Projects',
    workMode: 'On-site',
    requiredSkills: ['AutoCAD', 'Revit Structure', 'STAAD.Pro', 'Structural Analysis', 'Surveying'],
    preferredSkills: ['Civil 3D', 'Drone Photogrammetry', 'Excel Modeling'],
    salaryOrStipend: '₹22,000 / month',
    duration: '4 Months (Summer 2026)',
    deadline: '28 Oct 2026',
    matchPercentage: 81,
    description: 'Immerse on landmark bridge, tunnel, and highway engineering projects utilizing cutting-edge structural modeling and digital construction tools.',
    responsibilities: [
      'Assist senior structural engineers in STAAD.Pro load analysis and reinforcement detailing',
      'Generate accurate quantity take-offs (BOQ) from Revit Structural models',
      'Participate in on-site quality assurance inspections and concrete curing verification'
    ],
    eligibility: 'Pre-final and final year B.Tech Civil Engineering students graduating in 2026/2027.',
    applicantsCount: 98,
    postedDate: '4 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['product-manager'],
    targetRoles: ['Associate Product Manager - APM'],
    eligibleBranches: ['Civil Engineering'],
    companyDetails: {
      size: '15,000+ employees',
      industry: 'Infrastructure & Heavy Civil Construction',
      website: 'https://afcons.com',
      rating: 4.5
    }
  },
  // 17. Associate Product Manager - APM (Cred) - All B-Tech Branches
  {
    id: 'opp-24',
    type: 'job',
    title: 'Associate Product Manager (APM Batch 2026)',
    organization: 'CRED',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore, India',
    workMode: 'On-site',
    requiredSkills: ['Product Strategy', 'SQL', 'User Research', 'Data-Driven Decision Making', 'Wireframing'],
    preferredSkills: ['A/B Testing', 'System Design', 'Financial Tech Knowledge'],
    salaryOrStipend: '₹20,00,000 - ₹26,00,000 / annum',
    experience: 'Fresher (Graduating 2026)',
    deadline: '05 Nov 2026',
    matchPercentage: 87,
    description: 'CRED’s flagship APM cohort is seeking high-agency engineering graduates from any branch with sharp first-principles thinking to build premium member rewards and financial commerce features.',
    responsibilities: [
      'Define product requirement documents (PRDs) for new rewards and financial features',
      'Formulate North Star user metrics and write SQL queries to track funnel drop-offs',
      'Partner daily with engineering, UI/UX design, and compliance leads'
    ],
    eligibility: 'Graduating B.Tech students across ANY engineering branch (CSE, ECE, ME, Civil, EEE) with proven leadership and structured problem solving.',
    applicantsCount: 620,
    postedDate: '3 days ago',
    isSaved: true,
    appliedStatus: null,
    careerRoleIds: ['product-manager', 'ui-ux-designer'],
    targetRoles: ['Associate Product Manager - APM', 'UI/UX Product Designer'],
    eligibleBranches: ['All B.Tech Branches', 'Computer Science & Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    companyDetails: {
      size: '1,500+ employees',
      industry: 'Fintech & Consumer Internet',
      website: 'https://cred.club',
      rating: 4.7
    }
  },
  // 18. UI/UX Product Design Intern (Zoho) - All B-Tech Branches
  {
    id: 'opp-25',
    type: 'internship',
    title: 'UI/UX Product Design Intern',
    organization: 'Zoho Corporation',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&auto=format&fit=crop&q=80',
    location: 'Chennai / Tenkasi / Hybrid',
    workMode: 'Hybrid',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    preferredSkills: ['HTML/CSS', 'Micro-interactions', 'Usability Testing'],
    salaryOrStipend: '₹30,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '25 Oct 2026',
    matchPercentage: 83,
    description: 'Design intuitive, world-class enterprise SaaS interfaces for Zoho suite of cloud software used by over 100 million global users.',
    responsibilities: [
      'Create high-fidelity interactive prototypes and design specifications in Figma',
      'Conduct 1-on-1 user testing interviews to discover usability bottlenecks',
      'Contribute reusable tokens and components to the unified Zoho Design System'
    ],
    eligibility: 'B.Tech students from ANY branch with a strong design portfolio demonstrating design thinking and visual craftsmanship.',
    applicantsCount: 310,
    postedDate: '4 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['ui-ux-designer', 'product-manager'],
    targetRoles: ['UI/UX Product Designer', 'Associate Product Manager - APM'],
    eligibleBranches: ['All B.Tech Branches', 'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    companyDetails: {
      size: '15,000+ employees',
      industry: 'Enterprise Cloud SaaS',
      website: 'https://zoho.com',
      rating: 4.6
    }
  },
  // 19. Mobile App Engineer - Flutter & React Native (PhonePe) - CSE / IT / ECE
  {
    id: 'opp-26',
    type: 'job',
    title: 'Mobile Application Engineer (iOS & Android)',
    organization: 'PhonePe',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    requiredSkills: ['Flutter / React Native', 'Dart / TypeScript', 'Mobile UI', 'REST APIs', 'State Management'],
    preferredSkills: ['Kotlin', 'Swift', 'App Store Deployment'],
    salaryOrStipend: '₹15,00,000 - ₹19,50,000 / annum',
    experience: 'Fresher to 1 Year',
    deadline: '10 Nov 2026',
    matchPercentage: 88,
    description: 'Build fast, rock-solid mobile payment and wealth management journeys deployed to over 500 million registered users.',
    responsibilities: [
      'Develop pixel-perfect cross-platform mobile screens in Flutter/React Native',
      'Optimize app startup time and minimize APK/IPA binary sizes',
      'Implement offline-first caching and encrypted biometric authentication'
    ],
    eligibility: 'B.Tech in Computer Science & Engineering, Information Technology, or ECE graduating in 2026.',
    applicantsCount: 290,
    postedDate: '5 days ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['mobile-app-developer', 'frontend-engineer'],
    targetRoles: ['Mobile App Developer - Flutter & React Native', 'Frontend Engineer - React & UI'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    companyDetails: {
      size: '4,000+ employees',
      industry: 'Fintech & Digital Commerce',
      website: 'https://phonepe.com',
      rating: 4.5
    }
  },
  // 20. QA & Test Automation Engineer (Atlassian) - CSE / IT
  {
    id: 'opp-27',
    type: 'internship',
    title: 'QA Automation & Reliability Intern',
    organization: 'Atlassian',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore / Remote',
    workMode: 'Remote',
    requiredSkills: ['Selenium / Cypress / Playwright', 'Python / JavaScript', 'CI/CD', 'API Testing', 'Git'],
    preferredSkills: ['Performance Testing', 'Jira API', 'Docker'],
    salaryOrStipend: '₹55,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '20 Oct 2026',
    matchPercentage: 92,
    description: 'Ensure bulletproof software quality across Jira and Confluence cloud services by constructing end-to-end automated testing pipelines.',
    responsibilities: [
      'Write reliable end-to-end browser tests in Playwright and Cypress',
      'Construct automated API regression suites integrated into GitHub Actions CI',
      'Conduct load stress testing to identify database query bottlenecks'
    ],
    eligibility: 'B.Tech in Computer Science or Information Technology graduating in 2026 or 2027.',
    applicantsCount: 210,
    postedDate: '1 week ago',
    isSaved: false,
    appliedStatus: null,
    careerRoleIds: ['qa-automation-engineer', 'fullstack-engineer'],
    targetRoles: ['QA & Test Automation Engineer', 'Full Stack Software Engineer'],
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
    companyDetails: {
      size: '11,000+ employees',
      industry: 'Developer Tools & Collaboration Software',
      website: 'https://atlassian.com',
      rating: 4.7
    }
  },
  // 21. FDP Sponsored Fellowship
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
  },
  {
    id: 7,
    section: 'Leadership',
    question: 'During a high-stakes Capstone sprint, two team members strongly disagree on whether to use GraphQL or REST, causing design deadlock. As team lead, what is the best resolution path?',
    options: [
      'Pick the tool you personally like best and order everyone to follow it without discussion.',
      'Define clear evaluation criteria based on project constraints (deadline, client needs, team proficiency), run a quick 2-hour proof of concept, and make a transparent, documented decision.',
      'Tell them to fight it out until one gives up.',
      'Abandon the API layer entirely.'
    ],
    correctOption: 1,
    explanation: 'Mature engineering leadership depersonalizes technical debates by grounding choices in project requirements, objective constraints, and time-boxed prototyping.'
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
