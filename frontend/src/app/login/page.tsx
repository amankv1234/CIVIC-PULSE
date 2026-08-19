'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  ShieldCheck, 
  User as UserIcon, 
  HardHat, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Landmark
} from 'lucide-react';
import { useCivicStore } from '@/store/useCivicStore';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, switchRole } = useCivicStore();
  const [email, setEmail] = useState('citizen@civicpulse.gov.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const demoRoles = [
    {
      role: 'CITIZEN' as UserRole,
      title: 'Citizen',
      email: 'citizen@civicpulse.gov.in',
      icon: UserIcon,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      description: 'Report issues, track tickets & verify resolution',
    },
    {
      role: 'OFFICIAL' as UserRole,
      title: 'City Authority',
      email: 'official@civicpulse.gov.in',
      icon: Building2,
      badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      description: 'Dispatch field crews, enforce SLAs & manage queue',
    },
    {
      role: 'MINISTRY' as UserRole,
      title: 'Ministry / State',
      email: 'ministry@civicpulse.gov.in',
      icon: Landmark,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      description: 'MoHUA & DLB state oversight, budgets & directives',
    },
    {
      role: 'FIELD_WORKER' as UserRole,
      title: 'Field Worker',
      email: 'worker@civicpulse.gov.in',
      icon: HardHat,
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Mobile terminal for repair execution & photo proof',
    },
  ];

  const handleQuickSelect = (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    switchRole(role);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setUser(data.user, data.token);
      setSuccessMsg(`Welcome back, ${data.user.firstName}! Redirecting...`);

      setTimeout(() => {
        if (data.user.role === 'MINISTRY') {
          router.push('/ministry');
        } else if (data.user.role === 'OFFICIAL') {
          router.push('/official');
        } else if (data.user.role === 'FIELD_WORKER') {
          router.push('/worker');
        } else if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/citizen');
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Quick Demo Personas */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> Quick Persona Access
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Sign In to CivicPulse
            </h2>
            <p className="text-sm text-muted-foreground">
              Select any pre-configured demo persona or enter your registered account credentials.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {demoRoles.map((d) => {
              const Icon = d.icon;
              const isSelected = email === d.email;
              return (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleQuickSelect(d.email, d.role)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/30'
                      : 'bg-card hover:bg-muted/60 border-border'
                  }`}
                >
                  <div className={`p-2 rounded-lg border ${d.badgeColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{d.title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{d.description}</p>
                    <p className="text-[11px] font-mono text-muted-foreground/80 mt-0.5">{d.email}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Govt-grade 256-bit encrypted JWT sessions & PostGIS spatial sync.</span>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="md:col-span-7">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Account Authentication</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your credentials with JSON Web Token (JWT) verification.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-start gap-2">
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. citizen@civicpulse.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-muted-foreground">(Demo: password123)</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? 'Authenticating Token...' : 'Sign In with JWT'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>New to CivicPulse platform?</span>
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Register New Account <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
