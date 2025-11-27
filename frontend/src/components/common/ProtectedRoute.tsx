import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  minLevel?: number;
  requireActive?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  permissions = [],
  minLevel,
  requireActive = true,
  fallback,
}) => {
  const { user, loading } = useAuth();
  const { hasPermission, hasMinLevel } = usePermissions();
  const location = useLocation();

  // 正在加载用户信息
  if (loading) {
    return <Loading tip="验证用户身份..." />;
  }

  // 用户未登录
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 检查用户状态（是否被禁用）
  if (requireActive && user.status !== 1) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Result
        status="403"
        title="账户已被禁用"
        subTitle="您的账户已被管理员禁用，无法访问此页面。"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  // 检查角色权限
  if (roles.length > 0 && !roles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Result
        status="403"
        title="权限不足"
        subTitle="您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  // 检查特定权限
  if (permissions.length > 0) {
    const hasAllPermissions = permissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <Result
          status="403"
          title="权限不足"
          subTitle="您没有执行此操作的权限。"
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              返回上一页
            </Button>
          }
        />
      );
    }
  }

  // 检查用户等级
  if (minLevel !== undefined && !hasMinLevel(minLevel)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Result
        status="403"
        title="等级不足"
        subTitle={`您需要达到等级 ${minLevel} 才能访问此页面。当前等级：${user.level}`}
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
