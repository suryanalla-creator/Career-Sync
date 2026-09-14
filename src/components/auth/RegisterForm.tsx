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

    if (selectedAuthRole === 'student') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
      if (!termsAccepted) {
        setErrorMessage('Please accept the CAREER SYNC Terms & Privacy Policy.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let payload: any = {};
      if (selectedAuthRole === 'student') {
        payload = { ...studentData, email: studentData.email, password };
      } else if (selectedAuthRole === 'industry') {
        const docName = (document.getElementById('ind_doc_name') as HTMLInputElement)?.value || 'Ministry of Corporate Affairs Certificate of Incorporation';
        const issuingAuthority = (document.getElementById('ind_doc_authority') as HTMLInputElement)?.value || 'Registrar of Companies, Ministry of Corporate Affairs, Govt of India';
        const certNumber = (document.getElementById('ind_doc_number') as HTMLInputElement)?.value || 'CIN: U72900KA2022PTC159032';
        const issueDate = (document.getElementById('ind_doc_date') as HTMLInputElement)?.value || '2022-03-14';

        payload = {
          ...industryData,
          email: industryData.officialEmail,
          certificates: [{
            docName,
            issuingAuthority,
            certNumber,
            issueDate,
            fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
            fileType: 'image/jpeg'
          }]
        };
      } else if (selectedAuthRole === 'institution') {
        const docName = (document.getElementById('inst_doc_name') as HTMLInputElement)?.value || 'AICTE Extension of Approval (EoA) & University Affiliation Order';
        const issuingAuthority = (document.getElementById('inst_doc_authority') as HTMLInputElement)?.value || 'All India Council for Technical Education (Govt. of India)';
        const certNumber = (document.getElementById('inst_doc_number') as HTMLInputElement)?.value || 'AICTE/SW/1-932148201/2025';
        const issueDate = (document.getElementById('inst_doc_date') as HTMLInputElement)?.value || '2025-05-18';

        payload = {
          ...institutionData,
          email: institutionData.officialEmail,
          certificates: [{
            docName,
            issuingAuthority,
            certNumber,
            issueDate,
            fileUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
            fileType: 'image/jpeg'
          }]
        };
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
  if (successMessage && (selectedAuthRole === 'institution' || selectedAuthRole === 'industry')) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6 text-center py-6 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
            Audit Review in Progress
          </span>
          <h2 className="text-xl font-black text-slate-900">
            Account Details Submitted for Verification
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
            "{successMessage}"
          </p>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-4 text-left border border-slate-100 text-xs space-y-2 text-slate-600">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Organization:</span>
            <span className="font-bold text-slate-800">{selectedAuthRole === 'institution' ? institutionData.institutionName : industryData.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Notification Email:</span>
            <span className="font-bold text-slate-800">{selectedAuthRole === 'institution' ? institutionData.officialEmail : industryData.officialEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Review Window:</span>
            <span className="font-bold text-blue-700">3 Business Days (Central Admin Review)</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setPageView('login')}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Return to Login Portal
          </button>
        </div>
      </div>
    );
  }

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
          <span>Switch Profile Type</span>
        </button>
        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
          {selectedAuthRole} Registration
        </span>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && selectedAuthRole === 'student' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* STUDENT FORM */}
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
                  placeholder="e.g. Rahul Sharma"
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
                  placeholder="student@college.edu"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                <input
                  type="tel"
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
                  placeholder="e.g. Apex Institute of Technology"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Degree</label>
                <input
                  type="text"
                  value={studentData.degree}
                  onChange={(e) => setStudentData({ ...studentData, degree: e.target.value })}
                  placeholder="B.Tech / B.E."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Department *</label>
                <select
                  value={studentData.department}
                  onChange={(e) => setStudentData({ ...studentData, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEPARTMENT_CATEGORIES.map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {DEPARTMENT_OPTIONS.filter((d) => d.category === cat).map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Graduation Year</label>
                <input
                  type="text"
                  value={studentData.graduationYear}
                  onChange={(e) => setStudentData({ ...studentData, graduationYear: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location</label>
                <input
                  type="text"
                  value={studentData.location}
                  onChange={(e) => setStudentData({ ...studentData, location: e.target.value })}
                  placeholder="Bangalore, India"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password & Confirmation for Student */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Create Password *</label>
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
          </>
        )}

        {/* INDUSTRY FORM */}
        {selectedAuthRole === 'industry' && (
          <>
            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl text-purple-900 text-xs">
              <p className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                Verified Corporate Accreditation Flow
              </p>
              <p className="text-[11px] text-purple-700 mt-1">
                You do not need to create a password now. Once your government/incorporation certificate is audited by the Master Admin, default credentials will be sent directly to your official email with instructions to set your private password.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  value={industryData.companyName}
                  onChange={(e) => setIndustryData({ ...industryData, companyName: e.target.value })}
                  placeholder="TechNova Solutions Pvt Ltd"
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
                  placeholder="careers@technova.io"
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
                  placeholder="Vikramaditya Sen"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Designation</label>
                <input
                  type="text"
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
                  placeholder="Information Technology & Software"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Size</label>
                <input
                  type="text"
                  value={industryData.companySize}
                  onChange={(e) => setIndustryData({ ...industryData, companySize: e.target.value })}
                  placeholder="500-1,000 employees"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Headquarters Location</label>
                <input
                  type="text"
                  value={industryData.location}
                  onChange={(e) => setIndustryData({ ...industryData, location: e.target.value })}
                  placeholder="Hyderabad, Telangana, India"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Website</label>
                <input
                  type="url"
                  value={industryData.website}
                  onChange={(e) => setIndustryData({ ...industryData, website: e.target.value })}
                  placeholder="https://technova.io"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* MANDATORY PROOF CERTIFICATE FOR INDUSTRY */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Government / Industry Verification Proof *</h4>
                  <p className="text-[11px] text-slate-500">MCA Incorporation Certificate, GST Registration, or DPIIT Recognition</p>
                </div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-[10px] font-bold">Admin Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Document Name / Type *</label>
                  <input
                    type="text"
                    required
                    defaultValue="Ministry of Corporate Affairs Certificate of Incorporation"
                    id="ind_doc_name"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Issuing Govt Body / Registrar *</label>
                  <input
                    type="text"
                    required
                    defaultValue="Registrar of Companies, Ministry of Corporate Affairs, Govt of India"
                    id="ind_doc_authority"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">CIN / Registration / GST Number *</label>
                  <input
                    type="text"
                    required
                    defaultValue="CIN: U72900KA2022PTC159032"
                    id="ind_doc_number"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Issue / Registration Date</label>
                  <input
                    type="date"
                    defaultValue="2022-03-14"
                    id="ind_doc_date"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Proof Document File (PDF / Image)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Strictly confidential: Audited only by Central Admin. Documents cannot be shared or downloaded.</p>
              </div>
            </div>
          </>
        )}

        {/* INSTITUTION FORM */}
        {selectedAuthRole === 'institution' && (
          <>
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <p className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                Institutional Verification Flow
              </p>
              <p className="text-[11px] text-amber-700 mt-1">
                No password required during registration. The Central Admin will audit your university or government accreditation certificate. Once verified, credentials will be dispatched to your official email.
              </p>
            </div>

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
                <label className="text-xs font-semibold text-slate-700">Institution Type</label>
                <input
                  type="text"
                  value={institutionData.institutionType}
                  onChange={(e) => setInstitutionData({ ...institutionData, institutionType: e.target.value })}
                  placeholder="Engineering Autonomous College (AICTE)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Institutional Email *</label>
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
                <label className="text-xs font-semibold text-slate-700">Administrator / Dean Name *</label>
                <input
                  type="text"
                  required
                  value={institutionData.adminName}
                  onChange={(e) => setInstitutionData({ ...institutionData, adminName: e.target.value })}
                  placeholder="Dr. K. V. Sharma"
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
                <label className="text-xs font-semibold text-slate-700">Official Website</label>
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
              <label className="text-xs font-semibold text-slate-700">Accreditation Info / AISHE Code</label>
              <input
                type="text"
                value={institutionData.accreditationInfo}
                onChange={(e) => setInstitutionData({ ...institutionData, accreditationInfo: e.target.value })}
                placeholder="NAAC A++ / AISHE: C-12345 / NBA Accredited"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* MANDATORY PROOF CERTIFICATE FOR INSTITUTION */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Government / University Affiliation Proof *</h4>
                  <p className="text-[11px] text-slate-500">AICTE Approval, UGC Recognition, or State Higher Education Affiliation</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">Admin Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Certificate / Order Title *</label>
                  <input
                    type="text"
                    required
                    defaultValue="AICTE Extension of Approval (EoA) & University Affiliation Order"
                    id="inst_doc_name"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Issuing Govt Authority / Body *</label>
                  <input
                    type="text"
                    required
                    defaultValue="All India Council for Technical Education (Govt. of India)"
                    id="inst_doc_authority"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Approval Order / AISHE Ref Number *</label>
                  <input
                    type="text"
                    required
                    defaultValue="AICTE/SW/1-932148201/2025"
                    id="inst_doc_number"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Approval Date</label>
                  <input
                    type="date"
                    defaultValue="2025-05-18"
                    id="inst_doc_date"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Accreditation Certificate File (PDF / Image)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Strictly confidential: Audited only by Central Admin. Documents cannot be shared or downloaded.</p>
              </div>
            </div>
          </>
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
                {selectedAuthRole === 'industry' && 'Submit Industry Details for 3-Day Verification'}
                {selectedAuthRole === 'institution' && 'Submit Institution Details for 3-Day Verification'}
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
