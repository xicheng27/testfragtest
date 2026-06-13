import { Fragrance, fragrances } from './fragrances';

export interface PersonalityChoice {
  id: string;
  label: string;
  subtitle: string;
  imageUrl: string;
  imageFit: 'contain' | 'cover';
  signals: string[];
  fragranceId?: string;
}

export interface PersonalityRound {
  id: string;
  eyebrow: string;
  question: string;
  choices: [PersonalityChoice, PersonalityChoice];
}

export interface PersonalityProfile {
  id: string;
  title: string;
  explanation: string;
  scentProfile: string[];
  signals: string[];
  accent: string;
}

export interface PersonalityQuizResult {
  profile: PersonalityProfile;
  recommendations: Fragrance[];
}

const profiles: PersonalityProfile[] = [
  {
    id: 'seattle-pilates-princess',
    title: 'Seattle Pilates Princess',
    explanation: 'You like your fragrance composed, hydrated, and quietly expensive. Clean musk and rain-washed woods are your version of having everything together.',
    scentProfile: ['clean musk', 'green tea', 'rainy woods'],
    signals: ['clean', 'fresh', 'musk', 'green', 'tea', 'forest-rain', 'subtle', 'daily'],
    accent: 'from-emerald-100 via-stone-50 to-sky-100',
  },
  {
    id: 'midnight-library-romantic',
    title: 'Midnight Library Romantic',
    explanation: 'You want a scent with a plot. Your best fragrances feel intimate, literary, and a little haunted, with warm pages, amber light, and lingering spice.',
    scentProfile: ['amber', 'tea', 'soft woods'],
    signals: ['dark-academia', 'woody', 'amber', 'tea', 'spicy', 'mysterious', 'intimate', 'night'],
    accent: 'from-stone-300 via-amber-100 to-rose-100',
  },
  {
    id: 'clean-girl-secret',
    title: 'Clean Girl With a Secret',
    explanation: 'At first: immaculate skin and fresh laundry. Ten minutes later: something warm, magnetic, and impossible to place.',
    scentProfile: ['skin musk', 'iris', 'soft amber'],
    signals: ['clean', 'musk', 'powdery', 'amber', 'intimate', 'quiet-luxury', 'soft', 'addictive'],
    accent: 'from-white via-rose-100 to-stone-200',
  },
  {
    id: 'rainy-day-minimalist',
    title: 'Rainy Day Minimalist',
    explanation: 'You prefer atmosphere over volume. Mineral air, damp leaves, transparent woods, and tea say more to you than a room-filling entrance.',
    scentProfile: ['mineral air', 'green woods', 'tea'],
    signals: ['rain', 'mineral', 'green', 'woody', 'aquatic', 'forest-rain', 'subtle', 'fresh'],
    accent: 'from-slate-200 via-sky-100 to-stone-100',
  },
  {
    id: 'old-money-garden-party',
    title: 'Old Money Garden Party',
    explanation: 'Your taste is polished without looking rehearsed. You gravitate toward luminous florals, tailored citrus, and woods that behave beautifully.',
    scentProfile: ['rose', 'citrus', 'polished woods'],
    signals: ['old-money', 'floral', 'citrus', 'elegant', 'quiet-luxury', 'spring', 'special', 'tailored'],
    accent: 'from-lime-100 via-yellow-50 to-rose-100',
  },
  {
    id: 'soft-vanilla-main-character',
    title: 'Soft Vanilla Main Character',
    explanation: 'You make comfort feel cinematic. Vanilla, warm milk, soft woods, and a little sweetness turn ordinary plans into a beautifully lit scene.',
    scentProfile: ['vanilla', 'creamy woods', 'gourmand'],
    signals: ['vanilla', 'sweet', 'gourmand', 'comforting', 'soft', 'romantic', 'warm', 'autumn'],
    accent: 'from-amber-100 via-orange-50 to-pink-100',
  },
  {
    id: 'tokyo-convenience-store-angel',
    title: 'Tokyo Convenience Store Angel',
    explanation: 'Bright, unexpected, and up at the exact right hour. You suit sparkling citrus, fizzy fruit, clean musk, and playful scents with clever details.',
    scentProfile: ['sparkling citrus', 'fruity musk', 'clean air'],
    signals: ['citrus', 'fruity', 'playful', 'clean', 'fresh', 'streetwear', 'late-night-city', 'unique'],
    accent: 'from-cyan-100 via-white to-pink-200',
  },
  {
    id: 'cedarwood-overthinker',
    title: 'Cedarwood Overthinker',
    explanation: 'You notice every detail, including the drydown. Structured cedar, vetiver, incense, and restrained spice give your thoughtful side somewhere elegant to live.',
    scentProfile: ['cedar', 'vetiver', 'dry spice'],
    signals: ['cedar', 'vetiver', 'woody', 'spicy', 'smoky', 'tailored', 'grounding', 'moderate'],
    accent: 'from-orange-100 via-stone-200 to-amber-200',
  },
  {
    id: 'beach-club-daydreamer',
    title: 'Beach Club Daydreamer',
    explanation: 'Your internal forecast is permanently sunny. You want citrus, salt, coconut, and sheer florals that make every day feel checked into somewhere beautiful.',
    scentProfile: ['sea salt', 'citrus', 'solar florals'],
    signals: ['beach', 'aquatic', 'citrus', 'coconut', 'marine', 'summer', 'sunny-beach', 'playful'],
    accent: 'from-sky-200 via-cyan-50 to-yellow-100',
  },
  {
    id: 'dark-academia-rose',
    title: 'Dark Academia Rose',
    explanation: 'You like beauty with shadows around it. Rose becomes more interesting to you beside patchouli, incense, leather, or a smoky amber base.',
    scentProfile: ['dark rose', 'incense', 'patchouli'],
    signals: ['rose', 'floral', 'dark-academia', 'patchouli', 'incense', 'smoky', 'mysterious', 'romantic'],
    accent: 'from-rose-200 via-stone-200 to-neutral-400',
  },
];

