'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Fragrance, recommendableFragrances as fragrances } from './fragrances';
import { useAuth } from './auth-context';

const LEGACY_GUEST_KEY = 'scentmatch:saved-fragrances';

interface ShelfContextValue {
  shelfFragrances: Fragrance[];
  shelfIds: string[];
  isOnShelf: (fragranceId: string) => boolean;
  addToShelf: (fragranceId: string) => void;
  removeFromShelf: (fragranceId: string) => void;
  toggleShelf: (fragranceId: string) => void;
}

const ShelfContext = createContext<ShelfContextValue | null>(null);
const validIds = new Set(fragrances.map(fragrance => fragrance.id));

function storageKey(profileId: string) {
  return `scentmatch:profile:${profileId}:shelf:v1`;
}

function writeShelfIds(profileId: string, ids: string[]) {
  window.localStorage.setItem(storageKey(profileId), JSON.stringify(ids));
}

function parseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => (
      typeof id === 'string' && validIds.has(id)
    )))];
  } catch {
    return [];
  }
}

function readShelfIds(profileId: string) {
  const current = parseIds(window.localStorage.getItem(storageKey(profileId)));
  if (current.length > 0 || profileId !== 'guest') return current;

  const legacy = parseIds(window.localStorage.getItem(LEGACY_GUEST_KEY));
  if (legacy.length > 0) {
    window.localStorage.setItem(storageKey(profileId), JSON.stringify(legacy));
    window.localStorage.removeItem(LEGACY_GUEST_KEY);
  }
  return legacy;
}

export function ShelfProvider({ children }: { children: ReactNode }) {
  const { profileId, isReady } = useAuth();
  const [shelfIds, setShelfIds] = useState<string[]>([]);
  const [loadedProfileId, setLoadedProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    const load = window.setTimeout(() => {
      if (!profileId) {
        setShelfIds([]);
        setLoadedProfileId(null);
        return;
      }
      setShelfIds(readShelfIds(profileId));
      setLoadedProfileId(profileId);
    }, 0);

    return () => window.clearTimeout(load);
  }, [isReady, profileId]);

  useEffect(() => {
    if (!profileId || loadedProfileId !== profileId) return;
    writeShelfIds(profileId, shelfIds);
  }, [loadedProfileId, profileId, shelfIds]);

  const shelfFragrances = useMemo(() => {
    const fragranceById = new Map(fragrances.map(fragrance => [fragrance.id, fragrance]));
    return shelfIds.flatMap(id => {
      const fragrance = fragranceById.get(id);
      return fragrance ? [fragrance] : [];
    });
  }, [shelfIds]);

  const addToShelf = useCallback((fragranceId: string) => {
    setShelfIds(current => {
      const next = current.includes(fragranceId) ? current : [...current, fragranceId];
      if (profileId && loadedProfileId === profileId) writeShelfIds(profileId, next);
      return next;
    });
  }, [loadedProfileId, profileId]);

  const removeFromShelf = useCallback((fragranceId: string) => {
    setShelfIds(current => {
      const next = current.filter(id => id !== fragranceId);
      if (profileId && loadedProfileId === profileId) writeShelfIds(profileId, next);
      return next;
    });
  }, [loadedProfileId, profileId]);

  const isOnShelf = useCallback((fragranceId: string) => shelfIds.includes(fragranceId), [shelfIds]);

  const toggleShelf = useCallback((fragranceId: string) => {
    setShelfIds(current => {
      const next = current.includes(fragranceId)
        ? current.filter(id => id !== fragranceId)
        : [...current, fragranceId];
      if (profileId && loadedProfileId === profileId) writeShelfIds(profileId, next);
      return next;
    });
  }, [loadedProfileId, profileId]);

  const value = useMemo<ShelfContextValue>(() => ({
    shelfFragrances,
    shelfIds,
    isOnShelf,
    addToShelf,
    removeFromShelf,
    toggleShelf,
  }), [addToShelf, isOnShelf, removeFromShelf, shelfFragrances, shelfIds, toggleShelf]);

  return <ShelfContext.Provider value={value}>{children}</ShelfContext.Provider>;
}

export function useShelf() {
  const context = useContext(ShelfContext);
  if (!context) throw new Error('useShelf must be used within ShelfProvider');
  return context;
}
