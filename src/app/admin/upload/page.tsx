'use client';

import React, { useState, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { formatMYR } from '@/lib/utils';

interface ParsedRow {
  title: string;
  universityName: string;
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
}

export default function BulkUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    count: number;
    errors: string[];
  } | null>(null);
  const [rawText, setRawText] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');

  const duplicateTitles = parsedData.filter((row, index, rows) =>
    rows.findIndex((candidate) => candidate.title.toLowerCase() === row.title.toLowerCase()) !== index
  );
  const rowsMissingUniversity = parsedData.filter((row) => !row.universityName);
  const rowsWithFeeMismatch = parsedData.filter((row) => {
    const yearlyTotal = (row.firstYearFeeMYR || 0) + (row.secondYearFeeMYR || 0) + (row.thirdYearFeeMYR || 0) + (row.fourthYearFeeMYR || 0);
    return yearlyTotal > 0 && row.tuitionMYR > 0 && Math.abs(yearlyTotal - row.tuitionMYR) > 1;
  });
  const previewHasBlockingIssues =
    duplicateTitles.length > 0 || rowsMissingUniversity.length > 0 || rowsWithFeeMismatch.length > 0;

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

    const sampleRows = [
      [
        'Bachelor of Computer Science (Hons) (Cyber Security)',
        'Lincoln University College (LUC)',
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
        'Asia Pacific University (APU)',
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
        'Lincoln University College (LUC)',
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
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...sampleRows.map((e) => e.map((val) => `"${val}"`).join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'meezab_courses_upload_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV File Upload via PapaParse
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

  // Handle Raw Text Paste
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
    const cleaned: ParsedRow[] = rawRows
      .map((row: any) => {
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

        // If overall tuition is not specified or 0, calculate sum of yearly fees
        if (tuition === 0 && (y1 || y2 || y3 || y4)) {
          tuition = (y1 || 0) + (y2 || 0) + (y3 || 0) + (y4 || 0);
        }

        const emgs = parseNumberField(row, ['emgsFeeMYR', 'EMGS', 'emgs', 'EMGSFee']) || 3500;
        const misc = parseNumberField(row, ['miscFeesMYR', 'AdminFee', 'misc', 'MiscFees']) || 6000;
        const initial = parseNumberField(row, ['totalInitialMYR', 'Upfront', 'initial', 'TotalInitial']) || (emgs + misc);

        return {
          title: String(row.title || row.Title || '').trim(),
          universityName: String(row.universityName || row.University || row.university || '').trim(),
          degreeLevel: String(row.degreeLevel || row.Degree || "Bachelor's Degree").trim(),
          faculty: String(row.faculty || row.Faculty || 'General').trim(),
          duration: String(row.duration || row.Duration || '3 Years').trim(),
          intakeMonths: String(row.intakeMonths || row.Intakes || 'January, May, September').trim(),
          tuitionMYR: tuition,
          firstYearFeeMYR: y1,
          secondYearFeeMYR: y2,
          thirdYearFeeMYR: y3,
          fourthYearFeeMYR: y4,
          emgsFeeMYR: emgs,
          miscFeesMYR: misc,
          totalInitialMYR: initial,
          scholarship: row.scholarship || row.Scholarship,
          academicReq: row.academicReq || row.Requirements,
          englishReq: row.englishReq || row.English,
          pakistanNotes: row.pakistanNotes || row.Notes,
        };
      })
      .filter((r) => r.title.length > 0);

    setParsedData(cleaned);
  };

  // Commit parsed data into the live database via /api/upload
  const handleCommitToDatabase = async () => {
    if (parsedData.length === 0) return;
    if (
      !window.confirm(
        `Import ${parsedData.length} validated program${parsedData.length === 1 ? '' : 's'} into the team database?`
      )
    ) {
      return;
    }

    setIsUploading(true);
    setImportResult(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programs: parsedData }),
      });

      const data = await res.json();

      if (!res.ok) {
        const uploadError = new Error(data.error || 'Failed to upload data') as Error & {
          errors?: string[];
        };
        uploadError.errors = data.errors;
        throw uploadError;
      }

      setImportResult({
        success: true,
        count: data.importedCount,
        errors: data.errors || [],
      });
      setParsedData([]);
      setFileName(null);
    } catch (err: any) {
      setImportResult({
        success: false,
        count: 0,
        errors: Array.isArray(err.errors)
          ? err.errors
          : [err.message || 'Unknown network error'],
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Download Template */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bulk Data Importer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload and batch-insert fee structures and degree programs directly into the database.
          </p>
        </div>

        <button
          onClick={downloadSampleTemplate}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-blue-700" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Notice about 1st/2nd/3rd year fee columns */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm text-blue-950">
            Updated CSV Template with Exact Yearly Fees
          </span>
          <p className="mt-0.5 text-blue-800 leading-relaxed">
            The template now includes dedicated columns for <strong>firstYearFeeMYR</strong>, <strong>secondYearFeeMYR</strong>, <strong>thirdYearFeeMYR</strong>, and <strong>fourthYearFeeMYR</strong>.
            Providing these columns ensures the authentic 1st Year Tuition displays on the website without automated estimation.
          </p>
        </div>
      </div>

      {/* Upload Methods Selector */}
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
            Paste CSV Raw Text
          </button>
        </div>

        {uploadMode === 'file' ? (
          /* File Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20 flex flex-col items-center justify-center space-y-3"
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
          /* Raw Text Area */
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

      {/* Success / Error Feedback Banner */}
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
            <div className="space-y-1">
              <h4 className="font-bold text-base">
                {importResult.success
                  ? `Successfully Imported ${importResult.count} Courses to Database!`
                  : 'Import Failed'}
              </h4>
              <p className="text-xs">
                {importResult.success
                  ? 'The validated records were written to the team database.'
                  : 'Please check your CSV format and make sure required columns are included.'}
              </p>

              {importResult.errors.length > 0 && (
                <div className="mt-3 bg-white/80 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold block text-red-700">Errors encountered:</span>
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
                    <span>Review Newly Added Programs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pre-Import Data Validation Table */}
      {parsedData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="font-bold text-base text-slate-900">
                  Ready to Import: {parsedData.length} Programs
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Source: <strong className="text-slate-800">{fileName}</strong> • Review the rows below before committing to the database.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-bold">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
                  {parsedData.length} rows detected
                </span>
                {duplicateTitles.length > 0 && (
                  <span className="rounded-lg bg-red-50 px-2.5 py-1 text-red-700">
                    Duplicate titles found
                  </span>
                )}
                {rowsMissingUniversity.length > 0 && (
                  <span className="rounded-lg bg-red-50 px-2.5 py-1 text-red-700">
                    University missing in {rowsMissingUniversity.length} row{rowsMissingUniversity.length === 1 ? '' : 's'}
                  </span>
                )}
                {rowsWithFeeMismatch.length > 0 && (
                  <span className="rounded-lg bg-red-50 px-2.5 py-1 text-red-700">
                    Yearly fees do not match tuition in {rowsWithFeeMismatch.length} row{rowsWithFeeMismatch.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
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

              <button
                onClick={handleCommitToDatabase}
                disabled={isUploading || previewHasBlockingIssues}
                title={previewHasBlockingIssues ? 'Resolve the validation issues before importing.' : undefined}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing to Database...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Commit {parsedData.length} Courses to Live DB</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr className="border-b border-slate-200">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Program Title</th>
                  <th className="py-2.5 px-3">University</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Total Tuition</th>
                  <th className="py-2.5 px-3 text-blue-700 font-extrabold">1st Year Fee</th>
                  <th className="py-2.5 px-3">2nd Year Fee</th>
                  <th className="py-2.5 px-3">3rd Year Fee</th>
                  <th className="py-2.5 px-3">4th Year Fee</th>
                  <th className="py-2.5 px-3">Upfront (MYR)</th>
                  <th className="py-2.5 px-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.title}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row.universityName}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {row.degreeLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {formatMYR(row.tuitionMYR)}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-blue-700 bg-blue-50/40">
                      {row.firstYearFeeMYR ? formatMYR(row.firstYearFeeMYR) : 'Auto'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {row.secondYearFeeMYR ? formatMYR(row.secondYearFeeMYR) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {row.thirdYearFeeMYR ? formatMYR(row.thirdYearFeeMYR) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {row.fourthYearFeeMYR ? formatMYR(row.fourthYearFeeMYR) : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">
                      {formatMYR(row.totalInitialMYR)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

