'use client';

import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// 预设的骨架屏组合
export function UserCardSkeleton() {
  return (
    <div className="skeleton-user-card glass-card">
      <Skeleton variant="circular" width={56} height={56} />
      <div className="skeleton-user-info">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="80%" height={16} />
        <div className="skeleton-user-stats">
          <Skeleton variant="text" width={60} height={14} />
          <Skeleton variant="text" width={60} height={14} />
        </div>
      </div>
      <Skeleton variant="rectangular" width={100} height={36} className="skeleton-btn" />
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="skeleton-notification glass-card">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="skeleton-notification-content">
        <Skeleton variant="text" width="90%" height={18} />
        <Skeleton variant="text" width="30%" height={14} />
      </div>
      <Skeleton variant="rectangular" width={32} height={32} />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="skeleton-activity glass-light">
      <Skeleton variant="circular" width={44} height={44} />
      <div className="skeleton-activity-content">
        <Skeleton variant="text" width="85%" height={16} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="skeleton-profile-header glass-card">
      <Skeleton variant="circular" width={120} height={120} />
      <div className="skeleton-profile-info">
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="text" width={120} height={20} />
        <div className="skeleton-badges">
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
        </div>
        <Skeleton variant="text" width="80%" height={16} />
      </div>
      <div className="skeleton-actions">
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="skeleton-stat-card glass-card">
      <Skeleton variant="circular" width={56} height={56} />
      <Skeleton variant="text" width={60} height={32} />
      <Skeleton variant="text" width={80} height={16} />
    </div>
  );
}
