import { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nicolasvazquez.com.ar";

  // Get all blog post slugs
  const postSlugs = getAllPostSlugs();

  // Create sitemap entries for blog posts
  const blogEntries = postSlugs.map((slug) => ({
    url: `${baseUrl}/thoughts/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/thoughts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
