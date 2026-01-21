"use client";

import { useState, useCallback } from "react";
import {
  useParallax,
  useGlitchEffect,
  useMuzzleFlash,
  useAttackMode,
  useEasterEgg,
} from "./hooks";
import { AttackModeOverlay, NormalAvatar } from "./components";

export function FloatingAvatar() {
  const [isHovered, setIsHovered] = useState(false);

  const mousePosition = useParallax();

  const {
    isAttackMode,
    isEnteringAttackMode,
    isExitingAttackMode,
    attackMessage,
    triggerAttackMode,
  } = useAttackMode();

  const { isGlitching, showCyberAvatar } = useGlitchEffect({
    isHovered,
    isAttackMode,
    isEnteringAttackMode,
    isExitingAttackMode,
  });

  const muzzleFlashes = useMuzzleFlash({ isAttackMode });

  const { isClicked, easterEggMessage, glowIntensity, handleClick } = useEasterEgg({
    onMaxClicks: triggerAttackMode,
    isAttackMode,
  });

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const isInAttackState = isAttackMode || isEnteringAttackMode;

  return (
    <>
      {isInAttackState && (
        <AttackModeOverlay
          mousePosition={mousePosition}
          isGlitching={isGlitching || isEnteringAttackMode}
          attackMessage={attackMessage}
          muzzleFlashes={muzzleFlashes}
        />
      )}

      {!isInAttackState && (
        <NormalAvatar
          mousePosition={mousePosition}
          isGlitching={isGlitching}
          showCyberAvatar={showCyberAvatar}
          isClicked={isClicked}
          easterEggMessage={easterEggMessage}
          glowIntensity={glowIntensity}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      )}
    </>
  );
}
