import { X, ThumbsUp, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadBlogArticles, BlogArticle } from '../utils/blogLoader';
import { useBlogLikes } from '../hooks/useBlogLikes';

export function BlogPost() {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const { likes, toggleLike, hasLiked } = useBlogLikes();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blog/')) {
        const slug = hash.replace('#blog/', '');
        const articles = loadBlogArticles(i18n.language);
        const found = articles.find(a => a.slug === slug);
        setArticle(found || null);

        // Scroll to top when article opens
        if (found) {
          window.scrollTo(0, 0);
        }
      } else {
        setArticle(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [i18n.language]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && article) {
        window.location.hash = '';
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [article]);

  if (!article) return null;

  const handleClose = () => {
    window.location.hash = '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in-up"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl p-6 md:p-10 ${
          isDark ? 'bg-slate-900' : 'bg-white'
        } animate-scale-in`}
      >
        <button
          onClick={handleClose}
          className={`sticky top-2 float-right z-10 p-2 rounded-lg transition-colors ${
            isDark
              ? 'hover:bg-slate-800 text-slate-300 bg-slate-900/80'
              : 'hover:bg-slate-100 text-slate-700 bg-white/80'
          }`}
          aria-label="Close article"
        >
          <X size={24} />
        </button>

        <header className="mb-8">
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

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className={`prose prose-lg max-w-none ${
          isDark
            ? 'prose-invert prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700'
            : 'prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-strong:text-slate-900 prose-code:text-blue-600 prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200'
        }`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
