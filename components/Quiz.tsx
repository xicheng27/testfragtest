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

  const question = questions[step];
  const currentAnswers = (answers[question.id] as string[] | undefined) ?? [];
  const hasAnswer = currentAnswers.length > 0;
  const isLast = step === questions.length - 1;
  const isVisualQuestion = question.type === 'image-cards';
  const contentWidthClass = !isVisualQuestion
    ? 'mx-auto max-w-lg'
    : question.options.length <= 4
      ? 'mx-auto max-w-3xl'
      : 'mx-auto max-w-5xl';

  useQuizViewport(optionsRef, question.id);

  useEffect(() => () => {
    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
  }, []);

  const handleChange = (values: string[]) => {
    setAnswers(previous => ({ ...previous, [question.id]: values }));
  };

  const moveToStep = (nextStep: number) => {
    setStep(nextStep);
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

  const handleSingleChange = (values: string[]) => {
    handleChange(values);
    if (question.type !== 'single') return;

    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = window.setTimeout(() => {
      if (isLast) {
        onComplete({ ...answers, [question.id]: values });
      } else {
        moveToStep(step + 1);
      }
    }, 320);
  };

  return (
    <div className="grid h-dvh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-100 px-4 py-3 sm:px-6 sm:py-4">
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
        </div>
      </div>

      <main
        className="min-h-0 overflow-hidden px-4 py-2.5 sm:px-6 sm:py-3"
        aria-live="polite"
      >
        <div className={`${contentWidthClass} h-full min-h-0`}>
          <div key={question.id} className="quiz-question-enter h-full min-h-0">
            <QuestionCard
              question={question}
              selected={currentAnswers}
              onChange={question.type === 'single' ? handleSingleChange : handleChange}
              optionsRef={optionsRef}
            />
          </div>
        </div>
      </main>

      {question.type !== 'single' && (
        <footer className="z-20 border-t border-stone-200/80 bg-stone-50/95 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(28,25,23,0.05)] backdrop-blur sm:px-6 sm:py-3">
          <div className={`mx-auto grid gap-2 ${question.allowSkip ? 'max-w-2xl grid-cols-[auto_minmax(0,1fr)]' : 'max-w-lg'}`}>
            {question.allowSkip && (
              <button
                type="button"
                onClick={skipQuestion}
                className="min-h-12 rounded-xl border border-stone-300 bg-white px-5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                {question.skipLabel ?? 'Skip'}
              </button>
            )}
            <button
              type="button"
              onClick={goNext}
              disabled={!hasAnswer}
              className="min-h-12 w-full rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            >
              {isLast ? 'See my recommendations' : 'Next'}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
