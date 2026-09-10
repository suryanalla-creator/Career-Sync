import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Building,
  Calendar,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  Plus,
  ArrowRight,
  Zap,
  Globe,
  FileText,
  X,
  Download,
  ShieldCheck,
  Clock,
  Briefcase,
  Check,
  Cpu,
  Bookmark
} from 'lucide-react';
import { mockCollaborationInitiatives } from '../../data/mockData';
import { CollaborationInitiative } from '../../types';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const IndustryCollaborationHubView: React.FC = () => {
  const { triggerConfetti } = useApp();
  const [collaborations, setCollaborations] = useState<CollaborationInitiative[]>(mockCollaborationInitiatives);
  const [selectedType, setSelectedType] = useState('All');
  const [inspectedAgreement, setInspectedAgreement] = useState<CollaborationInitiative | null>(null);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  // New MoU form states
  const [newTitle, setNewTitle] = useState('');
  const [newPartner, setNewPartner] = useState('');
  const [newType, setNewType] = useState<'Industry Partnership' | 'Research' | 'Mentorship' | 'Workshop' | 'Live Project'>('Industry Partnership');
  const [newDuration, setNewDuration] = useState('3 Years MoU');
  const [newImpact, setNewImpact] = useState('150 Students Trained, 10 Research Internships');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    api.common.getCollaborations().then((res: any) => {
      if (Array.isArray(res) && res.length > 0) {
        setCollaborations(res);
      }
    }).catch(err => {
      console.warn('Could not load collaborations from API, using fallback:', err);
    });
  }, []);

  const types = [
    'All',
    'Industry Partnership',
    'Research',
    'Mentorship',
    'Workshop',
    'Live Project',
    'Industrial Visit'
  ];

  const filteredCollabs = collaborations.filter(c => {
    if (selectedType === 'All') return true;
    return c.type.toLowerCase() === selectedType.toLowerCase();
  });

  const handleCreateMoU = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPartner) return;

    const newItem: CollaborationInitiative = {
      id: `collab-${Date.now()}`,
      title: newTitle,
      partnerOrganization: newPartner,
      type: newType,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      institution: 'Apex Institute of Technology',
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      duration: newDuration,
      status: 'MOU Signed',
      leadCoordinator: 'Dean of Industry Relations & Placement Cell',
      impactMetrics: newImpact,
      description: newDesc || `Strategic academia-industry collaboration establishing direct student internship pipelines, funded computing labs, and co-designed curriculum electives.`
    };

    setCollaborations(prev => [newItem, ...prev]);
    setIsProposeModalOpen(false);
    triggerConfetti();
    setInspectedAgreement(newItem);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <Handshake className="w-3.5 h-3.5 text-blue-600" />
            Strategic Alliances &amp; MoUs
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Industry Collaboration &amp; Joint Centers of Excellence
          </h1>
          <p className="text-xs text-slate-500">
            Track corporate MoUs, industry-sponsored computing labs, co-designed curricula, and student internship pipelines.
          </p>
        </div>

        <button
          onClick={() => setIsProposeModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Propose New MoU
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === type
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid of Initiatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCollabs.map((collab) => (
          <div
            key={collab.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <img src={collab.logo} alt="" className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 uppercase">
                      {collab.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{collab.title}</h3>
                    <p className="text-xs font-semibold text-slate-600">{collab.partnerOrganization}</p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 flex-shrink-0">
                  {collab.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">{collab.description}</p>

              {/* Impact Metrics Box */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Demonstrated Outcome Impact
                </span>
                <p className="font-bold text-slate-800">{collab.impactMetrics}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Duration: <strong className="text-slate-700">{collab.duration}</strong>
              </span>
              <button
                onClick={() => setInspectedAgreement(collab)}
                className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all"
              >
                Inspect Agreement <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. AGREEMENT & MOU INSPECTION MODAL */}
      {inspectedAgreement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={inspectedAgreement.logo}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                      {inspectedAgreement.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ {inspectedAgreement.status}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-slate-900 mt-1">{inspectedAgreement.title}</h2>
                  <p className="text-slate-500 font-medium">
                    Corporate Partner: <strong className="text-slate-800">{inspectedAgreement.partnerOrganization}</strong> • Institution: <strong className="text-slate-800">{inspectedAgreement.institution || 'Apex Institute of Technology'}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectedAgreement(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Reference Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MoU Ref Code</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  MOU-2026-APX-{String(inspectedAgreement.id).replace(/\D/g, '').padStart(4, '0') || '9042'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Effective Date</span>
                <span className="font-bold text-slate-800 text-xs">{inspectedAgreement.startDate || '15 Jan 2026'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Validity Term</span>
                <span className="font-bold text-slate-800 text-xs">{inspectedAgreement.duration}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Coordinator</span>
                <span className="font-bold text-slate-800 text-xs line-clamp-1">{inspectedAgreement.leadCoordinator || 'Dean of Academics'}</span>
              </div>
            </div>

            {/* Executive Agreement Summary */}
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
              <h3 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Executive Memorandum of Understanding (MoU) Summary
              </h3>
              <p className="text-slate-700 leading-relaxed text-xs">
                {inspectedAgreement.description}
              </p>
            </div>

            {/* Core Legal Clauses & Commitments */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Key Clauses &amp; Strategic Mutual Commitments
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 block text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    1. Direct Campus Sourcing Pipeline
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Corporate partner commits to conducting on-campus recruitment and fast-tracked interview screening for pre-screened students completing verified training sprints.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 block text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    2. Infrastructure &amp; Lab Sponsorship
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Joint funding allocated for enterprise developer tool licenses, specialized GPU nodes, and real-world proprietary datasets for classroom capstones.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 block text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    3. Joint Research &amp; IP Protection
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Co-authored publications and patent filings shared equally between university faculty researchers and corporate engineering leads.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 block text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    4. Faculty Development &amp; Guest Mentorship
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Bi-weekly guest lectures by industry principal architects and continuous curriculum upgrades aligning with Tier-1 engineering benchmarks.
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Metric Summary */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Measured Outcome Deliverables
                </span>
                <p className="font-bold text-emerald-950 text-sm mt-0.5">
                  {inspectedAgreement.impactMetrics}
                </p>
              </div>
              <Award className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  alert(`Downloading digitally signed MoU document: "MoU_${inspectedAgreement.partnerOrganization.replace(/\s+/g, '_')}_2026.pdf"`);
                  triggerConfetti();
                }}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Signed PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Renewal request sent to ${inspectedAgreement.partnerOrganization} legal & HR council.`);
                    triggerConfetti();
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold cursor-pointer"
                >
                  Request Extension
                </button>
                <button
                  onClick={() => setInspectedAgreement(null)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PROPOSE NEW MOU MODAL */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">Propose Strategic Industry MoU</h2>
                <p className="text-[11px] text-slate-500">Initiate bilateral corporate partnership agreement workflow</p>
              </div>
              <button
                onClick={() => setIsProposeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMoU} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Collaboration / MoU Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex - NVIDIA AI & Deep Learning Center of Excellence"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Partner Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Cloud / NVIDIA"
                    value={newPartner}
                    onChange={(e) => setNewPartner(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Collaboration Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-semibold"
                  >
                    <option value="Industry Partnership">Industry Partnership</option>
                    <option value="Research">Research &amp; Patent Lab</option>
                    <option value="Mentorship">Mentorship &amp; Hackathons</option>
                    <option value="Workshop">Technical Training Workshop</option>
                    <option value="Live Project">Live Capstone Sprints</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration &amp; Term</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Projected Outcome Impact</label>
                  <input
                    type="text"
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Scope &amp; Deliverables</label>
                <textarea
                  rows={3}
                  placeholder="Detail mutual deliverables, sponsored equipment, campus hiring quotas, and curriculum co-design..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Finalize &amp; Propose MoU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
