'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCivicStore } from '@/store/useCivicStore';
import { getStatusBadgeInfo, getPriorityBadgeInfo, formatRelativeTime } from '@/lib/utils';
import { 
  Building2, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  UserPlus, 
  Eye, 
  Filter,
  Check
} from 'lucide-react';

export default function OfficialPortalPage() {
  const { complaints, workers, departments, verifyComplaint, assignComplaint, currentUser } = useCivicStore();

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [assigningComplaintId, setAssigningComplaintId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || '');
  const [assignNotes, setAssignNotes] = useState<string>('');

  const filtered = complaints.filter((c) => {
    if (selectedStatus === 'ALL') return true;
    return c.status === selectedStatus;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningComplaintId || !selectedWorkerId) return;
    assignComplaint(assigningComplaintId, selectedWorkerId, assignNotes);
    setAssigningComplaintId(null);
    setAssignNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-black tracking-tight">Municipal Command & Assignment Queue</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official: <strong>{currentUser.firstName} {currentUser.lastName}</strong> ({currentUser.role})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/official/workers"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
          >
            <Users className="w-4 h-4 text-sky-400" />
            Manage Field Crews ({workers.length})
          </Link>
        </div>
      </div>

      {/* Queue Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'REPORT_SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REOPENED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? `All Tickets (${complaints.length})` : `${getStatusBadgeInfo(st as any).label} (${complaints.filter(c => c.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Operations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Ticket #</th>
                <th className="px-4 py-3.5">Problem / Location</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">SLA Countdown</th>
                <th className="px-4 py-3.5">Assigned Worker</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                    {c.complaintNumber}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-bold text-slate-900 truncate">{c.title}</div>
                    <div className="text-[11px] text-slate-500 truncate">📍 {c.address}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeInfo(c.priority).color}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeInfo(c.status).color}`}>
                      {getStatusBadgeInfo(c.status).label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{formatRelativeTime(c.slaDeadline)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {c.assignedWorkerName ? (
                      <span className="font-bold text-slate-800">{c.assignedWorkerName}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1.5">
                    {c.status === 'REPORT_SUBMITTED' && (
                      <button
                        onClick={() => verifyComplaint(c.id, departments[0].id)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Verify
                      </button>
                    )}

                    {(c.status === 'REPORT_SUBMITTED' || c.status === 'VERIFIED' || c.status === 'REOPENED') && (
                      <button
                        onClick={() => setAssigningComplaintId(c.id)}
                        className="bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors shadow-sm"
                      >
                        Assign Crew
                      </button>
                    )}

                    <Link
                      href={`/citizen/complaints/${c.id}`}
                      className="inline-block p-1 text-slate-400 hover:text-slate-700"
                      title="Inspect"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {assigningComplaintId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAssignSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Dispatch Field Worker</h3>
            <p className="text-xs text-slate-500">
              Select the nearest specialized field worker for rapid deployment.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Available Field Crews</label>
              <div className="space-y-2">
                {workers.map((w) => (
                  <label
                    key={w.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedWorkerId === w.id
                        ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="worker"
                        value={w.id}
                        checked={selectedWorkerId === w.id}
                        onChange={() => setSelectedWorkerId(w.id)}
                        className="text-sky-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{w.name}</div>
                        <div className="text-[11px] text-slate-500">{w.specialization}</div>
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="font-bold text-emerald-600">★ {w.rating}</span>
                      <div className="text-slate-400">{w.completedTasks} done</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Dispatch Instructions / Notes</label>
              <textarea
                rows={2}
                placeholder="Bring asphalt compaction tamper and hazard cones..."
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssigningComplaintId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md"
              >
                Confirm Dispatch Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
