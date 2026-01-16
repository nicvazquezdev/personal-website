import { notFound } from "next/navigation";
import {
  getAllPostSlugs,
  getPostBySlug,
  getAdjacentPosts,
  formatDateISO,
  calculateReadingTime,
} from "@/lib/blog";
import { ThoughtInterface } from "@/types";
import Thought from "./Thought";
import BlogPostStructuredData from "./BlogPostStructuredData";
import { Metadata } from "next";

interface ThoughtsProps {
  params: Promise<{ slug: string }>;
}

export default async function ThoughtsPage({ params }: ThoughtsProps) {
  const { slug } = await params;
  const post: ThoughtInterface | null = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Use combined function to get both adjacent posts in one call
  // Rule: js-combine-iterations
  const { previous: previousPost, next: nextPost } = getAdjacentPosts(slug);

  return (
    <>
      <BlogPostStructuredData post={post} />
      <Thought post={post} previousPost={previousPost} nextPost={nextPost} />
    </>
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
}: ThoughtsProps): Promise<Metadata> {
  const { slug } = await params;
  const post: ThoughtInterface | null = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const publishedTime = formatDateISO(post.date);
  const readingTime = calculateReadingTime(post.content);
  const description =
    post.excerpt ||
    `Read "${post.title}" by Nicolás Vazquez. Insights on software engineering and modern web development.`;

  return {
    title: post.title,
    description,
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
      description,
      type: "article",
      publishedTime,
      modifiedTime: publishedTime,
      authors: ["Nicolás Vazquez"],
      tags: post.tags,
      url: `https://nicolasvazquez.com.ar/thoughts/${slug}`,
      siteName: "Nicolás Vazquez",
      locale: "en_US",
      images: [
        {
          url: "https://nicolasvazquez.com.ar/avatar_og.jpg",
          width: 1200,
          height: 630,
          alt: `${post.title} - Nicolás Vazquez`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: ["https://nicolasvazquez.com.ar/avatar_og.jpg"],
      creator: "@nicvazquezdev",
    },
    alternates: {
      canonical: `https://nicolasvazquez.com.ar/thoughts/${slug}`,
    },
    other: {
      "article:published_time": publishedTime,
      "article:author": "Nicolás Vazquez",
      "twitter:label1": "Reading time",
      "twitter:data1": `${readingTime} min read`,
    },
  };
}
