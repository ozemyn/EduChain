/**
 * 错误处理工具
 */

// 业务错误
export class BusinessError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.details = details;
  }
}

// 验证错误
export class ValidationError extends Error {
  field: string;
  value?: unknown;

  constructor(field: string, message: string, value?: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

// 网络错误
export class NetworkError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

// 错误码映射
export const ERROR_MESSAGES: Record<string, string> = {
  // 认证错误
  UNAUTHORIZED: '请先登录',
  FORBIDDEN: '权限不足',
  INVALID_CREDENTIALS: '用户名或密码错误',

  // 数据库错误
  DB_001: '数据库连接失败',
  DB_002: '数据查询失败',
  DB_003: '数据操作失败',
  DB_004: '数据约束冲突',
  DB_005: '数据不存在',
  DB_006: '数据已存在',

  // 通用错误
  VALIDATION_ERROR: '输入信息有误',
  NOT_FOUND: '资源不存在',
  INTERNAL_ERROR: '系统内部错误',
  NETWORK_ERROR: '网络连接失败',
};

// 获取错误消息
export function getErrorMessage(code?: string, fallback?: string): string {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  return fallback || '发生了未知错误';
}

// 解析API错误
export function parseApiError(error: unknown): {
  code?: string;
  message: string;
} {
  if (error instanceof BusinessError) {
    return { code: error.code, message: error.message };
  }

  if (error instanceof NetworkError) {
    return { code: 'NETWORK_ERROR', message: error.message };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: '发生了未知错误' };
}

// 重试机制
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 认证错误不重试
      if (error instanceof NetworkError && (error.status === 401 || error.status === 403)) {
        throw error;
      }

      if (i === maxRetries - 1) throw error;

      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError;
}

// 防抖
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

// 节流
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
