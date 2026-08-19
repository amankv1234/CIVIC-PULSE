'use client';

import React from 'react';
import { useCivicStore } from '@/store/useCivicStore';
import { HardHat, Phone, Mail, Award, CheckCircle2, Navigation, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function WorkersFleetPage() {
  const { workers } = useCivicStore();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Municipal Field Crew Fleet</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time tracking of deployed maintenance teams and equipment</p>
        </div>
        <Link
          href="/official"
          className="text-xs font-bold text-sky-600 bg-sky-50 px-3.5 py-2 rounded-xl"
        >
          ← Return to Queue
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workers.map((w) => (
          <div key={w.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base border border-amber-200">
                  <HardHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{w.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{w.employeeId} • {w.departmentName}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Active / Available
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div><strong>Specialization:</strong> {w.specialization}</div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>GPS: {w.latitude.toFixed(4)}, {w.longitude.toFixed(4)} (Jaipur)</span>
              </div>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {w.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {w.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Rating</span>
                <span className="font-bold text-amber-600">★ {w.rating}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Total Assigned</span>
                <span className="font-bold text-slate-800">{w.totalTasks}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Completed</span>
                <span className="font-bold text-emerald-600">{w.completedTasks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
