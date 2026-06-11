'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PersonalityQuizResult } from '@/lib/personality-quiz';
import { useShelf } from '@/lib/shelf-context';
import FragranceCard from './FragranceCard';

interface PersonalityResultPageProps {
  result: PersonalityQuizResult;
  onReplay: () => void;
  onHome: () => void;
  onViewShelf: () => void;
}

export default function PersonalityResultPage({
  result,
  onReplay,
  onHome,
  onViewShelf,
}: PersonalityResultPageProps) {
  const [shareLabel, setShareLabel] = useState('Share result');
  const { shelfIds } = useShelf();
  const { profile, recommendations } = result;

  const shareResult = async () => {
    const text = `My ScentMatch fragrance personality is ${profile.title}: ${profile.scentProfile.join(', ')}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareLabel('Copied');
        window.setTimeout(() => setShareLabel('Share result'), 1600);
      }
    } catch {
      setShareLabel('Share result');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200/80 bg-stone-50 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button type="button" onClick={onHome} className="text-sm font-semibold tracking-tight text-stone-950">
            ScentMatch
          </button>
          <nav className="flex items-center gap-4 text-sm text-stone-500">
            <Link href="/about" className="transition-colors hover:text-stone-950">About</Link>
            <button type="button" onClick={onViewShelf} className="transition-colors hover:text-stone-950">
              Shelf{shelfIds.length ? ` (${shelfIds.length})` : ''}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <section className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${profile.accent} p-6 shadow-sm sm:p-10`}>
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/70 bg-white/30" />
          <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-stone-950/5 bg-white/20" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">Your fragrance personality</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-stone-950 sm:text-6xl">
              {profile.title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-stone-700 sm:text-base">{profile.explanation}</p>

            <div className="mt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Your scent profile</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.scentProfile.map(note => (
                  <span key={note} className="rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs font-medium capitalize text-stone-800 backdrop-blur">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={shareResult}
                className="min-h-12 rounded-xl bg-stone-950 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                {shareLabel}
              </button>
              <button
                type="button"
                onClick={onReplay}
                className="min-h-12 rounded-xl border border-stone-950/20 bg-white/45 px-6 text-sm font-medium text-stone-800 transition-colors hover:bg-white/75"
              >
                Replay with new pairings
              </button>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-400">Your personality wardrobe</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Three scents for this version of you</h2>
          </div>
          <div className="space-y-5">
            {recommendations.map(fragrance => (
              <FragranceCard key={fragrance.id} fragrance={fragrance} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
