import { useState, useEffect } from "react";

/**
 * Custom hook for media query matching
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

/**
 * Hook to detect if device supports hover (desktop)
 * @returns boolean indicating hover capability
 */
export function useCanHover(): boolean {
  return useMediaQuery("(hover: hover)");
}
