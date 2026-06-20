import { fragrances, Fragrance, ScentFamily, Occasion, GenderStyle, Projection, PriceRange, Tier, Aesthetic, Vibe } from './fragrances';

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export interface ScoredFragrance {
  fragrance: Fragrance;
  score: number;
  matchPercent: number;
  matchReason: string;
  matchReasons: string[];
  recommendationType: RecommendationType;
  recommendationLabel: string;
}

export type RecommendationType = 'best' | 'affordable' | 'similar' | 'everyday' | 'unique';

// ──────────────────────────────────────────────────────────────────────────────
// SCORING SYSTEM
// Each matching criterion adds a weighted score. The fragrance with the highest
// total score wins. Weights are tunable below — edit freely.
// ──────────────────────────────────────────────────────────────────────────────

const WEIGHTS = {
  scentFamily: 30,     // scent family match (per family matched)
  occasion: 20,        // occasion match
  projection: 15,      // projection match
  genderStyle: 8,      // marketed gender is a light preference, never a filter
  priceRange: 25,      // price range — hard filter softened to score penalty
  tier: 10,            // designer vs niche preference
  vibe: 20,            // vibe / setting match
  aesthetic: 20,       // aesthetic match
  season: 10,          // season match
  mood: 15,            // mood match
  longevity: 10,       // inferred from projection
  personalSignal: 7,   // premium lifestyle and memory questions
  dislikedNote: -40,   // penalty if fragrance contains a disliked note
};

const PERSONALISATION_SIGNALS: Record<string, Record<string, string[]>> = {
  // Visual choices translate scenes into editable scent-language signals here.
  season: {
    spring: ['floral', 'fruity', 'musk', 'fresh', 'soft', 'romantic'],
    summer: ['fresh', 'citrus', 'aquatic', 'coconut', 'marine', 'beach'],
    autumn: ['woody', 'spicy', 'amber', 'smoky', 'tea', 'dark-academia'],
    winter: ['vanilla', 'amber', 'oud', 'tobacco', 'warm spicy', 'night'],
  },
  aesthetic: {
    clean: ['clean', 'fresh', 'musk', 'subtle', 'morning-light'],
    'old-money': ['old-money', 'woody', 'elegant', 'quiet-luxury', 'tailored'],
    'dark-academia': ['dark-academia', 'woody', 'spicy', 'tea', 'smoky'],
    beach: ['beach', 'citrus', 'aquatic', 'coconut', 'summer'],
    'quiet-luxury': ['quiet-luxury', 'expensive', 'elegant', 'moderate'],
    streetwear: ['late-night-city', 'bold', 'spicy', 'confident'],
    romantic: ['romantic', 'floral', 'fruity', 'musk', 'soft'],
  },
  vibe: {
    'rainy-castle': ['woody', 'amber', 'smoky', 'tea', 'mysterious'],
    'sunny-beach': ['fresh', 'citrus', 'aquatic', 'coconut', 'marine'],
    'late-night-city': ['amber', 'vanilla', 'spicy', 'bold', 'night'],
    'hotel-room': ['clean', 'musk', 'subtle', 'quiet-luxury'],
    'forest-rain': ['green', 'woody', 'aquatic', 'tea', 'fresh'],
    'luxury-mall': ['expensive', 'amber', 'floral', 'elegant'],
  },
  occasion: {
    daily: ['daily', 'clean', 'fresh', 'moderate', 'versatile'],
    work: ['work', 'clean', 'subtle', 'woody', 'tailored'],
    date: ['date', 'romantic', 'intimate', 'floral', 'vanilla'],
    night: ['night', 'bold', 'amber', 'spicy', 'strong'],
    special: ['special', 'elegant', 'expensive', 'floral', 'oud'],
    casual: ['casual', 'fresh', 'citrus', 'aquatic', 'soft'],
  },
  'time-of-day': {
    'early-morning': ['morning-light', 'clean', 'fresh', 'subtle', 'daily'],
    'golden-hour': ['golden-hour', 'warm', 'romantic', 'elegant', 'date'],
    'blue-hour': ['quiet-luxury', 'intimate', 'floral', 'moderate'],
    midnight: ['midnight', 'night', 'strong', 'addictive', 'mysterious'],
  },
  'outfit-style': {
    tailored: ['tailored', 'old-money', 'quiet-luxury', 'elegant', 'work'],
    relaxed: ['clean', 'casual', 'soft', 'daily', 'versatile'],
    streetwear: ['streetwear', 'bold', 'late-night-city', 'confident'],
    evening: ['romantic', 'night', 'date', 'elegant', 'intimate'],
  },
  memory: {
    'clean-laundry': ['clean-laundry', 'clean', 'musk', 'soft', 'morning-light'],
    'seaside-holiday': ['seaside', 'sunny-beach', 'citrus', 'aquatic', 'summer'],
    'rain-on-stone': ['rain', 'mineral', 'forest-rain', 'woody', 'fresh'],
    'warm-embrace': ['embrace', 'comforting', 'vanilla', 'woody', 'winter'],
  },
  'desired-feel': {
    clean: ['clean', 'fresh', 'musk', 'subtle'],
    addictive: ['addictive', 'sweet', 'gourmand', 'strong'],
    mysterious: ['mysterious', 'oriental', 'spicy', 'night'],
    expensive: ['expensive', 'quiet-luxury', 'old-money', 'elegant'],
    comforting: ['comforting', 'soft', 'vanilla', 'woody'],
    bold: ['bold', 'strong', 'confident', 'spicy'],
    intimate: ['intimate', 'subtle', 'soft', 'date'],
  },
  'compliment-style': {
    'you-smell-clean': ['clean', 'fresh', 'musk', 'daily'],
    'what-is-that': ['addictive', 'strong', 'unique', 'mysterious'],
    'smells-expensive': ['expensive', 'quiet-luxury', 'elegant', 'niche'],
    'only-you': ['unique', 'niche', 'intimate', 'mysterious'],
  },
};

