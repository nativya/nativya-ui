import React from "react";

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  languageName?: string;
  languageNativeName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  languageName,
  languageNativeName,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Write your response in {languageNativeName} ({languageName})
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start typing your response..."
      className="w-full h-24 sm:h-32 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
    />
    <div className="text-xs sm:text-sm text-gray-500 mt-2">
      {value.length} characters
    </div>
  </div>
);

export default TextInput;