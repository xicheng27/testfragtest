'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { fragrances } from '@/lib/fragrances';
import AuthModal from './AuthModal';
import MobileNav, { type MobileNavItem } from './MobileNav';

interface MainPageProps {
  onStartQuiz: () => void;
  onViewShelf: () => void;
  onViewPreviousResults: () => void;
  onResumeQuiz: () => void;
  onStartOver: () => void;
  hasDraftProgress: boolean;
  hasPreviousResults: boolean;
}

export default function MainPage({
  onStartQuiz,
  onViewShelf,
  onViewPreviousResults,
  onResumeQuiz,
  onStartOver,
  hasDraftProgress,
  hasPreviousResults,
}: MainPageProps) {
  const { user, isGuest, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  const menuItems: MobileNavItem[] = [
    { label: 'Fragrances', href: '/fragrances' },
    { label: 'About', href: '/about' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'My Shelf', onClick: onViewShelf },
    ...(hasDraftProgress ? [{ label: 'Resume quiz', onClick: onResumeQuiz }] : []),
    ...(hasPreviousResults ? [{ label: 'My saved matches', onClick: onViewPreviousResults }] : []),
    user
      ? { label: 'Sign out', onClick: signOut }
      : { label: 'Sign up', onClick: () => setShowSignIn(true) },
  ];

  return (
    <>
      <div className="marble-bg flex min-h-screen flex-col overflow-hidden">
        <header data-ui="site-header" className="border-b border-white/70 bg-white/65 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <span className="shrink-0 font-semibold tracking-tight text-stone-950">ScentMatch</span>
            <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-5">
              <Link href="/fragrances" className="hidden text-sm text-stone-600 transition-colors hover:text-stone-950 sm:inline">
                Fragrances
              </Link>
              <Link href="/about" className="hidden text-sm text-stone-600 transition-colors hover:text-stone-950 sm:inline">
                About
              </Link>
              <button
                type="button"
                onClick={onViewShelf}
                className="inline-flex min-h-11 items-center rounded-full border border-stone-200 bg-white/80 px-4 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:border-stone-400 hover:text-stone-950"
              >
                Shelf
              </button>
              {user ? (
                <div className="hidden min-w-0 items-center gap-3 sm:flex">
                  <span className="text-sm text-stone-600">Hi, {user.name.split(' ')[0]}</span>
                  <button type="button" onClick={signOut} className="whitespace-nowrap text-xs text-stone-500 transition-colors hover:text-stone-800">
                    Sign out
                  </button>
                </div>
              ) : isGuest ? (
                <button
                  type="button"
                  onClick={() => setShowSignIn(true)}
                  className="hidden min-h-11 items-center whitespace-nowrap rounded-full px-1 text-sm text-stone-600 transition-colors hover:text-stone-950 sm:inline-flex"
                >
                  Sign up
                </button>
              ) : null}
              <MobileNav
                breakpoint="sm"
                label="Open navigation menu"
                cta={{ label: 'Find my scent', onClick: onStartQuiz }}
                items={menuItems}
              />
            </div>
          </div>
        </header>

        <main data-ui="hero" className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-16">
          <div className="w-full max-w-4xl">
            <div className="mb-5 inline-flex rounded-full border border-stone-200 bg-white/80 px-3 py-1 text-xs font-medium text-stone-600 shadow-sm">
              No account needed. Shelf stays safe.
            </div>
            <div className="mx-auto mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm">
              <svg className="h-5 w-5 text-stone-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
              </svg>
            </div>

            <h1 className="mx-auto max-w-[13ch] text-[clamp(2.35rem,9vw,3rem)] font-semibold leading-[1] tracking-[-0.04em] text-stone-950 [text-wrap:balance]">
              Find a fragrance that actually feels like you
            </h1>
            <p className="mx-auto mb-6 mt-3 max-w-[34ch] text-base leading-relaxed text-stone-600 [text-wrap:pretty]">
              Answer a few vibe, scent, budget, and occasion questions to get personalised fragrance matches.
            </p>

            <div className="mx-auto grid max-w-3xl gap-4 text-left">
              {hasDraftProgress && (
                <section className="rounded-[1.6rem] border border-stone-300 bg-stone-950 p-4 text-white shadow-[0_18px_50px_rgba(28,25,23,0.18)] sm:p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">Continue your quiz?</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">Pick up where you left off.</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-300">Your answers are saved in this browser.</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={onResumeQuiz}
                      className="min-h-12 rounded-2xl bg-white px-5 text-sm font-bold text-stone-950 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      onClick={onStartOver}
                      className="min-h-12 rounded-2xl border border-white/20 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                    >
                      Start over
                    </button>
                  </div>
                </section>
              )}

              <section className="group flex flex-col rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_22px_70px_rgba(28,25,23,0.08)] transition duration-300 hover:-translate-y-1 sm:p-6">
                <p className="text-xs font-semibold text-[#8a6417]">Fast, visual, fragrance-first</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Recommendation Quiz</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
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
                    className="min-h-14 w-full rounded-2xl bg-stone-950 text-base font-bold text-white shadow-[0_14px_34px_rgba(28,25,23,0.18)] transition-all hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0"
                  >
                    Start Quiz
                  </button>
                  <button
                    type="button"
                    onClick={onViewShelf}
                    className="mt-3 min-h-12 w-full rounded-2xl border border-stone-200 bg-white/70 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950"
                  >
                    View my Shelf
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
