import { Briefcase } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

interface Job {
  title: string;
  company: string;
  period: string;
  description: string;
  tasks: string[];
  technologies: string[];
}

interface ExperienceProps {
  jobs: Job[];
}

export function Experience({ jobs }: ExperienceProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();

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
          {jobs.map((job, index) => (
            <div
              key={index}
              className={`card-hover rounded-xl p-8 border ${
                isVisible ? 'animate-slide-in-up' : 'opacity-0'
              } ${
                isDark
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-500'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-300'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {job.title}
                </h3>
                <p className="text-xl text-blue-600 font-semibold mb-1">{job.company}</p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{job.period}</p>
              </div>

              <p
                className={`mb-4 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {job.description}
              </p>

              <div className="mb-4">
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('experience.keyResponsibilities')}
                </h4>
                <ul className="space-y-2">
                  {job.tasks.map((task, taskIndex) => (
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

              <div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('experience.technologies')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className={`skill-glow px-3 py-1 rounded-full text-sm cursor-default ${
                        isDark
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
