'use client';
import clsx from 'clsx';
import { QuizOption } from '@/lib/quiz';
import QuizChoiceImage from './QuizChoiceImage';

interface OptionCardProps {
  option: QuizOption;
  selected: boolean;
  onClick: () => void;
  variant?: 'default' | 'image';
  className?: string;
  wideOnMobile?: boolean;
  horizontalOnMobile?: boolean;
  compactOnMobile?: boolean;
  denseDesktop?: boolean;
  ultraDense?: boolean;
}

export default function OptionCard({
  option,
  selected,
  onClick,
  variant = 'default',
  className,
  wideOnMobile = false,
  horizontalOnMobile = false,
  compactOnMobile = false,
  denseDesktop = false,
  ultraDense = false,
}: OptionCardProps) {
  if (variant === 'image') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={option.description ? `${option.label}: ${option.description}` : option.label}
        className={clsx(
          'group flex w-full min-w-0 overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-950',
          horizontalOnMobile ? 'flex-row sm:flex-col' : 'flex-col',
          selected
            ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-2'
            : 'border-stone-200 hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md',
          ultraDense
            ? 'min-h-[8.25rem] sm:min-h-[7.5rem]'
            : !horizontalOnMobile && (compactOnMobile ? 'min-h-[9rem] sm:min-h-0' : 'min-h-40 sm:min-h-0'),
          className,
        )}
      >
        <div className={clsx(
          'relative shrink-0 overflow-hidden bg-stone-100',
          horizontalOnMobile
            ? 'min-h-24 w-[42%] sm:h-[clamp(7rem,18vh,9rem)] sm:min-h-0 sm:w-full'
            : wideOnMobile
              ? 'h-[clamp(6.25rem,14dvh,7.5rem)] w-full sm:h-[clamp(5.5rem,13vh,7rem)]'
              : clsx(
                  'w-full',
                  ultraDense
                    ? 'h-[clamp(5.75rem,13dvh,7rem)] sm:h-[clamp(5rem,12vh,6.25rem)]'
                    : denseDesktop
                      ? 'h-[clamp(6.5rem,15dvh,7.75rem)] sm:h-[clamp(6.75rem,17vh,8rem)]'
                      : 'h-[clamp(7.25rem,17dvh,8.75rem)] sm:h-[clamp(7rem,18vh,9rem)]',
                ),
        )}>
          {option.imageUrl ? (
            <QuizChoiceImage
              src={option.imageUrl}
              alt={option.description ? `${option.label}: ${option.description}` : option.label}
              sizes="(max-width: 479px) 50vw, (max-width: 1023px) 33vw, 260px"
              productImage={option.imageFit === 'contain'}
              eager
            />
          ) : (
            <div className={clsx('absolute inset-0 bg-gradient-to-br', option.gradient)} />
          )}
          {selected && (
            <div className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-stone-950 shadow-lg" aria-hidden="true">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className={clsx(
          'flex min-w-0 flex-col justify-center sm:justify-start sm:px-3 sm:py-1.5',
          horizontalOnMobile ? 'flex-1' : 'shrink-0',
          (compactOnMobile || ultraDense) ? 'px-2.5 py-1.5' : 'px-3 py-2',
        )}>
          <div className={clsx(
            'break-words font-semibold leading-tight text-stone-950 sm:text-[15px]',
            ultraDense ? 'text-xs' : compactOnMobile ? 'text-[13px]' : 'text-sm',
          )}>
            {option.label}
            {selected && <span className="sr-only">, selected</span>}
          </div>
          {option.description && (
            <div className={clsx(
              'mt-0.5 break-words text-[11px] leading-tight text-stone-500 sm:line-clamp-1 sm:text-xs',
              (compactOnMobile || ultraDense) && 'hidden sm:block sm:line-clamp-1',
              ultraDense && 'text-[11px]',
            )}>
              {option.description}
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        'flex min-h-11 w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-950',
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
        <div className="ml-auto mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20" aria-hidden="true">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}
