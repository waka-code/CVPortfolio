import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectImageGalleryProps {
  projectFolder: string;
  isHovering: boolean;
}

export function ProjectImageGallery({ projectFolder, isHovering }: ProjectImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Try to load images with sequential naming (1.png, 2.png, etc.)
    const loadImages = async () => {
      setIsLoading(true);
      const imageExtensions = ['png', 'jpg', 'jpeg', 'webp'];
      const loadedImages: string[] = [];

      // Try to load up to 20 images (can be adjusted)
      for (let i = 1; i <= 20; i++) {
        let imageFound = false;

        for (const ext of imageExtensions) {
          const imagePath = `${projectFolder}${i}.${ext}`;

          try {
            // Create a promise that will resolve or reject when image loads/errors
            await new Promise<void>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => reject();
              // Set a timeout to avoid hanging
              const timeout = setTimeout(() => reject(), 2000);
              img.src = imagePath;
              img.onload = () => {
                clearTimeout(timeout);
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timeout);
                reject();
              };
            });

            loadedImages.push(imagePath);
            imageFound = true;
            break;
          } catch {
            // Image doesn't exist, continue
          }
        }

        // If no image found with this number, stop looking
        if (!imageFound) {
          break;
        }
      }

      if (isMounted) {
        setImages(loadedImages);
        setIsLoading(false);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [projectFolder]);

  useEffect(() => {
    if (isHovering && images.length > 0) {
      setShowGallery(true);
      setCurrentIndex(0);
    } else {
      setShowGallery(false);
    }
  }, [isHovering, images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const closeGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGallery(false);
  };

  if (!showGallery || images.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/95 rounded-xl animate-fade-in"
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
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="text-white text-sm">Cargando imágenes...</div>
          </div>
        ) : (
          <>
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
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextImage}
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
          </>
        )}
      </div>
    </div>
  );
}
