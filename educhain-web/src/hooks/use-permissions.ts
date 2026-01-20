'use client';

/**
 * 权限检查 Hook
 */

import { useMemo } from 'react';
import { useAuth } from '@/contexts';

type Permission =
  | 'create_knowledge'
  | 'edit_own_knowledge'
  | 'delete_own_knowledge'
  | 'comment'
  | 'like'
  | 'favorite'
  | 'follow'
  | 'upload_file'
  | 'create_category'
  | 'manage_users'
  | 'view_admin_panel';

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user]);
  const isLearner = useMemo(() => user?.role === 'LEARNER', [user]);
  const isActive = useMemo(() => user?.status === 1, [user]);

  const hasPermission = useMemo(() => {
    return (permission: Permission): boolean => {
      if (!user) return false;
      if (isAdmin) return true;
      if (!isActive) return false;

      switch (permission) {
        case 'create_knowledge':
        case 'edit_own_knowledge':
        case 'delete_own_knowledge':
        case 'comment':
        case 'like':
        case 'favorite':
        case 'follow':
          return true;
        case 'upload_file':
          return user.level >= 1;
        case 'create_category':
        case 'manage_users':
        case 'view_admin_panel':
          return false;
        default:
          return false;
      }
    };
  }, [user, isAdmin, isActive]);

  const canEdit = useMemo(() => {
    return (contentUserId: number): boolean => {
      if (!user) return false;
      if (isAdmin) return true;
      return user.id === contentUserId;
    };
  }, [user, isAdmin]);

  const canDelete = useMemo(() => {
    return (contentUserId: number): boolean => {
      if (!user) return false;
      if (isAdmin) return true;
      return user.id === contentUserId;
    };
  }, [user, isAdmin]);

  const hasMinLevel = useMemo(() => {
    return (minLevel: number): boolean => {
      return user ? user.level >= minLevel : false;
    };
  }, [user]);

  return {
    user,
    isAdmin,
    isLearner,
    isActive,
    hasPermission,
    canEdit,
    canDelete,
    hasMinLevel,
  };
}
