'use client';

import { useEffect, useRef, useState } from 'react';
import { QuizQuestion } from '@/lib/quiz';
import { QuizAnswers } from '@/lib/scoring';
import { useQuizViewport } from '@/lib/use-quiz-viewport';
import { trackEvent } from '@/lib/analytics';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';

interface QuizProps {
  questions: QuizQuestion[];
  initialAnswers?: QuizAnswers;
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
}

const loadingMessages = [
  'Matching your vibe...',
  'Checking notes you hate...',
  'Finding your best scent energy...',
];

export default function Quiz({ questions, initialAnswers = {}, onComplete, onBack }: QuizProps) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [isCompleting, setIsCompleting] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
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

  useEffect(() => {
    if (!isCompleting) return;
    const interval = window.setInterval(() => {
      setLoadingIndex(index => Math.min(index + 1, loadingMessages.length - 1));
    }, 520);
    return () => window.clearInterval(interval);
  }, [isCompleting]);

  useEffect(() => {
    if (!started || isCompleting) return;
    const question = questions[step];
    trackEvent('quiz_question_view', { step: step + 1, questionId: question.id });
    window.setTimeout(() => {
      document.getElementById(`quiz-question-${question.id}`)?.focus({ preventScroll: true });
    }, 40);
  }, [isCompleting, questions, started, step]);

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

  const moveToStep = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleChange = (values: string[]) => {
    setAnswers(previous => ({ ...previous, [question.id]: values }));
    trackEvent('quiz_answer_select', { questionId: question.id, values });
  };

  const goNext = () => {
    if (!hasAnswer) return;
    if (isLast) {
      setIsCompleting(true);
      trackEvent('quiz_complete', { answeredQuestions: Object.keys(answers).length });
      window.setTimeout(() => onComplete(answers), 1450);
      return;
    }
    moveToStep(step + 1);
  };

  const goPrev = () => {
    trackEvent('quiz_back', { fromStep: step + 1 });
    if (step === 0) {
      onBack();
      return;
    }
    moveToStep(step - 1);
  };

  const skipQuestion = () => {
    if (!question.allowSkip) return;
    trackEvent('quiz_skip', { questionId: question.id });
    const nextAnswers = { ...answers };
    delete nextAnswers[question.id];
    setAnswers(nextAnswers);

    if (isLast) {
      onComplete(nextAnswers);
      return;
    }
    moveToStep(step + 1);
  };

  if (!started) {
    return (
      <div className="marble-bg fixed inset-0 z-40 flex h-dvh min-h-0 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-white/70 bg-white/70 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center rounded-full px-2 text-sm font-medium text-stone-600 transition-colors hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            Back
          </button>
          <span className="text-sm font-semibold tracking-tight text-stone-900">ScentMatch</span>
          <span className="w-12" aria-hidden="true" />
        </header>

        <main className="flex min-h-0 flex-1 items-center px-4 py-6 sm:px-6">
          <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-stone-200 bg-white/88 p-6 text-center shadow-[0_24px_70px_rgba(28,25,23,0.12)] backdrop-blur sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6417]">Scent quiz</p>
            <h1 className="mt-3 text-[clamp(2rem,10vw,3.5rem)] font-black leading-[0.95] tracking-[-0.07em] text-stone-950">
              Let&apos;s find a scent that actually fits your life.
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-stone-600">
              Pick what you like, what you hate, where you&apos;ll wear it, and how loud you want it to be. We&apos;ll use that to recommend fragrances that make sense.
            </p>
            <ul className="mx-auto mt-5 grid max-w-sm gap-2 text-left text-sm text-stone-700 sm:grid-cols-2">
              {['10 quick questions', 'Visual choices', 'Avoids notes you dislike', 'Shows why each scent matched'].map(item => (
                <li key={item} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-950" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                trackEvent('quiz_start', { source: 'intro' });
                setStarted(true);
              }}
              className="mt-6 min-h-12 w-full rounded-2xl bg-stone-950 px-5 text-base font-bold text-white shadow-[0_16px_36px_rgba(28,25,23,0.18)] transition-all hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              Start the scent quiz
            </button>
            <p className="mt-3 text-sm text-stone-500">Fast, visual, and you can retake it anytime.</p>
          </section>
        </main>
      </div>
    );
  }

  if (isCompleting) {
    return (
      <div className="marble-bg fixed inset-0 z-40 flex h-dvh min-h-0 items-center justify-center overflow-hidden px-4">
        <section className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white/90 p-7 text-center shadow-[0_24px_70px_rgba(28,25,23,0.12)] backdrop-blur">
          <div className="mx-auto h-2 w-28 overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-stone-950" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#8a6417]">Almost there</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-stone-950" aria-live="polite">
            {loadingMessages[loadingIndex]}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">
            Pulling together your notes, budget, weather, and fragrance red flags.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="marble-bg fixed inset-0 z-40 grid h-dvh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/70 bg-white/70 px-3 py-2 backdrop-blur-xl sm:px-6 sm:py-3.5">
        <button
          type="button"
          onClick={goPrev}
          className="flex min-h-9 w-20 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-stone-600 transition-colors hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-sm font-semibold tracking-tight text-stone-900">ScentMatch</span>
        <div className="flex w-20 justify-end">
          <span className="rounded-full border border-stone-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-stone-600">
            {step + 1} of {questions.length}
          </span>
        </div>
      </header>

      <div className="px-4 pb-0 pt-2 sm:px-6 sm:pt-3">
        <div className="mx-auto max-w-5xl">
          <ProgressBar current={step + 1} total={questions.length} compact />
        </div>
      </div>

      <main
        className="min-h-0 overflow-hidden px-3 py-3 sm:px-6 sm:py-4"
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
