import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  GraduationCap,
  ChevronRight,
  Filter,
  Eye,
  MessageSquare,
  BarChart3,
  Code2,
  Cpu,
  Layers,
  Star,
  ExternalLink,
  X,
  PhoneCall,
  Calendar,
  Briefcase
} from 'lucide-react';
import { Candidate } from '../../types';
import { mockCandidates } from '../../data/mockData';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

interface StudentSkillDetail {
  name: string;
  category: 'Frontend' | 'Backend' | 'Cloud & DevOps' | 'AI & Data' | 'Core CS' | 'Soft Skills';
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verifiedDate: string;
}

interface MenteeProgressItem extends Candidate {
  usn: string;
  semester: string;
  mentorAssigned: string;
  skillsLearnt: StudentSkillDetail[];
  learningTrack: string;
  trackProgress: number;
  recentMilestone: string;
  completedCertifications: string[];
}

export const MyStudentsProgressView: React.FC = () => {
  const { setActiveTab, setIsMessagesOpen, setIsPhoneCallOpen, setActiveCallContact } = useApp();
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<MenteeProgressItem | null>(null);
  const [mentorFeedback, setMentorFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      api.students.getCandidates({
        q: searchQuery.trim() || undefined,
        department: selectedDept !== 'All' ? selectedDept : undefined
      }).then(res => {
        if (res && res.candidates && res.candidates.length > 0) {
          setCandidates(res.candidates);
        }
      }).catch(err => {
        console.warn('Could not load candidates from backend, using fallback:', err);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedDept]);

  // Generate rich skills learnt for mentees
  const menteesData: MenteeProgressItem[] = candidates.map((cand, idx) => {
    const defaultSkills: StudentSkillDetail[] = [
      { name: cand.topSkills[0] || 'Python', category: 'Backend', score: Math.min(96, cand.skillScore + 3), level: 'Expert', verifiedDate: 'Sep 2026' },
      { name: cand.topSkills[1] || 'React', category: 'Frontend', score: cand.skillScore, level: 'Advanced', verifiedDate: 'Aug 2026' },
      { name: cand.topSkills[2] || 'TypeScript', category: 'Frontend', score: Math.max(70, cand.skillScore - 4), level: 'Advanced', verifiedDate: 'Jul 2026' },
      { name: cand.topSkills[3] || 'SQL & Databases', category: 'Backend', score: Math.max(68, cand.skillScore - 6), level: 'Intermediate', verifiedDate: 'Jun 2026' },
      { name: cand.topSkills[4] || 'Docker & Containers', category: 'Cloud & DevOps', score: Math.max(65, cand.skillScore - 10), level: 'Intermediate', verifiedDate: 'May 2026' },
      { name: 'Data Structures & Algorithms', category: 'Core CS', score: Math.min(98, cand.skillScore + 2), level: 'Expert', verifiedDate: 'Sep 2026' },
      { name: 'Git & GitHub Collaboration', category: 'Cloud & DevOps', score: 92, level: 'Advanced', verifiedDate: 'Apr 2026' },
      { name: 'System Design & Architecture', category: 'Backend', score: Math.max(60, cand.skillScore - 12), level: 'Intermediate', verifiedDate: 'Aug 2026' }
    ];

    const tracks = [
      'Full-Stack Cloud Engineering Track',
      'AI & Machine Learning Specialist Track',
      'Enterprise Backend & Microservices Track',
      'DevOps & Distributed Systems Track',
      'Data Engineering & Analytics Track'
    ];

    const usnPrefixes = ['1AP22CS', '1AP22AI', '1AP22IS', '1AP22EC'];
    const usn = cand.studentId || `${usnPrefixes[idx % usnPrefixes.length]}${String(idx + 1).padStart(3, '0')}`;

    return {
      ...cand,
      usn,
      semester: '7th Semester (Final Year)',
      mentorAssigned: 'Dr. K. Ramanathan (Placement Dean)',
      skillsLearnt: defaultSkills,
      learningTrack: tracks[idx % tracks.length],
      trackProgress: Math.min(95, 60 + (cand.skillScore % 35)),
      recentMilestone: `Completed ${defaultSkills[0].name} Assessment with ${defaultSkills[0].score}% score`,
      completedCertifications: [
        'AWS Certified Cloud Practitioner',
        'Meta Front-End Developer Certificate',
        'DeepLearning.AI Machine Learning Specialization'
      ].slice(0, Math.max(1, cand.certificationsCount % 4 + 1))
    };
  });

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Information Science & Engineering',
    'Electronics & Communication Engineering'
  ];

  const skillCategories = [
    'All',
    'Frontend',
    'Backend',
    'Cloud & DevOps',
    'AI & Data',
    'Core CS'
  ];

  const filteredMentees = menteesData.filter(st => {
    if (selectedDept !== 'All' && st.department !== selectedDept) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/^#/, '');
      const matchName = st.name.toLowerCase().includes(q);
      const matchUsn = (st.usn && st.usn.toLowerCase().includes(cleanQ)) ||
                       (st.studentId && st.studentId.toLowerCase().includes(cleanQ)) ||
                       (st.id && st.id.toLowerCase().includes(cleanQ));
      const matchSkills = st.skillsLearnt.some(sk => sk.name.toLowerCase().includes(q));
      const matchDept = st.department ? st.department.toLowerCase().includes(q) : false;
      if (!matchName && !matchUsn && !matchSkills && !matchDept) return false;
    }
    if (selectedCategory !== 'All') {
      const hasSkillInCategory = st.skillsLearnt.some(sk => sk.category === selectedCategory);
      if (!hasSkillInCategory) return false;
    }
    if (selectedSkillFilter) {
      const q = selectedSkillFilter.toLowerCase();
      const hasSpecificSkill = st.skillsLearnt.some(sk => sk.name.toLowerCase().includes(q));
      if (!hasSpecificSkill) return false;
    }
    return true;
  });

  const allUniqueSkills = Array.from(
    new Set(menteesData.flatMap(m => m.skillsLearnt.map(s => s.name)))
  );

  const avgSkillScore = Math.round(
    menteesData.reduce((acc, curr) => acc + curr.skillScore, 0) / (menteesData.length || 1)
  );

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorFeedback.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setMentorFeedback('');
      setSelectedStudent(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              Faculty &amp; Mentor Mentee Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              My Students &amp; Skill Progress Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track real-time learning progress, competencies learned up to now, assessment scores, and placement milestones for all assigned student mentees.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Mentees</span>
              <span className="text-xl font-black text-white">{menteesData.length}</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Avg Skill Score</span>
              <span className="text-xl font-black text-emerald-400">{avgSkillScore}%</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Unique Skills</span>
              <span className="text-xl font-black text-cyan-300">{allUniqueSkills.length}</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Readiness</span>
              <span className="text-xl font-black text-amber-300">88%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Interactive Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mentee by name, USN, or skill (e.g. React, Python, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              {departments.map(d => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skill Category Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter by Skill Domain:
          </span>
          {skillCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Mentees Progress Cards Grid */}
      {filteredMentees.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Mentees Matching Current Filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different department or skill category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All');
              setSelectedCategory('All');
              setSelectedSkillFilter('');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMentees.map((mentee) => (
            <div
              key={mentee.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                {/* Mentee Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={mentee.avatar}
                      alt={mentee.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-slate-900 leading-tight">
                          {mentee.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {mentee.usn}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {mentee.department}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                        <span className="font-bold text-blue-700">CGPA: {mentee.cgpa}</span>
                        <span>•</span>
                        <span>{mentee.semester}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skill Score Pill */}
                  <div className="text-right shrink-0">
                    <div className="px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-right shadow-2xs">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Overall Skill Score</span>
                      <span className="text-base font-black text-emerald-800">{mentee.skillScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Learning Track Progress */}
                <div className="mt-4 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      {mentee.learningTrack}
                    </span>
                    <span className="font-extrabold text-blue-700">{mentee.trackProgress}% Completed</span>
                  </div>
                  <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${mentee.trackProgress}%` }}
                    />
                  </div>
                </div>

                {/* ── CORE HIGHLIGHT: SKILLS LEARNT UP TO NOW ─────────────────── */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Skills Learnt Up To Now ({mentee.skillsLearnt.length})
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Proficiency Matrix
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {mentee.skillsLearnt.map((sk, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-colors flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">
                            {sk.category}
                          </span>
                          <p className="text-xs font-bold text-slate-900 truncate leading-tight" title={sk.name}>
                            {sk.name}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] font-bold pt-1 border-t border-slate-100">
                          <span
                            className={
                              sk.level === 'Expert'
                                ? 'text-purple-700'
                                : sk.level === 'Advanced'
                                ? 'text-blue-700'
                                : 'text-emerald-700'
                            }
                          >
                            {sk.level}
                          </span>
                          <span className="text-slate-700">{sk.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completed Certifications & Internship status */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">
                      {mentee.completedCertifications.length} Certifications Completed:
                    </span>
                    <span className="text-slate-800 font-bold truncate max-w-[200px]" title={mentee.completedCertifications.join(', ')}>
                      {mentee.completedCertifications.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mentee.internshipExperience}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedStudent(mentee)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Skill Progress</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsMessagesOpen(true);
                    }}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors cursor-pointer"
                    title="Message Mentee"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveCallContact({
                        name: mentee.name,
                        role: `B.Tech ${mentee.department.split(' ')[0]} Student`,
                        company: 'Apex Institute of Technology',
                        avatar: mentee.avatar,
                        phone: '+91 98765 43210'
                      });
                      setIsPhoneCallOpen(true);
                    }}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors cursor-pointer"
                    title="Audio Consultation"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── MODAL: FULL STUDENT SKILL DRILL-DOWN & PROGRESS AUDIT ────────── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:px-6 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20"
                />
                <div>
                  <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                    <span>{selectedStudent.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {selectedStudent.usn}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedStudent.degree} • {selectedStudent.department} • CGPA: {selectedStudent.cgpa}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
              {/* Overall Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Skill Score</span>
                  <span className="text-lg font-black text-emerald-700">{selectedStudent.skillScore}%</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Track Completion</span>
                  <span className="text-lg font-black text-blue-700">{selectedStudent.trackProgress}%</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Certifications</span>
                  <span className="text-lg font-black text-purple-700">{selectedStudent.completedCertifications.length}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Placement Status</span>
                  <span className="text-lg font-black text-amber-700">{selectedStudent.status}</span>
                </div>
              </div>

              {/* Comprehensive List of Skills Learnt Up To Now */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    Detailed Skills Learnt &amp; Assessment Ratings
                  </h4>
                  <span className="text-[11px] font-bold text-blue-600">
                    {selectedStudent.skillsLearnt.length} Skills Acquired
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedStudent.skillsLearnt.map((sk, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{sk.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                            {sk.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-500">{sk.level}</span>
                          <span className="font-mono font-black text-slate-900">{sk.score}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            sk.score >= 85
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              : sk.score >= 70
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600'
                          }`}
                          style={{ width: `${sk.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Certifications Showcase */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Course &amp; Industry Certifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedStudent.completedCertifications.map((cert, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Faculty Feedback / Recommendation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Mentor Feedback &amp; Next Skill Recommendations
                </h4>
                <form onSubmit={handleSendFeedback} className="space-y-3">
                  <textarea
                    rows={3}
                    value={mentorFeedback}
                    onChange={(e) => setMentorFeedback(e.target.value)}
                    placeholder="Write constructive mentorship feedback, recommended next modules, or interview prep advice..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <div className="flex items-center justify-between">
                    {feedbackSent ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Feedback dispatched to student portal!
                      </span>
                    ) : <span />}
                    <button
                      type="submit"
                      disabled={!mentorFeedback.trim()}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Send Guidance
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
