import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Avatar,
  Typography,
  Space,
  Button,
  Badge,
  Tabs,
  Empty,
  Spin,
  message,
  Popconfirm,
} from 'antd';
import {
  BellOutlined,
  LikeOutlined,
  CommentOutlined,
  UserAddOutlined,
  NotificationOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { interactionService } from '@/services';
import type { Notification } from '@/types';
import { formatDate } from '@/utils/format';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface NotificationCenterProps {
  onUnreadCountChange?: (count: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // 获取通知列表
  const fetchNotifications = async (page = 1, size = 20, type?: string) => {
    setLoading(true);
    try {
      const params: any = {
        page: page - 1,
        size,
      };
      
      if (type && type !== 'all') {
        params.type = type.toUpperCase();
      }

      const response = await interactionService.getNotifications(params);
      
      setNotifications(response.data.content);
      setPagination({
        current: page,
        pageSize: size,
        total: response.data.totalElements,
      });

      // 计算未读数量
      const unread = response.data.content.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      onUnreadCountChange?.(unread);
    } catch (error) {
      message.error('获取通知失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取未读通知数量
  const fetchUnreadCount = async () => {
    try {
      const response = await interactionService.getUnreadNotificationCount();
      setUnreadCount(response.data.count);
      onUnreadCountChange?.(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // 标记单个通知为已读
  const markAsRead = async (notificationId: number) => {
    setActionLoading(prev => ({ ...prev, [notificationId]: true }));
    try {
      await interactionService.markNotificationAsRead(notificationId);
      
      // 更新本地状态
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      onUnreadCountChange?.(Math.max(0, unreadCount - 1));
      
      message.success('已标记为已读');
    } catch (error) {
      message.error('操作失败');
    } finally {
      setActionLoading(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    try {
      await interactionService.markAllNotificationsAsRead();
      
      // 更新本地状态
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      onUnreadCountChange?.(0);
      
      message.success('已标记所有通知为已读');
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <LikeOutlined style={{ color: '#ff4d4f' }} />;
      case 'COMMENT':
        return <CommentOutlined style={{ color: '#1890ff' }} />;
      case 'FOLLOW':
        return <UserAddOutlined style={{ color: '#52c41a' }} />;
      case 'SYSTEM':
        return <NotificationOutlined style={{ color: '#faad14' }} />;
      default:
        return <BellOutlined />;
    }
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchNotifications(1, pagination.pageSize, key);
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize?: number) => {
    fetchNotifications(page, pageSize || pagination.pageSize, activeTab);
  };

  const renderNotificationItem = (notification: Notification) => (
    <List.Item
      key={notification.id}
      style={{
        backgroundColor: notification.isRead ? 'transparent' : '#f6ffed',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '8px',
      }}
      actions={[
        !notification.isRead && (
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            loading={actionLoading[notification.id]}
            onClick={() => markAsRead(notification.id)}
          >
            标记已读
          </Button>
        ),
      ].filter(Boolean)}
    >
      <List.Item.Meta
        avatar={
          <Badge dot={!notification.isRead}>
            <Avatar icon={getNotificationIcon(notification.type)} />
          </Badge>
        }
        title={
          <Space>
            <Text strong={!notification.isRead}>{notification.title}</Text>
            {!notification.isRead && (
              <Badge status="processing" text="未读" />
            )}
          </Space>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">{notification.content}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {formatDate(notification.createdAt)}
            </Text>
          </Space>
        }
      />
    </List.Item>
  );

  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4}>
            <BellOutlined /> 通知中心
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ marginLeft: 8 }} />
            )}
          </Title>
          {unreadCount > 0 && (
            <Popconfirm
              title="确定要标记所有通知为已读吗？"
              onConfirm={markAllAsRead}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" size="small">
                全部已读
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="全部" key="all" />
        <TabPane tab="点赞" key="like" />
        <TabPane tab="评论" key="comment" />
        <TabPane tab="关注" key="follow" />
        <TabPane tab="系统" key="system" />
      </Tabs>

      <Spin spinning={loading}>
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={renderNotificationItem}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: handlePageChange,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条通知`,
            }}
          />
        ) : (
          <Empty
            description="暂无通知"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </Card>
  );
};

export default NotificationCenter;