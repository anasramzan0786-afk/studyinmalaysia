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
    { href: '/calculator', label: 'EMGS Calculator', icon: Calculator },
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-[0_2px_15px_-3px_rgba(11,37,83,0.05)] transition-all">
      {/* Slim, Minimal Top Bar */}
      <div className="bg-[#BA2E34] text-white py-1 px-4 text-[11px] font-medium tracking-tight">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left contact info */}
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1.5">
              <Phone className="w-2.5 h-2.5 text-amber-300" />
              <a href="tel:+923264224000" className="hover:text-white transition-colors">+92 326 4224 000</a>
              <span className="text-white/30 hidden sm:inline">•</span>
              <a href="tel:+923346596725" className="hover:text-white transition-colors hidden sm:inline">+92 334 6596 725</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-white/80">
              <Mail className="w-2.5 h-2.5 text-amber-300" />
              <a href="mailto:info@meezabfuture.com" className="hover:text-white transition-colors">info@meezabfuture.com</a>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-amber-200/80">
              <MapPin className="w-2.5 h-2.5" />
              <span>Lahore • Islamabad • Karachi</span>
            </span>
          </div>

          {/* Right badges & WhatsApp link */}
          <div className="flex items-center gap-2 text-[11px] ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full text-amber-200 font-semibold text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              2026/2027 Intakes Open
            </span>
            <a 
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions%20Desk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-2.5 py-0.5 rounded-full text-[10px] transition-all hover:shadow-xs active:scale-95"
            >
              <span>WhatsApp</span>
              <ChevronRight className="w-2.5 h-2.5 stroke-[3]" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar - Clean, Minimal & High-End */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[66px]">
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <MeezabLogo size="md" variant="dark" />
          </Link>

          {/* Minimal Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 relative ${
                    active
                      ? 'text-[#0B2553] bg-slate-100/90 font-bold'
                      : 'text-slate-600 hover:text-[#0B2553] hover:bg-slate-50'
                  }`}
                >
                  <Icon 
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-[#3A60A1]' : 'text-slate-400'
                    }`} 
                  />
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-[#E8A300] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Session & Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Minimal User Chip */}
            {user && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 pl-2.5 pr-2 py-1 rounded-full text-xs">
                <div className="w-4 h-4 rounded-full bg-[#0B2553]/10 flex items-center justify-center">
                  {user.role === 'ADMIN' ? (
                    <ShieldCheck className="w-3 h-3 text-[#3A60A1]" />
                  ) : (
                    <UserCheck className="w-3 h-3 text-[#3A60A1]" />
                  )}
                </div>
                <span className="font-semibold text-slate-700 text-xs">{user.username}</span>
                <span className="bg-[#0B2553] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Minimalist Luxury "Free Counseling" Button */}
            <button
              onClick={onOpenCounseling}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E8A300] hover:bg-[#D99700] shadow-[0_2px_10px_rgba(232,163,0,0.28)] hover:shadow-[0_4px_14px_rgba(232,163,0,0.38)] transition-all duration-200 active:scale-95 cursor-pointer"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              <span>Free Counseling</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2.5 pb-5 space-y-1.5 shadow-lg">
          {user && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl mb-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <UserCheck className="w-3.5 h-3.5 text-[#3A60A1]" />
                <span>{user.username} ({user.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
                  active
                    ? 'bg-slate-100 text-[#0B2553] font-bold border-l-2 border-[#E8A300]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#3A60A1]' : 'text-slate-400'}`} />
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs text-white bg-[#E8A300] hover:bg-[#D99700] shadow-sm transition-all"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book Free Counseling</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