const aestheticChoices: PersonalityChoice[] = [
  {
    id: 'scene-rainy-library',
    label: 'A rainy library',
    subtitle: 'Old pages, tea, and no notifications',
    imageUrl: '/images/quiz/autumn-library.jpg',
    imageFit: 'cover',
    signals: ['dark-academia', 'tea', 'woody', 'rain', 'mysterious'],
  },
  {
    id: 'scene-beach-club',
    label: 'A quiet beach club',
    subtitle: 'Salt air before everyone arrives',
    imageUrl: '/images/quiz/sunny-beach.jpg',
    imageFit: 'cover',
    signals: ['beach', 'aquatic', 'citrus', 'summer', 'quiet-luxury'],
  },
  {
    id: 'scene-hotel',
    label: 'A perfect hotel room',
    subtitle: 'White sheets and a late checkout',
    imageUrl: '/images/quiz/hotel-room.jpg',
    imageFit: 'cover',
    signals: ['clean', 'musk', 'quiet-luxury', 'intimate', 'minimal'],
  },
  {
    id: 'scene-garden',
    label: 'A garden after lunch',
    subtitle: 'Petals, linen, and sparkling water',
    imageUrl: '/images/quiz/spring-garden.jpg',
    imageFit: 'cover',
    signals: ['floral', 'rose', 'spring', 'old-money', 'elegant'],
  },
  {
    id: 'scene-city',
    label: 'A city after midnight',
    subtitle: 'Neon, good music, one more stop',
    imageUrl: '/images/quiz/late-night-city.jpg',
    imageFit: 'cover',
    signals: ['late-night-city', 'streetwear', 'spicy', 'bold', 'playful'],
  },
  {
    id: 'scene-firelight',
    label: 'A room by firelight',
    subtitle: 'Warm drinks and nowhere to be',
    imageUrl: '/images/quiz/winter-firelight.jpg',
    imageFit: 'cover',
    signals: ['vanilla', 'gourmand', 'comforting', 'woody', 'warm'],
  },
];

