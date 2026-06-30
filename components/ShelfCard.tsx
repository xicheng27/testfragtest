'use client';

import { Fragrance } from '@/lib/fragrances';
import {
  availabilityLabel,
  fragranceWarnings,
  sourceConfidenceLabel,
  sourceConfidenceTone,
} from '@/lib/fragrance-trust';
import { useShelf } from '@/lib/shelf-context';
import ProductImage from './ProductImage';
import clsx from 'clsx';

export default function ShelfCard({ fragrance }: { fragrance: Fragrance }) {
  const { removeFromShelf } = useShelf();
  const warnings = fragranceWarnings(fragrance);

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-stone-100 bg-stone-50 md:aspect-square md:h-[220px] md:border-b-0 md:border-r">
        <ProductImage
          src={fragrance.imageUrl}
          alt={`${fragrance.brand} ${fragrance.name} fragrance bottle`}
          sizes="(max-width: 767px) calc(100vw - 32px), 220px"
          className="object-contain p-5 sm:p-6"
        />
      </div>
      <div className="flex min-w-0 flex-col p-5 sm:p-6 md:min-h-[220px]">
        <div className="min-w-0">
          <p className="break-words text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{fragrance.brand}</p>
          <h2 className="mt-1 break-words text-xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-2xl">
            {fragrance.name}
          </h2>
          <p className="mt-3 break-words text-sm leading-relaxed text-stone-600">
            {fragrance.shortDescription}
          </p>
          {fragrance.productUrl && (
            <a
              href={fragrance.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-950 hover:decoration-stone-700"
            >
              View official product&nbsp;<span aria-hidden="true">&rarr;</span>
            </a>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className={clsx(
                'rounded-full border px-2.5 py-1 text-[11px] font-medium',
                sourceConfidenceTone(fragrance),
              )}
            >
              {sourceConfidenceLabel(fragrance)}
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-500">
              {availabilityLabel(fragrance)}
            </span>
          </div>
        </div>

        <div className="mt-5 min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">Notes</p>
          <p className="mt-1.5 break-words text-sm leading-relaxed text-stone-700">{fragrance.notes.join(' · ')}</p>
        </div>

        <div className="mt-5 flex min-w-0 flex-wrap gap-1.5">
          {fragrance.vibeTags.slice(0, 4).map(tag => (
            <span key={tag} className="max-w-full break-words rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">
              {tag.replaceAll('-', ' ')}
            </span>
          ))}
          {warnings.slice(0, 2).map(warning => (
            <span key={warning} className="max-w-full break-words rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
              {warning}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => removeFromShelf(fragrance.id)}
          className="mt-6 min-h-11 self-start rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-950 md:mt-auto"
        >
          Remove from Shelf
        </button>
      </div>
    </article>
  );
}
