import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import SEOOptimizations from "./components/SEOOptimizations";
import Header from "./components/Header";
import DigitalClock from "./components/DigitalClock";
import LastUpdated from "./components/LastUpdated";
import TerminalPrompt from "./components/TerminalPrompt";
import { getLastCommitDate } from "@/lib/getLastCommitDate";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nicolasvazquez.com.ar"),
  title: {
    default: "nicolás vazquez",
    template: "%s | Nicolás Vazquez",
  },
  description:
    "Senior Software Engineer from Buenos Aires, Argentina. Building fast, reliable, and enjoyable web experiences with React, Next.js, TypeScript, and Node.js.",
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
  authors: [{ name: "Nicolás Vazquez", url: "https://nicolasvazquez.com.ar" }],
  creator: "Nicolás Vazquez",
  publisher: "Nicolás Vazquez",
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
    url: "https://nicolasvazquez.com.ar",
    siteName: "Nicolás Vazquez",
    title: "Nicolás Vazquez - Senior Software Engineer",
    description:
      "Senior Software Engineer from Buenos Aires, Argentina. Building fast, reliable, and enjoyable web experiences.",
    images: [
      {
        url: "https://nicolasvazquez.com.ar/avatar_og.jpg",
        width: 1200,
        height: 630,
        alt: "Nicolás Vazquez - Senior Software Engineer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nicvazquezdev",
    creator: "@nicvazquezdev",
    title: "Nicolás Vazquez - Senior Software Engineer",
    description:
      "Senior Software Engineer from Buenos Aires, Argentina. Building fast, reliable, and enjoyable web experiences.",
    images: ["https://nicolasvazquez.com.ar/avatar_og.jpg"],
  },
  alternates: {
    canonical: "https://nicolasvazquez.com.ar",
    types: {
      "application/rss+xml": "https://nicolasvazquez.com.ar/feed.xml",
    },
  },
  // verification: {
  //   google: "your-google-site-verification-code",
  // },
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
        <meta name="geo.placename" content="Buenos Aires" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <div className="fixed bottom-4 right-4 hidden md:flex flex-col items-end gap-1">
          <DigitalClock />
          <LastUpdated lastCommitDate={getLastCommitDate()} />
        </div>
        <div className="absolute top-4 left-4 hidden md:block">
          {/* Suspense required for useSearchParams in client components */}
          {/* Rule: async-suspense-boundaries */}
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
