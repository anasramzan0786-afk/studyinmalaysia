'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Plus, Edit3, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { formatMYR } from '@/lib/utils';

interface UniversityWithCount {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: string;
  qsRank: string | null;
  location: string;
  totalInitialMYR: number | null;
  _count: { programs: number };
}

export function AdminUniversitiesClient({
  initialUniversities,
}: {
  initialUniversities: UniversityWithCount[];
}) {
  const [universities, setUniversities] = useState<UniversityWithCount[]>(initialUniversities);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Universities</h1>
          <p className="text-xs text-slate-500 mt-1">
            {universities.length} institutions currently configured in the database.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">University Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">QS Rank</th>
                <th className="py-3 px-4">Programs</th>
                <th className="py-3 px-4">Upfront Package</th>
                <th className="py-3 px-4 text-right">View Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {universities.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <Link
                      href={`/universities/${u.slug}`}
                      target="_blank"
                      className="hover:text-blue-700 flex items-center gap-1.5"
                    >
                      <span>{u.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      {u.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{u.location}</td>
                  <td className="py-3.5 px-4 font-semibold text-amber-700">
                    {u.qsRank || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {u._count.programs} courses
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {formatMYR(u.totalInitialMYR || 11000)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/universities/${u.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      Open Campus →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

