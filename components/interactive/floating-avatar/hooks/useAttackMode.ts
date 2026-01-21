import { useState, useEffect, useCallback } from "react";
import { ANIMATION } from "@/config";
import { GLITCH_DURATION } from "../constants";
import type { AttackModeState } from "../types";

interface UseAttackModeReturn extends AttackModeState {
  triggerAttackMode: () => void;
}

export function useAttackMode(): UseAttackModeReturn {
  const [isAttackMode, setIsAttackMode] = useState(false);
  const [isEnteringAttackMode, setIsEnteringAttackMode] = useState(false);
  const [isExitingAttackMode, setIsExitingAttackMode] = useState(false);
  const [attackMessage, setAttackMessage] = useState<string | null>(null);

  const triggerAttackMode = useCallback(() => {
    setIsEnteringAttackMode(true);
  }, []);

  // Attack mode entry transition
  useEffect(() => {
    if (!isEnteringAttackMode) return;

    const glitchTimeout = setTimeout(() => {
      setIsEnteringAttackMode(false);
      setIsAttackMode(true);
      setAttackMessage("hasta la vista, baby");
    }, GLITCH_DURATION);

    return () => clearTimeout(glitchTimeout);
  }, [isEnteringAttackMode]);

  // Attack mode duration timer
  useEffect(() => {
    if (!isAttackMode) return;

    const exitTimeout = setTimeout(() => {
      setIsExitingAttackMode(true);
      setIsAttackMode(false);
    }, ANIMATION.floatingAvatar.attackModeDuration);

    return () => clearTimeout(exitTimeout);
  }, [isAttackMode]);

  // Exit attack mode transition
  useEffect(() => {
    if (!isExitingAttackMode) return;

    const glitchTimeout = setTimeout(() => {
      setIsExitingAttackMode(false);
      setAttackMessage(null);
    }, GLITCH_DURATION);

    return () => clearTimeout(glitchTimeout);
  }, [isExitingAttackMode]);

  // Clear attack message when fully exited
  useEffect(() => {
    if (!isAttackMode && !isEnteringAttackMode && !isExitingAttackMode) {
      setAttackMessage(null);
    }
  }, [isAttackMode, isEnteringAttackMode, isExitingAttackMode]);

  return {
    isAttackMode,
    isEnteringAttackMode,
    isExitingAttackMode,
    attackMessage,
    triggerAttackMode,
  };
}
