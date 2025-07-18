'use client';

import { useState } from 'react';
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
// NEW: Using outline icons for a lighter feel
import { GlobeAltIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useIsClient } from '@/app/contribution/hooks/useIsClient';

export default function Navigation() {
  const { currentLanguage, availableLanguages, setLanguage } = useAppStore();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isClient = useIsClient();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Tabs with href property for better reusability
  const tabs: Tab[] = [
    { id: 'tasks', label: 'Home', icon: 'home', href: '/home' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' }
  ];

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setSearchTerm('');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isLanguageDropdownOpen) {
      setIsLanguageDropdownOpen(false);
    }
  };

  return (
    // UPDATED: Light theme with a subtle border and shadow.
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Branding */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/Nativya_logo.jpg"
              alt="Nativya Logo"
              className="h-8 w-8 object-contain rounded-md"
              width={32}
              height={32}
            />
            {/* UPDATED: Typography for light theme */}
            <span className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              Nativya
              <GlobeAltIcon className="w-6 h-6 text-indigo-600" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationTabs
              tabs={tabs}
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
            {session && <LogoutButton />}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              // UPDATED: Button styling for light theme
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          // UPDATED: Mobile menu styling for light theme
          <div className="md:hidden bg-white border-t border-slate-200 rounded-b-lg mt-2 p-4 flex flex-col gap-4 animate-fade-in-down shadow-lg">
            <NavigationTabs
              tabs={tabs}
              pathname={pathname}
              isClient={isClient}
              isMobile={true}
              onMobileClose={() => setIsMobileMenuOpen(false)}
            />
            <div className="border-t border-slate-200 my-2"></div>
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
            {session && <LogoutButton />}
          </div>
        )}
      </div>
    </nav>
  );
}
