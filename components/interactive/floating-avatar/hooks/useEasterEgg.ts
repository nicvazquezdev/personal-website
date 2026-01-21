import { useState, useEffect, useCallback, useRef } from "react";
import { ANIMATION } from "@/config";
import { EASTER_EGG_MESSAGES } from "../constants";

interface UseEasterEggProps {
  onMaxClicks: () => void;
  isAttackMode: boolean;
}

interface UseEasterEggReturn {
  clickCount: number;
  isClicked: boolean;
  easterEggMessage: string | null;
  glowIntensity: number;
  handleClick: () => void;
}

export function useEasterEgg({
  onMaxClicks,
  isAttackMode,
}: UseEasterEggProps): UseEasterEggReturn {
  const [clickCount, setClickCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);

  const stateRef = useRef({ isClicked, isAttackMode });
  stateRef.current = { isClicked, isAttackMode };

  // Reset click state after animation
  useEffect(() => {
    if (!isClicked) return;
    const timeout = setTimeout(() => {
      setIsClicked(false);
    }, ANIMATION.floatingAvatar.clickAnimationDuration);
    return () => clearTimeout(timeout);
  }, [isClicked]);

  // Clear easter egg message after delay
  useEffect(() => {
    if (!easterEggMessage) return;
    const timeout = setTimeout(() => {
      setEasterEggMessage(null);
    }, ANIMATION.floatingAvatar.easterEggMessageDuration);
    return () => clearTimeout(timeout);
  }, [easterEggMessage]);

  const handleClick = useCallback(() => {
    const { isClicked, isAttackMode } = stateRef.current;

    if (isAttackMode || isClicked) return;

    setIsClicked(true);
    setClickCount((prev) => {
      const newCount = prev + 1;

      if (
        newCount < EASTER_EGG_MESSAGES.length &&
        EASTER_EGG_MESSAGES[newCount]
      ) {
        setEasterEggMessage(EASTER_EGG_MESSAGES[newCount]);
      }

      if (newCount >= EASTER_EGG_MESSAGES.length - 1) {
        onMaxClicks();
        return 0;
      }

      return newCount;
    });
  }, [onMaxClicks]);

  const glowIntensity = Math.min(clickCount * 0.1, 0.5);

  return {
    clickCount,
    isClicked,
    easterEggMessage,
    glowIntensity,
    handleClick,
  };
}
