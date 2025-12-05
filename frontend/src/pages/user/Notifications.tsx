/* ===================================
   通知页面组件 - Notifications Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 通知中心展示
   - 高性能优化
   
   ================================== */

import React from 'react';
import { NotificationCenter } from '@/components/knowledge';
import './Notifications.css';

/**
 * 通知页面组件
 * 显示用户的所有通知
 */
const NotificationsPage: React.FC = () => {
  return (
    <div className="notifications-page animate-fade-in">
      <div className="notifications-content container">
        {/* 页面标题 */}
        <header className="notifications-header animate-fade-in-up">
          <h1 className="notifications-title gradient-text">通知中心</h1>
          <p className="notifications-description">
            查看您的所有通知和消息提醒
          </p>
        </header>

        {/* 通知列表 */}
        <section className="notifications-list-section animate-fade-in-up delay-100">
          <div className="notifications-list-card glass-card">
            <NotificationCenter />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotificationsPage;
