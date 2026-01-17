"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InfoData } from "@/types";
import InfoNavigation from "./InfoNavigation";
import InfoContent from "./InfoContent";

interface InfoSectionProps {
  data: InfoData;
}

export default function InfoSection({ data }: InfoSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize firstKey to avoid recalculation
  const firstKey = useMemo(() => Object.keys(data)[0], [data]);

  // Use lazy state initialization
  const [activeInfo, setActiveInfo] = useState<string>(() => {
    const tab = searchParams.get("tab");
    if (tab && data[tab]) {
      return tab;
    }
    return firstKey;
  });

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

  // Handle tab click with URL update
  const handleTabClick = useCallback(
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

  return (
    <div className="space-y-6">
      <InfoNavigation
        data={data}
        activeInfo={activeInfo}
        onTabClick={handleTabClick}
      />

      {activeInfo && data[activeInfo] && (
        <InfoContent item={data[activeInfo]} />
      )}
    </div>
  );
}
