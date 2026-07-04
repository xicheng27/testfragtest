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
    question: 'Who is this scent mission for?',
    subtitle: 'This helps us decide how safe, specific, or giftable the picks should be.',
    options: [
      { id: 'me', label: 'For me', description: 'I want something that feels like my actual life.' },
      { id: 'gift', label: 'For someone else', description: 'Keep it safer, likeable, and easy to wear.' },
      { id: 'not-sure', label: 'I am still exploring', description: 'Start flexible, then let me refine.' },
    ],
  },
  {
    id: 'desired-feel',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 2,
    question: 'What should your fragrance say before you do?',
    subtitle: 'Pick up to two. This sets the emotional direction.',
    options: [
      { id: 'clean', label: 'Fresh out the shower', description: 'Clean skin, linen, citrus, zero effort.', imageUrl: '/images/quiz/scents/fresh.webp' },
      { id: 'comforting', label: 'Soft hoodie energy', description: 'Warm, close, comforting, easy to live in.', imageUrl: '/images/quiz/unique/winter-memory.webp' },
      { id: 'mysterious', label: 'Someone asks twice', description: 'Darker, addictive, harder to place.', imageUrl: '/images/quiz/choices/feel-mysterious.webp' },
      { id: 'expensive', label: 'Quiet luxury lobby', description: 'Smooth, polished, expensive without shouting.', imageUrl: '/images/quiz/unique/quiet-luxury-boutique.webp' },
      { id: 'playful', label: 'Sweet but not basic', description: 'Bright, cute, compliment-friendly.', imageUrl: '/images/quiz/scents/sweet.webp' },
      { id: 'sporty', label: 'Effortless after class', description: 'Clean, airy, active, casual.', imageUrl: '/images/quiz/choices/projection-subtle.webp' },
      { id: 'bold', label: 'After-dark main character', description: 'Confident, warm, not shy.', imageUrl: '/images/quiz/unique/midnight-balcony.webp' },
      { id: 'intimate', label: 'Only close people notice', description: 'Skin-like, gentle, quiet magnetism.', imageUrl: '/images/quiz/choices/feel-intimate.webp' },
    ],
  },
  {
    id: 'occasion',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 2,
    question: 'Where is this scent actually going?',
    subtitle: 'Pick up to two places it needs to make sense in real life.',
    options: [
      { id: 'daily', label: 'School / everyday', description: 'Clean, easy, nobody complains.', imageUrl: '/images/quiz/unique/school-work.webp' },
      { id: 'work', label: 'Work / close spaces', description: 'Polished, respectful, not room-filling.', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'date', label: 'Date energy', description: 'Warm, close, memorable up close.', imageUrl: '/images/quiz/golden-rooftop.jpg' },
      { id: 'night', label: 'Night out', description: 'Confident, louder, more magnetic.', imageUrl: '/images/quiz/unique/party-rooftop.webp' },
      { id: 'casual', label: 'Gym / errands / casual', description: 'Fresh, sporty, low-effort.', imageUrl: '/images/quiz/relaxed-denim.jpg' },
      { id: 'special', label: 'Formal or dressed-up', description: 'Elegant, intentional, expensive-feeling.', imageUrl: '/images/quiz/unique/luxury-hotel-lobby.webp' },
      { id: 'everything', label: 'One scent for everything', description: 'Versatile first, risky later.', imageUrl: '/images/quiz/choices/brand-any.webp' },
    ],
  },
  {
    id: 'scent-family',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 2,
    question: 'Pick the scent world you would actually live in.',
    subtitle: 'Choose up to two. This is the smell direction behind the data.',
    options: [
      { id: 'clean', label: 'Clean skin and soft laundry', description: 'Musk, linen, fresh without sharpness.', imageUrl: '/images/quiz/choices/feel-clean.webp' },
      { id: 'aquatic', label: 'Sea air and bright citrus', description: 'Salty, breezy, refreshing.', imageUrl: '/images/quiz/scents/aquatic.webp' },
      { id: 'gourmand', label: 'Vanilla cafe dessert', description: 'Sweet, warm, edible-adjacent.', imageUrl: '/images/quiz/scents/sweet.webp' },
      { id: 'floral', label: 'Soft petals and sunlight', description: 'Romantic, airy, pretty but not dusty.', imageUrl: '/images/quiz/scents/floral.webp' },
      { id: 'woody', label: 'Sandalwood and cedar', description: 'Creamy woods, calm depth, polished.', imageUrl: '/images/quiz/scents/woody.webp' },
      { id: 'oriental', label: 'Smoke, leather, amber', description: 'Dark, textured, a little dangerous.', imageUrl: '/images/quiz/secret-library.jpg' },
      { id: 'fresh', label: 'Tea, matcha, green air', description: 'Quiet, clean-focus energy.', imageUrl: '/images/quiz/choices/feel-comforting.webp' },
      { id: 'spicy', label: 'Amber spice glow', description: 'Golden, warm, a little addictive.', imageUrl: '/images/quiz/scents/spicy.webp' },
    ],
  },
  {
    id: 'disliked-notes',
    type: 'cards',
    category: 'serious',
    maxSelections: 4,
    question: 'What vibe are we avoiding at all costs?',
    subtitle: 'This matters. These are hard red flags in your match data.',
    options: [
      { id: 'too-sweet', label: 'Too sweet', description: 'No sugar bomb or syrupy dessert cloud.' },
      { id: 'too-strong', label: 'Too strong', description: 'Nothing that enters the room before I do.' },
      { id: 'oud', label: 'Oud', description: 'Dense resinous woods.' },
      { id: 'smoke', label: 'Smoke', description: 'Ash, incense, campfire, tobacco smoke.' },
      { id: 'powdery', label: 'Powdery scents', description: 'Makeup, iris, vintage softness.' },
      { id: 'vanilla', label: 'Heavy vanilla', description: 'Thick vanilla, caramel, tonka.' },
      { id: 'rose', label: 'Rose', description: 'Petal-heavy florals.' },
      { id: 'leather', label: 'Leather', description: 'Dark, animalic, jacket-like.' },
      { id: 'mature', label: '"Old/mature" scents', description: 'Classic, vintage, formal.' },
      { id: 'none', label: 'Nothing, I am open', description: 'Surprise me, but keep it wearable.' },
    ],
  },
  {
    id: 'projection',
    type: 'cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'How loud should your scent be?',
    subtitle: 'Projection means how far your fragrance travels from you.',
    options: [
      { id: 'subtle', label: 'Soft', description: 'Only people close to me notice.' },
      { id: 'moderate', label: 'Moderate', description: 'Noticeable but not annoying.' },
      { id: 'strong', label: 'Strong', description: 'I want compliments, but not chaos.' },
      { id: 'beast', label: 'Beast mode', description: 'I want presence and a trail.' },
    ],
  },
  {
    id: 'weather',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'What climate does this scent need to survive?',
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
    question: 'What price range should we respect?',
    options: [
      { id: 'budget', label: 'Affordable', description: 'Useful finds and dupes first.' },
      { id: 'mid', label: 'Mid-range', description: 'Accessible designer and better value.' },
      { id: 'designer', label: 'Premium', description: 'Designer and elevated picks.' },
      { id: 'niche', label: 'Luxury', description: 'Niche, private line, more special.' },
      { id: 'any', label: 'Open budget', description: 'Rank by fit first, price second.' },
    ],
  },
  {
    id: 'experience',
    type: 'cards',
    category: 'serious',
    maxSelections: 1,
    allowSkip: true,
    skipLabel: 'Not sure',
    question: 'How deep are you in your fragrance era?',
    options: [
      { id: 'beginner', label: 'Beginner', description: 'Keep it wearable, clear, and low-risk.' },
      { id: 'intermediate', label: 'I know a bit', description: 'Useful, but not painfully obvious.' },
      { id: 'unique', label: 'I am into fragrances', description: 'Show me something with a point of view.' },
    ],
  },
  {
    id: 'compliment-style',
    type: 'cards',
    category: 'fun',
    maxSelections: 1,
    question: 'Last one - what compliment would make your day?',
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