function getAnswer(answers: QuizAnswers, id: string): string {
  const val = answers[id];
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
}

function getAnswers(answers: QuizAnswers, id: string): string[] {
  const val = answers[id];
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export function scoreFragrance(fragrance: Fragrance, answers: QuizAnswers): number {
  let score = 0;

  // ── Scent family ──────────────────────────────────────────────────────────
  const likedFamilies = getAnswers(answers, 'scent-family') as ScentFamily[];
  const familyMatches = likedFamilies.filter(f => fragrance.scentFamilies.includes(f)).length;
  score += familyMatches * WEIGHTS.scentFamily;

  // ── Occasion ──────────────────────────────────────────────────────────────
  const occasion = getAnswer(answers, 'occasion') as Occasion;
  if (occasion && fragrance.occasions.includes(occasion)) {
    score += WEIGHTS.occasion;
  }

  // ── Projection ────────────────────────────────────────────────────────────
  const projection = getAnswer(answers, 'projection') as Projection;
  if (projection && fragrance.projection === projection) {
    score += WEIGHTS.projection;
  }

  // ── Gender style ──────────────────────────────────────────────────────────
  const genderStyle = getAnswer(answers, 'gender-style') as GenderStyle | 'any';
  if (genderStyle && genderStyle !== 'any') {
    if (fragrance.genderStyle === genderStyle) {
      score += WEIGHTS.genderStyle;
    } else if (fragrance.genderStyle === 'unisex') {
      score += WEIGHTS.genderStyle * 0.6;
    } else if (genderStyle === 'unisex') {
      score += WEIGHTS.genderStyle * 0.25;
    }
  }

  // ── Price range ───────────────────────────────────────────────────────────
  // Price range is treated as an inclusive range:
  // budget covers budget, mid covers budget+mid, designer covers all except niche, niche covers all
  const priceAnswer = getAnswer(answers, 'price-range') as PriceRange;
  const priceOrder: PriceRange[] = ['budget', 'mid', 'designer', 'niche'];
  if (priceAnswer) {
    const userIdx = priceOrder.indexOf(priceAnswer);
    const fragIdx = priceOrder.indexOf(fragrance.priceRange);
    if (fragIdx <= userIdx) {
      score += WEIGHTS.priceRange; // within budget
    } else {
      score -= WEIGHTS.priceRange * 0.5; // slightly over budget
    }
  }

  // ── Tier preference ───────────────────────────────────────────────────────
  const tierAnswer = getAnswer(answers, 'tier') as Tier | 'any';
  if (tierAnswer && tierAnswer !== 'any' && fragrance.tier === tierAnswer) {
    score += WEIGHTS.tier;
  } else if (tierAnswer === 'any') {
    score += WEIGHTS.tier * 0.5;
  }

  // ── Vibe ──────────────────────────────────────────────────────────────────
  const vibe = getAnswer(answers, 'vibe') as Vibe;
  if (vibe && fragrance.vibes.includes(vibe)) {
    score += WEIGHTS.vibe;
  }

  // ── Aesthetic ─────────────────────────────────────────────────────────────
  const aesthetic = getAnswer(answers, 'aesthetic') as Aesthetic;
  if (aesthetic && fragrance.aesthetics.includes(aesthetic)) {
    score += WEIGHTS.aesthetic;
  }

  // ── Season ────────────────────────────────────────────────────────────────
  const season = getAnswer(answers, 'season');
  if (season && fragrance.seasons.includes(season)) {
    score += WEIGHTS.season;
  }

  // ── Mood ──────────────────────────────────────────────────────────────────
  const mood = getAnswer(answers, 'mood');
  if (mood && fragrance.moods.includes(mood)) {
    score += WEIGHTS.mood;
  }

  // Extended answers refine the ranking without overriding the core preferences.
  const longevity = getAnswer(answers, 'longevity');
  const longevityProjection: Record<string, Projection> = {
    short: 'subtle',
    medium: 'moderate',
    long: 'strong',
  };
  if (longevity && fragrance.projection === longevityProjection[longevity]) {
    score += WEIGHTS.longevity;
  }

  const searchableTags = new Set([
    ...fragrance.vibeTags,
    ...fragrance.accords,
    ...fragrance.notes,
    ...fragrance.scentFamilies,
    ...fragrance.vibes,
    ...fragrance.aesthetics,
    ...fragrance.occasions,
    ...fragrance.seasons,
    ...fragrance.moods,
    fragrance.projection,
    fragrance.longevity,
    fragrance.tier,
  ].map(tag => tag.toLowerCase()));

  for (const [questionId, optionSignals] of Object.entries(PERSONALISATION_SIGNALS)) {
    for (const answer of getAnswers(answers, questionId)) {
      const signals = optionSignals[answer] ?? [];
      const matches = signals.filter(signal => (
        searchableTags.has(signal)
        || fragrance.notes.some(note => note.toLowerCase().includes(signal))
        || fragrance.accords.some(accord => accord.toLowerCase().includes(signal))
      )).length;
      score += Math.min(matches, 2) * WEIGHTS.personalSignal;
    }
  }

  // ── Disliked notes penalty ────────────────────────────────────────────────
  const dislikedNotes = getAnswers(answers, 'disliked-notes');
  if (!dislikedNotes.includes('none')) {
    for (const disliked of dislikedNotes) {
      const noteMatches = fragrance.notes.some(note =>
        note.toLowerCase().includes(disliked.toLowerCase()) ||
        // map category labels to note keywords
        (disliked === 'vanilla' && (note.toLowerCase().includes('vanilla') || note.toLowerCase().includes('tonka') || note.toLowerCase().includes('praline') || note.toLowerCase().includes('caramel'))) ||
        (disliked === 'rose' && note.toLowerCase().includes('rose')) ||
        (disliked === 'citrus' && (note.toLowerCase().includes('citrus') || note.toLowerCase().includes('bergamot') || note.toLowerCase().includes('lemon') || note.toLowerCase().includes('grapefruit'))) ||
        (disliked === 'tobacco' && (note.toLowerCase().includes('tobacco') || note.toLowerCase().includes('smoke')))
      );
      if (noteMatches) {
        score += WEIGHTS.dislikedNote; // negative weight
      }
    }
  }

  return score;
}

const OCCASION_LABELS: Record<Occasion, string> = {
  daily: 'everyday wear',
  work: 'school or work',
  date: 'date nights',
  night: 'nights out',
  special: 'special occasions',
  casual: 'relaxed weekends',
};

const AESTHETIC_LABELS: Record<Aesthetic, string> = {
  'old-money': 'timeless, polished style',
  clean: 'clean, minimal style',
  'dark-academia': 'dark academia style',
  beach: 'easy beach-holiday mood',
  'quiet-luxury': 'quiet luxury taste',
  streetwear: 'bold city style',
  romantic: 'soft romantic style',
};

const VIBE_LABELS: Record<Vibe, string> = {
  'rainy-castle': 'cosy, mysterious mood',
  'sunny-beach': 'bright beach energy',
  'late-night-city': 'confident after-dark mood',
  'hotel-room': 'crisp, calm hotel-room mood',
  'forest-rain': 'fresh forest-after-rain feeling',
  'luxury-mall': 'polished, expensive-feeling mood',
};

function joinFriendly(values: string[]) {
  if (values.length <= 1) return values[0] ?? '';
  return `${values.slice(0, -1).join(', ')} and ${values.at(-1)}`;
}

function buildMatchReasons(fragrance: Fragrance, answers: QuizAnswers): string[] {
  const reasons: string[] = [];
  const likedFamilies = getAnswers(answers, 'scent-family') as ScentFamily[];
  const matchedFamilies = likedFamilies.filter(family => fragrance.scentFamilies.includes(family));
  if (matchedFamilies.length > 0) {
    reasons.push(`You preferred ${joinFriendly(matchedFamilies)} scents, and this sits in that profile.`);
  }

  const occasion = getAnswer(answers, 'occasion') as Occasion;
  if (occasion && fragrance.occasions.includes(occasion)) {
    reasons.push(`You wanted something for ${OCCASION_LABELS[occasion]}, which is one of its strongest uses.`);
  }

  const priceAnswer = getAnswer(answers, 'price-range') as PriceRange;
  const priceOrder: PriceRange[] = ['budget', 'mid', 'designer', 'niche'];
  if (priceAnswer && priceOrder.indexOf(fragrance.priceRange) <= priceOrder.indexOf(priceAnswer)) {
    reasons.push('It fits within the price range you selected.');
  }

  const season = getAnswer(answers, 'season');
  if (season && fragrance.seasons.includes(season)) {
    reasons.push(`Its character works especially well in ${season}.`);
  }

  const projection = getAnswer(answers, 'projection') as Projection;
  if (projection && fragrance.projection === projection) {
    const projectionCopy: Record<Projection, string> = {
      subtle: 'stays close and understated',
      moderate: 'has a noticeable but balanced presence',
      strong: 'has the stronger presence you asked for',
    };
    reasons.push(`It ${projectionCopy[projection]}.`);
  }

  const aesthetic = getAnswer(answers, 'aesthetic') as Aesthetic;
  if (aesthetic && fragrance.aesthetics.includes(aesthetic)) {
    reasons.push(`It matches your ${AESTHETIC_LABELS[aesthetic]}.`);
  }

  const vibe = getAnswer(answers, 'vibe') as Vibe;
  if (vibe && fragrance.vibes.includes(vibe)) {
    reasons.push(`It carries the ${VIBE_LABELS[vibe]} you chose.`);
  }

  if (reasons.length === 0) {
    reasons.push(`Its ${joinFriendly(fragrance.scentFamilies.slice(0, 2))} profile was one of the closest overall fits.`);
  }

  return reasons.slice(0, 3);
}

const RECOMMENDATION_LABELS: Record<RecommendationType, string> = {
  best: 'Best Match',
  affordable: 'Budget Alternative',
  similar: 'Similar Vibe',
  everyday: 'Everyday Scent',
  unique: 'Wildcard Pick',
};

export function getRecommendations(answers: QuizAnswers, topN = 5): ScoredFragrance[] {
  const scored = fragrances.map(f => {
    const score = scoreFragrance(f, answers);
    return { fragrance: f, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Normalise scores to percentages relative to the top scorer
  const maxScore = scored[0]?.score ?? 1;
  // Map scores to 60–98% range so it looks meaningful
  const normalise = (s: number) => {
    if (maxScore <= 0) return 60;
    const ratio = s / maxScore;
    return Math.round(60 + ratio * 38);
  };

  const selected = new Set<string>();
  const pick = (predicate: (item: typeof scored[number]) => boolean) => {
    const item = scored.find(candidate => !selected.has(candidate.fragrance.id) && predicate(candidate));
    if (item) selected.add(item.fragrance.id);
    return item;
  };

  const best = pick(item => !item.fragrance.isDupe) ?? pick(() => true);
  const affordable = pick(item => (
    item.fragrance.isDupe
    && (!best || item.fragrance.dupeOf === best.fragrance.name || item.score >= best.score * 0.65)
  )) ?? pick(item => item.fragrance.priceRange === 'budget');
  const similar = pick(item => (
    !best
    || item.fragrance.scentFamilies.some(family => best.fragrance.scentFamilies.includes(family))
  ));
  const everyday = pick(item => (
    item.fragrance.occasions.includes('daily')
    && item.fragrance.projection !== 'strong'
  ));
  const unique = pick(item => item.fragrance.tier === 'niche' && !item.fragrance.isDupe);

  const roleItems: Array<[RecommendationType, typeof scored[number] | undefined]> = [
    ['best', best],
    ['affordable', affordable],
    ['similar', similar],
    ['everyday', everyday],
    ['unique', unique],
  ];

  for (const item of scored) {
    if (roleItems.filter(([, value]) => value).length >= topN) break;
    if (!selected.has(item.fragrance.id)) {
      selected.add(item.fragrance.id);
      roleItems.push(['similar', item]);
    }
  }

  return roleItems
    .filter((entry): entry is [RecommendationType, typeof scored[number]] => Boolean(entry[1]))
    .slice(0, topN)
    .map(([recommendationType, item]) => {
      const matchReasons = buildMatchReasons(item.fragrance, answers);
      return {
        ...item,
        recommendationType,
        recommendationLabel: RECOMMENDATION_LABELS[recommendationType],
        matchPercent: normalise(item.score),
        matchReason: matchReasons.join(' '),
        matchReasons,
      };
    });
}
