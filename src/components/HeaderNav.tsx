import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, useEffect } from 'react';

const NAV_LINKS = [
  { key: 'home', href: '#home' },
  { key: 'services', href: '#services' },
  { key: 'projects', href: '#projects' },
  { key: 'experience', href: '#experience' },
  { key: 'skills', href: '#skills' },
  { key: 'education', href: '#education' },
  { key: 'blog', href: '#blog' },
] as const;

export function HeaderNav() {
  const { isDark, toggleDarkMode } = useTheme();
  const { i18n, t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
    }
  }, [i18n]);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 animate-fade-in-down ${
        isDark
          ? 'bg-slate-900/95 backdrop-blur-sm border-slate-800'
          : 'bg-white/95 backdrop-blur-sm border-slate-200'
      } border-b transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
          className="flex items-center gap-2"
        >
          <img
            src={`${import.meta.env.BASE_URL}wsl.jpeg`}
            alt="Waddimi Saint-Louis"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 hover:ring-blue-400 transition-all"
          />
          <span className={`font-bold text-xl text-gradient-animate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            WS
          </span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === href.replace('#', '')
                  ? isDark
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-blue-50 text-blue-600'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t(`nav.${key}`)}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
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

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className={`md:hidden border-t px-4 py-3 flex flex-col gap-1 ${
            isDark ? 'border-slate-800 bg-slate-900/98' : 'border-slate-200 bg-white/98'
          }`}
        >
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === href.replace('#', '')
                  ? isDark
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-blue-50 text-blue-600'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t(`nav.${key}`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
