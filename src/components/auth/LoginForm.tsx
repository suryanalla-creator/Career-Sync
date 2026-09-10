import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthRole } from '../../types';
import { RoleSelector } from './RoleSelector';

export const LoginForm: React.FC = () => {
  const {
    selectedAuthRole,
    setSelectedAuthRole,
    loginUser,
    setPageView
  } = useApp();

  const [email, setEmail] = useState('student@careersync.com');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Demo accounts data
  const demoAccounts: Record<AuthRole, { email: string; pass: string; label: string }> = {
    student: {
      email: 'student@careersync.com',
      pass: 'student123',
      label: 'Student Demo'
    },
    industry: {
      email: 'industry@careersync.com',
      pass: 'industry123',
      label: 'Recruiter Demo'
    },
    institution: {
      email: 'institution@careersync.com',
      pass: 'admin123',
      label: 'Dean Demo'
    }
  };

  const handleSelectRole = (role: AuthRole) => {
    setSelectedAuthRole(role);
    setErrorMessage('');
    // Pre-fill corresponding demo credentials for frictionless experience
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].pass);
  };

  const handleApplyDemoAccount = (role: AuthRole) => {
    setSelectedAuthRole(role);
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].pass);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(selectedAuthRole, email, password);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleDisplayNames: Record<AuthRole, string> = {
    student: 'Student',
    industry: 'Industry',
    institution: 'Institution'
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your customized CAREER SYNC workspace & tools
        </p>
      </div>

      {/* Role Selection Tabs */}
      <RoleSelector
        selectedRole={selectedAuthRole}
        onSelectRole={handleSelectRole}
        label="Login as"
      />

      {/* Demo Credentials Quick-Fill Banner */}
      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            Try Demo Account
          </span>
          <span className="text-[10px] text-blue-600 font-medium">1-Click Auto-Fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {(Object.keys(demoAccounts) as AuthRole[]).map((rKey) => (
            <button
              key={rKey}
              type="button"
              onClick={() => handleApplyDemoAccount(rKey)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-left flex items-center justify-between ${
                selectedAuthRole === rKey
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{demoAccounts[rKey].label}</span>
              {selectedAuthRole === rKey && <Sparkles className="w-3 h-3 text-blue-200" />}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success State */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya.rao@apextech.edu.in"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setPageView('forgot-password')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secure password"
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Dynamic Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Login as {roleDisplayNames[selectedAuthRole]}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setPageView('register')}
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};
