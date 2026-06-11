'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { QuizAnswers } from './scoring';
import { useAuth } from './auth-context';

interface StoredQuizProgress {
  answers: QuizAnswers;
  isExtended: boolean;
  updatedAt: string;
}

interface QuizProgressContextValue {
  answers: QuizAnswers;
  isExtended: boolean;
  hasPreviousResults: boolean;
  saveProgress: (answers: QuizAnswers, isExtended: boolean) => void;
  clearProgress: () => void;
}

const QuizProgressContext = createContext<QuizProgressContextValue | null>(null);

function storageKey(profileId: string) {
  return `scentmatch:profile:${profileId}:quiz:v1`;
}

function readProgress(profileId: string): StoredQuizProgress {
  try {
    const value = window.localStorage.getItem(storageKey(profileId));
    if (!value) return { answers: {}, isExtended: false, updatedAt: '' };
    const parsed = JSON.parse(value) as StoredQuizProgress;
    return {
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      isExtended: Boolean(parsed.isExtended),
      updatedAt: parsed.updatedAt ?? '',
    };
  } catch {
    return { answers: {}, isExtended: false, updatedAt: '' };
  }
}

export function QuizProgressProvider({ children }: { children: ReactNode }) {
  const { profileId, isReady } = useAuth();
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isExtended, setIsExtended] = useState(false);
  const [loadedProfileId, setLoadedProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    const load = window.setTimeout(() => {
      if (!profileId) {
        setAnswers({});
        setIsExtended(false);
        setLoadedProfileId(null);
        return;
      }

      const progress = readProgress(profileId);
      setAnswers(progress.answers);
      setIsExtended(progress.isExtended);
      setLoadedProfileId(profileId);
    }, 0);

    return () => window.clearTimeout(load);
  }, [isReady, profileId]);

  const saveProgress = useCallback((nextAnswers: QuizAnswers, nextIsExtended: boolean) => {
    setAnswers(nextAnswers);
    setIsExtended(nextIsExtended);
    if (!profileId) return;
    const progress: StoredQuizProgress = {
      answers: nextAnswers,
      isExtended: nextIsExtended,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(storageKey(profileId), JSON.stringify(progress));
    setLoadedProfileId(profileId);
  }, [profileId]);

  const clearProgress = useCallback(() => {
    setAnswers({});
    setIsExtended(false);
    if (profileId) window.localStorage.removeItem(storageKey(profileId));
  }, [profileId]);

  const value = useMemo<QuizProgressContextValue>(() => ({
    answers,
    isExtended,
    hasPreviousResults: loadedProfileId === profileId && Object.keys(answers).length > 0,
    saveProgress,
    clearProgress,
  }), [answers, clearProgress, isExtended, loadedProfileId, profileId, saveProgress]);

  return <QuizProgressContext.Provider value={value}>{children}</QuizProgressContext.Provider>;
}

export function useQuizProgress() {
  const context = useContext(QuizProgressContext);
  if (!context) throw new Error('useQuizProgress must be used within QuizProgressProvider');
  return context;
}
