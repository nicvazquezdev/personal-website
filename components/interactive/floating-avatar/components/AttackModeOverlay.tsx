import Image from "next/image";
import { ANIMATION, SITE_CONFIG } from "@/config";
import { IMAGE_SIZES } from "../constants";
import type { MuzzleFlash, Position } from "../types";
import { GlitchOverlay } from "./GlitchOverlay";
import { MuzzleFlashEffect } from "./MuzzleFlashEffect";

interface AttackModeOverlayProps {
  mousePosition: Position;
  isGlitching: boolean;
  attackMessage: string | null;
  muzzleFlashes: MuzzleFlash[];
}

export function AttackModeOverlay({
  mousePosition,
  isGlitching,
  attackMessage,
  muzzleFlashes,
}: AttackModeOverlayProps) {
  const imageSize = IMAGE_SIZES.attack;

  const gunPositions = {
    left: { x: -10, y: imageSize * 0.08 },
    right: { x: imageSize + 10, y: imageSize * 0.08 },
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div
        className="relative pointer-events-auto"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: `transform ${ANIMATION.floatingAvatar.parallaxEasing}s ease-out`,
        }}
      >
        {/* Glow effect behind avatar */}
        <div
          className="absolute inset-0 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 1) 0%, rgba(239, 68, 68, 0.6) 50%, transparent 70%)",
            transform: "scale(2.5)",
            opacity: 1,
          }}
        />

        {/* Secondary pulsing glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, transparent 60%)",
            transform: "scale(2)",
            animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />

        {/* Attack mode message */}
        {attackMessage && (
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 text-2xl text-red-500 whitespace-nowrap font-black tracking-widest uppercase z-10"
            style={{
              textShadow:
                "0 0 10px rgba(239, 68, 68, 1), 0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6), 0 0 60px rgba(251, 146, 60, 0.4)",
              animation: "pulse 0.3s ease-in-out infinite",
              letterSpacing: "0.15em",
            }}
          >
            {attackMessage}
          </div>
        )}

        {/* Avatar with glitch effect */}
        <div className="relative">
          {isGlitching && (
            <GlitchOverlay
              currentImage={SITE_CONFIG.images.floatingAvatarAttacking}
              alternateImage={SITE_CONFIG.images.floatingAvatarAttacking}
              size={imageSize}
            />
          )}

          <Image
            src={SITE_CONFIG.images.floatingAvatarAttacking}
            alt="Terminator attacking"
            className={`transform scale-x-[-1] cursor-pointer select-none brightness-110 ${
              isGlitching ? "animate-cyber-glitch" : ""
            }`}
            style={{
              filter: isGlitching
                ? "blur(1px) brightness(1.4) contrast(1.3)"
                : "drop-shadow(0 0 20px rgba(239, 68, 68, 0.9)) drop-shadow(0 0 40px rgba(251, 146, 60, 0.6)) contrast(1.1) saturate(1.2)",
              animation: isGlitching ? undefined : "shake 0.1s linear infinite",
              opacity: 0.9,
            }}
            width={imageSize}
            height={imageSize}
            priority
            draggable={false}
          />

          <MuzzleFlashEffect
            muzzleFlashes={muzzleFlashes}
            gunPositions={gunPositions}
          />
        </div>
      </div>
    </div>
  );
}
