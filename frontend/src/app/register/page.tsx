'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  ShieldCheck, 
  User as UserIcon, 
  Lock, 
  Mail, 
  ArrowRight, 
  Landmark, 
  Phone, 
  CheckCircle2, 
  BadgeCheck,
  FileText,
  MapPin
} from 'lucide-react';
import { useCivicStore } from '@/store/useCivicStore';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, departments, zones, ministries } = useCivicStore();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Role-specific fields
  const [selectedZone, setSelectedZone] = useState(zones[0]?.id || '');
  const [selectedDept, setSelectedDept] = useState(departments[0]?.id || '');
  const [selectedMinistry, setSelectedMinistry] = useState(ministries[0]?.id || '');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [officerCadre, setOfficerCadre] = useState('Indian Administrative Service (IAS)');
  const [govIdType, setGovIdType] = useState('AADHAAR');
  const [govIdNumber, setGovIdNumber] = useState('');
  const [digiLockerConsent, setDigiLockerConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const zoneObj = zones.find((z) => z.id === selectedZone);
      const deptObj = departments.find((d) => d.id === selectedDept);
      const minObj = ministries.find((m) => m.id === selectedMinistry);

      const payload = {
        email,
        password,
        firstName,
        lastName,
        phone,
        role: selectedRole,
        zoneId: zoneObj?.id,
        zoneName: zoneObj?.name,
        departmentId: selectedRole === 'OFFICIAL' ? deptObj?.id : undefined,
        departmentName: selectedRole === 'OFFICIAL' ? deptObj?.name : undefined,
        ministryId: selectedRole === 'MINISTRY' ? minObj?.id : undefined,
        ministryName: selectedRole === 'MINISTRY' ? minObj?.name : undefined,
        employeeId: selectedRole === 'OFFICIAL' || selectedRole === 'MINISTRY' ? employeeId : undefined,
        designation: selectedRole === 'OFFICIAL' ? designation : selectedRole === 'MINISTRY' ? designation || 'Executive Officer' : undefined,
        officerCadre: selectedRole === 'MINISTRY' ? officerCadre : undefined,
        govIdType,
        govIdNumber,
        digiLockerVerified: (selectedRole === 'OFFICIAL' || selectedRole === 'MINISTRY') ? digiLockerConsent : true,
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user, data.token);
      setSuccess(true);

      setTimeout(() => {
        if (selectedRole === 'MINISTRY') router.push('/ministry');
        else if (selectedRole === 'OFFICIAL') router.push('/official');
        else router.push('/citizen');
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <BadgeCheck className="w-3.5 h-3.5" /> Official Onboarding
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mt-2">
          Create Your CivicPulse Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select your civic persona to access citizen complaint workflows or municipal administrative command.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <button
          type="button"
          onClick={() => setSelectedRole('CITIZEN')}
          className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
            selectedRole === 'CITIZEN'
              ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/40'
              : 'bg-card hover:bg-muted/60 border-border'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground block">Citizen</span>
            <p className="text-xs text-muted-foreground mt-0.5">File & verify complaints with photo & GPS</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('OFFICIAL')}
          className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
            selectedRole === 'OFFICIAL'
              ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/40'
              : 'bg-card hover:bg-muted/60 border-border'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-500/20 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground block">City Authority</span>
            <p className="text-xs text-muted-foreground mt-0.5">Municipal department officer & crew dispatch</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('MINISTRY')}
          className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
            selectedRole === 'MINISTRY'
              ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/40'
              : 'bg-card hover:bg-muted/60 border-border'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground block">Ministry / State</span>
            <p className="text-xs text-muted-foreground mt-0.5">MoHUA / DLB governance & audit oversight</p>
          </div>
        </button>
      </div>

      {/* Registration Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Account successfully registered with JWT session! Redirecting to your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Section: Basic Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              1. Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Sharma"
                  className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'CITIZEN' 
                        ? 'e.g. rahul@example.com' 
                        : selectedRole === 'OFFICIAL' 
                        ? 'official@jaipur.gov.in' 
                        : 'secretary@nic.in'
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91-9829012345"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Role Specific Configuration */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              2. {selectedRole === 'CITIZEN' ? 'Locality & Zone' : selectedRole === 'OFFICIAL' ? 'Departmental Authorization' : 'Ministerial Cadre & Jurisdiction'}
            </h3>

            {selectedRole === 'CITIZEN' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Residential Zone (Jaipur)</label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} (Pop: {(z.population / 1000).toFixed(0)}k)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Aadhaar e-KYC (Optional / Masked)</label>
                  <input
                    type="text"
                    value={govIdNumber}
                    onChange={(e) => setGovIdNumber(e.target.value)}
                    placeholder="XXXX-XXXX-4921"
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'OFFICIAL' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Municipal Department *</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Officer Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. JMC-ENG-2024-089"
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Executive Engineer (Roads & Bridges)"
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'MINISTRY' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Apex Ministry *</label>
                    <select
                      value={selectedMinistry}
                      onChange={(e) => setSelectedMinistry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      {ministries.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} ({m.jurisdiction})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Officer Cadre *</label>
                    <select
                      value={officerCadre}
                      onChange={(e) => setOfficerCadre(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Indian Administrative Service (IAS)">Indian Administrative Service (IAS)</option>
                      <option value="State Civil Service (RAS)">State Administrative Service (RAS)</option>
                      <option value="Central Public Works Department (CPWD)">Central Public Works Department (CPWD)</option>
                      <option value="Smart Cities Mission Director">Smart Cities Mission Director</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Govt Designation *</label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Principal Secretary (Urban Development)"
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Service Card / Gazette No *</label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="IAS-CADRE-1998-RAJ"
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Legal DigiLocker Verification Banner for Authorities */}
          {(selectedRole === 'OFFICIAL' || selectedRole === 'MINISTRY') && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>DigiLocker Legal Officer Verification</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Under the National e-Governance Protocol, Municipal & Ministerial accounts must undergo DigiLocker credential attestation. Your digital service credentials will receive a cryptographic SHA-256 seal.
              </p>
              <label className="flex items-center gap-2 pt-1 text-xs text-foreground cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={digiLockerConsent}
                  onChange={(e) => setDigiLockerConsent(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Authorize instant DigiLocker e-KYC attestation & gazetted officer verification</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Creating Encrypted Account...' : `Register as ${selectedRole === 'CITIZEN' ? 'Citizen' : selectedRole === 'OFFICIAL' ? 'City Authority' : 'Ministry Official'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Already have an account?</span>
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In with JWT
          </Link>
        </div>
      </div>
    </div>
  );
}
