'use client';

import { useState } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useAuth } from '@/contexts/auth-context';
import './CommentItem.css';

export interface Comment {
  id: number;
  content: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  likeCount: number;
  isLiked?: boolean;
  replies?: Comment[];
  parentId?: number;
}

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: number, content: string) => void;
  onLike?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  level?: number;
  maxLevel?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onLike,
  onDelete,
  level = 0,
  maxLevel = 2,
}) => {
  const content = useIntlayer('comment-item');
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  const isAuthor = user && user.id === comment.userId;
  const canReply = level < maxLevel;

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return content.justNow;
    if (minutes < 60) return content.minutesAgo.replace('{n}', String(minutes));
    if (hours < 24) return content.hoursAgo.replace('{n}', String(hours));
    if (days < 7) return content.daysAgo.replace('{n}', String(days));
    return date.toLocaleDateString();
  };

  // 处理点赞
  const handleLike = async () => {
    if (!user) {
      alert(content.loginRequired);
      return;
    }

    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    
    onLike?.(comment.id);
  };

  // 处理回复提交
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await onReply?.(comment.id, replyContent);
      setReplyContent('');
      setShowReplyInput(false);
    } catch (error) {
      console.error('Failed to reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 处理删除
  const handleDelete = () => {
    if (window.confirm(String(content.deleteConfirm))) {
      onDelete?.(comment.id);
    }
  };

  return (
    <div className={`comment-item level-${level} motion-fade-in`}>
      <div className="comment-main">
        {/* 用户头像 */}
        <div className="comment-avatar">
          {comment.userAvatar ? (
            <img src={comment.userAvatar} alt={comment.userName} />
          ) : (
            <div className="avatar-placeholder">
              {comment.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* 评论内容 */}
        <div className="comment-body">
          <div className="comment-header">
            <span className="comment-author">{comment.userName}</span>
            <span className="comment-time">{formatTime(comment.createdAt)}</span>
          </div>

          <div className="comment-content">{comment.content}</div>

          <div className="comment-actions">
            <button
              onClick={handleLike}
              className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
              disabled={!user}
            >
              <svg fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likeCount > 0 ? likeCount : content.like}</span>
            </button>

            {canReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="action-btn reply-btn"
                disabled={!user}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>{content.reply}</span>
              </button>
            )}

            {isAuthor && (
              <button onClick={handleDelete} className="action-btn delete-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{content.delete}</span>
              </button>
            )}
          </div>

          {/* 回复输入框 */}
          {showReplyInput && (
            <div className="reply-input-wrapper motion-slide-in-up">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={String(content.replyPlaceholder)}
                className="reply-input glass-input"
                rows={3}
                disabled={submitting}
              />
              <div className="reply-actions">
                <button
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyContent('');
                  }}
                  className="reply-btn-cancel glass-button"
                  disabled={submitting}
                >
                  {content.cancel}
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="reply-btn-submit motion-hover-lift"
                  disabled={submitting || !replyContent.trim()}
                >
                  {submitting ? content.submitting : content.submit}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 子评论 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              level={level + 1}
              maxLevel={maxLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
