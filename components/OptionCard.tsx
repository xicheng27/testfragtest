'use client';
import clsx from 'clsx';
import { QuizOption } from '@/lib/quiz';
import QuizChoiceImage from './QuizChoiceImage';

interface OptionCardProps {
  option: QuizOption;
  selected: boolean;
  onClick: () => void;
  variant?: 'default' | 'image';
  priority?: boolean; // current question loads image immediately at high priority
  className?: string;
}

const CheckBadge = () => (
  <div
    className="absolute top-2.5 right-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md"
    aria-hidden="true"
  >
    <svg className="h-3.5 w-3.5 text-stone-900" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
);

export default function OptionCard({
  option,
  selected,
  onClick,
  variant = 'default',
  priority = false,
  className,
}: OptionCardProps) {
  if (variant === 'image') {
    const isProduct = option.imageFit === 'contain';
    const sizes = '(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 280px';

    // Product packshots sit on white, so text can't be overlaid on the image.
    // Give them an image area + a clean caption footer instead.
    if (isProduct) {
      return (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={selected}
          aria-label={option.description ? `${option.label}: ${option.description}` : option.label}
          className={clsx(
            'group relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.35rem] border bg-white text-left transition-all duration-200 active:scale-[0.98]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
            selected
              ? 'border-stone-900 shadow-[0_16px_40px_rgba(28,25,23,0.18)] ring-2 ring-stone-900 ring-offset-2'
              : 'border-stone-200 hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md',
            className,
          )}
        >
          {selected && <CheckBadge />}
          <div className="relative min-h-0 flex-1">
            <QuizChoiceImage src={option.imageUrl!} alt={option.label} sizes={sizes} productImage eager={priority} />
          </div>
          <div className="shrink-0 border-t border-stone-100 px-3 py-2">
            <div className="text-sm font-semibold leading-tight text-stone-900">
              {option.label}
              {selected && <span className="sr-only">, selected</span>}
            </div>
            {option.description && (
              <div className="mt-0.5 line-clamp-1 text-[11px] leading-tight text-stone-400">{option.description}</div>
            )}
          </div>
        </button>
      );
    }

    // Scene photo: full-bleed with text overlaid on a gradient scrim.
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={option.description ? `${option.label}: ${option.description}` : option.label}
        className={clsx(
          'group relative h-full min-h-0 w-full overflow-hidden rounded-[1.35rem] transition-all duration-200 active:scale-[0.98]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
          selected ? 'shadow-[0_18px_45px_rgba(28,25,23,0.22)] ring-2 ring-stone-900 ring-offset-2' : 'hover:-translate-y-0.5 hover:shadow-xl',
          className,
        )}
      >
        {option.imageUrl ? (
          <QuizChoiceImage src={option.imageUrl} alt={option.label} sizes={sizes} eager={priority} />
        ) : (
          <div className={clsx('absolute inset-0 bg-gradient-to-br', option.gradient ?? 'from-stone-400 to-stone-700')} />
        )}

        {/* Bottom scrim keeps text readable over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        {selected && <div className="absolute inset-0 bg-stone-900/20" />}
        {selected && <CheckBadge />}

        <div className="absolute inset-x-0 bottom-0 p-3 text-left">
          <div className="text-sm font-semibold leading-tight tracking-tight text-white">
            {option.label}
            {selected && <span className="sr-only">, selected</span>}
          </div>
          {option.description && (
            <div className="mt-0.5 line-clamp-1 text-[11px] leading-tight text-white/70">{option.description}</div>
          )}
        </div>
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
        'flex min-h-12 w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.99]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
        selected
          ? 'bg-stone-900 border-stone-900 text-white shadow-[0_12px_28px_rgba(28,25,23,0.16)]'
          : 'bg-white border-stone-200 text-stone-800 hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50',
        className,
      )}
    >
      {option.emoji && <span className="mt-0.5 shrink-0 text-lg">{option.emoji}</span>}
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
