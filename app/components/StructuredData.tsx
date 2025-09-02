export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://nicolasvazquez.com.ar/#person",
        name: "Nicolás Vazquez",
        url: "https://nicolasvazquez.com.ar",
        image: {
          "@type": "ImageObject",
          url: "https://nicolasvazquez.com.ar/avatar-bg.png",
          width: 256,
          height: 256,
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
          "@type": "Organization",
          name: "Universidad de Buenos Aires",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Buenos Aires",
          addressCountry: "AR",
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
        description:
          "Senior Software Engineer with 5+ years of experience designing, building, and evolving scalable web platforms across the stack. Specializes in modern JavaScript ecosystems and has led complex initiatives including legacy system migrations and infrastructure modernization.",
      },
      {
        "@type": "WebSite",
        "@id": "https://nicolasvazquez.com.ar/#website",
        url: "https://nicolasvazquez.com.ar",
        name: "Nicolás Vazquez",
        description:
          "Personal website and blog of Nicolás Vazquez, Senior Software Engineer at Google",
        publisher: {
          "@id": "https://nicolasvazquez.com.ar/#person",
        },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://nicolasvazquez.com.ar/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
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
      },
      {
        "@type": "ProfilePage",
        "@id": "https://nicolasvazquez.com.ar/#profilepage",
        url: "https://nicolasvazquez.com.ar",
        name: "Nicolás Vazquez Profile",
        isPartOf: {
          "@id": "https://nicolasvazquez.com.ar/#website",
        },
        about: {
          "@id": "https://nicolasvazquez.com.ar/#person",
        },
        description:
          "Professional profile of Nicolás Vazquez, showcasing experience, projects, and technical expertise in software engineering.",
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
