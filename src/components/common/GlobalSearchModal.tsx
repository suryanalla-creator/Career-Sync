import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Briefcase,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockOpportunities, mockLearningPrograms, mockMentors, mockEvents, mockCandidates } from '../../data/mockData';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveTab, setSelectedOpportunity } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'jobs' | 'internships' | 'courses' | 'mentors' | 'events'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const lowerQuery = query.toLowerCase().trim();

  // Filter datasets
  const filteredJobs = mockOpportunities.filter(
    o => o.type === 'job' && (o.title.toLowerCase().includes(lowerQuery) || o.organization.toLowerCase().includes(lowerQuery) || o.requiredSkills.some(s => s.toLowerCase().includes(lowerQuery)))
  );

  const filteredInternships = mockOpportunities.filter(
    o => o.type === 'internship' && (o.title.toLowerCase().includes(lowerQuery) || o.organization.toLowerCase().includes(lowerQuery) || o.requiredSkills.some(s => s.toLowerCase().includes(lowerQuery)))
  );

  const filteredCourses = mockLearningPrograms.filter(
    c => c.title.toLowerCase().includes(lowerQuery) || c.provider.toLowerCase().includes(lowerQuery) || c.skillsGained.some(s => s.toLowerCase().includes(lowerQuery))
  );

  const filteredMentors = mockMentors.filter(
    m => m.name.toLowerCase().includes(lowerQuery) || m.company.toLowerCase().includes(lowerQuery) || m.expertise.some(e => e.toLowerCase().includes(lowerQuery))
  );

  const filteredEvents = mockEvents.filter(
    e => e.title.toLowerCase().includes(lowerQuery) || e.organizer.toLowerCase().includes(lowerQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, internships, courses, mentors, events, skills..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 overflow-x-auto text-xs font-semibold bg-white">
          {(['all', 'jobs', 'internships', 'courses', 'mentors', 'events'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full capitalize transition-colors flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Jobs */}
          {(activeCategory === 'all' || activeCategory === 'jobs') && filteredJobs.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Jobs ({filteredJobs.length})
              </p>
              <div className="space-y-1.5">
                {filteredJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedOpportunity(job);
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={job.logo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{job.title}</p>
                        <p className="text-[11px] text-slate-500">{job.organization} • {job.location}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{job.matchPercentage}% match</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internships */}
          {(activeCategory === 'all' || activeCategory === 'internships') && filteredInternships.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Internships ({filteredInternships.length})
              </p>
              <div className="space-y-1.5">
                {filteredInternships.slice(0, 3).map((intern) => (
                  <div
                    key={intern.id}
                    onClick={() => {
                      setSelectedOpportunity(intern);
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={intern.logo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{intern.title}</p>
                        <p className="text-[11px] text-slate-500">{intern.organization} • {intern.salaryOrStipend}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{intern.matchPercentage}% match</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {(activeCategory === 'all' || activeCategory === 'courses') && filteredCourses.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Online Courses ({filteredCourses.length})
              </p>
              <div className="space-y-1.5">
                {filteredCourses.slice(0, 2).map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setActiveTab('online-courses');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={course.logo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{course.title}</p>
                        <p className="text-[11px] text-slate-500">{course.provider} • {course.duration}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-blue-600">Explore</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentors */}
          {(activeCategory === 'all' || activeCategory === 'mentors') && filteredMentors.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Industry Mentors ({filteredMentors.length})
              </p>
              <div className="space-y-1.5">
                {filteredMentors.slice(0, 2).map((mentor) => (
                  <div
                    key={mentor.id}
                    onClick={() => {
                      setActiveTab('mentorship');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={mentor.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{mentor.name}</p>
                        <p className="text-[11px] text-slate-500">{mentor.role} @ {mentor.company}</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-500 font-bold">★ {mentor.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredJobs.length === 0 &&
            filteredInternships.length === 0 &&
            filteredCourses.length === 0 &&
            filteredMentors.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm font-semibold text-slate-700">No matching results found</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for &quot;Python&quot;, &quot;AWS&quot;, &quot;Internship&quot;, or &quot;TechNova&quot;</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
