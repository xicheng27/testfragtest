'use client';
import { KeyboardEvent, RefObject } from 'react';
import { QuizQuestion } from '@/lib/quiz';
import OptionCard from './OptionCard';
import clsx from 'clsx';

interface QuestionCardProps {
  question: QuizQuestion;
  selected: string[];
  onChange: (values: string[]) => void;
  optionsRef?: RefObject<HTMLDivElement | null>;
}

export default function QuestionCard({ question, selected, onChange, optionsRef }: QuestionCardProps) {
  const headingId = `quiz-question-${question.id}`;

  const toggle = (optionId: string) => {
    if (question.type === 'single') {
      onChange([optionId]);
      return;
    }
    // multi / cards / image-cards
    const max = question.maxSelections ?? 99;
    if (selected.includes(optionId)) {
      onChange(selected.filter(id => id !== optionId));
    } else {
      if (selected.length < max) {
        onChange([...selected, optionId]);
      } else {
        // Replace the first selected if at max
        onChange([...selected.slice(1), optionId]);
      }
    }
  };

  const isImageCards = question.type === 'image-cards';
  const isCards = question.type === 'cards';
  const optionCount = question.options.length;
  const isUltraDense = optionCount >= 7;
  const imageGridClass = optionCount === 3
    ? 'grid-cols-1 sm:grid-cols-3'
    : optionCount === 4
      ? 'grid-cols-2'
      : optionCount === 6
        ? 'grid-cols-2 md:grid-cols-3'
        : optionCount === 7
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        : optionCount === 12
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-3';

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;

    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    const currentButton = (event.target as HTMLElement).closest('button');
    const currentIndex = currentButton ? buttons.indexOf(currentButton) : -1;
    if (currentIndex < 0 || buttons.length === 0) return;

    event.preventDefault();
    const viewportWidth = window.innerWidth;
    const columnCount = optionCount === 3
      ? (viewportWidth >= 640 ? 3 : 1)
      : optionCount === 6
        ? (viewportWidth >= 768 ? 3 : 2)
        : optionCount === 7
          ? (viewportWidth >= 1024 ? 4 : viewportWidth >= 768 ? 3 : 2)
          : optionCount === 12
            ? (viewportWidth >= 1024 ? 4 : viewportWidth >= 640 ? 3 : 2)
            : 2;
    const movement = event.key === 'ArrowLeft'
      ? -1
      : event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp'
          ? -columnCount
          : event.key === 'ArrowDown'
            ? columnCount
            : 0;
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? buttons.length - 1
        : Math.min(buttons.length - 1, Math.max(0, currentIndex + movement));
    buttons[nextIndex]?.focus();
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 shrink-0 sm:mb-4">
        {question.category === 'fun' && (
          <span className="text-xs tracking-widest uppercase text-stone-400 font-light">Just for fun</span>
        )}
        <h2 id={headingId} className="mt-1 text-lg font-semibold leading-tight text-stone-900 sm:text-xl">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">{question.subtitle}</p>
        )}
      </div>

      {isImageCards ? (
        <div className={clsx(
          'grid min-h-0 flex-1 auto-rows-max content-start items-stretch gap-2 overflow-y-auto overscroll-contain sm:gap-3',
          imageGridClass,
        )}
          ref={optionsRef}
          role="group"
          aria-labelledby={headingId}
          onKeyDown={handleOptionKeyDown}
        >
          {question.options.map((option, index) => (
            <OptionCard
              key={option.id}
              option={option}
              selected={selected.includes(option.id)}
              onClick={() => toggle(option.id)}
              variant="image"
              wideOnMobile={optionCount === 7 && index === optionCount - 1}
              horizontalOnMobile={optionCount === 3}
              compactOnMobile={optionCount >= 4}
              denseDesktop={optionCount >= 6}
              ultraDense={isUltraDense}
              className={clsx(
                optionCount === 7 && index === optionCount - 1
                  && 'col-span-2 md:col-span-1 md:col-start-2 lg:col-start-auto',
              )}
            />
          ))}
        </div>
      ) : isCards ? (
        <div
          ref={optionsRef}
          role="group"
          aria-labelledby={headingId}
          onKeyDown={handleOptionKeyDown}
          className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto overscroll-contain sm:grid-cols-3 sm:gap-3"
        >
          {question.options.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              aria-pressed={selected.includes(option.id)}
              aria-label={option.description ? `${option.label}: ${option.description}` : option.label}
              className={clsx(
                'relative min-h-11 rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-950',
                selected.includes(option.id)
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50'
              )}
            >
              {selected.includes(option.id) && (
                <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-stone-950" aria-hidden="true">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className={clsx('text-sm font-medium bg-gradient-to-br rounded-lg', option.gradient && !selected.includes(option.id) ? '' : '')}>
                {option.label}
                {selected.includes(option.id) && <span className="sr-only">, selected</span>}
              </div>
              {option.description && (
                <div className={clsx('text-xs mt-1', selected.includes(option.id) ? 'text-stone-300' : 'text-stone-400')}>
                  {option.description}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div
          ref={optionsRef}
          role="group"
          aria-labelledby={headingId}
          onKeyDown={handleOptionKeyDown}
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain"
        >
          {question.options.map(option => (
            <OptionCard
              key={option.id}
              option={option}
              selected={selected.includes(option.id)}
              onClick={() => toggle(option.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
