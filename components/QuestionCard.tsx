'use client';
import { QuizQuestion } from '@/lib/quiz';
import OptionCard from './OptionCard';
import clsx from 'clsx';

interface QuestionCardProps {
  question: QuizQuestion;
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function QuestionCard({ question, selected, onChange }: QuestionCardProps) {
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
  const imageGridClass = optionCount === 3
    ? 'grid-cols-1 sm:grid-cols-3'
    : optionCount === 4
      ? 'grid-cols-2'
      : optionCount === 6
        ? 'grid-cols-2 md:grid-cols-3'
        : optionCount === 12
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-3';

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        {question.category === 'fun' && (
          <span className="text-xs tracking-widest uppercase text-stone-400 font-light">Just for fun</span>
        )}
        <h2 className="mt-1 text-lg font-semibold leading-snug text-stone-900 sm:text-xl">{question.question}</h2>
        {question.subtitle && (
          <p className="text-sm text-stone-400 mt-1">{question.subtitle}</p>
        )}
      </div>

      {isImageCards ? (
        <div className={clsx(
          'grid items-stretch gap-2.5 sm:gap-4',
          imageGridClass,
        )}>
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
              className={clsx(
                optionCount === 7 && index === optionCount - 1
                  && 'col-span-2 md:col-span-1 md:col-start-2',
              )}
            />
          ))}
        </div>
      ) : isCards ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {question.options.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              aria-pressed={selected.includes(option.id)}
              className={clsx(
                'rounded-xl border p-4 text-left transition-all duration-150',
                selected.includes(option.id)
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50'
              )}
            >
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className={clsx('text-sm font-medium bg-gradient-to-br rounded-lg', option.gradient && !selected.includes(option.id) ? '' : '')}>
                {option.label}
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
        <div className="flex flex-col gap-2">
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
