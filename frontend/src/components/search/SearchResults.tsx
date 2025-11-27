import React from 'react';
import { List, Card, Tag, Avatar, Space, Typography, Empty, Skeleton } from 'antd';
import { EyeOutlined, LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types/api';
import { formatDate } from '@/utils/format';
import styles from './SearchResults.module.css';

const { Text, Paragraph } = Typography;

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
    const content = item.content.length > maxLength 
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
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.searchResults}>
      {total > 0 && (
        <div className={styles.resultSummary}>
          找到 <strong>{total}</strong> 个相关结果
          {keyword && (
            <>
              ，关键词：<strong>"{keyword}"</strong>
            </>
          )}
        </div>
      )}

      <List
        dataSource={results}
        renderItem={(item) => (
          <Card className={styles.resultCard} hoverable>
            <div className={styles.cardHeader}>
              <div className={styles.titleSection}>
                <Link to={`/knowledge/${item.id}`} className={styles.title}>
                  {highlightKeyword(item.title, keyword)}
                </Link>
                <Space size="small" className={styles.tags}>
                  <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                  {item.tags && item.tags.split(',').map(tag => (
                    <Tag key={tag.trim()}>
                      {highlightKeyword(tag.trim(), keyword)}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>

            <div className={styles.cardContent}>
              {renderContentPreview(item)}
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.authorInfo}>
                <Avatar 
                  size="small" 
                  src={item.uploader.avatarUrl} 
                  icon={<UserOutlined />}
                />
                <Link to={`/user/${item.uploader.id}`} className={styles.authorName}>
                  {item.uploader.fullName || item.uploader.username}
                </Link>
                <Text type="secondary" className={styles.date}>
                  {formatDate(item.createdAt)}
                </Text>
                {item.category && (
                  <Link to={`/category/${item.category.id}`} className={styles.category}>
                    {item.category.name}
                  </Link>
                )}
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
                {loading ? '加载中...' : '加载更多'}
              </button>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default SearchResults;