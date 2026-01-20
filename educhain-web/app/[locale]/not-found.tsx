'use client';

import { useIntlayer, useLocale } from 'next-intlayer';
import { useRouter } from 'next/navigation';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import './not-found.css';

export default function NotFound() {
  const content = useIntlayer('not-found-page');
  const { locale } = useLocale();
  const router = useRouter();

  const handleGoHome = () => {
    router.push(getLocalizedUrl('/', locale));
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="not-found-page">
      {/* 动态背景 */}
      <div className="not-found-background">
        <div className="not-found-blob not-found-blob-1" />
        <div className="not-found-blob not-found-blob-2" />
        <div className="not-found-blob not-found-blob-3" />
      </div>

      {/* 主要内容 */}
      <div className="not-found-content">
        {/* 404 大号数字 */}
        <div className="not-found-number motion-scale-in">
          <span className="number-digit">4</span>
          <span className="number-digit number-digit-middle">0</span>
          <span className="number-digit">4</span>
        </div>

        {/* 图标装饰 */}
        <div className="not-found-icon-wrapper motion-fade-in motion-delay-100">
          <div className="not-found-icon glass-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* 文字说明 */}
        <div className="not-found-text motion-slide-in-up motion-delay-150">
          <h1 className="not-found-title">{content.title}</h1>
          <p className="not-found-description">{content.description}</p>
        </div>

        {/* 操作按钮 */}
        <div className="not-found-actions motion-slide-in-up motion-delay-200">
          <button 
            onClick={handleGoHome}
            className="not-found-btn not-found-btn-primary motion-hover-lift"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            <span>{content.goHome}</span>
          </button>
          <button 
            onClick={handleGoBack}
            className="not-found-btn not-found-btn-secondary glass-button motion-hover-scale"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            <span>{content.goBack}</span>
          </button>
        </div>

        {/* 推荐链接 */}
        <div className="not-found-suggestions motion-fade-in motion-delay-300">
          <p className="suggestions-title">{content.suggestionsTitle}</p>
          <div className="suggestions-grid">
            <a 
              href={getLocalizedUrl('/knowledge', locale)} 
              className="suggestion-card glass-card motion-hover-lift"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
              <span>{content.exploreKnowledge}</span>
            </a>
            <a 
              href={getLocalizedUrl('/search', locale)} 
              className="suggestion-card glass-card motion-hover-lift"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span>{content.searchContent}</span>
            </a>
            <a 
              href={getLocalizedUrl('/community', locale)} 
              className="suggestion-card glass-card motion-hover-lift"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span>{content.visitCommunity}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
