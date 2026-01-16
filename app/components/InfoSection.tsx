"use client";

import { useState, useEffect, useRef } from "react";
import { InfoData } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { linkifyText } from "@/lib/utils";
import FontSizeControl from "./FontSizeControl";

interface InfoSectionProps {
  data: InfoData;
}

export default function InfoSection({ data }: InfoSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstKey = Object.keys(data)[0]; // This should be "thoughts"

  // Get initial active tab from URL
  const getInitialActiveTab = () => {
    const tab = searchParams.get("tab");
    if (tab && data[tab]) {
      return tab;
    }
    return firstKey; // Default to first tab (thoughts)
  };

  const [activeInfo, setActiveInfo] = useState<string>(getInitialActiveTab);
  const [fontSize, setFontSize] = useState<number>(16);
  const [isClient, setIsClient] = useState(false);

  // Hover highlight state
  const navRef = useRef<HTMLDivElement>(null);
  const [hoverStyle, setHoverStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  const [canHover, setCanHover] = useState(false);

  // Handle client-side hydration and detect hover capability
  useEffect(() => {
    setIsClient(true);
    // Check if device supports hover (desktop)
    const mediaQuery = window.matchMedia("(hover: hover)");
    setCanHover(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get("tab");
      if (tab && data[tab]) {
        setActiveInfo(tab);
      } else {
        setActiveInfo(firstKey);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [data, firstKey]);

  const handleButtonClick = (key: string) => {
    setActiveInfo(key);

    // If it's the first tab (thoughts), use base URL
    if (key === firstKey) {
      router.push("/", { scroll: false });
    } else {
      // For other tabs, use query parameter
      router.push(`/?tab=${key}`, { scroll: false });
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canHover) return;

    const button = e.currentTarget;
    const nav = navRef.current;
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setHoverStyle({
      left: buttonRect.left - navRect.left,
      width: buttonRect.width,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="space-y-6">
      <div
        ref={navRef}
        className="relative flex flex-wrap gap-1 text-sm"
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute top-0 h-full rounded-md bg-gray-800 transition-all duration-150 ease-out pointer-events-none"
          style={{
            left: hoverStyle.left,
            width: hoverStyle.width,
            opacity: hoverStyle.opacity,
          }}
        />
        {Object.entries(data).map(([key, item]) => (
          <button
            key={key}
            onClick={() => handleButtonClick(key)}
            onMouseEnter={handleMouseEnter}
            className={`relative z-10 px-3 py-1.5 rounded-md md:text-base cursor-pointer transition-colors duration-150 ${
              activeInfo === key
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {activeInfo && data[activeInfo] && (
        <div className="text-gray-300 leading-relaxed animate-in fade-in duration-200">
          {data[activeInfo].subtitle && (
            <div className="mb-4 text-lg md:text-xl">
              {data[activeInfo].subtitle}
            </div>
          )}

          {data[activeInfo].content && (
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
                {linkifyText(data[activeInfo].content)}
              </div>
            </div>
          )}
          {data[activeInfo].links && (
            <div className="space-y-3">
              {data[activeInfo].links.map((link, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col md:flex-row md:items-end gap-1 md:gap-2"
                >
                  {link.date && (
                    <div className="text-gray-400 text-sm md:text-xs">
                      {link.date}
                    </div>
                  )}
                  <Link
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-block hover:text-white text-sm md:text-base"
                  >
                    <span className="relative border-b border-gray-400 hover:border-gray-300 pb-0.5">
                      {link.name}
                      {link.url.startsWith("http") && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                          className="text-gray-400 absolute top-[5] right-[-20]"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15,3 21,3 21,9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      )}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
