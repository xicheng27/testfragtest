'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Fragrance } from '@/lib/fragrances';
import { ScoredFragrance } from '@/lib/scoring';
import { useShelf } from '@/lib/shelf-context';
import { Currency, PRICED_AS_OF, formatPrice, getSignaturePrice } from '@/lib/pricing';
import {
  availabilityLabel,
  coverageLabel,
  fragranceWarnings,
  sourceConfidenceLabel,
} from '@/lib/fragrance-trust';
import { trackEvent } from '@/lib/analytics';
import ProductImage from './ProductImage';

interface FragranceCardProps {
  result?: ScoredFragrance;
  fragrance?: Fragrance;
  rank?: number;
  similarFragrance?: Fragrance;
  currency?: Currency;
  onNotMyVibe?: (fragranceId: string, reason: string) => void;
}

const recommendationCopy: Record<ScoredFragrance['recommendationType'], string> = {
  best: 'Your strongest overall fit',
  safe: 'The easiest one to wear',
  unique: 'A less obvious signature direction',
  weather: 'Chosen for your climate',
  budget: 'Useful for your budget',
  workSchool: 'Easy for daily spaces',
  similar: 'A related scent direction',
  dateNight: 'Warm, memorable, and after-dark friendly',
};

function friendly(value: string) {
  return value.replaceAll('-', ' ');
}

function brandSlug(brand: string) {
  return brand.toLowerCase().replace(/\s+/g, '-');
}

