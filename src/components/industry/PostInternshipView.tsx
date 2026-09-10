import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { api } from '../../services/api';

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

  // Form states
  const [title, setTitle] = useState('Full Stack Engineering Intern (Summer 2026)');
  const [domain, setDomain] = useState('Software Engineering & Cloud');
  const [duration, setDuration] = useState('6 Months (Jan - June 2026)');
  const [stipend, setStipend] = useState('₹30,000 / month');
  const [location, setLocation] = useState('Hyderabad / Hybrid');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [responsibilities, setResponsibilities] = useState('Build interactive client dashboard widgets, optimize GraphQL resolvers, write automated end-to-end browser tests.');
  const [eligibility, setEligibility] = useState('B.Tech 3rd or 4th year with minimum 7.5 CGPA and active Git repository.');
  const [deadline, setDeadline] = useState('2026-10-15');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter for manage section
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'archived'>('all');

  const postedInternships = opportunities.filter((op) => op.type === 'internship');
  const filteredInternships = postedInternships.filter((op) => {
    if (statusFilter === 'active') return op.status === 'Active' && !op.isClosed;
    if (statusFilter === 'closed') return op.status === 'Closed' || op.isClosed;
    if (statusFilter === 'archived') return op.status === 'Archived';
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
        description: `Exciting ${domain} internship opportunity to build hands-on systems with production impact.`,
        requiredSkills: skills.split(',').map((s) => s.trim()),
        eligibility,
        responsibilities: responsibilities.split('.').map((s) => s.trim()).filter(Boolean)
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
            University Pre-Placement Program
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Internship Postings & Closing Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish new internship drives or manage active bookings and closing status in real-time.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSection('post')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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
            onClick={() => setActiveSection('manage')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'manage'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Manage Postings ({postedInternships.length})
          </button>
        </div>
      </div>

      {activeSection === 'post' ? (
        /* Form Section */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Internship Title</label>
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
                <label className="block font-bold text-slate-700 mb-1">Duration</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
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
                              Live & Accepting
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
                        </div>

                        {isClosed && internship.closedReason && (
                          <div className="text-xs text-amber-700 bg-amber-100/60 px-3 py-1 rounded-lg inline-block border border-amber-200">
                            <strong>Closing Notice:</strong> {internship.closedReason}
                          </div>
                        )}
                      </div>

                      {/* Right Publisher Control Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedOpportunity(internship)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
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
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs disabled:opacity-50"
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
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs disabled:opacity-50"
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
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all disabled:opacity-50"
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
    </div>
  );
};
