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
  Menu, 
  X, 
  ChevronRight, 
  ExternalLink,
  MessageCircle,
  Phone,
  Search,
  CheckCircle2
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
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/programs', label: 'Explore Degrees', icon: GraduationCap, badge: '1,200+' },
    { href: '/universities', label: 'Top Universities', icon: Building2 },
    { href: '/calculator', label: 'EMGS Calculator', icon: Calculator },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* 1. DESKTOP PERMANENT MINIMAL SIDEBAR (MEEZAB NAVY & RED) */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 bg-[#0B2553] border-r border-[#07172B] text-slate-200">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white p-1 shrink-0 flex items-center justify-center">
              <img
                src="/meezab-square-logo.jpg"
                alt="Meezab"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-sm tracking-tight font-heading">
                MEEZAB PORTAL
              </span>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Study in Malaysia
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-heading">
              Admissions Menu
            </span>
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href, link.exact);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      active
                        ? 'bg-white/15 text-white border-l-4 border-[#BA2E34]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        active ? 'bg-[#BA2E34] text-white' : 'bg-white/10 text-slate-300'
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
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-heading">
              Student Helpdesk
            </span>
            <div className="space-y-1">
              <button
                onClick={() => openModal()}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Free Counseling</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#BA2E34]" />
              </button>

              <a
                href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions%20Portal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Desk</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Admin Management (If logged in as admin) */}
          {user?.role === 'ADMIN' && (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-2 font-heading">
                Administration
              </span>
              <div className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer / User Status */}
        <div className="p-4 border-t border-white/10 bg-[#07172B]">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#BA2E34] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.username}</p>
                  <p className="text-[10px] text-amber-300 font-semibold">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Intakes:</span>
                <span className="text-amber-300 font-bold">2026 / 2027 Active</span>
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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B2553] border-r border-slate-800 text-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 bg-white p-1">
              <img src="/meezab-square-logo.jpg" alt="Meezab" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-white font-extrabold text-sm font-heading">MEEZAB PORTAL</span>
              <p className="text-[10px] text-amber-300 font-bold">Study in Malaysia</p>
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
                      ? 'bg-white/15 text-white border-l-4 border-[#BA2E34]'
                      : 'text-slate-300 hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-amber-300" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#BA2E34] text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setIsMobileOpen(false);
                openModal();
              }}
              className="w-full btn-meezab-red py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
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
        {/* Clean, Minimal Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
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
              <span className="text-[#0B2553] font-bold">Meezab Admissions</span>
              <span>/</span>
              <span className="text-slate-800 capitalize font-bold">
                {pathname === '/' ? 'Dashboard' : pathname.replace('/', '')}
              </span>
            </div>
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center gap-3">
            {/* Minimal Intake Pill */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF2F2] text-[#BA2E34] border border-[#FECACA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA2E34]" />
              2026/2027 Intakes Open
            </span>

            {/* WhatsApp Desk */}
            <a
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba57] shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Free Counseling CTA in Meezab Red */}
            <button
              onClick={() => openModal()}
              className="btn-meezab-red inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
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
