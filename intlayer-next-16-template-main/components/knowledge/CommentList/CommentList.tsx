'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useAuth } from '@/contexts/auth-context';
import { CommentItem, type Comment } from '../CommentItem';
import './CommentList.css';

interface CommentListProps {
  knowledgeId: number;
  initialComments?: Comment[];
  onLoadComments?: (knowledgeId: number) => Promise<Comment[]>;
  onAddComment?: (knowledgeId: number, content: string, parentId?: number) => Promise<Comment>;
  onLikeComment?: (commentId: number) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
}

export const CommentList: React.FC<CommentListProps> = ({
  knowledgeId,
  initialComments = [],
  onLoadComments,
  onAddComment,
  onLikeComment,
  onDeleteComment,
}) => {
  const content = useIntlayer('comment-list');
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'hottest'>('latest');

  // 加载评论
  useEffect(() => {
    loadComments();
  }, [knowledgeId]);

  const loadComments = async () => {
    if (!onLoadComments) return;

    try {
      setLoading(true);
      const data = await onLoadComments(knowledgeId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交新评论
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    if (!onAddComment) {
      alert('Comment function not available');
      return;
    }

    try {
      setSubmitting(true);
      const comment = await onAddComment(knowledgeId, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert(content.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  // 回复评论
  const handleReply = async (parentId: number, replyContent: string) => {
    if (!user || !onAddComment) return;

    try {
      const reply = await onAddComment(knowledgeId, replyContent, parentId);
      
      // 更新评论列表，将回复添加到对应的父评论
      setComments(prevComments => {
        const updateComments = (commentList: Comment[]): Comment[] => {
          return commentList.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), reply],
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComments(comment.replies),
              };
            }
            return comment;
          });
        };
        return updateComments(prevComments);
      });
    } catch (error) {
      console.error('Failed to reply:', error);
      alert(content.replyError);
    }
  };

  // 点赞评论
  const handleLike = async (commentId: number) => {
    if (!onLikeComment) return;

    try {
      await onLikeComment(commentId);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  // 删除评论
  const handleDelete = async (commentId: number) => {
    if (!onDeleteComment) return;

    try {
      await onDeleteComment(commentId);
      
      // 从列表中移除评论
      setComments(prevComments => {
        const removeComment = (commentList: Comment[]): Comment[] => {
          return commentList
            .filter(comment => comment.id !== commentId)
            .map(comment => ({
              ...comment,
              replies: comment.replies ? removeComment(comment.replies) : undefined,
            }));
        };
        return removeComment(prevComments);
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert(content.deleteError);
    }
  };

  // 排序评论
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (b.likeCount || 0) - (a.likeCount || 0);
    }
  });

  return (
    <div className="comment-list-container">
      {/* 评论头部 */}
      <div className="comment-list-header motion-fade-in">
        <h3 className="comment-list-title">
          {content.title} ({comments.length})
        </h3>
        <div className="comment-sort">
          <button
            onClick={() => setSortBy('latest')}
            className={`sort-btn ${sortBy === 'latest' ? 'active' : ''}`}
          >
            {content.sortLatest}
          </button>
          <button
            onClick={() => setSortBy('hottest')}
            className={`sort-btn ${sortBy === 'hottest' ? 'active' : ''}`}
          >
            {content.sortHottest}
          </button>
        </div>
      </div>

      {/* 评论输入框 */}
      <div className="comment-input-section glass-card motion-slide-in-up motion-delay-100">
        {user ? (
          <>
            <div className="input-header">
              <div className="user-avatar">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="user-name">{user.username}</span>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={String(content.placeholder)}
              className="comment-textarea glass-input"
              rows={4}
              disabled={submitting}
            />
            <div className="input-actions">
              <span className="char-count">
                {newComment.length} / 500
              </span>
              <button
                onClick={handleSubmitComment}
                className="submit-btn motion-hover-lift"
                disabled={submitting || !newComment.trim() || newComment.length > 500}
              >
                {submitting ? content.submitting : content.submit}
              </button>
            </div>
          </>
        ) : (
          <div className="login-prompt">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p>{content.loginPrompt}</p>
          </div>
        )}
      </div>

      {/* 评论列表 */}
      <div className="comment-list-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{content.loading}</p>
          </div>
        ) : sortedComments.length === 0 ? (
          <div className="empty-state glass-card motion-fade-in">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h4>{content.emptyTitle}</h4>
            <p>{content.emptyDescription}</p>
          </div>
        ) : (
          <div className="comments-wrapper">
            {sortedComments.map((comment, index) => (
              <div
                key={comment.id}
                className="motion-slide-in-up"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <CommentItem
                  comment={comment}
                  onReply={handleReply}
                  onLike={handleLike}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
