"use client";
import Image from "next/image";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  startTransition,
} from "react";

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

  // Store values in refs for stable callback reference
  // Rule: advanced-event-handler-refs
  const stateRef = useRef({ clickCount, purpleGlow, isClicked });
  stateRef.current = { clickCount, purpleGlow, isClicked };

  // Reset click state after animation
  useEffect(() => {
    if (!isClicked) return;
    const timeout = setTimeout(() => {
      setIsClicked(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [isClicked]);

  // Clear easter egg message after delay
  useEffect(() => {
    if (!easterEggMessage) return;
    const timeout = setTimeout(() => {
      setEasterEggMessage(null);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [easterEggMessage]);

  // Fade out purple glow gradually
  useEffect(() => {
    if (purpleGlow <= 0) return;

    const interval = setInterval(() => {
      // Use functional setState for stable behavior
      // Rule: rerender-functional-setstate
      setPurpleGlow((prev) => {
        const newValue = prev - 0.02;
        return newValue <= 0 ? 0 : newValue;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [purpleGlow]);

  // Parallax effect - track mouse movement with passive listener
  // Rule: client-event-listeners (passive for scroll/mouse performance)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      // Use startTransition for non-urgent UI updates
      // Rule: rerender-transitions
      startTransition(() => {
        setMousePosition({ x, y });
      });
    };

    // Passive listener for better scroll/animation performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Stable callback using refs - doesn't recreate on state changes
  // Rule: rerender-functional-setstate, advanced-event-handler-refs
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
        transition: "transform 0.3s ease-out",
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

      {/* Avatar */}
      <Image
        src={
          isClicked ? "/floating-avatar-clicked.png" : "/floating-avatar.png"
        }
        alt="Pixel art of a person lying down, floating in nothingness"
        onMouseDown={handleClick}
        className={`transform scale-x-[-1] opacity-50 animate-float cursor-pointer select-none transition-all duration-150 ${
          isClicked ? "scale-95 brightness-125" : ""
        }`}
        style={{
          filter:
            purpleGlow > 0 ? `hue-rotate(${purpleGlow * 30}deg)` : undefined,
        }}
        width={180}
        height={180}
        priority
        draggable={false}
      />
    </div>
  );
}
