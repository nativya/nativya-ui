'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../store/useAppStore';
import PromptSelector from '../components/PromptSelector';
import AppLayout from '../components/layout/AppLayout';

export default function PromptsPage() {
  const {  status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { currentLanguage, currentPrompt } = useAppStore();

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Auto-redirect to contribution when prompt is selected
  useEffect(() => {
    if (currentPrompt) {
      router.push(`/contribute/${currentPrompt.id}`);
    }
  }, [currentPrompt, router]);

  // Show loading while checking authentication status
  if (status === 'loading' || !isClient) {
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

  // Don't render if not authenticated (they'll be redirected)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <AppLayout currentTab="prompt">
      {!currentLanguage ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-4">🌍</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Welcome to Nativya
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Please select a language from the navigation bar to get started with contributing data.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-blue-800">
              💡 <strong>Tip:</strong> Use the language dropdown in the top-right corner to select your preferred language.
            </p>
          </div>
        </div>
      ) : (
        <PromptSelector />
      )}
    </AppLayout>
  );
} 