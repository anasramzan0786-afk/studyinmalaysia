'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import { 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Trash2, 
  ArrowRight,
  Database,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Filter,
  Check,
  AlertTriangle,
  Info,
  ChevronDown
} from 'lucide-react';
import { formatMYR } from '@/lib/utils';

interface ParsedRow {
  id: string; // internal tracking id
  programDbId?: string; // actual database id if existing record
  title: string;
  universityName: string;
  universityId?: string;
  degreeLevel: string;
  faculty: string;
  duration: string;
  intakeMonths: string;
  tuitionMYR: number;
  firstYearFeeMYR?: number;
  secondYearFeeMYR?: number;
  thirdYearFeeMYR?: number;
  fourthYearFeeMYR?: number;
  emgsFeeMYR: number;
  miscFeesMYR: number;
  totalInitialMYR: number;
  scholarship?: string;
  academicReq?: string;
  englishReq?: string;
  pakistanNotes?: string;
  // Validation status
  status: 'valid' | 'warning' | 'error';
  issues: string[];
}

interface UniversityOption {
  id: string;
  name: string;
  shortName: string;
}

export default function BulkUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    importedCount: number;
    createdCount?: number;
    updatedCount?: number;
    skippedCount?: number;
    errors: string[];
  } | null>(null);
  const [rawText, setRawText] = useState('');
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');

  // Universities list for resolution & dropdown selection
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);

  // Export State
  const [exportUniId, setExportUniId] = useState<string>('All');
  const [exportDegreeLevel, setExportDegreeLevel] = useState<string>('All');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch universities on mount
  useEffect(() => {
    fetch('/api/universities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.universities)) {
          setUniversities(data.universities);
        }
      })
      .catch((err) => console.error('Failed to load universities:', err))
      .finally(() => setIsLoadingUniversities(false));
  }, []);

  // Helper to match university against list
  const matchUniversity = (rawName: string): UniversityOption | undefined => {
    if (!rawName || !universities.length) return undefined;
    const target = rawName.trim().toLowerCase();
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTarget = clean(target);

    // 1. Direct name or shortName
    let found = universities.find(
      (u) => u.name.toLowerCase() === target || u.shortName.toLowerCase() === target
    );
    if (found) return found;

    // 2. Clean alphanumeric match
    found = universities.find(
      (u) => clean(u.name) === cleanTarget || clean(u.shortName) === cleanTarget
    );
    if (found) return found;

    // 3. Substring match
    const candidates = universities.filter((u) => {
      const uNameClean = clean(u.name);
      const uShortClean = clean(u.shortName);
      return (
        uNameClean.includes(cleanTarget) ||
        cleanTarget.includes(uShortClean) ||
        (uShortClean.length >= 3 && cleanTarget.includes(uShortClean))
      );
    });

    if (candidates.length === 1) return candidates[0];
    if (candidates.length > 1) {
      return candidates.sort(
        (a, b) => Math.abs(a.name.length - target.length) - Math.abs(b.name.length - target.length)
      )[0];
    }

    return undefined;
  };

  // Validate a row
  const validateRow = (row: Omit<ParsedRow, 'status' | 'issues'>): { status: 'valid' | 'warning' | 'error'; issues: string[] } => {
    const issues: string[] = [];
    let isError = false;

    if (!row.title.trim()) {
      issues.push('Program title is required');
      isError = true;
    }

    const matched = matchUniversity(row.universityName);
    if (!matched) {
      issues.push(`Unknown university "${row.universityName || 'empty'}"`);
      isError = true;
    }

    if (!row.degreeLevel.trim()) {
      issues.push('Degree level is required');
      isError = true;
    }

    const yearlySum = (row.firstYearFeeMYR || 0) + (row.secondYearFeeMYR || 0) + (row.thirdYearFeeMYR || 0) + (row.fourthYearFeeMYR || 0);
    if (row.tuitionMYR <= 0 && yearlySum <= 0) {
      issues.push('Tuition fee is 0 or unspecified');
    }

    if (yearlySum > 0 && row.tuitionMYR > 0 && Math.abs(yearlySum - row.tuitionMYR) > 1) {
      issues.push(`Yearly sum (${yearlySum}) differs from total tuition (${row.tuitionMYR})`);
    }

    if (isError) return { status: 'error', issues };
    if (issues.length > 0) return { status: 'warning', issues };
    return { status: 'valid', issues: [] };
  };

  // Re-run validation whenever rows or universities change
  const revalidateRows = (rows: ParsedRow[]): ParsedRow[] => {
    return rows.map((r) => {
      const val = validateRow(r);
      const matched = matchUniversity(r.universityName);
      return {
        ...r,
        universityId: matched?.id,
        status: val.status,
        issues: val.issues,
      };
    });
  };

  // Sample CSV Template for user to download
  const downloadSampleTemplate = () => {
    const headers = [
      'title',
      'universityName',
      'degreeLevel',
      'faculty',
      'duration',
      'intakeMonths',
      'tuitionMYR',
      'firstYearFeeMYR',
      'secondYearFeeMYR',
      'thirdYearFeeMYR',
      'fourthYearFeeMYR',
      'emgsFeeMYR',
      'miscFeesMYR',
      'totalInitialMYR',
      'scholarship',
      'academicReq',
      'englishReq',
      'pakistanNotes',
    ];

    // Pick top universities as clean examples
    const sampleUni1 = universities[0]?.name || 'Lincoln University College (LUC)';
    const sampleUni2 = universities[1]?.name || 'Asia Pacific University (APU)';

    const sampleRows = [
      [
        'Bachelor of Computer Science (Hons) (Cyber Security)',
        sampleUni1,
        "Bachelor's Degree",
        'Faculty of Computer Science',
        '3 Years',
        'January, May, September',
        '60000',
        '20000',
        '20000',
        '20000',
        '0',
        '3500',
        '7500',
        '11000',
        'Merit Discount Available',
        'FSc (Pre-Eng/ICS) min 50% or C grade in Math',
        'IELTS 5.5 or English medium letter',
        'Payable upon eVAL approval: RM 11,000',
      ],
      [
        'Bachelor of Science (Hons) in Artificial Intelligence',
        sampleUni2,
        "Bachelor's Degree",
        'School of Computing',
        '3 Years',
        'February, May, September',
        '98000',
        '32000',
        '33000',
        '33000',
        '0',
        '3500',
        '6500',
        '10000',
        'Dual Degree with De Montfort UK',
        'FSc with minimum 55% in Mathematics',
        'IELTS 6.0',
        'Total initial non-tuition payment is RM 10,000',
      ],
      [
        'Master of Business Administration (Global Healthcare)',
        sampleUni1,
        "Master's (Postgraduate)",
        'Faculty of Business',
        '1.5 Years',
        'January, May, October',
        '36000',
        '24000',
        '12000',
        '0',
        '0',
        '3500',
        '7500',
        '11000',
        'Executive Weekend Track',
        'Recognized 16-Year Bachelor degree with min 2.50 CGPA',
        'IELTS 6.0 or exemption letter',
        'Fast eVAL approval for postgraduate track',
      ],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...sampleRows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))].join(
        '\r\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'meezab_courses_upload_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download reference list of universities
  const downloadUniversitiesReference = () => {
    if (universities.length === 0) return;
    const headers = ['University Name', 'Short Name / Code'];
    const rows = universities.map((u) => [`"${u.name.replace(/"/g, '""')}"`, `"${u.shortName.replace(/"/g, '""')}"`]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'registered_universities_reference.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Bulk Export
  const handleExportPrograms = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (exportUniId !== 'All') params.append('universityId', exportUniId);
      if (exportDegreeLevel !== 'All') params.append('degreeLevel', exportDegreeLevel);

      const response = await fetch(`/api/programs/export?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to export programs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meezab_programs_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const parseNumberField = (row: any, keys: string[]): number | undefined => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
        const cleaned = String(row[k]).replace(/[^0-9.]/g, '');
        const n = parseFloat(cleaned);
        if (!isNaN(n)) return n;
      }
    }
    return undefined;
  };

  const processParsedRows = (rawRows: any[]) => {
    const rawCleaned = rawRows
      .map((row: any, idx: number) => {
        const y1 = parseNumberField(row, [
          'firstYearFeeMYR',
          'firstYearFee',
          '1stYearFee',
          '1st Year Fee',
          '1st year fee',
          '1st Year',
          'Year 1 Fee',
          'year1FeeMYR',
          'year1Fee',
          'year1TuitionMYR',
          'Year 1 Tuition',
          'Year 1',
        ]);
        const y2 = parseNumberField(row, [
          'secondYearFeeMYR',
          'secondYearFee',
          '2ndYearFee',
          '2nd Year Fee',
          '2nd year fee',
          '2nd Year',
          'Year 2 Fee',
          'year2FeeMYR',
          'year2Fee',
          'year2TuitionMYR',
          'Year 2 Tuition',
          'Year 2',
        ]);
        const y3 = parseNumberField(row, [
          'thirdYearFeeMYR',
          'thirdYearFee',
          '3rdYearFee',
          '3rd Year Fee',
          '3rd year fee',
          '3rd Year',
          'Year 3 Fee',
          'year3FeeMYR',
          'year3Fee',
          'year3TuitionMYR',
          'Year 3 Tuition',
          'Year 3',
        ]);
        const y4 = parseNumberField(row, [
          'fourthYearFeeMYR',
          'fourthYearFee',
          '4thYearFee',
          '4th Year Fee',
          '4th year fee',
          '4th Year',
          'Year 4 Fee',
          'year4FeeMYR',
          'year4Fee',
          'year4TuitionMYR',
          'Year 4 Tuition',
          'Year 4',
        ]);

        let tuition = parseNumberField(row, [
          'tuitionMYR',
          'Tuition',
          'tuition',
          'Total Tuition',
          'totalTuitionMYR',
          'TotalTuition',
        ]) || 0;

        // Auto-sum if tuition is 0
        if (tuition === 0 && (y1 || y2 || y3 || y4)) {
          tuition = (y1 || 0) + (y2 || 0) + (y3 || 0) + (y4 || 0);
        }

        const emgs = parseNumberField(row, ['emgsFeeMYR', 'EMGS', 'emgs', 'EMGSFee']) || 3500;
        const misc = parseNumberField(row, ['miscFeesMYR', 'AdminFee', 'misc', 'MiscFees']) || 6000;
        const initial = parseNumberField(row, ['totalInitialMYR', 'Upfront', 'initial', 'TotalInitial']) || (emgs + misc);

        const rawId = String(row.id || row.Id || row.ID || '').trim();
        const uniName = String(
          row.universityName || row.University || row.university || row.UniversityName || row.Institute || ''
        ).trim();

        const baseRow = {
          id: `row-${idx}-${Date.now()}`,
          programDbId: rawId || undefined,
          title: String(row.title || row.Title || row.Program || row.ProgramTitle || '').trim(),
          universityName: uniName,
          degreeLevel: String(row.degreeLevel || row.Degree || row.Level || "Bachelor's Degree").trim(),
          faculty: String(row.faculty || row.Faculty || row.Department || 'General').trim(),
          duration: String(row.duration || row.Duration || '3 Years').trim(),
          intakeMonths: String(row.intakeMonths || row.Intakes || row.intakes || 'January, May, September').trim(),
          tuitionMYR: tuition,
          firstYearFeeMYR: y1,
          secondYearFeeMYR: y2,
          thirdYearFeeMYR: y3,
          fourthYearFeeMYR: y4,
          emgsFeeMYR: emgs,
          miscFeesMYR: misc,
          totalInitialMYR: initial,
          scholarship: row.scholarship || row.Scholarship,
          academicReq: row.academicReq || row.Requirements || row.academicRequirement,
          englishReq: row.englishReq || row.English || row.englishRequirement,
          pakistanNotes: row.pakistanNotes || row.Notes || row.pakistanNotes,
        };

        const validation = validateRow(baseRow);
        const matched = matchUniversity(uniName);

        return {
          ...baseRow,
          universityId: matched?.id,
          status: validation.status,
          issues: validation.issues,
        };
      })
      .filter((r) => r.title.length > 0);

    setParsedData(rawCleaned);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processParsedRows(results.data);
      },
      error: (err) => {
        alert('Failed to parse CSV file: ' + err.message);
      },
    });
  };

  const handleRawTextParse = () => {
    if (!rawText.trim()) return;
    setImportResult(null);

    Papa.parse(rawText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setFileName('pasted_data.csv');
        processParsedRows(results.data);
      },
    });
  };

  // Update a single cell in the preview
  const updateRowField = (id: string, field: keyof ParsedRow, value: any) => {
    setParsedData((prev) => {
      const updated = prev.map((row) => {
        if (row.id === id) {
          const newRow = { ...row, [field]: value };
          // If university changed, update universityName and match
          if (field === 'universityId') {
            const matched = universities.find((u) => u.id === value);
            if (matched) {
              newRow.universityName = matched.name;
            }
          }
          return newRow;
        }
        return row;
      });
      return revalidateRows(updated);
    });
  };

  // Remove single row from preview
  const removeRow = (id: string) => {
    setParsedData((prev) => prev.filter((r) => r.id !== id));
  };

  // Commit data to database
  const handleCommitToDatabase = async (onlyValid: boolean = false) => {
    const rowsToUpload = onlyValid
      ? parsedData.filter((r) => r.status === 'valid' || r.status === 'warning')
      : parsedData;

    if (rowsToUpload.length === 0) {
      alert('No eligible rows to import.');
      return;
    }

    if (
      !window.confirm(
        `Import ${rowsToUpload.length} program${rowsToUpload.length === 1 ? '' : 's'} into the team database?`
      )
    ) {
      return;
    }

    setIsUploading(true);
    setImportResult(null);

    try {
      const payload = rowsToUpload.map((r) => ({
        id: r.programDbId,
        title: r.title,
        universityName: r.universityName,
        universityId: r.universityId,
        degreeLevel: r.degreeLevel,
        faculty: r.faculty,
        duration: r.duration,
        intakeMonths: r.intakeMonths,
        tuitionMYR: r.tuitionMYR,
        firstYearFeeMYR: r.firstYearFeeMYR,
        secondYearFeeMYR: r.secondYearFeeMYR,
        thirdYearFeeMYR: r.thirdYearFeeMYR,
        fourthYearFeeMYR: r.fourthYearFeeMYR,
        emgsFeeMYR: r.emgsFeeMYR,
        miscFeesMYR: r.miscFeesMYR,
        totalInitialMYR: r.totalInitialMYR,
        scholarship: r.scholarship,
        academicReq: r.academicReq,
        englishReq: r.englishReq,
        pakistanNotes: r.pakistanNotes,
      }));

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programs: payload, allowPartial: onlyValid }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: data.error || 'Failed to upload data',
          errors: data.errors || [],
        };
      }

      setImportResult({
        success: true,
        importedCount: data.importedCount,
        createdCount: data.createdCount,
        updatedCount: data.updatedCount,
        skippedCount: data.skippedCount || 0,
        errors: data.errors || [],
      });

      // Clear imported rows or keep erroneous rows
      if (onlyValid) {
        setParsedData((prev) => prev.filter((r) => r.status === 'error'));
      } else {
        setParsedData([]);
        setFileName(null);
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        importedCount: 0,
        errors: Array.isArray(err.errors) && err.errors.length > 0 ? err.errors : [err.message || 'Network error'],
      });
    } finally {
      setIsUploading(false);
    }
  };

  const validRowsCount = parsedData.filter((r) => r.status === 'valid').length;
  const warningRowsCount = parsedData.filter((r) => r.status === 'warning').length;
  const errorRowsCount = parsedData.filter((r) => r.status === 'error').length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bulk Data Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seamlessly import, validate, and export courses &amp; fee structures.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'import'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Import Data (CSV)
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'export'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Export Programs
          </button>
        </div>
      </div>

      {activeTab === 'export' ? (
        /* EXPORT PANEL */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-700" />
              <span>Export Database Records to CSV</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Export existing programs into a ready-to-edit spreadsheet. You can update fee figures or requirements in Microsoft Excel / Google Sheets and re-upload the same file anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Filter by University
              </label>
              <select
                value={exportUniId}
                onChange={(e) => setExportUniId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="All">All Universities (Complete Database)</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Filter by Degree Level
              </label>
              <select
                value={exportDegreeLevel}
                onChange={(e) => setExportDegreeLevel(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="All">All Degree Levels</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's (Postgraduate)">Master's (Postgraduate)</option>
                <option value="Foundation / Diploma">Foundation / Diploma</option>
                <option value="Ph.D & Doctorate">Ph.D & Doctorate</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExportPrograms}
              disabled={isExporting}
              className="inline-flex items-center gap-2.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preparing CSV Export...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Filtered CSV</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* IMPORT PANEL */
        <div className="space-y-6">
          {/* Action Helper Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-900 to-indigo-950 p-5 rounded-2xl text-white shadow-sm">
            <div className="space-y-1">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Smart Importer with Auto-Validation</span>
              </h2>
              <p className="text-xs text-blue-200">
                Supports fuzzy university name matching, auto-calculates totals, and lets you fix mistakes directly in the preview table.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadSampleTemplate}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 font-bold px-3.5 py-2 rounded-xl text-xs transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Download Sample CSV</span>
              </button>

              <button
                onClick={downloadUniversitiesReference}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 font-bold px-3.5 py-2 rounded-xl text-xs transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-blue-300" />
                <span>Valid Universities List</span>
              </button>
            </div>
          </div>

          {/* Upload Method Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <button
                onClick={() => setUploadMode('file')}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  uploadMode === 'file'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Upload CSV File
              </button>
              <button
                onClick={() => setUploadMode('text')}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  uploadMode === 'text'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Paste Raw Text
              </button>
            </div>

            {uploadMode === 'file' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20 flex flex-col items-center justify-center space-y-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    Click to browse or drag &amp; drop your CSV file here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports standard comma-separated spreadsheets (.csv)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste comma-separated CSV rows here (including header line)..."
                  className="w-full text-xs font-mono border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleRawTextParse}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Parse Pasted Text
                </button>
              </div>
            )}
          </div>

          {/* Feedback Result Banner */}
          {importResult && (
            <div
              className={`p-6 rounded-2xl border ${
                importResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {importResult.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 w-full">
                  <h4 className="font-bold text-base">
                    {importResult.success
                      ? `Successfully Processed ${importResult.importedCount} Courses!${
                          importResult.updatedCount !== undefined
                            ? ` (${importResult.createdCount || 0} Created, ${importResult.updatedCount || 0} Updated)`
                            : ''
                        }`
                      : 'Import Failed'}
                  </h4>
                  <p className="text-xs">
                    {importResult.success
                      ? `Database sync completed cleanly without duplicates.${
                          importResult.skippedCount
                            ? ` (${importResult.skippedCount} rows with errors were skipped and remain in the editor below).`
                            : ''
                        }`
                      : 'Review the error details below, fix the fields in the preview table, and retry.'}
                  </p>

                  {importResult.errors.length > 0 && (
                    <div className="mt-3 bg-white/90 border border-red-100 p-3.5 rounded-xl text-xs space-y-1 max-h-48 overflow-y-auto">
                      <span className="font-bold block text-red-700">Encountered Issues:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                        {importResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {importResult.success && (
                    <div className="pt-3">
                      <Link
                        href="/programs"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                      >
                        <span>Review Newly Added Programs on Website</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Pre-Import Preview & Editor */}
          {parsedData.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                    <h3 className="font-bold text-base text-slate-900">
                      Live Preview &amp; Quick Editor ({parsedData.length} Rows)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Source: <strong className="text-slate-800">{fileName}</strong> • You can edit any cell directly in the table before writing to the database.
                  </p>
                  
                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2.5 text-[11px] font-bold">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 border border-emerald-200">
                      <Check className="w-3 h-3" />
                      <span>{validRowsCount} Ready</span>
                    </span>
                    {warningRowsCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 text-amber-700 px-2.5 py-1 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{warningRowsCount} Minor Warnings</span>
                      </span>
                    )}
                    {errorRowsCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 text-red-700 px-2.5 py-1 border border-red-200">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errorRowsCount} Needs Attention</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      setParsedData([]);
                      setFileName(null);
                    }}
                    className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard</span>
                  </button>

                  {errorRowsCount > 0 && (
                    <button
                      onClick={() => handleCommitToDatabase(true)}
                      disabled={isUploading || validRowsCount + warningRowsCount === 0}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                      title="Imports all valid rows and leaves error rows in this table for you to fix."
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Import Valid Only ({validRowsCount + warningRowsCount})</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCommitToDatabase(false)}
                    disabled={isUploading || errorRowsCount > 0}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Writing to Database...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Commit All ({parsedData.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Editable Table */}
              <div className="overflow-x-auto max-h-[500px] border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] z-10 shadow-xs">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-3 w-10">Status</th>
                      <th className="py-2.5 px-3 min-w-[220px]">Program Title</th>
                      <th className="py-2.5 px-3 min-w-[200px]">University</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Level</th>
                      <th className="py-2.5 px-3 min-w-[100px]">Total Tuition</th>
                      <th className="py-2.5 px-3 min-w-[90px] text-blue-700 font-extrabold">1st Yr Fee</th>
                      <th className="py-2.5 px-3 min-w-[90px]">2nd Yr</th>
                      <th className="py-2.5 px-3 min-w-[90px]">3rd Yr</th>
                      <th className="py-2.5 px-3 min-w-[90px]">Upfront</th>
                      <th className="py-2.5 px-3 min-w-[90px]">Duration</th>
                      <th className="py-2.5 px-2 text-center w-10">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedData.map((row, idx) => {
                      const matchedUni = universities.find((u) => u.id === row.universityId);

                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            row.status === 'error'
                              ? 'bg-red-50/40'
                              : row.status === 'warning'
                              ? 'bg-amber-50/20'
                              : ''
                          }`}
                        >
                          {/* Status Indicator */}
                          <td className="py-2 px-3 text-center">
                            {row.status === 'valid' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                            ) : row.status === 'warning' ? (
                              <div className="relative group inline-block cursor-help">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                <div className="absolute left-6 top-0 hidden group-hover:block z-30 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg whitespace-nowrap">
                                  {row.issues.join(', ')}
                                </div>
                              </div>
                            ) : (
                              <div className="relative group inline-block cursor-help">
                                <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                                <div className="absolute left-6 top-0 hidden group-hover:block z-30 bg-red-900 text-white text-[10px] p-2 rounded-lg shadow-lg whitespace-nowrap">
                                  {row.issues.join(', ')}
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Editable Title */}
                          <td className="py-1.5 px-3">
                            <input
                              type="text"
                              value={row.title}
                              onChange={(e) => updateRowField(row.id, 'title', e.target.value)}
                              className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-blue-500 rounded px-1.5 py-1 font-semibold text-slate-900 focus:outline-hidden"
                            />
                          </td>

                          {/* University Selector Dropdown */}
                          <td className="py-1.5 px-3">
                            <select
                              value={row.universityId || ''}
                              onChange={(e) => updateRowField(row.id, 'universityId', e.target.value)}
                              className={`w-full text-xs rounded px-1.5 py-1 font-medium focus:outline-hidden ${
                                !row.universityId
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-blue-500 text-slate-800'
                              }`}
                            >
                              <option value="">
                                ⚠️ Select University ({row.universityName || 'Not found'})
                              </option>
                              {universities.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.name} ({u.shortName})
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Degree Level */}
                          <td className="py-1.5 px-3">
                            <select
                              value={row.degreeLevel}
                              onChange={(e) => updateRowField(row.id, 'degreeLevel', e.target.value)}
                              className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-blue-500 text-[11px] rounded px-1.5 py-1 font-bold text-blue-700 focus:outline-hidden"
                            >
                              <option value="Bachelor's Degree">Bachelor's Degree</option>
                              <option value="Master's (Postgraduate)">Master's</option>
                              <option value="Foundation / Diploma">Foundation / Diploma</option>
                              <option value="Ph.D & Doctorate">Ph.D & Doctorate</option>
                            </select>
                          </td>

                          {/* Total Tuition */}
                          <td className="py-1.5 px-3">
                            <input
                              type="number"
                              value={row.tuitionMYR || ''}
                              onChange={(e) => updateRowField(row.id, 'tuitionMYR', parseFloat(e.target.value) || 0)}
                              className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-blue-500 rounded px-1.5 py-1 font-bold text-slate-900 focus:outline-hidden"
                            />
                          </td>

                          {/* 1st Year Fee */}
                          <td className="py-1.5 px-3">
                            <input
                              type="number"
                              value={row.firstYearFeeMYR ?? ''}
                              placeholder="Auto"
                              onChange={(e) =>
                                updateRowField(
                                  row.id,
                                  'firstYearFeeMYR',
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                              className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-blue-200 focus:border-blue-500 rounded px-1.5 py-1 font-bold text-blue-700 focus:outline-hidden"
                            />
                          </td>

                          {/* 2nd Year Fee */}
                          <td className="py-1.5 px-3">
                            <input
                              type="number"
                              value={row.secondYearFeeMYR ?? ''}
                              placeholder="-"
                              onChange={(e) =>
                                updateRowField(
                                  row.id,
                                  'secondYearFeeMYR',
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                              className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-blue-500 rounded px-1.5 py-1 text-slate-700 focus:outline-hidden"
                            />
                          </td>

                          {/* 3rd Year Fee */}
                          <td className="py-1.5 px-3">
                            <input
                              type="number"
                              value={row.thirdYearFeeMYR ?? ''}
                              placeholder="-"
                              onChange={(e) =>
                                updateRowField(
                                  row.id,
                                  'thirdYearFeeMYR',
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                              className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-blue-500 rounded px-1.5 py-1 text-slate-700 focus:outline-hidden"
                            />
                          </td>

                          {/* Upfront Initial */}
                          <td className="py-1.5 px-3 font-bold text-emerald-700">
                            {formatMYR(row.totalInitialMYR)}
                          </td>

                          {/* Duration */}
                          <td className="py-1.5 px-3">
                            <input
                              type="text"
                              value={row.duration}
                              onChange={(e) => updateRowField(row.id, 'duration', e.target.value)}
                              className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-blue-500 rounded px-1.5 py-1 text-slate-600 focus:outline-hidden"
                            />
                          </td>

                          {/* Remove */}
                          <td className="py-1.5 px-2 text-center">
                            <button
                              onClick={() => removeRow(row.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="Remove row from import"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
