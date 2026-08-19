'use client';

import React from 'react';
import Link from 'next/link';
import { useCivicStore } from '@/store/useCivicStore';
import { 
  Building2, 
  Bell, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  Layers,
  Activity,
  Radar,
  Landmark,
  ShieldCheck,
  LogOut,
  FileCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, notifications, cityHealth, logoutUser } = useCivicStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm font-black text-xl">
              CP
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-foreground tracking-tight flex items-center gap-1.5">
                CivicPulse
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  Jaipur Smart City
                </span>
              </span>
              <p className="text-[11px] text-muted-foreground font-medium leading-none">Real-Time Municipal Governance</p>
            </div>
          </Link>

          {/* Core City Aspect Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Link href="/" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted transition-colors">
              Overview
            </Link>
            <Link href="/city/radar" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
              <Radar className="w-3.5 h-3.5 text-sky-500" /> GIS Radar
            </Link>
            <Link href="/city/health" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> City Health
            </Link>
            <Link href="/city/zones" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" /> Zones
            </Link>
            <Link href="/ministry" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-indigo-500" /> Ministry
            </Link>
            <Link href="/transparency" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Ledger
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Action for Citizen */}
          <Link
            href="/citizen/report"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </Link>

          {/* DigiLocker Verification Link for Official / Ministry */}
          <Link
            href="/verify-authority"
            title="DigiLocker Legal Officer Attestation"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold hover:bg-blue-500/20 transition-all"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>DigiLocker</span>
          </Link>

          {/* Notifications */}
          <button 
            type="button"
            className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <Link
              href={
                currentUser.role === 'MINISTRY' ? '/ministry' :
                currentUser.role === 'OFFICIAL' ? '/official' :
                currentUser.role === 'FIELD_WORKER' ? '/worker' :
                currentUser.role === 'ADMIN' ? '/admin' : '/citizen'
              }
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs overflow-hidden border border-primary/20">
                {currentUser.firstName?.[0] || 'U'}
                {currentUser.lastName?.[0] || ''}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-foreground leading-tight flex items-center gap-1">
                  {currentUser.firstName} {currentUser.lastName}
                  {currentUser.digiLockerVerified && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  )}
                </div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {currentUser.role}
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={logoutUser}
              title="Logout session"
              className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
