/* ===================================
   首页组件 - Home Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 现代化的 iOS 风格
   - 高性能优化
   - 流畅的动画效果
   
   ================================== */

import React, { useState, useEffect, useMemo } from 'react';
import { Button, Input, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BookOutlined,
  SearchOutlined,
  UserOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  StarOutlined,
  TeamOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useThemeContext } from '@contexts/ThemeProvider';
import { RecommendationList } from '@/components/recommendation';
import './Home.css';

const { Search } = Input;

/**
 * 首页组件
 * 包含英雄区域、统计数据、功能特性、推荐内容
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useThemeContext();

  // 状态管理
  const [searchValue, setSearchValue] = useState('');
  const [stats, setStats] = useState({
    totalKnowledge: 0,
    totalUsers: 0,
    totalViews: 0,
  });

  // 模拟数据加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalKnowledge: 1234,
        totalUsers: 5678,
        totalViews: 98765,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 功能特性配置
  const features = useMemo(
    () => [
      {
        key: 'knowledge',
        icon: <BookOutlined />,
        title: '知识库',
        description: '海量优质教育内容，涵盖各个学科领域，支持多媒体资源展示',
        path: '/knowledge',
        gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
        gradientDark: 'linear-gradient(135deg, #404040, #262626)',
      },
      {
        key: 'search',
        icon: <SearchOutlined />,
        title: '智能搜索',
        description: '强大的AI驱动搜索引擎，精准匹配您的学习需求',
        path: '/search',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        gradientDark: 'linear-gradient(135deg, #525252, #333333)',
      },
      {
        key: 'profile',
        icon: <UserOutlined />,
        title: '个人中心',
        description: '个性化学习空间，记录您的学习轨迹和成长历程',
        path: '/profile',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        gradientDark: 'linear-gradient(135deg, #737373, #404040)',
      },
      {
        key: 'community',
        icon: <TeamOutlined />,
        title: '社区交流',
        description: '与全球学习者互动交流，分享知识与经验',
        path: '/community',
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        gradientDark: 'linear-gradient(135deg, #a3a3a3, #525252)',
      },
    ],
    []
  );

  // 根据主题获取渐变色
  const getFeatureGradient = (feature: typeof features[0]) => {
    return resolvedTheme === 'dark' ? feature.gradientDark : feature.gradient;
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  // 功能卡片点击处理 - 导航并滚动到顶部
  const handleFeatureClick = (path: string) => {
    navigate(path);
    // 使用 setTimeout 确保导航完成后再滚动
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="home-page animate-fade-in">
      <div className="home-content">
        {/* ===================================
            英雄区域 - Hero Section
            ================================== */}
        <section className="hero-section">
          <div className="hero-container">
            {/* 徽章 */}
            <div className="hero-badge glass-badge animate-scale-in delay-100">
              <StarOutlined />
              <span>全新体验</span>
            </div>

            {/* 标题 */}
            <h1 className="hero-title animate-fade-in-up delay-200">
              <span className="hero-title-main">EduChain</span>
              <span className="hero-title-sub">智能教育知识平台</span>
            </h1>

            {/* 描述 */}
            <p className="hero-description animate-fade-in-up delay-300">
              连接全球学习者与教育者，构建去中心化的知识共享生态系统
              <br />
              让每一份知识都能发光发热，让每一次学习都更加高效
            </p>

            {/* 搜索框 */}
            <div className="hero-search-wrapper animate-fade-in-up delay-400">
              <div className="hero-search-container glass-medium">
                <Search
                  placeholder="搜索知识内容、课程、专家..."
                  size="large"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onSearch={handleSearch}
                  className="hero-search"
                  prefix={<SearchOutlined />}
                  enterButton={
                    <Button
                      type="primary"
                      className="glass-button glass-strong hover-lift active-scale"
                      icon={<ArrowRightOutlined />}
                    >
                      探索
                    </Button>
                  }
                />
              </div>
            </div>

            {/* 行动按钮 */}
            <div className="hero-actions animate-fade-in-up delay-500">
              <Button
                size="large"
                className="hero-action-btn glass-button glass-strong hover-lift active-scale"
                icon={<RocketOutlined />}
                onClick={() => handleFeatureClick('/knowledge')}
              >
                开始学习之旅
              </Button>
              <Button
                size="large"
                className="hero-action-btn glass-button hover-scale active-scale"
                icon={<ThunderboltOutlined />}
                onClick={() => handleFeatureClick('/knowledge/create')}
              >
                分享知识
              </Button>
            </div>
          </div>
        </section>

        {/* ===================================
            统计数据 - Statistics Section
            ================================== */}
        <section className="stats-section animate-fade-in-up delay-600">
          <div className="stats-container">
            <div className="stats-grid">
              <div className="stat-card glass-light hover-lift gpu-accelerated">
                <Statistic
                  title="知识条目"
                  value={stats.totalKnowledge}
                  prefix={<FileTextOutlined />}
                  styles={{ content: { color: 'var(--primary-600)' } }}
                />
              </div>
              <div className="stat-card glass-light hover-lift gpu-accelerated delay-100">
                <Statistic
                  title="活跃用户"
                  value={stats.totalUsers}
                  prefix={<TeamOutlined />}
                  styles={{ content: { color: 'var(--accent-success)' } }}
                />
              </div>
              <div className="stat-card glass-light hover-lift gpu-accelerated delay-200">
                <Statistic
                  title="总浏览量"
                  value={stats.totalViews}
                  prefix={<EyeOutlined />}
                  styles={{ content: { color: 'var(--accent-warning)' } }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================
            功能特性 - Features Section
            ================================== */}
        <section className="features-section">
          <div className="features-container">
            {/* 区域标题 */}
            <div className="section-header animate-fade-in-up delay-700">
              <h2 className="section-title">核心功能</h2>
              <p className="section-description">
                为您提供全方位的学习和知识分享体验
              </p>
            </div>

            {/* 功能网格 */}
            <div className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={feature.key}
                  className={`feature-card glass-floating-card hover-lift active-scale animate-fade-in-up delay-${800 + index * 100}`}
                  onClick={() => handleFeatureClick(feature.path)}
                >
                  {/* 图标 */}
                  <div
                    className="feature-icon-wrapper gpu-accelerated"
                    style={{
                      background: getFeatureGradient(feature),
                    }}
                  >
                    {feature.icon}
                  </div>

                  {/* 标题 */}
                  <h3 className="feature-title">{feature.title}</h3>

                  {/* 描述 */}
                  <p className="feature-description">{feature.description}</p>

                  {/* 箭头 */}
                  <div className="feature-arrow">
                    <ArrowRightOutlined />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================
            推荐内容 - Recommendations Section
            ================================== */}
        <section className="recommendations-section animate-fade-in-up delay-1200">
          <div className="recommendations-container">
            <div className="recommendations-card glass-card">
              <RecommendationList
                title="热门推荐"
                showTabs={false}
                defaultTab="trending"
                limit={8}
                compact={true}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
