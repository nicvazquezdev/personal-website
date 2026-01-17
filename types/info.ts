// Info section and content related types

export interface Link {
  name: string;
  url: string;
  date?: string;
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
