import { getAllPosts } from "@/lib/blog";

const SITE_URL = "https://nicolasvazquez.com.ar";

// Helper to convert DD-MM-YYYY to RFC 822 date format
function formatRFC822Date(dateStr: string): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toUTCString();
}

// Helper to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();

  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/thoughts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/thoughts/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${formatRFC822Date(post.date)}</pubDate>
      <author>hello@nicolasvazquez.com.ar (Nicolás Vazquez)</author>
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ") || ""}
    </item>`
    )
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Nicolás Vazquez - Thoughts</title>
    <link>${SITE_URL}</link>
    <description>Notes, experiments, and challenges from a senior software engineer building for the web.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/avatar-bg.png</url>
      <title>Nicolás Vazquez</title>
      <link>${SITE_URL}</link>
    </image>
    <managingEditor>hello@nicolasvazquez.com.ar (Nicolás Vazquez)</managingEditor>
    <webMaster>hello@nicolasvazquez.com.ar (Nicolás Vazquez)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Nicolás Vazquez</copyright>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
