'use client';
import { useEffect, useState } from 'react';
import { clientSideDecrypt } from '@/app/crypto/utils';
import { Button } from '../ui/Button';
import { useWallet } from '@/app/lib/auth/useWallet';
import { AudioData } from '@/app/types';

// Define the type for files fetched from the API
export interface ContributionFile {
  id: string;
  name: string;
  createdTime: string;
  mimeType: string;
  size?: string;
  encryptedData: string;
}

export default function ContributionsDashboard() {
  const [files, setFiles] = useState<ContributionFile[]>([]);
  const [decrypted, setDecrypted] = useState<Record<string, { blob: Blob; text: string }>>({});
  const [decryptingId, setDecryptingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { signMessage } = useWallet();
  const SIGN_MESSAGE = "Please sign to retrieve your encryption key";

  // Fetch contributions on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/google/contributions')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .finally(() =>{ 
        console.log(files)
        setLoading(false)
      });
  }, []);

  // Decrypt handler
  async function handleDecrypt(file: ContributionFile) {
    setDecryptingId(file.id);
    try {
      // Use wallet signature as passphrase
      const signature = await signMessage(SIGN_MESSAGE);
      if (!signature) throw new Error('Signature is required to decrypt.');
      // Convert base64 to Blob
      const encryptedBlob = new Blob([
        Uint8Array.from(atob(file.encryptedData), c => c.charCodeAt(0))
      ]);
      // Decrypt using the wallet signature as passphrase
      const decryptedBlob = await clientSideDecrypt(encryptedBlob, signature);
      // Try to convert Blob to string (for text/JSON files)
      let decryptedText = '';
      try {
        decryptedText = await decryptedBlob.text();
      } catch {
        decryptedText = '';
      }
      setDecrypted(prev => ({
        ...prev,
        [file.id]: { blob: decryptedBlob, text: decryptedText }
      }));
    } catch (err) {
      alert('Decryption failed: ' + (err as Error).message);
    }
    setDecryptingId(null);
  }

  const removeFunc=(audioData:AudioData)=>{return audioData;}

  // Loader CSS (inline for demonstration)
  const loaderStyle: React.CSSProperties = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: 32,
    height: 32,
    animation: 'spin 1s linear infinite',
    margin: 'auto',
  };

  // Add keyframes for spin animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex justify-center items-center h-40">
        <div style={loaderStyle} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Your Encrypted Contributions <span className="text-2xl">🔒</span></h2>
      <ul className="space-y-6">
        {files.map(file => {
          // Prepare decrypted data display if available
          let decryptedDisplay = null;
          if (decrypted[file.id]) {
            let displayData = null;
            let audioUrl = null;
            try {
              const parsed = JSON.parse(decrypted[file.id].text);
              if (parsed && parsed.data !== undefined) {
                // If audioData exists, create a URL for it
                if (parsed.data.audioData && parsed.data.audioData.base64 && parsed.data.audioData.mimeType) {
                  const { base64, mimeType } = parsed.data.audioData;
                  // Convert base64 to Blob
                  const byteCharacters = atob(base64);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const audioBlob = new Blob([byteArray], { type: mimeType });
                  audioUrl = URL.createObjectURL(audioBlob);
                }
                // Exclude audioData from displayData
                const { audioData, ...restData } = parsed.data;
                displayData = JSON.stringify(restData, null, 2);
                removeFunc(audioData)
              }
            } catch {}
            decryptedDisplay = (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-inner">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  <span className="font-semibold text-green-700">Decrypted Data Field</span>
                </div>
                {audioUrl && (
                  <audio controls src={audioUrl} className="my-2" />
                )}
                {displayData && displayData !== '{}' ? (
                  <pre className="bg-white border border-gray-200 rounded p-3 text-sm font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
                    {displayData}
                  </pre>
                ) : !audioUrl ? (
                  <div className="text-red-600">No <code>data</code> field found in decrypted content.</div>
                ) : null}
              </div>
            );
          }
          return (
            <li key={file.id} className="glass outline-thick p-4 bg-white/80 shadow transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer">
              <div className="mb-2 font-semibold">{file.name}</div>
              <div className="text-xs text-gray-500 mb-2">
                Uploaded: {new Date(file.createdTime).toLocaleString()}
              </div>
              {decryptedDisplay ? (
                decryptedDisplay
              ) : (
                <Button onClick={() => handleDecrypt(file)} disabled={decryptingId === file.id} className="transition-transform hover:scale-105">
                  {decryptingId === file.id ? 'Decrypting...' : 'Decrypt'}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
} 