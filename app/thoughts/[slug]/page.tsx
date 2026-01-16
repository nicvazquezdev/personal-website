import { notFound } from "next/navigation";
import {
  getAllPostSlugs,
  getPostBySlug,
  getAdjacentPosts,
} from "@/lib/blog";
import { ThoughtInterface } from "@/types";
import Thought from "./Thought";
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
    <Thought post={post} previousPost={previousPost} nextPost={nextPost} />
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
          url: "https://nicolasvazquez.com.ar/avatar-bg.png",
          width: 256,
          height: 256,
          alt: `${post.title} - Nicolás Vazquez`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Read "${post.title}" by Nicolás Vazquez`,
      images: ["https://nicolasvazquez.com.ar/avatar-bg.png"],
    },
    alternates: {
      canonical: `https://nicolasvazquez.com.ar/thoughts/${slug}`,
    },
  };
}
