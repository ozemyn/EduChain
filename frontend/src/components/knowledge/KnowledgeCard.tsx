import React from 'react';
import { Card, Avatar, Tag, Typography, Image, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types';
import { formatDate } from '@/utils/format';
import InteractionButtons from './InteractionButtons';
import '@/styles/globals.css';
import '@/styles/theme-variables.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Text, Paragraph } = Typography;

interface KnowledgeCardProps {
  knowledge: KnowledgeItem;
  showActions?: boolean;
  onEdit?: (knowledge: KnowledgeItem) => void;
  onDelete?: (knowledge: KnowledgeItem) => void;
  onCommentClick?: (knowledge: KnowledgeItem) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  knowledge,
  showActions = false,
  onEdit,
  onDelete,
  onCommentClick,
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      TEXT: 'blue',
      IMAGE: 'green',
      VIDEO: 'red',
      PDF: 'orange',
      LINK: 'purple',
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const renderMediaPreview = () => {
    if (
      knowledge.type === 'IMAGE' &&
      knowledge.mediaUrls &&
      knowledge.mediaUrls.length > 0
    ) {
      return (
        <div style={{ marginBottom: 12 }}>
          <Image
            width="100%"
            height={200}
            src={knowledge.mediaUrls[0]}
            style={{ objectFit: 'cover', borderRadius: 6 }}
            preview={{
              src: knowledge.mediaUrls[0],
            }}
          />
        </div>
      );
    }

    if (
      knowledge.type === 'VIDEO' &&
      knowledge.mediaUrls &&
      knowledge.mediaUrls.length > 0
    ) {
      return (
        <div style={{ marginBottom: 12 }}>
          <video
            width="100%"
            height={200}
            controls
            style={{ borderRadius: 6 }}
            poster={knowledge.mediaUrls[1]} // 假设第二个URL是封面图
          >
            <source src={knowledge.mediaUrls[0]} type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        </div>
      );
    }

    return null;
  };

  const actions = [];

  if (showActions) {
    actions.push(
      <Tooltip title="编辑">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit?.(knowledge)}
        />
      </Tooltip>,
      <Tooltip title="删除">
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete?.(knowledge)}
        />
      </Tooltip>
    );
  }

  return (
    <div className="knowledge-card-container">
      <Card
        className="knowledge-card glass-card hover-lift"
        cover={renderMediaPreview()}
        actions={actions.length > 0 ? actions : undefined}
      >
        <div className="card-content">
          {/* 头部信息 */}
          <div className="card-header">
            <div className="author-info">
              <Avatar
                src={knowledge.uploaderAvatar || knowledge.uploader?.avatarUrl}
                alt={
                  knowledge.uploaderName ||
                  knowledge.uploader?.fullName ||
                  '用户'
                }
                icon={<UserOutlined />}
                className="author-avatar"
              >
                {(
                  knowledge.uploaderName || knowledge.uploader?.fullName
                )?.charAt(0) || 'U'}
              </Avatar>
              <div className="author-details">
                <Text strong className="author-name">
                  {knowledge.uploaderName ||
                    knowledge.uploader?.fullName ||
                    `用户 ${knowledge.uploaderId}`}
                </Text>
                <Text type="secondary" className="publish-date">
                  {formatDate(knowledge.createdAt)}
                </Text>
              </div>
            </div>
          </div>

          {/* 标题 */}
          <div className="card-title">
            <Link to={`/knowledge/${knowledge.id}`} className="title-link">
              <h3 className="knowledge-title">{knowledge.title}</h3>
            </Link>
          </div>

          {/* 内容预览 */}
          <div className="card-description">
            <Paragraph
              ellipsis={{ rows: 3, tooltip: knowledge.content }}
              className="content-preview"
            >
              {knowledge.content.replace(/<[^>]*>/g, '')}
            </Paragraph>
          </div>

          {/* 标签区域 */}
          <div className="card-tags">
            <Tag
              color={getTypeColor(knowledge.type)}
              className="type-tag glass-badge"
            >
              {knowledge.type}
            </Tag>
            {(knowledge.categoryName || knowledge.category?.name) && (
              <Tag className="category-tag glass-badge">
                {knowledge.categoryName || knowledge.category?.name}
              </Tag>
            )}
            {knowledge.tags &&
              knowledge.tags
                .split(',')
                .slice(0, 2)
                .map(tag => (
                  <Tag
                    key={tag.trim()}
                    className="content-tag glass-badge hover-scale"
                  >
                    {tag.trim()}
                  </Tag>
                ))}
            {knowledge.tags && knowledge.tags.split(',').length > 2 && (
              <Tag className="more-tags glass-badge">
                +{knowledge.tags.split(',').length - 2}
              </Tag>
            )}
          </div>

          {/* 交互按钮 */}
          <div className="card-interactions" onClick={e => e.preventDefault()}>
            <InteractionButtons
              knowledgeId={knowledge.id}
              initialStats={
                knowledge.stats
                  ? {
                      knowledgeId: knowledge.id,
                      likeCount: knowledge.stats.likeCount ?? 0,
                      favoriteCount: knowledge.stats.favoriteCount ?? 0,
                      viewCount: knowledge.stats.viewCount ?? 0,
                      commentCount: knowledge.stats.commentCount ?? 0,
                      userLiked: false,
                      userFavorited: false,
                    }
                  : undefined
              }
              size="small"
              onCommentClick={() => onCommentClick?.(knowledge)}
            />
          </div>
        </div>
      </Card>

      <style>{`
        /* ===== 知识卡片样式 ===== */
        .knowledge-card-container {
          height: 100%;
        }

        .knowledge-card {
          height: 100%;
          border: none !important;
          background: var(--glass-bg-medium) !important;
          backdrop-filter: var(--blur-md) !important;
          -webkit-backdrop-filter: var(--blur-md) !important;
          border-radius: var(--liquid-border-radius) !important;
          box-shadow: var(--glass-shadow-md) !important;
          border: 1px solid var(--glass-border) !important;
          transition: all var(--transition-base) var(--ease-spring-ios) !important;
          overflow: hidden;
        }

        .knowledge-card:hover {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: var(--glass-shadow-lg) !important;
          background: var(--glass-bg-strong) !important;
        }

        .knowledge-card .ant-card-cover {
          border-radius: var(--liquid-border-radius) var(--liquid-border-radius) 0 0;
          overflow: hidden;
        }

        .knowledge-card .ant-card-cover img,
        .knowledge-card .ant-card-cover video {
          transition: transform var(--transition-base) var(--ease-ios);
        }

        .knowledge-card:hover .ant-card-cover img,
        .knowledge-card:hover .ant-card-cover video {
          transform: scale(1.05);
        }

        .knowledge-card .ant-card-body {
          padding: var(--spacing-lg) !important;
        }

        .knowledge-card .ant-card-actions {
          background: var(--glass-bg-light) !important;
          border-top: 1px solid var(--glass-border) !important;
          backdrop-filter: var(--blur-sm) !important;
          -webkit-backdrop-filter: var(--blur-sm) !important;
        }

        .knowledge-card .ant-card-actions > li {
          margin: 0 !important;
        }

        .knowledge-card .ant-card-actions > li > span {
          padding: var(--spacing-sm) !important;
          border-radius: var(--radius-sm) !important;
          transition: all var(--transition-fast) var(--ease-ios) !important;
        }

        .knowledge-card .ant-card-actions > li > span:hover {
          background: var(--hover-overlay) !important;
          transform: scale(1.1) !important;
        }

        /* 卡片内容 */
        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          height: 100%;
        }

        /* 头部信息 */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .author-avatar {
          border: 2px solid var(--glass-border);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .knowledge-card:hover .author-avatar {
          border-color: var(--accent-primary);
          transform: scale(1.05);
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-size: 0.875rem;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .publish-date {
          font-size: 0.75rem;
          line-height: 1.2;
        }

        /* 标题 */
        .card-title {
          margin: var(--spacing-sm) 0;
        }

        .title-link {
          text-decoration: none;
          color: inherit;
        }

        .knowledge-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color var(--transition-fast) var(--ease-ios);
        }

        .title-link:hover .knowledge-title {
          color: var(--accent-primary);
        }

        /* 内容预览 */
        .card-description {
          flex: 1;
        }

        .content-preview {
          color: var(--text-secondary) !important;
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
          margin: 0 !important;
        }

        /* 标签区域 */
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin: var(--spacing-sm) 0;
        }

        .type-tag {
          font-weight: 500;
          font-size: 0.75rem;
        }

        .category-tag,
        .content-tag,
        .more-tags {
          font-size: 0.75rem;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
          background: var(--glass-bg-light);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .content-tag:hover {
          background: var(--glass-bg-medium);
          color: var(--accent-primary);
          transform: scale(1.05);
        }

        .more-tags {
          color: var(--text-tertiary);
          font-style: italic;
        }

        /* 交互按钮 */
        .card-interactions {
          margin-top: auto;
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-light);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .knowledge-card .ant-card-body {
            padding: var(--spacing-md) !important;
          }

          .card-content {
            gap: var(--spacing-sm);
          }

          .knowledge-title {
            font-size: 1rem;
          }

          .content-preview {
            font-size: 0.8rem !important;
          }

          .author-name {
            font-size: 0.8rem;
          }

          .publish-date {
            font-size: 0.7rem;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .knowledge-card,
          .author-avatar,
          .knowledge-title,
          .content-tag {
            transition: none !important;
            transform: none !important;
          }

          .knowledge-card:hover {
            transform: none !important;
          }

          .knowledge-card:hover .ant-card-cover img,
          .knowledge-card:hover .ant-card-cover video {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeCard;
