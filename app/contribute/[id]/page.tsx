// Contribution Page - A More Beautiful & User-Friendly Redesign
// File: app/contribute/[id]/page.tsx
// Description: A unified and redesigned contribution page with a focus on UI/UX, animations, and user-friendliness.

"use client";

import { useEffect, useState, use, FC } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { Prompt, AudioData } from "../../types";
import AppLayout from "../../components/layout/AppLayout";
import {
  Language,
  ReactTransliterate as Transliterate,
} from "react-transliterate";
import "react-transliterate/dist/index.css";
import { useContributionFlow } from "../../contribution/hooks/useContributionFlow";
import { useUserData } from "../../components/profile/hooks/useUserData";
import {
  Mic,
  Square,
  Check,
  ChevronLeft,
  Lightbulb,
  Keyboard,
  Volume2,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";

// --- Helper: Convert Blob to Base64 ---
const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- Animated Loading Spinner ---
const LoadingSpinner: FC = () => (
  <div className="flex justify-center items-center py-24">
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
  </div>
);

// --- Back Button Component ---
const BackButton: FC<{ onBack: () => void }> = ({ onBack }) => (
  <motion.button
    onClick={onBack}
    className="flex items-center gap-2 text-slate-600 font-semibold mb-6 hover:text-blue-600 transition-colors"
    whileHover={{ x: -5 }}
  >
    <ChevronLeft className="w-5 h-5" />
    Back to Prompts
  </motion.button>
);

// --- Success Overlay Component ---
const SuccessOverlay: FC<{ onContinue: () => void }> = ({ onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-2xl flex flex-col items-center justify-center text-center p-8 z-20"
    >
      <PartyPopper className="w-20 h-20 text-green-500 mb-4" />
      <h2 className="text-3xl font-bold text-slate-800">
        Contribution Submitted!
      </h2>
      <p className="text-slate-600 mt-2 text-lg">
        Thank you for helping build a more inclusive AI.
      </p>
      <motion.button
        onClick={onContinue}
        className="mt-8 px-8 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Contribute More
      </motion.button>
    </motion.div>
  );
};

// --- Main Data Contribution Component ---
const DataContributionComponent: FC<{ prompt: Prompt }> = ({ prompt }) => {
  const { currentLanguage } = useAppStore();
  const [inputType, setInputType] = useState<"text" | "audio">("audio");
  const [textContent, setTextContent] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const { userInfo, driveInfo } = useUserData();
  const { isSuccess, handleContributeData, resetFlow } = useContributionFlow();

  const canSubmit = !!(
    currentLanguage &&
    ((inputType === "text" && textContent.trim()) ||
      (inputType === "audio" && audioBlob && audioBlob.size > 0))
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!session?.user || !userInfo || !driveInfo || !canSubmit) return;

    setIsSubmitting(true);
    resetFlow();

    try {
      let audioData: AudioData | undefined = undefined;
      if (inputType === "audio" && audioBlob) {
        const base64Audio = await convertBlobToBase64(audioBlob);
        audioData = {
          base64: base64Audio,
          mimeType: audioBlob.type || "audio/wav",
          size: audioBlob.size,
          name: `audio_${userInfo.id}_${Date.now()}.wav`,
          duration: recordingTime,
        };
      }

      await handleContributeData(userInfo, driveInfo, null, {
        id: `${userInfo.id || "unknown"}_${Date.now()}`,
        languageCode: currentLanguage?.code || "",
        promptId: prompt.id,
        textContent: inputType === "text" ? textContent : "",
        audioData: audioData,
        timestamp: new Date(),
        userId: userInfo.id,
        metadata: {
          recordingDuration: inputType === "audio" ? recordingTime : undefined,
          textLength: inputType === "text" ? textContent.length : undefined,
        },
      });
    } catch (error) {
      console.error("Error submitting contribution:", error);
      alert("Failed to submit contribution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTextContent("");
      setAudioBlob(null);
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [isSuccess]);

  const router = useRouter();
  const handleContinue = () => {
    resetFlow();
    router.push("/prompts");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-white border border-slate-200/80 rounded-2xl shadow-lg p-6 sm:p-8"
    >
      <AnimatePresence>
        {isSuccess && <SuccessOverlay onContinue={handleContinue} />}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        {/* Prompt Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {prompt.title}
          </h2>
          <p className="text-slate-600 mt-2 text-base sm:text-lg">
            {prompt.description}
          </p>
        </div>

        {/* Input Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setInputType("audio")}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                inputType === "audio"
                  ? "bg-blue-500 text-white shadow"
                  : "text-slate-600"
              }`}
            >
              <Volume2 className="w-5 h-5" /> Audio
            </button>
            <button
              type="button"
              onClick={() => setInputType("text")}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                inputType === "text"
                  ? "bg-blue-500 text-white shadow"
                  : "text-slate-600"
              }`}
            >
              <Keyboard className="w-5 h-5" /> Text
            </button>
          </div>
        </div>

        {/* Contribution Area */}
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-slate-50 rounded-xl p-6">
          <AnimatePresence mode="wait">
            {inputType === "audio" ? (
              <motion.div
                key="audio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                {/* Audio Recorder UI */}
                <div className="relative flex items-center justify-center mb-4">
                  {isRecording && (
                    <motion.div
                      className="absolute w-24 h-24 bg-blue-500/20 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-colors ${
                      isRecording ? "bg-red-500" : "bg-blue-500"
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </button>
                </div>
                <p className="font-mono text-lg text-slate-700">
                  {new Date(recordingTime * 1000).toISOString().substr(14, 5)}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  {isRecording ? "Recording..." : "Tap to record"}
                </p>
                {/* Hidden AudioRecorder component to handle logic */}
                <div className="hidden">
                  {/* This is a placeholder for your actual AudioRecorder logic */}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Transliterate
                  lang={(currentLanguage?.code as Language) || "hi"}
                  value={textContent}
                  onChangeText={setTextContent}
                  placeholder={`Type your response in ${currentLanguage?.name}...`}
                  className="w-full h-40 p-4 border border-slate-300 rounded-lg bg-white text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips Section */}
        <div className="mt-6 flex items-start gap-3 text-sm text-slate-500 bg-slate-100 p-4 rounded-lg">
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500" />
          <p>
            <strong>Tip:</strong> Find a quiet place and speak clearly. Your
            contribution helps train more accurate AI models!
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isSubmitting ? "Submitting..." : "Submit Contribution"}
            {!isSubmitting && <CheckCircle2 className="ml-3 w-6 h-6" />}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// --- Main Page Wrapper ---
export default function ContributePage({ params }: { params: { id: string } }) {
  const { status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { currentLanguage, prompts, setCurrentPrompt } = useAppStore();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const promptId = params.id;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && status === "unauthenticated") router.push("/");
  }, [status, router, isClient]);

  useEffect(() => {
    if (prompts.length > 0 && promptId) {
      const foundPrompt = prompts.find((p: Prompt) => p.id === promptId);
      if (foundPrompt) {
        setPrompt(foundPrompt);
        setCurrentPrompt(foundPrompt);
      } else {
        router.push("/prompts");
      }
    }
  }, [prompts, promptId, setCurrentPrompt, router]);

  useEffect(() => {
    if (isClient && !currentLanguage) router.push("/prompts");
  }, [currentLanguage, isClient, router]);

  const handleBackToPrompts = () => {
    setCurrentPrompt(null);
    router.push("/prompts");
  };

  if (status === "loading" || !isClient || !prompt) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <BackButton onBack={handleBackToPrompts} />
        <DataContributionComponent prompt={prompt} />
      </div>
    </AppLayout>
  );
}
