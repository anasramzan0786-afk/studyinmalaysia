'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HeroSearch } from './HeroSearch';

interface AnimatedHeroProps {
  totalProgramsCount: number;
  totalUniCount: number;
}

export function AnimatedHero({ totalProgramsCount, totalUniCount }: AnimatedHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0B2553] text-white min-h-[88vh] flex items-center px-4 sm:px-6 lg:px-8">
      {/* Subtle grid dots */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Atmospheric glow — minimal & elegant */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[420px] bg-[#3A60A1]/25 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#E8A300]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto w-full z-10 py-20 sm:py-28 flex flex-col items-center text-center gap-10">

        {/* Country pill badge — tiny, refined */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#E8A300] bg-[#E8A300]/10 border border-[#E8A300]/30 px-4 py-1.5 rounded-full tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A300] animate-pulse" />
            Meezab Future Consulting &nbsp;·&nbsp; 🇲🇾 Official Malaysia Advisory
          </span>
        </motion.div>

        {/* BIG HEADLINE — the hero */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-[82px] font-black tracking-tight leading-[1.05] text-white">
            Study in&nbsp;
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: '0px',
                background: 'linear-gradient(95deg, #FFD166 0%, #E8A300 40%, #FFA300 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Malaysia.
            </span>
            <br />
            <span className="text-white/90">Start Your Future.</span>
          </h1>

          {/* Subtle sub-line — one liner only */}
          <p className="text-base sm:text-lg text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
            Direct admissions for Pakistani students — {totalProgramsCount}+ programs, {totalUniCount} universities, zero consultant fees.
          </p>
        </motion.div>

        {/* SEARCH BAR — the only CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl"
        >
          <HeroSearch />
        </motion.div>

        {/* Minimal trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-[#E8A300]">✓</span> 98.4% Visa Success Rate
          </span>
          <span className="w-px h-3 bg-white/15 hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <span className="text-[#E8A300]">✓</span> 15+ Years of Excellence
          </span>
          <span className="w-px h-3 bg-white/15 hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <span className="text-[#E8A300]">✓</span> EMGS Direct — RM 0 Hidden Fees
          </span>
        </motion.div>
      </div>
    </section>
  );
}
