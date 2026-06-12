'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  createPersonalityRounds,
  getPersonalityResult,
  PersonalityChoice,
  PersonalityQuizResult,
} from '@/lib/personality-quiz';
import { useQuizViewport } from '@/lib/use-quiz-viewport';
import ProgressBar from './ProgressBar';

interface PersonalityQuizProps {
  onBack: () => void;
  onComplete: (result: PersonalityQuizResult) => void;
}

export default function PersonalityQuiz({ onBack, onComplete }: PersonalityQuizProps) {
  const rounds = useMemo(() => createPersonalityRounds(), []);
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const choicesRef = useRef<PersonalityChoice[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const optionsRef = useRef<HTMLElement>(null);
  const round = rounds[step];

  useQuizViewport(optionsRef, round.id);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const choose = (choice: PersonalityChoice) => {
    if (selectedId) return;
    setSelectedId(choice.id);
    const nextChoices = [...choicesRef.current, choice];
    choicesRef.current = nextChoices;

    timeoutRef.current = window.setTimeout(() => {
      if (step === rounds.length - 1) {
        onComplete(getPersonalityResult(nextChoices));
        return;
      }
      setStep(current => current + 1);
      setSelectedId(null);
    }, 360);
  };

  const goBack = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (step === 0) {
      onBack();
      return;
    }
    choicesRef.current = choicesRef.current.slice(0, -1);
    setSelectedId(null);
    setStep(current => current - 1);
  };

  return (
    <div className="grid h-dvh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden bg-stone-950 text-white">
      <header className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm text-stone-300 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-sm font-semibold tracking-tight">Fragrance Personality</span>
          <span className="w-16 text-right text-xs text-stone-500">{step + 1}/{rounds.length}</span>
        </div>
      </header>

      <div className="px-4 pt-3 sm:px-6 sm:pt-5">
        <div className="mx-auto max-w-4xl">
          <ProgressBar current={step + 1} total={rounds.length} tone="dark" />
        </div>
      </div>

      <main
        ref={optionsRef}
        className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6"
      >
        <div className="mx-auto flex min-h-full w-full max-w-4xl items-center">
          <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={round.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.24 }}
            >
              <div className="mb-4 text-center sm:mb-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-500">{round.eyebrow}</p>
                <h1 className="mx-auto mt-2 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:mt-3 sm:text-4xl">
                  {round.question}
                </h1>
                <p className="mt-2 text-xs font-light text-stone-400 sm:mt-3 sm:text-sm">Pick quickly. Your first instinct is the interesting one.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {round.choices.map(choice => {
                  const selected = selectedId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => choose(choice)}
                      aria-pressed={selected}
                      className={`group min-w-0 overflow-hidden rounded-2xl border text-left transition-all duration-200 sm:rounded-3xl ${
                        selected
                          ? 'border-white bg-white text-stone-950 ring-2 ring-white ring-offset-4 ring-offset-stone-950'
                          : 'border-white/15 bg-white/5 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className={`relative aspect-[16/11] overflow-hidden sm:h-[clamp(10rem,30vh,14rem)] sm:aspect-auto ${choice.imageFit === 'contain' ? 'bg-white' : 'bg-stone-900'}`}>
                        <Image
                          src={choice.imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 767px) 50vw, 420px"
                          className={`${choice.imageFit === 'contain' ? 'object-contain p-3 sm:p-7' : 'object-cover'} transition-transform duration-500 group-hover:scale-[1.03]`}
                        />
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="min-h-24 p-3 sm:min-h-28 sm:p-5">
                        <h2 className="break-words text-sm font-semibold leading-tight sm:text-lg">{choice.label}</h2>
                        <p className={`mt-1.5 break-words text-xs leading-snug sm:mt-2 sm:text-sm sm:leading-relaxed ${selected ? 'text-stone-600' : 'text-stone-400'}`}>
                          {choice.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
