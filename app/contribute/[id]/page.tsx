'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';
import DataContribution from '../../contribution/DataContribution';
import AppLayout from '../../components/layout/AppLayout';
import { Prompt } from '../../types';
import { use } from 'react';
import BackButton from '@/app/contribution/ui/BackButton';

interface ContributePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ContributePage({ params }: ContributePageProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { currentLanguage, prompts, setCurrentPrompt } = useAppStore();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  
  // Unwrap params using React.use() for Next.js 15 compatibility
  const unwrappedParams = use(params) as { id: string };
  const promptId = unwrappedParams.id;

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

  // Find the prompt by ID
  useEffect(() => {
    if (prompts.length > 0 && promptId) {
      const foundPrompt = prompts.find((p: Prompt) => p.id === promptId);
      if (foundPrompt) {
        setPrompt(foundPrompt);
        setCurrentPrompt(foundPrompt);
      } else {
        // Prompt not found, redirect to prompts page
        router.push('/prompts');
      }
    }
  }, [prompts, promptId, setCurrentPrompt, router]);

  // Redirect to prompts if no language selected
  useEffect(() => {
    if (isClient && !currentLanguage) {
      router.push('/prompts');
    }
  }, [currentLanguage, isClient, router]);

  // Show loading while checking authentication status or finding prompt
  if (status === 'loading' || !isClient || !prompt) {
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

  const handleBackToPrompts = () => {
    console.log('Back to prompts clicked');
    setCurrentPrompt(null); // Clear the current prompt
    router.push('/prompts');
  };

  return (
    <AppLayout currentTab="prompt">
    <BackButton onBack={handleBackToPrompts}/>
      <DataContribution
        prompt={prompt}
        // onBack={handleBackToPrompts}
      />
    </AppLayout>
  );
} 