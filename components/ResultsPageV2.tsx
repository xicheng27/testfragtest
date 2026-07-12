'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/auth-context';
import { useShelf } from '@/lib/shelf-context';
import { CURRENCIES, Currency, PRICED_AS_OF, formatPrice, getSignaturePrice, useCurrency } from '@/lib/pricing';
import { Fragrance } from '@/lib/fragrances';
import { QuizAnswers, ScoredFragrance, buildScentProfile, getRecommendations } from '@/lib/scoring';
import { trackEvent } from '@/lib/analytics';

interface ResultsPageV2Props {
  results: ScoredFragrance[];
  answers?: QuizAnswers;
  onRestart: () => void;
  onExtendedQuiz: () => void;
  onViewShelf: () => void;
  isExtended: boolean;
}

const fallbackImage = '/images/products/fallback.svg';
const scentStatLabels = ['Fresh', 'Sweet', 'Woody', 'Smoky', 'Mature', 'Playful', 'Elegant', 'Bold'] as const;

type ScentStatLabel = typeof scentStatLabels[number];

interface ScentProfileStats {
  archetype: string;
  archetypeDescription: string;
  summary: string;
  stats: Array<{ label: ScentStatLabel; value: number }>;
  strongestTraits: ScentStatLabel[];
  avoidTraits: string[];
  bestOccasions: string[];
  recommendedFamilies: string[];
  insightCards: Array<{ title: string; value: string; description: string }>;
}

