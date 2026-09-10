import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  CheckCircle2,
  BarChart3,
  GitFork,
  Briefcase,
  GraduationCap,
  BookOpen,
  Sparkles,
  FileCheck2,
  Award,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Handshake,
  Search,
  Building,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProfileCompletion } from '../../utils/skillMatcher';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    role,
    activeTab,
    setActiveTab,
    applications,
    notifications,
    studentProfile,
    setIsOnboardingGuideOpen
  } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const profileCompletion = studentProfile ? calculateProfileCompletion(studentProfile) : 0;

  const pendingAppsCount = applications.filter(a => a.currentStage !== 'Selected' && a.currentStage !== 'Rejected').length;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      badge: profileCompletion < 100 ? `${profileCompletion}%` : undefined
    },
    { id: 'portfolio', label: 'Digital Portfolio', icon: ShieldCheck },
    { id: 'career-path', label: 'Career Roadmap', icon: GitFork },
    { id: 'skill-profile', label: 'Skill Profile & Assessment', icon: Award, highlight: true },
    { id: 'jobs-internships', label: 'Job Opportunities & Internships', icon: Briefcase, highlight: true },
    { id: 'online-courses', label: 'Online Courses', icon: BookOpen, highlight: true },
    { id: 'recommended', label: 'AI Recommendations', icon: Sparkles },
    { id: 'applications', label: 'Applications', icon: FileCheck2, badge: pendingAppsCount > 0 ? `${pendingAppsCount}` : undefined },
    { id: 'events', label: 'Events & Fairs', icon: Calendar },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const industryNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post a Job', icon: Briefcase, highlight: true },
    { id: 'post-internship', label: 'Post Internship', icon: GraduationCap },
    { id: 'candidate-search', label: 'Candidate Search', icon: Search, badge: 'AI Match' },
    { id: 'industry-programs', label: 'Training & Workshops', icon: BookOpen },
    { id: 'collaborations', label: 'University MoUs', icon: Handshake },
    { id: 'settings', label: 'Company Settings', icon: Settings }
  ];

  const institutionNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Institution Overview', icon: LayoutDashboard },
    { id: 'my-students', label: 'My Students', icon: GraduationCap, highlight: true },
    { id: 'students-mgmt', label: 'Students Directory', icon: Users, badge: '4,850' },
    { id: 'skill-gaps', label: 'Skill Gap Analytics', icon: BarChart3 },
    { id: 'placements', label: 'Placement Drives', icon: TrendingUp, badge: '84%' },
    { id: 'collab-hub', label: 'Industry Collaboration', icon: Handshake, badge: '126' },
    { id: 'settings', label: 'Admin Settings', icon: Settings }
  ];

  const getNavItems = () => {
    switch (role) {
      case 'student': return studentNavItems;
      case 'industry': return industryNavItems;
      case 'institution': return institutionNavItems;
      default: return [];
    }
  };

  const navItems = getNavItems();

  if (role === 'landing') return null;

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-slate-900 shadow-sm z-20 hover:scale-110 transition-all"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Role Navigation Items List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {role === 'student' && 'Student Portal'}
            {role === 'industry' && 'Corporate Suite'}
            {role === 'institution' && 'Institutional Admin'}
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'skill-profile' && activeTab === 'skill-assessment');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'Verified' || item.badge === 'AI Match'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Profile Summary Card */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          {role === 'student' && (
            <div className={`p-3 rounded-xl border shadow-xs transition-all ${
              profileCompletion < 100 ? 'bg-amber-50/40 border-amber-200' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  {profileCompletion < 100 && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                  Profile Strength
                </span>
                <span className={`font-bold ${profileCompletion < 100 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    profileCompletion < 100
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">
                {profileCompletion < 100
                  ? '⚠️ Profile incomplete. Add missing details to unlock placement drives.'
                  : '✓ 100% complete! Fully optimized for campus placement drives.'}
              </p>
              {profileCompletion < 100 && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="mt-2 w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Complete Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {role === 'institution' && (
            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-[11px]">
                <Building className="w-4 h-4 text-blue-600" />
                Apex Institute
              </div>
              <p className="text-[10px] text-blue-600 mt-0.5">
                NAAC A++ • Tier-1 Institutional Member
              </p>
            </div>
          )}

          {role === 'industry' && (
            <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100 text-xs">
              <p className="font-bold text-purple-900 text-[11px]">Active Hiring Sprint</p>
              <p className="text-[10px] text-purple-700 mt-0.5">
                3 campus placement drives currently open.
              </p>
            </div>
          )}
          {/* How to Use Quick Guide Trigger */}
          <button
            onClick={() => setIsOnboardingGuideOpen(true)}
            className="w-full py-2 px-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>How to Use Guide</span>
          </button>
        </div>
      )}
    </aside>
  );
};
