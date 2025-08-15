import React from "react";

interface SubmitButtonProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  isSuccess?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ canSubmit, isSubmitting, isSuccess }) => (
  <div className="flex justify-center">
    <button
      type="submit"
      disabled={!canSubmit || isSubmitting || isSuccess}
      className={`px-6 sm:px-8 py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base flex items-center gap-2 ${
        isSuccess
          ? 'bg-green-600 text-white cursor-default'
          : canSubmit && !isSubmitting
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {isSuccess ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Contributed Successfully!
        </>
      ) : isSubmitting ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        'Submit Contribution'
      )}
    </button>
  </div>
);

export default SubmitButton; 