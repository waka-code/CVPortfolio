import { ArrowLeft, ChevronLeft, ChevronRight, Code2, Download, Filter } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ProjectCard, Project } from './ProjectCard';
import { useSearchParamsState } from '../hooks/useSearchParamsState';
import { buildFilterOptions, filterProjects } from '../utils/projectFilters';
import {
  ALL_PROJECTS_HASH,
  COMPANY_PARAM,
  PAGE_PARAM,
  PROJECTS_SECTION_HASH,
} from '../constants/routes';

const PAGE_SIZE = 4;

interface AllProjectsProps {
  projects: Project[];
}

export function AllProjects({ projects }: AllProjectsProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useSearchParamsState();

  // This screen scrolls itself, so resetting the scroll means scrolling the container
  const screenRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => screenRef.current?.scrollTo({ top: 0 });

  const handleBack = useCallback(() => {
    window.location.hash = PROJECTS_SECTION_HASH;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const open = window.location.hash === ALL_PROJECTS_HASH;
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

  const filterOptions = useMemo(() => buildFilterOptions(projects), [projects]);

  // An unknown value in the URL falls back to showing everything
  const rawCompany = params.get(COMPANY_PARAM) ?? '';
  const company = filterOptions.some((option) => option.value === rawCompany) ? rawCompany : '';

  const filtered = useMemo(() => filterProjects(projects, company), [projects, company]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const parsedPage = Number.parseInt(params.get(PAGE_PARAM) ?? '1', 10);
  const page = Number.isNaN(parsedPage) ? 1 : Math.min(Math.max(parsedPage, 1), totalPages);

  const pageProjects = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (nextPage: number) => {
    setParams({ [PAGE_PARAM]: nextPage <= 1 ? null : String(nextPage) });
    scrollToTop();
  };

  const handleFilterChange = (value: string) => {
    // A new filter invalidates the current page
    setParams({ [COMPANY_PARAM]: value || null, [PAGE_PARAM]: null });
    scrollToTop();
  };

  if (!isOpen) return null;

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
          className={`btn-animate flex items-center gap-2 mb-8 px-4 py-2 rounded-lg border transition-colors ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
              : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
          }`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('projects.back')}</span>
        </button>

        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Code2 className="text-blue-600" size={32} />
            <div>
              <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('projects.allTitle')}
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {filtered.length} {t('projects.projectsLabel')}
              </p>
            </div>
          </div>
          <a
            href={`${import.meta.env.BASE_URL}WSL.pdf`}
            download="Waddimi_Saint-Louis_CV.pdf"
            className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            <Download size={20} />
            <span className="font-medium">{t('projects.downloadCV')}</span>
          </a>
        </div>

        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <label
            htmlFor="project-company-filter"
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Filter size={16} className="text-blue-500" />
            {t('projects.filterLabel')}
          </label>
          <select
            id="project-company-filter"
            value={company}
            onChange={(e) => handleFilterChange(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:border-blue-500 ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="">{t('projects.filterAll')}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {pageProjects.length === 0 ? (
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {t('projects.noResults')}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {pageProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
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
              className={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500'
                  : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300'
              }`}
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
              className={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500'
                  : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
