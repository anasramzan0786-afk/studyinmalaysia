'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Sparkles,
  Building2,
  FileText,
  BadgeCheck,
  HelpCircle,
  Clock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { formatMYR, formatPKR, formatUSD } from '@/lib/utils';
import { useCounseling } from '@/components/CounselingContext';
import { UNIVERSITIES_DATA } from '@/data/universitiesData';

export default function CalculatorPage() {
  const { openModal } = useCounseling();

  // Mode: 'by-university' | 'statutory'
  const [calcMode, setCalcMode] = useState<'by-university' | 'statutory'>('by-university');

  // University Selection (Mode 1)
  const [selectedUniId, setSelectedUniId] = useState<string>(UNIVERSITIES_DATA[0]?.id || 'lincoln');
  const selectedUni = UNIVERSITIES_DATA.find((u) => u.id === selectedUniId) || UNIVERSITIES_DATA[0];

  // Generic Settings (Mode 2)
  const [instType, setInstType] = useState<'private' | 'public'>('private');
  const [durationYears, setDurationYears] = useState<number>(3);
  const [insuranceTier, setInsuranceTier] = useState<'standard' | 'premium'>('standard');
  const [dependents, setDependents] = useState<number>(0);
  const [expedited, setExpedited] = useState<boolean>(false);
  const [studentName, setStudentName] = useState('');

  // Itemized fee calculations for Generic Mode
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

  const genericTotalMYR =
    emgsFee +
    valFee +
    totalInsurance +
    medicalFee +
    ikadFee +
    mevFee +
    personalBond +
    dependentFee +
    expeditedFee;

  // Active total based on mode
  const activeTotalMYR = calcMode === 'by-university' ? (selectedUni?.totalInitialMYR || 11000) : genericTotalMYR;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-2">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="print:hidden space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3A60A1] bg-[#3A60A1]/10 px-3.5 py-1 rounded-full border border-[#3A60A1]/20">
            <ShieldCheck className="w-4 h-4 text-[#E8A300]" />
            <span>Official EMGS &amp; University Initial Fee Calculator • 2026/2027 Intakes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2553] tracking-tight font-heading">
            EMGS &amp; Initial University Cost Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Every Malaysian university charges a verified initial package upon eVAL approval for Pakistani students (including EMGS processing, international registration, and statutory refundable personal bond). Calculate your exact upfront invoice below.
          </p>
        </div>

        {/* Calculation Mode Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-md print:hidden">
          <button
            type="button"
            onClick={() => setCalcMode('by-university')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              calcMode === 'by-university'
                ? 'bg-white text-[#0B2553] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#E8A300]" />
            <span>By University Package</span>
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('statutory')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              calcMode === 'statutory'
                ? 'bg-white text-[#0B2553] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#3A60A1]" />
            <span>Custom Statutory</span>
          </button>
        </div>

        {/* Print Header (Only visible on print) */}
        <div className="hidden print:block border-b border-slate-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Meezab Future Consulting Pvt Ltd</h2>
              <p className="text-xs text-slate-500">Official EMGS &amp; University Initial Cost Estimate for Pakistani Students</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Student: {studentName || 'Prospective Applicant'}</p>
              <p>Target University: {calcMode === 'by-university' ? selectedUni.name : 'Custom Statutory'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls (4 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-[#0B2553] flex items-center gap-2 font-heading">
                  {calcMode === 'by-university' ? (
                    <>
                      <Building2 className="w-4 h-4 text-[#E8A300]" />
                      <span>Select Target University</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 text-[#3A60A1]" />
                      <span>Immigration Parameters</span>
                    </>
                  )}
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  100% Authentic
                </span>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Applicant Name (Optional for Quotation)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#3A60A1] bg-slate-50/50"
                />
              </div>

              {/* Mode 1: University Dropdown & Fast Switcher */}
              {calcMode === 'by-university' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Choose Malaysian University
                    </label>
                    <select
                      value={selectedUniId}
                      onChange={(e) => setSelectedUniId(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#3A60A1] cursor-pointer"
                    >
                      {UNIVERSITIES_DATA.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.shortName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* University Quick Details Card */}
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shrink-0">
                        {selectedUni.logo ? (
                          <img src={selectedUni.logo} alt={selectedUni.shortName} className="max-h-full object-contain" />
                        ) : (
                          <Building2 className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs text-[#0B2553] truncate">{selectedUni.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{selectedUni.location}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Institution Type:</span>
                      <span className="font-bold text-[#0B2553]">{selectedUni.type}</span>
                    </div>

                    {selectedUni.qsRank && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Ranking / Rating:</span>
                        <span className="font-bold text-[#B57F00]">{selectedUni.qsRank}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 2: Generic Statutory Controls */}
              {calcMode === 'statutory' && (
                <div className="space-y-4">
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
                            ? 'bg-[#0B2553] text-white border-[#0B2553]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Private Campus
                      </button>
                      <button
                        type="button"
                        onClick={() => setInstType('public')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          instType === 'public'
                            ? 'bg-[#0B2553] text-white border-[#0B2553]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Public Research (UTM/UM)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Program Duration: <span className="text-[#3A60A1] font-extrabold">{durationYears} Years</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={durationYears}
                      onChange={(e) => setDurationYears(Number(e.target.value))}
                      className="w-full accent-[#3A60A1]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>1 Yr (Master)</span>
                      <span>3 Yrs (Bachelor)</span>
                      <span>5 Yrs (MBBS)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Health Insurance Tier
                    </label>
                    <select
                      value={insuranceTier}
                      onChange={(e) => setInsuranceTier(e.target.value as any)}
                      className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2"
                    >
                      <option value="standard">Standard Student Care (RM 800/yr)</option>
                      <option value="premium">Comprehensive Plus (RM 1,200/yr)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Accompanying Dependents (Postgraduate Only)
                    </label>
                    <select
                      value={dependents}
                      onChange={(e) => setDependents(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2"
                    >
                      <option value={0}>No Dependents (Single Student)</option>
                      <option value={1}>1 Dependent (Spouse / Child)</option>
                      <option value={2}>2 Dependents</option>
                      <option value={3}>3 Dependents</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Fast-Track Green Lane</span>
                      <span className="text-[10px] text-slate-400">7 to 10 working days (+RM 500)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={expedited}
                      onChange={(e) => setExpedited(e.target.checked)}
                      className="w-4 h-4 rounded text-[#3A60A1]"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => openModal(calcMode === 'by-university' ? `${selectedUni.name} Admissions` : 'EMGS Assistance')}
                  className="w-full btn-meezab-gold py-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-white" />
                  <span>Apply for Offer Letter (Zero Markup)</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print / Save PDF Quotation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Authentic Invoice Breakdown (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3A60A1] bg-[#3A60A1]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {calcMode === 'by-university' ? `${selectedUni.shortName} Official Invoice` : 'Statutory Projection'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B2553] font-heading">
                    Initial Payment Payable upon eVAL
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block font-medium">Total Payable (eVAL Approval)</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#0B2553] font-heading">
                    {formatMYR(activeTotalMYR)}
                  </span>
                </div>
              </div>

              {/* Currency Conversions Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Malaysian Ringgit:</span>
                  <span className="font-extrabold text-[#0B2553] text-sm sm:text-base">{formatMYR(activeTotalMYR)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Approx. in PKR (Direct):</span>
                  <span className="font-extrabold text-[#B57F00] text-sm sm:text-base">{formatPKR(activeTotalMYR)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Approx. in USD:</span>
                  <span className="font-bold text-slate-700 text-sm sm:text-base">{formatUSD(activeTotalMYR)}</span>
                </div>
              </div>

              {/* MODE 1: University-Specific Verified Schedule */}
              {calcMode === 'by-university' && (
                <div className="space-y-4">
                  {/* Official Registrar Verification Note Banner */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                    <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                      <BadgeCheck className="w-4 h-4 text-[#E8A300]" />
                      <span>Official 2026/2027 Registrar Schedule Formula:</span>
                    </span>
                    <p className="font-mono text-[11px] font-semibold text-amber-900/90 pt-0.5">
                      {selectedUni.initialBreakdownNotes || `${selectedUni.name} Total Initial: RM ${selectedUni.totalInitialMYR}`}
                    </p>
                  </div>

                  {/* University Itemized Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5">Component Description</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5">Refundable Status</th>
                          <th className="py-2.5 text-right">Amount (MYR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 font-semibold text-slate-800">
                            EMGS &amp; Immigration Visa Processing (Stage 1 &amp; 2)
                          </td>
                          <td className="py-3 text-slate-500">Statutory / Gov</td>
                          <td className="py-3 text-slate-500">Non-refundable</td>
                          <td className="py-3 text-right font-bold text-slate-900">
                            {formatMYR(selectedUni.emgsFeeMYR || 3500)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-slate-800">
                            University International Registration &amp; Administration
                          </td>
                          <td className="py-3 text-slate-500">Institution Admin</td>
                          <td className="py-3 text-slate-500">Non-refundable</td>
                          <td className="py-3 text-right font-bold text-slate-900">
                            {formatMYR((selectedUni.miscFeesMYR || 7500) - (selectedUni.registrationDeposit || 1500))}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-slate-800">
                            Personal Security Bond &amp; Caution Deposit (Pakistan Passport)
                          </td>
                          <td className="py-3 text-slate-500">Security Deposit</td>
                          <td className="py-3 text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            100% Refundable
                          </td>
                          <td className="py-3 text-right font-bold text-slate-900">
                            {formatMYR(selectedUni.registrationDeposit || 1500)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-900 font-extrabold text-sm">
                          <td colSpan={3} className="py-4 text-slate-900 font-heading">
                            Total Initial Package Payable to {selectedUni.shortName}
                          </td>
                          <td className="py-4 text-right text-emerald-700 text-base font-heading">
                            {formatMYR(selectedUni.totalInitialMYR || 11000)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Transparency Explainer */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-950 space-y-1.5">
                    <span className="font-extrabold flex items-center gap-1.5 text-[#0B2553]">
                      <ShieldCheck className="w-4 h-4 text-[#3A60A1]" />
                      <span>Direct Payment Guarantee:</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      This initial package is billed directly on the official university invoice after your EMGS eVAL approval. Students pay directly into the official university bank account via Telegraphic Transfer (Flywire / Convera). Meezab Future Consulting charges <strong>RM 0 markup</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* MODE 2: Generic Immigration Breakdown Table */}
              {calcMode === 'statutory' && (
                <div className="space-y-4">
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
                          <td className="py-3 text-slate-500">Stage 1 Initial</td>
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
                          <td className="py-3 text-slate-500">AXA / Great Eastern Panel</td>
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
                          <td className="py-3 font-semibold text-slate-800">Statutory Personal Security Bond (Pakistan)</td>
                          <td className="py-3 text-slate-500">Immigration Dept</td>
                          <td className="py-3 text-emerald-600 font-bold">100% Refundable</td>
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
                          <td colSpan={3} className="py-4 text-slate-900 font-heading">
                            Total Statutory Government Charges
                          </td>
                          <td className="py-4 text-right text-emerald-700 text-base font-heading">
                            {formatMYR(genericTotalMYR)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>Statutory EMGS Notice:</span>
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Statutory fees cover government visa processing and mandatory health insurance. For the complete initial invoice (including university registration and security deposit), please switch to the <strong>&quot;By University Package&quot;</strong> tab above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
