'use client';
import { use, useMemo } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { fragrances } from '@/lib/fragrances';
import FragranceCard from '@/components/FragranceCard';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = use(params);

  const { brandName, brandFragrances } = useMemo(() => {
    const decoded = decodeURIComponent(brandSlug);
    const matched = fragrances.filter(
      f => f.brand.toLowerCase().replace(/\s+/g, '-') === decoded
    );
    return {
      brandName: matched[0]?.brand ?? decoded,
      brandFragrances: matched,
    };
  }, [brandSlug]);

  if (brandFragrances.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-4 text-center">
        <p className="text-lg font-semibold text-stone-800">Brand not found</p>
        <Link href="/fragrances" className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-800">
          Back to all fragrances
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen bg-stone-50"
    >
      <header className="border-b border-stone-200/70 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-stone-950 transition-colors hover:text-stone-600">
            ScentMatch
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/fragrances" className="text-sm text-stone-500 transition-colors hover:text-stone-800">Fragrances</Link>
            <Link href="/about" className="text-sm text-stone-500 transition-colors hover:text-stone-800">About</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-3">
          <Link
            href="/fragrances"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All brands
          </Link>
        </div>

        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">Brand</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">{brandName}</h1>
          <p className="mt-3 text-sm text-stone-500">
            {brandFragrances.length} {brandFragrances.length === 1 ? 'fragrance' : 'fragrances'}
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {brandFragrances.map(fragrance => (
            <motion.div key={fragrance.id} variants={item}>
              <FragranceCard fragrance={fragrance} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </motion.div>
  );
}
