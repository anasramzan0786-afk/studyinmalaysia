import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#08182b] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Study<span className="text-blue-400">Malaysia</span>
                </span>
                <p className="text-xs text-slate-400">Official Educational Advisory Portal</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Meezab Future Consulting is Pakistan&apos;s leading official admissions representative for Malaysian higher education institutions. We provide transparent tuition fees, direct EMGS visa processing, and guaranteed admission guidance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                98.4% Visa Success Rate
              </div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-amber-300">
                RM 0 Hidden Costs
              </div>
            </div>
          </div>

          {/* Col 2: Fast Portals */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Admissions Hub</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  All Accredited Courses
                </Link>
              </li>
              <li>
                <Link href="/programs?degree=Bachelor's Degree" className="hover:text-white transition-colors">
                  Bachelor&apos;s Degrees
                </Link>
              </li>
              <li>
                <Link href="/programs?degree=Master's (Postgraduate)" className="hover:text-white transition-colors">
                  Master&apos;s &amp; MBA
                </Link>
              </li>
              <li>
                <Link href="/programs?degree=Ph.D &amp; Doctorate" className="hover:text-white transition-colors">
                  Ph.D &amp; Research
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  EMGS Visa Calculator 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Universities */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Top Campuses</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/universities/lincoln-luc" className="hover:text-white transition-colors">
                  Lincoln University College
                </Link>
              </li>
              <li>
                <Link href="/universities/apu" className="hover:text-white transition-colors">
                  Asia Pacific University (APU)
                </Link>
              </li>
              <li>
                <Link href="/universities/ucsi" className="hover:text-white transition-colors">
                  UCSI University
                </Link>
              </li>
              <li>
                <Link href="/universities/bac" className="hover:text-white transition-colors">
                  Brickfields Asia College (BAC)
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-blue-400 hover:text-blue-300 transition-colors">
                  View All 20+ Universities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Pakistan &amp; KL Desk</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Islamabad / Lahore, Pakistan &amp; Petaling Jaya, Selangor, Malaysia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/923346596725" target="_blank" rel="noopener noreferrer" className="hover:text-white">+92 334 6596725</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:anas.studyinmalaysiabymeezab@gmail.com" className="hover:text-white">anas.studyinmalaysiabymeezab@gmail.com</a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700"
                >
                  <span>Counselor &amp; Admin Login</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Accreditation Badges & Copyright */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-300 font-semibold border border-slate-700">
              🇲🇾 MOHE Approved
            </span>
            <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-300 font-semibold border border-slate-700">
              🏛️ MQA Accredited
            </span>
            <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-300 font-semibold border border-slate-700">
              🛂 EMGS STARS Direct
            </span>
            <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-300 font-semibold border border-slate-700">
              🇵🇰 PMDC &amp; HEC Listed
            </span>
          </div>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} Meezab Future Consulting. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

