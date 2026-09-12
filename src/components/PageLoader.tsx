'use client';

import React, { useEffect, useState } from 'react';

const LOADING_STEPS = [
  'Connecting to EMGS Visa Network...',
  'Loading 1,200+ Accredited Degree Pathways...',
  'Synchronizing University Registrars...',
  'Preparing Your Academic Portal...',
  'Welcome to Meezab Portal',
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
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#061536] transition-all duration-700 select-none overflow-hidden ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none filter blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Royal Blue ambient aura matching logo */}
      <div className="absolute w-[560px] h-[560px] rounded-full bg-[#0B4FD8]/25 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#E8A300]/15 blur-[110px] pointer-events-none -bottom-10 -right-10" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#0066FF]/20 blur-[100px] pointer-events-none -top-10 -left-10" />

      {/* Futuristic grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 3D Scene Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Isometric 3D Stage with Fixed Tilt, rotating on a SINGLE Y-axis */}
        <div 
          className="relative w-56 h-56 flex items-center justify-center" 
          style={{ perspective: '1100px' }}
        >
          {/* Circular Gold/Blue Orbital Halo under the cube */}
          <div
            className="absolute w-48 h-48 rounded-full border border-dashed border-[#E8A300]/50"
            style={{
              transform: 'rotateX(72deg)',
              boxShadow: '0 0 25px rgba(11, 79, 216, 0.35)',
            }}
          />

          {/* 3D Rig with fixed tilt */}
          <div
            className="w-[120px] h-[120px] relative"
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
                animation: 'turntableSingleAxis 6.5s linear infinite',
              }}
            >
              {/* FACE 1: FRONT - Official Meezab Square Logo */}
              <div
                className="absolute inset-0 bg-[#0B4FD8] border-2 border-[#E8A300]/80 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(11,79,216,0.5),inset_0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center p-1"
                style={{ transform: 'rotateY(0deg) translateZ(60px)' }}
              >
                <img
                  src="/meezab-square-logo.jpg"
                  alt="Meezab Future Consulting"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* FACE 2: RIGHT - Official Meezab Square Logo */}
              <div
                className="absolute inset-0 bg-[#0B4FD8] border-2 border-[#E8A300]/80 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(11,79,216,0.5),inset_0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center p-1"
                style={{ transform: 'rotateY(90deg) translateZ(60px)' }}
              >
                <img
                  src="/meezab-square-logo.jpg"
                  alt="Meezab Future Consulting"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* FACE 3: BACK - Official Meezab Square Logo */}
              <div
                className="absolute inset-0 bg-[#0B4FD8] border-2 border-[#E8A300]/80 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(11,79,216,0.5),inset_0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center p-1"
                style={{ transform: 'rotateY(180deg) translateZ(60px)' }}
              >
                <img
                  src="/meezab-square-logo.jpg"
                  alt="Meezab Future Consulting"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* FACE 4: LEFT - Official Meezab Square Logo */}
              <div
                className="absolute inset-0 bg-[#0B4FD8] border-2 border-[#E8A300]/80 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(11,79,216,0.5),inset_0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center p-1"
                style={{ transform: 'rotateY(270deg) translateZ(60px)' }}
              >
                <img
                  src="/meezab-square-logo.jpg"
                  alt="Meezab Future Consulting"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* FACE 5: TOP - Royal Blue & Gold Jewel Cap */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0B4FD8] via-[#0D3B94] to-[#061536] border-2 border-[#E8A300]/70 rounded-2xl flex items-center justify-center shadow-inner"
                style={{ transform: 'rotateX(90deg) translateZ(60px)' }}
              >
                <div className="w-6 h-6 rounded-full bg-[#E8A300] shadow-[0_0_16px_#E8A300] border-2 border-white/40 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* FACE 6: BOTTOM - Deep Foundation Plate */}
              <div
                className="absolute inset-0 bg-[#061536] border border-white/15 rounded-2xl"
                style={{ transform: 'rotateX(-90deg) translateZ(60px)' }}
              />
            </div>
          </div>
        </div>

        {/* Soft Pedestal Shadow Glow below the cube */}
        <div className="-mt-2 mb-6 w-36 h-5 rounded-[100%] bg-[#E8A300]/25 blur-md pointer-events-none animate-pulse" />

        {/* Tagline matching the brand */}
        <div className="text-center space-y-1.5">
          <h2
            className="text-xs sm:text-sm font-extrabold tracking-[0.24em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E8A300] to-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Study in Malaysia Official Portal
          </h2>

          {/* Dynamic Status Phase Tracker */}
          <p className="text-xs text-blue-200/90 font-medium tracking-wide h-5 transition-all duration-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E8A300] animate-ping mr-2 align-middle" />
            {LOADING_STEPS[stepIndex]}
          </p>
        </div>

        {/* Sleek Minimalist Progress Bar with Royal Blue & Gold styling */}
        <div className="mt-6 w-60 sm:w-72 space-y-1.5">
          <div className="relative h-1.5 w-full bg-slate-900/90 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0B4FD8] via-[#0066FF] to-[#E8A300] transition-all duration-300 shadow-[0_0_14px_rgba(232,163,0,0.85)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Clean percentage & verification badge */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold px-0.5">
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
