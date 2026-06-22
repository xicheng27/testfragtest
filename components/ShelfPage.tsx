'use client';

import Link from 'next/link';
import { useShelf } from '@/lib/shelf-context';
import { useAuth } from '@/lib/auth-context';
import ShelfCard from './ShelfCard';

interface ShelfPageProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

export default function ShelfPage({ onBack, onStartQuiz }: ShelfPageProps) {
  const { shelfFragrances } = useShelf();
  const { user, isGuest } = useAuth();

  return (
    <div className="marble-bg min-h-screen">
      <header className="sticky top-0 z-10 border-b border-stone-200/70 bg-stone-50/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-950"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-sm font-semibold tracking-tight text-stone-950">ScentMatch</span>
          <div className="flex min-w-16 items-center justify-end gap-3 text-right">
            <Link href="/about" className="text-xs text-stone-400 transition-colors hover:text-stone-950">About</Link>
            <span className="text-xs text-stone-400">
              {shelfFragrances.length} {shelfFragrances.length === 1 ? 'scent' : 'scents'}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-stone-400">
            {user ? `${user.name.split(' ')[0]}'s collection` : 'Your collection'}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950">Shelf</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
            A considered place for fragrances you want to revisit.
            {isGuest ? ' This guest Shelf stays only in this browser.' : ' It is connected to your account.'}
          </p>
        </div>

        {shelfFragrances.length > 0 ? (
          <div className="space-y-4">
            {shelfFragrances.map(fragrance => (
              <ShelfCard key={fragrance.id} fragrance={fragrance} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center sm:px-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 19.5h16M6 16V5.5A1.5 1.5 0 017.5 4h9A1.5 1.5 0 0118 5.5V16M9 8h6M9 11h6" />
              </svg>
            </div>
            <h2 className="mt-5 font-medium text-stone-950">Your shelf is empty.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
              Add fragrances you love from your recommendations.
            </p>
            <button
              type="button"
              onClick={onStartQuiz}
              className="mt-6 rounded-xl bg-stone-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              Take the quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
