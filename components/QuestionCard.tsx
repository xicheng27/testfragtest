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

  return (
    <div>
      <div className="mb-6">
        {question.category === 'fun' && (
          <span className="text-xs tracking-widest uppercase text-stone-400 font-light">Just for fun</span>
        )}
        <h2 className="text-xl font-semibold text-stone-900 mt-1 leading-snug">{question.question}</h2>
        {question.subtitle && (
          <p className="text-sm text-stone-400 mt-1">{question.subtitle}</p>
        )}
      </div>

      {isImageCards ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {question.options.map(option => (
            <OptionCard
              key={option.id}
              option={option}
              selected={selected.includes(option.id)}
              onClick={() => toggle(option.id)}
              variant="image"
            />
          ))}
        </div>
      ) : isCards ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => toggle(option.id)}
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
      ) : question.id === 'birth-month' ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => toggle(option.id)}
              className={clsx(
                'rounded-xl border py-3 text-sm font-medium text-center transition-all duration-150',
                selected.includes(option.id)
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
              )}
            >
              {option.label}
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
