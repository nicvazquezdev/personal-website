"use client";

import { useState, useCallback } from "react";

interface FontSizeControlProps {
  defaultSize?: number;
  onFontSizeChange?: (size: number) => void;
  className?: string;
}

// Constants hoisted outside component
// Rule: rendering-hoist-jsx (applies to constants too)
const MIN_SIZE = 12;
const MAX_SIZE = 24;
const STEP = 2;

export default function FontSizeControl({
  defaultSize = 16,
  onFontSizeChange,
  className = "",
}: FontSizeControlProps) {
  const [fontSize, setFontSize] = useState<number>(defaultSize);

  // Call callback after state update, not inside setState
  // Rule: rerender-functional-setstate
  const increaseFontSize = useCallback(() => {
    const newSize = Math.min(fontSize + STEP, MAX_SIZE);
    setFontSize(newSize);
    onFontSizeChange?.(newSize);
  }, [fontSize, onFontSizeChange]);

  const decreaseFontSize = useCallback(() => {
    const newSize = Math.max(fontSize - STEP, MIN_SIZE);
    setFontSize(newSize);
    onFontSizeChange?.(newSize);
  }, [fontSize, onFontSizeChange]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={decreaseFontSize}
        disabled={fontSize <= MIN_SIZE}
        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded cursor-pointer"
      >
        A-
      </button>
      <span className="text-xs text-gray-400 min-w-[2rem] text-center">
        {fontSize}px
      </span>
      <button
        onClick={increaseFontSize}
        disabled={fontSize >= MAX_SIZE}
        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded cursor-pointer"
      >
        A+
      </button>
    </div>
  );
}
