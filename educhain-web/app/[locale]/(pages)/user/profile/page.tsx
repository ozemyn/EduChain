'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntlayer } from 'next-intlayer';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import { ConfirmDialog, ProfileHeaderSkeleton, StatCardSkeleton } from '@/../components/common';
import { useAuth } from '@/contexts/auth-context';
import { userService } from '@/services/user';
import { authService } from '@/services/auth';
import { useErrorHandler, useConfirmDialog, useUnsavedChanges } from '@/hooks';
import { formatRelativeTimeI18n, type RelativeTimeUnits } from '@/lib/time';
import type { UserStats } from '@/types/api';
import './page.css';

type TabType = 'overview' | 'stats' | 'settings';

interface PasswordStrength {
  minLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export default function ProfilePage() {
  const content = useIntlayer('profile-page');
  const { user, updateUser } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const { dialogState, isLoading: dialogLoading, confirm, handleConfirm, handleCancel } = useConfirmDialog();

  // 使用 ref 存储 handleError 避免依赖变化导致无限循环
  const handleErrorRef = useRef(handleError);
  handleErrorRef.current = handleError;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', school: '', bio: '' });
  const [originalFormData, setOriginalFormData] = useState({ fullName: '', email: '', school: '', bio: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  // 检测表单是否有更改
  const hasFormChanges = useMemo(() => {
    return editMode && (
      formData.fullName !== originalFormData.fullName ||
      formData.school !== originalFormData.school ||
      formData.bio !== originalFormData.bio
    );
  }, [editMode, formData, originalFormData]);

  // 未保存更改提示
  useUnsavedChanges(hasFormChanges, String(content.messages.unsavedChanges));

  // 密码强度检测
  const passwordStrength: PasswordStrength = useMemo(() => ({
    minLength: passwordData.newPassword.length >= 8,
    hasLowercase: /[a-z]/.test(passwordData.newPassword),
    hasUppercase: /[A-Z]/.test(passwordData.newPassword),
    hasNumber: /\d/.test(passwordData.newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword),
  }), [passwordData.newPassword]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordStrength).every(Boolean) &&
      passwordData.newPassword === passwordData.confirmPassword &&
      passwordData.currentPassword.length > 0;
  }, [passwordStrength, passwordData]);

  // 获取用户统计数据
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserStats = async () => {
      if (!user) return;
      setStatsLoading(true);
      try {
        const response = await userService.getCurrentUserStats();
        if (isMounted && response.success && response.data) {
          setUserStats(response.data);
        }
      } catch (error) {
        if (isMounted) handleErrorRef.current(error);
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    };

    fetchUserStats();
    return () => { isMounted = false; };
  }, [user]);

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      const data = {
        fullName: user.fullName || '',
        email: user.email || '',
        school: user.school || '',
        bio: user.bio || '',
      };
      setFormData(data);
      setOriginalFormData(data);
    }
  }, [user]);

  // 表单验证
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = String(content.validation.fullNameRequired);
    } else if (formData.fullName.length > 50) {
      errors.fullName = String(content.validation.fullNameTooLong);
    }
    
    if (formData.bio.length > 200) {
      errors.bio = String(content.validation.bioTooLong);
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, content.validation]);

  // 密码表单验证
  const validatePasswordForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = String(content.validation.currentPasswordRequired);
    }
    if (!passwordData.newPassword) {
      errors.newPassword = String(content.validation.newPasswordRequired);
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = String(content.validation.confirmPasswordRequired);
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = String(content.passwordMismatch);
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordData, content.validation, content.passwordMismatch]);

  // 更新个人信息
  const handleUpdateProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;
    
    setLoading(true);
    try {
      const response = await userService.updateProfile({
        fullName: formData.fullName.trim(),
        school: formData.school.trim(),
        bio: formData.bio.trim(),
      });
      if (response.success && response.data) {
        updateUser(response.data);
        setOriginalFormData(formData);
        setEditMode(false);
        handleSuccess(String(content.messages.profileUpdateSuccess));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [user, formData, validateForm, updateUser, handleSuccess, handleError, content.messages.profileUpdateSuccess]);

  // 取消编辑
  const handleCancelEdit = useCallback(async () => {
    if (hasFormChanges) {
      const confirmed = await confirm({
        title: String(content.messages.unsavedChanges),
        message: String(content.messages.unsavedChanges),
        confirmText: String(content.confirm),
        cancelText: String(content.cancel),
        variant: 'warning',
      });
      if (!confirmed) return;
    }
    setFormData(originalFormData);
    setFormErrors({});
    setEditMode(false);
  }, [hasFormChanges, originalFormData, confirm, content]);

  // 修改密码
  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm() || !isPasswordValid) return;
    
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      setPasswordModalVisible(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setFormErrors({});
      handleSuccess(String(content.messages.passwordChangeSuccess));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [validatePasswordForm, isPasswordValid, passwordData, handleSuccess, handleError, content.messages.passwordChangeSuccess]);

  // 关闭密码弹窗
  const handleClosePasswordModal = useCallback(() => {
    setPasswordModalVisible(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setFormErrors({});
  }, []);

  // 格式化时间
  const formatTime = useCallback((dateStr: string) => {
    return formatRelativeTimeI18n(dateStr, timeUnits);
  }, [timeUnits]);

  // 加载状态
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div className="profile-content">
            <ProfileHeaderSkeleton />
            <section className="profile-stats-section">
              <div className="stats-grid">
                {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-background">
          <div className="profile-blob profile-blob-1" />
          <div className="profile-blob profile-blob-2" />
          <div className="profile-blob profile-blob-3" />
        </div>

        <div className="page-content">
          {/* 个人资料头部 */}
          <section className="profile-header glass-card" aria-label={String(content.aria.profileAvatar)}>
            <div className="profile-header-grid">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={`${user.fullName} ${String(content.aria.profileAvatar)}`}
                      className="profile-avatar"
                      loading="lazy"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder" aria-hidden="true">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-user-info">
                <h1 className="profile-name">{user.fullName}</h1>
                <p className="profile-username">@{user.username}</p>
                <div className="profile-badges">
                  <span className="profile-badge" role="status">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>{content.level} {user.level || 1}</span>
                  </span>
                  {user.role === 'ADMIN' && (
                    <span className="profile-badge admin-badge" role="status">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>{content.admin}</span>
                    </span>
                  )}
                </div>
                <p className="profile-bio">{user.bio || String(content.noBio)}</p>
                <div className="profile-meta">
                  <div className="profile-meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{user.email}</span>
                  </div>
                  {user.school && (
                    <div className="profile-meta-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{user.school}</span>
                    </div>
                  )}
                  <div className="profile-meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{content.joinedAt} {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  className="action-button" 
                  onClick={() => setActiveTab('settings')}
                  aria-label={String(content.aria.editProfileButton)}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {content.editProfile}
                </button>
                <button 
                  className="action-button" 
                  onClick={() => setPasswordModalVisible(true)}
                  aria-label={String(content.aria.changePasswordButton)}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {content.changePassword}
                </button>
              </div>
            </div>
          </section>

          {/* 统计数据卡片 */}
          <section className="profile-stats-section" aria-label={String(content.aria.statsSection)}>
            {statsLoading ? (
              <div className="stats-grid">
                {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
              </div>
            ) : userStats && (
              <div className="stats-grid">
                <div className="stat-card glass-card">
                  <div className="stat-icon stat-icon-primary" aria-hidden="true">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="stat-value">{userStats.knowledgeCount}</p>
                  <p className="stat-label">{content.publishedContent}</p>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon stat-icon-success" aria-hidden="true">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="stat-value">{userStats.likeCount}</p>
                  <p className="stat-label">{content.receivedLikes}</p>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon stat-icon-warning" aria-hidden="true">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="stat-value">{userStats.viewCount}</p>
                  <p className="stat-label">{content.totalViews}</p>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon stat-icon-info" aria-hidden="true">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="stat-value">{userStats.followerCount}</p>
                  <p className="stat-label">{content.followers}</p>
                </div>
              </div>
            )}
          </section>

          {/* 标签页导航 */}
          <section className="profile-tabs-section">
            <nav className="profile-tabs glass-light" role="tablist" aria-label={String(content.aria.tabNavigation)}>
              <button 
                role="tab"
                aria-selected={activeTab === 'overview'}
                aria-controls="panel-overview"
                className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`} 
                onClick={() => setActiveTab('overview')}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{content.tabOverview}</span>
              </button>
              <button 
                role="tab"
                aria-selected={activeTab === 'stats'}
                aria-controls="panel-stats"
                className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`} 
                onClick={() => setActiveTab('stats')}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>{content.tabStats}</span>
              </button>
              <button 
                role="tab"
                aria-selected={activeTab === 'settings'}
                aria-controls="panel-settings"
                className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`} 
                onClick={() => setActiveTab('settings')}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{content.tabSettings}</span>
              </button>
            </nav>
          </section>

          {/* 内容区域 */}
          <section className="profile-content-section">
            {/* 概览面板 */}
            {activeTab === 'overview' && (
              <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className="profile-overview glass-card">
                <h2 className="section-title">{content.overviewTitle}</h2>
                <div className="overview-grid">
                  <div className="overview-item">
                    <h3>{content.learningProgress}</h3>
                    <div className="progress-list">
                      <div className="progress-item">
                        <span>{content.knowledgeMastery}</span>
                        <div className="progress-bar" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
                          <div className="progress-fill progress-fill-primary" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div className="progress-item">
                        <span>{content.activityLevel}</span>
                        <div className="progress-bar" role="progressbar" aria-valuenow={88} aria-valuemin={0} aria-valuemax={100}>
                          <div className="progress-fill progress-fill-success" style={{ width: '88%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overview-item">
                    <h3>{content.recentActivity}</h3>
                    <div className="activity-list">
                      <div className="activity-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{content.publishedNewContent}</span>
                        <time dateTime={new Date(Date.now() - 2 * 3600000).toISOString()}>
                          {formatTime(new Date(Date.now() - 2 * 3600000).toISOString())}
                        </time>
                      </div>
                      <div className="activity-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{content.receivedLikesActivity}</span>
                        <time dateTime={new Date(Date.now() - 24 * 3600000).toISOString()}>
                          {formatTime(new Date(Date.now() - 24 * 3600000).toISOString())}
                        </time>
                      </div>
                      <div className="activity-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{content.newFollowers}</span>
                        <time dateTime={new Date(Date.now() - 48 * 3600000).toISOString()}>
                          {formatTime(new Date(Date.now() - 48 * 3600000).toISOString())}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 统计面板 */}
            {activeTab === 'stats' && userStats && (
              <div id="panel-stats" role="tabpanel" aria-labelledby="tab-stats" className="profile-stats-detail glass-card">
                <h2 className="section-title">{content.detailedStats}</h2>
                <div className="stats-detail-grid">
                  <div className="stats-category">
                    <h3>{content.contentStats}</h3>
                    <div className="stats-items">
                      <div className="stats-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{content.publishedContent}</span>
                        <strong>{userStats.knowledgeCount}</strong>
                      </div>
                      <div className="stats-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{content.totalViews}</span>
                        <strong>{userStats.viewCount}</strong>
                      </div>
                      <div className="stats-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{content.receivedLikes}</span>
                        <strong>{userStats.likeCount}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="stats-category">
                    <h3>{content.socialStats}</h3>
                    <div className="stats-items">
                      <div className="stats-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{content.followers}</span>
                        <strong>{userStats.followerCount}</strong>
                      </div>
                      <div className="stats-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{content.following}</span>
                        <strong>{userStats.followingCount}</strong>
                      </div>
                      <div className="stats-item glass-light">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span>{content.favorites}</span>
                        <strong>{userStats.favoriteCount}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 设置面板 */}
            {activeTab === 'settings' && (
              <div id="panel-settings" role="tabpanel" aria-labelledby="tab-settings" className="profile-settings glass-card">
                <h2 className="section-title">{content.settingsTitle}</h2>
                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="profile-form" noValidate>
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">{content.fullName}</label>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={String(content.fullNamePlaceholder)}
                        className={`form-input ${formErrors.fullName ? 'error' : ''}`}
                        aria-invalid={!!formErrors.fullName}
                        aria-describedby={formErrors.fullName ? 'fullName-error' : undefined}
                        maxLength={50}
                        autoComplete="name"
                      />
                      {formErrors.fullName && (
                        <span id="fullName-error" className="form-error" role="alert">{formErrors.fullName}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">{content.email}</label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        placeholder={String(content.emailPlaceholder)}
                        className="form-input"
                        disabled
                        aria-disabled="true"
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="school" className="form-label">{content.school}</label>
                      <input
                        id="school"
                        type="text"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        placeholder={String(content.schoolPlaceholder)}
                        className="form-input"
                        autoComplete="organization"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio" className="form-label">
                        {content.bio}
                        <span className="char-count">({formData.bio.length}/200)</span>
                      </label>
                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder={String(content.bioPlaceholder)}
                        className={`form-input form-textarea ${formErrors.bio ? 'error' : ''}`}
                        maxLength={200}
                        aria-invalid={!!formErrors.bio}
                        aria-describedby={formErrors.bio ? 'bio-error' : undefined}
                      />
                      {formErrors.bio && (
                        <span id="bio-error" className="form-error" role="alert">{formErrors.bio}</span>
                      )}
                    </div>
                    <div className="form-actions">
                      <button type="submit" disabled={loading} className="btn-primary" aria-busy={loading}>
                        {loading ? content.saving : content.save}
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="btn-secondary" disabled={loading}>
                        {content.cancel}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="settings-overview">
                    <div className="settings-item glass-light">
                      <div className="settings-info">
                        <h3>{content.basicInfo}</h3>
                        <p>{content.basicInfoDesc}</p>
                      </div>
                      <button className="action-button" onClick={() => setEditMode(true)}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {content.edit}
                      </button>
                    </div>
                    <div className="settings-item glass-light">
                      <div className="settings-info">
                        <h3>{content.accountSecurity}</h3>
                        <p>{content.accountSecurityDesc}</p>
                      </div>
                      <button className="action-button" onClick={() => setPasswordModalVisible(true)}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        {content.changePassword}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* 密码修改弹窗 */}
        {passwordModalVisible && (
          <div 
            className="modal-overlay" 
            onClick={handleClosePasswordModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title"
          >
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 id="password-modal-title" className="modal-title">{content.passwordModalTitle}</h3>
                <button 
                  type="button" 
                  className="modal-close" 
                  onClick={handleClosePasswordModal}
                  aria-label={String(content.aria.closeModal)}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="modal-form" noValidate>
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">{content.currentPassword}</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder={String(content.currentPasswordPlaceholder)}
                    className={`form-input ${formErrors.currentPassword ? 'error' : ''}`}
                    aria-invalid={!!formErrors.currentPassword}
                    autoComplete="current-password"
                  />
                  {formErrors.currentPassword && (
                    <span className="form-error" role="alert">{formErrors.currentPassword}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">{content.newPassword}</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder={String(content.newPasswordPlaceholder)}
                    className={`form-input ${formErrors.newPassword ? 'error' : ''}`}
                    aria-invalid={!!formErrors.newPassword}
                    aria-describedby="password-requirements"
                    autoComplete="new-password"
                  />
                  {formErrors.newPassword && (
                    <span className="form-error" role="alert">{formErrors.newPassword}</span>
                  )}
                  {/* 密码强度指示器 */}
                  <div id="password-requirements" className="password-strength">
                    <p className="password-strength-title">{content.passwordRequirements}</p>
                    <ul className="password-requirements-list">
                      <li className={passwordStrength.minLength ? 'valid' : ''}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordStrength.minLength ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        {content.passwordMinLength}
                      </li>
                      <li className={passwordStrength.hasLowercase ? 'valid' : ''}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordStrength.hasLowercase ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        {content.passwordLowercase}
                      </li>
                      <li className={passwordStrength.hasUppercase ? 'valid' : ''}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordStrength.hasUppercase ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        {content.passwordUppercase}
                      </li>
                      <li className={passwordStrength.hasNumber ? 'valid' : ''}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordStrength.hasNumber ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        {content.passwordNumber}
                      </li>
                      <li className={passwordStrength.hasSpecial ? 'valid' : ''}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordStrength.hasSpecial ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        {content.passwordSpecial}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">{content.confirmPassword}</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder={String(content.confirmPasswordPlaceholder)}
                    className={`form-input ${formErrors.confirmPassword || (passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword) ? 'error' : ''}`}
                    aria-invalid={!!formErrors.confirmPassword || (passwordData.confirmPassword.length > 0 && passwordData.newPassword !== passwordData.confirmPassword)}
                    autoComplete="new-password"
                  />
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <span className="form-error" role="alert">{content.passwordMismatch}</span>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={handleClosePasswordModal} className="btn-secondary" disabled={loading}>
                    {content.cancel}
                  </button>
                  <button type="submit" disabled={loading || !isPasswordValid} className="btn-primary" aria-busy={loading}>
                    {loading ? content.saving : content.confirm}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 确认对话框 */}
        <ConfirmDialog
          state={dialogState}
          isLoading={dialogLoading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
      <Footer />
    </>
  );
}
