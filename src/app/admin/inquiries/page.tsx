import React from 'react';
import { db } from '@/lib/db';
import { AdminInquiriesClient } from '@/components/admin/AdminInquiriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminInquiriesClient initialInquiries={inquiries} />;
}

