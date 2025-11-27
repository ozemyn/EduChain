import React, { useState } from 'react';
import { Card, Avatar, Space, Tag, Button, Tooltip, message } from 'antd';
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
  LikeOutlined as ThumbsUpOutlined,
  DislikeOutlined as ThumbsDownOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types/api';
import { searchService } from '@/services/search';
import { formatDate } from '@/utils/format';
import styles from './RecommendationCard.module.css';

interface RecommendationCardProps {
  item: KnowledgeItem;
  reason?: string;
  onFeedback?: (feedback: 'like' | 'dislike' | 'not_interested') => void;
  onRemove?: () => void;
  showFeedback?: boolean;
  compact?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  reason,
  onFeedback,
  onRemove,
  showFeedback = true,
  compact = false,
}) => {
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  const handleFeedback = async (
    feedback: 'like' | 'dislike' | 'not_interested'
  ) => {
    setFeedbackLoading(true);
    try {
      await searchService.submitRecommendationFeedback(item.id, feedback);
      setFeedbackGiven(feedback);
      onFeedback?.(feedback);

      const messages = {
        like: '感谢您的反馈！我们会推荐更多类似内容',
        dislike: '感谢您的反馈！我们会改进推荐算法',
        not_interested: '已标记为不感兴趣，不会再推荐类似内容',
      };

      message.success(messages[feedback]);

      if (feedback === 'not_interested') {
        setTimeout(() => onRemove?.(), 1000);
      }
    } catch {
      message.error('反馈提交失败');
    } finally {
      setFeedbackLoading(false);
    }
  };

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

  const renderContent = () => {
    const maxLength = compact ? 100 : 150;
    const content =
      item.content.length > maxLength
        ? `${item.content.substring(0, maxLength)}...`
        : item.content;

    return <p className={styles.content}>{content}</p>;
  };

  return (
    <Card
      className={`${styles.recommendationCard} ${compact ? styles.compact : ''}`}
      hoverable
      actions={
        showFeedback && !feedbackGiven
          ? [
              <Tooltip title="喜欢这个推荐">
                <Button
                  type="text"
                  icon={<ThumbsUpOutlined />}
                  loading={feedbackLoading}
                  onClick={() => handleFeedback('like')}
                />
              </Tooltip>,
              <Tooltip title="不喜欢这个推荐">
                <Button
                  type="text"
                  icon={<ThumbsDownOutlined />}
                  loading={feedbackLoading}
                  onClick={() => handleFeedback('dislike')}
                />
              </Tooltip>,
              <Tooltip title="不感兴趣">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  loading={feedbackLoading}
                  onClick={() => handleFeedback('not_interested')}
                />
              </Tooltip>,
            ]
          : undefined
      }
    >
      {reason && (
        <div className={styles.reason}>
          <Tag color="blue">{reason}</Tag>
        </div>
      )}

      <div className={styles.header}>
        <Link to={`/knowledge/${item.id}`} className={styles.title}>
          {item.title}
        </Link>
        <Space size="small" className={styles.tags}>
          <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
          {item.tags &&
            item.tags
              .split(',')
              .slice(0, 3)
              .map(tag => <Tag key={tag.trim()}>{tag.trim()}</Tag>)}
        </Space>
      </div>

      {!compact && (
        <div className={styles.contentSection}>{renderContent()}</div>
      )}

      <div className={styles.footer}>
        <div className={styles.authorInfo}>
          <Avatar
            size="small"
            src={item.uploader.avatarUrl}
            icon={<UserOutlined />}
          />
          <Link to={`/user/${item.uploader.id}`} className={styles.authorName}>
            {item.uploader.fullName || item.uploader.username}
          </Link>
          <span className={styles.date}>{formatDate(item.createdAt)}</span>
        </div>

        <Space className={styles.stats} size="small">
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

      {feedbackGiven && (
        <div className={styles.feedbackStatus}>
          {feedbackGiven === 'like' && '👍 已标记为喜欢'}
          {feedbackGiven === 'dislike' && '👎 已标记为不喜欢'}
          {feedbackGiven === 'not_interested' && '❌ 已标记为不感兴趣'}
        </div>
      )}
    </Card>
  );
};

export default RecommendationCard;
