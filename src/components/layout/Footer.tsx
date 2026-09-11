'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Heart, Clock, Award, CheckCircle2 } from 'lucide-react';
import { MeezabLogo } from '@/components/MeezabLogo';

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-[#0B2553] text-slate-300 border-t-[7px] border-[#B82E32] relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[250px] bg-[#3A60A1]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Official Meezab Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block py-1">
              <MeezabLogo size="lg" variant="light" />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md pt-2">
              <strong className="text-white font-semibold">Meezab Future Consulting Pvt Ltd</strong> is dedicated to helping students achieve their academic ambitions worldwide. With years of experience and direct partnerships with top Malaysian universities, we provide 100% transparent fee structures, EMGS visa guidance, and zero consultant markup.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 text-xs font-semibold text-[#E8A300]">
                <Award className="w-3.5 h-3.5 text-[#E8A300]" />
                15+ Years of Excellence
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 text-xs font-semibold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                98.4% Visa Success Rate
              </div>
            </div>
          </div>

          {/* Col 2: Admissions Hub */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8A300]" />
              Study Malaysia
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/programs" className="hover:text-[#E8A300] transition-colors">
                  All Accredited Courses
                </Link>
              </li>
              <li>
                <Link href="/programs?degree=Bachelor's Degree" className="hover:text-[#E8A300] transition-colors">
                  Bachelor&apos;s Degrees
                </Link>
              </li>
              <li>
                <Link href="/programs?degree=Master's (Postgraduate)" className="hover:text-[#E8A300] transition-colors">
                  Master&apos;s &amp; MBA Programs
                </Link>
              </li>
              <li>
                <Link href="/programs?degree=Ph.D &amp; Doctorate" className="hover:text-[#E8A300] transition-colors">
                  Ph.D &amp; Research Degrees
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-[#E8A300] hover:text-[#FFA300] font-semibold transition-colors flex items-center gap-1">
                  <span>EMGS Visa Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Partner Campuses */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8A300]" />
              Top Campuses
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/universities/lincoln-luc" className="hover:text-[#E8A300] transition-colors">
                  Lincoln University College
                </Link>
              </li>
              <li>
                <Link href="/universities/apu" className="hover:text-[#E8A300] transition-colors">
                  Asia Pacific University (APU)
                </Link>
              </li>
              <li>
                <Link href="/universities/ucsi" className="hover:text-[#E8A300] transition-colors">
                  UCSI University
                </Link>
              </li>
              <li>
                <Link href="/universities/bac" className="hover:text-[#E8A300] transition-colors">
                  Brickfields Asia College (BAC)
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-sky-300 hover:text-white transition-colors font-medium">
                  View All 20+ Universities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Meezab Branches & Contacts */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8A300]" />
              Branch Offices
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8A300] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Lahore (Head Office):</strong>
                  <span>29 J3 Johar Town, Opposite Expo Centre, Lahore</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8A300] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Karachi:</strong>
                  <span>M-20, Saima Trade Towers, I.I Chundrigar Road</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8A300] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Other Branches:</strong>
                  <span>Islamabad • Mandi Bahauddin • Peshawar</span>
                </div>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+923264224000" className="hover:text-white font-medium">+92 326 4224 000</a>
                <span className="text-white/30">|</span>
                <a href="tel:+923346596725" className="hover:text-white font-medium">+92 334 6596725</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E8A300] shrink-0" />
                <a href="mailto:info@meezabfuture.com" className="hover:text-white font-medium">info@meezabfuture.com</a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/15"
                >
                  <span>Advisory &amp; Counselor Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#E8A300]" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Accreditation Badges & Copyright */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/10 px-3 py-1 rounded-md text-white font-semibold border border-white/15">
              🇲🇾 MOHE Approved
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-md text-white font-semibold border border-white/15">
              🏛️ MQA Accredited
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-md text-white font-semibold border border-white/15">
              🛂 EMGS STARS Direct
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-md text-white font-semibold border border-white/15">
              🇵🇰 PMDC &amp; HEC Listed
            </span>
          </div>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} <strong className="text-white">Meezab Future Consulting Pvt Ltd</strong>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


