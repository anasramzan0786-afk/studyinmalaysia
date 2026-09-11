import React from 'react';
import { db } from '@/lib/db';
import { AdminUniversitiesClient } from '@/components/admin/AdminUniversitiesClient';

export const dynamic = 'force-dynamic';

export default async function AdminUniversitiesPage() {
  const universities = await db.university.findMany({
    include: {
      _count: {
        select: { programs: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return <AdminUniversitiesClient initialUniversities={universities} />;
}

