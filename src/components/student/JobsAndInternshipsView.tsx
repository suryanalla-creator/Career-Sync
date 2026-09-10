import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  MapPin,
  Building,
  Target,
  CheckCircle2,
  Layers,
  ArrowRight,
  RotateCcw,
  Download,
  Eye,
  ShieldCheck,
  Upload,
  Calendar,
  Clock,
  Star,
  FileText,
  X,
  Plus,
  Check,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../common/OpportunityCard';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';
import { BTECH_BRANCHES, checkOpportunityRoleAndBranchMatch } from '../../utils/opportunityRoleBranchMatcher';

export interface JobsAndInternshipsViewProps {
  initialSubBlock?: 'all' | 'jobs' | 'internships' | 'certificates';
}

export interface InternshipCertificateItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  period: string;
  mentorName: string;
  mentorTitle: string;
  rating: number;
  credentialId: string;
  ledgerHash: string;
  certificatePdfName: string;
  fileDataUrl?: string;
  skillsDemonstrated: string[];
  recommendationQuote: string;
  status: 'Verified & Authenticated';
}

export const JobsAndInternshipsView: React.FC<JobsAndInternshipsViewProps> = ({
  initialSubBlock = 'all'
}) => {
  const {
    opportunities,
    setSelectedOpportunity,
    getOpportunityMatch,
    selectedCareerRoleId,
    setSelectedCareerRoleId,
    studentProfile,
    setActiveTab,
    triggerConfetti,
    internshipCertificates,
    addInternshipCertificate
  } = useApp();

  // Active sub-block switcher: 'all' | 'jobs' | 'internships' | 'certificates'
  const [activeSubBlock, setActiveSubBlock] = useState<'all' | 'jobs' | 'internships' | 'certificates'>(initialSubBlock);

  // Common Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(selectedCareerRoleId || 'fullstack-engineer');
  const [selectedBranch, setSelectedBranch] = useState<string>(studentProfile?.department || 'Computer Science & Engineering');
  const [isTailoredOnly, setIsTailoredOnly] = useState<boolean>(true);
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [minMatch, setMinMatch] = useState(0);

  // Sync when selectedCareerRoleId changes globally
  React.useEffect(() => {
    if (selectedCareerRoleId) {
      setSelectedRoleId(selectedCareerRoleId);
    }
  }, [selectedCareerRoleId]);

  const handleRoleChange = (newRoleId: string) => {
    setSelectedRoleId(newRoleId);
    setSelectedCareerRoleId(newRoleId);
  };

  const activeRole = CAREER_ROLE_OPTIONS.find(r => r.id === selectedRoleId) || CAREER_ROLE_OPTIONS[0];

  // ──────────────────────────────────────────────────────────────────────────
  // SUB-BLOCK 1: Job Opportunities Data
  // ──────────────────────────────────────────────────────────────────────────
  const allJobs = useMemo(() => opportunities.filter(o => o.type === 'job'), [opportunities]);

  const filteredJobs = useMemo(() => {
    return allJobs
      .filter((job) => {
        if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) return false;
        const match = getOpportunityMatch(job);
        if (match.matchPercentage < minMatch) return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.organization.toLowerCase().includes(q);
          const matchSkills = job.requiredSkills.some(s => s.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchSkills) return false;
        }

        const roleBranchMatch = checkOpportunityRoleAndBranchMatch(job, selectedRoleId, selectedBranch);
        if (isTailoredOnly) {
          const isBranchMatch = selectedBranch === 'All' || roleBranchMatch.isBranchEligible;
          return roleBranchMatch.isCareerRoleMatch && isBranchMatch;
        }
        return true;
      })
      .sort((a, b) => {
        const matchA = checkOpportunityRoleAndBranchMatch(a, selectedRoleId, selectedBranch);
        const matchB = checkOpportunityRoleAndBranchMatch(b, selectedRoleId, selectedBranch);
        const scoreA = getOpportunityMatch(a).matchPercentage + matchA.scoreBoost;
        const scoreB = getOpportunityMatch(b).matchPercentage + matchB.scoreBoost;
        return scoreB - scoreA;
      });
  }, [allJobs, selectedWorkMode, minMatch, searchQuery, selectedRoleId, selectedBranch, isTailoredOnly, getOpportunityMatch]);

  // ──────────────────────────────────────────────────────────────────────────
  // SUB-BLOCK 2: Internship Openings Data
  // ──────────────────────────────────────────────────────────────────────────
  const allInternships = useMemo(() => opportunities.filter(o => o.type === 'internship'), [opportunities]);

  const filteredInternships = useMemo(() => {
    return allInternships
      .filter((intern) => {
        if (selectedWorkMode !== 'All' && intern.workMode !== selectedWorkMode) return false;
        const match = getOpportunityMatch(intern);
        if (match.matchPercentage < minMatch) return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = intern.title.toLowerCase().includes(q);
          const matchOrg = intern.organization.toLowerCase().includes(q);
          const matchSkills = intern.requiredSkills.some(s => s.toLowerCase().includes(q));
          if (!matchTitle && !matchOrg && !matchSkills) return false;
        }

        const roleBranchMatch = checkOpportunityRoleAndBranchMatch(intern, selectedRoleId, selectedBranch);
        if (isTailoredOnly) {
          const isBranchMatch = selectedBranch === 'All' || roleBranchMatch.isBranchEligible;
          return roleBranchMatch.isCareerRoleMatch && isBranchMatch;
        }
        return true;
      })
      .sort((a, b) => {
        const matchA = checkOpportunityRoleAndBranchMatch(a, selectedRoleId, selectedBranch);
        const matchB = checkOpportunityRoleAndBranchMatch(b, selectedRoleId, selectedBranch);
        const scoreA = getOpportunityMatch(a).matchPercentage + matchA.scoreBoost;
        const scoreB = getOpportunityMatch(b).matchPercentage + matchB.scoreBoost;
        return scoreB - scoreA;
      });
  }, [allInternships, selectedWorkMode, minMatch, searchQuery, selectedRoleId, selectedBranch, isTailoredOnly, getOpportunityMatch]);

  // ──────────────────────────────────────────────────────────────────────────
  // SUB-BLOCK 3: Internship Certificates & Completion Badges Data
  // ──────────────────────────────────────────────────────────────────────────
  // Certificate Lightbox Preview & Upload Modal
  const [previewCert, setPreviewCert] = useState<InternshipCertificateItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDuration, setNewDuration] = useState('3 Months');
  const [newMentor, setNewMentor] = useState('');
  const [newRating, setNewRating] = useState('5.0');
  const [newSkills, setNewSkills] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const certFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    const newCert: InternshipCertificateItem = {
      id: `icert-${Date.now()}`,
      company: newCompany.trim(),
      role: newRole.trim(),
      duration: newDuration,
      period: 'Completed Internship',
      mentorName: newMentor.trim() || 'Mentor / Supervisor',
      mentorTitle: 'Team Lead / Manager',
      rating: parseFloat(newRating) || 5.0,
      credentialId: `INT-${Date.now().toString().slice(-6)}`,
      ledgerHash: '',
      certificatePdfName: newFileName || `${newCompany.replace(/\s+/g, '_')}_Internship_Certificate.pdf`,
      skillsDemonstrated: newSkills ? newSkills.split(',').map(s => s.trim()).filter(Boolean) : ['Technical Execution', 'Team Collaboration'],
      recommendationQuote: 'Successfully fulfilled all sprint milestones with commended code quality and high initiative.',
      status: 'Verified & Authenticated'
    };

    addInternshipCertificate(newCert);
    setIsUploadModalOpen(false);
    setNewCompany('');
    setNewRole('');
    setNewMentor('');
    setNewSkills('');
    setNewFileName('');
    triggerConfetti();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFileName(file.name);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Hidden File Input */}
      <input
        ref={certFileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* ──────────────────────────────────────────────────────────────────────────
          CERTIFICATE PREVIEW LIGHTBOX MODAL
          ────────────────────────────────────────────────────────────────────────── */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Internship Record • {previewCert.company}
                </h3>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Document Canvas Card */}
            <div className="p-6 bg-gradient-to-b from-slate-50 via-white to-blue-50/20 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">ID: {previewCert.credentialId}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Completed Internship
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <Award className="w-12 h-12 text-blue-600 mx-auto" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  Certificate of Internship Completion
                </h2>
                <p className="text-xs text-slate-500 font-semibold">Industrial Practicum &amp; Work Experience</p>
              </div>

              <div className="space-y-2 py-3 border-y border-dashed border-slate-200">
                <p className="text-xs text-slate-600">This certifies that</p>
                <h3 className="text-lg font-black text-blue-900">{studentProfile.name}</h3>
                <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                  has completed the <strong>{previewCert.role}</strong> at <strong>{previewCert.company}</strong> ({previewCert.duration}).
                </p>
                <p className="text-[11px] italic text-slate-500 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                  "{previewCert.recommendationQuote}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left text-xs pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Mentor / Supervisor</span>
                  <p className="font-extrabold text-slate-900">{previewCert.mentorName}</p>
                  <p className="text-[11px] text-slate-500">{previewCert.mentorTitle}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Performance Rating</span>
                  <div className="flex items-center gap-1 text-amber-600 font-black">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{previewCert.rating} / 5.0 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-500">{previewCert.certificatePdfName}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewCert(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          UPLOAD INTERNSHIP CERTIFICATE MODAL
          ────────────────────────────────────────────────────────────────────────── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Internship Record</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadCertSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft, Deloitte, TechNova Solutions..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internship Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering Intern, Cloud Intern..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Performance Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="5.0">5.0 (Exceptional)</option>
                    <option value="4.8">4.8 (High Honors)</option>
                    <option value="4.5">4.5 (Commended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mentor Name &amp; Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins (Engineering Director)"
                  value={newMentor}
                  onChange={(e) => setNewMentor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skills Demonstrated (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, Docker, React, Microservices"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Certificate Proof Document</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => certFileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> {newFileName ? 'Change File' : 'Upload PDF/Image'}
                  </button>
                  <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    {newFileName || 'No file chosen'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save &amp; Authenticate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN HEADER & SUMMARY ROW
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                Opportunities Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Internship Credentials
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Jobs &amp; Internships Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Unified placement center: Explore full-time career roles, discover industry-aligned internship openings, and manage your internship completion records.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Internship Record
            </button>
          </div>
        </div>

        {/* Unified Sub-Block Switcher Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveSubBlock('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            All Opportunities &amp; Records ({allJobs.length + allInternships.length + internshipCertificates.length})
          </button>

          <button
            onClick={() => setActiveSubBlock('jobs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'jobs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Job Opportunities ({filteredJobs.length})
          </button>

          <button
            onClick={() => setActiveSubBlock('internships')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'internships'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Internship Openings ({filteredInternships.length})
          </button>

          <button
            onClick={() => setActiveSubBlock('certificates')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubBlock === 'certificates'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Completed Internships ({internshipCertificates.length})
          </button>
        </div>
      </div>

      {/* Top Summary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Job Opportunities</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-600 mt-1.5">{filteredJobs.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Full-time Roles</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Internship Openings</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-indigo-600 mt-1.5">{filteredInternships.length}</p>
          <p className="text-[11px] text-indigo-600 font-bold mt-1">Summer &amp; Winter Practicums</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Completed Internships</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-1.5">{internshipCertificates.length}</p>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">Work Experiences</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Role Alignment</span>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-purple-600 mt-1.5">{studentProfile?.industryReadinessScore ?? 0}%</p>
          <p className="text-[11px] text-purple-600 font-bold mt-1">Target Role Match</p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          FILTER CONTROLS BAR (FOR JOBS & INTERNSHIPS)
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'jobs' || activeSubBlock === 'internships') && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search titles, companies, tech stacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Target Career Role Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedRoleId}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {CAREER_ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    Role: {r.title}
                  </option>
                ))}
              </select>
            </div>

            {/* B-Tech Branch Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All B-Tech Branches</option>
                {BTECH_BRANCHES.map((b) => (
                  <option key={b.id} value={b.name}>
                    Branch: {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Mode */}
            <div className="md:col-span-2">
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTailoredOnly(!isTailoredOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isTailoredOnly
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isTailoredOnly ? 'Tailored to Role & Branch (Active)' : 'Show All Unfiltered Openings'}
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Calibrated for: <strong className="text-slate-800">{activeRole.title}</strong> &bull; B.Tech in{' '}
              <strong className="text-slate-800">{selectedBranch}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SUB-BLOCK 1: JOB OPPORTUNITIES
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'jobs') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Full-Time Job Opportunities
                </h2>
                <p className="text-xs text-slate-500">
                  Graduate engineering and specialist roles tailored to {activeRole.title} &bull; {selectedBranch}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {filteredJobs.length} Jobs Available
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No job matches found for selected criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try switching the target role or disabling the tailored filter to view open positions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <OpportunityCard
                  key={job.id}
                  opportunity={job}
                  filterRoleId={selectedRoleId}
                  filterBranch={selectedBranch}
                  onViewDetails={(opp) => setSelectedOpportunity(opp)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          INTERNSHIP OPENINGS
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'internships') && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Internship Openings &amp; Practicums
                </h2>
                <p className="text-xs text-slate-500">
                  Summer, winter, and pre-placement internships aligned with {selectedBranch} coursework
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredInternships.length} Internships Open
            </span>
          </div>

          {filteredInternships.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No internship matches found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing search terms or changing your B-Tech branch filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInternships.map((intern) => (
                <OpportunityCard
                  key={intern.id}
                  opportunity={intern}
                  filterRoleId={selectedRoleId}
                  filterBranch={selectedBranch}
                  onViewDetails={(opp) => setSelectedOpportunity(opp)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          INTERNSHIP EXPERIENCES & COMPLETIONS
          ────────────────────────────────────────────────────────────────────────── */}
      {(activeSubBlock === 'all' || activeSubBlock === 'certificates') && (
        <div className="space-y-5 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Completed Internships &amp; Work Experience
                </h2>
                <p className="text-xs text-slate-500">
                  Corporate internship records, supervisor feedback, and demonstrated competencies.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-3.5 h-3.5" /> Add Internship Record
            </button>
          </div>

          {internshipCertificates.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No Internship Records Added</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Add your completed summer internships or industrial trainings to showcase your hands-on industry experience.
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Add Internship Record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {internshipCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                        <Briefcase className="w-3 h-3 text-indigo-600" /> Completed
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{cert.rating}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {cert.company}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{cert.role}</p>
                      <p className="text-[11px] text-slate-400">{cert.duration}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                        <span>Supervisor</span>
                        <span>Record ID</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{cert.mentorName}</span>
                        <span className="font-mono text-[10px] text-slate-500">{cert.credentialId.substring(0, 12)}</span>
                      </div>
                      <p className="text-[11px] italic text-slate-600 line-clamp-2 pt-1 border-t border-slate-200/60">
                        "{cert.recommendationQuote}"
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Skills Demonstrated
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cert.skillsDemonstrated.slice(0, 4).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-indigo-200"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                    <button
                      onClick={() => {
                        alert(`Downloading certificate for ${cert.company}...`);
                        triggerConfetti();
                      }}
                      title="Download Certificate PDF"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
