'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Radar, 
  MapPin, 
  Layers, 
  Filter, 
  HardHat, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Activity,
  Plus
} from 'lucide-react';
import { useCivicStore } from '@/store/useCivicStore';
import { InteractiveCityMap } from '@/components/map/InteractiveCityMap';

export default function CityRadarPage() {
  const { 
    complaints, 
    workers, 
    zones, 
    departments,
    selectedZoneFilter,
    setZoneFilter,
    selectedDeptFilter,
    setDeptFilter,
    selectedStatusFilter,
    setStatusFilter
  } = useCivicStore();

  const [selectedComplaintId, setSelectedComplaintId] = useState<string | undefined>(undefined);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (selectedZoneFilter && c.zoneId !== selectedZoneFilter) return false;
    if (selectedDeptFilter && c.departmentId !== selectedDeptFilter) return false;
    if (selectedStatusFilter && c.status !== selectedStatusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Radar className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Jaipur GIS Infrastructure & Fleet Radar</h1>
            <p className="text-xs text-muted-foreground">
              Real-time vector GIS geospatial tracking active municipal complaints, zone clusters & repair crews.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/citizen/report"
            className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Drop Issue Pin
          </Link>
          <Link
            href="/"
            className="px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Zone / Ward Area
          </label>
          <select
            value={selectedZoneFilter || ''}
            onChange={(e) => setZoneFilter(e.target.value || null)}
            className="w-full px-3 py-2 bg-card border border-input rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">All Jaipur Zones ({zones.length})</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Municipal Department
          </label>
          <select
            value={selectedDeptFilter || ''}
            onChange={(e) => setDeptFilter(e.target.value || null)}
            className="w-full px-3 py-2 bg-card border border-input rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">All Departments ({departments.length})</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Resolution Lifecycle Status
          </label>
          <select
            value={selectedStatusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="w-full px-3 py-2 bg-card border border-input rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">All Active Statuses</option>
            <option value="REPORT_SUBMITTED">Report Submitted</option>
            <option value="ASSIGNED">Crew Assigned</option>
            <option value="IN_PROGRESS">In Progress / Field Work</option>
            <option value="RESOLVED">Resolved (Pending Sign-off)</option>
            <option value="CITIZEN_VERIFIED">Citizen Verified & Closed</option>
          </select>
        </div>
      </div>

      {/* Main Map Visual */}
      <div className="space-y-4">
        <InteractiveCityMap
          complaints={filteredComplaints}
          workers={workers}
          selectedComplaintId={selectedComplaintId}
          onSelectComplaint={(id) => setSelectedComplaintId(id)}
          height="620px"
        />
      </div>

      {/* GIS Legend & Live Telemetry Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border text-xs space-y-1">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical Severity Nodes
          </span>
          <p className="text-muted-foreground">
            Automated emergency escalation with &lt;12h statutory resolution threshold.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border text-xs space-y-1">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Active Field Technicians
          </span>
          <p className="text-muted-foreground">
            Live GPS pinged dispatch units with specialized repair equipment and vans.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border text-xs space-y-1">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Citizen Verified Closures
          </span>
          <p className="text-muted-foreground">
            Double-authenticated resolutions with photographic evidence and citizen sign-off.
          </p>
        </div>
      </div>

    </div>
  );
}
