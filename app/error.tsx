"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="py-6">
      <div className="space-y-8 font-mono">
        {/* error output */}
        <div className="space-y-4">
          <div className="text-gray-500 text-sm">
            <span className="text-red-400/80">error</span> | something went
            wrong
          </div>
        </div>

        {/* ascii divider */}
        <div className="text-gray-700 text-xs select-none" aria-hidden="true">
          ─────────────────────────────────
        </div>

        {/* message */}
        <div className="space-y-4 text-sm">
          <p className="text-gray-400">an unexpected error occurred.</p>
          <p className="text-gray-500">
            this might be a temporary issue. try refreshing the page or going
            back home.
          </p>
        </div>

        {/* actions */}
        <div className="space-y-2 text-xs">
          <div className="text-gray-500">try one of these:</div>
          <div className="flex flex-col gap-1 pl-2">
            <button
              onClick={reset}
              className="text-gray-400 hover:text-white transition-colors text-left cursor-pointer"
            >
              <span className="text-gray-600">→</span> retry
              <span className="text-gray-600 ml-2"># try again</span>
            </button>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-gray-600">→</span> cd ~
              <span className="text-gray-600 ml-2"># go home</span>
            </Link>
          </div>
        </div>

        {/* ascii divider */}
        <div className="text-gray-700 text-xs select-none" aria-hidden="true">
          ─────────────────────────────────
        </div>

        {/* error details (development only) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="text-xs text-gray-600">
            <div className="text-gray-500 mb-2">error details:</div>
            <pre className="bg-gray-900 p-3 rounded overflow-x-auto text-red-400/70">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
