'use client';

import FragranceCard from './FragranceCard';
import { useSavedFragrances } from '@/lib/saved-fragrances-context';

interface SavedListPageProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

export default function SavedListPage({ onBack, onStartQuiz }: SavedListPageProps) {
  const { savedFragrances } = useSavedFragrances();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-stone-50/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-sm font-semibold tracking-tight text-stone-900">ScentMatch</span>
          <span className="min-w-16 text-right text-xs text-stone-400">
            {savedFragrances.length} saved
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-400">Your collection</p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">My List</h1>
          <p className="mt-2 text-sm font-light text-stone-500">
            Fragrances you want to revisit, stored on this device.
          </p>
        </div>

        {savedFragrances.length > 0 ? (
          <div className="space-y-5">
            {savedFragrances.map(fragrance => (
              <FragranceCard key={fragrance.id} fragrance={fragrance} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
            <h2 className="font-medium text-stone-900">Your list is ready for a first scent.</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm font-light leading-relaxed text-stone-500">
              Save any recommendation and it will appear here. Guest saves stay available in this browser.
            </p>
            <button
              onClick={onStartQuiz}
              className="mt-6 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              Take the quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
