import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjectImages } from '../hooks/useProjectImages';

interface ProjectImageGalleryProps {
  projectFolder: string;
  isHovering: boolean;
  onClose?: () => void;
}

export function ProjectImageGallery({ projectFolder, isHovering, onClose }: ProjectImageGalleryProps) {
  const { images } = useProjectImages(projectFolder);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isHovering) setCurrentIndex(0);
  }, [isHovering]);

  const step = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + delta + images.length) % images.length);
  };

  const closeGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  if (!isHovering || images.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/95 rounded-xl"
      onClick={closeGallery}
    >
      <button
        onClick={closeGallery}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
        aria-label="Close gallery"
      >
        <X size={20} />
      </button>

      <div className="relative w-full h-full p-4 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full flex-1 flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Project screenshot ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            loading="eager"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => step(e, -1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm z-20"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => step(e, 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm z-20"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            <div className="flex justify-center gap-2 mt-3 mb-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60 w-1.5'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="text-center text-white/70 text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
