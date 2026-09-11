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
      <div className={`relative rounded-2xl p-[1.5px] transition-all duration-300 ${
        isFocused
          ? 'bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 shadow-[0_0_30px_rgba(56,189,248,0.3)]'
          : 'bg-white/20 hover:bg-white/30 shadow-2xl'
      }`}>
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-[15px] p-2 transition-all"
        >
          <div className="pl-3 pr-2 text-slate-400">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-blue-700' : 'text-slate-400'}`} />
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
            className="bg-[#0a2540] hover:bg-[#16375a] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shrink-0 active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>
      </div>

      {/* Quick Search Preset Filter Pills with Micro-Scale on Hover */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <span className="text-slate-300 font-medium mr-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Quick Filters:</span>
        </span>
        <button
          onClick={() => handleQuickTag('Low Upfront', 'budget=10000')}
          className="bg-white/10 hover:bg-white/20 text-amber-300 font-bold px-3 py-1.5 rounded-xl transition-all border border-amber-300/30 hover:scale-105 active:scale-95 flex items-center gap-1 shadow-xs"
        >
          <span>🇵🇰 Low Upfront (&lt;10k RM)</span>
        </button>
        <button
          onClick={() => handleQuickTag('Medicine', 'search=medicine')}
          className="bg-white/10 hover:bg-white/20 text-slate-200 font-semibold px-3 py-1.5 rounded-xl transition-all border border-white/10 hover:border-white/25 hover:scale-105 active:scale-95 shadow-xs"
        >
          <span>🩺 Medicine &amp; Health</span>
        </button>
        <button
          onClick={() => handleQuickTag('AI & Computing', 'search=computer')}
          className="bg-white/10 hover:bg-white/20 text-slate-200 font-semibold px-3 py-1.5 rounded-xl transition-all border border-white/10 hover:border-white/25 hover:scale-105 active:scale-95 shadow-xs"
        >
          <span>💻 AI &amp; Software</span>
        </button>
        <button
          onClick={() => handleQuickTag('MBA', 'search=business')}
          className="bg-white/10 hover:bg-white/20 text-slate-200 font-semibold px-3 py-1.5 rounded-xl transition-all border border-white/10 hover:border-white/25 hover:scale-105 active:scale-95 shadow-xs"
        >
          <span>📈 Business &amp; MBA</span>
        </button>
      </div>
    </div>
  );
}
