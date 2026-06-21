'use client';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { ScoredFragrance, QuizAnswers, getRecommendations, scoreFragrance } from '@/lib/scoring';
import { Fragrance } from '@/lib/fragrances';
import FragranceCard from './FragranceCard';
import AuthModal from './AuthModal';
import ProductImage from './ProductImage';
import { useAuth } from '@/lib/auth-context';
import { useShelf } from '@/lib/shelf-context';
import { CURRENCIES, PRICED_AS_OF, useCurrency } from '@/lib/pricing';

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

const personalityProfiles = [
  {
    title: 'Fresh Out The Shower',
    test: (top: Fragrance) => top.scentFamilies.includes('clean') || top.scentFamilies.includes('fresh'),
    description: 'Clean, bright, and impossible to dislike. Your scent vibe says put together without trying too hard.',
  },
  {
    title: 'Vanilla Soft Launch',
    test: (top: Fragrance) => top.scentFamilies.includes('sweet') || top.scentFamilies.includes('gourmand'),
    description: 'Soft, warm, and a little addictive. You want comfort, but make it main character.',
  },
  {
    title: 'Rainy Library Romantic',
    test: (top: Fragrance) => top.aesthetics.includes('dark-academia') || top.vibes.includes('rainy-castle'),
    description: 'Atmospheric, intimate, and quietly dramatic. Your fragrance needs a little plot.',
  },
  {
    title: 'Expensive Hotel Lobby',
    test: (top: Fragrance) => top.aesthetics.includes('quiet-luxury') || top.vibeTags.includes('expensive'),
    description: 'Polished, smooth, and expensive-feeling. You want compliments that sound like whispered questions.',
  },
  {
    title: 'Beach Club Daydreamer',
    test: (top: Fragrance) => top.aesthetics.includes('beach') || top.scentFamilies.includes('aquatic'),
    description: 'Sunny, fresh, and easy to wear. Your internal forecast is basically vacation mode.',
  },
  {
    title: 'Cool Girl Smoky',
    test: () => true,
    description: 'A little bold, a little mysterious, and not trying to smell like everyone else.',
  },
] as const;

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

function buildSimilarMap(results: ScoredFragrance[]) {
  const map = new Map<string, ScoredFragrance>();
  for (const result of results) {
    const candidates = results
      .filter(candidate => candidate.fragrance.id !== result.fragrance.id)
      .map(candidate => {
        const sharedFamilies = candidate.fragrance.scentFamilies.filter(family => (
          result.fragrance.scentFamilies.includes(family)
        )).length;
        const sharedAccords = candidate.fragrance.accords.filter(accord => (
          result.fragrance.accords.includes(accord)
        )).length;
        const sharedOccasions = candidate.fragrance.occasions.filter(occasion => (
          result.fragrance.occasions.includes(occasion)
        )).length;
        return {
          candidate,
          similarity: (sharedFamilies * 4) + (sharedAccords * 2) + sharedOccasions,
        };
      })
      .sort((a, b) => b.similarity - a.similarity || b.candidate.score - a.candidate.score);

    if (candidates[0]) map.set(result.fragrance.id, candidates[0].candidate);
  }
  return map;
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
  const [copyLabel, setCopyLabel] = useState('Copy TikTok caption');
  const [shareLabel, setShareLabel] = useState('Share my result');

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

  const similarById = useMemo(() => buildSimilarMap(personalisedPool), [personalisedPool]);

  const topFragrance = personalisedPool[0]?.fragrance ?? results[0]?.fragrance;
  const personality = useMemo(() => {
    if (!topFragrance) return personalityProfiles.at(-1)!;
    return personalityProfiles.find(profile => profile.test(topFragrance)) ?? personalityProfiles.at(-1)!;
  }, [topFragrance]);

  const caption = `I took the ScentMatch quiz and apparently I'm a ${personality.title} 💀 My top match is ${topFragrance?.name ?? 'a mystery scent'}.`;

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy TikTok caption'), 1600);
    } catch {
      setCopyLabel('Copy failed');
      window.setTimeout(() => setCopyLabel('Copy TikTok caption'), 1600);
    }
  };

  const shareResult = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `My ScentMatch result: ${personality.title}`, text: caption });
      } else {
        await navigator.clipboard.writeText(caption);
        setShareLabel('Copied share text');
        window.setTimeout(() => setShareLabel('Share my result'), 1600);
      }
    } catch {
      setShareLabel('Share my result');
    }
  };

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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fce7f3_0,transparent_28%),radial-gradient(circle_at_top_right,#dbeafe_0,transparent_24%),#fafaf9]">
        <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            <span className="font-black tracking-tight text-stone-950">ScentMatch</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/about" className="text-sm text-stone-500 transition-colors hover:text-stone-800">
                Terms
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
          <section className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
            <article className="relative min-w-0 overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-950 p-5 text-white shadow-[0_24px_70px_rgba(28,25,23,0.18)] sm:p-8">
              <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-fuchsia-400/30 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-fuchsia-200">Screenshot this</p>
                <h1 className="mt-3 break-words text-[clamp(2rem,9.5vw,2.6rem)] font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">
                  {personality.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-stone-300 sm:text-xl">{personality.description}</p>

                {topFragrance && (
                  <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-white text-stone-950">
                    <div className="relative h-48 bg-white sm:h-60">
                      <ProductImage
                        src={topFragrance.imageUrl}
                        alt={`${topFragrance.brand} ${topFragrance.name} fragrance bottle`}
                        eager
                        sizes="(max-width: 1023px) 90vw, 420px"
                        className="object-contain p-5 sm:p-6"
                      />
                    </div>
                    <div className="border-t border-stone-100 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-600">Top match</p>
                      <h2 className="mt-1 break-words text-[clamp(1.6rem,7vw,2.1rem)] font-black leading-tight tracking-[-0.04em]">{topFragrance.name}</h2>
                      <p className="mt-1 text-lg text-stone-500">{topFragrance.brand}</p>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={shareResult}
                    className="min-h-12 rounded-2xl bg-white px-5 py-3 text-lg font-bold text-stone-950 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                  >
                    {shareLabel}
                  </button>
                  <button
                    type="button"
                    onClick={copyCaption}
                    className="min-h-12 rounded-2xl border border-white/20 px-5 py-3 text-lg font-bold text-white transition-colors hover:bg-white/10"
                  >
                    {copyLabel}
                  </button>
                </div>
              </div>
            </article>

            <section className="min-w-0 rounded-[2rem] border border-stone-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Your matches</p>
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
                Indicative retail prices at each fragrance&apos;s signature size · as of {PRICED_AS_OF}
              </p>
            </section>
          </section>

          <section className="mt-7 space-y-5">
            {personalisedPool.map((result, i) => (
              <FragranceCard
                key={`${result.fragrance.id}-${activeMood}-${adjustMode}`}
                result={result}
                rank={i + 1}
                currency={currency}
                similarFragrance={similarById.get(result.fragrance.id)?.fragrance}
              />
            ))}
          </section>

          {!isExtended && (
            <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-white/85 p-6 text-center shadow-sm sm:p-8">
              <h3 className="mb-1 text-2xl font-black tracking-[-0.03em] text-stone-950">Want an even more accurate match?</h3>
              <p className="mb-4 text-base text-stone-500">
                Answer a few extra style questions and we will fine-tune your scent era.
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
