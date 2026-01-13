'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RecommendationList from '../../components/RecommendationList/RecommendationList';
import './Home.css';

export default function HomePage() {
  const content = useIntlayer('home');

  return (
    <>
      <Navbar />
      
      <div className="home-page animate-fade-in">
        <div className="home-content">
          {/* 英雄区域 */}
          <section className="hero-section">
            <div className="hero-container">
              {/* 徽章 */}
              <div className="hero-badge glass-badge">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{content.hero.badge.value}</span>
              </div>

              {/* 标题 */}
              <h1 className="hero-title animate-slide-in-bottom delay-200">
                <span className="hero-title-main text-gradient-pink">
                  {content.hero.title.value}
                </span>
                <span className="hero-title-sub">
                  {content.hero.subtitle.value}
                </span>
              </h1>

              {/* 描述 */}
              <p className="hero-description animate-slide-in-bottom delay-300">
                {content.hero.description.value}
              </p>

              {/* 搜索框 */}
              <div className="hero-search-wrapper animate-slide-in-bottom delay-400">
                <div className="hero-search-container glass-medium">
                  <div className="hero-search-prefix">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={content.hero.searchPlaceholder.value}
                    className="hero-search-input"
                  />
                  <button className="hero-search-button hover-lift">
                    <span>{content.hero.searchButton.value}</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 行动按钮 */}
              <div className="hero-actions animate-slide-in-bottom delay-500">
                <button className="hero-action-btn hero-action-primary hover-lift">
                  {content.hero.startLearning.value}
                </button>
                <button className="hero-action-btn hero-action-secondary hover-scale">
                  {content.hero.shareKnowledge.value}
                </button>
              </div>
            </div>
          </section>

          {/* 统计数据 */}
          <section className="stats-section animate-slide-in-bottom delay-600">
            <div className="stats-container">
              <div className="stats-grid">
                <div className="stat-card glass-light hover-lift">
                  <div className="stat-value">1,234</div>
                  <div className="stat-label">{content.stats.knowledge.value}</div>
                </div>
                <div className="stat-card glass-light hover-lift delay-100">
                  <div className="stat-value">5,678</div>
                  <div className="stat-label">{content.stats.users.value}</div>
                </div>
                <div className="stat-card glass-light hover-lift delay-200">
                  <div className="stat-value">98,765</div>
                  <div className="stat-label">{content.stats.views.value}</div>
                </div>
              </div>
            </div>
          </section>

          {/* 功能特性 */}
          <section className="features-section">
            <div className="features-container">
              {/* 区域标题 */}
              <div className="section-header animate-slide-in-bottom delay-700">
                <h2 className="section-title">{content.features.title.value}</h2>
                <p className="section-description">{content.features.description.value}</p>
              </div>

              {/* 功能网格 */}
              <div className="features-grid">
                {/* 知识库 */}
                <div className="feature-card glass-light hover-lift animate-slide-in-bottom delay-800">
                  <div 
                    className="feature-icon-wrapper"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
                  >
                    📚
                  </div>
                  <h3 className="feature-title">{content.features.knowledge.title.value}</h3>
                  <p className="feature-description">{content.features.knowledge.description.value}</p>
                  <div className="feature-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* 智能搜索 */}
                <div className="feature-card glass-light hover-lift animate-slide-in-bottom delay-900">
                  <div 
                    className="feature-icon-wrapper"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    🔍
                  </div>
                  <h3 className="feature-title">{content.features.search.title.value}</h3>
                  <p className="feature-description">{content.features.search.description.value}</p>
                  <div className="feature-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* 个人中心 */}
                <div className="feature-card glass-light hover-lift animate-slide-in-bottom delay-1000">
                  <div 
                    className="feature-icon-wrapper"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                  >
                    👤
                  </div>
                  <h3 className="feature-title">{content.features.profile.title.value}</h3>
                  <p className="feature-description">{content.features.profile.description.value}</p>
                  <div className="feature-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* 社区交流 */}
                <div className="feature-card glass-light hover-lift animate-slide-in-bottom delay-1100">
                  <div 
                    className="feature-icon-wrapper"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                  >
                    👥
                  </div>
                  <h3 className="feature-title">{content.features.community.title.value}</h3>
                  <p className="feature-description">{content.features.community.description.value}</p>
                  <div className="feature-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 推荐内容 */}
          <section className="recommendations-section animate-slide-in-bottom delay-1200">
            <div className="recommendations-container">
              <RecommendationList
                title={content.recommendations.title.value}
                showTabs={true}
                defaultTab="trending"
                limit={8}
                compact={false}
              />
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
