'use client';

import { useState } from 'react';
import { Prompt } from '../types';
import { useAppStore } from '../store/useAppStore';

export default function PromptSelector() {
  const { prompts, currentPrompt, setCurrentPrompt, currentLanguage } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Prompts' },
    { id: 'daily', name: 'Daily Life' },
    { id: 'family', name: 'Family & Traditions' },
    { id: 'food', name: 'Food & Cuisine' },
    { id: 'culture', name: 'Culture & Customs' },
    { id: 'travel', name: 'Travel & Experiences' }
  ];

  const filteredPrompts = selectedCategory === 'all' 
    ? prompts 
    : prompts.filter((prompt: Prompt) => prompt.category === selectedCategory);

  const handlePromptSelect = (prompt: Prompt) => {
    setCurrentPrompt(prompt);
  };

  if (!currentLanguage) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">Please select a language first from the navigation bar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Choose a Prompt
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Select a topic to contribute data in {currentLanguage.nativeName} ({currentLanguage.name})
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {filteredPrompts.map((prompt: Prompt) => (
          <div
            key={prompt.id}
            className={`p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              currentPrompt?.id === prompt.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handlePromptSelect(prompt)}
          >
            <div className="mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {prompt.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {prompt.description}
              </p>
            </div>

            {prompt.examples && prompt.examples.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Examples:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {prompt.examples.slice(0, 2).map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-3 sm:mt-4">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                prompt.category === 'daily' ? 'bg-green-100 text-green-800' :
                prompt.category === 'family' ? 'bg-purple-100 text-purple-800' :
                prompt.category === 'food' ? 'bg-orange-100 text-orange-800' :
                prompt.category === 'culture' ? 'bg-red-100 text-red-800' :
                prompt.category === 'travel' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {prompt.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm sm:text-base">No prompts found for the selected category.</p>
        </div>
      )}
    </div>
  );
} 