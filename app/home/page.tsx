'use client';

import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Link from 'next/link';
import { useAppStore } from '../store/useAppStore';

const tasks = [
  {
    id: 'prompts',
    title: 'Answer Prompts',
    description: 'Answer simple language prompts to earn rewards.',
    emoji: '💬',
    href: '/prompts',
    cta: 'Start Task',
  },
  {
    id: 'translate',
    title: 'Translate a Sentence',
    description: 'Translate this English sentence into Marathi.',
    emoji: '🌐',
    href: '/translate',
    cta: 'Start Task',
  },
  {
    id: 'describe-image',
    title: 'Describe an Image',
    description: 'Describe this image in Bengali.',
    emoji: '🖼️',
    href: '/describe-image',
    cta: 'Start Task',
  },
  {
    id: 'read-aloud',
    title: 'Read Aloud',
    description: 'Read this paragraph aloud in Punjabi.',
    emoji: '🎤',
    href: '/read-aloud',
    cta: 'Start Task',
  },
  {
    id: 'grammar-correct',
    title: 'Correct Grammar',
    description: 'Correct the grammar in this Hindi sentence.',
    emoji: '✍️',
    href: '/grammar-correct',
    cta: 'Start Task',
  },
];

export default function HomeTasksPage() {
  const { currentLanguage } = useAppStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <AppLayout>
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
        <section className="w-full max-w-3xl mx-auto mt-10 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
            🚀 Contribute & Earn
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Choose a task below to help build better AI for your language. Complete tasks, earn rewards, and level up!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tasks.map((task) => {
              const isPrompts = task.id === 'prompts';
              return (
                <div key={task.id} className="glassmorphic rounded-2xl p-6 flex flex-col gap-3 border-2 border-blue-100 shadow-lg">
                  <div className="text-4xl mb-2">{task.emoji}</div>
                  <div className="font-bold text-xl text-blue-800 mb-1">{task.title}</div>
                  <div className="text-gray-600 mb-2">{task.description}</div>
                  {isPrompts ? (
                    <Link
                      href={task.href}
                      className="mt-auto px-4 py-2 rounded-lg font-bold transition text-center bg-blue-600 text-white hover:bg-blue-700"
                      tabIndex={0}
                    >
                      {task.cta}
                    </Link>
                  ) : (
                    <span
                      className="mt-auto px-4 py-2 rounded-lg font-bold transition text-center bg-gray-300 text-gray-500 cursor-not-allowed select-none"
                      aria-disabled="true"
                    >
                      {task.cta}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </AppLayout>
  );
}
