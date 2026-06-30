export type QuestionType = 'single' | 'multi' | 'cards' | 'image-cards';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  gradient?: string;
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
  maxSelections?: number;
  allowSkip?: boolean;
  skipLabel?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'who-for',
    type: 'cards',
    category: 'serious',
    maxSelections: 1,
    question: 'Who are we finding this for?',
    subtitle: 'So the recommendations know how safe or specific to be.',
    options: [
      { id: 'me', label: 'Me', description: 'I want something that feels like my vibe.' },
      { id: 'gift', label: 'A gift', description: 'Keep it safer, likeable, and easy to wear.' },
      { id: 'not-sure', label: 'Not sure yet', description: 'Show me flexible picks first.' },
    ],
  },
  {
    id: 'desired-feel',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 2,
    question: 'What vibe are we going for?',
    subtitle: 'Pick up to two. This is the scent energy.',
    options: [
      { id: 'clean', label: 'Clean and fresh', description: 'Fresh sheets, citrus, just-showered energy.', imageUrl: '/images/quiz/scents/fresh.webp' },
      { id: 'comforting', label: 'Warm and cozy', description: 'Soft, close, feels like a good hoodie.', imageUrl: '/images/quiz/unique/winter-memory.webp' },
      { id: 'mysterious', label: 'Mysterious and addictive', description: 'Darker, warmer, more memorable.', imageUrl: '/images/quiz/choices/feel-mysterious.webp' },
      { id: 'expensive', label: 'Expensive and elegant', description: 'Smooth, polished, quiet-luxury energy.', imageUrl: '/images/quiz/unique/quiet-luxury-boutique.webp' },
      { id: 'playful', label: 'Sweet and playful', description: 'Cute, bright, compliment-friendly.', imageUrl: '/images/quiz/scents/sweet.webp' },
      { id: 'sporty', label: 'Sporty and effortless', description: 'Clean, airy, easy after class or the gym.', imageUrl: '/images/quiz/choices/projection-subtle.webp' },
      { id: 'bold', label: 'Dark and bold', description: 'After-dark, confident, not shy.', imageUrl: '/images/quiz/unique/midnight-balcony.webp' },
      { id: 'intimate', label: 'Soft and comforting', description: 'Skin-like, gentle, easy to get close to.', imageUrl: '/images/quiz/choices/feel-intimate.webp' },
    ],
  },
  {
    id: 'occasion',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 2,
    question: 'Where is this scent going?',
    subtitle: 'Pick up to two places you will actually wear it.',
    options: [
      { id: 'daily', label: 'School / daily', description: 'Easy, clean, not too loud.', imageUrl: '/images/quiz/unique/school-work.webp' },
      { id: 'work', label: 'Work / office', description: 'Polished and respectful in close spaces.', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'date', label: 'Dates', description: 'Warm, close, memorable.', imageUrl: '/images/quiz/golden-rooftop.jpg' },
      { id: 'night', label: 'Night out', description: 'Confident, louder, more magnetic.', imageUrl: '/images/quiz/unique/party-rooftop.webp' },
      { id: 'casual', label: 'Gym / casual', description: 'Fresh, sporty, low-effort.', imageUrl: '/images/quiz/relaxed-denim.jpg' },
      { id: 'special', label: 'Formal events', description: 'Elegant, dressed-up, expensive-feeling.', imageUrl: '/images/quiz/unique/luxury-hotel-lobby.webp' },
      { id: 'everything', label: 'One scent for everything', description: 'Versatile first, risky later.', imageUrl: '/images/quiz/choices/brand-any.webp' },
    ],
  },
  {
    id: 'scent-family',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 2,
    question: 'Pick your scent world.',
    subtitle: 'The smell direction. Go with instinct.',
    options: [
      { id: 'clean', label: 'Fresh laundry / clean skin', description: 'Soft musk, linen, effortless clean.', imageUrl: '/images/quiz/choices/feel-clean.webp' },
      { id: 'aquatic', label: 'Ocean air / citrus', description: 'Bright, salty, refreshing.', imageUrl: '/images/quiz/scents/aquatic.webp' },
      { id: 'gourmand', label: 'Vanilla / dessert', description: 'Sweet, warm, edible-adjacent.', imageUrl: '/images/quiz/scents/sweet.webp' },
      { id: 'floral', label: 'Flowers / soft romantic', description: 'Petals, pretty air, gentle polish.', imageUrl: '/images/quiz/scents/floral.webp' },
      { id: 'woody', label: 'Woods / sandalwood', description: 'Creamy woods, cedar, calm depth.', imageUrl: '/images/quiz/scents/woody.webp' },
      { id: 'oriental', label: 'Smoke / leather', description: 'Dark, textured, a little dangerous.', imageUrl: '/images/quiz/secret-library.jpg' },
      { id: 'fresh', label: 'Tea / matcha / calm', description: 'Green, quiet, clean-focus energy.', imageUrl: '/images/quiz/choices/feel-comforting.webp' },
      { id: 'spicy', label: 'Spicy / amber / warm', description: 'Golden, warm, a little addictive.', imageUrl: '/images/quiz/scents/spicy.webp' },
    ],
  },
  {
    id: 'disliked-notes',
    type: 'cards',
    category: 'serious',
    maxSelections: 4,
    question: 'Anything we should avoid?',
    subtitle: 'This matters. We will strongly avoid these.',
    options: [
      { id: 'too-sweet', label: 'Too sweet', description: 'No sugar bomb energy.' },
      { id: 'too-strong', label: 'Too strong', description: 'Nothing that enters before you do.' },
      { id: 'oud', label: 'Oud', description: 'Dense resinous woods.' },
      { id: 'smoke', label: 'Smoke', description: 'Ash, incense, campfire, tobacco smoke.' },
      { id: 'powdery', label: 'Powdery scents', description: 'Makeup, iris, vintage softness.' },
      { id: 'vanilla', label: 'Heavy vanilla', description: 'Thick vanilla, caramel, tonka.' },
      { id: 'rose', label: 'Rose', description: 'Petal-heavy florals.' },
      { id: 'leather', label: 'Leather', description: 'Dark, animalic, jacket-like.' },
      { id: 'mature', label: '"Old/mature" scents', description: 'Classic, vintage, formal.' },
      { id: 'none', label: 'Nothing, I am open', description: 'Keep all doors open.' },
    ],
  },
  {
    id: 'projection',
    type: 'cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'How loud should it be?',
    subtitle: 'Projection = how far people can smell it from you.',
    options: [
      { id: 'subtle', label: 'Soft', description: 'Only people close to me notice.' },
      { id: 'moderate', label: 'Moderate', description: 'Noticeable but not annoying.' },
      { id: 'strong', label: 'Strong', description: 'I want compliments.' },
      { id: 'beast', label: 'Beast mode', description: 'I want presence.' },
    ],
  },
  {
    id: 'weather',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'What weather are we dressing for?',
    options: [
      { id: 'hot-humid', label: 'Hot and humid', description: 'Fresh, clean, citrus, tea, light woods.', imageUrl: '/images/quiz/unique/summer-pool.webp' },
      { id: 'cool', label: 'Cool weather', description: 'Vanilla, amber, woods, cozy depth.', imageUrl: '/images/quiz/months/december.webp' },
      { id: 'indoor', label: 'Aircon / indoors', description: 'Polished but not overpowering.', imageUrl: '/images/quiz/unique/clean-hotel-room.webp' },
      { id: 'all-year', label: 'All-year scent', description: 'Balanced and versatile first.', imageUrl: '/images/quiz/months/april.webp' },
    ],
  },
  {
    id: 'price-range',
    type: 'cards',
    category: 'serious',
    maxSelections: 1,
    question: 'What is the budget vibe?',
    options: [
      { id: 'budget', label: 'Affordable', description: 'Useful finds and dupes first.' },
      { id: 'mid', label: 'Mid-range', description: 'Accessible designer and better value.' },
      { id: 'designer', label: 'Premium', description: 'Designer and elevated picks.' },
      { id: 'niche', label: 'Luxury', description: 'Niche, private line, more special.' },
      { id: 'any', label: 'No limit', description: 'Just show me the best.' },
    ],
  },
  {
    id: 'experience',
    type: 'cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'How deep are you into fragrance?',
    options: [
      { id: 'beginner', label: 'Beginner', description: 'I want something safe and easy.' },
      { id: 'intermediate', label: 'I know a bit', description: 'Useful but not too obvious.' },
      { id: 'unique', label: 'I am into fragrances', description: 'Show me something more interesting.' },
    ],
  },
  {
    id: 'compliment-style',
    type: 'cards',
    category: 'fun',
    maxSelections: 1,
    question: 'Last one - what should it say?',
    options: [
      { id: 'you-smell-clean', label: 'I want to smell clean without trying too hard.', description: 'Easy, fresh, low-maintenance.' },
      { id: 'what-is-that', label: 'I want people to ask what I am wearing.', description: 'Noticeable, memorable, compliment bait.' },
      { id: 'soft-comfort', label: 'I want something soft and comforting.', description: 'Cozy, warm, close-to-skin.' },
      { id: 'rich-mysterious', label: 'I want something rich and mysterious.', description: 'Darker, smoother, more magnetic.' },
      { id: 'only-you', label: 'I want something different from everyone else.', description: 'Less obvious, more signature-worthy.' },
    ],
  },
];

// Kept for compatibility with older saved progress/results code. The current
// product experience uses one fast main quiz instead of an extra follow-up quiz.
export const additionalQuizQuestions: QuizQuestion[] = [];
