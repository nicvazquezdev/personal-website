"use client";
import { useEffect, useState } from "react";

interface LastUpdatedProps {
  lastCommitDate: string;
}

export default function LastUpdated({ lastCommitDate }: LastUpdatedProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const commitDate = new Date(lastCommitDate);
      const now = new Date();
      const diffMs = now.getTime() - commitDate.getTime();

      const minutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (minutes < 1) return "just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days === 1) return "yesterday";
      if (days < 30) return `${days}d ago`;
      return commitDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    setTimeAgo(calculateTimeAgo());

    // Update every minute
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000);

    return () => clearInterval(interval);
  }, [lastCommitDate]);

  if (!timeAgo) return null;

  return (
    <div className="text-xs text-gray-600 font-mono tracking-wider">
      <span className="opacity-50">updated</span>{" "}
      <span className="text-gray-500">{timeAgo}</span>
    </div>
  );
}
