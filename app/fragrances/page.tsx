'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { fragrances, Fragrance, Occasion, PriceRange, Projection, ScentFamily } from '@/lib/fragrances';
import { sourceConfidenceLabel, sourceConfidenceTone } from '@/lib/fragrance-trust';
import ProductImage from '@/components/ProductImage';
import MobileNav from '@/components/MobileNav';

type FilterState = {
  family: ScentFamily | 'all';
  occasion: Occasion | 'all';
  weather: 'all' | 'hot-humid' | 'cool' | 'indoor';
  price: PriceRange | 'all';
  projection: Projection | 'all';
  avoid: string;
};

const filters = {
  family: [
    ['all', 'All scent families'],
    ['clean', 'Clean'],
    ['aquatic', 'Aquatic'],
    ['woody', 'Woody'],
    ['gourmand', 'Gourmand'],
    ['floral', 'Floral'],
    ['spicy', 'Spicy'],
  ],
  occasion: [
    ['all', 'All occasions'],
    ['daily', 'Daily'],
    ['work', 'School/work'],
    ['date', 'Date'],
    ['night', 'Night out'],
    ['special', 'Formal'],
  ],
  weather: [
    ['all', 'Any weather'],
    ['hot-humid', 'Hot/humid'],
    ['cool', 'Cool weather'],
    ['indoor', 'Indoor/aircon'],
  ],
  price: [
    ['all', 'All prices'],
    ['budget', 'Budget'],
    ['mid', 'Mid-range'],
    ['designer', 'Designer'],
    ['niche', 'Niche'],
  ],
  projection: [
    ['all', 'Any strength'],
    ['subtle', 'Subtle'],
    ['moderate', 'Moderate'],
    ['strong', 'Strong'],
  ],
  avoid: [
    ['none', 'No avoid filter'],
    ['oud', 'Avoid oud'],
    ['smoke', 'Avoid smoke'],
    ['rose', 'Avoid rose'],
    ['vanilla', 'Avoid heavy vanilla'],
    ['leather', 'Avoid leather'],
    ['powdery', 'Avoid powdery'],
  ],
} as const;

const avoidTerms: Record<string, string[]> = {
  oud: ['oud', 'agarwood'],
  smoke: ['smoke', 'smoky', 'tobacco', 'incense', 'burnt'],
  rose: ['rose'],
  vanilla: ['vanilla', 'tonka', 'caramel', 'praline'],
  leather: ['leather', 'suede', 'animalic'],
  powdery: ['powdery', 'iris', 'violet', 'aldehydic'],
};

function slug(brand: string) {
  return encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'));
}

function signalsFor(fragrance: Fragrance) {
  return [
    ...fragrance.scentFamilies,
    ...fragrance.notes,
    ...fragrance.accords,
    ...fragrance.vibeTags,
    ...fragrance.seasons,
    ...fragrance.occasions,
  ].map(value => value.toLowerCase());
}

function worksForWeather(fragrance: Fragrance, weather: FilterState['weather']) {
  if (weather === 'all') return true;
  const signals = signalsFor(fragrance);
  if (weather === 'hot-humid') {
    return (
      fragrance.projection !== 'strong'
      && ['fresh', 'clean', 'citrus', 'aquatic', 'green', 'tea', 'musk', 'summer'].some(term => signals.some(signal => signal.includes(term)))
    );
  }
  if (weather === 'cool') {
    return ['vanilla', 'amber', 'woody', 'spicy', 'winter'].some(term => signals.some(signal => signal.includes(term)));
  }
  return fragrance.projection !== 'strong' || fragrance.occasions.includes('work');
}

function avoids(fragrance: Fragrance, avoid: string) {
  if (avoid === 'none') return true;
  const terms = avoidTerms[avoid] ?? [];
  const signals = signalsFor(fragrance);
  return !terms.some(term => signals.some(signal => signal.includes(term)));
}

