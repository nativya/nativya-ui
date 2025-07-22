'use client';
import { useEffect, useState } from 'react';
import { clientSideDecrypt } from '@/app/crypto/utils';
import { Button } from '../ui/Button'; // Assuming this is a custom styled button
import { AudioData } from '@/app/types';
// NEW: Importing professional icons from Heroicons
import { LockClosedIcon, LockOpenIcon, DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { useSignMessage } from 'wagmi';

// Define the type for files fetched from the API
export interface ContributionFile {
  id: string;
  name: string;
  createdTime: string;
  mimeType: string;
  size?: string;
  encryptedData: string;
}

// NEW: A modern SVG spinner component for loading states
const Spinner = ({ small } : { small?: boolean }) => (
  <svg className={`animate-spin text-indigo-600 ${small ? 'h-5 w-5' : 'h-8 w-8'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


export default function ContributionsDashboard() {
  const [files, setFiles] = useState<ContributionFile[]>([]);
  const [decrypted, setDecrypted] = useState<Record<string, { blob: Blob; text: string }>>({});
  const [decryptingId, setDecryptingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { signMessageAsync, isPending: isSigningMessage } = useSignMessage()  // const { signMessageAsync, isPending: isSigningMessage } = useSignMessage();
  const SIGN_MESSAGE = "Please sign to retrieve your encryption key";

  // Fetch contributions on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/google/contributions')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .finally(() =>{
        setLoading(false)
      });
  }, []);

  // Decrypt handler
  async function handleDecrypt(file: ContributionFile) {
    setDecryptingId(file.id);
    try {
      const signature = await signMessageAsync({message:SIGN_MESSAGE});
      if (!signature) throw new Error('Signature is required to decrypt.');
      
      const encryptedBlob = new Blob([
        Uint8Array.from(atob(file.encryptedData), c => c.charCodeAt(0))
      ]);
      
      const decryptedBlob = await clientSideDecrypt(encryptedBlob, signature);
      
      let decryptedText = '';
      try {
        decryptedText = await decryptedBlob.text();
      } catch {
        // This might fail for non-text blobs, which is fine.
        decryptedText = '';
      }
      setDecrypted(prev => ({
        ...prev,
        [file.id]: { blob: decryptedBlob, text: decryptedText }
      }));
    } catch (err) {
      // A toast notification would be a better UX, but alert is used for simplicity.
      alert('Decryption failed: ' + (err as Error).message);
    }
    setDecryptingId(null);
  }

  const removeFunc=(audioData:AudioData)=>{return audioData;}

  if (loading) {
    return (
      // UPDATED: Loading state with the new spinner
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    // UPDATED: Main container to match the light theme
    <div className="max-w-4xl mx-auto">
      {/* UPDATED: Header with professional icon and typography */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-lg">
            <LockClosedIcon className="w-7 h-7 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Your Contributions</h2>
      </div>
      
      {files.length === 0 ? (
        // NEW: Professional empty state
        <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-lg">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-lg font-semibold text-slate-800">No Contributions Found</h3>
            <p className="mt-1 text-sm text-slate-600">It looks like you haven&apos;t made any contributions yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {files.map(file => {
            const isDecrypted = decrypted[file.id];
            let audioUrl: string | null = null;
            let displayData: string | null = null;

            if (isDecrypted) {
              try {
                const parsed = JSON.parse(decrypted[file.id].text);
                if (parsed && parsed.data) {
                  if (parsed.data.audioData?.base64 && parsed.data.audioData?.mimeType) {
                    const { base64, mimeType } = parsed.data.audioData;
                    const byteCharacters = atob(base64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const audioBlob = new Blob([byteArray], { type: mimeType });
                    audioUrl = URL.createObjectURL(audioBlob);
                  }
                  const { audioData, ...restData } = parsed.data;
                  displayData = Object.keys(restData).length > 0 ? JSON.stringify(restData, null, 2) : null;
                   removeFunc(audioData)
                }
              } catch {
                // JSON parsing failed, do nothing
              }
            }

            return (
              // UPDATED: List item card with light theme styling
              <li key={file.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-slate-500" />
                        {file.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Uploaded: {new Date(file.createdTime).toLocaleString()}
                    </div>
                  </div>
                  {!isDecrypted && (
                    <Button 
                        onClick={() => handleDecrypt(file)} 
                        disabled={decryptingId === file.id} 
                        className="inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      {decryptingId === file.id ? (
                        <>
                          <Spinner small />
                          <span>Decrypting...</span>
                        </>
                      ) : (
                        <>
                          <LockOpenIcon className="w-4 h-4" />
                          <span>Decrypt</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {isDecrypted && (
                  // UPDATED: Decrypted content view with light theme styling
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                        <CheckCircleIcon className="w-5 h-5" />
                        Decryption Successful
                    </div>
                    <div className="space-y-4">
                        {audioUrl && (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    <MusicalNoteIcon className="w-5 h-5" />
                                    <span>Audio Content</span>
                                </div>
                                <audio controls src={audioUrl} className="w-full" />
                            </div>
                        )}
                        {displayData && (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="text-sm font-medium text-slate-700 mb-2">Text Content</div>
                                <pre className="bg-white border border-slate-200 rounded p-3 text-xs font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
                                {displayData}
                                </pre>
                            </div>
                        )}
                        {!audioUrl && !displayData && (
                            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <ExclamationTriangleIcon className="w-5 h-5" />
                                <span>No displayable audio or text data found in the decrypted file.</span>
                            </div>
                        )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
