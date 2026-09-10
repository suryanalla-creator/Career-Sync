import React, { useState } from 'react';
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
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';

import { api } from '../../services/api';

export const PostJobView: React.FC = () => {
  const { triggerConfetti, setActiveTab, refreshData, opportunities, updateOpportunityStatus, setSelectedOpportunity } = useApp();
  const [activeSection, setActiveSection] = useState<'post' | 'manage'>('post');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  // Form states
  const [jobTitle, setJobTitle] = useState('Software Development Engineer - I');
  const [department, setDepartment] = useState('Core Engineering & Cloud Platform');
  const [location, setLocation] = useState('Bangalore, India');
  const [workMode, setWorkMode] = useState<'Hybrid' | 'Remote' | 'On-site'>('Hybrid');
  const [salary, setSalary] = useState('₹14,00,000 - ₹18,00,000 / annum');
  const [experience, setExperience] = useState('Fresher (Batch of 2026)');
  const [qualification, setQualification] = useState('B.E. / B.Tech / M.Tech in CSE / ISE / AI&DS');
  const [requiredSkills, setRequiredSkills] = useState(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [preferredSkills, setPreferredSkills] = useState(['Docker', 'AWS', 'Next.js']);
  const [jobDescription, setJobDescription] = useState('We are seeking ambitious graduate engineers to build low-latency web interfaces and scalable backend microservices.');
  const [deadline, setDeadline] = useState('2026-10-31');

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
      const res = await api.opportunities.create({
        type: 'job',
        title: jobTitle,
        organization: 'TechNova Solutions',
        location,
        workMode,
        salaryOrStipend: salary,
        experience,
        deadline,
        description: jobDescription,
        requiredSkills,
        preferredSkills,
        eligibility: qualification,
        responsibilities: [
          'Design and implement high-performance web components and APIs',
          'Collaborate with product and cross-functional engineering teams',
          'Maintain test coverage and clean architectural standards'
        ]
      });

      await refreshData();
      triggerConfetti();
      alert(`Job opening for "${jobTitle}" has been successfully published across student and university portals!`);
      setActiveSection('manage');
      setCurrentStep(1);
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1 border border-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Recruiter Campaign Creator &amp; Closings
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Full-Time Campus Job Openings &amp; Status Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish verified campus job requirements, track applicant volume, and control application openings/closings.
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
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSection('post')}
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
          onClick={() => setActiveSection('manage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'manage'
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          Manage Postings &amp; Closings ({postedJobs.length})
        </button>
      </div>

      {activeSection === 'manage' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">All Published Job Openings</h2>
              <p className="text-xs text-slate-500">Manage bookings, close applications when capacity is reached, or reopen pipelines.</p>
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

                    <div className="flex items-center gap-3 text-xs text-slate-600 my-2">
                      <span className="font-semibold text-blue-700">{opp.salaryOrStipend}</span>
                      <span>•</span>
                      <span className="text-slate-500">Deadline: {opp.deadline}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {opp.requiredSkills.slice(0, 4).map((sk, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-700">{opp.applicantsCount || 0} Candidates Applied</span>

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
                Step 1: Role Overview & Remuneration
              </h2>

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
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
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
                Step 2: Candidate Qualifications & Skill Matrix
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Experience Level</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eligible Academic Degrees</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
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

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
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
                Step 3: Job Description & Publication Review
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full sm:w-64 p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Summary Preview Box */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <p className="font-bold text-purple-900 text-xs">Ready to Broadcast to 4,850+ Verified Students</p>
                <p className="text-slate-600 text-[11px]">
                  Posting as <strong>TechNova Solutions</strong> • Role: <strong>{jobTitle}</strong> • CTC: <strong>{salary}</strong>.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Publish Job Opening
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )}
</div>
  );
};
