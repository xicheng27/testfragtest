'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Fragrance } from '@/lib/fragrances';
import { ScoredFragrance } from '@/lib/scoring';
import { useShelf } from '@/lib/shelf-context';
import { Currency, PRICED_AS_OF, formatPrice, getSignaturePrice } from '@/lib/pricing';
import ProductImage from './ProductImage';

interface FragranceCardProps {
  result?: ScoredFragrance;
  fragrance?: Fragrance;
  rank?: number;
  similarFragrance?: Fragrance;
  currency?: Currency;
}

const recommendationCopy: Record<ScoredFragrance['recommendationType'], string> = {
  best: 'Your strongest overall fit',
  affordable: 'Similar vibe, lower price',
  similar: 'A related scent direction',
  everyday: 'Easy to wear more often',
  dateNight: 'Warm, memorable, and after-dark friendly',
  unique: 'A less expected niche direction',
};

function friendly(value: string) {
  return value.replaceAll('-', ' ');
}

export default function FragranceCard({
  result,
  fragrance: fragranceProp,
  rank,
  similarFragrance,
  currency = 'USD',
}: FragranceCardProps) {
  const { isOnShelf, addToShelf, removeFromShelf } = useShelf();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);
  const [shelfMessage, setShelfMessage] = useState('');
  const fragrance = result?.fragrance ?? fragranceProp;

  useEffect(() => {
    if (!shelfMessage) return;
    const timeout = window.setTimeout(() => setShelfMessage(''), 2200);
    return () => window.clearTimeout(timeout);
  }, [shelfMessage]);

  if (!fragrance) return null;

  const saved = isOnShelf(fragrance.id);
  const detailsId = `fragrance-details-${fragrance.id}`;
  const similarId = `similar-fragrance-${fragrance.id}`;
  const reasonItems = result?.matchReasons?.length
    ? result.matchReasons
    : result?.matchReason
      ? [result.matchReason]
      : [];

  const handleShelf = () => {
    if (saved) {
      removeFromShelf(fragrance.id);
      setShelfMessage(`${fragrance.name} removed from your Shelf.`);
      return;
    }
    addToShelf(fragrance.id);
    setShelfMessage(`${fragrance.name} saved to your Shelf.`);
  };

  return (
    <article
      id={`result-${fragrance.id}`}
      tabIndex={-1}
      data-fragrance-id={fragrance.id}
      className={clsx(
        'scroll-mt-24 overflow-hidden rounded-3xl border bg-white transition-all duration-300 focus:outline-none',
        rank === 1 ? 'border-stone-300 shadow-sm' : 'border-stone-200',
      )}
    >
      {result && (
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 bg-stone-50/70 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-950">
              {result.recommendationLabel}
            </p>
            <p className="mt-0.5 truncate text-base text-stone-500">
              {recommendationCopy[result.recommendationType]}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2" aria-label={`${result.matchPercent}% match`}>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.14em] text-stone-400">Match</p>
              <p className="text-lg font-semibold leading-none text-stone-950">{result.matchPercent}%</p>
            </div>
            <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e7e5e4" strokeWidth="2.4" />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#1c1917"
                strokeWidth="2.4"
                strokeDasharray={`${result.matchPercent} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="md:grid md:grid-cols-[minmax(220px,0.82fr)_minmax(0,1.65fr)]">
        <div className="relative min-h-64 overflow-hidden border-b border-stone-100 bg-stone-50 md:min-h-full md:border-b-0 md:border-r">
          <div className="relative aspect-[4/3] w-full md:sticky md:top-0 md:aspect-auto md:h-[31rem]">
            <ProductImage
              src={fragrance.imageUrl}
              alt={`${fragrance.brand} ${fragrance.name} fragrance bottle`}
              eager={rank === 1}
              sizes="(max-width: 767px) calc(100vw - 32px), 360px"
              className="object-contain p-7 sm:p-9"
            />
          </div>
          {fragrance.isDupe && (
            <span className="absolute bottom-4 left-4 rounded-full border border-stone-200 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-800 shadow-sm">
              Inspired-by alternative
            </span>
          )}
        </div>

        <div className="min-w-0 p-5 sm:p-7">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-400">{fragrance.brand}</p>
            <h2 className="mt-1 break-words text-[clamp(1.55rem,6vw,2rem)] font-semibold leading-tight tracking-[-0.025em] text-stone-950 sm:text-3xl">
              {fragrance.name}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
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
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {fragrance.scentFamilies.slice(0, 3).map(family => (
              <span key={family} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">
                {family}
              </span>
            ))}
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">
              {fragrance.tier}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-stone-100 py-5 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Main notes</dt>
              <dd className="mt-1.5 text-base leading-relaxed text-stone-800">
                {fragrance.notes.slice(0, 5).join(' · ')}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Best for</dt>
              <dd className="mt-1 text-base font-medium capitalize text-stone-800">
                {fragrance.occasions.slice(0, 2).map(friendly).join(' · ')}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Season</dt>
              <dd className="mt-1 text-base font-medium capitalize text-stone-800">
                {fragrance.seasons.slice(0, 2).join(' · ')}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Price</dt>
              <dd className="mt-1 text-base font-medium text-stone-800">
                {(() => {
                  const price = getSignaturePrice(fragrance, currency);
                  return (
                    <>
                      {!price.exact && <span aria-label="approximately">≈ </span>}
                      {formatPrice(price.amount, currency)}
                      <span className="mt-0.5 block text-[11px] font-normal text-stone-400">{price.size}</span>
                    </>
                  );
                })()}
              </dd>
            </div>
          </dl>
          <p className="mt-2.5 text-[11px] text-stone-400">
            Indicative {currency} retail at signature size · as of {PRICED_AS_OF}
          </p>

          {reasonItems.length > 0 && (
            <section className="mt-6 rounded-2xl bg-stone-950 p-4.5 text-white sm:p-5" aria-labelledby={`why-${fragrance.id}`}>
              <h3 id={`why-${fragrance.id}`} className="text-xs font-semibold uppercase tracking-[0.16em]">
                Why we picked this
              </h3>
              <ul className="mt-3 space-y-2.5">
                {reasonItems.map(reason => (
                  <li key={reason} className="flex gap-2.5 text-base leading-relaxed text-stone-300">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div
            id={detailsId}
            hidden={!detailsOpen}
            className={clsx(detailsOpen && 'quiz-question-enter mt-5')}
          >
            {detailsOpen && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Main accords</p>
                    <p className="mt-1.5 text-sm capitalize leading-relaxed text-stone-700">
                      {fragrance.accords.slice(0, 5).join(' · ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Performance</p>
                    <p className="mt-1.5 text-sm capitalize leading-relaxed text-stone-700">
                      {fragrance.projection} projection · {fragrance.longevity} longevity
                    </p>
                  </div>
                </div>

                {fragrance.isDupe && fragrance.similarityNotes && (
                  <div className="mt-4 border-t border-stone-200 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Alternative context</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
                      Inspired by {fragrance.inspiredBy}. {fragrance.similarityNotes}
                    </p>
                  </div>
                )}

                {(fragrance.productUrl || fragrance.sourceUrl) && (
                  <div className="mt-4 flex flex-wrap gap-4 border-t border-stone-200 pt-4">
                    {fragrance.productUrl && (
                      <a
                        href={fragrance.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-800"
                      >
                        View official product &rarr;
                      </a>
                    )}
                    {fragrance.sourceUrl && (
                      <a
                        href={fragrance.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-stone-500 underline decoration-stone-300 underline-offset-4 hover:text-stone-800"
                      >
                        Image source
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {similarFragrance && (
            <div
              id={similarId}
              hidden={!similarOpen}
              className={clsx(similarOpen && 'quiz-question-enter mt-5')}
            >
              {similarOpen && (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">You may also like</p>
                  <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                      <h3 className="font-semibold text-stone-950">{similarFragrance.name}</h3>
                      <p className="mt-0.5 text-xs text-stone-500">{similarFragrance.brand}</p>
                    </div>
                    <p className="text-sm font-medium text-stone-800">
                      {(() => {
                        const sp = getSignaturePrice(similarFragrance, currency);
                        return `${sp.exact ? '' : '≈ '}${formatPrice(sp.amount, currency)}`;
                      })()}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{similarFragrance.shortDescription}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleShelf}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${fragrance.name} from Shelf` : `Save ${fragrance.name} to Shelf`}
              className={clsx(
                'flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-base font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950',
                saved
                  ? 'border border-stone-300 bg-stone-100 text-stone-950'
                  : 'bg-stone-950 text-white hover:bg-stone-800',
              )}
            >
              {saved && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {saved ? 'Saved to Shelf' : 'Save to Shelf'}
            </button>
            <button
              type="button"
              onClick={() => setDetailsOpen(open => !open)}
              aria-expanded={detailsOpen}
              aria-controls={detailsId}
              className="min-h-12 rounded-xl border border-stone-300 px-4 text-base font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              {detailsOpen ? 'Hide details' : 'View details'}
            </button>
            {similarFragrance && (
              <button
                type="button"
                onClick={() => setSimilarOpen(open => !open)}
                aria-expanded={similarOpen}
                aria-controls={similarId}
                className="min-h-12 rounded-xl border border-stone-300 px-4 text-base font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                aria-label={`Find a similar fragrance: ${similarFragrance.name}`}
              >
                {similarOpen ? 'Hide similar' : 'Find similar'}
              </button>
            )}
          </div>

          <p className="mt-2 min-h-5 text-center text-xs text-stone-500" aria-live="polite">
            {shelfMessage}
          </p>
        </div>
      </div>
    </article>
  );
}
