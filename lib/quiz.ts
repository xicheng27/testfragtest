export type QuestionType = 'single' | 'multi' | 'cards' | 'image-cards';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  gradient?: string; // CSS gradient for image card placeholders
  imageUrl?: string; // Quiz scene artwork only; product images live in fragrance data
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
  maxSelections?: number; // for multi type
  allowSkip?: boolean;
  skipLabel?: string;
}

export const quizQuestions: QuizQuestion[] = [
  // --- SERIOUS QUESTIONS ---
  {
    id: 'scent-family',
    type: 'image-cards',
    category: 'serious',
    question: 'Pick your scent energy',
    subtitle: 'Choose up to three. No wrong answers.',
    maxSelections: 3,
    options: [
      { id: 'fresh', label: 'Fresh', description: 'Ocean breeze, linen, morning air', imageUrl: '/images/quiz/scents/fresh.webp' },
      { id: 'sweet', label: 'Sweet', description: 'Vanilla dessert, warm café, soft glow', imageUrl: '/images/quiz/scents/sweet.webp' },
      { id: 'woody', label: 'Woody', description: 'Cedar, forest shade, dark wood', imageUrl: '/images/quiz/scents/woody.webp' },
      { id: 'floral', label: 'Floral', description: 'Petals, gardens, spring sunlight', imageUrl: '/images/quiz/scents/floral.webp' },
      { id: 'spicy', label: 'Spicy', description: 'Amber, candlelight, warm markets', imageUrl: '/images/quiz/scents/spicy.webp' },
      { id: 'aquatic', label: 'Aquatic', description: 'Rain, sea mist, cool blue glass', imageUrl: '/images/quiz/scents/aquatic.webp' },
    ],
  },
  {
    id: 'occasion',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 3,
    question: 'What is the plan?',
    subtitle: 'Choose up to three.',
    options: [
      { id: 'daily', label: 'Casual Everyday', description: 'Easy and naturally put together', imageUrl: '/images/quiz/relaxed-denim.jpg' },
      { id: 'work', label: 'School / Work', description: 'Polished without taking over', imageUrl: '/images/quiz/unique/school-work.webp' },
      { id: 'date', label: 'Date Night', description: 'Warm, close, memorable', imageUrl: '/images/quiz/golden-rooftop.jpg' },
      { id: 'night', label: 'Party / Night Out', description: 'Confident after dark', imageUrl: '/images/quiz/unique/party-rooftop.webp' },
      { id: 'special', label: 'Formal Event', description: 'Elegant and elevated', imageUrl: '/images/quiz/unique/luxury-hotel-lobby.webp' },
      { id: 'casual', label: 'Holiday / Weekend', description: 'Relaxed and transportive', imageUrl: '/images/quiz/seaside-memory.jpg' },
    ],
  },
  {
    id: 'projection',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'How main character should it be?',
    subtitle: 'Projection = how far the scent radiates',
    options: [
      { id: 'subtle', label: 'Subtle', description: 'Only noticeable up close', imageUrl: '/images/quiz/choices/projection-subtle.webp' },
      { id: 'moderate', label: 'Moderate', description: 'A gentle presence in a room', imageUrl: '/images/quiz/choices/projection-moderate.webp' },
      { id: 'strong', label: 'Strong', description: 'Makes an entrance', imageUrl: '/images/quiz/choices/projection-strong.webp' },
    ],
  },
  {
    id: 'gender-style',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'Are you open to fragrances marketed as more...',
    options: [
      { id: 'feminine', label: 'Traditionally feminine', description: 'Soft, floral, polished', imageUrl: '/images/quiz/unique/feminine-editorial.webp' },
      { id: 'masculine', label: 'Traditionally masculine', description: 'Structured, woody, confident', imageUrl: '/images/quiz/unique/masculine-tailoring.webp' },
      { id: 'unisex', label: 'Unisex / gender-neutral', description: 'Balanced, modern, unrestricted', imageUrl: '/images/quiz/choices/brand-flexible.webp' },
      { id: 'any', label: 'I do not care, just recommend what fits me', description: 'Choose entirely by fit', imageUrl: '/images/quiz/choices/feel-open.webp' },
    ],
  },
  {
    id: 'price-range',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'What is the budget vibe?',
    options: [
      { id: 'budget', label: 'Under $80', description: 'Affordable finds', imageUrl: '/images/quiz/choices/budget-affordable.webp' },
      { id: 'mid', label: '$80–$150', description: 'Mid-range designer', imageUrl: '/images/quiz/choices/budget-mid.webp' },
      { id: 'designer', label: '$150–$350', description: 'High-end designer', imageUrl: '/images/quiz/choices/budget-designer.webp' },
      { id: 'niche', label: '$350+', description: 'Niche and exclusive', imageUrl: '/images/quiz/choices/budget-niche.webp' },
    ],
  },
  {
    id: 'tier',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'What kind of brand era are we in?',
    options: [
      { id: 'designer', label: 'Designer', description: 'Polished fashion-house releases', imageUrl: '/images/quiz/choices/brand-designer.webp' },
      { id: 'niche', label: 'Niche', description: 'Artistic independent perfumery', imageUrl: '/images/quiz/choices/brand-niche.webp' },
      { id: 'any', label: 'No preference', description: 'Show me the best match', imageUrl: '/images/quiz/choices/brand-any.webp' },
    ],
  },
  {
    id: 'disliked-notes',
    type: 'image-cards',
    category: 'serious',
    question: 'Any fragrance red flags?',
    subtitle: 'Select all that apply',
    options: [
      { id: 'oud', label: 'Oud', description: 'Dense resinous woods', imageUrl: '/images/products/oud-wood-tf.jpg', imageFit: 'contain' },
      { id: 'vanilla', label: 'Vanilla / Sweet', description: 'Sugared gourmand warmth', imageUrl: '/images/products/kayali-vanilla-28.jpg', imageFit: 'contain' },
      { id: 'rose', label: 'Rose / Heavy florals', description: 'Full, petal-rich bouquets', imageUrl: '/images/products/le-labo-rose-31.jpg', imageFit: 'contain' },
      { id: 'citrus', label: 'Citrus / Sharp', description: 'Bright, zesty freshness', imageUrl: '/images/products/le-labo-bergamote-22.jpg', imageFit: 'contain' },
      { id: 'tobacco', label: 'Tobacco / Smoky', description: 'Dark smoke and warm spice', imageUrl: '/images/products/tobacco-vanille-tf.jpg', imageFit: 'contain' },
      { id: 'none', label: 'None — I\'m open to everything', description: 'Keep every direction open', imageUrl: '/images/quiz/months/january.webp' },
    ],
  },
  // --- FUN QUESTIONS ---
  {
    id: 'vibe',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'Pick your main character setting',
    subtitle: 'Go with the scene you would actually post.',
    options: [
      { id: 'rainy-castle', label: 'Rainy Castle', description: 'Dark, cosy, mysterious', imageUrl: '/images/quiz/rainy-castle.jpg' },
      { id: 'sunny-beach', label: 'Sunny Beach', description: 'Bright, warm, carefree', imageUrl: '/images/quiz/unique/summer-pool.webp' },
      { id: 'late-night-city', label: 'Late Night City', description: 'Electric, bold, alive', imageUrl: '/images/quiz/unique/city-chic-rain.webp' },
      { id: 'hotel-room', label: 'Clean Hotel Room', description: 'Minimal, crisp, calm', imageUrl: '/images/quiz/unique/clean-hotel-room.webp' },
      { id: 'forest-rain', label: 'Forest After Rain', description: 'Earthy, fresh, grounding', imageUrl: '/images/quiz/forest-rain.jpg' },
      { id: 'luxury-mall', label: 'Quiet-Luxury Boutique', description: 'Polished, elevated, chic', imageUrl: '/images/quiz/unique/quiet-luxury-boutique.webp' },
    ],
  },
  {
    id: 'season',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'Pick your scent era',
    options: [
      { id: 'spring', label: 'Spring', description: 'Blooming, airy, optimistic', imageUrl: '/images/quiz/months/april.webp' },
      { id: 'summer', label: 'Summer', description: 'Sun-soaked, bright, free', imageUrl: '/images/quiz/months/july.webp' },
      { id: 'autumn', label: 'Autumn', description: 'Textured, cosy, golden', imageUrl: '/images/quiz/months/october.webp' },
      { id: 'winter', label: 'Winter', description: 'Warm, intimate, enveloping', imageUrl: '/images/quiz/months/december.webp' },
    ],
  },
  {
    id: 'aesthetic',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'Which aesthetic are you?',
    options: [
      { id: 'old-money', label: 'Old Money', description: 'Timeless, composed, precise', imageUrl: '/images/quiz/unique/old-money-garden.webp' },
      { id: 'clean', label: 'Clean Girl', description: 'Natural, bright, effortless', imageUrl: '/images/quiz/months/may.webp' },
      { id: 'dark-academia', label: 'Dark Academia', description: 'Books, mystery, intellect', imageUrl: '/images/quiz/secret-library.jpg' },
      { id: 'beach', label: 'Beach Holiday', description: 'Relaxed, salty, golden', imageUrl: '/images/quiz/months/june.webp' },
      { id: 'quiet-luxury', label: 'Quiet Luxury', description: 'Understated, premium, calm', imageUrl: '/images/quiz/luxury-boutique.jpg' },
      { id: 'streetwear', label: 'City Chic', description: 'Bold, urban, expressive', imageUrl: '/images/quiz/dark-streetwear.jpg' },
      { id: 'romantic', label: 'Soft Romantic', description: 'Gentle, polished, intimate', imageUrl: '/images/quiz/romantic-evening.jpg' },
    ],
  },
];

