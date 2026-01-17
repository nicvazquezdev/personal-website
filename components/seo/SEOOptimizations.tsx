import { SITE_CONFIG } from "@/config";

export default function SEOOptimizations() {
  return (
    <>
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//github.com" />
      <link rel="dns-prefetch" href="//linkedin.com" />

      {/* Preconnect to improve loading performance */}
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Web app manifest for PWA capabilities */}
      <link rel="manifest" href="/manifest.json" />

      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#000000" />
      <meta
        name="theme-color"
        content="#000000"
        media="(prefers-color-scheme: dark)"
      />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* Apple-specific meta tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content={SITE_CONFIG.name} />

      {/* Format detection */}
      <meta name="format-detection" content="telephone=no" />

      {/* RSS Feed autodiscovery */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${SITE_CONFIG.name} - Thoughts`}
        href={`${SITE_CONFIG.url}/feed.xml`}
      />
    </>
  );
}
