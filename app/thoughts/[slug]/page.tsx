import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPostSlugs } from "../../../lib/blog";
import { BlogPost } from "../../../types";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post: BlogPost | null = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8 md:pt-20 md:pl-80">
      <div className="w-full max-w-4xl">
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-sm underline underline-offset-2"
          >
            ← back to home
          </Link>
        </nav>

        <article
          className="space-y-6"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <header className="space-y-4">
            <h1 className="text-3xl font-bold" itemProp="headline">
              {post.title}
            </h1>

            <div className="text-gray-400 text-sm space-y-2">
              <time
                dateTime={post.date}
                itemProp="datePublished"
                className="block"
              >
                {new Date(post.date)
                  .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  .toLocaleLowerCase()}
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
                  <h1 className="text-2xl font-bold text-white mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-white mb-3 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-white mb-2 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 leading-relaxed mb-4">
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
                  <li className="text-gray-300 leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4">
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
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post: BlogPost | null = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description:
      post.excerpt ||
      `Read "${post.title}" by Nicolás Vazquez. Insights on software engineering and modern web development.`,
    keywords: [
      ...(post.tags || []),
      "software engineering",
      "web development",
      "programming",
      "react",
      "javascript",
      "typescript",
      "nicolás vazquez",
    ],
    authors: [{ name: "Nicolás Vazquez" }],
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read "${post.title}" by Nicolás Vazquez`,
      type: "article",
      publishedTime: post.date,
      authors: ["Nicolás Vazquez"],
      tags: post.tags,
      url: `https://nicolasvazquez.com.ar/thoughts/${slug}`,
      siteName: "Nicolás Vazquez",
      images: [
        {
          url: "/avatar.png",
          width: 400,
          height: 400,
          alt: `${post.title} - Nicolás Vazquez`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Read "${post.title}" by Nicolás Vazquez`,
      images: ["/avatar.png"],
    },
    alternates: {
      canonical: `https://nicolasvazquez.com.ar/thoughts/${slug}`,
    },
  };
}
