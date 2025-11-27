import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { interactionService } from '@/services';
import type { FollowStats } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface FollowButtonProps {
  userId: number;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  onFollowChange?: (isFollowing: boolean, stats: FollowStats) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  size = 'middle',
  type = 'default',
  onFollowChange,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [followStats, setFollowStats] = useState<FollowStats>({
    userId,
    followingCount: 0,
    followerCount: 0,
    isFollowing: false,
  });

  // 获取关注状态
  const fetchFollowStats = async () => {
    try {
      const response = await interactionService.getFollowStats(userId);
      setFollowStats(response.data);
    } catch (error) {
      console.error('Failed to fetch follow stats:', error);
    }
  };

  useEffect(() => {
    if (user && userId !== user.id) {
      fetchFollowStats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, user]);

  // 处理关注/取消关注
  const handleFollowToggle = async () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }

    if (user.id === userId) {
      message.warning('不能关注自己');
      return;
    }

    setLoading(true);
    try {
      if (followStats.isFollowing) {
        await interactionService.unfollowUser(userId);
        const newStats = {
          ...followStats,
          followerCount: followStats.followerCount - 1,
          isFollowing: false,
        };
        setFollowStats(newStats);
        onFollowChange?.(false, newStats);
        message.success('已取消关注');
      } else {
        await interactionService.followUser(userId);
        const newStats = {
          ...followStats,
          followerCount: followStats.followerCount + 1,
          isFollowing: true,
        };
        setFollowStats(newStats);
        onFollowChange?.(true, newStats);
        message.success('关注成功');
      }
    } catch {
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 如果是当前用户自己，不显示关注按钮
  if (!user || user.id === userId) {
    return null;
  }

  return (
    <Button
      type={followStats.isFollowing ? 'default' : type}
      size={size}
      loading={loading}
      icon={followStats.isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
      onClick={handleFollowToggle}
      danger={followStats.isFollowing}
    >
      {followStats.isFollowing ? '取消关注' : '关注'}
    </Button>
  );
};

export default FollowButton;