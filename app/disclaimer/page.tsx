import Link from 'next/link';

const points = [
  'ScentMatch is independent and is not affiliated with, sponsored by, or endorsed by any fragrance brand.',
  'Brand names, fragrance names, and product images are used only for identification, recommendation, and informational purposes.',
  'Official product links may be provided to direct users to the original brand or retailer page.',
  'Users should purchase from official brand websites or trusted authorized retailers.',
  'All trademarks, product names, images, and brand assets belong to their respective owners.',
] as const;

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-stone-950">
            ScentMatch
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-stone-500 transition-colors hover:text-stone-950">
              About
            </Link>
            <Link href="/" className="text-stone-500 transition-colors hover:text-stone-950">
              Back to quiz
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <section className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-400">Disclaimer</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.03em] text-stone-950 sm:text-6xl">
            Independent fragrance recommendations.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone-600 sm:text-lg">
            ScentMatch helps people discover fragrances through quiz-based recommendations. We use product names and images so users can clearly identify the fragrance being recommended.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight text-stone-950">How product information is used</h2>
          <ul className="mt-5 space-y-4">
            {points.map(point => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-stone-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-950" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl bg-stone-950 p-6 text-white sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">Shopping note</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-300">
            When possible, use the official product links shown on recommendation cards to verify the fragrance, size, price, and availability before purchasing.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-white px-6 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-100"
          >
            Find your fragrance
          </Link>
        </section>
      </main>
    </div>
  );
}
