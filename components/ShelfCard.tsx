'use client';

import { Fragrance } from '@/lib/fragrances';
import { useShelf } from '@/lib/shelf-context';
import ProductImage from './ProductImage';

export default function ShelfCard({ fragrance }: { fragrance: Fragrance }) {
  const { removeFromShelf } = useShelf();

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white sm:grid sm:grid-cols-[210px_1fr]">
      <div className="relative aspect-square border-b border-stone-100 bg-white sm:h-full sm:min-h-64 sm:border-b-0 sm:border-r">
        <ProductImage
          src={fragrance.imageUrl}
          alt={`${fragrance.brand} ${fragrance.name} fragrance bottle`}
        />
      </div>
      <div className="flex flex-col p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{fragrance.brand}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">{fragrance.name}</h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{fragrance.shortDescription}</p>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">Notes</p>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-700">{fragrance.notes.join(' · ')}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {fragrance.vibeTags.slice(0, 4).map(tag => (
            <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">
              {tag.replaceAll('-', ' ')}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => removeFromShelf(fragrance.id)}
          className="mt-6 self-start text-sm font-medium text-stone-400 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-800"
        >
          Remove from Shelf
        </button>
      </div>
    </article>
  );
}
