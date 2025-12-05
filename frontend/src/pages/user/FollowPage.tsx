/* ===================================
   关注页面组件 - Follow Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 关注/粉丝列表切换
   - 高性能优化
   
   ================================== */

import React from 'react';
import { useParams } from 'react-router-dom';
import { FollowList } from '@/components/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import './FollowPage.css';

/**
 * 关注页面组件
 * 显示用户的关注列表和粉丝列表
 */
const FollowPage: React.FC = () => {
  const { userId, tab = 'following' } = useParams<{
    userId?: string;
    tab?: 'following' | 'followers';
  }>();
  const { user } = useAuth();

  const targetUserId = userId ? parseInt(userId, 10) : user?.id;

  if (!targetUserId) {
    return (
      <div className="follow-error animate-fade-in">
        <div className="error-card glass-card">
          <h2>用户不存在</h2>
          <p>无法找到指定的用户信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="follow-page animate-fade-in">
      <div className="follow-content container">
        {/* 页面标题 */}
        <header className="follow-header animate-fade-in-up">
          <h1 className="follow-title gradient-text">
            {tab === 'following' ? '我的关注' : '我的粉丝'}
          </h1>
          <p className="follow-description">
            {tab === 'following'
              ? '查看您关注的所有用户'
              : '查看关注您的所有用户'}
          </p>
        </header>

        {/* 关注列表 */}
        <section className="follow-list-section animate-fade-in-up delay-100">
          <div className="follow-list-card glass-card">
            <FollowList
              userId={targetUserId}
              currentUserId={user?.id}
              defaultTab={tab}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FollowPage;
