import { Briefcase, Calendar, Code2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from './BackButton';
import { useTheme } from '../context/ThemeContext';
import { ProjectCard, Project } from './ProjectCard';
import { ScreenshotSlider } from './ScreenshotSlider';
import type { Job } from './ExperienceCard';
import {
  EXPERIENCE_SECTION_HASH,
  JOB_HASH_PREFIX,
  PROJECT_HASH_PREFIX,
} from '../constants/routes';

interface ExperienceDetailProps {
  jobs: Job[];
  projects: Project[];
}

export function ExperienceDetail({ jobs, projects }: ExperienceDetailProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [jobId, setJobId] = useState<string | null>(null);
  const [isLightboxOpen, setLightboxOpen] = useState(false);

  // Where to return to: whichever list screen the user came from
  const originRef = useRef(EXPERIENCE_SECTION_HASH);

  const job = jobs.find((j) => j.id === jobId) ?? null;

  const handleBack = useCallback(() => {
    window.location.hash = originRef.current;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash.startsWith(JOB_HASH_PREFIX)) {
        setJobId(hash.slice(JOB_HASH_PREFIX.length));
        window.scrollTo(0, 0);
        return;
      }

      // A project detail sits on top of this screen, so it is not an origin
      if (!hash.startsWith(PROJECT_HASH_PREFIX)) {
        originRef.current = hash || EXPERIENCE_SECTION_HASH;
      }
      setJobId(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!jobId) return;

    // The slider owns Escape while its lightbox is up
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLightboxOpen) handleBack();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [jobId, isLightboxOpen, handleBack]);

  if (!jobId) return null;

  const backButton = <BackButton onClick={handleBack} label={t('experience.back')} />;

  const screenClass = `fixed inset-0 z-[55] overflow-y-auto overscroll-contain animate-fade-in-up ${
    isDark ? 'bg-slate-900' : 'bg-slate-50'
  }`;

  if (!job) {
    return (
      <div className={screenClass}>
        <div className="max-w-3xl mx-auto px-4 py-12">
          {backButton}
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            {t('experience.notFound')}
          </p>
        </div>
      </div>
    );
  }

  const relatedProjects = projects.filter((project) =>
    job.relatedProjectIds?.includes(project.id)
  );

  return (
    <div className={screenClass}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {backButton}

        <header className="mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${
                isDark
                  ? 'bg-blue-600/15 border-blue-600/30 text-blue-400'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              <Briefcase size={14} />
              {job.company}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Calendar size={14} className="text-blue-500" />
              {job.period}
            </span>
          </div>

          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {job.description}
          </p>
        </header>

        <section className="mb-10">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('experience.keyResponsibilities')}
          </h2>
          <ul className="space-y-3">
            {job.tasks.map((task, index) => (
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

        <section className="mb-10">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('experience.technologies')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.technologies.map((tech) => (
              <span
                key={tech}
                className={`skill-glow px-3 py-1.5 rounded-full text-sm font-medium ${
                  isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {job.images && (
          <section className="mb-10">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('projects.screenshots')}
            </h2>

            <ScreenshotSlider
              folder={job.images}
              title={job.title}
              onLightboxOpenChange={setLightboxOpen}
            />
          </section>
        )}

        {/* Jobs spent on a single product have no project list — their screenshots above say it */}
        {relatedProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="text-blue-600" size={22} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('experience.relatedProjects')}
              </h2>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                ({relatedProjects.length})
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {relatedProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="compact"
                  animationClass="animate-fade-in-slide-up"
                  animationDelay={`${index * 80}ms`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
