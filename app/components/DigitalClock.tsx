"use client";
import { useEffect, useState, useCallback } from "react";

// Hoist DateTimeFormat outside component - expensive to create
// Rule: js-cache-function-results
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Argentina/Buenos_Aires",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export default function DigitalClock() {
  const [time, setTime] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Memoize updateTime to avoid recreation
  const updateTime = useCallback(() => {
    setTime(timeFormatter.format(new Date()));
  }, []);

  useEffect(() => {
    setIsClient(true);
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  if (!isClient) return null;

  return (
    <div className="text-xs text-gray-600 font-mono tracking-wider">
      <span >BUE</span>{" "}
      <span className="text-gray-500">{time}</span>
    </div>
  );
}
