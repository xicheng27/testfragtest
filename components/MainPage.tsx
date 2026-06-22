'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { fragrances } from '@/lib/fragrances';
import AuthModal from './AuthModal';

interface MainPageProps {
  onStartQuiz: () => void;
  onViewShelf: () => void;
  onViewPreviousResults: () => void;
  hasPreviousResults: boolean;
}

export default function MainPage({
  onStartQuiz,
  onViewShelf,
  onViewPreviousResults,
  hasPreviousResults,
}: MainPageProps) {
  const { user, isGuest, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <div className="marble-bg flex min-h-screen flex-col overflow-hidden">
        <header className="border-b border-white/70 bg-white/55 px-4 py-4 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span className="font-semibold tracking-tight text-stone-950">ScentMatch</span>
            <div className="flex items-center gap-3 sm:gap-5">
              <Link href="/fragrances" className="text-sm text-stone-500 transition-colors hover:text-stone-800">
                Fragrances
              </Link>
              <Link href="/about" className="text-sm text-stone-500 transition-colors hover:text-stone-800">
                About
              </Link>
              <button
                type="button"
                onClick={onViewShelf}
                className="text-sm text-stone-500 transition-colors hover:text-stone-800"
              >
                Shelf
              </button>
              {user ? (
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="hidden text-sm text-stone-600 sm:inline">Hi, {user.name.split(' ')[0]}</span>
                  <button type="button" onClick={signOut} className="text-xs text-stone-400 transition-colors hover:text-stone-700">
                    Sign out
                  </button>
                </div>
              ) : isGuest ? (
                <button
                  type="button"
                  onClick={() => setShowSignIn(true)}
                  className="text-xs text-stone-500 transition-colors hover:text-stone-800 sm:text-sm"
                >
                  Create account
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:px-6 sm:py-16">
          <div className="w-full max-w-4xl">
            <div className="mb-5 inline-flex rounded-full border border-stone-200 bg-white/80 px-3 py-1 text-xs font-medium text-stone-600 shadow-sm">
              No account needed. Shelf stays safe.
            </div>
            <div className="mx-auto mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm">
              <svg className="h-5 w-5 text-stone-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
              </svg>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-stone-950 sm:text-5xl">
              Find your next fragrance
            </h1>
            <p className="mx-auto mb-8 mt-3 max-w-md text-sm leading-relaxed text-stone-600">
              Answer quick visual questions about scent, vibe, budget, occasion, and style. We will turn that into useful fragrance picks.
            </p>

            <div className="mx-auto grid max-w-3xl gap-4 text-left">
              <section className="group flex flex-col rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_22px_70px_rgba(28,25,23,0.08)] transition duration-300 hover:-translate-y-1 sm:p-6">
                <p className="text-xs font-semibold text-[#8a6a34]">Fast, visual, fragrance-first</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Recommendation Quiz</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Get a Best Match, Everyday Scent, Date Night Pick, Budget Alternative, and Wildcard Pick.
                </p>
                <div className="my-6 space-y-3">
                  {[
                    { n: '01', text: 'Answer visual questions about your style' },
                    { n: '02', text: `We score ${fragrances.length} fragrances against your answers` },
                    { n: '03', text: 'Save favourites to your Shelf and retake anytime' },
                  ].map(item => (
                    <div key={item.n} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-semibold text-stone-500">
                        {item.n}
                      </span>
                      <span className="text-sm text-stone-700">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={onStartQuiz}
                    className="min-h-12 w-full rounded-2xl bg-stone-950 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(28,25,23,0.18)] transition-all hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0"
                  >
                    Find my scent
                  </button>
                  {hasPreviousResults && (
                    <button
                      type="button"
                      onClick={onViewPreviousResults}
                      className="mt-3 min-h-12 w-full rounded-2xl border border-stone-300 bg-white/70 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950"
                    >
                      View my saved matches
                    </button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {showSignIn && <AuthModal onClose={() => setShowSignIn(false)} initialMode="signup" />}
    </>
  );
}
