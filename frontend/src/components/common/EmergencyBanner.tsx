'use client';

import React from 'react';
import { useCivicStore } from '@/store/useCivicStore';
import { AlertOctagon, XCircle } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { emergencyAlert, deactivateEmergencyAlert, currentUser } = useCivicStore();

  if (!emergencyAlert || !emergencyAlert.isActive) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-3 shadow-md flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <AlertOctagon className="w-6 h-6 flex-shrink-0 animate-bounce" />
        <div>
          <div className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span>🚨 CITY-WIDE EMERGENCY PROTOCOL ACTIVE</span>
            <span className="bg-red-800 text-white text-[10px] px-2 py-0.5 rounded font-mono">
              LEVEL: {emergencyAlert.severity}
            </span>
          </div>
          <p className="text-xs text-red-100 mt-0.5">
            <strong>{emergencyAlert.title}:</strong> {emergencyAlert.description} — All civic response teams dispatched on highest priority.
          </p>
        </div>
      </div>

      {currentUser.role === 'ADMIN' && (
        <button
          onClick={deactivateEmergencyAlert}
          className="flex items-center gap-1.5 bg-white text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-50 transition-colors shadow-sm flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
          Deactivate Alert
        </button>
      )}
    </div>
  );
};
