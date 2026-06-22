'use client';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { fragrances } from '@/lib/fragrances';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
};

export default function FragrancesPage() {
  const brands = useMemo(() => {
    const map = new Map<string, typeof fragrances>();
    for (const f of fragrances) {
      if (!map.has(f.brand)) map.set(f.brand, []);
      map.get(f.brand)!.push(f);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([brand, list]) => ({ brand, count: list.length, sample: list[0] }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="marble-bg min-h-screen"
    >
      <header className="border-b border-stone-200/70 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-stone-950 transition-colors hover:text-stone-600">
            ScentMatch
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/about" className="text-sm text-stone-500 transition-colors hover:text-stone-800">About</Link>
            <span className="text-sm font-medium text-stone-950">Fragrances</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">Browse</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">All Fragrances</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-500">
            {fragrances.length} fragrances across {brands.length} brands. Select a brand to explore its collection.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {brands.map(({ brand, count, sample }) => {
            const slug = encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'));
            return (
              <motion.div key={brand} variants={item}>
                <Link
                  href={`/fragrances/${slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition-all hover:border-stone-300 hover:shadow-sm sm:p-5"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
                    <Image
                      src={sample.imageUrl || '/images/products/fallback.svg'}
                      alt=""
                      fill
                      className="object-contain p-1"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-stone-950 transition-colors group-hover:text-stone-700">
                      {brand}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      {count} {count === 1 ? 'fragrance' : 'fragrances'}
                    </p>
                  </div>
                  <svg
                    className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-stone-500"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </motion.div>
  );
}
