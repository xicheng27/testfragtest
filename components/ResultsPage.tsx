'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { ScoredFragrance, QuizAnswers, getRecommendations, scoreFragrance } from '@/lib/scoring';
import { Fragrance } from '@/lib/fragrances';
import AuthModal from './AuthModal';
import ProductImage from './ProductImage';
import { useAuth } from '@/lib/auth-context';
import { useShelf } from '@/lib/shelf-context';
import { CURRENCIES, PRICED_AS_OF, formatPrice, getSignaturePrice, useCurrency } from '@/lib/pricing';

interface ResultsPageProps {
  results: ScoredFragrance[];
  answers?: QuizAnswers;
  onRestart: () => void;
  onExtendedQuiz: () => void;
  onViewShelf: () => void;
  isExtended: boolean;
}

type MoodFilter = 'all' | 'clean' | 'sweet' | 'dark' | 'fresh' | 'expensive' | 'cozy' | 'date-night';
type AdjustMode = 'default' | 'cheaper' | 'stronger' | 'unique';

const moodFilters: Array<{ id: MoodFilter; label: string; signals: string[] }> = [
  { id: 'all', label: 'For you', signals: [] },
  { id: 'clean', label: 'Clean', signals: ['clean', 'musk', 'fresh-laundry', 'linen', 'subtle'] },
  { id: 'sweet', label: 'Sweet', signals: ['sweet', 'vanilla', 'gourmand', 'caramel', 'praline'] },
  { id: 'dark', label: 'Dark', signals: ['dark-academia', 'smoky', 'tobacco', 'oud', 'mysterious', 'night'] },
  { id: 'fresh', label: 'Fresh', signals: ['fresh', 'citrus', 'aquatic', 'green', 'summer'] },
  { id: 'expensive', label: 'Expensive', signals: ['expensive', 'quiet-luxury', 'old-money', 'elegant', 'niche'] },
  { id: 'cozy', label: 'Cozy', signals: ['comforting', 'vanilla', 'amber', 'woody', 'winter', 'soft'] },
  { id: 'date-night', label: 'Date night', signals: ['date', 'night', 'romantic', 'intimate', 'addictive'] },
];

const adjustModes: Array<{ id: AdjustMode; label: string; description: string }> = [
  { id: 'default', label: 'Best vibe', description: 'Original match order' },
  { id: 'cheaper', label: 'I want cheaper', description: 'Prioritise budget picks' },
  { id: 'stronger', label: 'Make it stronger', description: 'More projection' },
  { id: 'unique', label: 'More unique', description: 'Niche and wildcard picks' },
];

function signalsFor(fragrance: Fragrance) {
  return [
    ...fragrance.scentFamilies,
    ...fragrance.notes,
    ...fragrance.accords,
    ...fragrance.vibeTags,
    ...fragrance.occasions,
    ...fragrance.seasons,
    ...fragrance.aesthetics,
    ...fragrance.vibes,
    fragrance.projection,
    fragrance.tier,
  ].map(value => value.toLowerCase());
}

function moodMatches(fragrance: Fragrance, filter: MoodFilter) {
  const config = moodFilters.find(item => item.id === filter);
  if (!config || config.signals.length === 0) return true;
  const signals = signalsFor(fragrance);
  return config.signals.some(signal => (
    signals.some(value => value.includes(signal))
    || (signal === 'date' && fragrance.occasions.includes('date'))
  ));
}

function adjustScore(result: ScoredFragrance, mode: AdjustMode) {
  if (mode === 'cheaper') {
    const priceBonus = result.fragrance.priceRange === 'budget'
      ? 50
      : result.fragrance.priceRange === 'mid'
        ? 30
        : result.fragrance.isDupe
          ? 45
          : 0;
    return result.score + priceBonus;
  }

  if (mode === 'stronger') {
    const projectionBonus = result.fragrance.projection === 'strong'
      ? 45
      : result.fragrance.projection === 'moderate'
        ? 20
        : 0;
    return result.score + projectionBonus;
  }

  if (mode === 'unique') {
    return result.score
      + (result.fragrance.tier === 'niche' ? 45 : 0)
      + (result.fragrance.isDupe ? 10 : 0)
      + (result.fragrance.projection === 'subtle' ? 8 : 0);
  }

  return result.score;
}

