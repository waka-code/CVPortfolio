import { Briefcase, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { BackButton } from './BackButton';
import { ExperienceCard, Job } from './ExperienceCard';
import { useSearchParamsState } from '../hooks/useSearchParamsState';
import { buildCompanyOptions, buildRoleOptions, filterJobs } from '../utils/experienceFilters';
import {
  ALL_EXPERIENCE_HASH,
  EXPERIENCE_SECTION_HASH,
  JOB_COMPANY_PARAM,
  JOB_PAGE_PARAM,
  JOB_ROLE_PARAM,
} from '../constants/routes';

const PAGE_SIZE = 4;

interface AllExperienceProps {
  jobs: Job[];
}

export function AllExperience({ jobs }: AllExperienceProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useSearchParamsState();

  const screenRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => screenRef.current?.scrollTo({ top: 0 });

  const handleBack = useCallback(() => {
    window.location.hash = EXPERIENCE_SECTION_HASH;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const open = window.location.hash === ALL_EXPERIENCE_HASH;
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

  const companyOptions = useMemo(() => buildCompanyOptions(jobs), [jobs]);
  const roleOptions = useMemo(() => buildRoleOptions(jobs), [jobs]);

  // Unknown values in the URL fall back to no filter
  const rawCompany = params.get(JOB_COMPANY_PARAM) ?? '';
  const company = companyOptions.some((o) => o.value === rawCompany) ? rawCompany : '';
  const rawRole = params.get(JOB_ROLE_PARAM) ?? '';
  const role = roleOptions.some((o) => o.value === rawRole) ? rawRole : '';

  const filtered = useMemo(() => filterJobs(jobs, company, role), [jobs, company, role]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const parsedPage = Number.parseInt(params.get(JOB_PAGE_PARAM) ?? '1', 10);
  const page = Number.isNaN(parsedPage) ? 1 : Math.min(Math.max(parsedPage, 1), totalPages);

  const pageJobs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (nextPage: number) => {
    setParams({ [JOB_PAGE_PARAM]: nextPage <= 1 ? null : String(nextPage) });
    scrollToTop();
  };

  const handleFilterChange = (key: string, value: string) => {
    // A new filter invalidates the current page
    setParams({ [key]: value || null, [JOB_PAGE_PARAM]: null });
    scrollToTop();
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
        <BackButton onClick={handleBack} label={t('experience.back')} />

        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Briefcase className="text-blue-600" size={32} />
            <div>
              <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('experience.allTitle')}
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {filtered.length} {t('experience.jobsLabel')}
              </p>
            </div>
          </div>
          <a
            href={`${import.meta.env.BASE_URL}Waddimi-Saint-Louis_AC..pdf`}
            download="Waddimi_Saint-Louis_CV.pdf"
            className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${buttonClass}`}
          >
            <Download size={20} />
            <span className="font-medium">{t('projects.downloadCV')}</span>
          </a>
        </div>

        <div className="flex items-center gap-4 mb-10 flex-wrap">
          <span
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Filter size={16} className="text-blue-500" />
            {t('experience.filterLabel')}
          </span>

          <div className="flex items-center gap-2">
            <label
              htmlFor="job-company-filter"
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              {t('experience.filterCompany')}
            </label>
            <select
              id="job-company-filter"
              value={company}
              onChange={(e) => handleFilterChange(JOB_COMPANY_PARAM, e.target.value)}
              className={selectClass}
            >
              <option value="">{t('experience.filterAllCompanies')}</option>
              {companyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="job-role-filter"
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              {t('experience.filterRole')}
            </label>
            <select
              id="job-role-filter"
              value={role}
              onChange={(e) => handleFilterChange(JOB_ROLE_PARAM, e.target.value)}
              className={selectClass}
            >
              <option value="">{t('experience.filterAllRoles')}</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {pageJobs.length === 0 ? (
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {t('experience.noResults')}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {pageJobs.map((job, index) => (
              <ExperienceCard
                key={job.id}
                job={job}
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
