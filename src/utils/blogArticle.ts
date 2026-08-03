export interface BlogArticle {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  content: string;
  tags?: string[];
  /** Discipline the article belongs to: frontend, backend, devops, ... */
  branch?: string;
  readingTime?: number;
  /** Key under the `articles` node in the database */
  storageId: string;
}

/** Reading time at an average of 200 words per minute */
export function readingTimeOf(markdown: string): number {
  return Math.ceil(markdown.split(/\s+/).length / 200);
}
