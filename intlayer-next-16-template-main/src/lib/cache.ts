/**
 * 内存缓存工具
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private maxSize = 100;

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item) return null;
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();

/** 生成缓存键 */
export function cacheKey(endpoint: string, params?: Record<string, unknown>): string {
  if (!params) return endpoint;
  const sorted = Object.keys(params)
    .sort()
    .reduce((r, k) => ({ ...r, [k]: params[k] }), {});
  return `${endpoint}?${JSON.stringify(sorted)}`;
}

/** 带缓存的请求 */
export async function withCache<T>(
  fn: () => Promise<T>,
  key: string,
  ttl = 5 * 60 * 1000
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== null) return cached;

  const data = await fn();
  cache.set(key, data, ttl);
  return data;
}

/** 清除匹配的缓存 */
export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  // 简单实现：清除所有缓存
  // 如需精确匹配，可扩展 MemoryCache 类暴露 keys 方法
  cache.clear();
}
