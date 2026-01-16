"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// Hoisted outside component to prevent recreation on each render
const TerminalPrompt = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex items-center text-xs">
    <span className="text-white">visitor</span>
    <span className="text-white">@</span>
    <span className="text-white">nicolasvazquez</span>
    <span className="text-gray-500">:</span>
    <span className="text-gray-500">~</span>
    <span className="text-gray-500">$ </span>
    {children}
  </div>
);

// Command definitions with their routes
const COMMANDS: Record<string, { route: string; description: string }> = {
  "cd ~": { route: "/", description: "go home" },
  "cd": { route: "/", description: "go home" },
  "cat thoughts.md": { route: "/?tab=thoughts", description: "read my blog" },
  "thoughts": { route: "/?tab=thoughts", description: "read my blog" },
  "whoami": { route: "/?tab=me", description: "about me" },
  "cat about.txt": { route: "/?tab=me", description: "about me" },
  "me": { route: "/?tab=me", description: "about me" },
  "ls -la projects/": {
    route: "/?tab=open-source",
    description: "open source projects",
  },
  "projects": { route: "/?tab=open-source", description: "open source projects" },
  "cat travels.log": {
    route: "/?tab=digital-nomad",
    description: "digital nomad journey",
  },
  "travels": { route: "/?tab=digital-nomad", description: "digital nomad journey" },
  "help": { route: "", description: "show available commands" },
  "clear": { route: "", description: "clear terminal" },
};

interface HistoryEntry {
  command: string;
  output?: string;
  isError?: boolean;
}

export default function InteractiveTerminal() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on mount and when clicking the terminal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const getHelpText = () => {
    return `available commands:
  cd ~              go home
  cat thoughts.md   read my blog
  whoami            about me
  ls -la projects/  open source projects
  cat travels.log   digital nomad journey
  clear             clear terminal
  help              show this message

shortcuts: thoughts, me, projects, travels`;
  };

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim().toLowerCase();

      if (!trimmedCmd) return;

      // Add to command history
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      // Handle clear command
      if (trimmedCmd === "clear") {
        setHistory([]);
        return;
      }

      // Handle help command
      if (trimmedCmd === "help") {
        setHistory((prev) => [
          ...prev,
          { command: cmd },
          { command: "", output: getHelpText() },
        ]);
        return;
      }

      // Find matching command
      const matchedCommand = Object.keys(COMMANDS).find(
        (key) => key.toLowerCase() === trimmedCmd
      );

      if (matchedCommand && COMMANDS[matchedCommand].route) {
        setHistory((prev) => [
          ...prev,
          { command: cmd },
          { command: "", output: `navigating to ${COMMANDS[matchedCommand].description}...` },
        ]);
        // Small delay for visual feedback
        setTimeout(() => {
          router.push(COMMANDS[matchedCommand].route);
        }, 300);
      } else {
        setHistory((prev) => [
          ...prev,
          { command: cmd },
          {
            command: "",
            output: `command not found: ${trimmedCmd}\ntype 'help' for available commands`,
            isError: true,
          },
        ]);
      }
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCommand(input);
        setInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setInput("");
          } else {
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        // Simple autocomplete
        const matches = Object.keys(COMMANDS).filter((cmd) =>
          cmd.toLowerCase().startsWith(input.toLowerCase())
        );
        if (matches.length === 1) {
          setInput(matches[0]);
        }
      }
    },
    [input, handleCommand, commandHistory, historyIndex]
  );

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      className="space-y-1 max-h-48 overflow-y-auto cursor-text"
    >
      {/* Command history */}
      {history.map((entry, index) => (
        <div key={index}>
          {entry.command && (
            <TerminalPrompt>
              <span className="text-gray-400">{entry.command}</span>
            </TerminalPrompt>
          )}
          {entry.output && (
            <pre
              className={`text-xs whitespace-pre-wrap pl-0 ${
                entry.isError ? "text-red-400/80" : "text-gray-500"
              }`}
            >
              {entry.output}
            </pre>
          )}
        </div>
      ))}

      {/* Current input line */}
      <TerminalPrompt>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-gray-400 text-xs flex-1 caret-gray-400 ml-1"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="terminal input"
        />
        <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-0.5" />
      </TerminalPrompt>

      {/* Hint */}
      {history.length === 0 && (
        <div className="text-gray-600 text-xs pt-2">
          type a command or &apos;help&apos; for options
        </div>
      )}
    </div>
  );
}
