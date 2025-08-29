export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://nicolasvazquez.com/#person",
        name: "Nicolás Vazquez",
        url: "https://nicolasvazquez.com",
        image: {
          "@type": "ImageObject",
          url: "https://nicolasvazquez.com/avatar.png",
          width: 400,
          height: 400,
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
        "@id": "https://nicolasvazquez.com/#website",
        url: "https://nicolasvazquez.com",
        name: "Nicolás Vazquez",
        description:
          "Personal website and blog of Nicolás Vazquez, Senior Software Engineer at Google",
        publisher: {
          "@id": "https://nicolasvazquez.com/#person",
        },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://nicolasvazquez.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://nicolasvazquez.com/#webpage",
        url: "https://nicolasvazquez.com",
        name: "Nicolás Vazquez - Senior Software Engineer",
        isPartOf: {
          "@id": "https://nicolasvazquez.com/#website",
        },
        about: {
          "@id": "https://nicolasvazquez.com/#person",
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
              item: "https://nicolasvazquez.com",
            },
          ],
        },
      },
      {
        "@type": "ProfilePage",
        "@id": "https://nicolasvazquez.com/#profilepage",
        url: "https://nicolasvazquez.com",
        name: "Nicolás Vazquez Profile",
        isPartOf: {
          "@id": "https://nicolasvazquez.com/#website",
        },
        about: {
          "@id": "https://nicolasvazquez.com/#person",
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
