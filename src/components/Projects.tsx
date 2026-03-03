import { Code2, LucideGithub, ExternalLink, Download, ChevronDown, ChevronUp, Images, Eye } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ProjectImageGallery } from './ProjectImageGallery';
import { useState, useRef } from 'react';

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
  const [hoveredFeatures, setHoveredFeatures] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayedProjects = projects.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, projects.length));
  };

  const handleShowLess = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setVisibleCount(2);
      setIsClosing(false);
    }, 260);
  };

  const handleTooltipEnter = (index: number) => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setHoveredFeatures(index);
  };

  const handleTooltipLeave = () => {
    tooltipTimer.current = setTimeout(() => setHoveredFeatures(null), 80);
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
            const isExiting = isClosing && index >= 2;
            return (
              <div
                key={index}
                className={`relative card-hover rounded-xl p-8 border ${
                  isExiting
                    ? 'animate-fade-out-slide-down'
                    : isVisible
                      ? isNewlyVisible
                        ? 'animate-fade-in-slide-up'
                        : 'animate-scale-in'
                      : 'opacity-0'
                } ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 hover:border-none'
                    : 'bg-white border-slate-200 hover:border-none'
                }`}
                style={{
                  animationDelay: isExiting
                    ? `${(index - 2) * 50}ms`
                    : isNewlyVisible
                      ? `${(index - 2) * 100}ms`
                      : `${index * 150}ms`,
                  zIndex: hoveredFeatures === index ? 10 : undefined,
                }}
              >
              {project.images && (
                <ProjectImageGallery
                  projectFolder={project.images}
                  isHovering={hoveredProject === project.images}
                  onClose={() => setHoveredProject(null)}
                />
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <h3
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {project.name}
                    </h3>
                    {project.images && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border shrink-0 mt-1 cursor-pointer transition-colors ${
                          isDark
                            ? 'bg-blue-600/15 text-blue-400 border-blue-600/30 hover:bg-blue-600/30'
                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                        }`}
                        onClick={() =>
                          setHoveredProject((prev) =>
                            prev === project.images ? null : project.images!
                          )
                        }
                      >
                        <Images size={11} />
                        Screenshots
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {project.date}
                  </p>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-animate transition-colors ml-2 shrink-0 ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {project.name.toLowerCase().includes('ownorbit') ? (
                      <ExternalLink size={24} />
                    ) : (
                      <LucideGithub size={24} />
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
                <div
                  className="mb-4 relative"
                  onMouseEnter={() => handleTooltipEnter(index)}
                  onMouseLeave={handleTooltipLeave}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 font-semibold text-sm cursor-default select-none ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <Eye size={14} className="text-blue-500" />
                    {t('projects.keyFeatures')}
                  </div>
                  {hoveredFeatures === index && (
                    <div
                      className="absolute top-full left-0 mt-2 w-72 rounded-xl p-4 bg-slate-900 border border-slate-700 shadow-2xl animate-tooltip-in z-20"
                      onMouseEnter={() => handleTooltipEnter(index)}
                      onMouseLeave={handleTooltipLeave}
                    >
                      <ul className="space-y-2">
                        {project.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex gap-2 text-sm text-slate-200">
                            <span className="text-blue-400 font-bold shrink-0">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h4 className={`font-semibold mb-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
              disabled={isClosing}
              className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
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
