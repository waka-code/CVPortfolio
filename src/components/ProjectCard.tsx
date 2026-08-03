import { LucideGithub, ExternalLink, Images, Eye, Building2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ProjectImageGallery } from './ProjectImageGallery';
import { projectHash } from '../constants/routes';
import { useRef, useState } from 'react';

export interface Project {
  id: string;
  name: string;
  date: string;
  description: string;
  company?: string;
  tasks?: string[];
  technologies: string[];
  link?: string;
  images?: string;
}

interface ProjectCardProps {
  project: Project;
  animationClass?: string;
  animationDelay?: string;
  /** `compact` shows only the name and a trimmed description — used for related projects */
  variant?: 'full' | 'compact';
}

export function ProjectCard({
  project,
  animationClass = '',
  animationDelay,
  variant = 'full',
}: ProjectCardProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [showGallery, setShowGallery] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCompact = variant === 'compact';

  const handleTooltipEnter = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowFeatures(true);
  };

  const handleTooltipLeave = () => {
    tooltipTimer.current = setTimeout(() => setShowFeatures(false), 80);
  };

  const openDetail = () => {
    window.location.hash = projectHash(project.id);
  };

  const footer = (
    <div
      className={`mt-auto pt-4 border-t flex items-center justify-end gap-1.5 text-sm font-medium transition-colors ${
        isDark
          ? 'border-slate-800 text-slate-400 group-hover:text-blue-400'
          : 'border-slate-100 text-slate-500 group-hover:text-blue-600'
      }`}
    >
      {t('projects.viewDetail')}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </div>
  );

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={project.name}
      onClick={openDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      }}
      className={`group relative card-hover rounded-xl border cursor-pointer transition-colors flex flex-col h-full ${
        isCompact ? 'p-6' : 'p-8'
      } ${animationClass} ${
        isDark
          ? 'bg-slate-900 border-slate-700 hover:border-blue-500/60'
          : 'bg-white border-slate-200 hover:border-blue-300'
      }`}
      style={{ animationDelay, zIndex: showFeatures ? 10 : undefined }}
    >
      {isCompact ? (
        <>
          <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {project.name}
          </h3>
          <p
            className={`mb-6 text-sm leading-relaxed line-clamp-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {project.description}
          </p>
        </>
      ) : (
        <>
          {project.images && (
            <ProjectImageGallery
              projectFolder={project.images}
              isHovering={showGallery}
              onClose={() => setShowGallery(false)}
            />
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap mb-1">
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {project.name}
                </h3>
                {project.images && (
                  <span
                    role="button"
                    tabIndex={0}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border shrink-0 mt-1 cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-blue-600/15 text-blue-400 border-blue-600/30 hover:bg-blue-600/30'
                        : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGallery((prev) => !prev);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowGallery((prev) => !prev);
                      }
                    }}
                  >
                    <Images size={11} />
                    {t('projects.screenshots')}
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
                onClick={(e) => e.stopPropagation()}
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

          {project.company && (
            <div
              className={`inline-flex items-center gap-1.5 text-xs mb-3 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Building2 size={13} />
              {project.company}
            </div>
          )}

          <p className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {project.description}
          </p>

          {project.tasks && project.tasks.length > 0 && (
            <div
              className="mb-4 relative"
              onMouseEnter={handleTooltipEnter}
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
              {showFeatures && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 rounded-xl p-4 bg-slate-900 border border-slate-700 shadow-2xl animate-tooltip-in z-20"
                  onMouseEnter={handleTooltipEnter}
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

          <div className="mb-6">
            <h4 className={`font-semibold mb-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('projects.techStack')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className={`skill-glow px-3 py-1 rounded-full text-xs font-medium cursor-default ${
                    isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {footer}
    </div>
  );
}
