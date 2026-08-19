'use client';

import React, { useState } from 'react';
import { useCivicStore } from '@/store/useCivicStore';
import { Sliders, Play, RotateCcw, TrendingUp, TrendingDown, ShieldAlert, Users, Wrench } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { healthScore, toggleEmergencyAlert, deactivateEmergencyAlert, emergencyAlert } = useCivicStore();

  const [workerIncrease, setWorkerIncrease] = useState<number>(30); // +30%
  const [monsoonSurge, setMonsoonSurge] = useState<boolean>(false);
  const [budgetAllocation, setBudgetAllocation] = useState<number>(50); // 50 Lakhs INR
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Deterministic Simulation Calculation Engine
  const baseHealth = healthScore.overallScore;
  const baseSla = healthScore.metrics.slaComplianceRate;
  const baseAvgHours = healthScore.metrics.averageResolutionTimeHours;

  const simulatedSla = Math.min(
    99.2,
    Math.max(45, baseSla + (workerIncrease * 0.22) - (monsoonSurge ? 18.5 : 0) + (budgetAllocation * 0.08))
  );

  const simulatedAvgHours = Math.max(
    6.5,
    baseAvgHours - (workerIncrease * 0.15) + (monsoonSurge ? 12.0 : 0) - (budgetAllocation * 0.05)
  );

  const simulatedHealth = Math.min(
    98.5,
    Math.max(40, baseHealth + (workerIncrease * 0.18) - (monsoonSurge ? 14.2 : 0) + (budgetAllocation * 0.06))
  );

  const handleRunSimulation = () => {
    setIsSimulated(true);
  };

  const handleReset = () => {
    setWorkerIncrease(30);
    setMonsoonSurge(false);
    setBudgetAllocation(50);
    setIsSimulated(false);
  };

  return (
    <div id="simulator" className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg tracking-tight flex items-center gap-2">
              City Operations &quot;What-If&quot; Scenario Simulator
              <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700 px-2 py-0.5 rounded font-mono font-bold">
                Deterministic Policy Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Model workforce scaling, budget reallocations, and climate shock events before deploying real civic resources
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Simulator Inputs & Projections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5 bg-slate-800/60 rounded-xl p-5 border border-slate-700/60">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-4 h-4 text-sky-400" />
                Field Worker Fleet Expansion
              </span>
              <span className="text-sky-400 font-mono">+{workerIncrease}% workforce</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={workerIncrease}
              onChange={(e) => setWorkerIncrease(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Emergency Maintenance Reserve Fund
              </span>
              <span className="text-emerald-400 font-mono">₹{budgetAllocation} Lakhs</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={budgetAllocation}
              onChange={(e) => setBudgetAllocation(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Stress Scenario Toggle */}
          <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Simulate Extreme Monsoon Rain Shock</div>
              <div className="text-[11px] text-slate-400">+350% sudden influx of drainage & waterlogging reports</div>
            </div>
            <button
              onClick={() => setMonsoonSurge(!monsoonSurge)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                monsoonSurge
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {monsoonSurge ? '🌧️ Monsoon Active' : 'Off'}
            </button>
          </div>

          {/* City Emergency Protocol */}
          <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">City-Wide Emergency Protocol</div>
              <div className="text-[11px] text-slate-400">Forces all municipal staff to emergency standby mode</div>
            </div>
            <button
              onClick={() => {
                if (emergencyAlert) deactivateEmergencyAlert();
                else toggleEmergencyAlert('Jaipur Flash Flooding & Heavy Storm', 'Disaster protocol activated', 'HIGH');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                emergencyAlert
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {emergencyAlert ? '🚨 Alert Broadcasted' : 'Trigger Alert'}
            </button>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full bg-gradient-to-r from-purple-600 to-sky-600 text-white font-bold text-sm py-2.5 rounded-xl shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Compute Projected Impact
          </button>
        </div>

        {/* Results Projections Column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="bg-slate-800/90 rounded-xl p-5 border border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Projected Outcomes vs Current Baseline
            </h4>

            <div className="space-y-4">
              {/* City Health Score Delta */}
              <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">City Health Index</div>
                  <div className="text-xl font-black text-white">
                    {simulatedHealth.toFixed(1)} / 100
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${simulatedHealth >= baseHealth ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulatedHealth >= baseHealth ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {(simulatedHealth - baseHealth).toFixed(1)} pts
                </div>
              </div>

              {/* SLA Compliance Delta */}
              <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">SLA Compliance Rate</div>
                  <div className="text-xl font-black text-white">
                    {simulatedSla.toFixed(1)}%
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${simulatedSla >= baseSla ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulatedSla >= baseSla ? '+' : ''}{(simulatedSla - baseSla).toFixed(1)}%
                </div>
              </div>

              {/* Resolution Hours Delta */}
              <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Avg Resolution Speed</div>
                  <div className="text-xl font-black text-white">
                    {simulatedAvgHours.toFixed(1)} hrs
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${simulatedAvgHours <= baseAvgHours ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulatedAvgHours <= baseAvgHours ? '-' : '+'}{Math.abs(simulatedAvgHours - baseAvgHours).toFixed(1)} hrs
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-4 text-xs text-purple-200">
            <strong>Policy Insight:</strong> Allocating ₹{budgetAllocation} Lakhs toward a +{workerIncrease}% field worker deployment in critical zones reduces citizen complaints backlog by {(workerIncrease * 0.45).toFixed(0)}% within 72 hours.
          </div>
        </div>
      </div>
    </div>
  );
};
