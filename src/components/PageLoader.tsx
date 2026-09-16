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
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(25);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Only display splash loader once per browser session to maintain ultra-fast navigation
    const hasLoaded = sessionStorage.getItem('meezab_portal_loaded');
    if (hasLoaded) {
      return;
    }

    setVisible(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = Math.min(prev + 35, 100);
        if (next > 70) setStepIndex(4);
        else if (next > 40) setStepIndex(2);
        return next;
      });
    }, 90);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      sessionStorage.setItem('meezab_portal_loaded', 'true');
    }, 450);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 750);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out ${
        fadeOut
          ? 'opacity-0 scale-105 pointer-events-none filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 45%, #0B1F4B 0%, #050E24 55%, #020611 100%)',
      }}
    >
      {/* Dynamic Ambient Backlight Auras */}
      <div className="absolute w-[620px] h-[620px] rounded-full bg-[#0B4FD8]/22 blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute w-[440px] h-[440px] rounded-full bg-[#E8A300]/16 blur-[130px] pointer-events-none -top-16 -right-16" />
      <div className="absolute w-[420px] h-[420px] rounded-full bg-[#0066FF]/18 blur-[120px] pointer-events-none -bottom-16 -left-16" />

      {/* Futuristic High-Precision Micro-Grid with Radial Vignette */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* Floating Constellation Dust Points */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '18%', left: '22%', delay: '0s', size: '2px' },
          { top: '28%', left: '78%', delay: '1.2s', size: '3px' },
          { top: '65%', left: '15%', delay: '2.1s', size: '2.5px' },
          { top: '75%', left: '82%', delay: '0.7s', size: '2px' },
          { top: '85%', left: '35%', delay: '1.8s', size: '1.5px' },
          { top: '15%', left: '60%', delay: '2.5s', size: '2px' },
        ].map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-300/60 animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: '3s',
              animationDelay: star.delay,
              boxShadow: '0 0 8px rgba(232, 163, 0, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Center Stage */}
      <div className="relative z-10 flex flex-col items-center">
        {/* State-of-the-Art Kinetic Meezab Emblem */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer Gilded Celestial Orbital Ring (Clockwise) */}
          <div
            className="absolute w-56 h-56 rounded-full border border-[#E8A300]/30"
            style={{
              animation: 'spinClockwise 12s linear infinite',
              boxShadow: '0 0 35px rgba(232, 163, 0, 0.12), inset 0 0 25px rgba(11, 79, 216, 0.15)',
            }}
          >
            {/* Satellite Energy Particle 1 */}
            <span
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E8A300] shadow-[0_0_12px_#E8A300]"
            />
            {/* Satellite Energy Particle 2 */}
            <span
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#0066FF] shadow-[0_0_10px_#0066FF]"
            />
          </div>

          {/* Middle Sapphire Precision Ring with Micro-Dashes (Counter-Clockwise) */}
          <div
            className="absolute w-44 h-44 rounded-full border border-dashed border-[#0066FF]/40"
            style={{
              animation: 'spinCounterClockwise 16s linear infinite',
            }}
          />

          {/* Inner Accent Ring with Gradient Sheen */}
          <div className="absolute w-36 h-36 rounded-full border border-white/10" />

          {/* Central Glassmorphic Shield Medallion (Floating Levitation) */}
          <div
            className="relative w-28 h-28 rounded-3xl p-1 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-transform"
            style={{
              background: 'linear-gradient(135deg, rgba(232, 163, 0, 0.6) 0%, rgba(11, 79, 216, 0.6) 50%, rgba(6, 21, 54, 0.9) 100%)',
              animation: 'emblemFloat 4.5s ease-in-out infinite',
            }}
          >
            {/* Frosted Core Housing */}
            <div className="w-full h-full rounded-[22px] bg-[#071738] p-2 relative overflow-hidden flex items-center justify-center border border-white/20 backdrop-blur-xl">
              {/* Internal Radial Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0B4FD8]/40 via-transparent to-[#E8A300]/25 pointer-events-none" />

              {/* Shimmer Light Beam Sweep */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%)',
                  transform: 'skewX(-25deg)',
                  animation: 'shimmerSweep 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                }}
              />

              {/* Official Meezab Square Logo with Rounded Jewel Trim */}
              <img
                src="/meezab-square-logo.jpg"
                alt="Meezab Future Consulting"
                className="w-full h-full object-cover rounded-xl shadow-md relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Breathing Ground Pedestal Shadow & Warm Amber Glow */}
        <div
          className="-mt-3 mb-6 w-32 h-4 rounded-[100%] bg-gradient-to-r from-transparent via-[#E8A300]/30 to-transparent blur-md pointer-events-none"
          style={{ animation: 'pedestalPulse 4.5s ease-in-out infinite' }}
        />

        {/* Tagline & Official Portal Header */}
        <div className="text-center space-y-2">
          {/* Micro Authority Capsule */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A300] animate-ping" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E8A300]">
              Official Academic Gateway
            </span>
          </div>

          <h2
            className="text-sm sm:text-base font-extrabold tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-[#E8A300]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Study in Malaysia Official Portal
          </h2>

          {/* Dynamic Status Phase Tracker */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#081838]/80 border border-blue-400/20 backdrop-blur-md shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8A300] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8A300]" />
              </span>
              <p className="text-xs text-blue-100/95 font-semibold tracking-wide min-w-[240px] text-center transition-all duration-300">
                {LOADING_STEPS[stepIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Aerospace Precision Progress Bar */}
        <div className="mt-6 w-64 sm:w-80 space-y-2">
          <div className="relative h-2 w-full bg-[#030A1A] rounded-full overflow-hidden border border-white/15 p-0.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0B4FD8] via-[#0066FF] to-[#E8A300] transition-all duration-300 relative shadow-[0_0_16px_rgba(232,163,0,0.9)]"
              style={{ width: `${progress}%` }}
            >
              {/* Internal Active Flow Shimmer */}
              <div
                className="absolute inset-0 w-full h-full rounded-full pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmerBar 1.6s infinite linear',
                }}
              />
            </div>
          </div>

          {/* Telemetry Metrics & Verified Badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold px-1">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399] animate-pulse" />
              <span className="tracking-wide">Verified Direct Admissions</span>
            </span>
            <span className="font-mono text-[#E8A300] font-bold text-xs tracking-wider">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Embedded High-Fidelity Keyframe Animations */}
      <style>{`
        @keyframes spinClockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spinCounterClockwise {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        @keyframes emblemFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }
        @keyframes pedestalPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.65;
          }
        }
        @keyframes shimmerSweep {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          40%, 100% {
            transform: translateX(150%) skewX(-25deg);
          }
        }
        @keyframes shimmerBar {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
