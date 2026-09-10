import React, { useState, useRef } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
  Upload,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Save,
  Globe,
  Link2,
  Camera,
  X,
  AlertCircle,
  Check,
  Trash2,
  Code2,
  AtSign,
  ArrowRight,
  Hash,
  Copy,
  Eye,
  Printer,
  Briefcase,
  Award,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { calculateProfileCompletion } from '../../utils/skillMatcher';

export const StudentProfileView: React.FC = () => {
  const {
    studentProfile,
    setStudentProfile,
    triggerConfetti,
    setActiveTab,
    skillsWeHave,
    internshipCertificates,
    certificates
  } = useApp();

  const [copiedId, setCopiedId] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const handleCopyId = () => {
    const idToCopy = studentProfile.studentId || '#8492019482';
    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // ─── Edit Panel State ────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(studentProfile.bio || '');
  const [phone, setPhone] = useState(studentProfile.phone || '');
  const [location, setLocation] = useState(studentProfile.location || '');
  const [displayName, setDisplayName] = useState(studentProfile.name || '');
  const [github, setGithub] = useState(studentProfile.socials?.github || '');
  const [linkedin, setLinkedin] = useState(studentProfile.socials?.linkedin || '');
  const [portfolioUrl, setPortfolioUrl] = useState(studentProfile.socials?.portfolio || '');

  // ─── File Upload State ───────────────────────────────────────────────────────
  const [portfolioFileName, setPortfolioFileName] = useState<string>(
    studentProfile.resumeUrl ? studentProfile.resumeUrl.split('/').pop() || '' : ''
  );
  const [portfolioFileData, setPortfolioFileData] = useState<string>(''); // base64
  const [portfolioMimeType, setPortfolioMimeType] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>(studentProfile.avatar || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const normalizeUrl = (url: string, prefix: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return prefix + url;
  };

  const calculateCompletion = () => {
    return calculateProfileCompletion({
      name: displayName,
      bio,
      phone,
      location,
      college: studentProfile.college,
      department: studentProfile.department,
      github,
      linkedin,
      resumeUrl: portfolioFileData || studentProfile.resumeUrl,
      portfolioFileName,
      portfolioUrl
    });
  };

  // ─── File Handlers ────────────────────────────────────────────────────────────
  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept PDF, doc, docx, png, jpg, jpeg
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png', 'image/jpeg'];
    if (!allowed.includes(file.type)) {
      alert('Please upload a PDF, Word document, or image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5 MB.');
      return;
    }

    setPortfolioFileName(file.name);
    setPortfolioMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPortfolioFileData(result); // data URL (base64)
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('Photo must be under 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePortfolio = () => {
    setPortfolioFileName('');
    setPortfolioFileData('');
    setPortfolioMimeType('');
    if (portfolioInputRef.current) portfolioInputRef.current.value = '';
  };

  // ─── Save Handler ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaveStatus('saving');

    const cleanGithub = normalizeUrl(github, 'https://github.com/');
    const cleanLinkedin = normalizeUrl(linkedin, 'https://linkedin.com/in/');
    const cleanPortfolio = normalizeUrl(portfolioUrl, 'https://');

    const completion = calculateCompletion();

    setStudentProfile(prev => ({
      ...prev,
      name: displayName || prev.name,
      bio,
      phone,
      location,
      avatar: avatarPreview || prev.avatar,
      profileCompletion: completion,
      resumeUrl: portfolioFileData
        ? `data:uploaded:${portfolioFileName}`
        : (portfolioFileName ? prev.resumeUrl : ''),
      socials: {
        github: cleanGithub,
        linkedin: cleanLinkedin,
        portfolio: cleanPortfolio
      }
    }));

    setIsEditing(false);

    try {
      await api.students.updateProfile({
        name: displayName || undefined,
        bio,
        phone,
        location,
        avatar: avatarPreview || undefined,
        profileCompletion: completion,
        resumeUrl: portfolioFileName || undefined,
        socials: {
          github: cleanGithub,
          linkedin: cleanLinkedin,
          portfolio: cleanPortfolio
        }
      } as any);
      setSaveStatus('saved');
      triggerConfetti();
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to save profile to backend:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCancel = () => {
    // Reset fields to last saved profile
    setBio(studentProfile.bio || '');
    setPhone(studentProfile.phone || '');
    setLocation(studentProfile.location || '');
    setDisplayName(studentProfile.name || '');
    setGithub(studentProfile.socials?.github || '');
    setLinkedin(studentProfile.socials?.linkedin || '');
    setPortfolioUrl(studentProfile.socials?.portfolio || '');
    setAvatarPreview(studentProfile.avatar || '');
    setPortfolioFileName(studentProfile.resumeUrl
      ? studentProfile.resumeUrl.split('/').pop() || '' : '');
    setPortfolioFileData('');
    setIsEditing(false);
  };

  const currentGithub = studentProfile.socials?.github || '';
  const currentLinkedin = studentProfile.socials?.linkedin || '';
  const currentPortfolio = studentProfile.socials?.portfolio || '';
  const currentResume = studentProfile.resumeUrl || '';
  const displayCompletion = calculateCompletion();

  const handlePrintResume = () => {
    const resumeEl = document.getElementById('profile-view-resume-document');
    if (!resumeEl) {
      window.print();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => node.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${studentProfile.name ? `${studentProfile.name.replace(/\\s+/g, '_')}_Resume` : 'ATS_Resume'}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${styles}
          <style>
            @page { size: A4; margin: 10mm 15mm; }
            body { background: #fff !important; color: #0f172a !important; margin: 0 !important; padding: 0 !important; }
            #profile-view-resume-document { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; }
          </style>
        </head>
        <body>
          <div style="padding: 10px 15px;">
            ${resumeEl.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        if (triggerConfetti) triggerConfetti();
      } catch (e) {
        console.error('Print failed:', e);
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 1200);
      }
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* Save Status Toast */}
      {saveStatus !== 'idle' && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-bold border transition-all animate-in slide-in-from-right-4 ${saveStatus === 'saving' ? 'bg-blue-50 border-blue-200 text-blue-700'
          : saveStatus === 'saved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
          {saveStatus === 'saving' && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          {saveStatus === 'saved' && <Check className="w-4 h-4 text-emerald-600" />}
          {saveStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
          {saveStatus === 'saving' ? 'Saving profile...'
            : saveStatus === 'saved' ? 'Profile saved successfully!'
              : 'Save failed — check console'}
        </div>
      )}

      {/* Profile Completion Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between text-xs max-w-md">
            <span className="font-bold text-slate-800">Profile Completion Status</span>
            <span className="font-extrabold text-blue-600">{displayCompletion}% Complete</span>
          </div>
          <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${displayCompletion}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {displayCompletion < 80
              ? 'Connect your GitHub, LinkedIn and upload a portfolio to unlock priority employer visibility.'
              : 'Excellent! Your profile details are complete and visible to campus recruiters.'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('portfolio')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Digital Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap ${isEditing
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
          >
            {isEditing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit3 className="w-3.5 h-3.5" /> Edit Profile</>}
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Cover Banner */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <GraduationCap className="w-3.5 h-3.5 text-blue-200" />
              <span>Student Profile</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-0 relative">
          {/* Avatar + Social Quick Links Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={avatarPreview || studentProfile.avatar}
                alt={studentProfile.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {/* Avatar upload overlay (only in edit mode) */}
              {isEditing && (
                <>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 w-full h-full rounded-2xl bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-7 h-7 text-white mb-1" />
                    <span className="text-white text-[10px] font-bold">Change Photo</span>
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </>
              )}
            </div>

            {/* Social quick-link buttons (view mode) */}
            {!isEditing && (
              <div className="flex items-center gap-2 flex-wrap">
                {currentGithub ? (
                  <a
                    href={currentGithub}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <Code2 className="w-4 h-4" /> GitHub <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-400 transition-colors"
                  >
                    <Code2 className="w-4 h-4" /> Connect GitHub
                  </button>
                )}
                {currentLinkedin ? (
                  <a
                    href={currentLinkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <AtSign className="w-4 h-4 text-blue-600" /> LinkedIn <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-400 transition-colors"
                  >
                    <AtSign className="w-4 h-4 text-blue-400" /> Connect LinkedIn
                  </button>
                )}
                {currentPortfolio ? (
                  <a
                    href={currentPortfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-purple-500" /> Portfolio <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-400 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-purple-300" /> Add Portfolio URL
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Name & Academic Meta */}
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900">{studentProfile.name}</h1>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {studentProfile.department?.split(' ')[0] || 'Student'}
              </span>

              {/* 10-Digit Unique Student ID Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-xl shadow-xs border border-slate-700 font-mono text-xs">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400 font-sans text-[11px] font-medium">Student ID:</span>
                <span className="font-bold text-amber-400 tracking-wider">{studentProfile.studentId || '#8492019482'}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Student ID"
                  className="ml-1 text-slate-400 hover:text-white transition-colors p-0.5 rounded hover:bg-slate-800 flex items-center gap-1"
                >
                  {copiedId ? (
                    <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {studentProfile.degree} in {studentProfile.department}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                {studentProfile.college}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Class of {studentProfile.graduationYear} {studentProfile.cgpa > 0 ? `• CGPA: ${studentProfile.cgpa}` : ''}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {studentProfile.location}
              </span>
            </div>
          </div>

          {/* ─── EDIT MODE ───────────────────────────────────────────────── */}
          {isEditing ? (
            <div className="pt-6 space-y-6">

              {/* Section: Basic Info */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Unique Student ID</span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">10 Digits</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={studentProfile.studentId || '#8492019482'}
                        className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-700"
                        title="Copy ID"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bangalore, Karnataka, India"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Professional Summary / Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Briefly describe your skills, interests, and career goals..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Social Profiles */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Connect Social Profiles
                </h3>
                <div className="space-y-3">
                  {/* GitHub */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">GitHub Username or URL</label>
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="github.com/yourusername  or  yourusername"
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 focus:outline-none font-mono"
                      />
                    </div>
                    {github && (
                      <a
                        href={normalizeUrl(github, 'https://github.com/')}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-800 transition-colors"
                        title="Preview link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <AtSign className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn Profile URL or ID</label>
                      <input
                        type="text"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/yourname  or  yourname"
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:outline-none font-mono"
                      />
                    </div>
                    {linkedin && (
                      <a
                        href={normalizeUrl(linkedin, 'https://linkedin.com/in/')}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Preview link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Portfolio Website */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Portfolio / Personal Website URL</label>
                      <input
                        type="text"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://yourname.dev"
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 focus:outline-none font-mono"
                      />
                    </div>
                    {portfolioUrl && (
                      <a
                        href={normalizeUrl(portfolioUrl, 'https://')}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors"
                        title="Preview link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Resume / Portfolio Upload */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Resume / Portfolio File
                </h3>

                {portfolioFileName ? (
                  /* File already selected */
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 max-w-xs truncate">{portfolioFileName}</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          {portfolioFileData ? 'Ready to save' : 'Current file'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => portfolioInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Replace
                      </button>
                      <button
                        onClick={handleRemovePortfolio}
                        className="px-3 py-1.5 bg-white border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload drop zone */
                  <button
                    type="button"
                    onClick={() => portfolioInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                        Upload Resume or Portfolio
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        PDF, Word Doc, PNG, or JPEG — up to 5 MB
                      </p>
                    </div>
                  </button>
                )}

                <input
                  ref={portfolioInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
                  className="hidden"
                  onChange={handlePortfolioUpload}
                />
              </div>

              {/* Save / Cancel */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {saveStatus === 'saving'
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />}
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

          ) : (
            /* ─── VIEW MODE ──────────────────────────────────────────────── */
            <div className="pt-6 space-y-6">
              {/* Bio */}
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Me</h2>
                {studentProfile.bio ? (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    {studentProfile.bio}
                  </p>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full text-left text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-blue-300 hover:text-blue-500 transition-colors"
                  >
                    + Add a professional summary to attract recruiters
                  </button>
                )}
              </div>

              {/* Preferences & Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preferred Job Roles</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {studentProfile.preferredJobRoles.map((r, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Industries</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {studentProfile.preferredIndustries.map((ind, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">{ind}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact & Channels</h3>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {studentProfile.email}
                    </p>
                    {studentProfile.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {studentProfile.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Profile Cards */}
              {(currentGithub || currentLinkedin || currentPortfolio) && (
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Connected Profiles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentGithub && (
                      <a
                        href={currentGithub}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                          <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">GitHub</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentGithub.replace('https://github.com/', '')}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 ml-auto flex-shrink-0" />
                      </a>
                    )}
                    {currentLinkedin && (
                      <a
                        href={currentLinkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-2xl border border-slate-200 bg-blue-50/60 hover:bg-blue-100/60 hover:border-blue-200 transition-all flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <AtSign className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">LinkedIn</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentLinkedin.replace('https://linkedin.com/in/', '')}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-auto flex-shrink-0" />
                      </a>
                    )}
                    {currentPortfolio && (
                      <a
                        href={currentPortfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-2xl border border-slate-200 bg-purple-50/60 hover:bg-purple-100/60 hover:border-purple-200 transition-all flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">Portfolio</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentPortfolio.replace('https://', '')}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 ml-auto flex-shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Academic & Placement Highlights Grid */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-purple-50/60 border border-indigo-100/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/70 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Placement Readiness &amp; Highlights</h3>
                      <p className="text-[11px] text-indigo-700">Student academic and placement profile for recruitment drives</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-xs self-start sm:self-auto">
                    {studentProfile.industryReadinessScore ?? 0}% Readiness Score
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Current CGPA</span>
                    <span className="text-sm font-black text-slate-900">{studentProfile.cgpa > 0 ? `${studentProfile.cgpa} / 10` : 'Not Set'}</span>
                  </div>
                  <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Graduation Batch</span>
                    <span className="text-sm font-black text-slate-900">{studentProfile.graduationYear ? `Class of ${studentProfile.graduationYear}` : 'Not Set'}</span>
                  </div>
                  <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Technical Score</span>
                    <span className="text-sm font-black text-emerald-700">{studentProfile.technicalSkillScore > 0 ? `${studentProfile.technicalSkillScore}%` : '0% (Unassessed)'}</span>
                  </div>
                  <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Soft Skills</span>
                    <span className="text-sm font-black text-purple-700">{studentProfile.softSkillScore > 0 ? `${studentProfile.softSkillScore}%` : '0% (Unassessed)'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <button
                    onClick={() => setActiveTab('skill-profile')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Skill Profile &amp; Tests</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs-internships')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-900 border border-indigo-200 rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Matched Job Openings</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Resume / Portfolio File */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 max-w-xs truncate">
                      {currentResume && currentResume.startsWith('data:uploaded:')
                        ? currentResume.replace('data:uploaded:', '')
                        : `${(studentProfile.name || 'Student').replace(/\s+/g, '_')}_Official_Resume.pdf`}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ATS-Optimized Profile &bull; Resume Ready
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Resume</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3.5 py-1.5 bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                </div>
              </div>

              {/* Empty state prompt to add socials */}
              {!currentGithub && !currentLinkedin && !currentPortfolio && (
                <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
                  <Sparkles className="w-7 h-7 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">Connect your social profiles</p>
                  <p className="text-xs text-slate-400">Link your GitHub, LinkedIn, and portfolio website to boost recruiter visibility and profile completeness.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    + Add Social Links
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── AUTHENTIC ATS RESUME PREVIEW MODAL ────────────────────────────── */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Top Bar */}
            <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                    <span>{studentProfile.name ? `${studentProfile.name}'s ATS Resume` : 'ATS Resume'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Standard ATS Format
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    ATS-Friendly &bull; {studentProfile.college || 'Institutional Affiliation'} &bull; {studentProfile.department || 'B.Tech Program'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    setActiveTab('resume-builder');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit in Builder</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintResume}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable A4 Document */}
            <div className="p-6 sm:p-10 overflow-y-auto bg-slate-100 flex justify-center">
              <div
                id="profile-view-resume-document"
                className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-12 w-full max-w-2xl text-slate-800 space-y-5 font-sans"
              >
                {/* Header */}
                <div className="text-center border-b border-slate-300 pb-4 space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                    {studentProfile.name || 'Student Name'}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    {[studentProfile.email, studentProfile.phone, studentProfile.location].filter(Boolean).join(' • ') || 'Contact Information'}
                  </p>
                  {(studentProfile.socials?.linkedin || studentProfile.socials?.github || studentProfile.socials?.portfolio) && (
                    <p className="text-[11px] text-blue-700 font-medium">
                      {[
                        studentProfile.socials?.linkedin ? studentProfile.socials.linkedin.replace('https://', '') : null,
                        studentProfile.socials?.github ? studentProfile.socials.github.replace('https://', '') : null,
                        studentProfile.socials?.portfolio ? studentProfile.socials.portfolio.replace('https://', '') : null
                      ].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>

                {/* Education */}
                <div className="space-y-1">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Education
                  </h2>
                  <div className="flex justify-between text-xs font-bold pt-1">
                    <span>{studentProfile.college || 'Institutional Affiliation'}</span>
                    <span>{studentProfile.graduationYear ? `Class of ${studentProfile.graduationYear}` : 'Enrolled'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{studentProfile.degree || 'Bachelor of Technology (B.Tech)'}, {studentProfile.department || 'General'}</span>
                    <span className="font-bold text-slate-800">{studentProfile.cgpa > 0 ? `CGPA: ${studentProfile.cgpa} / 10.0` : 'CGPA: Pending Evaluation'}</span>
                  </div>
                </div>

                {/* Technical Competencies */}
                <div className="space-y-1">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Skills &amp; Technical Competencies
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    {skillsWeHave && skillsWeHave.length > 0 ? (
                      <><strong>Core Skills:</strong> {skillsWeHave.join(', ')}</>
                    ) : (
                      <span className="text-slate-400 italic">No technical skills recorded yet. Add skills in your profile or skill matrix.</span>
                    )}
                  </p>
                </div>

                {/* Industrial Experience */}
                <div className="space-y-2">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Internships &amp; Work Experience
                  </h2>
                  {internshipCertificates && internshipCertificates.length > 0 ? (
                    internshipCertificates.map((cert) => (
                      <div key={cert.id} className="space-y-0.5 pt-1">
                        <div className="flex justify-between text-xs font-bold text-slate-900">
                          <span>{cert.role} &mdash; {cert.company}</span>
                          <span className="text-slate-500">{cert.duration}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Demonstrated core competencies in {cert.skillsDemonstrated?.join(', ')}. {cert.recommendationQuote ? `Feedback: ${cert.recommendationQuote}` : ''}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic pt-1">
                      No internships or work experience recorded yet.
                    </p>
                  )}
                </div>

                {/* Key Engineering Projects */}
                <div className="space-y-1">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Projects &amp; Portfolio
                  </h2>
                  <p className="text-xs text-slate-400 italic pt-1">
                    No engineering projects showcased yet. Add projects in the Projects section.
                  </p>
                </div>

                {/* Certifications & Honors */}
                <div className="space-y-1">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Certifications &amp; Achievements
                  </h2>
                  {certificates && certificates.length > 0 ? (
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      {certificates.map(c => c.skillName || (c as any).name).join(' • ')}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic pt-1">
                      No certifications or achievements recorded yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
