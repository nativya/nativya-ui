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
      router.push("/home");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center border border-blue-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">
          Welcome to Regional DataDAO 🚀
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          <span className="font-semibold text-blue-600">Contribute your voice, stories, and knowledge</span> in your regional language to help build the next generation of AI. <br className="hidden sm:block" />
          <span className="font-semibold">Your data is the fuel</span> that powers smarter, more inclusive technology for everyone.
        </p>
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-2">
            Earn rewards for your contributions
          </span>
          <p className="text-gray-600 text-base">
            Join the DataDAO community, contribute text and audio data, and get rewarded for helping preserve and advance regional languages in the AI revolution.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <LoginButton />
          <a
            href="https://datadao.ai" target="_blank" rel="noopener noreferrer"
            className="bg-white border border-blue-600 text-blue-700 font-semibold px-6 py-3 rounded-lg transition-colors text-lg hover:bg-blue-50 shadow"
          >
            Learn More
          </a>
        </div>
        <div className="mt-8 text-xs text-gray-400">
          Be a part of the AI revolution. Your data matters.
        </div>
      </div>
    </div>
  );
}
