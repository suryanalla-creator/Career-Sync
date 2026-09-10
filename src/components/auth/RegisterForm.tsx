import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthRole } from '../../types';
import { DEPARTMENT_OPTIONS, DEPARTMENT_CATEGORIES } from '../../data/departmentOptions';

export const RegisterForm: React.FC = () => {
  const {
    selectedAuthRole,
    setSelectedAuthRole,
    registerUser,
    setPageView
  } = useApp();

  // Multi-step flow: 'select-role' -> 'fill-form'
  const [step, setStep] = useState<'select-role' | 'fill-form'>('select-role');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Common fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Student fields
  const [studentData, setStudentData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    degree: 'B.Tech / B.E.',
    department: DEPARTMENT_OPTIONS[0].name,
    graduationYear: '2026',
    location: 'Bangalore, India'
  });

  // Industry fields
  const [industryData, setIndustryData] = useState({
    companyName: '',
    officialEmail: '',
    contactPerson: '',
    designation: 'Head of Talent Acquisition',
    industrySector: 'Information Technology & Software',
    companySize: '500-1,000 employees',
    location: 'Hyderabad, India',
    website: 'https://technova.io'
  });

  // Institution fields
  const [institutionData, setInstitutionData] = useState({
    institutionName: '',
    institutionType: 'Engineering Autonomous College (AICTE)',
    officialEmail: '',
    adminName: '',
    contactNumber: '',
    location: 'Bangalore, Karnataka',
    website: 'https://apextech.edu.in',
    accreditationInfo: 'NAAC A++ / NBA Accredited (Tier-1)'
  });

  const roleSelectionCards = [
    {
      id: 'student' as AuthRole,
      title: 'Student',
      desc: 'Build skills and discover career opportunities.',
      icon: GraduationCap,
      color: 'text-blue-600',
      border: 'hover:border-blue-500 hover:bg-blue-50/40',
      badge: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'industry' as AuthRole,
      title: 'Industry',
      desc: 'Hire talent and collaborate with academia.',
      icon: Briefcase,
      color: 'text-purple-600',
      border: 'hover:border-purple-500 hover:bg-purple-50/40',
      badge: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'institution' as AuthRole,
      title: 'Institution',
      desc: 'Manage student readiness and industry partnerships.',
      icon: Building2,
      color: 'text-amber-600',
      border: 'hover:border-amber-500 hover:bg-amber-50/40',
      badge: 'bg-amber-100 text-amber-800'
    }
  ];

  const handleSelectRoleCard = (role: AuthRole) => {
    setSelectedAuthRole(role);
    setStep('fill-form');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!termsAccepted && selectedAuthRole === 'student') {
      setErrorMessage('Please accept the CAREER SYNC Terms & Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      let payload: any = { password };
      if (selectedAuthRole === 'student') {
        payload = { ...studentData, email: studentData.email, ...payload };
      }
      if (selectedAuthRole === 'industry') {
        payload = { ...industryData, email: industryData.officialEmail, ...payload };
      }
      if (selectedAuthRole === 'institution') {
        payload = { ...institutionData, email: institutionData.officialEmail, ...payload };
      }

      const res = await registerUser(selectedAuthRole, payload);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Screen 1: Role Selection
  if (step === 'select-role') {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Join CAREER SYNC
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose how you want to use CAREER SYNC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {roleSelectionCards.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectRoleCard(c.id)}
                className={`p-4 rounded-2xl border-2 border-slate-200 bg-white text-left transition-all ${c.border} hover:scale-[1.02] shadow-xs group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform ${c.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.badge}`}>
                    {c.title}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {c.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </button>
            );
          })}
        </div>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setPageView('login')}
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Screen 2: Tailored Form
  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      {/* Back button to re-select role */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setStep('select-role')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Role</span>
        </button>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 capitalize">
          {selectedAuthRole} Registration
        </span>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Create your {selectedAuthRole} account
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill in your details below to activate your CAREER SYNC workspace
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* STUDENT FIELDS */}
        {selectedAuthRole === 'student' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentData.fullName}
                  onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                  placeholder="e.g. Ananya Rao"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={studentData.email}
                  onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  placeholder="ananya@apextech.edu.in"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={studentData.mobile}
                  onChange={(e) => setStudentData({ ...studentData, mobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">College / Institution *</label>
                <input
                  type="text"
                  required
                  value={studentData.college}
                  onChange={(e) => setStudentData({ ...studentData, college: e.target.value })}
                  placeholder="Apex Institute of Technology"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Degree</label>
                <select
                  value={studentData.degree}
                  onChange={(e) => setStudentData({ ...studentData, degree: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>B.Tech / B.E.</option>
                  <option>M.Tech / M.E.</option>
                  <option>BCA / MCA</option>
                  <option>B.Sc / M.Sc</option>
                  <option>PhD</option>
                </select>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Department</label>
                  <span className="text-[10px] text-blue-600 font-medium">35 Options</span>
                </div>
                <select
                  value={studentData.department}
                  onChange={(e) => setStudentData({ ...studentData, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Grad Year</label>
                <input
                  type="text"
                  value={studentData.graduationYear}
                  onChange={(e) => setStudentData({ ...studentData, graduationYear: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Location</label>
              <input
                type="text"
                value={studentData.location}
                onChange={(e) => setStudentData({ ...studentData, location: e.target.value })}
                placeholder="Bangalore, Karnataka, India"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* INDUSTRY FIELDS */}
        {selectedAuthRole === 'industry' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  value={industryData.companyName}
                  onChange={(e) => setIndustryData({ ...industryData, companyName: e.target.value })}
                  placeholder="TechNova Solutions"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Work Email *</label>
                <input
                  type="email"
                  required
                  value={industryData.officialEmail}
                  onChange={(e) => setIndustryData({ ...industryData, officialEmail: e.target.value })}
                  placeholder="recruiter@technova.io"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Person *</label>
                <input
                  type="text"
                  required
                  value={industryData.contactPerson}
                  onChange={(e) => setIndustryData({ ...industryData, contactPerson: e.target.value })}
                  placeholder="Siddharth Menon"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Designation *</label>
                <input
                  type="text"
                  required
                  value={industryData.designation}
                  onChange={(e) => setIndustryData({ ...industryData, designation: e.target.value })}
                  placeholder="Head of Talent Acquisition"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Industry Sector</label>
                <input
                  type="text"
                  value={industryData.industrySector}
                  onChange={(e) => setIndustryData({ ...industryData, industrySector: e.target.value })}
                  placeholder="Software / Cloud / AI"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Size</label>
                <select
                  value={industryData.companySize}
                  onChange={(e) => setIndustryData({ ...industryData, companySize: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>1-50 employees</option>
                  <option>50-200 employees</option>
                  <option>200-1,000 employees</option>
                  <option>1,000+ Enterprise</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location</label>
                <input
                  type="text"
                  value={industryData.location}
                  onChange={(e) => setIndustryData({ ...industryData, location: e.target.value })}
                  placeholder="Hyderabad / Bangalore"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Website</label>
                <input
                  type="url"
                  value={industryData.website}
                  onChange={(e) => setIndustryData({ ...industryData, website: e.target.value })}
                  placeholder="https://technova.io"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        )}

        {/* INSTITUTION FIELDS */}
        {selectedAuthRole === 'institution' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={institutionData.institutionName}
                  onChange={(e) => setInstitutionData({ ...institutionData, institutionName: e.target.value })}
                  placeholder="Apex Institute of Technology"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Institution Type *</label>
                <input
                  type="text"
                  required
                  value={institutionData.institutionType}
                  onChange={(e) => setInstitutionData({ ...institutionData, institutionType: e.target.value })}
                  placeholder="Autonomous University / AICTE College"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Email *</label>
                <input
                  type="email"
                  required
                  value={institutionData.officialEmail}
                  onChange={(e) => setInstitutionData({ ...institutionData, officialEmail: e.target.value })}
                  placeholder="admin@apextech.edu.in"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Administrator Name *</label>
                <input
                  type="text"
                  required
                  value={institutionData.adminName}
                  onChange={(e) => setInstitutionData({ ...institutionData, adminName: e.target.value })}
                  placeholder="Dr. K. V. Sharma (Dean)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Number</label>
                <input
                  type="tel"
                  value={institutionData.contactNumber}
                  onChange={(e) => setInstitutionData({ ...institutionData, contactNumber: e.target.value })}
                  placeholder="+91 80 2345 6789"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Website</label>
                <input
                  type="url"
                  value={institutionData.website}
                  onChange={(e) => setInstitutionData({ ...institutionData, website: e.target.value })}
                  placeholder="https://apextech.edu.in"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Accreditation / Institution ID</label>
              <input
                type="text"
                value={institutionData.accreditationInfo}
                onChange={(e) => setInstitutionData({ ...institutionData, accreditationInfo: e.target.value })}
                placeholder="NAAC A++ / AISHE: C-12345 / NIRF Rank 42"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Password & Confirmation for all roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Confirm Password *</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Checkbox for Student */}
        {selectedAuthRole === 'student' && (
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span>I agree to CAREER SYNC Terms & Privacy Policy</span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>
                {selectedAuthRole === 'student' && 'Create Student Account'}
                {selectedAuthRole === 'industry' && 'Create Industry Account'}
                {selectedAuthRole === 'institution' && 'Create Institution Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setPageView('login')}
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
