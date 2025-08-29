"use client";

import { useState, useEffect } from "react";
import { InfoData } from "../../types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface InfoSectionProps {
  data: InfoData;
}

export default function InfoSection({ data }: InfoSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstKey = Object.keys(data)[0]; // This should be "thoughts"

  // Get initial active section from URL
  const getInitialActiveSection = () => {
    const section = searchParams.get("section");
    if (section && data[section]) {
      return section;
    }
    return firstKey; // Default to first section (thoughts)
  };

  const [activeInfo, setActiveInfo] = useState<string>(getInitialActiveSection);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const section = urlParams.get("section");
      if (section && data[section]) {
        setActiveInfo(section);
      } else {
        setActiveInfo(firstKey);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [data, firstKey]);

  const handleButtonClick = (key: string) => {
    setActiveInfo(key);

    // If it's the first section (thoughts), use base URL
    if (key === firstKey) {
      router.push("/", { scroll: false });
    } else {
      // For other sections, use query parameter
      router.push(`/?section=${key}`, { scroll: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 text-sm">
        {Object.entries(data).map(([key, item]) => (
          <button
            key={key}
            onClick={() => handleButtonClick(key)}
            className={`hover:text-white text-lg md:text-base cursor-pointer ${
              activeInfo === key
                ? "text-white decoration-gray-400"
                : "text-gray-400 hover:decoration-gray-500"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {activeInfo && (
        <div className="text-gray-300 leading-relaxed animate-in fade-in duration-200">
          {data[activeInfo].content && (
            <div className="whitespace-pre-line max-w-3xl text-lg">
              {data[activeInfo].content}
            </div>
          )}
          {data[activeInfo].links && (
            <div className="space-y-3 max-w-md">
              {data[activeInfo].links!.map((link, index) => (
                <div key={index} className="w-full">
                  <Link
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-lg md:text-base inline-block hover:text-white underline  underline-offset-4 hover:underline"
                  >
                    <span className="relative">
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
