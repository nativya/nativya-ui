"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginButton } from "./components/login/LoginButton";
import {
  ArrowRightIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Dark mode hook
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(saved ? JSON.parse(saved) : prefersDark);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDark = (value: boolean) => setIsDark(value);

  return { isDark, toggleDark };
};

const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Logo placeholder component
const Logo = ({ className = "h-8 w-8" }) => (
  <div
    className={`${className} bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm`}
  >
    DD
  </div>
);

const Navigation = ({
  isDark,
  toggleDark,
}: {
  isDark: boolean;
  toggleDark: (isDark: boolean) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Regional DataDAO
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </a>
            <a
              href="#community"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Community
            </a>
            <button
              onClick={() => toggleDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => toggleDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <a
                href="#community"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Community
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const AnimatedCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default function Introduction() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDark, toggleDark } = useDarkMode();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/prompts");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation isDark={isDark} toggleDark={toggleDark} />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <AnimatedCard>
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <ShieldCheckIcon className="h-4 w-4" />
              Trusted by 50,000+ contributors worldwide
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Preserve Languages,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Power AI
              </span>
            </h1>
          </AnimatedCard>

          <AnimatedCard delay={400}>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Join the world's largest decentralized network for regional
              language data collection. Contribute your voice, stories, and
              knowledge to build more inclusive AI while earning rewards.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <LoginButton />
              <a
                href="https://datadao.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-8 py-4 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 text-base shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Learn More
                <ArrowRightIcon className="w-5 h-5" />
              </a>
            </div>
          </AnimatedCard>

          {/* Stats */}
          <AnimatedCard delay={800}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  150+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Languages Supported
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  $2M+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Rewards Distributed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  50K+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Active Contributors
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-white dark:bg-gray-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Regional DataDAO?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're building the future of inclusive AI, and you're at the
              center of it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard delay={100}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-blue-600 p-3 rounded-xl w-fit mb-4">
                  <CurrencyDollarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Earn Real Rewards
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get compensated fairly for your contributions. Earn tokens,
                  NFTs, and cash rewards based on the quality and quantity of
                  your data submissions.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={200}>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-purple-600 p-3 rounded-xl w-fit mb-4">
                  <GlobeAltIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Preserve Heritage
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Help preserve your regional language and culture for future
                  generations while making AI more inclusive and representative.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={300}>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-2xl border border-green-200 dark:border-green-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-green-600 p-3 rounded-xl w-fit mb-4">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Global Community
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join a vibrant global community of linguists, researchers, and
                  technology enthusiasts working towards a common goal.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400}>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-orange-600 p-3 rounded-xl w-fit mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Data Security
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your data is protected with enterprise-grade security. Full
                  transparency on how your contributions are used and stored.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={500}>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-8 rounded-2xl border border-cyan-200 dark:border-cyan-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-cyan-600 p-3 rounded-xl w-fit mb-4">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Track Impact
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Monitor your contribution's impact in real-time. See how your
                  data helps improve AI models and language understanding.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600}>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-8 rounded-2xl border border-pink-200 dark:border-pink-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-pink-600 p-3 rounded-xl w-fit mb-4">
                  <GlobeAltIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Easy Participation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Simple, intuitive interface makes contributing easy. No
                  technical knowledge required - just your voice and stories.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <AnimatedCard>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of contributors who are shaping the future of AI
              while preserving their cultural heritage.
            </p>
            <LoginButton />
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo className="h-10 w-10" />
                <span className="font-bold text-xl text-white">
                  Regional DataDAO
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Democratizing AI development through community-driven regional
                language data collection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rewards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Languages
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 mt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Regional DataDAO. All rights
              reserved. Building the future of inclusive AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
