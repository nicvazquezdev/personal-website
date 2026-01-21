// Site-wide configuration and metadata constants

export const SITE_CONFIG = {
  name: "Nicolás Vazquez",
  title: "nicolás vazquez",
  url: "https://nicolasvazquez.com.ar",
  description:
    "senior software engineer from buenos aires, argentina. building fast, reliable, and enjoyable web experiences.",
  author: {
    name: "Nicolás Vazquez",
    email: "contact@nicolasvazquez.com.ar",
    twitter: "@nicvazquezdev",
    github: "nicvazquezdev",
    linkedin: "nicvazquez",
  },
  social: {
    github: "https://github.com/nicvazquezdev",
    linkedin: "https://linkedin.com/in/nicvazquez",
  },
  images: {
    og: "https://nicolasvazquez.com.ar/avatar_og.jpg",
    avatar: "/avatar.png",
    floatingAvatar: "/floating-avatar.png",
    floatingAvatarClicked: "/floating-cyber-avatar-clicked.png",
    floatingAvatarCyber: "/floating-cyber-avatar.png",
    floatingAvatarAttacking: "/cyber-avatar-attacking.png",
  },
  location: {
    city: "Buenos Aires",
    region: "Ciudad Autónoma de Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    timezone: "America/Argentina/Buenos_Aires",
    coordinates: {
      latitude: -34.6037,
      longitude: -58.3816,
    },
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
