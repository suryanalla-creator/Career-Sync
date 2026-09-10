import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Eye,
  Edit3,
  User,
  GraduationCap,
  Briefcase,
  Award,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResumeBuilderView: React.FC = () => {
  const { studentProfile, triggerConfetti, skillsWeHave, internshipCertificates } = useApp();

  const primaryInternship = internshipCertificates && internshipCertificates[0];
  const defaultExperience = primaryInternship
    ? `${primaryInternship.role} @ ${primaryInternship.company} (${primaryInternship.duration}): Demonstrated technical excellence in ${primaryInternship.skillsDemonstrated?.slice(0, 4).join(', ') || 'software engineering'}. Top performer rating: ${primaryInternship.rating}/5.0.`
    : '';

  const defaultSkills = skillsWeHave && skillsWeHave.length > 0
    ? skillsWeHave.join(', ')
    : '';

  const [fullName, setFullName] = useState(studentProfile?.name || '');
  const [email, setEmail] = useState(studentProfile?.email || '');
  const [phone, setPhone] = useState(studentProfile?.phone || '');
  const [college, setCollege] = useState(studentProfile?.college || '');
  const [degree, setDegree] = useState(studentProfile?.degree ? `${studentProfile.degree}${studentProfile.department ? `, ${studentProfile.department}` : ''}` : '');
  const [skills, setSkills] = useState(defaultSkills);
  const [experience, setExperience] = useState(defaultExperience);
  const [project1, setProject1] = useState('');
  const [achievements, setAchievements] = useState('');

  // Keep state synchronized whenever studentProfile changes
  useEffect(() => {
    if (studentProfile) {
      setFullName(studentProfile.name || '');
      setEmail(studentProfile.email || '');
      setPhone(studentProfile.phone || '');
      setCollege(studentProfile.college || '');
      setDegree(studentProfile.degree ? `${studentProfile.degree}${studentProfile.department ? `, ${studentProfile.department}` : ''}` : '');
      if (skillsWeHave && skillsWeHave.length > 0) {
        setSkills(skillsWeHave.join(', '));
      }
    }
  }, [studentProfile, skillsWeHave]);

  const handleResetToProfile = () => {
    setFullName(studentProfile?.name || '');
    setEmail(studentProfile?.email || '');
    setPhone(studentProfile?.phone || '');
    setCollege(studentProfile?.college || '');
    setDegree(studentProfile?.degree ? `${studentProfile.degree}${studentProfile.department ? `, ${studentProfile.department}` : ''}` : '');
    setSkills(defaultSkills);
    setExperience(defaultExperience);
    setProject1('');
    setAchievements('');
    if (triggerConfetti) triggerConfetti();
  };

  const handlePrint = () => {
    const resumeEl = document.getElementById('built-resume-document');
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
          <title>${fullName ? `${fullName.replace(/\\s+/g, '_')}_Resume` : 'ATS_Resume'}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${styles}
          <style>
            @page { size: A4; margin: 10mm 15mm; }
            body { background: #fff !important; color: #0f172a !important; margin: 0 !important; padding: 0 !important; }
            #built-resume-document { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; }
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

  const githubUrl = studentProfile.socials?.github || '';
  const linkedinUrl = studentProfile.socials?.linkedin || '';
  const portfolioUrl = studentProfile.socials?.portfolio || (fullName ? `https://careersync.edu.in/portfolio/${fullName.toLowerCase().replace(/\s+/g, '-')}` : '');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ATS-Optimized Single-Page Formatter
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Automated CareerSync Resume Generator
          </h1>
          <p className="text-xs text-slate-500">
            Generated directly from {studentProfile.name || 'your'}&apos;s verified institutional credentials and skill telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToProfile}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset form fields to match your verified profile details"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Profile</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              Resume Content Fields
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified Student
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">College &amp; Degree</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none mb-2"
            />
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Technical Skills List</label>
            <textarea
              rows={2}
              value={skills}
              placeholder="e.g. Python, React & TypeScript, SQL, RESTful APIs, Docker, Git"
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Internship Experience</label>
            <textarea
              rows={3}
              value={experience}
              placeholder="e.g. Software Engineering Intern @ Company (Dates): Key responsibilities, deliverables, and impact..."
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Featured Projects</label>
            <textarea
              rows={2}
              value={project1}
              placeholder="e.g. Project Title: Core features, architecture design, technologies, and measurable results..."
              onChange={(e) => setProject1(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Honors &amp; Certifications</label>
            <textarea
              rows={2}
              value={achievements}
              placeholder="e.g. AWS Certified Solutions Architect • 1st Prize Hackathon 2026 • Meta Frontend Credential..."
              onChange={(e) => setAchievements(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Live A4 Resume Preview Sheet */}
        <div id="built-resume-document" className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg font-sans text-slate-800 space-y-5 print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="text-center border-b border-slate-300 pb-4 space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{fullName || 'Student Name'}</h1>
            <p className="text-xs text-slate-600 font-medium">
              {[email, phone, studentProfile?.location].filter(Boolean).join(' • ') || 'Contact info'}
            </p>
            {([linkedinUrl, githubUrl, portfolioUrl].filter(Boolean).length > 0) && (
              <p className="text-[11px] text-blue-700 font-medium">
                {[linkedinUrl, githubUrl, portfolioUrl].filter(Boolean).map(u => u.replace('https://', '')).join(' • ')}
              </p>
            )}
          </div>

          {/* Education */}
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
              Education
            </h2>
            <div className="flex justify-between text-xs font-bold pt-1">
              <span>{college || 'University / College'}</span>
              <span>{studentProfile?.graduationYear ? `Class of ${studentProfile.graduationYear}` : 'Undergraduate'}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{degree || 'Degree Program'}</span>
              {studentProfile?.cgpa ? (
                <span className="font-bold text-slate-800">CGPA: {studentProfile.cgpa} / 10.0</span>
              ) : null}
            </div>
          </div>

          {/* Technical Skills */}
          {skills && (
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Technical Competencies
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                <strong>Languages &amp; Frameworks:</strong> {skills}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience && (
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Industrial Experience
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {experience}
              </p>
            </div>
          )}

          {/* Projects */}
          {project1 && (
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Key Engineering Projects
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {project1}
              </p>
            </div>
          )}

          {/* Certifications & Honors */}
          {achievements && (
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Certifications &amp; Hackathon Honors
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {achievements}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
