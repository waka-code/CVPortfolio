import { ArrowLeft, GitBranch, ThumbsUp, Calendar, Clock } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { loadBlogArticles, BlogArticle } from '../utils/blogLoader';
import { useBlogLikes } from '../hooks/useBlogLikes';
import { formatDate } from '../utils/formatDate';
import { buildToc, buildTocTree } from '../utils/markdownToc';
import { TableOfContents } from './TableOfContents';
import { MarkdownContent } from './MarkdownContent';
import { BLOG_HASH_PREFIX, BLOG_SECTION_HASH } from '../constants/routes';

export function BlogPost() {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [isTocOpen, setIsTocOpen] = useState(true);
  const { likes, toggleLike, hasLiked } = useBlogLikes();

  const toc = useMemo(
    () => buildTocTree(buildToc(article?.content ?? '')),
    [article?.content]
  );

  // Where to return to: whichever list screen the user came from
  const originRef = useRef(BLOG_SECTION_HASH);

  const handleBack = useCallback(() => {
    window.location.hash = originRef.current;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith(BLOG_HASH_PREFIX)) {
        const slug = hash.slice(BLOG_HASH_PREFIX.length);
        const articles = loadBlogArticles(i18n.language);
        const found = articles.find(a => a.slug === slug);
        setArticle(found || null);

        // Scroll to top when article opens
        if (found) {
          window.scrollTo(0, 0);
        }
      } else {
        originRef.current = hash || BLOG_SECTION_HASH;
        setArticle(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [i18n.language]);

  useEffect(() => {
    if (!article) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBack();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [article, handleBack]);

  if (!article) return null;

  return (
    <div
      data-scroll-root
      className={`fixed inset-0 z-[55] overflow-y-auto overscroll-contain animate-fade-in-up ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      {/* Stays reachable however far down the article the reader is */}
      <div
        data-sticky-bar
        className={`sticky top-0 z-20 border-b backdrop-blur ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            onClick={handleBack}
            className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{t('blog.back')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <header className="mb-10">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {article.title}
          </h1>

          {article.subtitle && (
            <p className={`text-xl mb-4 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {article.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className={`flex items-center gap-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Calendar size={18} />
              <span>{formatDate(article.date)}</span>
            </div>

            {article.readingTime && (
              <div className={`flex items-center gap-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <Clock size={18} />
                <span>{article.readingTime} {t('blog.minRead')}</span>
              </div>
            )}

            <button
              onClick={() => toggleLike(article.slug)}
              className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasLiked(article.slug)
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              aria-label={hasLiked(article.slug) ? 'Unlike article' : 'Like article'}
            >
              <ThumbsUp size={18} fill={hasLiked(article.slug) ? 'currentColor' : 'none'} />
              <span>{likes[article.slug] || 0}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {article.branch && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
                  isDark
                    ? 'bg-blue-600/15 text-blue-400 border-blue-600/30'
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}
              >
                <GitBranch size={13} />
                {article.branch}
              </span>
            )}
            {article.tags?.map(tag => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div
          className={`grid gap-10 items-start transition-[grid-template-columns] duration-300 ease-out ${
            isTocOpen
              ? 'lg:grid-cols-[18rem_minmax(0,1fr)]'
              : 'lg:grid-cols-[4.5rem_minmax(0,1fr)]'
          }`}
        >
          {/* Sticky lives on the grid item: the nav alone is too short to stick against */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <TableOfContents
              nodes={toc}
              title={t('blog.tableOfContents')}
              isOpen={isTocOpen}
              onToggle={() => setIsTocOpen((prev) => !prev)}
            />
          </aside>

          <MarkdownContent content={article.content} />
        </div>
      </div>
    </div>
  );
}
