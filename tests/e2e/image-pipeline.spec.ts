import { expect, test, type Page } from '@playwright/test';

// Phone widths ScentMatch optimises for, plus one desktop viewport.
const viewports = [
  { name: '360x800', width: 360, height: 800 },
  { name: '375x812', width: 375, height: 812 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: 'desktop-1280x800', width: 1280, height: 800 },
];

async function assertVisibleImagesLoaded(page: Page, scope: string) {
  // Every rendered <img> that is on-screen must have decoded to real pixels.
  const broken = await page.evaluate(() => {
    const results: { src: string; naturalWidth: number; complete: boolean }[] = [];
    for (const img of Array.from(document.images)) {
      const rect = img.getBoundingClientRect();
      const onScreen = rect.width > 0 && rect.height > 0
        && rect.bottom > 0 && rect.top < window.innerHeight;
      if (!onScreen) continue;
      if (!img.complete || img.naturalWidth === 0) {
        results.push({ src: img.currentSrc || img.src, naturalWidth: img.naturalWidth, complete: img.complete });
      }
    }
    return results;
  });
  expect(broken, `${scope}: images failed to load: ${JSON.stringify(broken)}`).toEqual([]);
}

async function completeQuiz(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Find a fragrance/i })).toBeVisible();

  // One CTA tap must land directly on question one (no intro screen).
  await page.getByRole('button', { name: /Find my scent/i }).first().click();
  await expect(page.getByText(/1 of 10/i)).toBeVisible({ timeout: 15_000 });

  for (let index = 0; index < 10; index += 1) {
    // Wait for the option group of the current question to be present.
    const options = page.locator('main [role="group"] button[aria-pressed]');
    await expect(options.first()).toBeVisible({ timeout: 15_000 });

    // Give lazy/eager images a beat to decode, then assert they actually loaded.
    await page.waitForTimeout(400);
    await assertVisibleImagesLoaded(page, `question ${index + 1}`);

    await options.first().click();

    const next = page.getByRole('button', { name: /^Next$|See my matches/i });
    await expect(next).toBeEnabled({ timeout: 10_000 });
    await next.click();
  }
}

for (const viewport of viewports) {
  test.describe(`image pipeline @ ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('quiz images and the top result bottle render with real pixels', async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', message => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      await completeQuiz(page);

      // Results: the top fragrance bottle must be visible and decoded.
      const topResult = page.locator('article[data-fragrance-id]').first();
      await expect(topResult).toBeVisible({ timeout: 25_000 });
      await topResult.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const topBottle = topResult.locator('img').first();
      await expect(topBottle).toBeVisible();
      const naturalWidth = await topBottle.evaluate(node => (node as HTMLImageElement).naturalWidth);
      expect(naturalWidth, 'top result bottle naturalWidth').toBeGreaterThan(0);

      // No recommendation may fall back to the placeholder illustration.
      const srcs = await page.locator('article[data-fragrance-id] img').evaluateAll(
        nodes => nodes.map(node => (node as HTMLImageElement).currentSrc || (node as HTMLImageElement).src),
      );
      for (const src of srcs) {
        expect(src, 'result image should not use fallback.svg').not.toContain('fallback.svg');
      }

      // All result images visible in the first viewport must be decoded.
      await assertVisibleImagesLoaded(page, 'results');

      const hydrationErrors = consoleErrors.filter(text => /hydrat|did not match/i.test(text));
      expect(hydrationErrors, `hydration errors: ${JSON.stringify(hydrationErrors)}`).toEqual([]);
    });
  });
}
