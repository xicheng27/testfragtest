'use client';
import { ScoredFragrance } from '@/lib/scoring';
import { Fragrance } from '@/lib/fragrances';
import { useSavedFragrances } from '@/lib/saved-fragrances-context';
import clsx from 'clsx';

interface FragranceCardProps {
  result?: ScoredFragrance;
  fragrance?: Fragrance;
  rank?: number;
}

export default function FragranceCard({ result, fragrance: fragranceProp, rank }: FragranceCardProps) {
  const { isSaved, toggleSaved } = useSavedFragrances();
  const fragrance = result?.fragrance ?? fragranceProp;

  if (!fragrance) return null;

  const saved = isSaved(fragrance.id);
  const rankLabel = rank === 1 ? 'Best Match' : rank === 2 ? 'Second Pick' : 'Third Pick';
  const rankColor = rank === 1 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-stone-500 bg-stone-50 border-stone-200';

  return (
    <div className={clsx(
      'rounded-2xl border bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
      rank === 1 ? 'border-stone-300 shadow-sm' : 'border-stone-200'
    )} data-fragrance-id={fragrance.id}>
      {result && rank && (
        <div className={clsx('px-5 py-3 flex items-center justify-between border-b', rank === 1 ? 'bg-stone-50 border-stone-200' : 'bg-white border-stone-100')}>
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full border', rankColor)}>{rankLabel}</span>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-stone-400 font-light">match</div>
              <div className="text-lg font-semibold text-stone-900 leading-none">{result.matchPercent}%</div>
            </div>
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e7e5e4" strokeWidth="2" />
              <circle
                cx="18" cy="18" r="15.9" fill="none" stroke="#1c1917" strokeWidth="2"
                strokeDasharray={`${result.matchPercent} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Name & brand */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-stone-900">{fragrance.name}</h3>
          <p className="text-sm text-stone-500 font-light">{fragrance.brand}</p>
        </div>

        {/* Scent profile chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {fragrance.scentFamilies.map(f => (
            <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">
              {f}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">
            {fragrance.projection}
          </span>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <div className="text-xs text-stone-400 uppercase tracking-widest mb-1.5 font-light">Notes</div>
          <p className="text-sm text-stone-700">{fragrance.notes.join(' · ')}</p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-0.5 font-light">Price</div>
            <div className="text-sm font-medium text-stone-800">{fragrance.priceDisplay}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-0.5 font-light">Best For</div>
            <div className="text-sm font-medium text-stone-800 capitalize">{fragrance.occasions[0]}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-0.5 font-light">Style</div>
            <div className="text-sm font-medium text-stone-800 capitalize">{fragrance.genderStyle}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-0.5 font-light">Tier</div>
            <div className="text-sm font-medium text-stone-800 capitalize">{fragrance.tier}</div>
          </div>
        </div>

        {result ? (
          <div className="bg-stone-50 rounded-xl p-3.5 mb-4">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-1.5 font-light">Why it matches you</div>
            <p className="text-sm text-stone-700 leading-relaxed">{result.matchReason}</p>
          </div>
        ) : (
          <p className="mb-4 text-sm leading-relaxed text-stone-600">{fragrance.shortDescription}</p>
        )}

        <button
          type="button"
          onClick={() => toggleSaved(fragrance.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${fragrance.name} from My List` : `Save ${fragrance.name} to My List`}
          className={clsx(
            'w-full rounded-xl py-2.5 text-sm font-medium transition-colors',
            saved
              ? 'border border-stone-300 bg-stone-100 text-stone-800 hover:border-stone-400 hover:bg-white'
              : 'bg-stone-900 text-white hover:bg-stone-800'
          )}
        >
          {saved ? 'Saved - Remove from My List' : 'Save to My List'}
        </button>
      </div>
    </div>
  );
}
