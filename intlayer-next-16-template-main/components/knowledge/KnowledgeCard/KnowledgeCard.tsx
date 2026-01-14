'use client';

import { useIntlayer, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import Link from 'next/link';
import type { KnowledgeItem } from '@/types';
import './KnowledgeCard.css';

interface KnowledgeCardProps {
  knowledge: KnowledgeItem;
  showActions?: boolean;
  onEdit?: (knowledge: KnowledgeItem) => void;
  onDelete?: (knowledge: KnowledgeItem) => void;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  knowledge,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const { actions } = useIntlayer('knowledge-card');
  const { locale } = useLocale();

  const getTypeColor = (type: string) => {
    const colors = {
      TEXT: 'type-text',
      IMAGE: 'type-image',
      VIDEO: 'type-video',
      PDF: 'type-pdf',
      LINK: 'type-link',
    };
    return colors[type as keyof typeof colors] || 'type-text';
  };

  return (
    <div className="knowledge-card glass-card">
      <Link href={getLocalizedUrl(`/knowledge/${knowledge.shareCode}`, locale)} className="card-link">
        {/* 卡片头部 */}
        <div className="card-header">
          <div className="author-info">
            <div className="author-avatar">
              {knowledge.uploaderAvatar ? (
                <img src={knowledge.uploaderAvatar} alt={knowledge.uploaderName || 'User'} />
              ) : (
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="author-details">
              <span className="author-name">
                {knowledge.uploaderName || `User ${knowledge.uploaderId}`}
              </span>
              <span className="publish-date">
                {new Date(knowledge.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h3 className="card-title">{knowledge.title}</h3>

        {/* 内容预览 */}
        <p className="card-content">
          {knowledge.content.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '').substring(0, 280)}...
        </p>

        {/* 标签 */}
        <div className="card-tags">
          <span className={`type-tag ${getTypeColor(knowledge.type || 'TEXT')}`}>
            {knowledge.type}
          </span>
          {knowledge.categoryName && (
            <span className="tag">{knowledge.categoryName}</span>
          )}
          {knowledge.tags &&
            knowledge.tags
              .split(',')
              .slice(0, 2)
              .map((tag) => (
                <span key={tag.trim()} className="tag">
                  {tag.trim()}
                </span>
              ))}
          {knowledge.tags && knowledge.tags.split(',').length > 2 && (
            <span className="tag">+{knowledge.tags.split(',').length - 2}</span>
          )}
        </div>

        {/* 统计信息 */}
        <div className="card-stats">
          <div className="stat">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{knowledge.stats?.viewCount || 0}</span>
          </div>
          <div className="stat">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{knowledge.stats?.likeCount || 0}</span>
          </div>
          <div className="stat">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{knowledge.stats?.favoriteCount || 0}</span>
          </div>
          <div className="stat">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{knowledge.stats?.commentCount || 0}</span>
          </div>
        </div>
      </Link>

      {/* 操作按钮 */}
      {showActions && (
        <div className="card-actions">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit?.(knowledge);
            }}
            className="action-btn glass-button"
          >
            {actions.edit}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete?.(knowledge);
            }}
            className="action-btn glass-button danger"
          >
            {actions.delete}
          </button>
        </div>
      )}
    </div>
  );
};
