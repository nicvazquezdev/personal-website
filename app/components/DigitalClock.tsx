"use client";
import { useEffect, useState } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Argentina/Buenos_Aires",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(now.toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="text-xs text-gray-600 font-mono tracking-wider">
      <span className="opacity-50">BUE</span>{" "}
      <span className="text-gray-500">{time}</span>
    </div>
  );
}
