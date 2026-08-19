'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCivicStore } from '@/store/useCivicStore';
import { SeverityLevel } from '@/types';
import { calculateDeterministicPriority, getPriorityBadgeInfo } from '@/lib/utils';
import { 
  AlertCircle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const ReportIssueWizard: React.FC = () => {
  const router = useRouter();
  const { categories, reportComplaint, emergencyAlert } = useCivicStore();

  const [step, setStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [affectedCount, setAffectedCount] = useState(100);
  const [latitude, setLatitude] = useState(26.8548);
  const [longitude, setLongitude] = useState(75.7645);
  const [address, setAddress] = useState('Near Crossroad 4, Madhyam Marg, Mansarovar');
  const [landmark, setLandmark] = useState('Opposite SBI Bank');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80');

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  // Calculate live priority score
  const livePriority = calculateDeterministicPriority(
    selectedCategory ? selectedCategory.categoryWeight : 1.5,
    severity,
    affectedCount,
    !!emergencyAlert
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const created = reportComplaint({
      title,
      description,
      categoryId: selectedCategoryId,
      severity,
      affectedCount,
      latitude,
      longitude,
      address,
      landmark,
      images: [photoUrl],
    });

    router.push(`/citizen/complaints/${created.id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-slate-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Report Civic Problem</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Turning citizen observations into verified municipal work orders
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-800 text-sky-400 px-3 py-1 rounded-full border border-slate-700">
            Step {step} of 3
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-sky-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* STEP 1: Category & Severity */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                1. Select Problem Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                      selectedCategoryId === cat.id
                        ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-200 text-sky-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold line-clamp-2">{cat.name}</span>
                    <span className="text-[10px] text-slate-500">SLA: {cat.slaHours}h</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Severity Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        severity === lvl
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Estimated Citizens Affected
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={affectedCount}
                  onChange={(e) => setAffectedCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Live Priority Engine Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-sky-600 animate-spin" />
                <div>
                  <h4 className="text-xs font-bold text-sky-950">Deterministic Priority Engine</h4>
                  <p className="text-[11px] text-sky-700">
                    Category Weight ({selectedCategory?.categoryWeight}) + Severity ({severity}) + Affected ({affectedCount})
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black ${getPriorityBadgeInfo(livePriority).color}`}>
                {livePriority}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors"
              >
                Next: Problem Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Title & Description */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Issue Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deep pothole causing heavy traffic jam on Madhyam Marg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Detailed Description & Context
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the exact problem, hazard level, and any previous complaints..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Evidence Photo URL (or select preset)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono mb-2"
              />
              <div className="flex gap-2">
                {[
                  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80'
                ].map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    onClick={() => setPhotoUrl(url)}
                    alt="Preset"
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                      photoUrl === url ? 'border-sky-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-slate-600 font-bold text-sm px-4 py-2 hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors"
              >
                Next: GPS Location <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Location & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  GPS Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  GPS Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Final Confirmation Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5 text-slate-700">
              <div className="font-bold text-slate-900 text-sm mb-1">Submission Review</div>
              <div><strong>Category:</strong> {selectedCategory?.name} (SLA: {selectedCategory?.slaHours} hrs)</div>
              <div><strong>Calculated Priority:</strong> <span className="font-bold text-red-600">{livePriority}</span></div>
              <div><strong>Location:</strong> {address}, Jaipur (GPS: {latitude}, {longitude})</div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-slate-600 font-bold text-sm px-4 py-2 hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Complaint
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
