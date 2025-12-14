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
import styles from './SearchResults.module.css';

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
        <mark key={index} className={styles.highlight}>
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
      <Paragraph className={styles.content}>
        {highlightKeyword(content, keyword)}
      </Paragraph>
    );
  };

  if (loading && results.length === 0) {
    return (
      <div className={styles.searchResults}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className={styles.resultCard}>
            <Skeleton active />
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={styles.searchResults}>
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
    <div className={styles.searchResults}>
      <List
        dataSource={results}
        renderItem={item => (
          <Card key={item.id} className={styles.resultCard}>
            <div className={styles.cardHeader}>
              <div className={styles.titleSection}>
                <Link to={`/knowledge/${item.id}`} className={styles.title}>
                  {highlightKeyword(item.title, keyword)}
                </Link>
                <div className={styles.tags}>
                  <Tag color={getTypeColor(item.type || 'TEXT')}>
                    {item.type}
                  </Tag>
                  {item.tags &&
                    item.tags
                      .split(',')
                      .slice(0, 3)
                      .map(tag => (
                        <Tag key={tag.trim()}>
                          {highlightKeyword(tag.trim(), keyword)}
                        </Tag>
                      ))}
                </div>
              </div>
            </div>

            <div className={styles.cardContent}>
              {renderContentPreview(item)}
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.authorInfo}>
                <UserOutlined />
                <Link
                  to={`/user/${item.uploaderId}`}
                  className={styles.authorName}
                >
                  {item.uploaderName || `用户 ${item.uploaderId}`}
                </Link>
                {item.category && (
                  <Link
                    to={`/category/${item.category.id}`}
                    className={styles.category}
                  >
                    {item.category.name}
                  </Link>
                )}
                <span className={styles.date}>
                  {formatDate(item.createdAt, 'YYYY-MM-DD')}
                </span>
              </div>
              <Space className={styles.stats}>
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
          </Card>
        )}
        loading={loading}
        loadMore={
          hasMore ? (
            <div className={styles.loadMore}>
              <button onClick={onLoadMore} disabled={loading}>
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
