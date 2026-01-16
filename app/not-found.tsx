import Link from "next/link";
import { Metadata } from "next";
import InteractiveTerminal from "./components/InteractiveTerminal";

export const metadata: Metadata = {
  title: "404 - not found",
  description: "the page you are looking for could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="py-6">
      <div className="space-y-8 font-mono">
        {/* error output */}
        <div className="space-y-4">
          <div className="text-gray-500 text-sm">
            <span className="text-red-400/80">404</span> | page not found
          </div>
        </div>

        {/* ascii divider */}
        <div className="text-gray-700 text-xs select-none" aria-hidden="true">
          ─────────────────────────────────
        </div>

        {/* message */}
        <div className="space-y-4 text-sm">
          <p className="text-gray-400">
            looks like you&apos;re lost in the void.
          </p>
          <p className="text-gray-500">
            the page you&apos;re looking for doesn&apos;t exist, was moved, or
            you don&apos;t have permission to access it.
          </p>
        </div>

        {/* suggestions */}
        <div className="space-y-2 text-xs">
          <div className="text-gray-500">try one of these:</div>
          <div className="flex flex-col gap-1 pl-2">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-gray-600">→</span> cd ~
              <span className="text-gray-600 ml-2"># go home</span>
            </Link>
            <Link
              href="/?tab=thoughts"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-gray-600">→</span> cat thoughts.md
              <span className="text-gray-600 ml-2"># read my blog</span>
            </Link>
            <Link
              href="/?tab=me"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-gray-600">→</span> whoami
              <span className="text-gray-600 ml-2"># about me</span>
            </Link>
          </div>
        </div>

        {/* ascii divider */}
        <div className="text-gray-700 text-xs select-none" aria-hidden="true">
          ─────────────────────────────────
        </div>

        {/* interactive terminal */}
        <InteractiveTerminal />
      </div>
    </main>
  );
}
