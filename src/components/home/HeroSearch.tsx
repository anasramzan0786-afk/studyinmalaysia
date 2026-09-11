'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
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

  const quickTags = [
    { label: 'MBBS', param: 'search=medicine' },
    { label: 'Computer Science', param: 'search=computer' },
    { label: 'MBA', param: 'search=business' },
    { label: 'Engineering', param: 'search=engineering' },
    { label: 'Low Upfront', param: 'budget=10000' },
  ];

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div
        className={`relative rounded-2xl transition-all duration-300 ${
          isFocused
            ? 'shadow-[0_0_0_2px_rgba(232,163,0,0.8),0_20px_60px_rgba(232,163,0,0.2)]'
            : 'shadow-[0_10px_50px_rgba(0,0,0,0.4)]'
        }`}
      >
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-2xl overflow-hidden"
        >
          <div className="pl-5 pr-2 text-slate-400 shrink-0">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-[#3A60A1]' : 'text-slate-400'}`} />
          </div>
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs — MBBS, Computer Science, MBA, Engineering..."
            className="w-full text-slate-900 placeholder-slate-400 text-sm sm:text-base px-3 py-4 focus:outline-none font-medium bg-transparent"
          />
          <button
            type="submit"
            className="m-1.5 shrink-0 bg-[#E8A300] hover:bg-[#d49400] text-[#0B2553] font-extrabold text-sm px-7 py-3 rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick-pick tags */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-slate-500 text-xs font-medium">Popular:</span>
        {quickTags.map((tag) => (
          <button
            key={tag.label}
            onClick={() => router.push(`/programs?${tag.param}`)}
            className="text-xs text-slate-300 hover:text-[#E8A300] bg-white/8 hover:bg-white/12 border border-white/12 hover:border-[#E8A300]/50 px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
