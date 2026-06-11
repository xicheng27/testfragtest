'use client';
import { useState } from 'react';
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

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        {/* Nav */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-stone-100">
          <span className="font-semibold text-stone-900 tracking-tight">ScentMatch</span>
          <div className="flex items-center gap-3">
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
        </header>

        <main className="px-6 py-10 max-w-2xl mx-auto">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-stone-900">Your matches</h1>
            <p className="text-stone-500 font-light text-sm mt-1">
              A best match, considered alternatives, and a few different directions.
            </p>
          </div>

          {/* Cards */}
          <div className="space-y-5">
            {results.map((result, i) => (
              <FragranceCard
                key={result.fragrance.id}
                result={result}
                rank={i + 1}
              />
            ))}
          </div>

          {/* Extended quiz upsell */}
          {!isExtended && (
            <div className="mt-8 p-6 rounded-2xl bg-white border border-stone-200 text-center">
              <h3 className="font-medium text-stone-900 mb-1">Want a more accurate recommendation?</h3>
              <p className="text-sm text-stone-500 font-light mb-4">
                Answer a few more questions and we can fine-tune your results.
              </p>
              <button
                onClick={onExtendedQuiz}
                className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-500 hover:text-stone-900 transition-colors"
              >
                Take the extended quiz
              </button>
            </div>
          )}

          {/* Restart */}
          <div className="mt-6 text-center">
            <button
              onClick={onRestart}
              className="text-sm text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2"
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
