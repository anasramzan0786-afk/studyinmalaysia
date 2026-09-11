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
  ShieldAlert,
  Phone,
  Mail,
  MapPin
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
    <header className="sticky top-0 z-40 w-full bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner in Meezab Crimson #BA2E34 */}
      <div className="bg-[#BA2E34] text-white py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-white/90">
              <Phone className="w-3 h-3 text-amber-300" />
              <a href="tel:+923264224000" className="hover:underline">+92 326 4224 000</a>
              <span className="text-white/40">|</span>
              <a href="tel:+923346596725" className="hover:underline">+92 334 6596725</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-white/90">
              <Mail className="w-3 h-3 text-amber-300" />
              <a href="mailto:info@meezabfuture.com" className="hover:underline">info@meezabfuture.com</a>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-amber-200">
              <MapPin className="w-3 h-3" />
              <span>Lahore • Islamabad • Karachi • Mandi Bahauddin</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-white text-[11px] ml-auto">
            <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-amber-300 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Malaysia 2026/2027 Intakes Open
            </span>
            <a 
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions%20Desk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#E8A300] hover:bg-[#FFA300] text-slate-950 font-bold px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors shadow-xs"
            >
              <span>WhatsApp Desk</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Meezab Logo */}
          <Link href="/" className="flex items-center group py-1">
            <MeezabLogo size="md" variant="dark" />
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    active
                      ? 'text-[#3A60A1] bg-blue-50/70 border-b-2 border-[#E8A300]'
                      : 'text-[#1F2937] hover:text-[#3A60A1] hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#3A60A1]' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E8A300] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Session & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                {user.role === 'ADMIN' ? (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                ) : (
                  <UserCheck className="w-4 h-4 text-[#3A60A1]" />
                )}
                <span className="font-semibold text-slate-800">{user.username}</span>
                <span className="bg-[#3A60A1] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  {user.role}
                </span>
              </div>
            )}

            <button
              onClick={onOpenCounseling}
              className="btn-meezab-gold inline-flex items-center gap-2 text-xs lg:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-white animate-pulse" />
              <span>Free Counseling</span>
            </button>

            {user && (
              <button
                onClick={handleLogout}
                title="Logout from portal"
                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-2 rounded-xl border border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
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
                <UserCheck className="w-4 h-4 text-[#3A60A1]" />
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                  active
                    ? 'bg-blue-50 text-[#3A60A1] border-l-4 border-[#E8A300]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#3A60A1]' : 'text-slate-500'}`} />
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
              className="w-full btn-meezab-gold flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>Book Free Counseling</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
