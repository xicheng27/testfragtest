'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createPersonalityRounds,
  getPersonalityResult,
  PersonalityChoice,
  PersonalityQuizResult,
} from '@/lib/personality-quiz';
import { useQuizViewport } from '@/lib/use-quiz-viewport';
import ProgressBar from './ProgressBar';
import QuizChoiceImage from './QuizChoiceImage';

interface PersonalityQuizProps {
  onBack: () => void;
  onComplete: (result: PersonalityQuizResult) => void;
}

export default function PersonalityQuiz({ onComplete }: PersonalityQuizProps) {
  const rounds = useMemo(() => createPersonalityRounds(), []);
  const [step, setStep] = useState(0);
  const [choicesByRound, setChoicesByRound] = useState<Record<string, PersonalityChoice>>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const optionsRef = useRef<HTMLElement>(null);
  const round = rounds[step];
  const selectedChoice = choicesByRound[round.id];

  useQuizViewport(optionsRef, round.id);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const choose = (choice: PersonalityChoice) => {
    if (isAdvancing) return;
    const nextChoicesByRound = { ...choicesByRound, [round.id]: choice };
    setChoicesByRound(nextChoicesByRound);
    setIsAdvancing(true);

    timeoutRef.current = window.setTimeout(() => {
      if (step === rounds.length - 1) {
        const orderedChoices = rounds
          .map(item => nextChoicesByRound[item.id])
          .filter((item): item is PersonalityChoice => Boolean(item));
        onComplete(getPersonalityResult(orderedChoices));
        return;
      }
      setStep(current => current + 1);
      setIsAdvancing(false);
    }, 360);
  };

  const goBack = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsAdvancing(false);
    if (step === 0) return;
    setStep(current => current - 1);
  };

  return (
    <div className="grid h-dvh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden bg-stone-950 text-white">
      <header className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex min-h-11 w-16 items-center gap-1.5 rounded-lg px-2 text-sm text-stone-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div className="w-16" aria-hidden="true" />
          )}
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
            <div key={round.id} className="quiz-question-enter">
              <div className="mb-4 text-center sm:mb-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-500">{round.eyebrow}</p>
                <h1 id={`personality-question-${round.id}`} className="mx-auto mt-2 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:mt-3 sm:text-4xl">
                  {round.question}
                </h1>
                <p className="mt-2 text-xs font-light text-stone-400 sm:mt-3 sm:text-sm">Pick quickly. Your first instinct is the interesting one.</p>
              </div>

              <div
                className="grid grid-cols-2 gap-3 sm:gap-5"
                role="group"
                aria-labelledby={`personality-question-${round.id}`}
              >
                {round.choices.map(choice => {
                  const selected = selectedChoice?.id === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => choose(choice)}
                      aria-pressed={selected}
                      aria-label={`${choice.label}: ${choice.subtitle}${selected ? ', selected' : ''}`}
                      className={`group min-w-0 overflow-hidden rounded-2xl border text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:rounded-3xl ${
                        selected
                          ? 'border-white bg-white text-stone-950 ring-2 ring-white ring-offset-4 ring-offset-stone-950'
                          : 'border-white/15 bg-white/5 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="relative h-[clamp(8rem,23dvh,10.5rem)] overflow-hidden sm:h-[clamp(10rem,28vh,13.5rem)]">
                        <QuizChoiceImage
                          src={choice.imageUrl}
                          alt={`${choice.label}: ${choice.subtitle}`}
                          sizes="(max-width: 767px) 50vw, 420px"
                          productImage={choice.imageFit === 'contain'}
                          eager
                        />
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg" aria-hidden="true">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-3.5">
                        <h2 className="break-words text-sm font-semibold leading-tight sm:text-base">{choice.label}</h2>
                        <p className={`mt-1 line-clamp-2 break-words text-[11px] leading-snug sm:text-xs ${selected ? 'text-stone-600' : 'text-stone-400'}`}>
                          {choice.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
