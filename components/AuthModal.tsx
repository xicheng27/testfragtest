'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import clsx from 'clsx';

type AuthMode = 'signup' | 'login';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: AuthMode;
  allowGuest?: boolean;
}

export default function AuthModal({
  onClose,
  initialMode = 'login',
  allowGuest = false,
}: AuthModalProps) {
  const { signUp, logIn, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (mode === 'signup' && !trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (mode === 'signup' && password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = mode === 'signup'
      ? await signUp(trimmedName, trimmedEmail, password)
      : await logIn(trimmedEmail, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-800"
          aria-label="Close account dialog"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-400">Your ScentMatch account</p>
        <h2 id="auth-title" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-stone-500">
          Your Shelf and quiz matches stay connected to this account on this browser.
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1">
          {(['signup', 'login'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => changeMode(option)}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                mode === option
                  ? 'bg-white text-stone-950 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800',
              )}
            >
              {option === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-stone-600">Name</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={event => { setName(event.target.value); setError(''); }}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-500"
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={event => { setEmail(event.target.value); setError(''); }}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-500"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Password</span>
            <input
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={event => { setPassword(event.target.value); setError(''); }}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-500"
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
            />
          </label>
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-stone-600">Confirm password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={event => { setConfirmPassword(event.target.value); setError(''); }}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-500"
                placeholder="Repeat your password"
              />
            </label>
          )}

          {error && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-stone-950 py-3.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        {allowGuest && (
          <>
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-100" />
              <span className="text-xs text-stone-400">or</span>
              <div className="h-px flex-1 bg-stone-100" />
            </div>
            <button
              type="button"
              onClick={() => { continueAsGuest(); onClose(); }}
              className="w-full rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-900"
            >
              Continue as Guest
            </button>
          </>
        )}

        <p className="mt-5 text-center text-[11px] leading-relaxed text-stone-400">
          Prototype accounts are stored only in this browser and can be replaced by a hosted auth service later.
        </p>
      </div>
    </div>
  );
}
