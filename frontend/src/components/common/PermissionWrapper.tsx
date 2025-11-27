import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionWrapperProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  roles?: string[];
  minLevel?: number;
  requireActive?: boolean;
  fallback?: React.ReactNode;
  userId?: number; // 用于检查是否可以编辑/删除特定用户的内容
  checkEdit?: boolean; // 是否检查编辑权限
  checkDelete?: boolean; // 是否检查删除权限
}

/**
 * 权限包装组件
 * 根据用户权限决定是否渲染子组件
 */
const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  permission,
  permissions = [],
  roles = [],
  minLevel,
  requireActive = true,
  fallback = null,
  userId,
  checkEdit = false,
  checkDelete = false,
}) => {
  const {
    user,
    hasPermission,
    hasMinLevel,
    canEditContent,
    canDeleteContent,
  } = usePermissions();

  // 用户未登录
  if (!user) {
    return <>{fallback}</>;
  }

  // 检查用户状态
  if (requireActive && user.status !== 1) {
    return <>{fallback}</>;
  }

  // 检查角色权限
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // 检查单个权限
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // 检查多个权限（需要全部满足）
  if (permissions.length > 0) {
    const hasAllPermissions = permissions.every(perm => hasPermission(perm));
    if (!hasAllPermissions) {
      return <>{fallback}</>;
    }
  }

  // 检查用户等级
  if (minLevel !== undefined && !hasMinLevel(minLevel)) {
    return <>{fallback}</>;
  }

  // 检查编辑权限
  if (checkEdit && userId !== undefined && !canEditContent(userId)) {
    return <>{fallback}</>;
  }

  // 检查删除权限
  if (checkDelete && userId !== undefined && !canDeleteContent(userId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionWrapper;