import { BookOpen, ThumbsUp, Clock, Search, Tag, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { BlogEditor } from './BlogEditor';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadBlogArticles, BlogArticle } from '../utils/blogLoader';
import { useBlogLikes } from '../hooks/useBlogLikes';
import { getGitHubToken } from '../utils/githubApi';

export function Blog() {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const { likes, toggleLike, hasLiked } = useBlogLikes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(4);
  const [showEditor, setShowEditor] = useState(false);
  const [isOwner, setIsOwner] = useState(() => !!getGitHubToken());

  // Secret shortcut: Ctrl+Shift+B opens editor with token config
  const handleSecretShortcut = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'B') {
      e.preventDefault();
      setShowEditor(true);
      setIsOwner(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleSecretShortcut);
    return () => window.removeEventListener('keydown', handleSecretShortcut);
  }, [handleSecretShortcut]);

  // Re-check token when editor closes
  useEffect(() => {
    if (!showEditor) {
      setIsOwner(!!getGitHubToken());
    }
  }, [showEditor]);

  useEffect(() => {
    const loadedArticles = loadBlogArticles(i18n.language);
    setArticles(loadedArticles);
  }, [i18n.language]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    articles.forEach(article => {
      article.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [articles]);

  // Filter articles by search and tag
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = selectedTag === 'all' ||
        article.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [articles, searchTerm, selectedTag]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  const handleArticleClick = (slug: string) => {
    window.location.hash = `blog/${slug}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, filteredArticles.length));
  };

  const handleShowLess = () => {
    setVisibleCount(4);
  };

  return (
    <section
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
          {isOwner && (
            <button
              onClick={() => setShowEditor(true)}
              className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                  : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              <PlusCircle size={20} />
              <span className="font-medium">{i18n.language === 'es' ? 'Nuevo Artículo' : 'New Article'}</span>
            </button>
          )}
        </div>

        <BlogEditor isOpen={showEditor} onClose={() => setShowEditor(false)} />

        {/* Search and Filters */}
        <div className={`mb-8 space-y-4 ${isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} size={20} />
            <input
              type="text"
              placeholder={t('blog.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className={isDark ? 'text-slate-400' : 'text-slate-600'} size={20} />
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === 'all'
                    ? 'bg-blue-600 text-white'
                    : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('blog.allTags')}
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className={`text-center py-12 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <p className="text-lg">
              {searchTerm || selectedTag !== 'all'
                ? 'No se encontraron artículos con esos filtros.'
                : t('blog.noArticles')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {displayedArticles.map((article, index) => {
                const isNewlyVisible = index >= 4 && isVisible;
                return (
                  <article
                    key={article.slug}
                    onClick={() => handleArticleClick(article.slug)}
                    className={`card-hover rounded-xl p-8 border cursor-pointer ${
                      isVisible
                        ? isNewlyVisible
                          ? 'animate-fade-in-slide-up'
                          : 'animate-scale-in'
                        : 'opacity-0'
                    } ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 hover:border-blue-500'
                        : 'bg-white border-slate-200 hover:border-blue-400'
                    }`}
                    style={{
                      animationDelay: isNewlyVisible ? `${(index - 4) * 100}ms` : `${index * 150}ms`,
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {article.title}
                        </h3>
                        {article.subtitle && (
                          <p className={`text-sm mb-3 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {article.subtitle}
                          </p>
                        )}
                        <div className={`flex items-center gap-4 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{formatDate(article.date)}</span>
                          </div>
                          {article.readingTime && (
                            <span>• {article.readingTime} {t('blog.minRead')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className={`mb-4 line-clamp-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {article.content.substring(0, 200).replace(/[#*`]/g, '')}...
                    </p>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isDark
                                ? 'bg-slate-700 text-slate-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(article.slug);
                        }}
                        className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          hasLiked(article.slug)
                            ? 'bg-blue-600 text-white'
                            : isDark
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <ThumbsUp size={18} fill={hasLiked(article.slug) ? 'currentColor' : 'none'} />
                        <span>{likes[article.slug] || 0}</span>
                      </button>

                      <span className={`text-sm font-medium ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {t('blog.readMore')} →
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* View More/Less Button */}
            {filteredArticles.length > 4 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={visibleCount > 4 ? handleShowLess : handleShowMore}
                  className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                      : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {visibleCount > 4 ? (
                    <>
                      <ChevronUp size={20} />
                      <span className="font-medium">{t('blog.viewLess')}</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={20} />
                      <span className="font-medium">
                        {t('blog.viewMore')} ({Math.min(4, filteredArticles.length - visibleCount)})
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
