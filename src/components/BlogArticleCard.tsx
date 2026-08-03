import { ArrowRight, Clock, GitBranch, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { formatDate } from '../utils/formatDate';
import { blogHash } from '../constants/routes';
import type { BlogArticle } from '../utils/blogLoader';

interface BlogArticleCardProps {
  article: BlogArticle;
  likeCount: number;
  hasLiked: boolean;
  onToggleLike: (slug: string) => void;
  /** Clicking a tag narrows the list the card lives in; omitted when not filterable */
  onTagClick?: (tag: string) => void;
  animationClass?: string;
  animationDelay?: string;
}

export function BlogArticleCard({
  article,
  likeCount,
  hasLiked,
  onToggleLike,
  onTagClick,
  animationClass = '',
  animationDelay,
}: BlogArticleCardProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const openArticle = () => {
    window.location.hash = blogHash(article.slug);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={article.title}
      onClick={openArticle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openArticle();
        }
      }}
      className={`group card-hover rounded-xl p-8 border cursor-pointer transition-colors flex flex-col h-full ${animationClass} ${
        isDark
          ? 'bg-slate-800 border-slate-700 hover:border-blue-500'
          : 'bg-white border-slate-200 hover:border-blue-400'
      }`}
      style={{ animationDelay }}
    >
      <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {article.title}
      </h3>

      {article.subtitle && (
        <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {article.subtitle}
        </p>
      )}

      <div
        className={`flex items-center gap-4 text-sm mb-4 flex-wrap ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{formatDate(article.date)}</span>
        </div>
        {article.readingTime && (
          <span>• {article.readingTime} {t('blog.minRead')}</span>
        )}
        {article.branch && (
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
              isDark
                ? 'bg-blue-600/15 text-blue-400 border-blue-600/30'
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}
          >
            <GitBranch size={11} />
            {article.branch}
          </span>
        )}
      </div>

      <p className={`mb-4 line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        {article.content.substring(0, 200).replace(/[#*`]/g, '')}...
      </p>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              onClick={
                onTagClick
                  ? (e) => {
                      e.stopPropagation();
                      onTagClick(tag);
                    }
                  : undefined
              }
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                onTagClick ? 'cursor-pointer' : ''
              } ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(article.slug);
          }}
          className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasLiked
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ThumbsUp size={18} fill={hasLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>

        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}
        >
          {t('blog.readMore')}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
