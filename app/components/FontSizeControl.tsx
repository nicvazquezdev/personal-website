"use client";

import { useState, useEffect } from "react";

interface FontSizeControlProps {
  onFontSizeChange?: (size: number) => void;
  className?: string;
}

export default function FontSizeControl({
  onFontSizeChange,
  className = "",
}: FontSizeControlProps) {
  const minSize = 12;
  const maxSize = 24;
  const step = 1;
  const defaultSize = 16;
  const [fontSize, setFontSize] = useState<number>(defaultSize);

  // Notify parent component when font size changes
  useEffect(() => {
    onFontSizeChange?.(fontSize);
  }, [fontSize, onFontSizeChange]);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + step, maxSize);
    setFontSize(newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - step, minSize);
    setFontSize(newSize);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={decreaseFontSize}
        disabled={fontSize <= minSize}
        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded cursor-pointer"
      >
        A-
      </button>
      <span className="text-xs text-gray-400 min-w-[2rem] text-center">
        {fontSize}px
      </span>
      <button
        onClick={increaseFontSize}
        disabled={fontSize >= maxSize}
        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded cursor-pointer"
      >
        A+
      </button>
    </div>
  );
}
