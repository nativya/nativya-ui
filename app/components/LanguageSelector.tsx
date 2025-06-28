'use client';

import { useState } from 'react';
import { Language } from '../types';
import { useAppStore } from '../store/useAppStore';

interface LanguageSelectorProps {
  onLanguageSelect?: (language: Language) => void;
}

export default function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const { availableLanguages, currentLanguage, setLanguage } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = availableLanguages.filter((lang: Language) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    onLanguageSelect?.(language);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Nativya
        </h1>
        <p className="text-gray-600 mb-8">
          Please select your preferred language to start contributing data.
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLanguages.map((language: Language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageSelect(language)}
            className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
              currentLanguage?.code === language.code
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{language.flag}</span>
              <div>
                <div className="font-semibold text-gray-900">
                  {language.nativeName}
                </div>
                <div className="text-sm text-gray-500">
                  {language.name}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No languages found matching &quot;{searchTerm}&quot;
        </div>
      )}
    </div>
  );
} 