import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "../types";

const postsDirectory = path.join(process.cwd(), "thoughts");

export function getAllPosts(): BlogPost[] {
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
      // Parse dates in DD-MM-YYYY format
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      };

      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      return dateB.getTime() - dateA.getTime(); // Newest first
    });
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
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
}

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

export function getPreviousPost(currentSlug: string): BlogPost | null {
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) return null;

  // Circular navigation: if at first post, go to last post
  const previousIndex =
    currentIndex === 0 ? allPosts.length - 1 : currentIndex - 1;
  return allPosts[previousIndex] || null;
}

export function getNextPost(currentSlug: string): BlogPost | null {
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) return null;

  // Circular navigation: if at last post, go to first post
  const nextIndex = currentIndex === allPosts.length - 1 ? 0 : currentIndex + 1;
  return allPosts[nextIndex] || null;
}
