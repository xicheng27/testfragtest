import {
  recommendableFragrances,
  Fragrance,
  Occasion,
  PriceRange,
  Projection,
  ScentFamily,
} from './fragrances';

// Only fragrances with a real product photograph are eligible; entries that
// would fall back to a generic illustration are excluded from every result set
// until a genuine packshot exists. The scoring logic itself is unchanged — only
// the candidate pool is scoped.
const fragrances = recommendableFragrances;

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export type RecommendationType =
  | 'best'
  | 'safe'
  | 'unique'
  | 'weather'
  | 'budget'
  | 'dateNight'
  | 'workSchool'
  | 'similar';

export interface ScoredFragrance {
  fragrance: Fragrance;
  score: number;
  matchPercent: number;
  matchReason: string;
  matchReasons: string[];
  recommendationType: RecommendationType;
  recommendationLabel: string;
  matchBreakdown: MatchBreakdown;
}

export interface MatchBreakdown {
  overall: number;
  scentProfileFit: number;
  occasionFit: number;
  budgetFit: number;
  climateFit: number;
  projectionFit: number;
  redFlagSafety: number;
  notesOverlap: number;
  uniquenessScore: number;
  wearabilityScore: number;
  confidenceScore: number;
  hardFiltersPassed: number;
  hardFiltersTotal: number;
  softPreferencesMatched: number;
  softPreferencesTotal: number;
  missingDataFields: string[];
  matchType: 'Exact match' | 'Strong match' | 'Partial match' | 'Closest alternative';
}

const RECOMMENDATION_LABELS: Record<RecommendationType, string> = {
  best: 'Best Match',
  safe: 'Safest Pick',
  unique: 'More Unique Pick',
  weather: 'Best for Your Weather',
  budget: 'Best for Your Budget',
  dateNight: 'Date / Night Pick',
  workSchool: 'School / Work Pick',
  similar: 'You May Also Like',
};

const FEEL_SIGNALS: Record<string, string[]> = {
  clean: ['clean', 'fresh', 'musk', 'citrus', 'linen', 'subtle', 'daily'],
  comforting: ['comforting', 'cozy', 'soft', 'woody', 'vanilla', 'amber', 'winter'],
  mysterious: ['mysterious', 'addictive', 'amber', 'spicy', 'night', 'oriental'],
  expensive: ['expensive', 'elegant', 'quiet-luxury', 'old-money', 'woody', 'niche'],
  playful: ['sweet', 'fruity', 'gourmand', 'vanilla', 'playful', 'compliment'],
  sporty: ['fresh', 'clean', 'aquatic', 'citrus', 'green', 'casual', 'subtle'],
  bold: ['bold', 'strong', 'night', 'smoky', 'leather', 'spicy', 'amber'],
  intimate: ['intimate', 'soft', 'musk', 'skin', 'subtle', 'date'],
};

const SCENT_WORLD_SIGNALS: Record<string, string[]> = {
  clean: ['clean', 'musk', 'linen', 'fresh-laundry', 'skin', 'subtle'],
  aquatic: ['aquatic', 'citrus', 'marine', 'fresh', 'summer'],
  gourmand: ['gourmand', 'sweet', 'vanilla', 'caramel', 'praline'],
  floral: ['floral', 'rose', 'white floral', 'romantic', 'soft'],
  woody: ['woody', 'sandalwood', 'cedar', 'vetiver', 'elegant'],
  oriental: ['smoky', 'leather', 'tobacco', 'incense', 'dark', 'night'],
  fresh: ['tea', 'matcha', 'green', 'fresh', 'clean', 'calm'],
  spicy: ['spicy', 'amber', 'warm', 'oriental', 'addictive'],
};

const STATEMENT_SIGNALS: Record<string, string[]> = {
  'you-smell-clean': ['clean', 'fresh', 'musk', 'daily', 'subtle'],
  'what-is-that': ['addictive', 'compliment', 'strong', 'unique', 'night'],
  'soft-comfort': ['comforting', 'soft', 'musk', 'vanilla', 'intimate'],
  'rich-mysterious': ['mysterious', 'amber', 'spicy', 'oud', 'night'],
  'only-you': ['unique', 'niche', 'unusual', 'mysterious', 'intimate'],
};

