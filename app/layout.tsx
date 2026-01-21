import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { StructuredData, SEOOptimizations } from "@/components/seo";
import { Header } from "@/components/layout";
import { DigitalClock, LastUpdated } from "@/components/features/clock";
import { TerminalPrompt } from "@/components/features/terminal";
import { getLastCommitDate } from "@/lib/getLastCommitDate";
import { SITE_CONFIG } from "@/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Nicolás Vazquez",
    "software engineer",
    "frontend developer",
    "react developer",
    "nextjs developer",
    "typescript developer",
    "nodejs developer",
    "full stack developer",
    "javascript developer",
    "web developer",
    "google engineer",
    "buenos aires developer",
    "argentina developer",
    "senior engineer",
    "tech lead",
    "web platform",
    "scalable applications",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - Senior Software Engineer`,
    description:
      "senior software engineer from buenos aires, argentina. building fast, reliable, and enjoyable web experiences.",
    images: [
      {
        url: SITE_CONFIG.images.og,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Senior Software Engineer`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.author.twitter,
    creator: SITE_CONFIG.author.twitter,
    title: `${SITE_CONFIG.name} - Senior Software Engineer`,
    description:
      "senior software engineer from buenos aires, argentina. building fast, reliable, and enjoyable web experiences.",
    images: [SITE_CONFIG.images.og],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/feed.xml`,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <StructuredData />
        <SEOOptimizations />
        {/* Geo tags for local SEO */}
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content={SITE_CONFIG.location.city} />
        <meta
          name="geo.position"
          content={`${SITE_CONFIG.location.coordinates.latitude};${SITE_CONFIG.location.coordinates.longitude}`}
        />
        <meta
          name="ICBM"
          content={`${SITE_CONFIG.location.coordinates.latitude}, ${SITE_CONFIG.location.coordinates.longitude}`}
        />
        {/* Preload floating avatar images to prevent glitch on first load */}
        <link
          rel="preload"
          href={SITE_CONFIG.images.floatingAvatar}
          as="image"
        />
        <link
          rel="preload"
          href={SITE_CONFIG.images.floatingAvatarCyber}
          as="image"
        />
        <link
          rel="preload"
          href={SITE_CONFIG.images.floatingAvatarClicked}
          as="image"
        />
        <link
          rel="preload"
          href={SITE_CONFIG.images.floatingAvatarAttacking}
          as="image"
        />
      </head>
      <body className="antialiased">
        <div className="fixed bottom-4 right-4 hidden md:flex flex-col items-end gap-1">
          <DigitalClock />
          <LastUpdated lastCommitDate={getLastCommitDate()} />
        </div>
        <div className="absolute top-4 left-4 hidden md:block">
          {/* Suspense required for useSearchParams in client components */}
          <Suspense fallback={null}>
            <TerminalPrompt />
          </Suspense>
        </div>
        <div className="min-h-screen p-8 md:pt-20 md:pl-80">
          <div className="sr-only">
            <h1>nicolás vazquez - senior software engineer</h1>
            <p>
              nicolás vazquez is a software engineer from buenos aires,
              argentina, focused on creating fast, reliable, and enjoyable web
              experiences.
            </p>
          </div>

          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
