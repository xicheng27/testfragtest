'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import AuthModal from './AuthModal';

interface MainPageProps {
  onStartQuiz: () => void;
  onStartPersonalityQuiz: () => void;
  onViewShelf: () => void;
  onViewPreviousResults: () => void;
  hasPreviousResults: boolean;
}

export default function MainPage({
  onStartQuiz,
  onStartPersonalityQuiz,
  onViewShelf,
  onViewPreviousResults,
  hasPreviousResults,
}: MainPageProps) {
  const { user, isGuest, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-stone-50">
        <header className="flex items-center justify-between border-b border-stone-100 px-4 py-4 sm:px-6 sm:py-5">
          <span className="font-semibold tracking-tight text-stone-900">ScentMatch</span>
          <div className="flex items-center gap-2.5 sm:gap-4">
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
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="w-full max-w-4xl">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
              </svg>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Discover your scent
            </h1>
            <p className="mx-auto mb-10 mt-3 max-w-md text-sm font-light leading-relaxed text-stone-500">
              Find fragrances that fit your life, or take the less serious route and reveal your oddly specific scent personality.
            </p>

            <div className="grid gap-4 text-left md:grid-cols-2">
              <section className="flex flex-col rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">Find your match</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Recommendation Quiz</h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-stone-500">
                  Tell us what you enjoy, where you wear fragrance, and what you want to spend.
                </p>
                <div className="my-6 space-y-3">
                  {[
                    { n: '01', text: 'Answer visual questions about your style' },
                    { n: '02', text: 'We score 175 fragrances against your answers' },
                    { n: '03', text: 'Get five personalised directions' },
                  ].map(item => (
                    <div key={item.n} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 text-xs font-medium tracking-widest text-stone-400">{item.n}</span>
                      <span className="text-sm text-stone-700">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={onStartQuiz}
                    className="min-h-12 w-full rounded-xl bg-stone-900 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                  >
                    Start recommendation quiz
                  </button>
                  {hasPreviousResults && (
                    <button
                      type="button"
                      onClick={onViewPreviousResults}
                      className="mt-3 min-h-12 w-full rounded-xl border border-stone-300 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950"
                    >
                      View my saved matches
                    </button>
                  )}
                </div>
              </section>

              <section className="flex flex-col overflow-hidden rounded-3xl bg-stone-950 p-5 text-white sm:p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">Just for fun</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">Fragrance Personality Quiz</h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-stone-400">
                  Choose between randomized scents and scenes. We will reveal your Spotify Wrapped-style fragrance personality.
                </p>
                <div className="my-7 grid grid-cols-2 gap-2">
                  {['Midnight Library Romantic', 'Clean Girl With a Secret', 'Cedarwood Overthinker', 'Beach Club Daydreamer'].map(label => (
                    <span key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-snug text-stone-300">
                      {label}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onStartPersonalityQuiz}
                  className="mt-auto min-h-12 w-full rounded-xl bg-white text-sm font-medium text-stone-950 transition-colors hover:bg-stone-100"
                >
                  Reveal my personality
                </button>
                <p className="mt-3 text-center text-xs font-light text-stone-500">7 quick choices · new pairings each replay</p>
              </section>
            </div>
          </div>
        </main>
      </div>

      {showSignIn && <AuthModal onClose={() => setShowSignIn(false)} initialMode="signup" />}
    </>
  );
}
