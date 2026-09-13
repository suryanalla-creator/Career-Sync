import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Plus,
  Users,
  Search,
  UserCheck,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { api } from '../../services/api';
import { CandidateProfileAndPortfolioModal } from './CandidateProfileAndPortfolioModal';

export const PostInternshipView: React.FC = () => {
  const {
    triggerConfetti,
    setActiveTab,
    refreshData,
    opportunities,
    updateOpportunityStatus,
    setSelectedOpportunity
  } = useApp();

  const [activeSection, setActiveSection] = useState<'post' | 'manage'>('post');
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  // Applicants view states
  const [selectedInternshipForApplicants, setSelectedInternshipForApplicants] = useState<Opportunity | null>(null);
  const [internshipApplicants, setInternshipApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantStageFilter, setApplicantStageFilter] = useState<string>('All');
  const [applicantSearchQuery, setApplicantSearchQuery] = useState('');
  const [inspectedCandidateId, setInspectedCandidateId] = useState<string | null>(null);
  const [inspectedCandidateData, setInspectedCandidateData] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState('Full Stack Engineering Intern (Summer 2026)');
  const [domain, setDomain] = useState('Software Engineering & Cloud');
  const [duration, setDuration] = useState('6 Months (Jan - June 2026)');
  const [stipend, setStipend] = useState('₹30,000 / month');
  const [location, setLocation] = useState('Hyderabad / Hybrid');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [responsibilities, setResponsibilities] = useState('Build interactive client dashboard widgets, optimize GraphQL resolvers, write automated end-to-end browser tests.');
  const [eligibility, setEligibility] = useState('B.Tech 3rd or 4th year with minimum 7.0 CGPA and active Git repository.');
  const [deadline, setDeadline] = useState('2026-10-15');
  const [postedDate, setPostedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Minimum Industry Benchmark Requirements
  const [minSkillScore, setMinSkillScore] = useState<number>(70);
  const [minCgpa, setMinCgpa] = useState<number>(7.0);
  const [minMatchPercentage, setMinMatchPercentage] = useState<number>(60);
  const [minVerifiedCertificatesCount, setMinVerifiedCertificatesCount] = useState<number>(0);
  const [benchmarkNotes, setBenchmarkNotes] = useState<string>('Internship Benchmark: Requires skill score ≥ 70%, CGPA ≥ 7.0, and 60%+ skill match.');

  const applyInternshipBenchmarkPreset = (preset: 'rd' | 'standard' | 'inclusive') => {
    if (preset === 'rd') {
      setMinSkillScore(80);
      setMinCgpa(8.0);
      setMinMatchPercentage(70);
      setMinVerifiedCertificatesCount(1);
      setBenchmarkNotes('R&D Track: High-rigor research benchmark requiring skill score ≥ 80%, CGPA ≥ 8.0, and 1+ verified certificate.');
    } else if (preset === 'standard') {
      setMinSkillScore(70);
      setMinCgpa(7.0);
      setMinMatchPercentage(60);
      setMinVerifiedCertificatesCount(0);
      setBenchmarkNotes('Standard Summer Internship: Requires skill score ≥ 70%, CGPA ≥ 7.0, and 60%+ skill match.');
    } else {
      setMinSkillScore(60);
      setMinCgpa(6.5);
      setMinMatchPercentage(50);
      setMinVerifiedCertificatesCount(0);
      setBenchmarkNotes('Inclusive Fast-Track: Open foundational benchmark requiring skill score ≥ 60% and CGPA ≥ 6.5.');
    }
  };

  // Filter for manage section
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'archived'>('all');

  // Load applicants for selected internship
  useEffect(() => {
    if (!selectedInternshipForApplicants) return;

    setLoadingApplicants(true);
    api.applications.getAll({ opportunityId: selectedInternshipForApplicants.id })
      .then((apps) => {
        setInternshipApplicants(apps || []);
      })
      .catch((err) => {
        console.warn('Error fetching internship applicants:', err);
      })
      .finally(() => {
        setLoadingApplicants(false);
      });
  }, [selectedInternshipForApplicants]);

  const handleUpdateApplicantStage = async (appId: string, newStage: string) => {
    try {
      await api.applications.updateStage(appId, newStage, `Stage updated to ${newStage} by recruiter.`);
      setInternshipApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, currentStage: newStage } : a))
      );
      triggerConfetti();
    } catch (err: any) {
      alert(`Could not update application stage: ${err.message}`);
    }
  };

  const postedInternships = opportunities.filter((op) => op.type === 'internship');
  const filteredInternships = postedInternships.filter((op) => {
    if (statusFilter === 'active') return op.status === 'Active' && !op.isClosed;
    if (statusFilter === 'closed') return op.status === 'Closed' || op.isClosed;
    if (statusFilter === 'archived') return op.status === 'Archived';
    return true;
  });

  const filteredApplicants = internshipApplicants.filter((app) => {
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

  const handleStatusChange = async (
    opportunityId: string,
    newStatus: 'Active' | 'Closed' | 'Archived',
    reason?: string
  ) => {
    setStatusLoadingId(opportunityId);
    try {
      await updateOpportunityStatus(opportunityId, newStatus, reason);
      triggerConfetti();
    } catch (err: any) {
      alert(`Failed to update internship status: ${err.message}`);
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.opportunities.create({
        type: 'internship',
        title,
        organization: 'TechNova Solutions',
        location,
        workMode: workMode as any,
        salaryOrStipend: stipend,
        duration,
        deadline,
        postedDate,
        description: `Exciting ${domain} internship opportunity to build hands-on systems with production impact.`,
        requiredSkills: skills.split(',').map((s) => s.trim()),
        eligibility,
        responsibilities: responsibilities.split('.').map((s) => s.trim()).filter(Boolean),
        minSkillScore,
        minCgpa,
        minMatchPercentage,
        minVerifiedCertificatesCount,
        benchmarkNotes: benchmarkNotes || `Benchmark: Skill Score ≥ ${minSkillScore}%, CGPA ≥ ${minCgpa}, Skill Match ≥ ${minMatchPercentage}%${minVerifiedCertificatesCount > 0 ? `, ${minVerifiedCertificatesCount}+ Verified Certs` : ''}.`
      });

      await refreshData();
      triggerConfetti();
      alert(`Internship program "${title}" published across partner university placement systems!`);
      setActiveSection('manage');
    } catch (err: any) {
      alert(`Failed to post internship: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header with Sub-tab Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            University Pre-Placement Program &amp; Applicants
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Internship Postings &amp; Applicants Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish new internship drives, view applicant profiles, and inspect student digital portfolios.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveSection('post');
              setSelectedInternshipForApplicants(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'post'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Internship
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection('manage');
              setSelectedInternshipForApplicants(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'manage' && !selectedInternshipForApplicants
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Manage Postings ({postedInternships.length})
          </button>
        </div>
      </div>

      {/* 1. APPLICANTS SUB-VIEW FOR A SPECIFIC POSTED INTERNSHIP */}
      {selectedInternshipForApplicants ? (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Top Banner / Breadcrumb */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedInternshipForApplicants(null)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Posted Internships
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-slate-900">{selectedInternshipForApplicants.title}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {selectedInternshipForApplicants.workMode} • {selectedInternshipForApplicants.salaryOrStipend}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {selectedInternshipForApplicants.organization} • Location: {selectedInternshipForApplicants.location} • Deadline: {selectedInternshipForApplicants.deadline}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl text-xs font-black border border-blue-100 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                {internshipApplicants.length} Total Applicants
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
                  placeholder="Search internship applicants by Name, Student ID (#84920...), Department, or Skills..."
                  value={applicantSearchQuery}
                  onChange={(e) => setApplicantSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Stage Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected'].map((stage) => {
                  const count = stage === 'All'
                    ? internshipApplicants.length
                    : internshipApplicants.filter((a) => a.currentStage === stage).length;
                  return (
                    <button
                      key={stage}
                      onClick={() => setApplicantStageFilter(stage)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        applicantStageFilter === stage
                          ? 'bg-blue-600 text-white shadow-xs'
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
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">Loading Internship Applicants...</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No applicants match the current filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {applicantSearchQuery || applicantStageFilter !== 'All'
                  ? 'Try clearing your search query or choosing another stage filter.'
                  : 'New campus applicants for this internship program will appear here in real-time.'}
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
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-xs space-y-4 transition-all flex flex-col justify-between"
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
                            <span className="inline-block px-1.5 py-0.2 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded mt-0.5 mb-1">
                              ID: {studentIdDisplay}
                            </span>
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
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : app.currentStage === 'Screening'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
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
                      <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs mb-3">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          {app.matchScore || app.skillScore || 94}% Match
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
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-[11px] font-bold cursor-pointer focus:outline-none focus:border-blue-500"
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
      ) : activeSection === 'post' ? (
        /* Form Section */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Internship Requirements &amp; Eligibility
            </h2>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Internship Role Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration &amp; Cohort</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Stipend</label>
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Skills Required (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Key Responsibilities</label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Posting / Announcement Date <span className="text-blue-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={postedDate}
                  onChange={(e) => setPostedDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium text-xs"
                />
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium text-xs"
                />
              </div>
            </div>

            {/* MINIMUM INDUSTRY BENCHMARK REQUIREMENTS CARD */}
            <div className="p-5 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-slate-50 rounded-2xl border-2 border-blue-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      Minimum Industry Benchmark Requirements
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                        Application Gatekeeper
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      All students can browse and view this internship, but only candidates reaching these minimum benchmark criteria can apply.
                    </p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyInternshipBenchmarkPreset('rd')}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 cursor-pointer transition-colors"
                  >
                    R&amp;D Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => applyInternshipBenchmarkPreset('standard')}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 cursor-pointer transition-colors"
                  >
                    Summer Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => applyInternshipBenchmarkPreset('inclusive')}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
                  >
                    Inclusive Standard
                  </button>
                </div>
              </div>

              {/* Benchmark Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Min Skill Score */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Min Skill Score</span>
                    <span className="text-blue-700 font-black text-sm">{minSkillScore}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    step={5}
                    value={minSkillScore}
                    onChange={(e) => setMinSkillScore(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">Overall skill test score</span>
                </div>

                {/* Min CGPA */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Min Academic CGPA</span>
                    <span className="text-blue-700 font-black text-sm">{minCgpa.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={6.0}
                    max={9.0}
                    step={0.1}
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">Out of 10.0 scale</span>
                </div>

                {/* Min Skill Match % */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Min Skill Match</span>
                    <span className="text-blue-700 font-black text-sm">{minMatchPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={90}
                    step={5}
                    value={minMatchPercentage}
                    onChange={(e) => setMinMatchPercentage(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">Match with required skills</span>
                </div>

                {/* Min Verified Certificates */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Verified Certs</span>
                    <span className="text-blue-700 font-black text-sm">{minVerifiedCertificatesCount} Req</span>
                  </div>
                  <select
                    value={minVerifiedCertificatesCount}
                    onChange={(e) => setMinVerifiedCertificatesCount(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={0}>0 (Optional)</option>
                    <option value={1}>1+ Verified Certificate</option>
                    <option value={2}>2+ Verified Certificates</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block">Accredited verified credentials</span>
                </div>
              </div>

              {/* Benchmark Note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Benchmark Note (Displayed to Candidates)
                </label>
                <input
                  type="text"
                  value={benchmarkNotes}
                  onChange={(e) => setBenchmarkNotes(e.target.value)}
                  placeholder="e.g. Interns must meet minimum 70% skill score and 7.0 CGPA."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Publishing...' : 'Publish Internship'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Manage Section */
        <div className="space-y-4">
          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              {(['all', 'active', 'closed', 'archived'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'all'
                    ? `All Internships (${postedInternships.length})`
                    : filter === 'active'
                    ? `Active / Open (${postedInternships.filter((o) => o.status === 'Active' && !o.isClosed).length})`
                    : filter === 'closed'
                    ? `Bookings Closed (${postedInternships.filter((o) => o.status === 'Closed' || o.isClosed).length})`
                    : `Archived (${postedInternships.filter((o) => o.status === 'Archived').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* List of Internships */}
          {filteredInternships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No internships found in this category</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create new internship drives or adjust your filters above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredInternships.map((internship) => {
                const isClosed = internship.status === 'Closed' || internship.isClosed;
                const isArchived = internship.status === 'Archived';
                const isLoading = statusLoadingId === internship.id;

                return (
                  <div
                    key={internship.id}
                    className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                      isArchived
                        ? 'border-slate-300 bg-slate-50 opacity-75'
                        : isClosed
                        ? 'border-amber-200 bg-amber-50/20'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left Details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-base">{internship.title}</h3>
                          {/* Badge */}
                          {isArchived ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                              Archived / Completed
                            </span>
                          ) : isClosed ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              Applications Closed
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Live &amp; Accepting
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {internship.location} ({internship.workMode})
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            {internship.salaryOrStipend}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Deadline: {internship.deadline}
                          </span>
                          {internship.postedDate && (
                            <span className="flex items-center gap-1 text-slate-600">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Posted: {internship.postedDate}
                            </span>
                          )}
                        </div>

                        {isClosed && internship.closedReason && (
                          <div className="text-xs text-amber-700 bg-amber-100/60 px-3 py-1 rounded-lg inline-block border border-amber-200">
                            <strong>Closing Notice:</strong> {internship.closedReason}
                          </div>
                        )}
                      </div>

                      {/* Right Publisher Control Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* VIEW APPLICANTS BUTTON */}
                        <button
                          onClick={() => setSelectedInternshipForApplicants(internship)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          View Applicants ({internship.applicantsCount || 0})
                        </button>

                        <button
                          onClick={() => setSelectedOpportunity(internship)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>

                        {isClosed ? (
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleStatusChange(internship.id, 'Active')
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isLoading ? 'Reopening...' : 'Reopen Bookings'}
                          </button>
                        ) : (
                          <button
                            disabled={isLoading}
                            onClick={() => {
                              const reason = prompt(
                                'Enter closing reason or message for students:',
                                'Target applicant quota fulfilled for this cohort.'
                              );
                              if (reason !== null) {
                                handleStatusChange(internship.id, 'Closed', reason);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {isLoading ? 'Closing...' : 'Close Bookings'}
                          </button>
                        )}

                        {!isArchived && (
                          <button
                            disabled={isLoading}
                            onClick={() => {
                              if (
                                confirm(
                                  'Are you sure you want to completely close and archive this internship posting?'
                                )
                              ) {
                                handleStatusChange(
                                  internship.id,
                                  'Archived',
                                  'Internship cycle ended and archived.'
                                );
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Total Close
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
