'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Fragrance, fragrances } from './fragrances';

const STORAGE_KEY = 'scentmatch:saved-fragrances';

interface SavedFragrancesContextValue {
  savedFragrances: Fragrance[];
  savedIds: string[];
  isSaved: (fragranceId: string) => boolean;
  saveFragrance: (fragranceId: string) => void;
  removeFragrance: (fragranceId: string) => void;
  toggleSaved: (fragranceId: string) => void;
}

const SavedFragrancesContext = createContext<SavedFragrancesContextValue | null>(null);

function readSavedIds(): string[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];

    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    const validIds = new Set(fragrances.map(fragrance => fragrance.id));
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id)))];
  } catch {
    return [];
  }
}

export function SavedFragrancesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadSavedIds = window.setTimeout(() => {
      setSavedIds(readSavedIds());
      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(loadSavedIds);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [hasLoaded, savedIds]);

  const savedFragrances = useMemo(() => {
    const fragranceById = new Map(fragrances.map(fragrance => [fragrance.id, fragrance]));
    return savedIds.flatMap(id => {
      const fragrance = fragranceById.get(id);
      return fragrance ? [fragrance] : [];
    });
  }, [savedIds]);

  const saveFragrance = (fragranceId: string) => {
    setSavedIds(current => current.includes(fragranceId) ? current : [...current, fragranceId]);
  };

  const removeFragrance = (fragranceId: string) => {
    setSavedIds(current => current.filter(id => id !== fragranceId));
  };

  const isSaved = (fragranceId: string) => savedIds.includes(fragranceId);

  const toggleSaved = (fragranceId: string) => {
    setSavedIds(current => (
      current.includes(fragranceId)
        ? current.filter(id => id !== fragranceId)
        : [...current, fragranceId]
    ));
  };

  return (
    <SavedFragrancesContext.Provider
      value={{ savedFragrances, savedIds, isSaved, saveFragrance, removeFragrance, toggleSaved }}
    >
      {children}
    </SavedFragrancesContext.Provider>
  );
}

export function useSavedFragrances() {
  const context = useContext(SavedFragrancesContext);
  if (!context) {
    throw new Error('useSavedFragrances must be used within SavedFragrancesProvider');
  }
  return context;
}
