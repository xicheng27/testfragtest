'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export default function Quiz({ questions, initialAnswers = {}, onComplete, onBack }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [direction, setDirection] = useState(1);
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

  const moveToStep = (nextStep: number, nextDirection: number) => {
    setDirection(nextDirection);
    setStep(nextStep);
  };

  const goNext = () => {
    if (!hasAnswer) return;
    if (isLast) {
      onComplete(answers);
      return;
    }
    moveToStep(step + 1, 1);
  };

  const goPrev = () => {
    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    if (step === 0) {
      onBack();
      return;
    }
    moveToStep(step - 1, -1);
  };

  const handleSingleChange = (values: string[]) => {
    handleChange(values);
    if (question.type !== 'single') return;

    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = window.setTimeout(() => {
      if (isLast) {
        onComplete({ ...answers, [question.id]: values });
      } else {
        moveToStep(step + 1, 1);
      }
    }, 320);
  };

  return (
    <div className="grid h-dvh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-100 px-4 py-4 sm:px-6 sm:py-5">
        <button
          type="button"
          onClick={goPrev}
          className="flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-sm font-semibold tracking-tight text-stone-900">ScentMatch</span>
        <div className="w-16" />
      </header>

      <div className="px-4 pb-0 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto max-w-5xl">
          <ProgressBar current={step + 1} total={questions.length} />
        </div>
      </div>

      <main
        className="min-h-0 overflow-hidden px-4 py-2.5 sm:px-6 sm:py-4"
      >
        <div className={`${contentWidthClass} h-full min-h-0`}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-full min-h-0"
            >
              <QuestionCard
                question={question}
                selected={currentAnswers}
                onChange={question.type === 'single' ? handleSingleChange : handleChange}
                optionsRef={optionsRef}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {question.type !== 'single' && (
        <footer className="z-20 border-t border-stone-200/80 bg-stone-50/95 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(28,25,23,0.06)] backdrop-blur sm:px-6 sm:py-3">
          <div className="mx-auto max-w-lg">
            <button
              type="button"
              onClick={goNext}
              disabled={!hasAnswer}
              className="min-h-13 w-full rounded-xl bg-stone-900 px-5 py-3.5 text-sm font-medium text-white transition-all duration-150 hover:bg-stone-800 disabled:opacity-30"
            >
              {isLast ? 'See my recommendations' : 'Next'}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
