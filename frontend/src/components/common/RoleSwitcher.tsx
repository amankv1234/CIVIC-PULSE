'use client';

import React from 'react';
import Link from 'next/link';
import { useCivicStore } from '@/store/useCivicStore';
import { UserRole } from '@/types';
import { Shield, User, HardHat, Building2, Landmark, LogIn, UserPlus } from 'lucide-react';

const ROLES: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  {
    role: 'CITIZEN',
    label: 'Citizen',
    icon: User,
    desc: 'Rahul Sharma',
  },
  {
    role: 'OFFICIAL',
    label: 'Authority',
    icon: Building2,
    desc: 'Rajesh Sharma',
  },
  {
    role: 'MINISTRY',
    label: 'Ministry',
    icon: Landmark,
    desc: 'Dr. Jogaram (IAS)',
  },
  {
    role: 'FIELD_WORKER',
    label: 'Field Worker',
    icon: HardHat,
    desc: 'Amit Kumar',
  },
  {
    role: 'ADMIN',
    label: 'City Admin',
    icon: Shield,
    desc: 'Commissioner',
  },
];

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole, logoutUser } = useCivicStore();

  return (
    <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-semibold uppercase tracking-wider text-slate-300">Active Persona:</span>
        <span className="font-bold text-sky-400">
          {currentUser.firstName} {currentUser.lastName} ({currentUser.role})
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isActive = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm ring-1 ring-sky-300 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch persona to ${r.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
          <Link
            href="/login"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-sky-400" />
            <span>Login</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
