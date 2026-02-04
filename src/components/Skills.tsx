import { Wrench } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

interface SkillCategory {
  category: string;
  skills: string[];
}

interface SkillsProps {
  skillCategories: SkillCategory[];
}

export function Skills({ skillCategories }: SkillsProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <section
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
          <Wrench className={`text-blue-600 ${isVisible ? 'animate-bounce-in' : ''}`} size={32} />
          <h2 className={`text-4xl font-bold title-underline ${isVisible ? 'visible' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('skills.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={`card-hover rounded-xl p-6 border ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              } ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-50 border-slate-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3
                className={`text-xl font-bold mb-4 pb-2 border-b-2 border-blue-600 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className={`skill-glow px-4 py-2 rounded-lg text-sm font-medium cursor-default ${
                      isDark
                        ? 'bg-slate-700 text-slate-200 border border-slate-600'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
