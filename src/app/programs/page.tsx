import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import { ProgramListClient } from '@/components/programs/ProgramListClient';
import { GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'Explore Accredited Degrees in Malaysia | Study Malaysia Portal',
  description:
    'Search and compare over 1,200 accredited Bachelor, Master, PhD and Diploma degrees across top Malaysian universities with transparent tuition fees and EMGS packages.',
};

export const revalidate = 60; // 60s cache

export default async function ProgramsPage() {
  let programs: any[] = [];
let universities: any[] = [];
try {
  [programs, universities] = await Promise.all([
    db.program.findMany({
      include: { 
        university: { select: { id: true, name: true, shortName: true, logo: true, location: true } },
        semesterSchedules: true,
      },
      orderBy: { tuitionMYR: 'asc' },
    }),
    db.university.findMany({
      select: { id: true, name: true, shortName: true },
      orderBy: { name: 'asc' },
    }),
  ]);
} catch (e) {
  console.warn('Prisma DB not available during build – using fallback data for programs page.', e);
}

  return (
    <div className="bg-[#F9F9F9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3A60A1] bg-[#3A60A1]/10 px-3.5 py-1 rounded-full mb-2 border border-[#3A60A1]/20">
            <GraduationCap className="w-4 h-4 text-[#E8A300]" />
            <span>Meezab Course Directory • MQA &amp; MOHE Accredited</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2553] tracking-tight">
            Explore Higher Education Programs
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Compare programs across top Malaysian campuses with full fee transparency. All tuition fees and upfront visa packages are verified directly with university registrars.
          </p>
        </div>

        {/* Client Interactive Filter & List Component */}
        <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading course catalog...</div>}>
          <ProgramListClient initialPrograms={programs} universities={universities} />
        </Suspense>
      </div>
    </div>
  );
}

