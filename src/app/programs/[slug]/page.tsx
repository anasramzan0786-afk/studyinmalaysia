import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatMYR, formatPKR, formatUSD } from '@/lib/utils';
import { 
  Building2, 
  Clock, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ArrowLeft,
  Share2,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ApplyButton } from '@/components/programs/ApplyButton';

interface ProgramDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await db.program.findFirst({
    where: {
      OR: [
        { slug },
        { id: slug },
      ],
    },
    include: { university: true },
  });

  if (!program) {
    return { title: 'Program Not Found' };
  }

  return {
    title: `${program.title} at ${program.university.name} | Fee Structure & Requirements`,
    description: `Official fee structure, EMGS upfront costs, entry criteria and admission dates for ${program.title} at ${program.university.name}, Malaysia.`,
    openGraph: {
      title: `${program.title} | ${program.university.name}`,
      description: `Official tuition fee: RM ${program.tuitionMYR.toLocaleString()}. Verified upfront EMGS package and intake details.`,
    },
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await db.program.findFirst({
    where: {
      OR: [
        { slug },
        { id: slug },
      ],
    },
    include: {
      university: true,
      semesterSchedules: true,
    },
  });

  if (!program) {
    notFound();
  }

  const jsonLdProgram = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: program.title,
    description: program.description || `${program.title} at ${program.university.name}`,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: program.university.name,
      address: program.university.location,
    },
    educationalProgramMode: 'full-time',
    programPrerequisites: program.academicReq || 'High School / FSc / A-Levels Certificate',
    offers: {
      '@type': 'Offer',
      price: program.tuitionMYR,
      priceCurrency: 'MYR',
    },
  };

  const documents = program.documentsReq
    ? JSON.parse(program.documentsReq)
    : [
        'Matric / O-Levels Certificate & Transcripts',
        'Intermediate / FSc / ICS / A-Levels Result Card',
        'Passport full copy (all pages including blank)',
        'Passport size photograph (white background)',
      ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProgram) }}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Courses</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>Programs</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{program.degreeLevel}</span>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
              {program.degreeLevel}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
              {program.faculty}
            </span>
            {program.badgeText && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                ⭐ {program.badgeText}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {program.title}
          </h1>

          {/* University Info */}
          <div className="mt-4 flex items-center gap-3">
            {program.university.logo && (
              <img
                src={program.university.logo}
                alt={program.university.name}
                className="w-10 h-10 object-contain rounded-lg border border-slate-200 p-1 bg-white"
              />
            )}
            <div>
              <Link
                href={`/universities/${program.university.slug}`}
                className="font-bold text-slate-900 hover:text-blue-700 transition-colors text-sm sm:text-base flex items-center gap-1.5"
              >
                <span>{program.university.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <p className="text-xs text-slate-500">📍 {program.university.location}</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Total Tuition</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                {formatMYR(program.tuitionMYR)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                ≈ {formatPKR(program.tuitionMYR)}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Upfront eVAL Package</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-700">
                {formatMYR(program.totalInitialMYR || 9500)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Payable upon visa approval
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Course Duration</span>
              <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{program.duration}</span>
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Upcoming Intakes</span>
              <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{program.intakeMonths}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Academic & Schedule Details (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {program.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h2 className="text-lg font-bold text-slate-900">Program Overview</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {program.description}
                </p>
              </div>
            )}

            {/* Pakistan Upfront Package Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2>eVAL Visa &amp; Initial Upfront Package (Pakistan Desk)</h2>
              </div>
              <p className="text-xs text-slate-500">
                This initial package is paid directly to the university after EMGS issues your official Visa Approval Letter (VAL), prior to flight booking:
              </p>

              <div className="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                  <span className="text-slate-600">EMGS Processing &amp; eVAL Fee:</span>
                  <span className="font-bold text-slate-900">{formatMYR(program.emgsFeeMYR || 3500)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                  <span className="text-slate-600">University Admin, Registration &amp; Security Bond:</span>
                  <span className="font-bold text-slate-900">{formatMYR(program.miscFeesMYR || 6000)}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <span className="font-bold text-slate-900">Total Non-Tuition Initial Payment:</span>
                  <span className="font-extrabold text-emerald-700">{formatMYR(program.totalInitialMYR || 9500)}</span>
                </div>
              </div>

              {program.miscBreakdown && (
                <p className="text-xs text-slate-600 italic bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
                  ℹ️ {program.miscBreakdown}
                </p>
              )}
            </div>

            {/* Semester / Yearly Fee Schedule */}
            {((program.semesterSchedules && program.semesterSchedules.length > 0) || program.firstYearFeeMYR) && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Yearly &amp; Semester Fee Schedule</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                        <th className="py-2.5 px-3">Year / Semester</th>
                        <th className="py-2.5 px-3">Tuition Fee</th>
                        <th className="py-2.5 px-3">Admin / Visa Renewal</th>
                        <th className="py-2.5 px-3 text-right">Total Payable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {program.semesterSchedules && program.semesterSchedules.length > 0 ? (
                        program.semesterSchedules.map((sem, idx) => (
                          <tr key={sem.id || idx} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-semibold text-slate-800">{sem.semester}</td>
                            <td className="py-3 px-3 text-slate-600">{formatMYR(sem.tuitionMYR)}</td>
                            <td className="py-3 px-3 text-slate-600">{formatMYR(sem.miscMYR)}</td>
                            <td className="py-3 px-3 font-bold text-slate-900 text-right">
                              {formatMYR(sem.tuitionMYR + sem.miscMYR)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <>
                          {program.firstYearFeeMYR && (
                            <tr className="hover:bg-slate-50">
                              <td className="py-3 px-3 font-semibold text-slate-800">Year 1</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(program.firstYearFeeMYR)}</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(program.miscFeesMYR || 6000)}</td>
                              <td className="py-3 px-3 font-bold text-slate-900 text-right">
                                {formatMYR(program.firstYearFeeMYR + (program.miscFeesMYR || 6000))}
                              </td>
                            </tr>
                          )}
                          {program.secondYearFeeMYR && (
                            <tr className="hover:bg-slate-50">
                              <td className="py-3 px-3 font-semibold text-slate-800">Year 2</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(program.secondYearFeeMYR)}</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(1600)}</td>
                              <td className="py-3 px-3 font-bold text-slate-900 text-right">
                                {formatMYR(program.secondYearFeeMYR + 1600)}
                              </td>
                            </tr>
                          )}
                          {program.thirdYearFeeMYR && (
                            <tr className="hover:bg-slate-50">
                              <td className="py-3 px-3 font-semibold text-slate-800">Year 3</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(program.thirdYearFeeMYR)}</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(1600)}</td>
                              <td className="py-3 px-3 font-bold text-slate-900 text-right">
                                {formatMYR(program.thirdYearFeeMYR + 1600)}
                              </td>
                            </tr>
                          )}
                          {program.fourthYearFeeMYR && (
                            <tr className="hover:bg-slate-50">
                              <td className="py-3 px-3 font-semibold text-slate-800">Year 4</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(program.fourthYearFeeMYR)}</td>
                              <td className="py-3 px-3 text-slate-600">{formatMYR(1600)}</td>
                              <td className="py-3 px-3 font-bold text-slate-900 text-right">
                                {formatMYR(program.fourthYearFeeMYR + 1600)}
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Entry Requirements */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Academic &amp; English Requirements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 block">Academic Criteria:</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {program.academicReq || 'Recognized high school certificate / FSc / A-Levels with passing grades.'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 block">English Language Criteria:</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {program.englishReq || 'IELTS 5.5 - 6.0 or English proficiency letter from previous institution.'}
                  </p>
                </div>
              </div>

              {/* Documents checklist */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Required Application Documents:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {documents.map((doc: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Box */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Admissions Open
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-2">
                  Apply for {program.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Meezab Education is the direct verified admissions desk for {program.university.name}.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <ApplyButton
                  programTitle={program.title}
                  programId={program.id}
                  label="Apply / Book Counseling"
                  variant="primary"
                />
                <ApplyButton
                  programTitle={program.title}
                  programId={program.id}
                  variant="whatsapp"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No Service Charges for Admissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Direct eVAL Application via EMGS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Free Document Assessment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

