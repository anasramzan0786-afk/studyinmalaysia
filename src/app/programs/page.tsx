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
      include: { university: { select: { id: true, name: true, shortName: true, logo: true, location: true } } },
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
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>MQA &amp; MOHE Accredited Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Higher Education Programs
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Compare programs across top Malaysian campuses with full fee transparency. All tuition fees and upfront visa packages are verified directly with admissions departments.
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

