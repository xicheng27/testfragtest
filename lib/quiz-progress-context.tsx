'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { QuizAnswers } from './scoring';
import { useAuth } from './auth-context';

interface StoredQuizProgress {
  answers: QuizAnswers;
  isExtended: boolean;
  step: number;
  completed: boolean;
  updatedAt: string;
}

interface QuizProgressContextValue {
  answers: QuizAnswers;
  isExtended: boolean;
  step: number;
  hasDraftProgress: boolean;
  hasPreviousResults: boolean;
  saveDraft: (answers: QuizAnswers, isExtended: boolean, step: number) => void;
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
    if (!value) return { answers: {}, isExtended: false, step: 0, completed: false, updatedAt: '' };
    const parsed = JSON.parse(value) as StoredQuizProgress;
    return {
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      isExtended: Boolean(parsed.isExtended),
      step: Number.isFinite(parsed.step) ? Math.max(0, parsed.step) : 0,
      completed: Boolean(parsed.completed),
      updatedAt: parsed.updatedAt ?? '',
    };
  } catch {
    return { answers: {}, isExtended: false, step: 0, completed: false, updatedAt: '' };
  }
}

export function QuizProgressProvider({ children }: { children: ReactNode }) {
  const { profileId, isReady } = useAuth();
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isExtended, setIsExtended] = useState(false);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loadedProfileId, setLoadedProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    const load = window.setTimeout(() => {
      if (!profileId) {
        setAnswers({});
        setIsExtended(false);
        setStep(0);
        setCompleted(false);
        setLoadedProfileId(null);
        return;
      }

      const progress = readProgress(profileId);
      setAnswers(progress.answers);
      setIsExtended(progress.isExtended);
      setStep(progress.step);
      setCompleted(progress.completed);
      setLoadedProfileId(profileId);
    }, 0);

    return () => window.clearTimeout(load);
  }, [isReady, profileId]);

  const writeProgress = useCallback((progress: StoredQuizProgress) => {
    if (!profileId) return;
    window.localStorage.setItem(storageKey(profileId), JSON.stringify(progress));
    setLoadedProfileId(profileId);
  }, [profileId]);

  const saveDraft = useCallback((nextAnswers: QuizAnswers, nextIsExtended: boolean, nextStep: number) => {
    setAnswers(nextAnswers);
    setIsExtended(nextIsExtended);
    setStep(Math.max(0, nextStep));
    setCompleted(false);
    writeProgress({
      answers: nextAnswers,
      isExtended: nextIsExtended,
      step: Math.max(0, nextStep),
      completed: false,
      updatedAt: new Date().toISOString(),
    });
  }, [writeProgress]);

  const saveProgress = useCallback((nextAnswers: QuizAnswers, nextIsExtended: boolean) => {
    setAnswers(nextAnswers);
    setIsExtended(nextIsExtended);
    setStep(0);
    setCompleted(true);
    writeProgress({
      answers: nextAnswers,
      isExtended: nextIsExtended,
      step: 0,
      completed: true,
      updatedAt: new Date().toISOString(),
    });
  }, [writeProgress]);

  const clearProgress = useCallback(() => {
    setAnswers({});
    setIsExtended(false);
    setStep(0);
    setCompleted(false);
    if (profileId) window.localStorage.removeItem(storageKey(profileId));
  }, [profileId]);

  const value = useMemo<QuizProgressContextValue>(() => ({
    answers,
    isExtended,
    step,
    hasDraftProgress: loadedProfileId === profileId && !completed && Object.keys(answers).length > 0,
    hasPreviousResults: loadedProfileId === profileId && completed && Object.keys(answers).length > 0,
    saveDraft,
    saveProgress,
    clearProgress,
  }), [answers, clearProgress, completed, isExtended, loadedProfileId, profileId, saveDraft, saveProgress, step]);

  return <QuizProgressContext.Provider value={value}>{children}</QuizProgressContext.Provider>;
}

export function useQuizProgress() {
  const context = useContext(QuizProgressContext);
  if (!context) throw new Error('useQuizProgress must be used within QuizProgressProvider');
  return context;
}
