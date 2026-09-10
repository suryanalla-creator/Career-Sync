import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Briefcase,
  GraduationCap,
  BookOpen,
  Users,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    setActiveTab
  } = useApp();

  if (!isNotificationsOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Applications': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'Jobs': return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'Internships': return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'Learning': return <BookOpen className="w-4 h-4 text-amber-600" />;
      case 'Mentorship': return <Users className="w-4 h-4 text-indigo-600" />;
      default: return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Notifications</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.isRead).length} new
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.actionUrl) {
                  setActiveTab(notif.actionUrl);
                  setIsNotificationsOpen(false);
                }
              }}
              className={`p-3.5 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${
                notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
              }`}
            >
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs flex-shrink-0 mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">{notif.timestamp}</span>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 stroke-1" />
              <p className="text-xs">No notifications right now</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
