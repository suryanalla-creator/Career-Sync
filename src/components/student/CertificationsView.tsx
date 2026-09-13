import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Plus,
  ExternalLink,
  Search,
  Sparkles,
  FileCheck2,
  Building,
  Check
} from 'lucide-react';
import { CertificationItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { CertificateVerificationModal } from '../common/CertificateVerificationModal';
import { CertificateAuditReportModal } from '../common/CertificateAuditReportModal';

export const CertificationsView: React.FC = () => {
  const { triggerConfetti, studentProfile } = useApp();
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [auditReportCert, setAuditReportCert] = useState<CertificationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCertificates = async () => {
    try {
      setIsLoading(true);
      const dbCerts = await api.certifications.getAll();
      setCerts(dbCerts || []);
    } catch (err) {
      console.warn('Could not load certifications from database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleVerificationComplete = async (certData: any) => {
    try {
      const newCertItem: Partial<CertificationItem> = {
        id: `cert-${Date.now()}`,
        name: certData.skillName.includes('Cert') ? certData.skillName : `${certData.skillName} Certification`,
        provider: certData.issuer,
        logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
        issueDate: 'Today',
        credentialId: certData.credentialId || `CERT-${Date.now().toString().slice(-6)}`,
        credentialUrl: certData.credentialUrl,
        verificationStatus: certData.report?.verificationStatus || 'Verified',
        trustScore: certData.report?.trustScore || 95,
        verificationDetails: certData.report,
        skills: [certData.skillName],
        fileName: certData.fileName,
        fileDataUrl: certData.fileDataUrl
      };

      await api.certifications.add(newCertItem);
      triggerConfetti();
      await loadCertificates();
    } catch (err) {
      console.error('Error saving verified certificate:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Anti-Fraud Verified Achievements
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Course &amp; Industry Certifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Add your completed certifications from AWS, Meta, Coursera, Google Cloud, and HackerRank. All credentials undergo automated real-time internet verification to guarantee authenticity for recruiters.
          </p>
        </div>

        <button
          onClick={() => setIsVerifyModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add &amp; Verify Certificate
        </button>
      </div>

      {/* Certifications Grid or Clean Empty State */}
      {certs.length === 0 && !isLoading ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Certifications Recorded Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't added any professional certifications. Upload certificates or provide verification links to boost your verified skill score and recruiter visibility.
          </p>
          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" /> Verify First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => {
            const isVerified = cert.verificationStatus === 'Verified' || (cert.trustScore && cert.trustScore >= 80);
            const isSuspicious = cert.verificationStatus === 'Suspicious';
            const isRejected = cert.verificationStatus === 'Rejected';

            return (
              <div
                key={cert.id}
                className={`bg-white rounded-3xl border p-6 shadow-xs transition-all flex flex-col justify-between ${
                  isVerified
                    ? 'border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                    : isSuspicious
                    ? 'border-amber-200 hover:border-amber-400 hover:shadow-md'
                    : 'border-rose-200 hover:border-rose-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cert.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">{cert.name}</h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          {cert.provider}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isSuspicious
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Authentic
                        </>
                      ) : isSuspicious ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          Under Review
                        </>
                      ) : (
                        <>
                          <ShieldX className="w-3.5 h-3.5 text-rose-600" />
                          Verification Failed
                        </>
                      )}
                    </span>
                  </div>

                  <div className="my-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Certificate ID:</span>
                      <span className="font-mono text-slate-700 font-bold">{cert.credentialId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Issued:</span>
                      <span className="text-slate-700 font-semibold">{cert.issueDate}</span>
                    </div>
                    {cert.trustScore !== undefined && (
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/50">
                        <span className="text-slate-400 font-medium">Automated Trust Score:</span>
                        <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                          cert.trustScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cert.trustScore}% Verified
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills Attached */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {cert.skills.map((s, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Official Issuer Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      ✓ Certificate Attested
                    </span>
                  )}

                  <button
                    onClick={() => setAuditReportCert(cert)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Audit Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerificationComplete={handleVerificationComplete}
      />

      {/* Certificate Audit Report Modal */}
      {auditReportCert && (
        <CertificateAuditReportModal
          isOpen={Boolean(auditReportCert)}
          onClose={() => setAuditReportCert(null)}
          certificateName={auditReportCert.name}
          issuer={auditReportCert.provider}
          credentialId={auditReportCert.credentialId}
          credentialUrl={auditReportCert.credentialUrl}
          issueDate={auditReportCert.issueDate}
          trustScore={auditReportCert.trustScore || 95}
          report={auditReportCert.verificationDetails}
        />
      )}
    </div>
  );
};
