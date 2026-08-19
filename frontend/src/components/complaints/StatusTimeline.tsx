'use client';

import React from 'react';
import { StatusHistoryItem, ComplaintStatus } from '@/types';
import { getStatusBadgeInfo, formatDateTime } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

interface TimelineProps {
  currentStatus: ComplaintStatus;
  history: StatusHistoryItem[];
}

const LIFECYCLE_STEPS: { status: ComplaintStatus; label: string; desc: string }[] = [
  { status: 'REPORT_SUBMITTED', label: 'Report Submitted', desc: 'Citizen lodged complaint with geotag & evidence' },
  { status: 'VERIFIED', label: 'Official Verified', desc: 'Municipal inspector validated and accepted scope' },
  { status: 'ASSIGNED', label: 'Field Crew Assigned', desc: 'Assigned to nearest available field worker' },
  { status: 'IN_PROGRESS', label: 'Work In Progress', desc: 'Field crew on-site carrying out maintenance' },
  { status: 'RESOLVED', label: 'Resolved (Proof Uploaded)', desc: 'Work finished and photographic evidence uploaded' },
  { status: 'CITIZEN_VERIFIED', label: 'Citizen Verified & Closed', desc: 'Citizen confirmed resolution quality' },
];

export const StatusTimeline: React.FC<TimelineProps> = ({ currentStatus, history }) => {
  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'REPORT_SUBMITTED': return 0;
      case 'VERIFIED': return 1;
      case 'ASSIGNED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'RESOLVED': return 4;
      case 'CITIZEN_VERIFIED': return 5;
      case 'REOPENED': return 3; // loops back to in progress
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center justify-between">
        <span>Transparent Operational Audit Trail</span>
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadgeInfo(currentStatus).color}`}>
          Current: {getStatusBadgeInfo(currentStatus).label}
        </span>
      </h3>

      {/* Visual Stepper */}
      <div className="relative mb-6">
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx || currentStatus === 'CITIZEN_VERIFIED';
            const isCurrent = idx === currentStepIdx && currentStatus !== 'CITIZEN_VERIFIED';

            return (
              <div key={step.status} className="flex flex-col items-center text-center relative z-10 w-28">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[11px] mt-2 font-bold leading-tight ${isCurrent ? 'text-sky-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Granular Historical Log Events */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Historical Event Log ({history.length} events)
        </h4>

        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={item.id || idx} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
              <div className="flex-1 bg-slate-50 border border-slate-200/70 rounded-lg p-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{item.changedByName || 'System'}</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-200/80 px-1.5 py-0.2 rounded">
                      {item.changedByRole || 'SYSTEM'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-slate-600 mt-1">{item.notes}</p>
                {item.proofImages && item.proofImages.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {item.proofImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Resolution proof"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
