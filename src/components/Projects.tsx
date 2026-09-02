import { Code2, Download } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ProjectCard, Project } from './ProjectCard';
import { ViewAllButton } from './ViewAllButton';
import { ALL_PROJECTS_HASH } from '../constants/routes';

const HOME_PROJECT_COUNT = 4;

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const displayedProjects = projects.slice(0, HOME_PROJECT_COUNT);

  return (
    <section
      id="projects"
      ref={elementRef}
      className={`py-20 px-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-800' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex items-center justify-between mb-12 ${
            isVisible ? 'animate-fade-in-right' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <Code2 className={`text-blue-600 ${isVisible ? 'animate-rotate-in' : ''}`} size={32} />
            <h2 className={`text-4xl font-bold title-underline ${isVisible ? 'visible' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('projects.title')}
            </h2>
          </div>
          <a
            href={`${import.meta.env.BASE_URL}WSL.pdf`}
            download="Waddimi_Saint-Louis_CV.pdf"
            className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            <Download size={20} />
            <span className="font-medium">{t('projects.downloadCV')}</span>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8 projects-grid">
          {displayedProjects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              animationClass={isVisible ? 'animate-scale-in' : 'opacity-0'}
              animationDelay={`${index * 150}ms`}
            />
          ))}
        </div>

        {projects.length > HOME_PROJECT_COUNT && (
          <ViewAllButton
            href={ALL_PROJECTS_HASH}
            label={t('projects.viewAll')}
            count={projects.length}
            surface="dark"
          />
        )}
      </div>
    </section>
  );
}
