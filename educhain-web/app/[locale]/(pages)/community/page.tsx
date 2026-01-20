'use client';

import { useState } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import Link from 'next/link';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import './page.css';

export default function CommunityPage() {
  const content = useIntlayer('community-page');
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<'hot' | 'new' | 'trending'>('hot');

  // 热门话题数据
  const hotTopics = [
    { name: '前端开发', count: 1234 },
    { name: 'React', count: 892 },
    { name: '后端开发', count: 756 },
    { name: 'TypeScript', count: 645 },
    { name: '算法学习', count: 534 },
    { name: '设计模式', count: 423 },
    { name: '机器学习', count: 389 },
    { name: 'Vue', count: 312 },
  ];

  // 活跃用户数据
  const activeUsers = [
    { id: 1, name: '张三', avatar: '', posts: 156, likes: 2341, level: 'LV.8' },
    { id: 2, name: '李四', avatar: '', posts: 134, likes: 1987, level: 'LV.7' },
    { id: 3, name: '王五', avatar: '', posts: 98, likes: 1654, level: 'LV.6' },
    { id: 4, name: '赵六', avatar: '', posts: 87, likes: 1432, level: 'LV.6' },
  ];

  // 讨论数据
  const discussions = [
    {
      id: 1,
      title: 'React 18 新特性深度解析',
      author: '张三',
      avatar: '',
      replies: 45,
      views: 1234,
      likes: 89,
      time: '2小时前',
      tags: ['React', '前端开发'],
      isHot: true,
    },
    {
      id: 2,
      title: 'TypeScript 类型体操实战技巧',
      author: '李四',
      avatar: '',
      replies: 32,
      views: 987,
      likes: 67,
      time: '5小时前',
      tags: ['TypeScript', '前端开发'],
      isHot: true,
    },
    {
      id: 3,
      title: '如何优雅地处理异步错误？',
      author: '王五',
      avatar: '',
      replies: 28,
      views: 756,
      likes: 54,
      time: '8小时前',
      tags: ['JavaScript', '最佳实践'],
      isHot: false,
    },
    {
      id: 4,
      title: 'Spring Boot 微服务架构设计',
      author: '赵六',
      avatar: '',
      replies: 23,
      views: 645,
      likes: 43,
      time: '1天前',
      tags: ['Spring Boot', '后端开发'],
      isHot: false,
    },
  ];

  // 快速入口
  const quickLinks = [
    { icon: 'book', label: content.linkKnowledge.value, path: '/knowledge' },
    { icon: 'compass', label: content.linkRecommendations.value, path: '/recommendations' },
    { icon: 'search', label: content.linkSearch.value, path: '/search' },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'book':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'compass':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case 'search':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="community-page">
        {/* 背景装饰 */}
        <div className="community-background">
          <div className="community-blob community-blob-1"></div>
          <div className="community-blob community-blob-2"></div>
          <div className="community-blob community-blob-3"></div>
        </div>

        {/* 英雄区域 */}
        <section className="community-hero-section">
          <div className="hero-container container">
            {/* 徽章 */}
            <div className="hero-badge glass-badge motion-scale-in">
              <span>{content.hero.badge.value}</span>
            </div>

            {/* 标题 */}
            <h1 className="hero-title motion-slide-in-up motion-delay-100">
              <span className="hero-title-main text-gradient-purple">
                {content.hero.title.value}
              </span>
              <span className="hero-title-sub">
                {content.hero.subtitle.value}
              </span>
            </h1>

            {/* 描述 */}
            <p className="hero-description motion-slide-in-up motion-delay-150">
              {content.hero.description.value}
            </p>

            {/* 行动按钮 */}
            <div className="hero-actions motion-slide-in-up motion-delay-200">
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="hero-action-btn hero-action-primary motion-hover-lift"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {content.hero.startButton.value}
              </button>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="hero-action-btn hero-action-secondary motion-hover-scale"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {content.hero.exploreButton.value}
              </button>
            </div>

            {/* 统计数据 */}
            <div className="hero-stats motion-slide-in-up motion-delay-250">
              <div className="stat-item glass-light motion-hover-lift">
                <div className="stat-value">12,345</div>
                <div className="stat-label">{content.stats.users.value}</div>
              </div>
              <div className="stat-item glass-light motion-hover-lift motion-delay-100">
                <div className="stat-value">8,976</div>
                <div className="stat-label">{content.stats.discussions.value}</div>
              </div>
              <div className="stat-item glass-light motion-hover-lift motion-delay-200">
                <div className="stat-value">45,892</div>
                <div className="stat-label">{content.stats.replies.value}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="community-container container">
          <div className="community-main">
            {/* 左侧：讨论列表 */}
            <div className="discussions-section">
              {/* 标签页 */}
              <div className="discussions-tabs glass-light motion-slide-in-up motion-delay-300">
                <button
                  className={`tab-item ${activeTab === 'hot' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hot')}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  {content.tabHot}
                </button>
                <button
                  className={`tab-item ${activeTab === 'new' ? 'active' : ''}`}
                  onClick={() => setActiveTab('new')}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {content.tabNew}
                </button>
                <button
                  className={`tab-item ${activeTab === 'trending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('trending')}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {content.tabTrending}
                </button>
              </div>

              {/* 讨论列表 */}
              <div className="discussions-list">
                {discussions.map((discussion, index) => (
                  <div
                    key={discussion.id}
                    className="discussion-item glass-card motion-hover-lift motion-slide-in-up"
                    style={{ animationDelay: `${350 + index * 50}ms` }}
                  >
                    <div className="discussion-header">
                      <div className="author-avatar">
                        {discussion.avatar ? (
                          <img src={discussion.avatar} alt={discussion.author} />
                        ) : (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="discussion-info">
                        <h3 className="discussion-title">
                          {discussion.isHot && (
                            <span className="hot-badge">
                              <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          {discussion.title}
                        </h3>
                        <div className="discussion-meta">
                          <span className="author-name">{discussion.author}</span>
                          <span className="meta-divider">·</span>
                          <span className="discussion-time">{discussion.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="discussion-tags">
                      {discussion.tags.map(tag => (
                        <span key={tag} className="tag glass-badge">{tag}</span>
                      ))}
                    </div>

                    <div className="discussion-stats">
                      <span className="stat">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {discussion.replies}
                      </span>
                      <span className="stat">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {discussion.views}
                      </span>
                      <span className="stat">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {discussion.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 加载更多 */}
              <div className="load-more motion-fade-in motion-delay-550">
                <button className="load-more-btn glass-button motion-hover-scale">
                  {content.loadMore}
                </button>
              </div>
            </div>

            {/* 右侧：侧边栏 */}
            <div className="community-sidebar">
              {/* 热门话题 */}
              <div className="sidebar-card glass-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    {content.hotTopics}
                  </h3>
                </div>
                <div className="topics-list">
                  {hotTopics.map((topic, index) => (
                    <div key={index} className="topic-item glass-light motion-hover-scale">
                      <span className="topic-name">{topic.name}</span>
                      <span className="topic-count">{topic.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 活跃用户 */}
              <div className="sidebar-card glass-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {content.activeUsers}
                  </h3>
                </div>
                <div className="users-list">
                  {activeUsers.map((user, index) => (
                    <div key={user.id} className="user-item glass-light motion-hover-lift">
                      <div className="user-rank">{index + 1}</div>
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-stats">
                          <span className="user-level">{user.level}</span>
                          <span className="user-posts">{user.posts} {content.posts}</span>
                        </div>
                      </div>
                      <div className="user-likes">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {user.likes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 快速入口 */}
              <div className="sidebar-card glass-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {content.quickLinks}
                  </h3>
                </div>
                <div className="quick-links">
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={getLocalizedUrl(link.path, locale)}
                      className="quick-link-btn glass-light motion-hover-lift"
                    >
                      <div className="link-icon">{renderIcon(link.icon)}</div>
                      <span className="link-label">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
