'use client';

import React from 'react';
import Link from 'next/link';
import { useCivicStore } from '@/store/useCivicStore';
import { InteractiveCityMap } from '@/components/map/InteractiveCityMap';
import { CityHealthCard } from '@/components/dashboard/CityHealthCard';
import { WhatIfSimulator } from '@/components/admin/WhatIfSimulator';
import { getStatusBadgeInfo, getPriorityBadgeInfo, formatRelativeTime } from '@/lib/utils';
import { 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function HomePage() {
  const { complaints, departments, workers, healthScore } = useCivicStore();

  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CITIZEN_VERIFIED').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;

  return (
    <div className="space-y-8">
      {/* Hero Banner with Call-to-Action */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            Live Municipal Operations Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Turning Jaipur City Problems into Real-Time Action.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Report civic issues in under 30 seconds with automatic GPS pin-drop, track field worker deployment in real time, and verify completion before closure.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link
              href="/citizen/report"
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-sky-500/30 scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              Report an Issue Now
            </Link>

            <Link
              href="/official"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-slate-700"
            >
              Official Command Queue
            </Link>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="currentColor">
            <polygon points="100,10 40,198 190,78 10,78 160,198" />
          </svg>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Total Reported</div>
            <div className="text-2xl font-black text-slate-900">{totalComplaints}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">In Progress</div>
            <div className="text-2xl font-black text-slate-900">{inProgressCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Resolved</div>
            <div className="text-2xl font-black text-slate-900">{resolvedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Active Field Fleet</div>
            <div className="text-2xl font-black text-slate-900">{workers.length} crews</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Health Index (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              Live City GIS Heatmap & Fleet Radar
            </h2>
            <span className="text-xs text-slate-500">Real-time GPS coordinates</span>
          </div>

          <InteractiveCityMap complaints={complaints} workers={workers} height="480px" />
        </div>

        <div className="lg:col-span-4">
          <CityHealthCard />
        </div>
      </div>

      {/* Recent Issues Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Live Civic Operations Feed</h3>
            <p className="text-xs text-slate-500">Recent complaints, status updates, and field progress</p>
          </div>
          <Link
            href="/citizen"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            View All Reports <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.slice(0, 4).map((c) => (
            <div key={c.id} className="border border-slate-100 hover:border-slate-300 rounded-xl p-4 transition-all bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{c.complaintNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeInfo(c.priority).color}`}>
                    {c.priority}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{c.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 text-xs">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeInfo(c.status).color}`}>
                  {getStatusBadgeInfo(c.status).label}
                </span>
                <Link
                  href={`/citizen/complaints/${c.id}`}
                  className="font-bold text-sky-600 hover:text-sky-700 text-xs"
                >
                  Inspect Trail →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What-If Simulator Section */}
      <WhatIfSimulator />
    </div>
  );
}
