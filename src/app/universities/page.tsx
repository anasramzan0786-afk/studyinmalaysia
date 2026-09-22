import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatMYR } from '@/lib/utils';
import { getAuthSession } from '@/lib/auth';
import { Building2, MapPin, ChevronRight, Award, DollarSign, Plus, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Top Universities in Malaysia | Study Malaysia Portal',
  description:
    'Comprehensive directory of MOHE and MQA accredited Malaysian universities with tuition ranges, QS rankings, upfront fees and campus details.',
};

export const revalidate = 60;

export default async function UniversitiesPage() {
  const session = await getAuthSession();
  const isAdmin = session?.role === 'ADMIN';

  let universities: any[] = [];
  try {
    universities = await db.university.findMany({
      include: { _count: { select: { programs: true } } },
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.warn('Prisma DB not available during build – using fallback universities.', e);
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Action Bar if user is Admin */}
        {isAdmin && (
          <div className="bg-[#0B2553] text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded">
                    Admin Privileges Active
                  </span>
                </div>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  Manage university directory, add new Malaysian institutions, or update fee packages.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/admin/universities?add=true"
                className="btn-meezab-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New University</span>
              </Link>
              <Link
                href="/admin/universities"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 transition-all border border-white/10"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3A60A1] bg-[#3A60A1]/10 px-3.5 py-1 rounded-full mb-2 border border-[#3A60A1]/20">
              <Building2 className="w-4 h-4 text-[#3A60A1]" />
              <span>Meezab Partner Institutions • Malaysia</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2553] tracking-tight">
              Malaysian Universities Directory
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Explore premier private universities, clinical medical faculties, and top UK/Australian international branch campuses across Kuala Lumpur, Selangor, and Penang.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-semibold bg-white px-4 py-2 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
            Showing <strong className="text-slate-900">{universities.length}</strong> Universities
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni) => (
            <Link
              key={uni.id}
              href={`/universities/${uni.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#3A60A1] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  <img
                    src={uni.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'}
                    alt={uni.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2553]/85 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
                    📍 {uni.location}
                  </span>

                  {uni.qsRank && (
                    <span className="absolute top-3 right-3 text-[11px] font-bold text-slate-950 bg-[#FFA300] backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs">
                      🏆 {uni.qsRank}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#3A60A1] bg-[#3A60A1]/10 px-2 py-0.5 rounded-md">
                      {uni.type}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {uni._count?.programs || 0} Listed Programs
                    </span>
                  </div>

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
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Initial Upfront Package
                  </span>
                  <span className="text-sm font-extrabold text-[#0B2553]">
                    {formatMYR(uni.totalInitialMYR || 11000)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3A60A1] group-hover:translate-x-1 transition-transform">
                  <span>View Programs</span>
                  <ChevronRight className="w-4 h-4 text-[#E8A300]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
