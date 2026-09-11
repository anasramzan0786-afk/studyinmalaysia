'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/programs?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/programs');
    }
  };

  const handleQuickTag = (tag: string, param: string) => {
    router.push(`/programs?${param}`);
  };

  return (
    <div className="space-y-4">
      {/* Animated Glowing Search Container */}
      <div className={`relative rounded-2xl p-[2px] transition-all duration-300 ${
        isFocused
          ? 'bg-gradient-to-r from-[#E8A300] via-[#3A60A1] to-[#E8A300] shadow-[0_0_30px_rgba(232,163,0,0.35)]'
          : 'bg-white/25 hover:bg-white/35 shadow-2xl'
      }`}>
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-[14px] p-2 transition-all shadow-inner"
        >
          <div className="pl-3 pr-2 text-slate-400">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-[#3A60A1]' : 'text-slate-400'}`} />
          </div>
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs e.g. Computer Science, MBBS, MBA, AI, Cyber Security..."
            className="w-full text-slate-900 placeholder-slate-400 text-sm sm:text-base px-2 py-2.5 focus:outline-hidden font-medium"
          />
          <button
            type="submit"
            className="btn-meezab-gold font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shrink-0 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Search Courses</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      {/* Quick Search Preset Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <span className="text-slate-200 font-medium mr-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E8A300]" />
          <span>Popular Filters:</span>
        </span>
        <button
          onClick={() => handleQuickTag('Low Upfront', 'budget=10000')}
          className="bg-white/10 hover:bg-[#E8A300] hover:text-slate-950 text-[#FFA300] font-bold px-3 py-1.5 rounded-xl transition-all border border-[#E8A300]/40 hover:scale-105 active:scale-95 flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <span>🇵🇰 Low Upfront (&lt;10k RM)</span>
        </button>
        <button
          onClick={() => handleQuickTag('Medicine', 'search=medicine')}
          className="bg-white/10 hover:bg-white/20 text-slate-200 font-semibold px-3 py-1.5 rounded-xl transition-all border border-white/15 hover:border-white/30 hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
        >
          <span>🩺 Medicine &amp; Health</span>
        </button>
        <button
          onClick={() => handleQuickTag('AI & Computing', 'search=computer')}
          className="bg-white/10 hover:bg-white/20 text-slate-200 font-semibold px-3 py-1.5 rounded-xl transition-all border border-white/15 hover:border-white/30 hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
        >
          <span>💻 AI &amp; Software</span>
        </button>
        <button
          onClick={() => handleQuickTag('MBA', 'search=business')}
          className="bg-white/10 hover:bg-white/20 text-slate-200 font-semibold px-3 py-1.5 rounded-xl transition-all border border-white/15 hover:border-white/30 hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
        >
          <span>📈 Business &amp; MBA</span>
        </button>
      </div>
    </div>
  );
}
