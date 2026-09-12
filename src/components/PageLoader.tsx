'use client';

import React, { useEffect, useState } from 'react';

const LOADING_STEPS = [
  'Connecting to EMGS Visa Network...',
  'Loading 1,200+ Accredited Degree Pathways...',
  'Synchronizing University Registrars...',
  'Preparing Your Academic Portal...',
  'Welcome to Study in Malaysia',
];

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Smooth progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 12) + 7;
        const next = Math.min(prev + step, 100);

        if (next < 30) setStepIndex(0);
        else if (next < 58) setStepIndex(1);
        else if (next < 84) setStepIndex(2);
        else if (next < 98) setStepIndex(3);
        else setStepIndex(4);

        return next;
      });
    }, 200);

    // Fade out after progress reaches 100%
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3100);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#07172B] transition-all duration-700 select-none overflow-hidden ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none filter blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#3A60A1]/20 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#E8A300]/15 blur-[100px] pointer-events-none -bottom-10 -right-10" />

      {/* Cyber/Tech grid subtle overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }}
      />

      {/* 3D Scene Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Isometric 3D Stage with Fixed Tilt, rotating on a SINGLE Y-axis */}
        <div 
          className="relative w-48 h-48 flex items-center justify-center" 
          style={{ perspective: '1100px' }}
        >
          {/* Subtle Horizontal Orbital Gold Halo around cube */}
          <div
            className="absolute w-44 h-44 rounded-full border border-dashed border-[#E8A300]/40"
            style={{
              transform: 'rotateX(72deg)',
              boxShadow: '0 0 20px rgba(232, 163, 0, 0.15)',
            }}
          />

          {/* 3D Rig with fixed tilt */}
          <div
            className="w-[110px] h-[110px] relative"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(-14deg)',
            }}
          >
            {/* Pure Single-Axis Turntable Rotating Cube */}
            <div
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                animation: 'turntableSingleAxis 7s linear infinite',
              }}
            >
              {/* FACE 1: FRONT - Meezab Logo */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0B2553]/95 via-[#0F326E]/90 to-[#07172B]/95 border-2 border-[#E8A300]/70 rounded-xl backdrop-blur-md flex flex-col items-center justify-center p-3.5 shadow-[inset_0_0_20px_rgba(232,163,0,0.2),0_0_15px_rgba(11,37,83,0.5)]"
                style={{ transform: 'rotateY(0deg) translateZ(55px)' }}
              >
                <img
                  src="https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png"
                  alt="Meezab"
                  className="w-20 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                />
                <span className="text-[9px] font-extrabold text-[#E8A300] tracking-widest uppercase mt-1.5 font-heading">
                  Study Malaysia
                </span>
              </div>

              {/* FACE 2: RIGHT - Meezab Crest + EMGS */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0B2553]/95 via-[#0F326E]/90 to-[#07172B]/95 border-2 border-[#E8A300]/70 rounded-xl backdrop-blur-md flex flex-col items-center justify-center p-3 shadow-[inset_0_0_20px_rgba(232,163,0,0.2),0_0_15px_rgba(11,37,83,0.5)]"
                style={{ transform: 'rotateY(90deg) translateZ(55px)' }}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#E8A300] to-amber-200 flex items-center justify-center text-[#0B2553] font-black text-base shadow-[0_0_12px_rgba(232,163,0,0.4)]">
                  M
                </div>
                <span className="text-white text-[10px] font-extrabold mt-1.5 tracking-wider uppercase">
                  Verified Portal
                </span>
                <span className="text-emerald-400 text-[8px] font-bold tracking-widest mt-0.5">
                  ● EMGS PARTNER
                </span>
              </div>

              {/* FACE 3: BACK - Meezab Logo Repeated */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0B2553]/95 via-[#0F326E]/90 to-[#07172B]/95 border-2 border-[#E8A300]/70 rounded-xl backdrop-blur-md flex flex-col items-center justify-center p-3.5 shadow-[inset_0_0_20px_rgba(232,163,0,0.2),0_0_15px_rgba(11,37,83,0.5)]"
                style={{ transform: 'rotateY(180deg) translateZ(55px)' }}
              >
                <img
                  src="https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png"
                  alt="Meezab"
                  className="w-20 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                />
                <span className="text-[9px] font-extrabold text-[#E8A300] tracking-widest uppercase mt-1.5 font-heading">
                  Admissions 2026
                </span>
              </div>

              {/* FACE 4: LEFT - Malaysian Flag & University Accreditation */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0B2553]/95 via-[#0F326E]/90 to-[#07172B]/95 border-2 border-[#E8A300]/70 rounded-xl backdrop-blur-md flex flex-col items-center justify-center p-3 shadow-[inset_0_0_20px_rgba(232,163,0,0.2),0_0_15px_rgba(11,37,83,0.5)]"
                style={{ transform: 'rotateY(270deg) translateZ(55px)' }}
              >
                <span className="text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">🇲🇾</span>
                <span className="text-white text-[10px] font-extrabold mt-1 tracking-wider uppercase">
                  MOHE &amp; MQA
                </span>
                <span className="text-[#E8A300] text-[8px] font-bold tracking-widest mt-0.5">
                  ACCREDITED
                </span>
              </div>

              {/* FACE 5: TOP - Gold Nexus Glass */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#E8A300]/40 to-[#0B2553]/95 border-2 border-[#E8A300]/50 rounded-xl flex items-center justify-center shadow-inner"
                style={{ transform: 'rotateX(90deg) translateZ(55px)' }}
              >
                <div className="w-5 h-5 rounded-full bg-[#E8A300] shadow-[0_0_14px_#E8A300]" />
              </div>

              {/* FACE 6: BOTTOM - Shadow Base */}
              <div
                className="absolute inset-0 bg-[#07172B] border border-white/10 rounded-xl"
                style={{ transform: 'rotateX(-90deg) translateZ(55px)' }}
              />
            </div>
          </div>
        </div>

        {/* Soft Pedestal Shadow Glow below the cube */}
        <div className="-mt-3 mb-6 w-32 h-5 rounded-[100%] bg-[#E8A300]/25 blur-md pointer-events-none animate-pulse" />

        {/* Minimal High-Impact Tagline (Logo underneath has been removed as requested) */}
        <div className="text-center space-y-1.5">
          <h2
            className="text-xs sm:text-sm font-extrabold tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E8A300] to-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Study in Malaysia Official Portal
          </h2>

          {/* Dynamic Status Phase Tracker */}
          <p className="text-xs text-slate-300 font-medium tracking-wide h-5 transition-all duration-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E8A300] animate-ping mr-2 align-middle" />
            {LOADING_STEPS[stepIndex]}
          </p>
        </div>

        {/* Sleek Minimalist Progress Bar */}
        <div className="mt-6 w-60 sm:w-72 space-y-1.5">
          <div className="relative h-1.5 w-full bg-slate-900/90 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3A60A1] via-[#006BBB] to-[#E8A300] transition-all duration-300 shadow-[0_0_12px_rgba(232,163,0,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Clean percentage & badge */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
            <span className="flex items-center gap-1 text-[#E8A300]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Direct Admissions
            </span>
            <span className="font-mono text-white font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Embedded Single-Axis Turntable Animation */}
      <style>{`
        @keyframes turntableSingleAxis {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}
