import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Space, Typography, Spin, Empty } from 'antd';
import { EyeOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { searchService } from '@/services/search';
import type { KnowledgeItem } from '@/types/api';
import { formatDate } from '@/utils/format';
import styles from './SimilarContent.module.css';

const { Text } = Typography;

interface SimilarContentProps {
  knowledgeId: number;
  title?: string;
  limit?: number;
  className?: string;
}

const SimilarContent: React.FC<SimilarContentProps> = ({
  knowledgeId,
  title = '相关推荐',
  limit = 5,
  className,
}) => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (knowledgeId) {
      loadSimilarContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeId, limit]);

  const loadSimilarContent = async () => {
    setLoading(true);
    try {
      const response = await searchService.getSimilarContent(
        knowledgeId,
        limit
      );
      setItems(response.data);
    } catch (error) {
      console.error('加载相关内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card title={title} className={className}>
        <div className={styles.loading}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card title={title} className={className}>
        <Empty
          description="暂无相关内容"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title={title} className={`${styles.similarContent} ${className}`}>
      <List
        dataSource={items}
        renderItem={item => (
          <List.Item className={styles.listItem}>
            <div className={styles.itemContent}>
              <Link to={`/knowledge/${item.id}`} className={styles.title}>
                {item.title}
              </Link>

              <div className={styles.meta}>
                <Space size="small">
                  <Avatar
                    size="small"
                    src={item.uploaderAvatar || undefined}
                    icon={<UserOutlined />}
                  />
                  <Text type="secondary" className={styles.author}>
                    {item.uploaderName || `用户 ${item.uploaderId}`}
                  </Text>
                  <Text type="secondary" className={styles.date}>
                    {formatDate(item.createdAt)}
                  </Text>
                </Space>
              </div>

              <div className={styles.stats}>
                <Space size="small">
                  <span>
                    <EyeOutlined /> {item.stats?.viewCount || 0}
                  </span>
                  <span>
                    <LikeOutlined /> {item.stats?.likeCount || 0}
                  </span>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default SimilarContent;
