export type QuestionType = 'single' | 'multi' | 'cards' | 'image-cards';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  gradient?: string; // CSS gradient for image card placeholders
  imageUrl?: string; // Quiz scene artwork only; product packshots live in fragrance data
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
    type: 'image-cards',
    category: 'serious',
    question: 'What kind of scent speaks to you?',
    subtitle: 'Choose up to three',
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
    maxSelections: 1,
    question: 'What do you mainly need this fragrance for?',
    options: [
      { id: 'daily', label: 'Casual Everyday', description: 'Easy and naturally put together', imageUrl: '/images/quiz/relaxed-denim.jpg' },
      { id: 'work', label: 'School / Work', description: 'Polished without taking over', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'date', label: 'Date Night', description: 'Warm, close, memorable', imageUrl: '/images/quiz/golden-rooftop.jpg' },
      { id: 'night', label: 'Party / Night Out', description: 'Confident after dark', imageUrl: '/images/quiz/late-night-city.jpg' },
      { id: 'special', label: 'Formal Event', description: 'Elegant and elevated', imageUrl: '/images/quiz/luxury-boutique.jpg' },
      { id: 'casual', label: 'Holiday / Weekend', description: 'Relaxed and transportive', imageUrl: '/images/quiz/seaside-memory.jpg' },
    ],
  },
  {
    id: 'projection',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'How loud do you want your scent to be?',
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
      { id: 'feminine', label: 'Traditionally feminine', description: 'Soft, floral, polished', imageUrl: '/images/quiz/romantic-evening.jpg' },
      { id: 'masculine', label: 'Traditionally masculine', description: 'Structured, woody, confident', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'unisex', label: 'Unisex / gender-neutral', description: 'Balanced, modern, unrestricted', imageUrl: '/images/quiz/glass-conservatory.jpg' },
      { id: 'any', label: 'I do not care, just recommend what fits me', description: 'Choose entirely by fit', imageUrl: '/images/quiz/choices/feel-open.webp' },
    ],
  },
  {
    id: 'price-range',
    type: 'image-cards',
    category: 'serious',
    maxSelections: 1,
    question: 'What is your budget?',
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
    question: 'Any preference on the type of brand?',
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
    question: 'Any notes you definitely want to avoid?',
    subtitle: 'Select all that apply',
    options: [
      { id: 'oud', label: 'Oud', description: 'Dense resinous woods', imageUrl: '/images/quiz/scents/woody.webp' },
      { id: 'vanilla', label: 'Vanilla / Sweet', description: 'Sugared gourmand warmth', imageUrl: '/images/quiz/scents/sweet.webp' },
      { id: 'rose', label: 'Rose / Heavy florals', description: 'Full, petal-rich bouquets', imageUrl: '/images/quiz/scents/floral.webp' },
      { id: 'citrus', label: 'Citrus / Sharp', description: 'Bright, zesty freshness', imageUrl: '/images/quiz/scents/fresh.webp' },
      { id: 'tobacco', label: 'Tobacco / Smoky', description: 'Dark smoke and warm spice', imageUrl: '/images/quiz/scents/spicy.webp' },
      { id: 'none', label: 'None — I\'m open to everything', description: 'Keep every direction open', imageUrl: '/images/quiz/choices/feel-open.webp' },
    ],
  },
  // --- FUN QUESTIONS ---
  {
    id: 'vibe',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
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
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    question: 'Pick your season',
    options: [
      { id: 'spring', label: 'Spring', description: 'Blooming, airy, optimistic', imageUrl: '/images/quiz/spring-garden.jpg' },
      { id: 'summer', label: 'Summer', description: 'Sun-soaked, bright, free', imageUrl: '/images/quiz/sunny-beach.jpg' },
      { id: 'autumn', label: 'Autumn', description: 'Textured, cosy, golden', imageUrl: '/images/quiz/autumn-library.jpg' },
      { id: 'winter', label: 'Winter', description: 'Warm, intimate, enveloping', imageUrl: '/images/quiz/winter-firelight.jpg' },
    ],
  },
  {
    id: 'aesthetic',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    question: 'Which aesthetic is most you?',
    options: [
      { id: 'old-money', label: 'Old Money', description: 'Timeless, composed, precise', imageUrl: '/images/quiz/tailored-neutral.jpg' },
      { id: 'clean', label: 'Clean Girl', description: 'Natural, bright, effortless', imageUrl: '/images/quiz/morning-room.jpg' },
      { id: 'dark-academia', label: 'Dark Academia', description: 'Books, mystery, intellect', imageUrl: '/images/quiz/secret-library.jpg' },
      { id: 'beach', label: 'Beach Holiday', description: 'Relaxed, salty, golden', imageUrl: '/images/quiz/seaside-memory.jpg' },
      { id: 'quiet-luxury', label: 'Quiet Luxury', description: 'Understated, premium, calm', imageUrl: '/images/quiz/luxury-boutique.jpg' },
      { id: 'streetwear', label: 'City Chic', description: 'Bold, urban, expressive', imageUrl: '/images/quiz/dark-streetwear.jpg' },
      { id: 'romantic', label: 'Soft Romantic', description: 'Gentle, polished, intimate', imageUrl: '/images/quiz/romantic-evening.jpg' },
    ],
  },
  {
    id: 'mood',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    question: 'What mood do you want to wear?',
    options: [
      { id: 'fresh', label: 'Fresh Morning', description: 'Clear light and a clean start', imageUrl: '/images/quiz/morning-room.jpg' },
      { id: 'mysterious', label: 'Rainy Day', description: 'Reflective, cool, atmospheric', imageUrl: '/images/quiz/forest-rain.jpg' },
      { id: 'soft', label: 'Sunset Date', description: 'Warm, tender, close', imageUrl: '/images/quiz/golden-rooftop.jpg' },
      { id: 'elegant', label: 'Luxury Hotel Lobby', description: 'Smooth, composed, expensive', imageUrl: '/images/quiz/luxury-boutique.jpg' },
      { id: 'confident', label: 'Forest Walk', description: 'Grounded, distinct, self-assured', imageUrl: '/images/quiz/glass-conservatory.jpg' },
      { id: 'playful', label: 'Beach Resort', description: 'Bright, relaxed, sociable', imageUrl: '/images/quiz/sunny-beach.jpg' },
    ],
  },
  {
    id: 'birth-month',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    question: 'What month were you born?',
    subtitle: 'Pick the seasonal mood that belongs to you',
    options: [
      { id: 'jan', label: 'January', description: 'Frosted light', imageUrl: '/images/quiz/months/january.webp' },
      { id: 'feb', label: 'February', description: 'Velvet romance', imageUrl: '/images/quiz/months/february.webp' },
      { id: 'mar', label: 'March', description: 'Rain and green shoots', imageUrl: '/images/quiz/months/march.webp' },
      { id: 'apr', label: 'April', description: 'Petals after rain', imageUrl: '/images/quiz/months/april.webp' },
      { id: 'may', label: 'May', description: 'Garden sunlight', imageUrl: '/images/quiz/months/may.webp' },
      { id: 'jun', label: 'June', description: 'Long golden evenings', imageUrl: '/images/quiz/months/june.webp' },
      { id: 'jul', label: 'July', description: 'Salt and bright sun', imageUrl: '/images/quiz/months/july.webp' },
      { id: 'aug', label: 'August', description: 'Warm fruit and haze', imageUrl: '/images/quiz/months/august.webp' },
      { id: 'sep', label: 'September', description: 'Soft amber air', imageUrl: '/images/quiz/months/september.webp' },
      { id: 'oct', label: 'October', description: 'Leaves and candlelight', imageUrl: '/images/quiz/months/october.webp' },
      { id: 'nov', label: 'November', description: 'Rain on dark wood', imageUrl: '/images/quiz/months/november.webp' },
      { id: 'dec', label: 'December', description: 'Evergreen and glow', imageUrl: '/images/quiz/months/december.webp' },
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
    question: 'How long do you want it to last?',
    options: [
      { id: 'short', label: '2–4 hours', description: 'Light, easy, fleeting', imageUrl: '/images/quiz/choices/longevity-short.webp' },
      { id: 'medium', label: '4–8 hours', description: 'Comfortable full-day wear', imageUrl: '/images/quiz/choices/longevity-medium.webp' },
      { id: 'long', label: '8+ hours', description: 'A lasting statement', imageUrl: '/images/quiz/choices/longevity-long.webp' },
    ],
  },
  {
    id: 'ideal-weekend',
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
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
    maxSelections: 1,
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
    maxSelections: 1,
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
    maxSelections: 1,
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
    maxSelections: 1,
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
    maxSelections: 1,
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
    type: 'image-cards',
    category: 'fun',
    maxSelections: 1,
    question: 'What memory do you want your scent to bring back?',
    options: [
      { id: 'clean-laundry', label: 'Fresh sheets in morning light', description: 'Clean, quiet, familiar', imageUrl: '/images/quiz/morning-room.jpg' },
      { id: 'seaside-holiday', label: 'A sunlit seaside holiday', description: 'Citrus, salt, warm skin', imageUrl: '/images/quiz/seaside-memory.jpg' },
      { id: 'rain-on-stone', label: 'Rain falling on stone and trees', description: 'Mineral, green, grounding', imageUrl: '/images/quiz/forest-rain.jpg' },
      { id: 'warm-embrace', label: 'A warm embrace in winter', description: 'Vanilla, woods, soft spice', imageUrl: '/images/quiz/winter-firelight.jpg' },
    ],
  },
  {
    id: 'desired-feel',
    type: 'image-cards',
    category: 'serious',
    question: 'How should your fragrance feel?',
    subtitle: 'Choose up to two',
    maxSelections: 2,
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
    question: 'What kind of compliment would you want your fragrance to get?',
    options: [
      { id: 'you-smell-clean', label: '"You always smell so clean."', description: 'Fresh, polished, effortless', imageUrl: '/images/quiz/choices/feel-clean.webp' },
      { id: 'what-is-that', label: '"What are you wearing?"', description: 'Addictive and memorable', imageUrl: '/images/quiz/choices/feel-addictive.webp' },
      { id: 'smells-expensive', label: '"You smell expensive."', description: 'Smooth, refined, elevated', imageUrl: '/images/quiz/choices/feel-expensive.webp' },
      { id: 'only-you', label: '"That scent is completely you."', description: 'Personal, unusual, signature-worthy', imageUrl: '/images/quiz/choices/feel-intimate.webp' },
    ],
  },
];
