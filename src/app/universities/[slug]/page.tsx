import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatMYR, formatPKR } from '@/lib/utils';
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ApplyButton } from '@/components/programs/ApplyButton';

interface UniversityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: UniversityDetailPageProps) {
  const { slug } = await params;
  const uni = await db.university.findUnique({
    where: { slug },
  });

  if (!uni) return { title: 'University Not Found' };

  return {
    title: `${uni.name} | Fee Structure, Courses & Admission Guidance`,
    description: `Complete admissions guide for ${uni.name}, Malaysia. Fees for Pakistani students, EMGS packages, hostel costs and accredited programs.`,
  };
}

export default async function UniversityDetailPage({ params }: UniversityDetailPageProps) {
  const { slug } = await params;
  const university = await db.university.findUnique({
    where: { slug },
    include: {
      programs: {
        orderBy: { tuitionMYR: 'asc' },
      },
    },
  });

  if (!university) {
    notFound();
  }

  const highlights: string[] = university.highlights
    ? JSON.parse(university.highlights)
    : ['5-Star SETARA Rated', 'Direct Admissions Support', 'MQA Accredited'];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/universities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Universities</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="h-64 sm:h-80 bg-slate-900 relative">
            <img
              src={university.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80'}
              alt={university.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md">
                    {university.type}
                  </span>
                  {university.qsRank && (
                    <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md">
                      🏆 {university.qsRank}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {university.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{university.location}</span>
                </p>
              </div>

              <div className="shrink-0">
                <ApplyButton
                  programTitle={`General Admission - ${university.name}`}
                  programId={university.id}
                  label="Consult Admissions Desk"
                  variant="primary"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Upfront eVAL Package:</span>
              <span className="text-base font-extrabold text-emerald-700">
                {formatMYR(university.totalInitialMYR || 11000)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">On-Campus Hostel:</span>
              <span className="text-sm font-bold text-slate-800">
                {university.hostelMonthly || 'RM 550 - 900 /mo'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Living Cost Tier:</span>
              <span className="text-sm font-bold text-slate-800">
                {university.livingCostTier || 'Moderate'} (~RM {university.livingCostMonthly || 1400}/mo)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Main Intakes:</span>
              <span className="text-sm font-bold text-slate-800">
                {university.intakeMonths || 'Jan, May, Sep'}
              </span>
            </div>
          </div>
        </div>

        {/* Overview & Highlights */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">About Institution</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {university.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Campus Highlights:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {university.initialBreakdownNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 space-y-1">
              <span className="font-bold block text-blue-800">Pakistan Desk Fee Note:</span>
              <p>{university.initialBreakdownNotes}</p>
            </div>
          )}
        </div>

        {/* Programs Offered */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Available Programs ({university.programs.length})
            </h2>
            <span className="text-xs text-slate-500">MQA Accredited</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {university.programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {prog.degreeLevel}
                    </span>
                    <span className="text-slate-500">{prog.duration}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                    <Link href={`/programs/${prog.slug}`} className="hover:text-blue-700">
                      {prog.title}
                    </Link>
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Tuition</span>
                      <span className="font-bold text-slate-900">{formatMYR(prog.tuitionMYR)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Upfront eVAL</span>
                      <span className="font-bold text-emerald-700">
                        {formatMYR(prog.totalInitialMYR || 9500)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    <span>View Requirements</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

