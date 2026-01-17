"use client";

import { useState, useCallback, useEffect } from "react";
import { InfoItem } from "@/types";
import { linkifyText } from "@/lib/utils";
import { FontSizeControl } from "@/components/interactive";
import LinksList from "./LinksList";

interface InfoContentProps {
  item: InfoItem;
}

export default function InfoContent({ item }: InfoContentProps) {
  const [fontSize, setFontSize] = useState<number>(16);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFontSizeChange = useCallback((newSize: number) => {
    setFontSize(newSize);
  }, []);

  return (
    <div className="text-gray-300 leading-relaxed animate-in fade-in duration-200">
      {/* Subtitle */}
      {item.subtitle && (
        <div className="mb-4 text-lg md:text-xl">{item.subtitle}</div>
      )}

      {/* Text content with font size control */}
      {item.content && (
        <div>
          <div className="hidden md:block">
            <FontSizeControl
              onFontSizeChange={handleFontSizeChange}
              className="mb-8"
            />
          </div>
          <div
            className="whitespace-pre-line break-words overflow-hidden md:max-w-3xl"
            style={isClient ? { fontSize: `${fontSize}px` } : {}}
          >
            {linkifyText(item.content)}
          </div>
        </div>
      )}

      {/* Links list */}
      {item.links && <LinksList links={item.links} />}
    </div>
  );
}
