import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fragrances } from '@/lib/fragrances';
import { quizQuestions } from '@/lib/quiz';

const projectRoot = process.cwd();
const localImagePattern = /^\/images\//;
const remoteImagePattern = /^https?:\/\//;

function assertLocalImageExists(src: string, label: string) {
  if (!localImagePattern.test(src)) return;

  const absolutePath = path.join(projectRoot, 'public', src.replace(/^\//, ''));
  assert.ok(existsSync(absolutePath), `${label} references a missing image: ${src}`);
}

test('fragrance product image paths are present or remote URLs', () => {
  for (const fragrance of fragrances) {
    assert.ok(fragrance.imageUrl, `${fragrance.brand} ${fragrance.name} is missing imageUrl`);
    assert.ok(
      localImagePattern.test(fragrance.imageUrl) || remoteImagePattern.test(fragrance.imageUrl),
      `${fragrance.brand} ${fragrance.name} has an invalid imageUrl: ${fragrance.imageUrl}`,
    );
    assertLocalImageExists(fragrance.imageUrl, `${fragrance.brand} ${fragrance.name}`);
  }
});

test('quiz image-card options use valid local assets', () => {
  for (const question of quizQuestions) {
    if (question.type !== 'image-cards') continue;

    const seen = new Set<string>();
    for (const option of question.options) {
      assert.ok(option.imageUrl, `${question.id}/${option.id} is missing imageUrl`);
      assert.ok(
        localImagePattern.test(option.imageUrl) || remoteImagePattern.test(option.imageUrl),
        `${question.id}/${option.id} has an invalid imageUrl: ${option.imageUrl}`,
      );
      assertLocalImageExists(option.imageUrl, `${question.id}/${option.id}`);
      assert.equal(seen.has(option.imageUrl), false, `${question.id} repeats image ${option.imageUrl}`);
      seen.add(option.imageUrl);
    }
  }
});

test('shared product fallback image exists', () => {
  assertLocalImageExists('/images/products/fallback.svg', 'product fallback');
});