function valuesFor(answers: QuizAnswers, id: string) {
  const value = answers[id];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function pretty(value: string) {
  return value.replaceAll('-', ' ');
}

function join(values: string[], fallback: string) {
  return values.length ? values.map(pretty).join(' / ') : fallback;
}

function brandSlug(brand: string) {
  return brand.toLowerCase().replace(/\s+/g, '-');
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function collectSignals(fragrance: Fragrance) {
  return [
    ...fragrance.scentFamilies,
    ...fragrance.notes,
    ...fragrance.accords,
    ...fragrance.vibeTags,
    ...fragrance.occasions,
    ...fragrance.seasons,
    ...fragrance.moods,
    ...fragrance.aesthetics,
    ...fragrance.vibes,
    fragrance.projection,
    fragrance.tier,
    fragrance.priceRange,
  ].map(value => value.toLowerCase());
}

function addScores(
  scores: Record<ScentStatLabel, number>,
  boosts: Partial<Record<ScentStatLabel, number>>,
) {
  for (const [label, boost] of Object.entries(boosts) as Array<[ScentStatLabel, number]>) {
    scores[label] += boost;
  }
}

const answerBoosts: Record<string, Partial<Record<ScentStatLabel, number>>> = {
  clean: { Fresh: 18, Elegant: 8, Mature: 4 },
  comforting: { Sweet: 12, Woody: 5, Elegant: 4 },
  mysterious: { Smoky: 16, Mature: 10, Bold: 10 },
  expensive: { Elegant: 20, Mature: 10, Woody: 6 },
  playful: { Playful: 22, Sweet: 14, Fresh: 4 },
  sporty: { Fresh: 20, Playful: 8, Bold: 4 },
  bold: { Bold: 24, Smoky: 8, Mature: 5 },
  intimate: { Elegant: 8, Mature: 4, Bold: -6 },
  daily: { Fresh: 12, Elegant: 6, Bold: -4 },
  work: { Elegant: 14, Mature: 8, Fresh: 4 },
  date: { Sweet: 8, Playful: 5, Bold: 8, Elegant: 4 },
  night: { Bold: 18, Smoky: 10, Mature: 8 },
  casual: { Fresh: 10, Playful: 8, Elegant: -3 },
  special: { Elegant: 18, Mature: 10, Bold: 8 },
  everything: { Fresh: 8, Elegant: 8, Bold: -4 },
  aquatic: { Fresh: 18, Playful: 4 },
  gourmand: { Sweet: 24, Playful: 8, Mature: -4 },
  floral: { Sweet: 8, Playful: 10, Elegant: 8 },
  woody: { Woody: 22, Mature: 8, Elegant: 6 },
  oriental: { Smoky: 18, Mature: 12, Bold: 10 },
  spicy: { Smoky: 8, Bold: 12, Mature: 6 },
  subtle: { Elegant: 10, Fresh: 6, Bold: -10 },
  moderate: { Elegant: 8, Fresh: 4 },
  strong: { Bold: 18, Mature: 4 },
  beast: { Bold: 26, Smoky: 8 },
  'hot-humid': { Fresh: 20, Sweet: -8, Smoky: -8 },
  cool: { Woody: 10, Sweet: 8, Smoky: 8 },
  indoor: { Elegant: 14, Mature: 6, Bold: -4 },
  'all-year': { Fresh: 8, Elegant: 8 },
  budget: { Playful: 8, Elegant: -4 },
  mid: { Elegant: 5 },
  designer: { Elegant: 10, Mature: 4 },
  niche: { Elegant: 14, Mature: 8, Bold: 6 },
  beginner: { Fresh: 8, Elegant: 5, Bold: -6 },
  intermediate: { Elegant: 8, Woody: 4 },
  unique: { Bold: 12, Smoky: 6, Elegant: 6 },
  'you-smell-clean': { Fresh: 18, Elegant: 6 },
  'what-is-that': { Bold: 18, Playful: 8 },
  'soft-comfort': { Sweet: 12, Woody: 6, Elegant: 4 },
  'rich-mysterious': { Smoky: 16, Mature: 10, Bold: 10 },
  'only-you': { Bold: 12, Elegant: 8, Smoky: 6 },
};

const avoidPenalties: Record<string, Partial<Record<ScentStatLabel, number>>> = {
  'too-sweet': { Sweet: -32 },
  'too-strong': { Bold: -24, Smoky: -8 },
  oud: { Smoky: -16, Woody: -8, Mature: -8 },
  smoke: { Smoky: -34 },
  powdery: { Mature: -12, Sweet: -4 },
  vanilla: { Sweet: -22 },
  rose: { Playful: -6, Elegant: -4 },
  leather: { Smoky: -14, Mature: -8 },
  mature: { Mature: -30, Smoky: -8 },
};

const traitSignals: Record<ScentStatLabel, string[]> = {
  Fresh: ['fresh', 'citrus', 'aquatic', 'green', 'tea', 'linen', 'marine', 'neroli', 'bergamot', 'musk'],
  Sweet: ['sweet', 'vanilla', 'gourmand', 'caramel', 'praline', 'tonka', 'cacao', 'cherry', 'pear'],
  Woody: ['woody', 'cedar', 'sandalwood', 'vetiver', 'patchouli', 'oakmoss', 'birch', 'dry woods'],
  Smoky: ['smoky', 'smoke', 'tobacco', 'incense', 'leather', 'oud', 'dark', 'fireplace'],
  Mature: ['mature', 'elegant', 'formal', 'special', 'niche', 'winter', 'amber', 'patchouli', 'tobacco'],
  Playful: ['playful', 'fruity', 'casual', 'summer', 'bright', 'pear', 'cherry', 'coconut', 'compliment'],
  Elegant: ['elegant', 'quiet-luxury', 'old-money', 'hotel-room', 'luxury', 'work', 'polished', 'niche'],
  Bold: ['bold', 'strong', 'beast', 'statement', 'night', 'date', 'special', 'addictive', 'confident'],
};

function topTraitText(traits: ScentStatLabel[]) {
  return traits.map(trait => trait.toLowerCase()).join(', ');
}

function generateScentProfileStats(answers: QuizAnswers, recommendations: ScoredFragrance[]): ScentProfileStats {
  const scores = scentStatLabels.reduce((acc, label) => {
    acc[label] = 42;
    return acc;
  }, {} as Record<ScentStatLabel, number>);

  const answerIds = [
    ...valuesFor(answers, 'desired-feel'),
    ...valuesFor(answers, 'occasion'),
    ...valuesFor(answers, 'scent-family'),
    ...valuesFor(answers, 'projection'),
    ...valuesFor(answers, 'weather'),
    ...valuesFor(answers, 'price-range'),
    ...valuesFor(answers, 'experience'),
    ...valuesFor(answers, 'compliment-style'),
  ];

  for (const id of answerIds) {
    addScores(scores, answerBoosts[id] ?? {});
  }

  const avoids = valuesFor(answers, 'disliked-notes').filter(value => value !== 'none');
  for (const id of avoids) {
    addScores(scores, avoidPenalties[id] ?? {});
  }

  for (const result of recommendations.slice(0, 5)) {
    const signals = collectSignals(result.fragrance);
    for (const label of scentStatLabels) {
      const matches = traitSignals[label].filter(term => signals.some(signal => signal.includes(term))).length;
      scores[label] += Math.min(16, matches * 3);
    }
  }

  const stats = scentStatLabels.map(label => ({ label, value: clampScore(scores[label]) }));
  const strongestTraits = [...stats]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(stat => stat.label);
  const traitA = strongestTraits[0] ?? 'Fresh';
  const traitB = strongestTraits[1] ?? 'Elegant';
  const traitC = strongestTraits[2] ?? 'Woody';

  let archetype = `${traitA} ${traitB} Signature`;
  let archetypeDescription = `Your scent lane is ${topTraitText([traitA, traitB])}: polished enough to feel intentional, but still easy to wear.`;
  if (scores.Fresh >= 70 && scores.Elegant >= 64) {
    archetype = 'Clean Luxury Minimalist';
    archetypeDescription = 'Clean, expensive, and easy to wear. You like scents that feel put-together without trying too hard.';
  } else if (scores.Smoky >= 66 && scores.Woody >= 60) {
    archetype = 'Woody Night-Out Strategist';
    archetypeDescription = 'You like depth, texture, and a little mystery. Polished, but definitely not boring.';
  } else if (scores.Sweet >= 66 && scores.Playful >= 60) {
    archetype = 'Soft Sweet Daydreamer';
    archetypeDescription = 'Warm, sweet, and compliment-friendly, but still wearable enough for real life.';
  } else if (scores.Fresh >= 65 && scores.Bold >= 60) {
    archetype = 'Fresh but Dangerous';
    archetypeDescription = 'Fresh with a bit of main-character tension. Clean first impression, memorable drydown.';
  } else if (scores.Elegant >= 70 && scores.Mature >= 60) {
    archetype = 'Quiet Luxury Villain';
    archetypeDescription = 'Smooth, refined, and slightly intimidating in the best way. Polished, not boring.';
  } else if (scores.Sweet >= 58 && scores.Elegant >= 62) {
    archetype = 'Warm Vanilla Socialite';
    archetypeDescription = 'Soft warmth with a dressed-up edge. You want cozy, but make it expensive.';
  }

  const recommendedFamilies = [...new Set(recommendations.slice(0, 4).flatMap(result => result.fragrance.scentFamilies))]
    .slice(0, 4)
    .map(pretty);
  const bestOccasions = [...new Set(recommendations.slice(0, 4).flatMap(result => result.fragrance.occasions))]
    .slice(0, 3)
    .map(pretty);
  const avoidTraits = avoids.length
    ? avoids.map(pretty)
    : [
      scores.Bold > 72 ? 'headache-level projection' : 'anything too flat',
      scores.Sweet < 40 ? 'sugar bomb sweetness' : 'boring safe picks',
    ];
  const summary = `Your profile leans ${topTraitText(strongestTraits)}. You seem to want something ${traitA.toLowerCase()} and ${traitB.toLowerCase()}, with enough ${traitC.toLowerCase()} energy to feel personal.`;

  return {
    archetype,
    archetypeDescription,
    summary,
    stats,
    strongestTraits,
    avoidTraits,
    bestOccasions,
    recommendedFamilies,
    insightCards: [
      {
        title: 'Strongest direction',
        value: `${traitA} ${traitB}`,
        description: `${traitA} leads the profile, while ${traitB.toLowerCase()} keeps it from feeling random.`,
      },
      {
        title: 'Best occasion',
        value: bestOccasions.slice(0, 2).join(' / ') || 'Daily wear',
        description: 'Your matches are easiest to wear in the moments your quiz weighted highest.',
      },
      {
        title: 'Safest blind-buy zone',
        value: recommendedFamilies.slice(0, 2).join(' / ') || 'Clean musk',
        description: 'These families repeat across your top matches, so they are the least risky lane.',
      },
      {
        title: 'What to avoid',
        value: avoidTraits.slice(0, 2).join(' / '),
        description: 'These signals are treated carefully so the recommendations stay wearable for you.',
      },
    ],
  };
}

function profileMetrics(results: ScoredFragrance[], answers: QuizAnswers) {
  const top = results.slice(0, 3);
  const avoids = valuesFor(answers, 'disliked-notes').filter(value => value !== 'none');
  return [
    {
      label: 'Report confidence',
      value: `${average(top.map(result => result.matchBreakdown.confidenceScore)) || average(top.map(result => result.matchPercent))}%`,
      detail: 'Average confidence from the top recommendations.',
    },
    {
      label: 'Best match',
      value: top[0] ? `${top[0].matchPercent}%` : 'N/A',
      detail: top[0] ? `${top[0].fragrance.name} has the strongest total fit.` : 'Take the quiz to generate matches.',
    },
    {
      label: 'Red flag safety',
      value: `${average(top.map(result => result.matchBreakdown.redFlagSafety)) || 100}%`,
      detail: avoids.length ? `Avoiding ${avoids.map(pretty).join(', ')}.` : 'No hard avoid notes selected.',
    },
    {
      label: 'Budget fit',
      value: `${average(top.map(result => result.matchBreakdown.budgetFit)) || 0}%`,
      detail: 'Checks how well the matches respect your price answer.',
    },
  ];
}

export default function ResultsPageV2({
  results,
  answers = {},
  onRestart,
  onViewShelf,
}: ResultsPageV2Props) {
  const { user, signOut } = useAuth();
  const { shelfIds, isOnShelf, addToShelf, removeFromShelf } = useShelf();
  const [showSignIn, setShowSignIn] = useState(false);
  const [currency, setCurrency] = useCurrency();
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const scentProfile = useMemo(() => buildScentProfile(answers), [answers]);
  const baseResults = useMemo(() => (
    results.length ? results : getRecommendations(answers, 7)
  ), [answers, results]);
  const visibleResults = useMemo(() => (
    baseResults.filter(result => !hiddenIds.includes(result.fragrance.id))
  ), [baseResults, hiddenIds]);
  const metrics = useMemo(() => profileMetrics(baseResults, answers), [answers, baseResults]);
  const scentDNA = useMemo(() => generateScentProfileStats(answers, baseResults), [answers, baseResults]);

  useEffect(() => {
    trackEvent('results_view', { resultCount: baseResults.length, profile: scentProfile.title, version: 'static_v2' });
  }, [baseResults.length, scentProfile.title]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(''), 2200);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const handleShelf = (fragrance: Fragrance) => {
    if (isOnShelf(fragrance.id)) {
      removeFromShelf(fragrance.id);
      setMessage(`${fragrance.name} removed from your Shelf.`);
      return;
    }

    addToShelf(fragrance.id);
    trackEvent('result_save_to_shelf', { fragranceId: fragrance.id });
    setMessage(`${fragrance.name} saved to your Shelf.`);
  };

  const handleNotMyVibe = (fragranceId: string, reason: string) => {
    setHiddenIds(current => current.includes(fragranceId) ? current : [...current, fragranceId]);
    setMessage(`Got it - hiding that pick because it felt ${reason.toLowerCase()}.`);
    trackEvent('result_feedback_not_my_vibe', { fragranceId, reason });
  };

  return (
    <>
      <div className="results-page-v2 min-h-screen overflow-x-clip bg-[#f7f4ee] text-stone-950">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#f7f4ee] px-4 py-3">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <span className="font-black tracking-tight">ScentMatch</span>
            <nav className="flex items-center gap-2" aria-label="Results navigation">
              <button
                type="button"
                onClick={onViewShelf}
                className="min-h-11 rounded-full border border-stone-300 bg-white px-4 text-sm font-bold text-stone-800"
              >
                Shelf{shelfIds.length ? ` (${shelfIds.length})` : ''}
              </button>
              {user ? (
                <button type="button" onClick={signOut} className="min-h-11 px-2 text-sm font-semibold text-stone-600">
                  Sign out
                </button>
              ) : (
                <button type="button" onClick={() => setShowSignIn(true)} className="min-h-11 px-2 text-sm font-semibold text-stone-600">
                  Log in
                </button>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-10">
          <section data-results-section="scent-dna" className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6417]">Your Scent DNA</p>
                <h2 className="mt-2 text-4xl font-black leading-[0.95] tracking-[-0.065em] text-stone-950 sm:text-5xl">
                  {scentDNA.archetype}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-stone-600">
                  {scentDNA.archetypeDescription}
                </p>
                <p className="mt-3 rounded-2xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
                  {scentDNA.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {scentDNA.recommendedFamilies.map(family => (
                    <span key={family} className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold capitalize text-stone-700">
                      {family}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-950 p-4 text-white">
                <ScentRadarChart stats={scentDNA.stats} />
                <div className="mt-4 grid gap-2">
                  {scentDNA.stats.map(stat => (
                    <ScentStatBar key={stat.label} label={stat.label} value={stat.value} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {scentDNA.insightCards.map(card => (
                <article key={card.title} className="rounded-[1.35rem] border border-stone-200 bg-stone-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{card.title}</p>
                  <p className="mt-2 text-lg font-black leading-tight tracking-[-0.03em] text-stone-950">{card.value}</p>
                  <p className="mt-2 text-xs leading-relaxed text-stone-500">{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section data-results-section="match-summary" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(metric => (
              <article key={metric.label} className="rounded-[1.35rem] border border-stone-200 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-stone-950">{metric.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">{metric.detail}</p>
              </article>
            ))}
          </section>

          <section data-results-section="recommendations" className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6417]">Your Matches</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.05em] text-stone-950">Fragrances worth trying</h2>
              </div>
              <CurrencyPicker currency={currency} setCurrency={setCurrency} />
            </div>

            {message && (
              <p className="mt-4 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700" aria-live="polite">
                {message}
              </p>
            )}

            {visibleResults.length ? (
              <div className="mt-4 grid gap-4">
                {visibleResults.map((result, index) => (
                  <StaticRecommendationCard
                    key={result.fragrance.id}
                    result={result}
                    rank={index + 1}
                    currency={currency}
                    saved={isOnShelf(result.fragrance.id)}
                    onShelf={() => handleShelf(result.fragrance)}
                    onNotMyVibe={handleNotMyVibe}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 text-center">
                <h3 className="text-xl font-black tracking-[-0.03em]">No matches left after feedback.</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">Retake the quiz or loosen an avoid rule to see more options.</p>
              </div>
            )}
          </section>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                trackEvent('quiz_retake', { source: 'results_v2_footer' });
                onRestart();
              }}
              className="min-h-11 rounded-full border border-stone-300 bg-white px-6 text-sm font-bold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
            >
              Retake quiz
            </button>
          </div>
        </main>
      </div>

      {showSignIn && <AuthModal onClose={() => setShowSignIn(false)} initialMode="login" />}
    </>
  );
}

function CurrencyPicker({
  currency,
  setCurrency,
}: {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Display currency" className="inline-flex self-start rounded-xl border border-stone-200 bg-white p-1">
      {CURRENCIES.map(option => (
        <button
          key={option.code}
          type="button"
          role="radio"
          aria-checked={currency === option.code}
          onClick={() => setCurrency(option.code)}
          className={clsx(
            'min-h-10 rounded-lg px-3 text-sm font-black',
            currency === option.code ? 'bg-stone-950 text-white' : 'text-stone-500',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ScentRadarChart({ stats }: { stats: Array<{ label: ScentStatLabel; value: number }> }) {
  const center = 80;
  const maxRadius = 46;
  const points = stats.map((stat, index) => {
    const angle = (-90 + (360 / stats.length) * index) * (Math.PI / 180);
    const radius = (stat.value / 100) * maxRadius;
    return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
  }).join(' ');

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d2b886]">Stat graph</p>
      <svg
        viewBox="0 0 160 160"
        className="mx-auto mt-2 h-64 w-full max-w-[19rem]"
        role="img"
        aria-label={`Scent DNA radar chart: ${stats.map(stat => `${stat.label} ${stat.value}`).join(', ')}`}
      >
        {[0.25, 0.5, 0.75, 1].map(scale => (
          <polygon
            key={scale}
            points={stats.map((_, index) => {
              const angle = (-90 + (360 / stats.length) * index) * (Math.PI / 180);
              const radius = maxRadius * scale;
              return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
        ))}
        {stats.map((_, index) => {
          const angle = (-90 + (360 / stats.length) * index) * (Math.PI / 180);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * maxRadius}
              y2={center + Math.sin(angle) * maxRadius}
              stroke="rgba(255,255,255,0.11)"
            />
          );
        })}
        <polygon points={points} fill="rgba(210,184,134,0.33)" stroke="#ffffff" strokeWidth="2" />
        {stats.map((stat, index) => {
          const angle = (-90 + (360 / stats.length) * index) * (Math.PI / 180);
          const dotRadius = (stat.value / 100) * maxRadius;
          const labelRadius = 65;
          return (
            <g key={stat.label}>
              <circle
                cx={center + Math.cos(angle) * dotRadius}
                cy={center + Math.sin(angle) * dotRadius}
                r="2.5"
                fill="#ffffff"
              />
              <text
                x={center + Math.cos(angle) * labelRadius}
                y={center + Math.sin(angle) * labelRadius}
                fill="rgba(255,255,255,0.86)"
                fontSize="6.5"
                fontWeight="800"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {stat.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ScentStatBar({ label, value }: { label: ScentStatLabel; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-stone-300">{label}</span>
        <span className="text-xs font-black tabular-nums text-white">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white" style={{ width: `${Math.max(4, value)}%` }} />
      </div>
    </div>
  );
}

function StaticRecommendationCard({
  result,
  rank,
  currency,
  saved,
  onShelf,
  onNotMyVibe,
}: {
  result: ScoredFragrance;
  rank: number;
  currency: Currency;
  saved: boolean;
  onShelf: () => void;
  onNotMyVibe: (fragranceId: string, reason: string) => void;
}) {
  const fragrance = result.fragrance;
  const price = getSignaturePrice(fragrance, currency);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(fragrance.imageUrl || fallbackImage);

  return (
    <article
      id={`result-${fragrance.id}`}
      data-fragrance-id={fragrance.id}
      className="overflow-hidden rounded-[1.65rem] border border-stone-200 bg-white shadow-sm"
    >
      <div className="grid gap-0 md:grid-cols-[minmax(210px,0.75fr)_minmax(0,1.55fr)]">
        <div className="border-b border-stone-100 bg-stone-50 p-4 md:border-b-0 md:border-r">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-white">
            <Image
              src={imageSrc}
              alt={`${fragrance.brand} ${fragrance.name} fragrance bottle`}
              fill
              sizes="(max-width: 767px) calc(100vw - 48px), 320px"
              className="object-contain p-6"
              loading={rank <= 2 ? 'eager' : 'lazy'}
              fetchPriority={rank === 1 ? 'high' : 'auto'}
              quality={70}
              unoptimized={imageSrc.endsWith('.svg')}
              onError={() => setImageSrc(fallbackImage)}
            />
          </div>
          {fragrance.isDupe && (
            <p className="mt-3 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700">
              Alternative inspired by {fragrance.inspiredBy ?? fragrance.dupeOf ?? 'a similar scent'}
            </p>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">{fragrance.brand}</p>
              <h3 className="mt-1 break-words text-2xl font-black leading-tight tracking-[-0.04em] text-stone-950 sm:text-3xl">
                {fragrance.name}
              </h3>
            </div>
            <div className="shrink-0 rounded-2xl bg-stone-950 px-3 py-2 text-center text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-stone-400">Match</p>
              <p className="text-xl font-black">{result.matchPercent}%</p>
            </div>
          </div>

          <p className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-[#8a6417]">{result.recommendationLabel}</p>
          <p className="mt-2 text-base leading-relaxed text-stone-600">{fragrance.shortDescription}</p>

          <section className="mt-4 rounded-2xl bg-stone-50 p-4" aria-label={`Why ${fragrance.name} fits you`}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">Why this fits you</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-stone-700">
              {(result.matchReasons.length ? result.matchReasons : [result.matchReason]).slice(0, 3).map(reason => (
                <li key={reason} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-950" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="col-span-2 rounded-2xl border border-stone-100 p-3 sm:col-span-2">
              <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Key notes</dt>
              <dd className="mt-1 capitalize text-stone-800">{fragrance.notes.slice(0, 5).join(' / ')}</dd>
            </div>
            <div className="rounded-2xl border border-stone-100 p-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Best for</dt>
              <dd className="mt-1 capitalize text-stone-800">{fragrance.occasions.slice(0, 2).map(pretty).join(' / ')}</dd>
            </div>
            <div className="rounded-2xl border border-stone-100 p-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Price</dt>
              <dd className="mt-1 text-stone-800">
                {!price.exact && <span aria-label="approximately">approx. </span>}
                {formatPrice(price.amount, currency)}
                <span className="block text-[11px] text-stone-400">{price.size}</span>
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] text-stone-400">Indicative retail pricing as of {PRICED_AS_OF}.</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={onShelf}
              aria-pressed={saved}
              className={clsx(
                'min-h-12 rounded-xl px-4 text-base font-black',
                saved ? 'border border-stone-300 bg-stone-100 text-stone-950' : 'bg-stone-950 text-white',
              )}
            >
              {saved ? 'Saved to Shelf' : 'Save to Shelf'}
            </button>
            {fragrance.productUrl && (
              <a
                href={fragrance.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('result_view_official_product', { fragranceId: fragrance.id, url: fragrance.productUrl })}
                className="flex min-h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-base font-black text-stone-800"
              >
                View official product
              </a>
            )}
            <Link
              href={`/fragrances/${brandSlug(fragrance.brand)}/${fragrance.id}`}
              className="flex min-h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-base font-black text-stone-800"
            >
              View details
            </Link>
            <button
              type="button"
              onClick={() => setFeedbackOpen(open => !open)}
              aria-expanded={feedbackOpen}
              className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-base font-black text-stone-800"
            >
              Not my vibe
            </button>
          </div>

          {feedbackOpen && (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-black text-stone-950">What felt off?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Too sweet', 'Too strong', 'Too expensive', 'Too basic', 'Too niche', 'Too mature', 'Not my style'].map(reason => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => onNotMyVibe(fragrance.id, reason)}
                    className="min-h-10 rounded-full border border-stone-200 bg-white px-3 text-sm font-bold text-stone-700"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
