import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Clock,
  Star,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  ExternalLink,
  Filter,
  Check,
  Zap,
  BadgeCheck,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CertificationItem, LearningProgram } from '../../types';
import { api } from '../../services/api';

export interface LearningProgramsViewProps {
  initialTab?: 'all' | 'programs' | 'certifications' | 'enrolled';
}

export const LearningProgramsView: React.FC<LearningProgramsViewProps> = ({ initialTab = 'all' }) => {
  const { learningPrograms, enrollInProgram, triggerConfetti } = useApp();

  // Active sub-block inside the combined hub
  const [activeTab, setActiveTab] = useState<'all' | 'programs' | 'certifications' | 'enrolled'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Certifications state
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [verifyInputId, setVerifyInputId] = useState('');
  const [viewProofCert, setViewProofCert] = useState<CertificationItem | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    api.certifications.getAll().then(dbCerts => {
      setCerts(dbCerts || []);
    }).catch(err => console.warn('Could not load certs:', err));
  }, []);

  const handleVerify = async (certId: string) => {
    setCerts(prev =>
      prev.map(c => (c.id === certId ? { ...c, verificationStatus: 'Verified' } : c))
    );
    setIsVerifyModalOpen(false);
    setSelectedCert(null);
    triggerConfetti();

    try {
      await api.certifications.verify(certId);
    } catch (err) {
      console.error('Failed to update certification in database:', err);
    }
  };

  const handleAddNewCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInputId.trim()) return;

    const newCertItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: selectedCert ? selectedCert.name : 'Industry Verified Specialization',
      provider: selectedCert ? selectedCert.provider : 'Accredited Partner Portal',
      logo: selectedCert ? selectedCert.logo : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      issueDate: 'Sep 2026',
      credentialId: verifyInputId.trim(),
      verificationStatus: 'Verified',
      skills: selectedCert ? selectedCert.skills : ['Advanced Engineering', 'Verified Competency']
    };

    setCerts(prev => [newCertItem, ...prev]);
    setIsVerifyModalOpen(false);
    setVerifyInputId('');
    setSelectedCert(null);
    triggerConfetti();
  };

  const programCategories = [
    'All',
    'Course',
    'Certification',
    'Bootcamp',
    'Workshop',
    'Industry Training',
    'FDP'
  ];

  const filteredPrograms = learningPrograms.filter((prog) => {
    if (selectedCategory !== 'All' && prog.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prog.title.toLowerCase().includes(q);
      const matchProvider = prog.provider.toLowerCase().includes(q);
      const matchSkills = prog.skillsGained.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchProvider && !matchSkills) return false;
    }
    return true;
  });

  const filteredCerts = certs.filter((cert) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = cert.name.toLowerCase().includes(q);
      const matchProvider = cert.provider.toLowerCase().includes(q);
      const matchSkills = cert.skills.some(s => s.toLowerCase().includes(q));
      const matchId = cert.credentialId.toLowerCase().includes(q);
      if (!matchName && !matchProvider && !matchSkills && !matchId) return false;
    }
    return true;
  });

  const enrolledPrograms = learningPrograms.filter(p => p.isEnrolled);
  const verifiedCertsCount = certs.filter(c => c.verificationStatus === 'Verified').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* ──────────────────────────────────────────────────────────────────────────
          UNIFIED HEADER BLOCK: LEARNING PROGRAMS & CERTIFICATIONS
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Curated Skill-Gap Curricula
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Industry Courses &amp; Certifications
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Learning Programs &amp; Certifications Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Explore university curricula, industry bootcamps, and top certification paths from AWS, Meta, DeepLearning.AI, Google, and partner enterprises.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => {
                setSelectedCert(null);
                setVerifyInputId('');
                setIsVerifyModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Certificate
            </button>
          </div>
        </div>

        {/* Quick Stats Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Programs</span>
              <span className="text-base font-black text-slate-900">{learningPrograms.length} Available</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enrollments</span>
              <span className="text-base font-black text-slate-900">{enrolledPrograms.length} Active</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certifications</span>
              <span className="text-base font-black text-slate-900">{filteredCerts.length} Completed</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificates Added</span>
              <span className="text-base font-black text-emerald-700">{filteredCerts.length}</span>
            </div>
          </div>
        </div>

        {/* View Segment Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            All Programs &amp; Credentials
          </button>

          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'programs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Courses &amp; Bootcamps ({learningPrograms.length})
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'certifications'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Industry Certifications ({certs.length})
          </button>

          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'enrolled'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            My Active Enrollments ({enrolledPrograms.length})
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          SEARCH & FILTER BAR
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills (for programs view or all) */}
        {(activeTab === 'all' || activeTab === 'programs') ? (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {programCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Filter className="w-4 h-4 text-slate-400" />
            Showing verifiable industry credentials &amp; badges
          </div>
        )}

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search courses, certs, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 1: INDUSTRY CERTIFICATIONS & BADGES
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeTab === 'all' || activeTab === 'certifications' || activeTab === 'enrolled') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900">
                Verified Industry Certifications &amp; Badges
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {verifiedCertsCount} Authenticated
              </span>
            </div>

            {activeTab === 'all' && (
              <button
                onClick={() => setActiveTab('certifications')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                View All Certifications ({certs.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCerts.map((cert) => {
              const isVerified = cert.verificationStatus === 'Verified';

              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <img src={cert.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 bg-emerald-50 text-emerald-800 border-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{cert.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{cert.provider}</p>

                    <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Certificate ID:</span>
                        <span className="font-mono text-slate-700 font-bold">{cert.credentialId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Issued:</span>
                        <span className="text-slate-700 font-semibold">{cert.issueDate}</span>
                      </div>
                      {cert.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Valid Until:</span>
                          <span className="text-slate-700 font-semibold">{cert.expiryDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills Attached */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {cert.skills.map((s, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      ✓ Certificate Added
                    </span>

                    <button
                      onClick={() => setViewProofCert(cert)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 2: LEARNING PROGRAMS & BOOTCAMPS
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeTab === 'all' || activeTab === 'programs' || activeTab === 'enrolled') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">
                {activeTab === 'enrolled' ? 'Active Program Enrollments' : 'Sponsored Courses & Industry Curricula'}
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {activeTab === 'enrolled' ? enrolledPrograms.length : filteredPrograms.length} Programs
              </span>
            </div>

            {activeTab === 'all' && (
              <button
                onClick={() => setActiveTab('programs')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                Browse All Curricula ({learningPrograms.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'enrolled' ? enrolledPrograms : filteredPrograms).map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {prog.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {prog.rating}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">{prog.provider}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 my-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {prog.duration}
                    </span>
                    <span>•</span>
                    <span>{prog.level}</span>
                    <span>•</span>
                    <span>{prog.mode}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Skills Gained */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prog.skillsGained.map((sk, i) => (
                      <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {prog.enrolledCount.toLocaleString()} enrolled
                  </div>

                  {prog.isEnrolled ? (
                    <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        enrollInProgram(prog.id);
                        triggerConfetti();
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT CERTIFICATE
          ────────────────────────────────────────────────────────────────────────── */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Certificate</h3>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewCert} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-blue-900">
                <p className="font-semibold">
                  {selectedCert
                    ? `Adding details for: ${selectedCert.name}`
                    : 'Enter your Certificate ID or completion link from your course provider.'}
                </p>
                <p className="text-[11px] text-blue-700 mt-1">
                  Supports Coursera, AWS, Google Cloud, Meta, edX, and university course certifications.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificate ID / Serial Number
                </label>
                <input
                  type="text"
                  required
                  value={verifyInputId}
                  onChange={(e) => setVerifyInputId(e.target.value)}
                  placeholder="e.g. AWS-CCP-98421094 or COURSERA-782194"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: VIEW CERTIFICATE PROOF
          ────────────────────────────────────────────────────────────────────────── */}
      {viewProofCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Course Certificate Record</h3>
              </div>
              <button
                onClick={() => setViewProofCert(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <img src={viewProofCert.logo} alt="" className="w-16 h-16 rounded-2xl mx-auto object-cover border" />
                <h4 className="text-sm font-black text-slate-900">{viewProofCert.name}</h4>
                <p className="text-xs font-semibold text-slate-500">{viewProofCert.provider}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  ✓ Completed Certificate
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Certificate ID:</span>
                  <span className="text-slate-900 font-bold">{viewProofCert.credentialId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Issued Date:</span>
                  <span className="text-slate-700">{viewProofCert.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewProofCert(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
