'use client';
import { KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from 'react';
import { QuizQuestion } from '@/lib/quiz';
import OptionCard from './OptionCard';
import clsx from 'clsx';

interface QuestionCardProps {
  question: QuizQuestion;
  selected: string[];
  onChange: (values: string[]) => void;
  optionsRef?: MutableRefObject<HTMLDivElement | null>;
}

// Resolve how many columns the image grid should use at the current breakpoint.
// Driving columns from JS lets compact questions fit the viewport, while larger
// mobile image sets can scroll inside the options area without shrinking cards.
function useGridColumns(count: number): number {
  const [bp, setBp] = useState<'base' | 'widePhone' | 'md' | 'lg'>('base');

  useEffect(() => {
    const widePhone = window.matchMedia('(min-width: 390px)');
    const md = window.matchMedia('(min-width: 768px)');
    const lg = window.matchMedia('(min-width: 1024px)');
    const update = () => setBp(lg.matches ? 'lg' : md.matches ? 'md' : widePhone.matches ? 'widePhone' : 'base');
    update();
    widePhone.addEventListener('change', update);
    md.addEventListener('change', update);
    lg.addEventListener('change', update);
    return () => {
      widePhone.removeEventListener('change', update);
      md.removeEventListener('change', update);
      lg.removeEventListener('change', update);
    };
  }, []);

  if (bp === 'base') return 1;
  if (bp === 'widePhone') return count <= 4 ? 2 : 1;
  if (count <= 3) return Math.max(1, count);
  if (count === 4) return 2; // 2 by 2 at every size
  if (count >= 7) return bp === 'lg' ? 4 : 2;
  return bp === 'lg' ? 3 : 2;
}

export default function QuestionCard({ question, selected, onChange, optionsRef }: QuestionCardProps) {
  const headingId = `quiz-question-${question.id}`;
  const localOptionsRef = useRef<HTMLDivElement | null>(null);
  const [hasHiddenOptions, setHasHiddenOptions] = useState(false);
  const [hasScrolledOptions, setHasScrolledOptions] = useState(false);

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
  const imageSizes = columns === 1
    ? '(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 46vw, 30vw'
    : '(max-width: 767px) calc(50vw - 24px), (max-width: 1023px) 46vw, 30vw';
  // A lone trailing card on a 2-column mobile layout spans the full width so
  // there's no awkward empty cell.
  const lastSpansFull = columns === 2 && optionCount % 2 === 1;

  const setOptionsNode = (node: HTMLDivElement | null) => {
    localOptionsRef.current = node;
    if (optionsRef) optionsRef.current = node;
  };

  useEffect(() => {
    const node = localOptionsRef.current;
    if (!node) return;

    setHasScrolledOptions(false);
    const updateScrollState = () => {
      const tolerance = 8;
      const canScroll = node.scrollHeight > node.clientHeight + tolerance;
      const below = node.scrollTop + node.clientHeight < node.scrollHeight - tolerance;
      setHasHiddenOptions(canScroll && below);
      if (node.scrollTop > tolerance) setHasScrolledOptions(true);
    };

    updateScrollState();
    const raf = window.requestAnimationFrame(updateScrollState);
    node.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.cancelAnimationFrame(raf);
      node.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [question.id, columns, optionCount]);

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
        <h2 id={headingId} tabIndex={-1} className="text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-stone-950 outline-none sm:mt-2 sm:text-2xl">
          {question.question}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="rounded-full bg-stone-950 px-2 py-0.5 text-[11px] font-semibold text-white">
            {optionCount} {optionCount === 1 ? 'choice' : 'choices'}
          </span>
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
        <div className="relative min-h-0 flex-1">
          <div
            className={clsx(
              'grid h-full min-h-0 gap-2 pb-16 sm:gap-2.5 sm:pb-4',
              scrollImageGrid && 'content-start overflow-y-auto overscroll-contain pr-0.5',
            )}
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              ...(scrollImageGrid
                ? { gridAutoRows: columns === 1 ? 'minmax(164px, 188px)' : 'minmax(150px, 174px)' }
                : { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }),
            }}
            ref={setOptionsNode}
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
                priority={index < (columns === 1 ? 1 : 2)}
                imageSizes={imageSizes}
                className={clsx(
                  lastSpansFull && index === optionCount - 1 && 'col-span-2',
                )}
              />
            ))}
          </div>
          <ScrollAffordance visible={hasHiddenOptions && !hasScrolledOptions} />
        </div>
      ) : isCards ? (
        <div className="relative min-h-0 flex-1">
          <div
            ref={setOptionsNode}
            role="group"
            aria-labelledby={headingId}
            onKeyDown={handleOptionKeyDown}
            className="grid h-full min-h-0 grid-cols-1 content-start gap-2 overflow-y-auto overscroll-contain pb-16 sm:grid-cols-2 sm:gap-3 sm:pb-4 lg:grid-cols-3"
          >
            {question.options.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => toggle(option.id)}
                aria-pressed={selected.includes(option.id)}
                aria-label={option.description ? `${option.label}: ${option.description}` : option.label}
                className={clsx(
                  'relative min-h-[5rem] rounded-2xl border px-4 py-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-950 sm:min-h-16 sm:rounded-xl',
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
                <div className="mb-2 text-2xl">{option.emoji}</div>
                <div className="text-sm font-semibold leading-snug">
                  {option.label}
                  {selected.includes(option.id) && <span className="sr-only">, selected</span>}
                </div>
                {option.description && (
                  <div className={clsx('mt-1.5 text-xs leading-relaxed', selected.includes(option.id) ? 'text-stone-300' : 'text-stone-500')}>
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
          <ScrollAffordance visible={hasHiddenOptions && !hasScrolledOptions} />
        </div>
      ) : (
        <div className="relative min-h-0 flex-1">
          <div
            ref={setOptionsNode}
            role="group"
            aria-labelledby={headingId}
            onKeyDown={handleOptionKeyDown}
            className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain pb-16 sm:pb-4"
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
          <ScrollAffordance visible={hasHiddenOptions && !hasScrolledOptions} />
        </div>
      )}
    </div>
  );
}

function ScrollAffordance({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-stone-50 via-stone-50/92 to-transparent pb-3 pt-12">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-stone-700 shadow-sm">
        More choices below
        <svg className="h-3.5 w-3.5 animate-bounce motion-reduce:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
}
