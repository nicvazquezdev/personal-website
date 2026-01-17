import { ThoughtInterface } from "@/types";
import { SITE_CONFIG } from "@/config";
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
  const url = `${SITE_CONFIG.url}/thoughts/${post.slug}`;
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
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: {
      "@type": "ImageObject",
      url: SITE_CONFIG.images.og,
      width: 1200,
      height: 630,
    },
    inLanguage: "en",
    isPartOf: {
      "@type": "Blog",
      "@id": `${SITE_CONFIG.url}/#blog`,
      name: "Thoughts",
      url: SITE_CONFIG.url,
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
