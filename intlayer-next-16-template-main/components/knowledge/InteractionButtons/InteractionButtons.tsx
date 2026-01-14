'use client';

import { useState } from 'react';
import { useIntlayer } from 'next-intlayer';
import './InteractionButtons.css';

interface InteractionButtonsProps {
  initialStats?: {
    likeCount: number;
    favoriteCount: number;
    commentCount: number;
    userLiked?: boolean;
    userFavorited?: boolean;
  };
  size?: 'small' | 'medium' | 'large';
  onCommentClick?: () => void;
}

export const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  initialStats = {
    likeCount: 0,
    favoriteCount: 0,
    commentCount: 0,
    userLiked: false,
    userFavorited: false,
  },
  size = 'medium',
  onCommentClick,
}) => {
  const content = useIntlayer('interaction-buttons');
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // TODO: 调用 API
      setStats((prev) => ({
        ...prev,
        userLiked: !prev.userLiked,
        likeCount: prev.userLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    } catch (error) {
      console.error('Like failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // TODO: 调用 API
      setStats((prev) => ({
        ...prev,
        userFavorited: !prev.userFavorited,
        favoriteCount: prev.userFavorited
          ? prev.favoriteCount - 1
          : prev.favoriteCount + 1,
      }));
    } catch (error) {
      console.error('Favorite failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: String(content.share.title.value || content.share.title),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={`interaction-buttons size-${size}`}>
      <button
        onClick={handleLike}
        className={`interaction-btn ${stats.userLiked ? 'active liked' : ''}`}
        disabled={loading}
        title={String(content.like.title.value || content.like.title)}
      >
        <svg fill={stats.userLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{stats.likeCount}</span>
      </button>

      <button
        onClick={handleFavorite}
        className={`interaction-btn ${stats.userFavorited ? 'active favorited' : ''}`}
        disabled={loading}
        title={String(content.favorite.title.value || content.favorite.title)}
      >
        <svg fill={stats.userFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <span>{stats.favoriteCount}</span>
      </button>

      <button
        onClick={onCommentClick}
        className="interaction-btn"
        title={String(content.comment.title.value || content.comment.title)}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{stats.commentCount}</span>
      </button>

      <button
        onClick={handleShare}
        className="interaction-btn"
        title={String(content.share.title.value || content.share.title)}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
    </div>
  );
};
