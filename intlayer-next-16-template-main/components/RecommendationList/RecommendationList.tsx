'use client';

import { useState, useEffect } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import Link from 'next/link';
import { searchService } from '../../src/services/search';
import type { KnowledgeItem } from '../../src/types/api';
import './RecommendationList.css';

interface RecommendationListProps {
  title?: string;
  showTabs?: boolean;
  defaultTab?: 'trending' | 'personalized' | 'general';
  limit?: number;
  compact?: boolean;
  className?: string;
}

export default function RecommendationList({
  title,
  showTabs = true,
  defaultTab = 'trending',
  limit = 8,
  compact = false,
  className = '',
}: RecommendationListProps) {
  const content = useIntlayer('recommendation-list');
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [feedbackLoading, setFeedbackLoading] = useState<number | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, string>>({});
  const [data, setData] = useState<{
    personalized: KnowledgeItem[];
    trending: KnowledgeItem[];
    general: KnowledgeItem[];
  }>({
    personalized: [],
    trending: [],
    general: [],
  });

  useEffect(() => {
    loadRecommendations();
  }, [limit]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    try {
      const promises = [
        searchService.getPersonalizedRecommendations(limit),
        searchService.getTrendingContent('week', limit),
        searchService.getRecommendations(undefined, limit),
      ];

      const [personalizedRes, trendingRes, generalRes] = await Promise.all(promises);

      setData({
        personalized: personalizedRes.data || [],
        trending: trendingRes.data || [],
        general: generalRes.data || [],
      });
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // 失败时设置空数据
      setData({
        personalized: [],
        trending: [],
        general: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getReasonText = (tab: string, index: number) => {
    const reasons = {
      personalized: [
        content.reasonPersonalized1.value,
        content.reasonPersonalized2.value,
        content.reasonPersonalized3.value,
        content.reasonPersonalized4.value,
        content.reasonPersonalized5.value,
      ],
      trending: [
        content.reasonTrending1.value,
        content.reasonTrending2.value,
        content.reasonTrending3.value,
        content.reasonTrending4.value,
        content.reasonTrending5.value,
      ],
      general: [
        content.reasonGeneral1.value,
        content.reasonGeneral2.value,
        content.reasonGeneral3.value,
        content.reasonGeneral4.value,
        content.reasonGeneral5.value,
      ],
    };

    const tabReasons = reasons[tab as keyof typeof reasons] || reasons.general;
    return tabReasons[index % tabReasons.length];
  };

  const handleRefresh = () => {
    const currentTabData = data[activeTab];
    if (currentTabData.length > 0) {
      const itemsPerPage = typeof window !== 'undefined' && window.innerWidth >= 768 ? 4 : 1;
      const totalPages = Math.ceil(currentTabData.length / itemsPerPage);
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else {
      loadRecommendations();
    }
  };

  const handleFeedback = async (itemId: number, feedback: 'like' | 'dislike' | 'not_interested') => {
    setFeedbackLoading(itemId);
    try {
      await searchService.submitRecommendationFeedback(itemId, feedback);
      setFeedbackGiven(prev => ({ ...prev, [itemId]: feedback }));
      
      // 如果是"不感兴趣"，1秒后从列表中移除
      if (feedback === 'not_interested') {
        setTimeout(() => {
          setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== itemId),
          }));
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setFeedbackLoading(null);
    }
  };

  const renderContent = (items: KnowledgeItem[], tabKey: string) => {
    if (loading) {
      return (
        <div className="recommendation-loading">
          <div className="loading-spinner"></div>
          <p>{content.loading.value}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="recommendation-empty">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>{content.empty.value}</p>
        </div>
      );
    }

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const itemsPerPage = isDesktop ? 4 : 1;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return (
      <div className="recommendation-grid">
        {currentItems.map((item, index) => {
          const hasFeedback = feedbackGiven[item.id];
          
          return (
            <div key={item.id} className={`recommendation-card glass-light hover-lift ${hasFeedback ? 'has-feedback' : ''}`}>
              <div className="card-reason">
                <span className="reason-badge">{getReasonText(tabKey, startIndex + index)}</span>
              </div>

              <Link href={getLocalizedUrl(`/knowledge/${item.shareCode}`, locale)} className="card-link">
                <div className="card-header">
                  <h3 className="card-title">{item.title}</h3>
                  <div className="card-tags">
                    <span className={`type-tag type-${(item.type || 'TEXT').toLowerCase()}`}>{item.type || 'TEXT'}</span>
                    {item.tags.split(',').slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="tag">{tag.trim()}</span>
                    ))}
                  </div>
                </div>

                {!compact && (
                  <div className="card-content">
                    <p>{item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}</p>
                  </div>
                )}

                <div className="card-footer">
                  <div className="author-info">
                    <div className="author-avatar">
                      {item.uploaderAvatar ? (
                        <img src={item.uploaderAvatar} alt={item.uploaderName} />
                      ) : (
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="author-details">
                      <span className="author-name">{item.uploaderName}</span>
                      <span className="publish-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="card-stats">
                    <span className="stat">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.stats?.viewCount || 0}
                    </span>
                    <span className="stat">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {item.stats?.likeCount || 0}
                    </span>
                    <span className="stat">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {item.stats?.commentCount || 0}
                    </span>
                  </div>
                </div>
              </Link>

              {/* 反馈按钮 */}
              {!hasFeedback && (
                <div className="card-actions">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFeedback(item.id, 'like');
                    }}
                    disabled={feedbackLoading === item.id}
                    className="action-btn action-like"
                    title={content.feedbackLike?.value || '喜欢'}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFeedback(item.id, 'dislike');
                    }}
                    disabled={feedbackLoading === item.id}
                    className="action-btn action-dislike"
                    title={content.feedbackDislike?.value || '不喜欢'}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFeedback(item.id, 'not_interested');
                    }}
                    disabled={feedbackLoading === item.id}
                    className="action-btn action-remove"
                    title={content.feedbackNotInterested?.value || '不感兴趣'}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* 反馈状态 */}
              {hasFeedback && (
                <div className="feedback-status">
                  {hasFeedback === 'like' && '👍 ' + (content.feedbackLiked?.value || '已标记为喜欢')}
                  {hasFeedback === 'dislike' && '👎 ' + (content.feedbackDisliked?.value || '已标记为不喜欢')}
                  {hasFeedback === 'not_interested' && '❌ ' + (content.feedbackRemoved?.value || '已标记为不感兴趣')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`recommendation-list ${className}`}>
      <div className="recommendation-header">
        <h2 className="recommendation-title">{title || content.title.value}</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="refresh-btn glass-button hover-scale"
        >
          <svg className={loading ? 'animate-spin' : ''} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{content.refresh.value}</span>
        </button>
      </div>

      {showTabs ? (
        <div className="recommendation-tabs">
          <div className="tabs-nav">
            <button
              className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('trending');
                setCurrentPage(0);
              }}
            >
              {content.tabTrending.value}
            </button>
            <button
              className={`tab-btn ${activeTab === 'personalized' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('personalized');
                setCurrentPage(0);
              }}
            >
              {content.tabPersonalized.value}
            </button>
            <button
              className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('general');
                setCurrentPage(0);
              }}
            >
              {content.tabGeneral.value}
            </button>
          </div>

          <div className="tabs-content">
            {renderContent(data[activeTab], activeTab)}
          </div>
        </div>
      ) : (
        <div className="recommendation-content">
          {renderContent(data[activeTab], activeTab)}
        </div>
      )}

      {!loading && data[activeTab].length > 0 && (
        <div className="recommendation-footer">
          <p className="footer-text">{content.footer.value}</p>
        </div>
      )}
    </div>
  );
}
