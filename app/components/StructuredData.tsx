export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://nicolasvazquez.com.ar/#person",
        name: "Nicolás Vazquez",
        givenName: "Nicolás",
        familyName: "Vazquez",
        url: "https://nicolasvazquez.com.ar",
        image: {
          "@type": "ImageObject",
          url: "https://nicolasvazquez.com.ar/avatar_og.jpg",
          width: 1200,
          height: 630,
        },
        sameAs: [
          "https://github.com/nicvazquezdev",
          "https://linkedin.com/in/nicvazquez",
        ],
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
          addressLocality: "Buenos Aires",
          addressRegion: "Ciudad Autónoma de Buenos Aires",
          addressCountry: "AR",
        },
        nationality: {
          "@type": "Country",
          name: "Argentina",
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
        "@id": "https://nicolasvazquez.com.ar/#website",
        url: "https://nicolasvazquez.com.ar",
        name: "Nicolás Vazquez",
        description:
          "Personal website and blog of Nicolás Vazquez, Senior Software Engineer. Notes on software engineering, web development, and building scalable applications.",
        publisher: {
          "@id": "https://nicolasvazquez.com.ar/#person",
        },
        inLanguage: "en",
        copyrightYear: new Date().getFullYear(),
        copyrightHolder: {
          "@id": "https://nicolasvazquez.com.ar/#person",
        },
      },
      {
        "@type": "Blog",
        "@id": "https://nicolasvazquez.com.ar/#blog",
        url: "https://nicolasvazquez.com.ar",
        name: "Thoughts",
        description:
          "Notes, experiments, and challenges from a senior software engineer building for the web.",
        publisher: {
          "@id": "https://nicolasvazquez.com.ar/#person",
        },
        author: {
          "@id": "https://nicolasvazquez.com.ar/#person",
        },
        inLanguage: "en",
        isPartOf: {
          "@id": "https://nicolasvazquez.com.ar/#website",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://nicolasvazquez.com.ar/#webpage",
        url: "https://nicolasvazquez.com.ar",
        name: "Nicolás Vazquez - Senior Software Engineer",
        isPartOf: {
          "@id": "https://nicolasvazquez.com.ar/#website",
        },
        about: {
          "@id": "https://nicolasvazquez.com.ar/#person",
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
              item: "https://nicolasvazquez.com.ar",
            },
          ],
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://nicolasvazquez.com.ar/avatar_og.jpg",
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
