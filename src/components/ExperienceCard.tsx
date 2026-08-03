import { ArrowRight, Eye } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { jobHash } from '../constants/routes';

export interface Job {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  tasks: string[];
  technologies: string[];
  relatedProjectIds?: string[];
  images?: string;
  /** Year the role started, used to order the About timeline */
  startYear?: number;
}

interface ExperienceCardProps {
  job: Job;
  animationClass?: string;
  animationDelay?: string;
}

export function ExperienceCard({ job, animationClass = '', animationDelay }: ExperienceCardProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [showResponsibilities, setShowResponsibilities] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTooltipEnter = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowResponsibilities(true);
  };

  const handleTooltipLeave = () => {
    tooltipTimer.current = setTimeout(() => setShowResponsibilities(false), 80);
  };

  const openDetail = () => {
    window.location.hash = jobHash(job.id);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${job.title} — ${job.company}`}
      onClick={openDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      }}
      className={`group relative card-hover rounded-xl p-8 border cursor-pointer transition-colors flex flex-col h-full ${animationClass} ${
        isDark
          ? 'bg-slate-800 border-slate-700 hover:border-blue-500'
          : 'bg-slate-50 border-slate-200 hover:border-blue-300'
      }`}
      style={{ animationDelay, zIndex: showResponsibilities ? 10 : undefined }}
    >
      <div className="mb-4">
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {job.title}
        </h3>
        <p className="text-xl text-blue-600 font-semibold mb-1">{job.company}</p>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{job.period}</p>
      </div>

      <p className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        {job.description}
      </p>

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
          {t('experience.keyResponsibilities')}
        </div>
        {showResponsibilities && (
          <div
            className="absolute top-full left-0 mt-2 w-72 rounded-xl p-4 bg-slate-900 border border-slate-700 shadow-2xl animate-tooltip-in z-20"
            onMouseEnter={handleTooltipEnter}
            onMouseLeave={handleTooltipLeave}
          >
            <ul className="space-y-2">
              {job.tasks.map((task, taskIndex) => (
                <li key={taskIndex} className="flex gap-2 text-sm text-slate-200">
                  <span className="text-blue-400 font-bold shrink-0">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h4 className={`font-semibold mb-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('experience.technologies')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {job.technologies.map((tech, techIndex) => (
            <span
              key={techIndex}
              className={`skill-glow px-3 py-1 rounded-full text-sm cursor-default ${
                isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`mt-auto pt-4 border-t flex items-center justify-end gap-1.5 text-sm font-medium transition-colors ${
          isDark
            ? 'border-slate-700 text-slate-400 group-hover:text-blue-400'
            : 'border-slate-200 text-slate-500 group-hover:text-blue-600'
        }`}
      >
        {t('experience.viewDetail')}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}
