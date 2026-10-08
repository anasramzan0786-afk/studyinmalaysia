import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

export function formatMYR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'RM 0';
  return `RM ${Math.round(amount).toLocaleString('en-US')}`;
}

export const DEFAULT_MYR_TO_PKR_RATE = 67.80;
export const DEFAULT_USD_TO_MYR_RATE = 4.09;

export function formatUSD(amountInMYR: number | null | undefined, rate: number = DEFAULT_USD_TO_MYR_RATE): string {
  if (amountInMYR === null || amountInMYR === undefined || isNaN(amountInMYR)) return '$0';
  const usd = Math.round(amountInMYR / rate);
  return `$${usd.toLocaleString('en-US')}`;
}

export function formatPKR(amountInMYR: number | null | undefined, rate: number = DEFAULT_MYR_TO_PKR_RATE): string {
  if (amountInMYR === null || amountInMYR === undefined || isNaN(amountInMYR)) return 'Rs 0';
  const pkr = Math.round(amountInMYR * rate);
  return `Rs. ${pkr.toLocaleString('en-US')}`;
}

/**
 * Malaysian EMGS & Statutory Annual Visa Renewal Fee
 * Breakdown for Year 2, Year 3, Year 4+:
 * - Annual Student Pass Sticker: RM 140
 * - Mandatory International Student Health Insurance (AXA / AIA / Great Eastern): ~RM 850
 * - Biometric i-Kad Card Renewal: RM 100
 * - Post-arrival/Annual medical check & university immigration admin: ~RM 310
 * Standard Total: RM 1,400 / year (typically between RM 1,240 and RM 1,600)
 */
export function getYearlyVisaRenewalFee(program?: { yearlyVisaRenewalMYR?: number | null } | null): number {
  if (program?.yearlyVisaRenewalMYR && program.yearlyVisaRenewalMYR > 0) {
    return program.yearlyVisaRenewalMYR;
  }
  return 1400;
}

export interface ProgramFeeFields {
  tuitionMYR: number;
  firstYearFeeMYR?: number | null;
  totalInitialMYR?: number | null;
  duration?: string | null;
  durationYears?: number | null;
  degreeLevel?: string | null;
  semesterSchedules?: { semester: string; tuitionMYR: number }[] | null;
}

/**
 * Calculates or retrieves the authentic 1st Year tuition fee.
 * Prioritizes explicitly set `firstYearFeeMYR`, then semester schedule Year 1 sum,
 * and falls back to course tuition divided by duration years.
 */
export function getFirstYearTuition(program: ProgramFeeFields): number {
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

/**
 * Calculates total first year initial departure budget:
 * Sum of 1st year tuition fee + total initial upfront package (eVAL + Admin + Bond).
 */
export function getTotalFirstYearBudget(program: ProgramFeeFields): number {
  const firstYearTuition = getFirstYearTuition(program);
  const initialUpfront = program.totalInitialMYR || 9500;
  return firstYearTuition + initialUpfront;
}


