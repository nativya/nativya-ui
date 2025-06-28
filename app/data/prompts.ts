import { Prompt } from '../types';

export const DATA_PROMPTS: Prompt[] = [
  {
    id: 'daily-routine',
    title: 'Describe your typical day',
    description: 'Tell us about your daily routine, from morning to evening',
    category: 'daily',
    examples: [
      'What time do you wake up?',
      'What do you do for breakfast?',
      'How do you spend your work/study time?',
      'What activities do you do in the evening?'
    ]
  },
  {
    id: 'family-traditions',
    title: 'Share a family tradition',
    description: 'Describe a special tradition or custom in your family',
    category: 'family',
    examples: [
      'Festival celebrations',
      'Cooking traditions',
      'Family gatherings',
      'Religious practices'
    ]
  },
  {
    id: 'favorite-food',
    title: 'Your favorite local dish',
    description: 'Tell us about your favorite traditional or local food',
    category: 'food',
    examples: [
      'How is it prepared?',
      'When do you usually eat it?',
      'What makes it special?',
      'Who taught you to make it?'
    ]
  },
  {
    id: 'childhood-memory',
    title: 'A memorable childhood experience',
    description: 'Share a special memory from your childhood',
    category: 'family',
    examples: [
      'School days',
      'Family trips',
      'Festival celebrations',
      'Friends and games'
    ]
  },
  {
    id: 'local-culture',
    title: 'Local culture and customs',
    description: 'Describe unique cultural practices in your region',
    category: 'culture',
    examples: [
      'Traditional festivals',
      'Local art forms',
      'Community practices',
      'Regional customs'
    ]
  },
  {
    id: 'travel-experience',
    title: 'A memorable journey',
    description: 'Share an interesting travel experience',
    category: 'travel',
    examples: [
      'Where did you go?',
      'What made it special?',
      'People you met',
      'Food you tried'
    ]
  },
  {
    id: 'weather-seasons',
    title: 'Weather and seasons in your region',
    description: 'Describe the weather patterns and seasons where you live',
    category: 'daily',
    examples: [
      'How do seasons change?',
      'What do you do in different weather?',
      'How does weather affect daily life?',
      'Favorite season and why?'
    ]
  },
  {
    id: 'local-market',
    title: 'Your local market experience',
    description: 'Describe visiting a local market or bazaar',
    category: 'daily',
    examples: [
      'What do you buy there?',
      'How often do you visit?',
      'What makes it special?',
      'Interactions with vendors'
    ]
  }
];

export const getPromptsByCategory = (category: Prompt['category']): Prompt[] => {
  return DATA_PROMPTS.filter(prompt => prompt.category === category);
};

export const getRandomPrompt = (): Prompt => {
  const randomIndex = Math.floor(Math.random() * DATA_PROMPTS.length);
  return DATA_PROMPTS[randomIndex];
}; 