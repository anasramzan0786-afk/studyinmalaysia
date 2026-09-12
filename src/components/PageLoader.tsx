'use client';

import React, { useEffect, useState } from 'react';

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
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
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B2553] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <img
        src="https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png"
        alt="Meezab Future Consulting"
        className="h-12 mb-6 animate-bounce"
      />
      {/* Progress Bar */}
      <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="h-2 bg-[#E8A300] animate-loading-bar" />
      </div>
      {/* Inline styles for bar animation */}
      <style jsx>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loadingBar 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