// Additional questions shown after the original quiz.
export const additionalQuizQuestions: QuizQuestion[] = [
  {
    id: 'longevity',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    question: 'How long do you want it to last?',
    options: [
      { id: 'short', label: '2–4 hours', description: 'Light, easy, fleeting', imageUrl: '/images/quiz/choices/longevity-short.webp' },
      { id: 'medium', label: '4–8 hours', description: 'Comfortable full-day wear', imageUrl: '/images/quiz/choices/longevity-medium.webp' },
      { id: 'long', label: '8+ hours', description: 'A lasting statement', imageUrl: '/images/quiz/choices/longevity-long.webp' },
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
      { id: 'early-morning', label: 'Early Morning', description: 'Still, bright, full of possibility', imageUrl: '/images/quiz/months/march.webp' },
      { id: 'golden-hour', label: 'Golden Hour', description: 'Warm, flattering, unhurried', imageUrl: '/images/quiz/months/september.webp' },
      { id: 'blue-hour', label: 'Blue Hour', description: 'Polished, calm, cinematic', imageUrl: '/images/quiz/glass-conservatory.jpg' },
      { id: 'midnight', label: 'Midnight', description: 'Private, bold, electric', imageUrl: '/images/quiz/unique/midnight-balcony.webp' },
    ],
  },
  {
    id: 'outfit-style',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    allowSkip: true,
    question: 'What kind of outfit do you gravitate toward?',
    options: [
      { id: 'tailored', label: 'Tailored Neutrals', description: 'Structured, timeless, exact', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'relaxed', label: 'Relaxed Essentials', description: 'White shirt, denim, soft layers', imageUrl: '/images/quiz/unique/relaxed-essentials.webp' },
      { id: 'streetwear', label: 'Dark Streetwear', description: 'Graphic, practical, expressive', imageUrl: '/images/quiz/months/november.webp' },
      { id: 'evening', label: 'Evening Polish', description: 'Silk, depth, a little drama', imageUrl: '/images/quiz/months/february.webp' },
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
      { id: 'clean-laundry', label: 'Fresh sheets in morning light', description: 'Clean, quiet, familiar', imageUrl: '/images/quiz/morning-room.jpg' },
      { id: 'seaside-holiday', label: 'A sunlit seaside holiday', description: 'Citrus, salt, warm skin', imageUrl: '/images/quiz/months/august.webp' },
      { id: 'rain-on-stone', label: 'Rain falling on stone and trees', description: 'Mineral, green, grounding', imageUrl: '/images/quiz/unique/rain-on-stone.webp' },
      { id: 'warm-embrace', label: 'A warm embrace in winter', description: 'Vanilla, woods, soft spice', imageUrl: '/images/quiz/unique/winter-memory.webp' },
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
      { id: 'clean', label: 'Clean', description: 'Clear, crisp, freshly washed', imageUrl: '/images/quiz/choices/feel-clean.webp' },
      { id: 'addictive', label: 'Addictive', description: 'Rich, magnetic, hard to forget', imageUrl: '/images/quiz/choices/feel-addictive.webp' },
      { id: 'mysterious', label: 'Mysterious', description: 'Shadowy, atmospheric, intriguing', imageUrl: '/images/quiz/choices/feel-mysterious.webp' },
      { id: 'expensive', label: 'Expensive', description: 'Smooth, composed, elevated', imageUrl: '/images/quiz/choices/feel-expensive.webp' },
      { id: 'comforting', label: 'Comforting', description: 'Soft, warm, reassuring', imageUrl: '/images/quiz/choices/feel-comforting.webp' },
      { id: 'bold', label: 'Bold', description: 'Confident, graphic, unforgettable', imageUrl: '/images/quiz/choices/feel-bold.webp' },
      { id: 'intimate', label: 'Intimate', description: 'Close, private, skin-like', imageUrl: '/images/quiz/choices/feel-intimate.webp' },
    ],
  },
  {
    id: 'compliment-style',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    question: 'What kind of compliment would you want your fragrance to get?',
    options: [
      { id: 'you-smell-clean', label: '"You always smell so clean."', description: 'Fresh, polished, effortless', imageUrl: '/images/products/clean-reserve-skin.jpg', imageFit: 'contain' },
      { id: 'what-is-that', label: '"What are you wearing?"', description: 'Addictive and memorable', imageUrl: '/images/products/zoologist-squid.jpg', imageFit: 'contain' },
      { id: 'smells-expensive', label: '"You smell expensive."', description: 'Smooth, refined, elevated', imageUrl: '/images/products/mfk-baccarat-rouge-540-extrait.jpg', imageFit: 'contain' },
      { id: 'only-you', label: '"That scent is completely you."', description: 'Personal, unusual, signature-worthy', imageUrl: '/images/products/molecule-01.jpg', imageFit: 'contain' },
    ],
  },
];
