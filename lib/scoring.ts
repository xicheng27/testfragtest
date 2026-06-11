import { fragrances, Fragrance, ScentFamily, Occasion, GenderStyle, Projection, PriceRange, Tier, Aesthetic, Vibe } from './fragrances';

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export interface ScoredFragrance {
  fragrance: Fragrance;
  score: number;
  matchPercent: number;
  matchReason: string;
}

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
  personality: 8,      // inferred from aesthetic
  scentCharacter: 12,  // broad scent character
  drink: 6,            // light lifestyle signal
  priority: 10,        // compliments, signature, versatility, uniqueness
  dislikedNote: -40,   // penalty if fragrance contains a disliked note
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

function scoreFragrance(fragrance: Fragrance, answers: QuizAnswers): number {
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

  const personality = getAnswer(answers, 'personality');
  const personalityAesthetics: Record<string, Aesthetic[]> = {
    classic: ['old-money', 'quiet-luxury'],
    trendy: ['streetwear', 'clean'],
    eclectic: ['dark-academia', 'romantic'],
    minimal: ['clean', 'quiet-luxury'],
  };
  if (personality && personalityAesthetics[personality]?.some(value => fragrance.aesthetics.includes(value))) {
    score += WEIGHTS.personality;
  }

  const scentCharacter = getAnswer(answers, 'scent-character');
  const characterFamilies: Record<string, ScentFamily[]> = {
    crisp: ['fresh', 'clean', 'citrus', 'aquatic'],
    soft: ['floral', 'clean', 'woody'],
    warm: ['sweet', 'gourmand', 'spicy', 'woody'],
    dark: ['oriental', 'spicy', 'woody'],
  };
  if (scentCharacter && characterFamilies[scentCharacter]?.some(value => fragrance.scentFamilies.includes(value))) {
    score += WEIGHTS.scentCharacter;
  }

  const drink = getAnswer(answers, 'drink');
  const drinkFamilies: Record<string, ScentFamily[]> = {
    espresso: ['gourmand', 'woody'],
    'sparkling-water': ['fresh', 'citrus', 'aquatic'],
    cocktail: ['spicy', 'oriental', 'woody'],
    'flower-tea': ['floral', 'clean'],
    'cold-brew': ['gourmand', 'fresh'],
  };
  if (drink && drinkFamilies[drink]?.some(value => fragrance.scentFamilies.includes(value))) {
    score += WEIGHTS.drink;
  }

  const priority = getAnswer(answers, 'compliments');
  if (
    (priority === 'compliments' && fragrance.projection === 'strong') ||
    (priority === 'personal' && fragrance.projection === 'subtle') ||
    (priority === 'versatile' && fragrance.occasions.length >= 4) ||
    (priority === 'unique' && fragrance.tier === 'niche')
  ) {
    score += WEIGHTS.priority;
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

// Build a human-readable reason string based on answers vs fragrance properties
function buildMatchReason(fragrance: Fragrance, answers: QuizAnswers): string {
  const parts: string[] = [];

  const vibe = getAnswer(answers, 'vibe');
  const aesthetic = getAnswer(answers, 'aesthetic');
  const mood = getAnswer(answers, 'mood');
  const occasion = getAnswer(answers, 'occasion');
  const season = getAnswer(answers, 'season');

  if (vibe && fragrance.vibes.includes(vibe as Vibe)) {
    const vibeLabels: Record<string, string> = {
      'rainy-castle': 'that dark, mysterious vibe you picked',
      'sunny-beach': 'your sunny beach energy',
      'late-night-city': 'your late-night city feel',
      'hotel-room': 'the clean, crisp aesthetic you love',
      'forest-rain': 'that fresh forest-after-rain feeling',
      'luxury-mall': 'your polished, luxury sensibility',
    };
    parts.push(vibeLabels[vibe] || 'your chosen vibe');
  }

  if (aesthetic && fragrance.aesthetics.includes(aesthetic as Aesthetic)) {
    const aestheticLabels: Record<string, string> = {
      'old-money': 'your old money aesthetic',
      'clean': 'your clean, minimal look',
      'dark-academia': 'your dark academia style',
      'beach': 'your beach holiday spirit',
      'quiet-luxury': 'your quiet luxury taste',
      'streetwear': 'your streetwear edge',
      'romantic': 'your romantic softness',
    };
    parts.push(aestheticLabels[aesthetic] || 'your aesthetic');
  }

  if (mood && fragrance.moods.includes(mood)) {
    parts.push(`the ${mood} mood you want to wear`);
  }

  if (season && fragrance.seasons.includes(season)) {
    parts.push(`perfect for ${season}`);
  }

  if (occasion && fragrance.occasions.includes(occasion as Occasion)) {
    const occasionLabels: Record<string, string> = {
      daily: 'everyday wear',
      work: 'school or work',
      date: 'dates',
      night: 'nights out',
      special: 'special occasions',
      casual: 'casual days',
    };
    parts.push(`great for ${occasionLabels[occasion] || occasion}`);
  }

  if (parts.length === 0) {
    return fragrance.shortDescription;
  }

  if (parts.length === 1) {
    return `Matches ${parts[0]}. ${fragrance.shortDescription}`;
  }

  const last = parts.pop();
  return `Matches ${parts.join(', ')} and ${last}. ${fragrance.shortDescription}`;
}

export function getRecommendations(answers: QuizAnswers, topN = 3): ScoredFragrance[] {
  const scored = fragrances.map(f => {
    const score = scoreFragrance(f, answers);
    return { fragrance: f, score, matchPercent: 0, matchReason: '' };
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

  const top = scored.slice(0, topN).map(item => ({
    ...item,
    matchPercent: normalise(item.score),
    matchReason: buildMatchReason(item.fragrance, answers),
  }));

  return top;
}
