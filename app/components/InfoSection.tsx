"use client";

import { useState } from "react";
import { InfoData } from "../../types";
import Link from "next/link";

interface InfoSectionProps {
  data: InfoData;
}

export default function InfoSection({ data }: InfoSectionProps) {
  const firstKey = Object.keys(data)[0];
  const [activeInfo, setActiveInfo] = useState<string>(firstKey);

  const handleButtonClick = (key: string) => {
    setActiveInfo(key);
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
                ? "text-white decoration-gray-400 underline underline-offset-4"
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
                    className="text-lg block w-full hover:text-white hover:underline flex items-center gap-2"
                  >
                    <span className="underline underline-offset-4">
                      {link.name}
                    </span>
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
                        className="text-gray-400 flex-shrink-0"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15,3 21,3 21,9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    )}
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
