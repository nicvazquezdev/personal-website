"use client";
import { useEffect, useState, useCallback, useMemo } from "react";

interface LastUpdatedProps {
  lastCommitDate: string;
}

// Hoist DateTimeFormat for fallback date display
// Rule: js-cache-function-results
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

// Time constants - hoisted to avoid recreation
const MS_PER_MINUTE = 1000 * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

export default function LastUpdated({ lastCommitDate }: LastUpdatedProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  // Parse commit date once and memoize
  // Rule: rerender-lazy-state-init (for computed values)
  const commitDate = useMemo(() => new Date(lastCommitDate), [lastCommitDate]);

  // Memoize calculateTimeAgo to avoid recreation in setInterval
  // Rule: rerender-functional-setstate
  const calculateTimeAgo = useCallback(() => {
    const now = new Date();
    const diffMs = now.getTime() - commitDate.getTime();

    const minutes = Math.floor(diffMs / MS_PER_MINUTE);
    const hours = Math.floor(diffMs / MS_PER_HOUR);
    const days = Math.floor(diffMs / MS_PER_DAY);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "yesterday";
    if (days < 30) return `${days}d ago`;
    return dateFormatter.format(commitDate);
  }, [commitDate]);

  useEffect(() => {
    setTimeAgo(calculateTimeAgo());

    // Update every minute
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000);

    return () => clearInterval(interval);
  }, [calculateTimeAgo]);

  if (!timeAgo) return null;

  return (
    <div className="text-xs text-gray-600 font-mono tracking-wider">
      <span>updated</span>{" "}
      <span className="text-gray-500">{timeAgo}</span>
    </div>
  );
}
