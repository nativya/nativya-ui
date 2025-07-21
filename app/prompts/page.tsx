// Prompts Dashboard - A More Beautiful & User-Friendly Redesign with Detailed Cards
// File: app/prompts/page.tsx
// Description: A refined version that makes the "More Prompts" cards larger and restores detailed information like examples.

"use client";

import { useEffect, useState, FC } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { Prompt } from "../types";
import AppLayout from "../components/layout/AppLayout";
import {
  BookOpenText,
  MessageSquare,
  Users,
  Utensils,
  Palette,
  Plane,
  Languages,
  Search,
  ArrowRight,
  Sparkles,
  Lightbulb,
} from "lucide-react";

// --- Animated Loading State ---
const LoadingState: FC = () => (
  <div className="flex flex-col justify-center items-center py-24 gap-4">
    <motion.div
      className="w-16 h-16"
      animate={{
        scale: [1, 1.2, 1, 1.2, 1],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <Sparkles className="w-16 h-16 text-blue-500" />
    </motion.div>
    <p className="text-slate-600 font-medium text-lg">
      Preparing Your Dashboard...
    </p>
  </div>
);

// --- Empty State for No Language Selected ---
const NoLanguageState: FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="text-center py-20 px-6 max-w-2xl mx-auto"
  >
    <div className="relative inline-block">
      <div className="absolute -inset-2 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full blur-lg opacity-50"></div>
      <Languages
        className="relative mx-auto h-20 w-20 text-blue-500 mb-6 bg-white p-4 rounded-full shadow-sm"
        strokeWidth={1.5}
      />
    </div>
    <h3 className="text-2xl font-bold text-slate-800">
      Please Select a Language
    </h3>
    <p className="mt-3 text-lg text-slate-600">
      Choose a language from the top right to unlock your personalized
      contribution dashboard.
    </p>
  </motion.div>
);

// --- Category Icon Map ---
const categoryMap = {
  daily: { name: "Daily Life", color: "green", icon: MessageSquare },
  family: { name: "Family", color: "purple", icon: Users },
  food: { name: "Cuisine", color: "orange", icon: Utensils },
  culture: { name: "Culture", color: "red", icon: Palette },
  travel: { name: "Travel", color: "sky", icon: Plane },
};

// --- Featured Prompt Card ---
const FeaturedPromptCard: FC<{
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
}> = ({ prompt, onSelect }) => {
  const categoryInfo = categoryMap[
    prompt.category as keyof typeof categoryMap
  ] || { name: prompt.category, color: "slate", icon: MessageSquare };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative col-span-1 md:col-span-2 rounded-3xl p-8 cursor-pointer overflow-hidden group bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/30"
      onClick={() => onSelect(prompt)}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 text-white/10">
        <categoryInfo.icon className="w-full h-full" strokeWidth={1} />
      </div>
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-300" />
          <span className="font-semibold text-lg">Prompt of the Day</span>
        </div>
        <h3 className="text-3xl font-bold mb-3">{prompt.title}</h3>
        <p className="text-blue-100 text-lg max-w-xl mb-8">
          {prompt.description}
        </p>
        <div className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-lg font-bold rounded-full text-blue-600 bg-white transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg">
          Start Contributing <ArrowRight className="ml-3 h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Standard Prompt Card (Larger & More Detailed) ---
const PromptCard: FC<{
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
}> = ({ prompt, onSelect }) => {
  const categoryInfo = categoryMap[
    prompt.category as keyof typeof categoryMap
  ] || { name: prompt.category, color: "slate", icon: MessageSquare };

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:bg-white"
      onClick={() => onSelect(prompt)}
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-br from-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      <div className="relative z-10 flex flex-col h-full">
        {/* Main Content */}
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-${categoryInfo.color}-100`}
          >
            <categoryInfo.icon
              className={`w-6 h-6 text-${categoryInfo.color}-600`}
              strokeWidth={2}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{prompt.title}</h3>
            <p className="text-slate-600 text-sm mt-1">{prompt.description}</p>
          </div>
        </div>

        {/* Examples Section */}
        {prompt.examples && prompt.examples.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200/80">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              For example, you could talk about...
            </p>
            <ul className="text-sm text-slate-600 space-y-1.5 pl-1">
              {prompt.examples.slice(0, 2).map((example, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1 flex-shrink-0">
                    •
                  </span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer with Category and Action Arrow */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex justify-between items-center">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}
          >
            {categoryInfo.name}
          </span>
          <ArrowRight className="w-5 h-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-500" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Prompt Selector Component ---
const PromptSelector: FC = () => {
  const { prompts, currentLanguage } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  const categories = [
    { id: "all", name: "All", icon: BookOpenText },
    { id: "daily", name: "Daily", icon: MessageSquare },
    { id: "family", name: "Family", icon: Users },
    { id: "food", name: "Cuisine", icon: Utensils },
    { id: "culture", name: "Culture", icon: Palette },
    { id: "travel", name: "Travel", icon: Plane },
  ];

  const handlePromptSelect = (prompt: Prompt) =>
    router.push(`/contribute/${prompt.id}`);

  if (!currentLanguage) return <NoLanguageState />;

  const featuredPrompt = prompts[0];
  const otherPrompts = prompts
    .slice(1)
    .filter(
      (p) => selectedCategory === "all" || p.category === selectedCategory
    );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Welcome Back!
        </h1>
        <p className="text-xl text-slate-500 mt-2">
          Let's build a more inclusive AI for{" "}
          <span className="font-semibold text-blue-600">
            {currentLanguage.nativeName}
          </span>
          .
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {featuredPrompt && (
          <FeaturedPromptCard
            prompt={featuredPrompt}
            onSelect={handlePromptSelect}
          />
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">More Prompts</h2>
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
          <LayoutGroup id="category-filter-v4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300 focus:outline-none flex items-center justify-center gap-2 ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="active-pill-v4"
                    className="absolute inset-0 bg-blue-500 rounded-lg z-0 shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <category.icon className="w-5 h-5" /> {category.name}
                </span>
              </motion.button>
            ))}
          </LayoutGroup>
        </div>
      </div>

      <motion.div
        layout
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-1 gap-6" // Changed to 1 column for larger cards
      >
        <AnimatePresence>
          {otherPrompts.length > 0 ? (
            otherPrompts.map((prompt: Prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onSelect={handlePromptSelect}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-slate-500 md:col-span-1 flex flex-col items-center gap-4"
            >
              <Search className="w-12 h-12 text-slate-400" />
              <p className="font-medium text-lg">
                No other prompts found for this category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- Main Page Wrapper ---
export default function PromptsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { currentPrompt } = useAppStore();

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isClient && status === "unauthenticated") router.push("/");
  }, [status, router, isClient]);
  useEffect(() => {
    if (currentPrompt) router.push(`/contribute/${currentPrompt.id}`);
  }, [currentPrompt, router]);

  if (status === "loading" || !isClient) {
    return (
      <AppLayout>
        <LoadingState />
      </AppLayout>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <AppLayout>
      <div className="py-8 sm:py-12 px-4 bg-slate-50 min-h-screen">
        <PromptSelector />
      </div>
    </AppLayout>
  );
}
