import { useState, useCallback, useRef, RefObject } from "react";
import { useCanHover } from "./useMediaQuery";

interface HoverStyle {
  left: number;
  width: number;
  opacity: number;
}

interface UseHoverHighlightReturn {
  hoverStyle: HoverStyle;
  handleMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
  navRef: RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for hover highlight effect on navigation elements
 * @returns Object with hover style, event handlers, and ref
 */
export function useHoverHighlight(): UseHoverHighlightReturn {
  const navRef = useRef<HTMLDivElement>(null);
  const [hoverStyle, setHoverStyle] = useState<HoverStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const canHover = useCanHover();

  // Use ref to access canHover without adding it to dependencies
  const canHoverRef = useRef(canHover);
  canHoverRef.current = canHover;

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!canHoverRef.current) return;

    const element = e.currentTarget;
    const nav = navRef.current;
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    setHoverStyle({
      left: elementRect.left - navRect.left,
      width: elementRect.width,
      opacity: 1,
    });
  }, []);

  // Use functional setState for stable callback
  const handleMouseLeave = useCallback(() => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return {
    hoverStyle,
    handleMouseEnter,
    handleMouseLeave,
    navRef,
  };
}
