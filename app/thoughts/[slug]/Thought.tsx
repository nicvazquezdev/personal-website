"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { ThoughtInterface } from "@/types";
import CircularNavigation from "@/app/components/CircularNavigation";
import FontSizeControl from "@/app/components/FontSizeControl";

interface ThoughtProps {
  post: ThoughtInterface;
  previousPost: ThoughtInterface | null;
  nextPost: ThoughtInterface | null;
}

export default function Thought({
  post,
  previousPost,
  nextPost,
}: ThoughtProps) {
  const [fontSize, setFontSize] = useState<number>(18);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
  };

  return (
    <main className="pt-6">
      <div className="w-full max-w-4xl">
        <nav className="mb-4 md:mb-10" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-sm underline underline-offset-2"
          >
            ← back to home
          </Link>

          <div className="hidden md:block mt-6">
            <FontSizeControl
              defaultSize={18}
              onFontSizeChange={handleFontSizeChange}
            />
          </div>
        </nav>

        <article
          className="space-y-6"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold" itemProp="headline">
              {post.title}
            </h1>

            <p className="text-gray-400 text-md">{post.excerpt}</p>

            <div className="text-gray-400 text-sm space-y-2">
              <time
                dateTime={post.date}
                itemProp="datePublished"
                className="block"
              >
                {(() => {
                  // Convert dd-mm-yyyy to yyyy-mm-dd for Date constructor
                  const [day, month, year] = post.date.split("-");
                  const dateStr = `${year}-${month}-${day}`;
                  return new Date(dateStr + "T00:00:00").toLocaleDateString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    },
                  );
                })()}
              </time>
            </div>
          </header>

          <div
            className="prose prose-invert prose-gray max-w-none"
            itemProp="articleBody"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p
                    className="text-gray-300 leading-relaxed mb-4"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {children}
                  </p>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li
                    className="text-gray-300 leading-relaxed"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <Link
                    href={href || "#"}
                    className="text-white underline underline-offset-2 hover:text-gray-300"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {children}
                  </Link>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-300">{children}</em>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-white">{children}</strong>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <CircularNavigation
          previousItem={previousPost}
          nextItem={nextPost}
          basePath="/thoughts"
          centerLink={{
            href: "/",
            label: "all thoughts",
          }}
        />
      </div>
    </main>
  );
}
