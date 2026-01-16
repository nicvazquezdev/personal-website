import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">404 - Page Not Found</h1>
        <p className="text-gray-400">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block text-gray-300 hover:text-white underline underline-offset-4"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
