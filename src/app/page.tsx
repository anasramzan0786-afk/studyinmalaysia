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
  Award
} from 'lucide-react';
import { AnimatedHero } from '@/components/home/AnimatedHero';
import { InteractiveFeeExplorer } from '@/components/home/InteractiveFeeExplorer';
import { StudentTestimonials } from '@/components/home/StudentTestimonials';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function HomePage() {
  // During static pre‑render we may not have a local SQLite DB (e.g., CI/CD or Vercel preview).
  // Fall back to empty data so the page can still build.
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
// Fallback block ends here

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* 1. ANIMATED ATMOSPHERIC HERO SECTION */}
      <AnimatedHero
        totalProgramsCount={totalProgramsCount}
        totalUniCount={totalUniCount}
      />

      {/* 2. HOW WE WORK: 4-STEP PATHWAY (FROM MEEZAB WEBSITE) */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3A60A1] bg-[#3A60A1]/10 px-3.5 py-1 rounded-full border border-[#3A60A1]/20 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E8A300]" />
              How We Work • Meezab Advisory
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B2553] tracking-tight">
              Your Pathway to Academic Success
            </h2>
            <p className="text-sm text-slate-600">
              End-to-end guidance from your initial counseling to visa sticker approval and arrival in Malaysia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F9F9F9] p-6 rounded-2xl border border-slate-200 hover:border-[#E8A300] hover:shadow-lg transition-all group">
              <span className="text-3xl font-black text-[#E8A300] block mb-2 group-hover:scale-105 transition-transform">01</span>
              <h3 className="text-lg font-bold text-[#0B2553] mb-1.5">Student Counseling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Free one-on-one profiling to find the ideal Malaysian university &amp; program suited to your academic history and budget.
              </p>
            </div>

            <div className="bg-[#F9F9F9] p-6 rounded-2xl border border-slate-200 hover:border-[#E8A300] hover:shadow-lg transition-all group">
              <span className="text-3xl font-black text-[#3A60A1] block mb-2 group-hover:scale-105 transition-transform">02</span>
              <h3 className="text-lg font-bold text-[#0B2553] mb-1.5">Direct Admission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official offer letters issued directly from Malaysian university registrars within 48 to 72 hours without third-party delay.
              </p>
            </div>

            <div className="bg-[#F9F9F9] p-6 rounded-2xl border border-slate-200 hover:border-[#E8A300] hover:shadow-lg transition-all group">
              <span className="text-3xl font-black text-[#E8A300] block mb-2 group-hover:scale-105 transition-transform">03</span>
              <h3 className="text-lg font-bold text-[#0B2553] mb-1.5">EMGS Visa Processing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete submission to Education Malaysia Global Services (EMGS) with real-time statutory fee transparency and eVAL tracking.
              </p>
            </div>

            <div className="bg-[#F9F9F9] p-6 rounded-2xl border border-slate-200 hover:border-[#E8A300] hover:shadow-lg transition-all group">
              <span className="text-3xl font-black text-[#3A60A1] block mb-2 group-hover:scale-105 transition-transform">04</span>
              <h3 className="text-lg font-bold text-[#0B2553] mb-1.5">Pre-Departure &amp; Arrival</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Airport reception at KLIA, on-campus hostel allocation, post-arrival clinic registration, and biometric i-Kad completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED UNIVERSITIES */}
      <section className="py-20 bg-[#F9F9F9] px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A60A1] bg-[#3A60A1]/10 px-3 py-1 rounded-full border border-[#3A60A1]/20 mb-2">
                <Building2 className="w-4 h-4 text-[#3A60A1]" />
                <span>Premier Campuses</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2553] tracking-tight">
                Top Malaysian Higher Education Institutions
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Direct partner universities offering UK dual awards, QS-ranked degrees, and accredited medical &amp; engineering faculties.
              </p>
            </div>
            <Link
              href="/universities"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3A60A1] hover:text-[#0B2553] transition-colors group"
            >
              <span>View All Campuses ({totalUniCount})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredUniversities.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-[#3A60A1] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img
                      src={uni.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'}
                      alt={uni.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2553]/90 via-[#0B2553]/20 to-transparent" />
                    
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                      📍 {uni.location}
                    </span>

                    {uni.qsRank && (
                      <span className="absolute top-3 right-3 text-[11px] font-bold text-slate-950 bg-[#FFA300] backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
                        🏆 {uni.qsRank}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-[#0B2553] group-hover:text-[#3A60A1] transition-colors">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {uni.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Initial Upfront Package
                    </span>
                    <span className="text-base font-extrabold text-[#0B2553]">
                      {formatMYR(uni.totalInitialMYR || 11000)}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3A60A1] group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4 text-[#E8A300]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE BUDGET & FEE EXPLORER */}
      <InteractiveFeeExplorer />

      {/* 5. POPULAR PROGRAMS DIRECTORY PREVIEW */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A60A1] bg-[#3A60A1]/10 px-3 py-1 rounded-full border border-[#3A60A1]/20 mb-2">
                <GraduationCap className="w-4 h-4 text-[#3A60A1]" />
                <span>Accredited Courses</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2553] tracking-tight">
                Featured Programs for Pakistani Students
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Transparent tuition fees, initial non-tuition packages, and entry criteria.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3A60A1] hover:text-[#0B2553] transition-colors group"
            >
              <span>Browse All Programs ({totalProgramsCount})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPrograms.map((prog) => (
              <div
                key={prog.id}
                className="group bg-[#F9F9F9] hover:bg-white rounded-2xl border border-slate-200 hover:border-[#3A60A1] p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#3A60A1] bg-[#3A60A1]/10 px-2.5 py-1 rounded-md">
                      {prog.degreeLevel}
                    </span>
                    {prog.badgeText && (
                      <span className="text-[10px] font-semibold text-[#B57F00] bg-[#E8A300]/15 px-2 py-0.5 rounded-md border border-[#E8A300]/30">
                        {prog.badgeText}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#0B2553] line-clamp-2 group-hover:text-[#3A60A1] transition-colors">
                    <Link href={`/programs/${prog.slug}`}>
                      {prog.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 font-medium mt-1">
                    🏛️ {prog.university.name}
                  </p>

                  <div className="mt-4 bg-white group-hover:bg-[#F9F9F9] p-3.5 rounded-xl border border-slate-200 space-y-1.5 transition-colors">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Full Course Tuition:</span>
                      <span className="font-bold text-[#0B2553]">{formatMYR(prog.tuitionMYR)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Upfront eVAL Package:</span>
                      <span className="font-extrabold text-[#B57F00]">{formatMYR(prog.totalInitialMYR)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Approx. in PKR:</span>
                      <span>{formatPKR(prog.tuitionMYR)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    ⏳ {prog.duration}
                  </span>
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="btn-meezab-navy inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
                  >
                    <span>View Fees &amp; Apply</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#E8A300]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STUDENT TESTIMONIALS */}
      <StudentTestimonials />

      {/* 7. VISA & EMGS TRANSPARENCY SECTION */}
      <section className="py-20 bg-[#0B2553] text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#E8A300]/20 text-[#FFA300] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#E8A300]/40">
              <ShieldCheck className="w-4 h-4" />
              <span>Official EMGS Statutory Breakdown</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Know Every Dollar &amp; Ringgit Before You Fly
            </h2>
            <p className="text-slate-200 text-base leading-relaxed">
              No hidden file charges or inflated consultant markups. We calculate the exact Education Malaysia Global Services (EMGS) fee, medical screening cost, and personal bond specific to your chosen university.
            </p>

            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E8A300] shrink-0" />
                <span>Statutory EMGS &amp; eVAL Visa Approval Letter issued directly to your name.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E8A300] shrink-0" />
                <span>Annual comprehensive hospitalization &amp; emergency health insurance.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E8A300] shrink-0" />
                <span>Full pre &amp; post-arrival medical screening clearance guarantee.</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                href="/calculator"
                className="btn-meezab-gold inline-flex items-center gap-2.5 font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm active:scale-95 cursor-pointer"
              >
                <Calculator className="w-5 h-5 text-white" />
                <span>Launch Interactive Visa Cost Calculator</span>
              </Link>
            </div>
          </div>

          {/* Calculator Card Illustration */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-bold text-base text-white">Sample Package (Private Uni, 3 Years)</span>
              <span className="text-xs bg-[#E8A300]/20 text-[#FFA300] font-bold px-2.5 py-1 rounded-md border border-[#E8A300]/40">
                Official Rates
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-200">
                <span>EMGS Application &amp; VAL</span>
                <span className="font-semibold text-white">RM 1,800</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span>Medical Insurance (3 Years)</span>
                <span className="font-semibold text-white">RM 2,400</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span>Post-Arrival Medical Screenings</span>
                <span className="font-semibold text-white">RM 750</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span>i-Kad Smart Biometric Pass</span>
                <span className="font-semibold text-white">RM 300</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span>Student Pass Sticker &amp; MEV</span>
                <span className="font-semibold text-white">RM 120</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 block">Total Statutory Immigration Cost</span>
                <span className="text-2xl font-black text-[#FFA300]">RM 5,370</span>
              </div>
              <span className="text-xs text-slate-300 font-medium">
                ≈ Rs. 335,000 PKR
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DIRECT ADMISSION SUPPORT CTA */}
      <section className="py-16 bg-gradient-to-r from-[#0B2553] via-[#102A56] to-[#0B2553] text-white px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Start Your Malaysian Higher Education Journey?
          </h2>
          <p className="text-slate-200 text-base max-w-2xl mx-auto">
            Speak directly with our official admission counselors at Meezab Future Consulting. We evaluate your Matric/FSc/A-Levels results and issue official university conditional offer letters within 48 to 72 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/923346596725?text=Hello%20Meezab%20Admissions%20Desk%2C%20I%20want%20to%20apply%20for%20admission%20in%20Malaysia"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-meezab-gold inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-sm cursor-pointer"
            >
              <span>Connect on WhatsApp Desk (+92 334 6596725)</span>
            </a>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-white text-[#0B2553] hover:bg-slate-100 font-bold px-6 py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              <span>Browse Course Catalog</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

