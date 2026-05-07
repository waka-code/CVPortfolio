import { GraduationCap, Languages, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

interface CertificateImage {
  name: string;
  image: string;
}

interface EducationProps {
  degree: string;
  institution: string;
  period: string;
  languages: { language: string; level: string }[];
  certifications: string[];
  certificateImages?: CertificateImage[];
  aiCertifications?: string[];
  aiCertificateImages?: CertificateImage[];
}

const CERTS_PER_PAGE = 5;

function CertBox({
  title,
  certifications,
  certificateImages,
  isDark,
  onSelect,
  t,
  animClass,
}: {
  title: string;
  certifications: string[];
  certificateImages?: CertificateImage[];
  isDark: boolean;
  onSelect: (cert: CertificateImage) => void;
  t: (key: string) => string;
  animClass: string;
}) {
  const [page, setPage] = useState(0);
  const total = certificateImages?.length ?? 0;
  const totalPages = Math.ceil(total / CERTS_PER_PAGE);
  const visible = certificateImages?.slice(page * CERTS_PER_PAGE, (page + 1) * CERTS_PER_PAGE) ?? [];

  return (
    <div
      className={`card-hover rounded-xl p-6 border ${animClass} ${
        isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>
      <ul className="space-y-2">
        {certifications.map((cert, index) => (
          <li key={index} className={`flex gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <span className="text-blue-600 font-bold">•</span>
            <span>{cert}</span>
          </li>
        ))}
      </ul>

      {total > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            {visible.map((cert) => (
              <button
                key={cert.name}
                onClick={() => onSelect(cert)}
                className={`group relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  isDark ? 'border-slate-600 hover:border-blue-500' : 'border-slate-200 hover:border-blue-400'
                }`}
                title={`${t('education.viewCertificate')} - ${cert.name}`}
              >
                <img
                  src={cert.image}
                  alt={`${cert.name} certificate`}
                  className="w-20 h-14 object-cover"
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? 'bg-black/60' : 'bg-black/40'
                  }`}
                >
                  <span className="text-white text-xs font-medium">{t('education.viewCertificate')}</span>
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className={`p-1 rounded-full transition-colors disabled:opacity-30 ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
              >
                <ChevronLeft size={16} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
              </button>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages - 1}
                className={`p-1 rounded-full transition-colors disabled:opacity-30 ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
              >
                <ChevronRight size={16} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Education({
  degree,
  institution,
  period,
  languages,
  certifications,
  certificateImages,
  aiCertifications,
  aiCertificateImages,
}: EducationProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [selectedCert, setSelectedCert] = useState<CertificateImage | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [selectedCert]);

  return (
    <section
      id="education"
      ref={elementRef}
      className={`py-20 px-4 transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Row 1: Degree + Languages */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className={`flex items-center gap-3 mb-6 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <GraduationCap className={`text-blue-600 ${isVisible ? 'animate-bounce-in' : ''}`} size={32} />
              <h2 className={`text-3xl font-bold title-underline ${isVisible ? 'visible' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('education.title')}
              </h2>
            </div>
            <div
              className={`card-hover rounded-xl p-6 border ${isVisible ? 'animate-slide-in-up' : 'opacity-0'} ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{degree}</h3>
              <p className="text-blue-600 font-semibold mb-1">{institution}</p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{period}</p>
            </div>
          </div>

          <div>
            <div className={`flex items-center gap-3 mb-6 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <Languages className={`text-blue-600 ${isVisible ? 'animate-rotate-in' : ''}`} size={32} />
              <h2 className={`text-3xl font-bold title-underline ${isVisible ? 'visible' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('education.languages')}
              </h2>
            </div>
            <div
              className={`card-hover rounded-xl p-6 border ${isVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'} ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
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
                        isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
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

        {/* Row 2: Certifications + AI Certifications */}
        <div className="grid md:grid-cols-2 gap-8">
          <CertBox
            title={t('education.certifications')}
            certifications={certifications}
            certificateImages={certificateImages}
            isDark={isDark}
            onSelect={setSelectedCert}
            t={t}
            animClass={isVisible ? 'animate-slide-in-up delay-200' : 'opacity-0'}
          />
          {aiCertifications && aiCertifications.length > 0 && (
            <CertBox
              title={t('education.aiCertifications')}
              certifications={aiCertifications}
              certificateImages={aiCertificateImages}
              isDark={isDark}
              onSelect={setSelectedCert}
              t={t}
              animClass={isVisible ? 'animate-slide-in-up delay-300' : 'opacity-0'}
            />
          )}
        </div>
      </div>

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setSelectedCert(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <img
              src={selectedCert.image}
              alt={`${selectedCert.name} certificate`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <p className="text-center text-white/80 mt-3 text-sm font-medium">{selectedCert.name}</p>
          </div>
        </div>
      )}
    </section>
  );
}
