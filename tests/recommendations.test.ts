import assert from 'node:assert/strict';
import test from 'node:test';
import { getMatchBreakdown, getRecommendations, type QuizAnswers, violatesAvoidRules } from '@/lib/scoring';
import { fragrances } from '@/lib/fragrances';

function answersWithAvoid(...avoid: string[]): QuizAnswers {
  return {
    'who-for': ['me'],
    'desired-feel': ['expensive', 'mysterious'],
    occasion: ['daily'],
    'scent-family': ['woody'],
    'disliked-notes': avoid,
    projection: ['moderate'],
    weather: ['all-year'],
    'price-range': ['any'],
    experience: ['intermediate'],
    'compliment-style': ['only-you'],
  };
}

function assertNoViolations(answers: QuizAnswers) {
  const recommendations = getRecommendations(answers, 20);
  assert.ok(recommendations.length > 0, 'expected at least one recommendation after applying avoid rules');
  const offenders = recommendations
    .map(result => result.fragrance)
    .filter(fragrance => violatesAvoidRules(fragrance, answers))
    .map(fragrance => `${fragrance.brand} ${fragrance.name}`);

  assert.deepEqual(offenders, []);
}

test('oud red flag excludes oud scents from recommendations', () => {
  assertNoViolations(answersWithAvoid('oud'));
});

test('too strong red flag excludes strong projection scents from recommendations', () => {
  assertNoViolations(answersWithAvoid('too-strong'));
});

test('rose red flag excludes rose-heavy scents from recommendations', () => {
  assertNoViolations(answersWithAvoid('rose'));
});

test('too sweet red flag excludes heavy gourmand and sugar scents from recommendations', () => {
  assertNoViolations(answersWithAvoid('too-sweet'));
});

test('hard red flags are represented as strict safety checks in the breakdown', () => {
  const answers = answersWithAvoid('oud', 'rose', 'too-strong');
  const recommendations = getRecommendations(answers, 12);

  assert.ok(recommendations.length > 0, 'expected recommendations after applying strict red flags');
  for (const result of recommendations) {
    assert.equal(result.matchBreakdown.redFlagSafety, 100);
    assert.equal(result.matchBreakdown.hardFiltersPassed, result.matchBreakdown.hardFiltersTotal);
    assert.equal(violatesAvoidRules(result.fragrance, answers), false);
  }
});

test('match breakdown scores stay inside a 0 to 100 range', () => {
  const answers = answersWithAvoid('too-sweet');
  const numericKeys = [
    'overall',
    'scentProfileFit',
    'occasionFit',
    'budgetFit',
    'climateFit',
    'projectionFit',
    'redFlagSafety',
    'notesOverlap',
    'uniquenessScore',
    'wearabilityScore',
    'confidenceScore',
  ] as const;

  for (const fragrance of fragrances.slice(0, 60)) {
    const breakdown = getMatchBreakdown(fragrance, answers);
    for (const key of numericKeys) {
      assert.ok(
        breakdown[key] >= 0 && breakdown[key] <= 100,
        `${fragrance.brand} ${fragrance.name} ${key} should be 0-100, got ${breakdown[key]}`,
      );
    }
  }
});
