'use client';

import { ReactNode } from 'react';
import Navigation from '../navigation/Navigation';
import Image from 'next/image';
import { useWallet } from '../../lib/auth/useWallet';
import WalletConnector from '../../contribution/utils/WalletConnector';
// NEW: Importing icons for a professional look
import { LockClosedIcon, InformationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface AppLayoutProps {
  children: ReactNode;
  currentTab?: string;
}

export default function AppLayout({ children, currentTab }: AppLayoutProps) {
  const { address } = useWallet();
  return (
    // UPDATED: Clean, light background for the entire app
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* The Navigation component already has the updated light theme */}
      <Navigation/>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        {!address ? (
          // UPDATED: "Connect Wallet" prompt with the new light theme and professional icons
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="p-4 bg-indigo-100 rounded-full mb-5">
              <LockClosedIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Connect Your Wallet to Continue</h2>
            <p className="text-slate-600 mb-6 max-w-md">
              Please connect your wallet to access application features, track contributions, and receive rewards securely.
            </p>
            <div>
              <WalletConnector />
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 max-w-sm">
              <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span>You can use MetaMask, Coinbase Wallet, or any other supported wallet.</span>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* UPDATED: Footer with the new light theme */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
            {/* Branding & Tagline */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2.5 text-2xl font-bold text-slate-800">
                <Image src="/Nativya_logo.jpg" alt="Nativya Logo" className="h-8 w-8 object-contain rounded-md" width={32} height={32} />
                <span>Nativya</span>
              </div>
              <div className="text-sm text-slate-600 text-center md:text-left">
                Building the future of AI with your voice & stories.
              </div>
            </div>

            {/* CTA & Social */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <a href="https://datadao.ai" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                <span>Join Community</span>
                <ArrowRightIcon className="w-4 h-4" />
              </a>
              <div className="flex gap-4">
                {/* Social Icons (using simple paths for clean SVGs) */}
                <a href="https://x.com/nativya_ai" className="text-slate-500 hover:text-indigo-600 transition-colors" aria-label="X (formerly Twitter)" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-1.7 12.95h1.949L5.42 2.15H3.35l7.55 11.55Z"/></svg>
                </a>
                <a href="https://github.com/nativya" className="text-slate-500 hover:text-indigo-600 transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                </a>
              </div>
            </div>
          </div>
          {/* Legal & Copyright */}
          <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 mt-8 text-sm text-slate-500">
            <div className="mb-2 md:mb-0">© {new Date().getFullYear()} Nativya. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-slate-900 hover:underline">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-900 hover:underline">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
