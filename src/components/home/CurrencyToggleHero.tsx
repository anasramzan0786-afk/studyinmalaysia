'use client';

import React, { useState } from 'react';

export function CurrencyToggleHero() {
  const [currency, setCurrency] = useState<'MYR' | 'PKR' | 'USD'>('MYR');

  return (
    <div className="inline-flex items-center bg-white/10 p-1 rounded-xl border border-white/15 text-xs font-semibold">
      <button
        onClick={() => setCurrency('MYR')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          currency === 'MYR' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        🇲🇾 MYR
      </button>
      <button
        onClick={() => setCurrency('PKR')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          currency === 'PKR' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        🇵🇰 PKR
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          currency === 'USD' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        💵 USD
      </button>
    </div>
  );
}

