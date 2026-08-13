import { Github, Linkedin, Download, User, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ABOUT_HASH } from '../constants/routes';
// import { useCallback } from 'react';

interface HeroProps {
  github: string;
  linkedin: string;
}

export function Hero({  github, linkedin }: HeroProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // const scrollToServices = useCallback(() => {
  //   document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  // }, []);

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
          className={`flex justify-center mb-8 ${
            isVisible ? 'animate-fade-in-up delay-600' : 'opacity-0'
          }`}
        >
          {/* <button
            onClick={scrollToServices}
            className={`btn-animate flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all`}
          >
            {t('hero.hireCTA')}
            <ArrowRight size={18} />
          </button> */}
          <div
            className={`inline-flex flex-wrap justify-center items-center gap-1 p-1.5 rounded-full border backdrop-blur-sm ${
              isDark
                ? 'bg-slate-900/60 border-slate-700/60'
                : 'bg-white/70 border-slate-200'
            }`}
          >
            <a
              href={ABOUT_HASH}
              className="cta-primary flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold ring-1 ring-inset ring-white/25"
            >
              <User size={17} />
              <span>{t('about.openCTA')}</span>
              <ArrowRight size={17} className="cta-arrow" />
            </a>
            <span
              aria-hidden="true"
              className={`h-5 w-px ${isDark ? 'bg-slate-700/70' : 'bg-slate-200'}`}
            />
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`icon-pill px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Github size={18} className="shrink-0" />
              <span className="icon-pill-label">GitHub</span>
            </a>
            <span
              aria-hidden="true"
              className={`h-5 w-px ${isDark ? 'bg-slate-700/70' : 'bg-slate-200'}`}
            />
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`icon-pill px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Linkedin size={18} className="shrink-0" />
              <span className="icon-pill-label">LinkedIn</span>
            </a>
            <span
              aria-hidden="true"
              className={`h-5 w-px ${isDark ? 'bg-slate-700/70' : 'bg-slate-200'}`}
            />
            <a
              href={`${import.meta.env.BASE_URL}WSL.pdf`}
              download="Waddimi_Saint-Louis_CV.pdf"
              aria-label={t('projects.downloadCV')}
              className={`icon-pill px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Download size={18} className="shrink-0" />
              <span className="icon-pill-label">{t('projects.downloadCV')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
