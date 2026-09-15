'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCivicStore } from '@/store/useCivicStore';
import { SeverityLevel, Complaint } from '@/types';
import { calculateDeterministicPriority, getPriorityBadgeInfo } from '@/lib/utils';
import { 
  AlertCircle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Upload,
  Video,
  X,
  Navigation,
  ExternalLink,
  CheckCircle,
  FileCheck,
  Film,
  Image as ImageIcon
} from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
}

export const ReportIssueWizard: React.FC = () => {
  const router = useRouter();
  const { categories, reportComplaint, emergencyAlert } = useCivicStore();

  const [step, setStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [affectedCount, setAffectedCount] = useState(100);
  
  // Location States
  const [latitude, setLatitude] = useState(26.8548);
  const [longitude, setLongitude] = useState(75.7645);
  const [address, setAddress] = useState('Near Crossroad 4, Madhyam Marg, Mansarovar');
  const [landmark, setLandmark] = useState('Opposite SBI Bank');
  const [isLocating, setIsLocating] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  // Media States (Upload from system/folder image/video)
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80');

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  // Calculate live priority score
  const livePriority = calculateDeterministicPriority(
    selectedCategory ? selectedCategory.categoryWeight : 1.5,
    severity,
    affectedCount,
    !!emergencyAlert
  );

  // Handle File Upload from user folder (Images & Videos)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isImage && !isVideo) {
        alert('Please select valid image or video files.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const newItem: MediaItem = {
            id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            url: result,
            type: isVideo ? 'video' : 'image',
            name: file.name
          };
          setUploadedMedia((prev) => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMediaItem = (id: string) => {
    setUploadedMedia((prev) => prev.filter((item) => item.id !== id));
  };

  // One-Click GPS Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setIsLocating(false);
        setLocationDetected(true);

        // Reverse Geocoding attempt via OpenStreetMap Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name.split(',').slice(0, 4).join(','));
          } else {
            setAddress(`GPS Pinpoint: (${lat}, ${lng}), Jaipur`);
          }
        } catch {
          setAddress(`GPS Pinpoint: (${lat}, ${lng}), Jaipur`);
        }
      },
      (error) => {
        setIsLocating(false);
        alert(`Could not fetch exact GPS location: ${error.message}. You can manually adjust the coordinates or Google Map.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Quick City Zone Location Presets
  const locationPresets = [
    { name: 'Mansarovar, Jaipur', lat: 26.8548, lng: 75.7645, addr: 'Madhyam Marg, Mansarovar Sector 4, Jaipur' },
    { name: 'Malviya Nagar', lat: 26.8521, lng: 75.8142, addr: 'Near Calgiri Hospital, Malviya Nagar, Jaipur' },
    { name: 'C-Scheme', lat: 26.9089, lng: 75.8016, addr: 'Ashok Marg, C-Scheme, Jaipur' },
    { name: 'Vaishali Nagar', lat: 26.9065, lng: 75.7360, addr: 'Amrapali Circle, Vaishali Nagar, Jaipur' },
    { name: 'Pink City / Johari Bazar', lat: 26.9205, lng: 75.8257, addr: 'Johari Bazar, Badi Chaupar, Old City, Jaipur' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    // Separate images and videos
    const imageList: string[] = [];
    const videoList: string[] = [];

    // Add preset/URL photo if set
    if (photoUrl) imageList.push(photoUrl);

    // Add uploaded files
    uploadedMedia.forEach((m) => {
      if (m.type === 'image') imageList.push(m.url);
      if (m.type === 'video') videoList.push(m.url);
    });

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
      images: imageList,
      videos: videoList,
    });

    setSubmittedComplaint(created);
    setShowSuccessModal(true);
  };

  const handleResetForm = () => {
    setShowSuccessModal(false);
    setSubmittedComplaint(null);
    setStep(1);
    setTitle('');
    setDescription('');
    setUploadedMedia([]);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
        {/* Wizard Header */}
        <div className="bg-slate-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Report Civic Problem</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload photo/video evidence & pinpoint location for municipal response
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
                  Next: Problem & Media Upload <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Title, Description & Image/Video Upload */}
          {step === 2 && (
            <div className="space-y-5">
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
                  rows={3}
                  placeholder="Describe the exact problem, hazard level, and any previous complaints..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Upload Image & Video Section */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-sky-600" />
                    Upload Image or Video (From System Folder)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Supports PNG, JPG, MP4, MOV, WEBM</span>
                </div>

                <div className="relative border-2 border-dashed border-sky-300 bg-white rounded-xl p-6 text-center hover:bg-sky-50/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="system-media-input"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Click to Choose Image or Video from Folder
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Or drag & drop files from your computer or phone gallery
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                        <ImageIcon className="w-3.5 h-3.5" /> Photo Upload
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md">
                        <Film className="w-3.5 h-3.5" /> Video Clip Upload
                      </span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Media Thumbnails */}
                {uploadedMedia.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-slate-700">Uploaded Media Files ({uploadedMedia.length}):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uploadedMedia.map((item) => (
                        <div key={item.id} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-black/90">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.name} className="w-full h-28 object-cover" />
                          ) : (
                            <video src={item.url} controls className="w-full h-28 object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeMediaItem(item.id)}
                            className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors z-20"
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="p-1.5 bg-slate-900/80 text-white text-[10px] truncate flex items-center justify-between">
                            <span className="truncate">{item.name}</span>
                            <span className="uppercase text-[9px] font-bold px-1 rounded bg-slate-700">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Preset Photos */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 mb-2">Or pick a demo evidence photo preset:</p>
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
                        className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                          photoUrl === url ? 'border-sky-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
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
                  Next: Google Map Location <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Google Map Location & 1-Click GPS */}
          {step === 3 && (
            <div className="space-y-4">
              {/* 1-Click Current Location GPS Button */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-sky-600" />
                      Automatic 1-Click GPS Location
                    </h4>
                    <p className="text-xs text-sky-700 mt-0.5">
                      Fetch your exact current GPS coordinates directly from your device location.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-sky-700 transition-all shadow-sm shrink-0 disabled:opacity-50"
                  >
                    {isLocating ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" /> Detecting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" /> 📍 Detect My Current Location
                      </>
                    )}
                  </button>
                </div>

                {locationDetected && (
                  <div className="mt-3 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs rounded-lg p-2.5 flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      GPS pinpointed: Latitude {latitude}°, Longitude {longitude}°
                    </span>
                    <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded font-bold">ACCURATE</span>
                  </div>
                )}
              </div>

              {/* City Zone Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Quick Location on Map (Jaipur Zones)
                </label>
                <div className="flex flex-wrap gap-2">
                  {locationPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLatitude(preset.lat);
                        setLongitude(preset.lng);
                        setAddress(preset.addr);
                        setLocationDetected(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        latitude === preset.lat && longitude === preset.lng
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      📍 {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Google Map Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                <div className="bg-slate-900 text-white px-3.5 py-2 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" /> Google Map Location Preview
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Open Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <iframe
                  title="Google Map Location Selector"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    GPS Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    GPS Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Final Confirmation Review */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5 text-slate-700">
                <div className="font-bold text-slate-900 text-sm mb-1">Submission Summary</div>
                <div><strong>Category:</strong> {selectedCategory?.name} (SLA: {selectedCategory?.slaHours} hrs)</div>
                <div><strong>Calculated Priority:</strong> <span className="font-bold text-red-600">{livePriority}</span></div>
                <div><strong>Location:</strong> {address} (GPS: {latitude}, {longitude})</div>
                <div><strong>Evidence Attached:</strong> {uploadedMedia.length} uploaded files (Images/Videos)</div>
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

      {/* SUCCESS POPUP MODAL */}
      {showSuccessModal && submittedComplaint && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Animated Checkmark Icon */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
              <CheckCircle className="w-12 h-12" />
            </div>

            {/* Requested Exact Popup Message Banner */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                Official Receipt Confirmed
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Form Successfully Submitted!
              </h3>
              
              {/* EXACT USER REQUESTED POPUP MESSAGE */}
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 text-emerald-950 font-bold text-base shadow-sm my-2">
                "Your form has been successfully submitted! Action will be taken after some time."
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Complaint Reference Ticket:</span>
                <span className="font-mono font-black text-sm text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                  {submittedComplaint.complaintNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-slate-800">{submittedComplaint.categoryName || 'Civic Issue'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calculated Priority:</span>
                <span className="font-bold text-red-600">{submittedComplaint.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target SLA Resolution:</span>
                <span className="font-bold text-emerald-700">Within {selectedCategory?.slaHours || 24} Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pinpointed Location:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">{submittedComplaint.address}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/citizen/complaints/${submittedComplaint.id}`)}
                className="flex-1 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-sm hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-sky-400" /> Track Issue Status
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm hover:bg-slate-200 transition-colors border border-slate-200"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
