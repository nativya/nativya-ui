'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getLanguageByCode } from '../data/languages';
import { DATA_PROMPTS } from '../data/prompts';
import { formatDate, safeParseDate } from '../lib/utils';

export default function ContributionsDashboard() {
  const { 
    contributions, 
    currentLanguage, 
    exportContributions, 
    clearContributions,
    getContributionsByLanguage,
    getTotalContributions 
  } = useAppStore();
  
  const [isClient, setIsClient] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Recreate audio URLs from stored blobs
  useEffect(() => {
    if (isClient && contributions.length > 0) {
      const newAudioUrls: Record<string, string> = {};
      
      contributions.forEach((contribution: any) => {
        if (contribution.audioBlob && !audioUrls[contribution.id]) {
          try {
            // Convert base64 string back to blob if needed
            let blob: Blob;
            if (typeof contribution.audioBlob === 'string') {
              // Validate that it's a proper base64 string
              if (!contribution.audioBlob || contribution.audioBlob.trim() === '') {
                console.warn('Empty audioBlob string for contribution:', contribution.id);
                return;
              }
              
              try {
                // Handle base64 encoded blob
                const byteCharacters = atob(contribution.audioBlob);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                blob = new Blob([byteArray], { type: 'audio/wav' });
              } catch (base64Error) {
                console.warn('Invalid base64 string for contribution:', contribution.id, base64Error);
                return;
              }
            } else if (contribution.audioBlob instanceof Blob) {
              // Handle actual blob object
              blob = contribution.audioBlob;
            } else {
              console.warn('Invalid audioBlob type for contribution:', contribution.id);
              return;
            }
            
            const url = URL.createObjectURL(blob);
            newAudioUrls[contribution.id] = url;
          } catch (error) {
            console.error('Error processing audio blob for contribution:', contribution.id, error);
          }
        }
      });
      
      if (Object.keys(newAudioUrls).length > 0) {
        setAudioUrls(prev => ({ ...prev, ...newAudioUrls }));
      }
    }
  }, [isClient, contributions]);

  // Cleanup audio URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(audioUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [audioUrls]);

  const totalContributions = getTotalContributions();
  const languageContributions = currentLanguage 
    ? getContributionsByLanguage(currentLanguage.code)
    : [];

  const getPromptTitle = (promptId: string) => {
    const prompt = DATA_PROMPTS.find(p => p.id === promptId);
    return prompt?.title || 'Unknown Prompt';
  };

  const getLanguageName = (languageCode: string) => {
    const language = getLanguageByCode(languageCode);
    return language?.nativeName || language?.name || languageCode;
  };

  const getAudioUrl = (contribution: any) => {
    // First try to use the recreated URL from blob
    if (audioUrls[contribution.id]) {
      return audioUrls[contribution.id];
    }
    // Fallback to stored audioUrl (might be invalid after page refresh)
    if (contribution.audioUrl) {
      return contribution.audioUrl;
    }
    // If no valid URL is available, return null
    return null;
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (totalContributions === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Contributions Yet
          </h2>
          <p className="text-gray-600">
            Start contributing data to see your submissions here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Your Contributions
          </h2>
          <div className="flex gap-3">
            <button
              onClick={exportContributions}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📥 Export Data
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all contributions? This action cannot be undone.')) {
                  clearContributions();
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalContributions}
            </div>
            <div className="text-blue-800">Total Contributions</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {contributions.filter((c: any) => c.textContent).length}
            </div>
            <div className="text-green-800">Text Contributions</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {contributions.filter((c: any) => c.audioBlob).length}
            </div>
            <div className="text-purple-800">Audio Contributions</div>
          </div>
        </div>

        {/* Language Filter */}
        {currentLanguage && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-medium text-gray-700">
                Showing contributions for:
              </span>
              <span className="text-2xl">{currentLanguage.flag}</span>
              <span className="text-lg font-semibold text-gray-900">
                {currentLanguage.nativeName} ({currentLanguage.name})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Contributions List */}
      <div className="space-y-4">
        {(currentLanguage ? languageContributions : contributions).map((contribution: any) => {
          // Safely parse the timestamp
          const timestamp = safeParseDate(contribution.timestamp);
          
          return (
            <div
              key={contribution.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getPromptTitle(contribution.promptId)}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {formatDate(timestamp)}
                    </span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {getLanguageName(contribution.languageCode)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {contribution.textContent && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      📝 Text
                    </span>
                  )}
                  {contribution.audioBlob && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      🎤 Audio
                    </span>
                  )}
                </div>
              </div>

              {/* Content Display */}
              {contribution.textContent && (
                <div className="mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {contribution.textContent}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {contribution.textContent.length} characters
                  </div>
                </div>
              )}

              {contribution.audioBlob && (
                <div className="mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {getAudioUrl(contribution) ? (
                      <audio 
                        controls 
                        className="w-full"
                        preload="metadata"
                        controlsList="nodownload"
                      >
                        <source src={getAudioUrl(contribution)} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-gray-500 mb-2">🎤 Audio Recording</div>
                        <div className="text-sm text-gray-400">
                          Audio data is available but cannot be played at the moment.
                        </div>
                      </div>
                    )}
                    {contribution.metadata.recordingDuration && (
                      <div className="text-sm text-gray-500 mt-2">
                        Duration: {Math.floor(contribution.metadata.recordingDuration / 60)}:
                        {(contribution.metadata.recordingDuration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                    {getAudioUrl(contribution) && (
                      <div className="text-xs text-gray-500 mt-2">
                        💡 Click the play button to listen to your audio recording
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-gray-400 border-t pt-3">
                <div>Device: {contribution.metadata.deviceInfo}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Language Summary */}
      {!currentLanguage && totalContributions > 0 && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contributions by Language
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from(new Set(contributions.map((c: any) => c.languageCode))).map((langCode: any) => {
              const langContributions = getContributionsByLanguage(langCode);
              const language = getLanguageByCode(langCode);
              return (
                <div key={langCode} className="text-center">
                  <div className="text-2xl mb-1">{language?.flag}</div>
                  <div className="font-medium text-gray-900">
                    {language?.nativeName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {langContributions.length} contributions
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 