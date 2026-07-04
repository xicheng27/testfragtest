'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { ScoredFragrance, QuizAnswers, buildScentProfile, getRecommendations, getStrictMatchCount, scoreFragrance } from '@/lib/scoring';
import { Fragrance } from '@/lib/fragrances';
import AuthModal from './AuthModal';
import ProductImage from './ProductImage';
import FragranceCard from './FragranceCard';
import { useAuth } from '@/lib/auth-context';
import { useShelf } from '@/lib/shelf-context';
import { CURRENCIES, PRICED_AS_OF, useCurrency } from '@/lib/pricing';
import { trackEvent } from '@/lib/analytics';

interface ResultsPageProps {
  results: ScoredFragrance[];
  answers?: QuizAnswers;
  onRestart: () => void;
  onExtendedQuiz: () => void;
  onViewShelf: () => void;
  isExtended: boolean;
}

type MoodFilter = 'all' | 'clean' | 'sweet' | 'dark' | 'fresh' | 'expensive' | 'cozy' | 'date-night';
type AdjustMode = 'default' | 'cheaper' | 'stronger' | 'unique' | 'fresh' | 'daily';

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
  { id: 'cheaper', label: 'Cheaper', description: 'Prioritise budget picks' },
  { id: 'stronger', label: 'Stronger', description: 'More projection' },
  { id: 'unique', label: 'More unique', description: 'Niche and wildcard picks' },
  { id: 'fresh', label: 'Cleaner/fresher', description: 'Clean, citrus, aquatic' },
  { id: 'daily', label: 'Safe daily', description: 'School/work friendly' },
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

  if (mode === 'fresh') {
    const signals = signalsFor(result.fragrance);
    const freshBonus = ['fresh', 'clean', 'citrus', 'aquatic', 'green', 'musk'].filter(signal => (
      signals.some(value => value.includes(signal))
    )).length * 18;
    return result.score + freshBonus - (result.fragrance.projection === 'strong' ? 18 : 0);
  }

  if (mode === 'daily') {
    return result.score
      + (result.fragrance.occasions.includes('daily') ? 28 : 0)
      + (result.fragrance.occasions.includes('work') ? 24 : 0)
      + (result.fragrance.projection === 'strong' ? -32 : 12);
  }

  return result.score;
}

function brandSlug(brand: string) {
  return brand.toLowerCase().replace(/\s+/g, '-');
}

