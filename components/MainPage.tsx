'use client';
import { useAuth } from '@/lib/auth-context';
import AuthModal from './AuthModal';
import { useState } from 'react';

interface MainPageProps {
  onStartQuiz: (extended?: boolean) => void;
  onViewSaved: () => void;
}

export default function MainPage({ onStartQuiz, onViewSaved }: MainPageProps) {
  const { user, isGuest, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        {/* Nav */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-stone-100">
          <span className="font-semibold text-stone-900 tracking-tight">ScentMatch</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onViewSaved}
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              My List
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={signOut} className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
                  Sign out
                </button>
              </div>
            ) : isGuest ? (
              <button
                onClick={() => setShowSignIn(true)}
                className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
              >
                Sign in
              </button>
            ) : null}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="max-w-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mb-3">
              Discover your scent
            </h2>
            <p className="text-stone-500 font-light text-sm leading-relaxed mb-8">
              Answer a few questions about your taste, lifestyle, and aesthetic.
              We&apos;ll recommend fragrances that match your vibe.
            </p>

            {/* How it works */}
            <div className="text-left bg-white rounded-2xl border border-stone-200 p-5 mb-8 space-y-3">
              {[
                { n: '01', text: 'Answer ~12 questions about your style' },
                { n: '02', text: 'We score 170+ fragrances against your answers' },
                { n: '03', text: 'Get five personalised directions' },
              ].map(step => (
                <div key={step.n} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-stone-400 tracking-widest w-6 shrink-0">{step.n}</span>
                  <span className="text-sm text-stone-700">{step.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onStartQuiz(false)}
              className="w-full py-4 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors"
            >
              Start Quiz
            </button>
            <p className="text-xs text-stone-400 mt-3 font-light">Takes about 2 minutes</p>
          </div>
        </main>
      </div>

      {showSignIn && <AuthModal onClose={() => setShowSignIn(false)} mode="signin" />}
    </>
  );
}
