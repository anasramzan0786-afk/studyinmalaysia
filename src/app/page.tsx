import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatMYR, formatPKR, formatUSD } from '@/lib/utils';
import { 
  Building2, 
  ShieldCheck, 
  Calculator, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award,
  Search,
  Clock,
  FileCheck2,
  TrendingUp,
  MapPin,
  HelpCircle,
  ExternalLink,
  BookOpen,
  BadgeCheck,
  Compass,
  Zap,
  Globe2,
  Check
} from 'lucide-react';
import { ApplyButton } from '@/components/programs/ApplyButton';
import { QuickIntakeMatcher } from '@/components/home/QuickIntakeMatcher';
import { UniversityTicker } from '@/components/home/UniversityTicker';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function HomePage() {
  let featuredUniversities: any[] = [];
  let popularPrograms: any[] = [];
  let totalProgramsCount = 0;
  let totalUniCount = 0;

  try {
    [featuredUniversities, popularPrograms, totalProgramsCount, totalUniCount] = await Promise.all([
      db.university.findMany({
        where: { featured: true },
        take: 6,
        orderBy: { qsRank: 'asc' },
      }),
      db.program.findMany({
        where: { featured: true },
        take: 6,
        include: {
          university: {
            select: { name: true, shortName: true, logo: true, location: true },
          },
        },
        orderBy: { tuitionMYR: 'asc' },
      }),
      db.program.count(),
      db.university.count(),
    ]);
  } catch (e) {
    console.warn('Prisma DB not available during build – using fallback data.', e);
  }

  // Quick category chips
  const categories = [
    { label: 'Computer Science & AI', icon: '💻', query: 'computer', count: '380+' },
    { label: 'Business & MBA', icon: '📈', query: 'business', count: '410+' },
    { label: 'Engineering & Robotics', icon: '⚙️', query: 'engineering', count: '290+' },
    { label: 'Medicine & Health', icon: '🩺', query: 'health', count: '140+' },
    { label: 'Hospitality & Tourism', icon: '✈️', query: 'hospitality', count: '90+' },
    { label: 'Media & Visual Design', icon: '🎨', query: 'design', count: '120+' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. BESPOKE EXECUTIVE COMMAND HERO (SPLIT 2-COLUMN COCKPIT) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#060F1E] via-[#0A1933] to-[#040C1A] text-white shadow-2xl border border-white/10 ring-1 ring-amber-400/20">
        {/* Subtle architectural radial lighting */}
        <div className="absolute -right-24 -top-24 w-[480px] h-[480px] rounded-full bg-[#0B4FD8]/25 blur-[120px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full bg-[#E8A300]/15 blur-[110px] pointer-events-none" />

        {/* Isometric architectural grid watermark */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Authoritative Editorial & Instant Command Search (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Authority Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider font-heading">
                Meezab Official Admissions Portal
              </span>
              <span className="text-slate-400 text-[10px]">•</span>
              <span className="text-slate-300 text-[11px] font-semibold">2026/2027 Intakes Open</span>
            </div>

            {/* Editorial Title */}
            <div className="space-y-2.5">
              <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight font-heading leading-[1.15]">
                Your Verified Gateway to Higher Education in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#E8A300]">
                  Malaysia.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Compare MOHE &amp; MQA accredited Malaysian universities, review authentic itemized EMGS statutory upfront packages for Pakistani students, and obtain direct university offer letters with <strong>zero consultant markup</strong>.
              </p>
            </div>

            {/* Interactive Search Command Hub */}
            <form action="/programs" method="GET" className="space-y-3 pt-1">
              <div className="relative flex items-center bg-white/95 rounded-2xl p-1.5 shadow-xl border border-white/20 focus-within:ring-2 focus-within:ring-[#E8A300] transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search 1,200+ degrees, subjects, or campuses (e.g. Software, MBBS, APU, Lincoln)..."
                  className="w-full px-3 py-2.5 bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="btn-meezab-gold px-5 py-3 rounded-xl font-black text-xs whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Fast Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Fast Filters:
                </span>
                <Link
                  href="/programs?search=medicine"
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1"
                >
                  <span>🩺 MBBS / Health</span>
                </Link>
                <Link
                  href="/programs?search=computer"
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1"
                >
                  <span>💻 AI &amp; Software</span>
                </Link>
                <Link
                  href="/programs?search=business"
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1"
                >
                  <span>📈 MBA &amp; Business</span>
                </Link>
                <Link
                  href="/programs?search=engineering"
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1"
                >
                  <span>⚙️ Engineering</span>
                </Link>
                <Link
                  href="/calculator"
                  className="px-2.5 py-1 rounded-lg bg-[#E8A300]/20 hover:bg-[#E8A300]/30 border border-[#E8A300]/40 text-[11px] font-bold text-amber-300 transition-all flex items-center gap-1"
                >
                  <Calculator className="w-3 h-3 text-[#E8A300]" />
                  <span>EMGS Calculator</span>
                </Link>
              </div>
            </form>

            {/* Verification Credentials Strip */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-5 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% MOHE &amp; MQA Accredited</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct University Invoicing</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Consultant Markup</span>
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Direct Admissions Assistant (5 Cols) */}
          <div className="lg:col-span-5">
            <QuickIntakeMatcher />
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL PARTNER CAMPUSES TICKER */}
      <UniversityTicker />

      {/* 3. ASYMMETRIC COMMAND BENTO HORIZON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Bento Box 1: Verified Catalog */}
        <Link
          href="/programs"
          className="group relative bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#3A60A1] transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3A60A1] group-hover:bg-[#3A60A1] group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                Live 2026/2027
              </span>
            </div>
            <div className="text-3xl font-black text-[#0B2553] font-heading tracking-tight">
              {totalProgramsCount > 0 ? `${totalProgramsCount}+` : '1,200+'}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">Accredited Degree Pathways</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Foundation, Bachelor, Master &amp; PhD degrees with published tuition fees.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#3A60A1]">
            <span>Explore Degree Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Bento Box 2: Campuses Directory */}
        <Link
          href="/universities"
          className="group relative bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#E8A300] transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#E8A300] group-hover:bg-[#E8A300] group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9E6A00] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                QS Ranked
              </span>
            </div>
            <div className="text-3xl font-black text-[#0B2553] font-heading tracking-tight">
              {totalUniCount > 0 ? `${totalUniCount}` : '24+'}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">Partner University Campuses</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Direct registrar links with Lincoln, APU, Sunway, MAHSA, Cyberjaya &amp; UK branches.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#9E6A00]">
            <span>View University Profiles</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Bento Box 3: EMGS Visa Velocity */}
        <Link
          href="/calculator"
          className="group relative bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
                Fast eVAL Track
              </span>
            </div>
            <div className="text-3xl font-black text-[#0B2553] font-heading tracking-tight">
              14–21 Days
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">Average eVAL Visa Approval</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Official statutory EMGS timeline for Pakistani students with fast-track green lane.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
            <span>Calculate EMGS Costs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Bento Box 4: Meezab Zero Markup Guarantee */}
        <div className="relative bg-gradient-to-br from-emerald-50/90 to-teal-50/50 p-6 rounded-3xl border border-emerald-200/80 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                Guaranteed
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-700 font-heading tracking-tight">
              0% Markup
            </div>
            <p className="text-xs font-bold text-slate-800 mt-1">Direct University Invoicing</p>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Students pay directly to university registrar accounts via Flywire / Convera bank transfer.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Admissions Partner</span>
          </div>
        </div>
      </div>

      {/* 4. FAST DEGREE CATEGORY EXPLORER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#0B2553] font-heading">
              Explore Popular Disciplines
            </h2>
            <p className="text-xs text-slate-500">Filter degrees by high-demand Malaysian career tracks</p>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#3A60A1] hover:underline flex items-center gap-1">
            <span>View All Programs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/programs?search=${encodeURIComponent(cat.query)}`}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-[#3A60A1] hover:bg-blue-50/30 text-center transition-all shadow-xs hover:shadow-md group flex flex-col items-center gap-2"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0B2553] leading-tight">
                {cat.label}
              </span>
              <span className="text-[10px] font-bold text-[#3A60A1] bg-blue-50 px-2 py-0.5 rounded-md">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. FEATURED UNIVERSITIES SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#0B2553] font-heading">
              Featured Partner Universities
            </h2>
            <p className="text-xs text-slate-500">Direct admission partnerships with full fee transparency</p>
          </div>
          <Link href="/universities" className="text-xs font-bold text-[#3A60A1] hover:underline flex items-center gap-1">
            <span>All Universities</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredUniversities.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-[#3A60A1] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl border border-slate-200/80 p-2 bg-slate-50 flex items-center justify-center shrink-0 shadow-2xs">
                    {uni.logo ? (
                      <img src={uni.logo} alt={uni.name} className="max-h-full object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  {uni.qsRank && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-[#9E6A00] border border-amber-200">
                      🏆 {uni.qsRank}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-[#0B2553] group-hover:text-[#3A60A1] transition-colors leading-snug">
                  {uni.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{uni.location || 'Malaysia'}</span>
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Upfront eVAL Package
                  </span>
                  <span className="text-xs font-black text-emerald-700">
                    {formatMYR(uni.totalInitialMYR || 11000)}
                  </span>
                </div>
                <Link
                  href={`/universities/${uni.id}`}
                  className="text-xs font-bold text-[#3A60A1] hover:text-[#0B2553] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <span>View Campus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. POPULAR ACCREDITED PROGRAMS PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#0B2553] font-heading">
              Popular Degree Programs
            </h2>
            <p className="text-xs text-slate-500">Verified official tuition with zero consultant addition</p>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#3A60A1] hover:underline flex items-center gap-1">
            <span>Browse All Programs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-[#E8A300] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#3A60A1] border border-blue-200/60 uppercase font-heading">
                    {prog.level}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {prog.durationYears ? `${prog.durationYears} Years` : 'Full-time'}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-[#0B2553] group-hover:text-[#3A60A1] transition-colors leading-snug line-clamp-2">
                  {prog.name}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  {prog.university?.name}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-slate-500">Official Tuition:</span>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#0B2553]">
                      {formatMYR(prog.tuitionMYR)}
                    </span>
                    <span className="block text-[11px] text-[#B57F00] font-bold">
                      approx. {formatPKR(prog.tuitionMYR)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/programs/${prog.id}`}
                    className="flex-1 text-center py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                  >
                    Details
                  </Link>
                  <ApplyButton
                    programTitle={prog.name}
                    programId={prog.id}
                    className="flex-1 py-2.5 px-3 btn-meezab-gold text-xs font-bold rounded-xl shadow-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 4-STEP DIRECT ADMISSION & EMGS VISA WORKFLOW */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3A60A1] bg-[#3A60A1]/10 px-3 py-1 rounded-full border border-[#3A60A1]/20 inline-block mb-2 font-heading">
            Official Roadmap
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B2553] font-heading">
            How Direct Admissions Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Complete transparency from initial counseling to your Malaysian visa sticker and campus onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2 relative">
            <span className="text-2xl font-black text-[#E8A300] font-heading">01</span>
            <h3 className="font-extrabold text-sm text-[#0B2553]">Profile Evaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Counselors review your academic transcripts to match eligibility and tuition budget.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
            <span className="text-2xl font-black text-[#3A60A1] font-heading">02</span>
            <h3 className="font-extrabold text-sm text-[#0B2553]">Direct Offer Letter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official university admission offer letter issued directly within 48 to 72 hours.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
            <span className="text-2xl font-black text-[#E8A300] font-heading">03</span>
            <h3 className="font-extrabold text-sm text-[#0B2553]">EMGS Visa eVAL</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Statutory documentation submitted to EMGS for official student visa approval (14-21 days).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
            <span className="text-2xl font-black text-emerald-600 font-heading">04</span>
            <h3 className="font-extrabold text-sm text-[#0B2553]">Arrival &amp; Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free airport reception in Kuala Lumpur, post-arrival medical check, and university registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
