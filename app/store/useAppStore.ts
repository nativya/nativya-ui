import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Language, Prompt, Data } from '../types';
import { INDIAN_LANGUAGES } from '../data/languages';
import { DATA_PROMPTS } from '../data/prompts';

interface AppStore extends AppState {
  // Actions
  setLanguage: (language: Language) => void;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  // addContribution: (contribution: DataContribution) => void;
  setIsRecording: (isRecording: boolean) => void;
  // clearContributions: () => void;
  // exportContributions: () => void;
  getContributionsByLanguage: (languageCode: string) => Data[];
  // getTotalContributions: () => number;
  address: string | null;
  setAddress: (address: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentLanguage: null,
      availableLanguages: INDIAN_LANGUAGES,
      prompts: DATA_PROMPTS,
      contributions: [],
      isRecording: false,
      currentPrompt: null,
      address: null,

      // Actions
      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
      },

      setCurrentPrompt: (prompt: Prompt | null) => {
        set({ currentPrompt: prompt });
      },

      // addContribution: (contribution: DataContribution) => {
      //   // Convert blob to base64 for storage if it exists
      //   const processedContribution = { ...contribution };
      //   if (contribution.audioBlob && contribution.audioBlob instanceof Blob) {
      //     const reader = new FileReader();
      //     reader.onloadend = () => {
      //       const base64 = reader.result as string;
      //       processedContribution.audioBlob = base64.split(',')[1]; // Remove data URL prefix
      //       set((state) => ({
      //         contributions: [...state.contributions, processedContribution]
      //       }));
      //     };
      //     reader.readAsDataURL(contribution.audioBlob);
      //   } else {
      //     set((state) => ({
      //       contributions: [...state.contributions, processedContribution]
      //     }));
      //   }
      // },

      setIsRecording: (isRecording: boolean) => {
        set({ isRecording });
      },

      // clearContributions: () => {
      //   set({ contributions: [] });
      // },

      // exportContributions: () => {
      //   const { contributions } = get();
      //   const dataStr = JSON.stringify(contributions, null, 2);
      //   const dataBlob = new Blob([dataStr], { type: 'application/json' });
      //   const url = URL.createObjectURL(dataBlob);
      //   const link = document.createElement('a');
      //   link.href = url;
      //   link.download = `nativya-contributions-${new Date().toISOString().split('T')[0]}.json`;
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      //   URL.revokeObjectURL(url);
      // },

      getContributionsByLanguage: (languageCode: string) => {
        const { contributions } = get();
        return contributions.filter(c => c.languageCode === languageCode);
      },

      // getTotalContributions: () => {
      //   const { contributions } = get();
      //   return contributions.length;
      // },

      setAddress: (address: string | null) => {
        set({ address });
      }
    }),
    {
      name: 'nativya-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        contributions: state.contributions,
        currentPrompt: state.currentPrompt,
        address: state.address, // <-- add this line
      }),
      // Custom serialize/deserialize to handle Date objects properly
      serialize: (state) => {
        return JSON.stringify(state, (key, value) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        // Convert date strings back to Date objects
        if (parsed.contributions) {
          parsed.contributions = parsed.contributions.map((contribution: Data) => ({
            ...contribution,
            timestamp: new Date(contribution.timestamp)
          }));
        }
        return parsed;
      }
    }
  )
); 