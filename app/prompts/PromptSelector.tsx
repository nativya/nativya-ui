// Prompts Page - Redesigned
// File: app/prompts/page.tsx (or your relevant route)
// Description: A complete, redesigned, and animated prompt selection page.

"use client";

import { useEffect, useState, FC, ReactNode } from "react";
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
} from "lucide-react";

// --- Animated Loading State ---
const LoadingState: FC = () => (
  <div className="flex flex-col justify-center items-center py-20 gap-4">
    <motion.div
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        border: "4px solid #3B82F6",
        borderTopColor: "transparent",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <p className="text-slate-600 font-medium">Loading Prompts...</p>
  </div>
);

// --- Empty State for No Language Selected ---
const NoLanguageState: FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20 px-6 bg-white/50 border border-slate-200 rounded-2xl shadow-sm"
  >
    <Languages
      className="mx-auto h-16 w-16 text-blue-400 mb-4"
      strokeWidth={1.5}
    />
    <h3 className="text-xl font-bold text-slate-800">
      Please Select a Language
    </h3>
    <p className="mt-2 text-slate-600 max-w-md mx-auto">
      Choose a language from the dropdown in the navigation bar to see available
      prompts.
    </p>
  </motion.div>
);

// --- Prompt Card Component ---
const PromptCard: FC<{
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
}> = ({ prompt, onSelect }) => {
  const categoryMap = {
    daily: { name: "Daily Life", color: "green", icon: MessageSquare },
    family: { name: "Family", color: "purple", icon: Users },
    food: { name: "Cuisine", color: "orange", icon: Utensils },
    culture: { name: "Culture", color: "red", icon: Palette },
    travel: { name: "Travel", color: "sky", icon: Plane },
  };
  const categoryInfo = categoryMap[
    prompt.category as keyof typeof categoryMap
  ] || { name: prompt.category, color: "slate", icon: MessageSquare };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="group relative bg-white/70 backdrop-blur-lg border border-slate-200/80 rounded-xl p-6 cursor-pointer transition-shadow duration-300 hover:shadow-xl"
      onClick={() => onSelect(prompt)}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <categoryInfo.icon
            className="w-7 h-7 text-blue-500"
            strokeWidth={1.5}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{prompt.title}</h3>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            {prompt.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}
        >
          {categoryInfo.name}
        </span>
        <ArrowRight className="w-5 h-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-500" />
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
    { id: "all", name: "All Prompts" },
    { id: "daily", name: "Daily Life" },
    { id: "family", name: "Family" },
    { id: "food", name: "Cuisine" },
    { id: "culture", name: "Culture" },
    { id: "travel", name: "Travel" },
  ];

  const filteredPrompts =
    selectedCategory === "all"
      ? prompts
      : prompts.filter(
          (prompt: Prompt) => prompt.category === selectedCategory
        );

  const handlePromptSelect = (prompt: Prompt) => {
    router.push(`/contribute/${prompt.id}`);
  };

  if (!currentLanguage) {
    return <NoLanguageState />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <div className="inline-block p-3 bg-blue-500/10 rounded-xl mb-4">
          <BookOpenText
            className="mx-auto h-10 w-10 text-blue-500"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Choose a Prompt
        </h2>
        <p className="text-slate-600 mt-2 text-lg">
          Select a topic to contribute data in{" "}
          <span className="font-semibold text-blue-600">
            {currentLanguage.nativeName}
          </span>
          .
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        <LayoutGroup id="category-filter">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                selectedCategory === category.id
                  ? "text-white"
                  : "text-slate-700 hover:text-blue-600"
              }`}
            >
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-blue-500 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category.name}</span>
            </motion.button>
          ))}
        </LayoutGroup>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <AnimatePresence>
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt: Prompt) => (
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
              className="text-center py-16 text-slate-500 md:col-span-2 flex flex-col items-center gap-4"
            >
              <Search className="w-12 h-12 text-slate-400" />
              <p className="font-medium">No prompts found for this category.</p>
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
    if (isClient && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, isClient]);

  useEffect(() => {
    if (currentPrompt) {
      router.push(`/contribute/${currentPrompt.id}`);
    }
  }, [currentPrompt, router]);

  if (status === "loading" || !isClient) {
    return (
      <AppLayout>
        <LoadingState />
      </AppLayout>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirect is happening
  }

  return (
    <AppLayout>
      <div className="py-8">
        <PromptSelector />
      </div>
    </AppLayout>
  );
}
