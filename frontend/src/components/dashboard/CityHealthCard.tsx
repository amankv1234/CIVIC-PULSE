'use client';

import React from 'react';
import { useCivicStore } from '@/store/useCivicStore';
import { Activity, CheckCircle, Clock, HeartHandshake, AlertCircle } from 'lucide-react';

export const CityHealthCard: React.FC = () => {
  const { healthScore, complaints } = useCivicStore();
  const { overallScore, metrics, zoneScores } = healthScore;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-sky-600 bg-sky-50 border-sky-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Jaipur City Health Index</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time algorithmic score calculated from SLA compliance, resolution time & citizen sign-offs
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border font-black text-xl flex items-center gap-1.5 ${getScoreColor(overallScore)}`}>
          <span>{overallScore.toFixed(1)}</span>
          <span className="text-xs font-semibold text-slate-400">/ 100</span>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            SLA Compliance
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">
            {metrics.slaComplianceRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Target: &gt; 90%</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <Clock className="w-4 h-4 text-sky-500" />
            Avg. Resolution
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">
            {metrics.averageResolutionTimeHours} hrs
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Across all depts</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <HeartHandshake className="w-4 h-4 text-purple-500" />
            Citizen Rating
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">
            {metrics.citizenSatisfactionRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Verified resolutions</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Active Bottlenecks
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1">
            {metrics.openCriticalIssues}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Critical issues</p>
        </div>
      </div>

      {/* Zone Performance Breakdown */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Zone Health Breakdown
        </h4>
        <div className="space-y-2">
          {zoneScores.map((z) => (
            <div key={z.zoneId} className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">{z.zoneName}</span>
              <div className="flex items-center gap-3">
                <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${z.score >= 85 ? 'bg-emerald-500' : z.score >= 80 ? 'bg-sky-500' : 'bg-amber-500'}`}
                    style={{ width: `${z.score}%` }}
                  />
                </div>
                <span className="font-bold text-slate-800 w-8 text-right">{z.score.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
