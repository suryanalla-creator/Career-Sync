import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  GitFork,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  FolderGit2,
  Briefcase,
  ChevronRight,
  Search,
  Check,
  RotateCcw,
  Target,
  Compass,
  Building2,
  TrendingUp,
  Layers,
  ArrowLeft,
  Flame,
  Zap,
  Code2,
  Terminal,
  Cpu,
  Shield,
  Palette,
  AlertCircle,
  CheckSquare,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CAREER_ROLE_OPTIONS,
  CAREER_ROLE_DOMAINS,
  CareerRoleOption,
  CareerRoleMilestone
} from '../../data/careerRolesData';

export const CareerPathView: React.FC = () => {
  const {
    setActiveTab,
    triggerConfetti,
    studentProfile,
    certificates,
    verifiedSkills,
    selectedCareerRoleId,
    setSelectedCareerRoleId
  } = useApp();

  // Selected Career Role ID
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(() => {
    return selectedCareerRoleId || 'fullstack-engineer';
  });

  // First ask the student to choose their career role!
  // Defaults to TRUE on entry so the user is first prompted to select a role.
  const [isSelectingRole, setIsSelectingRole] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const confirmed = sessionStorage.getItem('careersync_role_active');
      return !confirmed;
    }
    return true;
  });

  // Search and Domain filter for the 20+ options
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  // Currently focused milestone step within the active roadmap
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(1);

  // Completed checkpoints state persisted in localStorage
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careersync_milestone_checkpoints');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {};
  });

  // Keep in sync with AppContext selectedCareerRoleId if changed elsewhere
  useEffect(() => {
    if (selectedCareerRoleId && selectedCareerRoleId !== selectedRoleId) {
      setSelectedRoleId(selectedCareerRoleId);
    }
  }, [selectedCareerRoleId, selectedRoleId]);

  // Active role object
  const activeRole: CareerRoleOption = useMemo(() => {
    return CAREER_ROLE_OPTIONS.find(r => r.id === selectedRoleId) || CAREER_ROLE_OPTIONS[0];
  }, [selectedRoleId]);

  // Active milestone object
  const activeMilestone: CareerRoleMilestone = useMemo(() => {
    return (
      activeRole.milestones.find(m => m.stepNumber === selectedStepNumber) ||
      activeRole.milestones[0]
    );
  }, [activeRole, selectedStepNumber]);

  // Filtered list of 20+ career roles based on search and category
  const filteredRoles = useMemo(() => {
    return CAREER_ROLE_OPTIONS.filter(role => {
      const matchesDomain = selectedDomain === 'All' || role.domain === selectedDomain;
      const matchesSearch =
        searchQuery === '' ||
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.keySkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [searchQuery, selectedDomain]);

  // ──────────────────────────────────────────────────────────────────────────
  // STUDENT SKILLS VS ROLE SKILLS COMPARISON ENGINE
  // ──────────────────────────────────────────────────────────────────────────
  // Aggregated skills the student genuinely possesses from verified certs & verified skills
  const studentPossessedSkills = useMemo(() => {
    const fromCerts = (certificates || []).map(c => c.skillName);
    const fromVerified = (verifiedSkills || []).map(s => s.name);
    return Array.from(new Set([...fromVerified, ...fromCerts]));
  }, [certificates, verifiedSkills]);

  // Match check helper
  const checkSkillPossessed = useCallback((requiredSkill: string): boolean => {
    const reqLower = requiredSkill.toLowerCase().trim();
    return studentPossessedSkills.some(studentSkill => {
      const studLower = studentSkill.toLowerCase().trim();
      return (
        studLower === reqLower ||
        reqLower.includes(studLower) ||
        studLower.includes(reqLower)
      );
    });
  }, [studentPossessedSkills]);

  // Compare skills for the active role:
  // 1. All unique required skills for this role
  const allRoleRequiredSkills = useMemo(() => {
    const combined = [
      ...activeRole.keySkills,
      ...activeRole.milestones.flatMap(m => m.requiredSkills)
    ];
    return Array.from(new Set(combined));
  }, [activeRole]);

  // 2. Skills we have for this role
  const skillsWeHave = useMemo(() => {
    return allRoleRequiredSkills.filter(s => checkSkillPossessed(s));
  }, [allRoleRequiredSkills, checkSkillPossessed]);

  // 3. Skills we still need to acquire (Skill Gaps)
  const skillsWeNeed = useMemo(() => {
    return allRoleRequiredSkills.filter(s => !checkSkillPossessed(s));
  }, [allRoleRequiredSkills, checkSkillPossessed]);

  // Skill Match Percentage
  const skillMatchPercentage = useMemo(() => {
    if (allRoleRequiredSkills.length === 0) return 0;
    return Math.round((skillsWeHave.length / allRoleRequiredSkills.length) * 100);
  }, [skillsWeHave, allRoleRequiredSkills]);

  // Handle selecting a new role
  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setSelectedCareerRoleId(roleId);
    setSelectedStepNumber(1);
    setIsSelectingRole(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('careersync_selected_career_role', roleId);
      sessionStorage.setItem('careersync_role_active', 'true');
    }
    triggerConfetti();
  };

  // Toggle individual checklist item
  const handleToggleCheckpoint = (checkpointKey: string) => {
    setCompletedCheckpoints(prev => {
      const updated = { ...prev, [checkpointKey]: !prev[checkpointKey] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('careersync_milestone_checkpoints', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Calculate overall readiness progress for the chosen role
  const roleProgress = useMemo(() => {
    let totalItems = 0;
    let completedCount = 0;

    activeRole.milestones.forEach(m => {
      m.checkpoints.forEach((_, idx) => {
        totalItems++;
        const key = `${m.id}-${idx}`;
        if (completedCheckpoints[key]) completedCount++;
      });
    });

    if (totalItems === 0) return 0;
    return Math.round((completedCount / totalItems) * 100);
  }, [activeRole, completedCheckpoints]);

  // Helper to pick icons per domain
  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'Software & Web Engineering':
        return <Code2 className="w-4 h-4 text-blue-600" />;
      case 'AI & Data Science':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'Cloud & DevOps':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'Hardware & Systems':
        return <Cpu className="w-4 h-4 text-amber-600" />;
      case 'Product & Design':
        return <Palette className="w-4 h-4 text-rose-600" />;
      case 'Emerging & Specialized Tech':
      default:
        return <Terminal className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. FIRST ASK THE CAREER ROLE (ROLE SELECTION SCREEN)
          ────────────────────────────────────────────────────────────────────────── */}
      {isSelectingRole ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner for Role Selection */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/20">
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                  First Step: Choose Your Target Career Role
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  What Career Role Do You Want to Pursue?
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Select your target job destination from <strong>20+ specialized industry roles</strong>. Career Sync will analyze the <strong>skills required for that role</strong>, compare them against the <strong>skills you already possess</strong>, and generate your customized milestone roadmap.
                </p>
              </div>

              {selectedRoleId && (
                <button
                  onClick={() => setIsSelectingRole(false)}
                  className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  View Current Roadmap
                </button>
              )}
            </div>
          </div>

          {/* Search & Domain Filter Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search Input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 20+ roles by title, technology, or keywords..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <span className="text-xs font-bold text-slate-500 self-end sm:self-center">
                Showing {filteredRoles.length} of {CAREER_ROLE_OPTIONS.length} Career Tracks
              </span>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              {CAREER_ROLE_DOMAINS.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDomain === domain
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of 20+ Career Role Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoles.map((role) => {
              const isSelected = selectedRoleId === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group relative shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Domain & Demand Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        {getDomainIcon(role.domain)}
                        <span className="truncate max-w-[140px]">{role.domain}</span>
                      </span>

                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        role.demand === 'Very High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : role.demand === 'Rapid Growth'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        🔥 {role.demand} Demand
                      </span>
                    </div>

                    {/* Role Title */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    {/* Salary Package & Experience */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg. Package</span>
                        <span className="font-extrabold text-slate-900 text-xs">{role.averageSalary}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Exp.</span>
                        <span className="font-semibold text-slate-700 text-[11px]">{role.experienceLevel}</span>
                      </div>
                    </div>

                    {/* Key Required Skills */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {role.keySkills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {role.keySkills.length > 4 && (
                          <span className="text-[10px] font-bold text-blue-600 self-center">
                            +{role.keySkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {role.milestones.length} Roadmap Phases
                    </span>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 group-hover:bg-blue-600 text-white shadow-xs'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Selected Role
                        </>
                      ) : (
                        <>
                          Select Role &amp; View Skills <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────────────────────
            2. ROADMAP VIEW FOR SELECTED ROLE
            Includes:
            - Hero Banner with Role Switcher
            - Skills Required vs. Skills We Have Comparison Block
            - Dynamic Milestone Progression Stepper
            - Milestone Deep Dive & Interactive Checklist
            ────────────────────────────────────────────────────────────────────────── */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active Role Hero Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/20">
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    Target Career Destination
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
                    🔥 {activeRole.demand} Demand
                  </span>
                  <span className="text-xs text-blue-200 font-semibold">
                    Avg: {activeRole.averageSalary}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {activeRole.title}
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  {activeRole.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-blue-200">
                  <span className="font-bold text-white">Top Employers:</span>
                  {activeRole.topEmployers.map((emp, eIdx) => (
                    <span key={eIdx} className="bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                      {emp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Overall Progress Card */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
                <button
                  onClick={() => setIsSelectingRole(true)}
                  className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                  Change Career Role ({CAREER_ROLE_OPTIONS.length} Options)
                </button>

                <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-200">Roadmap Completion</span>
                    <span className="font-black text-white">{roleProgress}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${roleProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-blue-200">
                    Check off milestones below to increase your recruiter match rate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              SKILLS COMPARISON MATRIX: SKILLS REQUIRED VS. SKILLS WE HAVE
              ────────────────────────────────────────────────────────────────────────── */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-blue-200/80 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-extrabold border border-blue-200 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  Role Skill Analysis &amp; Compatibility
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Skills Required for This Role vs. Skills You Possess
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time analysis comparing the technical competencies demanded by <strong>{activeRole.title}</strong> against your verified student credentials.
                </p>
              </div>

              {/* Skill Match Score Badge */}
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex items-center gap-3 self-start sm:self-auto">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {skillMatchPercentage}%
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Role Match Rate</span>
                  <span className="text-xs font-black text-slate-900">
                    {skillsWeHave.length} of {allRoleRequiredSkills.length} Skills Acquired
                  </span>
                </div>
              </div>
            </div>

            {/* Side-by-Side Skills Comparison: Skills We Have vs. Skills Required */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Skills We Have (Acquired) */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                        Skills You Already Have ({skillsWeHave.length})
                      </h3>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Verified via Profile, Certs &amp; Projects
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                </div>

                {skillsWeHave.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No matching skills detected in your profile yet. Follow the roadmap milestones below to start acquiring them!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {skillsWeHave.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-900 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Skills Required (Still Needed to Acquire) */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                        Skills Required to Learn ({skillsWeNeed.length})
                      </h3>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        Bridged step-by-step in the roadmap below
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    ⚠️ Skill Gaps
                  </span>
                </div>

                {skillsWeNeed.length === 0 ? (
                  <div className="p-3 bg-emerald-100/70 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Congratulations! You have verified all skills required for this career role!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {skillsWeNeed.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Footer to Bridge Gaps */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-slate-700">
                  Acquiring these <strong>{skillsWeNeed.length} missing competencies</strong> will boost your ATS resume match rate to <strong>98%+</strong> for {activeRole.title} drives.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('skill-profile')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                Upload Skill Proof / Certificates →
              </button>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              DYNAMIC MILESTONE PROGRESSION STEPPER (CUSTOMIZED FOR THE CHOSEN ROLE)
              ────────────────────────────────────────────────────────────────────────── */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-blue-600" />
                  {activeRole.title} — Step-by-Step Learning Roadmap
                </h2>
                <p className="text-xs text-slate-500">
                  Follow these {activeRole.milestones.length} progression phases to acquire the required skills and build employer-ready projects.
                </p>
              </div>

              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl self-start sm:self-auto border border-blue-100">
                Phase {activeMilestone.stepNumber} of {activeRole.milestones.length} Selected
              </span>
            </div>

            {/* Stepper Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(activeRole.milestones.length, 5)} gap-3.5 pt-2`}>
              {activeRole.milestones.map((milestone) => {
                const isSelected = milestone.stepNumber === activeMilestone.stepNumber;
                
                // Calculate milestone progress
                let totalC = milestone.checkpoints.length;
                let doneC = 0;
                milestone.checkpoints.forEach((_, idx) => {
                  if (completedCheckpoints[`${milestone.id}-${idx}`]) doneC++;
                });
                const percent = totalC > 0 ? Math.round((doneC / totalC) * 100) : 0;
                const isDone = percent === 100;

                return (
                  <div
                    key={milestone.id}
                    onClick={() => setSelectedStepNumber(milestone.stepNumber)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.01]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {milestone.stepNumber}
                        </span>

                        {isDone ? (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : percent > 0 ? (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> {percent}%
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {milestone.duration}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {milestone.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {milestone.roleLevel}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
                        <span>Milestone Tasks</span>
                        <span>{doneC}/{totalC} Checked</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone ? 'bg-emerald-500' : percent > 0 ? 'bg-blue-600' : 'bg-slate-200'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              SELECTED MILESTONE DEEP DIVE (THE 4 PILLARS & INTERACTIVE CHECKLIST)
              ────────────────────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Milestone Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Phase {activeMilestone.stepNumber} Details • {activeMilestone.duration}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  {activeMilestone.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  {activeMilestone.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('learning')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Start Recommended Course
                </button>
              </div>
            </div>

            {/* Interactive Milestone Checkpoints / Action Items */}
            <div className="p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 rounded-2xl border border-blue-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Milestone Completion Checklist (Click to complete)
                </h3>
                <span className="text-[11px] text-blue-700 font-bold">
                  Track Your Mastery
                </span>
              </div>

              <div className="space-y-2">
                {activeMilestone.checkpoints.map((checkpoint, cIdx) => {
                  const key = `${activeMilestone.id}-${cIdx}`;
                  const isChecked = !!completedCheckpoints[key];

                  return (
                    <div
                      key={cIdx}
                      onClick={() => handleToggleCheckpoint(key)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 line-through opacity-85'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 shadow-2xs'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="flex-1">{checkpoint}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Pillars of the Milestone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar 1: Required Skills for this Phase */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Phase Required Competencies &amp; Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeMilestone.requiredSkills.map((skill, i) => {
                    const haveIt = checkSkillPossessed(skill);
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs ${
                          haveIt
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        {haveIt ? (
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        )}
                        {skill}
                        {haveIt && (
                          <span className="text-[10px] text-emerald-700 font-bold ml-0.5">✓</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Pillar 2: Recommended Courses */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Recommended Learning Modules
                </h3>
                <ul className="space-y-2">
                  {activeMilestone.recommendedCourses.map((course, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-800 flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <span className="font-semibold">{course}</span>
                      <button
                        onClick={() => setActiveTab('learning')}
                        className="text-blue-600 font-bold hover:underline cursor-pointer text-xs"
                      >
                        Enroll →
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pillar 3: Professional Certifications */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Accredited Industry Certifications
                </h3>
                <ul className="space-y-2">
                  {activeMilestone.recommendedCertifications.map((cert, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-800 flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <span className="font-semibold">{cert}</span>
                      <button
                        onClick={() => setActiveTab('certifications')}
                        className="text-purple-600 font-bold hover:underline cursor-pointer text-xs"
                      >
                        Verify Cert
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pillar 4: Portfolio Projects to Build */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-amber-600" />
                  Hands-On Projects for Your Portfolio
                </h3>
                <ul className="space-y-2">
                  {activeMilestone.recommendedProjects.map((proj, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                        <span className="font-semibold">{proj}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('portfolio')}
                        className="text-amber-700 font-bold hover:underline cursor-pointer text-xs"
                      >
                        View in Digital Portfolio
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Roles Unlocked Banner */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Roles Unlocked Upon Milestone Completion:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeMilestone.relevantJobRoles.map((roleTitle, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold"
                    >
                      {roleTitle}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('jobs')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
                View Matching Job Drives
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
