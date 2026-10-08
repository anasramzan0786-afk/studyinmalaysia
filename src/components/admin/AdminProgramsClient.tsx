'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Building2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatMYR } from '@/lib/utils';

interface ProgramItem {
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
  scholarship: string | null;
  academicReq: string | null;
  englishReq: string | null;
  universityId: string;
  university: {
    id: string;
    name: string;
  };
}

interface UniversityItem {
  id: string;
  name: string;
  shortName?: string;
  type?: string;
  emgsFeeMYR?: number | null;
  miscFeesMYR?: number | null;
  totalInitialMYR?: number | null;
  intakeMonths?: string | null;
  tuitionBachelor?: string | null;
  tuitionMaster?: string | null;
  tuitionPhd?: string | null;
  avgTuition3Yr?: number | null;
  initialBreakdownNotes?: string | null;
  location?: string | null;
}

interface AdminProgramsClientProps {
  initialPrograms: ProgramItem[];
  universities: UniversityItem[];
}

// Helper: Parse numeric value from tuition strings like 'RM 60k - 85k'
function parseTuitionHint(str: string | null | undefined, fallback: number): number {
  if (!str) return fallback;
  const match = str.match(/(\d+)/g);
  if (!match) return fallback;
  const nums = match.map(Number);
  // If range like "60k - 85k", use the lower bound
  return Math.min(...nums) * (str.toLowerCase().includes('k') ? 1000 : 1);
}

// Helper: suggested duration based on degree level
function suggestDuration(level: string): string {
  const l = level.toLowerCase();
  if (l.includes('phd') || l.includes('doctorate')) return '3 Years';
  if (l.includes("master")) return '1.5 Years';
  if (l.includes('foundation') || l.includes('diploma')) return '2 Years';
  return '3 Years';
}

