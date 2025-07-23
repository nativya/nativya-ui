"use client";

import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Link from "next/link";
import { useAppStore } from "../store/useAppStore";
import { motion } from "framer-motion";
import {
  MessagesSquare,
  Languages,
  Camera,
  MicVocal,
  SpellCheck,
  Target,
  ArrowRight,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { FC } from "react";

// --- Type Definitions ---
interface Task {
  id: string;
  title: string;
  description: string;
  icon: FC<LucideProps>;
  href: string;
  cta: string;
  disabled?: boolean;
}

// --- Task Configuration ---
const tasks: Task[] = [
  {
    id: "prompts",
    title: "Answer Prompts",
    description: "Answer simple language prompts to earn rewards.",
    icon: MessagesSquare,
    href: "/prompts",
    cta: "Start Task",
  },
  {
    id: "translate",
    title: "Translate Sentences",
    description: "Help translate sentences to expand our dataset.",
    icon: Languages,
    href: "/translate",
    cta: "Start Task",
    disabled: true,
  },
  {
    id: "describe-image",
    title: "Describe an Image",
    description: "Provide rich descriptions for images in your language.",
    icon: Camera,
    href: "/describe-image",
    cta: "Start Task",
    disabled: true,
  },
  {
    id: "read-aloud",
    title: "Read Aloud",
    description:
      "Record yourself reading paragraphs to help train voice models.",
    icon: MicVocal,
    href: "/read-aloud",
    cta: "Start Task",
    disabled: true,
  },
];

// --- Sub-Components for a Cleaner Structure ---

const WelcomePlaceholder: FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="text-center py-12 px-4 flex flex-col items-center"
  >
    <div className="relative flex justify-center items-center mb-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-40 h-40 border-2 border-dashed border-blue-200 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute w-56 h-56 border border-dashed border-slate-200 rounded-full"
      />
      <Languages className="w-20 h-20 text-blue-500" strokeWidth={1.5} />
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
      Welcome to Nativya
    </h2>
    <p className="text-slate-600 max-w-md mb-8">
      To begin contributing, please select your native language from the
      dropdown menu in the header.
    </p>
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-sm">
      <p className="text-sm text-blue-800">
        <span className="font-semibold">💡 Tip:</span> Selecting a language
        unlocks tasks tailored for you to help improve AI's understanding of it.
      </p>
    </div>
  </motion.div>
);

const TaskCard: FC<{ task: Task }> = ({ task }) => (
  <motion.div
    className="relative group flex flex-col bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300"
    whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 300 } }}
  >
    {task.disabled && (
      <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
        Coming Soon
      </div>
    )}

    <div
      className={`transition-opacity duration-300 ${
        task.disabled ? "opacity-50 group-hover:opacity-100" : ""
      }`}
    >
      <div className="mb-4">
        <task.icon className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
      </div>
      <h3 className="font-bold text-xl text-slate-800 mb-2">{task.title}</h3>
      <p className="text-slate-600 text-sm mb-4 flex-grow">
        {task.description}
      </p>
    </div>

    {task.disabled ? (
      <span className="mt-auto w-full px-5 py-2.5 rounded-lg font-semibold text-center bg-slate-200 text-slate-500 cursor-not-allowed select-none">
        Unavailable
      </span>
    ) : (
      <Link
        href={task.href}
        className="mt-auto w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-center bg-blue-500 text-white transition-all duration-300 transform hover:bg-blue-600 hover:scale-105"
      >
        {task.cta} <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    )}
  </motion.div>
);

// --- Main Page Component ---

export default function HomeTasksPage() {
  const { currentLanguage } = useAppStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevents hydration mismatch by ensuring this component only renders on the client
  if (!isClient) {
    return null;
  }

  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!currentLanguage ? (
          <WelcomePlaceholder />
        ) : (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
                Contribute to{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
                  {currentLanguage.name}
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-10">
                Choose a task below to help build better AI. Each contribution
                earns you rewards and recognition.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </AppLayout>
  );
}
