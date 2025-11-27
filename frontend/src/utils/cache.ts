// 内存缓存管理
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private maxSize = 100; // 最大缓存项数

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    // 检查是否过期
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

  // 清理过期缓存
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // 获取缓存统计信息
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// 创建全局缓存实例
export const apiCache = new MemoryCache();

// 定期清理过期缓存
setInterval(() => {
  apiCache.cleanup();
}, 60 * 1000); // 每分钟清理一次

// 缓存键生成器
export const generateCacheKey = (
  endpoint: string,
  params?: Record<string, unknown>
): string => {
  if (!params) {
    return endpoint;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .reduce(
      (result, key) => {
        result[key] = params[key];
        return result;
      },
      {} as Record<string, unknown>
    );

  return `${endpoint}?${JSON.stringify(sortedParams)}`;
};

// 带缓存的请求装饰器
export const withCache = <T>(
  requestFn: () => Promise<T>,
  cacheKey: string,
  ttl: number = 5 * 60 * 1000
): Promise<T> => {
  // 先检查缓存
  const cached = apiCache.get<T>(cacheKey);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  // 缓存未命中，执行请求
  return requestFn().then(data => {
    // 缓存结果
    apiCache.set(cacheKey, data, ttl);
    return data;
  });
};

// 缓存失效工具
export const invalidateCache = (pattern?: string): void => {
  if (!pattern) {
    apiCache.clear();
    return;
  }

  // 删除匹配模式的缓存项
  const regex = new RegExp(pattern);
  const keysToDelete: string[] = [];

  for (const key of apiCache['cache'].keys()) {
    if (regex.test(key)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => apiCache.delete(key));
};

// 预加载缓存
export const preloadCache = async <T>(
  requests: Array<{
    key: string;
    requestFn: () => Promise<T>;
    ttl?: number;
  }>
): Promise<void> => {
  const promises = requests.map(async ({ key, requestFn, ttl }) => {
    try {
      const data = await requestFn();
      apiCache.set(key, data, ttl);
    } catch (error) {
      console.warn(`Failed to preload cache for key: ${key}`, error);
    }
  });

  await Promise.allSettled(promises);
};
