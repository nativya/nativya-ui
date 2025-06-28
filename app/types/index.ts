export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'culture' | 'food' | 'travel' | 'family' | 'custom';
  examples?: string[];
}

export interface DataContribution {
  id: string;
  languageCode: string;
  promptId: string;
  textContent?: string;
  audioBlob?: Blob | string;
  audioUrl?: string;
  timestamp: Date;
  userId?: string;
  metadata: {
    deviceInfo: string;
    recordingDuration?: number;
    textLength?: number;
  };
}

export interface UserSession {
  selectedLanguage: Language;
  contributions: DataContribution[];
  totalContributions: number;
}

export interface AppState {
  currentLanguage: Language | null;
  availableLanguages: Language[];
  prompts: Prompt[];
  contributions: DataContribution[];
  isRecording: boolean;
  currentPrompt: Prompt | null;
} 