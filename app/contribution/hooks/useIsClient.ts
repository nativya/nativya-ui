import { useState, useEffect } from 'react';

/**
 * A custom hook that returns `true` once the component has mounted on the client.
 * This is useful for avoiding hydration mismatches in Next.js when rendering
 * UI that should only appear on the client.
 *
 * @returns {boolean} - `true` if the component is mounted on the client, otherwise `false`.
 */
export function useIsClient() {
  // State to track if the component is mounted. Defaults to false.
  const [isClient, setIsClient] = useState(false);

  // useEffect runs only on the client after the component mounts.
  useEffect(() => {
    // When the effect runs, we set isClient to true.
    setIsClient(true);
  }, []); // The empty dependency array ensures this effect runs only once.

  return isClient;
}
