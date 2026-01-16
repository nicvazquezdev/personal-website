import { ThoughtInterface } from "@/types";
import {
  formatDateISO,
  calculateReadingTime,
  getWordCount,
} from "@/lib/blog";

interface BlogPostStructuredDataProps {
  post: ThoughtInterface;
}

export default function BlogPostStructuredData({
  post,
}: BlogPostStructuredDataProps) {
  const url = `https://nicolasvazquez.com.ar/thoughts/${post.slug}`;
  const publishedDate = formatDateISO(post.date);
  const wordCount = getWordCount(post.content);
  const readingTime = calculateReadingTime(post.content);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url: url,
    datePublished: publishedDate,
    dateModified: publishedDate,
    wordCount: wordCount,
    timeRequired: `PT${readingTime}M`,
    author: {
      "@type": "Person",
      "@id": "https://nicolasvazquez.com.ar/#person",
      name: "Nicolás Vazquez",
      url: "https://nicolasvazquez.com.ar",
    },
    publisher: {
      "@type": "Person",
      "@id": "https://nicolasvazquez.com.ar/#person",
      name: "Nicolás Vazquez",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: {
      "@type": "ImageObject",
      url: "https://nicolasvazquez.com.ar/avatar_og.jpg",
      width: 1200,
      height: 630,
    },
    inLanguage: "en",
    isPartOf: {
      "@type": "Blog",
      "@id": "https://nicolasvazquez.com.ar/#blog",
      name: "Thoughts",
      url: "https://nicolasvazquez.com.ar",
    },
    ...(post.tags &&
      post.tags.length > 0 && {
        keywords: post.tags.join(", "),
        about: post.tags.map((tag) => ({
          "@type": "Thing",
          name: tag,
        })),
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
