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

