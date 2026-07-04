import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecommendations, type QuizAnswers, violatesAvoidRules } from '@/lib/scoring';

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
