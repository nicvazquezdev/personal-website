"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { InfoData } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { linkifyText } from "@/lib/utils";
import FontSizeControl from "./FontSizeControl";

// Hoist external link icon outside component to avoid recreation
// Rule: rendering-hoist-jsx
const externalLinkIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block ml-1 opacity-50 group-hover:opacity-70 transition-opacity"
    aria-hidden="true"
  >
    <path d="M3.5 3h5.5v5.5M9 3L3 9" />
  </svg>
);

interface InfoSectionProps {
  data: InfoData;
}

export default function InfoSection({ data }: InfoSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize firstKey to avoid recalculation
  const firstKey = useMemo(() => Object.keys(data)[0], [data]);

  // Use lazy state initialization
  // Rule: rerender-lazy-state-init
  const [activeInfo, setActiveInfo] = useState<string>(() => {
    const tab = searchParams.get("tab");
    if (tab && data[tab]) {
      return tab;
    }
    return firstKey;
  });
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
      // Read URL on demand instead of subscribing to searchParams
      // Rule: rerender-defer-reads
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

  // Memoize callbacks to prevent recreation
  // Rule: rerender-functional-setstate
  const handleButtonClick = useCallback(
    (key: string) => {
      setActiveInfo(key);

      if (key === firstKey) {
        router.push("/", { scroll: false });
      } else {
        router.push(`/?tab=${key}`, { scroll: false });
      }
    },
    [firstKey, router]
  );

  // Stable callback - doesn't depend on external state
  const handleFontSizeChange = useCallback((newSize: number) => {
    setFontSize(newSize);
  }, []);

  // Use ref to access canHover without adding it to dependencies
  const canHoverRef = useRef(canHover);
  canHoverRef.current = canHover;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!canHoverRef.current) return;

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
    },
    []
  );

  // Use functional setState for stable callback
  const handleMouseLeave = useCallback(() => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div className="space-y-6">
      <div
        ref={navRef}
        className="relative flex flex-wrap gap-1 text-sm"
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute top-0 h-full rounded-lg bg-[#232323] transition-all duration-300 ease-in-out pointer-events-none"
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
            className={`relative z-10 px-3 py-1.5 rounded-lg md:text-base cursor-pointer transition-colors duration-150 ${
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
                    className="group inline-flex items-baseline hover:text-white text-sm md:text-base"
                  >
                    <span className="border-b border-gray-400 group-hover:border-gray-300 pb-0.5">
                      {link.name}
                    </span>
                    {link.url.startsWith("http") ? externalLinkIcon : null}
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
