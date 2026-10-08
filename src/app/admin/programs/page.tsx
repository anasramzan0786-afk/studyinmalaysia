import React from 'react';
import { db } from '@/lib/db';
import { AdminProgramsClient } from '@/components/admin/AdminProgramsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProgramsPage() {
  const [programs, universities] = await Promise.all([
    db.program.findMany({
      include: {
        university: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.university.findMany({
      select: {
        id: true,
        name: true,
        shortName: true,
        type: true,
        emgsFeeMYR: true,
        miscFeesMYR: true,
        totalInitialMYR: true,
        intakeMonths: true,
        tuitionBachelor: true,
        tuitionMaster: true,
        tuitionPhd: true,
        avgTuition3Yr: true,
        initialBreakdownNotes: true,
        location: true,
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  return <AdminProgramsClient initialPrograms={programs} universities={universities} />;
}

