import { ArrowRight, BookOpen, PlusCircle } from 'lucide-react';
import { BlogEditor } from './BlogEditor';
import { BlogArticleCard } from './BlogArticleCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import { loadBlogArticles, BlogArticle } from '../utils/blogLoader';
import { useBlogLikes } from '../hooks/useBlogLikes';
import { ALL_BLOG_HASH } from '../constants/routes';

const HOME_ARTICLE_COUNT = 2;

export function Blog() {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const { likes, toggleLike, hasLiked } = useBlogLikes();

  useEffect(() => {
    setArticles(loadBlogArticles(i18n.language));
  }, [i18n.language]);

  const displayedArticles = articles.slice(0, HOME_ARTICLE_COUNT);

  return (
    <section
      id="blog"
      ref={elementRef}
      className={`py-20 px-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className={`flex items-center justify-between mb-8 ${
          isVisible ? 'animate-fade-in-right' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-3">
            <BookOpen className={`text-blue-600 ${isVisible ? 'animate-rotate-in' : ''}`} size={32} />
            <h2 className={`text-4xl font-bold title-underline ${isVisible ? 'visible' : ''} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t('blog.title')}
            </h2>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            <PlusCircle size={20} />
            <span className="font-medium">{t('blog.newArticle')}</span>
          </button>
        </div>

        <BlogEditor isOpen={showEditor} onClose={() => setShowEditor(false)} />

        {articles.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <p className="text-lg">{t('blog.noArticles')}</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {displayedArticles.map((article, index) => (
                <BlogArticleCard
                  key={article.slug}
                  article={article}
                  likeCount={likes[article.slug] || 0}
                  hasLiked={hasLiked(article.slug)}
                  onToggleLike={toggleLike}
                  animationClass={isVisible ? 'animate-scale-in' : 'opacity-0'}
                  animationDelay={`${index * 150}ms`}
                />
              ))}
            </div>

            {articles.length > HOME_ARTICLE_COUNT && (
              <div className="flex justify-center mt-12">
                <a
                  href={ALL_BLOG_HASH}
                  className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                      : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  <span className="font-medium">
                    {t('blog.viewAll')} ({articles.length})
                  </span>
                  <ArrowRight size={20} />
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
