'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Navigation from './components/Navigation';
import PromptSelector from './components/PromptSelector';
import DataContribution from './components/DataContribution';
import ContributionsDashboard from './components/ContributionsDashboard';

export default function Home() {
  const { currentLanguage, currentPrompt, setCurrentPrompt } = useAppStore();
  const [currentTab, setCurrentTab] = useState('prompt');
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-redirect to contribution when prompt is selected
  useEffect(() => {
    if (currentPrompt && currentTab === 'prompt') {
      setCurrentTab('contribute');
    }
  }, [currentPrompt, currentTab]);

  const handleBackToPrompts = () => {
    setCurrentPrompt(null); // Clear the current prompt
    setCurrentTab('prompt');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-white border-b border-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-64 bg-white rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'prompt':
        return <PromptSelector />;
      case 'contribute':
        return currentLanguage && currentPrompt ? (
          <DataContribution 
            prompt={currentPrompt}
            onBack={handleBackToPrompts}
            onComplete={() => {
              // Show success message and redirect to dashboard
              setCurrentTab('dashboard');
            }}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Please select a prompt first.</p>
          </div>
        );
      case 'dashboard':
        return <ContributionsDashboard />;
      default:
        return <PromptSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentLanguage ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Nativya
            </h2>
            <p className="text-gray-600 mb-8">
              Please select a language from the navigation bar to get started with contributing data.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Use the language dropdown in the top-right corner to select your preferred language.
              </p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nativya - Regional Language Data Collection
            </h3>
            <p className="text-gray-600 mb-4">
              Contributing to the preservation and development of Indian languages through community-driven data collection.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>Supporting 12+ Indian Languages</span>
              <span>•</span>
              <span>Text & Audio Contributions</span>
              <span>•</span>
              <span>Privacy-First Approach</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
