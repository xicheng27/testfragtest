'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';
import ProductImage from './ProductImage';
import MobileNav from './MobileNav';
import { useAuth } from '@/lib/auth-context';
import { trackEvent } from '@/lib/analytics';

interface LandingPageProps {
  onStartQuiz: () => void;
}

const heroBottles = [
  {
    name: 'Lazy Sunday Morning',
    brand: 'Maison Margiela',
    imageUrl: '/images/products/replica-lazy-sunday-morning.jpg',
    label: 'fresh out the shower',
  },
  {
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    imageUrl: '/images/products/baccarat-rouge-540.jpg',
    label: 'expensive lobby energy',
  },
  {
    name: 'Cloud',
    brand: 'Ariana Grande',
    imageUrl: '/images/products/ariana-grande-cloud.jpg',
    label: 'soft vanilla era',
  },
] as const;

const previewChips = [
  'Best Match',
  'Safest Pick',
  'Hot Weather Pick',
  'Budget Alternative',
  'Avoids Red Flags',
] as const;

const trendingPicks = [
  { label: 'Clean Everyday', note: 'fresh, easy, school/work-safe' },
  { label: 'Sweet Main Character', note: 'warm, playful, compliment-friendly' },
  { label: 'Quiet Luxury', note: 'smooth, polished, expensive-feeling' },
  { label: 'Date Night', note: 'soft, warm, memorable up close' },
  { label: 'Fresh Hot Weather Pick', note: 'citrus, tea, aquatic, clean musk' },
  { label: 'Budget Alternative', note: 'useful lower-price options when available' },
] as const;

