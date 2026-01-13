/**
 * 本地存储工具类
 */
export class Storage {
  /**
   * 设置localStorage
   */
  static setLocal(key: string, value: unknown): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }

  /**
   * 获取localStorage
   */
  static getLocal<T = unknown>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // 尝试解析JSON，如果失败则返回原始字符串
      try {
        return JSON.parse(item);
      } catch {
        // 如果不是有效的JSON，返回原始字符串
        return item as T;
      }
    } catch (error) {
      console.error('Error getting localStorage:', error);
      return null;
    }
  }

  /**
   * 删除localStorage
   */
  static removeLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage:', error);
    }
  }

  /**
   * 清空localStorage
   */
  static clearLocal(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * 设置sessionStorage
   */
  static setSession(key: string, value: unknown): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error setting sessionStorage:', error);
    }
  }

  /**
   * 获取sessionStorage
   */
  static getSession<T = unknown>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      
      // 尝试解析JSON，如果失败则返回原始字符串
      try {
        return JSON.parse(item);
      } catch {
        // 如果不是有效的JSON，返回原始字符串
        return item as T;
      }
    } catch (error) {
      console.error('Error getting sessionStorage:', error);
      return null;
    }
  }

  /**
   * 删除sessionStorage
   */
  static removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing sessionStorage:', error);
    }
  }

  /**
   * 清空sessionStorage
   */
  static clearSession(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }
}

// 常用的存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  THEME: 'theme',
  LANGUAGE: 'language',
  SEARCH_HISTORY: 'searchHistory',
} as const;
