/**
 * JWT Token 工具
 */

import { storage } from './storage';
import { STORAGE_KEY } from '@/config';

export const token = {
  /** 解析 JWT payload */
  parse(jwt: string): Record<string, unknown> | null {
    try {
      const payload = jwt.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  },

  /** 检查是否过期 */
  isExpired(jwt: string): boolean {
    // Mock token 格式: mock_access_token_xxx，不是真正的 JWT
    if (jwt.startsWith('mock_')) {
      return false; // Mock token 永不过期
    }
    const payload = this.parse(jwt);
    if (!payload?.exp) return true;
    return (payload.exp as number) < Date.now() / 1000;
  },

  /** 检查是否即将过期（5分钟内） */
  isExpiringSoon(jwt: string): boolean {
    const payload = this.parse(jwt);
    if (!payload?.exp) return true;
    return (payload.exp as number) - Date.now() / 1000 < 300;
  },

  /** 获取剩余有效时间（秒） */
  getRemainingTime(jwt: string): number {
    const payload = this.parse(jwt);
    if (!payload?.exp) return 0;
    return Math.max(0, (payload.exp as number) - Date.now() / 1000);
  },

  /** 获取存储的 access token */
  getAccessToken(): string | null {
    return storage.get<string>(STORAGE_KEY.TOKEN);
  },

  /** 获取存储的 refresh token */
  getRefreshToken(): string | null {
    return storage.get<string>(STORAGE_KEY.REFRESH_TOKEN);
  },

  /** 保存 tokens */
  setTokens(accessToken: string, refreshToken: string): void {
    storage.set(STORAGE_KEY.TOKEN, accessToken);
    storage.set(STORAGE_KEY.REFRESH_TOKEN, refreshToken);
  },

  /** 清除所有认证信息 */
  clearAuth(): void {
    storage.remove(STORAGE_KEY.TOKEN);
    storage.remove(STORAGE_KEY.REFRESH_TOKEN);
    storage.remove(STORAGE_KEY.USER);
  },

  /** 当前 token 是否有效 */
  isValid(): boolean {
    const t = this.getAccessToken();
    return t ? !this.isExpired(t) : false;
  },
};
