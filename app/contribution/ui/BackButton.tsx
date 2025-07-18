import React from "react";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  onBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack }) => (
  <div className="mb-4">
    <button
      type="button"
      onClick={onBack}
      className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
    >
      <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      Back to Prompts
    </button>
  </div>
);

export default BackButton;
