'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../components/layout/AppLayout';
import Link from 'next/link';

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
    href: '#', // Placeholder for future route/modal
    cta: 'Start Task',
  },
  {
    id: 'describe-image',
    title: 'Describe an Image',
    description: 'Describe this image in Bengali.',
    emoji: '🖼️',
    href: '#', // Placeholder for future route/modal
    cta: 'Start Task',
  },
  {
    id: 'read-aloud',
    title: 'Read Aloud',
    description: 'Read this paragraph aloud in Punjabi.',
    emoji: '🎤',
    href: '#', // Placeholder for future route/modal
    cta: 'Start Task',
  },
  {
    id: 'grammar-correct',
    title: 'Correct Grammar',
    description: 'Correct the grammar in this Hindi sentence.',
    emoji: '✍️',
    href: '#', // Placeholder for future route/modal
    cta: 'Start Task',
  },
];

export default function HomeTasksPage() {
  return (
    <AppLayout currentTab="tasks">
      <section className="w-full max-w-3xl mx-auto mt-10 mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
          🚀 Contribute & Earn
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Choose a task below to help build better AI for your language. Complete tasks, earn rewards, and level up!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="glassmorphic rounded-2xl p-6 flex flex-col gap-3 border-2 border-blue-100 shadow-lg">
              <div className="text-4xl mb-2">{task.emoji}</div>
              <div className="font-bold text-xl text-blue-800 mb-1">{task.title}</div>
              <div className="text-gray-600 mb-2">{task.description}</div>
              <Link
                href={task.href}
                className={`mt-auto px-4 py-2 rounded-lg font-bold text-white transition text-center ${task.href === '/prompts' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                tabIndex={task.href === '/prompts' ? 0 : -1}
                aria-disabled={task.href !== '/prompts'}
              >
                {task.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
