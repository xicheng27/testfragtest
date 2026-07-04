import { expect, test, type Page } from '@playwright/test';

async function startQuiz(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Find a fragrance/i })).toBeVisible();
  await page.getByRole('button', { name: /Find my scent/i }).click();
  await page.getByRole('button', { name: /Start the scent quiz/i }).click();
}

async function answerCurrentQuestion(page: Page) {
  const next = page.getByRole('button', { name: /^Next$|Reveal my matches/i });
  const notSure = page.getByRole('button', { name: /Not sure/i });
  const firstOption = page.locator('main button[aria-pressed]').first();

  if (await firstOption.isVisible()) {
    await firstOption.click();
  } else if (await notSure.isVisible()) {
    await notSure.click();
    return;
  }

  if (await next.isVisible()) {
    await next.click();
  }
}

async function completeQuiz(page: Page) {
  await startQuiz(page);
  for (let index = 0; index < 10; index += 1) {
    await answerCurrentQuestion(page);
  }
  await expect(page.getByRole('heading', { name: /Your top 3/i })).toBeVisible({ timeout: 20_000 });
}

test('landing page starts the quiz', async ({ page }) => {
  await startQuiz(page);
  await expect(page.getByText(/1 of 10/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Who is this scent mission for/i })).toBeVisible();
});

test('guest can complete quiz, view results, save to Shelf, give feedback, and open official link', async ({ page, context }) => {
  await completeQuiz(page);

  await page.getByRole('button', { name: /Save .* Shelf|Save to Shelf/i }).first().click();
  await expect(page.getByText(/saved to your Shelf/i)).toBeVisible();

  await page.getByRole('button', { name: /Not my vibe/i }).first().click();
  await page.getByRole('button', { name: /Too sweet/i }).first().click();
  await expect(page.getByText(/hiding that pick/i)).toBeVisible();

  const officialLink = page.getByRole('link', { name: /View official product/i }).first();
  await expect(officialLink).toBeVisible();
  const popupPromise = context.waitForEvent('page');
  await officialLink.click();
  const popup = await popupPromise;
  await popup.close();

  await page.getByRole('button', { name: /Shelf/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Shelf' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Remove from Shelf/i }).first()).toBeVisible();
});

test('mobile menu is accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /Open navigation menu/i });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /Site menu/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /About/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
