'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Building2, 
  Calculator, 
  PhoneCall, 
  SlidersHorizontal, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  Phone,
  Search,
  CheckCircle2,
  TrendingUp,
  Coins
} from 'lucide-react';
import { useCounseling } from '@/components/CounselingContext';
import { Footer } from './Footer';

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal } = useCounseling();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: 'COUNSELOR' | 'ADMIN' } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      router.push('/login');
    }
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // If login or admin sub-layout, let them handle their own views
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  const navLinks = [
    { href: '/', label: 'Command Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/programs', label: 'Degree Catalog', icon: GraduationCap, badge: '1,200+' },
    { href: '/universities', label: 'Top Universities', icon: Building2, badge: '20+' },
    { href: '/calculator', label: 'EMGS Calculator', icon: Calculator, badge: 'Statutory' },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* 1. DESKTOP PERMANENT BESPOKE SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 bg-gradient-to-b from-[#050D1A] via-[#08152B] to-[#040A14] border-r border-slate-800/80 text-slate-200 shadow-2xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E8A300]/80 shadow-[0_0_15px_rgba(232,163,0,0.35)] shrink-0 bg-[#0B4FD8] p-0.5">
              <img
                src="/meezab-square-logo.jpg"
                alt="Meezab Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-sm tracking-tight font-heading group-hover:text-[#E8A300] transition-colors">
                MEEZAB PORTAL
              </span>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider font-heading">
                Study in Malaysia
              </span>
            </div>
          </Link>

          {/* Verification Badge */}
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">MOHE &amp; EMGS Official Partner</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {/* Main Portal Section */}
          <div>
            <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 font-heading">
              Admissions Portal
            </span>
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href, link.exact);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-blue-600/25 via-blue-500/15 to-transparent border-l-[3px] border-[#E8A300] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-l-[3px] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                        active ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Desk Section */}
          <div>
            <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 font-heading">
              Advising &amp; Liaison Desk
            </span>
            <div className="space-y-1">
              <button
                onClick={() => openModal()}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-[#E8A300] group-hover:scale-110 transition-transform" />
                  <span>Free Counseling</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#E8A300] animate-ping" />
              </button>

              <a
                href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions%20Portal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Liaison</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Live Currency Benchmark Card for Pakistani Students */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-[#E8A300]" />
                Live Forex Rate
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-baseline justify-between text-xs pt-0.5">
              <span className="text-slate-300 font-semibold">1 MYR (Ringgit)</span>
              <span className="font-extrabold text-white">≈ 65.8 PKR</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              Direct TT to University via Flywire / Convera bank transfer.
            </p>
          </div>

          {/* Admin Management (If logged in as admin) */}
          {user?.role === 'ADMIN' && (
            <div>
              <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-2 font-heading">
                Administration
              </span>
              <div className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer / User Status */}
        <div className="p-3.5 border-t border-slate-800 bg-[#040A14]">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#3A60A1] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.username}</p>
                  <p className="text-[10px] text-amber-400 font-semibold">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Intakes:</span>
                <span className="text-amber-400 font-bold">2026 / 2027 Open</span>
              </div>
              <Link
                href="/login"
                className="block text-center py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                Advisor Login
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 3. MOBILE DRAWER SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#07172B] border-r border-slate-800 text-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#E8A300]/60 bg-[#0B4FD8]">
              <img src="/meezab-square-logo.jpg" alt="Meezab" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-white font-extrabold text-sm font-heading">MEEZAB PORTAL</span>
              <p className="text-[10px] text-amber-400 font-bold">Study in Malaysia</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold ${
                    active
                      ? 'bg-[#0B4FD8] text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setIsMobileOpen(false);
                openModal();
              }}
              className="w-full btn-meezab-gold py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>Free Counseling</span>
            </button>
            <a
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </aside>

      {/* 4. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile hamburger & Portal Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-[#3A60A1] font-bold">Meezab Admissions</span>
              <span>/</span>
              <span className="text-slate-800 capitalize font-bold">
                {pathname === '/' ? 'Command Dashboard' : pathname.replace('/', '')}
              </span>
            </div>
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center gap-3">
            {/* Live Counselor Status Chip */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Advisors Online (Lahore &amp; KL)</span>
            </span>

            {/* Quick WhatsApp Desk */}
            <a
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba57] shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Free Counseling CTA */}
            <button
              onClick={() => openModal()}
              className="btn-meezab-gold inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-sm active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Free Counseling</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 bg-[#F8FAFC]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
