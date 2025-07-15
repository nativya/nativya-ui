"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "./components/login/LoginButton";

export default function Introduction() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/prompts");
    }
  }, [session, status, router]);

  // Show loading while checking authentication status
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center border border-blue-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the intro page if user is authenticated (they'll be redirected)
  if (status === "authenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4">
        <div className="absolute left-8 top-8 flex flex-col gap-4 z-0">
          <span className="text-5xl float-emoji">🌍</span>
          <span className="text-4xl float-emoji" style={{ animationDelay: '1s' }}>🗣️</span>
          <span className="text-4xl float-emoji" style={{ animationDelay: '2s' }}>💡</span>
        </div>
        <div className="glass outline-thick max-w-3xl w-full mx-auto p-12 text-center z-10 shadow-xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4 flex items-center justify-center gap-2">
            <span>Welcome to Regional DataDAO</span> <span className="text-4xl">🚀</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6">
            <span className="font-semibold text-blue-600">Contribute your voice, stories, and knowledge</span> in your regional language to help build the next generation of AI.<br className="hidden sm:block" />
            <span className="font-semibold">Your data is the fuel</span> that powers smarter, more inclusive technology for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <LoginButton />
            <a
              href="https://datadao.ai" target="_blank" rel="noopener noreferrer"
              className="bg-white border-2 border-blue-600 text-blue-700 font-semibold px-6 py-3 rounded-lg transition-colors text-lg hover:bg-blue-50 shadow outline-thick"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="bg-white outline-thick glass p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl">
          <span className="text-4xl mb-2">💰</span>
          <h2 className="font-bold text-xl mb-2 text-blue-700">Earn Rewards</h2>
          <p className="text-gray-700">Contribute data and get rewarded for helping preserve and advance regional languages in the AI revolution.</p>
        </div>
        <div className="bg-white outline-thick glass p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl">
          <span className="text-4xl mb-2">🌍</span>
          <h2 className="font-bold text-xl mb-2 text-blue-700">Preserve Languages</h2>
          <p className="text-gray-700">Your voice and stories help build smarter, more inclusive technology for everyone, everywhere.</p>
        </div>
        <div className="bg-white outline-thick glass p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl">
          <span className="text-4xl mb-2">🤝</span>
          <h2 className="font-bold text-xl mb-2 text-blue-700">Join the Community</h2>
          <p className="text-gray-700">Be part of a vibrant community shaping the future of AI and language technology.</p>
        </div>
      </section>

      {/* Rewards/Community Callout */}
      <section className="max-w-3xl mx-auto mb-16 px-4">
        <div className="glass outline-thick p-8 flex flex-col items-center text-center shadow-xl">
          <span className="text-3xl mb-2">🎉</span>
          <h2 className="font-bold text-2xl mb-2 text-blue-700">Get Started & Earn!</h2>
          <p className="text-gray-700 mb-4">Join DataDAO, contribute text and audio data, and get rewarded for helping preserve and advance regional languages in the AI revolution.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-400 border-t border-blue-100 bg-white/80">
        <span className="inline-block mr-2">© {new Date().getFullYear()} Regional DataDAO</span>
        <span className="inline-block">| Be a part of the AI revolution. Your data matters. 🚀</span>
      </footer>
    </main>
  );
}
