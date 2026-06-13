export type QuestionType = 'single' | 'multi' | 'cards' | 'image-cards';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  gradient?: string; // CSS gradient fallback when image hasn't loaded
  imageUrl?: string; // Scene artwork for cards
  imageFit?: 'cover' | 'contain';
  emoji?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  category: 'serious' | 'fun';
  question: string;
  subtitle?: string;
  options: QuizOption[];
  maxSelections?: number;
  allowSkip?: boolean;
  skipLabel?: string;
}

// Unsplash photo IDs are stable — swap these out for AI-generated images later.
// Format: https://images.unsplash.com/photo-{id}?w=600&q=80&auto=format&fit=crop
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;

export const quizQuestions: QuizQuestion[] = [
  // ── SERIOUS ───────────────────────────────────────────────────────────────
  {
    id: 'scent-family',
    type: 'image-cards',
    category: 'serious',
    question: 'What kind of scent speaks to you?',
    subtitle: 'Choose up to three',
    maxSelections: 3,
    options: [
      {
        id: 'fresh',
        label: 'Fresh',
        description: 'Ocean breeze, linen, morning air',
        imageUrl: U('1507525428034-b723cf961d3e'),
        gradient: 'from-sky-300 to-teal-400',
      },
      {
        id: 'sweet',
        label: 'Sweet',
        description: 'Vanilla dessert, warm café, soft glow',
        imageUrl: U('1558618666-fcd25c85cd64'),
        gradient: 'from-amber-200 to-orange-300',
      },
      {
        id: 'woody',
        label: 'Woody',
        description: 'Cedar, forest shade, dark wood',
        imageUrl: U('1448375240586-882707db888b'),
        gradient: 'from-stone-600 to-stone-800',
      },
      {
        id: 'floral',
        label: 'Floral',
        description: 'Petals, gardens, spring sunlight',
        imageUrl: U('1490750967868-88df5691cc2d'),
        gradient: 'from-pink-300 to-rose-400',
      },
      {
        id: 'spicy',
        label: 'Spicy',
        description: 'Amber, candlelight, warm markets',
        imageUrl: U('1596040033229-a9821ebd058d'),
        gradient: 'from-orange-500 to-red-700',
      },
      {
        id: 'aquatic',
        label: 'Aquatic',
        description: 'Rain, sea mist, cool blue glass',
        imageUrl: U('1505118380757-91f5f5632de0'),
        gradient: 'from-blue-400 to-cyan-600',
      },
    ],
  },
  {
    id: 'occasion',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'What do you mainly need this fragrance for?',
    options: [
      {
        id: 'daily',
        label: 'Casual Everyday',
        description: 'Easy and naturally put together',
        imageUrl: U('1515886657613-9f3515b0c78f'),
        gradient: 'from-stone-300 to-stone-500',
      },
      {
        id: 'work',
        label: 'School / Work',
        description: 'Polished without taking over',
        imageUrl: U('1497366216548-37526070297c'),
        gradient: 'from-slate-400 to-slate-600',
      },
      {
        id: 'date',
        label: 'Date Night',
        description: 'Warm, close, memorable',
        imageUrl: U('1414235077428-338989a2e8c0'),
        gradient: 'from-rose-700 to-red-900',
      },
      {
        id: 'night',
        label: 'Party / Night Out',
        description: 'Confident after dark',
        imageUrl: U('1477959858617-67f85cf4f1df'),
        gradient: 'from-purple-900 to-indigo-900',
      },
      {
        id: 'special',
        label: 'Formal Event',
        description: 'Elegant and elevated',
        imageUrl: U('1511795409834-ef04bbd61622'),
        gradient: 'from-stone-700 to-stone-900',
      },
      {
        id: 'casual',
        label: 'Holiday / Weekend',
        description: 'Relaxed and transportive',
        imageUrl: U('1506929562872-bb421503ef21'),
        gradient: 'from-sky-400 to-teal-500',
      },
    ],
  },
  {
    id: 'projection',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'How loud do you want your scent to be?',
    subtitle: 'Projection = how far the scent radiates',
    options: [
      {
        id: 'subtle',
        label: 'Subtle',
        description: 'Only noticeable up close',
        imageUrl: U('1518609268805-4e9042af9f23'),
        gradient: 'from-stone-200 to-stone-400',
      },
      {
        id: 'moderate',
        label: 'Moderate',
        description: 'A gentle presence in a room',
        imageUrl: U('1568702846914-96b305d2aaeb'),
        gradient: 'from-stone-400 to-stone-600',
      },
      {
        id: 'strong',
        label: 'Strong',
        description: 'Makes an entrance',
        imageUrl: U('1519125323398-675f0ddb6308'),
        gradient: 'from-stone-700 to-stone-900',
      },
    ],
  },
  {
    id: 'gender-style',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'Are you open to fragrances marketed as more…',
    options: [
      {
        id: 'feminine',
        label: 'Traditionally feminine',
        description: 'Soft, floral, polished',
        imageUrl: U('1534528741775-53994a69daeb'),
        gradient: 'from-rose-200 to-pink-400',
      },
      {
        id: 'masculine',
        label: 'Traditionally masculine',
        description: 'Structured, woody, confident',
        imageUrl: U('1507003211169-0a1dd7228f2d'),
        gradient: 'from-stone-500 to-stone-700',
      },
      {
        id: 'unisex',
        label: 'Unisex / gender-neutral',
        description: 'Balanced, modern, unrestricted',
        imageUrl: U('1519085360753-af0119f7cbe7'),
        gradient: 'from-neutral-400 to-neutral-600',
      },
      {
        id: 'any',
        label: 'Just pick what fits me',
        description: 'Choose entirely by fit',
        imageUrl: U('1541516160-b39041754f5b'),
        gradient: 'from-stone-300 to-stone-500',
      },
    ],
  },
  {
    id: 'price-range',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'What is your budget?',
    options: [
      {
        id: 'budget',
        label: 'Under $80',
        description: 'Affordable everyday finds',
        imageUrl: U('1523275335684-37898b6baf30'),
        gradient: 'from-stone-300 to-stone-500',
      },
      {
        id: 'mid',
        label: '$80 – $150',
        description: 'Mid-range designer',
        imageUrl: U('1585386959984-a4155224a1ad'),
        gradient: 'from-stone-400 to-stone-600',
      },
      {
        id: 'designer',
        label: '$150 – $350',
        description: 'High-end designer',
        imageUrl: U('1541099649105-f69ad21f3246'),
        gradient: 'from-stone-600 to-stone-800',
      },
      {
        id: 'niche',
        label: '$350+',
        description: 'Niche and exclusive',
        imageUrl: U('1558618047-3c8e1a4a2a42'),
        gradient: 'from-stone-800 to-stone-950',
      },
    ],
  },
  {
    id: 'tier',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'Any preference on the type of brand?',
    options: [
      {
        id: 'designer',
        label: 'Designer',
        description: 'Chanel, Dior, Tom Ford…',
        imageUrl: U('1489985509682-6f2a6bc0d4fd'),
        gradient: 'from-stone-400 to-stone-700',
      },
      {
        id: 'niche',
        label: 'Niche',
        description: 'Le Labo, Creed, Kilian…',
        imageUrl: U('1507842217343-583bb7270b66'),
        gradient: 'from-stone-600 to-stone-900',
      },
      {
        id: 'any',
        label: 'No preference',
        description: 'Show me the best match',
        imageUrl: U('1618220179428-22790b461013'),
        gradient: 'from-stone-300 to-stone-500',
      },
    ],
  },
  {
    id: 'disliked-notes',
    type: 'image-cards',
    category: 'serious',
    question: 'Any notes you definitely want to avoid?',
    subtitle: 'Select all that apply',
    options: [
      {
        id: 'oud',
        label: 'Oud',
        description: 'Dense resinous woods',
        imageUrl: U('1548013841-822e5b7bd09c'),
        gradient: 'from-stone-700 to-stone-900',
      },
      {
        id: 'vanilla',
        label: 'Vanilla / Sweet',
        description: 'Sugared gourmand warmth',
        imageUrl: U('1464349153174-4e2f04939e22'),
        gradient: 'from-amber-200 to-amber-400',
      },
      {
        id: 'rose',
        label: 'Rose / Heavy florals',
        description: 'Full, petal-rich bouquets',
        imageUrl: U('1496062031851-f44a95c58e1a'),
        gradient: 'from-rose-400 to-rose-600',
      },
      {
        id: 'citrus',
        label: 'Citrus / Sharp',
        description: 'Bright zesty freshness',
        imageUrl: U('1587049352846-4a222e784d38'),
        gradient: 'from-yellow-300 to-lime-400',
      },
      {
        id: 'tobacco',
        label: 'Tobacco / Smoky',
        description: 'Dark smoke and warm spice',
        imageUrl: U('1558618666-fcd25c85cd64'),
        gradient: 'from-stone-600 to-stone-900',
      },
      {
        id: 'none',
        label: "None — I'm open",
        description: 'Keep every direction open',
        imageUrl: U('1523275335684-37898b6baf30'),
        gradient: 'from-teal-400 to-emerald-600',
      },
    ],
  },
  // ── FUN ───────────────────────────────────────────────────────────────────
  {
    id: 'vibe',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'Pick your vibe',
    subtitle: 'Where do you feel most yourself?',
    options: [
      {
        id: 'rainy-castle',
        label: 'Rainy Castle',
        description: 'Dark, cosy, mysterious',
        imageUrl: U('1518709268805-4e9042af9f23'),
        gradient: 'from-slate-700 to-slate-900',
      },
      {
        id: 'sunny-beach',
        label: 'Sunny Beach',
        description: 'Bright, warm, carefree',
        imageUrl: U('1507525428034-b723cf961d3e'),
        gradient: 'from-yellow-300 to-sky-400',
      },
      {
        id: 'late-night-city',
        label: 'Late Night City',
        description: 'Electric, bold, alive',
        imageUrl: U('1477959858617-67f85cf4f1df'),
        gradient: 'from-indigo-800 to-purple-900',
      },
      {
        id: 'hotel-room',
        label: 'Clean Hotel Room',
        description: 'Minimal, crisp, calm',
        imageUrl: U('1631049307264-da0ec9d70304'),
        gradient: 'from-stone-200 to-stone-400',
      },
      {
        id: 'forest-rain',
        label: 'Forest After Rain',
        description: 'Earthy, fresh, grounding',
        imageUrl: U('1448375240586-882707db888b'),
        gradient: 'from-emerald-700 to-green-900',
      },
      {
        id: 'luxury-mall',
        label: 'Quiet-Luxury Boutique',
        description: 'Polished, elevated, chic',
        imageUrl: U('1441984904996-e0b6ba687e04'),
        gradient: 'from-amber-200 to-stone-500',
      },
    ],
  },
  {
    id: 'season',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'Pick your season',
    options: [
      {
        id: 'spring',
        label: 'Spring',
        description: 'Blooming, airy, optimistic',
        imageUrl: U('1490750967868-88df5691cc2d'),
        gradient: 'from-green-300 to-emerald-400',
      },
      {
        id: 'summer',
        label: 'Summer',
        description: 'Sun-soaked, bright, free',
        imageUrl: U('1506929562872-bb421503ef21'),
        gradient: 'from-yellow-300 to-amber-400',
      },
      {
        id: 'autumn',
        label: 'Autumn',
        description: 'Textured, cosy, golden',
        imageUrl: U('1507003211169-0a1dd7228f2d'),
        gradient: 'from-orange-400 to-amber-700',
      },
      {
        id: 'winter',
        label: 'Winter',
        description: 'Warm, intimate, enveloping',
        imageUrl: U('1517299321609-52d3c6544b3c'),
        gradient: 'from-blue-200 to-slate-500',
      },
    ],
  },
  {
    id: 'aesthetic',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'Which aesthetic is most you?',
    options: [
      {
        id: 'old-money',
        label: 'Old Money',
        description: 'Timeless, composed, precise',
        imageUrl: U('1489985509682-6f2a6bc0d4fd'),
        gradient: 'from-stone-400 to-amber-700',
      },
      {
        id: 'clean',
        label: 'Clean Girl',
        description: 'Natural, bright, effortless',
        imageUrl: U('1556228453-efd6c1ff04f6'),
        gradient: 'from-neutral-100 to-stone-300',
      },
      {
        id: 'dark-academia',
        label: 'Dark Academia',
        description: 'Books, mystery, intellect',
        imageUrl: U('1507842217343-583bb7270b66'),
        gradient: 'from-stone-700 to-stone-900',
      },
      {
        id: 'beach',
        label: 'Beach Holiday',
        description: 'Relaxed, salty, golden',
        imageUrl: U('1500375592092-40eb2168fd21'),
        gradient: 'from-sky-400 to-amber-300',
      },
      {
        id: 'quiet-luxury',
        label: 'Quiet Luxury',
        description: 'Understated, premium, calm',
        imageUrl: U('1512436991641-6745cdb1723f'),
        gradient: 'from-stone-300 to-neutral-500',
      },
      {
        id: 'streetwear',
        label: 'City Chic',
        description: 'Bold, urban, expressive',
        imageUrl: U('1519085360753-af0119f7cbe7'),
        gradient: 'from-zinc-700 to-zinc-900',
      },
      {
        id: 'romantic',
        label: 'Soft Romantic',
        description: 'Gentle, polished, intimate',
        imageUrl: U('1534528741775-53994a69daeb'),
        gradient: 'from-pink-300 to-rose-500',
      },
    ],
  },
];

