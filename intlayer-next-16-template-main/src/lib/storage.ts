/**
 * 浏览器存储工具
 */

const isBrowser = typeof window !== 'undefined';

export const storage = {
  // localStorage
  get<T>(key: string): T | null {
    if (!isBrowser) return null;
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch {
      return null;
    }
  },

  set(key: string, value: unknown): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isBrowser) return;
    localStorage.clear();
  },

  // sessionStorage
  session: {
    get<T>(key: string): T | null {
      if (!isBrowser) return null;
      try {
        const item = sessionStorage.getItem(key);
        if (!item) return null;
        try {
          return JSON.parse(item);
        } catch {
          return item as T;
        }
      } catch {
        return null;
      }
    },

    set(key: string, value: unknown): void {
      if (!isBrowser) return;
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Session storage set error:', e);
      }
    },

    remove(key: string): void {
      if (!isBrowser) return;
      sessionStorage.removeItem(key);
    },

    clear(): void {
      if (!isBrowser) return;
      sessionStorage.clear();
    },
  },
};
