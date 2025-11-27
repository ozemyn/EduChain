import React, { useState, useEffect } from 'react';
import { Button, Space, message, Tooltip } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { interactionService } from '@/services';
import type { InteractionStats } from '@/types';
import styles from './InteractionButtons.module.css';

interface InteractionButtonsProps {
  knowledgeId: number;
  initialStats?: InteractionStats;
  size?: 'small' | 'middle' | 'large';
  showLabels?: boolean;
  onStatsChange?: (stats: InteractionStats) => void;
  onCommentClick?: () => void;
}

const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  knowledgeId,
  initialStats,
  size = 'middle',
  showLabels = true,
  onStatsChange,
  onCommentClick,
}) => {
  const [stats, setStats] = useState<InteractionStats>(
    initialStats || {
      knowledgeId,
      likeCount: 0,
      favoriteCount: 0,
      viewCount: 0,
      commentCount: 0,
      userLiked: false,
      userFavorited: false,
    }
  );
  const [loading, setLoading] = useState({
    like: false,
    favorite: false,
  });
  const [animating, setAnimating] = useState({
    like: false,
    favorite: false,
  });

  // 获取互动统计
  const fetchStats = async () => {
    try {
      const response = await interactionService.getInteractionStats(knowledgeId);
      setStats(response.data);
      onStatsChange?.(response.data);
    } catch (error) {
      console.error('Failed to fetch interaction stats:', error);
    }
  };

  useEffect(() => {
    if (!initialStats) {
      fetchStats();
    }
  }, [knowledgeId, initialStats]);

  // 处理点赞
  const handleLike = async () => {
    setLoading(prev => ({ ...prev, like: true }));
    try {
      if (stats.userLiked) {
        await interactionService.unlikeKnowledge(knowledgeId);
        const newStats = {
          ...stats,
          likeCount: stats.likeCount - 1,
          userLiked: false,
        };
        setStats(newStats);
        onStatsChange?.(newStats);
        message.success('已取消点赞');
      } else {
        await interactionService.likeKnowledge(knowledgeId);
        const newStats = {
          ...stats,
          likeCount: stats.likeCount + 1,
          userLiked: true,
        };
        setStats(newStats);
        onStatsChange?.(newStats);
        
        // 触发动画
        setAnimating(prev => ({ ...prev, like: true }));
        setTimeout(() => setAnimating(prev => ({ ...prev, like: false })), 600);
        
        message.success('点赞成功');
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  // 处理收藏
  const handleFavorite = async () => {
    setLoading(prev => ({ ...prev, favorite: true }));
    try {
      if (stats.userFavorited) {
        await interactionService.unfavoriteKnowledge(knowledgeId);
        const newStats = {
          ...stats,
          favoriteCount: stats.favoriteCount - 1,
          userFavorited: false,
        };
        setStats(newStats);
        onStatsChange?.(newStats);
        message.success('已取消收藏');
      } else {
        await interactionService.favoriteKnowledge(knowledgeId);
        const newStats = {
          ...stats,
          favoriteCount: stats.favoriteCount + 1,
          userFavorited: true,
        };
        setStats(newStats);
        onStatsChange?.(newStats);
        
        // 触发动画
        setAnimating(prev => ({ ...prev, favorite: true }));
        setTimeout(() => setAnimating(prev => ({ ...prev, favorite: false })), 600);
        
        message.success('收藏成功');
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(prev => ({ ...prev, favorite: false }));
    }
  };

  // 处理分享
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '分享知识内容',
          url: window.location.href,
        });
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        message.success('链接已复制到剪贴板');
      }
    } catch (error) {
      message.error('分享失败');
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Space size="middle" className={styles.interactionButtons}>
      <Tooltip title={stats.userLiked ? '取消点赞' : '点赞'}>
        <Button
          type="text"
          size={size}
          loading={loading.like}
          icon={
            <span className={animating.like ? styles.animateHeart : ''}>
              {stats.userLiked ? <LikeFilled /> : <LikeOutlined />}
            </span>
          }
          onClick={handleLike}
          className={`${styles.interactionButton} ${stats.userLiked ? styles.liked : ''}`}
        >
          {showLabels && <span className={styles.count}>{formatCount(stats.likeCount)}</span>}
        </Button>
      </Tooltip>

      <Tooltip title={stats.userFavorited ? '取消收藏' : '收藏'}>
        <Button
          type="text"
          size={size}
          loading={loading.favorite}
          icon={
            <span className={animating.favorite ? styles.animateStar : ''}>
              {stats.userFavorited ? <StarFilled /> : <StarOutlined />}
            </span>
          }
          onClick={handleFavorite}
          className={`${styles.interactionButton} ${stats.userFavorited ? styles.favorited : ''}`}
        >
          {showLabels && <span className={styles.count}>{formatCount(stats.favoriteCount)}</span>}
        </Button>
      </Tooltip>

      <Button
        type="text"
        size={size}
        icon={<EyeOutlined />}
        disabled
        className={styles.interactionButton}
      >
        {showLabels && <span className={styles.count}>{formatCount(stats.viewCount)}</span>}
      </Button>

      <Button
        type="text"
        size={size}
        icon={<CommentOutlined />}
        onClick={onCommentClick}
        className={styles.interactionButton}
      >
        {showLabels && <span className={styles.count}>{formatCount(stats.commentCount)}</span>}
      </Button>

      <Tooltip title="分享">
        <Button
          type="text"
          size={size}
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          className={`${styles.interactionButton} ${styles.shareButton}`}
        />
      </Tooltip>
    </Space>
  );
};

export default InteractionButtons;