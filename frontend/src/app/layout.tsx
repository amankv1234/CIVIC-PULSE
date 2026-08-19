import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { EmergencyBanner } from '@/components/common/EmergencyBanner';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CivicPulse — Real-Time Smart City Management Platform',
  description: 'Turning Civic Problems into Action. Connecting Citizens, Municipal Officials, and Field Crews with Geospatial Intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <RoleSwitcher />
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>CivicPulse Platform</strong> — Jaipur Municipal Corporation Digital Operations
            </div>
            <div className="text-slate-400">
              Deterministic Workflow Engine • PostGIS Spatial Hub • Real-Time STOMP
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
