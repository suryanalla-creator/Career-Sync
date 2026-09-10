import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Building,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { mockPlacementDrives } from '../../data/mockData';
import { PlacementDrive } from '../../types';
import { api } from '../../services/api';

export const PlacementManagementView: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>(mockPlacementDrives);
  const [activeTab, setActiveTab] = useState<
    'All' | 'Upcoming' | 'Active' | 'Completed' | 'Placed Students' | 'Unplaced Students'
  >('All');

  useEffect(() => {
    api.common.getPlacements().then((res: any) => {
      if (Array.isArray(res) && res.length > 0) {
        setDrives(res);
      }
    }).catch(err => {
      console.warn('Could not load placement drives from API:', err);
    });
  }, []);

  const totalOffers = drives.reduce((sum, d) => sum + (d.offers || 0), 0);
  const totalEligible = drives.reduce((sum, d) => sum + (d.totalEligible || 0), 0);
  const totalApplied = drives.reduce((sum, d) => sum + (d.applied || 0), 0);

  const filteredDrives = drives.filter(d => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return d.status === 'Upcoming';
    if (activeTab === 'Active') return d.status === 'Active';
    if (activeTab === 'Completed') return d.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1 border border-emerald-100">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Central Placement Cell
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Campus Placement Drives ({drives.length} Drives Active & Scheduled)
          </h1>
          <p className="text-xs text-slate-500">
            Monitor on-campus and virtual hiring drives, recruitment funnels, and spot offer disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block">Total Offers Secured</span>
            <span className="text-lg font-black text-emerald-600">{totalOffers} Offers</span>
          </div>
        </div>
      </div>

      {/* Global Recruitment Funnel Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Campus Recruitment Lifecycle Conversion Funnel
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-center">
          {[
            { stage: 'Eligible Pool', count: '1,690', color: 'bg-slate-100 text-slate-800' },
            { stage: 'Applied', count: '1,273', color: 'bg-blue-50 text-blue-800' },
            { stage: 'Shortlisted', count: '217', color: 'bg-indigo-50 text-indigo-800' },
            { stage: 'Interviews', count: '88', color: 'bg-purple-50 text-purple-800' },
            { stage: 'Offers Given', count: '52', color: 'bg-emerald-50 text-emerald-800' },
            { stage: 'Joined / PPO', count: '35', color: 'bg-teal-50 text-teal-800' }
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-2xl border border-slate-200/60 ${item.color}`}>
              <p className="text-xl font-black">{item.count}</p>
              <span className="text-[10px] font-bold block mt-0.5">{item.stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {['All', 'Active', 'Upcoming', 'Completed', 'Placed Students', 'Unplaced Students'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img src={drive.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{drive.company}</h3>
                    <p className="text-xs font-bold text-blue-700">{drive.role}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  drive.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : drive.status === 'Upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {drive.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">CTC Compensation</span>
                  <span className="font-black text-slate-800">{drive.salaryPackage}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-medium block">Drive Dates</span>
                  <span className="font-semibold text-slate-700">{drive.driveDate}</span>
                </div>
              </div>

              {/* Recruitment metrics mini grid */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Eligible</span>
                  <span className="font-bold text-slate-800">{drive.totalEligible}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Applied</span>
                  <span className="font-bold text-slate-800">{drive.applied}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Interviews</span>
                  <span className="font-bold text-blue-600">{drive.interviews}</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 block font-bold">Offers</span>
                  <span className="font-black text-emerald-800">{drive.offers}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Branches: {drive.eligibleBranches.join(', ')}</span>
              <button
                onClick={() => alert(`Reviewing candidate shortlists for ${drive.company}`)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
              >
                Manage Drive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
