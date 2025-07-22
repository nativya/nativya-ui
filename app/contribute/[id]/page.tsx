'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';
import DataContribution from '../../contribution/DataContribution';
import AppLayout from '../../components/layout/AppLayout';
import { Prompt } from '../../types';
import BackButton from '@/app/contribution/ui/BackButton';

// NEW: A modern SVG spinner component for the loading state
const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


interface ContributePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ContributePage({ params }: ContributePageProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { currentLanguage, prompts, setCurrentPrompt } = useAppStore();
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  const unwrappedParams = use(params) as { id: string };
  const promptId = unwrappedParams.id;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (prompts.length > 0 && promptId) {
      const foundPrompt = prompts.find((p: Prompt) => p.id === promptId);
      if (foundPrompt) {
        setPrompt(foundPrompt);
        setCurrentPrompt(foundPrompt);
      } else {
        router.push('/prompts');
      }
    }
  }, [prompts, promptId, setCurrentPrompt, router]);

  useEffect(() => {
    if (isClient && !currentLanguage) {
      router.push('/prompts');
    }
  }, [currentLanguage, isClient, router]);

  // UPDATED: Loading state to be consistent with the new theme
  if (status === 'loading' || !isClient || !prompt) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      </AppLayout>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleBackToPrompts = () => {
    setCurrentPrompt(null);
    router.push('/prompts');
  };

  return (
    // The AppLayout provides the base theme.
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <BackButton onBack={handleBackToPrompts} />
        <DataContribution prompt={prompt} />
      </div>
    </AppLayout>
  );
}
