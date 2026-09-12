'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  GraduationCap,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useCounseling } from '@/components/CounselingContext';

export function QuickIntakeMatcher() {
  const { openModal } = useCounseling();
  const [level, setLevel] = useState<'bachelor' | 'master' | 'phd'>('bachelor');
  const [field, setField] = useState<string>('tech');

  const matches = {
    bachelor: {
      tech: {
        uni: 'APU / Lincoln',
        tuition: 'From RM 18,000/yr',
        upfront: 'RM 11,000 Upfront',
        badge: 'Top Tech Employability',
        searchQuery: 'Computer Science',
      },
      business: {
        uni: 'IUC / YPC (LJMU UK)',
        tuition: 'From RM 14,000/yr',
        upfront: 'RM 4,300 - 7,950 Upfront',
        badge: 'Lowest Initial Cost',
        searchQuery: 'Business',
      },
      medicine: {
        uni: 'Cyberjaya / Lincoln',
        tuition: 'PMDC & WHO Listed',
        upfront: 'RM 11,000 - 14,000 Upfront',
        badge: 'Full Hospital Rotation',
        searchQuery: 'Medicine',
      },
    },
    master: {
      tech: {
        uni: 'MMU / Lincoln',
        tuition: 'From RM 23,000 Total',
        upfront: 'RM 10,100 Upfront',
        badge: 'Cyberjaya Tech Valley',
        searchQuery: 'Master Computer',
      },
      business: {
        uni: 'ALFA / IUC (MBA)',
        tuition: 'RM 19,000 Total Course',
        upfront: 'RM 6,000 - 7,950 Upfront',
        badge: 'Lowest MBA in KL',
        searchQuery: 'MBA',
      },
      medicine: {
        uni: 'MAHSA / Cyberjaya',
        tuition: 'Clinical Specialist',
        upfront: 'RM 7,800 - 14,000 Upfront',
        badge: 'Healthcare Specialist',
        searchQuery: 'Health',
      },
    },
    phd: {
      tech: {
        uni: 'MMU / UTM Research',
        tuition: 'From RM 12k/yr',
        upfront: 'RM 4,350 - 10,100 Upfront',
        badge: 'High Citation Index',
        searchQuery: 'PhD Computer',
      },
      business: {
        uni: 'Innovative (IUC)',
        tuition: 'RM 19,980 Total PhD',
        upfront: 'RM 7,950 Upfront',
        badge: 'Guaranteed Installments',
        searchQuery: 'PhD Business',
      },
      medicine: {
        uni: 'MAHSA / UM',
        tuition: 'Doctoral Clinical Research',
        upfront: 'RM 4,750 - 7,800 Upfront',
        badge: 'PMDC Faculty Track',
        searchQuery: 'PhD',
      },
    },
  };

  const currentMatch = matches[level][field as 'tech' | 'business' | 'medicine'];

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.04] p-5 sm:p-6 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
      {/* Decorative ambient badge */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8A300]/20 border border-[#E8A300]/40 flex items-center justify-center text-[#E8A300]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-black tracking-wide text-white uppercase font-heading block">
              Direct Admissions Assistant
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified 2026/2027 Registrar Schedules
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
          Instant Match
        </span>
      </div>

      {/* Interactive Selectors */}
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            1. Target Degree Level:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/30 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setLevel('bachelor')}
              className={`py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                level === 'bachelor'
                  ? 'bg-gradient-to-r from-[#3A60A1] to-[#0B4FD8] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Bachelor
            </button>
            <button
              type="button"
              onClick={() => setLevel('master')}
              className={`py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                level === 'master'
                  ? 'bg-gradient-to-r from-[#3A60A1] to-[#0B4FD8] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Master / MBA
            </button>
            <button
              type="button"
              onClick={() => setLevel('phd')}
              className={`py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                level === 'phd'
                  ? 'bg-gradient-to-r from-[#3A60A1] to-[#0B4FD8] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Ph.D
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            2. Study Discipline:
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setField('tech')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                field === 'tech'
                  ? 'bg-white/15 border-[#E8A300] text-white ring-1 ring-[#E8A300]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="text-base mb-0.5">💻</span>
              <span className="text-[10px] font-bold leading-tight">IT, AI &amp; Cyber</span>
            </button>
            <button
              type="button"
              onClick={() => setField('business')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                field === 'business'
                  ? 'bg-white/15 border-[#E8A300] text-white ring-1 ring-[#E8A300]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="text-base mb-0.5">📈</span>
              <span className="text-[10px] font-bold leading-tight">Business &amp; MBA</span>
            </button>
            <button
              type="button"
              onClick={() => setField('medicine')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                field === 'medicine'
                  ? 'bg-white/15 border-[#E8A300] text-white ring-1 ring-[#E8A300]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="text-base mb-0.5">🩺</span>
              <span className="text-[10px] font-bold leading-tight">Medicine &amp; Health</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result Card Preview */}
      <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">
            Recommended Institution:
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {currentMatch.badge}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="font-heading font-black text-sm text-white">
            {currentMatch.uni}
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-[#E8A300] block">
              {currentMatch.upfront}
            </span>
            <span className="text-[10px] text-slate-400">
              {currentMatch.tuition}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/programs?search=${encodeURIComponent(currentMatch.searchQuery)}`}
          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center border border-white/20 transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Courses</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
        </Link>
        <button
          type="button"
          onClick={() => openModal(`Evaluation for ${level.toUpperCase()} in ${field.toUpperCase()}`)}
          className="btn-meezab-gold py-2.5 px-3 rounded-xl text-xs font-bold text-center shadow-md flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Free Evaluation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Trust Micro-Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#E8A300]" />
          eVAL in 14-21 Days
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Zero Consultant Charge
        </span>
      </div>
    </div>
  );
}
