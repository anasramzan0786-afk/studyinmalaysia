'use client';

import React, { useState } from 'react';
import { X, Send, PhoneCall, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface CounselingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgramTitle?: string;
  defaultProgramId?: string;
}

export function CounselingModal({
  isOpen,
  onClose,
  defaultProgramTitle,
  defaultProgramId,
}: CounselingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [qualification, setQualification] = useState('FSc / ICS');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: name,
          phone,
          email,
          city,
          qualification,
          programInterest: defaultProgramTitle || 'General Inquiry',
          programId: defaultProgramId,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit application inquiry.');
      }

      setIsSuccess(true);

      // Auto-construct WhatsApp redirect URL for Meezab Counselor Desk
      const message = `Hello Meezab Admissions Team!%0A%0A*Student Name:* ${encodeURIComponent(
        name
      )}%0A*Phone:* ${encodeURIComponent(phone)}%0A*City:* ${encodeURIComponent(
        city
      )}%0A*Qualification:* ${encodeURIComponent(
        qualification
      )}%0A*Program Interested:* ${encodeURIComponent(
        defaultProgramTitle || 'General Admission Counseling'
      )}`;

      setTimeout(() => {
        window.open(`https://wa.me/601123456789?text=${message}`, '_blank');
      }, 1200);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a2540] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-amber-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Book Free Advisory Session</h3>
              <p className="text-xs text-blue-200">
                Direct guidance from certified Meezab education counselors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Application Received!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you, <strong className="text-slate-800">{name}</strong>. Your inquiry has been saved to our admissions system. Opening direct WhatsApp desk...
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {defaultProgramTitle && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
                  <span className="font-semibold block text-blue-700">Program Selected:</span>
                  <span className="font-bold text-sm">{defaultProgramTitle}</span>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Qualification
                  </label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Matric / O-Levels">Matric / O-Levels</option>
                    <option value="FSc (Pre-Engineering)">FSc (Pre-Engineering)</option>
                    <option value="FSc (Pre-Medical)">FSc (Pre-Medical)</option>
                    <option value="ICS / Computer Science">ICS / Computer Science</option>
                    <option value="A-Levels">A-Levels</option>
                    <option value="Bachelor Degree (14/16 Yrs)">Bachelor Degree (14/16 Yrs)</option>
                    <option value="Master / MS">Master / MS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City in Pakistan
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore, Karachi, Rawalpindi"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Any Questions or Specific University?
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ask about scholarships, visa processing, upfront fees..."
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0a2540] to-[#1e3a8a] hover:from-[#103358] hover:to-[#254cb5] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>Submit &amp; Connect via WhatsApp Desk</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-600 mt-2">
                  🔒 Your data is confidential and used solely for university admissions advisory.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

