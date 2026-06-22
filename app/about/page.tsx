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
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-stone-950">ScentMatch</Link>
          <Link href="/" className="rounded-lg px-2 py-2 text-sm text-stone-500 transition-colors hover:text-stone-950">
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

        <section className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {terms.map(([term, explanation], index) => (
            <article key={term} className="rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 text-xs font-medium tabular-nums text-stone-300">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-semibold text-stone-950">{term}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{explanation}</p>
                </div>
              </div>
            </article>
          ))}
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
