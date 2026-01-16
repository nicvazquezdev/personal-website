import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

// Helper to convert DD-MM-YYYY to Date object
function parsePostDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nicolasvazquez.com.ar";

  // Get all posts with their actual dates
  const posts = getAllPosts();

  // Create sitemap entries for blog posts with actual dates
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/thoughts/${post.slug}`,
    lastModified: parsePostDate(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Get the most recent post date for the homepage
  const latestPostDate = posts.length > 0 ? parsePostDate(posts[0].date) : new Date();

  return [
    {
      url: baseUrl,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...blogEntries,
  ];
}
