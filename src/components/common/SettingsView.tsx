import React, { useState, useEffect } from 'react';
import {
  Shield,
  Bell,
  Globe,
  CheckCircle2,
  Mail,
  Copy,
  Check,
  Key,
  Smartphone,
  AlertCircle,
  Building,
  GraduationCap,
  Save,
  Laptop,
  LogOut,
  Sparkles,
  RotateCcw,
  X,
  UserCheck,
  Briefcase,
  Building2,
  Lock,
  Eye,
  FileText,
  User,
  Award,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SettingsViewProps {
  initialSubTab?: 'account' | 'security' | 'notifications' | 'privacy';
}

const getDefaultEmailForRole = (
  role: string,
  indEmail: string,
  instEmail: string,
  studentEmail?: string
) => {
  if (role === 'industry') return indEmail;
  if (role === 'institution') return instEmail;
  return studentEmail || 'student@careersync.com';
};

const getSessionsForRole = (role: string) => {
  if (role === 'industry') {
    return [
      { id: 'ind-s1', device: 'TechNova Workstation (Chrome on Windows 11)', location: 'Hyderabad, India', active: true, ip: '182.74.89.4', time: 'Active now' },
      { id: 'ind-s2', device: 'Recruiter MacBook Air (Safari on macOS)', location: 'Hyderabad, India', active: false, ip: '182.74.89.12', time: '3 hours ago' }
    ];
  }
  if (role === 'institution') {
    return [
      { id: 'inst-s1', device: 'Dean Office Terminal (Chrome on macOS)', location: 'Bangalore, India', active: true, ip: '14.139.122.5', time: 'Active now' },
      { id: 'inst-s2', device: 'Placement Cell Admin PC (Edge on Windows 11)', location: 'Bangalore, India', active: false, ip: '14.139.122.9', time: 'Yesterday' }
    ];
  }
  return [
    { id: 's1', device: 'Chrome on Windows 11', location: 'Bangalore, India', active: true, ip: '103.21.244.12', time: 'Active now' },
    { id: 's2', device: 'Safari on iPhone 15 Pro', location: 'Bangalore, India', active: false, ip: '103.21.244.18', time: '2 hours ago' }
  ];
};

export const SettingsView: React.FC<SettingsViewProps> = ({ initialSubTab = 'account' }) => {
  const { role, studentProfile, setStudentProfile, triggerConfetti } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'account' | 'security' | 'notifications' | 'privacy'>(initialSubTab);

  // Global Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (triggerConfetti) triggerConfetti();
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // ──────────────────────────────────────────────────────────────────────────
  // Common Display & Regional Preferences State
  // ──────────────────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST - UTC+05:30)');
  const [copiedId, setCopiedId] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // Role-Specific Profile States
  // ──────────────────────────────────────────────────────────────────────────
  // 1. Student State (uses studentProfile from context)
  const [studentForm, setStudentForm] = useState({
    name: studentProfile?.name || 'Student',
    email: studentProfile?.email || 'student@careersync.com',
    phone: studentProfile?.phone || '+91 98765 43210',
    studentId: studentProfile?.studentId || '#8492019482',
    college: studentProfile?.college || 'Apex Institute of Technology, Bangalore',
    department: studentProfile?.department || 'Computer Science & Engineering'
  });

  useEffect(() => {
    if (studentProfile) {
      setStudentForm({
        name: studentProfile.name || 'Student',
        email: studentProfile.email || 'student@careersync.com',
        phone: studentProfile.phone || '+91 98765 43210',
        studentId: studentProfile.studentId || '#8492019482',
        college: studentProfile.college || 'Apex Institute of Technology, Bangalore',
        department: studentProfile.department || 'Computer Science & Engineering'
      });
    }
  }, [studentProfile]);

  // 2. Industry Profile State (persisted in localStorage)
  const [industryData, setIndustryData] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('career_sync_industry_settings') : null;
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      companyName: 'TechNova Solutions Ltd.',
      recruiterName: 'Vikramaditya Sen',
      designation: 'Lead Technical Recruiter & Campus Relations',
      email: 'industry@careersync.com',
      phone: '+91 98765 99887',
      corporateId: '#CORP-IND-92841',
      headquarters: 'HITEC City, Hyderabad, Telangana',
      sector: 'Information Technology & Enterprise Cloud',
      companySize: '500 - 1,000 Employees',
      website: 'https://technova.io'
    };
  });

  // 3. Institution Profile State (persisted in localStorage)
  const [institutionData, setInstitutionData] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('career_sync_institution_settings') : null;
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      institutionName: 'Apex Institute of Technology, Bangalore',
      adminName: 'Dr. Ramesh Sharma',
      designation: 'Dean of Placements & Academic Affairs',
      email: 'institution@careersync.com',
      phone: '+91 80 2852 0100',
      aisheCode: 'C-12849',
      accreditation: 'NAAC A++ Accredited • NBA Tier-1 Institutional Member',
      campusLocation: 'Electronic City Phase 1, Bangalore, Karnataka',
      website: 'https://apextech.edu.in'
    };
  });

  // Copy Identifier Handler
  const handleCopyIdentifier = () => {
    let idToCopy = '';
    if (role === 'industry') idToCopy = industryData.corporateId;
    else if (role === 'institution') idToCopy = institutionData.aisheCode;
    else idToCopy = studentProfile?.studentId || '#8492019482';

    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Account submit handler per role
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'industry') {
      localStorage.setItem('career_sync_industry_settings', JSON.stringify(industryData));
      showToast('Corporate recruiter credentials and company profile updated!');
    } else if (role === 'institution') {
      localStorage.setItem('career_sync_institution_settings', JSON.stringify(institutionData));
      showToast('Institutional administrative credentials and campus details saved!');
    } else {
      if (setStudentProfile) {
        setStudentProfile(prev => ({
          ...prev,
          name: studentForm.name,
          phone: studentForm.phone,
          department: studentForm.department,
          college: studentForm.college
        }));
      }
      showToast('Student credentials and regional preferences saved successfully!');
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Security & Authentication State
  // ──────────────────────────────────────────────────────────────────────────
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Forgot password flow
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState(() =>
    getDefaultEmailForRole(role, industryData.email, institutionData.email, studentProfile?.email)
  );
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetSent(true);
      showToast(`Password reset link dispatched to ${resetEmail}`);
    }, 1200);
  };

  const [sessions, setSessions] = useState(() => getSessionsForRole(role));

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(true);
    showToast('Your security credentials have been updated successfully!');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    showToast(nextState ? 'Two-Factor Authentication (2FA) is now enabled!' : 'Two-Factor Authentication has been disabled.');
  };

  const handleRevokeOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.active));
    showToast('All other device sessions have been revoked.');
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Notifications State
  // ──────────────────────────────────────────────────────────────────────────
  // Student Notifications
  const [notifJobAlerts, setNotifJobAlerts] = useState(true);
  const [notifInterviewInvites, setNotifInterviewInvites] = useState(true);
  const [notifAssessmentReminders, setNotifAssessmentReminders] = useState(true);
  const [notifPlacementDrives, setNotifPlacementDrives] = useState(true);

  // Industry Notifications
  const [indCandidateMatch, setIndCandidateMatch] = useState(true);
  const [indAppSubmissions, setIndAppSubmissions] = useState(true);
  const [indInterviewConfirm, setIndInterviewConfirm] = useState(true);
  const [indDriveMilestones, setIndDriveMilestones] = useState(true);

  // Institution Notifications
  const [instMouAlerts, setInstMouAlerts] = useState(true);
  const [instDriveMilestones, setInstDriveMilestones] = useState(true);
  const [instCohortCert, setInstCohortCert] = useState(true);
  const [instAuditReports, setInstAuditReports] = useState(true);

  const [emailDigestFrequency, setEmailDigestFrequency] = useState('Instant Alerts (Real-time)');

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'industry') {
      showToast('Candidate match alerts and recruitment dispatch preferences saved!');
    } else if (role === 'institution') {
      showToast('Placement drive and institutional notification preferences saved!');
    } else {
      showToast('Notification rules and dispatch preferences saved!');
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Privacy, Branding & Governance State
  // ──────────────────────────────────────────────────────────────────────────
  // Student Privacy
  const [privacyRecruiterSearch, setPrivacyRecruiterSearch] = useState(true);
  const [privacyScoreVisible, setPrivacyScoreVisible] = useState(true);
  const [privacyPublicPortfolio, setPrivacyPublicPortfolio] = useState(true);
  const [privacyLeaderboard, setPrivacyLeaderboard] = useState(true);

  // Industry Branding & Visibility
  const [indVerifiedBadge, setIndVerifiedBadge] = useState(true);
  const [indPublicProfile, setIndPublicProfile] = useState(true);
  const [indCampusDirectory, setIndCampusDirectory] = useState(true);
  const [indAiScreening, setIndAiScreening] = useState(true);

  // Institution Governance & Privacy
  const [instPiiMasking, setInstPiiMasking] = useState(true);
  const [instPublicDirectory, setInstPublicDirectory] = useState(true);
  const [instStrictRecruiter, setInstStrictRecruiter] = useState(true);
  const [instCrossAnalytics, setInstCrossAnalytics] = useState(true);

  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'industry') {
      showToast('Employer branding and candidate pre-screening rules saved!');
    } else if (role === 'institution') {
      showToast('Student data governance and accreditation compliance policies saved!');
    } else {
      showToast('Recruiter visibility and privacy settings saved!');
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Dynamic Tab Definitions & Role Metadata
  // ──────────────────────────────────────────────────────────────────────────
  const getTabs = () => {
    if (role === 'industry') {
      return [
        { id: 'account' as const, label: 'Company Profile', icon: Briefcase, desc: 'Corporate recruiter & org credentials' },
        { id: 'security' as const, label: 'Security & ATS Access', icon: Shield, desc: 'Recruiter 2FA & authorized devices' },
        { id: 'notifications' as const, label: 'Hiring & Candidate Alerts', icon: Bell, desc: 'Match alerts & applicant dispatches' },
        { id: 'privacy' as const, label: 'Employer Branding & ATS', icon: Globe, desc: 'Public company visibility & screening' }
      ];
    }
    if (role === 'institution') {
      return [
        { id: 'account' as const, label: 'Institution Admin', icon: Building2, desc: 'University credentials & AISHE code' },
        { id: 'security' as const, label: 'Security & Compliance', icon: Shield, desc: 'Admin 2FA & FERPA audit sessions' },
        { id: 'notifications' as const, label: 'Placement & MoU Alerts', icon: Bell, desc: 'Drive milestones & MoU notices' },
        { id: 'privacy' as const, label: 'Data Governance', icon: Lock, desc: 'Student PII masking & directory rules' }
      ];
    }
    return [
      { id: 'account' as const, label: 'Account Details', icon: UserCheck, desc: 'Name, email, college & ID' },
      { id: 'security' as const, label: 'Security & 2FA', icon: Shield, desc: 'Passwords & authentication' },
      { id: 'notifications' as const, label: 'Notifications', icon: Bell, desc: 'Alerts & email preferences' },
      { id: 'privacy' as const, label: 'Privacy & Visibility', icon: Globe, desc: 'Employer discovery permissions' }
    ];
  };

  const tabs = getTabs();

  // Role-adaptive theme colors
  const roleColor = role === 'industry' ? 'purple' : role === 'institution' ? 'amber' : 'blue';
  const roleColorActiveBg = role === 'industry' ? 'bg-purple-600' : role === 'institution' ? 'bg-amber-600' : 'bg-blue-600';
  const roleColorButtonHover = role === 'industry' ? 'hover:bg-purple-700' : role === 'institution' ? 'hover:bg-amber-700' : 'hover:bg-blue-700';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl text-xs font-bold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Fully Adaptive to Active Role */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {role === 'industry' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1 border border-purple-100">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              Corporate Recruiter Center
            </div>
          ) : role === 'institution' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-1 border border-amber-100">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              Institutional Admin Center
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Student Platform Control Center
            </div>
          )}

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {role === 'industry' ? 'Company & ATS Settings' : role === 'institution' ? 'Institutional & Accreditation Settings' : 'Settings'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {role === 'industry'
              ? 'Configure corporate recruiter credentials, company profile, candidate match alerts, and enterprise security.'
              : role === 'institution'
              ? 'Manage university administrative credentials, AISHE verification, student data compliance, and placement drive alerts.'
              : 'Configure your institutional account credentials, 2FA security, notification rules, and employer visibility.'}
          </p>
        </div>

        {/* Quick Identifier Tag (Role Specific) */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              {role === 'industry' ? 'Corporate Recruiter ID' : role === 'institution' ? 'Verified AISHE Code' : 'Verified Student ID'}
            </span>
            <span className="font-mono font-bold text-xs text-slate-800 tracking-wide">
              {role === 'industry'
                ? industryData.corporateId
                : role === 'institution'
                ? institutionData.aisheCode
                : studentProfile?.studentId || '#8492019482'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyIdentifier}
            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1"
            title="Copy Identifier"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedId ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar Tabs (4 cols) */}
        <div className="md:col-span-4 bg-white p-2.5 rounded-3xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Configuration Tabs
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  isActive
                    ? `${roleColorActiveBg} text-white shadow-sm`
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold block truncate">{tab.label}</span>
                  <span className={`text-[10px] block truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {tab.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel (8 cols) */}
        <div className="md:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs">
          {/* ──────────────────────────────────────────────────────────────────
              TAB 1: ACCOUNT CREDENTIALS & PROFILE
              ────────────────────────────────────────────────────────────────── */}
          {activeSubTab === 'account' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">
                  {role === 'industry'
                    ? 'Corporate Recruiter & Company Profile'
                    : role === 'institution'
                    ? 'Institutional Administrator & Campus Profile'
                    : 'Institutional Account & Preferences'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {role === 'industry'
                    ? 'Manage your corporate organization identity and hiring lead credentials.'
                    : role === 'institution'
                    ? 'University accreditation, AISHE verification, and dean credentials.'
                    : 'Institutional credentials and regional display preferences.'}
                </p>
              </div>

              {/* ROLE-SPECIFIC ACCOUNT FORM */}
              {role === 'industry' ? (
                /* INDUSTRY ACCOUNT FORM */
                <form onSubmit={handleAccountSubmit} className="space-y-4 text-xs">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-600" /> Enterprise Organization
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Company / Organization Name</label>
                        <input
                          type="text"
                          value={industryData.companyName}
                          onChange={(e) => setIndustryData({ ...industryData, companyName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Corporate Sector / Industry</label>
                        <input
                          type="text"
                          value={industryData.sector}
                          onChange={(e) => setIndustryData({ ...industryData, sector: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Company Size</label>
                        <select
                          value={industryData.companySize}
                          onChange={(e) => setIndustryData({ ...industryData, companySize: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        >
                          <option>1 - 50 Employees (Seed/Early)</option>
                          <option>51 - 200 Employees (Growth)</option>
                          <option>500 - 1,000 Employees</option>
                          <option>1,000 - 5,000 Employees</option>
                          <option>10,000+ Employees (Global Enterprise)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Headquarters Location</label>
                        <input
                          type="text"
                          value={industryData.headquarters}
                          onChange={(e) => setIndustryData({ ...industryData, headquarters: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-600" /> Authorized Recruiter Credentials
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Lead Recruiter Name</label>
                        <input
                          type="text"
                          value={industryData.recruiterName}
                          onChange={(e) => setIndustryData({ ...industryData, recruiterName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Corporate Email Address</label>
                        <input
                          type="email"
                          value={industryData.email}
                          onChange={(e) => setIndustryData({ ...industryData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          value={industryData.phone}
                          onChange={(e) => setIndustryData({ ...industryData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Corporate ATS Recruiter ID</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={industryData.corporateId}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-mono font-bold cursor-not-allowed"
                          />
                          <button
                            type="button"
                            onClick={handleCopyIdentifier}
                            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Regional Settings */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-purple-600" /> Regional &amp; Display
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Portal Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        >
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Hindi (हिन्दी)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Hiring Timezone</label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        >
                          <option>Asia/Kolkata (IST - UTC+05:30)</option>
                          <option>America/New_York (EST - UTC-05:00)</option>
                          <option>Europe/London (GMT - UTC+00:00)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Company Profile
                    </button>
                  </div>
                </form>
              ) : role === 'institution' ? (
                /* INSTITUTION ACCOUNT FORM */
                <form onSubmit={handleAccountSubmit} className="space-y-4 text-xs">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" /> College &amp; University Credentials
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Institution Name</label>
                        <input
                          type="text"
                          value={institutionData.institutionName}
                          onChange={(e) => setInstitutionData({ ...institutionData, institutionName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Accreditation Standing</label>
                        <input
                          type="text"
                          value={institutionData.accreditation}
                          onChange={(e) => setInstitutionData({ ...institutionData, accreditation: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">National AISHE Code</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={institutionData.aisheCode}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-mono font-bold cursor-not-allowed"
                          />
                          <button
                            type="button"
                            onClick={handleCopyIdentifier}
                            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Campus Location</label>
                        <input
                          type="text"
                          value={institutionData.campusLocation}
                          onChange={(e) => setInstitutionData({ ...institutionData, campusLocation: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-600" /> Dean / Placement Directorate
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Admin Officer / Dean Name</label>
                        <input
                          type="text"
                          value={institutionData.adminName}
                          onChange={(e) => setInstitutionData({ ...institutionData, adminName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Official Institutional Email</label>
                        <input
                          type="email"
                          value={institutionData.email}
                          onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Placement Cell Phone</label>
                        <input
                          type="tel"
                          value={institutionData.phone}
                          onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Designation &amp; Role</label>
                        <input
                          type="text"
                          value={institutionData.designation}
                          onChange={(e) => setInstitutionData({ ...institutionData, designation: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Regional Preferences */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-600" /> Regional &amp; Display
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Portal Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        >
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Hindi (हिन्दी)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Academic Calendar Timezone</label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        >
                          <option>Asia/Kolkata (IST - UTC+05:30)</option>
                          <option>America/New_York (EST - UTC-05:00)</option>
                          <option>Europe/London (GMT - UTC+00:00)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Institutional Settings
                    </button>
                  </div>
                </form>
              ) : (
                /* STUDENT ACCOUNT FORM */
                <div className="space-y-4 text-xs">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-600" /> Student Credentials
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Legal Name</span>
                        <p className="font-bold text-slate-900 text-sm">{studentProfile?.name || 'Student'}</p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Primary Email</span>
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {studentProfile?.email || 'student@careersync.com'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Phone</span>
                        <p className="font-bold text-slate-900 text-sm">{studentProfile?.phone || '+91 98765 43210'}</p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Institutional Student ID</span>
                          <p className="font-mono font-bold text-slate-900 text-sm">{studentProfile?.studentId || '#8492019482'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyIdentifier}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{copiedId ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Enrolled College / University</span>
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400" />
                          {studentProfile?.college || 'Apex Institute of Technology, Bangalore'}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Academic Department</span>
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-slate-400" />
                          {studentProfile?.department || 'Computer Science & Engineering'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Editable Regional & Display Preferences */}
                  <form onSubmit={handleAccountSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" /> Regional &amp; Display Preferences
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Portal Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        >
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Hindi (हिन्दी)</option>
                          <option>Spanish (Español)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Timezone</label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-semibold"
                        >
                          <option>Asia/Kolkata (IST - UTC+05:30)</option>
                          <option>America/New_York (EST - UTC-05:00)</option>
                          <option>America/Los_Angeles (PST - UTC-08:00)</option>
                          <option>Europe/London (GMT - UTC+00:00)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" /> Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 2: SECURITY & AUTHENTICATION (Role Adaptive)
              ────────────────────────────────────────────────────────────────── */}
          {activeSubTab === 'security' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">
                  {role === 'industry'
                    ? 'Recruiter Security & ATS Access Control'
                    : role === 'institution'
                    ? 'Administrative Security & Data Compliance'
                    : 'Security & Authentication'}
                </h2>
                <p className="text-slate-500 mt-0.5">
                  {role === 'industry'
                    ? 'Protect corporate candidate pipelines with multi-factor authentication and session oversight.'
                    : role === 'institution'
                    ? 'Ensure FERPA/DPDP compliant access to student placement records and institutional exports.'
                    : 'Protect your portal credentials with multi-factor authentication and session oversight.'}
                </p>
              </div>

              {/* 2FA Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className={`w-4 h-4 ${role === 'industry' ? 'text-purple-600' : role === 'institution' ? 'text-amber-600' : 'text-blue-600'}`} />
                    <span className="font-bold text-slate-900 text-sm">
                      {role === 'industry'
                        ? 'Recruiter Two-Factor Authentication (2FA)'
                        : role === 'institution'
                        ? 'Institutional Admin Multi-Factor Auth (2FA)'
                        : 'Two-Factor Authentication (2FA)'}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}>
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {role === 'industry'
                      ? 'Mandatory 6-digit TOTP code required to unlock student contact details and export candidate resumes.'
                      : role === 'institution'
                      ? 'Enforces hardware security key or authenticator app for bulk student directory and NIRF exports.'
                      : 'Require an authenticator app (Google Authenticator / Authy) on new logins.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto ${
                    twoFactorEnabled
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  {twoFactorEnabled ? 'Turn Off 2FA' : 'Enable 2FA'}
                </button>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-3 p-5 rounded-2xl border border-slate-200 bg-white">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-slate-600" /> Change Security Password
                </h3>

                {passwordError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Password successfully updated!</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetSent(false);
                        setResetEmail(getDefaultEmailForRole(role, industryData.email, institutionData.email, studentProfile?.email));
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>

              {/* Forgot Password Inline Panel */}
              {showForgotPassword && (
                <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/60 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">Reset Your Password</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                      className="p-1 rounded-lg hover:bg-blue-100 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {resetSent ? (
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-800 text-xs">Reset link sent!</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          A password reset link has been sent to <strong>{resetEmail}</strong>. Check your inbox and spam folder.
                        </p>
                        <button
                          type="button"
                          onClick={() => setResetSent(false)}
                          className="text-[11px] text-emerald-600 font-bold hover:underline mt-1.5 cursor-pointer"
                        >
                          Send again to a different email
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPasswordReset} className="space-y-3">
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Enter the email associated with your Career Sync {role === 'industry' ? 'corporate recruiter' : role === 'institution' ? 'institutional admin' : 'student'} account.
                      </p>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              required
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={resetLoading}
                            className={`px-4 py-2 ${roleColorActiveBg} ${roleColorButtonHover} disabled:opacity-60 text-white rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5`}
                          >
                            {resetLoading ? (
                              <>
                                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Sending...
                              </>
                            ) : (
                              <><Mail className="w-3.5 h-3.5" /> Send Reset Link</>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Active Sessions */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {role === 'industry' ? 'Authorized Recruiter Sessions' : role === 'institution' ? 'Institutional Admin Sessions' : 'Active Device Sessions'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {role === 'industry'
                        ? 'Workstations authorized to search candidates and conduct interviews.'
                        : role === 'institution'
                        ? 'Administrative terminals authorized for college placement records.'
                        : 'Devices currently authorized with your Career Sync session.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRevokeOtherSessions}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Revoke Others
                  </button>
                </div>

                <div className="space-y-2">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Laptop className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-bold text-slate-800">{sess.device}</p>
                          <p className="text-[10px] text-slate-400">{sess.location} • {sess.ip}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sess.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {sess.active ? 'This Device' : sess.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 3: NOTIFICATIONS PREFERENCES (Role Adaptive)
              ────────────────────────────────────────────────────────────────── */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">
                  {role === 'industry'
                    ? 'Recruitment & Candidate Alert Preferences'
                    : role === 'institution'
                    ? 'Placement Drive & Campus Alerts'
                    : 'Notification Preferences'}
                </h2>
                <p className="text-slate-500 mt-0.5">
                  {role === 'industry'
                    ? 'Configure instant alerts when top talent applies or reaches 90%+ match score.'
                    : role === 'institution'
                    ? 'Manage alerts for upcoming campus placement drives, MoU requests, and cohort analytics.'
                    : 'Choose which alerts and communication channels trigger instant dispatches.'}
                </p>
              </div>

              <form onSubmit={handleNotificationsSubmit} className="space-y-4">
                <div className="space-y-2.5">
                  {role === 'industry' ? (
                    /* INDUSTRY NOTIFICATIONS */
                    <>
                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indCandidateMatch}
                          onChange={(e) => setIndCandidateMatch(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">High-Match Candidate Alerts (90%+ Fit)</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Receive real-time notifications when students scoring 90%+ against your active job specs complete proctored assessments.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indAppSubmissions}
                          onChange={(e) => setIndAppSubmissions(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Candidate Application Submissions</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Instant alerts when qualified candidates submit applications for posted software engineering or internship positions.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indInterviewConfirm}
                          onChange={(e) => setIndInterviewConfirm(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Interview RSVPs &amp; Technical Round Confirmations</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            High-priority SMS &amp; email notifications when candidates accept, reschedule, or complete live interview rounds.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indDriveMilestones}
                          onChange={(e) => setIndDriveMilestones(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">University MoU &amp; Campus Drive Approvals</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Alerts when university Training &amp; Placement Officers (TPOs) approve on-campus hiring drives and schedule slots.
                          </p>
                        </div>
                      </label>
                    </>
                  ) : role === 'institution' ? (
                    /* INSTITUTION NOTIFICATIONS */
                    <>
                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instMouAlerts}
                          onChange={(e) => setInstMouAlerts(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Corporate MoU Collaboration Proposals</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Immediate notifications when verified enterprise recruiters (e.g. Google, TechNova) initiate campus partnership MoUs.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instDriveMilestones}
                          onChange={(e) => setInstDriveMilestones(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Placement Drive Milestones &amp; Offer Releases</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Real-time broadcast when campus hiring drives commence, shortlist results arrive, or offer letters are released.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instCohortCert}
                          onChange={(e) => setInstCohortCert(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Student Cohort Skill Certification Benchmarks</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Notifies dean office when departmental cohorts cross key industry benchmark percentiles in mock coding &amp; aptitude tests.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instAuditReports}
                          onChange={(e) => setInstAuditReports(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">NIRF &amp; NAAC Placement Audit Reports</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Monthly alerts when institutional placement audit summaries and accreditation compliance exports are compiled.
                          </p>
                        </div>
                      </label>
                    </>
                  ) : (
                    /* STUDENT NOTIFICATIONS */
                    <>
                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifJobAlerts}
                          onChange={(e) => setNotifJobAlerts(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Job &amp; Internship Match Alerts</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Receive instant alerts when a verified partner company lists openings matching your skill profile.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifInterviewInvites}
                          onChange={(e) => setNotifInterviewInvites(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Interview Shortlist &amp; Offer Notices</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            High-priority SMS and email notifications whenever your application stage advances.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifAssessmentReminders}
                          onChange={(e) => setNotifAssessmentReminders(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Adaptive Skill Test &amp; Benchmark Reminders</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Notifies when your verified skill profile qualifies for retake or badge level-ups.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifPlacementDrives}
                          onChange={(e) => setNotifPlacementDrives(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Institutional Placement Drive Broadcasts</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Campus placement fair invitations and industry guest lecture broadcasts from college administration.
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                </div>

                <div className="pt-2">
                  <label className="block font-bold text-slate-700 mb-1">Email Digest Frequency</label>
                  <select
                    value={emailDigestFrequency}
                    onChange={(e) => setEmailDigestFrequency(e.target.value)}
                    className="w-full sm:w-72 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-semibold"
                  >
                    <option>Instant Alerts (Real-time)</option>
                    <option>Daily Digest (Every Morning 8:00 AM)</option>
                    <option>Weekly Summary (Mondays)</option>
                    <option>Only Urgent Notices</option>
                  </select>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className={`px-5 py-2.5 ${roleColorActiveBg} ${roleColorButtonHover} text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer`}
                  >
                    <Save className="w-4 h-4" /> Save Notification Rules
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 4: PRIVACY / VISIBILITY / BRANDING (Role Adaptive)
              ────────────────────────────────────────────────────────────────── */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">
                  {role === 'industry'
                    ? 'Employer Branding & Candidate Screening'
                    : role === 'institution'
                    ? 'Student Data Governance & Compliance'
                    : 'Privacy & Employer Discovery'}
                </h2>
                <p className="text-slate-500 mt-0.5">
                  {role === 'industry'
                    ? 'Configure public company branding, verified partner status, and automated ATS filters.'
                    : role === 'institution'
                    ? 'Control student PII access permissions, verified recruiter screening, and directory visibility.'
                    : 'Control how partner recruiters, mentors, and placement administrators discover your profile.'}
                </p>
              </div>

              <form onSubmit={handlePrivacySubmit} className="space-y-4">
                <div className="space-y-2.5">
                  {role === 'industry' ? (
                    /* INDUSTRY PRIVACY & BRANDING */
                    <>
                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indVerifiedBadge}
                          onChange={(e) => setIndVerifiedBadge(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Verified Corporate Partner Badge</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Displays trusted enterprise partner checkmark on all job postings, boosting application rates from top-tier students.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indPublicProfile}
                          onChange={(e) => setIndPublicProfile(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Public Company Profile Listing</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Permits enrolled students and college placement coordinators to discover TechNova’s company overview, culture, and active career tracks.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indCampusDirectory}
                          onChange={(e) => setIndCampusDirectory(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Campus Placement Directory Visibility</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Feature your organization in university TPO directories for priority campus placement fair invitations.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={indAiScreening}
                          onChange={(e) => setIndAiScreening(e.target.checked)}
                          className="rounded text-purple-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">AI Candidate Auto-Shortlist Filter</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Automatically fast-tracks applicants who score 85%+ on verified coding challenges to recruiter review queue.
                          </p>
                        </div>
                      </label>
                    </>
                  ) : role === 'institution' ? (
                    /* INSTITUTION GOVERNANCE */
                    <>
                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instPiiMasking}
                          onChange={(e) => setInstPiiMasking(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Student PII Protection &amp; Data Privacy Mode</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Strictly anonymizes student personal phone numbers and home addresses until a recruiter formally schedules an interview.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instPublicDirectory}
                          onChange={(e) => setInstPublicDirectory(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">National Placement Directory Accreditation Listing</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Display Apex Institute of Technology in the verified national university placement directory with NAAC A++ accreditation.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instStrictRecruiter}
                          onChange={(e) => setInstStrictRecruiter(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Verified Recruiter Vetting Requirement</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Prohibit unverified employer accounts from sending unsolicited direct messages or drive invitations to enrolled students.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instCrossAnalytics}
                          onChange={(e) => setInstCrossAnalytics(e.target.checked)}
                          className="rounded text-amber-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Inter-Departmental Placement Analytics Sharing</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Permit academic deans and department heads to view comparative placement statistics across CSE, ECE, Mechanical, and Civil.
                          </p>
                        </div>
                      </label>
                    </>
                  ) : (
                    /* STUDENT PRIVACY */
                    <>
                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacyRecruiterSearch}
                          onChange={(e) => setPrivacyRecruiterSearch(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Corporate Recruiter Candidate Search</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Allow hiring managers from enterprise partners (e.g. TechNova, Deloitte, Google) to discover your profile for internships.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacyScoreVisible}
                          onChange={(e) => setPrivacyScoreVisible(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Display Proctored Skill Assessment Percentile</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Displays your verified assessment scores on candidate cards to give you high-tier interview priority.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacyPublicPortfolio}
                          onChange={(e) => setPrivacyPublicPortfolio(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Enable Public Digital Portfolio Link</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Allows you to share your blockchain-verified skill badges and certificate proofs with any external hiring portal.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacyLeaderboard}
                          onChange={(e) => setPrivacyLeaderboard(e.target.checked)}
                          className="rounded text-blue-600 mt-0.5 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Campus Department Leaderboard Participation</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            List your verified skill ranking on your college department's top placement aspirant board.
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className={`px-5 py-2.5 ${roleColorActiveBg} ${roleColorButtonHover} text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer`}
                  >
                    <Save className="w-4 h-4" /> Save Privacy &amp; Governance Rules
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
