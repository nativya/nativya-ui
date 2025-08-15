// File: app/types/index.ts
// Description: Centralized type definitions for the application.

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
  category: "daily" | "culture" | "food" | "travel" | "family" | "custom";
  examples?: string[];
}

export interface AudioData {
  base64: string;
  mimeType: string;
  size: number;
  name: string;
  duration: number;
}

export type ContributionData = {
  contributionId: string;
  encryptedUrl: string;
  transactionReceipt: {
    hash: string;
    blockNumber?: number;
  };
  fileId?: number;
  teeProofData?: Record<string, unknown>;
  teeJobId?: number;
  rewardTxHash?: string;
};

export interface Data {
  languageCode: string;
  promptId: string;
  textContent?: string;
  audioData?: AudioData;
  timestamp: Date;
  metadata: {
    recordingDuration?: number;
    textLength?: number;
  };
}

export interface AppState {
  currentLanguage: Language | null;
  availableLanguages: Language[];
  prompts: Prompt[];
  contributions: Data[];
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

// --- NEWLY ADDED ---
// Defines the structure of the JSON response from the Global Integrity Service.
export interface UniquenessResponse {
  total_fingerprints_received: number;
  new_fingerprints_found: number;
  duplicate_fingerprints_found: number;
  global_uniqueness_score: number;
}

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
