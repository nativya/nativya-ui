// Create new file: app/contribution/hooks/useGlobalUniqueness.ts

import { useState } from "react";

// Assuming UniquenessResponse is defined in your types
import { UniquenessResponse } from "@/app/types";

export function useGlobalUniqueness() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUniqueness = async (
    fingerprints: string[]
  ): Promise<UniquenessResponse | null> => {
    setIsChecking(true);
    setError(null);
    try {
      // NOTE: This assumes you have a proxy API route at /api/uniqueness-check
      // that securely calls your FastAPI service.
      const response = await fetch("/api/uniqueness-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprints }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to check uniqueness");
      }

      return await response.json();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  return { checkUniqueness, isChecking, error };
}
