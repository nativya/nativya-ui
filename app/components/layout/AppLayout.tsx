'use client';

import { ReactNode } from 'react';
import Navigation from '../navigation/Navigation';

interface AppLayoutProps {
  children: ReactNode;
  currentTab?: string;
}

export default function AppLayout({ children, currentTab }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Navigation currentTab={currentTab} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {children}
      </main>
      {/* Footer */}
      <footer className="relative z-10 bg-white/70 backdrop-blur-md border-t border-blue-200 shadow-2xl mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-0">
          {/* Branding & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 text-2xl font-extrabold text-blue-700">
              <img src="/Nativya_logo.jpg" alt="Nativya Logo" className="h-8 w-auto object-contain rounded-lg border-2 border-blue-200" width={32} height={32} />
              <span>Nativya</span>
            </div>
            <div className="text-sm text-blue-900 font-medium opacity-80 text-center md:text-left">
              Building the future of AI with your voice & stories.
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-2 md:gap-3 md:flex-row md:items-center">
            <a href="https://datadao.ai" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-semibold transition-colors">Community</a>
            <a href="#privacy" className="text-blue-700 hover:underline font-semibold transition-colors">Privacy</a>
          </nav>

          {/* CTA & Social */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            <a href="https://datadao.ai" target="_blank" rel="noopener noreferrer"
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors text-base flex items-center gap-2">
              <span>Join Community</span> <span>🚀</span>
            </a>
            <div className="flex gap-3 mt-2">
              {/* X (Twitter) */}
              <a href="https://x.com/nativya_ai" className="text-blue-700 hover:text-blue-900 text-xl transition-colors" aria-label="X" target="_blank" rel="noopener noreferrer">
                <span className="footer-x-icon">𝕏</span>
              </a>
              {/* Discord */}
              <a href="#" className="text-blue-700 hover:text-blue-900 text-xl transition-colors" aria-label="Discord">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.117.117 0 0 0-.124.06c-.537.96-1.13 2.22-1.552 3.2a17.978 17.978 0 0 0-5.238 0c-.423-.98-1.016-2.24-1.553-3.2a.117.117 0 0 0-.124-.06A19.736 19.736 0 0 0 3.684 4.369a.105.105 0 0 0-.047.043C.533 9.043-.32 13.579.099 18.057a.12.12 0 0 0 .045.083c1.934 1.426 3.81 2.292 5.652 2.858a.117.117 0 0 0 .128-.043c.434-.594.82-1.22 1.153-1.877a.112.112 0 0 0-.062-.155c-.617-.234-1.205-.507-1.783-.818a.117.117 0 0 1-.012-.195c.12-.09.24-.18.354-.27a.112.112 0 0 1 .12-.01c3.747 1.71 7.789 1.71 11.51 0a.112.112 0 0 1 .121.009c.114.09.234.18.354.27a.117.117 0 0 1-.011.195c-.578.311-1.166.584-1.783.818a.112.112 0 0 0-.062.155c.333.657.719 1.283 1.153 1.877a.117.117 0 0 0 .128.043c1.843-.566 3.718-1.432 5.652-2.858a.12.12 0 0 0 .045-.083c.5-5.177-.838-9.684-3.537-13.645a.093.093 0 0 0-.047-.043zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.955 2.419-2.156 2.419zm7.96 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z"/></svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com/nativya" className="text-blue-700 hover:text-blue-900 text-xl transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.34-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
        {/* Legal & Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-6 flex flex-col md:flex-row justify-between items-center border-t border-blue-100 mt-6 text-xs text-blue-900 opacity-80">
          <div className="mb-2 md:mb-0">© {new Date().getFullYear()} Nativya. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 