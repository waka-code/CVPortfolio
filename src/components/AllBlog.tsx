import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { BlogArticleCard } from './BlogArticleCard';
import { useSearchParamsState } from '../hooks/useSearchParamsState';
import { useBlogLikes } from '../hooks/useBlogLikes';
import { useBlogArticles } from '../hooks/useBlogArticles';
import {
  ALL_BLOG_HASH,
  BLOG_BRANCH_PARAM,
  BLOG_PAGE_PARAM,
  BLOG_SEARCH_PARAM,
  BLOG_SECTION_HASH,
  BLOG_TECH_PARAM,
} from '../constants/routes';

const PAGE_SIZE = 4;

export function AllBlog() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { articles } = useBlogArticles();
  const [params, setParams] = useSearchParamsState();
  const { likes, toggleLike, hasLiked } = useBlogLikes();

  const screenRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => screenRef.current?.scrollTo({ top: 0 });

  const handleBack = useCallback(() => {
    window.location.hash = BLOG_SECTION_HASH;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const open = window.location.hash === ALL_BLOG_HASH;
      setIsOpen(open);
      if (open) {
        window.scrollTo(0, 0);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBack();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleBack]);

  const techOptions = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((article) => article.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [articles]);

  const branchOptions = useMemo(() => {
    const branches = new Set<string>();
    articles.forEach((article) => {
      if (article.branch) branches.add(article.branch);
    });
    return Array.from(branches).sort();
  }, [articles]);

  const search = params.get(BLOG_SEARCH_PARAM) ?? '';
  // Unknown values in the URL fall back to no filter
  const rawTech = params.get(BLOG_TECH_PARAM) ?? '';
  const tech = techOptions.includes(rawTech) ? rawTech : '';
  const rawBranch = params.get(BLOG_BRANCH_PARAM) ?? '';
  const branch = branchOptions.includes(rawBranch) ? rawBranch : '';

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return articles.filter((article) => {
      const matchesSearch =
        term === '' ||
        article.title.toLowerCase().includes(term) ||
        article.subtitle.toLowerCase().includes(term) ||
        article.content.toLowerCase().includes(term);

      const matchesTech = !tech || Boolean(article.tags?.includes(tech));
      const matchesBranch = !branch || article.branch === branch;

      return matchesSearch && matchesTech && matchesBranch;
    });
  }, [articles, search, tech, branch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const parsedPage = Number.parseInt(params.get(BLOG_PAGE_PARAM) ?? '1', 10);
  const page = Number.isNaN(parsedPage) ? 1 : Math.min(Math.max(parsedPage, 1), totalPages);

  const pageArticles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (nextPage: number) => {
    setParams({ [BLOG_PAGE_PARAM]: nextPage <= 1 ? null : String(nextPage) });
    scrollToTop();
  };

  // Any filter change invalidates the current page
  const handleFilterChange = (key: string, value: string) => {
    setParams({ [key]: value || null, [BLOG_PAGE_PARAM]: null });
  };

  if (!isOpen) return null;

  const selectClass = `px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:border-blue-500 ${
    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
  }`;

  const buttonClass = isDark
    ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500'
    : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300';

  return (
    <div
      ref={screenRef}
      className={`fixed inset-0 z-[55] overflow-y-auto overscroll-contain animate-fade-in-up ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button
          onClick={handleBack}
          className={`btn-animate flex items-center gap-2 mb-8 px-4 py-2 rounded-lg border transition-colors ${buttonClass}`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('blog.back')}</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="text-blue-600" size={32} />
          <div>
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('blog.allTitle')}
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {filtered.length} {t('blog.articlesLabel')}
            </p>
          </div>
        </div>

        <div className="mb-10 space-y-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder={t('blog.search')}
              value={search}
              onChange={(e) => handleFilterChange(BLOG_SEARCH_PARAM, e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span
              className={`inline-flex items-center gap-2 text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Filter size={16} className="text-blue-500" />
              {t('blog.filterLabel')}
            </span>

            <div className="flex items-center gap-2">
              <label
                htmlFor="blog-tech-filter"
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
              >
                {t('blog.filterTech')}
              </label>
              <select
                id="blog-tech-filter"
                value={tech}
                onChange={(e) => handleFilterChange(BLOG_TECH_PARAM, e.target.value)}
                className={selectClass}
              >
                <option value="">{t('blog.filterAllTech')}</option>
                {techOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="blog-branch-filter"
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
              >
                {t('blog.filterBranch')}
              </label>
              <select
                id="blog-branch-filter"
                value={branch}
                onChange={(e) => handleFilterChange(BLOG_BRANCH_PARAM, e.target.value)}
                className={selectClass}
              >
                <option value="">{t('blog.filterAllBranches')}</option>
                {branchOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {pageArticles.length === 0 ? (
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('blog.noResults')}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {pageArticles.map((article, index) => (
              <BlogArticleCard
                key={article.slug}
                article={article}
                likeCount={likes[article.slug] || 0}
                hasLiked={hasLiked(article.slug)}
                onToggleLike={toggleLike}
                onTagClick={(tag) => handleFilterChange(BLOG_TECH_PARAM, tag)}
                animationClass="animate-fade-in-slide-up"
                animationDelay={`${index * 80}ms`}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              aria-label={t('projects.previousPage')}
              className={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${buttonClass}`}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                aria-current={pageNumber === page ? 'page' : undefined}
                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                  pageNumber === page
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              aria-label={t('projects.nextPage')}
              className={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${buttonClass}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
