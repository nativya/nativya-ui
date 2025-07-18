'use client';
import AppLayout from '../components/layout/AppLayout';

export default function TranslatePage() {
  return (
    <AppLayout currentTab="tasks">
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="text-6xl mb-4">🌐</div>
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Translate a Sentence</h1>
        <p className="text-lg text-gray-700 mb-8">This is the Translate a Sentence task. Coming soon!</p>
      </div>
    </AppLayout>
  );
} 