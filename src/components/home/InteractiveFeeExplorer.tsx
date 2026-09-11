'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Sparkles, 
  ChevronRight, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  GraduationCap
} from 'lucide-react';
import { formatMYR, formatPKR, formatUSD } from '@/lib/utils';
import { useCounseling } from '@/components/CounselingContext';

interface SampleProgram {
  id: string;
  slug: string;
  title: string;
  uniName: string;
  degreeLevel: string;
  duration: string;
  tuitionMYR: number;
  totalInitialMYR: number;
  highlights: string;
}

const PRESET_PROGRAMS: SampleProgram[] = [
  {
    id: '1',
    slug: 'bachelor-of-computer-science-hons-cyber-security-and-ai-luc-cs-2',
    title: 'B.Sc (Hons) Computer Science (Cyber Security & AI)',
    uniName: 'Lincoln University College (LUC)',
    degreeLevel: "Bachelor's Degree",
    duration: '3 Years',
    tuitionMYR: 60000,
    totalInitialMYR: 11000,
    highlights: 'MQA Accredited • Affordable Clinical / Tech Campus',
  },
  {
    id: '2',
    slug: 'bachelor-of-science-hons-in-artificial-intelligence-apu-ai-1',
    title: 'B.Sc (Hons) in Artificial Intelligence & Robotics',
    uniName: 'Asia Pacific University (APU)',
    degreeLevel: "Bachelor's Degree",
    duration: '3 Years',
    tuitionMYR: 98000,
    totalInitialMYR: 10000,
    highlights: 'Dual Degree with De Montfort UK • #1 Tech Campus',
  },
  {
    id: '3',
    slug: 'uk-degree-transfer-programme-law-llb-hons-bac-law-1',
    title: 'UK Degree Transfer Programme (Law) LLB (Hons)',
    uniName: 'Brickfields Asia College (BAC)',
    degreeLevel: "Bachelor's Degree",
    duration: '3 Years (2+1 UK)',
    tuitionMYR: 65000,
    totalInitialMYR: 9000,
    highlights: 'Top UK Bar Transfer • London University Route',
  },
  {
    id: '4',
    slug: 'master-of-business-administration-global-healthcare-luc-mba-3',
    title: 'Master of Business Administration (Global MBA)',
    uniName: 'Lincoln University College (LUC)',
    degreeLevel: "Master's (Postgraduate)",
    duration: '1.5 Years',
    tuitionMYR: 36000,
    totalInitialMYR: 11000,
    highlights: 'Executive Evening Track • 16-Year Graduate Eligible',
  },
  {
    id: '5',
    slug: 'doctor-of-medicine-md-5-years-full-course-luc-md-1',
    title: 'Doctor of Medicine (MD) - WHO & PMDC Recognized',
    uniName: 'Lincoln University College (LUC)',
    degreeLevel: "Bachelor's Degree",
    duration: '5 Years',
    tuitionMYR: 360000,
    totalInitialMYR: 11000,
    highlights: 'Extensive Hospital Rotations • Direct FSc Pre-Med',
  },
];

export function InteractiveFeeExplorer() {
  const { openModal } = useCounseling();
  const [budgetCap, setBudgetCap] = useState<number>(12000);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [currency, setCurrency] = useState<'MYR' | 'PKR'>('MYR');

  const filtered = PRESET_PROGRAMS.filter((p) => {
    if (p.totalInitialMYR > budgetCap) return false;
    if (selectedLevel !== 'All' && p.degreeLevel !== selectedLevel) return false;
    return true;
  });

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 via-[#0a2038] to-slate-900 text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-sky-300 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-400/30 mb-3">
              <Calculator className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Upfront Cost Explorer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Match Your Budget to Malaysian Campuses
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Adjust the upfront non-tuition budget below (EMGS + Admin + Security Bond payable upon eVAL) to see verified eligible courses.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="inline-flex items-center bg-white/10 p-1 rounded-xl border border-white/15 text-xs font-bold self-start lg:self-auto">
            <button
              onClick={() => setCurrency('MYR')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currency === 'MYR' ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' : 'text-slate-300'
              }`}
            >
              🇲🇾 Malaysian Ringgit
            </button>
            <button
              onClick={() => setCurrency('PKR')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currency === 'PKR' ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' : 'text-slate-300'
              }`}
            >
              🇵🇰 Pakistani Rupee
            </button>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Slider */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">
                Maximum Initial Non-Tuition Budget (upon eVAL):
              </span>
              <span className="text-lg font-black text-amber-300">
                {currency === 'MYR' ? formatMYR(budgetCap) : formatPKR(budgetCap)}
              </span>
            </div>
            <input
              type="range"
              min={8000}
              max={15000}
              step={500}
              value={budgetCap}
              onChange={(e) => setBudgetCap(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-white/20 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>RM 8,000 (~Rs. 500k)</span>
              <span>RM 11,000 (Avg eVAL)</span>
              <span>RM 15,000+</span>
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Degree Level:
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full text-xs font-semibold bg-white/15 border border-white/20 text-white rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              <option value="All" className="text-slate-900">All Levels</option>
              <option value="Bachelor's Degree" className="text-slate-900">Bachelor&apos;s Degrees</option>
              <option value="Master's (Postgraduate)" className="text-slate-900">Master&apos;s &amp; MBA</option>
            </select>
          </div>
        </div>

        {/* Live Matching Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((prog) => (
              <motion.div
                layout
                key={prog.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 hover:border-amber-400/50 hover:bg-white/[0.13] transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="bg-sky-500/20 text-sky-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-sky-400/30">
                      {prog.degreeLevel}
                    </span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{prog.duration}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{prog.uniName}</span>
                  </p>

                  <div className="mt-4 bg-black/25 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-400">Upfront Package:</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {currency === 'MYR' ? formatMYR(prog.totalInitialMYR) : formatPKR(prog.totalInitialMYR)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-400">Total Tuition:</span>
                      <span className="font-bold text-white">
                        {currency === 'MYR' ? formatMYR(prog.tuitionMYR) : formatPKR(prog.tuitionMYR)}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300/90 pt-1 border-t border-white/10">
                      ✨ {prog.highlights}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1"
                  >
                    <span>Full Breakdown</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => openModal(prog.title, prog.id)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors"
          >
            <span>Browse all programs with live filters</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

