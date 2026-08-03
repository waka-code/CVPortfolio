import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useProjectImages } from '../hooks/useProjectImages';

interface ScreenshotSliderProps {
  folder: string;
  /** Used to build the alt text of each screenshot */
  title: string;
  /**
   * 1-based image numbers to leave out. Filtered here rather than by deleting the
   * file, because discovery stops at the first missing number and a gap would
   * truncate everything after it.
   */
  exclude?: number[];
  /**
   * Lets the host screen know the lightbox is up, so its own Escape handler can
   * stand down instead of navigating away underneath it.
   */
  onLightboxOpenChange?: (open: boolean) => void;
}

export function ScreenshotSlider({
  folder,
  title,
  exclude,
  onLightboxOpenChange,
}: ScreenshotSliderProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { images: discovered, isLoading } = useProjectImages(folder);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);

  const images = useMemo(
    () => (exclude?.length ? discovered.filter((_, index) => !exclude.includes(index + 1)) : discovered),
    [discovered, exclude]
  );

  // A different project or job reuses this component, so start over
  useEffect(() => {
    setSlideIndex(0);
    setLightboxOpen(false);
  }, [folder]);

  // Discovery finishes after the first render, so the index can outlive a shorter list
  useEffect(() => {
    setSlideIndex((prev) => (prev >= images.length ? 0 : prev));
  }, [images.length]);

  useEffect(() => {
    onLightboxOpenChange?.(isLightboxOpen);
  }, [isLightboxOpen, onLightboxOpenChange]);

  const step = useCallback(
    (delta: number) => {
      if (images.length === 0) return;
      setSlideIndex((prev) => (prev + delta + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, step]);

  if (isLoading) {
    return (
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {t('projects.loadingImages')}
      </p>
    );
  }

  if (images.length === 0) return null;

  return (
    <div>
      <div
        className={`relative rounded-xl border overflow-hidden ${
          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}
      >
        {/* Fixed height so the frame never resizes between a wide screenshot and a portrait photo */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="flex items-center justify-center w-full h-[24rem] sm:h-[30rem] cursor-zoom-in"
          aria-label={t('projects.expandImage')}
        >
          <img
            src={images[slideIndex]}
            alt={`${title} — ${slideIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={() => step(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
              aria-label={t('projects.previousImage')}
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={() => step(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
              aria-label={t('projects.nextImage')}
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm">
              {slideIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-2">
          {images.map((src, index) => (
            <button
              key={src}
              onClick={() => setSlideIndex(index)}
              aria-label={`${t('projects.screenshots')} ${index + 1}`}
              aria-current={index === slideIndex ? 'true' : undefined}
              className={`shrink-0 w-28 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === slideIndex
                  ? 'border-blue-500 opacity-100'
                  : isDark
                    ? 'border-slate-700 opacity-60 hover:opacity-100'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && images[slideIndex] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label={t('projects.closeImage')}
          >
            <X size={24} />
          </button>

          <img
            src={images[slideIndex]}
            alt={`${title} — ${slideIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={t('projects.previousImage')}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={t('projects.nextImage')}
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {slideIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
