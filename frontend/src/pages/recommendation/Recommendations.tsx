/* ===================================
   推荐页面组件 - Recommendations Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 多标签页推荐内容
   - 精美的卡片布局
   - 高性能优化
   
   ================================== */

import React from 'react';
import { RecommendationList } from '@/components/recommendation';
import {
  ThunderboltOutlined,
  FireOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import './Recommendations.css';

/**
 * 推荐页面组件
 * 展示个性化推荐、热门内容、最新内容等
 */
const Recommendations: React.FC = () => {
  return (
    <div className="recommendations-page animate-fade-in">
      {/* 页面标题 */}
      <header className="recommendations-header glass-light animate-fade-in-down">
        <div className="header-content container">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <ThunderboltOutlined />
            </div>
          </div>
          <h1 className="header-title gradient-text">为您推荐</h1>
          <p className="header-description">
            基于您的兴趣和行为，为您精心挑选的优质内容
          </p>

          {/* 特色标签 */}
          <div className="header-features animate-fade-in-up delay-100">
            <div className="feature-item glass-badge hover-scale">
              <FireOutlined />
              <span>热门推荐</span>
            </div>
            <div className="feature-item glass-badge hover-scale">
              <ClockCircleOutlined />
              <span>最新内容</span>
            </div>
            <div className="feature-item glass-badge hover-scale">
              <StarOutlined />
              <span>精选优质</span>
            </div>
          </div>
        </div>
      </header>

      {/* 推荐内容区域 */}
      <main className="recommendations-main">
        <div className="recommendations-content container">
          <div className="recommendations-card glass-card animate-fade-in-up delay-200">
            <RecommendationList
              title=""
              showTabs={true}
              defaultTab="personalized"
              limit={20}
              compact={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
