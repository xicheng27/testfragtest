'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';
import ProductImage from './ProductImage';
import { useAuth } from '@/lib/auth-context';

interface LandingPageProps {
  onStartQuiz: () => void;
}

const steps = [
  {
    number: '01',
    title: 'Answer quick visual questions',
    description: 'Tell us about your taste, vibe, budget, occasion, and personality.',
  },
  {
    number: '02',
    title: 'Get personalised fragrance matches',
    description: 'See clear recommendations without needing to know fragrance jargon.',
  },
  {
    number: '03',
    title: 'Save favourites to your Shelf',
    description: 'Keep the scents worth revisiting in one simple personal collection.',
  },
] as const;

const resultPreviews = [
  {
    category: 'Best daily scent',
    name: 'Lazy Sunday Morning',
    brand: 'Maison Margiela',
    imageUrl: '/images/products/replica-lazy-sunday-morning.jpg',
  },
  {
    category: 'Date night pick',
    name: 'Molecule 01',
    brand: 'Escentric Molecules',
    imageUrl: '/images/products/molecule-01.jpg',
  },
  {
    category: 'Affordable alternative',
    name: 'Cloud',
    brand: 'Ariana Grande',
    imageUrl: '/images/products/ariana-grande-cloud.jpg',
  },
  {
    category: 'Fresh clean option',
    name: 'CK One',
    brand: 'Calvin Klein',
    imageUrl: '/images/products/ck-one.jpg',
  },
] as const;

const trustPoints = [
  'Built for people who do not speak fragrance jargon',
  'Designer, niche, affordable, and inspired-by options',
  'No account needed to try the quiz',
] as const;

const pendingFooterLinks = ['Contact', 'Privacy', 'Terms', 'Instagram', 'TikTok'] as const;

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'signup' | 'login' | null>(null);
  const { continueAsGuest } = useAuth();

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-stone-50">
        <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-stone-50/90 px-4 py-3.5 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span className="text-base font-semibold tracking-tight text-stone-950">ScentMatch</span>
            <nav className="hidden items-center gap-6 text-sm text-stone-500 md:flex" aria-label="Primary navigation">
              <a href="#how-it-works" className="transition-colors hover:text-stone-950">How it works</a>
              <a href="#results-preview" className="transition-colors hover:text-stone-950">What you get</a>
              <Link href="/about" className="transition-colors hover:text-stone-950">About</Link>
            </nav>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-sm text-stone-500 transition-colors hover:text-stone-950"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-800 transition-colors hover:border-stone-500"
              >
                Sign up
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-4xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">
                A short visual fragrance quiz
              </p>
              <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-stone-950 sm:text-7xl">
                Find a scent that feels like you.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
                Take a short visual quiz and get personalised fragrance matches based on your taste, vibe, budget, occasion, and personality.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-500">
                <span>No fragrance knowledge needed</span>
                <span className="hidden h-1 w-1 rounded-full bg-stone-300 sm:block" />
                <span>About two minutes</span>
                <span className="hidden h-1 w-1 rounded-full bg-stone-300 sm:block" />
                <span>No account required</span>
              </div>

              <div className="mx-auto mt-9 max-w-sm">
                <button
                  type="button"
                  onClick={onStartQuiz}
                  className="min-h-14 w-full rounded-xl bg-stone-950 px-7 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-lg"
                >
                  Find my scent
                </button>
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="mt-4 rounded-md text-sm text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
                >
                  Continue as guest
                </button>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="scroll-mt-24 border-y border-stone-200/70 bg-white px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="max-w-xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">How it works</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stone-950 sm:text-4xl">
                  Clear answers, not a fragrance exam.
                </h2>
              </div>
              <div className="mt-10 grid gap-3 md:grid-cols-3">
                {steps.map(step => (
                  <article key={step.number} className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5 sm:p-6">
                    <span className="text-xs font-medium tracking-[0.18em] text-stone-400">{step.number}</span>
                    <h3 className="mt-8 text-lg font-semibold tracking-tight text-stone-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="results-preview" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div className="max-w-xl">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">What you get</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stone-950 sm:text-4xl">
                    More than one good answer.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-500 sm:text-base">
                    Your results include a best match and useful alternatives for different moods, budgets, and occasions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartQuiz}
                  className="self-start rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 transition-colors hover:border-stone-500 sm:self-auto"
                >
                  Start the quiz
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {resultPreviews.map(item => (
                  <article key={item.category} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    <div className="relative h-40 border-b border-stone-100 bg-white sm:h-48">
                      <ProductImage
                        src={item.imageUrl}
                        alt={`${item.brand} ${item.name} editorial fragrance artwork`}
                        sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 260px"
                        className="object-contain p-5 sm:p-6"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">{item.category}</p>
                      <h3 className="mt-2 text-sm font-semibold leading-tight text-stone-950 sm:text-base">{item.name}</h3>
                      <p className="mt-1 text-xs text-stone-500">{item.brand}</p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-400">Example result format. Your recommendations are personalised to your answers.</p>
            </div>
          </section>

          <section className="border-t border-stone-200/70 bg-white px-4 py-14 sm:px-6">
            <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">Made to feel approachable</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                  Fragrance discovery without the gatekeeping.
                </h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {trustPoints.map(point => (
                  <div key={point} className="flex items-start gap-2.5 rounded-xl border border-stone-200 bg-stone-50/60 p-3.5">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs leading-relaxed text-stone-600">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer id="footer" className="border-t border-stone-200/70 bg-stone-950 px-4 py-10 text-white sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
              <div className="max-w-sm">
                <p className="font-semibold tracking-tight">ScentMatch</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">
                  A simpler way to discover fragrances that fit your taste, life, and budget.
                </p>
              </div>
              <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3" aria-label="Footer navigation">
                <Link href="/about" className="text-stone-300 transition-colors hover:text-white">About</Link>
                {pendingFooterLinks.map(label => (
                  <span
                    key={label}
                    className="inline-flex cursor-default items-center gap-1.5 text-stone-500"
                    title={`${label} page coming soon`}
                    aria-label={`${label}, coming soon`}
                  >
                    {label}
                    <span className="text-[9px] uppercase tracking-wider text-stone-600">Soon</span>
                  </span>
                ))}
              </nav>
            </div>
            <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} ScentMatch</span>
              <span>Personal recommendations, no fragrance knowledge required.</span>
            </div>
          </div>
        </footer>
      </div>

      {authMode && (
        <AuthModal
          initialMode={authMode}
          allowGuest
          onClose={() => setAuthMode(null)}
        />
      )}
    </>
  );
}
