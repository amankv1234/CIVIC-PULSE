'use client';

import React, { useEffect, useState } from 'react';
import { Complaint, FieldWorker } from '@/types';
import { getPriorityBadgeInfo, getStatusBadgeInfo, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { MapPin, Navigation, Eye } from 'lucide-react';

interface MapProps {
  complaints: Complaint[];
  workers?: FieldWorker[];
  selectedComplaintId?: string;
  onSelectComplaint?: (id: string) => void;
  height?: string;
}

export const InteractiveCityMap: React.FC<MapProps> = ({
  complaints,
  workers = [],
  selectedComplaintId,
  onSelectComplaint,
  height = '500px',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Complaint | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedComplaintId) {
      const found = complaints.find(c => c.id === selectedComplaintId);
      if (found) setSelectedItem(found);
    }
  }, [selectedComplaintId, complaints]);

  if (!isMounted) {
    return (
      <div 
        style={{ height }} 
        className="w-full bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 font-medium text-sm animate-pulse"
      >
        <MapPin className="w-5 h-5 mr-2 animate-bounce text-sky-500" />
        Loading Live Jaipur GIS Map...
      </div>
    );
  }

  // Dynamic coordinates bounding box for Jaipur (center around 26.89, 75.79)
  // Let's create a rich visual map container with interactive map points & live sidebar
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-50" style={{ height }}>
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          Live GPS Fleet & Issues ({complaints.length} active)
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 border-l border-slate-200 pl-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> High</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
        </div>
      </div>

      {/* Styled Interactive SVG Map Surface representing Jaipur Smart City Grid */}
      <div className="w-full h-full relative overflow-hidden bg-[#e5e9ec]">
        {/* Vector City Base Map Grid & Zones */}
        <svg className="w-full h-full absolute inset-0 opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          
          {/* Main Ring Road Arteries */}
          <path d="M 0 250 Q 300 200 600 350 T 1200 400" fill="none" stroke="#94a3b8" strokeWidth="6" />
          <path d="M 350 0 Q 400 300 380 600" fill="none" stroke="#94a3b8" strokeWidth="6" />
          <path d="M 100 500 Q 500 400 900 100" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          <path d="M 600 0 Q 650 300 750 600" fill="none" stroke="#cbd5e1" strokeWidth="4" />
        </svg>

        {/* Zone Labels on Map */}
        <div className="absolute top-1/4 left-1/4 text-[11px] font-bold uppercase tracking-widest text-slate-400 select-none pointer-events-none">
          Mansarovar Zone
        </div>
        <div className="absolute top-1/3 right-1/4 text-[11px] font-bold uppercase tracking-widest text-slate-400 select-none pointer-events-none">
          Malviya Nagar
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-[11px] font-bold uppercase tracking-widest text-slate-400 select-none pointer-events-none">
          Vaishali Nagar
        </div>
        <div className="absolute top-1/6 right-1/3 text-[11px] font-bold uppercase tracking-widest text-slate-400 select-none pointer-events-none">
          Walled City (Heritage)
        </div>

        {/* Field Workers Fleet Markers */}
        {workers.map((worker, index) => {
          const leftPercent = 25 + ((index * 35) % 55);
          const topPercent = 35 + ((index * 25) % 45);
          return (
            <div
              key={worker.id}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-15"
              title={`Worker: ${worker.name} (${worker.specialization})`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs transform group-hover:scale-125 transition-transform">
                  🛠️
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded font-mono shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  {worker.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Complaints Markers */}
        {complaints.map((complaint, index) => {
          // Normalize GPS coordinates to relative percentage within Jaipur boundary
          const minLat = 26.82, maxLat = 26.96;
          const minLng = 75.72, maxLng = 75.86;
          
          let topPct = 100 - ((complaint.latitude - minLat) / (maxLat - minLat)) * 100;
          let leftPct = ((complaint.longitude - minLng) / (maxLng - minLng)) * 100;

          // Clamp
          topPct = Math.max(15, Math.min(85, topPct || (20 + index * 18)));
          leftPct = Math.max(15, Math.min(85, leftPct || (25 + index * 16)));

          const priorityBadge = getPriorityBadgeInfo(complaint.priority);
          const isSelected = selectedItem?.id === complaint.id;

          return (
            <div
              key={complaint.id}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              onClick={() => {
                setSelectedItem(complaint);
                if (onSelectComplaint) onSelectComplaint(complaint.id);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              <div className="relative flex items-center justify-center">
                {complaint.priority === 'CRITICAL' && (
                  <span className="absolute w-8 h-8 rounded-full bg-red-400 opacity-75 animate-ping" />
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md ${
                    complaint.priority === 'CRITICAL'
                      ? 'bg-red-600'
                      : complaint.priority === 'HIGH'
                      ? 'bg-rose-500'
                      : complaint.priority === 'MEDIUM'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                <div className="absolute -top-6 whitespace-nowrap bg-slate-900/90 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                  {complaint.complaintNumber}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Complaint Floating Card Overlay */}
      {selectedItem && (
        <div className="absolute bottom-4 right-4 z-30 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 transition-all">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                {selectedItem.complaintNumber}
              </span>
              <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                {selectedItem.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
            {selectedItem.description}
          </p>

          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap text-[11px]">
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusBadgeInfo(selectedItem.status).color}`}>
              {getStatusBadgeInfo(selectedItem.status).label}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeInfo(selectedItem.priority).color}`}>
              {selectedItem.priority}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-500 text-[11px]">
              {formatRelativeTime(selectedItem.createdAt)}
            </span>
            <Link
              href={`/citizen/complaints/${selectedItem.id}`}
              className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 text-[11px]"
            >
              <Eye className="w-3.5 h-3.5" />
              View Full Trail →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
