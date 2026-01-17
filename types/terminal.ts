// Terminal related types

export interface HistoryEntry {
  command: string;
  output?: string;
  isError?: boolean;
}

export interface NavigationItem {
  slug: string;
  title: string;
}
