import { DefaultSession } from "next-auth";


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

// export interface DataContribution {
//   id: string;
//   languageCode: string;
//   promptId: string;
//   textContent?: string;
//   audioBlob?: Blob | string;
//   audioUrl?: string;
//   timestamp: Date;
//   userId?: string;
//   metadata: {
//     // deviceInfo: string;
//     recordingDuration?: number;
//     textLength?: number;
//   };
// }

export interface AudioData {
  base64: string;
  mimeType: string;
  size: number;
  name: string;
  duration: number;
}

export interface DataContribution {
  id: string;
  languageCode: string;
  promptId: string;
  textContent: string;
  audioData?: AudioData; // Replace audioBlob with audioData
  audioUrl?: string;
  timestamp: Date;
  userId: string;
  metadata: {
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

export type DriveInfo = {
  percentUsed: number;
};

export type UserInfo = {
  id?: string;
  name: string;
  email: string;
  locale?: string;
};


declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    user: DefaultSession["user"] & {
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
  }
} 
