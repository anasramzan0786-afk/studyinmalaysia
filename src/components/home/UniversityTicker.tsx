'use client';

import React from 'react';
import Link from 'next/link';
import { UNIVERSITIES_DATA } from '@/data/universitiesData';
import { formatMYR } from '@/lib/utils';
import { Award, ChevronRight, ShieldCheck } from 'lucide-react';

export function UniversityTicker() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2553] font-heading">
            Official Partner Campuses &amp; Verified Upfront eVAL Packages
          </h3>
        </div>
        <Link 
          href="/universities" 
          className="text-[11px] font-bold text-[#3A60A1] hover:text-[#0B2553] flex items-center gap-1"
        >
          <span>Compare All 20+ Campuses</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Scrollable institution strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {UNIVERSITIES_DATA.slice(0, 10).map((uni) => (
          <Link
            key={uni.id}
            href={`/universities/${uni.id}`}
            className="shrink-0 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/80 hover:border-[#3A60A1]/50 transition-all duration-200 group min-w-[210px]"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
              {uni.logo ? (
                <img src={uni.logo} alt={uni.shortName} className="max-h-full object-contain" />
              ) : (
                <span className="text-xs font-bold text-[#3A60A1]">{uni.shortName?.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-[#0B2553] group-hover:text-[#3A60A1] truncate leading-tight">
                  {uni.shortName || uni.name}
                </p>
              </div>
              <p className="text-[10px] font-extrabold text-emerald-700 mt-0.5">
                Upfront: {formatMYR(uni.totalInitialMYR || 11000)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
