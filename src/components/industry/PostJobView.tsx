import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Users,
  Search,
  Filter,
  UserCheck,
  ChevronRight,
  Bookmark,
  ShieldCheck,
  Award,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { api } from '../../services/api';
import { CandidateProfileAndPortfolioModal } from './CandidateProfileAndPortfolioModal';

export const PostJobView: React.FC = () => {
  const { triggerConfetti, setActiveTab, refreshData, opportunities, updateOpportunityStatus, setSelectedOpportunity, createOpportunity } = useApp();
  const [activeSection, setActiveSection] = useState<'post' | 'manage' | 'applicants'>('post');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  // Applicants view states
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<Opportunity | null>(null);
  const [jobApplicants, setJobApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantStageFilter, setApplicantStageFilter] = useState<string>('All');
  const [applicantSearchQuery, setApplicantSearchQuery] = useState('');
  const [inspectedCandidateId, setInspectedCandidateId] = useState<string | null>(null);
  const [inspectedCandidateData, setInspectedCandidateData] = useState<any | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('TechNova Solutions');
  const [jobTitle, setJobTitle] = useState('Software Development Engineer - I');
  const [department, setDepartment] = useState('Core Engineering & Cloud Platform');
  const [location, setLocation] = useState('Bangalore, India');
  const [workMode, setWorkMode] = useState<'Hybrid' | 'Remote' | 'On-site'>('Hybrid');
  const [salary, setSalary] = useState('₹14,00,000 - ₹18,00,000 / annum');
  const [experience, setExperience] = useState('Fresher (Batch of 2026)');
  const [qualification, setQualification] = useState('B.E. / B.Tech / M.Tech in CSE / ISE / AI&DS');
  const [targetRole, setTargetRole] = useState('fullstack-engineer');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    'All B.Tech Branches',
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication Engineering'
  ]);
  const [requiredSkills, setRequiredSkills] = useState(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [preferredSkills, setPreferredSkills] = useState(['Docker', 'AWS', 'Next.js']);
  const [jobDescription, setJobDescription] = useState('We are seeking ambitious graduate engineers to build low-latency web interfaces and scalable backend microservices.');
  const [deadline, setDeadline] = useState('2026-10-31');
  const [postedDate, setPostedDate] = useState(new Date().toISOString().split('T')[0]);

  // Minimum Industry Benchmark Requirements
  const [minSkillScore, setMinSkillScore] = useState<number>(75);
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [minMatchPercentage, setMinMatchPercentage] = useState<number>(70);
  const [minVerifiedCertificatesCount, setMinVerifiedCertificatesCount] = useState<number>(1);
  const [benchmarkNotes, setBenchmarkNotes] = useState<string>('Tier-1 SDE Benchmark: Requires overall skill score ≥ 75%, CGPA ≥ 7.5, skill match ≥ 70%, and 1+ verified certificate.');

  const applyBenchmarkPreset = (preset: 'tier1' | 'startup' | 'campus') => {
    if (preset === 'tier1') {
      setMinSkillScore(80);
      setMinCgpa(8.0);
      setMinMatchPercentage(75);
      setMinVerifiedCertificatesCount(1);
      setBenchmarkNotes('Tier-1 Product Standard: High-rigor engineering benchmark requiring overall skill score ≥ 80%, CGPA ≥ 8.0, 75%+ skill match, and at least 1 verified certificate.');
    } else if (preset === 'startup') {
      setMinSkillScore(72);
      setMinCgpa(7.0);
      setMinMatchPercentage(65);
      setMinVerifiedCertificatesCount(1);
      setBenchmarkNotes('High-Growth Startup Track: Fast execution benchmark requiring skill score ≥ 72%, CGPA ≥ 7.0, and 1+ verified certificate.');
    } else {
      setMinSkillScore(60);
      setMinCgpa(6.5);
      setMinMatchPercentage(50);
      setMinVerifiedCertificatesCount(0);
      setBenchmarkNotes('Inclusive Campus Standard: Broad entry standard with 60%+ skill score and 6.5+ CGPA.');
    }
  };

  // Load applicants whenever selectedJobForApplicants or activeSection changes
  useEffect(() => {
    if (!selectedJobForApplicants && activeSection !== 'applicants') return;

    setLoadingApplicants(true);
    const params = selectedJobForApplicants
      ? { opportunityId: selectedJobForApplicants.id, role: 'industry' }
      : { role: 'industry', organization: companyName };

    api.applications.getAll(params)
      .then((apps) => {
        setJobApplicants(apps || []);
      })
      .catch((err) => {
        console.warn('Error fetching applicants:', err);
      })
      .finally(() => {
        setLoadingApplicants(false);
      });
  }, [selectedJobForApplicants, activeSection, companyName]);

  const handleUpdateApplicantStage = async (appId: string, newStage: string) => {
    try {
      await api.applications.updateStage(appId, newStage, `Stage updated to ${newStage} by recruiter.`);
      setJobApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, currentStage: newStage } : a))
      );
      triggerConfetti();
    } catch (err: any) {
      alert(`Could not update application stage: ${err.message}`);
    }
  };

  // AI Skill Suggestions Trigger
  const handleAISuggestions = () => {
    setRequiredSkills(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'FastAPI', 'System Design']);
    setPreferredSkills(['Docker', 'AWS', 'Redis', 'Kafka', 'GraphQL']);
    triggerConfetti();
    alert('AI Skill Suggestions generated from 850+ comparable Tier-1 SDE job postings!');
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createOpportunity({
        type: 'job',
        title: jobTitle,
        organization: companyName || 'TechNova Solutions',
        location,
        workMode,
        salaryOrStipend: salary,
        experience,
        deadline,
        postedDate,
        description: jobDescription,
        requiredSkills,
        preferredSkills,
        eligibility: qualification,
        careerRoleIds: [targetRole, 'fullstack-engineer', 'frontend-engineer', 'backend-engineer'],
        targetRoles: [jobTitle, 'Software Development Engineer', 'Full-Stack Developer'],
        eligibleBranches: selectedBranches,
        responsibilities: [
          'Design and implement high-performance web components and APIs',
          'Collaborate with product and cross-functional engineering teams',
          'Maintain test coverage and clean architectural standards'
        ],
        status: 'Active',
        minSkillScore,
        minCgpa,
        minMatchPercentage,
        minVerifiedCertificatesCount,
        benchmarkNotes: benchmarkNotes || `Benchmark: Skill Score ≥ ${minSkillScore}%, CGPA ≥ ${minCgpa}, Skill Match ≥ ${minMatchPercentage}%${minVerifiedCertificatesCount > 0 ? `, ${minVerifiedCertificatesCount}+ Verified Certs` : ''}.`
      });

      if (res.success) {
        alert(`Job opening for "${jobTitle}" has been successfully published across student and university portals!`);
        setActiveSection('manage');
        setCurrentStep(1);
      } else {
        alert(res.message || 'Failed to post job');
      }
    } catch (err: any) {
      alert(`Failed to post job: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postedJobs = opportunities.filter(o => o.type === 'job');
  const activeJobsCount = postedJobs.filter(o => !o.isClosed && o.status !== 'Closed' && o.status !== 'Archived').length;
  const closedJobsCount = postedJobs.filter(o => o.isClosed || o.status === 'Closed' || o.status === 'Archived').length;

  const handleToggleJobStatus = async (opp: Opportunity, targetStatus: 'Active' | 'Closed' | 'Archived', reason?: string) => {
    setStatusLoadingId(opp.id);
    const res = await updateOpportunityStatus(opp.id, targetStatus, reason);
    setStatusLoadingId(null);
    if (res.success) {
      triggerConfetti();
    } else {
      alert(res.message || 'Could not update status');
    }
  };

  // Filtered applicants for the selected job
  const filteredApplicants = jobApplicants.filter((app) => {
    if (applicantStageFilter !== 'All' && app.currentStage !== applicantStageFilter) {
      return false;
    }
    if (applicantSearchQuery.trim()) {
      const q = applicantSearchQuery.toLowerCase().trim();
      const matchName = app.studentName?.toLowerCase().includes(q);
      const matchId = app.studentId?.toLowerCase().includes(q.replace(/^#/, ''));
      const matchDept = app.department?.toLowerCase().includes(q);
      const matchCollege = app.college?.toLowerCase().includes(q);
      const matchSkills = Array.isArray(app.topSkills) && app.topSkills.some((s: string) => s.toLowerCase().includes(q));
      if (!matchName && !matchId && !matchDept && !matchCollege && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1 border border-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Recruiter Campaign Creator &amp; Applicants Hub
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Full-Time Campus Job Openings &amp; Applicants Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish verified campus job requirements, review student applicants and inspect verified digital portfolios.
          </p>
        </div>

        {activeSection === 'post' && (
          <button
            onClick={handleAISuggestions}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            AI Skill Requirement Suggestions
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit flex-wrap">
        <button
          onClick={() => {
            setActiveSection('post');
            setSelectedJobForApplicants(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'post'
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="w-4 h-4 text-purple-600" />
          Create New Job Opening
        </button>
        <button
          onClick={() => {
            setActiveSection('manage');
            setSelectedJobForApplicants(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'manage' && !selectedJobForApplicants
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          Manage Postings &amp; Closings ({postedJobs.length})
        </button>
        <button
          onClick={() => {
            setActiveSection('applicants');
            setSelectedJobForApplicants(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            (activeSection === 'applicants' || selectedJobForApplicants)
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          View Applicants ({jobApplicants.length})
        </button>
      </div>

      {/* 1. APPLICANTS SUB-VIEW FOR A SPECIFIC POSTED JOB OR ALL JOBS */}
      {(selectedJobForApplicants || activeSection === 'applicants') ? (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Top Banner / Breadcrumb */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              {selectedJobForApplicants ? (
                <>
                  <button
                    onClick={() => setSelectedJobForApplicants(null)}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to All Posted Jobs
                  </button>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black text-slate-900">{selectedJobForApplicants.title}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {selectedJobForApplicants.workMode} • {selectedJobForApplicants.salaryOrStipend}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedJobForApplicants.organization} • Location: {selectedJobForApplicants.location} • Deadline: {selectedJobForApplicants.deadline}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black text-slate-900">All Campus Job Applicants &amp; Candidate Submissions</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {companyName} • Talent Pipeline
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Real-time student applications submitted across all your active job postings and recruitment drives.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-800 rounded-xl text-xs font-black border border-indigo-100 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                {jobApplicants.length} Total Applicants
              </span>
            </div>
          </div>

          {/* Search & Stage Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search applicants by Name, Student ID (#84920...), Department, or Skills..."
                  value={applicantSearchQuery}
                  onChange={(e) => setApplicantSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              {/* Stage Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected'].map((stage) => {
                  const count = stage === 'All'
                    ? jobApplicants.length
                    : jobApplicants.filter((a) => a.currentStage === stage).length;
                  return (
                    <button
                      key={stage}
                      onClick={() => setApplicantStageFilter(stage)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        applicantStageFilter === stage
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {stage} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Applicants Grid */}
          {loadingApplicants ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">Loading Job Applicants...</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No applicants match the current filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {applicantSearchQuery || applicantStageFilter !== 'All'
                  ? 'Try clearing your search query or choosing another stage filter.'
                  : 'New campus applicants for this job will appear here in real-time as students apply.'}
              </p>
              {(applicantSearchQuery || applicantStageFilter !== 'All') && (
                <button
                  onClick={() => {
                    setApplicantSearchQuery('');
                    setApplicantStageFilter('All');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApplicants.map((app) => {
                const candId = app.candidateId || app.userId || 'cand-01';
                const studentIdDisplay = app.studentId || `#84920${String(candId).replace(/\D/g, '').padStart(5, '0')}`;

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-5 shadow-xs space-y-4 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Info Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={app.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-sm font-black text-slate-900">{app.studentName}</h4>
                              {app.isVerified && (
                                <span title="Verified Campus Student">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 mb-1">
                              <span className="inline-block px-1.5 py-0.2 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded">
                                ID: {studentIdDisplay}
                              </span>
                              {(app.title || selectedJobForApplicants?.title) && (
                                <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-100">
                                  🎯 {app.title || selectedJobForApplicants?.title}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-tight">
                              {app.degree} • {app.department}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {app.college} (CGPA: <strong className="text-slate-700">{app.cgpa || 8.9}</strong>)
                            </p>
                          </div>
                        </div>

                        {/* Stage Badge */}
                        <div className="text-right flex-shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider block ${
                              app.currentStage === 'Selected'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : app.currentStage === 'Interview'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : app.currentStage === 'Shortlisted'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : app.currentStage === 'Screening'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {app.currentStage}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Applied: {app.appliedDate}
                          </span>
                        </div>
                      </div>

                      {/* Skill Match & Scores */}
                      <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-xs mb-3">
                        <div className="flex items-center gap-1.5 font-bold text-purple-900">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          {app.matchScore || app.skillScore || 94}% Skill Match
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          Assessment: {app.skillScore || 92}%
                        </span>
                      </div>

                      {/* Top Skills */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Verified Competencies
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(app.topSkills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL']).slice(0, 4).map((sk: string, i: number) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                      {/* ONLY STUDENT PROFILE & DIGITAL PORTFOLIO INSPECTION BUTTON */}
                      <button
                        onClick={() => {
                          setInspectedCandidateId(candId);
                          setInspectedCandidateData({
                            ...app,
                            id: candId,
                            name: app.studentName,
                            studentId: studentIdDisplay
                          });
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        View Student Profile &amp; Portfolio
                      </button>

                      {/* Quick Stage Progression Dropdown / Actions */}
                      <div className="flex items-center gap-1">
                        <select
                          value={app.currentStage}
                          onChange={(e) => handleUpdateApplicantStage(app.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold cursor-pointer focus:outline-none focus:border-purple-500"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Screening">Screening</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeSection === 'manage' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">All Published Job Openings</h2>
              <p className="text-xs text-slate-500">Manage bookings, view applicants per job opening, or close application pipelines.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                {activeJobsCount} Active
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                {closedJobsCount} Closed / Archived
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postedJobs.map((opp) => {
              const isClosed = opp.isClosed || opp.status === 'Closed' || opp.status === 'Archived';
              const isArchived = opp.status === 'Archived';

              return (
                <div
                  key={opp.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition-all flex flex-col justify-between ${
                    isArchived
                      ? 'border-slate-300 bg-slate-50/50 opacity-80'
                      : isClosed
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase">
                        {opp.type}
                      </span>
                      {isArchived ? (
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md border border-slate-300 flex items-center gap-1">
                          📁 Total Closed / Archived
                        </span>
                      ) : isClosed ? (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Applications Closed
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active &amp; Accepting
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{opp.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{opp.organization} • {opp.location} ({opp.workMode})</p>

                    <div className="flex items-center gap-3 text-xs text-slate-600 my-2 flex-wrap">
                      <span className="font-semibold text-blue-700">{opp.salaryOrStipend}</span>
                      <span>•</span>
                      <span className="text-slate-500">Deadline: {opp.deadline}</span>
                      {opp.postedDate && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Posted: {opp.postedDate}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {opp.requiredSkills.slice(0, 4).map((sk, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs flex-wrap">
                    {/* VIEW APPLICANTS BUTTON */}
                    <button
                      onClick={() => setSelectedJobForApplicants(opp)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      View Applicants ({opp.applicantsCount || 0})
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedOpportunity(opp)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>

                      {isClosed ? (
                        <button
                          disabled={statusLoadingId === opp.id}
                          onClick={() => handleToggleJobStatus(opp, 'Active')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Reopen
                        </button>
                      ) : (
                        <>
                          <button
                            disabled={statusLoadingId === opp.id}
                            onClick={() => handleToggleJobStatus(opp, 'Closed', 'Applications reached capacity.')}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                            title="Stop new student applications"
                          >
                            Close Bookings
                          </button>
                          <button
                            disabled={statusLoadingId === opp.id}
                            onClick={() => handleToggleJobStatus(opp, 'Archived', 'Campaign archived.')}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-[11px] transition-all cursor-pointer"
                            title="Total closing and archive"
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
        </div>
      ) : (
        <>
          {/* Multi-step indicator */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            {[
              { step: 1, label: 'Role & Compensation' },
              { step: 2, label: 'Skills & Eligibility' },
              { step: 3, label: 'Job Description & Review' }
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    currentStep >= s.step ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s.step}
                </span>
                <span
                  className={`text-xs font-bold hidden sm:inline ${
                    currentStep === s.step ? 'text-purple-900' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleFinalSubmit} className="space-y-5 text-xs">
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 1: Role Overview &amp; Remuneration
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. TechNova Solutions"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Department / Team</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Annual CTC / Salary Band</label>
                      <input
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
                      <select
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Continue to Skills <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 2: Candidate Qualifications &amp; Skill Matrix
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Target Career Role Track</label>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white"
                      >
                        <option value="fullstack-engineer">Full-Stack Engineer</option>
                        <option value="frontend-engineer">Frontend Engineer</option>
                        <option value="backend-engineer">Backend / Systems Engineer</option>
                        <option value="data-scientist">AI & Data Scientist</option>
                        <option value="cloud-devops-engineer">Cloud & DevOps Engineer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Target Experience Level</label>
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Eligible Academic Degrees &amp; Branches</label>
                    <input
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. B.E. / B.Tech / M.Tech in CSE / ISE / AI&DS (Open to All Branches)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none mb-2"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {['All B.Tech Branches', 'Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering'].map((br) => {
                        const isSelected = selectedBranches.includes(br);
                        return (
                          <button
                            type="button"
                            key={br}
                            onClick={() => {
                              if (br === 'All B.Tech Branches') {
                                setSelectedBranches(['All B.Tech Branches', 'Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science', 'Electronics & Communication Engineering']);
                              } else {
                                setSelectedBranches(prev =>
                                  prev.includes(br) ? prev.filter(b => b !== br) : [...prev, br]
                                );
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{br}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mandatory Required Skills (Evaluated during AI Matching)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {requiredSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-semibold flex items-center gap-1"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Tip: Click &quot;AI Skill Requirement Suggestions&quot; to auto-tune these skills to the candidate market.
                    </p>
                  </div>

                  {/* Preferred Skills */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Bonus Competencies</label>
                    <div className="flex flex-wrap gap-2">
                      {preferredSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* MINIMUM INDUSTRY BENCHMARK REQUIREMENTS CARD */}
                  <div className="p-5 bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-slate-50 rounded-2xl border-2 border-purple-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            Minimum Industry Benchmark Requirements
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                              Application Gatekeeper
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium">
                            All students can view this job, but only candidates meeting these minimum criteria will be eligible to submit an application.
                          </p>
                        </div>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Presets:</span>
                        <button
                          type="button"
                          onClick={() => applyBenchmarkPreset('tier1')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 cursor-pointer transition-colors"
                        >
                          Tier-1 Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBenchmarkPreset('startup')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 cursor-pointer transition-colors"
                        >
                          High-Growth Startup
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBenchmarkPreset('campus')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
                        >
                          Inclusive Standard
                        </button>
                      </div>
                    </div>

                    {/* Benchmark Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {/* Min Skill Score */}
                      <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Min Skill Score</span>
                          <span className="text-purple-700 font-black text-sm">{minSkillScore}%</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={95}
                          step={5}
                          value={minSkillScore}
                          onChange={(e) => setMinSkillScore(Number(e.target.value))}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 block">Candidate overall skill test score</span>
                      </div>

                      {/* Min CGPA */}
                      <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Min Academic CGPA</span>
                          <span className="text-purple-700 font-black text-sm">{minCgpa.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min={6.0}
                          max={9.0}
                          step={0.1}
                          value={minCgpa}
                          onChange={(e) => setMinCgpa(Number(e.target.value))}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 block">Out of 10.0 scale</span>
                      </div>

                      {/* Min Skill Match % */}
                      <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Min Skill Match</span>
                          <span className="text-purple-700 font-black text-sm">{minMatchPercentage}%</span>
                        </div>
                        <input
                          type="range"
                          min={40}
                          max={90}
                          step={5}
                          value={minMatchPercentage}
                          onChange={(e) => setMinMatchPercentage(Number(e.target.value))}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 block">Match with required skills</span>
                      </div>

                      {/* Min Verified Certificates */}
                      <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Verified Certs</span>
                          <span className="text-purple-700 font-black text-sm">{minVerifiedCertificatesCount} Req</span>
                        </div>
                        <select
                          value={minVerifiedCertificatesCount}
                          onChange={(e) => setMinVerifiedCertificatesCount(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-purple-500"
                        >
                          <option value={0}>0 (Optional)</option>
                          <option value={1}>1+ Verified Certificate</option>
                          <option value={2}>2+ Verified Certificates</option>
                          <option value={3}>3+ Verified Certificates</option>
                        </select>
                        <span className="text-[10px] text-slate-400 block">Accredited verified credentials</span>
                      </div>
                    </div>

                    {/* Benchmark Note */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Benchmark Criteria Note (Displayed to Candidates)
                      </label>
                      <input
                        type="text"
                        value={benchmarkNotes}
                        onChange={(e) => setBenchmarkNotes(e.target.value)}
                        placeholder="e.g. Candidates must hold minimum 75% overall skill score and 1 verified credential."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Continue to Review <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 3: Job Description &amp; Publication Review
                  </h2>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Detailed Role Description</label>
                    <textarea
                      rows={4}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Posting / Announcement Date <span className="text-purple-600">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={postedDate}
                        onChange={(e) => setPostedDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none font-medium text-xs"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Official broadcast date visible on student job cards</p>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Application Deadline <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none font-medium text-xs"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Date when bookings &amp; applications automatically conclude</p>
                    </div>
                  </div>

                  {/* Summary Preview Box */}
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                    <p className="font-bold text-purple-900 text-xs">Ready to Broadcast to 4,850+ Verified Students</p>
                    <p className="text-slate-600 text-[11px]">
                      Posting as <strong>TechNova Solutions</strong> • Role: <strong>{jobTitle}</strong> • CTC: <strong>{salary}</strong>.
                    </p>
                    <div className="pt-2 border-t border-purple-200/60 flex flex-wrap gap-2 text-[10px] font-bold text-purple-950">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-purple-200">
                        Min Skill Score: {minSkillScore}%
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-purple-200">
                        Min CGPA: {minCgpa.toFixed(1)}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-purple-200">
                        Min Match: {minMatchPercentage}%
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-purple-200">
                        Verified Certs: {minVerifiedCertificatesCount > 0 ? `${minVerifiedCertificatesCount} Req` : 'Optional'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Publishing...' : 'Publish Job Opening'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </>
      )}

      {/* CANDIDATE PROFILE & DIGITAL PORTFOLIO INSPECTION MODAL (RESTRICTED TO PROFILE & PORTFOLIO ONLY) */}
      {inspectedCandidateId && (
        <CandidateProfileAndPortfolioModal
          candidateId={inspectedCandidateId}
          initialCandidate={inspectedCandidateData}
          onClose={() => {
            setInspectedCandidateId(null);
            setInspectedCandidateData(null);
          }}
        />
      )}
    </div>
  );
};
