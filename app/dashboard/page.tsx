'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ContributionsDashboard from '../components/dashboard/ContributionsDashboard';
import AppLayout from '../components/layout/AppLayout';

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

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
    <AppLayout currentTab="dashboard">
      <ContributionsDashboard />
    </AppLayout>
  );
} 