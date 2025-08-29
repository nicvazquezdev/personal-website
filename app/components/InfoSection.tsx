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
      <div className="flex flex-wrap gap-4 font-mono text-sm">
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
        <div className="font-mono text-gray-300 leading-relaxed py-2 animate-in fade-in duration-200">
          {data[activeInfo].content && <p>{data[activeInfo].content}</p>}
          {data[activeInfo].links && (
            <div className="space-y-3 w-full">
              {data[activeInfo].links!.map((link, index) => (
                <div key={index} className="w-full">
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 text-sm block w-full hover:text-white"
                  >
                    {link.name}
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
