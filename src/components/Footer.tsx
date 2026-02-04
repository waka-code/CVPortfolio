import { Mail, Phone, Github, Linkedin } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
}

export function Footer({ email, phone, github, linkedin }: FooterProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <footer
      ref={elementRef}
      className={`py-12 px-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-slate-900'
      } text-white`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-8 ${
            isVisible ? 'animate-fade-in-down' : 'opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold mb-4 text-gradient-animate">{t('footer.letsConnect')}</h2>
          <p className="text-slate-400 mb-6">{t('footer.connectMessage')}</p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-6 mb-8 ${
            isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'
          }`}
        >
          <a
            href={`mailto:${email}`}
            className="btn-animate flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Mail size={20} />
            <span>{email}</span>
          </a>
          <a
            href={`tel:${phone}`}
            className="btn-animate flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Phone size={20} />
            <span>{phone}</span>
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-animate flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-animate flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className={`border-t pt-8 text-center text-slate-400 ${isDark ? 'border-slate-800' : 'border-slate-700'}`}>
          <p>
            {t('footer.copyright', {
              year: new Date().getFullYear(),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
