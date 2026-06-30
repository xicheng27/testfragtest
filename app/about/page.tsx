import Link from 'next/link';

const terms = [
  ['Top notes', 'The first scents you notice after spraying. They are often bright and light, and usually fade first.'],
  ['Heart / middle notes', 'The main character of a fragrance. They appear after the opening settles and shape most of the scent.'],
  ['Base notes', 'The deepest, longest-lasting materials. Woods, amber, vanilla, and musk often live here.'],
  ['Projection', 'How far a fragrance radiates from your skin while you wear it.'],
  ['Sillage', 'The scented trail that remains in the air as you move through a space.'],
  ['Longevity', 'How many hours a fragrance remains noticeable on your skin or clothing.'],
  ['Eau de Toilette', 'Usually a lighter concentration with an airy feel. Often abbreviated as EDT.'],
  ['Eau de Parfum', 'Usually richer and longer-lasting than an EDT. Often abbreviated as EDP.'],
  ['Parfum / Extrait', 'A highly concentrated format that often wears richly and close to the skin.'],
  ['Fresh', 'Crisp, airy scents that may suggest clean laundry, herbs, water, or cool morning air.'],
  ['Gourmand', 'Scents inspired by edible things such as vanilla, caramel, coffee, chocolate, or pastry.'],
  ['Woody', 'Dry, warm, or earthy scents built around materials such as cedar, sandalwood, or vetiver.'],
  ['Amber', 'A warm, glowing style often created with vanilla, resins, balsams, and soft spice.'],
  ['Musk', 'A soft, skin-like scent that can feel clean, warm, powdery, or subtly sensual.'],
  ['Aquatic', 'Watery, marine, or rain-like scents that feel cool, transparent, and refreshing.'],
  ['Floral', 'A broad family centered on flowers, from sheer peony to rich rose, jasmine, or tuberose.'],
  ['Citrus', 'Bright notes such as bergamot, lemon, orange, grapefruit, and mandarin.'],
  ['Spicy', 'Warm or cool spice notes including pepper, cardamom, cinnamon, clove, or saffron.'],
] as const;

export default function AboutPage() {
  return (
    <div className="marble-bg min-h-screen">
      <header data-ui="site-header" className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold tracking-tight text-stone-950">ScentMatch</Link>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-stone-200 bg-white/70 px-4 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-950">
            Back to quiz
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <section className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-400">About ScentMatch</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.03em] text-stone-950 sm:text-6xl">
            Fragrance language, without the gatekeeping.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone-600 sm:text-lg">
            Fragrance can sound more complicated than it needs to be. This guide gives you the useful version of the terms you will see in recommendations, reviews, and product descriptions.
          </p>
        </section>

        <section className="mt-10 sm:mt-12" aria-label="Fragrance glossary">
          <p className="mb-3 text-sm text-stone-500">Tap a term to expand its meaning.</p>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {terms.map(([term, explanation], index) => (
              <details
                key={term}
                className="group rounded-2xl border border-stone-200 bg-white transition-colors open:border-stone-300 [&>summary]:list-none [&>summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex min-h-[44px] cursor-pointer items-center gap-3 px-5 py-3 text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 sm:px-6">
                  <span className="text-xs font-medium tabular-nums text-stone-400">{String(index + 1).padStart(2, '0')}</span>
                  <h2 className="font-semibold">{term}</h2>
                  <svg
                    className="ml-auto h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200 group-open:rotate-180"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-stone-600 sm:px-6">{explanation}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-stone-950 px-6 py-8 text-white sm:px-10 sm:py-10">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">The easiest rule</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Your nose gets the final vote.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-300">
            Concentration, notes, and fragrance families are useful clues, not guarantees. Skin, weather, and memory can make the same scent feel different to everyone.
          </p>
          <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-white px-6 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-100">
            Find your fragrance
          </Link>
        </section>
      </main>
    </div>
  );
}
