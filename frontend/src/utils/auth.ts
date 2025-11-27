import { Storage, STORAGE_KEYS } from './storage';

/**
 * JWT Token 工具类
 */
export class TokenManager {
  /**
   * 解析JWT Token
   */
  static parseToken(token: string): { exp?: number; [key: string]: unknown } | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  /**
   * 检查token是否过期
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  }

  /**
   * 检查token是否即将过期（5分钟内）
   */
  static isTokenExpiringSoon(token: string): boolean {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Date.now() / 1000;
    const expiryTime = payload.exp;
    
    // 如果token在5分钟内过期，返回true
    return expiryTime - currentTime < 300;
  }

  /**
   * 获取token剩余有效时间（秒）
   */
  static getTokenRemainingTime(token: string): number {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return 0;

    const currentTime = Date.now() / 1000;
    const remainingTime = payload.exp - currentTime;
    
    return Math.max(0, remainingTime);
  }

  /**
   * 从localStorage获取token
   */
  static getStoredToken(): string | null {
    return Storage.getLocal<string>(STORAGE_KEYS.TOKEN);
  }

  /**
   * 从localStorage获取refresh token
   */
  static getStoredRefreshToken(): string | null {
    return Storage.getLocal<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * 清除所有认证相关的存储
   */
  static clearAuthStorage(): void {
    Storage.removeLocal(STORAGE_KEYS.TOKEN);
    Storage.removeLocal(STORAGE_KEYS.REFRESH_TOKEN);
    Storage.removeLocal(STORAGE_KEYS.USER_INFO);
  }

  /**
   * 检查当前存储的token是否有效
   */
  static isCurrentTokenValid(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    
    return !this.isTokenExpired(token);
  }

  /**
   * 检查当前存储的token是否即将过期
   */
  static isCurrentTokenExpiringSoon(): boolean {
    const token = this.getStoredToken();
    if (!token) return true;
    
    return this.isTokenExpiringSoon(token);
  }
}

/**
 * 权限检查工具类
 */
export class PermissionManager {
  /**
   * 检查用户是否有特定权限
   */
  static hasPermission(userRole: string, userStatus: number, userLevel: number, permission: string): boolean {
    // 管理员拥有所有权限
    if (userRole === 'ADMIN') return true;

    // 用户必须是活跃状态
    if (userStatus !== 1) return false;

    // 根据权限类型检查
    switch (permission) {
      case 'create_knowledge':
        return true;
      case 'edit_own_knowledge':
        return true;
      case 'delete_own_knowledge':
        return true;
      case 'comment':
        return true;
      case 'like':
        return true;
      case 'favorite':
        return true;
      case 'follow':
        return true;
      case 'upload_file':
        return userLevel >= 1;
      case 'create_category':
        return false; // 只有管理员可以创建分类
      case 'manage_users':
        return false; // 只有管理员可以管理用户
      case 'view_admin_panel':
        return false; // 只有管理员可以查看管理面板
      default:
        return false;
    }
  }

  /**
   * 检查用户是否可以编辑特定内容
   */
  static canEditContent(userId: number, contentUserId: number, userRole: string): boolean {
    // 管理员可以编辑所有内容
    if (userRole === 'ADMIN') return true;
    
    // 用户只能编辑自己的内容
    return userId === contentUserId;
  }

  /**
   * 检查用户是否可以删除特定内容
   */
  static canDeleteContent(userId: number, contentUserId: number, userRole: string): boolean {
    // 管理员可以删除所有内容
    if (userRole === 'ADMIN') return true;
    
    // 用户只能删除自己的内容
    return userId === contentUserId;
  }
}

/**
 * 认证状态管理工具
 */
export class AuthStateManager {
  private static listeners: Array<() => void> = [];

  /**
   * 添加认证状态变化监听器
   */
  static addListener(listener: () => void): void {
    this.listeners.push(listener);
  }

  /**
   * 移除认证状态变化监听器
   */
  static removeListener(listener: () => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * 通知所有监听器认证状态已变化
   */
  static notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * 清除所有监听器
   */
  static clearListeners(): void {
    this.listeners = [];
  }
}