function brandSlug(brand: string) {
  return brand.toLowerCase().replace(/\s+/g, '-');
}

export default function ResultsPage({
  results,
  answers = {},
  onRestart,
  onExtendedQuiz,
  onViewShelf,
  isExtended,
}: ResultsPageProps) {
  const { user, signOut } = useAuth();
  const { shelfIds } = useShelf();
  const [showSignIn, setShowSignIn] = useState(false);
  const [currency, setCurrency] = useCurrency();
  const [activeMood, setActiveMood] = useState<MoodFilter>('all');
  const [adjustMode, setAdjustMode] = useState<AdjustMode>('default');

  const personalisedPool = useMemo(() => {
    if (activeMood === 'all' && adjustMode === 'default') return results;

    const source = getRecommendations(answers, 18);
    const enhanced = source
      .map(result => ({
        ...result,
        score: scoreFragrance(result.fragrance, answers),
      }))
      .filter(result => moodMatches(result.fragrance, activeMood))
      .sort((a, b) => adjustScore(b, adjustMode) - adjustScore(a, adjustMode));

    return enhanced.length ? enhanced.slice(0, 5) : results;
  }, [activeMood, adjustMode, answers, results]);

  const resultMix = useMemo(() => {
    const tiers = new Set(personalisedPool.map(result => result.fragrance.tier));
    const hasAffordable = personalisedPool.some(result => (
      result.fragrance.priceRange === 'budget' || result.fragrance.priceRange === 'mid'
    ));
    const hasAlternative = personalisedPool.some(result => result.fragrance.isDupe);
    return [
      tiers.has('designer') ? 'designer' : null,
      tiers.has('niche') ? 'niche' : null,
      hasAffordable ? 'budget useful' : null,
      hasAlternative ? 'dupe-friendly' : null,
    ].filter((label): label is string => Boolean(label));
  }, [personalisedPool]);

  return (
    <>
      <div className="marble-bg min-h-screen">
        <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            <span className="font-black tracking-tight text-stone-950">ScentMatch</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/about" className="text-sm text-stone-500 transition-colors hover:text-stone-800">
                About
              </Link>
              <button
                onClick={onViewShelf}
                className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
              >
                Shelf{shelfIds.length > 0 ? ` (${shelfIds.length})` : ''}
              </button>
              {user ? (
                <>
                  <span className="hidden text-sm text-stone-500 sm:inline">{user.name.split(' ')[0]}</span>
                  <button onClick={signOut} className="text-xs text-stone-400 transition-colors hover:text-stone-700">Sign out</button>
                </>
              ) : (
                <button onClick={() => setShowSignIn(true)} className="text-sm text-stone-500 transition-colors hover:text-stone-800">
                  Log in
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
          <section aria-label="Your top 3 fragrance matches">
            <h2 className="mb-3 text-lg font-black tracking-[-0.02em] text-stone-950">Your top 3</h2>
            <ul className="space-y-3">
              {personalisedPool.slice(0, 3).map((result, i) => {
                const fragrance = result.fragrance;
                const price = getSignaturePrice(fragrance, currency);
                return (
                  <li key={`${fragrance.id}-${activeMood}-${adjustMode}`}>
                    <Link
                      href={`/fragrances/${brandSlug(fragrance.brand)}#result-${fragrance.id}`}
                      className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 sm:gap-4 sm:p-4"
                      aria-label={`${fragrance.name} by ${fragrance.brand}, ${result.matchPercent}% match - view fragrance`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-950 text-sm font-black text-white">
                        {i + 1}
                      </span>
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50 sm:h-20 sm:w-20">
                        <ProductImage
                          src={fragrance.imageUrl}
                          alt={`${fragrance.brand} ${fragrance.name} fragrance bottle`}
                          eager={i === 0}
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">{fragrance.brand}</p>
                        <h3 className="truncate text-base font-bold tracking-[-0.01em] text-stone-950 sm:text-lg">{fragrance.name}</h3>
                        <p className="mt-0.5 truncate text-xs text-stone-500">{result.recommendationLabel}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
                        <span className="text-lg font-black leading-none text-stone-950">{result.matchPercent}%</span>
                        <span className="text-[11px] text-stone-500">
                          {price.exact ? '' : 'approx. '}{formatPrice(price.amount, currency)}
                        </span>
                        <svg className="mt-0.5 h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-7">
            <section className="min-w-0 rounded-[2rem] border border-stone-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6a34]">Your matches</p>
                  <h2 className="mt-2 break-words text-[clamp(1.45rem,6vw,1.7rem)] font-black tracking-[-0.05em] text-stone-950">Recommendations that adapt.</h2>
                  <p className="mt-2 max-w-xl text-lg leading-relaxed text-stone-600">
                    Filter by mood or nudge the list if you want it cheaper, stronger, or less obvious.
                  </p>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Display currency"
                  className="inline-flex self-start rounded-xl border border-stone-200 bg-white p-1"
                >
                  {CURRENCIES.map(option => {
                    const active = option.code === currency;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setCurrency(option.code)}
                        className={clsx(
                          'min-h-9 rounded-lg px-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950',
                          active ? 'bg-stone-950 text-white' : 'text-stone-500 hover:text-stone-900',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-bold text-stone-500">Mood filters</p>
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {moodFilters.map(filter => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveMood(filter.id)}
                      className={clsx(
                        'min-h-11 shrink-0 rounded-full border px-4 text-base font-bold transition-all',
                        activeMood === filter.id
                          ? 'border-stone-950 bg-stone-950 text-white'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400',
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {adjustModes.map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setAdjustMode(mode.id)}
                    className={clsx(
                      'rounded-2xl border p-3 text-left transition-all active:scale-[0.99]',
                      adjustMode === mode.id
                        ? 'border-stone-950 bg-stone-950 text-white shadow-[0_14px_30px_rgba(28,25,23,0.16)]'
                        : 'border-stone-200 bg-white text-stone-800 hover:-translate-y-0.5 hover:border-stone-400',
                    )}
                  >
                    <span className="block text-base font-black">{mode.label}</span>
                    <span className={clsx('mt-1 block text-xs leading-snug', adjustMode === mode.id ? 'text-stone-300' : 'text-stone-500')}>
                      {mode.description}
                    </span>
                  </button>
                ))}
              </div>

              {resultMix.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Recommendation variety">
                  {resultMix.map(label => (
                    <span key={label} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600">
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 text-[11px] text-stone-400">
                Indicative retail prices at each fragrance&apos;s signature size - as of {PRICED_AS_OF}
              </p>
            </section>
          </section>

          {!isExtended && (
            <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-white/85 p-6 text-center shadow-sm sm:p-8">
              <h3 className="mb-1 text-xl font-black tracking-[-0.03em] text-stone-950">Want an even more accurate match?</h3>
              <p className="mb-4 text-sm text-stone-500">
                Answer a few extra style questions and we will fine-tune your fragrance recommendations.
              </p>
              <button
                onClick={onExtendedQuiz}
                className="min-h-12 rounded-2xl bg-stone-950 px-6 py-2.5 text-base font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                Take the extended quiz
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onRestart}
              className="min-h-11 rounded-full border border-stone-300 bg-white px-5 text-base font-bold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              Retake quiz
            </button>
            <button
              onClick={onViewShelf}
              className="min-h-11 rounded-full px-5 text-base font-bold text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-950"
            >
              Open my Shelf
            </button>
          </div>
        </main>
      </div>

      {showSignIn && <AuthModal onClose={() => setShowSignIn(false)} initialMode="login" />}
    </>
  );
}
