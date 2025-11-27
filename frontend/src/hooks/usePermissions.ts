import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 权限检查Hook
 */
export const usePermissions = () => {
  const { user } = useAuth();

  // 检查是否为管理员
  const isAdmin = useMemo(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  // 检查是否为学习者
  const isLearner = useMemo(() => {
    return user?.role === 'LEARNER';
  }, [user]);

  // 检查用户是否有特定权限
  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (!user) return false;

      // 管理员拥有所有权限
      if (user.role === 'ADMIN') return true;

      // 根据权限类型检查
      switch (permission) {
        case 'create_knowledge':
          return user.status === 1; // 活跃用户可以创建内容
        case 'edit_own_knowledge':
          return user.status === 1;
        case 'delete_own_knowledge':
          return user.status === 1;
        case 'comment':
          return user.status === 1;
        case 'like':
          return user.status === 1;
        case 'favorite':
          return user.status === 1;
        case 'follow':
          return user.status === 1;
        case 'upload_file':
          return user.status === 1 && user.level >= 1;
        case 'create_category':
          return isAdmin;
        case 'manage_users':
          return isAdmin;
        case 'view_admin_panel':
          return isAdmin;
        default:
          return false;
      }
    };
  }, [user, isAdmin]);

  // 检查是否可以编辑特定内容
  const canEditContent = useMemo(() => {
    return (contentUserId: number): boolean => {
      if (!user) return false;
      
      // 管理员可以编辑所有内容
      if (user.role === 'ADMIN') return true;
      
      // 用户只能编辑自己的内容
      return user.id === contentUserId;
    };
  }, [user]);

  // 检查是否可以删除特定内容
  const canDeleteContent = useMemo(() => {
    return (contentUserId: number): boolean => {
      if (!user) return false;
      
      // 管理员可以删除所有内容
      if (user.role === 'ADMIN') return true;
      
      // 用户只能删除自己的内容
      return user.id === contentUserId;
    };
  }, [user]);

  // 检查用户等级是否满足要求
  const hasMinLevel = useMemo(() => {
    return (minLevel: number): boolean => {
      return user ? user.level >= minLevel : false;
    };
  }, [user]);

  return {
    user,
    isAdmin,
    isLearner,
    hasPermission,
    canEditContent,
    canDeleteContent,
    hasMinLevel,
  };
};