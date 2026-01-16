import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import { ThoughtInterface } from "@/types";

const postsDirectory = path.join(process.cwd(), "thoughts");

// Helper to parse DD-MM-YYYY date format - hoisted to avoid recreation
// Rule: js-cache-function-results
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Wrap with React.cache() for per-request deduplication
// Rule: server-cache-react
export const getAllPosts = cache((): ThoughtInterface[] => {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
          slug,
          title: matterResult.data.title || "",
          date: matterResult.data.date || "",
          excerpt: matterResult.data.excerpt || "",
          tags: matterResult.data.tags || [],
          content: matterResult.content,
        };
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
});

// Wrap with React.cache() for per-request deduplication
// Called in both page component and generateMetadata
// Rule: server-cache-react
export const getPostBySlug = cache((slug: string): ThoughtInterface | null => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      slug,
      title: matterResult.data.title || "",
      date: matterResult.data.date || "",
      excerpt: matterResult.data.excerpt || "",
      tags: matterResult.data.tags || [],
      content: matterResult.content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
});

export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (error) {
    console.error("Error reading post slugs:", error);
    return [];
  }
}

// Build index map once for O(1) lookups instead of O(n) findIndex
// Rule: js-index-maps
const getPostIndexMap = cache((): Map<string, number> => {
  const allPosts = getAllPosts();
  return new Map(allPosts.map((post, index) => [post.slug, index]));
});

// Get both previous and next posts in one call to avoid redundant work
// Rule: js-combine-iterations
export const getAdjacentPosts = cache(
  (
    currentSlug: string
  ): { previous: ThoughtInterface | null; next: ThoughtInterface | null } => {
    const allPosts = getAllPosts();
    const indexMap = getPostIndexMap();
    const currentIndex = indexMap.get(currentSlug);

    if (currentIndex === undefined) {
      return { previous: null, next: null };
    }

    // Circular navigation
    const previousIndex =
      currentIndex === 0 ? allPosts.length - 1 : currentIndex - 1;
    const nextIndex =
      currentIndex === allPosts.length - 1 ? 0 : currentIndex + 1;

    return {
      previous: allPosts[previousIndex] ?? null,
      next: allPosts[nextIndex] ?? null,
    };
  }
);

// Keep individual functions for backwards compatibility
export function getPreviousPost(currentSlug: string): ThoughtInterface | null {
  return getAdjacentPosts(currentSlug).previous;
}

export function getNextPost(currentSlug: string): ThoughtInterface | null {
  return getAdjacentPosts(currentSlug).next;
}
