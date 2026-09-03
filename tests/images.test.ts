import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  fragrances,
  recommendableFragrances,
  fragrancesMissingProductImage,
  FALLBACK_PRODUCT_IMAGE,
} from '@/lib/fragrances';
import { getRecommendations } from '@/lib/scoring';
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

test('every recommendable fragrance has a real, existing product image', () => {
  assert.ok(recommendableFragrances.length > 0, 'expected at least one recommendable fragrance');
  for (const fragrance of recommendableFragrances) {
    assert.equal(
      fragrance.hasProductImage,
      true,
      `${fragrance.id} is recommendable but flagged as missing a product image`,
    );
    assert.notEqual(
      fragrance.imageUrl,
      FALLBACK_PRODUCT_IMAGE,
      `${fragrance.id} is recommendable but uses the fallback image`,
    );
    assertLocalImageExists(fragrance.imageUrl, `${fragrance.brand} ${fragrance.name}`);
  }
});

test('no two recommendable fragrances share the same product image', () => {
  const owners = new Map<string, string>();
  for (const fragrance of recommendableFragrances) {
    const existing = owners.get(fragrance.imageUrl);
    assert.equal(
      existing,
      undefined,
      `${fragrance.id} reuses ${existing}'s image ${fragrance.imageUrl}`,
    );
    owners.set(fragrance.imageUrl, fragrance.id);
  }
});

test('recommendation results never surface the fallback image', () => {
  const answerSets = [
    { 'who-for': 'me' },
    { 'who-for': 'gift', 'price-range': 'budget' },
    { 'who-for': 'not-sure', weather: 'hot-humid' },
  ];
  for (const answers of answerSets) {
    const recommendations = getRecommendations(answers);
    assert.ok(recommendations.length > 0, `expected recommendations for ${JSON.stringify(answers)}`);
    for (const { fragrance } of recommendations) {
      assert.equal(
        fragrance.hasProductImage,
        true,
        `recommended ${fragrance.id} lacks a real product image`,
      );
      assert.notEqual(
        fragrance.imageUrl,
        FALLBACK_PRODUCT_IMAGE,
        `recommended ${fragrance.id} uses the fallback image`,
      );
    }
  }
});

test('fragrances missing a photo are excluded from the recommendable set', () => {
  const recommendableIds = new Set(recommendableFragrances.map(fragrance => fragrance.id));
  for (const fragrance of fragrancesMissingProductImage) {
    assert.equal(
      recommendableIds.has(fragrance.id),
      false,
      `${fragrance.id} lacks an image yet appears in the recommendable set`,
    );
  }
  assert.equal(
    recommendableFragrances.length + fragrancesMissingProductImage.length,
    fragrances.length,
    'recommendable + missing should partition the full catalogue',
  );
});
