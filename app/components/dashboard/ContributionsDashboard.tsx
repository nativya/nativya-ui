'use client';
import { useEffect, useState } from 'react';
import { clientSideDecrypt } from '@/app/crypto/utils';
import { Button } from '../ui/Button';
import { useWallet } from '@/app/lib/auth/useWallet';

export default function ContributionsDashboard() {
  const [files, setFiles] = useState<any[]>([]);
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
      .finally(() => setLoading(false));
  }, []);

  // Decrypt handler
  async function handleDecrypt(file: any) {
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
    } catch (err: any) {
      alert('Decryption failed: ' + err.message);
    }
    setDecryptingId(null);
  }

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
      <h2 className="text-2xl font-bold mb-6">Your Encrypted Contributions</h2>
      <ul className="space-y-6">
        {files.map(file => {
          // Prepare decrypted data display if available
          let decryptedDisplay = null;
          if (decrypted[file.id]) {
            let displayText = decrypted[file.id].text;
            try {
              displayText = JSON.stringify(JSON.parse(displayText), null, 2);
            } catch {}
            decryptedDisplay = (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-inner">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  <span className="font-semibold text-green-700">Decrypted Data</span>
                </div>
                {displayText ? (
                  <pre className="bg-white border border-gray-200 rounded p-3 text-sm font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
                    {displayText}
                  </pre>
                ) : (
                  <a
                    href={URL.createObjectURL(decrypted[file.id].blob)}
                    download={file.name.replace(/^encrypted_/, 'decrypted_')}
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Download Decrypted File
                  </a>
                )}
              </div>
            );
          }
          return (
            <li key={file.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="mb-2 font-semibold">{file.name}</div>
              <div className="text-xs text-gray-500 mb-2">
                Uploaded: {new Date(file.createdTime).toLocaleString()}
              </div>
              {decryptedDisplay ? (
                decryptedDisplay
              ) : (
                <Button onClick={() => handleDecrypt(file)} disabled={decryptingId === file.id}>
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