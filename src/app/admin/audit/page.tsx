import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { History, ArrowLeft, CheckCircle2, AlertTriangle, Trash2, UploadCloud } from 'lucide-react';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const actionStyles: Record<string, string> = {
  CREATE: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  UPDATE: 'bg-blue-50 text-blue-800 border-blue-200',
  DELETE: 'bg-red-50 text-red-800 border-red-200',
  BATCH_IMPORT: 'bg-amber-50 text-amber-800 border-amber-200',
};

function ActionIcon({ action }: { action: string }) {
  if (action === 'DELETE') return <Trash2 className="w-3.5 h-3.5" />;
  if (action === 'BATCH_IMPORT') return <UploadCloud className="w-3.5 h-3.5" />;
  if (action === 'UPDATE') return <History className="w-3.5 h-3.5" />;
  return <CheckCircle2 className="w-3.5 h-3.5" />;
}

export default async function AdminAuditPage() {
  const session = await getAuthSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/');
  }

  const logs = await db.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
            <History className="w-3.5 h-3.5" />
            Admin activity
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">Audit Activity</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review the latest changes made to universities, programs, accounts, and imports.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to overview
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Recent changes</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Showing the latest {logs.length} records</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Admin only
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No activity has been recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <article key={log.id} className="px-5 py-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-extrabold ${actionStyles[log.action] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        <ActionIcon action={log.action} />
                        {log.action}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{log.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 break-words">{log.details || 'No additional details recorded.'}</p>
                    <p className="text-[11px] text-slate-500">
                      Target: <strong className="text-slate-700">{log.target}</strong> · By: <strong className="text-slate-700">{log.user}</strong>
                    </p>
                  </div>
                  <time className="shrink-0 text-[11px] font-semibold text-slate-400 lg:text-right" dateTime={log.createdAt.toISOString()}>
                    {log.createdAt.toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
