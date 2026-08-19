'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  ShieldCheck, 
  FileText, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Coins, 
  BadgeCheck, 
  Plus, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useCivicStore } from '@/store/useCivicStore';
import { MinistryDirective } from '@/types';

export default function MinistryDashboardPage() {
  const { ministries, ministryDirectives, departments, cityHealth, currentUser } = useCivicStore();
  
  const [selectedMinistryId, setSelectedMinistryId] = useState(ministries[0]?.id || 'min-mohua');
  const [directivesList, setDirectivesList] = useState<MinistryDirective[]>(ministryDirectives);
  
  // Directive modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'ROUTINE' | 'HIGH_PRIORITY' | 'URGENT_CRISIS'>('HIGH_PRIORITY');
  const [newDeptCode, setNewDeptCode] = useState('ROADS');

  const activeMinistry = ministries.find((m) => m.id === selectedMinistryId) || ministries[0];

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const directive: MinistryDirective = {
      id: `dir-${Date.now()}`,
      ministryId: activeMinistry.id,
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      issuedAt: new Date().toISOString(),
      targetDepartmentCode: newDeptCode,
      status: 'PENDING_ACKNOWLEDGEMENT',
    };

    setDirectivesList([directive, ...directivesList]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Landmark className="w-4 h-4 text-indigo-400" />
            Apex State & Central Ministerial Command
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ministry of Urban Affairs & DLB Governance
          </h1>
          <p className="text-indigo-100/80 text-sm leading-relaxed">
            Statutory municipal audit oversight, capital grant allocations, DigiLocker verified official rosters, and state policy compliance benchmarking.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/verify-authority"
              className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <BadgeCheck className="w-4 h-4 text-blue-600" /> Verify Officer Credentials
            </Link>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Issue Ministerial Directive
            </button>
          </div>
        </div>
        <div className="absolute right-6 -bottom-10 opacity-10 pointer-events-none">
          <Building2 className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Ministry Switcher & Overview Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          {ministries.map((min) => (
            <button
              key={min.id}
              onClick={() => setSelectedMinistryId(min.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                selectedMinistryId === min.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{min.name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20 font-mono">{min.jurisdiction}</span>
            </button>
          ))}
        </div>

        {/* Selected Ministry Details */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="space-y-1 md:col-span-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{activeMinistry.code}</span>
            <h2 className="text-xl font-bold text-foreground">{activeMinistry.name}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {activeMinistry.description}
            </p>
            <div className="pt-2 text-xs text-muted-foreground space-y-0.5">
              <div>Minister-in-Charge: <strong className="text-foreground">{activeMinistry.ministerInCharge}</strong></div>
              <div>Principal Secretary: <strong className="text-foreground">{activeMinistry.secretaryName}</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Allocated Capital Grants</span>
            <div className="text-2xl font-black text-foreground font-mono">₹{activeMinistry.totalAllocatedBudgetCr} Cr</div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Smart Cities Mission 2.0
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">State Compliance Index</span>
            <div className="text-2xl font-black text-primary font-mono">{activeMinistry.complianceRating}%</div>
            <p className="text-xs text-muted-foreground">Statutory Audit Rating</p>
          </div>
        </div>
      </div>

      {/* Ministerial Directives Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Active Ministerial Directives & Mandates</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Policy orders issued to Jaipur Municipal departments</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New Directive
          </button>
        </div>

        <div className="space-y-3">
          {directivesList.map((dir) => (
            <div
              key={dir.id}
              className="p-5 rounded-2xl border border-border bg-background hover:bg-muted/30 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    dir.priority === 'URGENT_CRISIS'
                      ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                      : dir.priority === 'HIGH_PRIORITY'
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                      : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  }`}>
                    {dir.priority.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground font-semibold">
                    Target Dept: {dir.targetDepartmentCode}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {dir.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">{dir.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{dir.description}</p>
              </div>

              <div className="text-[11px] text-muted-foreground border-t border-border pt-2 flex items-center justify-between">
                <span>Issued on {new Date(dir.issuedAt).toLocaleDateString()}</span>
                <span className="text-primary font-semibold">Statutory Authority: Gazette Act §48</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capital Budget Utilization Matrix */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-foreground">Departmental Capital Fund Distribution (FY 2026-27)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="p-4 rounded-xl border border-border bg-background space-y-2">
              <span className="text-xs font-bold text-foreground truncate block">{dept.name}</span>
              <div className="text-xl font-bold font-mono text-primary">₹{dept.totalBudgetCr || 45} Cr</div>
              <p className="text-[11px] text-muted-foreground">Authorized Workforce: {dept.workforceCount || 120} personnel</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Issuing New Directive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" /> Issue Ministerial Policy Directive
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDirective} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                  Directive Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mandatory 24-Hour Pipeline Burst Repair SLA"
                  className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                    Target Department *
                  </label>
                  <select
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.code}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                    Urgency Priority *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="ROUTINE">Routine Compliance</option>
                    <option value="HIGH_PRIORITY">High Priority Mandate</option>
                    <option value="URGENT_CRISIS">Urgent Crisis Protocol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                  Operational Guidelines & Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specify statutory timelines, workforce deployments, and penalty terms..."
                  className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 shadow-sm"
                >
                  Publish Gazetted Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
