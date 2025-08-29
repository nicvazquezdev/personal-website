export interface Link {
  name: string;
  url: string;
}

export interface InfoItem {
  title: string;
  content?: string;
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

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}
