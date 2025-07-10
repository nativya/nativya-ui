'use client';
import { useState, useEffect } from 'react';
import { AudioData, Prompt, type DataContribution as DataContributionType } from '../types';
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
import WalletConnector from './utils/WalletConnector';

interface DataContributionProps {
  prompt: Prompt;
  onBack?: () => void;
}

// Helper function to convert blob to base64
const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove the data URL prefix (data:audio/wav;base64,) to get pure base64
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function DataContribution({ prompt, onBack }: DataContributionProps) {
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
    handleContributeData,
    resetFlow,
  } = useContributionFlow();

  useEffect(() => {
    // console.log("Wallet address in DataContribution:", address);
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    if (!session?.user) {
      setIsSubmitting(false);
      alert("not logged in");
      return;
    }

    if (!userInfo || !driveInfo) {
      setIsSubmitting(false);
      alert("not logged in");
      return;
    }

    // Reset the flow before starting a new contribution
    resetFlow();

    try {
      console.log("Try Catch block");
      
      // Convert audioBlob to base64 if it exists
      let audioData: AudioData | undefined = undefined;
      if (audioBlob) {
        console.log('Converting audio blob to base64...', {
          size: audioBlob.size,
          type: audioBlob.type
        });
        
        // Validate blob before conversion
        if (audioBlob.size === 0) {
          alert('Audio recording is empty. Please record again.');
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
        
        console.log('Audio data prepared:', {
          mimeType: audioData.mimeType,
          size: audioData.size,
          base64Length: base64Audio.length
        });
      }

      await handleContributeData(userInfo, driveInfo, address, {
        id: `${userInfo.id || "unknown"}_${Date.now()}`,
        languageCode: currentLanguage?.code || "",
        promptId: prompt.id,
        textContent,
        audioData: audioData, // Send structured audio data instead of audioBlob
        audioUrl: audioUrl || undefined,
        timestamp: new Date(),
        userId: userInfo.id,
        metadata: {
          recordingDuration: inputType === 'audio' ? recordingTime : undefined,
          textLength: inputType === 'text' ? textContent.length : undefined,
        },
      });
      
      setIsSubmitting(false);
      
      // Optional: Clear form after successful submission
      if (isSuccess) {
        setTextContent('');
        setAudioBlob(null);
        setAudioUrl('');
        setRecordingTime(0);
      }
      
    } catch (error) {
      console.error('Error submitting contribution:', error);
      setIsSubmitting(false);
      alert('Failed to submit contribution. Please try again.');
    }
  };

  const canSubmit = !!(currentLanguage && (
    (inputType === 'text' && textContent.trim()) ||
    (inputType === 'audio' && audioBlob && audioBlob.size > 0)
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

          <PromptHeader 
            title={prompt.title} 
            description={prompt.description} 
            examples={prompt.examples} 
          />

          {/* Input Type Selector */}
          <InputTypeSelector inputType={inputType} setInputType={setInputType} />

          {/* Text Input */}
          {inputType === 'text' && (
            <TextInput
              value={textContent}
              onChange={setTextContent}
              languageName={currentLanguage?.name}
              languageNativeName={currentLanguage?.nativeName}
            />
          )}

          {/* Audio Recording */}
          {inputType === 'audio' && (
            <AudioRecorder
              onAudioReady={(blob, url, time) => {
                console.log('Audio ready:', { 
                  blobSize: blob.size, 
                  blobType: blob.type, 
                  duration: time 
                });
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
      
      <WalletConnector />
    </div>
  );
}