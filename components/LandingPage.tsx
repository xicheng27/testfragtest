'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/auth-context';

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<'signup' | 'login' | null>(null);
  const { continueAsGuest } = useAuth();

  return (
    <>
      <div className="flex min-h-screen flex-col bg-stone-50">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <span className="text-lg font-semibold tracking-tight text-stone-950">ScentMatch</span>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-950">
              About
            </Link>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-950"
            >
              Log In
            </button>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-16 text-center">
          <div className="max-w-lg">
            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
              </svg>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-400">Personal fragrance discovery</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-6xl">
              Find the scent that feels like you.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base font-light leading-relaxed text-stone-500 sm:text-lg">
              A visual fragrance quiz, thoughtful recommendations, and a personal Shelf for everything worth remembering.
            </p>

            <div className="mx-auto mt-9 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="flex-1 rounded-xl bg-stone-950 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="flex-1 rounded-xl border border-stone-300 px-6 py-3.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950"
              >
                Log In
              </button>
            </div>
            <button
              type="button"
              onClick={continueAsGuest}
              className="mt-5 text-sm text-stone-400 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-700"
            >
              Continue as Guest
            </button>
            <p className="mt-6 text-xs font-light text-stone-400">
              Guest quiz data and Shelf items stay separate from account data.
            </p>
          </div>
        </main>

        <footer className="px-6 py-5 text-center text-xs font-light text-stone-400">
          © {new Date().getFullYear()} ScentMatch
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
