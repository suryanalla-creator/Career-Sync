import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Building2,
  Briefcase,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Lock,
  Mail,
  ExternalLink,
  Eye,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Smartphone,
  Laptop,
  MapPin,
  Calendar,
  UserCheck,
  Building,
  GraduationCap,
  KeyRound
} from 'lucide-react';
import { api } from '../../services/api';
import { PendingVerificationItem, CertificateProofItem, LoginAuditLogItem } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminPortalView: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  // Tab state: 'institution-verification' | 'industry-verification' | 'logs'
  const currentSubBlock =
    activeTab === 'industry-verification'
      ? 'industry-verification'
      : activeTab === 'logs'
      ? 'logs'
      : 'institution-verification';

  const [institutions, setInstitutions] = useState<PendingVerificationItem[]>([]);
  const [industries, setIndustries] = useState<PendingVerificationItem[]>([]);
  const [logs, setLogs] = useState<LoginAuditLogItem[]>([]);
  const [stats, setStats] = useState<{
    pendingInstitutions: number;
    pendingIndustries: number;
    totalLogins: number;
    dispatchedEmails: number;
  }>({
    pendingInstitutions: 0,
    pendingIndustries: 0,
    totalLogins: 0,
    dispatchedEmails: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string; previewUrl?: string } | null>(null);

  // Certificate Modal State (Strict Admin View Only)
  const [inspectingItem, setInspectingItem] = useState<PendingVerificationItem | null>(null);

  // Reject Modal State
  const [rejectingItem, setRejectingItem] = useState<PendingVerificationItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Logs Search & Filter
  const [logSearch, setLogSearch] = useState('');
  const [logRoleFilter, setLogRoleFilter] = useState<'all' | 'student' | 'industry' | 'institution'>('all');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [instRes, indRes, logsRes, statsRes] = await Promise.all([
        api.admin.getVerifications({ role: 'institution', status: 'pending' }),
        api.admin.getVerifications({ role: 'industry', status: 'pending' }),
        api.admin.getLogs({ role: logRoleFilter, search: logSearch }),
        api.admin.getStats()
      ]);

      if (instRes.success) setInstitutions(instRes.verifications || []);
      if (indRes.success) setIndustries(indRes.verifications || []);
      if (logsRes.success) setLogs(logsRes.logs || []);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err: any) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [logRoleFilter, logSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const logsRes = await api.admin.getLogs({ role: logRoleFilter, search: logSearch });
      if (logsRes.success) setLogs(logsRes.logs || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (item: PendingVerificationItem) => {
    setActionLoadingId(item.id);
    try {
      const res = await api.admin.approveVerification(item.id);
      if (res.success) {
        setToastMessage({
          type: 'success',
          text: `Verified & Issued! Default login credentials for ${item.organization} have been dispatched to ${item.email}. Default password: ${res.generatedCredentials?.defaultPassword}`,
          previewUrl: res.emailPreviewUrl
        });
        if (inspectingItem?.id === item.id) setInspectingItem(null);
        await loadData();
      } else {
        setToastMessage({ type: 'error', text: res.message || 'Approval failed' });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message || 'Approval failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingItem) return;
    if (!rejectReason.trim()) {
      alert('Please specify the audit rejection reason.');
      return;
    }
    setActionLoadingId(rejectingItem.id);
    try {
      const res = await api.admin.rejectVerification(rejectingItem.id, rejectReason.trim());
      if (res.success) {
        setToastMessage({
          type: 'success',
          text: `Verification request for ${rejectingItem.organization} rejected. Rejection notice dispatched to ${rejectingItem.email}.`
        });
        setRejectingItem(null);
        setRejectReason('');
        await loadData();
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message || 'Rejection failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Master Platform Authority • Restricted Single Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Central Administration & Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify official accreditation certificates for newly registered Institutions and Industries, dispatch auto-generated credentials, and monitor device login telemetry across all roles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-amber-400 font-semibold block text-[11px]">Pending Institutions</span>
            <span className="text-xl font-black text-white">{stats.pendingInstitutions}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-purple-400 font-semibold block text-[11px]">Pending Industries</span>
            <span className="text-xl font-black text-white">{stats.pendingIndustries}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-blue-400 font-semibold block text-[11px]">Total Login Logs</span>
            <span className="text-xl font-black text-white">{stats.totalLogins}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-emerald-400 font-semibold block text-[11px]">Emails Dispatched</span>
            <span className="text-xl font-black text-white">{stats.dispatchedEmails}</span>
          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-start justify-between gap-3 shadow-sm ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{toastMessage.text}</p>
              {toastMessage.previewUrl && (
                <a
                  href={toastMessage.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 text-blue-700 underline font-bold"
                >
                  <span>Open Ethereal Mailbox to inspect dispatched credentials email</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3 SUB BLOCKS NAVIGATION BAR */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('institution-verification')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
            currentSubBlock === 'institution-verification'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>New Institution Account Verification</span>
          {institutions.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              currentSubBlock === 'institution-verification' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {institutions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('industry-verification')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
            currentSubBlock === 'industry-verification'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>New Industry Account Verification</span>
          {industries.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              currentSubBlock === 'industry-verification' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              {industries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
            currentSubBlock === 'logs'
              ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit & Login Logs</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            currentSubBlock === 'logs' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            Live
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* SUB-BLOCK 1: NEW INSTITUTION ACCOUNT VERIFICATION */}
      {/* ============================================================ */}
      {currentSubBlock === 'institution-verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pending Educational Institution Applications
              </h2>
              <p className="text-xs text-slate-500">
                Audited regulatory proofs: AICTE Approval, UGC Affiliation, NAAC/NBA Accreditation.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {institutions.length} Pending Review
            </span>
          </div>

          {institutions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">All Institution Requests Audited</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No new institution registrations are awaiting certificate verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {institutions.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 transition-all shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0 font-black text-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{item.organization}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {item.sector_or_type || 'Autonomous Institution'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dean / Admin: <strong className="text-slate-700">{item.name}</strong> • {item.title || 'Institutional Head'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[11px]">Submitted for 3-Day Audit:</span>
                      <span className="font-semibold text-slate-700">
                        {new Date(item.submitted_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Official Email</span>
                      <span className="font-semibold text-slate-800">{item.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Location & Contact</span>
                      <span className="font-semibold text-slate-800">{item.location || 'Bangalore, India'} • {item.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Accreditation Info</span>
                      <span className="font-semibold text-slate-800 truncate block">{item.accreditation_or_size || 'AICTE / NAAC A++'}</span>
                    </div>
                  </div>

                  {/* Certificates Proofs Strip */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        Confidential Proof Certificates ({item.certificates?.length || 0})
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Admin View Only • Sharing Prohibited
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.certificates?.map((cert, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-800 truncate">{cert.docName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{cert.issuingAuthority} • {cert.certNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setInspectingItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold shrink-0 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Audit Proof</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setRejectingItem(item)}
                      disabled={actionLoadingId === item.id}
                      className="px-4 py-2 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all"
                    >
                      Reject Application
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(item)}
                      disabled={actionLoadingId === item.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
                    >
                      {actionLoadingId === item.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Verify & Issue Credentials Email</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-BLOCK 2: NEW INDUSTRY ACCOUNT VERIFICATION */}
      {/* ============================================================ */}
      {currentSubBlock === 'industry-verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pending Corporate Recruiter & Industry Applications
              </h2>
              <p className="text-xs text-slate-500">
                Audited regulatory proofs: Ministry of Corporate Affairs Incorporation Certificate, GST Registration, DPIIT Certificate.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {industries.length} Pending Review
            </span>
          </div>

          {industries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">All Industry Requests Audited</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No new corporate employer registrations are awaiting certificate verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {industries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 transition-all shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0 font-black text-sm">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{item.organization}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            {item.sector_or_type || 'IT & Software'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Contact Lead: <strong className="text-slate-700">{item.name}</strong> • {item.title || 'Talent Acquisition Head'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[11px]">Submitted for 3-Day Audit:</span>
                      <span className="font-semibold text-slate-700">
                        {new Date(item.submitted_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Official Work Email</span>
                      <span className="font-semibold text-slate-800">{item.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Location & Contact</span>
                      <span className="font-semibold text-slate-800">{item.location || 'Hyderabad, India'} • {item.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Company Size & Website</span>
                      <span className="font-semibold text-slate-800 truncate block">{item.accreditation_or_size || '500-1,000 employees'}</span>
                    </div>
                  </div>

                  {/* Certificates Proofs Strip */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-purple-600" />
                        Confidential Government Proof Certificates ({item.certificates?.length || 0})
                      </span>
                      <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Admin View Only • Sharing Prohibited
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.certificates?.map((cert, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-800 truncate">{cert.docName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{cert.issuingAuthority} • {cert.certNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setInspectingItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold shrink-0 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Audit Proof</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setRejectingItem(item)}
                      disabled={actionLoadingId === item.id}
                      className="px-4 py-2 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all"
                    >
                      Reject Application
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(item)}
                      disabled={actionLoadingId === item.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
                    >
                      {actionLoadingId === item.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Verify & Issue Credentials Email</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-BLOCK 3: AUDIT & LOGIN LOGS */}
      {/* ============================================================ */}
      {currentSubBlock === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                User Authentication & Session Audit Logs
              </h2>
              <p className="text-xs text-slate-500">
                Search and audit student, industry, and institution login timestamps, client devices, and physical locations.
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500">
              Showing {logs.length} Log Records
            </div>
          </div>

          {/* Search & Role Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <form onSubmit={handleSearchLogs} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search logs by student name, college, recruiter, email, device name, or location..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0"
              >
                Search
              </button>
            </form>

            {/* Role Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Filter by User Profile:</span>
              {(['all', 'student', 'industry', 'institution'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setLogRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    logRoleFilter === r
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : `${r} Logins`}
                </button>
              ))}
            </div>
          </div>

          {/* Logs Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Login Timestamp</th>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Profile Type</th>
                    <th className="py-3 px-4">Client Device Name</th>
                    <th className="py-3 px-4">Location & IP</th>
                    <th className="py-3 px-4">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        No login records found matching query.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const dateObj = new Date(log.timestamp);
                      const formattedDate = dateObj.toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      });
                      const formattedTime = dateObj.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      });

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{formattedDate}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{formattedTime}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{log.user_name}</div>
                            <div className="text-[11px] text-slate-500">{log.user_email}</div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                log.role === 'student'
                                  ? 'bg-blue-100 text-blue-800'
                                  : log.role === 'industry'
                                  ? 'bg-purple-100 text-purple-800'
                                  : log.role === 'institution'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-800 text-white'
                              }`}
                            >
                              {log.role}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              {log.device_name.toLowerCase().includes('mobile') || log.device_name.toLowerCase().includes('phone') ? (
                                <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              ) : (
                                <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span>{log.device_name}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 font-medium text-slate-800">
                              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>{log.location}</span>
                            </div>
                            {log.ip_address && (
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                IP: {log.ip_address}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{log.status || 'Success'}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECURE ADMIN-ONLY CERTIFICATE VIEWER MODAL */}
      {/* ============================================================ */}
      {inspectingItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-black text-sm">Regulatory Proof Audit & Verification</h3>
                  <p className="text-[11px] text-slate-300">{inspectingItem.organization} ({inspectingItem.role})</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* DRM / NON-SHAREABLE CONFIDENTIALITY NOTICE BANNER */}
            <div className="bg-amber-50 p-3 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">CONFIDENTIAL ADMIN INFORMATION - STRICTLY VIEW ONLY</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  These regulatory proofs are restricted solely to the Platform Administrator. Admin is strictly prohibited from sharing, exporting, or transmitting these documents externally.
                </p>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Authorized Representative:</span>
                  <span className="font-bold text-slate-900">{inspectingItem.name} ({inspectingItem.title})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Official Contact:</span>
                  <span className="font-bold text-slate-900">{inspectingItem.email} • {inspectingItem.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Official Website:</span>
                  <a href={inspectingItem.website} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline truncate max-w-xs">
                    {inspectingItem.website || 'N/A'}
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Submitted Government / Regulatory Certificates
                </h4>

                {inspectingItem.certificates?.map((c, i) => (
                  <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                    <div className="p-3 bg-white border-b border-slate-200 flex justify-between items-center">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{c.docName}</h5>
                        <p className="text-[11px] text-slate-500">{c.issuingAuthority}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                        {c.certNumber}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col items-center justify-center bg-slate-100/60 relative">
                      {/* Non-share watermark overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 rotate-[-12deg]">
                        <span className="text-2xl font-black text-slate-900 uppercase">
                          CAREER SYNC • ADMIN CONFIDENTIAL
                        </span>
                      </div>

                      <img
                        src={c.fileUrl}
                        alt={c.docName}
                        className="max-h-64 rounded-lg object-contain shadow-md border border-slate-200"
                      />
                      <p className="text-[10px] text-slate-400 mt-2">
                        Issued: {c.issueDate} • Digital Cryptographic Fingerprint Validated
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold"
              >
                Close Viewer
              </button>

              <button
                type="button"
                onClick={() => handleApprove(inspectingItem)}
                disabled={actionLoadingId === inspectingItem.id}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Certificates & Issue Credentials Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REJECT MODAL */}
      {/* ============================================================ */}
      {rejectingItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">
              Reject Verification: {rejectingItem.organization}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please specify the audit reason. This explanation will be included in the official notification email dispatched to <strong>{rejectingItem.email}</strong>.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Submitted certificate was not issued by an authorized regulatory body or registration number could not be validated."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setRejectingItem(null); setRejectReason(''); }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoadingId === rejectingItem.id}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Rejection & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
