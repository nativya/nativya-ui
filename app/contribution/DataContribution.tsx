'use client';
import { useState, useEffect } from 'react';
import { AudioData, Prompt } from '../types';
import { useAppStore } from '../store/useAppStore';
import InputTypeSelector from './ui/InputTypeSelector';
import AudioRecorder from './ui/AudioRecorder';
import PromptHeader from './ui/PromptHeader';
import SubmitButton from './ui/SubmitButton';
import { useContributionFlow } from './hooks/useContributionFlow';
import { useSession } from 'next-auth/react';
import { useUserData } from '../components/profile/hooks/useUserData';
import { Language, ReactTransliterate as Transliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';
import { useAccount } from 'wagmi';

// Helper function to convert blob to base64
const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface DataContributionProps {
  prompt: Prompt;
}

export default function DataContribution({ prompt }: DataContributionProps) {
  const { currentLanguage } = useAppStore();
  const [inputType, setInputType] = useState<'text' | 'audio'>('text');
  const [textContent, setTextContent] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  // REVERT: isSubmitting is now local state again.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const { data: session } = useSession();
  const { userInfo, driveInfo } = useUserData();

  const {
    // REVERT: isSubmitting is no longer destructured from the hook.
    isSuccess,
    handleContributeData,
    resetFlow,
  } = useContributionFlow();

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!session?.user || !userInfo || !driveInfo) {
      alert("User information is not available. Please log in again.");
      return;
    }
    // REVERT: Manually control submitting state.
    setIsSubmitting(true);
    resetFlow();

    try {
      let audioData: AudioData | undefined = undefined;
      if (inputType === 'audio' && audioBlob) {
        if (audioBlob.size === 0) {
          alert('Audio recording is empty. Please record again.');
          // REVERT: Ensure isSubmitting is set to false on early return.
          setIsSubmitting(false);
          return;
        }
        const base64Audio = await convertBlobToBase64(audioBlob);
        audioData = {
          base64: base64Audio,
          mimeType: audioBlob.type || 'audio/wav',
          size: audioBlob.size,
          name: `audio_${userInfo.id}_${Date.now()}.wav`,
          duration: recordingTime
        };
      }

      await handleContributeData(userInfo, driveInfo, address, {
        // id: `${userInfo.id || "unknown"}_${Date.now()}`,
        languageCode: currentLanguage?.code || "",
        promptId: prompt.id,
        textContent: inputType === 'text' ? textContent : '',
        audioData: audioData,
        timestamp: new Date(),
        // userId: userInfo.id,
        metadata: {
          recordingDuration: inputType === 'audio' ? recordingTime : undefined,
          textLength: inputType === 'text' ? textContent.length : undefined,
        },
      });

    } catch (error) {
      console.error('Error submitting contribution:', error);
      alert('Failed to submit contribution. Please try again.');
    } finally {
      // REVERT: Always set submitting to false after the attempt.
      setIsSubmitting(false);
    }
  };
  
  // After a successful submission, clear the form.
  useEffect(() => {
      if (isSuccess) {
        setTextContent('');
        setAudioBlob(null);
        setAudioUrl('');
        setRecordingTime(0);
        // Optionally, you can show a success message and then reset the flow state
        // setTimeout(() => resetFlow(), 3000);
      }
  }, [isSuccess]);


  const canSubmit = !!(currentLanguage && (
    (inputType === 'text' && textContent.trim()) ||
    (inputType === 'audio' && audioBlob && audioBlob.size > 0)
  ));

  return (
    // UI UPDATE: Main container with modern card styling
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
      <form onSubmit={handleSubmit}>
        <PromptHeader
          title={prompt.title}
          description={prompt.description}
          examples={prompt.examples}
        />

        <div className="my-6">
          <InputTypeSelector inputType={inputType} setInputType={setInputType} />
        </div>

        {/* Text Input */}
        {inputType === 'text' && (
          <div className="animate-fade-in">
            <Transliterate
              lang={(currentLanguage?.code as Language) || 'hi'}
              value={textContent}
              onChangeText={setTextContent}
              placeholder={
                currentLanguage
                  ? `Type in ${currentLanguage.name} using English letters...`
                  : 'Select a language to begin...'
              }
              // UI UPDATE: Styling for the transliterate component
              className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-base resize-none"
            />
          </div>
        )}

        {/* Audio Recording */}
        {inputType === 'audio' && (
          <div className="animate-fade-in">
            <AudioRecorder
              onAudioReady={(blob, url, time) => {
                setAudioBlob(blob);
                setAudioUrl(url);
                setRecordingTime(time);
              }}
            />
          </div>
        )}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <SubmitButton
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            // REVERT: isSuccess prop is removed as it's not accepted by the component.
          />
        </div>
      </form>
    </div>
  );
}
