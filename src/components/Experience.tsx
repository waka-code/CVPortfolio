import { Briefcase } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ExperienceCard, Job } from './ExperienceCard';
import { ViewAllButton } from './ViewAllButton';
import { ALL_EXPERIENCE_HASH } from '../constants/routes';

const HOME_JOB_COUNT = 4;

interface ExperienceProps {
  jobs: Job[];
}

export function Experience({ jobs }: ExperienceProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const displayedJobs = jobs.slice(0, HOME_JOB_COUNT);

  return (
    <section
      id="experience"
      ref={elementRef}
      className={`py-20 px-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex items-center gap-3 mb-12 ${
            isVisible ? 'animate-fade-in-left' : 'opacity-0'
          }`}
        >
          <Briefcase className={`text-blue-600 ${isVisible ? 'animate-bounce-in' : ''}`} size={32} />
          <h2 className={`text-4xl font-bold title-underline ${isVisible ? 'visible' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('experience.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {displayedJobs.map((job, index) => (
            <ExperienceCard
              key={job.id}
              job={job}
              animationClass={isVisible ? 'animate-slide-in-up' : 'opacity-0'}
              animationDelay={`${index * 150}ms`}
            />
          ))}
        </div>

        {jobs.length > HOME_JOB_COUNT && (
          <ViewAllButton
            href={ALL_EXPERIENCE_HASH}
            label={t('experience.viewAll')}
            count={jobs.length}
            surface="light"
          />
        )}
      </div>
    </section>
  );
}
