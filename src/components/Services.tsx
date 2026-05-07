import { MessageCircle, Mail, Check, Zap, Star, Users } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const PLANS = [
  { key: 'starter',   Icon: Zap,   price: 35,   modality: 'hour'  as const, highlighted: false, dedicated: false },
  { key: 'pro',      Icon: Star,  price: 55,   modality: 'hour'  as const, highlighted: true,  dedicated: false },
  { key: 'dedicated', Icon: Users, price: 2500, modality: 'month' as const, highlighted: false, dedicated: true  },
] as const;

const DELAYS = ['delay-200', 'delay-400', 'delay-600'] as const;

export function Services() {
  const { elementRef, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const buildWhatsApp = (key: string, price: number, modality: 'hour' | 'month') => {
    const planName = t(`services.plans.${key}.name`);
    const priceLabel = `$${price.toLocaleString()}${modality === 'hour' ? t('services.perHour') : t('services.perMonth')}`;
    const msg = t('services.whatsappMessage', { planName, price: priceLabel });
    return `https://wa.me/18295041112?text=${encodeURIComponent(msg)}`;
  };

  const buildEmail = (key: string, price: number, modality: 'hour' | 'month') => {
    const planName = t(`services.plans.${key}.name`);
    const priceLabel = `$${price.toLocaleString()}${modality === 'hour' ? t('services.perHour') : t('services.perMonth')}`;
    const subject = t('services.emailSubject', { planName });
    const body = t('services.emailBody', { planName, price: priceLabel });
    return `mailto:shenryvladimil@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="services"
      ref={elementRef}
      className={`py-20 px-4 transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950'
          : 'bg-gradient-to-br from-blue-50 via-white to-slate-50'
      }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('services.title')}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('services.subtitle')}
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {PLANS.map(({ key, Icon, price, modality, highlighted, dedicated }, i) => {
            const benefits = t(`services.plans.${key}.benefits`, { returnObjects: true }) as string[];

            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 ${
                  isVisible ? `animate-fade-in-up ${DELAYS[i]}` : 'opacity-0'
                } ${
                  dedicated
                    ? isDark
                      ? 'bg-slate-900 border-blue-400 shadow-lg shadow-blue-400/20 hover:shadow-blue-400/30 hover:border-blue-300'
                      : 'bg-white border-blue-400 shadow-lg shadow-blue-400/20 hover:shadow-blue-400/30 hover:border-blue-300'
                    : highlighted
                      ? isDark
                        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10 md:-mt-4'
                        : 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/25 md:-mt-4'
                      : isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300'
                }`}
              >
                {/* Popular badge */}
                {highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wide ${
                      isDark ? 'bg-blue-500 text-white' : 'bg-white text-blue-600'
                    }`}>
                      {t('services.popular')}
                    </span>
                  </div>
                )}

                {/* Dedicated badge */}
                {dedicated && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wide ${
                      isDark ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      🔥 {t('services.dedicatedBadge')}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`mb-5 w-12 h-12 rounded-xl flex items-center justify-center ${
                  highlighted
                    ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-white/20 text-white'
                    : isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  <Icon size={24} />
                </div>

                {/* Plan name */}
                <h3 className={`text-xl font-bold mb-2 ${
                  highlighted
                    ? isDark ? 'text-blue-300' : 'text-white'
                    : isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {t(`services.plans.${key}.name`)}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-5 leading-relaxed ${
                  highlighted
                    ? isDark ? 'text-slate-300' : 'text-blue-100'
                    : isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {t(`services.plans.${key}.description`)}
                </p>

                {/* Price */}
                {dedicated ? (
                  <div className="mb-1">
                    <span className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {t('services.dedicatedPrice')}
                    </span>
                  </div>
                ) : (
                  <div className="mb-1">
                    <span className={`text-4xl font-extrabold ${
                      highlighted ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      ${price.toLocaleString()}
                    </span>
                    <span className={`text-sm ml-1 ${
                      highlighted
                        ? isDark ? 'text-blue-200' : 'text-blue-100'
                        : isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {modality === 'hour' ? t('services.perHour') : t('services.perMonth')}
                    </span>
                  </div>
                )}

                {/* Scope */}
                {dedicated ? (
                  <p className={`text-xs mb-7 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {t('services.dedicatedScope')}
                  </p>
                ) : (
                  <p className={`text-xs mb-7 ${
                    highlighted
                      ? isDark ? 'text-blue-300/70' : 'text-blue-200'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {t(`services.plans.${key}.scope`)}
                  </p>
                )}

                {/* Benefits */}
                <ul className="flex-1 flex flex-col gap-2.5 mb-8">
                  {benefits.map((benefit, j) => (
                    <li key={j} className={`flex items-start gap-2.5 text-sm ${
                      highlighted
                        ? isDark ? 'text-slate-300' : 'text-white'
                        : isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <Check size={15} className={`mt-0.5 shrink-0 ${
                        highlighted
                          ? isDark ? 'text-blue-400' : 'text-blue-200'
                          : isDark ? 'text-blue-500' : 'text-blue-500'
                      }`} />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col gap-2.5">
                  {dedicated ? (
                    <>
                      <a
                        href={buildEmail(key, price, modality)}
                        className={`btn-animate flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          isDark
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Mail size={16} />
                        {t('services.scheduleMeeting')}
                      </a>

                      <a
                        href={buildWhatsApp(key, price, modality)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn-animate flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        <MessageCircle size={16} />
                        {t('services.talkWhatsApp')}
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href={buildWhatsApp(key, price, modality)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn-animate flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          highlighted
                            ? isDark
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-white hover:bg-blue-50 text-blue-600'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        <MessageCircle size={16} />
                        {t('services.contactWhatsApp')}
                      </a>

                      <a
                        href={buildEmail(key, price, modality)}
                        className={`btn-animate flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          highlighted
                            ? isDark
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              : 'bg-blue-700 hover:bg-blue-800 text-white'
                            : isDark
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Mail size={16} />
                        {t('services.contactEmail')}
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className={`text-center text-xs mt-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          {t('services.footerNote')}
        </p>
        <p className={`text-center text-xs mt-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          {t('services.footerNoteExtra')}
        </p>
      </div>
    </section>
  );
}
