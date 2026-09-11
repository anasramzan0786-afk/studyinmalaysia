'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Building2, 
  Calculator, 
  PhoneCall, 
  Menu, 
  X,
  SlidersHorizontal,
  ChevronRight,
  LogOut,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  onOpenCounseling?: () => void;
}

export function Navbar({ onOpenCounseling }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { href: '/programs', label: 'Explore Courses', icon: GraduationCap },
    { href: '/universities', label: 'Universities', icon: Building2 },
    { href: '/calculator', label: 'Visa & EMGS Calculator', icon: Calculator },
    ...(user?.role === 'ADMIN'
      ? [{ href: '/admin', label: 'Admin Portal', icon: SlidersHorizontal }]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner for Pakistani Students */}
      <div className="bg-[#08182b] text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">Official Advisory Desk for Pakistan:</span>
            <span className="text-amber-300 font-semibold hidden sm:inline">2026/2027 Intakes Open</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="hidden md:inline">🏛️ MOHE &amp; MQA Recognized</span>
            <span className="hidden md:inline">🛂 EMGS STARS Authorized</span>
            <a 
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions%20Team" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Direct WhatsApp Desk</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2540] to-[#1e3a8a] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Study<span className="text-blue-700">Malaysia</span>
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200">
                  PK Desk
                </span>
              </div>
              <p className="text-[10px] text-slate-700 font-medium -mt-0.5">
                Meezab Future Education Advisory
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-800 font-semibold shadow-xs'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-700' : 'text-slate-700'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Session & Logout Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                {user.role === 'ADMIN' ? (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                ) : (
                  <UserCheck className="w-4 h-4 text-blue-600" />
                )}
                <span className="font-semibold text-slate-800">{user.username}</span>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  {user.role}
                </span>
              </div>
            )}

            <button
              onClick={onOpenCounseling}
              className="inline-flex items-center gap-2 bg-[#0a2540] hover:bg-[#153454] text-white text-xs lg:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Counseling</span>
            </button>

            <button
              onClick={handleLogout}
              title="Logout from portal"
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-2 rounded-xl border border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {user && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>{user.username} ({user.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-700' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCounseling?.();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#0a2540] text-white py-3 rounded-xl font-semibold text-sm shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Book Free Counseling</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