const resultPreviews = [
  {
    category: 'Best Match',
    name: 'Lazy Sunday Morning',
    brand: 'Maison Margiela',
    imageUrl: '/images/products/replica-lazy-sunday-morning.jpg',
  },
  {
    category: 'Date Night',
    name: 'Black Orchid',
    brand: 'Tom Ford',
    imageUrl: '/images/products/black-orchid.jpg',
  },
  {
    category: 'Budget Alt',
    name: 'Cloud',
    brand: 'Ariana Grande',
    imageUrl: '/images/products/ariana-grande-cloud.jpg',
  },
  {
    category: 'Wildcard',
    name: 'Squid',
    brand: 'Zoologist',
    imageUrl: '/images/products/zoologist-squid.jpg',
  },
] as const;

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'signup' | 'login' | null>(null);
  const { continueAsGuest } = useAuth();

  useEffect(() => {
    trackEvent('landing_view');
  }, []);

  const startQuiz = () => {
    trackEvent('quiz_start', { source: 'landing' });
    onStartQuiz();
  };

  return (
    <>
      <div className="marble-bg min-h-screen overflow-x-hidden">
        <header data-ui="site-header" className="sticky top-0 z-30 border-b border-white/60 bg-stone-50/75 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <span className="text-base font-black tracking-[-0.03em] text-stone-950">ScentMatch</span>
            <nav className="hidden items-center gap-6 text-sm text-stone-700 md:flex" aria-label="Primary navigation">
              <a href="#how-it-works" className="transition-colors hover:text-stone-950">How it works</a>
              <a href="#result-types" className="transition-colors hover:text-stone-950">Result types</a>
              <a href="#results-preview" className="transition-colors hover:text-stone-950">Results</a>
              <Link href="/about" className="transition-colors hover:text-stone-950">About</Link>
            </nav>
            <div className="hidden items-center gap-2 md:flex md:gap-3">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-stone-700 transition-colors hover:text-stone-950"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="inline-flex min-h-11 items-center rounded-full border border-stone-950 bg-white px-4 text-sm font-semibold text-stone-950 shadow-[3px_3px_0_#1c1917] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign up
              </button>
            </div>
            <MobileNav
              breakpoint="md"
              label="Open navigation menu"
              cta={{ label: 'Find my scent', onClick: startQuiz }}
              items={[
                { label: 'How it works', href: '#how-it-works' },
                { label: 'Result types', href: '#result-types' },
                { label: 'Results', href: '#results-preview' },
                { label: 'About', href: '/about' },
                { label: 'Disclaimer', href: '/disclaimer' },
                { label: 'Log in', onClick: () => setAuthMode('login') },
                { label: 'Sign up', onClick: () => setAuthMode('signup') },
              ]}
            />
          </div>
        </header>

        <main>
          <section data-ui="hero" className="px-4 pb-10 pt-6 sm:px-6 sm:pb-20 sm:pt-16">
            <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#b08d57]" aria-hidden="true" />
                  No account needed. Takes about 2 minutes.
                </div>
                <h1 className="mt-4 max-w-[12ch] text-[clamp(2.75rem,11vw,5.5rem)] font-black leading-[0.95] tracking-[-0.05em] text-stone-950 [text-wrap:balance] lg:max-w-3xl">
                  Find a fragrance that actually feels like you.
                </h1>
                <p className="mt-4 max-w-[34ch] text-[clamp(1rem,4.2vw,1.15rem)] leading-relaxed text-stone-700 [text-wrap:pretty] sm:max-w-xl">
                  Answer 10 quick visual questions and get scent matches based on your vibe, budget, occasion, weather, and fragrance red flags.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {previewChips.map(chip => (
                    <span key={chip} className="rounded-full border border-stone-200 bg-white/75 px-3 py-1.5 text-xs font-medium text-stone-700">
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-7 grid gap-2 sm:max-w-md sm:grid-cols-[1fr_auto] sm:gap-3">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="sheen relative min-h-14 overflow-hidden rounded-2xl bg-stone-950 px-7 text-base font-bold text-white shadow-[0_18px_45px_rgba(28,25,23,0.22)] transition-transform hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                  >
                    Find my scent
                  </button>
                  <button
                    type="button"
                    onClick={continueAsGuest}
                    className="min-h-11 rounded-2xl border border-transparent px-5 text-sm font-semibold text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-950 sm:min-h-14 sm:border-stone-300 sm:bg-white/80 sm:text-stone-700 sm:no-underline sm:hover:border-stone-950"
                  >
                    Continue as guest
                  </button>
                </div>
                <p className="mt-3 text-xs text-stone-500">No account needed. Takes about 2 minutes. Retake anytime.</p>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="absolute -left-5 top-8 z-10 rotate-[-8deg] rounded-2xl border border-stone-950 bg-[#f3ead8] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-stone-950 shadow-[4px_4px_0_#1c1917]">
                  screenshot-worthy
                </div>
                <div className="rounded-[2rem] border border-stone-200 bg-white/70 p-3 shadow-[0_24px_70px_rgba(28,25,23,0.12)] backdrop-blur">
                  <div className="rounded-[1.55rem] bg-stone-950 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-stone-400">Your vibe scan</p>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-stone-950">98% loaded</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {heroBottles.map((item, index) => (
                        <article
                          key={item.name}
                          className={`soft-float overflow-hidden rounded-2xl bg-white text-stone-950 ${index === 1 ? 'translate-y-4' : ''}`}
                          style={{ animationDelay: `${index * 0.45}s` }}
                        >
                          <div className="relative h-32 bg-white sm:h-40">
                            <ProductImage
                              src={item.imageUrl}
                              alt={`${item.brand} ${item.name} fragrance bottle`}
                              sizes="(max-width: 1023px) 30vw, 180px"
                              className="object-contain p-3"
                            />
                          </div>
                          <div className="border-t border-stone-100 p-2.5">
                            <p className="line-clamp-1 text-[11px] font-bold">{item.name}</p>
                            <p className="mt-1 line-clamp-2 text-[10px] leading-tight text-stone-500">{item.label}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="mt-7 rounded-2xl bg-white p-4 text-stone-950">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a6417]">Best Match</p>
                      <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Fresh, clean, actually wearable.</h2>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">A useful pick based on the scent families, budget, and occasions you chose.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="scroll-mt-24 px-4 py-10 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['01', 'Tap through visual questions', 'Vibe, budget, occasion, red flags. Fast.'],
                  ['02', 'Get fragrance categories', 'Best Match, Everyday, Date Night, Budget, and Wildcard.'],
                  ['03', 'Save your Shelf', 'Keep the ones you actually want to try.'],
                ].map(([number, title, description]) => (
                  <article key={number} className="rounded-[1.5rem] border border-stone-200 bg-white/80 p-5 shadow-sm transition-transform hover:-translate-y-1">
                    <span className="inline-flex rounded-full bg-stone-950 px-3 py-1 text-xs font-bold text-white">{number}</span>
                    <h2 className="mt-5 text-xl font-black tracking-[-0.03em] text-stone-950">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="result-types" className="scroll-mt-24 border-y border-stone-200/80 bg-white/70 px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6417]">Popular result types</p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-stone-950 sm:text-5xl">Clear categories, not random bottles.</h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-stone-600">The quiz sorts matches by actual use case: daily, date night, weather, budget, and wildcard picks.</p>
              </div>
              <div className="mt-8 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
                {trendingPicks.map((item, index) => (
                  <article key={item.label} className="min-w-[13rem] rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-bold text-stone-400">0{index + 1}</p>
                    <h3 className="mt-8 text-lg font-black leading-tight tracking-[-0.03em] text-stone-950">{item.label}</h3>
                    <p className="mt-2 text-xs text-stone-500">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="results-preview" className="scroll-mt-24 px-4 py-12 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="max-w-xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6417]">What you get</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-stone-950 sm:text-5xl">Not just one random bottle.</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">Best match, everyday scent, date night, cheaper option, and wildcard pick.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {resultPreviews.map(item => (
                  <article key={item.category} className="overflow-hidden rounded-[1.4rem] border border-stone-200 bg-white shadow-sm transition-transform hover:-translate-y-1">
                    <div className="relative h-36 border-b border-stone-100 bg-white sm:h-48">
                      <ProductImage
                        src={item.imageUrl}
                        alt={`${item.brand} ${item.name} fragrance bottle`}
                        sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 260px"
                        className="object-contain p-4 sm:p-6"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a6417]">{item.category}</p>
                      <h3 className="mt-2 text-sm font-bold leading-tight text-stone-950 sm:text-base">{item.name}</h3>
                      <p className="mt-1 text-xs text-stone-500">{item.brand}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 pb-14 sm:px-6 sm:pb-20">
            <div className="mx-auto rounded-[1.6rem] bg-stone-950 p-6 text-white sm:max-w-6xl sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Trust note</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Useful recommendations, not a sales page.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-300">
                ScentMatch is independent. Product names and images are used for identification. Use official brand or retailer links when available, and sample first when you can.
              </p>
            </div>
          </section>
        </main>

        <footer id="footer" className="border-t border-stone-200/70 bg-stone-950 px-4 py-10 text-white sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
              <div className="max-w-sm">
                <p className="font-black tracking-tight">ScentMatch</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">
                  Fragrance discovery for your current era.
                </p>
              </div>
              <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3" aria-label="Footer navigation">
                <Link href="/about" className="text-stone-300 transition-colors hover:text-white">About</Link>
                <Link href="/disclaimer" className="text-stone-300 transition-colors hover:text-white">Disclaimer</Link>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-stone-300 transition-colors hover:text-white">Instagram</a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-stone-300 transition-colors hover:text-white">TikTok</a>
              </nav>
            </div>
            <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} ScentMatch</span>
              <span>Take the quiz. Screenshot the result. Build your Shelf.</span>
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
