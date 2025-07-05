import React from "react";

interface InputTypeSelectorProps {
  inputType: 'text' | 'audio';
  setInputType: (type: 'text' | 'audio') => void;
}

const InputTypeSelector: React.FC<InputTypeSelectorProps> = ({ inputType, setInputType }) => (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
    <button
      type="button"
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
      type="button"
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
);

export default InputTypeSelector;