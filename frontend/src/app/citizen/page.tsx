'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCivicStore } from '@/store/useCivicStore';
import { getStatusBadgeInfo, getPriorityBadgeInfo, formatRelativeTime } from '@/lib/utils';
import { PlusCircle, Search, Filter, Eye, ThumbsUp } from 'lucide-react';

export default function CitizenPortalPage() {
  const { complaints, upvoteComplaint } = useCivicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Citizen Problem Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track all submitted civic complaints, monitor worker progress, and verify resolutions.
          </p>
        </div>

        <Link
          href="/citizen/report"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          Report New Problem
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, #ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'REPORT_SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'CITIZEN_VERIFIED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Issues' : getStatusBadgeInfo(st as any).label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComplaints.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo Evidence Thumbnail if available */}
              {c.images && c.images.length > 0 && (
                <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={c.images[0]}
                    alt={c.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold shadow ${getPriorityBadgeInfo(c.priority).color}`}>
                    {c.priority}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>{c.complaintNumber}</span>
                <span>{formatRelativeTime(c.createdAt)}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                {c.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{c.description}</p>
              
              <div className="text-[11px] text-slate-500 mt-2">
                📍 {c.address}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeInfo(c.status).color}`}>
                {getStatusBadgeInfo(c.status).label}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => upvoteComplaint(c.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-sky-600 px-2 py-1 rounded bg-slate-50 border border-slate-200"
                  title="Confirm / Upvote issue"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{c.upvotes || 0}</span>
                </button>

                <Link
                  href={`/citizen/complaints/${c.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
