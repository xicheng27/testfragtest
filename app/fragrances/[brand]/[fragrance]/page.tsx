import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductImage from '@/components/ProductImage';
import { fragrances } from '@/lib/fragrances';
import {
  coverageLabel,
  fragranceWarnings,
  sourceConfidenceLabel,
  sourceConfidenceTone,
} from '@/lib/fragrance-trust';
import clsx from 'clsx';

function brandSlug(brand: string) {
  return brand.toLowerCase().replace(/\s+/g, '-');
}

export function generateStaticParams() {
  return fragrances.map(fragrance => ({
    brand: brandSlug(fragrance.brand),
    fragrance: fragrance.id,
  }));
}

export default async function FragranceDetailPage({
  params,
}: {
  params: Promise<{ brand: string; fragrance: string }>;
}) {
  const { brand, fragrance: fragranceId } = await params;
  const fragrance = fragrances.find(item => brandSlug(item.brand) === decodeURIComponent(brand) && item.id === fragranceId);

  if (!fragrance) notFound();

  const warnings = fragranceWarnings(fragrance);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fragrance.name,
    brand: {
      '@type': 'Brand',
      name: fragrance.brand,
    },
    image: fragrance.imageUrl,
    description: fragrance.shortDescription,
    url: fragrance.productUrl || undefined,
    category: 'Fragrance',
  };

  return (
    <div className="marble-bg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header data-ui="site-header" className="border-b border-stone-200/70 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center font-semibold tracking-tight text-stone-950 transition-colors hover:text-stone-600">
            ScentMatch
          </Link>
          <Link href="/fragrances" className="inline-flex min-h-11 items-center text-sm text-stone-600 transition-colors hover:text-stone-950">
            Fragrances
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href={`/fragrances/${brandSlug(fragrance.brand)}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {fragrance.brand}
        </Link>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm lg:grid lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.2fr)]">
          <div className="relative aspect-square border-b border-stone-100 bg-stone-50 lg:min-h-[560px] lg:border-b-0 lg:border-r">
            <ProductImage
              src={fragrance.imageUrl}
              alt={`${fragrance.brand} ${fragrance.name} fragrance bottle`}
              eager
              sizes="(max-width: 1023px) 100vw, 520px"
              className="object-contain p-8 sm:p-12"
            />
          </div>

          <div className="p-5 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-400">{fragrance.brand}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-5xl">
              {fragrance.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              {fragrance.shortDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              <span className={clsx('rounded-full border px-2.5 py-1 text-[11px] font-medium', sourceConfidenceTone(fragrance))}>
                {sourceConfidenceLabel(fragrance)}
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-500">
                {coverageLabel(fragrance)}
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-500">
                Checked {fragrance.lastChecked}
              </span>
            </div>

            {fragrance.productUrl && (
              <a
                href={fragrance.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center rounded-full bg-stone-950 px-5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                View official product <span aria-hidden="true" className="ml-1">&rarr;</span>
              </a>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoBlock label="Marketed as" value={fragrance.marketedCategory} />
              <InfoBlock label="Concentration" value={fragrance.concentration ?? 'Needs review'} />
              <InfoBlock label="Projection" value={fragrance.projectionEstimate} />
              <InfoBlock label="Longevity" value={fragrance.longevityEstimate} />
              <InfoBlock label="Best for" value={fragrance.occasions.map(item => item.replaceAll('-', ' ')).join(', ')} />
              <InfoBlock label="Season" value={fragrance.seasons.join(', ')} />
            </div>

            <section className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Note pyramid</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <InfoBlock label="Top" value={fragrance.topNotes.join(', ') || 'Needs review'} />
                <InfoBlock label="Heart" value={fragrance.middleNotes.join(', ') || 'Needs review'} />
                <InfoBlock label="Base" value={fragrance.baseNotes.join(', ') || 'Needs review'} />
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Tags and warnings</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[...fragrance.accords.slice(0, 6), ...fragrance.vibeTags.slice(0, 6)].map(tag => (
                  <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">
                    {tag.replaceAll('-', ' ')}
                  </span>
                ))}
                {warnings.map(warning => (
                  <span key={warning} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                    {warning}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-8 border-t border-stone-200 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Sources and data confidence</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{fragrance.provenanceSummary}</p>
              {fragrance.sources.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {fragrance.sources.map(source => (
                    <li key={`${source.sourceType}-${source.sourceUrl}`} className="text-sm leading-relaxed text-stone-600">
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-800"
                      >
                        {source.sourceName}
                      </a>
                      <span className="text-stone-400"> - {source.trustLevel}, checked {source.lastChecked}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/disclaimer" className="mt-4 inline-flex text-sm text-stone-500 underline decoration-stone-300 underline-offset-4 hover:text-stone-800">
                Read the ScentMatch disclaimer
              </Link>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">{label}</p>
      <p className="mt-1 text-sm capitalize leading-relaxed text-stone-800">{value}</p>
    </div>
  );
}