const reservedQuizFragranceIds = new Set([
  'oud-wood-tf',
  'kayali-vanilla-28',
  'le-labo-rose-31',
  'le-labo-bergamote-22',
  'tobacco-vanille-tf',
  'clean-reserve-skin',
  'zoologist-squid',
  'mfk-baccarat-rouge-540-extrait',
  'molecule-01',
]);

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function fragranceSignals(fragrance: Fragrance): string[] {
  return [
    ...fragrance.scentFamilies,
    ...fragrance.accords,
    ...fragrance.notes,
    ...fragrance.vibes,
    ...fragrance.aesthetics,
    ...fragrance.occasions,
    ...fragrance.seasons,
    ...fragrance.moods,
    ...fragrance.vibeTags,
    fragrance.projection,
    fragrance.longevity,
  ].map(signal => signal.toLowerCase());
}

function toFragranceChoice(fragrance: Fragrance): PersonalityChoice {
  return {
    id: `fragrance-${fragrance.id}`,
    label: fragrance.name,
    subtitle: `${fragrance.brand} · ${fragrance.scentFamilies.slice(0, 2).join(' + ')}`,
    imageUrl: fragrance.imageUrl,
    imageFit: 'contain',
    signals: fragranceSignals(fragrance),
    fragranceId: fragrance.id,
  };
}

export function createPersonalityRounds(): PersonalityRound[] {
  const seenProductImages = new Set<string>();
  const eligible = shuffle(fragrances.filter(fragrance => (
    !fragrance.isDupe
    && fragrance.imageUrl !== '/images/products/fallback.svg'
    && !reservedQuizFragranceIds.has(fragrance.id)
  )).filter(fragrance => {
    if (seenProductImages.has(fragrance.imageUrl)) return false;
    seenProductImages.add(fragrance.imageUrl);
    return true;
  }));
  const fragranceChoices = eligible.slice(0, 10).map(toFragranceChoice);
  const fragranceRounds: PersonalityRound[] = [];

  for (let index = 0; index < fragranceChoices.length; index += 2) {
    fragranceRounds.push({
      id: `fragrance-pair-${index / 2}`,
      eyebrow: 'Instinct check',
      question: 'Which fragrance would you rather pick?',
      choices: [fragranceChoices[index], fragranceChoices[index + 1]],
    });
  }

  const scenes = shuffle(aestheticChoices).slice(0, 4);
  const sceneRounds: PersonalityRound[] = [
    {
      id: 'scene-pair-1',
      eyebrow: 'Choose your atmosphere',
      question: 'Which world feels more like you?',
      choices: [scenes[0], scenes[1]],
    },
    {
      id: 'scene-pair-2',
      eyebrow: 'No overthinking',
      question: 'Where would your best evening begin?',
      choices: [scenes[2], scenes[3]],
    },
  ];

  return shuffle([...fragranceRounds, ...sceneRounds]);
}

export function getPersonalityResult(choices: PersonalityChoice[]): PersonalityQuizResult {
  const signalCounts = new Map<string, number>();
  for (const choice of choices) {
    for (const signal of choice.signals) {
      const normalized = signal.toLowerCase();
      signalCounts.set(normalized, (signalCounts.get(normalized) ?? 0) + 1);
    }
  }

  const rankedProfiles = profiles
    .map(profile => ({
      profile,
      score: profile.signals.reduce((total, signal) => total + (signalCounts.get(signal) ?? 0), 0),
    }))
    .sort((a, b) => b.score - a.score);
  const profile = rankedProfiles[0].profile;
  const chosenFragranceIds = new Set(choices.flatMap(choice => choice.fragranceId ? [choice.fragranceId] : []));
  const targetSignals = new Set([...profile.signals, ...profile.scentProfile].map(signal => signal.toLowerCase()));

  const recommendations = fragrances
    .filter(fragrance => !fragrance.isDupe)
    .map(fragrance => {
      const signals = fragranceSignals(fragrance);
      const profileMatches = signals.filter(signal => targetSignals.has(signal)).length;
      const choiceMatches = signals.reduce((total, signal) => total + Math.min(signalCounts.get(signal) ?? 0, 2), 0);
      const instinctBonus = chosenFragranceIds.has(fragrance.id) ? 6 : 0;
      return { fragrance, score: profileMatches * 4 + choiceMatches + instinctBonus };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.fragrance);

  return { profile, recommendations };
}
