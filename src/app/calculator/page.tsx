'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Sparkles,
  FileText
} from 'lucide-react';
import { formatMYR, formatPKR, formatUSD } from '@/lib/utils';
import { useCounseling } from '@/components/CounselingContext';

export default function CalculatorPage() {
  const { openModal } = useCounseling();

  // Settings
  const [instType, setInstType] = useState<'private' | 'public'>('private');
  const [durationYears, setDurationYears] = useState<number>(3);
  const [insuranceTier, setInsuranceTier] = useState<'standard' | 'premium'>('standard');
  const [dependents, setDependents] = useState<number>(0);
  const [expedited, setExpedited] = useState<boolean>(false);
  const [studentName, setStudentName] = useState('');

  // Itemized fee calculations
  const emgsFee = instType === 'public' ? 1200 : 1800;
  const valFee = 300;
  const annualInsurance = insuranceTier === 'standard' ? 800 : 1200;
  const totalInsurance = annualInsurance * durationYears;
  const medicalFee = 350 + 200 * (durationYears - 1);
  const ikadFee = 100 * durationYears;
  const mevFee = 120;
  const personalBond = 1000; // Pakistan passport statutory security bond
  const dependentFee = dependents * 650 * durationYears;
  const expeditedFee = expedited ? 500 : 0;

  const totalMYR =
    emgsFee +
    valFee +
    totalInsurance +
    medicalFee +
    ikadFee +
    mevFee +
    personalBond +
    dependentFee +
    expeditedFee;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-2">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="print:hidden">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3A60A1] bg-[#3A60A1]/10 px-3.5 py-1 rounded-full mb-2 border border-[#3A60A1]/20">
            <ShieldCheck className="w-4 h-4 text-[#E8A300]" />
            <span>Meezab Future Consulting • Official EMGS Fee Calculator 2026/2027</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2553] tracking-tight">
            EMGS &amp; Student Visa Cost Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Calculate statutory immigration fees, annual medical insurance, post-arrival health screenings, and personal bond for Pakistani students traveling to Malaysia.
          </p>
        </div>

        {/* Print Header (Only visible on print) */}
        <div className="hidden print:block border-b border-slate-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Meezab Future Education Advisory</h2>
              <p className="text-xs text-slate-500">Official EMGS &amp; Visa Cost Estimate for Pakistani Students</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Student: {studentName || 'Prospective Applicant'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-700" />
                <span>Visa Parameters</span>
              </h3>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Name (Optional, for Invoice)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Usman Tariq"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Institution Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institution Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInstType('private')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      instType === 'private'
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Private University
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstType('public')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      instType === 'public'
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Public Research
                  </button>
                </div>
              </div>

              {/* Degree Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Program Duration: <span className="text-blue-700 font-extrabold">{durationYears} Years</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={durationYears}
                  onChange={(e) => setDurationYears(Number(e.target.value))}
                  className="w-full accent-blue-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 Yr (Master)</span>
                  <span>3 Yrs (Degree)</span>
                  <span>5 Yrs (MBBS)</span>
                </div>
              </div>

              {/* Insurance Tier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Health Insurance Coverage
                </label>
                <select
                  value={insuranceTier}
                  onChange={(e) => setInsuranceTier(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard Student Care (RM 800/yr)</option>
                  <option value="premium">Comprehensive Plus (RM 1,200/yr)</option>
                </select>
              </div>

              {/* Dependents */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Accompanying Dependents (Postgraduate Only)
                </label>
                <select
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>No Dependents (Single Student)</option>
                  <option value={1}>1 Dependent (Spouse / Child)</option>
                  <option value={2}>2 Dependents</option>
                  <option value={3}>3 Dependents</option>
                </select>
              </div>

              {/* Expedited Processing */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Fast-Track eVAL</span>
                  <span className="text-[10px] text-slate-400">7 to 10 working days (+RM 500)</span>
                </div>
                <input
                  type="checkbox"
                  checked={expedited}
                  onChange={(e) => setExpedited(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-3 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Quotation</span>
              </button>
              <button
                onClick={() => openModal('Visa & EMGS Assistance')}
                className="flex-1 flex items-center justify-center gap-2 btn-meezab-gold py-3 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Apply with Desk</span>
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Itemized Invoice Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Statutory Estimation
                  </span>
                  <h2 className="text-xl font-extrabold text-[#0B2553]">
                    Official Proforma Cost Breakdown
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Statutory Charges</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#0B2553]">
                    {formatMYR(totalMYR)}
                  </span>
                </div>
              </div>

              {/* Currency Conversions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F9F9F9] p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Malaysian Ringgit:</span>
                  <span className="font-bold text-[#0B2553] text-sm">{formatMYR(totalMYR)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Approx. in PKR:</span>
                  <span className="font-extrabold text-[#B57F00] text-sm">{formatPKR(totalMYR)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Approx. in USD:</span>
                  <span className="font-bold text-slate-700 text-sm">{formatUSD(totalMYR)}</span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5">Statutory Fee Component</th>
                      <th className="py-2.5">Authority / Provider</th>
                      <th className="py-2.5">Schedule</th>
                      <th className="py-2.5 text-right">Amount (MYR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">EMGS Application &amp; Processing</td>
                      <td className="py-3 text-slate-500">Education Malaysia (EMGS)</td>
                      <td className="py-3 text-slate-500">Initial</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatMYR(emgsFee)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Visa Approval Letter (eVAL)</td>
                      <td className="py-3 text-slate-500">Malaysian Immigration (JIM)</td>
                      <td className="py-3 text-slate-500">Initial</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatMYR(valFee)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">
                        Student Health Insurance ({durationYears} Year{durationYears > 1 ? 's' : ''})
                      </td>
                      <td className="py-3 text-slate-500">AXA / AIA Panel</td>
                      <td className="py-3 text-slate-500">Annual</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatMYR(totalInsurance)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Post-Arrival Clinic Medical Screening</td>
                      <td className="py-3 text-slate-500">Registered EMGS Clinic</td>
                      <td className="py-3 text-slate-500">Within 7 days of arrival</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatMYR(medicalFee)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">i-Kad Biometric Smart Student Card</td>
                      <td className="py-3 text-slate-500">Immigration Dept</td>
                      <td className="py-3 text-slate-500">Annual</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatMYR(ikadFee)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Student Pass Sticker &amp; MEV</td>
                      <td className="py-3 text-slate-500">Immigration Dept</td>
                      <td className="py-3 text-slate-500">Endorsement</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatMYR(mevFee)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Statutory Personal Security Bond</td>
                      <td className="py-3 text-slate-500">Pakistan Embassy / Immigration</td>
                      <td className="py-3 text-slate-500">Refundable</td>
                      <td className="py-3 text-right font-bold text-slate-900">{formatMYR(personalBond)}</td>
                    </tr>
                    {dependents > 0 && (
                      <tr>
                        <td className="py-3 font-semibold text-slate-800">
                          Dependent Pass Processing ({dependents} Person{dependents > 1 ? 's' : ''})
                        </td>
                        <td className="py-3 text-slate-500">Immigration Dept</td>
                        <td className="py-3 text-slate-500">Annual</td>
                        <td className="py-3 text-right font-bold text-slate-900">{formatMYR(dependentFee)}</td>
                      </tr>
                    )}
                    {expedited && (
                      <tr>
                        <td className="py-3 font-semibold text-slate-800">Expedited Priority eVAL Fast-Track</td>
                        <td className="py-3 text-slate-500">EMGS Green Lane</td>
                        <td className="py-3 text-slate-500">One-time</td>
                        <td className="py-3 text-right font-bold text-slate-900">{formatMYR(expeditedFee)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 text-sm font-extrabold">
                      <td colSpan={3} className="py-4 text-slate-900">
                        Total Payable to EMGS &amp; Immigration
                      </td>
                      <td className="py-4 text-right text-emerald-700 text-base">
                        {formatMYR(totalMYR)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>Important Note for Pakistani Passport Holders:</span>
                </span>
                <p>
                  EMGS fees are paid in two statutory stages: Stage 1 (VAL fee) directly at application submission, and Stage 2 (Pass endorsement and medical) upon reaching Malaysia. Meezab charges RM 0 service fee for this process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

