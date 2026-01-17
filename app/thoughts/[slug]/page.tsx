import { notFound } from "next/navigation";
import {
  getAllPostSlugs,
  getPostBySlug,
  getAdjacentPosts,
  formatDateISO,
  calculateReadingTime,
} from "@/lib/blog";
import { ThoughtInterface } from "@/types";
import { Thought, BlogPostStructuredData } from "./_components";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/config";

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
    `Read "${post.title}" by ${SITE_CONFIG.name}. Insights on software engineering and modern web development.`;

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
    authors: [{ name: SITE_CONFIG.name }],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime,
      modifiedTime: publishedTime,
      authors: [SITE_CONFIG.name],
      tags: post.tags,
      url: `${SITE_CONFIG.url}/thoughts/${slug}`,
      siteName: SITE_CONFIG.name,
      locale: "en_US",
      images: [
        {
          url: SITE_CONFIG.images.og,
          width: 1200,
          height: 630,
          alt: `${post.title} - ${SITE_CONFIG.name}`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [SITE_CONFIG.images.og],
      creator: SITE_CONFIG.author.twitter,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/thoughts/${slug}`,
    },
    other: {
      "article:published_time": publishedTime,
      "article:author": SITE_CONFIG.name,
      "twitter:label1": "Reading time",
      "twitter:data1": `${readingTime} min read`,
    },
  };
}
