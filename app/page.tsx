"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "./components/login/LoginButton";
// NEW: Importing professional icons
import { ArrowRightIcon, BanknotesIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// NEW: A modern SVG spinner component for the loading state
const Spinner = () => (
    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function Introduction() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/prompts");
    }
  }, [session, status, router]);

  // UPDATED: Loading state to be consistent with the new theme
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  // Don't render the intro page if user is authenticated (they'll be redirected)
  if (status === "authenticated") {
    return null;
  }

  return (
    // UPDATED: Main container with the light theme background
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-3xl w-full mx-auto text-center">
          <GlobeAltIcon className="mx-auto h-16 w-16 text-indigo-600 bg-indigo-100 p-3 rounded-full mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
            Welcome to Regional DataDAO
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            <span className="font-semibold text-indigo-600">Contribute your voice, stories, and knowledge</span> in your regional language to help build the next generation of AI. Your data powers smarter, more inclusive technology for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <LoginButton />
            <a
              href="https://datadao.ai" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-lg transition-colors text-base hover:bg-slate-50 shadow-sm"
            >
              Learn More
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-green-100 rounded-full mb-4">
                <BanknotesIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-semibold text-lg text-slate-800">Earn Rewards</h2>
            <p className="text-slate-600 mt-1">Get rewarded for contributing data that helps preserve and advance regional languages in the AI revolution.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-sky-100 rounded-full mb-4">
                <GlobeAltIcon className="h-8 w-8 text-sky-600" />
            </div>
            <h2 className="font-semibold text-lg text-slate-800">Preserve Languages</h2>
            <p className="text-slate-600 mt-1">Your voice and stories help build smarter, more inclusive technology for everyone, everywhere.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="font-semibold text-lg text-slate-800">Join the Community</h2>
            <p className="text-slate-600 mt-1">Be part of a vibrant community shaping the future of AI and language technology.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Regional DataDAO. All rights reserved.
      </footer>
    </main>
  );
}
