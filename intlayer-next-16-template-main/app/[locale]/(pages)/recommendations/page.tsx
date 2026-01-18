'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import RecommendationList from '../../../../components/RecommendationList/RecommendationList';
import './page.css';

export default function RecommendationPage() {
  const content = useIntlayer('recommendation-page');

  return (
    <>
      <Navbar />

      <div className="recommendation-page">
        {/* 背景装饰 */}
        <div className="recommendation-background">
          <div className="recommendation-blob recommendation-blob-1"></div>
          <div className="recommendation-blob recommendation-blob-2"></div>
          <div className="recommendation-blob recommendation-blob-3"></div>
        </div>

        {/* 英雄区域 */}
        <section className="recommendation-hero-section">
          <div className="hero-container container">
            {/* 徽章 */}
            <div className="hero-badge glass-badge motion-scale-in">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{content.hero.badge.value}</span>
            </div>

            {/* 标题 */}
            <h1 className="hero-title motion-slide-in-up motion-delay-200">
              <span className="hero-title-main text-gradient-orange">
                {content.hero.title.value}
              </span>
              <span className="hero-title-sub">
                {content.hero.subtitle.value}
              </span>
            </h1>

            {/* 描述 */}
            <p className="hero-description motion-slide-in-up motion-delay-300">
              {content.hero.description.value}
            </p>

            {/* 行动按钮 */}
            <div className="hero-actions motion-slide-in-up motion-delay-400">
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="hero-action-btn hero-action-primary motion-hover-lift"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {content.hero.exploreButton.value}
              </button>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="hero-action-btn hero-action-secondary motion-hover-scale"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {content.hero.personalizeButton.value}
              </button>
            </div>

            {/* 特色标签 */}
            <div className="hero-features motion-slide-in-up motion-delay-500">
              <div className="feature-item glass-badge motion-hover-scale">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
                <span>{content.featureHot.value}</span>
              </div>
              <div className="feature-item glass-badge motion-hover-scale">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{content.featureNew.value}</span>
              </div>
              <div className="feature-item glass-badge motion-hover-scale">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>{content.featurePremium.value}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="recommendation-page-container container">
          {/* 页面头部 - 移除，已被hero替代 */}

          {/* 推荐内容区域 */}
          <main className="recommendation-main motion-slide-in-up motion-delay-600">
            <div className="recommendation-card glass-card">
              <RecommendationList
                title=""
                showTabs={true}
                defaultTab="trending"
                limit={20}
                compact={false}
              />
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
