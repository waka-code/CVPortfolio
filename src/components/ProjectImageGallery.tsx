import { useReducer, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectImageGalleryProps {
  projectFolder: string;
  isHovering: boolean;
}

interface GalleryState {
  images: string[];
  currentIndex: number;
  showGallery: boolean;
  isLoading: boolean;
}

type GalleryAction =
  | { type: 'SET_IMAGES'; images: string[] }
  | { type: 'SET_CURRENT_INDEX'; index: number }
  | { type: 'NEXT_IMAGE'; totalImages: number }
  | { type: 'PREV_IMAGE'; totalImages: number }
  | { type: 'SET_SHOW_GALLERY'; value: boolean }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'RESET_GALLERY' };

const initialState: GalleryState = {
  images: [],
  currentIndex: 0,
  showGallery: false,
  isLoading: true,
};

function galleryReducer(state: GalleryState, action: GalleryAction): GalleryState {
  switch (action.type) {
    case 'SET_IMAGES':
      return { ...state, images: action.images };
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.index };
    case 'NEXT_IMAGE':
      return { ...state, currentIndex: (state.currentIndex + 1) % action.totalImages };
    case 'PREV_IMAGE':
      return { ...state, currentIndex: (state.currentIndex - 1 + action.totalImages) % action.totalImages };
    case 'SET_SHOW_GALLERY':
      return { ...state, showGallery: action.value };
    case 'SET_LOADING':
      return { ...state, isLoading: action.value };
    case 'RESET_GALLERY':
      return { ...state, showGallery: true, currentIndex: 0 };
    default:
      return state;
  }
}

export function ProjectImageGallery({ projectFolder, isHovering }: ProjectImageGalleryProps) {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    // Try to load images with sequential naming (1.png, 2.png, etc.)
    const loadImages = async () => {
      dispatch({ type: 'SET_LOADING', value: true });
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
        dispatch({ type: 'SET_IMAGES', images: loadedImages });
        dispatch({ type: 'SET_LOADING', value: false });
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [projectFolder]);

  useEffect(() => {
    if (isHovering && state.images.length > 0) {
      dispatch({ type: 'RESET_GALLERY' });
    } else {
      dispatch({ type: 'SET_SHOW_GALLERY', value: false });
    }
  }, [isHovering, state.images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'NEXT_IMAGE', totalImages: state.images.length });
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'PREV_IMAGE', totalImages: state.images.length });
  };

  const closeGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'SET_SHOW_GALLERY', value: false });
  };

  if (!state.showGallery || state.images.length === 0) {
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
        {state.isLoading ? (
          <div className="flex items-center justify-center">
            <div className="text-white text-sm">Cargando imágenes...</div>
          </div>
        ) : (
          <>
            <div className="relative w-full flex-1 flex items-center justify-center">
              <img
                src={state.images[state.currentIndex]}
                alt={`Project screenshot ${state.currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                loading="eager"
              />
            </div>

            {state.images.length > 1 && (
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
                  {state.images.map((_: string, index: number) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'SET_CURRENT_INDEX', index });
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        index === state.currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60 w-1.5'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="text-center text-white/70 text-xs">
              {state.currentIndex + 1} / {state.images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
