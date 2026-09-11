import React from 'react';

interface MeezabLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'icon-only';
}

export const MeezabLogo: React.FC<MeezabLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Meezab Icon Crest */}
      <div className={`${iconSizes[size]} relative rounded-lg bg-[#002f6c] p-1.5 flex items-center justify-center shadow-sm shrink-0 overflow-hidden`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Graduation Cap Top */}
          <path d="M50 12 L78 26 L50 40 L22 26 Z" fill="white" />
          <rect x="48" y="24" width="4" height="6" fill="#f59e0b" />
          <circle cx="78" cy="27" r="2.5" fill="#f59e0b" />
          {/* M Lettering with Yellow slash */}
          <path d="M22 36 L22 84 L36 84 L36 55 L50 69 L64 55 L64 84 L78 84 L78 36 L50 63 Z" fill="white" />
          {/* Golden accent bar in right valley */}
          <path d="M50 63 L64 77 L64 64 L50 50 Z" fill="#f59e0b" />
          <path d="M50 68 L64 82 L78 68 L64 54 Z" fill="#f59e0b" />
        </svg>
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`font-bold tracking-tight leading-none font-['Plus_Jakarta_Sans',sans-serif] ${
              variant === 'light' ? 'text-white' : 'text-[#000f22]'
            } ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm'}`}>
              MEEZAB
            </span>
            <span className={`font-medium tracking-wide text-[10px] uppercase px-1.5 py-0.5 rounded ${
              variant === 'light' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-[#d2e4ff] text-[#001c37]'
            }`}>
              Portal
            </span>
          </div>
          <span className={`text-[10px] tracking-wider uppercase font-semibold ${
            variant === 'light' ? 'text-[#b0c8eb]' : 'text-[#43474d]'
          }`}>
            Study Malaysia
          </span>
        </div>
      )}
    </div>
  );
};
