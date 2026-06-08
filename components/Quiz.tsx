'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuizQuestion, quizQuestions, extendedQuizQuestions } from '@/lib/quiz';
import { QuizAnswers } from '@/lib/scoring';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';

interface QuizProps {
  extended?: boolean;
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function Quiz({ extended = false, onComplete, onBack }: QuizProps) {
  const questions: QuizQuestion[] = extended ? extendedQuizQuestions : quizQuestions;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [direction, setDirection] = useState(1);

  const question = questions[step];
  const currentAnswers = (answers[question.id] as string[] | undefined) ?? [];
  const hasAnswer = currentAnswers.length > 0;
  const isLast = step === questions.length - 1;

  const handleChange = (values: string[]) => {
    setAnswers(prev => ({ ...prev, [question.id]: values }));
  };

  const goNext = () => {
    if (!hasAnswer) return;
    if (isLast) {
      onComplete(answers);
      return;
    }
    setDirection(1);
    setStep(s => s + 1);
  };

  const goPrev = () => {
    if (step === 0) { onBack(); return; }
    setDirection(-1);
    setStep(s => s - 1);
  };

  // Auto-advance on single-select answers (after brief delay for feedback)
  const handleSingleChange = (values: string[]) => {
    handleChange(values);
    if (question.type === 'single') {
      setTimeout(() => {
        if (step === questions.length - 1) {
          onComplete({ ...answers, [question.id]: values });
        } else {
          setDirection(1);
          setStep(s => s + 1);
        }
      }, 320);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-stone-100">
        <button
          onClick={goPrev}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="font-semibold text-stone-900 tracking-tight text-sm">ScentMatch</span>
        <div className="w-16" /> {/* spacer */}
      </header>

      {/* Progress */}
      <div className="px-6 pt-5 pb-0">
        <ProgressBar current={step + 1} total={questions.length} />
      </div>

      {/* Question */}
      <main className="flex-1 overflow-hidden px-6 py-8">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <QuestionCard
                question={question}
                selected={currentAnswers}
                onChange={question.type === 'single' ? handleSingleChange : handleChange}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer — show Next button for multi-select / non-auto questions */}
      {question.type !== 'single' && (
        <div className="px-6 pb-8">
          <div className="max-w-lg mx-auto">
            <button
              onClick={goNext}
              disabled={!hasAnswer}
              className="w-full py-4 rounded-xl bg-stone-900 text-white font-medium text-sm disabled:opacity-30 hover:bg-stone-800 transition-all duration-150"
            >
              {isLast ? 'See my recommendations →' : 'Next →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
