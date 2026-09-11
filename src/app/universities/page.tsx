import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatMYR } from '@/lib/utils';
import { Building2, MapPin, ChevronRight, Award, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Top Universities in Malaysia | Study Malaysia Portal',
  description:
    'Comprehensive directory of MOHE and MQA accredited Malaysian universities with tuition ranges, QS rankings, upfront fees and campus details.',
};

export const revalidate = 60;

export default async function UniversitiesPage() {
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
                      {uni._count.programs} Listed Programs
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

