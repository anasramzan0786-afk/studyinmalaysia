'use client';

import React, { useState, useEffect } from 'react';

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 2.4s, then unmount
    const fadeTimer = setTimeout(() => setFadeOut(true), 2400);
    const hideTimer = setTimeout(() => setVisible(false), 2900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B2553] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#3A60A1]/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-[#E8A300]/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Main animation: plane + hat */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated SVG — plane flying with trailing hat */}
        <div className="relative w-32 h-32">
          {/* Graduation Cap Icon */}
          <div
            className="absolute -top-3 -right-3 z-20"
            style={{ animation: 'hatBounce 1.2s ease-in-out infinite' }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              {/* Board */}
              <polygon points="22,4 44,14 22,24 0,14" fill="#E8A300" />
              {/* Cap top */}
              <rect x="18" y="14" width="8" height="14" rx="2" fill="#E8A300" opacity="0.7" />
              {/* Tassel string */}
              <line x1="44" y1="14" x2="44" y2="28" stroke="#E8A300" strokeWidth="2" strokeLinecap="round" />
              <circle cx="44" cy="30" r="3" fill="#FFA300" />
            </svg>
          </div>

          {/* Plane body */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ animation: 'planeFly 1.4s ease-in-out infinite' }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              {/* Fuselage */}
              <ellipse cx="40" cy="42" rx="28" ry="9" fill="white" opacity="0.95" />
              {/* Nose */}
              <path d="M68 42 Q80 42 76 38 L68 38 Z" fill="white" opacity="0.9" />
              {/* Tail */}
              <path d="M12 42 Q4 42 8 36 L16 40 Z" fill="white" opacity="0.7" />
              {/* Main wing */}
              <path d="M30 42 L20 28 L52 38 Z" fill="white" opacity="0.85" />
              {/* Tail wing */}
              <path d="M16 42 L10 32 L24 40 Z" fill="white" opacity="0.7" />
              {/* Window row */}
              <circle cx="52" cy="41" r="2.5" fill="#0B2553" opacity="0.5" />
              <circle cx="44" cy="40" r="2.5" fill="#0B2553" opacity="0.5" />
              <circle cx="36" cy="40" r="2.5" fill="#0B2553" opacity="0.5" />
              {/* Engine */}
              <ellipse cx="38" cy="50" rx="7" ry="3" fill="#3A60A1" opacity="0.8" />
            </svg>
          </div>

          {/* Flight trail dots */}
          <div className="absolute bottom-4 left-0 flex gap-1.5 items-center" style={{ animation: 'trailFade 1.4s ease-in-out infinite' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A300] opacity-80" />
            <span className="w-1 h-1 rounded-full bg-[#E8A300] opacity-50" />
            <span className="w-0.5 h-0.5 rounded-full bg-[#E8A300] opacity-30" />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center space-y-2">
          <img
            src="https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png"
            alt="Meezab Future Consulting"
            className="h-10 object-contain mx-auto"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
          />
          <p
            className="text-slate-300 text-xs tracking-widest uppercase font-medium"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}
          >
            Study in Malaysia Portal
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2" style={{ animation: 'fadeInUp 0.6s ease-out 0.7s both' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#E8A300]"
              style={{ animation: `dotPulse 1s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes planeFly {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%       { transform: translateY(-10px) rotate(-4deg); }
        }
        @keyframes hatBounce {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50%       { transform: translateY(-8px) rotate(-4deg); }
        }
        @keyframes trailFade {
          0%, 100% { opacity: 0.8; transform: translateX(0); }
          50%       { opacity: 0.3; transform: translateX(-4px); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
