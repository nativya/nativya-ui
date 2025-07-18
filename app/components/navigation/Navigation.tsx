'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Language } from '../../types';
import { useSession } from "next-auth/react";
import { LogoutButton } from "../login/LogoutButton";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationTabs, Tab } from './NavigationTabs';
import { LanguageDropdown } from './LanguageDropdown';
import WalletConnector from '../../contribution/utils/WalletConnector';

interface NavigationProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navigation({ currentTab }: NavigationProps) {
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
    // { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'tasks', label: '📝 Home', icon: '🏠' },
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' }
  ];

  // const filteredLanguages = availableLanguages.filter((lang: Language) =>
  //   lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setSearchTerm('');
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
            <NavigationTabs
              tabs={tabs}
              currentTab={currentTab}
              pathname={pathname}
              isClient={isClient}
              isMobile={false}
            />
          </div>

          {/* Desktop Language Dropdown + Wallet + Logout */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageDropdown
              currentLanguage={currentLanguage}
              availableLanguages={availableLanguages}
              isOpen={isLanguageDropdownOpen}
              onToggle={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              onSelect={handleLanguageSelect}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <WalletConnector />
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
            <NavigationTabs
              tabs={tabs}
              currentTab={currentTab}
              pathname={pathname}
              isClient={isClient}
              isMobile={true}
              onMobileClose={() => setIsMobileMenuOpen(false)}
            />
            {/* Language Dropdown */}
            <LanguageDropdown
              currentLanguage={currentLanguage}
              availableLanguages={availableLanguages}
              isOpen={isLanguageDropdownOpen}
              onToggle={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              onSelect={handleLanguageSelect}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <WalletConnector />
            {/* Logout Button */}
            {session && <LogoutButton />}
          </div>
        )}
      </div>
    </nav>
  );
} 