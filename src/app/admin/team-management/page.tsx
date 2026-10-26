import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { DEFAULT_DIRECT_PANEL_UNIVERSITIES } from '@/lib/team-config';
import { AdminTeamManagementClient } from '@/components/admin/AdminTeamManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminTeamManagementPage() {
  // 1. Strict Server-Side Security Check: Only ADMIN role allowed
  const session = await getAuthSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/admin?error=admin_exclusive_access');
  }

  // 2. Fetch or Auto-Seed Direct Panel Universities
  let panelUnis = await db.directPanelUniversity.findMany({
    orderBy: { name: 'asc' },
  });

  if (panelUnis.length === 0) {
    for (const uni of DEFAULT_DIRECT_PANEL_UNIVERSITIES) {
      await db.directPanelUniversity.create({
        data: uni,
      }).catch(() => {});
    }
    panelUnis = await db.directPanelUniversity.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // 3. Fetch Tracked Counselors (Admin-managed custom list)
  const counselors = await db.trackedCounselor.findMany({
    orderBy: { name: 'asc' },
  });

  // 4. Fetch Cases with relations
  const cases = await db.studentCase.findMany({
    include: {
      counselor: {
        select: { id: true, name: true, email: true },
      },
      referrals: {
        orderBy: { createdAt: 'desc' },
      },
      timelineLogs: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // 5. Fetch Branch Referrals
  const referrals = await db.branchReferral.findMany({
    include: {
      studentCase: {
        select: {
          id: true,
          studentName: true,
          phone: true,
          targetUniversity: true,
          targetProgram: true,
          status: true,
          counselorName: true,
        },
      },
    },
    orderBy: { transferDate: 'desc' },
  });

  return (
    <AdminTeamManagementClient
      initialCases={cases as any}
      counselors={counselors}
      initialReferrals={referrals as any}
      initialPanelUnis={panelUnis}
    />
  );
}
