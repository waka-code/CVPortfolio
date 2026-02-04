import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function HeaderNav() {
  const { isDark, toggleDarkMode } = useTheme();
  const { i18n, t } = useTranslation();

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
    }
  }, [i18n]);

  return (
    <header
      className={`sticky top-0 z-50 animate-fade-in-down ${
        isDark ? 'bg-slate-900/95 backdrop-blur-sm border-slate-800' : 'bg-white/95 backdrop-blur-sm border-slate-200'
      } border-b transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#" className={`font-bold text-xl text-gradient-animate ${isDark ? 'text-white' : 'text-slate-900'}`}>
          WS
        </a>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className={`btn-animate p-2 rounded-lg transition-colors flex items-center gap-2 ${
              isDark
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
            title={i18n.language === 'es' ? t('nav.switchToEnglish') : t('nav.switchToSpanish')}
          >
            <Globe size={20} />
            <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className={`btn-animate p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
            title={isDark ? t('nav.lightMode') : t('nav.darkMode')}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
