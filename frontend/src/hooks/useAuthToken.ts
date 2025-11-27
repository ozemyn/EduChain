import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Storage, STORAGE_KEYS } from '@/utils/storage';

/**
 * Token管理Hook
 */
export const useAuthToken = () => {
  const { refreshAuthToken, logout } = useAuth();

  // 检查token是否即将过期
  const checkTokenExpiry = useCallback(() => {
    const token = Storage.getLocal<string>(STORAGE_KEYS.TOKEN);
    if (!token) return false;

    try {
      // 解析JWT token获取过期时间
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const expiryTime = payload.exp;
      
      // 如果token在5分钟内过期，返回true
      return expiryTime - currentTime < 300;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // 解析失败，认为token无效
    }
  }, []);

  // 自动刷新token
  const autoRefreshToken = useCallback(async () => {
    if (checkTokenExpiry()) {
      try {
        await refreshAuthToken();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
      }
    }
  }, [checkTokenExpiry, refreshAuthToken, logout]);

  // 设置定时器自动检查和刷新token
  useEffect(() => {
    const interval = setInterval(() => {
      autoRefreshToken();
    }, 60000); // 每分钟检查一次

    return () => clearInterval(interval);
  }, [autoRefreshToken]);

  return {
    checkTokenExpiry,
    autoRefreshToken,
  };
};