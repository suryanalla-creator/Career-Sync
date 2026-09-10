export interface CareerRoleMilestone {
  id: string;
  stepNumber: number;
  title: string;
  roleLevel: string;
  duration: string;
  description: string;
  requiredSkills: string[];
  recommendedCourses: string[];
  recommendedCertifications: string[];
  recommendedProjects: string[];
  checkpoints: string[];
  relevantJobRoles: string[];
}

export interface CareerRoleOption {
  id: string;
  title: string;
  domain: string;
  demand: 'Very High' | 'High' | 'Rapid Growth';
  averageSalary: string;
  experienceLevel: string;
  topEmployers: string[];
  description: string;
  keySkills: string[];
  milestones: CareerRoleMilestone[];
}

export const CAREER_ROLE_DOMAINS = [
  'All',
  'Software & Web Engineering',
  'AI & Data Science',
  'Cloud & DevOps',
  'Hardware & Systems',
  'Product & Design',
  'Emerging & Specialized Tech'
] as const;

export const CAREER_ROLE_OPTIONS: CareerRoleOption[] = [
  // 1. Full Stack Software Engineer
  {
    id: 'fullstack-engineer',
    title: 'Full Stack Software Engineer',
    domain: 'Software & Web Engineering',
    demand: 'Very High',
    averageSalary: '₹8 - 24 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Google', 'Microsoft', 'TechNova', 'Amazon', 'Flipkart'],
    description: 'Builds end-to-end scalable web applications, responsive user interfaces, REST/GraphQL APIs, and resilient database schemas.',
    keySkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'System Design'],
    milestones: [
      {
        id: 'fs-1',
        stepNumber: 1,
        title: 'Computer Science Core & Web Foundations',
        roleLevel: 'Foundation Stage',
        duration: '4-6 Weeks',
        description: 'Master Data Structures & Algorithms, modern JavaScript/TypeScript, and semantic web layouts.',
        requiredSkills: ['Data Structures & Algorithms', 'TypeScript', 'HTML5/TailwindCSS', 'Git & GitHub'],
        recommendedCourses: ['DSA in Java/C++', 'Modern Full Stack TypeScript'],
        recommendedCertifications: ['LeetCode 150 Badge', 'HackerRank Problem Solving Gold'],
        recommendedProjects: ['Interactive Real-Time Task Board', 'Algorithm Visualizer Web App'],
        checkpoints: ['Solve 100+ LeetCode problems', 'Master ES6+ asynchronous JavaScript', 'Implement clean semantic UI'],
        relevantJobRoles: ['Frontend Trainee', 'Software Engineering Intern']
      },
      {
        id: 'fs-2',
        stepNumber: 2,
        title: 'Modern Frontend Architecture & State Management',
        roleLevel: 'Frontend Specialist',
        duration: '5-7 Weeks',
        description: 'Build enterprise React/Next.js client applications with robust state management and optimal rendering performance.',
        requiredSkills: ['React', 'Next.js', 'Redux/Zustand', 'REST APIs', 'Web Vitals'],
        recommendedCourses: ['Next.js 14 Production App Architecture', 'Advanced React Patterns'],
        recommendedCertifications: ['Meta Front-End Developer Professional Certificate'],
        recommendedProjects: ['Career Sync Social Collaboration Portal', 'E-Commerce Marketplace with SSR'],
        checkpoints: ['Implement server-side rendering with Next.js', 'Integrate complex state stores', 'Achieve 95+ Google Lighthouse scores'],
        relevantJobRoles: ['React Developer', 'Junior Frontend Engineer']
      },
      {
        id: 'fs-3',
        stepNumber: 3,
        title: 'Backend Systems, APIs & Relational Databases',
        roleLevel: 'Full Stack Associate',
        duration: '6-8 Weeks',
        description: 'Design secure microservice APIs, database schema normalization, indexing, and authentication flows.',
        requiredSkills: ['Node.js', 'Express/Fastify', 'PostgreSQL/SQLite', 'Prisma/Drizzle ORM', 'JWT/OAuth2'],
        recommendedCourses: ['Clean Architecture Backend Engineering', 'Database Design & SQL Indexing'],
        recommendedCertifications: ['Node.js Application Developer (JSNAD)'],
        recommendedProjects: ['High-Throughput Authentication & RBAC Service', 'Multi-Tenant SaaS Inventory Engine'],
        checkpoints: ['Build REST & GraphQL API endpoints', 'Implement connection pooling & transactions', 'Add JWT refresh token rotation'],
        relevantJobRoles: ['Full Stack Developer', 'Backend Associate']
      },
      {
        id: 'fs-4',
        stepNumber: 4,
        title: 'Cloud Deployment, Containerization & CI/CD',
        roleLevel: 'Production Engineer',
        duration: '4-6 Weeks',
        description: 'Containerize multi-container web stacks with Docker, build automated GitHub Actions pipelines, and deploy on AWS.',
        requiredSkills: ['Docker', 'AWS ECS / EC2', 'GitHub Actions', 'Nginx Reverse Proxy', 'Redis Caching'],
        recommendedCourses: ['Docker & Container Orchestration', 'AWS Solutions Architect Associate'],
        recommendedCertifications: ['AWS Certified Cloud Practitioner', 'Docker Certified Associate'],
        recommendedProjects: ['Automated CI/CD Pipeline Deploying Microservices to AWS'],
        checkpoints: ['Dockerize full stack application with Docker Compose', 'Configure automated test & build CI workflow', 'Set up Redis caching layer'],
        relevantJobRoles: ['Software Development Engineer I (SDE 1)', 'Full Stack Engineer']
      },
      {
        id: 'fs-5',
        stepNumber: 5,
        title: 'System Design, Scalability & Campus Placements',
        roleLevel: 'Industry Ready SDE',
        duration: '4-5 Weeks',
        description: 'Master low-level and high-level system design patterns, distributed caching, and technical interview rounds.',
        requiredSkills: ['System Design (HLD & LLD)', 'Microservices', 'Message Queues (Kafka/RabbitMQ)', 'Mock Interviews'],
        recommendedCourses: ['Grokking the System Design Interview', 'Design Patterns in Enterprise Software'],
        recommendedCertifications: ['Career Sync Verified SDE Assessment Badge'],
        recommendedProjects: ['Distributed URL Shortener with Analytics Pipeline', 'Live Chat Engine with WebSockets'],
        checkpoints: ['Design scalable distributed chat & feed architectures', 'Complete 10+ mock technical interviews', 'Polish ATS-verified resume'],
        relevantJobRoles: ['SDE-1', 'Product Engineer', 'Full Stack Consultant']
      }
    ]
  },

  // 2. AI & Machine Learning Engineer
  {
    id: 'ai-ml-engineer',
    title: 'AI & Machine Learning Engineer',
    domain: 'AI & Data Science',
    demand: 'Very High',
    averageSalary: '₹10 - 28 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Google DeepMind', 'Microsoft Research', 'TechNova AI', 'NVIDIA', 'Amazon AWS'],
    description: 'Trains deep learning models, implements computer vision and NLP architectures, and deploys scalable inference pipelines.',
    keySkills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Vector DBs', 'FastAPI'],
    milestones: [
      {
        id: 'ai-1',
        stepNumber: 1,
        title: 'Mathematical Foundations & Scientific Python',
        roleLevel: 'AI Foundation Stage',
        duration: '4-6 Weeks',
        description: 'Linear Algebra, Multivariate Calculus, Probability & Statistics, NumPy, and Pandas mastery.',
        requiredSkills: ['Linear Algebra', 'Probability & Statistics', 'Python for Data Science', 'NumPy & Pandas'],
        recommendedCourses: ['Mathematics for Machine Learning Specialization', 'Python for Data Science Bootcamp'],
        recommendedCertifications: ['Kaggle Data Analysis Certificate'],
        recommendedProjects: ['Exploratory Data Analysis on 1M+ Records Dataset', 'Matrix Factorization from Scratch'],
        checkpoints: ['Master vector spaces, eigenvalues, and gradient descent', 'Perform feature engineering on noisy datasets', 'Publish clean EDA notebook on Kaggle'],
        relevantJobRoles: ['Data Analyst Intern', 'Junior ML Trainee']
      },
      {
        id: 'ai-2',
        stepNumber: 2,
        title: 'Classical Machine Learning & Statistical Modeling',
        roleLevel: 'ML Practitioner',
        duration: '5-7 Weeks',
        description: 'Supervised and unsupervised ML algorithms: regressions, SVMs, decision tree ensembles, and clustering.',
        requiredSkills: ['Scikit-Learn', 'XGBoost', 'Feature Engineering', 'Cross-Validation', 'Hyperparameter Tuning'],
        recommendedCourses: ['Machine Learning Specialization by Andrew Ng', 'Applied Predictive Modeling'],
        recommendedCertifications: ['HackerRank Machine Learning Silver/Gold'],
        recommendedProjects: ['FinTech Credit Default Predictor with XGBoost', 'Customer Segmentation Clustering Pipeline'],
        checkpoints: ['Train ensemble classifiers with >92% AUC-ROC', 'Perform Bayesian hyperparameter search with Optuna', 'Prevent data leakage in cross-validation'],
        relevantJobRoles: ['Machine Learning Intern', 'Predictive Modeler']
      },
      {
        id: 'ai-3',
        stepNumber: 3,
        title: 'Deep Learning & Neural Architectures',
        roleLevel: 'Deep Learning Engineer',
        duration: '6-8 Weeks',
        description: 'Deep neural networks, CNNs, Transformers, attention mechanisms, and PyTorch framework.',
        requiredSkills: ['PyTorch', 'Convolutional Networks', 'Transformers & Attention', 'GPU Acceleration (CUDA)'],
        recommendedCourses: ['Deep Learning Specialization (DeepLearning.AI)', 'PyTorch for Deep Learning Bootcamp'],
        recommendedCertifications: ['NVIDIA Fundamentals of Deep Learning Certificate'],
        recommendedProjects: ['Multi-Class Medical Image Classifier with ResNet/Vision Transformer', 'Time-Series Forecasting Model'],
        checkpoints: ['Write custom PyTorch training loops with mixed precision', 'Fine-tune pre-trained vision models', 'Implement custom loss functions'],
        relevantJobRoles: ['Deep Learning Associate', 'Computer Vision Intern']
      },
      {
        id: 'ai-4',
        stepNumber: 4,
        title: 'Large Language Models (LLMs), RAG & Vector Search',
        roleLevel: 'Generative AI Specialist',
        duration: '5-6 Weeks',
        description: 'Implement Retrieval-Augmented Generation (RAG), vector embeddings, LangChain/LlamaIndex, and LLM fine-tuning.',
        requiredSkills: ['LangChain / LlamaIndex', 'Vector Databases (Pinecone/Chroma)', 'LoRA / PEFT Fine-Tuning', 'Prompt Engineering'],
        recommendedCourses: ['Building Applications with LLMs', 'Advanced Retrieval-Augmented Generation'],
        recommendedCertifications: ['Google Cloud Generative AI Engineer Badge'],
        recommendedProjects: ['Enterprise NeuralDoc RAG Assistant over 10k PDFs', 'Fine-Tuned LLaMA-3 Domain Assistant'],
        checkpoints: ['Build hybrid vector + keyword retrieval pipeline', 'Evaluate hallucination rates with RAGAS metrics', 'Deploy model quantization (GGUF/AWQ)'],
        relevantJobRoles: ['Generative AI Engineer', 'NLP Engineer']
      },
      {
        id: 'ai-5',
        stepNumber: 5,
        title: 'MLOps, Model Serving & Scalable Inference',
        roleLevel: 'Production AI Engineer',
        duration: '4-5 Weeks',
        description: 'Model deployment with FastAPI/Triton, Docker containerization, model monitoring, and latency benchmarking.',
        requiredSkills: ['FastAPI Inference Server', 'Docker & Kubernetes', 'MLflow Model Registry', 'ONNX Runtime'],
        recommendedCourses: ['Full Stack Deep Learning', 'Production Machine Learning Systems (MLOps)'],
        recommendedCertifications: ['AWS Machine Learning Specialty', 'TensorFlow Developer Certificate'],
        recommendedProjects: ['Sub-50ms Latency Real-Time Inference Microservice on AWS'],
        checkpoints: ['Export PyTorch models to ONNX & TensorRT', 'Set up automated model drift detection', 'Deploy load-balanced API endpoint'],
        relevantJobRoles: ['AI/ML Engineer', 'Applied Scientist', 'MLOps Engineer']
      }
    ]
  },

  // 3. Cloud & DevOps Engineer
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    domain: 'Cloud & DevOps',
    demand: 'Very High',
    averageSalary: '₹9 - 25 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Amazon Web Services', 'Microsoft Azure', 'Cisco', 'Deloitte', 'Red Hat'],
    description: 'Automates infrastructure provisioning, manages container orchestration with Kubernetes, and secures CI/CD delivery pipelines.',
    keySkills: ['AWS / Azure', 'Terraform', 'Kubernetes (K8s)', 'Docker', 'Linux / Bash', 'CI/CD Pipelines'],
    milestones: [
      {
        id: 'cdo-1',
        stepNumber: 1,
        title: 'Linux Systems Administration & Shell Scripting',
        roleLevel: 'Systems Foundation',
        duration: '4 Weeks',
        description: 'Linux kernel concepts, permission models, systemd, bash automation scripts, and TCP/IP networking basics.',
        requiredSkills: ['Linux CLI', 'Bash Scripting', 'Networking (DNS, Subnets, Ports)', 'SSH & Public Key Crypto'],
        recommendedCourses: ['Linux Foundation System Administrator', 'Bash Shell Scripting Bootcamp'],
        recommendedCertifications: ['Red Hat Certified System Administrator (RHCSA)'],
        recommendedProjects: ['Automated Server Health Audit & Alerting Script', 'Custom Reverse Proxy Configuration'],
        checkpoints: ['Configure systemd services and logrotate', 'Write bash scripts for automated backups', 'Troubleshoot network routing and firewall rules'],
        relevantJobRoles: ['Junior Linux Admin', 'NOC Associate']
      },
      {
        id: 'cdo-2',
        stepNumber: 2,
        title: 'Cloud Architecture & Core Services (AWS/Azure)',
        roleLevel: 'Cloud Associate',
        duration: '5 Weeks',
        description: 'Master VPC design, EC2 compute, S3 storage, IAM least-privilege security, and relational RDS instances.',
        requiredSkills: ['AWS VPC / Subnets', 'IAM Policies & Roles', 'EC2 & Auto Scaling', 'CloudWatch & S3'],
        recommendedCourses: ['AWS Certified Solutions Architect Associate Prep', 'Hands-on AWS Cloud Architecture'],
        recommendedCertifications: ['AWS Certified Solutions Architect - Associate'],
        recommendedProjects: ['High-Availability Multi-AZ Web Application on AWS'],
        checkpoints: ['Architect zero-trust IAM policy hierarchy', 'Deploy load-balanced multi-tier web application', 'Configure auto-scaling based on CPU alarms'],
        relevantJobRoles: ['Cloud Operations Trainee', 'AWS Cloud Associate']
      },
      {
        id: 'cdo-3',
        stepNumber: 3,
        title: 'Containerization & Docker Orchestration',
        roleLevel: 'DevOps Specialist',
        duration: '5 Weeks',
        description: 'Multi-stage Docker builds, image scanning, container networking, and lightweight runtime optimization.',
        requiredSkills: ['Docker Multi-Stage Builds', 'Docker Compose', 'Container Security', 'Volume Mounts'],
        recommendedCourses: ['Docker Mastery with Swarm & Compose', 'Container Security Best Practices'],
        recommendedCertifications: ['Docker Certified Associate (DCA)'],
        recommendedProjects: ['Containerized 4-Tier Microservices Stack with Redis & Postgres'],
        checkpoints: ['Reduce image sizes from 1GB to <80MB using Alpine/Distroless', 'Run rootless secure containers', 'Orchestrate multi-node services'],
        relevantJobRoles: ['DevOps Engineer', 'Release Engineer']
      },
      {
        id: 'cdo-4',
        stepNumber: 4,
        title: 'Kubernetes (K8s) Cluster Management & Helm',
        roleLevel: 'Platform Engineer',
        duration: '6 Weeks',
        description: 'Deploy and scale stateful & stateless applications on Kubernetes clusters using Pods, Deployments, Ingress, and Helm.',
        requiredSkills: ['Kubernetes Manifests', 'Ingress Controllers', 'ConfigMaps & Secrets', 'Helm Charts'],
        recommendedCourses: ['Certified Kubernetes Administrator (CKA) Course', 'Kubernetes for Production'],
        recommendedCertifications: ['Certified Kubernetes Administrator (CKA)'],
        recommendedProjects: ['Production K8s Cluster with Ingress, TLS & Horizontal Pod Autoscaling'],
        checkpoints: ['Implement Horizontal Pod Autoscaler (HPA)', 'Package application into parameterized Helm chart', 'Configure rolling updates and canary releases'],
        relevantJobRoles: ['Kubernetes Administrator', 'Cloud DevOps Associate']
      },
      {
        id: 'cdo-5',
        stepNumber: 5,
        title: 'Infrastructure as Code (Terraform) & CI/CD Pipelines',
        roleLevel: 'Senior DevOps / SRE',
        duration: '5 Weeks',
        description: 'Declare infrastructure via Terraform, build zero-downtime GitHub Actions CI/CD pipelines, and configure Prometheus/Grafana.',
        requiredSkills: ['Terraform (HCL)', 'GitHub Actions / GitLab CI', 'Prometheus & Grafana', 'GitOps (ArgoCD)'],
        recommendedCourses: ['HashiCorp Certified Terraform Associate Course', 'GitOps with ArgoCD'],
        recommendedCertifications: ['HashiCorp Certified: Terraform Associate'],
        recommendedProjects: ['Full Infrastructure as Code Repo Provisioning EKS Cluster via Terraform & ArgoCD'],
        checkpoints: ['Manage remote Terraform state with S3 & DynamoDB locks', 'Implement automated lint, test, build, and deploy pipeline', 'Set up live Grafana monitoring dashboard'],
        relevantJobRoles: ['Cloud & DevOps Engineer', 'Site Reliability Engineer (SRE)']
      }
    ]
  },

  // 4. Cybersecurity Analyst & Ethical Hacker
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst & Ethical Hacker',
    domain: 'Cloud & DevOps',
    demand: 'High',
    averageSalary: '₹8 - 22 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Palo Alto Networks', 'CrowdStrike', 'Cisco Security', 'KPMG Cyber', 'Wipro Security'],
    description: 'Protects enterprise networks, performs vulnerability assessments, penetration testing, and investigates security incident telemetry.',
    keySkills: ['Network Security', 'Penetration Testing', 'Wireshark', 'Metasploit', 'SIEM / Splunk', 'Linux Security'],
    milestones: [
      {
        id: 'sec-1',
        stepNumber: 1,
        title: 'Network Protocols & Packet Analysis',
        roleLevel: 'Security Foundation',
        duration: '4-5 Weeks',
        description: 'Master OSI stack, TCP 3-way handshake, DNS security, packet capture with Wireshark, and firewall architectures.',
        requiredSkills: ['Wireshark', 'TCP/IP Protocols', 'Nmap Scanning', 'Firewall Rules'],
        recommendedCourses: ['Network Security Fundamentals', 'Hands-on Wireshark Packet Analysis'],
        recommendedCertifications: ['CompTIA Network+'],
        recommendedProjects: ['Network Traffic Anomaly & Port Scan Detector'],
        checkpoints: ['Analyze PCAP files for cleartext credentials & malware traffic', 'Run non-intrusive Nmap vulnerability scans', 'Configure iptables firewall rules'],
        relevantJobRoles: ['SOC Analyst Intern', 'Junior Network Security Associate']
      },
      {
        id: 'sec-2',
        stepNumber: 2,
        title: 'Web Application Security & OWASP Top 10',
        roleLevel: 'AppSec Analyst',
        duration: '5-6 Weeks',
        description: 'Exploit and remediate SQL Injection, XSS, CSRF, SSRF, broken authentication, and security misconfigurations.',
        requiredSkills: ['Burp Suite', 'OWASP Top 10', 'SQLi & XSS Remediation', 'API Security'],
        recommendedCourses: ['Practical Web Hacking & Pentesting', 'OWASP Top 10 Vulnerabilities in Depth'],
        recommendedCertifications: ['eJPT (eLearnSecurity Junior Penetration Tester)'],
        recommendedProjects: ['Vulnerability Assessment Report on Deliberately Insecure Web App'],
        checkpoints: ['Perform manual penetration test using Burp Suite', 'Bypass vulnerable authentication mechanisms', 'Write remediation guides for developers'],
        relevantJobRoles: ['Application Security Analyst', 'Web Penetration Tester']
      },
      {
        id: 'sec-3',
        stepNumber: 3,
        title: 'Security Operations, SIEM & Incident Response',
        roleLevel: 'SOC Analyst Tier 1/2',
        duration: '5-6 Weeks',
        description: 'Monitor enterprise log sources in Splunk/Elastic SIEM, write detection rules, and execute incident containment playbooks.',
        requiredSkills: ['Splunk / Elastic SIEM', 'Log Correlation', 'MITRE ATT&CK Framework', 'Incident Response Playbooks'],
        recommendedCourses: ['SOC Analyst Training with Splunk', 'Blue Team Incident Response'],
        recommendedCertifications: ['CompTIA Security+', 'Certified SOC Analyst (CSA)'],
        recommendedProjects: ['Custom SIEM Threat Detection Lab with Windows Event Logs'],
        checkpoints: ['Correlate multi-host attack techniques with MITRE tactics', 'Write Sigma and YARA threat detection rules', 'Simulate ransomware triage and memory dump isolation'],
        relevantJobRoles: ['SOC Analyst', 'Incident Responder']
      },
      {
        id: 'sec-4',
        stepNumber: 4,
        title: 'Penetration Testing & Red Teaming Fundamentals',
        roleLevel: 'Offensive Security Specialist',
        duration: '6-8 Weeks',
        description: 'Active Directory exploitation, privilege escalation, Metasploit, payload generation, and lateral movement.',
        requiredSkills: ['Metasploit', 'Privilege Escalation (Linux/Windows)', 'Active Directory Pentesting', 'Bash/Python for Hackers'],
        recommendedCourses: ['Practical Network Penetration Tester (PNPT)', 'Offensive Security PWK Prep'],
        recommendedCertifications: ['Offensive Security Certified Professional (OSCP) Prep', 'CEH (Certified Ethical Hacker)'],
        recommendedProjects: ['Compromise 20+ Vulnerable Machines on HackTheBox & TryHackMe'],
        checkpoints: ['Achieve root privilege escalation on 10 Linux machines', 'Execute Kerberoasting in Active Directory lab', 'Produce professional penetration testing audit report'],
        relevantJobRoles: ['Penetration Tester', 'Ethical Hacker', 'Cybersecurity Consultant']
      }
    ]
  },

  // 5. Data Scientist & Analytics Specialist
  {
    id: 'data-scientist',
    title: 'Data Scientist & Analytics Specialist',
    domain: 'AI & Data Science',
    demand: 'High',
    averageSalary: '₹9 - 24 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Flipkart', 'Swiggy', 'Tiger Analytics', 'Mu Sigma', 'Fractal Analytics'],
    description: 'Uncovers actionable business intelligence, builds predictive statistical models, designs A/B tests, and visualizes complex data.',
    keySkills: ['Python', 'SQL (Advanced)', 'Statistical Inference', 'Tableau / PowerBI', 'Scikit-Learn', 'A/B Testing'],
    milestones: [
      {
        id: 'ds-1',
        stepNumber: 1,
        title: 'Advanced SQL & Data Wrangling',
        roleLevel: 'Data Analyst Foundation',
        duration: '4-5 Weeks',
        description: 'Window functions, Common Table Expressions (CTEs), database aggregation, data cleaning with Pandas.',
        requiredSkills: ['SQL Window Functions', 'Pandas & NumPy', 'Data Cleaning', 'Relational Schemas'],
        recommendedCourses: ['Mastering SQL for Data Science', 'Data Wrangling with Python'],
        recommendedCertifications: ['HackerRank SQL (Gold) Badge'],
        recommendedProjects: ['E-Commerce Cohort Retention & Churn SQL Analysis'],
        checkpoints: ['Write multi-table complex queries with window ranking', 'Handle missing values and outliers programmatically', 'Calculate running averages and retention metrics'],
        relevantJobRoles: ['Data Analyst', 'SQL Developer']
      },
      {
        id: 'ds-2',
        stepNumber: 2,
        title: 'Statistical Hypothesis Testing & A/B Experimentation',
        roleLevel: 'Quantitative Analyst',
        duration: '5 Weeks',
        description: 'T-tests, Chi-square, ANOVA, p-values, sample sizing, power analysis, and designing live randomized controlled trials.',
        requiredSkills: ['Hypothesis Testing', 'A/B Testing Design', 'Normal & Binomial Distributions', 'Power Analysis'],
        recommendedCourses: ['Statistical Inference for Data Analysis', 'Designing A/B Tests for Tech Products'],
        recommendedCertifications: ['Google Data Analytics Professional Certificate'],
        recommendedProjects: ['Mobile App Conversion Rate A/B Test Simulation'],
        checkpoints: ['Calculate required sample sizes before launching experiment', 'Detect sample ratio mismatches (SRM)', 'Interpret statistical significance with confidence intervals'],
        relevantJobRoles: ['Business Analytics Associate', 'Experimentation Analyst']
      },
      {
        id: 'ds-3',
        stepNumber: 3,
        title: 'Predictive Modeling & Machine Learning',
        roleLevel: 'Junior Data Scientist',
        duration: '6 Weeks',
        description: 'Classification, regression, time-series forecasting, feature selection, SHAP explainability, and model evaluation.',
        requiredSkills: ['Scikit-Learn', 'XGBoost & LightGBM', 'SHAP / LIME Interpretability', 'Time-Series ARIMA/Prophet'],
        recommendedCourses: ['Applied Data Science with Python Specialization', 'Explainable AI in Practice'],
        recommendedCertifications: ['IBM Data Science Professional Certificate'],
        recommendedProjects: ['Customer Lifetime Value (LTV) Predictive Engine with Explainability'],
        checkpoints: ['Build predictive models achieving >85% F1-score', 'Explain model predictions using SHAP summary plots', 'Deploy interactive dashboard with Streamlit'],
        relevantJobRoles: ['Associate Data Scientist', 'Predictive Analyst']
      },
      {
        id: 'ds-4',
        stepNumber: 4,
        title: 'Data Storytelling, Dashboarding & Executive Communication',
        roleLevel: 'Full-Fledged Data Scientist',
        duration: '4 Weeks',
        description: 'Create impactful executive dashboards in Tableau or PowerBI and present complex model findings to business leaders.',
        requiredSkills: ['Tableau / PowerBI', 'Storytelling with Data', 'Business Metrics (CAC, LTV, ROAS)', 'Streamlit'],
        recommendedCourses: ['Tableau Desktop Specialist Certification Prep', 'Communicating Data Insights to Executives'],
        recommendedCertifications: ['Tableau Desktop Specialist', 'Microsoft Certified: Power BI Data Analyst Associate'],
        recommendedProjects: ['End-to-End Executive Revenue & Customer Churn Dashboard in Tableau'],
        checkpoints: ['Build interactive multi-filter dashboard connected to live SQL', 'Translate technical metrics into financial dollar impact', 'Lead mock executive presentation review'],
        relevantJobRoles: ['Data Scientist', 'Decision Science Consultant']
      }
    ]
  },

  // 6. Mobile App Developer (Android / iOS / Flutter)
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer (Android / iOS / Flutter)',
    domain: 'Software & Web Engineering',
    demand: 'High',
    averageSalary: '₹7 - 20 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Zomato', 'Ola Cabs', 'Paytm', 'PhonePe', 'Uber India'],
    description: 'Engineers native and cross-platform mobile apps for millions of users with slick offline-first architectures and gestures.',
    keySkills: ['Kotlin', 'Flutter / Dart', 'Swift / SwiftUI', 'Firebase', 'State Management', 'REST APIs'],
    milestones: [
      {
        id: 'mob-1',
        stepNumber: 1,
        title: 'Mobile Programming Foundations & UI Layouts',
        roleLevel: 'Mobile Trainee',
        duration: '4-5 Weeks',
        description: 'Master Flutter/Dart or Kotlin, reactive layout builders, gesture recognizers, and component hierarchies.',
        requiredSkills: ['Dart & Flutter Basics', 'Kotlin Core', 'Responsive Layouts', 'Material 3 / Cupertino'],
        recommendedCourses: ['Flutter & Dart - The Complete Guide', 'Modern Android App Development with Kotlin'],
        recommendedCertifications: ['Google Associate Android Developer Prep'],
        recommendedProjects: ['Habit Tracker & Productivity App with Beautiful UI'],
        checkpoints: ['Build multi-screen layouts with responsive constraints', 'Handle device orientation and dark/light theme switching', 'Implement fluid micro-animations'],
        relevantJobRoles: ['Junior Flutter Developer', 'Mobile App Intern']
      },
      {
        id: 'mob-2',
        stepNumber: 2,
        title: 'State Management, Offline Storage & REST Networking',
        roleLevel: 'Associate Mobile Developer',
        duration: '6 Weeks',
        description: 'Manage complex app state using Bloc/Provider/Riverpod, local SQLite/Hive caching, and network request handling.',
        requiredSkills: ['Bloc / Riverpod', 'Dio / HTTP Networking', 'Hive / SQLite (Room)', 'JSON Serialization'],
        recommendedCourses: ['State Management Masterclass in Flutter', 'Android Architecture Components (MVVM)'],
        recommendedCertifications: ['Meta Android Developer Professional Certificate'],
        recommendedProjects: ['Offline-First News & Article Reader with Local Bookmark Cache'],
        checkpoints: ['Implement unidirectional data flow state management', 'Sync remote REST API data with local offline cache', 'Handle flaky network reconnection seamlessly'],
        relevantJobRoles: ['Mobile Software Engineer', 'Android Developer']
      },
      {
        id: 'mob-3',
        stepNumber: 3,
        title: 'Hardware APIs, Push Notifications & App Store Release',
        roleLevel: 'Production Mobile Engineer',
        duration: '5 Weeks',
        description: 'Integrate device camera, GPS geolocation, Firebase Cloud Messaging, and publish production APK/AAB to Google Play Store.',
        requiredSkills: ['Firebase Auth & Push Notifications', 'Geolocation & Google Maps SDK', 'App Store / Play Console Publishing', 'CI/CD Fastlane'],
        recommendedCourses: ['Publishing Apps to Google Play and Apple App Store', 'Mobile CI/CD with Fastlane'],
        recommendedCertifications: ['Google Play Store Academy Certificate'],
        recommendedProjects: ['Food Delivery Tracking App with Live GPS and Order Push Notifications'],
        checkpoints: ['Publish live signed app to Google Play Store or TestFlight', 'Implement background push notifications', 'Automate builds with Fastlane'],
        relevantJobRoles: ['Mobile Application Developer', 'Flutter Specialist']
      }
    ]
  },

  // 7. Data Engineer (Big Data & Pipelines)
  {
    id: 'data-engineer',
    title: 'Data Engineer (Big Data & Pipelines)',
    domain: 'AI & Data Science',
    demand: 'Very High',
    averageSalary: '₹9 - 26 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Walmart Labs', 'Target', 'Uber', 'Databricks', 'Netflix'],
    description: 'Designs reliable ETL/ELT data pipelines, distributed Spark computing clusters, and data warehouse lakes.',
    keySkills: ['Python / PySpark', 'SQL (Advanced)', 'Apache Kafka', 'Airflow / dbt', 'Snowflake / BigQuery'],
    milestones: [
      {
        id: 'de-1',
        stepNumber: 1,
        title: 'Data Modeling & Relational / NoSQL Warehousing',
        roleLevel: 'Data Engineer Foundation',
        duration: '5 Weeks',
        description: 'Star and Snowflake dimensional schemas, normalization, fact/dimension tables, and analytical column stores.',
        requiredSkills: ['Dimensional Data Modeling', 'PostgreSQL / MySQL', 'Columnar Storage Concepts', 'Advanced SQL'],
        recommendedCourses: ['The Complete Dimensional Data Modeling Course', 'SQL for Analytics Engineers'],
        recommendedCertifications: ['Snowflake SnowPro Core Certification Prep'],
        recommendedProjects: ['E-Commerce Dimensional Star-Schema Data Mart'],
        checkpoints: ['Design fact and dimension tables with slowly changing dimensions (SCD Type 2)', 'Optimize analytical query execution plans', 'Benchmark columnar vs row-oriented query speeds'],
        relevantJobRoles: ['Junior Data Engineer', 'Database Developer']
      },
      {
        id: 'de-2',
        stepNumber: 2,
        title: 'Distributed Computing with Apache Spark & PySpark',
        roleLevel: 'Big Data Associate',
        duration: '6 Weeks',
        description: 'Process terabytes of data using distributed DataFrames, partitions, caching, and joins in Apache Spark.',
        requiredSkills: ['PySpark', 'Distributed Computing Architecture', 'Parquet & Delta Lake', 'Cluster Shuffling'],
        recommendedCourses: ['Apache Spark with Python (PySpark)', 'Databricks Certified Associate Data Engineer'],
        recommendedCertifications: ['Databricks Certified Associate Data Engineer'],
        recommendedProjects: ['Distributed Batch Processing Pipeline over 50M Records with PySpark'],
        checkpoints: ['Optimize broadcast joins and resolve data skew bottlenecks', 'Read and write columnar Parquet datasets', 'Write production Spark jobs for Dataproc/EMR'],
        relevantJobRoles: ['Big Data Engineer', 'Spark Developer']
      },
      {
        id: 'de-3',
        stepNumber: 3,
        title: 'Workflow Orchestration (Airflow) & Modern ELT (dbt)',
        roleLevel: 'Pipeline Engineer',
        duration: '5 Weeks',
        description: 'Build automated DAGs in Apache Airflow and transform warehouse data models with dbt and version control.',
        requiredSkills: ['Apache Airflow DAGs', 'dbt (Data Build Tool)', 'Data Quality Checks (Great Expectations)', 'Docker'],
        recommendedCourses: ['Astronomer Certified DAG Authoring with Airflow', 'dbt Fundamentals'],
        recommendedCertifications: ['dbt Certified Developer', 'Astronomer Airflow Certification'],
        recommendedProjects: ['Production Automated Daily ETL Pipeline with Airflow and dbt Cloud'],
        checkpoints: ['Write multi-task Airflow DAG with error alerting', 'Build modular dbt models with automated unit tests', 'Implement automated schema validation'],
        relevantJobRoles: ['Analytics Engineer', 'Data Pipeline Engineer']
      },
      {
        id: 'de-4',
        stepNumber: 4,
        title: 'Real-Time Streaming Pipelines with Apache Kafka',
        roleLevel: 'Senior Data Engineer',
        duration: '5 Weeks',
        description: 'Process real-time event streams with Apache Kafka producers, consumers, partitions, and Spark Streaming.',
        requiredSkills: ['Apache Kafka', 'Spark Structured Streaming', 'Event-Driven Architectures', 'Cloud Data Warehouses'],
        recommendedCourses: ['Apache Kafka Series for Beginners', 'Real-Time Data Streaming with Spark & Kafka'],
        recommendedCertifications: ['Confluent Certified Developer for Apache Kafka (CCDAK)'],
        recommendedProjects: ['Live Clickstream Analytics Pipeline Streaming 10,000 Events/sec to BigQuery'],
        checkpoints: ['Configure resilient Kafka topic partition schemes', 'Implement exactly-once streaming semantics', 'Feed real-time dashboard from Kafka consumer'],
        relevantJobRoles: ['Data Engineer', 'Streaming Pipeline Architect']
      }
    ]
  },

  // 8. Frontend Engineer & Web Architect
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer & Web Architect',
    domain: 'Software & Web Engineering',
    demand: 'High',
    averageSalary: '₹7 - 22 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Atlassian', 'Adobe', 'Canva', 'Intuit', 'MakeMyTrip'],
    description: 'Crafts blazing-fast, accessible, pixel-perfect user interfaces, custom design systems, and rich web experiences.',
    keySkills: ['JavaScript / TypeScript', 'React / Next.js', 'CSS3 / Tailwind', 'Web Performance', 'Accessibility (a11y)'],
    milestones: [
      {
        id: 'fe-1',
        stepNumber: 1,
        title: 'Semantic HTML5, Advanced Modern CSS & Responsive Layouts',
        roleLevel: 'UI Craftsman',
        duration: '4 Weeks',
        description: 'Flexbox, CSS Grid, custom properties, animations, accessibility (WCAG 2.1), and responsive typography.',
        requiredSkills: ['CSS Grid & Flexbox', 'TailwindCSS', 'WCAG Accessibility', 'Micro-Animations'],
        recommendedCourses: ['Advanced CSS and Sass', 'Web Accessibility (a11y) Mastery'],
        recommendedCertifications: ['W3Cx Front-End Web Developer Certificate'],
        recommendedProjects: ['Pixel-Perfect SaaS Landing Page with Dark Mode & Animations'],
        checkpoints: ['Achieve 100% WCAG accessibility audit score', 'Implement responsive layout without media query bloat', 'Create fluid CSS keyframe animations'],
        relevantJobRoles: ['UI Developer', 'Junior Web Developer']
      },
      {
        id: 'fe-2',
        stepNumber: 2,
        title: 'TypeScript & Component-Driven Architecture with React',
        roleLevel: 'React Specialist',
        duration: '6 Weeks',
        description: 'Clean component decomposition, custom hooks, render optimization, form handling, and strict TypeScript types.',
        requiredSkills: ['React 18+ Hooks', 'TypeScript Generics', 'TanStack Query', 'React Hook Form & Zod'],
        recommendedCourses: ['Epic React by Kent C. Dodds', 'Total TypeScript Core Pro'],
        recommendedCertifications: ['Meta Front-End Developer Certificate'],
        recommendedProjects: ['Enterprise Admin Dashboard with Virtualized Data Grids'],
        checkpoints: ['Write custom hooks for data fetching and caching', 'Eliminate unnecessary component re-renders with useMemo/useCallback', 'Validate complex form state with Zod schemas'],
        relevantJobRoles: ['Frontend Engineer', 'React Developer']
      },
      {
        id: 'fe-3',
        stepNumber: 3,
        title: 'Next.js, Server Components & Core Web Vitals Optimization',
        roleLevel: 'Senior Frontend Architect',
        duration: '5 Weeks',
        description: 'React Server Components (RSC), dynamic code splitting, image optimization, edge rendering, and sub-second LCP.',
        requiredSkills: ['Next.js App Router', 'Core Web Vitals (LCP, INP, CLS)', 'Code Splitting', 'Edge Caching'],
        recommendedCourses: ['Next.js Enterprise Architecture', 'Web Performance Optimization Masterclass'],
        recommendedCertifications: ['Vercel Certified Next.js Developer'],
        recommendedProjects: ['High-Performance E-Commerce Web App with Sub-Second Page Loads'],
        checkpoints: ['Achieve sub-1.2s Largest Contentful Paint (LCP)', 'Implement route prefetching and streaming with Suspense', 'Configure end-to-end testing with Playwright'],
        relevantJobRoles: ['Frontend Architect', 'Lead Frontend Engineer']
      }
    ]
  },

  // 9. Backend Systems Engineer (Microservices)
  {
    id: 'backend-engineer',
    title: 'Backend Systems Engineer (Microservices)',
    domain: 'Software & Web Engineering',
    demand: 'Very High',
    averageSalary: '₹9 - 25 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Uber', 'Goldman Sachs', 'PhonePe', 'Oracle', 'CRED'],
    description: 'Designs high-throughput distributed backend services, asynchronous workers, and low-latency databases.',
    keySkills: ['Java / Spring Boot or Go', 'Node.js', 'PostgreSQL / Redis', 'Kafka', 'System Design', 'gRPC'],
    milestones: [
      {
        id: 'be-1',
        stepNumber: 1,
        title: 'Concurrent Programming & Data Structures in Java / Go',
        roleLevel: 'Systems Foundation',
        duration: '5 Weeks',
        description: 'Multi-threading, thread pools, memory management, synchronization, and low-level data structures.',
        requiredSkills: ['Java Concurrency / Go Goroutines', 'Memory Allocation', 'OOP & SOLID Principles', 'Unit Testing (JUnit/Testify)'],
        recommendedCourses: ['Java Multithreading & Concurrency', 'Go: The Complete Developer Guide'],
        recommendedCertifications: ['Oracle Certified Professional: Java SE Developer'],
        recommendedProjects: ['High-Throughput Multi-Threaded HTTP Server from Scratch'],
        checkpoints: ['Implement thread-safe queues and worker pools', 'Prevent deadlocks and race conditions', 'Achieve 90%+ unit test code coverage'],
        relevantJobRoles: ['Backend Trainee', 'Software Development Intern']
      },
      {
        id: 'be-2',
        stepNumber: 2,
        title: 'Microservices Architecture & gRPC / REST APIs',
        roleLevel: 'Microservices Engineer',
        duration: '6 Weeks',
        description: 'Build enterprise microservices using Spring Boot or Go Gin, protocol buffers, gRPC, and service discovery.',
        requiredSkills: ['Spring Boot / Go Gin', 'gRPC & Protocol Buffers', 'API Gateways', 'Database Transactions & ACID'],
        recommendedCourses: ['Microservices with Spring Boot and Spring Cloud', 'Building High-Performance APIs with gRPC'],
        recommendedCertifications: ['Spring Certified Professional'],
        recommendedProjects: ['Decoupled Order Processing Microservices with gRPC Inter-Service Communication'],
        checkpoints: ['Define proto schema contracts for inter-service communication', 'Implement circuit breaker patterns with Resilience4j', 'Manage distributed transactions with Saga pattern'],
        relevantJobRoles: ['Backend Software Engineer', 'Java/Go Developer']
      },
      {
        id: 'be-3',
        stepNumber: 3,
        title: 'Distributed Caching, Asynchronous Queues & Low-Level Design',
        roleLevel: 'Senior Backend Engineer',
        duration: '6 Weeks',
        description: 'Scale systems to 100,000 requests/sec with Redis caching, Kafka message streaming, and horizontal database sharding.',
        requiredSkills: ['Redis In-Memory Caching', 'Apache Kafka', 'Database Sharding & Replication', 'High-Level System Design'],
        recommendedCourses: ['Designing Data-Intensive Applications', 'System Design Interview Guide'],
        recommendedCertifications: ['Redis Certified Developer'],
        recommendedProjects: ['Distributed Flash Sale Ticketing System with Rate Limiting & Redis Locks'],
        checkpoints: ['Implement distributed locks with Redlock algorithm', 'Prevent cache stampedes and cache penetration', 'Scale backend to handle 10k concurrent req/sec benchmark'],
        relevantJobRoles: ['Backend Engineer (SDE 2)', 'Distributed Systems Engineer']
      }
    ]
  },

  // 10. Embedded Systems & IoT Engineer
  {
    id: 'embedded-iot-engineer',
    title: 'Embedded Systems & IoT Engineer',
    domain: 'Hardware & Systems',
    demand: 'High',
    averageSalary: '₹7 - 18 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Bosch', 'Qualcomm', 'Texas Instruments', 'Schneider Electric', 'Tata Elxsi'],
    description: 'Develops real-time firmware, microcontrollers, sensor telemetry, and hardware communication protocols.',
    keySkills: ['Embedded C/C++', 'ARM Cortex / ESP32', 'RTOS (FreeRTOS)', 'I2C / SPI / UART', 'MQTT', 'PCB Layouts'],
    milestones: [
      {
        id: 'emb-1',
        stepNumber: 1,
        title: 'Microcontroller Architecture & Embedded C',
        roleLevel: 'Firmware Foundation',
        duration: '5 Weeks',
        description: 'C bitwise operators, register-level hardware manipulation, timers, GPIO interrupts, and pointers.',
        requiredSkills: ['Embedded C', 'Microcontroller Architecture', 'GPIO & Timers', 'Oscilloscopes & Logic Analyzers'],
        recommendedCourses: ['Embedded Systems Programming on ARM Cortex-M', 'Mastering Microcontroller with Embedded Driver Development'],
        recommendedCertifications: ['ARM Accredited Engineer Certification Prep'],
        recommendedProjects: ['Bare-Metal UART & Sensor Driver on STM32 Microcontroller'],
        checkpoints: ['Write custom register-level peripheral drivers without HAL', 'Configure hardware timers and external interrupts', 'Debug signals using digital logic analyzer'],
        relevantJobRoles: ['Firmware Trainee', 'Embedded Systems Intern']
      },
      {
        id: 'emb-2',
        stepNumber: 2,
        title: 'Real-Time Operating Systems (FreeRTOS) & Bus Protocols',
        roleLevel: 'Embedded Developer',
        duration: '6 Weeks',
        description: 'Multi-task scheduling, mutexes, semaphores, queues in FreeRTOS, and SPI / I2C / CAN bus communication.',
        requiredSkills: ['FreeRTOS Tasks & Queues', 'CAN Bus Protocol', 'I2C & SPI Serial Communication', 'Memory Leaks in C'],
        recommendedCourses: ['Mastering RTOS: Hands-On FreeRTOS and STM32', 'Automotive CAN Bus Protocol Training'],
        recommendedCertifications: ['Embedded Linux Certification'],
        recommendedProjects: ['Multi-Sensor Vehicle Telemetry Logger with FreeRTOS & CAN Bus'],
        checkpoints: ['Coordinate concurrent tasks with FreeRTOS queues and semaphores', 'Prevent priority inversion using priority inheritance mutexes', 'Decode live CAN bus sensor packets'],
        relevantJobRoles: ['Embedded Software Engineer', 'IoT Firmware Engineer']
      },
      {
        id: 'emb-3',
        stepNumber: 3,
        title: 'IoT Cloud Telemetry & Over-The-Air (OTA) Updates',
        roleLevel: 'IoT Systems Specialist',
        duration: '5 Weeks',
        description: 'Connect hardware to cloud via MQTT/TLS, build edge sensor dashboards, and deploy remote firmware updates.',
        requiredSkills: ['ESP32 / Wi-Fi', 'MQTT over TLS', 'AWS IoT Core / Azure IoT', 'OTA Firmware Updates'],
        recommendedCourses: ['Building Industrial IoT Applications', 'AWS IoT Core Hands-on'],
        recommendedCertifications: ['AWS Certified IoT Core Specialist'],
        recommendedProjects: ['Industrial Smart Factory Energy Monitoring Node with Secure Cloud Telemetry'],
        checkpoints: ['Implement secure TLS MQTT connection to cloud broker', 'Deploy fail-safe dual-partition Over-The-Air (OTA) firmware updates', 'Optimize power consumption for battery longevity'],
        relevantJobRoles: ['IoT Solutions Engineer', 'Embedded Hardware Developer']
      }
    ]
  },

  // 11. Associate Product Manager (APM / Tech PM)
  {
    id: 'product-manager',
    title: 'Associate Product Manager (APM / Tech PM)',
    domain: 'Product & Design',
    demand: 'High',
    averageSalary: '₹12 - 28 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Flipkart APM', 'Microsoft PM', 'Swiggy', 'Razorpay', 'Uber'],
    description: 'Drives product vision, gathers user requirements, writes PRDs, collaborates with engineers, and analyzes product metrics.',
    keySkills: ['Product Strategy', 'PRD Writing', 'User Research', 'A/B Testing', 'Agile / Scrum', 'SQL for Product'],
    milestones: [
      {
        id: 'pm-1',
        stepNumber: 1,
        title: 'Product Discovery, User Research & Problem Framing',
        roleLevel: 'Product Trainee',
        duration: '4 Weeks',
        description: 'Conduct user interviews, map customer journeys, define problem statements, and build user personas.',
        requiredSkills: ['User Persona Building', 'Customer Journey Mapping', 'Product Empathy', 'Competitive Teardowns'],
        recommendedCourses: ['Product Management Fundamentals by Stanford Online', 'User Research Masterclass'],
        recommendedCertifications: ['Google Project Management Certificate'],
        recommendedProjects: ['Deep-Dive Product Teardown of Zepto / Blinkit Quick Commerce'],
        checkpoints: ['Interview 10+ target users and synthesize insights', 'Map friction points in existing user workflows', 'Write concise problem statements without pre-judging solutions'],
        relevantJobRoles: ['Product Analyst', 'APM Intern']
      },
      {
        id: 'pm-2',
        stepNumber: 2,
        title: 'PRDs, Wireframing & Agile Technical Collaboration',
        roleLevel: 'Associate Product Manager',
        duration: '5 Weeks',
        description: 'Author comprehensive Product Requirement Documents (PRDs), design Figma wireframes, and run sprint planning with engineers.',
        requiredSkills: ['PRD Writing', 'Figma Wireframing', 'Jira / Agile Sprints', 'Feature Prioritization (RICE/MoSCoW)'],
        recommendedCourses: ['One Month PM: Writing Impactful PRDs', 'Agile Scrum Product Owner Course'],
        recommendedCertifications: ['Professional Scrum Product Owner (PSPO I)'],
        recommendedProjects: ['Production-Grade PRD for Career Sync Mentorship Matching Feature'],
        checkpoints: ['Write end-to-end PRD with acceptance criteria & edge cases', 'Create interactive clickable wireframe in Figma', 'Prioritize backlog using RICE scoring matrix'],
        relevantJobRoles: ['Associate Product Manager (APM)', 'Technical PM']
      },
      {
        id: 'pm-3',
        stepNumber: 3,
        title: 'Product Analytics, Growth Metrics & Go-To-Market (GTM)',
        roleLevel: 'Growth PM',
        duration: '5 Weeks',
        description: 'Track North Star metrics, funnel conversion, cohort retention, and design A/B testing experiment plans.',
        requiredSkills: ['Mixpanel / Amplitude', 'SQL Data Extraction', 'Funnel Analytics', 'Go-To-Market (GTM) Strategy'],
        recommendedCourses: ['Reforge Product Growth Foundations', 'Product Analytics with Amplitude'],
        recommendedCertifications: ['Mixpanel Certified Product Analytics Partner'],
        recommendedProjects: ['Onboarding Funnel Optimization & A/B Experimentation Strategy'],
        checkpoints: ['Instrument event tracking schema for user telemetry', 'Analyze funnel drop-offs and design hypothesis for uplift', 'Deliver executive presentation on launch strategy'],
        relevantJobRoles: ['Product Manager', 'Growth Product Manager']
      }
    ]
  },

  // 12. UI/UX Product Designer
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    domain: 'Product & Design',
    demand: 'High',
    averageSalary: '₹7 - 20 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Cred', 'Razorpay', 'Swiggy', 'Zomato', 'Microsoft Design'],
    description: 'Designs intuitive digital interfaces, design systems, interactive prototypes, and conducts usability testing.',
    keySkills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Visual Hierarchy', 'Usability Testing'],
    milestones: [
      {
        id: 'des-1',
        stepNumber: 1,
        title: 'Design Principles, Typography & Figma Mastery',
        roleLevel: 'Visual Design Foundation',
        duration: '4 Weeks',
        description: 'Color theory, 8pt spatial grids, typography pairing, auto-layout, and reusable component creation in Figma.',
        requiredSkills: ['Figma Auto-Layout', 'Design Systems', 'Typography & Contrast', 'Component Variants'],
        recommendedCourses: ['Figma UI UX Design Essentials', 'Advanced Design Systems with Figma'],
        recommendedCertifications: ['Google UX Design Professional Certificate'],
        recommendedProjects: ['Modern Clean Mobile Banking UI Design in Figma'],
        checkpoints: ['Build scalable Figma component library with variants', 'Implement accessible contrast ratios (WCAG AAA)', 'Organize tokens for light and dark modes'],
        relevantJobRoles: ['UI Designer', 'Visual Design Intern']
      },
      {
        id: 'des-2',
        stepNumber: 2,
        title: 'UX Research, Information Architecture & Prototyping',
        roleLevel: 'UX Designer',
        duration: '5 Weeks',
        description: 'Card sorting, wireframing, interactive micro-animations, and conducting remote moderated usability tests.',
        requiredSkills: ['Information Architecture', 'Interactive Prototyping', 'Usability Testing', 'User Journey Maps'],
        recommendedCourses: ['Interaction Design Specialization by UC San Diego', 'Usability Testing in Practice'],
        recommendedCertifications: ['Nielsen Norman Group UX Basics'],
        recommendedProjects: ['Redesign Case Study of Complex Healthcare Portal with Usability Metrics'],
        checkpoints: ['Conduct 5 user usability testing sessions on interactive prototype', 'Document before/after metrics on task completion time', 'Build high-fidelity prototype with smart-animate transitions'],
        relevantJobRoles: ['Product Designer', 'UX Researcher']
      }
    ]
  },

  // 13. Blockchain & Web3 Smart Contract Engineer
  {
    id: 'blockchain-engineer',
    title: 'Blockchain & Web3 Engineer',
    domain: 'Emerging & Specialized Tech',
    demand: 'Rapid Growth',
    averageSalary: '₹10 - 28 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Polygon Labs', 'ConsenSys', 'Chainlink', 'Coinbase', 'Binance'],
    description: 'Develops secure Ethereum/EVM smart contracts, decentralized finance protocols, and integrates Web3 wallet dApps.',
    keySkills: ['Solidity', 'Hardhat / Foundry', 'Ethers.js / Wagmi', 'Smart Contract Auditing', 'EVM Internals'],
    milestones: [
      {
        id: 'bc-1',
        stepNumber: 1,
        title: 'Blockchain Architecture & Cryptography Fundamentals',
        roleLevel: 'Web3 Foundation',
        duration: '4 Weeks',
        description: 'SHA-256, Elliptic Curve Cryptography, Merkle trees, peer-to-peer consensus (PoS), and EVM state machines.',
        requiredSkills: ['Cryptography Basics', 'Ethereum Virtual Machine (EVM)', 'Wallets & RPC Nodes', 'Solidity Basics'],
        recommendedCourses: ['Blockchain and Deep Web3 Fundamentals', 'Ethereum and Solidity: The Complete Developer Guide'],
        recommendedCertifications: ['Certified Ethereum Developer'],
        recommendedProjects: ['Decentralized Escrow Smart Contract with Multi-Signature Release'],
        checkpoints: ['Explain EVM memory vs storage gas costs', 'Deploy ERC-20 token contract to Ethereum Sepolia testnet', 'Test contracts with Foundry/Hardhat'],
        relevantJobRoles: ['Smart Contract Intern', 'Junior Web3 Developer']
      },
      {
        id: 'bc-2',
        stepNumber: 2,
        title: 'DeFi Protocols, Security Auditing & dApp Frontend',
        roleLevel: 'Full Web3 Engineer',
        duration: '6 Weeks',
        description: 'Prevent reentrancy attacks, flash loan mechanics, Automated Market Makers (AMM), and connect React dApps via Wagmi.',
        requiredSkills: ['Foundry Testing', 'Smart Contract Security (Slither/Echidna)', 'Wagmi & Viem', 'DeFi Mechanics'],
        recommendedCourses: ['Smart Contract Security and Auditing Masterclass', 'Building Full Stack Web3 dApps'],
        recommendedCertifications: ['Cyfrin Updraft Smart Contract Security Certificate'],
        recommendedProjects: ['Decentralized Micro-Lending Protocol with React Frontend'],
        checkpoints: ['Run automated security audits with Slither and Mythril', 'Connect MetaMask wallet with live transaction state', 'Deploy verified contract on Polygon / Arbitrum'],
        relevantJobRoles: ['Blockchain Engineer', 'Smart Contract Auditor']
      }
    ]
  },

  // 14. Site Reliability Engineer (SRE)
  {
    id: 'site-reliability-engineer',
    title: 'Site Reliability Engineer (SRE)',
    domain: 'Cloud & DevOps',
    demand: 'Very High',
    averageSalary: '₹10 - 28 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Google', 'LinkedIn', 'Salesforce', 'MakeMyTrip', 'Atlassian'],
    description: 'Bridges software engineering and systems operations to guarantee 99.99% uptime, latency SLAs, and automated disaster recovery.',
    keySkills: ['Linux Internals', 'Go / Python Automation', 'SLI/SLO/SLA Design', 'Prometheus / Grafana', 'Chaos Engineering'],
    milestones: [
      {
        id: 'sre-1',
        stepNumber: 1,
        title: 'Observability & Metrics Engineering',
        roleLevel: 'SRE Associate',
        duration: '5 Weeks',
        description: 'Instrument software telemetry with OpenTelemetry, Prometheus metrics, distributed Jaeger tracing, and alerts.',
        requiredSkills: ['Prometheus & PromQL', 'Grafana Dashboards', 'Distributed Tracing', 'OpenTelemetry'],
        recommendedCourses: ['Monitoring and Alerting with Prometheus', 'SRE: Measuring and Managing Reliability by Google'],
        recommendedCertifications: ['Prometheus Certified Associate (PCA)'],
        recommendedProjects: ['Full Microservices Observability Dashboard with PromQL Alert Rules'],
        checkpoints: ['Formulate meaningful Service Level Objectives (SLOs) and Error Budgets', 'Configure latency percentile (p95, p99) alert notifications', 'Trace bottlenecks across distributed services'],
        relevantJobRoles: ['Monitoring Engineer', 'Operations Analyst']
      },
      {
        id: 'sre-2',
        stepNumber: 2,
        title: 'Chaos Engineering, Incident Triage & Automation',
        roleLevel: 'Reliability Engineer',
        duration: '6 Weeks',
        description: 'Automate root cause analysis, conduct chaos engineering fault injections with Chaos Mesh, and author incident postmortems.',
        requiredSkills: ['Chaos Mesh / Gremlin', 'Automated Remediation Scripts', 'Blameless Postmortems', 'Kubernetes Troubleshooting'],
        recommendedCourses: ['Chaos Engineering in Practice', 'Advanced SRE Automation in Go'],
        recommendedCertifications: ['Certified Kubernetes Administrator (CKA)'],
        recommendedProjects: ['Automated Pod Self-Healing & Network Partition Recovery Lab'],
        checkpoints: ['Simulate node crash and verify zero-downtime failover', 'Write blameless incident RCA postmortem report', 'Automate on-call runbook remediation with Go scripts'],
        relevantJobRoles: ['Site Reliability Engineer (SRE)', 'Infrastructure Specialist']
      }
    ]
  },

  // 15. Robotics & Autonomous Systems Engineer
  {
    id: 'robotics-engineer',
    title: 'Robotics & Autonomous Systems Engineer',
    domain: 'Hardware & Systems',
    demand: 'Rapid Growth',
    averageSalary: '₹8 - 24 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Boston Dynamics', 'GreyOrange', 'Ola Electric', 'Addverb Technologies', 'DRDO'],
    description: 'Develops motion planning algorithms, robot perception, sensor fusion, and controls using ROS 2 and C++.',
    keySkills: ['ROS 2', 'Modern C++ (C++17/20)', 'SLAM Algorithms', 'Gazebo Simulation', 'Sensor Fusion (Kalman Filter)'],
    milestones: [
      {
        id: 'rob-1',
        stepNumber: 1,
        title: 'Modern C++ & Kinematics Foundations',
        roleLevel: 'Robotics Foundation',
        duration: '5 Weeks',
        description: 'Forward & inverse kinematics, rigid body transformations, spatial math, and object-oriented C++17.',
        requiredSkills: ['Modern C++', 'Kinematics & Dynamics', 'Linear Algebra for Robotics', 'Linux for Robotics'],
        recommendedCourses: ['Modern Robotics by Northwestern University', 'C++ for Robotics on ROS'],
        recommendedCertifications: ['ROS Basics in 5 Days Certificate'],
        recommendedProjects: ['2-Link Robotic Arm Inverse Kinematics Simulator in C++'],
        checkpoints: ['Implement Denavit-Hartenberg transformation matrices', 'Write memory-safe modern C++ algorithms', 'Simulate trajectories in 3D coordinate space'],
        relevantJobRoles: ['Robotics Trainee', 'Controls Intern']
      },
      {
        id: 'rob-2',
        stepNumber: 2,
        title: 'ROS 2, Gazebo Simulation & Autonomous Navigation (SLAM)',
        roleLevel: 'Autonomous Systems Engineer',
        duration: '7 Weeks',
        description: 'ROS 2 nodes, topics, services, Gazebo physics simulation, LiDAR mapping, and Nav2 navigation stack.',
        requiredSkills: ['ROS 2 Humble / Iron', 'Gazebo Simulation', 'SLAM (Simultaneous Localization & Mapping)', 'Nav2 Stack'],
        recommendedCourses: ['ROS 2 Basics & Navigation Course', 'Autonomous Navigation with ROS 2'],
        recommendedCertifications: ['Open Robotics ROS 2 Developer Certificate'],
        recommendedProjects: ['Autonomous Warehouse Robot Navigating Obstacles in Gazebo with LiDAR SLAM'],
        checkpoints: ['Build URDF robot model with sensor plugins', 'Map unfamiliar virtual warehouse using 2D LiDAR SLAM', 'Navigate autonomous path using Nav2 costmaps'],
        relevantJobRoles: ['Robotics Software Engineer', 'Autonomous Navigation Specialist']
      }
    ]
  },

  // 16. QA & Automation Test Architect
  {
    id: 'qa-automation-engineer',
    title: 'QA & Automation Test Architect',
    domain: 'Software & Web Engineering',
    demand: 'High',
    averageSalary: '₹6 - 18 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Infosys', 'TCS', 'Capgemini', 'Cognizant', 'BrowserStack'],
    description: 'Builds end-to-end automated testing frameworks, performance load testing suites, and enforces code quality in CI/CD.',
    keySkills: ['Playwright', 'Selenium', 'Java / Python', 'Postman / REST Assured', 'JMeter / k6', 'CI/CD Testing'],
    milestones: [
      {
        id: 'qa-1',
        stepNumber: 1,
        title: 'Test Design, API Automation & Postman',
        roleLevel: 'QA Foundation',
        duration: '4 Weeks',
        description: 'Test case design, boundary value analysis, automated REST API verification, and Postman test scripts.',
        requiredSkills: ['Manual & Functional Testing', 'REST API Testing', 'Postman Automated Tests', 'Bug Tracking (Jira)'],
        recommendedCourses: ['Complete Software Testing Bootcamp', 'REST API Automation with Postman'],
        recommendedCertifications: ['ISTQB Certified Tester Foundation Level (CTFL)'],
        recommendedProjects: ['Comprehensive Automated API Test Suite for E-Commerce Backend'],
        checkpoints: ['Write 50+ boundary test cases for financial transactions', 'Automate response schema and status code assertions in Postman', 'Integrate test collections into Newman CLI'],
        relevantJobRoles: ['QA Engineer', 'API Test Associate']
      },
      {
        id: 'qa-2',
        stepNumber: 2,
        title: 'End-to-End Browser Automation with Playwright & CI/CD',
        roleLevel: 'Automation Engineer',
        duration: '5 Weeks',
        description: 'Build scalable UI test automation frameworks with Playwright or Cypress, parallel execution, and GitHub Actions integration.',
        requiredSkills: ['Playwright / Cypress', 'TypeScript / Python', 'Page Object Model (POM)', 'GitHub Actions Integration'],
        recommendedCourses: ['Playwright Automation with TypeScript', 'CI/CD Automated Test Pipelines'],
        recommendedCertifications: ['BrowserStack Certified Test Automation Engineer'],
        recommendedProjects: ['Page Object Model Playwright Test Framework Running Parallel in CI'],
        checkpoints: ['Implement Page Object Model (POM) pattern', 'Execute cross-browser headless test runs across Chromium/Firefox/WebKit', 'Generate visual regression snapshot diff reports'],
        relevantJobRoles: ['QA Automation Engineer', 'SDET (Software Development Engineer in Test)']
      }
    ]
  },

  // 17. Game Developer & Simulation Engineer
  {
    id: 'game-developer',
    title: 'Game Developer & Simulation Engineer',
    domain: 'Emerging & Specialized Tech',
    demand: 'Rapid Growth',
    averageSalary: '₹6 - 20 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Ubisoft India', 'EA Sports', 'Rockstar Games', 'Nazara Technologies', 'Krafton'],
    description: 'Designs real-time 3D game mechanics, physics engines, shaders, and multiplayer game networking in Unity or Unreal Engine.',
    keySkills: ['C# / C++', 'Unity / Unreal Engine 5', 'Shader Programming (HLSL)', 'Game Physics', '3D Math'],
    milestones: [
      {
        id: 'game-1',
        stepNumber: 1,
        title: 'Game Engine Architecture & 3D Math in Unity / C#',
        roleLevel: 'Game Dev Foundation',
        duration: '5 Weeks',
        description: 'Vectors, quaternions, raycasting, physics collisions, player controllers, and scene management in Unity.',
        requiredSkills: ['Unity Engine', 'C# Programming', '3D Vectors & Quaternions', 'Rigidbodies & Colliders'],
        recommendedCourses: ['Complete C# Unity Game Developer 3D', 'Mathematics for Game Development'],
        recommendedCertifications: ['Unity Certified Associate Game Developer'],
        recommendedProjects: ['Action Platformer 3D Game with Inventory & Combat Mechanics'],
        checkpoints: ['Implement smooth player movement and jump controller', 'Configure physics raycasting for interaction', 'Build modular game state manager in C#'],
        relevantJobRoles: ['Junior Game Developer', 'Unity Programmer']
      },
      {
        id: 'game-2',
        stepNumber: 2,
        title: 'Shaders, Optimization & Multiplayer Networking',
        roleLevel: 'Senior Game Engineer',
        duration: '6 Weeks',
        description: 'Shader Graph, draw call batching, memory profiling, and client-server multiplayer synchronization with Photon or Mirror.',
        requiredSkills: ['Shader Graph / HLSL', 'Draw Call Optimization', 'Multiplayer Networking', 'Particle Systems'],
        recommendedCourses: ['Advanced Unity Optimization & Shaders', 'Multiplayer Game Development with Netcode'],
        recommendedCertifications: ['Unity Certified Professional Programmer'],
        recommendedProjects: ['Multiplayer Arena Brawler Game with Server-Reconciliation'],
        checkpoints: ['Optimize scene to run stable 60 FPS on mid-tier mobile hardware', 'Implement client-side prediction and lag compensation', 'Write custom water and atmospheric shaders'],
        relevantJobRoles: ['Game Engineer', '3D Graphics Programmer']
      }
    ]
  },

  // 18. VLSI & Chip Design Engineer
  {
    id: 'vlsi-engineer',
    title: 'VLSI & Chip Design Engineer',
    domain: 'Hardware & Systems',
    demand: 'High',
    averageSalary: '₹9 - 26 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Intel', 'Qualcomm', 'AMD', 'Texas Instruments', 'NVIDIA'],
    description: 'Designs digital integrated circuits, writes Verilog/SystemVerilog RTL code, and performs FPGA synthesis and timing verification.',
    keySkills: ['Verilog / SystemVerilog', 'Digital Logic Design', 'Static Timing Analysis (STA)', 'FPGA Synthesis', 'UVM Verification'],
    milestones: [
      {
        id: 'vlsi-1',
        stepNumber: 1,
        title: 'Digital Electronics & Verilog RTL Design',
        roleLevel: 'RTL Design Trainee',
        duration: '5 Weeks',
        description: 'Combinational and sequential circuits, finite state machines (FSM), testbenches, and Verilog RTL.',
        requiredSkills: ['Verilog HDL', 'Finite State Machines', 'Combinational / Sequential Logic', 'ModelSim Simulation'],
        recommendedCourses: ['Digital IC Design with Verilog', 'FPGA Prototyping Masterclass'],
        recommendedCertifications: ['IEEE VLSI Design Foundation Certificate'],
        recommendedProjects: ['Configurable 32-bit ALU and Register File in Verilog RTL'],
        checkpoints: ['Design Mealy and Moore finite state machines', 'Write self-checking testbenches with assertions', 'Simulate gate-level timing in ModelSim'],
        relevantJobRoles: ['RTL Design Intern', 'VLSI Trainee']
      },
      {
        id: 'vlsi-2',
        stepNumber: 2,
        title: 'SystemVerilog Verification & Static Timing Analysis',
        roleLevel: 'ASIC Verification Engineer',
        duration: '7 Weeks',
        description: 'Coverage-driven verification in SystemVerilog, UVM methodology, setup and hold timing closure, and synthesis.',
        requiredSkills: ['SystemVerilog OOP', 'UVM Methodology', 'Static Timing Analysis (STA)', 'Vivado / Synopsys EDA'],
        recommendedCourses: ['SystemVerilog for Design and Verification', 'Static Timing Analysis Essentials'],
        recommendedCertifications: ['Cadence / Synopsys EDA Tool Certification'],
        recommendedProjects: ['Complete RISC-V 5-Stage Pipelined Processor Core on Xilinx FPGA'],
        checkpoints: ['Implement 5-stage instruction pipeline with hazard detection', 'Achieve 100% functional and code coverage on test suite', 'Resolve setup and hold time violations for timing closure'],
        relevantJobRoles: ['ASIC Verification Engineer', 'FPGA Design Engineer']
      }
    ]
  },

  // 19. Business Intelligence & Operations Analyst
  {
    id: 'bi-analyst',
    title: 'Business Intelligence & Operations Analyst',
    domain: 'Product & Design',
    demand: 'High',
    averageSalary: '₹6 - 16 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['Deloitte', 'EY', 'McKinsey', 'Amazon India', 'Accenture'],
    description: 'Connects data insights to business profitability, operational KPIs, automation workflows, and automated reporting systems.',
    keySkills: ['SQL', 'Power BI / Tableau', 'Advanced Excel', 'Business Metrics', 'Python for Automation'],
    milestones: [
      {
        id: 'bi-1',
        stepNumber: 1,
        title: 'Advanced Excel, SQL & Business Data Modeling',
        roleLevel: 'Analytics Foundation',
        duration: '4 Weeks',
        description: 'VLOOKUP/XLOOKUP, Power Query, pivot models, SQL aggregations, and business KPI definitions.',
        requiredSkills: ['Excel Power Query', 'SQL Queries & Joins', 'Financial & Operational Metrics', 'Data Auditing'],
        recommendedCourses: ['Data Analysis with Excel and Power Query', 'SQL for Business Analytics'],
        recommendedCertifications: ['Microsoft Office Specialist: Excel Expert'],
        recommendedProjects: ['Corporate Profit & Loss Automated Spreadsheet Model with Power Query'],
        checkpoints: ['Automate raw CSV cleaning with Power Query transforms', 'Calculate Gross Margin, EBITDA, and CAC across cohorts', 'Write complex nested SQL aggregations'],
        relevantJobRoles: ['Business Analyst Intern', 'Operations Trainee']
      },
      {
        id: 'bi-2',
        stepNumber: 2,
        title: 'Power BI Dashboarding, DAX & Automated Reports',
        roleLevel: 'BI Analyst',
        duration: '5 Weeks',
        description: 'Build enterprise data models with DAX formulas, interactive KPI visualizations, and automated email reporting.',
        requiredSkills: ['Power BI', 'DAX Measures & Calculated Columns', 'Data Modeling (Star Schema)', 'Executive Presentation'],
        recommendedCourses: ['PL-300: Microsoft Power BI Data Analyst Prep', 'Mastering DAX for Power BI'],
        recommendedCertifications: ['Microsoft Certified: Power BI Data Analyst Associate (PL-300)'],
        recommendedProjects: ['Enterprise Supply Chain & Logistics Operations Dashboard in Power BI'],
        checkpoints: ['Write time-intelligence DAX measures (YTD, MoM Growth)', 'Design intuitive drill-through report pages for C-suite executives', 'Schedule automated daily cloud gateway refreshes'],
        relevantJobRoles: ['BI Analyst', 'Analytics Consultant']
      }
    ]
  },

  // 20. NLP & Generative AI Solutions Engineer
  {
    id: 'nlp-genai-engineer',
    title: 'NLP & Generative AI Solutions Engineer',
    domain: 'AI & Data Science',
    demand: 'Very High',
    averageSalary: '₹12 - 30 LPA',
    experienceLevel: 'Entry to Mid Level (0-3 yrs)',
    topEmployers: ['OpenAI Partners', 'Microsoft AI', 'TechNova', 'Google Cloud', 'Cohere'],
    description: 'Specializes in language models, tokenization, semantic search, AI agent orchestration, and fine-tuning open weights.',
    keySkills: ['LLM Orchestration', 'LangChain / LangGraph', 'Hugging Face', 'Vector Search', 'Fine-Tuning (QLoRA)'],
    milestones: [
      {
        id: 'nlp-1',
        stepNumber: 1,
        title: 'Tokenization, Embeddings & Language Fundamentals',
        roleLevel: 'NLP Foundation',
        duration: '4 Weeks',
        description: 'Subword tokenization (BPE), Word2Vec, BERT embeddings, cosine similarity, and semantic search mechanics.',
        requiredSkills: ['Hugging Face Transformers', 'Tokenization (BPE/WordPiece)', 'Sentence Transformers', 'Python'],
        recommendedCourses: ['Hugging Face NLP Course', 'Natural Language Processing with Attention Models'],
        recommendedCertifications: ['DeepLearning.AI NLP Specialization'],
        recommendedProjects: ['Semantic Code Search Engine over GitHub Repositories'],
        checkpoints: ['Generate and index 100k dense embeddings with ChromaDB', 'Fine-tune classification head on BERT', 'Evaluate semantic similarity across cross-lingual sentences'],
        relevantJobRoles: ['NLP Intern', 'Junior AI Developer']
      },
      {
        id: 'nlp-2',
        stepNumber: 2,
        title: 'Autonomous AI Agents, LangGraph & Production Guardrails',
        roleLevel: 'Generative AI Engineer',
        duration: '6 Weeks',
        description: 'Build multi-agent collaboration systems with tools, memory, structured JSON outputs, and guardrail validation.',
        requiredSkills: ['LangGraph / CrewAI', 'Tool Calling & Function Calling', 'Guardrails AI & NeMo', 'Model Quantization'],
        recommendedCourses: ['Building Autonomous Multi-Agent Systems with LangGraph', 'Production GenAI Safety and Evaluation'],
        recommendedCertifications: ['Google Cloud Generative AI Leader Badge'],
        recommendedProjects: ['Autonomous Academic Research Agent Synthesizing ArXiv Papers into Reports'],
        checkpoints: ['Build stateful cyclical agent workflow with LangGraph', 'Enforce strict schema output with Pydantic and Outlines', 'Deploy guardrails preventing prompt injection and PII leakage'],
        relevantJobRoles: ['Generative AI Engineer', 'AI Agent Architect']
      }
    ]
  }
];
