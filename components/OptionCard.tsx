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
          'group flex w-full min-w-0 overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-200',
          horizontalOnMobile ? 'flex-row sm:flex-col' : 'flex-col',
          selected
            ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-2'
            : 'border-stone-200 hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md',
          ultraDense && 'min-h-[8.5rem] sm:min-h-[7.5rem]',
          className,
        )}
      >
        <div className={clsx(
          'relative shrink-0 overflow-hidden bg-stone-100',
          horizontalOnMobile
            ? 'min-h-20 w-[36%] sm:h-[clamp(6rem,15vh,8rem)] sm:min-h-0 sm:w-full'
            : wideOnMobile
              ? 'h-[clamp(5rem,12vh,6.5rem)] w-full'
              : clsx(
                  'w-full',
                  ultraDense
                    ? 'h-[clamp(4.5rem,11vh,5.75rem)]'
                    : denseDesktop
                      ? 'h-[clamp(5.5rem,14vh,7.5rem)]'
                      : 'h-[clamp(6rem,16vh,8.5rem)]',
                ),
        )}>
          {option.imageUrl ? (
            <Image
              src={option.imageUrl}
              alt=""
              fill
              sizes="(max-width: 479px) 50vw, (max-width: 1023px) 33vw, 260px"
              loading="eager"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className={clsx('absolute inset-0 bg-gradient-to-br', option.gradient)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          {selected && (
            <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-stone-950 shadow-lg">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className={clsx(
          'flex min-w-0 flex-1 flex-col justify-center sm:justify-start sm:p-4',
          ultraDense ? 'p-2' : compactOnMobile ? 'p-2.5' : 'p-3',
        )}>
          <div className={clsx(
            'break-words font-semibold leading-tight text-stone-950 sm:text-[15px]',
            ultraDense ? 'text-xs' : compactOnMobile ? 'text-[13px]' : 'text-sm',
          )}>
            {option.label}
          </div>
          {option.description && (
            <div className={clsx(
              'mt-1 break-words text-xs leading-snug text-stone-500 sm:mt-1.5 sm:leading-relaxed',
              (compactOnMobile || ultraDense) && 'line-clamp-1',
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
