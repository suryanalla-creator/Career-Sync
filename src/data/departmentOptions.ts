export interface DepartmentOption {
  id: string;
  name: string;
  shortName: string;
  category: 'Computing & Information Systems' | 'Electrical & Electronics' | 'Mechanical & Aerospace' | 'Civil, Chemical & Applied Sciences';
}

export const DEPARTMENT_CATEGORIES = [
  'Computing & Information Systems',
  'Electrical & Electronics',
  'Mechanical & Aerospace',
  'Civil, Chemical & Applied Sciences'
] as const;

export const DEPARTMENT_OPTIONS: DepartmentOption[] = [
  // ── 1. Computing & Information Systems (13 Options) ─────────────────────
  {
    id: 'cse',
    name: 'Computer Science & Engineering (CSE)',
    shortName: 'CSE',
    category: 'Computing & Information Systems'
  },
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & Machine Learning (AI & ML)',
    shortName: 'AI & ML',
    category: 'Computing & Information Systems'
  },
  {
    id: 'ai-ds',
    name: 'Artificial Intelligence & Data Science (AI & DS)',
    shortName: 'AI & DS',
    category: 'Computing & Information Systems'
  },
  {
    id: 'data-science',
    name: 'Data Science & Big Data Analytics',
    shortName: 'Data Science',
    category: 'Computing & Information Systems'
  },
  {
    id: 'it',
    name: 'Information Technology (IT)',
    shortName: 'IT',
    category: 'Computing & Information Systems'
  },
  {
    id: 'ise',
    name: 'Information Science & Engineering (ISE)',
    shortName: 'ISE',
    category: 'Computing & Information Systems'
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security & Digital Forensics',
    shortName: 'Cyber Security',
    category: 'Computing & Information Systems'
  },
  {
    id: 'cloud-devops',
    name: 'Cloud Computing & DevOps',
    shortName: 'Cloud & DevOps',
    category: 'Computing & Information Systems'
  },
  {
    id: 'software-eng',
    name: 'Software Engineering & System Architecture',
    shortName: 'Software Eng',
    category: 'Computing & Information Systems'
  },
  {
    id: 'iot',
    name: 'Internet of Things (IoT) & Smart Embedded Systems',
    shortName: 'IoT',
    category: 'Computing & Information Systems'
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Distributed Computing',
    shortName: 'Blockchain',
    category: 'Computing & Information Systems'
  },
  {
    id: 'game-design',
    name: 'Game Development & Computer Graphics',
    shortName: 'Game Dev',
    category: 'Computing & Information Systems'
  },
  {
    id: 'bca-mca',
    name: 'Computer Applications (BCA / MCA)',
    shortName: 'BCA/MCA',
    category: 'Computing & Information Systems'
  },

  // ── 2. Electrical & Electronics (6 Options) ─────────────────────────────
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering (ECE)',
    shortName: 'ECE',
    category: 'Electrical & Electronics'
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics Engineering (EEE)',
    shortName: 'EEE',
    category: 'Electrical & Electronics'
  },
  {
    id: 'electronics-comp',
    name: 'Electronics & Computer Engineering',
    shortName: 'ECM',
    category: 'Electrical & Electronics'
  },
  {
    id: 'telecom',
    name: 'Telecommunication Engineering (ETE / ETC)',
    shortName: 'Telecom',
    category: 'Electrical & Electronics'
  },
  {
    id: 'ice',
    name: 'Instrumentation & Control Engineering (ICE)',
    shortName: 'ICE',
    category: 'Electrical & Electronics'
  },
  {
    id: 'vlsi',
    name: 'VLSI Design & Semiconductor Microelectronics',
    shortName: 'VLSI',
    category: 'Electrical & Electronics'
  },

  // ── 3. Mechanical & Aerospace (7 Options) ────────────────────────────────
  {
    id: 'mech',
    name: 'Mechanical Engineering (ME)',
    shortName: 'ME',
    category: 'Mechanical & Aerospace'
  },
  {
    id: 'robotics',
    name: 'Robotics & Industrial Automation',
    shortName: 'Robotics',
    category: 'Mechanical & Aerospace'
  },
  {
    id: 'mechatronics',
    name: 'Mechatronics & Autonomous Systems',
    shortName: 'Mechatronics',
    category: 'Mechanical & Aerospace'
  },
  {
    id: 'aerospace',
    name: 'Aerospace Engineering',
    shortName: 'Aerospace',
    category: 'Mechanical & Aerospace'
  },
  {
    id: 'aeronautical',
    name: 'Aeronautical Engineering',
    shortName: 'Aeronautical',
    category: 'Mechanical & Aerospace'
  },
  {
    id: 'automobile-ev',
    name: 'Automobile & Electric Vehicle (EV) Engineering',
    shortName: 'Automobile / EV',
    category: 'Mechanical & Aerospace'
  },
  {
    id: 'industrial-prod',
    name: 'Industrial & Production Engineering',
    shortName: 'IPE',
    category: 'Mechanical & Aerospace'
  },

  // ── 4. Civil, Chemical & Applied Sciences (9 Options) ───────────────────
  {
    id: 'civil',
    name: 'Civil & Structural Engineering (CE)',
    shortName: 'CE',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'construction',
    name: 'Construction Technology & Infrastructure Management',
    shortName: 'Construction Tech',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'chemical',
    name: 'Chemical Engineering & Process Design',
    shortName: 'Chemical',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'biotech',
    name: 'Biotechnology & Bioinformatics',
    shortName: 'Biotech',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'biomedical',
    name: 'Biomedical Engineering & Medical Devices',
    shortName: 'Biomedical',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'environmental',
    name: 'Environmental Engineering & Sustainability',
    shortName: 'Environmental',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'petroleum',
    name: 'Petroleum & Renewable Energy Engineering',
    shortName: 'Energy Eng',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'materials',
    name: 'Metallurgical & Materials Engineering',
    shortName: 'Materials',
    category: 'Civil, Chemical & Applied Sciences'
  },
  {
    id: 'architecture',
    name: 'Architecture, Urban Planning & Design (B.Arch)',
    shortName: 'B.Arch',
    category: 'Civil, Chemical & Applied Sciences'
  }
];

// Helper to get total count
export const TOTAL_DEPARTMENT_COUNT = DEPARTMENT_OPTIONS.length; // 35 options
