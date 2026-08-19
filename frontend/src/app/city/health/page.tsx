'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight,
  Droplets,
  Trash2,
  Lightbulb,
  Zap,
  Waves,
  Trees,
  HardHat
} from 'lucide-react';
import { useCivicStore } from '@/store/useCivicStore';

export default function CityHealthPage() {
  const { cityHealth, departments, zones, complaints } = useCivicStore();

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CITIZEN_VERIFIED').length;
  const criticalCount = complaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'CITIZEN_VERIFIED').length;

  const departmentIcons: Record<string, any> = {
    ROADS: Activity,
    SANITATION: Trash2,
    WATER: Droplets,
    DRAINAGE: Waves,
    ELECTRICAL: Zap,
    TRAFFIC: AlertTriangle,
    PARKS: Trees,
    EMERGENCY: HardHat,
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header & Pillar Overview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Activity className="w-3.5 h-3.5" /> Live Municipal Health Telemetry
            </span>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-2">
              City Health Score Index & SLA Matrix
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-pillar mathematical index computed dynamically from SLA adherence, resolution speed, citizen ratings, and zonal backlog.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/city/radar"
              className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold hover:bg-muted transition-all flex items-center gap-1.5"
            >
              Open GIS Radar <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/citizen/report"
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              Report Issue
            </Link>
          </div>
        </div>

        {/* 4 Core Health Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall Health Score</span>
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-foreground">{cityHealth.overallScore} / 100</div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +2.4% vs last municipal quarter
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SLA Adherence Rate</span>
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-foreground">{cityHealth.metrics.slaComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">Within 24h - 48h statutory deadline</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Resolution Speed</span>
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-foreground">{cityHealth.metrics.averageResolutionTimeHours} hrs</div>
            <p className="text-xs text-purple-600 font-semibold">Down from 36.2 hrs prior</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Citizen Satisfaction</span>
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-foreground">{cityHealth.metrics.citizenSatisfactionRate}%</div>
            <p className="text-xs text-muted-foreground">Based on verified 5-star citizen ratings</p>
          </div>
        </div>
      </div>

      {/* Algorithmic Formula Callout */}
      <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-2">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Mathematical Index Formulation
        </h3>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          City Health Index = (SLA Compliance % × 0.35) + (Speed Score × 0.25) + (Citizen Satisfaction × 0.25) + (Backlog Health × 0.15)
        </p>
      </div>

      {/* Department SLA Matrix Table */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Department Performance & SLA Adherence</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Live operational contrast across all 8 municipal departments</p>
          </div>
          <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-semibold">
            {departments.length} Municipal Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-bold uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Department Head</th>
                <th className="py-3 px-4">Active Queue</th>
                <th className="py-3 px-4">Resolved Total</th>
                <th className="py-3 px-4">SLA Compliance</th>
                <th className="py-3 px-4">Workforce</th>
                <th className="py-3 px-4">Annual Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departments.map((dept) => {
                const Icon = departmentIcons[dept.code] || Activity;
                const sla = dept.slaComplianceRate || 90;
                return (
                  <tr key={dept.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: dept.colorHex }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span>{dept.name}</span>
                        <span className="block text-[11px] font-mono text-muted-foreground font-normal">{dept.code}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground block">{dept.headName}</span>
                      <span>{dept.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {dept.activeComplaintsCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">
                      {dept.resolvedCount || 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sla >= 90 ? 'bg-emerald-500' : sla >= 80 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${sla}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold font-mono">{sla}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      {dept.workforceCount || 120} crew
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-semibold text-foreground">
                      ₹{dept.totalBudgetCr || 45} Cr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zonal Contrast Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-foreground text-base">Zonal Health Rankings</h3>
          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{zone.name}</h4>
                  <p className="text-xs text-muted-foreground">Population: {(zone.population / 1000).toFixed(0)}k • Area: {zone.areaSqkm} km²</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-primary font-mono">{zone.healthScore}</span>
                  <span className="text-[10px] text-muted-foreground block">Health Index</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-foreground text-base">Key Operational Insights</h3>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>C-Scheme & Civil Lines</strong> maintains the highest SLA score (94/100) due to high sensor density and rapid worker response times.</span>
            </li>
            <li className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Walled City (Heritage)</strong> experiences highest complaint density due to heritage underground drainage congestion. Priority routing active.</span>
            </li>
            <li className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Electrical & Water Departments</strong> have achieved a 96% and 95% SLA adherence respectively following smart meter deployments.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