export default function FragranceCard({
  result,
  fragrance: fragranceProp,
  rank,
  similarFragrance,
  currency = 'USD',
  onNotMyVibe,
}: FragranceCardProps) {
  const { isOnShelf, addToShelf, removeFromShelf } = useShelf();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
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
  const evidenceId = `fragrance-evidence-${fragrance.id}`;
  const reasonItems = result?.matchReasons?.length
    ? result.matchReasons
    : result?.matchReason
      ? [result.matchReason]
      : [];
  const warnings = fragranceWarnings(fragrance);

  const handleShelf = () => {
    if (saved) {
      removeFromShelf(fragrance.id);
      setShelfMessage(`${fragrance.name} removed from your Shelf.`);
      return;
    }
    addToShelf(fragrance.id);
    trackEvent('result_save_to_shelf', { fragranceId: fragrance.id });
    setShelfMessage(`${fragrance.name} saved to your Shelf.`);
  };

  return (
    <article
      id={`result-${fragrance.id}`}
      tabIndex={-1}
      data-fragrance-id={fragrance.id}
      className={clsx(
        'scroll-mt-24 overflow-hidden rounded-3xl border bg-white transition-shadow duration-200 focus:outline-none',
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
        <div className="relative overflow-hidden border-b border-stone-100 bg-stone-50 md:min-h-full md:border-b-0 md:border-r">
          <div className="relative h-52 w-full sm:h-64 md:h-[31rem]">
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
                onClick={() => trackEvent('result_view_official_product', { fragranceId: fragrance.id, url: fragrance.productUrl })}
                className="mt-3 inline-flex text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-950 hover:decoration-stone-700"
              >
                View official product&nbsp;<span aria-hidden="true">&rarr;</span>
              </a>
            )}
            <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-stone-500">
              Product names and images are used for identification. Buy through official brand or retailer links when available.
            </p>
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
            {warnings.map(warning => (
              <span key={warning} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                {warning}
              </span>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-stone-100 py-5 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Main notes</dt>
              <dd className="mt-1.5 text-base leading-relaxed text-stone-800">
                {fragrance.notes.slice(0, 5).join(' / ')}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Best for</dt>
              <dd className="mt-1 text-base font-medium capitalize text-stone-800">
                {fragrance.occasions.slice(0, 2).map(friendly).join(' / ')}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Season</dt>
              <dd className="mt-1 text-base font-medium capitalize text-stone-800">
                {fragrance.seasons.slice(0, 2).join(' / ')}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Price</dt>
              <dd className="mt-1 text-base font-medium text-stone-800">
                {(() => {
                  const price = getSignaturePrice(fragrance, currency);
                  return (
                    <>
                      {!price.exact && <span aria-label="approximately">approx. </span>}
                      {formatPrice(price.amount, currency)}
                      <span className="mt-0.5 block text-[11px] font-normal text-stone-400">{price.size}</span>
                    </>
                  );
                })()}
              </dd>
            </div>
          </dl>
          <p className="mt-2.5 text-[11px] text-stone-400">
            Indicative {currency} retail at signature size / as of {PRICED_AS_OF}
          </p>

          {result && (
            <section className="mt-5 rounded-2xl border border-stone-200 bg-stone-50/70 p-4" aria-labelledby={`score-${fragrance.id}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p id={`score-${fragrance.id}`} className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Match evidence</p>
                  <p className="mt-1 text-sm font-semibold text-stone-950">{result.matchBreakdown.matchType}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600">
                    Hard {result.matchBreakdown.hardFiltersPassed}/{result.matchBreakdown.hardFiltersTotal}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600">
                    Soft {result.matchBreakdown.softPreferencesMatched}/{result.matchBreakdown.softPreferencesTotal}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600">
                    Confidence {result.matchBreakdown.confidenceScore}%
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvidenceOpen(open => !open)}
                aria-expanded={evidenceOpen}
                aria-controls={evidenceId}
                className="mt-3 inline-flex min-h-10 items-center rounded-full border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                {evidenceOpen ? 'Hide score details' : 'Show score details'}
              </button>
              {evidenceOpen && (
                <div id={evidenceId} className="mt-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MiniScore label="Scent" value={result.matchBreakdown.scentProfileFit} />
                    <MiniScore label="Occasion" value={result.matchBreakdown.occasionFit} />
                    <MiniScore label="Budget" value={result.matchBreakdown.budgetFit} />
                    <MiniScore label="Weather" value={result.matchBreakdown.climateFit} />
                    <MiniScore label="Projection" value={result.matchBreakdown.projectionFit} />
                    <MiniScore label="Red flags" value={result.matchBreakdown.redFlagSafety} />
                  </div>
                  {result.matchBreakdown.missingDataFields.length > 0 && (
                    <p className="mt-3 text-xs leading-relaxed text-amber-800">
                      Missing data to check: {result.matchBreakdown.missingDataFields.slice(0, 3).join(', ')}.
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          {reasonItems.length > 0 && (
            <section className="mt-6 rounded-2xl bg-stone-950 p-4.5 text-white sm:p-5" aria-labelledby={`why-${fragrance.id}`}>
              <h3 id={`why-${fragrance.id}`} className="text-xs font-semibold uppercase tracking-[0.16em]">
                Matched because
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {reasonItems.map(reason => (
                  <li key={reason} className="flex max-w-full items-start gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm leading-snug text-stone-100">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              {warnings[0] && (
                <p className="mt-3 rounded-2xl border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-sm text-amber-50">
                  Watch out: {warnings[0]}.
                </p>
              )}
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
                      {fragrance.accords.slice(0, 5).join(' / ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Performance</p>
                    <p className="mt-1.5 text-sm capitalize leading-relaxed text-stone-700">
                      {fragrance.projection} projection / {fragrance.longevity} longevity
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

                <div className="mt-4 border-t border-stone-200 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Data confidence</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
                    {coverageLabel(fragrance)} / {sourceConfidenceLabel(fragrance)} / {availabilityLabel(fragrance)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {fragrance.provenanceSummary}
                  </p>
                  {fragrance.sources.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {fragrance.sources.slice(0, 3).map(source => (
                        <li key={`${source.sourceType}-${source.sourceUrl}`} className="text-sm leading-relaxed text-stone-600">
                          <a
                            href={source.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-800"
                          >
                            {source.sourceName}
                          </a>
                          <span className="text-stone-400"> / {source.trustLevel} / checked {source.lastChecked}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {(fragrance.productUrl || fragrance.sourceUrl) && (
                  <div className="mt-4 flex flex-wrap gap-4 border-t border-stone-200 pt-4">
                    <Link
                      href={`/fragrances/${brandSlug(fragrance.brand)}/${fragrance.id}`}
                      className="text-sm font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-800"
                    >
                      Open detail page &rarr;
                    </Link>
                    {fragrance.productUrl && (
                      <a
                        href={fragrance.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('result_view_official_product', { fragranceId: fragrance.id, url: fragrance.productUrl })}
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
                        return `${sp.exact ? '' : 'approx. '}${formatPrice(sp.amount, currency)}`;
                      })()}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{similarFragrance.shortDescription}</p>
                </div>
              )}
            </div>
          )}

          {feedbackOpen && onNotMyVibe && (
            <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">What felt off?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Too sweet', 'Too strong', 'Too expensive', 'Too basic', 'Too niche', 'Too mature', 'Not my style'].map(reason => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => onNotMyVibe(fragrance.id, reason)}
                    className="min-h-10 rounded-full border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                  >
                    {reason}
                  </button>
                ))}
              </div>
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
            {onNotMyVibe && (
              <button
                type="button"
                onClick={() => setFeedbackOpen(open => !open)}
                aria-expanded={feedbackOpen}
                className="min-h-12 rounded-xl border border-stone-300 px-4 text-base font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                Not my vibe
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

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-stone-500">{label}</span>
        <span className="text-xs font-black text-stone-950">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-stone-950" style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
