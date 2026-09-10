import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Award,
  Clock,
  Star,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  ExternalLink,
  Filter,
  Check,
  Zap,
  BadgeCheck,
  FileText,
  AlertCircle,
  X,
  Layers,
  GraduationCap,
  Briefcase,
  Target,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CertificationItem, LearningProgram } from '../../types';
import { api } from '../../services/api';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';
import {
  BTECH_BRANCHES,
  checkLearningProgramRoleAndBranchMatch,
  ProgramRoleBranchMatchDetails
} from '../../utils/opportunityRoleBranchMatcher';

export interface OnlineCoursesViewProps {
  initialSubBlock?: 'all' | 'courses' | 'certifications' | 'enrolled';
}

export const OnlineCoursesView: React.FC<OnlineCoursesViewProps> = ({ initialSubBlock = 'all' }) => {
  const {
    learningPrograms,
    enrollInProgram,
    triggerConfetti,
    studentProfile,
    selectedCareerRoleId,
    setSelectedCareerRoleId,
    activeCareerRole,
    gapSkills
  } = useApp();

  // Sub-block switcher state: courses vs certifications
  const [activeSubBlock, setActiveSubBlock] = useState<'all' | 'courses' | 'certifications' | 'enrolled'>(initialSubBlock);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Studied B-Tech Branch state (defaults to student profile department, e.g. "Computer Science & Engineering")
  const studentBranch = studentProfile?.department || 'Computer Science & Engineering';
  const [selectedBranch, setSelectedBranch] = useState<string>(studentBranch);

  // Recommendation filter mode: 'recommended' (role & branch) | 'gaps' (gap bridging) | 'all'
  const [recommendationMode, setRecommendationMode] = useState<'recommended' | 'gaps' | 'all'>('recommended');

  // Certifications state
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [verifyInputId, setVerifyInputId] = useState('');
  const [viewProofCert, setViewProofCert] = useState<CertificationItem | null>(null);
  const [selectedProgramDetails, setSelectedProgramDetails] = useState<LearningProgram | null>(null);

  useEffect(() => {
    if (initialSubBlock) {
      setActiveSubBlock(initialSubBlock);
    }
  }, [initialSubBlock]);

  useEffect(() => {
    api.certifications.getAll().then(dbCerts => {
      setCerts(dbCerts || []);
    }).catch(err => console.warn('Could not load certs:', err));
  }, []);

  const handleVerify = async (certId: string) => {
    setCerts(prev =>
      prev.map(c => (c.id === certId ? { ...c, verificationStatus: 'Verified' } : c))
    );
    setIsVerifyModalOpen(false);
    setSelectedCert(null);
    triggerConfetti();

    try {
      await api.certifications.verify(certId);
    } catch (err) {
      console.error('Failed to update certification in database:', err);
    }
  };

  const handleAddNewCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInputId.trim()) return;

    const newCertItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: selectedCert ? selectedCert.name : 'Industry Verified Specialization',
      provider: selectedCert ? selectedCert.provider : 'Accredited Course Partner',
      logo: selectedCert ? selectedCert.logo : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      issueDate: 'Sep 2026',
      credentialId: verifyInputId.trim(),
      verificationStatus: 'Verified',
      skills: selectedCert ? selectedCert.skills : ['Advanced Engineering', 'Verified Competency']
    };

    setCerts(prev => [newCertItem, ...prev]);
    setIsVerifyModalOpen(false);
    setVerifyInputId('');
    setSelectedCert(null);
    triggerConfetti();
  };

  const courseCategories = [
    'All',
    'Course',
    'Certification Track',
    'Bootcamp',
    'Workshop',
    'Industry Training'
  ];

  // Enrich every course with match details based on active Career Role, B-Tech Branch, and Gap Skills
  const programsWithMatch = useMemo(() => {
    return learningPrograms.map(prog => {
      const match: ProgramRoleBranchMatchDetails = checkLearningProgramRoleAndBranchMatch(
        prog,
        selectedCareerRoleId,
        selectedBranch,
        gapSkills
      );
      return {
        ...prog,
        match
      };
    });
  }, [learningPrograms, selectedCareerRoleId, selectedBranch, gapSkills]);

  // Filtered & ranked programs
  const filteredPrograms = useMemo(() => {
    return programsWithMatch
      .filter((prog) => {
        // Category filter
        if (selectedCategory !== 'All') {
          if (selectedCategory === 'Certification Track' && prog.category !== 'Certification') return false;
          if (selectedCategory !== 'Certification Track' && prog.category !== selectedCategory) return false;
        }

        // Search query filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = prog.title.toLowerCase().includes(q);
          const matchProvider = prog.provider.toLowerCase().includes(q);
          const matchSkills = prog.skillsGained.some(s => s.toLowerCase().includes(q));
          if (!matchTitle && !matchProvider && !matchSkills) return false;
        }

        // Recommendation mode filter
        if (recommendationMode === 'recommended') {
          return prog.match.isCareerRoleMatch || prog.match.isBranchEligible;
        }
        if (recommendationMode === 'gaps') {
          return prog.match.bridgesSkillGap;
        }

        return true;
      })
      .sort((a, b) => b.match.matchScore - a.match.matchScore);
  }, [programsWithMatch, selectedCategory, searchQuery, recommendationMode]);

  const recommendedCount = useMemo(() => {
    return programsWithMatch.filter(p => p.match.isCareerRoleMatch || p.match.isBranchEligible).length;
  }, [programsWithMatch]);

  const gapBridgingCount = useMemo(() => {
    return programsWithMatch.filter(p => p.match.bridgesSkillGap).length;
  }, [programsWithMatch]);

  const filteredCerts = certs.filter((cert) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = cert.name.toLowerCase().includes(q);
      const matchProvider = cert.provider.toLowerCase().includes(q);
      const matchSkills = cert.skills.some(s => s.toLowerCase().includes(q));
      const matchId = cert.credentialId.toLowerCase().includes(q);
      if (!matchName && !matchProvider && !matchSkills && !matchId) return false;
    }
    return true;
  });

  const enrolledPrograms = useMemo(() => {
    return programsWithMatch.filter(p => p.isEnrolled);
  }, [programsWithMatch]);
  const verifiedCertsCount = certs.filter(c => c.verificationStatus === 'Verified').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN HEADER BLOCK: ONLINE COURSES & CERTIFICATIONS
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Online Courses Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Accredited Course Certifications
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Online Courses &amp; Certifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Explore interactive curricula, industry bootcamps, and verified certificates designed to bridge skill gaps and boost your campus placement profile.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => {
                setSelectedCert(null);
                setVerifyInputId('');
                setIsVerifyModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Verify Certificate
            </button>
          </div>
        </div>

        {/* Sub-Blocks Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div
            onClick={() => setActiveSubBlock('courses')}
            className="p-3.5 bg-blue-50/60 hover:bg-blue-50 rounded-2xl border border-blue-200/80 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">Courses</span>
              <span className="text-sm font-black text-slate-900">{learningPrograms.length} Online Courses</span>
            </div>
          </div>

          <div
            onClick={() => setActiveSubBlock('certifications')}
            className="p-3.5 bg-emerald-50/60 hover:bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Certifications</span>
              <span className="text-sm font-black text-slate-900">{certs.length} Certifications</span>
            </div>
          </div>

          <div
            onClick={() => setActiveSubBlock('enrolled')}
            className="p-3.5 bg-purple-50/60 hover:bg-purple-50 rounded-2xl border border-purple-200/80 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">Active Enrollments</span>
              <span className="text-sm font-black text-slate-900">{enrolledPrograms.length} In Progress</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Certifications</span>
              <span className="text-sm font-black text-emerald-700">{filteredCerts.length} Completed</span>
            </div>
          </div>
        </div>

        {/* Branch & Career Role Alignment Ribbon */}
        <div className="p-4 bg-linear-to-r from-blue-50/80 via-indigo-50/50 to-amber-50/70 rounded-2xl border border-blue-200/80 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-2xs">
                  <Compass className="w-3.5 h-3.5" />
                  Branch &amp; Career Role Alignment
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  B.Tech {selectedBranch}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  {activeCareerRole.title}
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Courses and curricula are tailored on the basis of your <strong>{selectedBranch}</strong> B.Tech branch and <strong>{activeCareerRole.title}</strong> career roadmap, prioritizing programs that bridge your active skill gaps.
              </p>
            </div>

            {/* Quick Interactive Selectors */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
              {/* Target Career Role Selector */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <label htmlFor="course-role-select" className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                  Role:
                </label>
                <select
                  id="course-role-select"
                  value={selectedCareerRoleId}
                  onChange={(e) => setSelectedCareerRoleId(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer max-w-[150px] truncate"
                >
                  {CAREER_ROLE_OPTIONS.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* B-Tech Branch Selector */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <label htmlFor="course-branch-select" className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                  Branch:
                </label>
                <select
                  id="course-branch-select"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer max-w-[170px] truncate"
                >
                  <option value="All">All B.Tech Branches</option>
                  {BTECH_BRANCHES.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.shortCode} - {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Filter Tabs for Role & Branch */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-200/50">
            <button
              onClick={() => setRecommendationMode('recommended')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendationMode === 'recommended'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended for My Role &amp; Branch ({recommendedCount})</span>
            </button>

            <button
              onClick={() => setRecommendationMode('gaps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendationMode === 'gaps'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Bridges My Identified Skill Gaps ({gapBridgingCount})</span>
            </button>

            <button
              onClick={() => setRecommendationMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendationMode === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Courses ({programsWithMatch.length})</span>
            </button>
          </div>
        </div>

        {/* Sub-Blocks Segment Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveSubBlock('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            All Courses &amp; Certifications
          </button>

          <button
            onClick={() => setActiveSubBlock('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'courses'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Courses ({learningPrograms.length})
          </button>

          <button
            onClick={() => setActiveSubBlock('certifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'certifications'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Certifications ({certs.length})
          </button>

          <button
            onClick={() => setActiveSubBlock('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'enrolled'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            My Active Enrollments ({enrolledPrograms.length})
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          SEARCH & CATEGORY FILTER BAR
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {courseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search courses, certs, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          ONLINE COURSES & CURRICULA
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'courses' || activeSubBlock === 'enrolled') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Online Courses &amp; Bootcamps
                </h2>
                <p className="text-xs text-slate-500">
                  Tailored to B.Tech {selectedBranch} &amp; {activeCareerRole.title} with lab projects and industry mentors.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs self-start sm:self-auto">
              {activeSubBlock === 'enrolled' ? enrolledPrograms.length : filteredPrograms.length} Courses Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeSubBlock === 'enrolled' ? enrolledPrograms : filteredPrograms).map((prog) => {
              const match = prog.match;
              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Category & Ratings & Match Score */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                        {prog.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {prog.rating}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900 text-white shadow-2xs">
                          {match.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Badges for Skill Gap / Role / Branch */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {match.bridgesSkillGap && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600" />
                          Bridges Gap: {match.bridgedSkillName}
                        </span>
                      )}
                      {match.roleMatchBadgeText && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-blue-600" />
                          {match.roleMatchBadgeText}
                        </span>
                      )}
                      {match.branchEligibilityBadgeText && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-indigo-600" />
                          {match.branchEligibilityBadgeText}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">{prog.provider}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 my-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {prog.duration}
                      </span>
                      <span>•</span>
                      <span>{prog.level}</span>
                      <span>•</span>
                      <span>{prog.mode}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Skills Gained */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prog.skillsGained.map((sk, i) => {
                        const isGap = gapSkills.some(g => g.toLowerCase() === sk.toLowerCase());
                        return (
                          <span
                            key={i}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                              isGap
                                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isGap ? `⚡ ${sk}` : sk}
                          </span>
                        );
                      })}
                    </div>

                    {/* Associated Certification Badge */}
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] flex items-center gap-2 mb-4">
                      <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-emerald-900 font-semibold truncate">
                        Earns: Verified Certificate &amp; Skill Badge
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {prog.enrolledCount.toLocaleString()} enrolled
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProgramDetails(prog)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Requirements
                      </button>
                      {prog.isEnrolled ? (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                        </span>
                      ) : (prog.isClosed || prog.status === 'Closed' || prog.status === 'Archived') ? (
                        <span className="px-3.5 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold border border-slate-200 cursor-not-allowed">
                          Bookings Closed
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            enrollInProgram(prog.id);
                            triggerConfetti();
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          {match.bridgesSkillGap ? 'Bridge & Enroll' : 'Enroll Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION: COURSE CERTIFICATIONS
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'certifications' || activeSubBlock === 'enrolled') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Course Certifications &amp; Completed Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Track and showcase your completed online course certificates and skill specializations.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs">
              {filteredCerts.length} Certifications Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCerts.map((cert) => {
              const isVerified = cert.verificationStatus === 'Verified' || cert.verificationStatus === 'Completed';

              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <img src={cert.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 bg-emerald-50 text-emerald-800 border-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{cert.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{cert.provider}</p>

                    <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Certificate ID:</span>
                        <span className="font-mono text-slate-700 font-bold">{cert.credentialId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Issued:</span>
                        <span className="text-slate-700 font-semibold">{cert.issueDate}</span>
                      </div>
                      {cert.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Valid Until:</span>
                          <span className="text-slate-700 font-semibold">{cert.expiryDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills Attached */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {cert.skills.map((s, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      ✓ Certificate Added
                    </span>

                    <button
                      onClick={() => setViewProofCert(cert)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT CERTIFICATE
          ────────────────────────────────────────────────────────────────────────── */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Certificate Details</h3>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewCert} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-blue-900">
                <p className="font-semibold">
                  {selectedCert
                    ? `Adding details for: ${selectedCert.name}`
                    : 'Enter your Certificate ID or completion link from your course provider.'}
                </p>
                <p className="text-[11px] text-blue-700 mt-1">
                  Supports Coursera, AWS, Google Cloud, Meta, edX, and university course certifications.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificate ID / Serial Number
                </label>
                <input
                  type="text"
                  required
                  value={verifyInputId}
                  onChange={(e) => setVerifyInputId(e.target.value)}
                  placeholder="e.g. AWS-CCP-98421094 or COURSERA-782194"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: VIEW CERTIFICATE PROOF
          ────────────────────────────────────────────────────────────────────────── */}
      {viewProofCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Course Certificate Details</h3>
              </div>
              <button
                onClick={() => setViewProofCert(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <img src={viewProofCert.logo} alt="" className="w-16 h-16 rounded-2xl mx-auto object-cover border" />
                <h4 className="text-sm font-black text-slate-900">{viewProofCert.name}</h4>
                <p className="text-xs font-semibold text-slate-500">{viewProofCert.provider}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  ✓ Completed Certificate
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Credential ID:</span>
                  <span className="text-slate-900 font-bold">{viewProofCert.credentialId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Issued Date:</span>
                  <span className="text-slate-700">{viewProofCert.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewProofCert(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Details & Requirements Modal */}
      {selectedProgramDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProgramDetails.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {selectedProgramDetails.category}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                      {selectedProgramDetails.mode}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-1">{selectedProgramDetails.title}</h3>
                  <p className="text-xs font-semibold text-slate-500">By {selectedProgramDetails.provider}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProgramDetails(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs mb-1">About the Program</h4>
                <p className="text-slate-600 leading-relaxed">{selectedProgramDetails.description}</p>
              </div>

              {/* Requirements & Criteria */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h4>Admission Requirements &amp; Eligibility Criteria</h4>
                </div>
                {selectedProgramDetails.requirements && selectedProgramDetails.requirements.length > 0 ? (
                  <ul className="space-y-1.5 pl-1">
                    {selectedProgramDetails.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">Open to all enrolled engineering and technology students with basic programming interest.</p>
                )}
              </div>

              {/* Prerequisites */}
              {selectedProgramDetails.prerequisites && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <h4>Prerequisites &amp; Prior Knowledge</h4>
                  </div>
                  <p className="text-slate-700">{selectedProgramDetails.prerequisites}</p>
                </div>
              )}

              {/* Eligible Branches */}
              {selectedProgramDetails.eligibleBranches && selectedProgramDetails.eligibleBranches.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <h4>Eligible Academic Departments</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgramDetails.eligibleBranches.map((br, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium">
                        {br}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiring Advantage */}
              {selectedProgramDetails.hiringAdvantage && (
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h4>Hiring &amp; Placement Advantage</h4>
                  </div>
                  <p className="text-purple-800 font-medium">{selectedProgramDetails.hiringAdvantage}</p>
                </div>
              )}

              {/* Skills Gained */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Skills You Will Master</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProgramDetails.skillsGained.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Duration: <strong className="text-slate-800">{selectedProgramDetails.duration}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProgramDetails(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
                {selectedProgramDetails.isEnrolled ? (
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Enrolled
                  </span>
                ) : (selectedProgramDetails.isClosed || selectedProgramDetails.status === 'Closed' || selectedProgramDetails.status === 'Archived') ? (
                  <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold border border-slate-200">
                    Bookings Closed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      enrollInProgram(selectedProgramDetails.id);
                      setSelectedProgramDetails(null);
                      triggerConfetti();
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    Confirm &amp; Enroll
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
