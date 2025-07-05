import React from "react";

interface BackButtonProps {
  onBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack }) => (
  <div className="mb-4">
    <button
      type="button"
      onClick={onBack}
      className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Prompts
    </button>
  </div>
);

export default BackButton; 