function valuesFor(answers: QuizAnswers, id: string) {
  const value = answers[id];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function pretty(value: string) {
  return value.replaceAll('-', ' ');
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function clampMetric(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function countSignals(results: ScoredFragrance[], terms: string[]) {
  return results.slice(0, 7).reduce((count, result) => {
    const signals = signalsFor(result.fragrance);
    return count + terms.filter(term => signals.some(signal => signal.includes(term))).length;
  }, 0);
}

function projectionCopy(value: string) {
  if (value === 'subtle') return 'close to skin';
  if (value === 'moderate') return 'noticeable but controlled';
  if (value === 'strong') return 'compliment-level presence';
  if (value === 'beast') return 'high projection';
  return 'flexible';
}

function priceSensitivity(value: string) {
  if (value === 'budget') return 94;
  if (value === 'mid') return 78;
  if (value === 'designer') return 55;
  if (value === 'niche') return 34;
  return 22;
}

const dimensionConfig = [
  {
    label: 'Fresh',
    terms: ['fresh', 'clean', 'citrus', 'aquatic', 'green', 'tea', 'linen', 'marine'],
    answers: ['clean', 'fresh', 'aquatic', 'sporty', 'hot-humid', 'you-smell-clean'],
    explanation: 'Driven by clean, citrus, aquatic, tea, and hot-weather answers.',
  },
  {
    label: 'Sweet',
    terms: ['sweet', 'gourmand', 'vanilla', 'caramel', 'praline', 'tonka'],
    answers: ['gourmand', 'playful', 'comforting', 'soft-comfort'],
    explanation: 'Reads vanilla, gourmand, cozy, and compliment-friendly signals.',
  },
  {
    label: 'Woody',
    terms: ['woody', 'sandalwood', 'cedar', 'vetiver', 'patchouli'],
    answers: ['woody', 'expensive', 'comforting'],
    explanation: 'Measures sandalwood, cedar, vetiver, and polished woody structure.',
  },
  {
    label: 'Floral',
    terms: ['floral', 'rose', 'white floral', 'orange blossom', 'jasmine', 'petal'],
    answers: ['floral', 'date', 'romantic'],
    explanation: 'Reflects floral-world answers plus romantic/date-use matching.',
  },
  {
    label: 'Spicy',
    terms: ['spicy', 'amber', 'smoky', 'tobacco', 'incense', 'warm'],
    answers: ['spicy', 'oriental', 'bold', 'mysterious', 'rich-mysterious', 'cool'],
    explanation: 'Highlights amber, spice, smoke, and darker evening texture.',
  },
  {
    label: 'Musky',
    terms: ['musk', 'musky', 'skin', 'soft', 'intimate', 'linen'],
    answers: ['clean', 'intimate', 'soft-comfort', 'you-smell-clean'],
    explanation: 'Tracks skin-like musk, soft laundry, and close-wearing picks.',
  },
] as const;

export default function ResultsPage({
  results,
  answers = {},
  onRestart,
  onViewShelf,
}: ResultsPageProps) {
  const { user, signOut } = useAuth();
  const { shelfIds } = useShelf();
  const [showSignIn, setShowSignIn] = useState(false);
  const [currency, setCurrency] = useCurrency();
  const [activeMood, setActiveMood] = useState<MoodFilter>('all');
  const [adjustMode, setAdjustMode] = useState<AdjustMode>('default');
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const scentProfile = useMemo(() => buildScentProfile(answers), [answers]);
  const strictMatchCount = useMemo(() => getStrictMatchCount(answers), [answers]);

  useEffect(() => {
    trackEvent('results_view', { resultCount: results.length, profile: scentProfile.title });
  }, [results.length, scentProfile.title]);

  const personalisedPool = useMemo(() => {
    if (activeMood === 'all' && adjustMode === 'default' && hiddenIds.length === 0) return results;

    const source = getRecommendations(answers, 24);
    const enhanced = source
      .map(result => ({
        ...result,
        score: scoreFragrance(result.fragrance, answers),
      }))
      .filter(result => !hiddenIds.includes(result.fragrance.id))
      .filter(result => moodMatches(result.fragrance, activeMood))
      .sort((a, b) => adjustScore(b, adjustMode) - adjustScore(a, adjustMode));

    return enhanced.length ? enhanced.slice(0, 7) : results.filter(result => !hiddenIds.includes(result.fragrance.id));
  }, [activeMood, adjustMode, answers, hiddenIds, results]);

  const handleFeedback = (fragranceId: string, reason: string) => {
    setHiddenIds(current => current.includes(fragranceId) ? current : [...current, fragranceId]);
    setFeedbackMessage(`Got it - hiding that pick because it felt ${reason.toLowerCase()}.`);
    trackEvent('result_feedback_not_my_vibe', { fragranceId, reason });
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

  const analysis = useMemo(() => {
    const breakdowns = personalisedPool.map(result => result.matchBreakdown);
    const topThree = personalisedPool.slice(0, 3);
    const missingData = [...new Set(breakdowns.flatMap(item => item.missingDataFields))];
    const avoided = valuesFor(answers, 'disliked-notes').filter(value => value !== 'none');
    const selectedSignals = [
      ...valuesFor(answers, 'desired-feel'),
      ...valuesFor(answers, 'scent-family'),
      ...valuesFor(answers, 'occasion'),
      ...valuesFor(answers, 'weather'),
      ...valuesFor(answers, 'compliment-style'),
    ];
    const cleanFreshAlignment = clampMetric(
      38
      + selectedSignals.filter(value => ['clean', 'fresh', 'aquatic', 'sporty', 'hot-humid', 'you-smell-clean'].includes(value)).length * 15
      + countSignals(topThree, ['fresh', 'clean', 'citrus', 'aquatic', 'musk']) * 4,
    );
    const sweetnessTolerance = clampMetric(
      48
      + selectedSignals.filter(value => ['gourmand', 'playful', 'comforting', 'soft-comfort'].includes(value)).length * 16
      + countSignals(topThree, ['sweet', 'vanilla', 'gourmand', 'caramel']) * 3
      - (avoided.includes('too-sweet') ? 45 : 0)
      - (avoided.includes('vanilla') ? 25 : 0),
    );
    const projectionAnswer = valuesFor(answers, 'projection')[0] ?? '';
    const weatherAnswer = valuesFor(answers, 'weather')[0] ?? '';
    const budgetAnswer = valuesFor(answers, 'price-range')[0] ?? 'any';
    const exactMatches = breakdowns.filter(item => item.matchType === 'Exact match').length;
    const strongMatches = breakdowns.filter(item => item.matchType === 'Strong match').length;
    const partialMatches = breakdowns.filter(item => item.matchType === 'Partial match').length;
    const hardPassed = topThree.reduce((sum, result) => sum + result.matchBreakdown.hardFiltersPassed, 0);
    const hardTotal = topThree.reduce((sum, result) => sum + result.matchBreakdown.hardFiltersTotal, 0);
    const softMatched = topThree.reduce((sum, result) => sum + result.matchBreakdown.softPreferencesMatched, 0);
    const softTotal = topThree.reduce((sum, result) => sum + result.matchBreakdown.softPreferencesTotal, 0);
    const scentDimensions = dimensionConfig.map(dimension => {
      const answerBoost = selectedSignals.filter(value => (dimension.answers as readonly string[]).includes(value)).length * 16;
      const recommendationBoost = countSignals(personalisedPool, [...dimension.terms]) * 4;
      const penalty = dimension.label === 'Sweet'
        ? (avoided.includes('too-sweet') ? 34 : 0) + (avoided.includes('vanilla') ? 18 : 0)
        : dimension.label === 'Floral' && avoided.includes('rose')
          ? 16
          : 0;

      return {
        label: dimension.label,
        value: clampMetric(32 + answerBoost + recommendationBoost - penalty),
        explanation: dimension.explanation,
      };
    });

    return {
      overall: average(topThree.map(result => result.matchPercent)),
      confidence: average(topThree.map(result => result.matchBreakdown.confidenceScore)),
      hardPassed,
      hardTotal,
      softMatched,
      softTotal,
      missingData,
      exactMatches,
      strongMatches,
      partialMatches,
      avoided,
      projectionAnswer,
      weatherAnswer,
      budgetAnswer,
      profileMetrics: [
        {
          label: 'Overall profile confidence',
          value: average(topThree.map(result => result.matchBreakdown.confidenceScore)),
          detail: 'Average source and data confidence for the top recommendations.',
        },
        {
          label: 'Clean/fresh alignment',
          value: cleanFreshAlignment,
          detail: 'Measures your clean, aquatic, citrus, musk, and hot-weather signals.',
        },
        {
          label: 'Sweetness tolerance',
          value: sweetnessTolerance,
          detail: avoided.includes('too-sweet') ? 'Lower because you marked sweet scents as a red flag.' : 'Based on gourmand, vanilla, cozy, and playful signals.',
        },
        {
          label: 'Projection preference',
          value: average(topThree.map(result => result.matchBreakdown.projectionFit)),
          detail: `Your target reads as ${projectionCopy(projectionAnswer)}.`,
        },
        {
          label: 'Budget sensitivity',
          value: priceSensitivity(budgetAnswer),
          detail: budgetAnswer === 'any' ? 'Low sensitivity because you left price open.' : `Higher because you chose ${pretty(budgetAnswer)} pricing.`,
        },
        {
          label: 'Weather compatibility',
          value: average(topThree.map(result => result.matchBreakdown.climateFit)),
          detail: weatherAnswer ? `Checks how well picks survive ${pretty(weatherAnswer)} conditions.` : 'Balanced for year-round wear.',
        },
        {
          label: 'Risk/red-flag strictness',
          value: avoided.length ? clampMetric(48 + avoided.length * 13) : 18,
          detail: avoided.length ? `Strictly avoids ${avoided.map(pretty).join(', ')}.` : 'Low strictness because no avoid notes were selected.',
        },
      ],
      scentDimensions,
      topThree,
    };
  }, [answers, personalisedPool]);

  const answerSummary = useMemo(() => {
    const avoids = valuesFor(answers, 'disliked-notes').filter(value => value !== 'none');
    return [
      { label: 'Vibe', value: valuesFor(answers, 'desired-feel').map(pretty).join(' / ') || 'Flexible' },
      { label: 'Occasion', value: valuesFor(answers, 'occasion').map(pretty).join(' / ') || 'Any' },
      { label: 'Weather', value: valuesFor(answers, 'weather').map(pretty).join(' / ') || 'Any climate' },
      { label: 'Budget', value: valuesFor(answers, 'price-range').map(pretty).join(' / ') || 'Open' },
      { label: 'Projection', value: valuesFor(answers, 'projection').map(pretty).join(' / ') || 'Not sure' },
      { label: 'Avoids', value: avoids.length ? avoids.map(pretty).join(' / ') : 'No red flags selected' },
    ];
  }, [answers]);

  return (
    <>
      <div className="marble-bg min-h-screen">
        <header data-ui="site-header" className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            <span className="font-black tracking-tight text-stone-950">ScentMatch</span>
            <div className="flex items-center gap-1 sm:gap-3">
              <Link href="/about" className="hidden min-h-11 items-center px-2 text-sm text-stone-600 transition-colors hover:text-stone-950 sm:inline-flex">
                About
              </Link>
              <button
                onClick={onViewShelf}
                className="inline-flex min-h-11 items-center rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
              >
                Shelf{shelfIds.length > 0 ? ` (${shelfIds.length})` : ''}
              </button>
              {user ? (
                <>
                  <span className="hidden text-sm text-stone-600 sm:inline">{user.name.split(' ')[0]}</span>
                  <button onClick={signOut} className="inline-flex min-h-11 items-center px-2 text-xs text-stone-500 transition-colors hover:text-stone-800">Sign out</button>
                </>
              ) : (
                <button onClick={() => setShowSignIn(true)} className="inline-flex min-h-11 items-center px-2 text-sm text-stone-600 transition-colors hover:text-stone-950">
                  Log in
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
          <section className="mb-7 overflow-hidden rounded-[2.15rem] border border-stone-200 bg-stone-950 text-white shadow-[0_30px_90px_rgba(28,25,23,0.18)]" aria-labelledby="scent-profile-report">
            <div className="relative p-5 sm:p-8">
              <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_88%_0%,rgba(176,141,87,0.18),transparent_34%)]" aria-hidden="true" />
              <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d2b886]">Your Scent Profile Report</p>
                  <h1 id="scent-profile-report" className="mt-3 max-w-4xl text-[clamp(2.35rem,9vw,5.7rem)] font-black leading-[0.88] tracking-[-0.075em] text-white">
                    {scentProfile.title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg">
                    {scentProfile.description} Your matches are weighted by the vibe, occasion, weather, budget, projection, and red flags you selected.
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {answerSummary.map(item => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">{item.label}</p>
                        <p className="mt-1 text-sm capitalize text-stone-100">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.08] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">Report confidence</p>
                      <p className="mt-1 text-sm leading-relaxed text-stone-300">
                        Average data confidence across your top matches.
                      </p>
                    </div>
                    <CircularScore value={analysis.confidence || 0} />
                  </div>
                  <button
                    onClick={() => {
                      trackEvent('quiz_retake', { source: 'results_profile_report' });
                      onRestart();
                    }}
                    className="mt-5 min-h-11 w-full rounded-2xl border border-white/15 bg-white px-5 text-base font-bold text-stone-950 transition-all hover:-translate-y-0.5 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Retake quiz
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.03] p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {analysis.profileMetrics.map(metric => (
                  <ReportMetric key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} />
                ))}
              </div>
            </div>

            <div className="grid gap-0 border-t border-white/10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d2b886]">Scent dimensions</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">What your profile leans toward.</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  This radar blends your quiz answers with scent families and notes from the top recommendations, so each axis explains a reason behind the picks.
                </p>
                <ScentRadarChart metrics={analysis.scentDimensions} />
              </div>

              <div className="p-5 sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d2b886]">Dimension notes</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {analysis.scentDimensions.map(metric => (
                    <ScoreBar key={metric.label} label={metric.label} value={metric.value} inverted caption={metric.explanation} />
                  ))}
                </div>
              </div>
            </div>

            {analysis.topThree.length > 0 && (
              <div className="border-t border-white/10 p-5 sm:p-7">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d2b886]">Top 3 recommendation comparison</p>
                    <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white">Why these rose to the top</h2>
                  </div>
                  <p className="text-sm text-stone-400">Swipe on mobile to compare the match data.</p>
                </div>
                <div className="mt-5 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.06]">
                  <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-[0.16em] text-stone-500">
                        {['Fragrance', 'Match %', 'Climate fit', 'Budget fit', 'Red flag safety', 'Projection fit', 'Best use case'].map(label => (
                          <th key={label} className="border-b border-white/10 px-4 py-3 font-bold">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.topThree.map((result, index) => (
                        <tr key={result.fragrance.id} className="text-stone-200">
                          <td className="border-b border-white/10 px-4 py-4">
                            <Link
                              href={`/fragrances/${brandSlug(result.fragrance.brand)}#result-${result.fragrance.id}`}
                              className="group flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-stone-950">{index + 1}</span>
                              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                                <ProductImage
                                  src={result.fragrance.imageUrl}
                                  alt={`${result.fragrance.brand} ${result.fragrance.name} fragrance bottle`}
                                  eager={index === 0}
                                  sizes="56px"
                                  className="object-contain p-2"
                                />
                              </span>
                              <span className="min-w-0">
                                <span className="block font-bold text-white group-hover:underline">{result.fragrance.name}</span>
                                <span className="block text-xs text-stone-400">{result.fragrance.brand}</span>
                                <span className="mt-1 block max-w-xs text-xs leading-snug text-stone-500">{result.matchReasons[0]}</span>
                              </span>
                            </Link>
                          </td>
                          <td className="border-b border-white/10 px-4 py-4 font-black text-white">{result.matchPercent}%</td>
                          <td className="border-b border-white/10 px-4 py-4">{result.matchBreakdown.climateFit}%</td>
                          <td className="border-b border-white/10 px-4 py-4">{result.matchBreakdown.budgetFit}%</td>
                          <td className="border-b border-white/10 px-4 py-4">{result.matchBreakdown.redFlagSafety}%</td>
                          <td className="border-b border-white/10 px-4 py-4">{result.matchBreakdown.projectionFit}%</td>
                          <td className="border-b border-white/10 px-4 py-4">
                            <span className="block font-semibold text-white">{result.recommendationLabel}</span>
                            <span className="mt-1 block text-xs capitalize text-stone-400">{result.fragrance.occasions.slice(0, 2).map(pretty).join(' / ')}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="border-t border-white/10 p-5 sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d2b886]">Scoring methodology</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MethodCard
                  label="Hard filters passed"
                  value={`${analysis.hardPassed}/${analysis.hardTotal || 0}`}
                  detail="Red flags, budget ceiling, weather fit, and projection rules are checked before ranking."
                />
                <MethodCard
                  label="Soft preferences matched"
                  value={`${analysis.softMatched}/${analysis.softTotal || 0}`}
                  detail="Scent family, occasion, notes, uniqueness, and wearability decide the final order."
                />
                <MethodCard
                  label="Disliked notes avoided"
                  value={analysis.avoided.length ? analysis.avoided.map(pretty).join(', ') : 'None selected'}
                  detail={analysis.avoided.length ? 'These are treated as strict avoid rules.' : 'No hard note dislikes were selected.'}
                />
                <MethodCard
                  label="Missing data warnings"
                  value={analysis.missingData.length ? analysis.missingData.slice(0, 3).join(', ') : 'None'}
                  detail={analysis.missingData.length ? 'Warnings lower confidence when product data is incomplete.' : 'Top matches have enough source and note data for scoring.'}
                />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-stone-400">
                Match quality: {analysis.exactMatches} exact, {analysis.strongMatches} strong, {analysis.partialMatches} partial. If exact matches are limited, ScentMatch shows fewer results rather than breaking your avoid rules.
              </p>
            </div>
          </section>

          <section className="mt-7">
            <section className="min-w-0 rounded-[2rem] border border-stone-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6417]">Refine results</p>
                  <h2 className="mt-2 break-words text-[clamp(1.45rem,6vw,1.7rem)] font-black tracking-[-0.05em] text-stone-950">Want different results?</h2>
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
                      onClick={() => {
                        setActiveMood(filter.id);
                        trackEvent('results_filter_change', { filter: filter.id });
                      }}
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

              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {adjustModes.map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setAdjustMode(mode.id);
                      trackEvent('results_filter_change', { mode: mode.id });
                    }}
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
              <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
                Fragrance is personal. These matches are based on your quiz answers, scent families, notes, budget, and performance preferences. Always sample first when possible.
              </p>
              {strictMatchCount < 7 && (
                <p className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                  Your red flags are strict, so we may show fewer results instead of recommending scents you asked us to avoid. Loosen one avoid filter if you want more options.
                </p>
              )}
              {feedbackMessage && (
                <p className="mt-2 text-xs text-stone-600" aria-live="polite">{feedbackMessage}</p>
              )}
            </section>
          </section>

          <section className="mt-8" aria-label="Detailed fragrance recommendations">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6417]">Why these made the list</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-stone-950">Your recommendations</h2>
              </div>
              <p className="text-sm text-stone-500">Save anything you want to revisit.</p>
            </div>

            {personalisedPool.length > 0 ? (
              <div className="flex flex-col gap-5">
                {personalisedPool.map((result, index) => (
                  <FragranceCard
                    key={`${result.fragrance.id}-card-${activeMood}-${adjustMode}`}
                    result={result}
                    rank={index + 1}
                    currency={currency}
                    onNotMyVibe={handleFeedback}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-stone-200 bg-white/85 p-6 text-center shadow-sm sm:p-8">
                <h3 className="text-xl font-black tracking-[-0.03em] text-stone-950">Your filters got very specific.</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
                  Only a few scents passed. Try allowing moderate strength or widening your budget, then retake the quiz.
                </p>
              </div>
            )}
          </section>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => {
                trackEvent('quiz_retake', { source: 'results_footer' });
                onRestart();
              }}
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

function CircularScore({ value }: { value: number }) {
  const safeValue = clampMetric(value);
  const radius = 39;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative h-24 w-24 shrink-0" aria-label={`${safeValue}% report confidence`}>
      <svg className="-rotate-90" viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black tracking-[-0.05em] text-white">{safeValue}%</span>
      </div>
    </div>
  );
}

function ReportMetric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.07] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
        <span className="text-xl font-black tabular-nums text-white">{clampMetric(value)}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white" style={{ width: `${Math.max(4, clampMetric(value))}%` }} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-stone-400">{detail}</p>
    </article>
  );
}

function MethodCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 break-words text-lg font-black leading-tight text-white">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-stone-400">{detail}</p>
    </article>
  );
}

function ScoreBar({
  label,
  value,
  inverted = false,
  caption,
}: {
  label: string;
  value: number;
  inverted?: boolean;
  caption?: string;
}) {
  const safeValue = clampMetric(value);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className={clsx('text-sm font-semibold', inverted ? 'text-stone-200' : 'text-stone-700')}>{label}</span>
        <span className={clsx('text-sm font-black tabular-nums', inverted ? 'text-white' : 'text-stone-950')}>{safeValue}%</span>
      </div>
      <div className={clsx('h-2 overflow-hidden rounded-full', inverted ? 'bg-white/10' : 'bg-stone-100')}>
        <div
          className={clsx('h-full rounded-full', inverted ? 'bg-white' : 'bg-stone-950')}
          style={{ width: `${Math.max(4, safeValue)}%` }}
        />
      </div>
      {caption && (
        <p className={clsx('mt-1.5 text-xs leading-relaxed', inverted ? 'text-stone-500' : 'text-stone-500')}>
          {caption}
        </p>
      )}
    </div>
  );
}

function ScentRadarChart({ metrics }: { metrics: Array<{ label: string; value: number; explanation?: string }> }) {
  const center = 60;
  const maxRadius = 48;
  const points = metrics.map((metric, index) => {
    const angle = (-90 + (360 / metrics.length) * index) * (Math.PI / 180);
    const radius = (metric.value / 100) * maxRadius;
    return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
  }).join(' ');

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center lg:grid-cols-1">
      <svg viewBox="0 0 120 120" className="mx-auto h-44 w-44" role="img" aria-label="Radar chart of scent dimensions">
        {[0.33, 0.66, 1].map(scale => (
          <polygon
            key={scale}
            points={metrics.map((_, index) => {
              const angle = (-90 + (360 / metrics.length) * index) * (Math.PI / 180);
              const radius = maxRadius * scale;
              return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
          />
        ))}
        <polygon points={points} fill="rgba(210,184,134,0.26)" stroke="#ffffff" strokeWidth="2" />
        {metrics.map((_, index) => {
          const angle = (-90 + (360 / metrics.length) * index) * (Math.PI / 180);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * maxRadius}
              y2={center + Math.sin(angle) * maxRadius}
              stroke="rgba(255,255,255,0.1)"
            />
          );
        })}
        {metrics.map((metric, index) => {
          const angle = (-90 + (360 / metrics.length) * index) * (Math.PI / 180);
          const labelRadius = maxRadius + 7;
          return (
            <text
              key={metric.label}
              x={center + Math.cos(angle) * labelRadius}
              y={center + Math.sin(angle) * labelRadius}
              fill="rgba(255,255,255,0.78)"
              fontSize="6"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {metric.label}
            </text>
          );
        })}
      </svg>
      <div className="grid gap-2">
        {metrics.map(metric => (
          <div key={metric.label} className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2 text-xs">
            <span className="text-stone-300">{metric.label}</span>
            <span className="font-black text-white">{clampMetric(metric.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
