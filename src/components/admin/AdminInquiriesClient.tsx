'use client';

import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface InquiryItem {
  id: string;
  studentName: string;
  phone: string;
  email: string | null;
  city: string | null;
  qualification: string | null;
  programInterest: string | null;
  status: string;
  notes: string | null;
  createdAt: Date | string;
}

export function AdminInquiriesClient({ initialInquiries }: { initialInquiries: InquiryItem[] }) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = inquiries.filter((inq) => {
    if (filterStatus !== 'ALL' && inq.status !== filterStatus) return false;
    return true;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getWhatsAppLink = (inq: InquiryItem) => {
    // Format phone number by removing leading 0 if Pakistani and prefixing 92
    let cleanPhone = inq.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('03')) {
      cleanPhone = '92' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Hello ${inq.studentName}! This is Meezab Future Consulting (Pakistan Admissions Desk for Malaysia). We received your inquiry regarding ${inq.programInterest || 'university admissions'}. How can we assist you with your application?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Leads &amp; CRM</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time inquiries received from the public website with 1-click WhatsApp follow-up.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-hidden font-bold"
          >
            <option value="ALL">All Leads ({inquiries.length})</option>
            <option value="NEW">New Submissions</option>
            <option value="CONTACTED">Contacted</option>
            <option value="IN_REVIEW">Documents in Review</option>
            <option value="ADMITTED">Admitted / Visa Filed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student &amp; Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Current Qualification</th>
                <th className="py-3 px-4">Program Interest</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Connect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No inquiries recorded in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{inq.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{inq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {inq.city || 'Pakistan'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        {inq.qualification || 'Student'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[200px] truncate">
                      {inq.programInterest || 'General Inquiry'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-hidden ${
                          inq.status === 'NEW'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : inq.status === 'CONTACTED'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : inq.status === 'ADMITTED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="IN_REVIEW">IN REVIEW</option>
                        <option value="ADMITTED">ADMITTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={getWhatsAppLink(inq)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

