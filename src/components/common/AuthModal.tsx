import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  Briefcase,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, AuthRole } from '../../types';
import { DEPARTMENT_OPTIONS, DEPARTMENT_CATEGORIES } from '../../data/departmentOptions';

const DEMO_CREDENTIALS: Record<UserRole, { email: string; pass: string; label: string }> = {
  student: {
    email: 'student@careersync.com',
    pass: 'student123',
    label: 'Student Demo (student123)'
  },
  industry: {
    email: 'industry@careersync.com',
    pass: 'industry123',
    label: 'Recruiter Demo (industry123)'
  },
  institution: {
    email: 'institution@careersync.com',
    pass: 'admin123',
    label: 'Dean Demo (admin123)'
  },
  landing: {
    email: 'student@careersync.com',
    pass: 'student123',
    label: 'Student Demo (student123)'
  }
};

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    selectedAuthRole,
    setSelectedAuthRole,
    loginUser,
    registerUser,
    role
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(selectedAuthRole || 'student');
  const [email, setEmail] = useState(DEMO_CREDENTIALS[selectedAuthRole || 'student'].email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS[selectedAuthRole || 'student'].pass);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Registration dynamic fields
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0].name);

  // Sync selectedRole when modal opens or selectedAuthRole changes
  useEffect(() => {
    if (isAuthModalOpen) {
      const active = (selectedAuthRole as UserRole) || 'student';
      setSelectedRole(active);
      setEmail(DEMO_CREDENTIALS[active].email);
      setPassword(DEMO_CREDENTIALS[active].pass);
      setErrorMessage('');
    }
  }, [isAuthModalOpen, selectedAuthRole]);

  if (!isAuthModalOpen) return null;

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setSelectedAuthRole(r as AuthRole);
    setEmail(DEMO_CREDENTIALS[r].email);
    setPassword(DEMO_CREDENTIALS[r].pass);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const res = await loginUser(selectedRole as AuthRole, email, password);
        if (res.success) {
          setIsAuthModalOpen(false);
        } else {
          setErrorMessage(res.message || 'Invalid email or password.');
        }
      } else {
        // Register mode
        let payload: any = { password, fullName, email };
        if (selectedRole === 'student') {
          payload = { ...payload, college: orgName, department };
        } else if (selectedRole === 'industry') {
          payload = { ...payload, companyName: orgName, officialEmail: email };
        } else {
          payload = { ...payload, institutionName: orgName, officialEmail: email };
        }
        const res = await registerUser(selectedRole as AuthRole, payload);
        if (res.success) {
          setIsAuthModalOpen(false);
        } else {
          setErrorMessage(res.message || 'Registration failed. Please check your details.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = (r: UserRole) => {
    handleSelectRole(r);
  };

  const roleCards = [
    {
      role: 'student' as UserRole,
      title: 'Student',
      desc: 'Assess skills, discover internships, apply for jobs & build portfolio',
      icon: GraduationCap,
      color: 'border-blue-500 bg-blue-50/50 text-blue-700'
    },
    {
      role: 'industry' as UserRole,
      title: 'Industry / Recruiter',
      desc: 'Hire verified students, post jobs & internships, sponsor research',
      icon: Briefcase,
      color: 'border-purple-500 bg-purple-50/50 text-purple-700'
    },
    {
      role: 'institution' as UserRole,
      title: 'Institution Admin',
      desc: 'Monitor student readiness, track placements & manage industry MoUs',
      icon: Building2,
      color: 'border-amber-500 bg-amber-50/50 text-amber-700'
    }
  ];

  const isRoleSwitch = role !== 'landing' && role !== selectedRole;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                {authMode === 'login' ? `Sign In to ${selectedRole.toUpperCase()} Portal` : 'Join CAREER SYNC'}
                {isRoleSwitch && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Role Switch
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isRoleSwitch
                  ? `Please authenticate with your ${selectedRole} credentials to switch portals.`
                  : authMode === 'login'
                  ? 'Access your unified academia-industry workspace'
                  : 'Empowering students, universities & industry'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch (Sign In / Register) */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              authMode === 'login'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              authMode === 'register'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Role selector cards */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Select Portal Role</label>
              <span className="text-[10px] text-slate-400 font-medium">Click to select workspace</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {roleCards.map((rc) => {
                const Icon = rc.icon;
                const isSelected = selectedRole === rc.role;
                return (
                  <button
                    key={rc.role}
                    type="button"
                    onClick={() => handleSelectRole(rc.role)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${rc.color} shadow-xs font-semibold scale-[1.02]`
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className="w-4 h-4" />
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                    </div>
                    <p className="text-xs font-bold">{rc.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{rc.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Registration specific fields */}
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Rao / Vikramaditya Sen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {selectedRole === 'student' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">College / University</label>
                      <input
                        type="text"
                        placeholder="Apex Institute of Tech"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Graduation Year</label>
                      <select className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none">
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-700">Department / Branch</label>
                      <span className="text-[10px] text-blue-600 font-semibold">35 Options</span>
                    </div>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                    >
                      {DEPARTMENT_CATEGORIES.map((cat) => (
                        <optgroup key={cat} label={`── ${cat} ──`}>
                          {DEPARTMENT_OPTIONS.filter((d) => d.category === cat).map((dept) => (
                            <option key={dept.id} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === 'industry' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    placeholder="TechNova Solutions"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {selectedRole === 'institution' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institution AISHE / Affiliation Code</label>
                  <input
                    type="text"
                    placeholder="e.g. C-12849 (Apex Institute)"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </>
          )}

          {/* Email & Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {selectedRole === 'student' ? 'Student Email' : selectedRole === 'industry' ? 'Corporate Work Email' : 'Institutional Admin Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu.in or name@company.com"
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill(selectedRole)}
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                >
                  Use Demo: {DEMO_CREDENTIALS[selectedRole].pass}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => alert(`A password reset link will be sent to ${email || 'your registered email'}.`)}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:scale-[1.01]'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{authMode === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo One-Click Logins */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick 1-Click Authenticated Login</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  handleSelectRole('student');
                  loginUser('student', 'student@careersync.com', 'student123').then(res => {
                    if (res.success) setIsAuthModalOpen(false);
                  });
                }}
                className={`p-2 border rounded-xl text-[11px] font-semibold transition-colors cursor-pointer text-center truncate ${
                  selectedRole === 'student' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectRole('industry');
                  loginUser('industry', 'industry@careersync.com', 'industry123').then(res => {
                    if (res.success) setIsAuthModalOpen(false);
                  });
                }}
                className={`p-2 border rounded-xl text-[11px] font-semibold transition-colors cursor-pointer text-center truncate ${
                  selectedRole === 'industry' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                🏢 Industry
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectRole('institution');
                  loginUser('institution', 'institution@careersync.com', 'admin123').then(res => {
                    if (res.success) setIsAuthModalOpen(false);
                  });
                }}
                className={`p-2 border rounded-xl text-[11px] font-semibold transition-colors cursor-pointer text-center truncate ${
                  selectedRole === 'institution' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                🏛️ Institution
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
