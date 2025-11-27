import { message } from 'antd';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

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

export class NetworkError extends Error {
  status?: number;
  statusText?: string;

  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
    this.statusText = statusText;
  }
}

// 错误处理工具函数
export const handleApiError = (error: unknown): void => {
  console.error('API Error:', error);

  if (error instanceof BusinessError) {
    message.error(error.message);
  } else if (error instanceof ValidationError) {
    message.error(`${error.field}: ${error.message}`);
  } else if (error instanceof NetworkError) {
    if (error.status === 401) {
      message.error('登录已过期，请重新登录');
      // 可以在这里触发登出逻辑
    } else if (error.status === 403) {
      message.error('没有权限访问该资源');
    } else if (error.status === 404) {
      message.error('请求的资源不存在');
    } else if (error.status === 500) {
      message.error('服务器内部错误，请稍后重试');
    } else {
      message.error(error.message || '网络错误，请检查网络连接');
    }
  } else if (error instanceof Error) {
    message.error(error.message);
  } else {
    message.error('未知错误，请稍后重试');
  }
};

// 重试机制
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 如果是业务错误或认证错误，不重试
      if (
        error instanceof BusinessError ||
        (error instanceof NetworkError &&
          (error.status === 401 || error.status === 403))
      ) {
        throw error;
      }

      // 最后一次重试失败，抛出错误
      if (i === maxRetries - 1) {
        throw error;
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError;
};

// 防抖处理
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流处理
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
