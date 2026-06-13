'use client';

import { useEffect, useState } from 'react';
import { Fragrance } from './fragrances';

export type Currency = 'USD' | 'SGD' | 'EUR';

export const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: 'USD', label: 'USD', symbol: 'US$' },
  { code: 'SGD', label: 'SGD', symbol: 'S$' },
  { code: 'EUR', label: 'EUR', symbol: '€' },
];

// When the researched prices below were last reviewed. Shown in the UI so the
// figures read as indicative retail, not a live brand-website feed.
export const PRICED_AS_OF = 'June 2026';

interface PriceEntry {
  size: string; // signature bottle size for this fragrance
  usd: number;
  sgd: number;
  eur: number;
}

// ── Researched signature-size retail prices ──────────────────────────────────
// Hand-set to realistic brand/retailer pricing in each region (US / Singapore /
// Eurozone) for the fragrance's signature size. Values are indicative — real
// brand-site prices shift with promotions and region. Update the `as of` date
// above whenever these are re-reviewed. To add a fragrance, drop in its id with
// the three regional prices; anything not listed falls back to a derivation
// from the USD range in the catalog (see derivePrice).
const EXACT_PRICES: Record<string, PriceEntry> = {
  'bleu-chanel': { size: '100 ml EDP', usd: 165, sgd: 202, eur: 158 },
  'black-orchid': { size: '100 ml EDP', usd: 200, sgd: 268, eur: 178 },
  'libre-ysl': { size: '90 ml EDP', usd: 165, sgd: 207, eur: 150 },
  'sauvage-dior': { size: '100 ml EDT', usd: 120, sgd: 158, eur: 110 },
  'chance-chanel': { size: '100 ml EDT', usd: 155, sgd: 188, eur: 142 },
  'aventus-creed': { size: '100 ml', usd: 445, sgd: 590, eur: 350 },
  'oud-wood-tf': { size: '50 ml EDP', usd: 280, sgd: 365, eur: 250 },
  'flowerbomb-vf': { size: '100 ml EDP', usd: 185, sgd: 215, eur: 142 },
  'silver-mountain-creed': { size: '100 ml', usd: 370, sgd: 490, eur: 295 },
  'neroli-portofino-tf': { size: '100 ml EDP', usd: 305, sgd: 400, eur: 270 },
  'tobacco-vanille-tf': { size: '50 ml EDP', usd: 280, sgd: 365, eur: 250 },
  'good-girl-cg': { size: '80 ml EDP', usd: 132, sgd: 162, eur: 110 },
  'acqua-armani': { size: '100 ml EDT', usd: 98, sgd: 148, eur: 95 },
  'la-vie-est-belle': { size: '100 ml EDP', usd: 122, sgd: 175, eur: 102 },
  'molecule-01': { size: '100 ml EDT', usd: 135, sgd: 180, eur: 110 },
  'lost-cherry-tf': { size: '50 ml EDP', usd: 280, sgd: 365, eur: 250 },
  'santal-33-le-labo': { size: '50 ml EDP', usd: 232, sgd: 308, eur: 215 },
  'miss-dior-dior': { size: '100 ml EDP', usd: 165, sgd: 205, eur: 145 },
  'rose-oud-bdk': { size: '100 ml EDP', usd: 250, sgd: 330, eur: 185 },
  'light-blue-dolce': { size: '100 ml EDT', usd: 98, sgd: 140, eur: 92 },
  'eros-versace': { size: '100 ml EDT', usd: 98, sgd: 130, eur: 82 },
  'si-armani': { size: '100 ml EDP', usd: 132, sgd: 172, eur: 110 },
  'the-one-dolce': { size: '100 ml EDP', usd: 112, sgd: 152, eur: 95 },
  'black-phantom-kilian': { size: '50 ml EDP', usd: 295, sgd: 390, eur: 240 },
  'versace-bright-crystal': { size: '90 ml EDT', usd: 82, sgd: 120, eur: 70 },
  'baccarat-rouge-540': { size: '70 ml EDP', usd: 325, sgd: 430, eur: 250 },
  'replica-jazz-club': { size: '100 ml EDT', usd: 165, sgd: 215, eur: 145 },
  'replica-by-the-fireplace': { size: '100 ml EDT', usd: 165, sgd: 215, eur: 145 },
  'replica-lazy-sunday-morning': { size: '100 ml EDT', usd: 165, sgd: 215, eur: 145 },
  'dossier-ambery-saffron': { size: '50 ml EDP', usd: 49, sgd: 69, eur: 49 },
  'dossier-woody-sandalwood': { size: '50 ml EDP', usd: 49, sgd: 69, eur: 49 },
  'oakcha-sinful': { size: '50 ml EP', usd: 45, sgd: 62, eur: 45 },
  'oakcha-sweven': { size: '50 ml EP', usd: 45, sgd: 62, eur: 45 },
  'alt-executive': { size: '50 ml EDP', usd: 49, sgd: 68, eur: 49 },
  'alt-farouche': { size: '50 ml EDP', usd: 49, sgd: 68, eur: 49 },
  'alt-fireside-marshmallow': { size: '50 ml EDP', usd: 49, sgd: 68, eur: 49 },
};

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

// Fallback for catalog fragrances without a hand-set price: take a representative
// point in the USD range and apply region-typical retail multipliers. Clearly
// flagged as estimated (exact: false) so the UI can mark it with a "≈".
function derivePrice(fragrance: Fragrance): { entry: PriceEntry; exact: false } {
  const numbers = (fragrance.priceDisplay.match(/\d+/g) ?? ['100']).map(Number);
  const min = numbers[0];
  const max = numbers[numbers.length - 1] ?? min;
  // Signature size skews toward the upper-middle of a brand's range.
  const usd = roundTo(min + (max - min) * 0.55, 5) || min;
  return {
    entry: {
      size: fragrance.tier === 'niche' ? '50 ml' : '100 ml',
      usd,
      sgd: roundTo(usd * 1.42, 5), // SGD FX + local retail uplift
      eur: roundTo(usd * 0.95, 5), // VAT-inclusive, numerically near USD
    },
    exact: false,
  };
}

export interface SignaturePrice {
  amount: number;
  size: string;
  currency: Currency;
  exact: boolean;
}

export function getSignaturePrice(fragrance: Fragrance, currency: Currency): SignaturePrice {
  const exact = EXACT_PRICES[fragrance.id];
  const { entry, isExact } = exact
    ? { entry: exact, isExact: true }
    : { entry: derivePrice(fragrance).entry, isExact: false };

  const amount = currency === 'USD' ? entry.usd : currency === 'SGD' ? entry.sgd : entry.eur;
  return { amount, size: entry.size, currency, exact: isExact };
}

export function formatPrice(amount: number, currency: Currency): string {
  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? '$';
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

// Persisted currency preference, shared across the results/shelf views.
const STORAGE_KEY = 'sm_currency';

export function useCurrency(): [Currency, (next: Currency) => void] {
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'USD' || stored === 'SGD' || stored === 'EUR') {
      setCurrency(stored);
    }
  }, []);

  const update = (next: Currency) => {
    setCurrency(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage failures (private mode etc.) */
    }
  };

  return [currency, update];
}
