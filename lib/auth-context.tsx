'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthActionResult,
  AuthUser,
  localAuthRepository,
} from './auth-storage';

interface AuthContextValue {
  user: AuthUser | null;
  isGuest: boolean;
  isReady: boolean;
  profileId: string | null;
  hasEnteredApp: boolean;
  signUp: (name: string, email: string, password: string) => Promise<AuthActionResult>;
  logIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const restore = window.setTimeout(async () => {
      const session = await localAuthRepository.restoreSession();
      if (cancelled) return;
      setUser(session.user);
      setIsGuest(session.isGuest);
      setIsReady(true);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(restore);
    };
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const result = await localAuthRepository.signUp(name, email, password);
    if (result.ok && result.user) {
      setUser(result.user);
      setIsGuest(false);
    }
    return result;
  }, []);

  const logIn = useCallback(async (email: string, password: string) => {
    const result = await localAuthRepository.logIn(email, password);
    if (result.ok && result.user) {
      setUser(result.user);
      setIsGuest(false);
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    localAuthRepository.clearSession();
    setUser(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    localAuthRepository.continueAsGuest();
    setUser(null);
    setIsGuest(true);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isGuest,
    isReady,
    profileId: user?.id ?? (isGuest ? 'guest' : null),
    hasEnteredApp: Boolean(user || isGuest),
    signUp,
    logIn,
    signOut,
    continueAsGuest,
  }), [continueAsGuest, isGuest, isReady, logIn, signOut, signUp, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
