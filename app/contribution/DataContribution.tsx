'use client';
import { useState, useRef, useEffect } from 'react';
import { Prompt, type DataContribution as DataContributionType } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useWallet } from "../lib/auth/useWallet";
import InputTypeSelector from './ui/InputTypeSelector';
import TextInput from './ui/TextInput';
import AudioRecorder from './ui/AudioRecorder';
import PromptHeader from './ui/PromptHeader';
import BackButton from './ui/BackButton';
import SubmitButton from './ui/SubmitButton';
import { useContributionFlow } from './hooks/useContributionFlow';
import { useSession } from 'next-auth/react';
import { useUserData } from '../components/profile/hooks/useUserData';

interface DataContributionProps {
  prompt: Prompt;
  onComplete?: (contribution: DataContributionType) => void;
  onBack?: () => void;
}

export default function DataContribution({ prompt, onComplete, onBack }: DataContributionProps) {
  const { currentLanguage } = useAppStore();
  const [inputType, setInputType] = useState<'text' | 'audio'>('text');
  const [textContent, setTextContent] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useWallet();
  const { data: session } = useSession();
  const { userInfo, driveInfo } = useUserData();


  const {
    isSuccess,
    error,
    currentStep,
    completedSteps,
    // contributionData,
    shareUrl,
    isLoading,
    // isSigningMessage,
    handleContributeData,
    resetFlow,
  } = useContributionFlow();

  // const { data: session, status: sessionStatus } = useSession();

  // if (sessionStatus === "loading") return <div>Loading...</div>;

  useEffect(() => {
    console.log("Wallet address in DataContribution:", address);
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSubmitting(true);
    
    if (!session?.user) {
      setIsSubmitting(false);
      alert("not logged in ")
      return;
    }


    if (!userInfo || !driveInfo) {
      setIsSubmitting(false);
      alert("not logged in ")
      return;
    }

    // Reset the flow before starting a new contribution
    resetFlow();

     try {
      console.log("Try Catch block")
      await handleContributeData(userInfo, driveInfo, address);
      setIsSubmitting(false)
     } catch (error) {
      console.log(error)
     }
     

  };

  

  const canSubmit = !!(currentLanguage && (
    (inputType === 'text' && textContent.trim()) ||
    (inputType === 'audio' && audioBlob)
  ));

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      {/* Auth status */}
      <div className="mb-4 flex flex-col gap-2">
      </div>
      {/* Only show form if wallet is connected */}
      {address ? (
        <form onSubmit={handleSubmit}>
          {/* Back Button */}
          {onBack && <BackButton onBack={onBack} />}

          <PromptHeader title={prompt.title} description={prompt.description} examples={prompt.examples} />

          {/* Input Type Selector */}
          <InputTypeSelector inputType={inputType} setInputType={setInputType}/>

          {/* Text Input */}
          {inputType === 'text' && (
               <TextInput
                  value={textContent}
                  onChange={setTextContent}
                  languageName={currentLanguage?.name}
                  languageNativeName={currentLanguage?.nativeName}/>
)}

          {/* Audio Recording */}
          {inputType === 'audio' && (
            <AudioRecorder
              onAudioReady={(blob, url, time) => {
                setAudioBlob(blob);
                setAudioUrl(url);
                setRecordingTime(time);
              }}
            />
          )}

          {/* Submit Button */}
          <SubmitButton canSubmit={canSubmit} isSubmitting={isSubmitting} />
        </form>
      ) : (
        <div className="text-gray-500 mt-4">Please connect your wallet to contribute.</div>
      )}
    </div>
  );
}  