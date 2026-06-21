'use client';

import { useEffect, useRef, useState } from 'react';
import { QuizQuestion } from '@/lib/quiz';
import { QuizAnswers } from '@/lib/scoring';
import { useQuizViewport } from '@/lib/use-quiz-viewport';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';

interface QuizProps {
  questions: QuizQuestion[];
  initialAnswers?: QuizAnswers;
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
}

export default function Quiz({ questions, initialAnswers = {}, onComplete, onBack }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const optionsRef = useRef<HTMLDivElement>(null);
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const lookahead of [step + 1, step + 2]) {
      const upcoming = questions[lookahead];
      if (!upcoming || upcoming.type !== 'image-cards') continue;
      for (const option of upcoming.options) {
        if (!option.imageUrl || preloadedRef.current.has(option.imageUrl)) continue;
        preloadedRef.current.add(option.imageUrl);
        const img = new window.Image();
        img.decoding = 'async';
        img.src = option.imageUrl;
      }
    }
  }, [step, questions]);

  const question = questions[step];
  const currentAnswers = (answers[question.id] as string[] | undefined) ?? [];
  const hasAnswer = currentAnswers.length > 0;
  const isLast = step === questions.length - 1;
  const isVisualQuestion = question.type === 'image-cards';
  const isSingleChoice = question.type === 'single' || (question.maxSelections ?? 99) === 1;
  const sectionCopy = question.category === 'fun'
    ? 'Pick a vibe, then tap Next.'
    : isSingleChoice
      ? 'Choose one, then tap Next.'
      : 'Choose your picks, then tap Next.';
  const contentWidthClass = !isVisualQuestion
    ? 'mx-auto max-w-lg'
    : question.options.length <= 4
      ? 'mx-auto max-w-3xl'
      : 'mx-auto max-w-5xl';

  useQuizViewport(optionsRef, question.id);

  const moveToStep = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleChange = (values: string[]) => {
    setAnswers(previous => ({ ...previous, [question.id]: values }));
  };

  const goNext = () => {
    if (!hasAnswer) return;
    if (isLast) {
      onComplete(answers);
      return;
    }
    moveToStep(step + 1);
  };

  const goPrev = () => {
    if (step === 0) {
      onBack();
      return;
    }
    moveToStep(step - 1);
  };

  const skipQuestion = () => {
    if (!question.allowSkip) return;
    const nextAnswers = { ...answers };
    delete nextAnswers[question.id];
    setAnswers(nextAnswers);

    if (isLast) {
      onComplete(nextAnswers);
      return;
    }
    moveToStep(step + 1);
  };

  return (
    <div className="fixed inset-0 z-40 grid h-dvh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden bg-[radial-gradient(circle_at_top_left,#fce7f3_0,transparent_28%),radial-gradient(circle_at_bottom_right,#fef3c7_0,transparent_24%),#fafaf9]">
      <header className="flex items-center justify-between border-b border-white/70 bg-white/60 px-3 py-2.5 backdrop-blur-xl sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={goPrev}
          className="flex min-h-10 w-20 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-stone-600 transition-colors hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-sm font-semibold tracking-tight text-stone-900">ScentMatch</span>
        <div className="w-20" aria-hidden="true" />
      </header>

      <div className="px-3 pb-0 pt-2.5 sm:px-6 sm:pt-4">
        <div className="mx-auto max-w-5xl">
          <ProgressBar current={step + 1} total={questions.length} />
          <p className="mt-2 text-center text-[11px] font-medium text-stone-500 sm:text-xs">{sectionCopy}</p>
        </div>
      </div>

      <main
        className="min-h-0 overflow-hidden px-2.5 py-2 sm:px-6 sm:py-3"
        aria-live="polite"
      >
        <div className={`${contentWidthClass} h-full min-h-0`}>
          <div key={question.id} className="quiz-question-enter h-full min-h-0">
            <QuestionCard
              question={question}
              selected={currentAnswers}
              onChange={handleChange}
              optionsRef={optionsRef}
            />
          </div>
        </div>
      </main>

      <footer className="z-20 border-t border-white/70 bg-stone-50/80 px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_34px_rgba(28,25,23,0.08)] backdrop-blur-xl sm:px-6 sm:py-3">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-[1.35rem] border border-stone-200/80 bg-white/90 p-1.5 shadow-[0_12px_34px_rgba(28,25,23,0.08)]">
          {question.allowSkip && (
            <button
              type="button"
              onClick={skipQuestion}
              className="min-h-12 shrink-0 rounded-[1rem] border border-stone-200 bg-stone-50 px-4 text-sm font-semibold text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 sm:px-5"
            >
              {question.skipLabel ?? 'Skip'}
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            disabled={!hasAnswer}
            className="sheen relative min-h-12 flex-1 overflow-hidden rounded-[1rem] bg-stone-950 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(28,25,23,0.16)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none"
          >
            {isLast ? 'Reveal my matches' : 'Next'}
          </button>
        </div>
      </footer>
    </div>
  );
}
