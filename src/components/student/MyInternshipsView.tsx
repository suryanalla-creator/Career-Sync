import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Download,
  Building,
  ExternalLink,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { InternshipRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const MyInternshipsView: React.FC = () => {
  const { triggerConfetti } = useApp();
  const [internships, setInternships] = useState<InternshipRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.students.getInternships()
      .then(data => {
        if (isMounted) {
          setInternships(data || []);
        }
      })
      .catch(err => {
        console.warn('Could not load internships:', err);
        if (isMounted) {
          setInternships([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const completedCount = internships.filter(i => i.status === 'Completed').length;
  const activeCount = internships.filter(i => (i.status as string) === 'In Progress' || i.status === 'Active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            Verified Industrial Experience
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            My Internships &amp; Pre-Placement Records
          </h1>
          <p className="text-xs text-slate-500">
            Track active internship milestones, mentor performance reviews, and verified certificates.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
          {internships.length > 0
            ? `✓ ${completedCount} Completed • ${activeCount} Active`
            : '0 Industrial Records'}
        </span>
      </div>

      {/* Internship Cards or Clean Empty State */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Loading authenticated internship records…
        </div>
      ) : internships.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Internships Recorded</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You do not currently have any active or completed corporate internships logged. As you clear hiring drives and start corporate internships, your progress, mentor reviews, and verified completion certificates will be tracked here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {internships.map((intern) => {
            const isCompleted = intern.status === 'Completed';

            return (
              <div
                key={intern.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <img src={intern.logo} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800 animate-pulse'
                        }`}>
                          {intern.status} Internship
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {intern.startDate} — {intern.endDate}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">{intern.role}</h2>
                      <p className="text-xs font-semibold text-slate-600">{intern.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {intern.certificateIssued && (
                      <button
                        onClick={() => {
                          alert('Downloading verified completion certificate (PDF)...');
                          triggerConfetti();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Certificate
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Mentor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Milestone Progress */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Sprint Milestones Completed</span>
                      <span className="font-extrabold text-blue-600">{intern.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        style={{ width: `${intern.progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isCompleted ? 'All curriculum tasks signed off by technical supervisor.' : 'Current Sprint: Milestone deliverables in review.'}
                    </p>
                  </div>

                  {/* Mentor Details */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Industry Supervisor</span>
                      <p className="text-xs font-bold text-slate-900">{intern.mentor}</p>
                      <p className="text-[11px] text-slate-500">{intern.mentorDesignation}</p>
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Industrial Tasks
                  </h3>
                  <div className="space-y-1.5">
                    {intern.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                          <CheckCircle2 className={`w-4 h-4 ${task.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                          <span className={task.done ? 'line-through text-slate-400' : ''}>{task.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.done ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {task.done ? 'Verified Done' : 'In Progress'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Note */}
                {intern.feedback && (
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Formal Supervisor Evaluation
                    </span>
                    <p className="leading-relaxed text-emerald-950 italic">
                      &quot;{intern.feedback}&quot;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
