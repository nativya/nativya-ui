'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Language } from '../../types';
import { useSession } from "next-auth/react";
import { LogoutButton } from "../login/LogoutButton";
import Image from 'next/image';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

// Wherever you define your tab type, e.g.:
type Tab = {
  id: string;
  label: string;
  icon: string;
  badge?: number; // <-- add this line
};

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const { currentLanguage, availableLanguages, setLanguage } = useAppStore();
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const totalContributions = getTotalContributions();

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const tabs : Tab[] = [
    { id: 'prompt', label: '📝 Prompts', icon: '📝' },
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' }
  ];

  const filteredLanguages = availableLanguages.filter((lang: Language) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setSearchTerm('');
  };

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close language dropdown when toggling mobile menu
    if (isLanguageDropdownOpen) {
      setIsLanguageDropdownOpen(false);
    }
  };

  const toggleLanguageDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image 
                src="/Nativya_logo.jpg" 
                alt="Nativya Logo" 
                className="h-8 w-auto object-contain"
                width={32}
                height={32}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.badge && tab.badge > 0 && isClient && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Desktop Language Dropdown + Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="text-lg">
                  {currentLanguage ? currentLanguage.flag : '🌍'}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {currentLanguage ? currentLanguage.nativeName : 'Select Language'}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isLanguageDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((language: Language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageSelect(language)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            currentLanguage?.code === language.code ? 'bg-blue-50' : ''
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
            {session && <LogoutButton />}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile Navigation Tabs */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </div>
                  {tab.badge && tab.badge > 0 && isClient && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}

            {/* Mobile Language Selector */}
            <div className="px-3 py-2">
              <div className="text-sm font-medium text-gray-500 mb-2">Language</div>
              <button
                onClick={toggleLanguageDropdown}
                className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {currentLanguage ? currentLanguage.flag : '🌍'}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {currentLanguage ? currentLanguage.nativeName : 'Select Language'}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isLanguageDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mobile Language Dropdown */}
              {isLanguageDropdownOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((language: Language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageSelect(language)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            currentLanguage?.code === language.code ? 'bg-blue-50' : ''
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
            {session && (
              <div className="mt-4">
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close desktop language dropdown only */}
      {isLanguageDropdownOpen && (
        <div
          className="fixed inset-0 z-40 md:block hidden"
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </nav>
  );
} 