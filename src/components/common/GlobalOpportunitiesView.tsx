import React, { useState } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  GraduationCap,
  BookOpen,
  Handshake,
  Users,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from './OpportunityCard';
import { Opportunity } from '../../types';

export const GlobalOpportunitiesView: React.FC = () => {
  const { opportunities, setSelectedOpportunity, setPageView } = useApp();

  const [activeTab, setActiveTab] = useState<
    'all' | 'jobs' | 'internships' | 'apprenticeships' | 'projects' | 'training' | 'certifications' | 'workshops' | 'research' | 'consultancy' | 'mentorship' | 'events'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'All' | 'Remote' | 'Hybrid' | 'On-site'>('All');
  const [minMatch, setMinMatch] = useState(0);

  const tabs = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'internships', label: 'Internships' },
    { id: 'apprenticeships', label: 'Apprenticeships' },
    { id: 'projects', label: 'Industry Projects' },
    { id: 'training', label: 'Training & Bootcamps' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'research', label: 'Research Collab' },
    { id: 'consultancy', label: 'Consultancy' },
    { id: 'mentorship', label: 'Mentorship' },
    { id: 'events', label: 'Events' }
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    // Tab filter
    if (activeTab === 'jobs' && opp.type !== 'job') return false;
    if (activeTab === 'internships' && opp.type !== 'internship') return false;
    if (activeTab === 'research' && opp.type !== 'research') return false;
    if (activeTab === 'consultancy' && opp.type !== 'consultancy') return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchOrg = opp.organization.toLowerCase().includes(q);
      const matchSkills = opp.requiredSkills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchSkills) return false;
    }

    // Work Mode
    if (selectedMode !== 'All' && opp.workMode !== selectedMode) return false;

    // Match percentage
    if (opp.matchPercentage < minMatch) return false;

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPageView('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CAREER SYNC Home</span>
        </button>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
          Public Directory • Guest Browsing
        </span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            Unified Opportunity Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore 1,200+ Verified Opportunities
          </h1>
          <p className="text-sm text-blue-100/80 mt-2 leading-relaxed">
            Find jobs, corporate internships, capstone projects, research grants, and industry hackathons curated from leading tech companies and partner universities.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, company, skill (e.g. Python, TechNova, AWS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value={0}>All Match Scores</option>
            <option value={80}>80%+ AI Match</option>
            <option value={90}>90%+ AI Match</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onViewDetails={(selected) => setSelectedOpportunity(selected)}
          />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No opportunities match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search keywords or match score threshold.</p>
        </div>
      )}
    </div>
  );
};
