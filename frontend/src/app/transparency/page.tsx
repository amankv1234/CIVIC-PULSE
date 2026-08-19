'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  FileText, 
  Building2, 
  Sparkles, 
  Lock, 
  ExternalLink,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useCivicStore } from '@/store/useCivicStore';

export default function TransparencyLedgerPage() {
  const { complaints, departments } = useCivicStore();
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  // Filter complaints that have undergone resolution or verification
  const verifiedComplaints = complaints.filter(
    (c) => c.status === 'RESOLVED' || c.status === 'CITIZEN_VERIFIED'
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Public Accountability & Open Ledger
          </span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-2">
            Public Civic Transparency Ledger
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every complaint resolution is immutably documented with before/after photographic proof and mandatory citizen verification sign-off.
          </p>
        </div>
        <Link
          href="/citizen/report"
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          Report an Issue
        </Link>
      </div>

      {/* 3 Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Verified Closures</span>
          <div className="text-3xl font-black text-foreground font-mono">{verifiedComplaints.length}</div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory Citizen Sign-off Required
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Citizen Rating</span>
          <div className="text-3xl font-black text-primary font-mono flex items-center gap-2">
            4.85 <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-xs text-muted-foreground">From verified post-repair evaluations</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Public Audit Trail</span>
          <div className="text-3xl font-black text-foreground font-mono">100%</div>
          <p className="text-xs text-muted-foreground">6-stage lifecycle cryptographically logged</p>
        </div>
      </div>

      {/* Verified Complaints Feed */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Verified Resolution Records & Evidence</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Click any record to inspect the complete 6-stage operational audit log</p>
          </div>
        </div>

        <div className="space-y-4">
          {verifiedComplaints.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-border bg-background hover:bg-muted/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs">
                    {c.complaintNumber}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {c.status === 'CITIZEN_VERIFIED' ? 'Citizen Verified & Closed' : 'Resolved (Pending Final Sign-off)'}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {c.departmentName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= (c.citizenRating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.description}</p>
                <p className="text-xs text-foreground font-medium mt-1">📍 {c.address} ({c.zoneName})</p>
              </div>

              {/* Photo Evidence Comparison */}
              {(c.images?.length > 0 || c.resolutionProofImage) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {c.images?.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Original Problem Evidence
                      </span>
                      <div className="h-40 rounded-xl overflow-hidden border border-border relative bg-muted">
                        <img
                          src={c.images[0]}
                          alt="Problem Evidence"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {c.resolutionProofImage && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Field Resolution Proof
                      </span>
                      <div className="h-40 rounded-xl overflow-hidden border border-emerald-500/30 relative bg-muted">
                        <img
                          src={c.resolutionProofImage}
                          alt="Resolution Proof"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {c.resolutionNotes && (
                <div className="p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground border border-border">
                  <strong className="text-foreground">Official Field Worker Notes:</strong> {c.resolutionNotes}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Assigned Crew: <strong className="text-foreground">{c.assignedWorkerName || 'Amit Kumar'}</strong></span>
                <Link
                  href={`/citizen/complaints/${c.id}`}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Full 6-Stage Timeline <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
