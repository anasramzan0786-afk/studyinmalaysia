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
    <section className="relative overflow-hidden bg-[#0B2553] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8">
      {/* Meezab Atmospheric Glow Orbs (Royal Navy & Warm Amber) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#3A60A1]/30 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[420px] h-[320px] bg-[#E8A300]/20 rounded-full blur-[110px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[480px] h-[300px] bg-[#293E98]/30 rounded-full blur-[100px] pointer-events-none animate-float" />

      {/* Elegant geometric pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E8A300]/40 text-xs font-semibold text-white shadow-[0_0_25px_rgba(232,163,0,0.2)] hover:border-[#E8A300] transition-all cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-[#E8A300] animate-ping" />
            <span className="text-[#E8A300] font-bold">Meezab Future Consulting</span>
            <span className="text-white/40">•</span>
            <span className="text-white font-medium">Study in Malaysia Official Advisory</span>
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18]">
            Your Pathway to Academic Success at{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB82E] via-[#E8A300] to-[#FFA300]">
                Malaysian Universities
              </span>
              {/* Subtle gold underline */}
              <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-transparent via-[#E8A300] to-transparent rounded-full" />
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto">
            Official advisory desk for Pakistani students. Compare {totalProgramsCount}+ verified degree programs across {totalUniCount} universities, calculate exact statutory EMGS visa costs, and apply with zero consultant fee.
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
          <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-[#E8A300] transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-[#E8A300] tracking-tight">15+</div>
            <div className="text-xs text-slate-200 mt-1 font-semibold group-hover:text-white transition-colors">
              Years of Excellence
            </div>
          </div>

          <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-[#E8A300] transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              98.4%
            </div>
            <div className="text-xs text-slate-200 mt-1 font-semibold group-hover:text-white transition-colors">
              Visa Success Rate
            </div>
          </div>

          <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-[#E8A300] transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-[#E8A300] tracking-tight">
              {totalProgramsCount}+
            </div>
            <div className="text-xs text-slate-200 mt-1 font-semibold group-hover:text-white transition-colors">
              Accredited Programs
            </div>
          </div>

          <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-[#E8A300] transition-all duration-300 hover:-translate-y-1 shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">RM 0</div>
            <div className="text-xs text-slate-200 mt-1 font-semibold group-hover:text-white transition-colors">
              No Hidden Consultant Fees
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


