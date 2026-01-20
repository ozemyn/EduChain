'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntlayer } from 'next-intlayer';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import { ConfirmDialog, NotificationSkeleton } from '@/../components/common';
import { notificationService } from '@/services/notification';
import { useErrorHandler, useConfirmDialog } from '@/hooks';
import { formatRelativeTimeI18n, type RelativeTimeUnits } from '@/lib/time';
import type { Notification } from '@/types/api';
import './page.css';

type TabType = 'all' | 'unread' | 'system' | 'interaction';

export default function NotificationsPage() {
  const content = useIntlayer('notifications-page');
  const { handleError, handleSuccess } = useErrorHandler();
  const { dialogState, isLoading: dialogLoading, confirm, handleConfirm, handleCancel } = useConfirmDialog();
  
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingMarkAll, setProcessingMarkAll] = useState(false);
  const [processingClear, setProcessingClear] = useState(false);
  
  // 使用 ref 存储 handleError 避免依赖变化导致无限循环
  const handleErrorRef = useRef(handleError);
  handleErrorRef.current = handleError;

  // 时间单位国际化
  const timeUnits: RelativeTimeUnits = useMemo(() => ({
    justNow: String(content.timeUnits.justNow),
    minutesAgo: String(content.timeUnits.minutesAgo),
    hoursAgo: String(content.timeUnits.hoursAgo),
    daysAgo: String(content.timeUnits.daysAgo),
    weeksAgo: String(content.timeUnits.weeksAgo),
    monthsAgo: String(content.timeUnits.monthsAgo),
    yearsAgo: String(content.timeUnits.yearsAgo),
  }), [content.timeUnits]);

  // 获取通知列表
  useEffect(() => {
    let isMounted = true;
    
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const params: { type?: string; isRead?: boolean } = {};
        if (activeTab === 'unread') params.isRead = false;
        else if (activeTab === 'system') params.type = 'system';
        else if (activeTab === 'interaction') params.type = 'interaction';

        const response = await notificationService.getNotifications(params);
        if (isMounted && response.success && response.data) {
          setNotifications(response.data.content || []);
        }
      } catch (error) {
        if (isMounted) {
          handleErrorRef.current(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
    
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // 标记全部已读
  const handleMarkAllRead = useCallback(async () => {
    setProcessingMarkAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      handleSuccess(String(content.messages.markAllReadSuccess));
    } catch (error) {
      handleError(error);
    } finally {
      setProcessingMarkAll(false);
    }
  }, [handleSuccess, handleError, content.messages.markAllReadSuccess]);

  // 清空所有通知
  const handleClearAll = useCallback(async () => {
    const confirmed = await confirm({
      title: String(content.confirmClearAll.title),
      message: String(content.confirmClearAll.message),
      confirmText: String(content.confirmClearAll.confirm),
      cancelText: String(content.confirmClearAll.cancel),
      variant: 'danger',
    });
    
    if (!confirmed) return;

    setProcessingClear(true);
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      handleSuccess(String(content.messages.clearAllSuccess));
    } catch (error) {
      handleError(error);
    } finally {
      setProcessingClear(false);
    }
  }, [confirm, content, handleSuccess, handleError]);

  // 格式化时间
  const formatTime = useCallback((dateStr: string) => {
    return formatRelativeTimeI18n(dateStr, timeUnits);
  }, [timeUnits]);

  // 获取通知图标
  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case 'like':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'comment':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'follow':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  }, []);

  // 未读通知数量
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  return (
    <>
      <Navbar />
      <main className="notifications-page">
        <div className="page-content">
          <header className="notifications-header">
            <h1 className="notifications-title">{content.title}</h1>
            <p className="notifications-subtitle">{content.subtitle}</p>
          </header>

          <div className="notifications-toolbar">
            <nav 
              className="notifications-tabs glass-light" 
              role="tablist"
              aria-label={String(content.aria.tabNavigation)}
            >
              <button 
                role="tab"
                aria-selected={activeTab === 'all'}
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`} 
                onClick={() => setActiveTab('all')}
              >
                {content.all}
              </button>
              <button 
                role="tab"
                aria-selected={activeTab === 'unread'}
                className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`} 
                onClick={() => setActiveTab('unread')}
              >
                {content.unread}
                {unreadCount > 0 && (
                  <span className="unread-badge" aria-label={`${unreadCount}`}>
                    {unreadCount}
                  </span>
                )}
              </button>
              <button 
                role="tab"
                aria-selected={activeTab === 'system'}
                className={`tab-button ${activeTab === 'system' ? 'active' : ''}`} 
                onClick={() => setActiveTab('system')}
              >
                {content.system}
              </button>
              <button 
                role="tab"
                aria-selected={activeTab === 'interaction'}
                className={`tab-button ${activeTab === 'interaction' ? 'active' : ''}`} 
                onClick={() => setActiveTab('interaction')}
              >
                {content.interaction}
              </button>
            </nav>

            <div className="notifications-actions">
              <button 
                className="action-btn" 
                onClick={handleMarkAllRead}
                disabled={processingMarkAll || notifications.length === 0 || unreadCount === 0}
                aria-label={String(content.aria.markAllReadButton)}
                aria-busy={processingMarkAll}
              >
                {processingMarkAll ? (
                  <span className="loading-spinner-small" aria-hidden="true" />
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <span>{content.markAllRead}</span>
              </button>
              <button 
                className="action-btn danger" 
                onClick={handleClearAll}
                disabled={processingClear || notifications.length === 0}
                aria-label={String(content.aria.clearAllButton)}
                aria-busy={processingClear}
              >
                {processingClear ? (
                  <span className="loading-spinner-small" aria-hidden="true" />
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                <span>{content.clearAll}</span>
              </button>
            </div>
          </div>

          {/* 通知列表 */}
          {loading ? (
            <div className="notifications-list" role="status" aria-label={String(content.aria.notificationList)}>
              {[1, 2, 3, 4, 5].map((i) => <NotificationSkeleton key={i} />)}
            </div>
          ) : notifications.length > 0 ? (
            <ul className="notifications-list" role="list" aria-label={String(content.aria.notificationList)}>
              {notifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`notification-item glass-card ${!notification.isRead ? 'unread' : ''}`}
                  aria-label={!notification.isRead ? String(content.aria.unreadNotification) : undefined}
                >
                  {notification.senderName ? (
                    <div className="notification-avatar-placeholder" aria-hidden="true">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`notification-icon ${notification.type}`} aria-hidden="true">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="notification-content">
                    <p className="notification-text">
                      {notification.senderName && <strong>{notification.senderName}</strong>}
                      {notification.senderName ? ' ' : ''}
                      {notification.content}
                    </p>
                    <time 
                      className="notification-time" 
                      dateTime={notification.createdAt}
                      aria-label={String(content.aria.notificationTime)}
                    >
                      {formatTime(notification.createdAt)}
                    </time>
                  </div>
                  
                  <div className={`notification-type-icon ${notification.type}`} aria-hidden="true">
                    {getNotificationIcon(notification.type)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="notifications-empty glass-card" role="status">
              <div className="empty-icon" aria-hidden="true">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="empty-title">{content.noNotifications}</h3>
              <p className="empty-description">{content.noNotificationsDesc}</p>
            </div>
          )}
        </div>

        {/* 确认对话框 */}
        <ConfirmDialog
          state={dialogState}
          isLoading={dialogLoading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </main>
      <Footer />
    </>
  );
}
