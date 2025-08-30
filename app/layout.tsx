import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import SEOOptimizations from "./components/SEOOptimizations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nicolasvazquez.vercel.app"),
  title: {
    default: "nicolás vazquez",
    template: "%s | nicolás vazquez",
  },
  description: "senior software engineer from buenos aires, argentina.",
  keywords: [
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
  authors: [{ name: "Nicolás Vazquez" }],
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
    siteName: "Nicolás Vazquez",
    title: "nicolás vazquez",
    description: "senior software engineer from buenos aires, argentina.",
    images: [
      {
        url: "https://nicolasvazquez.vercel.app/avatar-bg.png",
        width: 256,
        height: 256,
        alt: "Nicolás Vazquez - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nicolás vazquez",
    description: "senior software engineer from buenos aires, argentina.",
    images: ["https://nicolasvazquez.vercel.app/avatar-bg.png"],
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
        <link rel="canonical" href="https://nicolasvazquez.vercel.app" />
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
