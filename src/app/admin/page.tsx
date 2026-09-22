import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  UploadCloud, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { formatMYR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    programsCount,
    universitiesCount,
    inquiriesCount,
    programsMissingFees,
    programsMissingRequirements,
    universitiesMissingFees,
    recentLogs,
    recentInquiries,
  ] = await Promise.all([
      db.program.count(),
      db.university.count(),
      db.inquiry.count(),
      db.program.count({
        where: {
          OR: [{ firstYearFeeMYR: null }, { firstYearFeeMYR: 0 }],
        },
      }),
      db.program.count({
        where: {
          OR: [
            { academicReq: null },
            { academicReq: '' },
            { englishReq: null },
            { englishReq: '' },
          ],
        },
      }),
      db.university.count({
        where: {
          OR: [
            { emgsFeeMYR: null },
            { miscFeesMYR: null },
            { totalInitialMYR: null },
          ],
        },
      }),
      db.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      db.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Admissions Administration Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Control your live database, upload fee schedules in bulk, and manage counseling inquiries.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Active Programs
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {programsCount}
            </span>
            <Link
              href="/admin/programs"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 mt-2"
            >
              <span>Manage Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Universities
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {universitiesCount}
            </span>
            <Link
              href="/admin/universities"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 mt-2"
            >
              <span>View Campuses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Student Leads
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {inquiriesCount}
            </span>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 mt-2"
            >
              <span>Open Leads CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Data quality queue */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-base text-slate-900">Data quality checks</h2>
            <p className="text-xs text-slate-500 mt-1">
              Review incomplete records before counselors rely on them.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Needs attention
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/admin/programs" className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/40 transition-colors">
            <span className="text-2xl font-extrabold text-slate-900">{programsMissingFees}</span>
            <span className="block text-xs font-bold text-slate-700 mt-1">Programs missing 1st-year fee</span>
            <span className="text-[11px] text-blue-700 font-semibold mt-2 inline-flex items-center gap-1">Review catalog <ArrowRight className="w-3 h-3" /></span>
          </Link>
          <Link href="/admin/programs" className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/40 transition-colors">
            <span className="text-2xl font-extrabold text-slate-900">{programsMissingRequirements}</span>
            <span className="block text-xs font-bold text-slate-700 mt-1">Programs missing requirements</span>
            <span className="text-[11px] text-blue-700 font-semibold mt-2 inline-flex items-center gap-1">Review catalog <ArrowRight className="w-3 h-3" /></span>
          </Link>
          <Link href="/admin/universities" className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
            <span className="text-2xl font-extrabold text-slate-900">{universitiesMissingFees}</span>
            <span className="block text-xs font-bold text-slate-700 mt-1">Universities missing fee package</span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-2 inline-flex items-center gap-1">Review universities <ArrowRight className="w-3 h-3" /></span>
          </Link>
        </div>
      </section>

      {/* Featured Bulk Upload Banner (User's primary requirement) */}
      <div className="bg-gradient-to-r from-[#0a2540] to-[#1a3d66] text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
            <UploadCloud className="w-4 h-4" />
            <span>Fast Data Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Need to Upload Hundreds of Programs at Once?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Use our built-in Bulk Data Importer. Download our preformatted CSV spreadsheet, paste your fee structures, and upload everything directly into the live database.
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="shrink-0 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Launch Bulk Importer</span>
        </Link>
      </div>

      {/* Two columns: Recent Inquiries & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Student Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Recent Counseling Requests</h3>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              View All ({inquiriesCount})
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No student inquiries received yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{inq.studentName}</span>
                    <span className="text-slate-500">
                      {inq.phone} • {inq.city || 'Pakistan'}
                    </span>
                  </div>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    {inq.qualification || 'Student'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Database Audit Trail</h3>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No audit logs recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.title}</span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

