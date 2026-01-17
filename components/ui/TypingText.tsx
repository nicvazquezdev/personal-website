"use client";
import { useState, useEffect } from "react";
import { ANIMATION } from "@/config";

interface TypingTextProps {
  lines: string[];
  className?: string;
  speed?: number;
  delay?: number;
}

export default function TypingText({
  lines,
  className = "",
  speed = ANIMATION.typing.speed,
  delay = ANIMATION.typing.startDelay,
}: TypingTextProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (currentLineIndex < lines.length - 1) {
      // Move to next line
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, ANIMATION.typing.lineDelay);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex, lines, speed, isTyping]);

  // Build displayed text for each line
  const getDisplayedText = (lineIndex: number) => {
    if (lineIndex < currentLineIndex) {
      // Completed line
      return lines[lineIndex];
    } else if (lineIndex === currentLineIndex) {
      // Currently typing line
      return lines[lineIndex].slice(0, currentCharIndex);
    }
    // Future line
    return "";
  };

  // Check if cursor should be on this line
  const isCursorOnLine = (lineIndex: number) => {
    return lineIndex === currentLineIndex;
  };

  return (
    <span className={className}>
      {lines.map((_, lineIndex) => (
        <span key={lineIndex}>
          {getDisplayedText(lineIndex)}
          {isCursorOnLine(lineIndex) && (
            <span className="inline-block w-[2px] h-[1em] bg-gray-400 ml-0.5 animate-blink align-middle" />
          )}
          {lineIndex < lines.length - 1 && (
            <>
              <span className="md:hidden"> </span>
              <br className="hidden md:block" />
            </>
          )}
        </span>
      ))}
    </span>
  );
}