// Extended questions — structure ready to expand
export const additionalQuizQuestions: QuizQuestion[] = [
  {
    id: 'longevity',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    question: 'How long do you want it to last?',
    options: [
      {
        id: 'short',
        label: '2–4 hours',
        description: 'Light, easy, fleeting',
        imageUrl: U('1507003211169-0a1dd7228f2d'),
        gradient: 'from-stone-200 to-stone-400',
      },
      {
        id: 'medium',
        label: '4–8 hours',
        description: 'Comfortable full-day wear',
        imageUrl: U('1568702846914-96b305d2aaeb'),
        gradient: 'from-stone-400 to-stone-600',
      },
      {
        id: 'long',
        label: '8+ hours',
        description: 'A lasting statement',
        imageUrl: U('1519125323398-675f0ddb6308'),
        gradient: 'from-stone-600 to-stone-900',
      },
    ],
  },
  {
    id: 'time-of-day',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    question: 'What time of day do you feel most like yourself?',
    options: [
      {
        id: 'early-morning',
        label: 'Early Morning',
        description: 'Still, bright, full of possibility',
        imageUrl: U('1506905925346-21bda4d32df4'),
        gradient: 'from-sky-200 to-amber-200',
      },
      {
        id: 'golden-hour',
        label: 'Golden Hour',
        description: 'Warm, flattering, unhurried',
        imageUrl: U('1506929562872-bb421503ef21'),
        gradient: 'from-amber-300 to-orange-500',
      },
      {
        id: 'blue-hour',
        label: 'Blue Hour',
        description: 'Polished, calm, cinematic',
        imageUrl: U('1477959858617-67f85cf4f1df'),
        gradient: 'from-blue-600 to-indigo-800',
      },
      {
        id: 'midnight',
        label: 'Midnight',
        description: 'Private, bold, electric',
        imageUrl: U('1519125323398-675f0ddb6308'),
        gradient: 'from-stone-800 to-stone-950',
      },
    ],
  },
  {
    id: 'memory',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    question: 'What memory do you want your scent to bring back?',
    options: [
      {
        id: 'clean-laundry',
        label: 'Fresh sheets in morning light',
        description: 'Clean, quiet, familiar',
        imageUrl: U('1631049307264-da0ec9d70304'),
        gradient: 'from-stone-100 to-stone-300',
      },
      {
        id: 'seaside-holiday',
        label: 'A sunlit seaside holiday',
        description: 'Citrus, salt, warm skin',
        imageUrl: U('1507525428034-b723cf961d3e'),
        gradient: 'from-sky-300 to-amber-200',
      },
      {
        id: 'rain-on-stone',
        label: 'Rain falling on stone and trees',
        description: 'Mineral, green, grounding',
        imageUrl: U('1448375240586-882707db888b'),
        gradient: 'from-emerald-700 to-stone-600',
      },
      {
        id: 'warm-embrace',
        label: 'A warm embrace in winter',
        description: 'Vanilla, woods, soft spice',
        imageUrl: U('1517299321609-52d3c6544b3c'),
        gradient: 'from-amber-600 to-stone-700',
      },
    ],
  },
  {
    id: 'desired-feel',
    type: 'image-cards',
    category: 'serious',
    question: 'How should your fragrance feel?',
    subtitle: 'Choose up to two',
    maxSelections: 2,
    allowSkip: true,
    options: [
      {
        id: 'clean',
        label: 'Clean',
        description: 'Clear, crisp, freshly washed',
        imageUrl: U('1631049307264-da0ec9d70304'),
        gradient: 'from-stone-100 to-stone-300',
      },
      {
        id: 'addictive',
        label: 'Addictive',
        description: 'Rich, magnetic, hard to forget',
        imageUrl: U('1558618047-3c8e1a4a2a42'),
        gradient: 'from-rose-700 to-stone-900',
      },
      {
        id: 'mysterious',
        label: 'Mysterious',
        description: 'Shadowy, atmospheric, intriguing',
        imageUrl: U('1518709268805-4e9042af9f23'),
        gradient: 'from-slate-700 to-slate-900',
      },
      {
        id: 'expensive',
        label: 'Expensive',
        description: 'Smooth, composed, elevated',
        imageUrl: U('1511795409834-ef04bbd61622'),
        gradient: 'from-stone-500 to-stone-800',
      },
      {
        id: 'comforting',
        label: 'Comforting',
        description: 'Soft, warm, reassuring',
        imageUrl: U('1558618666-fcd25c85cd64'),
        gradient: 'from-amber-200 to-orange-300',
      },
      {
        id: 'bold',
        label: 'Bold',
        description: 'Confident, graphic, unforgettable',
        imageUrl: U('1519125323398-675f0ddb6308'),
        gradient: 'from-stone-700 to-stone-950',
      },
      {
        id: 'intimate',
        label: 'Intimate',
        description: 'Close, private, skin-like',
        imageUrl: U('1534528741775-53994a69daeb'),
        gradient: 'from-rose-300 to-rose-600',
      },
    ],
  },
];

// Alias for components that import extendedQuizQuestions
export const extendedQuizQuestions = [...quizQuestions, ...additionalQuizQuestions];
