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

export function formatUSD(amountInMYR: number | null | undefined, rate: number = 4.45): string {
  if (amountInMYR === null || amountInMYR === undefined || isNaN(amountInMYR)) return '$0';
  const usd = Math.round(amountInMYR / rate);
  return `$${usd.toLocaleString('en-US')}`;
}

export function formatPKR(amountInMYR: number | null | undefined, rate: number = 62.5): string {
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

