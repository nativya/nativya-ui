import React from 'react';
import { Language } from '../../types';

interface LanguageDropdownProps {
  currentLanguage: Language | null;
  availableLanguages: Language[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (language: Language) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function LanguageDropdown({
  currentLanguage,
  availableLanguages,
  isOpen,
  onToggle,
  onSelect,
  searchTerm,
  setSearchTerm,
}: LanguageDropdownProps) {
  const filteredLanguages = availableLanguages.filter((lang: Language) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 bg-white/70 backdrop-blur-md border border-blue-200 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors shadow"
      >
        <span className="text-lg">
          {currentLanguage ? currentLanguage.flag : '🌍'}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage ? currentLanguage.nativeName : 'Select Language'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white/90 border border-blue-200 rounded-lg shadow-lg z-50 backdrop-blur-md">
          <div className="p-3 border-b border-blue-100">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language: Language) => (
                <button
                  key={language.code}
                  onClick={() => onSelect(language)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                    currentLanguage?.code === language.code ? 'bg-blue-100' : ''
                  }`}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {language.nativeName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language.name}
                    </div>
                  </div>
                  {currentLanguage?.code === language.code && (
                    <svg className="w-5 h-5 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                No languages found matching &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 