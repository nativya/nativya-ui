import React from "react";

interface SubmitButtonProps {
  canSubmit: boolean;
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ canSubmit, isSubmitting }) => (
  <div className="flex justify-center">
    <button
      type="submit"
      disabled={!canSubmit || isSubmitting}
      className={`px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
        canSubmit && !isSubmitting
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
    </button>
  </div>
);

export default SubmitButton; 