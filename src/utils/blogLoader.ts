export interface BlogArticle {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  content: string;
  rawContent: string;
  tags?: string[];
  readingTime?: number;
}

// Browser-compatible frontmatter parser (replaces gray-matter which needs Node.js Buffer)
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, unknown> = {};

  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(':')) continue;

    const colonIndex = trimmed.indexOf(':');
    const key = trimmed.slice(0, colonIndex).trim();
    let value: unknown = trimmed.slice(colonIndex + 1).trim();

    // Parse arrays like ["tag1", "tag2"]
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch {
        // Keep as string if parsing fails
      }
    }
    // Remove surrounding quotes
    else if (typeof value === 'string' && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content };
}

export function loadBlogArticles(locale: string = 'en'): BlogArticle[] {
  const blogModules = import.meta.glob('../blog/**/*.md', {
    query: '?raw',
    eager: true,
  }) as Record<string, { default: string }>;

  const articles: BlogArticle[] = [];

  for (const path in blogModules) {
    // Only load articles for current language
    if (!path.includes(`/${locale}/`)) continue;

    try {
      const rawContent = blogModules[path].default;
      const { data: frontmatter, content: markdown } = parseFrontmatter(rawContent);

      // Extract slug from filename
      const slug = path
        .split('/')
        .pop()
        ?.replace('.md', '') || 'untitled';

      // Calculate reading time (average 200 words per minute)
      const wordCount = markdown.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      articles.push({
        slug: (frontmatter.slug as string) || slug,
        title: (frontmatter.title as string) || 'Untitled',
        subtitle: (frontmatter.subtitle as string) || '',
        date: (frontmatter.date as string) || new Date().toISOString().split('T')[0],
        content: markdown,
        rawContent,
        tags: (frontmatter.tags as string[]) || [],
        readingTime,
      });
    } catch (error) {
      console.error(`Error loading article from ${path}:`, error);
      // Skip malformed articles
      continue;
    }
  }

  // Sort by date descending (newest first)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
