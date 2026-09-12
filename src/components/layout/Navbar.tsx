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
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { MeezabLogo } from '@/components/MeezabLogo';

interface NavbarProps {
  onOpenCounseling?: () => void;
}

export function Navbar({ onOpenCounseling }: NavbarProps) {
  const pathname = usePathname();
  if (pathname === '/login') {
    return null;
  }
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
    { href: '/calculator', label: 'EMGS Fee Calculator', icon: Calculator },
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
    <header className="sticky top-0 z-40 w-full shadow-[0_4px_20px_-4px_rgba(11,37,83,0.07)]">
      {/* Top Bar - Sleek Crimson Gradient */}
      <div className="bg-gradient-to-r from-[#BA2E34] via-[#A8242A] to-[#8E1C21] text-white py-1.5 px-4 text-xs font-medium tracking-wide border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left contact info */}
          <div className="flex items-center gap-4 text-white/90">
            <span className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-amber-300" />
              <a href="tel:+923264224000" className="hover:underline font-semibold">+92 326 4224 000</a>
              <span className="text-white/30">|</span>
              <a href="tel:+923346596725" className="hover:underline font-semibold">+92 334 6596 725</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-amber-300" />
              <a href="mailto:info@meezabfuture.com" className="hover:underline">info@meezabfuture.com</a>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-amber-200/90 text-[11px]">
              <MapPin className="w-3 h-3 text-amber-300" />
              <span>Lahore • Islamabad • Karachi • Mandi Bahauddin</span>
            </span>
          </div>

          {/* Right badges & WhatsApp CTA */}
          <div className="flex items-center gap-2.5 text-white text-[11px] ml-auto">
            <span className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-amber-300 font-bold border border-white/10 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Malaysia 2026/2027 Intakes Open
            </span>
            <a 
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions%20Desk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-gradient-to-r from-[#25D366] to-[#1FB855] hover:from-[#1FB855] hover:to-[#179644] text-white font-extrabold px-3 py-0.5 rounded-full transition-all duration-200 shadow-[0_2px_8px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95"
            >
              <span>WhatsApp Desk</span>
              <ChevronRight className="w-3 h-3 stroke-[3]" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Official Meezab Logo */}
            <Link href="/" className="flex items-center group py-1">
              <MeezabLogo size="md" variant="dark" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 relative group ${
                      active
                        ? 'text-[#0B2553] bg-gradient-to-b from-blue-50 to-indigo-50/40 border border-[#3A60A1]/25 shadow-xs'
                        : 'text-slate-600 hover:text-[#0B2553] hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon 
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        active ? 'text-[#3A60A1]' : 'text-slate-400 group-hover:text-[#3A60A1]'
                      }`} 
                    />
                    <span>{link.label}</span>
                    {active && (
                      <span className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-[#3A60A1] via-[#E8A300] to-[#3A60A1] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Session & CTA Buttons */}
            <div className="hidden sm:flex items-center gap-2.5 lg:gap-3">
              {/* User Chip */}
              {user && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs shadow-xs">
                  <div className="w-5 h-5 rounded-full bg-[#0B2553]/10 flex items-center justify-center">
                    {user.role === 'ADMIN' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3A60A1]" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 text-[#3A60A1]" />
                    )}
                  </div>
                  <span className="font-bold text-slate-800 tracking-tight">{user.username}</span>
                  <span className="bg-[#0B2553] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                    {user.role}
                  </span>
                </div>
              )}

              {/* Ultra-Premium "Free Counseling" Button */}
              <button
                onClick={onOpenCounseling}
                className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-extrabold text-xs lg:text-sm text-white bg-gradient-to-r from-[#F5A623] via-[#E8A300] to-[#D99100] shadow-[0_4px_16px_rgba(232,163,0,0.38),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_6px_22px_rgba(232,163,0,0.52)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {/* Glowing subtle light sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {/* Telephone Icon in Frosted Circle */}
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
                </div>
                <span className="tracking-wide">Free Counseling</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-100 opacity-80 group-hover:rotate-12 transition-transform" />
              </button>

              {/* Logout Button */}
              {user && (
                <button
                  onClick={handleLogout}
                  title="Logout from portal"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200/80 hover:border-rose-300 hover:shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Logout</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          {user && (
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/60 border border-slate-200 p-3 rounded-xl mb-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <div className="w-6 h-6 rounded-full bg-[#0B2553]/10 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5 text-[#3A60A1]" />
                </div>
                <span>{user.username}</span>
                <span className="bg-[#0B2553] text-white text-[9px] px-2 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1"
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  active
                    ? 'bg-blue-50/80 text-[#0B2553] border-l-4 border-[#E8A300] shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#3A60A1]' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCounseling?.();
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#F5A623] via-[#E8A300] to-[#D99100] shadow-[0_4px_16px_rgba(232,163,0,0.38)] active:scale-98 transition-transform"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Book Free Counseling</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
