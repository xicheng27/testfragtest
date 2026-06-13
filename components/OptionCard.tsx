'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { QuizOption } from '@/lib/quiz';

interface OptionCardProps {
  option: QuizOption;
  selected: boolean;
  onClick: () => void;
  variant?: 'default' | 'image';
  className?: string;
}

export default function OptionCard({
  option,
  selected,
  onClick,
  variant = 'default',
  className,
}: OptionCardProps) {
  if (variant === 'image') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={option.description ? `${option.label}: ${option.description}` : option.label}
        className={clsx(
          // Full-bleed card: everything is positioned relative to this container
          'group relative w-full overflow-hidden rounded-2xl transition-all duration-200',
          'aspect-[3/4]', // portrait gives a premium editorial look
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
          selected
            ? 'ring-2 ring-stone-900 ring-offset-2 scale-[0.97]'
            : 'hover:scale-[0.97] hover:shadow-xl',
          className,
        )}
      >
        {/* Background: photo or gradient fallback */}
        {option.imageUrl ? (
          <Image
            src={option.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 260px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className={clsx('absolute inset-0 bg-gradient-to-br', option.gradient ?? 'from-stone-400 to-stone-700')} />
        )}

        {/* Gradient scrim — heavier at bottom so text always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        {/* Subtle darkening on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />

        {/* Selected tint */}
        {selected && <div className="absolute inset-0 bg-stone-900/20" />}

        {/* Text at bottom, on top of scrim */}
        <div className="absolute inset-x-0 bottom-0 p-3 text-left">
          <div className="font-semibold text-sm leading-tight text-white tracking-tight">
            {option.label}
            {selected && <span className="sr-only">, selected</span>}
          </div>
          {option.description && (
            <div className="mt-0.5 text-[11px] leading-tight text-white/65">
              {option.description}
            </div>
          )}
        </div>

        {/* Checkmark badge */}
        {selected && (
          <div
            className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md"
            aria-hidden="true"
          >
            <svg className="h-3.5 w-3.5 text-stone-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>
    );
  }

  // Default: vertical list-row style
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        'flex min-h-11 w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
        selected
          ? 'bg-stone-900 border-stone-900 text-white'
          : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50',
        className,
      )}
    >
      {option.emoji && (
        <span className="mt-0.5 shrink-0 text-lg">{option.emoji}</span>
      )}
      <div className="min-w-0">
        <div className="font-medium text-sm">
          {option.label}
          {selected && <span className="sr-only">, selected</span>}
        </div>
        {option.description && (
          <div className={clsx('mt-0.5 text-xs', selected ? 'text-stone-300' : 'text-stone-400')}>
            {option.description}
          </div>
        )}
      </div>
      {selected && (
        <div className="ml-auto mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}
