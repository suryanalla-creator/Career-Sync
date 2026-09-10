import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  Sparkles,
  Award,
  CheckCircle2,
  Bookmark,
  Mail,
  GraduationCap,
  MapPin,
  Check,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Briefcase,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Star
} from 'lucide-react';
import { mockCandidates } from '../../data/mockData';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { DEPARTMENT_OPTIONS } from '../../data/departmentOptions';

const POPULAR_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'PostgreSQL',
  'AWS',
  'Docker',
  'AI / ML',
  'Flutter',
  'Go',
  'FastAPI'
];

export const CandidateSearchView: React.FC = () => {
  const {
    shortlistedCandidates,
    toggleShortlistCandidate,
    triggerConfetti,
    setActiveTab
  } = useApp();

  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [minCgpa, setMinCgpa] = useState<number | 'All'>('All');
  const [graduationYear, setGraduationYear] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [minScore, setMinScore] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'match' | 'skillScore' | 'cgpa' | 'graduationYear'>('match');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Candidate Inspection Modal state
  const [inspectedCandidate, setInspectedCandidate] = useState<Candidate | null>(null);

  // Toggle selected skill tag
  const toggleSkillTag = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedDegree('All');
    setMinCgpa('All');
    setGraduationYear('All');
    setSelectedStatus('All');
    setMinScore(0);
    setVerifiedOnly(false);
    setSelectedSkills([]);
    setSortBy('match');
  };

  // Active filter count
  const activeFilterCount = [
    searchQuery.trim() !== '',
    selectedDept !== 'All',
    selectedDegree !== 'All',
    minCgpa !== 'All',
    graduationYear !== 'All',
    selectedStatus !== 'All',
    minScore > 0,
    verifiedOnly,
    selectedSkills.length > 0
  ].filter(Boolean).length;

  // Debounced database query against backend SQLite database
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      api.students.getCandidates({
        q: searchQuery.trim() || undefined,
        department: selectedDept !== 'All' ? selectedDept : undefined,
        degree: selectedDegree !== 'All' ? selectedDegree : undefined,
        minCgpa: minCgpa !== 'All' ? Number(minCgpa) : undefined,
        graduationYear: graduationYear !== 'All' ? graduationYear : undefined,
        minScore: minScore > 0 ? minScore : undefined,
        isVerified: verifiedOnly ? true : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        sortBy: sortBy === 'match' ? 'match_score' : sortBy === 'skillScore' ? 'skill_score' : sortBy,
        sortOrder
      }).then(res => {
        if (res && res.candidates) {
          setCandidates(res.candidates);
        }
      }).catch(err => {
        console.warn('Backend database search error, using client cache:', err);
      }).finally(() => {
        setIsLoading(false);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedDept,
    selectedDegree,
    minCgpa,
    graduationYear,
    minScore,
    verifiedOnly,
    selectedStatus,
    sortBy,
    sortOrder
  ]);

  // Client-side refining for skill multi-tags & fuzzy search
  const filteredCandidates = candidates.filter((cand) => {
    if (minScore > 0 && cand.skillScore < minScore) return false;
    if (minCgpa !== 'All' && cand.cgpa < Number(minCgpa)) return false;
    if (selectedDept !== 'All' && !cand.department?.toLowerCase().includes(selectedDept.toLowerCase())) return false;
    if (selectedDegree !== 'All' && cand.degree !== selectedDegree) return false;
    if (graduationYear !== 'All' && String(cand.graduationYear) !== graduationYear) return false;
    if (verifiedOnly && !cand.isVerified) return false;
    if (selectedStatus !== 'All' && cand.status !== selectedStatus) return false;

    // Filter by selected skill tags (must match at least one if selected)
    if (selectedSkills.length > 0) {
      const candSkills = (cand.topSkills || []).map(s => s.toLowerCase());
      const hasMatchedSkill = selectedSkills.some(reqSkill =>
        candSkills.some(cs => cs.includes(reqSkill.toLowerCase()))
      );
      if (!hasMatchedSkill) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/^#/, '');
      const matchStudentId = (cand.studentId && cand.studentId.toLowerCase().includes(cleanQ)) || (cand.id && cand.id.toLowerCase().includes(cleanQ));
      const matchSkill = Array.isArray(cand.topSkills) && cand.topSkills.some(s => s.toLowerCase().includes(q));
      const matchName = cand.name.toLowerCase().includes(q);
      const matchCollege = cand.college ? cand.college.toLowerCase().includes(q) : false;
      const matchDept = cand.department ? cand.department.toLowerCase().includes(q) : false;
      if (!matchStudentId && !matchSkill && !matchName && !matchCollege && !matchDept) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1 border border-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI-Matched Candidate Sourcing Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Candidate Search &amp; Direct Talent Sourcing
          </h1>
          <p className="text-xs text-slate-500">
            Search pre-screened students across accredited university cohorts by skills, CGPA, graduation batch, and branch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-100">
            <span className="text-xs font-bold text-purple-700">Shortlisted:</span>
            <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-black rounded-lg">
              {shortlistedCandidates.length}
            </span>
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showAdvancedFilters || activeFilterCount > 0
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-purple-700 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Comprehensive Search & Multi-tier Filter Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Main Search Bar & Quick Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Query Input */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Student ID (#84920...), Name, Skill (React, Python), or College..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Academic Department Selector */}
          <div className="md:col-span-4">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Departments &amp; Branches</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="match">Sort: Highest Match Score</option>
              <option value="skillScore">Sort: Technical Skill Score</option>
              <option value="cgpa">Sort: Academic CGPA</option>
              <option value="graduationYear">Sort: Graduation Year</option>
            </select>
          </div>
        </div>

        {/* Extended Filter Grid (Toggled or Always Viewable) */}
        {(showAdvancedFilters || activeFilterCount > 0) && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* Degree */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Degree Level</label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Degrees</option>
                <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
                <option value="B.Sc / M.Sc">B.Sc / M.Sc</option>
              </select>
            </div>

            {/* Min CGPA */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Minimum CGPA</label>
              <select
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">Any CGPA</option>
                <option value="6.0">6.0+ CGPA</option>
                <option value="7.0">7.0+ CGPA</option>
                <option value="7.5">7.5+ CGPA</option>
                <option value="8.0">8.0+ CGPA (First Class)</option>
                <option value="8.5">8.5+ CGPA (Distinction)</option>
                <option value="9.0">9.0+ CGPA (Top 5%)</option>
              </select>
            </div>

            {/* Graduation Batch */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Graduation Batch</label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Batches</option>
                <option value="2026">Class of 2026</option>
                <option value="2027">Class of 2027</option>
                <option value="2025">Class of 2025</option>
                <option value="2024">Class of 2024</option>
              </select>
            </div>

            {/* Minimum Skill Assessment Score */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Skill Assessment Score</label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value={0}>Any Score</option>
                <option value={70}>70%+ Assessment</option>
                <option value={80}>80%+ Proficient</option>
                <option value={85}>85%+ Advanced</option>
                <option value={90}>90%+ (Tier-1 Elite)</option>
              </select>
            </div>

            {/* Placement Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Hiring Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available for Hire</option>
                <option value="In Interview">In Interview Pipeline</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Offered">Offered</option>
                <option value="Placed">Placed</option>
              </select>
            </div>

            {/* Verified Skills Toggle */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Only
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Popular Skill Tags Filter Chips */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Filter by Target Technologies &amp; Skill Competencies:
            </span>
            {selectedSkills.length > 0 && (
              <button
                onClick={() => setSelectedSkills([])}
                className="text-[10px] font-bold text-purple-600 hover:text-purple-800"
              >
                Clear Skills ({selectedSkills.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkillTag(skill)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {skill}
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Bar & Active Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">
              {isLoading ? 'Querying database...' : `Found ${filteredCandidates.length} candidate profiles`}
            </span>

            {/* Active filter tags */}
            {selectedDept !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-bold text-[10px] border border-purple-100">
                Dept: {selectedDept.split('(')[0].trim()}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDept('All')} />
              </span>
            )}
            {minCgpa !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold text-[10px] border border-blue-100">
                CGPA ≥ {minCgpa}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMinCgpa('All')} />
              </span>
            )}
            {graduationYear !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px] border border-emerald-100">
                Batch: {graduationYear}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setGraduationYear('All')} />
              </span>
            )}
            {minScore > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-bold text-[10px] border border-amber-100">
                Score ≥ {minScore}%
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMinScore(0)} />
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px] border border-emerald-100">
                Verified Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => setVerifiedOnly(false)} />
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No candidates match your database filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting the minimum CGPA, resetting skill tags, or searching across all departments.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((cand) => {
            const isShortlisted = Array.isArray(shortlistedCandidates) && (shortlistedCandidates as string[]).includes(cand.id);
            const studentIdDisplay = cand.studentId || (cand.id ? `#84920${String(cand.id).replace(/\D/g, '').padStart(5, '0')}` : '#8492019482');

            return (
              <div
                key={cand.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img src={cand.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="text-sm font-bold text-slate-900">
                            {cand.name}
                          </h3>
                          {cand.isVerified && (
                            <span title="Verified Skills">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded mb-1">
                          ID: {studentIdDisplay}
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-tight line-clamp-1">{cand.degree} • {cand.department}</p>
                        <p className="text-[11px] text-slate-400">{cand.college} (CGPA: <strong className="text-slate-700">{cand.cgpa}</strong> • Batch {cand.graduationYear})</p>
                      </div>
                    </div>
                  </div>

                  {/* Match score bar */}
                  <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      {cand.matchScore || cand.skillScore}% Skill Match
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      Score: {cand.skillScore}%
                    </span>
                  </div>

                  {/* Top Skills */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Top Skills &amp; Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.topSkills && cand.topSkills.length > 0 ? (
                        cand.topSkills.map((sk, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">General Engineering &amp; Problem Solving</span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                    <p><strong>Internship:</strong> {cand.internshipExperience || 'Academic Capstone & Lab Projects'}</p>
                    <p><strong>Certifications:</strong> {cand.certificationsCount || 1} Verified</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
                  <button
                    onClick={() => setInspectedCandidate(cand)}
                    className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Inspect Profile
                  </button>

                  <button
                    onClick={() => toggleShortlistCandidate(cand.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      isShortlisted
                        ? 'bg-purple-600 text-white'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isShortlisted ? <Check className="w-3.5 h-3.5" /> : null}
                    {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                  </button>

                  <button
                    onClick={() => {
                      alert(`Interview invitation dispatched to ${cand.name} (Student ID: ${studentIdDisplay}).`);
                      triggerConfetti();
                    }}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
                  >
                    Invite
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CANDIDATE PROFILE INSPECTION MODAL */}
      {inspectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-4">
                <img
                  src={inspectedCandidate.avatar}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{inspectedCandidate.name}</h2>
                    {inspectedCandidate.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Student
                      </span>
                    )}
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded my-1">
                    Student ID: {inspectedCandidate.studentId || `#84920${String(inspectedCandidate.id).replace(/\D/g, '').padStart(5, '0')}`}
                  </div>
                  <p className="text-slate-600 font-medium">
                    {inspectedCandidate.degree} in {inspectedCandidate.department}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {inspectedCandidate.college} • Batch of {inspectedCandidate.graduationYear}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectedCandidate(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic & Assessment Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic CGPA</span>
                <span className="text-lg font-black text-slate-900">{inspectedCandidate.cgpa} / 10.0</span>
              </div>
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 text-center">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Skill Assessment</span>
                <span className="text-lg font-black text-purple-900">{inspectedCandidate.skillScore}%</span>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Role Match</span>
                <span className="text-lg font-black text-emerald-900">{inspectedCandidate.matchScore || inspectedCandidate.skillScore}%</span>
              </div>
            </div>

            {/* Verified Skills Breakdown */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                Verified Technical Skills &amp; Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {(inspectedCandidate.topSkills || []).map((sk, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-50 text-purple-800 rounded-xl font-bold text-xs border border-purple-100"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Internship Experience */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Practical Experience &amp; Internships
              </h3>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800 text-xs">{inspectedCandidate.internshipExperience || 'Academic Capstone & Lab Projects'}</p>
                <p className="text-slate-500 text-[11px]">
                  Demonstrated hands-on execution in software development lifecycle, unit testing, and agile team sprints.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => toggleShortlistCandidate(inspectedCandidate.id)}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  Array.isArray(shortlistedCandidates) && (shortlistedCandidates as string[]).includes(inspectedCandidate.id)
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {Array.isArray(shortlistedCandidates) && (shortlistedCandidates as string[]).includes(inspectedCandidate.id)
                  ? 'Shortlisted'
                  : 'Add to Shortlist'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    alert(`Opening direct recruiter communication channel with ${inspectedCandidate.name}.`);
                    setInspectedCandidate(null);
                  }}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Direct Message
                </button>

                <button
                  onClick={() => {
                    alert(`Formal Interview Invitation scheduled for ${inspectedCandidate.name}. Candidate will receive email and dashboard alerts.`);
                    triggerConfetti();
                    setInspectedCandidate(null);
                  }}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-900/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
