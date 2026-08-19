'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCivicStore } from '@/store/useCivicStore';
import { getStatusBadgeInfo, getPriorityBadgeInfo, formatRelativeTime } from '@/lib/utils';
import { 
  HardHat, 
  Play, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Camera, 
  Upload, 
  Navigation,
  Eye
} from 'lucide-react';

export default function WorkerPortalPage() {
  const { 
    complaints, 
    currentUser, 
    workerStartTask, 
    workerResolveTask 
  } = useCivicStore();

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string>(
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=80'
  );
  const [workNotes, setWorkNotes] = useState<string>('Filled with 200kg cold-mix asphalt, leveled and steam-roller compacted.');

  // Filter tasks assigned to worker or show sample assigned items
  const myTasks = complaints.filter(
    (c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS' || c.status === 'RESOLVED' || c.status === 'CITIZEN_VERIFIED'
  );

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingId) return;
    workerResolveTask(resolvingId, proofUrl, workNotes);
    setResolvingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mobile Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-black">
            <HardHat className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Field Crew Duty Terminal</h1>
            <p className="text-xs text-amber-300 font-medium">
              Operator: {currentUser.firstName} {currentUser.lastName} (Roads Maintenance Crew)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
          <div className="bg-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Active Orders</span>
            <span className="text-lg font-black text-amber-400">
              {myTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length}
            </span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Completed Today</span>
            <span className="text-lg font-black text-emerald-400">
              {myTasks.filter(t => t.status === 'RESOLVED' || t.status === 'CITIZEN_VERIFIED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
          Assigned Work Orders ({myTasks.length})
        </h2>

        {myTasks.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-slate-400">{t.complaintNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeInfo(t.priority).color}`}>
                    {t.priority}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{t.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{t.description}</p>
              </div>

              <span className={`px-2.5 py-1 rounded text-[11px] font-bold border flex-shrink-0 ${getStatusBadgeInfo(t.status).color}`}>
                {getStatusBadgeInfo(t.status).label}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                <span>Landmark: {t.landmark || 'N/A'}</span>
                <span>•</span>
                <span>SLA Due: {formatRelativeTime(t.slaDeadline)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/citizen/complaints/${t.id}`}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View Ticket
              </Link>

              <div className="flex gap-2">
                {t.status === 'ASSIGNED' && (
                  <button
                    onClick={() => workerStartTask(t.id)}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Start Repair Work
                  </button>
                )}

                {t.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => setResolvingId(t.id)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all animate-pulse"
                  >
                    <Camera className="w-3.5 h-3.5" /> Submit Proof & Resolve
                  </button>
                )}

                {(t.status === 'RESOLVED' || t.status === 'CITIZEN_VERIFIED') && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Work Complete
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proof Submission Modal */}
      {resolvingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleResolveSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              Upload Completion Proof
            </h3>
            <p className="text-xs text-slate-500">
              Attach photographic evidence showing the repaired site for mandatory citizen verification.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Evidence Photo URL</label>
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
              />
              <div className="mt-2 h-36 rounded-xl overflow-hidden border border-slate-200">
                <img src={proofUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Work Notes / Materials Used</label>
              <textarea
                rows={2}
                required
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolvingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
              >
                Submit Resolution Proof
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
