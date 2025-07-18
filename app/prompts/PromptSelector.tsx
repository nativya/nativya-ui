'use client';

import { useState } from 'react';
import { Prompt } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useRouter } from 'next/navigation';
// NEW: Importing professional icons from Heroicons
import { PencilSquareIcon, ChatBubbleLeftRightIcon, LightBulbIcon, LanguageIcon } from '@heroicons/react/24/outline';

export default function PromptSelector() {
  const { prompts, currentLanguage } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();

  // UPDATED: Categories list without emojis for a cleaner look
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
    router.push(`/contribute/${prompt.id}`);
  };

  // UPDATED: "No language selected" empty state to match the new theme
  if (!currentLanguage) {
    return (
      <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-lg">
        <LanguageIcon className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-lg font-semibold text-slate-800">Please Select a Language</h3>
        <p className="mt-1 text-sm text-slate-600">Choose a language from the dropdown in the navigation bar to see available prompts.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* UPDATED: Header with professional icon and typography */}
      <div className="text-center mb-8">
        <PencilSquareIcon className="mx-auto h-12 w-12 text-indigo-600 bg-indigo-100 p-2 rounded-lg mb-4" />
        <h2 className="text-3xl font-bold text-slate-800">Choose a Prompt</h2>
        <p className="text-slate-600 mt-2">
          Select a topic to contribute data in {currentLanguage.nativeName} ({currentLanguage.name}).
        </p>
      </div>

      {/* UPDATED: Category filter with modern "pill" styling */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* UPDATED: Prompts grid with modern card styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt: Prompt) => (
          <div
            key={prompt.id}
            className="bg-white border border-slate-200 rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1"
            onClick={() => handlePromptSelect(prompt)}
          >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        {prompt.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                        {prompt.description}
                    </p>
                </div>
            </div>

            {prompt.examples && prompt.examples.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                  <LightBulbIcon className="w-4 h-4" />
                  Examples
                </p>
                <ul className="text-sm text-slate-600 space-y-1.5 pl-1">
                  {prompt.examples.slice(0, 2).map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-500 mr-2 mt-1 flex-shrink-0">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                prompt.category === 'daily' ? 'bg-green-100 text-green-800' :
                prompt.category === 'family' ? 'bg-purple-100 text-purple-800' :
                prompt.category === 'food' ? 'bg-orange-100 text-orange-800' :
                prompt.category === 'culture' ? 'bg-red-100 text-red-800' :
                prompt.category === 'travel' ? 'bg-sky-100 text-sky-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {categories.find(c => c.id === prompt.category)?.name || prompt.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* UPDATED: "No prompts found" empty state */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p>No prompts found for the selected category.</p>
        </div>
      )}
    </div>
  );
}
