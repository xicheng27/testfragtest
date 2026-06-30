'use client';
import { KeyboardEvent, RefObject, useEffect, useState } from 'react';
import { QuizQuestion } from '@/lib/quiz';
import OptionCard from './OptionCard';
import clsx from 'clsx';

interface QuestionCardProps {
  question: QuizQuestion;
  selected: string[];
  onChange: (values: string[]) => void;
  optionsRef?: RefObject<HTMLDivElement | null>;
}

// Resolve how many columns the image grid should use at the current breakpoint.
// Driving columns from JS lets compact questions fit the viewport, while larger
// mobile image sets can scroll inside the options area without shrinking cards.
function useGridColumns(count: number): number {
  const [bp, setBp] = useState<'base' | 'md' | 'lg'>('base');

  useEffect(() => {
    const md = window.matchMedia('(min-width: 768px)');
    const lg = window.matchMedia('(min-width: 1024px)');
    const update = () => setBp(lg.matches ? 'lg' : md.matches ? 'md' : 'base');
    update();
    md.addEventListener('change', update);
    lg.addEventListener('change', update);
    return () => {
      md.removeEventListener('change', update);
      lg.removeEventListener('change', update);
    };
  }, []);

  if (bp === 'base') return 1;
  if (count <= 3) return Math.max(1, count);
  if (count === 4) return 2; // 2×2 at every size
  if (count >= 7) return bp === 'lg' ? 4 : 2;
  return bp === 'lg' ? 3 : 2;
}

export default function QuestionCard({ question, selected, onChange, optionsRef }: QuestionCardProps) {
  const headingId = `quiz-question-${question.id}`;

  // An "exclusive" option (e.g. "None / I'm open to everything") can't coexist
  // with other selections — picking it clears the rest, and picking anything
  // else clears it.
const EXCLUSIVE_OPTION = 'none';

const SECTION_LABELS: Record<string, string> = {
  'who-for': 'Start here',
  'scent-family': 'Your scent energy',
  occasion: 'Your plans',
  projection: 'Main character level',
  'gender-style': 'Your open-minded era',
  'price-range': 'Your budget',
  tier: 'Brand vibe',
  'disliked-notes': 'Fragrance red flags',
  vibe: 'Your vibe',
  season: 'Your scent era',
  aesthetic: 'Your aesthetic',
  longevity: 'Performance check',
  'time-of-day': 'Your timing',
  'outfit-style': 'Your closet',
  memory: 'Memory lane',
  'desired-feel': 'The final energy',
  'compliment-style': 'Compliment bait',
  weather: 'Climate check',
  experience: 'Fragrance level',
};

  const toggle = (optionId: string) => {
    if (question.type === 'single') {
      onChange([optionId]);
      return;
    }
    const max = question.maxSelections ?? 99;

    if (optionId === EXCLUSIVE_OPTION) {
      onChange(selected.includes(EXCLUSIVE_OPTION) ? [] : [EXCLUSIVE_OPTION]);
      return;
    }

    const base = selected.filter(id => id !== EXCLUSIVE_OPTION);
    if (base.includes(optionId)) {
      onChange(base.filter(id => id !== optionId));
    } else if (base.length < max) {
      onChange([...base, optionId]);
    } else {
      // At the limit — drop the oldest pick so the newest tap still registers.
      onChange([...base.slice(1), optionId]);
    }
  };

  const isImageCards = question.type === 'image-cards';
  const isCards = question.type === 'cards';
  const optionCount = question.options.length;
  const isMultiSelect = (question.maxSelections ?? 1) > 1;
  const selectionCount = selected.filter(id => id !== EXCLUSIVE_OPTION).length;

  const columns = useGridColumns(optionCount);
  const rows = Math.ceil(optionCount / columns);
  const scrollImageGrid = columns <= 2 && optionCount >= 5;
  // A lone trailing card on a 2-column mobile layout spans the full width so
  // there's no awkward empty cell.
  const lastSpansFull = columns === 2 && optionCount % 2 === 1;

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;

    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    const currentButton = (event.target as HTMLElement).closest('button');
    const currentIndex = currentButton ? buttons.indexOf(currentButton) : -1;
    if (currentIndex < 0 || buttons.length === 0) return;

    event.preventDefault();
    const movement = event.key === 'ArrowLeft'
      ? -1
      : event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp'
          ? -columns
          : event.key === 'ArrowDown'
            ? columns
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
        <span className={clsx(
          'hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] sm:inline-flex',
          question.category === 'fun'
            ? 'border-[#e4d8c0] bg-[#faf6ee] text-[#8a6417]'
            : 'border-stone-200 bg-white text-stone-500',
        )}>
          {SECTION_LABELS[question.id] ?? (question.category === 'fun' ? 'Just for fun' : 'Scent match')}
        </span>
        <h2 id={headingId} className="text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-stone-950 sm:mt-2 sm:text-2xl">
          {question.question}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {question.subtitle && (
            <p className="text-[13px] leading-snug text-stone-500 sm:text-sm">{question.subtitle}</p>
          )}
          {isMultiSelect && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-500">
              {selectionCount}/{question.maxSelections} selected
            </span>
          )}
        </div>
      </div>

      {isImageCards ? (
        <div
          className={clsx(
            'grid min-h-0 flex-1 gap-2 sm:gap-2.5',
            scrollImageGrid && 'content-start overflow-y-auto overscroll-contain pr-0.5',
          )}
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            ...(scrollImageGrid
              ? { gridAutoRows: columns === 1 ? 'minmax(126px, 144px)' : 'minmax(148px, 168px)' }
              : { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }),
          }}
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
              priority
              className={clsx(
                lastSpansFull && index === optionCount - 1 && 'col-span-2',
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
          className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2 overflow-y-auto overscroll-contain sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
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
              <div className="text-sm font-medium">
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
