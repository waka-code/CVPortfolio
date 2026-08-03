import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../config/firebase';
import { readingTimeOf, type BlogArticle } from '../utils/blogArticle';

export type ArticleLang = 'es' | 'en';

/** Shape of an article record under the `articles` node */
interface StoredArticle {
  id: string;
  lang: ArticleLang;
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  content: string;
  tags?: string[];
  branch?: string;
  createdAt: string;
}

export interface ArticleInput {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  content: string;
  tags: string[];
  branch: string;
}

export function normalizeArticleLang(language: string): ArticleLang {
  return language.startsWith('en') ? 'en' : 'es';
}

function toBlogArticle(stored: StoredArticle): BlogArticle {
  return {
    slug: stored.slug,
    title: stored.title,
    subtitle: stored.subtitle ?? '',
    date: stored.date,
    content: stored.content,
    tags: stored.tags ?? [],
    branch: stored.branch ?? '',
    readingTime: readingTimeOf(stored.content),
    storageId: stored.id,
  };
}

export function useBlogArticles() {
  const { i18n } = useTranslation();
  const [stored, setStored] = useState<StoredArticle[] | null>(null);

  useEffect(() => {
    const articlesRef = ref(database, 'articles');

    const unsubscribe = onValue(
      articlesRef,
      (snapshot) => {
        const data = snapshot.val();
        setStored(
          data
            ? Object.entries(data).map(([id, value]) => ({
                id,
                ...(value as Omit<StoredArticle, 'id'>),
              }))
            : []
        );
      },
      (error) => {
        // Losing the database should not take the bundled articles down with it
        console.error('Could not read blog articles from Firebase:', error);
        setStored([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const articles = useMemo(() => {
    const lang = normalizeArticleLang(i18n.language);
    const bySlug = new Map<string, BlogArticle>();

    // Oldest first so that re-publishing a slug overwrites the earlier record
    (stored ?? [])
      .filter((article) => article.lang === lang)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .forEach((article) => bySlug.set(article.slug, toBlogArticle(article)));

    return Array.from(bySlug.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [stored, i18n.language]);

  return { articles, isLoading: stored === null };
}

/** Writes one record per language, mirroring how the markdown files were laid out. */
export async function publishArticle(input: ArticleInput, langs: ArticleLang[]): Promise<void> {
  const articlesRef = ref(database, 'articles');
  const createdAt = new Date().toISOString();

  await Promise.all(
    langs.map((lang) => push(articlesRef, { ...input, lang, createdAt }))
  );
}
