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

export default function Quiz({ questions, initialAnswers = {}, onComplete }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const advanceTimeoutRef = useRef<number | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Warm the browser cache for the next couple of questions while the user is
  // answering the current one — by the time they press Next, the images are
  // already decoded and appear instantly. Cards for the current question load
  // eagerly at high priority via OptionCard's `priority` flag.
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
  // Single-choice questions advance automatically on tap (no "Next" needed),
  // matching the snappy feel of the personality quiz. Only genuine multi-select
  // questions keep a confirm button.
  const isSingleChoice = question.type === 'single' || (question.maxSelections ?? 99) === 1;
  // The final question always shows an explicit submit button so the quiz never
  // finishes on a silent auto-advance — every run ends on a deliberate
  // "Reveal my matches" tap. Earlier single-choice questions still auto-advance.
  const showSubmitButton = !isSingleChoice || isLast;
  const sectionCopy = question.category === 'fun'
    ? 'Tap your first instinct.'
    : 'Built from your actual preferences.';
  const contentWidthClass = !isVisualQuestion
    ? 'mx-auto max-w-lg'
    : question.options.length <= 4
      ? 'mx-auto max-w-3xl'
      : 'mx-auto max-w-5xl';

  useQuizViewport(optionsRef, question.id);

  useEffect(() => () => {
    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
  }, []);

  const moveToStep = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleChange = (values: string[]) => {
    setAnswers(previous => ({ ...previous, [question.id]: values }));

    // Auto-advance once a single-choice question has a selection. The last
    // question is excluded — it waits for an explicit "Reveal my matches" press.
    // Deselecting (values empty) cancels any pending advance and stays put.
    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    if (isSingleChoice && !isLast && values.length > 0) {
      advanceTimeoutRef.current = window.setTimeout(() => {
        moveToStep(step + 1);
      }, 300);
    }
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
    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    if (step === 0) return;
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
    <div className="grid h-dvh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden bg-[radial-gradient(circle_at_top_left,#fce7f3_0,transparent_28%),radial-gradient(circle_at_bottom_right,#fef3c7_0,transparent_24%),#fafaf9]">
      <header className="flex items-center justify-between border-b border-stone-100/80 bg-white/55 px-4 py-2.5 backdrop-blur-xl sm:px-6 sm:py-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={goPrev}
            className="flex min-h-11 w-16 items-center gap-1.5 rounded-lg px-2 text-sm text-stone-600 transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div className="w-16" aria-hidden="true" />
        )}
        <span className="text-sm font-semibold tracking-tight text-stone-900">ScentMatch</span>
        <div className="w-16" />
      </header>

      <div className="px-4 pb-0 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto max-w-5xl">
          <ProgressBar current={step + 1} total={questions.length} />
          <p className="mt-2 text-center text-[11px] font-medium text-stone-500 sm:text-xs">{sectionCopy}</p>
        </div>
      </div>

      <main
        className="min-h-0 overflow-hidden px-3 py-2.5 sm:px-6 sm:py-3"
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

      {(showSubmitButton || question.allowSkip) && (
        <footer className="z-20 border-t border-stone-200/80 bg-stone-50/95 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(28,25,23,0.05)] backdrop-blur sm:px-6 sm:py-3">
          <div className={`mx-auto flex w-full items-center gap-2 ${showSubmitButton ? 'max-w-2xl' : 'max-w-lg justify-center'}`}>
            {question.allowSkip && (
              <button
                type="button"
                onClick={skipQuestion}
                className={`min-h-12 rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 ${showSubmitButton ? 'shrink-0 px-5' : 'px-8'}`}
              >
                {question.skipLabel ?? 'Skip'}
              </button>
            )}
            {showSubmitButton && (
              <button
                type="button"
                onClick={goNext}
                disabled={!hasAnswer}
                className="min-h-12 flex-1 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
              >
                {isLast ? 'Reveal my matches' : 'Next'}
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
