export type QuestionType = 'single' | 'multi' | 'cards' | 'image-cards';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  gradient?: string; // CSS gradient for image card placeholders
  imageUrl?: string; // Replace this path to swap the visual without touching UI code
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
}

export const quizQuestions: QuizQuestion[] = [
  // --- SERIOUS QUESTIONS ---
  {
    id: 'scent-family',
    type: 'cards',
    category: 'serious',
    question: 'What kind of scents speak to you?',
    subtitle: 'Pick all that appeal',
    maxSelections: 3,
    options: [
      { id: 'fresh', label: 'Fresh', description: 'Clean, airy, ozonic', gradient: 'from-sky-200 to-teal-100', emoji: '🌬️' },
      { id: 'floral', label: 'Floral', description: 'Rose, jasmine, peony', gradient: 'from-pink-200 to-rose-100', emoji: '🌸' },
      { id: 'woody', label: 'Woody', description: 'Sandalwood, cedar, vetiver', gradient: 'from-amber-300 to-stone-200', emoji: '🪵' },
      { id: 'sweet', label: 'Sweet', description: 'Vanilla, caramel, praline', gradient: 'from-orange-200 to-yellow-100', emoji: '🍯' },
      { id: 'spicy', label: 'Spicy', description: 'Pepper, cardamom, oud', gradient: 'from-red-300 to-orange-200', emoji: '🌶️' },
      { id: 'clean', label: 'Clean', description: 'Soap, musk, linen', gradient: 'from-slate-200 to-gray-100', emoji: '✨' },
    ],
  },
  {
    id: 'occasion',
    type: 'single',
    category: 'serious',
    question: 'What do you mainly need this fragrance for?',
    options: [
      { id: 'daily', label: 'Everyday wear', emoji: '☀️' },
      { id: 'work', label: 'School / Work', emoji: '💼' },
      { id: 'date', label: 'Dates', emoji: '🥂' },
      { id: 'night', label: 'Nights out', emoji: '🌙' },
      { id: 'special', label: 'Special occasions', emoji: '🎭' },
      { id: 'casual', label: 'Casual / Weekend', emoji: '🎒' },
    ],
  },
  {
    id: 'projection',
    type: 'single',
    category: 'serious',
    question: 'How loud do you want your scent to be?',
    subtitle: 'Projection = how far the scent radiates',
    options: [
      { id: 'subtle', label: 'Subtle', description: 'Only noticeable up close', emoji: '🤫' },
      { id: 'moderate', label: 'Moderate', description: 'A gentle presence in a room', emoji: '😊' },
      { id: 'strong', label: 'Strong', description: 'Makes an entrance', emoji: '💥' },
    ],
  },
  {
    id: 'gender-style',
    type: 'single',
    category: 'serious',
    question: 'Are you open to fragrances marketed as more...',
    options: [
      { id: 'feminine', label: 'Traditionally feminine', emoji: '🌸' },
      { id: 'masculine', label: 'Traditionally masculine', emoji: '🔵' },
      { id: 'unisex', label: 'Unisex / gender-neutral', emoji: '⚪' },
      { id: 'any', label: 'I do not care, just recommend what fits me', emoji: '✨' },
    ],
  },
  {
    id: 'price-range',
    type: 'single',
    category: 'serious',
    question: 'What is your budget?',
    options: [
      { id: 'budget', label: 'Under $80', description: 'Affordable finds', emoji: '💰' },
      { id: 'mid', label: '$80–$150', description: 'Mid-range designer', emoji: '💳' },
      { id: 'designer', label: '$150–$350', description: 'High-end designer', emoji: '🏷️' },
      { id: 'niche', label: '$350+', description: 'Niche & exclusive', emoji: '💎' },
    ],
  },
  {
    id: 'tier',
    type: 'single',
    category: 'serious',
    question: 'Any preference on the type of brand?',
    options: [
      { id: 'designer', label: 'Designer', description: 'Chanel, Dior, TF, Armani…', emoji: '🏛️' },
      { id: 'niche', label: 'Niche', description: 'Le Labo, Creed, Kilian…', emoji: '🔬' },
      { id: 'any', label: 'No preference', description: "Show me the best match", emoji: '🎯' },
    ],
  },
  {
    id: 'disliked-notes',
    type: 'multi',
    category: 'serious',
    question: 'Any notes you definitely want to avoid?',
    subtitle: 'Select all that apply',
    options: [
      { id: 'oud', label: 'Oud', emoji: '🪨' },
      { id: 'vanilla', label: 'Vanilla / Sweet', emoji: '🍦' },
      { id: 'rose', label: 'Rose / Heavy florals', emoji: '🥀' },
      { id: 'citrus', label: 'Citrus / Sharp', emoji: '🍋' },
      { id: 'tobacco', label: 'Tobacco / Smoky', emoji: '🚬' },
      { id: 'none', label: 'None — I\'m open to everything', emoji: '✅' },
    ],
  },
  // --- FUN QUESTIONS ---
  {
    id: 'vibe',
    type: 'image-cards',
    category: 'fun',
    question: 'Pick your vibe',
    subtitle: 'Where do you feel most yourself?',
    options: [
      { id: 'rainy-castle', label: 'Rainy Castle', description: 'Dark, cosy, mysterious', imageUrl: '/images/quiz/rainy-castle.jpg' },
      { id: 'sunny-beach', label: 'Sunny Beach', description: 'Bright, warm, carefree', imageUrl: '/images/quiz/sunny-beach.jpg' },
      { id: 'late-night-city', label: 'Late Night City', description: 'Electric, bold, alive', imageUrl: '/images/quiz/late-night-city.jpg' },
      { id: 'hotel-room', label: 'Clean Hotel Room', description: 'Minimal, crisp, calm', imageUrl: '/images/quiz/hotel-room.jpg' },
      { id: 'forest-rain', label: 'Forest After Rain', description: 'Earthy, fresh, grounding', imageUrl: '/images/quiz/forest-rain.jpg' },
      { id: 'luxury-mall', label: 'Quiet-Luxury Boutique', description: 'Polished, elevated, chic', imageUrl: '/images/quiz/luxury-boutique.jpg' },
    ],
  },
  {
    id: 'season',
    type: 'single',
    category: 'fun',
    question: 'Pick your season',
    options: [
      { id: 'spring', label: 'Spring', description: 'Bloom and freshness', emoji: '🌱' },
      { id: 'summer', label: 'Summer', description: 'Sun-soaked and free', emoji: '☀️' },
      { id: 'autumn', label: 'Autumn', description: 'Cosy and golden', emoji: '🍂' },
      { id: 'winter', label: 'Winter', description: 'Warm and intimate', emoji: '❄️' },
    ],
  },
  {
    id: 'aesthetic',
    type: 'image-cards',
    category: 'fun',
    question: 'Which aesthetic is most you?',
    options: [
      { id: 'old-money', label: 'Tailored Classic', description: 'Timeless, composed, precise', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'clean', label: 'Clean Minimal', description: 'Natural, bright, effortless', imageUrl: '/images/quiz/morning-room.jpg' },
      { id: 'dark-academia', label: 'Dark Academia', description: 'Books, mystery, intellect', imageUrl: '/images/quiz/secret-library.jpg' },
      { id: 'beach', label: 'Coastal Ease', description: 'Relaxed, salty, golden', imageUrl: '/images/quiz/seaside-memory.jpg' },
      { id: 'quiet-luxury', label: 'Quiet Luxury', description: 'Understated, premium, calm', imageUrl: '/images/quiz/luxury-boutique.jpg' },
      { id: 'streetwear', label: 'Dark Streetwear', description: 'Bold, urban, expressive', imageUrl: '/images/quiz/dark-streetwear.jpg' },
      { id: 'romantic', label: 'Romantic Evening', description: 'Soft, polished, intimate', imageUrl: '/images/quiz/romantic-evening.jpg' },
    ],
  },
  {
    id: 'mood',
    type: 'single',
    category: 'fun',
    question: 'What mood do you want to wear?',
    options: [
      { id: 'mysterious', label: 'Mysterious', emoji: '🌑' },
      { id: 'fresh', label: 'Fresh', emoji: '💧' },
      { id: 'confident', label: 'Confident', emoji: '⚡' },
      { id: 'soft', label: 'Soft', emoji: '🕊️' },
      { id: 'elegant', label: 'Elegant', emoji: '🪞' },
      { id: 'playful', label: 'Playful', emoji: '🎈' },
    ],
  },
  {
    id: 'birth-month',
    type: 'single',
    category: 'fun',
    question: 'What month were you born?',
    subtitle: 'Just for a little personalised touch',
    options: [
      { id: 'jan', label: 'January' }, { id: 'feb', label: 'February' },
      { id: 'mar', label: 'March' }, { id: 'apr', label: 'April' },
      { id: 'may', label: 'May' }, { id: 'jun', label: 'June' },
      { id: 'jul', label: 'July' }, { id: 'aug', label: 'August' },
      { id: 'sep', label: 'September' }, { id: 'oct', label: 'October' },
      { id: 'nov', label: 'November' }, { id: 'dec', label: 'December' },
    ],
  },
];

