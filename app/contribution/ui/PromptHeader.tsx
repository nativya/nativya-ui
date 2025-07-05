import React from "react";

interface PromptHeaderProps {
  title: string;
  description: string;
  examples?: string[];
}

const PromptHeader: React.FC<PromptHeaderProps> = ({ title, description, examples }) => (
  <div className="mb-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
      {title}
    </h2>
    <p className="text-gray-600 mb-4 text-sm sm:text-base">
      {description}
    </p>
    {examples && (
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
        <p className="text-sm font-medium text-blue-900 mb-2">Examples:</p>
        <ul className="text-sm text-blue-800 space-y-1">
          {examples.map((example, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2 flex-shrink-0">•</span>
              <span className="leading-relaxed">{example}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default PromptHeader;
