'use client';

import React, { useState } from 'react';
import { useCivicStore } from '@/store/useCivicStore';
import { CityHealthCard } from '@/components/dashboard/CityHealthCard';
import { WhatIfSimulator } from '@/components/admin/WhatIfSimulator';
import { 
  Shield, 
  Building2, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Sliders, 
  Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { departments, complaints, workers, healthScore, emergencyAlert, toggleEmergencyAlert, deactivateEmergencyAlert } = useCivicStore();

  const [alertTitle, setAlertTitle] = useState('Severe Water Pipeline Hazard');
  const [alertDesc, setAlertDesc] = useState('High pressure burst in Mansarovar Zone causing localized street flooding');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-black tracking-tight">Municipal HQ Executive Command</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            City Administrator: <strong>Vikramaditya Rathore (Commissioner)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Active Complaints</div>
            <div className="text-lg font-black text-sky-400">{complaints.length} tickets</div>
          </div>
        </div>
      </div>

      {/* Health Card & Emergency Broadcast Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <CityHealthCard />
        </div>

        {/* Emergency Broadcast Control Center */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600 animate-pulse" />
                City Emergency Broadcast Center
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                emergencyAlert ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {emergencyAlert ? '🚨 ACTIVE BROADCAST' : 'Standby'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Trigger high-priority alerts to all citizens, reroute field crews, and automatically escalate affected tickets.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Emergency Title</label>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Public Broadcast Notice</label>
              <input
                type="text"
                value={alertDesc}
                onChange={(e) => setAlertDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Target: All Zones in Jaipur</span>
            {emergencyAlert ? (
              <button
                onClick={deactivateEmergencyAlert}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
              >
                Deactivate Alert
              </button>
            ) : (
              <button
                onClick={() => toggleEmergencyAlert(alertTitle, alertDesc, 'HIGH')}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md animate-pulse"
              >
                Broadcast Emergency Alert 🚨
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Department SLA & Performance Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-600" />
              Department SLA Performance Matrix
            </h3>
            <p className="text-xs text-slate-500">Live operational compliance across municipal departments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{dept.name}</span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.colorHex }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Head: {dept.headName}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">SLA Compliance</span>
                  <span className="font-extrabold text-emerald-600">{dept.slaComplianceRate || 92}%</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Resolved</span>
                  <span className="font-bold text-slate-800">{dept.resolvedCount || 100}+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded What-If Scenario Simulator */}
      <WhatIfSimulator />
    </div>
  );
}