export default function FragrancesPage() {
  const [filter, setFilter] = useState<FilterState>({
    family: 'all',
    occasion: 'all',
    weather: 'all',
    price: 'all',
    projection: 'all',
    avoid: 'none',
  });

  const filtered = useMemo(() => fragrances.filter(fragrance => (
    (filter.family === 'all' || fragrance.scentFamilies.includes(filter.family))
    && (filter.occasion === 'all' || fragrance.occasions.includes(filter.occasion))
    && worksForWeather(fragrance, filter.weather)
    && (filter.price === 'all' || fragrance.priceRange === filter.price)
    && (filter.projection === 'all' || fragrance.projection === filter.projection)
    && avoids(fragrance, filter.avoid)
  )), [filter]);

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilter(current => ({ ...current, [key]: value }));
  };

  return (
    <div className="marble-bg min-h-screen">
      <header data-ui="site-header" className="border-b border-stone-200/70 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center font-semibold tracking-tight text-stone-950 transition-colors hover:text-stone-600">
            ScentMatch
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/" className="hidden min-h-11 items-center text-sm text-stone-600 transition-colors hover:text-stone-950 sm:inline-flex">Home</Link>
            <Link href="/about" className="hidden min-h-11 items-center text-sm text-stone-600 transition-colors hover:text-stone-950 sm:inline-flex">About</Link>
            <span className="hidden text-sm font-medium text-stone-950 sm:inline">Fragrances</span>
            <MobileNav
              breakpoint="sm"
              label="Open navigation menu"
              items={[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Disclaimer', href: '/disclaimer' },
              ]}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">Browse</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Find fragrances by feel.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
            Filter {fragrances.length} fragrances by scent family, occasion, weather, price, projection, and notes you want to avoid.
          </p>
        </div>

        <section className="mb-8 rounded-[1.5rem] border border-stone-200 bg-white/85 p-4 shadow-sm sm:p-5" aria-label="Fragrance filters">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FilterSelect label="Scent family" value={filter.family} options={filters.family} onChange={value => set('family', value as FilterState['family'])} />
            <FilterSelect label="Occasion" value={filter.occasion} options={filters.occasion} onChange={value => set('occasion', value as FilterState['occasion'])} />
            <FilterSelect label="Weather" value={filter.weather} options={filters.weather} onChange={value => set('weather', value as FilterState['weather'])} />
            <FilterSelect label="Price" value={filter.price} options={filters.price} onChange={value => set('price', value as FilterState['price'])} />
            <FilterSelect label="Projection" value={filter.projection} options={filters.projection} onChange={value => set('projection', value as FilterState['projection'])} />
            <FilterSelect label="Avoid notes" value={filter.avoid} options={filters.avoid} onChange={value => set('avoid', value)} />
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-600">{filtered.length} matches</p>
            <button
              type="button"
              onClick={() => setFilter({ family: 'all', occasion: 'all', weather: 'all', price: 'all', projection: 'all', avoid: 'none' })}
              className="min-h-11 rounded-full border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              Clear filters
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {filtered.slice(0, 96).map(fragrance => (
            <article key={fragrance.id} className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm">
              <Link href={`/fragrances/${slug(fragrance.brand)}/${fragrance.id}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950">
                <div className="relative aspect-[4/3] border-b border-stone-100 bg-stone-50">
                  <ProductImage
                    src={fragrance.imageUrl}
                    alt={`${fragrance.brand} ${fragrance.name} fragrance bottle`}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">{fragrance.brand}</p>
                  <h2 className="mt-1 text-lg font-semibold leading-tight text-stone-950">{fragrance.name}</h2>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {fragrance.scentFamilies.slice(0, 3).map(family => (
                      <span key={family} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">{family}</span>
                    ))}
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">{fragrance.projection}</span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">{fragrance.priceRange}</span>
                  </div>
                  <span className={clsx('mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium', sourceConfidenceTone(fragrance))}>
                    {sourceConfidenceLabel(fragrance)}
                  </span>
                </div>
              </Link>
              {fragrance.productUrl && (
                <a
                  href={fragrance.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-4 mb-4 inline-flex text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 hover:text-stone-950"
                >
                  View official product <span aria-hidden="true" className="ml-1">&rarr;</span>
                </a>
              )}
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-stone-950">No matches with those filters.</h2>
            <p className="mt-2 text-sm text-stone-600">Try clearing one avoid note or widening the price/projection filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-1 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
      >
        {options.map(([id, optionLabel]) => (
          <option key={id} value={id}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}
