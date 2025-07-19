'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../store/useAppStore';
import PromptSelector from './PromptSelector';
import AppLayout from '../components/layout/AppLayout';

// NEW: A modern SVG spinner component for the loading state
const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function PromptsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { currentPrompt } = useAppStore();

  // Ensure client-side rendering
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

  // UPDATED: Loading state to be consistent with the new theme
  if (status === 'loading' || !isClient) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      </AppLayout>
    );
  }

  // Don't render if not authenticated (they'll be redirected)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    // The AppLayout provides the base theme.
    // The `currentTab` prop helps highlight the active tab in the navigation.
    <AppLayout>
      <PromptSelector />
    </AppLayout>
  );
}
