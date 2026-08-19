'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Users, 
  ShieldCheck, 
  Activity, 
  Droplets, 
  Trash2, 
  Phone, 
  Building2, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useCivicStore } from '@/store/useCivicStore';

export default function CityZonesPage() {
  const { zones, complaints, setZoneFilter } = useCivicStore();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const activeZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const activeZoneComplaints = complaints.filter(c => c.zoneId === activeZone.id);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <MapPin className="w-3.5 h-3.5" /> Zonal Wards & Geographic Contrast
          </span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-2">
            Jaipur Municipal Zones Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep-dive infrastructure contrast, population density, water supply index, and active issue counts across all 5 administrative zones.
          </p>
        </div>
        <Link
          href="/city/radar"
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          View on GIS Map <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 5 Zone Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const isSelected = activeZone.id === zone.id;
          const density = Math.round(zone.population / zone.areaSqkm);
          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                isSelected
                  ? 'bg-card border-primary shadow-md ring-2 ring-primary/20'
                  : 'bg-card hover:bg-muted/40 border-border shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">{zone.code}</span>
                  <h3 className="text-lg font-bold text-foreground">{zone.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary font-mono">{zone.healthScore}</span>
                  <span className="text-[10px] text-muted-foreground block">Health Score</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{(zone.population / 1000).toFixed(0)}k Residents</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{zone.areaSqkm} km² ({density}/km²)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>{zone.waterSupplyCoveragePct || 95}% Water Grid</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trash2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{zone.sanitationFrequencyPerWeek || 7}x / week Waste</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Open Issues: <strong className="text-foreground">{zone.openIssuesCount}</strong></span>
                <span className="text-primary flex items-center gap-1">
                  Inspect Zone <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Zone Deep Dive Panel */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Detailed Zonal Profile</span>
            <h2 className="text-2xl font-black text-foreground">{activeZone.name}</h2>
            <p className="text-xs text-muted-foreground">
              Administrative Head: <strong className="text-foreground">{activeZone.zonalOfficerName || 'Zonal Officer'}</strong> • Contact: <span className="font-mono">{activeZone.zonalOfficeContact || '+91-141-2741100'}</span>
            </p>
          </div>
          <Link
            href={`/citizen/report`}
            onClick={() => setZoneFilter(activeZone.id)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all self-start sm:self-auto"
          >
            File Complaint in {activeZone.name}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Demographics & Density</span>
            <div className="text-2xl font-black text-foreground">{activeZone.population.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Spread across {activeZone.areaSqkm} square kilometers with a density of {Math.round(activeZone.population / activeZone.areaSqkm)} citizens per km².
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Utility Infrastructure</span>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Piped Water Coverage:</span>
                <span className="font-bold text-foreground font-mono">{activeZone.waterSupplyCoveragePct || 96}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solid Waste Collection:</span>
                <span className="font-bold text-foreground font-mono">{activeZone.sanitationFrequencyPerWeek || 7} days/week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Critical Road Faults:</span>
                <span className="font-bold text-red-600 font-mono">{activeZone.criticalPotholesCount || 3} active</span>
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Operational Queue</span>
            <div className="text-2xl font-black text-foreground">{activeZoneComplaints.length} Tickets</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Currently routed to dispatch. Verified complaints undergo 24-48h SLA resolution protocols.
            </p>
          </div>
        </div>

        {/* Complaints in this zone */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Active Complaints in {activeZone.name}</h3>
          {activeZoneComplaints.length > 0 ? (
            <div className="space-y-2">
              {activeZoneComplaints.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary font-bold">{c.complaintNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-600' : 'bg-orange-500/10 text-orange-600'
                      }`}>
                        {c.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mt-0.5">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">{c.address}</p>
                  </div>
                  <Link
                    href={`/citizen/complaints/${c.id}`}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted self-start sm:self-auto"
                  >
                    View 6-Stage Trail
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No active complaints filed in this zone currently.</p>
          )}
        </div>
      </div>

    </div>
  );
}
