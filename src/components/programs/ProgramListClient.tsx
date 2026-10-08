'use client';

import React, { useState, useMemo, useEffect, useDeferredValue } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronDown, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  ArrowUpDown, 
  BookOpen,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { formatMYR, formatPKR, formatUSD, getYearlyVisaRenewalFee } from '@/lib/utils';
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
  firstYearFeeMYR?: number | null;
  secondYearFeeMYR?: number | null;
  thirdYearFeeMYR?: number | null;
  fourthYearFeeMYR?: number | null;
  emgsFeeMYR: number | null;
  miscFeesMYR: number | null;
  totalInitialMYR: number | null;
  yearlyVisaRenewalMYR?: number | null;
  scholarship: string | null;
  academicReq: string | null;
  englishReq: string | null;
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
  if (program.firstYearFeeMYR && Number(program.firstYearFeeMYR) > 0) {
    return Number(program.firstYearFeeMYR);
  }

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

const DEGREE_KEYWORD_MAP: Record<string, string[]> = {
  "Bachelor's Degree": ['bachelor'],
  "Master's (Postgraduate)": ['master', 'postgraduate diploma', 'postgraduate certificate'],
  "Ph.D & Doctorate": ['phd', 'ph.d', 'doctorate'],
  'Foundation / Diploma': [
    'foundation',
    'diploma',
    'certificate',
    'pre-university',
    'a level',
    'english language',
    'professional preparatory',
    'advanced diploma',
    'post basic',
  ],
};

