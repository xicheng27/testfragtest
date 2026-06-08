'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  continueAsGuest: () => void;
  hasEnteredApp: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  const signIn = (name: string, email: string) => {
    setUser({ name, email });
    setIsGuest(false);
    setHasEnteredApp(true);
  };

  const signOut = () => {
    setUser(null);
    setIsGuest(false);
    setHasEnteredApp(false);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setHasEnteredApp(true);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, signIn, signOut, continueAsGuest, hasEnteredApp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
