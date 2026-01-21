import { useState, useEffect, useCallback } from "react";
import { GLITCH_DURATION } from "../constants";
import type { GlitchState } from "../types";

interface UseGlitchEffectProps {
  isHovered: boolean;
  isAttackMode: boolean;
  isEnteringAttackMode: boolean;
  isExitingAttackMode: boolean;
}

interface UseGlitchEffectReturn extends GlitchState {
  triggerGlitch: (callback?: () => void) => void;
}

export function useGlitchEffect({
  isHovered,
  isAttackMode,
  isEnteringAttackMode,
  isExitingAttackMode,
}: UseGlitchEffectProps): UseGlitchEffectReturn {
  const [isGlitching, setIsGlitching] = useState(false);
  const [showCyberAvatar, setShowCyberAvatar] = useState(false);

  const triggerGlitch = useCallback((callback?: () => void) => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      callback?.();
    }, GLITCH_DURATION);
  }, []);

  // Handle hover glitch effect (disabled during attack mode)
  useEffect(() => {
    if (isAttackMode || isEnteringAttackMode || isExitingAttackMode) return;

    if (isHovered && !showCyberAvatar) {
      setIsGlitching(true);
      const timeout = setTimeout(() => {
        setIsGlitching(false);
        setShowCyberAvatar(true);
      }, GLITCH_DURATION);
      return () => clearTimeout(timeout);
    } else if (!isHovered && showCyberAvatar) {
      setIsGlitching(true);
      const timeout = setTimeout(() => {
        setIsGlitching(false);
        setShowCyberAvatar(false);
      }, GLITCH_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isHovered, showCyberAvatar, isAttackMode, isEnteringAttackMode, isExitingAttackMode]);

  // Reset cyber avatar when entering attack mode
  useEffect(() => {
    if (isEnteringAttackMode) {
      setShowCyberAvatar(false);
    }
  }, [isEnteringAttackMode]);

  // Reset after exiting attack mode
  useEffect(() => {
    if (isExitingAttackMode) {
      setIsGlitching(true);
      const timeout = setTimeout(() => {
        setIsGlitching(false);
        setShowCyberAvatar(false);
      }, GLITCH_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isExitingAttackMode]);

  return { isGlitching, showCyberAvatar, triggerGlitch };
}
