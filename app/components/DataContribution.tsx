'use client';

import { useState, useRef, useEffect } from 'react';
import { Prompt, type DataContribution as DataContributionType } from '../types';
import { useAppStore } from '../store/useAppStore';
import { generateId, getDeviceInfo } from '../lib/utils';

interface DataContributionProps {
  prompt: Prompt;
  onComplete?: (contribution: DataContributionType) => void;
  onBack?: () => void;
}

export default function DataContribution({ prompt, onComplete, onBack }: DataContributionProps) {
  const { currentLanguage, addContribution } = useAppStore();
  const [inputType, setInputType] = useState<'text' | 'audio'>('text');
  const [textContent, setTextContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!currentLanguage) {
      alert('Please select a language first.');
      return;
    }

    if (inputType === 'text' && !textContent.trim()) {
      alert('Please enter some text content.');
      return;
    }

    if (inputType === 'audio' && !audioBlob) {
      alert('Please record some audio content.');
      return;
    }

    setIsSubmitting(true);

    try {
      const contribution: DataContributionType = {
        id: generateId(),
        languageCode: currentLanguage.code,
        promptId: prompt.id,
        textContent: inputType === 'text' ? textContent : undefined,
        audioBlob: inputType === 'audio' ? audioBlob || undefined : undefined,
        audioUrl: inputType === 'audio' ? audioUrl : undefined,
        timestamp: new Date(),
        metadata: {
          deviceInfo: getDeviceInfo(),
          recordingDuration: inputType === 'audio' ? recordingTime : undefined,
          textLength: inputType === 'text' ? textContent.length : undefined,
        }
      };

      addContribution(contribution);
      onComplete?.(contribution);

      // Reset form
      setTextContent('');
      setAudioBlob(null);
      setAudioUrl('');
      setRecordingTime(0);
      setIsRecording(false);

    } catch (error) {
      console.error('Error submitting contribution:', error);
      alert('Error submitting contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = currentLanguage && (
    (inputType === 'text' && textContent.trim()) ||
    (inputType === 'audio' && audioBlob)
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      {/* Back Button */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Prompts
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {prompt.title}
        </h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {prompt.description}
        </p>
        
        {prompt.examples && (
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Examples:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              {prompt.examples.map((example, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 flex-shrink-0">•</span>
                  <span className="leading-relaxed">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Input Type Selector */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <button
          onClick={() => setInputType('text')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            inputType === 'text'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 Text Input
        </button>
        <button
          onClick={() => setInputType('audio')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            inputType === 'audio'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎤 Audio Recording
        </button>
      </div>

      {/* Text Input */}
      {inputType === 'text' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Write your response in {currentLanguage?.nativeName} ({currentLanguage?.name})
          </label>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Start typing your response..."
            className="w-full h-24 sm:h-32 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
          />
          <div className="text-xs sm:text-sm text-gray-500 mt-2">
            {textContent.length} characters
          </div>
        </div>
      )}

      {/* Audio Recording */}
      {inputType === 'audio' && (
        <div className="mb-6">
          <div className="text-center">
            {!isRecording && !audioBlob && (
              <button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-colors"
              >
                🎤 Start Recording
              </button>
            )}

            {isRecording && (
              <div className="space-y-4">
                <div className="text-xl sm:text-2xl font-mono text-red-500">
                  {formatTime(recordingTime)}
                </div>
                <button
                  onClick={stopRecording}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-colors"
                >
                  ⏹️ Stop Recording
                </button>
              </div>
            )}

            {audioBlob && audioUrl && (
              <div className="space-y-4">
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <div className="text-xs sm:text-sm text-gray-600">
                  Recording duration: {formatTime(recordingTime)}
                </div>
                <button
                  onClick={() => {
                    setAudioBlob(null);
                    setAudioUrl('');
                    setRecordingTime(0);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Record Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            canSubmit && !isSubmitting
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
        </button>
      </div>
    </div>
  );
} 