'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';

interface BackButtonProps {
  degreeLevel: string;
}

export function BackButton({ degreeLevel }: BackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [searchSummary, setSearchSummary] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check URL 'from' query param first
    const fromParam = searchParams.get('from');
    if (fromParam) {
      setReturnUrl(fromParam);
      try {
        const urlObj = new URL(fromParam, window.location.origin);
        const q = urlObj.searchParams.get('search');
        const deg = urlObj.searchParams.get('degree');
        const uni = urlObj.searchParams.get('university');
        if (q) setSearchSummary(`"${q}"`);
        else if (deg && deg !== 'All') setSearchSummary(deg);
        else if (uni && uni !== 'All') setSearchSummary('Filtered');
        else setSearchSummary('Results');
      } catch {
        setSearchSummary('Results');
      }
      return;
    }

    // 2. Check sessionStorage fallback
    try {
      const savedUrl = sessionStorage.getItem('meezab_last_search_url');
      if (savedUrl && savedUrl.includes('/programs?')) {
        setReturnUrl(savedUrl);
        const savedSummary = sessionStorage.getItem('meezab_last_search_summary');
        setSearchSummary(savedSummary || 'Results');
      }
    } catch {
      // ignore
    }
  }, [searchParams]);

  const handleBackToSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (returnUrl) {
      router.push(returnUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pb-2 border-b border-slate-200/80">
      <div className="flex items-center gap-2 flex-wrap">
        {returnUrl ? (
          <>
            <button
              onClick={handleBackToSearch}
              className="inline-flex items-center gap-1.5 font-bold text-white bg-[#0B2553] hover:bg-[#3A60A1] px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer hover:shadow-md active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Search Results</span>
              {searchSummary && (
                <span className="text-[10px] bg-white/20 text-white font-medium px-2 py-0.5 rounded-md ml-1">
                  {searchSummary}
                </span>
              )}
            </button>

            <span className="text-slate-300">•</span>

            <Link
              href="/programs"
              className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>All Courses</span>
            </Link>
          </>
        ) : (
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 font-bold text-[#0B2553] hover:text-[#3A60A1] transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Courses</span>
          </Link>
        )}
      </div>

      {/* Breadcrumb Right Side */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Link href="/programs" className="hover:text-slate-900 transition-colors">
          Programs
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        {returnUrl && (
          <>
            <button
              onClick={handleBackToSearch}
              className="hover:text-[#0B2553] font-semibold text-blue-700 transition-colors cursor-pointer"
            >
              Search Results
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </>
        )}
        <span className="text-slate-800 font-semibold">{degreeLevel}</span>
      </div>
    </div>
  );
}
