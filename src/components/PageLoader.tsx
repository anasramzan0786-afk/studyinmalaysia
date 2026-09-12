'use client';

import React, { useEffect, useState } from 'react';

const LOADING_STEPS = [
  'Connecting to EMGS Visa Network...',
  'Loading 1,200+ Accredited Malaysian Degrees...',
  'Synchronizing Official University Registrars...',
  'Preparing Your Academic Journey...',
  'Welcome to Study in Malaysia by Meezab',
];

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(12);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Smooth progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 14) + 8;
        const next = Math.min(prev + step, 100);

        // Update step phrase according to progress
        if (next < 30) setStepIndex(0);
        else if (next < 60) setStepIndex(1);
        else if (next < 85) setStepIndex(2);
        else if (next < 98) setStepIndex(3);
        else setStepIndex(4);

        return next;
      });
    }, 220);

    // After reaching 100%, trigger smooth fade out exit
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2600);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3200);

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
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#3A60A1]/25 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#E8A300]/15 blur-[100px] pointer-events-none -bottom-20 -right-20" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#006BBB]/20 blur-[80px] pointer-events-none -top-10 -left-10" />

      {/* Cyber/Tech grid subtle overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 3D Holographic Scene */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 3D Gyroscope & Floating Core */}
        <div className="relative w-44 h-44 flex items-center justify-center" style={{ perspective: '1000px' }}>
          {/* Orbital Ring 1 - Gold Outer Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#E8A300]/70"
            style={{
              animation: 'spinRing1 6s linear infinite',
              transformStyle: 'preserve-3d',
              boxShadow: '0 0 25px rgba(232, 163, 0, 0.25)',
            }}
          >
            <div className="w-3 h-3 rounded-full bg-[#E8A300] shadow-[0_0_12px_#E8A300] absolute -top-1.5 left-1/2 -translate-x-1/2" />
          </div>

          {/* Orbital Ring 2 - Blue Inner Ring */}
          <div
            className="absolute inset-4 rounded-full border border-dotted border-[#3A60A1] shadow-[0_0_20px_rgba(58,96,161,0.4)]"
            style={{
              animation: 'spinRing2 4.5s linear infinite reverse',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#006BBB] shadow-[0_0_10px_#006BBB] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
          </div>

          {/* Orbital Ring 3 - Rapid Crimson/Cyan Particle Ring */}
          <div
            className="absolute inset-8 rounded-full border border-white/20"
            style={{
              animation: 'spinRing3 3.5s linear infinite',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] absolute top-1/2 -right-1 -translate-y-1/2" />
          </div>

          {/* Center 3D Holographic Cube */}
          <div
            className="w-16 h-16 relative"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'rotate3DCube 5s linear infinite',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 border border-[#E8A300]/80 bg-gradient-to-br from-[#0B2553]/90 to-[#3A60A1]/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black shadow-inner"
              style={{ transform: 'rotateY(0deg) translateZ(32px)' }}
            >
              <span className="text-[#E8A300] font-bold text-sm tracking-tighter drop-shadow-[0_0_8px_#E8A300]">M</span>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 border border-[#E8A300]/80 bg-gradient-to-br from-[#0B2553]/90 to-[#3A60A1]/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black shadow-inner"
              style={{ transform: 'rotateY(180deg) translateZ(32px)' }}
            >
              <span className="text-[#E8A300] font-bold text-sm tracking-tighter drop-shadow-[0_0_8px_#E8A300]">🇲🇾</span>
            </div>
            {/* Right */}
            <div
              className="absolute inset-0 border border-[#3A60A1]/90 bg-gradient-to-br from-[#3A60A1]/90 to-[#0B2553]/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black shadow-inner"
              style={{ transform: 'rotateY(90deg) translateZ(32px)' }}
            >
              <span className="text-white text-[10px] font-bold">EMGS</span>
            </div>
            {/* Left */}
            <div
              className="absolute inset-0 border border-[#3A60A1]/90 bg-gradient-to-br from-[#3A60A1]/90 to-[#0B2553]/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black shadow-inner"
              style={{ transform: 'rotateY(-90deg) translateZ(32px)' }}
            >
              <span className="text-[#E8A300] text-[10px] font-extrabold">2026</span>
            </div>
            {/* Top */}
            <div
              className="absolute inset-0 border border-[#E8A300]/60 bg-[#07172B]/90 flex items-center justify-center shadow-inner"
              style={{ transform: 'rotateX(90deg) translateZ(32px)' }}
            >
              <div className="w-3 h-3 rounded-full bg-[#E8A300] shadow-[0_0_10px_#E8A300]" />
            </div>
            {/* Bottom */}
            <div
              className="absolute inset-0 border border-[#3A60A1]/60 bg-[#07172B]/90 flex items-center justify-center shadow-inner"
              style={{ transform: 'rotateX(-90deg) translateZ(32px)' }}
            >
              <div className="w-3 h-3 rounded-full bg-[#3A60A1] shadow-[0_0_10px_#3A60A1]" />
            </div>
          </div>
        </div>

        {/* Brand & Slogan */}
        <div className="mt-8 text-center space-y-2">
          {/* Logo with clean light sweep */}
          <div className="relative inline-block">
            <img
              src="https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png"
              alt="Meezab Future Consulting"
              className="h-10 sm:h-12 object-contain mx-auto filter drop-shadow-[0_4px_20px_rgba(232,163,0,0.3)]"
            />
          </div>

          {/* High-Impact Jost Bold Tagline */}
          <h2
            className="text-sm sm:text-base font-extrabold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E8A300] to-white pt-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Study in Malaysia Official Portal
          </h2>

          {/* Dynamic Status Text */}
          <p className="text-xs text-slate-300 font-medium tracking-wide h-5 transition-all duration-300">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E8A300] animate-ping mr-2 align-middle" />
            {LOADING_STEPS[stepIndex]}
          </p>
        </div>

        {/* Futuristic Neon Progress Bar */}
        <div className="mt-7 w-64 sm:w-80 space-y-2">
          <div className="relative h-2 w-full bg-slate-900/90 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3A60A1] via-[#006BBB] to-[#E8A300] transition-all duration-300 relative shadow-[0_0_15px_rgba(232,163,0,0.8)]"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight flare on head */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full blur-[1px]" />
            </div>
          </div>

          {/* Percentage & Security Badges */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1 text-[#E8A300]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified MOHE • MQA
            </span>
            <span className="font-mono text-white font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Global Embedded Animations for Gyro & 3D Cube */}
      <style>{`
        @keyframes rotate3DCube {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          50% {
            transform: rotateX(180deg) rotateY(270deg) rotateZ(90deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg);
          }
        }
        @keyframes spinRing1 {
          0% {
            transform: rotateX(65deg) rotateY(20deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(65deg) rotateY(20deg) rotateZ(360deg);
          }
        }
        @keyframes spinRing2 {
          0% {
            transform: rotateX(-45deg) rotateY(40deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(-45deg) rotateY(40deg) rotateZ(360deg);
          }
        }
        @keyframes spinRing3 {
          0% {
            transform: rotateX(25deg) rotateY(-55deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(25deg) rotateY(-55deg) rotateZ(360deg);
          }
        }
      `}</style>
    </div>
  );
}
