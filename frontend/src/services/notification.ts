import { request } from './api';
import type { PageRequest, PageResponse } from '@/types/api';

export interface Notification {
  id: number;
  userId: number;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'SYSTEM';
  title: string;
  content: string;
  relatedId?: number;
  relatedType?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationStats {
  totalCount: number;
  unreadCount: number;
  todayCount: number;
}

export interface NotificationSettings {
  enableLikeNotifications: boolean;
  enableCommentNotifications: boolean;
  enableFollowNotifications: boolean;
  enableSystemNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export const notificationService = {
  // 获取通知列表
  getNotifications: (
    params?: PageRequest & { type?: string; isRead?: boolean }
  ) => request.get<PageResponse<Notification>>('/notifications', { params }),

  // 获取未读通知数量
  getUnreadCount: () =>
    request.get<{ unreadCount: number }>('/notifications/unread/count'),

  // 获取通知统计
  getNotificationStats: () =>
    request.get<NotificationStats>('/notifications/stats'),

  // 标记通知为已读
  markAsRead: (id: number) => request.put(`/notifications/${id}/read`),

  // 标记所有通知为已读
  markAllAsRead: () => request.put('/notifications/read-all'),

  // 删除通知
  deleteNotification: (id: number) => request.delete(`/notifications/${id}`),

  // 批量删除通知
  batchDeleteNotifications: (ids: number[]) =>
    request.post('/notifications/batch-delete', { ids }),

  // 清空所有通知
  clearAllNotifications: () => request.delete('/notifications/clear-all'),

  // 获取通知设置
  getNotificationSettings: () =>
    request.get<NotificationSettings>('/notifications/settings'),

  // 更新通知设置
  updateNotificationSettings: (settings: NotificationSettings) =>
    request.put('/notifications/settings', settings),
};
