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
  BookOpen
} from 'lucide-react';
import { ApplyButton } from '@/components/programs/ApplyButton';

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

  // Categories for fast filtering
  const categories = [
    { label: 'Computer Science & AI', icon: '💻', query: 'computer' },
    { label: 'Business & MBA', icon: '📈', query: 'business' },
    { label: 'Engineering & Robotics', icon: '⚙️', query: 'engineering' },
    { label: 'Medicine & Health', icon: '🩺', query: 'health' },
    { label: 'Hospitality & Tourism', icon: '✈️', query: 'hospitality' },
    { label: 'Media & Design', icon: '🎨', query: 'design' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. DASHBOARD WELCOME & GLOBAL SEARCH BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07172B] via-[#0B2553] to-[#0A3F96] p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-slate-700/50">
        {/* Ambient decorative glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#3A60A1]/30 blur-[90px] pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-[#E8A300]/20 blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-amber-300 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Official Admissions Portal • 2026/2027 Intakes Active</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-heading leading-tight">
              Study in Malaysia Admissions Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Compare accredited Malaysian degrees, calculate verified statutory EMGS visa packages, and obtain direct university offer letters with zero consultant charges.
            </p>
          </div>

          {/* Global Quick Course Search Form */}
          <form action="/programs" method="GET" className="flex flex-col sm:flex-row gap-2 max-w-2xl pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder="Search by degree name, subject, or university (e.g. Software Engineering, APU)..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#E8A300] shadow-md"
              />
            </div>
            <button
              type="submit"
              className="btn-meezab-gold px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Live Quick Verification Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% MOHE &amp; MQA Accredited
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct University Registrars
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Zero Consultant Markup
            </span>
          </div>
        </div>
      </div>

      {/* 2. PORTAL STATS & KPI METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Link 
          href="/programs" 
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#3A60A1] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-blue-50 text-[#3A60A1] group-hover:bg-[#3A60A1] group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Live Catalog
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B2553] font-heading">
            {totalProgramsCount > 0 ? `${totalProgramsCount}+` : '1,200+'}
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Accredited Degree Programs</p>
          <p className="text-[11px] text-[#3A60A1] font-bold mt-2 flex items-center gap-1">
            <span>Browse degrees</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* Metric 2 */}
        <Link 
          href="/universities" 
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#3A60A1] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-amber-50 text-[#E8A300] group-hover:bg-[#E8A300] group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B57F00] bg-[#E8A300]/15 px-2 py-0.5 rounded-md">
              Top Ranked
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B2553] font-heading">
            {totalUniCount > 0 ? `${totalUniCount}` : '24+'}
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Partner Malaysian Campuses</p>
          <p className="text-[11px] text-[#3A60A1] font-bold mt-2 flex items-center gap-1">
            <span>View campuses</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* Metric 3 */}
        <Link 
          href="/calculator" 
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#3A60A1] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
              EMGS Standard
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B2553] font-heading">
            14–21 Days
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Average eVAL Visa Approval</p>
          <p className="text-[11px] text-[#3A60A1] font-bold mt-2 flex items-center gap-1">
            <span>Visa breakdown</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              Meezab Guarantee
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
            0% Markup
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Direct University Fee Invoicing</p>
          <p className="text-[11px] text-slate-400 font-medium mt-2">
            No hidden agent fee charged
          </p>
        </div>
      </div>

      {/* 3. QUICK ACTION DASHBOARD UTILITIES (3 HUBS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Hub 1: EMGS Fee Calculator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#E8A300] hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#E8A300]">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#0B2553] font-heading">
              EMGS Statutory Fee Calculator
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculate exact upfront immigration costs, student visa processing fees, Malaysian health insurance, and personal bond fees in MYR, PKR &amp; USD.
            </p>
          </div>
          <Link
            href="/calculator"
            className="mt-5 btn-meezab-gold text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-between shadow-xs"
          >
            <span>Launch Visa Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hub 2: Top Universities Directory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#3A60A1] hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#3A60A1]">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#0B2553] font-heading">
              Accredited Campuses Directory
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse world-ranked Malaysian institutions including Lincoln, APU, Sunway, MAHSA, and UK/Australia branch campuses with QS ratings.
            </p>
          </div>
          <Link
            href="/universities"
            className="mt-5 bg-slate-900 hover:bg-[#0B2553] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors shadow-xs"
          >
            <span>Browse Campuses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hub 3: Free Student Profile Evaluation */}
        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-6 rounded-2xl border border-blue-200/70 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3A60A1] text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#0B2553] font-heading">
              Free 1-on-1 Profile Assessment
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Not sure which degree or intake matches your marks? Talk to our certified Malaysian education counselors for an instant academic evaluation.
            </p>
          </div>
          <a
            href="https://wa.me/923346596725?text=Hello%20Meezab%20Counselor%2C%20I%20want%20a%20free%20admission%20assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors shadow-xs"
          >
            <span>Chat with Senior Advisor</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 4. FAST DEGREE CATEGORY EXPLORER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2553] font-heading">
              Explore Popular Disciplines
            </h2>
            <p className="text-xs text-slate-500">Quickly filter 1,200+ programs by high-demand Malaysian career tracks</p>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#3A60A1] hover:underline flex items-center gap-1">
            <span>View All Programs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/programs?search=${encodeURIComponent(cat.query)}`}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-[#3A60A1] hover:bg-blue-50/40 text-center transition-all shadow-2xs group flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0B2553] leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. FEATURED UNIVERSITIES SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2553] font-heading">
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
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#3A60A1] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl border border-slate-100 p-2 bg-slate-50 flex items-center justify-center shrink-0">
                    {uni.logo ? (
                      <img src={uni.logo} alt={uni.name} className="max-h-full object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  {uni.qsRank && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8A300]/15 text-[#9E6A00] border border-[#E8A300]/30">
                      QS Rank #{uni.qsRank}
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

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  MQA Verified
                </span>
                <Link
                  href={`/universities/${uni.id}`}
                  className="text-xs font-bold text-[#3A60A1] hover:text-[#0B2553] flex items-center gap-1"
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
            <h2 className="text-lg font-extrabold text-[#0B2553] font-heading">
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
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#E8A300] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-[#3A60A1] border border-blue-200/60 uppercase">
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

              <div className="pt-4 mt-4 border-t border-slate-100">
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
                    className="flex-1 text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                  >
                    Details
                  </Link>
                  <ApplyButton
                    programTitle={prog.name}
                    programId={prog.id}
                    className="flex-1 py-2 px-3 btn-meezab-gold text-xs font-bold rounded-xl shadow-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 4-STEP DIRECT ADMISSION & EMGS VISA WORKFLOW */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
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
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
            <span className="text-2xl font-black text-[#E8A300] font-heading">01</span>
            <h3 className="font-extrabold text-sm text-[#0B2553]">Profile Evaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Counselors review your academic transcripts to match eligibility and tuition budget.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
            <span className="text-2xl font-black text-[#3A60A1] font-heading">02</span>
            <h3 className="font-extrabold text-sm text-[#0B2553]">Direct Offer Letter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official university admission offer letter issued directly within 48 to 72 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
            <span className="text-2xl font-black text-[#E8A300] font-heading">03</span>
            <h3 className="font-extrabold text-sm text-[#0B2553]">EMGS Visa eVAL</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Statutory documentation submitted to EMGS for official student visa approval (14-21 days).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
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
