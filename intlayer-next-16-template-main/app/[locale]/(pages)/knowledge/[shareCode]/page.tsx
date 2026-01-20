'use client';

import { useState, useEffect } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { useParams, useRouter } from 'next/navigation';
import { getLocalizedUrl } from 'intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import { InteractionButtons, CommentList, type Comment } from '../../../../../components/knowledge';
import { BlockchainCertInfo } from '../../../../../components/blockchain';
import { MarkdownRenderer } from '../../../../../components/MarkdownRenderer';
import { useAuth } from '@/contexts/auth-context';
import { knowledgeService, commentService, interactionService } from '@/services';
import type { KnowledgeItem } from '@/types';
import './page.css';

// 静态路径生成（用于静态导出）
export async function generateStaticParams() {
  // 动态导入以避免在客户端执行
  const { knowledgeStaticPaths, generateLocalizedPaths } = await import('@/../static-paths.config');
  return generateLocalizedPaths(knowledgeStaticPaths);
}

export default function KnowledgeDetailPage() {
  const content = useIntlayer('knowledge-detail-page');
  const { locale } = useLocale();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const shareCode = params.shareCode as string;
  const [loading, setLoading] = useState(true);
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (shareCode) {
      loadKnowledge();
    }
  }, [shareCode]);

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      const response = await knowledgeService.getKnowledgeByShareCode(shareCode);
      if (response.success && response.data) {
        setKnowledge(response.data);
      }
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = () => {
    if (knowledge) {
      router.push(getLocalizedUrl(`/knowledge/edit/${knowledge.shareCode}`, locale));
    }
  };

  // 处理删除
  const handleDelete = async () => {
    if (!knowledge) return;
    
    try {
      setDeleting(true);
      const response = await knowledgeService.deleteKnowledge(knowledge.id);
      if (response.success) {
        router.push(getLocalizedUrl('/knowledge', locale));
      }
    } catch (error) {
      console.error('Failed to delete knowledge:', error);
      alert(content.deleteError || 'Failed to delete');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // 处理分享
  const handleShare = () => {
    if (!knowledge) return;
    
    const shareUrl = `${window.location.origin}${getLocalizedUrl(`/knowledge/${knowledge.shareCode}`, locale)}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert(content.shareCopied || 'Link copied to clipboard!');
    } else {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert(content.shareCopied || 'Link copied to clipboard!');
    }
  };

  // 检查是否是作者
  const isAuthor = user && knowledge && user.id === knowledge.uploaderId;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="knowledge-detail-page">
          <div className="detail-container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{content.loading}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!knowledge) {
    return (
      <>
        <Navbar />
        <div className="knowledge-detail-page">
          <div className="detail-container">
            <div className="empty-state glass-card">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>{content.notFound}</h3>
              <p>{content.notFoundDescription}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getTypeColor = (type: string) => {
    const colors = {
      TEXT: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)' },
      IMAGE: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)' },
      VIDEO: { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)' },
      PDF: { bg: 'rgba(251, 146, 60, 0.1)', color: 'rgb(251, 146, 60)' },
      LINK: { bg: 'rgba(168, 85, 247, 0.1)', color: 'rgb(168, 85, 247)' },
    };
    return colors[type as keyof typeof colors] || colors.TEXT;
  };

  const typeStyle = getTypeColor(knowledge.type || 'TEXT');

  return (
    <>
      <Navbar />

      <div className="knowledge-detail-page">
        <div className="detail-container container">
          <div className="knowledge-content-card glass-card motion-slide-in-up">
            {/* 头部信息 */}
            <div className="knowledge-header motion-fade-in motion-delay-100">
              <h1 className="knowledge-title">{knowledge.title}</h1>

              <div className="knowledge-meta">
                <div className="author-section">
                  <div className="author-avatar">
                    {knowledge.uploaderAvatar ? (
                      <img src={knowledge.uploaderAvatar} alt={knowledge.uploaderName || 'User'} />
                    ) : (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="author-info">
                    <div className="author-name">
                      {knowledge.uploaderName || `User ${knowledge.uploaderId}`}
                    </div>
                    <div className="publish-time">
                      {new Date(knowledge.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="knowledge-tags">
                  <span
                    className="type-badge"
                    style={{ background: typeStyle.bg, color: typeStyle.color }}
                  >
                    {knowledge.type}
                  </span>
                  {knowledge.categoryName && (
                    <span className="tag">{knowledge.categoryName}</span>
                  )}
                  {knowledge.tags &&
                    knowledge.tags.split(',').map((tag) => (
                      <span key={tag.trim()} className="tag">
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* 内容 */}
            <MarkdownRenderer content={knowledge.content} className="knowledge-content motion-fade-in motion-delay-150" />

            {/* 区块链存证信息 */}
            <div className="blockchain-cert-section motion-fade-in motion-delay-200">
              <BlockchainCertInfo
                knowledgeId={knowledge.id}
                knowledgeTitle={knowledge.title}
                userId={knowledge.uploaderId}
                userName={knowledge.uploaderName || `User ${knowledge.uploaderId}`}
              />
            </div>

            {/* 交互区域 */}
            <div className="knowledge-interactions motion-fade-in motion-delay-250">
              <div className="stats-section">
                <div className="stat-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{knowledge.stats?.viewCount || 0} {content.views}</span>
                </div>
              </div>

              <div className="interaction-buttons-wrapper">
                <InteractionButtons
                  initialStats={{
                    likeCount: knowledge.stats?.likeCount || 0,
                    favoriteCount: knowledge.stats?.favoriteCount || 0,
                    commentCount: knowledge.stats?.commentCount || 0,
                  }}
                  size="large"
                />

                {/* 分享按钮 */}
                <button onClick={handleShare} className="action-btn share-btn glass-button motion-hover-lift">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{content.share || 'Share'}</span>
                </button>

                {/* 作者操作按钮 */}
                {isAuthor && (
                  <>
                    <button onClick={handleEdit} className="action-btn edit-btn glass-button motion-hover-lift">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>{content.edit || 'Edit'}</span>
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)} className="action-btn delete-btn glass-button motion-hover-lift">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>{content.delete || 'Delete'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 评论区域 */}
          <div className="knowledge-comments-section motion-fade-in motion-delay-300">
            <CommentList
              knowledgeId={knowledge.id}
              onLoadComments={async (knowledgeId) => {
                try {
                  const response = await commentService.getComments(knowledgeId);
                  if (response.success && response.data) {
                    // 转换 API 数据格式为组件需要的格式
                    const comments = response.data.content || [];
                    return comments.map(comment => ({
                      id: comment.id,
                      content: comment.content,
                      userId: comment.userId,
                      userName: comment.user?.username || `User ${comment.userId}`,
                      userAvatar: comment.user?.avatarUrl,
                      createdAt: comment.createdAt,
                      likeCount: 0, // API 暂时没有这个字段
                      isLiked: false,
                      parentId: comment.parentId,
                    }));
                  }
                  return [];
                } catch (error) {
                  console.error('Failed to load comments:', error);
                  return [];
                }
              }}
              onAddComment={async (knowledgeId, content, parentId) => {
                try {
                  const response = await commentService.createComment({
                    knowledgeId,
                    content,
                    parentId,
                  });
                  
                  if (response.success && response.data) {
                    const comment = response.data;
                    return {
                      id: comment.id,
                      content: comment.content,
                      userId: comment.userId,
                      userName: comment.user?.username || user?.username || 'Anonymous',
                      userAvatar: comment.user?.avatarUrl || user?.avatarUrl,
                      createdAt: comment.createdAt,
                      likeCount: 0,
                      isLiked: false,
                      parentId: comment.parentId,
                    };
                  }
                  
                  throw new Error('Failed to create comment');
                } catch (error) {
                  console.error('Failed to add comment:', error);
                  throw error;
                }
              }}
              onLikeComment={async (commentId) => {
                try {
                  // 评论点赞功能暂时使用互动服务的点赞接口
                  // 后续可以添加专门的评论点赞接口
                  await interactionService.like(commentId);
                } catch (error) {
                  console.error('Failed to like comment:', error);
                }
              }}
              onDeleteComment={async (commentId) => {
                try {
                  await commentService.deleteComment(commentId);
                } catch (error) {
                  console.error('Failed to delete comment:', error);
                  throw error;
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <>
          <div className="modal-backdrop motion-fade-in" onClick={() => setShowDeleteConfirm(false)} />
          <div className="confirm-dialog glass-card motion-scale-in">
            <div className="dialog-icon delete-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="dialog-title">{content.deleteConfirmTitle || 'Delete Knowledge?'}</h3>
            <p className="dialog-message">{content.deleteConfirmMessage || 'This action cannot be undone.'}</p>
            <div className="dialog-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="dialog-btn cancel-btn glass-button motion-hover-scale"
                disabled={deleting}
              >
                {content.cancel || 'Cancel'}
              </button>
              <button 
                onClick={handleDelete} 
                className="dialog-btn confirm-btn delete-confirm-btn motion-hover-lift"
                disabled={deleting}
              >
                {deleting ? (content.deleting || 'Deleting...') : (content.confirmDelete || 'Delete')}
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  );
}
