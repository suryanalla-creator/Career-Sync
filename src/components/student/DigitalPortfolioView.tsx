import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Globe,
  Award,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  Download,
  FolderGit2,
  Calendar,
  Star,
  CheckCircle2,
  Eye,
  X,
  FileText,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { InternshipCertificateItem, VerifiedSkillItem } from '../../types';

export const DigitalPortfolioView: React.FC = () => {
  const {
    studentProfile,
    triggerConfetti,
    verifiedSkills,
    internshipCertificates,
    setActiveTab
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);

  // Modal Lightbox for viewing certificate proof
  const [previewProof, setPreviewProof] = useState<{
    title: string;
    issuerOrCompany: string;
    type: 'skill' | 'internship';
    credentialId?: string;
    ledgerHash?: string;
    mentor?: string;
    rating?: number;
    skills?: string[];
    fileName?: string;
    quote?: string;
  } | null>(null);

  // Project Filter & Add Project Modal State
  const [activeProjectCategory, setActiveProjectCategory] = useState<string>('All');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academic' | 'Industry' | 'Hackathon' | 'Capstone' | 'Open Source'>('Capstone');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newDemo, setNewDemo] = useState('');

  const projectCategories = ['All', 'Capstone', 'Industry', 'Hackathon', 'Academic', 'Open Source'];

  const filteredProjects = projects.filter((p: any) => {
    if (activeProjectCategory === 'All') return true;
    return (p.category || '').toLowerCase() === activeProjectCategory.toLowerCase();
  });

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || 'A production-grade engineering application built with modern architecture.',
      technologies: newTech.split(',').map((t: string) => t.trim()).filter(Boolean),
      githubUrl: newGithub.trim() || undefined,
      demoUrl: newDemo.trim() || undefined,
      completionDate: 'Sep 2026',
      verified: true
    };

    setProjects([newProject, ...projects]);
    setIsAddProjectModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewTech('');
    setNewGithub('');
    setNewDemo('');
    triggerConfetti();

    try {
      await api.projects.create({
        title: newProject.title,
        category: newProject.category,
        description: newProject.description,
        technologies: newProject.technologies,
        githubUrl: newProject.githubUrl,
        demoUrl: newProject.demoUrl
      });
    } catch (err) {
      console.error('Failed to save project to database:', err);
    }
  };

  React.useEffect(() => {
    let isMounted = true;
    Promise.allSettled([api.projects.getAll(), api.certifications.getAll()])
      .then(([projRes, certRes]) => {
        if (!isMounted) return;
        if (projRes.status === 'fulfilled' && Array.isArray(projRes.value)) {
          setProjects(projRes.value);
        }
        if (certRes.status === 'fulfilled' && Array.isArray(certRes.value)) {
          setCerts(certRes.value);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const portfolioUrl = `https://careersync.edu.in/portfolio/${studentProfile.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Share & Portfolio Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <h2 className="text-xs font-bold text-slate-800">Public Digital Portfolio Live</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Student Portfolio
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {portfolioUrl}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Link Copied!' : 'Share Portfolio'}
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          PORTFOLIO METRICS COUNTER ROW
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Number of Skills */}
        <div
          onClick={() => setActiveTab('skill-profile')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Skills Added</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{verifiedSkills.length}</span>
            <span className="text-xs font-bold text-emerald-700">Skills</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Tech &amp; Tools Inventory
          </p>
        </div>

        {/* Number of Internships */}
        <div
          onClick={() => setActiveTab('jobs-internships')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Internships</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">{internshipCertificates.length}</span>
            <span className="text-xs font-bold text-indigo-700">Completed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Work Experience &amp; Roles
          </p>
        </div>

        {/* Projects Done Stat Card */}
        <div
          onClick={() => {
            document.getElementById('portfolio-projects-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Projects</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">{projects.length}</span>
            <span className="text-xs font-bold text-blue-700">Showcased</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Capstones &amp; Applications
          </p>
        </div>

        {/* Profile Strength / Readiness */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Career Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">{studentProfile.industryReadinessScore}%</span>
            <span className="text-xs font-bold text-purple-700">Calculated</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Target Role Alignment
          </p>
        </div>
      </div>

      {/* Public Portfolio Container */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
        {/* Header Hero Banner */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-200" />
            Student Digital Profile
          </div>
        </div>

        {/* Identity & Profile Details */}
        <div className="p-6 sm:p-10 pt-0 relative space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-20 sm:-mt-24 mb-4">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-white shadow-xl"
            />
            <div className="flex items-center gap-2">
              {studentProfile.socials?.github && (
                <a
                  href={studentProfile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Code2 className="w-4 h-4" /> GitHub
                </a>
              )}
              {studentProfile.socials?.linkedin && (
                <a
                  href={studentProfile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4 text-blue-600" /> LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Name & Academic Headline */}
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{studentProfile.name}</h1>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Student Profile
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-700">
              {studentProfile.department} &bull; Aspiring Full Stack &amp; Cloud Systems Engineer
            </p>
            <p className="text-xs text-slate-500">
              {studentProfile.college} &bull; Class of 2026 &bull; CGPA: {studentProfile.cgpa} / 10.0
            </p>

            {/* Quick Metrics Bar with Small Box for Projects Done */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => document.getElementById('portfolio-projects-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-800 border border-blue-200 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                  {projects.length}
                </div>
                <span>Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('skill-profile')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                  {verifiedSkills.length}
                </div>
                <span>Skills ({verifiedSkills.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('jobs-internships')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-800 border border-indigo-200 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                  {internshipCertificates.length}
                </div>
                <span>Internships ({internshipCertificates.length})</span>
              </button>
            </div>
          </div>

          {/* About Me */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Me</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {studentProfile.bio}
            </p>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              TECHNICAL SKILLS (DYNAMIC FROM SKILL PROFILE)
              ────────────────────────────────────────────────────────────────────────── */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Technical Skills &amp; Competencies
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    {verifiedSkills.length} Skills Listed
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Skills, technologies, and competencies added to your profile.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('skill-profile')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skills
              </button>
            </div>

            {verifiedSkills.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">No skills added yet</p>
                <p className="text-[11px] text-slate-400">Add your technical skills and certifications in the Skill Profile section.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {verifiedSkills.map((skill) => (
                  <div
                    key={skill.id || skill.name}
                    className="p-3.5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {skill.category || 'Technical'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {skill.level || 'Proficient'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {skill.issuer || skill.sourceDescription || 'Self-Reported / Coursework'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                      <span className="font-bold text-slate-700">
                        Proficiency: <strong className="text-emerald-600 font-extrabold">{skill.score}%</strong>
                      </span>
                      {skill.fileName && (
                        <button
                          onClick={() => setPreviewProof({
                            title: skill.name,
                            issuerOrCompany: skill.issuer || 'Course / Certificate',
                            type: 'skill',
                            fileName: skill.fileName || `${skill.name.replace(/\s+/g, '_')}_Certificate.pdf`
                          })}
                          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          View Document
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              INTERNSHIPS & PRACTICAL EXPERIENCE (DYNAMIC FROM JOBS & INTERNSHIPS)
              ────────────────────────────────────────────────────────────────────────── */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Internships &amp; Work Experience
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                    {internshipCertificates.length} Internships
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Practical work experiences, summer internships, and industry projects.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('jobs-internships')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Internship
              </button>
            </div>

            {internshipCertificates.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">No internships recorded yet</p>
                <p className="text-[11px] text-slate-400">Add completed internship experience in the Jobs &amp; Internships section.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {internshipCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-indigo-600" />
                          Completed Internship
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-1">
                        {cert.role}
                      </h3>
                      <p className="text-xs font-extrabold text-blue-700">
                        {cert.company}
                      </p>
                    </div>

                    {cert.rating > 0 && (
                      <div className="px-2 py-1 bg-amber-50 border border-amber-200 rounded-xl text-center flex-shrink-0">
                        <div className="flex items-center gap-0.5 text-amber-500 text-xs font-black">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{cert.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[9px] text-amber-700 font-semibold block">
                          Rating
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cert.duration}</span> &bull; <span>{cert.period}</span>
                  </p>

                  {cert.recommendationQuote && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                      "{cert.recommendationQuote}"
                      {cert.mentorName && (
                        <p className="text-[11px] not-italic font-bold text-slate-800 mt-1">
                          &mdash; {cert.mentorName} {cert.mentorTitle ? `(${cert.mentorTitle})` : ''}
                        </p>
                      )}
                    </div>
                  )}

                  {cert.skillsDemonstrated && cert.skillsDemonstrated.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Skills Applied
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cert.skillsDemonstrated.map((sk, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cert.certificatePdfName && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => setPreviewProof({
                          title: cert.role,
                          issuerOrCompany: cert.company,
                          type: 'internship',
                          mentor: cert.mentorName ? `${cert.mentorName} (${cert.mentorTitle})` : undefined,
                          rating: cert.rating,
                          skills: cert.skillsDemonstrated,
                          fileName: cert.certificatePdfName,
                          quote: cert.recommendationQuote
                        })}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        View Document
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              PROJECTS & CODE SHOWCASE
              ────────────────────────────────────────────────────────────────────────── */}
          <div id="portfolio-projects-section" className="space-y-4 pt-6 scroll-mt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Projects &amp; Code Showcase
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    {projects.length} Projects
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Capstones, hackathons, open-source projects, and academic software implementations.
                </p>
              </div>

              <button
                onClick={() => setIsAddProjectModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {projectCategories.map((cat) => {
                const count = cat === 'All' 
                  ? projects.length 
                  : projects.filter((p: any) => (p.category || '').toLowerCase() === cat.toLowerCase()).length;
                const isSelected = activeProjectCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveProjectCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No {activeProjectCategory} projects found</p>
                <p className="text-[11px] text-slate-400">Add your project details to showcase your implementation skills.</p>
                <button
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((proj: any) => {
                  const techList = Array.isArray(proj.technologies) 
                    ? proj.technologies 
                    : typeof proj.technologies === 'string' 
                      ? JSON.parse(proj.technologies || '[]') 
                      : [];
                  return (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                            {proj.category || 'Engineering'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">{proj.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{proj.description}</p>
                        
                        {/* Technologies */}
                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {techList.map((t: string, i: number) => (
                              <span key={i} className="text-[10px] bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md font-mono text-slate-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions / Links */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px] font-medium">
                          {proj.completionDate || 'Project'}
                        </span>
                        <div className="flex items-center gap-2">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Code2 className="w-3.5 h-3.5" /> Code
                            </a>
                          )}
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              Live Demo <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-3 pt-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Certifications &amp; Course Proofs ({certs.length})
            </h2>
            {certs.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">No external certifications recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certs.slice(0, 4).map((cert) => (
                  <div key={cert.id} className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                    <img src={cert.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{cert.name}</p>
                      <p className="text-[11px] text-slate-500">{cert.provider} {cert.credentialId ? `• ID: ${cert.credentialId}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL LIGHTBOX: CERTIFICATE & EXPERIENCE PROOF
          ────────────────────────────────────────────────────────────────────────── */}
      {previewProof && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setPreviewProof(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                {previewProof.type === 'internship' ? <Briefcase className="w-5 h-5" /> : <Award className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  Document Preview
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {previewProof.title}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Organization / Authority</span>
                <p className="font-extrabold text-slate-900">{previewProof.issuerOrCompany}</p>
                {previewProof.mentor && (
                  <p className="text-[11px] text-slate-600">Mentor: {previewProof.mentor}</p>
                )}
              </div>

              {previewProof.quote && (
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-slate-700 italic">
                  "{previewProof.quote}"
                </div>
              )}

              {previewProof.fileName && (
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-semibold text-blue-900 truncate">{previewProof.fileName}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                    Attached File
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPreviewProof(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: ADD NEW PROJECT TO DIGITAL PORTFOLIO
          ────────────────────────────────────────────────────────────────────────── */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddProjectModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Add Project to Digital Portfolio</h3>
                <p className="text-xs text-slate-500">Showcase your technical capability to top campus recruiters.</p>
              </div>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Cloud Cache Engine"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Capstone">Capstone Project</option>
                    <option value="Industry">Industry Sponsorship</option>
                    <option value="Hackathon">Hackathon Prototype</option>
                    <option value="Academic">Academic Lab Project</option>
                    <option value="Open Source">Open Source Contribution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Redis, Docker"
                    value={newTech}
                    onChange={e => setNewTech(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Description &amp; Impact
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe architectural challenges solved, scale handled, or measurable outcomes..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={e => setNewGithub(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newDemo}
                    onChange={e => setNewDemo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
