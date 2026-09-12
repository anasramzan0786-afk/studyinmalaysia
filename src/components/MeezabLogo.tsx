'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MeezabLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'icon-only';
  showBadge?: boolean;
}

export const MeezabLogo: React.FC<MeezabLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showBadge = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const logoSrc =
    variant === 'light'
      ? 'https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png'
      : 'https://meezabfuture.com/wp-content/uploads/2023/11/Meezab-Logo-new.png';

  const dimensions = {
    sm: { height: 28, width: 140, text: 'text-sm' },
    md: { height: 38, width: 190, text: 'text-base' },
    lg: { height: 48, width: 230, text: 'text-xl' },
  }[size];

  if (variant === 'icon-only') {
    return (
      <div className={`relative rounded-xl bg-[#0B2553] p-2 flex items-center justify-center shadow-sm shrink-0 ${className}`}>
        <img
          src="https://meezabfuture.com/wp-content/uploads/2025/03/cropped-fav-192x192.png"
          alt="Meezab"
          className="w-8 h-8 object-contain"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imgError ? (
        <div className="flex items-center">
          <img
            src={logoSrc}
            alt="Meezab Future Consulting"
            style={{ height: `${dimensions.height}px`, width: 'auto' }}
            className="max-h-full object-contain"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Crisp typographic fallback if offline */
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0B2553] border border-[#E8A300]/40 flex items-center justify-center font-bold text-white text-sm">
            M
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`font-black tracking-tight ${variant === 'light' ? 'text-white' : 'text-[#0B2553]'} ${dimensions.text}`}>
                MEEZAB
              </span>
              <span className="text-[#E8A300] font-bold text-xs">FUTURE</span>
            </div>
            <span className={`text-[10px] tracking-wider uppercase font-medium ${variant === 'light' ? 'text-slate-300' : 'text-slate-500'}`}>
              Consulting Pvt Ltd
            </span>
          </div>
        </div>
      )}

      {showBadge && (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500/15 via-[#E8A300]/20 to-amber-500/10 text-[#9E6A00] border border-[#E8A300]/30 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8A300] animate-pulse" />
          Study Malaysia
        </span>
      )}
    </div>
  );
};

