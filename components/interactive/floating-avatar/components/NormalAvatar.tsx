import Image from "next/image";
import { ANIMATION, SITE_CONFIG } from "@/config";
import { IMAGE_SIZES } from "../constants";
import type { Position } from "../types";
import { GlitchOverlay } from "./GlitchOverlay";

interface NormalAvatarProps {
  mousePosition: Position;
  isGlitching: boolean;
  showCyberAvatar: boolean;
  isClicked: boolean;
  easterEggMessage: string | null;
  glowIntensity: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export function NormalAvatar({
  mousePosition,
  isGlitching,
  showCyberAvatar,
  isClicked,
  easterEggMessage,
  glowIntensity,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: NormalAvatarProps) {
  const imageSize = IMAGE_SIZES.normal;

  const getCurrentAvatar = () => {
    if (isClicked) {
      return SITE_CONFIG.images.floatingAvatarClicked;
    }
    if (showCyberAvatar) {
      return SITE_CONFIG.images.floatingAvatarCyber;
    }
    return SITE_CONFIG.images.floatingAvatar;
  };

  const glowColor = `rgba(255, 255, 255, ${glowIntensity})`;

  return (
    <div
      className="hidden md:block absolute right-0 top-40 md:top-80 md:right-120"
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        transition: `transform ${ANIMATION.floatingAvatar.parallaxEasing}s ease-out`,
      }}
    >
      {/* Glow effect behind avatar */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-500"
        style={{
          background: glowColor,
          transform: "scale(1.2)",
          opacity: 0.6 + glowIntensity,
        }}
      />

      {/* Easter egg message */}
      {easterEggMessage && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-gray-400 whitespace-nowrap animate-pulse font-light">
          {easterEggMessage}
        </div>
      )}

      {/* Avatar container with glitch effect */}
      <div
        className="relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Glitch overlay layers */}
        {isGlitching && (
          <GlitchOverlay
            currentImage={getCurrentAvatar()}
            alternateImage={
              showCyberAvatar
                ? SITE_CONFIG.images.floatingAvatar
                : SITE_CONFIG.images.floatingAvatarCyber
            }
            size={imageSize}
          />
        )}

        {/* Main Avatar */}
        <Image
          src={getCurrentAvatar()}
          alt="Pixel art avatar"
          onMouseDown={onClick}
          className={`transform scale-x-[-1] opacity-50 cursor-pointer select-none transition-all duration-150 animate-float ${
            isClicked ? "scale-95 brightness-125" : ""
          } ${isGlitching ? "animate-cyber-glitch" : ""}`}
          style={{
            filter: isGlitching
              ? "blur(1px) brightness(1.4) contrast(1.3)"
              : undefined,
          }}
          width={imageSize}
          height={imageSize}
          priority
          draggable={false}
        />
      </div>
    </div>
  );
}
