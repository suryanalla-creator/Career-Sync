import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { CertificationItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const CertificationsView: React.FC = () => {
  const { triggerConfetti } = useApp();
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  React.useEffect(() => {
    api.certifications.getAll().then(dbCerts => {
      setCerts(dbCerts || []);
    }).catch(err => console.warn('Could not load certifications from database:', err));
  }, []);

  const handleVerify = async (certId: string) => {
    setCerts(prev =>
      prev.map(c => (c.id === certId ? { ...c, verificationStatus: 'Completed' } : c))
    );
    setIsVerifyModalOpen(false);
    triggerConfetti();

    try {
      await api.certifications.verify(certId);
    } catch (err) {
      console.error('Failed to update certification in database:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Certifications &amp; Achievements
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Course &amp; Industry Certifications
          </h1>
          <p className="text-xs text-slate-500">
            Showcase completed course certificates from AWS, Meta, Coursera, MongoDB, Google Cloud, and more.
          </p>
        </div>

        <button
          onClick={() => {
            if (certs.length > 0) {
              setSelectedCert(certs[0]);
            }
            setIsVerifyModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {/* Certifications Grid or Clean Empty State */}
      {certs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Certifications Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't added any professional certifications yet. Add your certificates and course completions to enhance your recruiter visibility.
          </p>
          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => {
          return (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
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
                  onClick={() => alert(`Certificate: ${cert.name} (${cert.provider}) - ID: ${cert.credentialId}`)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add / Edit Certificate Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              {selectedCert?.logo && (
                <img src={selectedCert.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedCert?.name || 'Add Certificate'}
                </h3>
                <p className="text-xs text-slate-500">{selectedCert?.provider || 'Enter Certificate details'}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Certificate Details
              </p>
              <p>
                Save your completed course certification to showcase in your student profile and ATS resume.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedCert && handleVerify(selectedCert.id)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
