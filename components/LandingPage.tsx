'use client';
import { useState } from 'react';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/auth-context';

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const { continueAsGuest } = useAuth();

  return (
    <>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        {/* Nav */}
        <header className="px-6 py-5 flex items-center justify-between">
          <span className="font-semibold text-stone-900 tracking-tight text-lg">ScentMatch</span>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="max-w-md">
            {/* Wordmark */}
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900 mb-6">
                {/* Simple drop/scent icon */}
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-stone-900 leading-tight tracking-tight">
                ScentMatch
              </h1>
              <p className="mt-3 text-lg text-stone-500 font-light leading-relaxed">
                Find a fragrance that actually feels like you.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={continueAsGuest}
                className="w-full py-3.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:border-stone-500 hover:text-stone-900 transition-colors"
              >
                Continue as guest
              </button>
            </div>

            {/* Social proof hint */}
            <p className="mt-8 text-xs text-stone-400 font-light">
              No account required. No ads. Just your perfect scent.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 text-center text-xs text-stone-400 font-light">
          © {new Date().getFullYear()} ScentMatch
        </footer>
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} mode="entry" />}
    </>
  );
}
