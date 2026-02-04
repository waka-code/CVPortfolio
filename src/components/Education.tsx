import { GraduationCap, Languages } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

interface EducationProps {
  degree: string;
  institution: string;
  period: string;
  languages: { language: string; level: string }[];
  certifications: string[];
}

export function Education({ degree, institution, period, languages, certifications }: EducationProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <section
      ref={elementRef}
      className={`py-20 px-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-800' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div
              className={`flex items-center gap-3 mb-6 ${
                isVisible ? 'animate-fade-in-left' : 'opacity-0'
              }`}
            >
              <GraduationCap className={`text-blue-600 ${isVisible ? 'animate-bounce-in' : ''}`} size={32} />
              <h2 className={`text-3xl font-bold title-underline ${isVisible ? 'visible' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('education.title')}
              </h2>
            </div>

            <div
              className={`card-hover rounded-xl p-6 border mb-8 ${
                isVisible ? 'animate-slide-in-up' : 'opacity-0'
              } ${
                isDark
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {degree}
              </h3>
              <p className="text-blue-600 font-semibold mb-1">{institution}</p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{period}</p>
            </div>

            <div
              className={`card-hover rounded-xl p-6 border ${
                isVisible ? 'animate-slide-in-up delay-200' : 'opacity-0'
              } ${
                isDark
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('education.certifications')}
              </h3>
              <ul className="space-y-2">
                {certifications.map((cert, index) => (
                  <li key={index} className={`flex gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div
              className={`flex items-center gap-3 mb-6 ${
                isVisible ? 'animate-fade-in-right' : 'opacity-0'
              }`}
            >
              <Languages className={`text-blue-600 ${isVisible ? 'animate-rotate-in' : ''}`} size={32} />
              <h2 className={`text-3xl font-bold title-underline ${isVisible ? 'visible' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('education.languages')}
              </h2>
            </div>

            <div
              className={`card-hover rounded-xl p-6 border ${
                isVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'
              } ${
                isDark
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              {languages.map((lang, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang.language}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDark
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {lang.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
