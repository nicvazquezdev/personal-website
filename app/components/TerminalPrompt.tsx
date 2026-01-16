"use client";

import { useSearchParams } from "next/navigation";

const SECTION_COMMANDS: Record<string, string> = {
  thoughts: "cat thoughts.md",
  me: "cat about.txt",
  "open-source": "ls -la projects/",
  "digital-nomad": "cat travels.log",
};

export default function TerminalPrompt() {
  const searchParams = useSearchParams();
  const section = searchParams.get("tab") || "thoughts";
  const command = SECTION_COMMANDS[section] || "cat thoughts.md";

  return (
    <div className="font-mono text-xs">
      <span className="text-white">visitor</span>
      <span className="text-white">@</span>
      <span className="text-white">nicolasvazquez</span>
      <span className="text-gray-500">:</span>
      <span className="text-gray-500">~</span>
      <span className="text-gray-500">$ </span>
      <span className="text-gray-400">{command}</span>
    </div>
  );
}
