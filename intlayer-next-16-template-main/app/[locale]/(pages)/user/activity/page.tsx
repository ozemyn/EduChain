'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntlayer } from 'next-intlayer';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import { ActivitySkeleton } from '@/../components/common';
import { useAuth } from '@/contexts/auth-context';
import { interactionService } from '@/services/interaction';
import { useErrorHandler } from '@/hooks';
import { formatRelativeTimeI18n, type RelativeTimeUnits } from '@/lib/time';
import type { Activity } from '@/types/api';
import './page.css';

export default function ActivityPage() {
  const content = useIntlayer('activity-page');
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  
  // 使用 ref 存储 handleError 避免依赖变化导致无限循环
  const handleErrorRef = useRef(handleError);
  handleErrorRef.current = handleError;
  
  const [followingActivities, setFollowingActivities] = useState<Activity[]>([]);
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [loadingMy, setLoadingMy] = useState(true);
  const [loadingMoreFollowing, setLoadingMoreFollowing] = useState(false);
  const [loadingMoreMy, setLoadingMoreMy] = useState(false);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [hasMoreMy, setHasMoreMy] = useState(true);
  const [pageFollowing, setPageFollowing] = useState(0);
  const [pageMy, setPageMy] = useState(0);

  // 时间单位国际化
  const timeUnits: RelativeTimeUnits = useMemo(() => ({
    justNow: String(content.timeUnits.justNow),
    minutesAgo: String(content.timeUnits.minutesAgo),
    hoursAgo: String(content.timeUnits.hoursAgo),
    daysAgo: String(content.timeUnits.daysAgo),
    weeksAgo: String(content.timeUnits.weeksAgo),
    monthsAgo: String(content.timeUnits.monthsAgo),
    yearsAgo: String(content.timeUnits.yearsAgo),
  }), [content.timeUnits]);

  // 获取关注动态
  useEffect(() => {
    let isMounted = true;
    
    const fetchFollowingActivities = async () => {
      setLoadingFollowing(true);
      try {
        const response = await interactionService.getFollowingActivities({ page: 0, size: 10 });
        if (isMounted && response.success && response.data) {
          setFollowingActivities(response.data.content || []);
          setHasMoreFollowing(!response.data.last);
          setPageFollowing(0);
        }
      } catch (error) {
        if (isMounted) handleErrorRef.current(error);
      } finally {
        if (isMounted) setLoadingFollowing(false);
      }
    };

    fetchFollowingActivities();
    return () => { isMounted = false; };
  }, []);

  // 获取我的动态
  useEffect(() => {
    let isMounted = true;
    
    const fetchMyActivities = async () => {
      if (!user?.id) return;
      setLoadingMy(true);
      try {
        const response = await interactionService.getUserActivities(user.id, { page: 0, size: 10 });
        if (isMounted && response.success && response.data) {
          setMyActivities(response.data.content || []);
          setHasMoreMy(!response.data.last);
          setPageMy(0);
        }
      } catch (error) {
        if (isMounted) handleErrorRef.current(error);
      } finally {
        if (isMounted) setLoadingMy(false);
      }
    };

    fetchMyActivities();
    return () => { isMounted = false; };
  }, [user?.id]);

  // 刷新关注动态
  const handleRefreshFollowing = useCallback(async () => {
    setLoadingFollowing(true);
    try {
      const response = await interactionService.getFollowingActivities({ page: 0, size: 10 });
      if (response.success && response.data) {
        setFollowingActivities(response.data.content || []);
        setHasMoreFollowing(!response.data.last);
        setPageFollowing(0);
      }
      handleSuccess(String(content.messages.refreshSuccess));
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingFollowing(false);
    }
  }, [handleSuccess, handleError, content.messages.refreshSuccess]);

  // 加载更多关注动态
  const handleLoadMoreFollowing = useCallback(async () => {
    if (loadingMoreFollowing || !hasMoreFollowing) return;
    setLoadingMoreFollowing(true);
    try {
      const nextPage = pageFollowing + 1;
      const response = await interactionService.getFollowingActivities({ page: nextPage, size: 10 });
      if (response.success && response.data) {
        setFollowingActivities(prev => [...prev, ...(response.data?.content || [])]);
        setHasMoreFollowing(!response.data.last);
        setPageFollowing(nextPage);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingMoreFollowing(false);
    }
  }, [loadingMoreFollowing, hasMoreFollowing, pageFollowing, handleError]);

  // 加载更多我的动态
  const handleLoadMoreMy = useCallback(async () => {
    if (loadingMoreMy || !hasMoreMy || !user?.id) return;
    setLoadingMoreMy(true);
    try {
      const nextPage = pageMy + 1;
      const response = await interactionService.getUserActivities(user.id, { page: nextPage, size: 10 });
      if (response.success && response.data) {
        setMyActivities(prev => [...prev, ...(response.data?.content || [])]);
        setHasMoreMy(!response.data.last);
        setPageMy(nextPage);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingMoreMy(false);
    }
  }, [loadingMoreMy, hasMoreMy, pageMy, user?.id, handleError]);

  // 格式化时间
  const formatTime = useCallback((dateStr: string) => {
    return formatRelativeTimeI18n(dateStr, timeUnits);
  }, [timeUnits]);

  // 获取动态图标
  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case 'publish':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'like':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'comment':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'follow':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      default:
        return null;
    }
  }, []);

  // 渲染时间线
  const renderTimeline = useCallback((
    activities: Activity[],
    isLoading: boolean,
    isLoadingMore: boolean,
    hasMore: boolean,
    onLoadMore: () => void,
    emptyTitle: string,
    emptyDesc: string
  ) => (
    <>
      {isLoading ? (
        <div className="activity-skeleton-list" role="status" aria-label={String(content.aria.activityList)}>
          {[1, 2, 3, 4].map((i) => <ActivitySkeleton key={i} />)}
        </div>
      ) : activities.length > 0 ? (
        <div className="activity-timeline" role="feed" aria-label={String(content.aria.activityList)}>
          {activities.map((activity) => (
            <article key={activity.id} className="timeline-item glass-light">
              {activity.user?.avatarUrl ? (
                <img 
                  src={activity.user.avatarUrl} 
                  alt=""
                  className="timeline-avatar"
                  loading="lazy"
                />
              ) : (
                <div className="timeline-avatar-placeholder" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="timeline-content">
                <p className="timeline-text">
                  <strong>{activity.user?.fullName || String(content.unknownUser)}</strong>
                  {' '}{activity.content}
                  {activity.targetTitle && <> {activity.targetTitle}</>}
                </p>
                <div className="timeline-meta">
                  <time 
                    className="timeline-time" 
                    dateTime={activity.createdAt}
                    aria-label={String(content.aria.activityTime)}
                  >
                    {formatTime(activity.createdAt)}
                  </time>
                  <span className={`timeline-type ${activity.type}`} aria-hidden="true">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
              </div>
            </article>
          ))}
          {hasMore && (
            <button 
              className="load-more-btn"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              aria-label={String(content.aria.loadMoreButton)}
              aria-busy={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <span className="loading-spinner-small" aria-hidden="true" />
                  {content.loadingMore}
                </>
              ) : (
                <>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {content.loadMore}
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="activity-empty" role="status">
          <div className="empty-icon" aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="empty-title">{emptyTitle}</h3>
          <p className="empty-description">{emptyDesc}</p>
        </div>
      )}
    </>
  ), [content, formatTime, getActivityIcon]);

  return (
    <>
      <Navbar />
      <main className="activity-page">
        <div className="activity-content">
          <header className="activity-header">
            <h1 className="activity-title">{content.title}</h1>
            <p className="activity-subtitle">{content.subtitle}</p>
          </header>

          <div className="activity-grid">
            {/* 关注动态 */}
            <section className="activity-section" aria-labelledby="following-title">
              <div className="activity-card glass-card">
                <div className="activity-card-header">
                  <h2 id="following-title" className="activity-card-title">
                    {content.followingActivity}
                  </h2>
                  <button 
                    className="refresh-btn" 
                    onClick={handleRefreshFollowing}
                    disabled={loadingFollowing}
                    aria-label={String(content.aria.refreshButton)}
                  >
                    <svg 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      aria-hidden="true"
                      className={loadingFollowing ? 'spinning' : ''}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {content.refresh}
                  </button>
                </div>
                {renderTimeline(
                  followingActivities,
                  loadingFollowing,
                  loadingMoreFollowing,
                  hasMoreFollowing,
                  handleLoadMoreFollowing,
                  String(content.noActivity),
                  String(content.noActivityDesc)
                )}
              </div>
            </section>

            {/* 我的动态 */}
            <section className="activity-section" aria-labelledby="my-activity-title">
              <div className="activity-card glass-card">
                <div className="activity-card-header">
                  <h2 id="my-activity-title" className="activity-card-title">
                    {content.myActivity}
                  </h2>
                </div>
                {renderTimeline(
                  myActivities,
                  loadingMy,
                  loadingMoreMy,
                  hasMoreMy,
                  handleLoadMoreMy,
                  String(content.noMyActivity),
                  String(content.noMyActivityDesc)
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
