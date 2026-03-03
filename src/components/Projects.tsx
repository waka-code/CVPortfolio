import { Code2, Github, ExternalLink, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ProjectImageGallery } from './ProjectImageGallery';
import { useState } from 'react';

interface Project {
  name: string;
  date: string;
  description: string;
  tasks?: string[];
  technologies: string[];
  link?: string;
  images?: string;
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [visibleCount, setVisibleCount] = useState(2);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const displayedProjects = projects.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, projects.length));
  };

  const handleShowLess = () => {
    setVisibleCount(2);
  };

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
          {displayedProjects.map((project, index) => {
            const isNewlyVisible = index >= 2 && isVisible;
            return (
              <div
                key={index}
                className={`relative card-hover rounded-xl p-8 border overflow-hidden ${
                  isVisible
                    ? isNewlyVisible
                      ? 'animate-fade-in-slide-up'
                      : 'animate-scale-in'
                    : 'opacity-0'
                } ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 hover:border-none'
                    : 'bg-white border-slate-200 hover:border-none'
                } ${project.images ? 'cursor-pointer' : ''}`}
                style={{
                  animationDelay: isNewlyVisible ? `${(index - 2) * 100}ms` : `${index * 150}ms`,
                }}
                onMouseEnter={() => project.images && setHoveredProject(project.images)}
                onMouseLeave={() => setHoveredProject(null)}
              >
              {project.images && (
                <ProjectImageGallery
                  projectFolder={project.images}
                  isHovering={hoveredProject === project.images}
                />
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3
                    className={`text-2xl font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {project.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {project.date}
                  </p>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-animate transition-colors ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {project.name.toLowerCase().includes('ownorbit') ? (
                      <ExternalLink size={24} />
                    ) : (
                      <Github size={24} />
                    )}
                  </a>
                )}
              </div>

              <p
                className={`mb-4 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {project.description}
              </p>

              {project.tasks && project.tasks.length > 0 && (
                <div className="mb-4">
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {t('projects.keyFeatures')}
                  </h4>
                  <ul className="space-y-2">
                    {project.tasks.map((task, taskIndex) => (
                      <li
                        key={taskIndex}
                        className={`flex gap-2 text-sm ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('projects.techStack')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className={`skill-glow px-3 py-1 rounded-full text-xs font-medium cursor-default ${
                        isDark
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {projects.length > 2 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={visibleCount === 2 ? handleShowMore : handleShowLess}
              className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                  : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {visibleCount > 2 ? (
                <>
                  <ChevronUp size={20} />
                  <span className="font-medium">{t('projects.viewLess')}</span>
                </>
              ) : (
                <>
                  <ChevronDown size={20} />
                  <span className="font-medium">
                    {t('projects.viewMore')} ({Math.min(3, projects.length - visibleCount)})
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
