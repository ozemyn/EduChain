import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  Badge,
  Button,
  List,
  Avatar,
  Typography,
  Space,
  Divider,
  Empty,
  Spin,
} from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { interactionService } from '@/services';
import type { Notification } from '@/types';
import { formatDate } from '@/utils/format';

const { Text } = Typography;

interface NotificationDropdownProps {
  placement?: 'bottomLeft' | 'bottomRight';
  trigger?: ('click' | 'hover')[];
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  placement = 'bottomRight',
  trigger = ['click'],
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);

  // 获取最新通知
  const fetchRecentNotifications = async () => {
    setLoading(true);
    try {
      const response = await interactionService.getNotifications({
        page: 0,
        size: 5,
      });

      setNotifications(response.data.content);

      // 计算未读数量
      const unread = response.data.content.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取未读通知数量
  const fetchUnreadCount = async () => {
    try {
      const response = await interactionService.getUnreadNotificationCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // 定期更新未读数量
    const interval = setInterval(fetchUnreadCount, 30000); // 30秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 当下拉框打开时获取最新通知
  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible);
    if (visible) {
      fetchRecentNotifications();
    }
  };

  // 标记通知为已读
  const markAsRead = async (notificationId: number) => {
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
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    const iconProps = { size: 16 };
    switch (type) {
      case 'LIKE':
        return <BellOutlined {...iconProps} style={{ color: '#ff4d4f' }} />;
      case 'COMMENT':
        return <BellOutlined {...iconProps} style={{ color: '#1890ff' }} />;
      case 'FOLLOW':
        return <BellOutlined {...iconProps} style={{ color: '#52c41a' }} />;
      case 'SYSTEM':
        return <BellOutlined {...iconProps} style={{ color: '#faad14' }} />;
      default:
        return <BellOutlined {...iconProps} />;
    }
  };

  const dropdownContent = (
    <div style={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text strong>通知</Text>
          <Link to="/notifications">
            <Button type="link" size="small">
              查看全部
            </Button>
          </Link>
        </Space>
      </div>

      <Spin spinning={loading}>
        {notifications.length > 0 ? (
          <List
            size="small"
            dataSource={notifications}
            renderItem={notification => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  backgroundColor: notification.isRead
                    ? 'transparent'
                    : '#f6ffed',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification.id);
                  }
                  setVisible(false);
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!notification.isRead}>
                      <Avatar
                        size="small"
                        icon={getNotificationIcon(notification.type)}
                      />
                    </Badge>
                  }
                  title={
                    <Text
                      ellipsis={{ tooltip: notification.title }}
                      strong={!notification.isRead}
                      style={{ fontSize: '13px' }}
                    >
                      {notification.title}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size={2}>
                      <Text
                        type="secondary"
                        ellipsis={{ tooltip: notification.content }}
                        style={{ fontSize: '12px' }}
                      >
                        {notification.content}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {formatDate(notification.createdAt)}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <Empty
              description="暂无通知"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              imageStyle={{ height: 40 }}
            />
          </div>
        )}
      </Spin>

      {notifications.length > 0 && (
        <>
          <Divider style={{ margin: 0 }} />
          <div style={{ padding: '8px 16px', textAlign: 'center' }}>
            <Link to="/notifications">
              <Button type="link" size="small">
                查看更多通知
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      placement={placement}
      trigger={trigger}
      open={visible}
      onOpenChange={handleVisibleChange}
    >
      <Badge count={unreadCount} size="small">
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ border: 'none' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
