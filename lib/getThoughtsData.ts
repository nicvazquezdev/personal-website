import { getAllPosts } from "./blog";
import { InfoItem } from "../types";

export function getThoughtsData(): InfoItem {
  const posts = getAllPosts();

  const thoughtsLinks = posts.map((post) => ({
    url: `/thoughts/${post.slug}`,
    name: post.title,
  }));

  return {
    title: "thoughts",
    subtitle:
      "a space to document the notes, experiments, and challenges i face while building and learning",
    links: thoughtsLinks,
  };
}
