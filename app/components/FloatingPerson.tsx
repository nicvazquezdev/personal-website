"use client";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";

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
      setPurpleGlow((prev) => {
        const newValue = prev - 0.02;
        return newValue <= 0 ? 0 : newValue;
      });
    }, 100); // 5 seconds total (0.02 * 50 steps = 1, 100ms * 50 = 5000ms)

    return () => clearInterval(interval);
  }, [purpleGlow]);

  // Parallax effect - track mouse movement (reduced movement)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClick = useCallback(() => {
    // Ignore clicks while purple glow is active or during click animation
    if (purpleGlow > 0 || isClicked) return;

    setIsClicked(true);
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Show easter egg message if available for this click count
    if (newCount < EASTER_EGG_MESSAGES.length && EASTER_EGG_MESSAGES[newCount]) {
      setEasterEggMessage(EASTER_EGG_MESSAGES[newCount]);
    }

    // Trigger purple glow at max clicks
    if (newCount >= EASTER_EGG_MESSAGES.length - 1) {
      setPurpleGlow(1);
      setClickCount(0);
    }
  }, [clickCount, purpleGlow, isClicked]);

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
