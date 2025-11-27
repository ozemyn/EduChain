import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  fallback,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 正在加载用户信息
  if (loading) {
    return <Loading tip="验证用户身份..." />;
  }

  // 用户未登录
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 检查角色权限
  if (roles.length > 0 && !roles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return <Navigate to="/403" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
