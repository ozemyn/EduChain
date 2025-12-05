import React, { useEffect, useState } from 'react';
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
} from '@ant-design/icons';

import { RecommendationList } from '@/components/recommendation';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Search } = Input;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [stats, setStats] = useState({
    totalKnowledge: 1234,
    totalUsers: 5678,
    totalViews: 98765,
  });

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  // 模拟数据加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalKnowledge: 1234,
        totalUsers: 5678,
        totalViews: 98765,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <BookOutlined />,
      title: '知识库',
      description: '海量优质教育内容，涵盖各个学科领域，支持多媒体资源展示',
      color: 'var(--accent-primary)',
      path: '/knowledge',
      gradient:
        'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
    },
    {
      icon: <SearchOutlined />,
      title: '智能搜索',
      description: '强大的AI驱动搜索引擎，精准匹配您的学习需求',
      color: 'var(--accent-success)',
      path: '/search',
      gradient: 'linear-gradient(135deg, var(--accent-success), #059669)',
    },
    {
      icon: <UserOutlined />,
      title: '个人中心',
      description: '个性化学习空间，记录您的学习轨迹和成长历程',
      color: 'var(--accent-warning)',
      path: '/profile',
      gradient: 'linear-gradient(135deg, var(--accent-warning), #d97706)',
    },
    {
      icon: <TeamOutlined />,
      title: '社区交流',
      description: '与全球学习者互动交流，分享知识与经验',
      color: 'var(--accent-info)',
      path: '/community',
      gradient: 'linear-gradient(135deg, var(--accent-info), #2563eb)',
    },
  ];

  return (
    <div className="home-container animate-fade-in">
      {/* 英雄区域 */}
      <section className="hero-section glass-light">
        <div className="hero-content">
          <div className="hero-badge glass-badge">
            <StarOutlined />
            <span>全新体验</span>
          </div>

          <h1 className="hero-title">
            <span className="gradient-text">EduChain</span>
            <br />
            <span className="hero-subtitle">智能教育知识平台</span>
          </h1>

          <p className="hero-description">
            连接全球学习者与教育者，构建去中心化的知识共享生态系统
            <br />
            让每一份知识都能发光发热，让每一次学习都更加高效
          </p>

          {/* 搜索区域 */}
          <div className="hero-search">
            <div className="search-container glass-medium">
              <Search
                placeholder="搜索知识内容、课程、专家..."
                size="large"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                className="hero-search-input"
                prefix={<SearchOutlined />}
                enterButton={
                  <Button
                    type="primary"
                    className="glass-button glass-strong hover-lift"
                    icon={<ArrowRightOutlined />}
                  >
                    探索
                  </Button>
                }
              />
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="hero-actions">
            <Button
              size="large"
              className="glass-button glass-strong hover-lift active-scale"
              icon={<RocketOutlined />}
              onClick={() => navigate('/knowledge')}
            >
              开始学习之旅
            </Button>
            <Button
              size="large"
              className="glass-button hover-scale active-scale"
              icon={<ThunderboltOutlined />}
              onClick={() => navigate('/knowledge/create')}
            >
              分享知识
            </Button>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="hero-stats">
          <div className="stats-grid">
            <div className="stat-item glass-light hover-lift">
              <Statistic
                title="知识条目"
                value={stats.totalKnowledge}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: 'var(--accent-primary)' }}
              />
            </div>
            <div className="stat-item glass-light hover-lift">
              <Statistic
                title="活跃用户"
                value={stats.totalUsers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: 'var(--accent-success)' }}
              />
            </div>
            <div className="stat-item glass-light hover-lift">
              <Statistic
                title="总浏览量"
                value={stats.totalViews}
                prefix={<StarOutlined />}
                valueStyle={{ color: 'var(--accent-warning)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">核心功能</h2>
          <p className="section-description">
            为您提供全方位的学习和知识分享体验
          </p>
        </div>

        <div className="features-grid">
          {features.map(feature => (
            <div
              key={feature.title}
              className="feature-card glass-floating-card hover-lift active-scale"
              onClick={() => navigate(feature.path)}
            >
              <div
                className="feature-icon"
                style={{ background: feature.gradient }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">
                <ArrowRightOutlined />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 推荐内容 */}
      <section className="recommendations-section">
        <div className="glass-card">
          <RecommendationList
            title="热门推荐"
            showTabs={false}
            defaultTab="trending"
            limit={8}
            compact={true}
          />
        </div>
      </section>

      <style>{`
        .home-container {
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          animation: fadeIn var(--duration-normal) var(--ease-out-ios);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .home-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, var(--primary-100) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--accent-secondary) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, var(--primary-50) 0%, transparent 50%);
          opacity: 0.3;
          z-index: -1;
        }

        /* 英雄区域 */
        .hero-section {
          padding: var(--spacing-3xl) var(--spacing-lg);
          text-align: center;
          position: relative;
          margin-bottom: var(--spacing-3xl);
          border-radius: var(--liquid-border-radius-xl);
          margin: var(--spacing-lg);
          animation: heroFadeIn 0.8s var(--ease-out-ios) forwards;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-lg);
          font-size: 0.875rem;
          font-weight: 600;
          animation: badgePop 0.5s var(--ease-spring-ios) 0.2s backwards;
        }

        @keyframes badgePop {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: var(--spacing-lg);
          animation: titleSlide 0.6s var(--ease-out-ios) 0.3s backwards;
        }

        @keyframes titleSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 8px var(--glass-shadow));
        }

        .hero-subtitle {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: clamp(1.25rem, 3vw, 2rem);
        }

        .hero-description {
          font-size: 1.125rem;
          color: var(--text-tertiary);
          line-height: 1.6;
          margin-bottom: var(--spacing-2xl);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          animation: descriptionFade 0.6s var(--ease-out-ios) 0.5s backwards;
        }

        @keyframes descriptionFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .hero-search {
          margin-bottom: var(--spacing-2xl);
          animation: searchExpand 0.6s var(--ease-out-ios) 0.6s backwards;
        }

        @keyframes searchExpand {
          from {
            opacity: 0;
            transform: scaleX(0.9);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        .search-container {
          max-width: 600px;
          margin: 0 auto;
          padding: var(--spacing-md);
          border-radius: var(--liquid-border-radius-lg);
        }

        .hero-search-input {
          border: none !important;
          background: transparent !important;
        }

        .hero-search-input .ant-input {
          background: transparent !important;
          border: none !important;
          font-size: 1rem !important;
          color: var(--text-primary) !important;
        }

        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: var(--spacing-2xl);
          animation: actionsFade 0.6s var(--ease-out-ios) 0.7s backwards;
        }

        @keyframes actionsFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-stats {
          margin-top: var(--spacing-2xl);
          animation: statsFade 0.6s var(--ease-out-ios) 0.8s backwards;
        }

        @keyframes statsFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          max-width: 900px;
          margin: 0 auto;
        }

        .stat-item {
          padding: var(--spacing-lg);
          text-align: center;
          border-radius: var(--liquid-border-radius);
          transition: all var(--transition-base) var(--ease-ios);
        }

        /* 功能特性 */
        .features-section {
          padding: var(--spacing-3xl) var(--spacing-lg);
          margin-bottom: var(--spacing-3xl);
          animation: sectionFade 0.6s var(--ease-out-ios) 0.9s backwards;
        }

        @keyframes sectionFade {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
        }

        .section-description {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-xl);
          max-width: 900px;
          margin: 0 auto;
        }

        .feature-card {
          padding: var(--spacing-xl);
          text-align: center;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-base) var(--ease-spring-ios);
          border-radius: var(--liquid-border-radius-lg);
          animation: cardFadeIn 0.5s var(--ease-out-ios) backwards;
        }

        .feature-card:nth-child(1) { animation-delay: 1.0s; }
        .feature-card:nth-child(2) { animation-delay: 1.1s; }
        .feature-card:nth-child(3) { animation-delay: 1.2s; }
        .feature-card:nth-child(4) { animation-delay: 1.3s; }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--spacing-lg);
          font-size: 2rem;
          color: var(--text-inverse);
          box-shadow: var(--glass-shadow-lg);
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-lg);
        }

        .feature-arrow {
          position: absolute;
          top: var(--spacing-lg);
          right: var(--spacing-lg);
          color: var(--text-quaternary);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .feature-card:hover .feature-arrow {
          color: var(--accent-primary);
          transform: translateX(4px);
        }

        /* 推荐内容 */
        .recommendations-section {
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-3xl);
          animation: recommendationFade 0.6s var(--ease-out-ios) 1.4s backwards;
        }

        @keyframes recommendationFade {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .hero-section {
            padding: var(--spacing-2xl) var(--spacing-md);
            margin: var(--spacing-md);
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-actions .glass-button {
            width: 100%;
            max-width: 300px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
            max-width: 400px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .features-section,
          .recommendations-section {
            padding: var(--spacing-xl) var(--spacing-md);
          }
        }

        /* 平板响应式 */
        @media (min-width: 769px) and (max-width: 1024px) {
          .stats-grid {
            max-width: 700px;
          }

          .features-grid {
            max-width: 700px;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .home-container,
          .hero-section,
          .hero-badge,
          .hero-title,
          .hero-description,
          .hero-search,
          .hero-actions,
          .hero-stats,
          .features-section,
          .feature-card,
          .recommendations-section,
          .stat-item {
            animation: none !important;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
