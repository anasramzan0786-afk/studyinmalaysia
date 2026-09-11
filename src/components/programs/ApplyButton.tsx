'use client';

import React from 'react';
import { useCounseling } from '@/components/CounselingContext';
import { PhoneCall, Send } from 'lucide-react';

interface ApplyButtonProps {
  programTitle: string;
  programId: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'whatsapp';
}

export function ApplyButton({
  programTitle,
  programId,
  label = 'Apply for Next Intake',
  variant = 'primary',
}: ApplyButtonProps) {
  const { openModal } = useCounseling();

  if (variant === 'whatsapp') {
    const text = encodeURIComponent(
      `Hello Meezab Admissions Desk, I want to apply for: ${programTitle}`
    );
    return (
      <a
        href={`https://wa.me/923346596725?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 text-sm"
      >
        <span>Direct WhatsApp Inquiry</span>
      </a>
    );
  }

  return (
    <button
      onClick={() => openModal(programTitle, programId)}
      className="w-full inline-flex items-center justify-center gap-2 bg-[#E8A300] hover:bg-[#d49400] text-[#0B2553] font-extrabold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 text-sm"
    >
      <PhoneCall className="w-4 h-4 text-[#0B2553]" />
      <span>{label}</span>
    </button>
  );
}

