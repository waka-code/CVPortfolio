import { useState, useEffect } from 'react';

interface LikesData {
  [slug: string]: number;
}

interface LikedArticles {
  [slug: string]: boolean;
}

const LIKES_KEY = 'blog_likes';
const LIKED_ARTICLES_KEY = 'blog_liked_articles';

export function useBlogLikes() {
  const [likes, setLikes] = useState<LikesData>({});
  const [likedArticles, setLikedArticles] = useState<LikedArticles>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem(LIKES_KEY);
      const storedLiked = localStorage.getItem(LIKED_ARTICLES_KEY);

      if (storedLikes) {
        setLikes(JSON.parse(storedLikes));
      }
      if (storedLiked) {
        setLikedArticles(JSON.parse(storedLiked));
      }
    } catch (error) {
      console.error('Error loading likes from localStorage:', error);
    }
  }, []);

  const toggleLike = (slug: string) => {
    setLikes((prev) => {
      const currentLikes = prev[slug] || 0;
      const isLiked = likedArticles[slug];
      const newLikes = {
        ...prev,
        [slug]: isLiked ? currentLikes - 1 : currentLikes + 1,
      };

      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify(newLikes));
      } catch (error) {
        console.error('Error saving likes to localStorage:', error);
      }

      return newLikes;
    });

    setLikedArticles((prev) => {
      const newLiked = {
        ...prev,
        [slug]: !prev[slug],
      };

      try {
        localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(newLiked));
      } catch (error) {
        console.error('Error saving liked articles to localStorage:', error);
      }

      return newLiked;
    });
  };

  const hasLiked = (slug: string): boolean => {
    return !!likedArticles[slug];
  };

  const getLikeCount = (slug: string): number => {
    return likes[slug] || 0;
  };

  return { likes, toggleLike, hasLiked, getLikeCount };
}
