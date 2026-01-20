'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntlayer } from 'next-intlayer';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import { ConfirmDialog, UserCardSkeleton } from '@/../components/common';
import { useAuth } from '@/contexts/auth-context';
import { followService } from '@/services/user';
import { useErrorHandler, useDebounce, useConfirmDialog } from '@/hooks';
import type { UserFollow } from '@/types/api';
import './page.css';

type TabType = 'following' | 'followers';

export default function FollowPage() {
  const content = useIntlayer('follow-page');
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const { dialogState, isLoading: dialogLoading, confirm, handleConfirm, handleCancel } = useConfirmDialog();
  
  // 使用 ref 存储 handleError 避免依赖变化导致无限循环
  const handleErrorRef = useRef(handleError);
  handleErrorRef.current = handleError;
  
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [following, setFollowing] = useState<UserFollow[]>([]);
  const [followers, setFollowers] = useState<UserFollow[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  // 防抖搜索
  const debouncedSearch = useDebounce(searchQuery, 300);

  // 获取关注列表
  useEffect(() => {
    let isMounted = true;
    
    const fetchFollowing = async () => {
      setLoadingFollowing(true);
      try {
        const response = await followService.getFollowing(user?.id);
        if (isMounted && response.success && response.data) {
          setFollowing(response.data.content || []);
        }
      } catch (error) {
        if (isMounted) handleErrorRef.current(error);
      } finally {
        if (isMounted) setLoadingFollowing(false);
      }
    };

    fetchFollowing();
    return () => { isMounted = false; };
  }, [user?.id]);

  // 获取粉丝列表
  useEffect(() => {
    let isMounted = true;
    
    const fetchFollowers = async () => {
      setLoadingFollowers(true);
      try {
        const response = await followService.getFollowers(user?.id);
        if (isMounted && response.success && response.data) {
          setFollowers(response.data.content || []);
        }
      } catch (error) {
        if (isMounted) handleErrorRef.current(error);
      } finally {
        if (isMounted) setLoadingFollowers(false);
      }
    };

    fetchFollowers();
    return () => { isMounted = false; };
  }, [user?.id]);

  // 刷新列表的函数
  const refreshLists = useCallback(async () => {
    try {
      const [followingRes, followersRes] = await Promise.all([
        followService.getFollowing(user?.id),
        followService.getFollowers(user?.id),
      ]);
      if (followingRes.success && followingRes.data) {
        setFollowing(followingRes.data.content || []);
      }
      if (followersRes.success && followersRes.data) {
        setFollowers(followersRes.data.content || []);
      }
    } catch (error) {
      handleError(error);
    }
  }, [user?.id, handleError]);

  // 过滤列表
  const currentList = activeTab === 'following' ? following : followers;
  const isLoading = activeTab === 'following' ? loadingFollowing : loadingFollowers;
  
  const filteredList = useMemo(() => {
    if (!debouncedSearch.trim()) return currentList;
    const query = debouncedSearch.toLowerCase();
    return currentList.filter(item =>
      item.user.fullName?.toLowerCase().includes(query) ||
      item.user.bio?.toLowerCase().includes(query) ||
      item.user.username?.toLowerCase().includes(query)
    );
  }, [currentList, debouncedSearch]);

  // 关注/取消关注
  const handleToggleFollow = useCallback(async (userId: number, isFollowing: boolean) => {
    // 如果是取消关注，显示确认对话框
    if (isFollowing) {
      const confirmed = await confirm({
        title: String(content.confirmUnfollow.title),
        message: String(content.confirmUnfollow.message),
        confirmText: String(content.confirmUnfollow.confirm),
        cancelText: String(content.confirmUnfollow.cancel),
        variant: 'warning',
      });
      if (!confirmed) return;
    }

    setProcessingIds(prev => new Set(prev).add(userId));
    
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId);
        handleSuccess(String(content.messages.unfollowSuccess));
      } else {
        await followService.followUser(userId);
        handleSuccess(String(content.messages.followSuccess));
      }
      // 刷新列表
      refreshLists();
    } catch (error) {
      handleError(error);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  }, [confirm, content, handleSuccess, handleError, refreshLists]);

  // 获取按钮样式
  const getFollowButtonClass = useCallback((item: UserFollow) => {
    if (item.isMutual) return 'follow-btn mutual';
    if (item.isFollowing) return 'follow-btn following';
    return 'follow-btn follow';
  }, []);

  // 获取按钮文本
  const getFollowButtonText = useCallback((item: UserFollow) => {
    if (item.isMutual) return content.mutual;
    if (item.isFollowing) return content.unfollow;
    return content.follow;
  }, [content]);

  // 获取按钮 aria-label
  const getFollowButtonAriaLabel = useCallback((item: UserFollow) => {
    if (item.isFollowing) {
      return `${String(content.aria.unfollowButton)} ${item.user.fullName}`;
    }
    return `${String(content.aria.followButton)} ${item.user.fullName}`;
  }, [content.aria]);

  return (
    <>
      <Navbar />
      <main className="follow-page">
        <div className="page-content">
          <header className="follow-header">
            <h1 className="follow-title">
              {activeTab === 'following' ? content.followingTitle : content.followersTitle}
            </h1>
            <p className="follow-subtitle">
              {activeTab === 'following' ? content.followingSubtitle : content.followersSubtitle}
            </p>
          </header>

          <div className="follow-toolbar">
            <nav 
              className="follow-tabs glass-light" 
              role="tablist" 
              aria-label={String(content.aria.tabNavigation)}
            >
              <button 
                role="tab"
                aria-selected={activeTab === 'following'}
                aria-controls="panel-following"
                className={`tab-button ${activeTab === 'following' ? 'active' : ''}`} 
                onClick={() => setActiveTab('following')}
              >
                {content.following}
                <span className="tab-count" aria-label={`${following.length}`}>
                  {following.length}
                </span>
              </button>
              <button 
                role="tab"
                aria-selected={activeTab === 'followers'}
                aria-controls="panel-followers"
                className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`} 
                onClick={() => setActiveTab('followers')}
              >
                {content.followers}
                <span className="tab-count" aria-label={`${followers.length}`}>
                  {followers.length}
                </span>
              </button>
            </nav>

            <div className="search-wrapper">
              <span className="search-icon" aria-hidden="true">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={String(content.searchPlaceholder)}
                className="search-input"
                aria-label={String(content.aria.searchInput)}
              />
            </div>
          </div>

          {/* 用户列表 */}
          <div 
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {isLoading ? (
              <div className="follow-list" role="status" aria-label={String(content.aria.userList)}>
                {[1, 2, 3, 4].map((i) => <UserCardSkeleton key={i} />)}
              </div>
            ) : filteredList.length > 0 ? (
              <ul className="follow-list" role="list" aria-label={String(content.aria.userList)}>
                {filteredList.map((item) => (
                  <li key={item.user.id} className="user-card glass-card">
                    {item.user.avatarUrl ? (
                      <img 
                        src={item.user.avatarUrl} 
                        alt={`${item.user.fullName} ${String(content.aria.userAvatar)}`}
                        className="user-avatar"
                        loading="lazy"
                      />
                    ) : (
                      <div className="user-avatar-placeholder" aria-hidden="true">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}

                    <div className="user-info">
                      <h3 className="user-name">{item.user.fullName}</h3>
                      <p className="user-bio">{item.user.bio || String(content.noBio)}</p>
                      <div className="user-stats">
                        <span className="user-stat">
                          <strong>{item.user.knowledgeCount || 0}</strong> {content.posts}
                        </span>
                        <span className="user-stat">
                          <strong>{item.user.followerCount || 0}</strong> {content.followersCount}
                        </span>
                      </div>
                    </div>

                    <button
                      className={getFollowButtonClass(item)}
                      onClick={() => handleToggleFollow(item.user.id, item.isFollowing)}
                      disabled={processingIds.has(item.user.id)}
                      aria-label={getFollowButtonAriaLabel(item)}
                      aria-busy={processingIds.has(item.user.id)}
                    >
                      {processingIds.has(item.user.id) ? (
                        <span className="loading-spinner-small" aria-hidden="true" />
                      ) : (
                        <>
                          {item.isMutual && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          )}
                          {getFollowButtonText(item)}
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="follow-empty glass-card" role="status">
                <div className="empty-icon" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="empty-title">
                  {debouncedSearch 
                    ? content.noSearchResults 
                    : (activeTab === 'following' ? content.noFollowing : content.noFollowers)
                  }
                </h3>
                <p className="empty-description">
                  {!debouncedSearch && (activeTab === 'following' ? content.noFollowingDesc : content.noFollowersDesc)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 确认对话框 */}
        <ConfirmDialog
          state={dialogState}
          isLoading={dialogLoading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </main>
      <Footer />
    </>
  );
}
