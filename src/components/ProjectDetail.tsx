import { Building2, Calendar, ExternalLink, LucideGithub, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { BackButton } from './BackButton';
import { ScreenshotSlider } from './ScreenshotSlider';
import { PROJECTS_SECTION_HASH, PROJECT_HASH_PREFIX } from '../constants/routes';
import type { Project } from './ProjectCard';

interface ProjectDetailProps {
  projects: Project[];
}

export function ProjectDetail({ projects }: ProjectDetailProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLightboxOpen, setLightboxOpen] = useState(false);

  // Where to return to: whichever non-detail screen the user came from
  const originRef = useRef(PROJECTS_SECTION_HASH);

  const project = projects.find((p) => p.id === projectId) ?? null;

  const handleBack = useCallback(() => {
    window.location.hash = originRef.current;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash.startsWith(PROJECT_HASH_PREFIX)) {
        setProjectId(hash.slice(PROJECT_HASH_PREFIX.length));
        window.scrollTo(0, 0);
      } else {
        originRef.current = hash || PROJECTS_SECTION_HASH;
        setProjectId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!projectId) return;

    // The slider owns Escape while its lightbox is up
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLightboxOpen) handleBack();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectId, isLightboxOpen, handleBack]);

  if (!projectId) return null;

  const backButton = <BackButton onClick={handleBack} label={t('projects.back')} />;

  const screenClass = `fixed inset-0 z-[55] overflow-y-auto overscroll-contain animate-fade-in-up ${
    isDark ? 'bg-slate-900' : 'bg-slate-50'
  }`;

  if (!project) {
    return (
      <div className={screenClass}>
        <div className="max-w-3xl mx-auto px-4 py-12">
          {backButton}
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            {t('projects.notFound')}
          </p>
        </div>
      </div>
    );
  }


  const linkButtonClass = `btn-animate inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors ${
    isDark
      ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500'
      : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300'
  }`;

  return (
    <div className={screenClass}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {backButton}

        <header className="mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {project.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Calendar size={14} className="text-blue-500" />
              {project.date}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${
                isDark
                  ? 'bg-blue-600/15 border-blue-600/30 text-blue-400'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              {project.company ? (
                <>
                  <Building2 size={14} />
                  {t('projects.assignedBy')}: {project.company}
                </>
              ) : (
                <>
                  <User size={14} />
                  {t('projects.personalProject')}
                </>
              )}
            </span>

            {project.siteLink && (
              <a
                href={project.siteLink}
                target="_blank"
                rel="noopener noreferrer"
                className={linkButtonClass}
              >
                <ExternalLink size={14} />
                {t('projects.visitSite')}
              </a>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={linkButtonClass}
              >
                <LucideGithub size={14} />
                {t('projects.viewRepo')}
              </a>
            )}
          </div>

          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {project.description}
          </p>
        </header>

        {project.tasks && project.tasks.length > 0 && (
          <section className="mb-10">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('projects.keyFeatures')}
            </h2>
            <ul className="space-y-3">
              {project.tasks.map((task, index) => (
                <li
                  key={index}
                  className={`flex gap-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  <span className="text-blue-500 font-bold shrink-0">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('projects.techStack')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className={`skill-glow px-3 py-1.5 rounded-full text-sm font-medium ${
                  isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {project.images && (
          <section>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('projects.screenshots')}
            </h2>

            <ScreenshotSlider
              folder={project.images}
              title={project.name}
              onLightboxOpenChange={setLightboxOpen}
            />
          </section>
        )}
      </div>
    </div>
  );
}
