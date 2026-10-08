/**
 * Live Daily Currency Exchange Rate Utility (MYR to PKR & USD)
 * Powered by Open Exchange Rates API (free, reliable, daily-synced).
 * Automatically caches rates for 1 hour to prevent redundant network calls.
 */

export interface LiveRates {
  MYR_PKR: number;
  MYR_USD: number;
  USD_MYR: number;
  lastUpdated: string;
  source: 'live' | 'fallback';
}

const FALLBACK_RATES: LiveRates = {
  MYR_PKR: 67.80,
  MYR_USD: 0.245,
  USD_MYR: 4.09,
  lastUpdated: new Date().toUTCString(),
  source: 'fallback',
};

// In-memory cache for server-side runtime
let memoryCache: { rates: LiveRates; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getLiveExchangeRates(): Promise<LiveRates> {
  const now = Date.now();
  if (memoryCache && (now - memoryCache.timestamp) < CACHE_TTL_MS) {
    return memoryCache.rates;
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/MYR', {
      // Revalidate cache every hour in Next.js data cache
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5-second timeout
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.result === 'success' && data?.rates?.PKR) {
        const pkr = Number(data.rates.PKR);
        const usdRate = Number(data.rates.USD) || 0.245;
        const usdMyr = usdRate > 0 ? Number((1 / usdRate).toFixed(2)) : 4.09;

        const live: LiveRates = {
          MYR_PKR: Number(pkr.toFixed(2)),
          MYR_USD: Number(usdRate.toFixed(4)),
          USD_MYR: usdMyr,
          lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
          source: 'live',
        };

        memoryCache = { rates: live, timestamp: now };
        return live;
      }
    }
  } catch (err) {
    console.warn('[ExchangeRate] Failed to fetch live MYR rate, falling back to 67.80 PKR/MYR:', err);
  }

  return FALLBACK_RATES;
}
