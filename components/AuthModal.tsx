'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface AuthModalProps {
  onClose: () => void;
  mode?: 'signin' | 'entry'; // entry = landing page choice, signin = save prompt
}

export default function AuthModal({ onClose, mode = 'entry' }: AuthModalProps) {
  const { signIn, continueAsGuest } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email.'); return; }
    signIn(name.trim(), email.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-stone-900">
            {mode === 'entry' ? 'Welcome to ScentMatch' : 'Save your results'}
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            {mode === 'entry'
              ? 'Sign in to save your results, or continue as a guest.'
              : 'Sign in to save your fragrance recommendations.'}
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors mt-1"
          >
            Sign in
          </button>
        </form>

        {mode === 'entry' && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-xs text-stone-400">or</span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>
            <button
              onClick={() => { continueAsGuest(); onClose(); }}
              className="w-full py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:border-stone-400 hover:text-stone-800 transition-colors"
            >
              Continue as guest
            </button>
          </>
        )}
      </div>
    </div>
  );
}
