import { SITE_CONFIG } from "@/config";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_CONFIG.url}/#person`,
        name: SITE_CONFIG.name,
        givenName: "Nicolás",
        familyName: "Vazquez",
        url: SITE_CONFIG.url,
        image: {
          "@type": "ImageObject",
          url: SITE_CONFIG.images.og,
          width: 1200,
          height: 630,
        },
        sameAs: [SITE_CONFIG.social.github, SITE_CONFIG.social.linkedin],
        jobTitle: "Senior Software Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Google",
          url: "https://google.com",
        },
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "Universidad de Buenos Aires",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_CONFIG.location.city,
          addressRegion: SITE_CONFIG.location.region,
          addressCountry: SITE_CONFIG.location.countryCode,
        },
        nationality: {
          "@type": "Country",
          name: SITE_CONFIG.location.country,
        },
        knowsAbout: [
          "JavaScript",
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "Software Engineering",
          "Web Development",
          "Frontend Development",
          "Full Stack Development",
          "AWS",
          "System Architecture",
        ],
        knowsLanguage: ["en", "es"],
        description:
          "Senior Software Engineer with 5+ years of experience designing, building, and evolving scalable web platforms across the stack. Specializes in modern JavaScript ecosystems and has led complex initiatives including legacy system migrations and infrastructure modernization.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        description:
          "Personal website and blog of Nicolás Vazquez, Senior Software Engineer. Notes on software engineering, web development, and building scalable applications.",
        publisher: {
          "@id": `${SITE_CONFIG.url}/#person`,
        },
        inLanguage: "en",
        copyrightYear: new Date().getFullYear(),
        copyrightHolder: {
          "@id": `${SITE_CONFIG.url}/#person`,
        },
      },
      {
        "@type": "Blog",
        "@id": `${SITE_CONFIG.url}/#blog`,
        url: SITE_CONFIG.url,
        name: "Thoughts",
        description:
          "Notes, experiments, and challenges from a senior software engineer building for the web.",
        publisher: {
          "@id": `${SITE_CONFIG.url}/#person`,
        },
        author: {
          "@id": `${SITE_CONFIG.url}/#person`,
        },
        inLanguage: "en",
        isPartOf: {
          "@id": `${SITE_CONFIG.url}/#website`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_CONFIG.url}/#webpage`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} - Senior Software Engineer`,
        isPartOf: {
          "@id": `${SITE_CONFIG.url}/#website`,
        },
        about: {
          "@id": `${SITE_CONFIG.url}/#person`,
        },
        description:
          "Portfolio and thoughts from Nicolás Vazquez, Senior Software Engineer with expertise in React, Next.js, TypeScript, and scalable web platforms.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_CONFIG.url,
            },
          ],
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: SITE_CONFIG.images.og,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