export function AdminProgramsClient({ initialPrograms, universities }: AdminProgramsClientProps) {
  const [programs, setPrograms] = useState<ProgramItem[]>(initialPrograms);
  const [search, setSearch] = useState('');
  const [selectedUni, setSelectedUni] = useState('All');
  const [qualityFilter, setQualityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [universityId, setUniversityId] = useState(universities[0]?.id || '');
  const [degreeLevel, setDegreeLevel] = useState("Bachelor's Degree");
  const [faculty, setFaculty] = useState('School of Computing');
  const [duration, setDuration] = useState('3 Years');
  const [intakeMonths, setIntakeMonths] = useState('January, May, September');
  const [tuitionMYR, setTuitionMYR] = useState(60000);
  const [firstYearFeeMYR, setFirstYearFeeMYR] = useState<number | ''>('');
  const [secondYearFeeMYR, setSecondYearFeeMYR] = useState<number | ''>('');
  const [thirdYearFeeMYR, setThirdYearFeeMYR] = useState<number | ''>('');
  const [fourthYearFeeMYR, setFourthYearFeeMYR] = useState<number | ''>('');
  const [emgsFeeMYR, setEmgsFeeMYR] = useState(3500);
  const [miscFeesMYR, setMiscFeesMYR] = useState(6000);
  const [scholarship, setScholarship] = useState('');
  const [academicReq, setAcademicReq] = useState('');
  const [englishReq, setEnglishReq] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Smart auto-fill: apply university-level defaults to the add-program form
  const applyUniversityDefaults = useCallback((uniId: string, currentDegreeLevel: string) => {
    if (editingProgram) return; // Don't auto-fill when editing
    const uni = universities.find((u) => u.id === uniId);
    if (!uni) return;

    const filled: string[] = [];

    // Auto-fill EMGS fee from university
    if (uni.emgsFeeMYR && uni.emgsFeeMYR > 0) {
      setEmgsFeeMYR(uni.emgsFeeMYR);
      filled.push('EMGS Fee');
    }

    // Auto-fill misc fees from university
    if (uni.miscFeesMYR && uni.miscFeesMYR > 0) {
      setMiscFeesMYR(uni.miscFeesMYR);
      filled.push('Reg & Bond');
    }

    // Auto-fill intake months from university
    if (uni.intakeMonths && uni.intakeMonths.trim()) {
      setIntakeMonths(uni.intakeMonths);
      filled.push('Intake Months');
    }

    // Auto-fill tuition suggestion based on degree level
    const level = currentDegreeLevel.toLowerCase();
    if (level.includes('phd') || level.includes('doctorate')) {
      const suggested = parseTuitionHint(uni.tuitionPhd, 60000);
      setTuitionMYR(suggested);
      filled.push('Tuition (PhD hint)');
    } else if (level.includes('master')) {
      const suggested = parseTuitionHint(uni.tuitionMaster, 40000);
      setTuitionMYR(suggested);
      filled.push('Tuition (Master hint)');
    } else {
      const suggested = uni.avgTuition3Yr || parseTuitionHint(uni.tuitionBachelor, 60000);
      setTuitionMYR(suggested);
      filled.push('Tuition (Bachelor hint)');
    }

    // Auto-fill duration from degree level
    setDuration(suggestDuration(currentDegreeLevel));
    filled.push('Duration');

    setAutoFilledFields(filled);
  }, [universities, editingProgram]);

  const filtered = programs.filter((p) => {
    if (selectedUni !== 'All' && p.universityId !== selectedUni) return false;
    if (qualityFilter === 'MISSING_FEES' && (!p.firstYearFeeMYR || p.firstYearFeeMYR <= 0)) return false;
    if (
      qualityFilter === 'MISSING_REQUIREMENTS' &&
      p.academicReq &&
      p.englishReq
    ) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.university.name.toLowerCase().includes(q) ||
        p.degreeLevel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingProgram(null);
    setFormError(null);
    setAutoFilledFields([]);
    setTitle('');
    const defaultUniId = universities[0]?.id || '';
    setUniversityId(defaultUniId);
    const defaultDegreeLevel = "Bachelor's Degree";
    setDegreeLevel(defaultDegreeLevel);
    setFaculty('School of Computing');
    setDuration('3 Years');
    setIntakeMonths('January, May, September');
    setTuitionMYR(60000);
    setFirstYearFeeMYR('');
    setSecondYearFeeMYR('');
    setThirdYearFeeMYR('');
    setFourthYearFeeMYR('');
    setEmgsFeeMYR(3500);
    setMiscFeesMYR(6000);
    setScholarship('');
    setAcademicReq('');
    setEnglishReq('');
    setIsModalOpen(true);
    // Apply university defaults after state is set
    setTimeout(() => applyUniversityDefaults(defaultUniId, defaultDegreeLevel), 0);
  };

  const handleOpenEditModal = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setFormError(null);
    setTitle(prog.title);
    setUniversityId(prog.universityId);
    setDegreeLevel(prog.degreeLevel);
    setFaculty(prog.faculty);
    setDuration(prog.duration);
    setIntakeMonths(prog.intakeMonths);
    setTuitionMYR(prog.tuitionMYR);
    setFirstYearFeeMYR(prog.firstYearFeeMYR || '');
    setSecondYearFeeMYR(prog.secondYearFeeMYR || '');
    setThirdYearFeeMYR(prog.thirdYearFeeMYR || '');
    setFourthYearFeeMYR(prog.fourthYearFeeMYR || '');
    setEmgsFeeMYR(prog.emgsFeeMYR || 3500);
    setMiscFeesMYR(prog.miscFeesMYR || 6000);
    setScholarship(prog.scholarship || '');
    setAcademicReq(prog.academicReq || '');
    setEnglishReq(prog.englishReq || '');
    setAutoFilledFields([]); // No auto-fill when editing
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, programTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${programTitle}"?`)) return;

    try {
      const res = await fetch(`/api/programs?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-confirm': 'true' },
      });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
        showNotification(`Deleted "${programTitle}" successfully.`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete program');
      }
    } catch (err) {
      alert('Failed to delete program');
    }
  };

  const handleClearAllPrograms = async () => {
    if (!confirm('⚠️ Are you sure you want to remove ALL programs from the database? This action cannot be undone!')) return;

    try {
      const res = await fetch('/api/programs?all=true', {
        method: 'DELETE',
        headers: { 'x-admin-confirm': 'true' },
      });
      if (res.ok) {
        setPrograms([]);
        showNotification('All programs removed successfully from database.');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to clear programs');
      }
    } catch (err) {
      alert('Failed to clear programs');
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      title,
      universityId,
      degreeLevel,
      faculty,
      duration,
      intakeMonths,
      tuitionMYR: Number(tuitionMYR),
      firstYearFeeMYR: firstYearFeeMYR !== '' ? Number(firstYearFeeMYR) : undefined,
      secondYearFeeMYR: secondYearFeeMYR !== '' ? Number(secondYearFeeMYR) : undefined,
      thirdYearFeeMYR: thirdYearFeeMYR !== '' ? Number(thirdYearFeeMYR) : undefined,
      fourthYearFeeMYR: fourthYearFeeMYR !== '' ? Number(fourthYearFeeMYR) : undefined,
      emgsFeeMYR: Number(emgsFeeMYR),
      miscFeesMYR: Number(miscFeesMYR),
      scholarship: scholarship || undefined,
      academicReq: academicReq || undefined,
      englishReq: englishReq || undefined,
    };

    try {
      if (editingProgram) {
        // Update
        const res = await fetch('/api/programs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProgram.id, ...payload }),
        });
        const data = await res.json();
        if (res.ok) {
          setPrograms((prev) =>
            prev.map((p) => (p.id === editingProgram.id ? data.program : p))
          );
          setIsModalOpen(false);
          showNotification(`Updated "${title}" successfully.`);
        } else {
          setFormError(data.error || 'Failed to update program. Please review the fee and requirement fields.');
        }
      } else {
        // Create
        const res = await fetch('/api/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setPrograms((prev) => [data.program, ...prev]);
          setIsModalOpen(false);
          showNotification(`Added new course "${title}" to database.`);
        } else {
          setFormError(data.error || 'Failed to add program. Please review the fee and requirement fields.');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Error saving program. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Course Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Currently {programs.length} programs registered in the database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {programs.length > 0 && (
            <button
              onClick={handleClearAllPrograms}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Courses</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-[#0a2540] hover:bg-[#163658] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold shrink-0">Filter University:</span>
          <select
            value={selectedUni}
            onChange={(e) => setSelectedUni(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-hidden"
          >
            <option value="All">All Universities</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold shrink-0">Data quality:</span>
          <select
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-hidden"
          >
            <option value="ALL">All records</option>
            <option value="MISSING_FEES">Missing 1st-year fee</option>
            <option value="MISSING_REQUIREMENTS">Missing requirements</option>
          </select>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Program Title</th>
                <th className="py-3 px-4">University</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Tuition Fee</th>
                <th className="py-3 px-4">Upfront (eVAL)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No programs match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      <Link
                        href={`/programs/${prog.slug}`}
                        target="_blank"
                        className="hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>{prog.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[160px] truncate">
                      {prog.university.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                        {prog.degreeLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatMYR(prog.tuitionMYR)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatMYR(prog.totalInitialMYR || 9500)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(prog)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Course"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prog.id, prog.title)}
                        className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0a2540] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProgram ? 'Edit Program Details' : 'Add New Course to Database'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bachelor of Computer Science (Cyber Security)"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    University *
                  </label>
                  <select
                    value={universityId}
                    onChange={(e) => {
                      const newUniId = e.target.value;
                      setUniversityId(newUniId);
                      applyUniversityDefaults(newUniId, degreeLevel);
                    }}
                    className="w-full text-xs border border-[#0B2553]/40 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0B2553] focus:outline-hidden bg-white"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.shortName || u.name}
                      </option>
                    ))}
                  </select>
                  {!editingProgram && autoFilledFields.length > 0 && (
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-filled: {autoFilledFields.join(', ')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Degree Level *
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => {
                      const newLevel = e.target.value;
                      setDegreeLevel(newLevel);
                      // Re-apply university defaults when degree level changes (tuition + duration update)
                      if (!editingProgram) {
                        applyUniversityDefaults(universityId, newLevel);
                      }
                    }}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0B2553] focus:outline-hidden bg-white"
                  >
                    <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                    <option value="Master's (Postgraduate)">Master&apos;s (Postgraduate)</option>
                    <option value="Ph.D &amp; Doctorate">Ph.D &amp; Doctorate</option>
                    <option value="Foundation / Diploma">Foundation / Diploma</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Tuition (MYR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={tuitionMYR}
                    onChange={(e) => setTuitionMYR(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    EMGS Fee (MYR)
                  </label>
                  <input
                    type="number"
                    value={emgsFeeMYR}
                    onChange={(e) => setEmgsFeeMYR(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration &amp; Bond (MYR)
                  </label>
                  <input
                    type="number"
                    value={miscFeesMYR}
                    onChange={(e) => setMiscFeesMYR(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Yearly Tuition Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">
                    Yearly Fee Breakdown (optional — enables precise 1st year cost on cards):
                  </span>
                  {!editingProgram && firstYearFeeMYR !== '' && (
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                      Sum: {formatMYR((Number(firstYearFeeMYR) || 0) + (Number(secondYearFeeMYR) || 0) + (Number(thirdYearFeeMYR) || 0) + (Number(fourthYearFeeMYR) || 0))}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      1st Year Fee (MYR)
                    </label>
                    <input
                      type="number"
                      value={firstYearFeeMYR}
                      onChange={(e) => setFirstYearFeeMYR(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 20000"
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      2nd Year Fee (MYR)
                    </label>
                    <input
                      type="number"
                      value={secondYearFeeMYR}
                      onChange={(e) => setSecondYearFeeMYR(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 20000"
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      3rd Year Fee (MYR)
                    </label>
                    <input
                      type="number"
                      value={thirdYearFeeMYR}
                      onChange={(e) => setThirdYearFeeMYR(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 20000"
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      4th Year Fee (MYR)
                    </label>
                    <input
                      type="number"
                      value={fourthYearFeeMYR}
                      onChange={(e) => setFourthYearFeeMYR(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Optional"
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Years"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Intake Months</label>
                  <input
                    type="text"
                    value={intakeMonths}
                    onChange={(e) => setIntakeMonths(e.target.value)}
                    placeholder="e.g. January, May, September"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Requirements (FSc / A-Levels criteria)
                </label>
                <textarea
                  rows={2}
                  value={academicReq}
                  onChange={(e) => setAcademicReq(e.target.value)}
                  placeholder="e.g. Minimum 50% in FSc (Pre-Eng / ICS) or B grade in Math."
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  English Language Requirements
                </label>
                <input
                  type="text"
                  value={englishReq}
                  onChange={(e) => setEnglishReq(e.target.value)}
                  placeholder="e.g. IELTS 5.5 or English Medium exemption letter."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to DB...' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

