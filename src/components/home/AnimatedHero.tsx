'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HeroSearch } from './HeroSearch';
import { Sparkles, ShieldCheck, GraduationCap, Award, Plane, CheckCircle2 } from 'lucide-react';

interface AnimatedHeroProps {
  totalProgramsCount: number;
  totalUniCount: number;
}

export function AnimatedHero({ totalProgramsCount, totalUniCount }: AnimatedHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#07172b] text-white pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      {/* Ambient Moving Glow Orbs (Subtle Luxury Atmospheric Lighting) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/25 to-sky-400/20 rounded-full blur-[110px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[400px] h-[300px] bg-gradient-to-br from-amber-500/15 to-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute top-2/3 right-1/4 translate-x-1/2 w-[450px] h-[280px] bg-gradient-to-tl from-indigo-600/20 to-blue-500/15 rounded-full blur-[95px] pointer-events-none animate-float" />

      {/* Subtle high-tech geometric grid */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-blue-200 shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:border-white/30 transition-all cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-200">Official Advisory Desk for Pakistan</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-300 font-bold">2026/2027 Intakes Open</span>
            <span className="text-xs">🇲🇾 × 🇵🇰</span>
          </div>
        </motion.div>

        {/* Editorial Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto space-y-5"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Study at World-Class Malaysian Universities with{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
                Guaranteed Transparency
              </span>
              {/* Subtle underline glow */}
              <span className="absolute left-0 bottom-1 w-full h-[2px] bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-emerald-400/0 rounded-full" />
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Direct admissions portal for Pakistani students. Compare {totalProgramsCount}+ verified degrees across {totalUniCount} universities, calculate exact statutory EMGS fees, and secure admission with zero agent markup.
          </p>
        </motion.div>

        {/* Interactive Hero Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <HeroSearch />
        </motion.div>

        {/* Stats Bar with Floating Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center"
        >
          <div className="group bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">98.4%</div>
            <div className="text-xs text-slate-300 mt-1 font-medium group-hover:text-white transition-colors">
              Pakistan Visa Success Rate
            </div>
          </div>

          <div className="group bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-emerald-400/40 transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {totalProgramsCount}+
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium group-hover:text-white transition-colors">
              Accredited Programs
            </div>
          </div>

          <div className="group bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">RM 0</div>
            <div className="text-xs text-slate-300 mt-1 font-medium group-hover:text-white transition-colors">
              No Hidden Consultant Fees
            </div>
          </div>

          <div className="group bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-indigo-400/40 transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">4 to 6 Wks</div>
            <div className="text-xs text-slate-300 mt-1 font-medium group-hover:text-white transition-colors">
              Direct eVAL Approval Time
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

