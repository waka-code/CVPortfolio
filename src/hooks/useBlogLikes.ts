import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, runTransaction } from 'firebase/database';

interface LikesData {
  [slug: string]: number;
}

interface LikedArticles {
  [slug: string]: boolean;
}

const LIKED_ARTICLES_KEY = 'blog_liked_articles';

export function useBlogLikes() {
  const [likes, setLikes] = useState<LikesData>({});
  const [likedArticles, setLikedArticles] = useState<LikedArticles>({});

  // Load user's liked state from localStorage (tracks which articles THIS user liked)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
      if (stored) {
        setLikedArticles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading liked articles from localStorage:', error);
    }
  }, []);

  // Listen to Firebase Realtime Database for shared like counts
  useEffect(() => {
    const likesRef = ref(database, 'likes');
    const unsubscribe = onValue(likesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLikes(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleLike = (slug: string) => {
    const isLiked = likedArticles[slug];
    const likeRef = ref(database, `likes/${slug}`);

    // Atomic update in Firebase to prevent race conditions
    runTransaction(likeRef, (currentValue: number | null) => {
      if (currentValue === null) {
        return isLiked ? 0 : 1;
      }
      return isLiked ? Math.max(0, currentValue - 1) : currentValue + 1;
    }).catch((error) => {
      console.error('Firebase like transaction failed:', error);
    });

    // Update local liked state (tracks if THIS user has liked)
    const newLiked = { ...likedArticles, [slug]: !isLiked };
    setLikedArticles(newLiked);

    try {
      localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(newLiked));
    } catch (error) {
      console.error('Error saving liked articles to localStorage:', error);
    }
  };

  const hasLiked = (slug: string): boolean => {
    return !!likedArticles[slug];
  };

  const getLikeCount = (slug: string): number => {
    return likes[slug] || 0;
  };

  return { likes, toggleLike, hasLiked, getLikeCount };
}