// Additional questions shown after the original quiz.
export const additionalQuizQuestions: QuizQuestion[] = [
  {
    id: 'longevity',
    type: 'single',
    category: 'serious',
    question: 'How long do you want it to last?',
    options: [
      { id: 'short', label: '2–4 hours', description: 'Light, easy', emoji: '⏱️' },
      { id: 'medium', label: '4–8 hours', description: 'Full day wear', emoji: '🕐' },
      { id: 'long', label: '8+ hours', description: 'All-day beast', emoji: '🔋' },
    ],
  },
  {
    id: 'ideal-weekend',
    type: 'image-cards',
    category: 'fun',
    question: 'What does your ideal weekend feel like?',
    subtitle: 'Choose the pace you want your fragrance to carry',
    options: [
      { id: 'slow-morning', label: 'Slow Morning', description: 'Linen, light, no agenda', imageUrl: '/images/quiz/morning-room.jpg' },
      { id: 'coastal-escape', label: 'Coastal Escape', description: 'Salt air and sun-warmed skin', imageUrl: '/images/quiz/seaside-memory.jpg' },
      { id: 'city-evening', label: 'City Evening', description: 'Dinner, music, somewhere new', imageUrl: '/images/quiz/late-night-city.jpg' },
      { id: 'forest-reset', label: 'Forest Reset', description: 'Rain, trees, complete quiet', imageUrl: '/images/quiz/forest-rain.jpg' },
    ],
  },
  {
    id: 'room',
    type: 'image-cards',
    category: 'fun',
    question: 'Pick a room you would want to walk into.',
    options: [
      { id: 'minimal-suite', label: 'Minimal Suite', description: 'Quiet, crisp, immaculate', imageUrl: '/images/quiz/hotel-room.jpg' },
      { id: 'old-library', label: 'Old Library', description: 'Leather, paper, hidden doors', imageUrl: '/images/quiz/secret-library.jpg' },
      { id: 'warm-boutique', label: 'Warm Boutique', description: 'Stone, wood, beautiful objects', imageUrl: '/images/quiz/luxury-boutique.jpg' },
      { id: 'fireside-room', label: 'Fireside Room', description: 'Blankets, smoke, amber light', imageUrl: '/images/quiz/winter-firelight.jpg' },
    ],
  },
  {
    id: 'weather-personality',
    type: 'image-cards',
    category: 'fun',
    question: 'What kind of weather matches your personality?',
    options: [
      { id: 'soft-rain', label: 'Soft Rain', description: 'Reflective and grounding', imageUrl: '/images/quiz/forest-rain.jpg' },
      { id: 'clear-sun', label: 'Clear Sun', description: 'Open, warm, uncomplicated', imageUrl: '/images/quiz/sunny-beach.jpg' },
      { id: 'crisp-air', label: 'Crisp Air', description: 'Focused, cool, energising', imageUrl: '/images/quiz/spring-garden.jpg' },
      { id: 'night-storm', label: 'Night Storm', description: 'Dramatic, magnetic, alive', imageUrl: '/images/quiz/rainy-castle.jpg' },
    ],
  },
  {
    id: 'time-of-day',
    type: 'image-cards',
    category: 'fun',
    question: 'What time of day do you feel most like yourself?',
    options: [
      { id: 'early-morning', label: 'Early Morning', description: 'Still, bright, full of possibility', imageUrl: '/images/quiz/morning-room.jpg' },
      { id: 'golden-hour', label: 'Golden Hour', description: 'Warm, flattering, unhurried', imageUrl: '/images/quiz/golden-rooftop.jpg' },
      { id: 'blue-hour', label: 'Blue Hour', description: 'Polished, calm, cinematic', imageUrl: '/images/quiz/glass-conservatory.jpg' },
      { id: 'midnight', label: 'Midnight', description: 'Private, bold, electric', imageUrl: '/images/quiz/late-night-city.jpg' },
    ],
  },
  {
    id: 'fictional-setting',
    type: 'image-cards',
    category: 'fun',
    question: 'Which fictional setting would you live in?',
    options: [
      { id: 'secret-library', label: 'A Secret Library', description: 'Old books and hidden rooms', imageUrl: '/images/quiz/secret-library.jpg' },
      { id: 'moonlit-conservatory', label: 'Moonlit Conservatory', description: 'Glass, greenery, quiet magic', imageUrl: '/images/quiz/glass-conservatory.jpg' },
      { id: 'cliffside-villa', label: 'Cliffside Villa', description: 'Sea air and impossible views', imageUrl: '/images/quiz/sunny-beach.jpg' },
      { id: 'rainy-kingdom', label: 'Rainy Kingdom', description: 'Stone walls and stormy skies', imageUrl: '/images/quiz/rainy-castle.jpg' },
    ],
  },
  {
    id: 'outfit-style',
    type: 'image-cards',
    category: 'fun',
    question: 'What kind of outfit do you gravitate toward?',
    options: [
      { id: 'tailored', label: 'Tailored Neutrals', description: 'Structured, timeless, exact', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'relaxed', label: 'Relaxed Essentials', description: 'White shirt, denim, soft layers', imageUrl: '/images/quiz/relaxed-denim.jpg' },
      { id: 'streetwear', label: 'Dark Streetwear', description: 'Graphic, practical, expressive', imageUrl: '/images/quiz/dark-streetwear.jpg' },
      { id: 'evening', label: 'Evening Polish', description: 'Silk, depth, a little drama', imageUrl: '/images/quiz/romantic-evening.jpg' },
    ],
  },
  {
    id: 'memory',
    type: 'single',
    category: 'fun',
    question: 'What memory do you want your scent to bring back?',
    options: [
      { id: 'clean-laundry', label: 'Fresh sheets in morning light', description: 'Clean, quiet, familiar', emoji: '☁️' },
      { id: 'seaside-holiday', label: 'A sunlit seaside holiday', description: 'Citrus, salt, warm skin', emoji: '🌊' },
      { id: 'rain-on-stone', label: 'Rain falling on stone and trees', description: 'Mineral, green, grounding', emoji: '🌧️' },
      { id: 'warm-embrace', label: 'A warm embrace in winter', description: 'Vanilla, woods, soft spice', emoji: '🕯️' },
    ],
  },
  {
    id: 'desired-feel',
    type: 'multi',
    category: 'serious',
    question: 'How should your fragrance feel?',
    subtitle: 'Choose up to two',
    maxSelections: 2,
    options: [
      { id: 'clean', label: 'Clean', emoji: '✨' },
      { id: 'addictive', label: 'Addictive', emoji: '🫧' },
      { id: 'mysterious', label: 'Mysterious', emoji: '🌑' },
      { id: 'expensive', label: 'Expensive', emoji: '◆' },
      { id: 'comforting', label: 'Comforting', emoji: '☁️' },
      { id: 'bold', label: 'Bold', emoji: '⚡' },
      { id: 'intimate', label: 'Intimate', emoji: '◌' },
    ],
  },
  {
    id: 'compliment-style',
    type: 'single',
    category: 'serious',
    question: 'What kind of compliment would you want your fragrance to get?',
    options: [
      { id: 'you-smell-clean', label: '"You always smell so clean."', description: 'Fresh, polished, effortless', emoji: '✨' },
      { id: 'what-is-that', label: '"What are you wearing?"', description: 'Addictive and memorable', emoji: '💬' },
      { id: 'smells-expensive', label: '"You smell expensive."', description: 'Smooth, refined, elevated', emoji: '◆' },
      { id: 'only-you', label: '"That scent is completely you."', description: 'Personal, unusual, signature-worthy', emoji: '◌' },
    ],
  },
];
