import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function safeParseDate(
  date: Date | string | null | undefined
): Date | null {
  if (!date) return null;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return isNaN(dateObj.getTime()) ? null : dateObj;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}

export function formatDate(date: Date | string | null | undefined): string {
  try {
    const dateObj = safeParseDate(date);

    if (!dateObj) {
      return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

export function getDeviceInfo(): string {
  if (typeof window === "undefined") return "server";

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;

  return `${platform} - ${language} - ${userAgent.substring(0, 50)}...`;
}
