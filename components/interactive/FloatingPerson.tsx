"use client";
import Image from "next/image";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { ANIMATION, SITE_CONFIG } from "@/config";

const GLITCH_DURATION = 400;

const EASTER_EGG_MESSAGES = [
  null,
  null,
  null,
  "hey...",
  null,
  "stop that",
  null,
  null,
  "seriously?",
  null,
  null,
];

export default function FloatingPerson() {
  const [clickCount, setClickCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);
  const [purpleGlow, setPurpleGlow] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showCyberAvatar, setShowCyberAvatar] = useState(false);

  // Store values in refs for stable callback reference
  const stateRef = useRef({ clickCount, purpleGlow, isClicked });
  stateRef.current = { clickCount, purpleGlow, isClicked };

  // Handle hover glitch effect
  useEffect(() => {
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
  }, [isHovered, showCyberAvatar]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Reset click state after animation
  useEffect(() => {
    if (!isClicked) return;
    const timeout = setTimeout(() => {
      setIsClicked(false);
    }, ANIMATION.floatingPerson.clickAnimationDuration);
    return () => clearTimeout(timeout);
  }, [isClicked]);

  // Clear easter egg message after delay
  useEffect(() => {
    if (!easterEggMessage) return;
    const timeout = setTimeout(() => {
      setEasterEggMessage(null);
    }, ANIMATION.floatingPerson.easterEggMessageDuration);
    return () => clearTimeout(timeout);
  }, [easterEggMessage]);

  // Fade out purple glow gradually
  useEffect(() => {
    if (purpleGlow <= 0) return;

    const interval = setInterval(() => {
      // Use functional setState for stable behavior
      setPurpleGlow((prev) => {
        const newValue = prev - ANIMATION.floatingPerson.purpleGlowFadeAmount;
        return newValue <= 0 ? 0 : newValue;
      });
    }, ANIMATION.floatingPerson.purpleGlowFadeInterval);

    return () => clearInterval(interval);
  }, [purpleGlow]);

  // Parallax effect - track mouse movement with passive listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x =
        (e.clientX / window.innerWidth - 0.5) *
        ANIMATION.floatingPerson.parallaxFactor;
      const y =
        (e.clientY / window.innerHeight - 0.5) *
        ANIMATION.floatingPerson.parallaxFactor;
      // Use startTransition for non-urgent UI updates
      startTransition(() => {
        setMousePosition({ x, y });
      });
    };

    // Passive listener for better scroll/animation performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Stable callback using refs - doesn't recreate on state changes
  const handleClick = useCallback(() => {
    const { purpleGlow, isClicked } = stateRef.current;

    // Ignore clicks while purple glow is active or during click animation
    if (purpleGlow > 0 || isClicked) return;

    setIsClicked(true);
    // Use functional setState to avoid stale closure
    setClickCount((prev) => {
      const newCount = prev + 1;

      // Show easter egg message if available for this click count
      if (
        newCount < EASTER_EGG_MESSAGES.length &&
        EASTER_EGG_MESSAGES[newCount]
      ) {
        setEasterEggMessage(EASTER_EGG_MESSAGES[newCount]);
      }

      // Trigger purple glow at max clicks
      if (newCount >= EASTER_EGG_MESSAGES.length - 1) {
        setPurpleGlow(1);
        return 0; // Reset count
      }

      return newCount;
    });
  }, []); // Empty deps - uses refs for current values

  // Calculate glow intensity based on click count
  const glowIntensity = Math.min(clickCount * 0.1, 0.5);
  const glowColor =
    purpleGlow > 0
      ? `rgba(147, 51, 234, ${purpleGlow * 0.4})`
      : `rgba(255, 255, 255, ${glowIntensity})`;

  return (
    <div
      className="hidden md:block absolute right-0 top-40 md:top-80 md:right-120"
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        transition: `transform ${ANIMATION.floatingPerson.parallaxEasing}s ease-out`,
      }}
    >
      {/* Glow effect behind avatar */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-500"
        style={{
          background: glowColor,
          transform: "scale(1.2)",
          opacity: 0.6 + glowIntensity + purpleGlow * 0.4,
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glitch overlay layers - cyan channel */}
        {isGlitching && (
          <>
            <Image
              src={showCyberAvatar ? SITE_CONFIG.images.floatingAvatar : SITE_CONFIG.images.floatingAvatarCyber}
              alt=""
              className="absolute inset-0 scale-x-[-1] opacity-50 pointer-events-none animate-cyber-glitch"
              style={{
                filter: "blur(2px) brightness(1.5) hue-rotate(180deg)",
                left: "4px",
                mixBlendMode: "screen",
              }}
              width={180}
              height={180}
              draggable={false}
            />
            {/* Glitch overlay - magenta channel */}
            <Image
              src={showCyberAvatar ? SITE_CONFIG.images.floatingAvatar : SITE_CONFIG.images.floatingAvatarCyber}
              alt=""
              className="absolute inset-0 scale-x-[-1] opacity-50 pointer-events-none animate-cyber-glitch"
              style={{
                filter: "blur(2px) hue-rotate(280deg) brightness(1.5)",
                left: "-4px",
                mixBlendMode: "screen",
                animationDelay: "-0.1s",
              }}
              width={180}
              height={180}
              draggable={false}
            />
          </>
        )}

        {/* Main Avatar */}
        <Image
          src={
            isClicked
              ? SITE_CONFIG.images.floatingAvatarClicked
              : showCyberAvatar
                ? SITE_CONFIG.images.floatingAvatarCyber
                : SITE_CONFIG.images.floatingAvatar
          }
          alt="Pixel art of a person lying down, floating in nothingness"
          onMouseDown={handleClick}
          className={`transform scale-x-[-1] opacity-50 animate-float cursor-pointer select-none transition-all duration-150 ${
            isClicked ? "scale-95 brightness-125" : ""
          } ${isGlitching ? "animate-cyber-glitch" : ""}`}
          style={{
            filter: isGlitching
              ? `blur(1px) brightness(1.4) contrast(1.3)`
              : purpleGlow > 0
                ? `hue-rotate(${purpleGlow * 30}deg)`
                : undefined,
          }}
          width={180}
          height={180}
          priority
          draggable={false}
        />
      </div>
    </div>
  );
}
