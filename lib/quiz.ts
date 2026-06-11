export type QuestionType = 'single' | 'multi' | 'cards' | 'image-cards';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  gradient?: string; // CSS gradient for image card placeholders
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
      { id: 'rainy-castle', label: 'Rainy Castle', description: 'Dark, cosy, mysterious', gradient: 'from-slate-600 to-slate-800' },
      { id: 'sunny-beach', label: 'Sunny Beach', description: 'Bright, warm, carefree', gradient: 'from-yellow-300 to-sky-400' },
      { id: 'late-night-city', label: 'Late Night City', description: 'Electric, bold, alive', gradient: 'from-purple-900 to-indigo-800' },
      { id: 'hotel-room', label: 'Clean Hotel Room', description: 'Minimal, crisp, calm', gradient: 'from-stone-300 to-gray-200' },
      { id: 'forest-rain', label: 'Forest After Rain', description: 'Earthy, fresh, grounding', gradient: 'from-emerald-700 to-teal-600' },
      { id: 'luxury-mall', label: 'Luxury Mall', description: 'Polished, elevated, chic', gradient: 'from-amber-200 to-stone-300' },
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
      { id: 'old-money', label: 'Old Money', description: 'Timeless, effortless wealth', gradient: 'from-stone-400 to-amber-300' },
      { id: 'clean', label: 'Clean Girl/Boy', description: 'Minimal, natural, glowing', gradient: 'from-neutral-200 to-white' },
      { id: 'dark-academia', label: 'Dark Academia', description: 'Books, mystery, intellect', gradient: 'from-stone-700 to-stone-900' },
      { id: 'beach', label: 'Beach Holiday', description: 'Relaxed, salty, golden', gradient: 'from-sky-300 to-sand-200' },
      { id: 'quiet-luxury', label: 'Quiet Luxury', description: 'Understated, premium, calm', gradient: 'from-stone-300 to-neutral-200' },
      { id: 'streetwear', label: 'Streetwear', description: 'Bold, urban, expressive', gradient: 'from-zinc-800 to-zinc-600' },
      { id: 'romantic', label: 'Romantic', description: 'Soft, dreamy, tender', gradient: 'from-pink-300 to-rose-200' },
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
    id: 'personality',
    type: 'single',
    category: 'fun',
    question: 'How would your friends describe your personal style?',
    options: [
      { id: 'classic', label: 'Classic and timeless', emoji: '🏛️' },
      { id: 'trendy', label: 'Always on-trend', emoji: '📱' },
      { id: 'eclectic', label: 'Unique and eclectic', emoji: '🎨' },
      { id: 'minimal', label: 'Minimal and effortless', emoji: '⬜' },
    ],
  },
  {
    id: 'scent-character',
    type: 'single',
    category: 'fun',
    question: 'Which scent character sounds most like you?',
    options: [
      { id: 'crisp', label: 'Crisp and airy', description: 'Fresh, clean, uncomplicated', emoji: '🌿' },
      { id: 'soft', label: 'Soft and comforting', description: 'Gentle, smooth, close to skin', emoji: '☁️' },
      { id: 'warm', label: 'Warm and inviting', description: 'Spiced, sweet, enveloping', emoji: '🔥' },
      { id: 'dark', label: 'Dark and intriguing', description: 'Smoky, deep, unconventional', emoji: '🌑' },
    ],
  },
  {
    id: 'drink',
    type: 'single',
    category: 'fun',
    question: 'What would you order?',
    options: [
      { id: 'espresso', label: 'Espresso', emoji: '☕' },
      { id: 'sparkling-water', label: 'Sparkling water with lime', emoji: '💧' },
      { id: 'cocktail', label: 'Something dark and smoky', emoji: '🥃' },
      { id: 'flower-tea', label: 'Floral herbal tea', emoji: '🌸' },
      { id: 'cold-brew', label: 'Cold brew', emoji: '🧊' },
    ],
  },
  {
    id: 'compliments',
    type: 'single',
    category: 'serious',
    question: 'What matters most to you?',
    options: [
      { id: 'compliments', label: 'Getting compliments', description: 'I want people to notice', emoji: '💬' },
      { id: 'personal', label: 'A personal signature', description: 'It is just for me', emoji: '🔏' },
      { id: 'versatile', label: 'Maximum versatility', description: 'Works everywhere', emoji: '🔄' },
      { id: 'unique', label: 'Being unique', description: 'Nobody else should wear it', emoji: '🦋' },
    ],
  },
];
