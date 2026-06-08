'use client';
import clsx from 'clsx';
import { QuizOption } from '@/lib/quiz';

interface OptionCardProps {
  option: QuizOption;
  selected: boolean;
  onClick: () => void;
  variant?: 'default' | 'image';
}

export default function OptionCard({ option, selected, onClick, variant = 'default' }: OptionCardProps) {
  if (variant === 'image') {
    return (
      <button
        onClick={onClick}
        className={clsx(
          'relative rounded-xl overflow-hidden aspect-[4/3] w-full transition-all duration-200 group',
          selected
            ? 'ring-2 ring-stone-800 ring-offset-2 scale-[0.98]'
            : 'hover:scale-[0.98] hover:ring-2 hover:ring-stone-300 hover:ring-offset-2'
        )}
      >
        {/* Gradient placeholder — swap src with AI-generated image later */}
        <div className={clsx('absolute inset-0 bg-gradient-to-br', option.gradient)} />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex flex-col justify-end p-3 text-white text-left">
          <div className="font-medium text-sm leading-tight">{option.label}</div>
          {option.description && (
            <div className="text-xs text-white/70 mt-0.5">{option.description}</div>
          )}
        </div>
        {selected && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3',
        selected
          ? 'bg-stone-900 border-stone-900 text-white'
          : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50'
      )}
    >
      {option.emoji && (
        <span className="text-lg mt-0.5 shrink-0">{option.emoji}</span>
      )}
      <div className="min-w-0">
        <div className="font-medium text-sm">{option.label}</div>
        {option.description && (
          <div className={clsx('text-xs mt-0.5', selected ? 'text-stone-300' : 'text-stone-400')}>
            {option.description}
          </div>
        )}
      </div>
      {selected && (
        <div className="ml-auto shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}
