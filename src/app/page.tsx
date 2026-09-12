import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatMYR, formatPKR } from '@/lib/utils';
import { 
  Building2, 
  ShieldCheck, 
  Calculator, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Award,
  Search,
  Clock,
  MapPin,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { ApplyButton } from '@/components/programs/ApplyButton';
import { UNIVERSITIES_DATA } from '@/data/universitiesData';

export const revalidate = 60; // ISR cache for 60 seconds

function getFirstYearTuition(prog: any): number {
  if (prog.semesterSchedules && prog.semesterSchedules.length > 0) {
    const year1 = prog.semesterSchedules.find((s: any) =>
      s.semester.toLowerCase().includes('year 1') ||
      s.semester.toLowerCase().includes('sem 1')
    );
    if (year1 && year1.tuitionMYR > 0) {
      if (year1.semester.toLowerCase().includes('sem 1')) {
        const sem2 = prog.semesterSchedules.find((s: any) => s.semester.toLowerCase().includes('sem 2'));
        return year1.tuitionMYR + (sem2 ? sem2.tuitionMYR : year1.tuitionMYR);
      }
      return year1.tuitionMYR;
    }
  }

  let years = prog.durationYears;
  if (!years && prog.duration) {
    const match = prog.duration.match(/([\d.]+)\s*(?:year|yr)/i);
    if (match) years = parseFloat(match[1]);
  }

  if (!years || years <= 0) {
    const level = (prog.level || '').toLowerCase();
    if (level.includes('master')) years = 1.5;
    else if (level.includes('phd')) years = 3;
    else if (level.includes('bachelor')) years = 3;
    else years = 3;
  }

  return Math.round(prog.tuitionMYR / years);
}

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
          semesterSchedules: true,
        },
        orderBy: { tuitionMYR: 'asc' },
      }),
      db.program.count(),
      db.university.count(),
    ]);
  } catch (e) {
    console.warn('Prisma DB not available during build – using fallback data.', e);
  }

  // Curated disciplines
  const categories = [
    { label: 'Computer Science & AI', query: 'computer' },
    { label: 'Business & MBA', query: 'business' },
    { label: 'Medicine & Health', query: 'health' },
    { label: 'Engineering & Tech', query: 'engineering' },
    { label: 'Hospitality & Tourism', query: 'hospitality' },
    { label: 'Media & Design', query: 'design' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. CLEAN, MINIMAL & NATURAL HERO SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
        {/* Brand Top Tagline */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold bg-[#FEF2F2] text-[#BA2E34] border border-[#FECACA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA2E34]" />
            Official Admissions Portal
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-semibold">
            2026 / 2027 Intakes Active
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[#0B2553] font-bold">
            Meezab Future Consulting
          </span>
        </div>

        {/* Main Title & Natural Description */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B2553] tracking-tight font-heading leading-tight">
            Study in Malaysia Admissions &amp; Verified EMGS Cost Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Explore 1,200+ accredited degrees across top Malaysian campuses. Review authentic upfront EMGS statutory fees, university registration packages, and obtain direct offer letters with <strong className="text-[#BA2E34] font-bold">zero consultant markup</strong>.
          </p>
        </div>

        {/* Clean, Functional Search Bar */}
        <form action="/programs" method="GET" className="max-w-3xl space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder="Search degree, subject, or university (e.g. Software, MBBS, APU, Lincoln)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0B2553] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-meezab-navy px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Search Programs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Natural Category Quick Links */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium text-[11px]">Popular:</span>
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.query}
                href={`/programs?search=${cat.query}`}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/calculator"
              className="px-3 py-1 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#BA2E34] border border-[#FECACA] font-bold text-[11px] transition-colors"
            >
              EMGS Calculator →
            </Link>
          </div>
        </form>

        {/* Institutional Trust Indicators */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            100% MOHE &amp; MQA Accredited Campuses
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Direct University Registrar Invoicing
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Zero Consultant Fee Charged to Students
          </span>
        </div>
      </div>

      {/* 2. MINIMAL PARTNER CAMPUSES STRIP (NATURAL) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#BA2E34]" />
            <h2 className="font-extrabold text-[#0B2553] font-heading text-xs tracking-wide uppercase">
              Partner Campuses &amp; Verified Upfront eVAL Packages
            </h2>
          </div>
          <Link href="/universities" className="text-xs font-bold text-[#0B2553] hover:text-[#BA2E34] flex items-center gap-1">
            <span>View All Campuses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {UNIVERSITIES_DATA.slice(0, 8).map((uni) => (
            <Link
              key={uni.id}
              href={`/universities/${uni.id}`}
              className="shrink-0 flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all min-w-[200px]"
            >
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                {uni.logo ? (
                  <img src={uni.logo} alt={uni.shortName} className="max-h-full object-contain" />
                ) : (
                  <Building2 className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0B2553] truncate">{uni.shortName}</p>
                <p className="text-[11px] font-bold text-emerald-700">
                  Upfront: {formatMYR(uni.totalInitialMYR || 11000)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. CLEAN 4 KEY METRICS (NATURAL & SPACIOUS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Link
          href="/programs"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0B2553] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-blue-50 text-[#0B2553]">
              <GraduationCap className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Catalog
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B2553] font-heading">
            {totalProgramsCount > 0 ? `${totalProgramsCount}+` : '1,200+'}
          </div>
          <p className="text-xs font-bold text-slate-700 mt-1">Accredited Degrees</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Bachelor, Master &amp; PhD</p>
        </Link>

        {/* Metric 2 */}
        <Link
          href="/universities"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0B2553] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-amber-50 text-[#E8A300]">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Ranked
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B2553] font-heading">
            {totalUniCount > 0 ? `${totalUniCount}` : '24+'}
          </div>
          <p className="text-xs font-bold text-slate-700 mt-1">Partner Institutions</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Top QS Rated Campuses</p>
        </Link>

        {/* Metric 3 */}
        <Link
          href="/calculator"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#BA2E34] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-rose-50 text-[#BA2E34]">
              <Clock className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-[#BA2E34] uppercase tracking-wider">
              Visa Track
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B2553] font-heading">
            14–21 Days
          </div>
          <p className="text-xs font-bold text-slate-700 mt-1">Average eVAL Visa</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Statutory EMGS Timeline</p>
        </Link>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Guarantee
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
            0% Markup
          </div>
          <p className="text-xs font-bold text-slate-700 mt-1">Direct University Fee</p>
          <p className="text-[11px] text-slate-500 mt-0.5">No Agent Commission</p>
        </div>
      </div>

      {/* 4. THREE NATURAL ACTION HUBS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Hub 1: EMGS Calculator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#BA2E34] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#0B2553] text-base font-heading">
              EMGS Statutory Fee Calculator
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculate exact upfront immigration costs, student visa processing fees, Malaysian health insurance, and personal bond in MYR, PKR &amp; USD.
            </p>
          </div>
          <Link
            href="/calculator"
            className="btn-meezab-red py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between text-center"
          >
            <span>Launch Visa Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hub 2: Universities Directory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B2553] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#0B2553] text-base font-heading">
              Accredited Campuses Directory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse world-ranked Malaysian institutions including Lincoln, APU, Sunway, MAHSA, Cyberjaya, and UK/Australia branch campuses.
            </p>
          </div>
          <Link
            href="/universities"
            className="btn-meezab-navy py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between text-center"
          >
            <span>Browse Campuses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hub 3: Free Student Assessment */}
        <div className="bg-[#FEF2F2]/60 p-6 rounded-2xl border border-[#FECACA] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#BA2E34] text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#0B2553] text-base font-heading">
              Free 1-on-1 Profile Assessment
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Not sure which degree or intake matches your marks and budget? Talk to certified Meezab education counselors for an academic review.
            </p>
          </div>
          <a
            href="https://wa.me/923346596725?text=Hello%20Meezab%20Counselor%2C%20I%20want%20a%20free%20admission%20assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba57] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
          >
            <span>Chat with Senior Advisor</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 5. POPULAR DISCIPLINES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2553] font-heading">
              Popular Study Disciplines
            </h2>
            <p className="text-xs text-slate-500">Quickly filter 1,200+ accredited degrees by field</p>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#0B2553] hover:text-[#BA2E34] flex items-center gap-1">
            <span>View All Programs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/programs?search=${encodeURIComponent(cat.query)}`}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-[#0B2553] hover:bg-slate-50 text-center transition-all shadow-2xs group flex flex-col items-center justify-center gap-1.5"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0B2553] leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. FEATURED UNIVERSITIES SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2553] font-heading">
              Featured Partner Universities
            </h2>
            <p className="text-xs text-slate-500">Direct admission partnerships with full fee transparency</p>
          </div>
          <Link href="/universities" className="text-xs font-bold text-[#0B2553] hover:text-[#BA2E34] flex items-center gap-1">
            <span>All Universities</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredUniversities.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#0B2553] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-100 p-1.5 bg-slate-50 flex items-center justify-center shrink-0">
                    {uni.logo ? (
                      <img src={uni.logo} alt={uni.name} className="max-h-full object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  {uni.qsRank && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-[#9E6A00] border border-amber-200">
                      QS Rank #{uni.qsRank}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-sm text-[#0B2553] leading-snug">
                  {uni.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{uni.location || 'Malaysia'}</span>
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
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
                  className="text-xs font-bold text-[#0B2553] hover:text-[#BA2E34] flex items-center gap-1"
                >
                  <span>View Campus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. POPULAR ACCREDITED PROGRAMS PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2553] font-heading">
              Popular Degree Programs
            </h2>
            <p className="text-xs text-slate-500">Official tuition with zero consultant addition</p>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#0B2553] hover:text-[#BA2E34] flex items-center gap-1">
            <span>Browse All Programs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#0B2553] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0B2553] border border-blue-100 uppercase">
                    {prog.level}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {prog.durationYears ? `${prog.durationYears} Years` : 'Full-time'}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-[#0B2553] leading-snug line-clamp-2">
                  {prog.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {prog.university?.name}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Total Course Tuition:</span>
                  <span className="text-sm font-extrabold text-[#0B2553]">
                    {formatMYR(prog.tuitionMYR)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-medium">First Year Tuition:</span>
                  <span className="text-xs font-black text-[#0B2553]">
                    {formatMYR(getFirstYearTuition(prog))}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-medium">Upfront (eVAL + Admin):</span>
                  <span className="text-xs font-bold text-[#BA2E34]">
                    {formatMYR(prog.totalInitialMYR || 9500)}
                  </span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/programs/${prog.id}`}
                    className="flex-1 text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                  >
                    Details
                  </Link>
                  <ApplyButton
                    programTitle={prog.name}
                    programId={prog.id}
                    className="flex-1 py-2 px-3 btn-meezab-red text-xs font-bold rounded-xl shadow-xs text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. SIMPLE & TRANSPARENT ROADMAP */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#BA2E34] bg-[#FEF2F2] px-2.5 py-1 rounded-full border border-[#FECACA] inline-block mb-2 font-heading">
            Simple Process
          </span>
          <h2 className="text-xl font-black text-[#0B2553] font-heading">
            How Direct Admissions Work
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Complete transparency from initial evaluation to visa sticker and campus onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-lg font-black text-[#0B2553] font-heading">01</span>
            <h3 className="font-bold text-xs text-[#0B2553]">Profile Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We review your FSc/A-Levels transcripts to match university eligibility and budget.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-lg font-black text-[#BA2E34] font-heading">02</span>
            <h3 className="font-bold text-xs text-[#0B2553]">Offer Letter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official university admission offer letter issued directly within 48 to 72 hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-lg font-black text-[#E8A300] font-heading">03</span>
            <h3 className="font-bold text-xs text-[#0B2553]">EMGS Visa eVAL</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Statutory documents submitted to EMGS for student visa eVAL (14-21 days).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-lg font-black text-emerald-600 font-heading">04</span>
            <h3 className="font-bold text-xs text-[#0B2553]">Arrival &amp; Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free airport reception in Kuala Lumpur, post-arrival clinic check, and university enrollment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
