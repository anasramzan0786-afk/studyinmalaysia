'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronRight, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Building2,
  CheckCircle2,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { formatMYR, formatPKR, formatUSD } from '@/lib/utils';
import { useCounseling } from '@/components/CounselingContext';

interface ProgramWithUniversity {
  id: string;
  slug: string;
  title: string;
  degreeLevel: string;
  faculty: string;
  duration: string;
  intakeMonths: string;
  tuitionMYR: number;
  emgsFeeMYR: number | null;
  miscFeesMYR: number | null;
  totalInitialMYR: number | null;
  scholarship: string | null;
  academicReq: string | null;
  badgeText: string | null;
  pakistanNotes: string | null;
  durationYears?: number | null;
  semesterSchedules?: { semester: string; tuitionMYR: number; miscMYR: number }[];
  university: {
    id: string;
    name: string;
    shortName: string;
    logo: string | null;
    location: string;
  };
}

function getFirstYearTuition(program: ProgramWithUniversity): number {
  if (program.semesterSchedules && program.semesterSchedules.length > 0) {
    const year1 = program.semesterSchedules.find((s) =>
      s.semester.toLowerCase().includes('year 1') ||
      s.semester.toLowerCase().includes('sem 1')
    );
    if (year1 && year1.tuitionMYR > 0) {
      if (year1.semester.toLowerCase().includes('sem 1')) {
        const sem2 = program.semesterSchedules.find((s) => s.semester.toLowerCase().includes('sem 2'));
        return year1.tuitionMYR + (sem2 ? sem2.tuitionMYR : year1.tuitionMYR);
      }
      return year1.tuitionMYR;
    }
  }

  // Parse duration in years
  let years = program.durationYears;
  if (!years && program.duration) {
    const match = program.duration.match(/([\d.]+)\s*(?:year|yr)/i);
    if (match) {
      years = parseFloat(match[1]);
    }
  }

  if (!years || years <= 0) {
    const level = (program.degreeLevel || '').toLowerCase();
    if (level.includes('master')) years = 1.5;
    else if (level.includes('phd') || level.includes('doctorate')) years = 3;
    else if (level.includes('bachelor')) years = 3;
    else if (level.includes('diploma') || level.includes('foundation')) years = 2;
    else years = 3;
  }

  return Math.round(program.tuitionMYR / years);
}


interface ProgramListClientProps {
  initialPrograms: ProgramWithUniversity[];
  universities: { id: string; name: string; shortName: string }[];
}

