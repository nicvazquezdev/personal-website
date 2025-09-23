import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import SEOOptimizations from "./components/SEOOptimizations";
import Image from "next/image";
import SocialLinks from "./components/SocialLinks";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nicolasvazquez.com.ar"),
  title: {
    default: "nicolás vazquez",
    template: "%s | nicolás vazquez",
  },
  description: "senior software engineer from buenos aires, argentina",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
    description: "senior software engineer from buenos aires, argentina",
    images: [
      {
        url: "https://nicolasvazquez.com.ar/avatar-bg.png",
        width: 256,
        height: 256,
        alt: "Nicolás Vazquez - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nicolás vazquez",
    description: "senior software engineer from buenos aires, argentina",
    images: ["https://nicolasvazquez.com.ar/avatar-bg.png"],
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
        <link rel="canonical" href="https://nicolasvazquez.com.ar" />
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen p-8 md:pt-20 md:pl-80">
          <header className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
            <Link href="/">
              <Image
                src="/avatar.png"
                alt="Avatar pixel art"
                width={80}
                height={117}
                priority
              />
            </Link>

            <div className="space-y-4">
              <h1 className="text-gray-300 leading-relaxed text-lg md:text-base">
                <span className="text-white font-semibold">
                  nicolás vazquez
                </span>{" "}
                is a senior software engineer{" "}
                <span className="hidden md:inline">
                  <br />
                </span>{" "}
                from buenos aires, argentina
              </h1>
              <SocialLinks />
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
