import React, { useState } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  ChevronRight,
  MessageSquare,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApplicationsTrackerView: React.FC = () => {
  const { applications, setIsMessagesOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'All' | 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'>('All');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[1]?.id || applications[0]?.id);

  const stagesList = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected'];

  const filteredApps = applications.filter((app) => {
    if (activeTab === 'All') return true;
    return app.currentStage.toLowerCase() === activeTab.toLowerCase();
  });

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            Live Candidate Pipeline
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            My Applications & Offer Tracker
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status updates synced with corporate HR portals and campus placement cells.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600">Active Submissions:</span>
          <span className="text-lg font-black text-blue-600">{applications.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
        {['All', 'Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Applications List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredApps.map((app) => {
            const isSelected = app.id === selectedApp?.id;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <img src={app.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{app.title}</h3>
                      <p className="text-[11px] font-medium text-slate-500">{app.company}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    app.currentStage === 'Interview'
                      ? 'bg-blue-100 text-blue-800 animate-pulse'
                      : app.currentStage === 'Shortlisted'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {app.currentStage}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
                  <span>Applied: {app.appliedDate}</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              No applications currently in {activeTab} stage.
            </div>
          )}
        </div>

        {/* Right: Detailed Stage Timeline Tracker */}
        {selectedApp ? (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedApp.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedApp.title}</h2>
                  <p className="text-xs font-semibold text-slate-600">{selectedApp.company} • {selectedApp.type}</p>
                </div>
              </div>

              <button
                onClick={() => setIsMessagesOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                Message Recruiter
              </button>
            </div>

            {/* Visual Stepper */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recruitment Lifecycle Stepper
              </h3>

              <div className="space-y-4 relative pl-6 border-l-2 border-slate-200 ml-2">
                {selectedApp.stageTimeline.map((st, idx) => {
                  return (
                    <div key={idx} className="relative space-y-1">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                          st.completed
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : st.stage === selectedApp.currentStage
                            ? 'border-blue-600 bg-blue-600 text-white animate-ping'
                            : 'border-slate-300'
                        }`}
                      />

                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          st.completed ? 'text-emerald-800' : st.stage === selectedApp.currentStage ? 'text-blue-700 font-extrabold' : 'text-slate-500'
                        }`}>
                          {st.stage}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{st.date}</span>
                      </div>

                      {st.note && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {st.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recruiter Communication Box */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Clock className="w-4 h-4 text-blue-600" />
                Latest Status Note
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                {selectedApp.notes || 'Your application is under active review by the technical hiring panel.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-12 shadow-xs text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Application Selected</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select an application from the list or explore open jobs and internships to submit an application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
