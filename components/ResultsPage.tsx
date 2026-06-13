'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ScoredFragrance } from '@/lib/scoring';
import FragranceCard from './FragranceCard';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/auth-context';
import { useShelf } from '@/lib/shelf-context';

interface ResultsPageProps {
  results: ScoredFragrance[];
  onRestart: () => void;
  onExtendedQuiz: () => void;
  onViewShelf: () => void;
  isExtended: boolean;
}

export default function ResultsPage({ results, onRestart, onExtendedQuiz, onViewShelf, isExtended }: ResultsPageProps) {
  const { user, signOut } = useAuth();
  const { shelfIds } = useShelf();
  const [showSignIn, setShowSignIn] = useState(false);

  const similarById = useMemo(() => {
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
  }, [results]);

  const resultMix = useMemo(() => {
    const tiers = new Set(results.map(result => result.fragrance.tier));
    const hasAffordable = results.some(result => (
      result.fragrance.priceRange === 'budget' || result.fragrance.priceRange === 'mid'
    ));
    const hasAlternative = results.some(result => result.fragrance.isDupe);
    return [
      tiers.has('designer') ? 'Designer' : null,
      tiers.has('niche') ? 'Niche' : null,
      hasAffordable ? 'Affordable option' : null,
      hasAlternative ? 'Inspired-by alternative' : null,
    ].filter((label): label is string => Boolean(label));
  }, [results]);

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        <header className="border-b border-stone-200/70 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-semibold tracking-tight text-stone-950">ScentMatch</span>
          <div className="flex items-center gap-3">
            <Link href="/about" className="text-sm text-stone-500 transition-colors hover:text-stone-800">
              About
            </Link>
            <button
              onClick={onViewShelf}
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              Shelf{shelfIds.length > 0 ? ` (${shelfIds.length})` : ''}
            </button>
            {user ? (
              <>
              <span className="text-sm text-stone-500">{user.name.split(' ')[0]}</span>
              <button onClick={signOut} className="text-xs text-stone-400 hover:text-stone-700 transition-colors">Sign out</button>
              </>
            ) : (
              <button onClick={() => setShowSignIn(true)} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                Log In
              </button>
            )}
          </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white">
              <svg className="h-5 w-5 text-stone-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">Your matches</h1>
            <p className="mt-2 text-sm text-stone-500">
              Personalised from your scent preferences, lifestyle, budget, and visual choices.
            </p>
            {resultMix.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Recommendation variety">
                {resultMix.map(label => (
                  <span key={label} className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600">
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {results.map((result, i) => (
              <FragranceCard
                key={result.fragrance.id}
                result={result}
                rank={i + 1}
                similarFragrance={similarById.get(result.fragrance.id)?.fragrance}
              />
            ))}
          </div>

          {!isExtended && (
            <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 text-center sm:p-8">
              <h3 className="mb-1 font-medium text-stone-900">Want a more accurate recommendation?</h3>
              <p className="mb-4 text-sm text-stone-500">
                Answer a few more questions and we can fine-tune your results.
              </p>
              <button
                onClick={onExtendedQuiz}
                className="min-h-11 rounded-xl border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                Take the extended quiz
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onRestart}
              className="min-h-11 rounded-lg px-3 text-sm text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              Start over
            </button>
          </div>
        </main>
      </div>

      {showSignIn && <AuthModal onClose={() => setShowSignIn(false)} initialMode="login" />}
    </>
  );
}
