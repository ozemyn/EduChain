/* ===================================
   活动页面组件 - Activity Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 双栏布局（关注动态 + 我的动态）
   - 高性能优化
   
   ================================== */

import React from 'react';
import { ActivityTimeline } from '@/components/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import './ActivityPage.css';

/**
 * 活动页面组件
 * 显示关注动态和个人动态
 */
const ActivityPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="activity-page animate-fade-in">
      <div className="activity-content container">
        {/* 页面标题 */}
        <header className="activity-header animate-fade-in-up">
          <h1 className="activity-title gradient-text">动态中心</h1>
          <p className="activity-description">
            查看您关注的用户和您自己的最新动态
          </p>
        </header>

        {/* 双栏布局 */}
        <div className="activity-grid">
          {/* 关注动态 */}
          <section className="activity-section activity-following animate-fade-in-up delay-100">
            <div className="activity-card glass-card">
              <ActivityTimeline title="关注动态" showRefresh={true} />
            </div>
          </section>

          {/* 我的动态 */}
          <section className="activity-section activity-mine animate-fade-in-up delay-200">
            <div className="activity-card glass-card">
              <ActivityTimeline
                userId={user?.id}
                title="我的动态"
                showRefresh={false}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
