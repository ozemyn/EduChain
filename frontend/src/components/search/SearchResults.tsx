import React from 'react';
import { List, Card, Tag, Space, Typography, Empty, Skeleton } from 'antd';
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types/api';
import { formatDate } from '@/utils/format';

const { Paragraph } = Typography;

interface SearchResultsProps {
  results: KnowledgeItem[];
  loading?: boolean;
  keyword?: string;
  total?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  keyword,
  total = 0,
  onLoadMore,
  hasMore = false,
}) => {
  // 高亮关键词
  const highlightKeyword = (text: string, keyword?: string) => {
    if (!keyword || !text) return text;

    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="cnki-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // 获取内容类型标签颜色
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

  // 渲染内容预览
  const renderContentPreview = (item: KnowledgeItem) => {
    const maxLength = 200;
    const content =
      item.content.length > maxLength
        ? `${item.content.substring(0, maxLength)}...`
        : item.content;

    return (
      <Paragraph className="cnki-content">
        {highlightKeyword(content, keyword)}
      </Paragraph>
    );
  };

  if (loading && results.length === 0) {
    return (
      <div className="cnki-search-results">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="cnki-loading-card">
            <Skeleton active />
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="cnki-search-results">
        <Empty
          description={
            <div>
              <p>没有找到相关内容</p>
              {keyword && (
                <p>
                  尝试使用不同的关键词，或者
                  <Link to="/search/advanced">使用高级搜索</Link>
                </p>
              )}
              {total > 0 && <p>共有 {total} 条结果，但当前页面没有显示内容</p>}
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="cnki-search-results">
      <List
        dataSource={results}
        renderItem={(item, index) => (
          <div className="cnki-result-item" key={item.id}>
            <div className="cnki-result-number">{index + 1}</div>
            <div className="cnki-result-content">
              {/* 标题行 */}
              <div className="cnki-result-header">
                <Link
                  to={`/knowledge/${item.id}`}
                  className="cnki-result-title"
                >
                  {highlightKeyword(item.title, keyword)}
                </Link>
                <div className="cnki-result-badges">
                  <Tag color={getTypeColor(item.type || 'TEXT')}>
                    {item.type}
                  </Tag>
                </div>
              </div>

              {/* 摘要内容 */}
              <div className="cnki-result-abstract">
                {renderContentPreview(item)}
              </div>

              {/* 作者和发表信息 */}
              <div className="cnki-result-meta">
                <div className="cnki-meta-left">
                  <span className="cnki-author">
                    <UserOutlined />
                    <Link to={`/user/${item.uploaderId}`}>
                      {item.uploaderName || `用户 ${item.uploaderId}`}
                    </Link>
                  </span>
                  {item.category && (
                    <span className="cnki-category">
                      <Link to={`/category/${item.category.id}`}>
                        {item.category.name}
                      </Link>
                    </span>
                  )}
                  <span className="cnki-date">
                    {formatDate(item.createdAt, 'YYYY-MM-DD')}
                  </span>
                </div>
                <div className="cnki-meta-right">
                  <Space size="large" className="cnki-stats">
                    <span>
                      <EyeOutlined /> {item.stats?.viewCount || 0}
                    </span>
                    <span>
                      <LikeOutlined /> {item.stats?.likeCount || 0}
                    </span>
                    <span>
                      <MessageOutlined /> {item.stats?.commentCount || 0}
                    </span>
                  </Space>
                </div>
              </div>

              {/* 标签 */}
              {item.tags && (
                <div className="cnki-result-tags">
                  {item.tags
                    .split(',')
                    .slice(0, 5)
                    .map(tag => (
                      <Tag key={tag.trim()} className="cnki-tag">
                        {highlightKeyword(tag.trim(), keyword)}
                      </Tag>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
        loading={loading}
        loadMore={
          hasMore ? (
            <div className="cnki-load-more">
              <button
                className="cnki-load-more-btn"
                onClick={onLoadMore}
                disabled={loading}
              >
                {loading ? '加载中...' : '加载更多结果'}
              </button>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default SearchResults;

// 知网风格搜索结果样式
const cnkiResultsStyles = `
.cnki-search-results {
  background: var(--bg-elevated);
}

.cnki-result-item {
  display: flex;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast) ease;
}

.cnki-result-item:hover {
  background-color: var(--bg-tertiary);
}

.cnki-result-item:last-child {
  border-bottom: none;
}

.cnki-result-number {
  flex-shrink: 0;
  width: 32px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-md);
  margin-top: 2px;
}

.cnki-result-content {
  flex: 1;
  min-width: 0;
}

.cnki-result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.cnki-result-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  line-height: 1.4;
  display: block;
  margin-right: var(--spacing-md);
}

.cnki-result-title:hover {
  color: var(--accent-primary);
  text-decoration: underline;
}

.cnki-result-title mark {
  background-color: var(--warning-bg);
  color: var(--warning-text);
  padding: 0 2px;
  border-radius: 2px;
}

.cnki-result-badges {
  flex-shrink: 0;
}

.cnki-result-abstract {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.cnki-result-abstract p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.cnki-result-abstract mark {
  background-color: var(--warning-bg);
  color: var(--warning-text);
  padding: 0 2px;
  border-radius: 2px;
}

.cnki-result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
}

.cnki-meta-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.cnki-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
}

.cnki-author a {
  color: var(--accent-primary);
  text-decoration: none;
}

.cnki-author a:hover {
  text-decoration: underline;
}

.cnki-category a {
  color: var(--text-tertiary);
  text-decoration: none;
}

.cnki-category a:hover {
  color: var(--accent-primary);
  text-decoration: underline;
}

.cnki-date {
  color: var(--text-tertiary);
}

.cnki-meta-right {
  flex-shrink: 0;
}

.cnki-stats {
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.cnki-stats span {
  display: flex;
  align-items: center;
  gap: 2px;
}

.cnki-result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.cnki-tag {
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
}

.cnki-tag mark {
  background-color: var(--warning-bg);
  color: var(--warning-text);
  padding: 0 1px;
  border-radius: 1px;
}

.cnki-load-more {
  text-align: center;
  padding: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
}

.cnki-load-more-btn {
  background: var(--accent-primary);
  color: var(--text-inverse);
  border: none;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.cnki-load-more-btn:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.cnki-load-more-btn:disabled {
  background: var(--text-quaternary);
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cnki-result-item {
    padding: var(--spacing-md);
  }
  
  .cnki-result-number {
    width: 24px;
    height: 20px;
    font-size: 0.625rem;
    margin-right: var(--spacing-sm);
  }
  
  .cnki-result-title {
    font-size: 1rem;
  }
  
  .cnki-result-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .cnki-meta-left {
    gap: var(--spacing-sm);
  }
  
  .cnki-stats {
    align-self: flex-end;
  }
}

@media (max-width: 640px) {
  .cnki-result-header {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .cnki-result-badges {
    align-self: flex-start;
  }
  
  .cnki-meta-left {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
`;

// 动态注入搜索结果样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = cnkiResultsStyles;
  document.head.appendChild(styleElement);
}
