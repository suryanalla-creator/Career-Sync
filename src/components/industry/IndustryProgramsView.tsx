import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Sparkles,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Briefcase,
  Layers,
  X,
  ShieldCheck,
  Search,
  Filter,
  Check,
  AlertCircle,
  ExternalLink,
  Target,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningProgram } from '../../types';

export const IndustryProgramsView: React.FC = () => {
  const { learningPrograms, publishProgram, updateProgramStatus, triggerConfetti } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<LearningProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'All' | 'Live' | 'Closed' | 'Archived'>('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusActionLoadingId, setStatusActionLoadingId] = useState<string | null>(null);

  // Form State for Publishing a Program
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Bootcamp' | 'Workshop' | 'Certification' | 'Industry Training' | 'Webinar' | 'FDP'>('Bootcamp');
  const [provider, setProvider] = useState('TechNova Corporate Academy');
  const [duration, setDuration] = useState('6 Weeks (Cohort 4)');
  const [mode, setMode] = useState<'Live Online' | 'Hybrid' | 'Classroom' | 'Self-paced'>('Live Online');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [deadline, setDeadline] = useState('15 Nov 2026');
  const [maxSeats, setMaxSeats] = useState<number>(150);
  const [hasCertification, setHasCertification] = useState(true);
  const [prerequisites, setPrerequisites] = useState('Basic Data Structures, Algorithms, and proficiency in Python or TypeScript.');
  const [hiringAdvantage, setHiringAdvantage] = useState('Top 10% performers get direct fast-track interview for SDE-1 / Internship roles.');
  const [stipendOrCost, setStipendOrCost] = useState('Free University Sponsored');
  const [description, setDescription] = useState(
    'Comprehensive corporate training program covering production architectures, real-world capstone assignments, and weekly live mentorship with principal engineers.'
  );

  // Requirements List (multi-line / checklist)
  const [requirementsText, setRequirementsText] = useState(
    'Must be in 3rd or 4th year of engineering (Batch 2026 / 2027)\nMinimum 7.0 CGPA or 75%+ in Skill Assessment\nDedicated 8-10 hours/week for project sprints\nPersonal laptop with Git and Docker installed'
  );

  // Skills Gained
  const [skillsGained, setSkillsGained] = useState<string[]>([
    'Docker & Containers',
    'System Design',
    'LangChain & Vector DBs',
    'CI/CD Pipelines'
  ]);
  const [skillInput, setSkillInput] = useState('');

  // Eligible Branches
  const ALL_BRANCHES = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Information Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Business Analytics & Management'
  ];
  const [eligibleBranches, setEligibleBranches] = useState<string[]>([
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Information Science & Engineering'
  ]);

  const toggleBranch = (branch: string) => {
    setEligibleBranches(prev =>
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
  };

  const addSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skillsGained.includes(clean)) {
      setSkillsGained(prev => [...prev, clean]);
      setSkillInput('');
    }
  };

  const removeSkill = (sk: string) => {
    setSkillsGained(prev => prev.filter(s => s !== sk));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !duration.trim()) {
      alert('Please fill out the Program Title and Duration.');
      return;
    }

    setIsSubmitting(true);
    const parsedRequirements = requirementsText
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const programPayload: Partial<LearningProgram> = {
      title: title.trim(),
      category: category as any,
      provider: provider.trim() || 'TechNova Solutions',
      duration: duration.trim(),
      mode,
      level,
      deadline,
      maxSeats: Number(maxSeats) || 100,
      hasCertification,
      prerequisites: prerequisites.trim(),
      requirements: parsedRequirements,
      skillsGained,
      eligibleBranches,
      hiringAdvantage: hiringAdvantage.trim(),
      stipendOrCost: stipendOrCost.trim(),
      description: description.trim(),
      status: 'Live & Accepting'
    };

    const res = await publishProgram(programPayload);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setDuration('6 Weeks (Cohort 4)');
      setSkillsGained(['Docker & Containers', 'System Design']);
      triggerConfetti();
    } else {
      alert(res.message || 'Failed to publish program.');
    }
  };

  const handleToggleProgramStatus = async (prog: LearningProgram, targetStatus: 'Live & Accepting' | 'Closed' | 'Archived', reason?: string) => {
    setStatusActionLoadingId(prog.id);
    const res = await updateProgramStatus(prog.id, targetStatus, reason);
    setStatusActionLoadingId(null);
    if (res.success) {
      if (selectedProgram && selectedProgram.id === prog.id) {
        setSelectedProgram({
          ...selectedProgram,
          status: targetStatus,
          isClosed: targetStatus === 'Closed' || targetStatus === 'Archived',
          closedReason: reason
        });
      }
      triggerConfetti();
    } else {
      alert(res.message || 'Could not update status');
    }
  };

  // Filter programs
  const filteredPrograms = learningPrograms.filter(prog => {
    if (selectedCategoryTab !== 'All' && prog.category !== selectedCategoryTab) return false;
    
    // Status tab filtering
    if (selectedStatusTab === 'Live') {
      if (prog.status === 'Closed' || prog.status === 'Archived' || prog.isClosed) return false;
    } else if (selectedStatusTab === 'Closed') {
      if (prog.status !== 'Closed' && !prog.isClosed) return false;
    } else if (selectedStatusTab === 'Archived') {
      if (prog.status !== 'Archived') return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prog.title.toLowerCase().includes(q);
      const matchProvider = prog.provider?.toLowerCase().includes(q);
      const matchSkills = Array.isArray(prog.skillsGained) && prog.skillsGained.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchProvider && !matchSkills) return false;
    }
    return true;
  });

  const totalEnrolled = learningPrograms.reduce((acc, curr) => acc + (curr.enrolledCount || 0), 0);
  const liveCount = learningPrograms.filter(p => p.status !== 'Closed' && p.status !== 'Archived' && !p.isClosed).length;
  const closedCount = learningPrograms.filter(p => p.status === 'Closed' || p.isClosed).length;
  const archivedCount = learningPrograms.filter(p => p.status === 'Archived').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Top Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Corporate Academy &amp; Sponsored Talent Sprints
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Publish Training Programs &amp; Hackathon Workshops
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Equip college cohorts with hands-on mastery in your proprietary tech stacks. Define strict academic eligibility, candidate requirements, and fast-track hiring pipelines.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 self-start md:self-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Publish New Program
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">Published Programs</span>
            <span className="text-xl font-black text-white">{learningPrograms.length} Live Courses</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Enrolled Students</span>
            <span className="text-xl font-black text-emerald-400">{totalEnrolled > 0 ? totalEnrolled : 1240}+ Enrolled</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Partner Colleges</span>
            <span className="text-xl font-black text-amber-300">18 University MoUs</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">Hiring Fast-Track</span>
            <span className="text-xl font-black text-blue-300">92% Placement Rate</span>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search programs by title, skills (React, Docker, AI), or curriculum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs font-semibold">
            {['All', 'Bootcamp', 'Workshop', 'Certification', 'Industry Training'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryTab(cat)}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategoryTab === cat
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filters: All, Live & Accepting, Bookings Closed, Total Closed */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider mr-1">Booking Status:</span>
          <button
            onClick={() => setSelectedStatusTab('All')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              selectedStatusTab === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All ({learningPrograms.length})
          </button>
          <button
            onClick={() => setSelectedStatusTab('Live')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatusTab === 'Live'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live &amp; Accepting ({liveCount})
          </button>
          <button
            onClick={() => setSelectedStatusTab('Closed')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatusTab === 'Closed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Bookings Closed ({closedCount})
          </button>
          <button
            onClick={() => setSelectedStatusTab('Archived')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              selectedStatusTab === 'Archived'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Total Closed / Archived ({archivedCount})
          </button>
        </div>
      </div>

      {/* 3. Published Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((prog) => {
          const reqs = prog.requirements || [
            'Open to pre-final and final year B.Tech students',
            'Minimum 70% in baseline technical assessment',
            'Hands-on project submission required for certificate'
          ];
          const isClosed = prog.isClosed || prog.status === 'Closed' || prog.status === 'Archived';
          const isArchived = prog.status === 'Archived';

          return (
            <div
              key={prog.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between ${
                isArchived
                  ? 'border-slate-300 opacity-75 bg-slate-50/50'
                  : isClosed
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 hover:border-purple-400'
              }`}
            >
              <div>
                {/* Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                    {prog.category}
                  </span>
                  {isArchived ? (
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md border border-slate-300 flex items-center gap-1">
                      📁 Total Closed / Archived
                    </span>
                  ) : isClosed ? (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Bookings Closed
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Live &amp; Accepting
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-2">
                  <img
                    src={prog.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {prog.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">{prog.provider} • {prog.mode || 'Live Online'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 my-2">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-purple-600" /> {prog.duration}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">
                    Level: {prog.level}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
                  {prog.description}
                </p>

                {/* Key Requirements Highlights */}
                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    Entry Requirements &amp; Eligibility
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {reqs.slice(0, 2).map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Chips */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Competencies Acquired
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(prog.skillsGained) && prog.skillsGained.slice(0, 4).map((sk, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Publisher Closure Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs mt-4">
                <div>
                  <span className="font-bold text-slate-900 block">{prog.enrolledCount || 0} Students</span>
                  <span className="text-[10px] text-slate-400">Seats: {prog.maxSeats || 100}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedProgram(prog)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Requirements
                  </button>

                  {isClosed ? (
                    <button
                      disabled={statusActionLoadingId === prog.id}
                      onClick={() => handleToggleProgramStatus(prog, 'Live & Accepting')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Reopen Bookings
                    </button>
                  ) : (
                    <>
                      <button
                        disabled={statusActionLoadingId === prog.id}
                        onClick={() => handleToggleProgramStatus(prog, 'Closed', 'Cohort bookings reached capacity.')}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                        title="Stop new student enrollments while keeping course visible"
                      >
                        Close Bookings
                      </button>
                      <button
                        disabled={statusActionLoadingId === prog.id}
                        onClick={() => handleToggleProgramStatus(prog, 'Archived', 'Program completed and archived.')}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-[11px] transition-all cursor-pointer"
                        title="Archive and close program completely"
                      >
                        Total Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. PROGRAM REQUIREMENTS INSPECTION MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <img
                  src={selectedProgram.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase">
                    {selectedProgram.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedProgram.title}</h3>
                  <p className="text-slate-500">{selectedProgram.provider} • {selectedProgram.duration}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Requirements & Prerequisites */}
            <div className="space-y-3">
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                <h4 className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Eligibility &amp; Candidate Prerequisites
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedProgram.prerequisites || 'Basic programming fundamentals and curiosity to build.'}
                </p>
              </div>

              {/* Requirements Checklist */}
              <div>
                <span className="font-bold text-slate-800 block mb-2">Mandatory Admission Requirements:</span>
                <ul className="space-y-1.5">
                  {(selectedProgram.requirements && selectedProgram.requirements.length > 0
                    ? selectedProgram.requirements
                    : [
                        'Must be enrolled in accredited 4-year B.Tech / BE or MCA degree',
                        'Minimum 7.0 CGPA throughout academic semesters',
                        'Weekly commitment of 8+ hours for live coding sprints',
                        'Satisfactory completion of all milestone capstone projects'
                      ]
                  ).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligible Branches */}
              <div>
                <span className="font-bold text-slate-800 block mb-1.5">Eligible Academic Branches:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProgram.eligibleBranches && selectedProgram.eligibleBranches.length > 0
                    ? selectedProgram.eligibleBranches
                    : ['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Information Science & Engineering']
                  ).map((b, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold text-[11px]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hiring Advantage */}
              {selectedProgram.hiringAdvantage && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-start gap-2">
                  <Award className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block text-xs">Direct Hiring Advantage</span>
                    <span className="text-[11px] text-emerald-800">{selectedProgram.hiringAdvantage}</span>
                  </div>
                </div>
              )}

              {/* Publisher Closure & Booking Status Management */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Enrollment &amp; Booking Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedProgram.status === 'Archived'
                      ? 'bg-slate-200 text-slate-800'
                      : selectedProgram.status === 'Closed' || selectedProgram.isClosed
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedProgram.status === 'Archived'
                      ? '📁 Total Closed / Archived'
                      : selectedProgram.status === 'Closed' || selectedProgram.isClosed
                      ? '⛔ Bookings Closed'
                      : '✓ Live & Accepting'}
                  </span>
                </div>

                <p className="text-slate-500 text-[11px]">
                  As the publisher, you can pause bookings, reopen admissions, or totally close and archive this course/workshop at any time.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    disabled={statusActionLoadingId === selectedProgram.id}
                    onClick={() => handleToggleProgramStatus(selectedProgram, 'Live & Accepting')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                      selectedProgram.status === 'Live & Accepting' && !selectedProgram.isClosed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    ✓ Live &amp; Open
                  </button>

                  <button
                    disabled={statusActionLoadingId === selectedProgram.id}
                    onClick={() => handleToggleProgramStatus(selectedProgram, 'Closed', 'Cohort bookings reached capacity.')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                      selectedProgram.status === 'Closed' || selectedProgram.isClosed
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                  >
                    ⛔ Close Bookings
                  </button>

                  <button
                    disabled={statusActionLoadingId === selectedProgram.id}
                    onClick={() => handleToggleProgramStatus(selectedProgram, 'Archived', 'Course completed.')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                      selectedProgram.status === 'Archived'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    📁 Total Closing / Archive
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">
                Deadline: <strong className="text-slate-800">{selectedProgram.deadline || '15 Nov 2026'}</strong>
              </span>
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PUBLISH NEW PROGRAM MODAL WITH COMPREHENSIVE REQUIREMENTS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Publish Training Program / Workshop
                </h2>
                <p className="text-[11px] text-slate-500">
                  Broadcast curriculum and requirements directly to partner university rosters and student job boards.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Program / Workshop Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production Go & High-Concurrency Distributed Systems"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category / Format</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="Bootcamp">Corporate Bootcamp (Multi-week)</option>
                    <option value="Workshop">Hands-On Weekend Workshop</option>
                    <option value="Certification">Industry Certification Sprint</option>
                    <option value="Industry Training">Enterprise Technology Training</option>
                    <option value="Webinar">Expert Masterclass &amp; Webinar</option>
                    <option value="FDP">Faculty Development Program (FDP)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hosting Organization / Academy</label>
                  <input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Duration &amp; Schedule <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 Weeks, 3 Live Sprints / Week"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="Live Online">Live Online (Zoom / Teams)</option>
                    <option value="Hybrid">Hybrid (Online + Campus Lab)</option>
                    <option value="Classroom">Classroom On-Campus</option>
                    <option value="Self-paced">Self-paced with Office Hours</option>
                  </select>
                </div>
              </div>

              {/* Requirements & Eligibility Section */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <h3 className="font-bold text-purple-900 text-xs">
                    Academic &amp; Student Eligibility Requirements
                  </h3>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Prerequisites &amp; Prior Knowledge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Proficiency in Data Structures, SQL databases, and Git"
                    value={prerequisites}
                    onChange={(e) => setPrerequisites(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Specific Admission Requirements (One per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter requirements line by line&#10;e.g. Must be enrolled in 3rd/4th year B.Tech&#10;Minimum 7.0 CGPA&#10;Commitment of 8 hrs/week for project sprints"
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none text-xs font-mono"
                  />
                </div>

                {/* Eligible Branch Selectors */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Eligible Academic Departments:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_BRANCHES.map(branch => {
                      const isSelected = eligibleBranches.includes(branch);
                      return (
                        <button
                          type="button"
                          key={branch}
                          onClick={() => toggleBranch(branch)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          {branch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Skills Gained Tags */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skills Gained / Taught
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type skill & press Enter (e.g. Redis, Kafka, Kubernetes)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    className="flex-1 p-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold"
                  >
                    Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillsGained.map(sk => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-[11px] font-bold flex items-center gap-1.5"
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => removeSkill(sk)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Hiring Advantage & Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Placement / Hiring Advantage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Top 10% performers receive direct interview shortlist"
                    value={hiringAdvantage}
                    onChange={(e) => setHiringAdvantage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Cohort Seats</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={maxSeats}
                    onChange={(e) => setMaxSeats(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. 25 Nov 2026"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Access / Student Fee</label>
                  <input
                    type="text"
                    placeholder="e.g. Free University Sponsored"
                    value={stipendOrCost}
                    onChange={(e) => setStipendOrCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description / Curriculum */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Program Curriculum &amp; Overview
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the learning outcomes, weekly sprint plan, and final capstone project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Publishing to University Portals...' : 'Publish Program Across Universities'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
