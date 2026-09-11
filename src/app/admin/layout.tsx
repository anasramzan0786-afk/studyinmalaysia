'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Building2, 
  UploadCloud, 
  Users, 
  ShieldCheck, 
  ArrowLeft,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/inquiries', label: '📩 Student Inquiries', icon: Users, highlight: true },
    { href: '/admin/universities', label: 'Manage Universities', icon: Building2 },
    { href: '/admin/programs', label: 'Manage Programs', icon: GraduationCap },
    { href: '/admin/upload', label: 'Bulk Data Importer', icon: UploadCloud },
  ];

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#08182b] text-white p-6 shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-6">
          {/* Logo & Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                Portal Management
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Meezab Admin</h2>
            <p className="text-xs text-slate-400">Database &amp; Admissions Control</p>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 pt-4 border-t border-slate-800">
            {links.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : link.highlight
                      ? 'bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border border-amber-400/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Exit */}
        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

