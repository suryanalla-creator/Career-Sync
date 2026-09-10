import React, { useState } from 'react';
import {
  Users,
  Star,
  Search,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
  Phone
} from 'lucide-react';
import { mockMentors } from '../../data/mockData';
import { Mentor } from '../../types';
import { useApp } from '../../context/AppContext';

export const MentorshipView: React.FC = () => {
  const { setIsMessagesOpen, triggerConfetti, startPhoneCall } = useApp();
  const [mentorsList] = useState<Mentor[]>(mockMentors);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [requestModalMentor, setRequestModalMentor] = useState<Mentor | null>(null);
  const [sessionTopic, setSessionTopic] = useState('');

  const industries = ['All', 'Cloud & Enterprise Tech', 'Enterprise AI & SaaS', 'Human Resources & Talent', 'Consulting & Strategy'];

  const filteredMentors = mentorsList.filter((m) => {
    if (selectedIndustry !== 'All' && m.industry !== selectedIndustry) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchCompany = m.company.toLowerCase().includes(q);
      const matchExpertise = m.expertise.some(e => e.toLowerCase().includes(q));
      if (!matchName && !matchCompany && !matchExpertise) return false;
    }
    return true;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mentorship request successfully dispatched to ${requestModalMentor?.name}! They will confirm via notifications.`);
    setRequestModalMentor(null);
    setSessionTopic('');
    triggerConfetti();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            1-on-1 Industry Mentorship
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Discover Industry Mentors & Guides
          </h1>
          <p className="text-xs text-slate-500">
            Connect with seasoned engineering managers, principal architects, and HR directors for resume reviews and mock interviews.
          </p>
        </div>

        <button
          onClick={() => setIsMessagesOpen(true)}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4 text-blue-600" />
          Active Mentorship Chats
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by mentor name, company, or domain expertise (e.g. System Design, AI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none w-full md:w-auto"
        >
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{mentor.name}</h3>
                    <p className="text-xs font-bold text-blue-700">{mentor.role}</p>
                    <p className="text-[11px] text-slate-500">{mentor.company} • {mentor.experienceYears} Years Exp</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {mentor.rating}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">{mentor.bio}</p>

              {/* Expertise Badges */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Core Mentorship Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.expertise.map((exp, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {mentor.availableSlots}
                </span>
                <span className="text-slate-400 font-medium">
                  {mentor.sessionsConducted} sessions done
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
              <span className="text-xs font-bold text-emerald-600">✓ Free for Apex Students</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startPhoneCall({ name: mentor.name, role: `${mentor.role} @ ${mentor.company}`, avatar: mentor.avatar })}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Direct Phone Call with Mentor"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => setRequestModalMentor(mentor)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Request</span> <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mentorship Request Modal */}
      {requestModalMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <img src={requestModalMentor.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Request Mentorship with {requestModalMentor.name}</h3>
                <p className="text-xs text-slate-500">{requestModalMentor.role} @ {requestModalMentor.company}</p>
              </div>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">What would you like to focus on?</label>
                <select
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Resume Review">Resume & Project Portfolio Polish</option>
                  <option value="System Design">System Design & Technical Architecture Mock</option>
                  <option value="Behavioral Prep">HR & Behavioral Interview Prep</option>
                  <option value="Career Strategy">Career Strategy & Transition Advice</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal note to the mentor</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Introduce yourself, your current year, and specific questions you have..."
                  defaultValue="Hi! I am a pre-final year CSE student preparing for product engineering roles. I would love your feedback on my distributed systems capstone."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRequestModalMentor(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Send Mentorship Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
