'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Language } from '../../types';
import { useSession } from "next-auth/react";
import { LogoutButton } from "../login/LogoutButton";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
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
  const pathname = usePathname();
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
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      // Use Next.js routing if no onTabChange provided
      if (tabId === 'prompt') {
        window.location.href = '/prompts';
      } else if (tabId === 'dashboard') {
        window.location.href = '/dashboard';
      }
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close language dropdown when toggling mobile menu
    if (isLanguageDropdownOpen) {
      setIsLanguageDropdownOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-blue-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/Nativya_logo.jpg" 
              alt="Nativya Logo" 
              className="h-8 w-auto object-contain rounded-lg border-2 border-blue-200 group-hover:scale-105 transition-transform"
              width={32}
              height={32}
            />
            <span className="text-xl font-extrabold text-blue-700 flex items-center gap-1">
              Nativya <span className="text-2xl">🌐</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {tabs.map((tab) => {
              const isActive = currentTab ? currentTab === tab.id : 
                (tab.id === 'prompt' && pathname.startsWith('/prompts')) ||
                (tab.id === 'dashboard' && pathname.startsWith('/dashboard')) ||
                (tab.id === 'prompt' && pathname.startsWith('/contribute'));
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center px-3 py-2 rounded-lg font-semibold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow border-2 border-blue-500'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 border-2 border-transparent'
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
              );
            })}
          </div>

          {/* Desktop Language Dropdown + Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 bg-white/70 backdrop-blur-md border border-blue-200 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors shadow"
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
                          onClick={() => handleLanguageSelect(language)}
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
            {/* Logout Button */}
            {session && <LogoutButton />}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-blue-200 shadow-lg rounded-b-xl mt-2 p-4 flex flex-col gap-4 animate-fade-in-down">
            {tabs.map((tab) => {
              const isActive = currentTab ? currentTab === tab.id : 
                (tab.id === 'prompt' && pathname.startsWith('/prompts')) ||
                (tab.id === 'dashboard' && pathname.startsWith('/dashboard')) ||
                (tab.id === 'prompt' && pathname.startsWith('/contribute'));
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg font-semibold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow border-2 border-blue-500'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 border-2 border-transparent'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
            {/* Language Dropdown */}
            <div className="relative mt-2">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 bg-white/70 backdrop-blur-md border border-blue-200 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors shadow"
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
              {/* Dropdown Menu */}
              {isLanguageDropdownOpen && (
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
                          onClick={() => handleLanguageSelect(language)}
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
            {/* Logout Button */}
            {session && <LogoutButton />}
          </div>
        )}
      </div>
    </nav>
  );
} 