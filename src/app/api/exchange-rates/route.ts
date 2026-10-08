import { NextResponse } from 'next/server';
import { getLiveExchangeRates } from '@/lib/exchangeRate';

export const revalidate = 3600; // 1-hour cache

export async function GET() {
  try {
    const rates = await getLiveExchangeRates();
    return NextResponse.json(rates, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        MYR_PKR: 67.80,
        MYR_USD: 0.245,
        USD_MYR: 4.09,
        lastUpdated: new Date().toUTCString(),
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}