export function ProgramListClient({ initialPrograms, universities }: ProgramListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useCounseling();

  // URL state
  const queryParam = searchParams.get('search') || '';
  const degreeParam = searchParams.get('degree') || 'All';
  const uniParam = searchParams.get('university') || 'All';
  const budgetParam = searchParams.get('budget') || 'all';
  const tuitionCapParam = searchParams.get('tuitionCap') || 'all';
  const disciplineParam = searchParams.get('discipline') || 'all';
  const sortParam = searchParams.get('sort') || 'tuition-asc';
  const durationParam = searchParams.get('duration') || 'all';
  const intakeParam = searchParams.get('intake') || 'all';

  // Local state
  const [search, setSearch] = useState(queryParam);
  const [degree, setDegree] = useState(degreeParam);
  const [selectedUni, setSelectedUni] = useState(uniParam);
  const [maxBudget, setMaxBudget] = useState(budgetParam);
  const [tuitionCap, setTuitionCap] = useState(tuitionCapParam);
  const [discipline, setDiscipline] = useState(disciplineParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [duration, setDuration] = useState(durationParam);
  const [intake, setIntake] = useState(intakeParam);
  const deferredSearch = useDeferredValue(search);
  const [currency, setCurrency] = useState<'MYR' | 'PKR' | 'USD'>('MYR');
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    setSearch(queryParam);
    setDegree(degreeParam);
    setSelectedUni(uniParam);
    setMaxBudget(budgetParam);
    setTuitionCap(tuitionCapParam);
    setDiscipline(disciplineParam);
    setSortBy(sortParam);
    setDuration(durationParam);
    setIntake(intakeParam);
  }, [queryParam, degreeParam, uniParam, budgetParam, tuitionCapParam, disciplineParam, sortParam, durationParam, intakeParam]);

  // Persist search in sessionStorage so user can effortlessly return to search results
  useEffect(() => {
    try {
      const qs = searchParams.toString();
      if (qs) {
        sessionStorage.setItem('meezab_last_search_url', `/programs?${qs}`);
        const summary = search
          ? `"${search}"`
          : degree !== 'All'
          ? degree
          : selectedUni !== 'All'
          ? 'Filtered'
          : 'Search Results';
        sessionStorage.setItem('meezab_last_search_summary', summary);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [searchParams, search, degree, selectedUni]);

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === 'All' || v === 'all') {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    const queryString = params.toString();
    router.push(queryString ? `/programs?${queryString}` : '/programs', { scroll: false });
  };

  const handleReset = () => {
    setSearch('');
    setDegree('All');
    setSelectedUni('All');
    setMaxBudget('all');
    setTuitionCap('all');
    setDiscipline('all');
    setSortBy('tuition-asc');
    setDuration('all');
    setIntake('all');
    try {
      sessionStorage.removeItem('meezab_last_search_url');
      sessionStorage.removeItem('meezab_last_search_summary');
    } catch {
      // ignore
    }
    router.push('/programs');
  };

  // Helper to construct detail breakdown URL carrying the search context
  const currentQueryString = searchParams.toString();
  const getDetailUrl = (slug: string) => {
    if (!currentQueryString) return `/programs/${slug}`;
    return `/programs/${slug}?from=${encodeURIComponent(`/programs?${currentQueryString}`)}`;
  };

  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((p) => {
      // Search
      if (deferredSearch.trim()) {
        const q = deferredSearch.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchUni = p.university.name.toLowerCase().includes(q);
        const matchFaculty = p.faculty.toLowerCase().includes(q);
        if (!matchTitle && !matchUni && !matchFaculty) return false;
      }

      // Degree filter
      if (degree !== 'All') {
        const keywords = DEGREE_KEYWORD_MAP[degree];
        if (keywords) {
          const level = p.degreeLevel.toLowerCase();
          const matched = keywords.some((kw) => level.includes(kw));
          if (!matched) return false;
        } else {
          if (p.degreeLevel !== degree) return false;
        }
      }

      // University
      if (selectedUni !== 'All') {
        if (p.university.id !== selectedUni && p.university.name !== selectedUni) return false;
      }

      // Upfront budget
      if (maxBudget !== 'all') {
        const limit = Number(maxBudget);
        if ((p.totalInitialMYR || 9500) > limit) return false;
      }

      // Total course tuition budget cap
      if (tuitionCap !== 'all') {
        const cap = Number(tuitionCap);
        if (p.tuitionMYR > cap) return false;
      }

      // Discipline / Field of Study filter
      if (discipline !== 'all') {
        const text = `${p.faculty} ${p.title}`.toLowerCase();
        if (discipline === 'computing' && !text.includes('comput') && !text.includes('software') && !text.includes('ai') && !text.includes('data') && !text.includes('tech') && !text.includes('cyber') && !text.includes('information')) return false;
        if (discipline === 'business' && !text.includes('business') && !text.includes('management') && !text.includes('finance') && !text.includes('accounting') && !text.includes('marketing') && !text.includes('mba') && !text.includes('economics')) return false;
        if (discipline === 'health' && !text.includes('medic') && !text.includes('health') && !text.includes('pharm') && !text.includes('nurs') && !text.includes('dental') && !text.includes('biomed') && !text.includes('physio')) return false;
        if (discipline === 'engineering' && !text.includes('engineer') && !text.includes('robot') && !text.includes('electrical') && !text.includes('mechanical') && !text.includes('civil') && !text.includes('chemical')) return false;
        if (discipline === 'hospitality' && !text.includes('hospitality') && !text.includes('tourism') && !text.includes('culinary') && !text.includes('hotel') && !text.includes('events')) return false;
        if (discipline === 'media' && !text.includes('design') && !text.includes('media') && !text.includes('art') && !text.includes('communicat') && !text.includes('animat') && !text.includes('graphic')) return false;
      }

      // Duration
      if (duration !== 'all') {
        const durationLimit = Number(duration);
        const programDuration = p.durationYears || Number(p.duration.match(/([\d.]+)\s*(?:year|yr)/i)?.[1]);
        if (!programDuration || (duration === '4+' ? programDuration < 4 : Math.abs(programDuration - durationLimit) > 0.25)) {
          return false;
        }
      }

      // Intake
      if (intake !== 'all' && !p.intakeMonths.toLowerCase().includes(intake.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Extensive precise sorting
      if (sortBy === 'tuition-asc') return a.tuitionMYR - b.tuitionMYR;
      if (sortBy === 'tuition-desc') return b.tuitionMYR - a.tuitionMYR;
      if (sortBy === 'firstyear-asc') return getFirstYearTuition(a) - getFirstYearTuition(b);
      if (sortBy === 'firstyear-desc') return getFirstYearTuition(b) - getFirstYearTuition(a);
      if (sortBy === 'initial-asc') return (a.totalInitialMYR || 9500) - (b.totalInitialMYR || 9500);
      if (sortBy === 'initial-desc') return (b.totalInitialMYR || 9500) - (a.totalInitialMYR || 9500);
      if (sortBy === 'duration-asc') {
        const da = a.durationYears || Number(a.duration.match(/([\d.]+)/)?.[1]) || 3;
        const db = b.durationYears || Number(b.duration.match(/([\d.]+)/)?.[1]) || 3;
        return da - db;
      }
      if (sortBy === 'duration-desc') {
        const da = a.durationYears || Number(a.duration.match(/([\d.]+)/)?.[1]) || 3;
        const db = b.durationYears || Number(b.duration.match(/([\d.]+)/)?.[1]) || 3;
        return db - da;
      }
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'uni-asc') return a.university.name.localeCompare(b.university.name);
      if (sortBy === 'scholarship-first') {
        const hasA = Boolean(a.scholarship && a.scholarship.trim().length > 0);
        const hasB = Boolean(b.scholarship && b.scholarship.trim().length > 0);
        if (hasA && !hasB) return -1;
        if (!hasA && hasB) return 1;
        return a.tuitionMYR - b.tuitionMYR;
      }
      return 0;
    });
  }, [initialPrograms, deferredSearch, degree, selectedUni, maxBudget, tuitionCap, discipline, sortBy, duration, intake]);

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
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0B2553] focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs font-semibold text-slate-500">Display Currency:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setCurrency('MYR')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === 'MYR' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                RM (MYR)
              </button>
              <button
                onClick={() => setCurrency('PKR')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === 'PKR' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Rs (PKR)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
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
                  ? 'bg-[#0B2553] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Detailed Secondary Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
          {/* 1. University Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Campus / University
            </label>
            <select
              value={selectedUni}
              onChange={(e) => {
                setSelectedUni(e.target.value);
                updateURL({ university: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#0B2553]"
            >
              <option value="All">All Universities ({universities.length || '20+'})</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Discipline / Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Field of Study
            </label>
            <select
              value={discipline}
              onChange={(e) => {
                setDiscipline(e.target.value);
                updateURL({ discipline: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#0B2553]"
            >
              <option value="all">All Fields / Faculties</option>
              <option value="computing">Computing, IT &amp; AI</option>
              <option value="business">Business, MBA &amp; Finance</option>
              <option value="engineering">Engineering &amp; Robotics</option>
              <option value="health">Medicine &amp; Health Sciences</option>
              <option value="hospitality">Hospitality &amp; Tourism</option>
              <option value="media">Design, Media &amp; Arts</option>
            </select>
          </div>

          {/* 3. Sort Dropdown (Rich options) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
              <span>Sort Results</span>
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateURL({ sort: e.target.value });
              }}
              className="w-full text-xs font-semibold border border-blue-200 bg-blue-50/50 rounded-xl px-2.5 py-2 text-[#0B2553] focus:outline-hidden focus:ring-2 focus:ring-[#0B2553]"
            >
              <option value="tuition-asc">Total Tuition: Low to High</option>
              <option value="tuition-desc">Total Tuition: High to Low</option>
              <option value="firstyear-asc">1st Year Tuition: Low to High</option>
              <option value="firstyear-desc">1st Year Tuition: High to Low</option>
              <option value="initial-asc">Initial Upfront (eVAL): Low to High</option>
              <option value="initial-desc">Initial Upfront (eVAL): High to Low</option>
              <option value="duration-asc">Duration: Shortest First</option>
              <option value="duration-desc">Duration: Longest First</option>
              <option value="title-asc">Degree Title: A to Z</option>
              <option value="uni-asc">University: A to Z</option>
              <option value="scholarship-first">Scholarships / Rebates First</option>
            </select>
          </div>

          {/* 4. Total Course Tuition Budget */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Total Tuition Budget
            </label>
            <select
              value={tuitionCap}
              onChange={(e) => {
                setTuitionCap(e.target.value);
                updateURL({ tuitionCap: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#0B2553]"
            >
              <option value="all">Any Total Tuition</option>
              <option value="40000">Under RM 40,000</option>
              <option value="60000">Under RM 60,000</option>
              <option value="80000">Under RM 80,000</option>
              <option value="110000">Under RM 110,000</option>
            </select>
          </div>

          {/* 5. Upfront eVAL Package Limit */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Upfront Visa Package
            </label>
            <select
              value={maxBudget}
              onChange={(e) => {
                setMaxBudget(e.target.value);
                updateURL({ budget: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#0B2553]"
            >
              <option value="all">Any Upfront Package</option>
              <option value="10000">Under RM 10,000</option>
              <option value="12000">Under RM 12,000</option>
              <option value="15000">Under RM 15,000</option>
            </select>
          </div>

          {/* 6. Intake Month */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Intake Month
            </label>
            <select
              value={intake}
              onChange={(e) => {
                setIntake(e.target.value);
                updateURL({ intake: e.target.value });
              }}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#0B2553]"
            >
              <option value="all">Any Intake</option>
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="may">May</option>
              <option value="july">July</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
            </select>
          </div>
        </div>

        {/* Results summary & reset */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span aria-live="polite">
            Found <strong className="text-slate-900 font-extrabold">{filteredPrograms.length}</strong> matching programs
          </span>
          {(search || degree !== 'All' || selectedUni !== 'All' || maxBudget !== 'all' || tuitionCap !== 'all' || discipline !== 'all' || duration !== 'all' || intake !== 'all' || sortBy !== 'tuition-asc') && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[#BA2E34] hover:text-red-800 font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
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
            Try adjusting your search query, choosing &quot;All Universities&quot;, or clearing the tuition budget cap.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-[#0B2553] text-white text-xs font-bold rounded-xl hover:bg-[#3A60A1] shadow-xs cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const yearlyRenewalFee = getYearlyVisaRenewalFee(program);
            const detailUrl = getDetailUrl(program.slug);

            return (
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
                    <Link href={detailUrl}>
                      {program.title}
                    </Link>
                  </h3>

                  {/* University Name */}
                  <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#E8A300] shrink-0" />
                    <span>{program.university.name}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    {program.faculty}
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

                  {/* Pricing Box with Yearly Visa Renewal Fee */}
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

                    <div className="flex justify-between items-baseline pt-1 border-t border-slate-200/50">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span>Visa Renewal (Yr 2+):</span>
                      </span>
                      <span className="text-[11px] font-bold text-blue-900">
                        {formatPrice(yearlyRenewalFee)} / yr
                      </span>
                    </div>

                    {program.scholarship && (
                      <div className="pt-1.5 border-t border-slate-200/50 text-[11px] text-[#B57F00] font-medium">
                        ✨ {program.scholarship}
                      </div>
                    )}
                  </div>

                  {/* Counselor Drawer Button */}
                  <button
                    type="button"
                    onClick={() => setExpandedProgramId((current) => current === program.id ? null : program.id)}
                    aria-expanded={expandedProgramId === program.id}
                    className="mt-3 w-full flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-[11px] font-bold text-[#0B2553] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{expandedProgramId === program.id ? 'Hide counselor breakdown' : 'Show counselor breakdown'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedProgramId === program.id ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedProgramId === program.id && (
                    <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3 space-y-2 text-[11px]">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {[
                          ['1st Year', program.firstYearFeeMYR],
                          ['2nd Year', program.secondYearFeeMYR],
                          ['3rd Year', program.thirdYearFeeMYR],
                          ['4th Year', program.fourthYearFeeMYR],
                        ].map(([label, value]) => (
                          <div key={label as string} className="flex justify-between gap-2 text-slate-600">
                            <span>{label}</span>
                            <strong className="text-slate-900">{value ? formatPrice(value as number) : 'Not set'}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between gap-2 border-t border-blue-100 pt-1.5 text-slate-600">
                        <span>Annual Visa Renewal:</span>
                        <strong className="text-blue-900">{formatPrice(yearlyRenewalFee)} / yr (Statutory EMGS)</strong>
                      </div>

                      {program.academicReq && (
                        <p className="border-t border-blue-100 pt-2 text-slate-600">
                          <strong className="text-[#0B2553]">Academic:</strong> {program.academicReq}
                        </p>
                      )}
                      {program.englishReq && (
                        <p className="text-slate-600">
                          <strong className="text-[#0B2553]">English:</strong> {program.englishReq}
                        </p>
                      )}
                      {program.pakistanNotes && (
                        <p className="text-slate-600">
                          <strong className="text-[#0B2553]">Counselor note:</strong> {program.pakistanNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={detailUrl}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
