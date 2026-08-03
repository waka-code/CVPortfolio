import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MessageSquareQuote,
  Quote,
  X,
  Send,
  CheckCircle,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  normalizeLang,
  testimonialText,
  useTestimonials,
  type Testimonial,
  type TestimonialInput,
} from '../hooks/useTestimonials';

interface FormState {
  name: string;
  role: string;
  photoUrl: string;
  description: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

function Avatar({ name, photoUrl, isDark }: { name: string; photoUrl: string; isDark: boolean }) {
  const [imgError, setImgError] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase();

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImgError(true)}
        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500 flex-shrink-0"
      />
    );
  }

  return (
    <div
      className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ring-2 ring-blue-500 ${
        isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
      }`}
    >
      {initial}
    </div>
  );
}

/** Fixed height keeps every card identical and every author line on the same baseline */
const CARD_HEIGHT = 'h-[22rem]';

function TestimonialCard({
  testimonial,
  isDark,
  animationClass,
  animationDelay,
}: {
  testimonial: Testimonial;
  isDark: boolean;
  animationClass: string;
  animationDelay: string;
}) {
  const { i18n } = useTranslation();

  return (
    <div
      className={`rounded-xl p-6 border transition-colors duration-300 card-hover flex flex-col ${CARD_HEIGHT} ${
        isDark
          ? 'bg-slate-900 border-slate-700 hover:border-blue-500'
          : 'bg-white border-slate-200 hover:border-blue-400'
      } ${animationClass}`}
      style={{ animationDelay }}
    >
      <Quote size={24} className="text-blue-500 mb-3 opacity-60 shrink-0" />

      {/* Long testimonials scroll inside the card instead of stretching it */}
      <p
        className={`text-sm leading-relaxed flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        "{testimonialText(testimonial, i18n.language)}"
      </p>

      <div
        className={`flex items-center gap-3 mt-4 pt-4 border-t shrink-0 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <Avatar name={testimonial.name} photoUrl={testimonial.photoUrl} isDark={isDark} />
        <div className="min-w-0">
          <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {testimonial.name}
          </p>
          <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const { elementRef, isVisible } = useScrollAnimation();
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const { approvedTestimonials, submitTestimonial } = useTestimonials();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', role: '', photoUrl: '', description: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // A plain grid fits up to three; beyond that the cards scroll as a carousel
  const isCarousel = approvedTestimonials.length > 3;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** Width of one card plus the gap, so arrows advance exactly one card. */
  const cardStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return track.clientWidth;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return first.offsetWidth + gap;
  }, []);

  const handleTrackScroll = useCallback(() => {
    const track = trackRef.current;
    const step = cardStep();
    if (!track || step === 0) return;

    setActiveIndex(Math.round(track.scrollLeft / step));
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  }, [cardStep]);

  const scrollByCard = (direction: number) => {
    trackRef.current?.scrollBy({ left: direction * cardStep(), behavior: 'smooth' });
  };

  const scrollToCard = (index: number) => {
    trackRef.current?.scrollTo({ left: index * cardStep(), behavior: 'smooth' });
  };

  // Arrow availability depends on measured widths, so seed it once the track exists
  useEffect(() => {
    if (isCarousel) handleTrackScroll();
  }, [isCarousel, approvedTestimonials.length, handleTrackScroll]);

  useEffect(() => {
    if (!showModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showModal]);

  function closeModal() {
    setShowModal(false);
    setStatus('idle');
    setForm({ name: '', role: '', photoUrl: '', description: '' });
    setErrors({});
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = t('testimonials.form.name');
    if (!form.role.trim()) newErrors.role = t('testimonials.form.role');
    if (!form.description.trim()) newErrors.description = t('testimonials.form.description');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const input: TestimonialInput = {
        name: form.name.trim(),
        role: form.role.trim(),
        photoUrl: form.photoUrl.trim(),
        description: form.description.trim(),
        lang: normalizeLang(i18n.language),
      };
      await submitTestimonial(input);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const inputClass = (field: keyof FormState) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
      isDark
        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
    } ${errors[field] ? 'border-red-500' : ''}`;

  return (
    <section
      id="testimonials"
      ref={elementRef}
      className={`py-20 px-4 transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`flex items-center gap-3 mb-4 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <MessageSquareQuote size={32} className="text-blue-500 flex-shrink-0" />
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('testimonials.title')}
          </h2>
        </div>

        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 ${isVisible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('testimonials.subtitle')}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-animate flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
          >
            <Star size={16} />
            {t('testimonials.shareBtn')}
          </button>
        </div>

        {/* Testimonials grid */}
        {approvedTestimonials.length === 0 ? (
          <div className={`text-center py-16 ${isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            <Quote size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('testimonials.empty')}
            </p>
          </div>
        ) : isCarousel ? (
          <div className={isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}>
            <div
              ref={trackRef}
              onScroll={handleTrackScroll}
              className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
            >
              {approvedTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="shrink-0 snap-start basis-full sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    isDark={isDark}
                    animationClass=""
                    animationDelay="0ms"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                aria-label={t('testimonials.previous')}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-blue-400 hover:border-blue-500'
                    : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300'
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {approvedTestimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    onClick={() => scrollToCard(index)}
                    aria-label={`${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-6 bg-blue-600'
                        : isDark
                          ? 'w-2 bg-slate-600 hover:bg-slate-500'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                aria-label={t('testimonials.next')}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-blue-400 hover:border-blue-500'
                    : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isDark={isDark}
                animationClass={isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                animationDelay={`${index * 150}ms`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Submission modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up"
          onClick={closeModal}
        >
          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('testimonials.form.title')}
              </h3>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Success state */}
            {status === 'success' ? (
              <div className="p-8 text-center">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('testimonials.form.successTitle')}
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('testimonials.form.successMsg')}
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  OK
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('testimonials.form.name')} *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputClass('name')}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name} is required</p>}
                </div>

                {/* Role */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('testimonials.form.role')} *
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className={inputClass('role')}
                    placeholder="CTO at Acme Corp"
                  />
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role} is required</p>}
                </div>

                {/* Photo URL */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('testimonials.form.photoUrl')}
                  </label>
                  <input
                    type="url"
                    value={form.photoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
                    className={inputClass('photoUrl')}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('testimonials.form.description')} *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={`${inputClass('description')} resize-none`}
                    rows={4}
                    placeholder="Working with Waddimi was an exceptional experience..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description} is required</p>}
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <span>{t('testimonials.form.errorMsg')}</span>
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-animate flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Send size={16} />
                    {status === 'submitting' ? t('testimonials.form.submitting') : t('testimonials.form.submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