export function ProgramListClient({ initialPrograms, universities }: ProgramListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useCounseling();

  // URL state
  const queryParam = searchParams.get('search') || '';
  const degreeParam = searchParams.get('degree') || 'All';
  const uniParam = searchParams.get('university') || 'All';
  const budgetParam = searchParams.get('budget') || 'all';
  const sortParam = searchParams.get('sort') || 'tuition-asc';

  // Local state
  const [search, setSearch] = useState(queryParam);
  const [degree, setDegree] = useState(degreeParam);
  const [selectedUni, setSelectedUni] = useState(uniParam);
  const [maxBudget, setMaxBudget] = useState(budgetParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [currency, setCurrency] = useState<'MYR' | 'PKR' | 'USD'>('MYR');

  // Sync state if URL changes
  useEffect(() => {
    setSearch(queryParam);
    setDegree(degreeParam);
    setSelectedUni(uniParam);
    setMaxBudget(budgetParam);
    setSortBy(sortParam);
  }, [queryParam, degreeParam, uniParam, budgetParam, sortParam]);

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === 'All' || v === 'all') {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    router.push(`/programs?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setSearch('');
    setDegree('All');
    setSelectedUni('All');
    setMaxBudget('all');
    setSortBy('tuition-asc');
    router.push('/programs');
  };

  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((p) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchUni = p.university.name.toLowerCase().includes(q);
        const matchFaculty = p.faculty.toLowerCase().includes(q);
        if (!matchTitle && !matchUni && !matchFaculty) return false;
      }

      // Degree
      if (degree !== 'All' && p.degreeLevel !== degree) return false;

      // University
      if (selectedUni !== 'All') {
        if (p.university.id !== selectedUni && p.university.name !== selectedUni) return false;
      }

      // Upfront budget
      if (maxBudget !== 'all') {
        const limit = Number(maxBudget);
        if ((p.totalInitialMYR || 9500) > limit) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'tuition-asc') return a.tuitionMYR - b.tuitionMYR;
      if (sortBy === 'tuition-desc') return b.tuitionMYR - a.tuitionMYR;
      if (sortBy === 'initial-asc') return (a.totalInitialMYR || 0) - (b.totalInitialMYR || 0);
      return 0;
    });
  }, [initialPrograms, search, degree, selectedUni, maxBudget, sortBy]);

  const formatPrice = (amountMYR: number | null | undefined) => {
    if (currency === 'USD') return formatUSD(amountMYR);
    if (currency === 'PKR') return formatPKR(amountMYR);
    return formatMYR(amountMYR);
  };

  const degreeOptions = [
    'All',
    "Bachelor's Degree",
    "Master's (Postgraduate)",
    "Ph.D & Doctorate",
    'Foundation / Diploma',
  ];

  return (
    <div className="space-y-8">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        {/* Search row & Currency toggle */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateURL({ search: e.target.value });
              }}
              placeholder="Search by degree title, university, or subject..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs font-semibold text-slate-500">Display Currency:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setCurrency('MYR')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  currency === 'MYR' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                RM (MYR)
              </button>
              <button
                onClick={() => setCurrency('PKR')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  currency === 'PKR' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Rs (PKR)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  currency === 'USD' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                $ (USD)
              </button>
            </div>
          </div>
        </div>

        {/* Degree Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2">Level:</span>
          {degreeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setDegree(opt);
                updateURL({ degree: opt });
              }}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                degree === opt
                  ? 'bg-[#3A60A1] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Secondary Filters (University, Upfront, Sorting) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Select Institution
            </label>
            <select
              value={selectedUni}
              onChange={(e) => {
                setSelectedUni(e.target.value);
                updateURL({ university: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Universities (20+)</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Upfront Package Limit (eVAL &amp; Visa)
            </label>
            <select
              value={maxBudget}
              onChange={(e) => {
                setMaxBudget(e.target.value);
                updateURL({ budget: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Any Initial Upfront</option>
              <option value="10000">Under RM 10,000 (Budget Friendly)</option>
              <option value="12000">Under RM 12,000</option>
              <option value="15000">Under RM 15,000</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateURL({ sort: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="tuition-asc">Total Tuition: Lowest First</option>
              <option value="tuition-desc">Total Tuition: Highest First</option>
              <option value="initial-asc">Initial Upfront: Lowest First</option>
            </select>
          </div>
        </div>

        {/* Results summary & reset */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>
            Found <strong className="text-slate-900">{filteredPrograms.length}</strong> matching programs
          </span>
          {(search || degree !== 'All' || selectedUni !== 'All' || maxBudget !== 'all') && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Program Cards Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No programs match your current filters</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, choosing &quot;All Universities&quot;, or removing the upfront budget cap.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800 shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-[#3A60A1] transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-[#3A60A1] bg-[#3A60A1]/10 px-2.5 py-1 rounded-md border border-[#3A60A1]/20">
                    {program.degreeLevel}
                  </span>
                  {program.badgeText && (
                    <span className="text-[10px] font-bold text-[#B57F00] bg-[#E8A300]/15 px-2 py-0.5 rounded-md border border-[#E8A300]/30">
                      {program.badgeText}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-[#0B2553] leading-snug line-clamp-2 group-hover:text-[#3A60A1] transition-colors">
                  <Link href={`/programs/${program.slug}`}>
                    {program.title}
                  </Link>
                </h3>

                {/* University Name */}
                <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#E8A300] shrink-0" />
                  <span>{program.university.name}</span>
                </p>

                {/* Intake & Duration */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{program.duration}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[130px]">{program.intakeMonths}</span>
                  </span>
                </div>

                {/* Pricing Box */}
                <div className="mt-4 bg-[#F9F9F9] rounded-xl p-3.5 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Total Course Tuition:</span>
                    <span className="text-base font-extrabold text-[#0B2553]">
                      {formatPrice(program.tuitionMYR)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-600 font-medium">First Year Tuition:</span>
                    <span className="text-xs font-black text-[#0B2553]">
                      {formatPrice(getFirstYearTuition(program))}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-600 font-medium">
                      Upfront (eVAL + Admin):
                    </span>
                    <span className="text-xs font-bold text-[#BA2E34]">
                      {formatPrice(program.totalInitialMYR || 9500)}
                    </span>
                  </div>

                  {program.scholarship && (
                    <div className="pt-1.5 border-t border-slate-200/50 text-[11px] text-[#B57F00] font-medium">
                      ✨ {program.scholarship}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/programs/${program.slug}`}
                  className="flex-1 text-center py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                >
                  Full Breakdown
                </Link>
                <button
                  onClick={() => openModal(program.title, program.id)}
                  className="btn-meezab-gold py-2.5 px-4 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

