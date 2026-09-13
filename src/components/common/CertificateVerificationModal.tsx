import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Upload,
  Globe,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Loader2,
  ExternalLink,
  Sparkles,
  Lock,
  Search,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { VerificationReport } from '../../types';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSkillName?: string;
  onVerificationComplete?: (certData: {
    skillName: string;
    fileName: string;
    fileDataUrl?: string;
    mimeType?: string;
    issuer: string;
    credentialId?: string;
    credentialUrl?: string;
    report: VerificationReport;
  }) => void;
}

const COMMON_ISSUERS = [
  { name: 'Coursera', category: 'Academic & MOOC', placeholder: 'e.g. 7B9D2E4F6A8C', urlPlaceholder: 'https://www.coursera.org/verify/...' },
  { name: 'Credly', category: 'Professional Badges', placeholder: 'e.g. 1a2b3c4d-5e6f-7a8b...', urlPlaceholder: 'https://www.credly.com/badges/...' },
  { name: 'HackerRank', category: 'Coding & Tech', placeholder: 'e.g. 8A7B6C5D', urlPlaceholder: 'https://www.hackerrank.com/certificates/...' },
  { name: 'freeCodeCamp', category: 'Coding & Tech', placeholder: 'e.g. username/responsive-web-design', urlPlaceholder: 'https://www.freecodecamp.org/certification/...' },
  { name: 'Udemy', category: 'Online Courses', placeholder: 'e.g. UC-12345678', urlPlaceholder: 'https://www.udemy.com/certificate/UC-...' },
  { name: 'edX', category: 'University Programs', placeholder: 'e.g. 32-character hex ID', urlPlaceholder: 'https://credentials.edx.org/records/...' },
  { name: 'Amazon Web Services (AWS)', category: 'Cloud', placeholder: 'e.g. AWS Certified Solutions Architect', urlPlaceholder: 'https://www.credly.com/badges/...' },
  { name: 'Google Cloud / Google', category: 'Cloud', placeholder: 'e.g. Professional Cloud Architect', urlPlaceholder: 'https://www.credly.com/badges/...' },
  { name: 'Microsoft Learn', category: 'Cloud & Enterprise', placeholder: 'e.g. AZ-900 / AZ-204 Credential', urlPlaceholder: 'https://learn.microsoft.com/...' },
  { name: 'NPTEL / SWAYAM', category: 'Govt & University', placeholder: 'e.g. NPTEL24CS12S345', urlPlaceholder: 'https://nptel.ac.in/noc/Ecertificate/?id=...' },
  { name: 'Other Accredited Issuer', category: 'University / Institute', placeholder: 'e.g. CERT-2024-XXXX', urlPlaceholder: 'https://...' }
];

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  isOpen,
  onClose,
  initialSkillName = '',
  onVerificationComplete
}) => {
  const { studentProfile, uploadSkillCertificate } = useApp();

  const [skillName, setSkillName] = useState(initialSkillName);
  const [issuer, setIssuer] = useState('Coursera');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null);

  // Verification step & state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialSkillName) {
      setSkillName(initialSkillName);
    }
  }, [initialSkillName]);

  if (!isOpen) return null;

  const currentIssuerConfig = COMMON_ISSUERS.find(i => i.name === issuer) || COMMON_ISSUERS[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Certificate file size must be under 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedFile({
        name: file.name,
        type: file.type || 'application/pdf',
        size: file.size,
        dataUrl: ev.target?.result as string
      });
      // Reset previous report
      setReport(null);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Certificate file size must be under 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedFile({
        name: file.name,
        type: file.type || 'application/pdf',
        size: file.size,
        dataUrl: ev.target?.result as string
      });
      setReport(null);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleStartVerification = async () => {
    if (!skillName.trim()) {
      setErrorMsg('Please specify the skill or certificate title.');
      return;
    }

    if (!selectedFile && !credentialUrl.trim() && !credentialId.trim()) {
      setErrorMsg('Please upload a certificate document, or provide a Credential ID / Live Verification Link.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    setReport(null);

    // Step 1: Scan file & metadata
    setVerificationStep(1);
    await new Promise(r => setTimeout(r, 600));

    // Step 2: Query issuer servers over internet
    setVerificationStep(2);

    try {
      const response = await api.certificates.verify({
        fileName: selectedFile?.name,
        fileDataUrl: selectedFile?.dataUrl,
        mimeType: selectedFile?.type,
        issuer: issuer === 'Other Accredited Issuer' ? '' : issuer,
        credentialId: credentialId.trim() || undefined,
        credentialUrl: credentialUrl.trim() || undefined,
        skillName: skillName.trim(),
        studentName: studentProfile?.name || 'Aarav Patel'
      });

      // Step 3: Identity Cross-Referencing
      setVerificationStep(3);
      await new Promise(r => setTimeout(r, 500));

      // Step 4: Cryptographic Trust Scoring
      setVerificationStep(4);
      await new Promise(r => setTimeout(r, 400));

      setReport(response.report);
    } catch (err: any) {
      console.error('Verification failed:', err);
      setErrorMsg(err.message || 'Verification could not connect to issuer servers. Please check link and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!report) return;

    const certData = {
      skillName: skillName.trim(),
      fileName: selectedFile?.name || `${skillName} Certificate.pdf`,
      fileDataUrl: selectedFile?.dataUrl,
      mimeType: selectedFile?.type || 'application/pdf',
      issuer: report.issuer || issuer,
      credentialId: report.credentialId || credentialId.trim(),
      credentialUrl: report.credentialUrl || credentialUrl.trim(),
      report
    };

    if (onVerificationComplete) {
      onVerificationComplete(certData);
    } else {
      await uploadSkillCertificate(
        certData.skillName,
        certData.fileName,
        certData.fileDataUrl,
        certData.mimeType,
        {
          issuer: certData.issuer,
          credentialId: certData.credentialId,
          credentialUrl: certData.credentialUrl,
          report: certData.report
        }
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold mb-2 border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Live Anti-Fraud Backend Verification
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Verify &amp; Upload Authentic Certificate
            </h2>
            <p className="text-xs text-blue-200/80 mt-1 max-w-lg">
              Our automated backend connects directly to official certification portals (Coursera, Credly, HackerRank, AWS, Google) to verify credentials and ensure no fake achievements are added.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Skill or Certificate Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. React.js, AWS Cloud, Docker"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Issuing Organization / Authority <span className="text-rose-500">*</span>
              </label>
              <select
                value={issuer}
                onChange={(e) => {
                  setIssuer(e.target.value);
                  setReport(null);
                }}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium bg-white"
              >
                {COMMON_ISSUERS.map(i => (
                  <option key={i.name} value={i.name}>
                    {i.name} ({i.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Credential ID / Serial No.</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional if file uploaded</span>
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder={currentIssuerConfig.placeholder}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-blue-500" />
                  Live Verification URL
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Guarantees 100% Trust</span>
              </label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder={currentIssuerConfig.urlPlaceholder}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium text-blue-600"
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Upload Certificate Document (PDF or Image)</span>
              <span className="text-[11px] text-slate-400 font-normal">Max 8MB</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                selectedFile
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready for automated scanning
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setReport(null);
                    }}
                    className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 py-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Click to browse or drag &amp; drop certificate document
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports official PDF certificates, credential badges, and scanned awards
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Student Profile Identity Protection Banner */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Recipient cross-referencing active: Certificate will be verified against logged-in student{' '}
              <strong className="text-slate-900">{studentProfile?.name || 'Aarav Patel'}</strong>.
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Verification Error</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Live Verification Scanner Animation */}
          {isVerifying && (
            <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    Connecting to Internet &amp; Auditing Credential
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">Step {verificationStep} of 4</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2 transition-opacity ${verificationStep >= 1 ? 'text-white' : 'text-slate-500'}`}>
                  {verificationStep > 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                  <span>1. Parsing document cryptographic headers &amp; serial tokens...</span>
                </div>
                <div className={`flex items-center gap-2 transition-opacity ${verificationStep >= 2 ? 'text-white' : 'text-slate-500'}`}>
                  {verificationStep > 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : verificationStep === 2 ? <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                  <span>2. Accessing official {issuer} servers via live HTTPS request...</span>
                </div>
                <div className={`flex items-center gap-2 transition-opacity ${verificationStep >= 3 ? 'text-white' : 'text-slate-500'}`}>
                  {verificationStep > 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : verificationStep === 3 ? <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                  <span>3. Cross-referencing student recipient identity ({studentProfile?.name || 'Aarav Patel'})...</span>
                </div>
                <div className={`flex items-center gap-2 transition-opacity ${verificationStep >= 4 ? 'text-white' : 'text-slate-500'}`}>
                  {verificationStep >= 4 ? <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                  <span>4. Computing multi-factor trust score &amp; accreditation seal...</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Results Card */}
          {report && !isVerifying && (
            <div className={`p-5 rounded-2xl border transition-all ${
              report.verificationStatus === 'Verified'
                ? 'bg-emerald-50/70 border-emerald-300'
                : report.verificationStatus === 'Suspicious'
                ? 'bg-amber-50/70 border-amber-300'
                : 'bg-rose-50/70 border-rose-300'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    report.verificationStatus === 'Verified'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : report.verificationStatus === 'Suspicious'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  }`}>
                    {report.verificationStatus === 'Verified' ? (
                      <ShieldCheck className="w-7 h-7" />
                    ) : report.verificationStatus === 'Suspicious' ? (
                      <ShieldAlert className="w-7 h-7" />
                    ) : (
                      <ShieldX className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        report.verificationStatus === 'Verified'
                          ? 'bg-emerald-200/60 text-emerald-900 border border-emerald-300'
                          : report.verificationStatus === 'Suspicious'
                          ? 'bg-amber-200/60 text-amber-900 border border-amber-300'
                          : 'bg-rose-200/60 text-rose-900 border border-rose-300'
                      }`}>
                        {report.verificationStatus === 'Verified' ? '✓ Verified Authentic' : report.verificationStatus === 'Suspicious' ? '⚠️ Flagged for Review' : '✕ Verification Failed / Fake'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        Trust Score: {report.trustScore}%
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {report.issuer} • {report.issuerStatus || 'Accredited Issuer'}
                    </h3>
                  </div>
                </div>

                {report.credentialUrl && (
                  <a
                    href={report.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    Open Live Portal <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <p className="text-xs text-slate-700 font-medium mb-3">
                {report.summary}
              </p>

              {/* Flags Warning if Fake or Suspicious */}
              {report.flags && report.flags.length > 0 && (
                <div className="p-3 bg-white/80 rounded-xl border border-rose-200 mb-3 space-y-1">
                  <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Discrepancies Detected:
                  </p>
                  <ul className="text-xs text-rose-600 list-disc list-inside space-y-0.5">
                    {report.flags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Check items list */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Verification Audit Trail:
                </p>
                {report.checks.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    {check.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : check.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldX className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800">{check.title}: </span>
                      <span className="text-slate-600">{check.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!report ? (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleStartVerification}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Online...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" /> Start Internet Verification
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartVerification}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Re-Verify
                </button>
                <button
                  type="button"
                  disabled={report.verificationStatus === 'Rejected'}
                  onClick={handleSaveToProfile}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    report.verificationStatus === 'Verified'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : report.verificationStatus === 'Suspicious'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {report.verificationStatus === 'Verified'
                    ? 'Save Verified Certificate'
                    : report.verificationStatus === 'Suspicious'
                    ? 'Save for Manual Audit'
                    : 'Rejected (Cannot Save)'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
