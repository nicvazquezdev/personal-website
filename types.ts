export interface Link {
  name: string;
  url: string;
}

export interface InfoItem {
  title: string;
  content?: string;
  subtitle?: string;
  links?: Link[];
}

export interface InfoData {
  [key: string]: InfoItem;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export interface ThoughtInterface {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}