const DISLIKE_SIGNALS: Record<string, string[]> = {
  'too-sweet': ['sweet', 'gourmand', 'sugar', 'caramel', 'praline', 'honey', 'candy'],
  oud: ['oud', 'agarwood'],
  smoke: ['smoke', 'smoky', 'tobacco', 'incense', 'burnt'],
  powdery: ['powdery', 'iris', 'violet', 'aldehydic', 'makeup'],
  vanilla: ['vanilla', 'tonka', 'caramel', 'praline', 'benzoin'],
  rose: ['rose'],
  leather: ['leather', 'suede', 'animalic'],
  mature: ['mature', 'vintage', 'aldehydic', 'powdery', 'classic'],
};

const HOT_HUMID_GOOD = ['fresh', 'clean', 'citrus', 'aquatic', 'green', 'tea', 'musk', 'marine', 'linen'];
const HOT_HUMID_BAD = ['oud', 'tobacco', 'smoky', 'leather', 'heavy', 'dense', 'amber', 'vanilla', 'gourmand'];

function getAnswer(answers: QuizAnswers, id: string): string {
  const value = answers[id];
  if (!value) return '';
  return Array.isArray(value) ? value[0] : value;
}

function getAnswers(answers: QuizAnswers, id: string): string[] {
  const value = answers[id];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function allSignals(fragrance: Fragrance) {
  return [
    ...fragrance.scentFamilies,
    ...fragrance.notes,
    ...fragrance.accords,
    ...fragrance.vibeTags,
    ...fragrance.occasions,
    ...fragrance.seasons,
    ...fragrance.aesthetics,
    ...fragrance.vibes,
    ...fragrance.moods,
    fragrance.projection,
    fragrance.longevity,
    fragrance.tier,
    fragrance.priceRange,
  ].map(signal => signal.toLowerCase());
}

function hasAny(fragrance: Fragrance, terms: string[]) {
  const signals = allSignals(fragrance);
  return terms.some(term => signals.some(signal => signal.includes(term)));
}

export function violatesAvoidRules(fragrance: Fragrance, answers: QuizAnswers) {
  const disliked = getAnswers(answers, 'disliked-notes');
  if (disliked.length === 0 || disliked.includes('none')) return false;

  return disliked.some(dislike => {
    if (dislike === 'too-strong') return fragrance.projection === 'strong';
    return hasAny(fragrance, DISLIKE_SIGNALS[dislike] ?? []);
  });
}

export function getStrictMatchCount(answers: QuizAnswers) {
  return fragrances.filter(fragrance => !violatesAvoidRules(fragrance, answers)).length;
}

function signalMatches(fragrance: Fragrance, terms: string[]) {
  const signals = allSignals(fragrance);
  return terms.filter(term => signals.some(signal => signal.includes(term))).length;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function percentFromMatches(matches: number, total: number, emptyDefault = 76) {
  if (total <= 0) return emptyDefault;
  return clampPercent((matches / total) * 100);
}

function priceIndex(price: PriceRange) {
  return ['budget', 'mid', 'designer', 'niche'].indexOf(price);
}

function answerLabel(value: string) {
  return value.replaceAll('-', ' ');
}

function confidenceBase(fragrance: Fragrance) {
  const sourceScore = fragrance.sourceQuality === 'official'
    ? 100
    : fragrance.sourceQuality === 'retailer'
      ? 88
      : fragrance.sourceQuality === 'community'
        ? 70
        : 48;
  const coverageScore = fragrance.coverageStatus === 'officially_verified'
    ? 100
    : fragrance.coverageStatus === 'expanded'
      ? 82
      : fragrance.coverageStatus === 'partial'
        ? 66
        : 48;
  return Math.round((sourceScore + coverageScore) / 2);
}

export function getMatchBreakdown(fragrance: Fragrance, answers: QuizAnswers): MatchBreakdown {
  const feelAnswers = getAnswers(answers, 'desired-feel');
  const scentWorlds = getAnswers(answers, 'scent-family');
  const occasions = getAnswers(answers, 'occasion') as Array<Occasion | 'everything'>;
  const weather = getAnswer(answers, 'weather');
  const projection = getAnswer(answers, 'projection');
  const budget = getAnswer(answers, 'price-range') as PriceRange | 'any' | '';
  const experience = getAnswer(answers, 'experience');
  const compliment = getAnswer(answers, 'compliment-style');

  const feelTerms = feelAnswers.flatMap(answer => FEEL_SIGNALS[answer] ?? []);
  const scentTerms = scentWorlds.flatMap(answer => SCENT_WORLD_SIGNALS[answer] ?? []);
  const complimentTerms = STATEMENT_SIGNALS[compliment] ?? [];

  const scentFamilyDirect = scentWorlds.filter(world => fragrance.scentFamilies.includes(world as ScentFamily)).length;
  const scentProfileFit = clampPercent(
    (percentFromMatches(signalMatches(fragrance, feelTerms), Math.min(feelTerms.length, Math.max(feelAnswers.length * 3, 1)), 78) * 0.42)
    + (percentFromMatches(scentFamilyDirect + signalMatches(fragrance, scentTerms), Math.max(scentWorlds.length + Math.min(scentTerms.length, 4), 1), 78) * 0.58),
  );

  const occasionMatches = occasions.filter(occasion => (
    occasion === 'everything'
      ? fragrance.occasions.includes('daily') || fragrance.occasions.includes('work')
      : fragrance.occasions.includes(occasion as Occasion)
  )).length;
  const occasionFit = percentFromMatches(occasionMatches, occasions.length, 82);

  const budgetFit = !budget || budget === 'any'
    ? 90
    : clampPercent(100 - Math.max(0, priceIndex(fragrance.priceRange) - priceIndex(budget)) * 28);

  const climateFit = weather === 'hot-humid'
    ? clampPercent(58 + signalMatches(fragrance, HOT_HUMID_GOOD) * 14 - signalMatches(fragrance, HOT_HUMID_BAD) * 18 - (fragrance.projection === 'strong' ? 14 : 0))
    : weather === 'cool'
      ? clampPercent(62 + signalMatches(fragrance, ['vanilla', 'amber', 'woody', 'spicy', 'cozy', 'winter']) * 10)
      : weather === 'indoor'
        ? clampPercent(86 - (fragrance.projection === 'strong' ? 32 : 0) + (fragrance.occasions.includes('work') ? 8 : 0))
        : weather === 'all-year'
          ? clampPercent(72 + (fragrance.occasions.includes('daily') ? 12 : 0) + (fragrance.projection === 'moderate' ? 10 : 0))
          : 78;

  const projectionFit = !projection
    ? 78
    : projection === 'beast'
      ? (fragrance.projection === 'strong' ? 100 : fragrance.projection === 'moderate' ? 72 : 42)
      : fragrance.projection === projection
        ? 100
        : projection === 'subtle' && fragrance.projection === 'strong'
          ? 24
          : projection === 'moderate' && fragrance.projection === 'strong'
            ? 54
            : 74;

  const redFlagSafety = violatesAvoidRules(fragrance, answers) ? 0 : 100;
  const notesOverlap = percentFromMatches(
    signalMatches(fragrance, [...feelTerms, ...scentTerms, ...complimentTerms]),
    Math.min([...feelTerms, ...scentTerms, ...complimentTerms].length, 10),
    74,
  );
  const uniquenessScore = experience === 'unique'
    ? clampPercent(62 + (fragrance.tier === 'niche' ? 24 : 0) + signalMatches(fragrance, ['unique', 'unusual', 'artistic', 'experimental', 'mysterious']) * 6)
    : clampPercent(78 + (fragrance.isDupe ? -8 : 0) + (fragrance.tier === 'designer' ? 6 : 0));
  const wearabilityScore = clampPercent(
    68
    + (fragrance.occasions.includes('daily') ? 12 : 0)
    + (fragrance.occasions.includes('work') ? 10 : 0)
    + (fragrance.projection === 'strong' ? -14 : 8)
    + (fragrance.priceRange === 'budget' || fragrance.priceRange === 'mid' ? 6 : 0),
  );

  const missingDataFields = [
    fragrance.sourceQuality === 'unknown' ? 'source provenance' : null,
    fragrance.coverageStatus === 'needs_review' ? 'catalog verification' : null,
    fragrance.availabilityStatus === 'unknown' ? 'availability' : null,
    !fragrance.concentration ? 'concentration' : null,
    fragrance.topNotes.length === 0 || fragrance.middleNotes.length === 0 || fragrance.baseNotes.length === 0 ? 'note pyramid' : null,
  ].filter((value): value is string => Boolean(value));
  const confidenceScore = clampPercent(confidenceBase(fragrance) - missingDataFields.length * 6 + (fragrance.productUrl ? 4 : 0));

  const hardChecks = [
    redFlagSafety === 100,
    budget ? budgetFit >= 72 : true,
    projection ? projectionFit >= 54 : true,
    weather ? climateFit >= 58 : true,
  ];
  const softScores = [scentProfileFit, occasionFit, notesOverlap, uniquenessScore, wearabilityScore].filter(score => score > 0);
  const hardFiltersPassed = hardChecks.filter(Boolean).length;
  const hardFiltersTotal = hardChecks.length;
  const softPreferencesMatched = softScores.filter(score => score >= 75).length;
  const softPreferencesTotal = softScores.length;
  const overall = clampPercent(
    scentProfileFit * 0.2
    + occasionFit * 0.14
    + budgetFit * 0.11
    + climateFit * 0.12
    + projectionFit * 0.1
    + redFlagSafety * 0.15
    + notesOverlap * 0.08
    + wearabilityScore * 0.06
    + confidenceScore * 0.04,
  );

  return {
    overall,
    scentProfileFit,
    occasionFit,
    budgetFit,
    climateFit,
    projectionFit,
    redFlagSafety,
    notesOverlap,
    uniquenessScore,
    wearabilityScore,
    confidenceScore,
    hardFiltersPassed,
    hardFiltersTotal,
    softPreferencesMatched,
    softPreferencesTotal,
    missingDataFields,
    matchType: overall >= 90
      ? 'Exact match'
      : overall >= 82
        ? 'Strong match'
        : overall >= 72
          ? 'Partial match'
          : 'Closest alternative',
  };
}

function joinFriendly(values: string[]) {
  if (values.length <= 1) return values[0] ?? '';
  return `${values.slice(0, -1).join(', ')} and ${values.at(-1)}`;
}

function priceScore(fragrance: Fragrance, answer: string) {
  if (!answer || answer === 'any') return 10;
  const order: PriceRange[] = ['budget', 'mid', 'designer', 'niche'];
  const userIndex = order.indexOf(answer as PriceRange);
  const fragranceIndex = order.indexOf(fragrance.priceRange);
  if (fragranceIndex <= userIndex) return 34;
  return -28 * (fragranceIndex - userIndex);
}

function projectionScore(fragrance: Fragrance, answer: string) {
  if (!answer) return 0;
  const target = answer === 'beast' ? 'strong' : answer as Projection;
  if (fragrance.projection === target) return answer === 'beast' ? 34 : 24;
  if (answer === 'subtle' && fragrance.projection === 'strong') return -90;
  if (answer === 'moderate' && fragrance.projection === 'strong') return -42;
  if ((answer === 'strong' || answer === 'beast') && fragrance.projection === 'subtle') return -12;
  return -4;
}

export function scoreFragrance(fragrance: Fragrance, answers: QuizAnswers): number {
  let score = 50;

  const feelAnswers = getAnswers(answers, 'desired-feel');
  for (const answer of feelAnswers) {
    score += Math.min(signalMatches(fragrance, FEEL_SIGNALS[answer] ?? []), 3) * 14;
  }

  const scentWorlds = getAnswers(answers, 'scent-family') as ScentFamily[];
  for (const world of scentWorlds) {
    if (fragrance.scentFamilies.includes(world)) score += 34;
    score += Math.min(signalMatches(fragrance, SCENT_WORLD_SIGNALS[world] ?? []), 2) * 12;
  }

  const occasions = getAnswers(answers, 'occasion') as Array<Occasion | 'everything'>;
  if (occasions.includes('everything')) {
    if (fragrance.occasions.includes('daily') || fragrance.occasions.includes('work')) score += 28;
    if (fragrance.projection !== 'strong') score += 12;
  }
  if (occasions.some(occasion => occasion !== 'everything' && fragrance.occasions.includes(occasion as Occasion))) {
    score += 32;
  }
  if (occasions.includes('daily') || occasions.includes('work')) {
    if (hasAny(fragrance, ['office-safe', 'school-friendly', 'clean', 'fresh', 'musk'])) score += 18;
    if (fragrance.projection === 'strong') score -= 36;
  }
  if (occasions.includes('date')) {
    score += signalMatches(fragrance, ['musky', 'musk', 'vanilla', 'amber', 'soft', 'intimate', 'romantic']) * 8;
    if (fragrance.projection === 'strong') score -= 12;
  }
  if (occasions.includes('night')) {
    score += signalMatches(fragrance, ['bold', 'amber', 'spicy', 'sweet', 'night', 'addictive']) * 10;
    if (fragrance.projection === 'strong') score += 16;
  }

  score += projectionScore(fragrance, getAnswer(answers, 'projection'));
  score += priceScore(fragrance, getAnswer(answers, 'price-range'));

  const whoFor = getAnswer(answers, 'who-for');
  if (whoFor === 'gift' || whoFor === 'not-sure') {
    if (fragrance.occasions.includes('daily') || fragrance.occasions.includes('work')) score += 18;
    if (fragrance.projection !== 'strong') score += 18;
    if (fragrance.tier === 'designer' || fragrance.priceRange === 'mid') score += 10;
    if (hasAny(fragrance, ['oud', 'smoky', 'leather', 'animalic'])) score -= 45;
  }

  const weather = getAnswer(answers, 'weather');
  if (weather === 'hot-humid') {
    score += Math.min(signalMatches(fragrance, HOT_HUMID_GOOD), 3) * 18;
    score -= Math.min(signalMatches(fragrance, HOT_HUMID_BAD), 3) * 24;
    if (fragrance.projection === 'strong' && !occasions.includes('night')) score -= 45;
    if (fragrance.seasons.includes('summer') || fragrance.seasons.includes('spring')) score += 15;
  } else if (weather === 'cool') {
    score += signalMatches(fragrance, ['vanilla', 'amber', 'woody', 'spicy', 'cozy', 'winter']) * 10;
  } else if (weather === 'indoor') {
    if (fragrance.projection !== 'strong') score += 22;
    if (fragrance.occasions.includes('work')) score += 12;
  } else if (weather === 'all-year') {
    if (fragrance.occasions.includes('daily') && fragrance.projection === 'moderate') score += 22;
  }

  const experience = getAnswer(answers, 'experience');
  if (experience === 'beginner') {
    if (fragrance.occasions.includes('daily') || fragrance.occasions.includes('work')) score += 20;
    if (fragrance.tier === 'designer' || fragrance.priceRange === 'mid') score += 12;
    if (fragrance.projection === 'strong') score -= 28;
    if (hasAny(fragrance, ['oud', 'smoky', 'animalic', 'leather', 'experimental'])) score -= 42;
  } else if (experience === 'unique') {
    if (fragrance.tier === 'niche') score += 34;
    score += signalMatches(fragrance, ['unique', 'unusual', 'artistic', 'experimental', 'mysterious']) * 12;
  }

  const statement = getAnswer(answers, 'compliment-style');
  score += Math.min(signalMatches(fragrance, STATEMENT_SIGNALS[statement] ?? []), 3) * 14;

  const disliked = getAnswers(answers, 'disliked-notes');
  if (!disliked.includes('none')) {
    for (const dislike of disliked) {
      if (dislike === 'too-strong' && fragrance.projection === 'strong') score -= 110;
      const terms = DISLIKE_SIGNALS[dislike] ?? [];
      if (terms.length && hasAny(fragrance, terms)) score -= 95;
    }
  }

  return score;
}

function buildMatchReasons(fragrance: Fragrance, answers: QuizAnswers): string[] {
  const reasons: string[] = [];
  const feel = getAnswers(answers, 'desired-feel');
  const matchedFeels = feel.filter(answer => signalMatches(fragrance, FEEL_SIGNALS[answer] ?? []) > 0);
  if (matchedFeels.length) {
    reasons.push(`It matches your ${joinFriendly(matchedFeels.map(label => label.replaceAll('-', ' ')))} scent energy.`);
  }

  const scentWorlds = getAnswers(answers, 'scent-family');
  const matchedWorlds = scentWorlds.filter(world => (
    fragrance.scentFamilies.includes(world as ScentFamily)
    || signalMatches(fragrance, SCENT_WORLD_SIGNALS[world] ?? []) > 0
  ));
  if (matchedWorlds.length) {
    reasons.push(`The notes sit close to the ${joinFriendly(matchedWorlds.map(label => label.replaceAll('-', ' ')))} world you picked.`);
  }

  const occasions = getAnswers(answers, 'occasion');
  const matchedOccasion = occasions.find(occasion => (
    occasion === 'everything'
      ? fragrance.occasions.includes('daily') || fragrance.occasions.includes('work')
      : fragrance.occasions.includes(occasion as Occasion)
  ));
  if (matchedOccasion) {
    reasons.push(
      matchedOccasion === 'everything'
        ? 'It is versatile enough to work as an everyday signature.'
        : `It makes sense for ${matchedOccasion.replaceAll('-', ' ')} without feeling random.`,
    );
  }

  const weather = getAnswer(answers, 'weather');
  if (weather === 'hot-humid' && hasAny(fragrance, HOT_HUMID_GOOD)) {
    reasons.push('It leans fresh enough for hot or humid weather.');
  } else if (weather === 'cool' && hasAny(fragrance, ['vanilla', 'amber', 'woody', 'spicy'])) {
    reasons.push('It has the warmer texture you wanted for cooler weather.');
  }

  const projection = getAnswer(answers, 'projection');
  if (projection && (projection === fragrance.projection || (projection === 'beast' && fragrance.projection === 'strong'))) {
    reasons.push(`The strength lines up with your ${projection === 'beast' ? 'high-presence' : projection} preference.`);
  }

  const disliked = getAnswers(answers, 'disliked-notes').filter(answer => answer !== 'none');
  if (disliked.length > 0 && !violatesAvoidRules(fragrance, answers)) {
    reasons.push(`It avoids your ${joinFriendly(disliked.map(answerLabel))} red flags.`);
  }

  if (reasons.length === 0) {
    reasons.push(`Its ${joinFriendly(fragrance.scentFamilies.slice(0, 2))} profile was one of the closest overall fits.`);
  }

  return reasons.slice(0, 3);
}

function normaliseScore(score: number, maxScore: number) {
  if (maxScore <= 0) return 60;
  const ratio = Math.max(0, score) / maxScore;
  return Math.max(55, Math.min(98, Math.round(58 + ratio * 40)));
}

export function buildScentProfile(answers: QuizAnswers) {
  const feels = getAnswers(answers, 'desired-feel');
  const occasion = getAnswers(answers, 'occasion');
  const weather = getAnswer(answers, 'weather');
  const experience = getAnswer(answers, 'experience');
  const statement = getAnswer(answers, 'compliment-style');

  if (weather === 'hot-humid' || feels.includes('sporty')) {
    return {
      title: 'Fresh Hot Weather Signature',
      description: 'Clean, easy, and built for real life. Think fresh air, light texture, and scents that do not overwhelm.',
    };
  }
  if (feels.includes('expensive')) {
    return {
      title: 'Soft Luxury Minimalist',
      description: 'Polished, smooth, and expensive-feeling without trying too hard.',
    };
  }
  if (occasion.includes('night') || feels.includes('bold') || statement === 'rich-mysterious') {
    return {
      title: 'After Dark Amber Signature',
      description: 'Darker, warmer, and more memorable, with enough presence to feel intentional.',
    };
  }
  if (occasion.includes('date') || feels.includes('intimate')) {
    return {
      title: 'Warm Date Night Signature',
      description: 'Soft, close, and attractive without shouting across the room.',
    };
  }
  if (feels.includes('playful')) {
    return {
      title: 'Sweet Cozy Signature',
      description: 'Fun, warm, and compliment-friendly, with sweetness kept useful instead of random.',
    };
  }
  if (experience === 'unique' || statement === 'only-you') {
    return {
      title: 'Niche Explorer Signature',
      description: 'A little less obvious, a little more signature-worthy, and still wearable.',
    };
  }
  if (feels.includes('comforting')) {
    return {
      title: 'Soft Comfort Signature',
      description: 'Comforting, warm, and easy to live in, like a scent version of soft lighting.',
    };
  }
  return {
    title: 'Clean Skin Main Character',
    description: 'Fresh, simple, and put-together. Nothing fussy, just a scent that feels like you.',
  };
}

export function getRecommendations(answers: QuizAnswers, topN = 7): ScoredFragrance[] {
  const strictPool = fragrances.filter(fragrance => !violatesAvoidRules(fragrance, answers));
  const scored = strictPool
    .map(fragrance => ({ fragrance, score: scoreFragrance(fragrance, answers) }))
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  const maxScore = scored[0]?.score ?? 1;
  const selected = new Set<string>();
  const pick = (type: RecommendationType, predicate: (item: typeof scored[number]) => boolean) => {
    const item = scored.find(candidate => !selected.has(candidate.fragrance.id) && predicate(candidate));
    if (!item) return undefined;
    selected.add(item.fragrance.id);
    return [type, item] as const;
  };

  const weather = getAnswer(answers, 'weather');
  const priceAnswer = getAnswer(answers, 'price-range');
  const occasions = getAnswers(answers, 'occasion');

  const picks = [
    pick('best', item => !item.fragrance.isDupe),
    pick('safe', item => (
      item.fragrance.projection !== 'strong'
      && (item.fragrance.occasions.includes('daily') || item.fragrance.occasions.includes('work'))
      && !hasAny(item.fragrance, ['oud', 'smoky', 'leather', 'animalic'])
    )),
    pick('unique', item => item.fragrance.tier === 'niche' && !item.fragrance.isDupe),
    pick('weather', item => (
      weather === 'hot-humid'
        ? hasAny(item.fragrance, HOT_HUMID_GOOD) && item.fragrance.projection !== 'strong'
        : weather === 'cool'
          ? hasAny(item.fragrance, ['vanilla', 'amber', 'woody', 'spicy'])
          : item.fragrance.occasions.includes('daily')
    )),
    pick('budget', item => (
      priceAnswer === 'any'
        ? item.score > 0
        : item.fragrance.isDupe || item.fragrance.priceRange === priceAnswer || item.fragrance.priceRange === 'budget'
    )),
    pick(
      occasions.includes('date') || occasions.includes('night') ? 'dateNight' : 'workSchool',
      item => occasions.includes('date') || occasions.includes('night')
        ? item.fragrance.occasions.includes('date') || item.fragrance.occasions.includes('night')
        : item.fragrance.occasions.includes('daily') || item.fragrance.occasions.includes('work'),
    ),
  ].filter((item): item is readonly [RecommendationType, typeof scored[number]] => Boolean(item));

  for (const item of scored) {
    if (picks.length >= topN) break;
    if (selected.has(item.fragrance.id)) continue;
    selected.add(item.fragrance.id);
    picks.push(['similar', item]);
  }

  return picks.slice(0, topN).map(([recommendationType, item]) => {
    const matchReasons = buildMatchReasons(item.fragrance, answers);
    const matchBreakdown = getMatchBreakdown(item.fragrance, answers);
    return {
      ...item,
      recommendationType,
      recommendationLabel: RECOMMENDATION_LABELS[recommendationType],
      matchPercent: Math.round((normaliseScore(item.score, maxScore) + matchBreakdown.overall) / 2),
      matchReason: matchReasons.join(' '),
      matchReasons,
      matchBreakdown,
    };
  });
}
