import { Github, Linkedin, Download, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

interface HeroProps {
  github: string;
  linkedin: string;
}

export function Hero({  github, linkedin }: HeroProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const scrollToServices = useCallback(() => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="home"
      ref={elementRef}
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-blue-50 via-white to-slate-50'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div
          className={`flex justify-center mb-6 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <img
            src={`${import.meta.env.BASE_URL}wsl.jpeg`}
            alt="Waddimi Saint-Louis"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-blue-500 shadow-2xl hover:ring-blue-400 transition-all hover:scale-105"
          />
        </div>
        <h1
          className={`text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r text-gradient-animate ${
            isDark ? 'from-blue-400 via-cyan-300 to-blue-400' : 'from-blue-600 via-blue-400 to-blue-600'
          } ${isVisible ? 'animate-blur-in delay-200' : 'opacity-0'}`}
        >
          {t('hero.title')}
        </h1>
        <p
          className={`text-2xl md:text-3xl mb-6 ${
            isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'
          } ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
        >
          {t('hero.subtitle')}
        </p>
        <p
          className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${
            isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'
          } ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
        >
          {t('hero.summary')}
        </p>

        <div
          className={`flex flex-wrap justify-center gap-4 mb-8 ${
            isVisible ? 'animate-fade-in-up delay-600' : 'opacity-0'
          }`}
        >
          <button
            onClick={scrollToServices}
            className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all`}
          >
            {t('hero.hireCTA')}
            <ArrowRight size={18} />
          </button>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-300 hover:bg-slate-400 text-slate-900'
            }`}
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-300 hover:bg-slate-400 text-slate-900'
            }`}
          >
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </a>
          <a
            href={`${import.meta.env.BASE_URL}WSL.pdf`}
            download="Waddimi_Saint-Louis_CV.pdf"
            className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <Download size={20} />
            <span>{t('projects.downloadCV')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
