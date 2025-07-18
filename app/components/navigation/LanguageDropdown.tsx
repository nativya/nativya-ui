import React from 'react';
import { Language } from '../../types';
// NEW: Using solid icons for a clearer UI
import { ChevronDownIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/20/solid';
import { useIsClient } from '@/app/contribution/hooks/useIsClient';

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
  const isClient = useIsClient();

  const filteredLanguages = availableLanguages.filter((lang: Language) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        // UPDATED: Button styling for light theme - clean and simple
        className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-md transition-colors shadow-sm text-slate-700"
      >
        <span className="text-lg">
          {isClient && currentLanguage ? currentLanguage.flag : '🌍'}
        </span>
        <span className="text-sm font-medium">
          {isClient && currentLanguage ? currentLanguage.nativeName : 'Language'}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        // UPDATED: Dropdown panel for light theme with a soft shadow
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-50 animate-fade-in-down">
          {/* UPDATED: Search input for light theme */}
          <div className="p-2 border-b border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language: Language) => (
                <button
                  key={language.code}
                  onClick={() => onSelect(language)}
                  // UPDATED: Item styling with clear hover/active states
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    currentLanguage?.code === language.code
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div>
                    <div className="font-medium text-slate-800">{language.nativeName}</div>
                    <div className="text-sm text-slate-500">{language.name}</div>
                  </div>
                  {currentLanguage?.code === language.code && (
                    <CheckIcon className="w-5 h-5 text-indigo-600 ml-auto" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500">
                No languages found...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
