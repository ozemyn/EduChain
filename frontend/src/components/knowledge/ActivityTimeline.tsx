import React, { useState, useEffect } from 'react';
import {
  Card,
  Timeline,
  Avatar,
  Typography,
  Space,
  Button,
  Empty,
  Spin,
  message,
  Tag,
} from 'antd';
import {
  ClockCircleOutlined,
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  FileTextOutlined,
  UserAddOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { formatDate } from '@/utils/format';

const { Text, Title } = Typography;

interface ActivityTimelineProps {
  userId?: number; // 如果不传则显示当前用户关注的人的动态
  title?: string;
  showRefresh?: boolean;
}

interface ActivityItem {
  id: string;
  type: 'like' | 'favorite' | 'comment' | 'publish' | 'follow';
  user: {
    id: number;
    fullName: string;
    username: string;
    avatarUrl?: string;
  };
  target?: {
    id: number;
    title: string;
    type?: string;
  };
  content?: string;
  createdAt: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  userId,
  title = '动态时间线',
  showRefresh = true,
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 获取动态数据
  const fetchActivities = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      // 这里应该调用实际的API，暂时使用模拟数据
      const mockActivities: ActivityItem[] = [
        {
          id: `${pageNum}-1`,
          type: 'like',
          user: {
            id: 1,
            fullName: '张三',
            username: 'zhangsan',
            avatarUrl: undefined,
          },
          target: {
            id: 1,
            title: 'React Hooks 最佳实践',
            type: 'TEXT',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
        },
        {
          id: `${pageNum}-2`,
          type: 'publish',
          user: {
            id: 2,
            fullName: '李四',
            username: 'lisi',
            avatarUrl: undefined,
          },
          target: {
            id: 2,
            title: 'Vue 3 组合式API详解',
            type: 'TEXT',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
        },
        {
          id: `${pageNum}-3`,
          type: 'comment',
          user: {
            id: 3,
            fullName: '王五',
            username: 'wangwu',
            avatarUrl: undefined,
          },
          target: {
            id: 3,
            title: 'TypeScript 进阶技巧',
            type: 'TEXT',
          },
          content: '这篇文章写得很好，学到了很多！',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4小时前
        },
        {
          id: `${pageNum}-4`,
          type: 'follow',
          user: {
            id: 4,
            fullName: '赵六',
            username: 'zhaoliu',
            avatarUrl: undefined,
          },
          target: {
            id: 5,
            title: '前端开发专家',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6小时前
        },
        {
          id: `${pageNum}-5`,
          type: 'favorite',
          user: {
            id: 6,
            fullName: '孙七',
            username: 'sunqi',
            avatarUrl: undefined,
          },
          target: {
            id: 4,
            title: 'Node.js 性能优化指南',
            type: 'PDF',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8小时前
        },
      ];

      if (append) {
        setActivities(prev => [...prev, ...mockActivities]);
      } else {
        setActivities(mockActivities);
      }

      setHasMore(pageNum < 3); // 模拟只有3页数据
      setPage(pageNum);
    } catch (error) {
      message.error('获取动态失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  // 刷新动态
  const handleRefresh = () => {
    fetchActivities(1, false);
  };

  // 加载更多
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchActivities(page + 1, true);
    }
  };

  // 获取活动图标和颜色
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return { icon: <LikeOutlined />, color: '#ff4d4f' };
      case 'favorite':
        return { icon: <StarOutlined />, color: '#faad14' };
      case 'comment':
        return { icon: <CommentOutlined />, color: '#1890ff' };
      case 'publish':
        return { icon: <FileTextOutlined />, color: '#52c41a' };
      case 'follow':
        return { icon: <UserAddOutlined />, color: '#722ed1' };
      default:
        return { icon: <ClockCircleOutlined />, color: '#d9d9d9' };
    }
  };

  // 获取活动描述
  const getActivityDescription = (activity: ActivityItem) => {
    const { type, user, target, content } = activity;
    
    switch (type) {
      case 'like':
        return (
          <Space direction="vertical" size="small">
            <Text>
              <Link to={`/user/${user.id}`}>{user.fullName}</Link> 点赞了
              <Link to={`/knowledge/${target?.id}`} style={{ marginLeft: 4 }}>
                {target?.title}
              </Link>
            </Text>
          </Space>
        );
      case 'favorite':
        return (
          <Space direction="vertical" size="small">
            <Text>
              <Link to={`/user/${user.id}`}>{user.fullName}</Link> 收藏了
              <Link to={`/knowledge/${target?.id}`} style={{ marginLeft: 4 }}>
                {target?.title}
              </Link>
            </Text>
            {target?.type && (
              <Tag color="blue">{target.type}</Tag>
            )}
          </Space>
        );
      case 'comment':
        return (
          <Space direction="vertical" size="small">
            <Text>
              <Link to={`/user/${user.id}`}>{user.fullName}</Link> 评论了
              <Link to={`/knowledge/${target?.id}`} style={{ marginLeft: 4 }}>
                {target?.title}
              </Link>
            </Text>
            {content && (
              <Text type="secondary" style={{ fontStyle: 'italic' }}>
                "{content}"
              </Text>
            )}
          </Space>
        );
      case 'publish':
        return (
          <Space direction="vertical" size="small">
            <Text>
              <Link to={`/user/${user.id}`}>{user.fullName}</Link> 发布了
              <Link to={`/knowledge/${target?.id}`} style={{ marginLeft: 4 }}>
                {target?.title}
              </Link>
            </Text>
            {target?.type && (
              <Tag color="green">{target.type}</Tag>
            )}
          </Space>
        );
      case 'follow':
        return (
          <Text>
            <Link to={`/user/${user.id}`}>{user.fullName}</Link> 关注了
            <Link to={`/user/${target?.id}`} style={{ marginLeft: 4 }}>
              {target?.title}
            </Link>
          </Text>
        );
      default:
        return <Text>未知活动</Text>;
    }
  };

  const timelineItems = activities.map(activity => {
    const { icon, color } = getActivityIcon(activity.type);
    
    return {
      dot: (
        <Avatar
          size="small"
          style={{ backgroundColor: color }}
          icon={icon}
        />
      ),
      children: (
        <div style={{ paddingBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            {getActivityDescription(activity)}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {formatDate(activity.createdAt)}
          </Text>
        </div>
      ),
    };
  });

  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4}>
            <ClockCircleOutlined /> {title}
          </Title>
          {showRefresh && (
            <Button
              type="text"
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={handleRefresh}
            >
              刷新
            </Button>
          )}
        </Space>
      </div>

      <Spin spinning={loading && activities.length === 0}>
        {activities.length > 0 ? (
          <>
            <Timeline items={timelineItems} />
            
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button
                  type="dashed"
                  loading={loading}
                  onClick={handleLoadMore}
                  style={{ width: '100%' }}
                >
                  加载更多动态
                </Button>
              </div>
            )}
          </>
        ) : (
          <Empty
            description="暂无动态"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </Card>
  );
};

export default ActivityTimeline;