import { useEffect, useState } from 'react';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const MAX_IMAGES = 20;
const LOAD_TIMEOUT_MS = 2000;

function probeImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    const timeout = setTimeout(reject, LOAD_TIMEOUT_MS);
    img.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    img.onerror = () => {
      clearTimeout(timeout);
      reject();
    };
    img.src = src;
  });
}

/**
 * A static host has no directory listing, so screenshots are discovered by probing
 * sequential names (1.png, 2.jpg, ...) and stopping at the first missing number.
 */
export function useProjectImages(projectFolder?: string) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(projectFolder));

  useEffect(() => {
    if (!projectFolder) {
      setImages([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const loadImages = async () => {
      const found: string[] = [];

      for (let i = 1; i <= MAX_IMAGES; i++) {
        let path: string | null = null;

        for (const ext of IMAGE_EXTENSIONS) {
          const candidate = `${projectFolder}${i}.${ext}`;
          try {
            await probeImage(candidate);
            path = candidate;
            break;
          } catch {
            // Not this extension, try the next one
          }
        }

        if (!path) break;
        found.push(path);
      }

      if (isMounted) {
        setImages(found);
        setIsLoading(false);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [projectFolder]);

  return { images, isLoading };
}
