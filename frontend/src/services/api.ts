import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse } from '@/types/api';
import { TokenManager } from '@/utils/auth';
import { Storage, STORAGE_KEYS } from '@/utils/storage';
import { generateCacheKey, withCache } from '@/utils/cache';

// 扩展 AxiosRequestConfig 类型以包含 metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token刷新状态管理
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason: unknown) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 刷新token
const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const refreshToken = TokenManager.getStoredRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  if (isRefreshing) {
    // 如果正在刷新，将请求加入队列
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.post('/api/auth/refresh', {
      refreshToken: refreshToken,
    });

    const { accessToken: newToken, refreshToken: newRefreshToken } =
      response.data.data;

    // 更新存储的token
    Storage.setLocal(STORAGE_KEYS.TOKEN, newToken);
    Storage.setLocal(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

    processQueue(null, newToken);

    return newToken;
  } catch (error) {
    processQueue(error, null);

    // 刷新失败，清除认证信息
    TokenManager.clearAuthStorage();

    throw error;
  } finally {
    isRefreshing = false;
  }
};

// 请求拦截器
api.interceptors.request.use(
  async config => {
    // 添加认证token
    const token = TokenManager.getStoredToken();
    if (token) {
      // 检查token是否即将过期，如果是则尝试刷新
      if (TokenManager.isTokenExpiringSoon(token)) {
        try {
          await refreshTokenIfNeeded();
          // 获取新的token
          const newToken = TokenManager.getStoredToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // 如果刷新失败，仍然使用原token，让后端处理
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 添加请求时间戳
    config.metadata = { startTime: new Date() };

    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 错误处理辅助函数
const handleApiError = (error: unknown, originalRequest: unknown) => {
  const axiosError = error as {
    response?: { data?: { code?: string; message?: string; path?: string } };
  };
  const errorInfo = {
    code: axiosError.response?.data?.code,
    message: axiosError.response?.data?.message,
    path: axiosError.response?.data?.path,
  };

  // 根据错误代码提供用户友好的消息
  const getErrorMessage = (errorInfo: {
    code?: string;
    message?: string;
    path?: string;
  }) => {
    const errorMessages: Record<string, string> = {
      // 推荐系统错误
      REC_001: '用户信息无效，请重新登录',
      REC_002: '暂无足够数据生成推荐，请先浏览一些内容',
      REC_003: '推荐服务暂时不可用，请稍后重试',
      REC_004: '数据库连接异常，请稍后重试',
      REC_005: '请求参数有误，请检查后重试',
      REC_006: '内容不存在或已被删除',
      REC_007: '用户偏好分析失败，将为您推荐热门内容',
      REC_008: '相似度计算失败，请稍后重试',

      // 数据库错误
      DB_001: '数据库连接失败，请检查网络连接',
      DB_002: '数据查询失败，请稍后重试',
      DB_003: '数据操作失败，请重试',
      DB_004: '数据约束冲突，请检查输入信息',
      DB_005: '数据不存在',
      DB_006: '数据已存在，不能重复添加',
      DB_007: '关联数据不存在，操作失败',
      DB_008: '操作超时，请稍后重试',

      // SQL错误
      COLUMN_NOT_FOUND: '系统配置异常，请联系管理员',
      DUPLICATE_ENTRY: '数据已存在，不能重复添加',
      FOREIGN_KEY_ERROR: '关联数据不存在，操作失败',
      TABLE_NOT_FOUND: '系统配置错误，请联系管理员',

      // 事务错误
      TRANSACTION_ROLLBACK: '操作被取消，请检查数据后重试',

      // 通用错误
      VALIDATION_ERROR: '输入信息有误，请检查后重试',
      INVALID_CREDENTIALS: '用户名或密码错误',
      UNAUTHORIZED: '请先登录',
      FORBIDDEN: '权限不足',
      NOT_FOUND: '请求的资源不存在',
      INTERNAL_ERROR: '系统内部错误，请稍后重试',
    };

    return (
      errorMessages[errorInfo.code || ''] ||
      errorInfo.message ||
      '发生了未知错误'
    );
  };

  // 检查是否是推荐接口
  const requestWithUrl = originalRequest as { url?: string };
  const isRecommendationApi = requestWithUrl?.url?.includes('/recommendation');

  // 对于推荐接口的特殊处理
  if (isRecommendationApi) {
    // 只对严重错误显示提示
    if (
      errorInfo.code?.startsWith('DB_') ||
      errorInfo.code === 'TRANSACTION_ROLLBACK'
    ) {
      toast.error(getErrorMessage(errorInfo));
    } else if (errorInfo.code === 'REC_002' || errorInfo.code === 'REC_007') {
      // 信息性错误，使用普通提示
      toast.info(getErrorMessage(errorInfo));
    }
    // 其他推荐错误不显示提示，静默处理
    return;
  }

  // 非推荐接口的错误处理
  const message = getErrorMessage(errorInfo);

  if (
    errorInfo.code?.startsWith('DB_') ||
    errorInfo.code === 'TRANSACTION_ROLLBACK'
  ) {
    toast.error(message);
  } else if (errorInfo.code?.startsWith('REC_')) {
    toast.warning(message);
  } else {
    toast.error(message);
  }
};

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 计算请求耗时
    const endTime = new Date();
    const duration = response.config.metadata?.startTime
      ? endTime.getTime() - response.config.metadata.startTime.getTime()
      : 0;
    // 只在开发环境打印API日志
    if (import.meta.env.DEV) {
      console.log(`API ${response.config.url} took ${duration}ms`);
    }

    // 如果是blob响应（文件下载），直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    const { data } = response;

    // 检查业务状态码
    if (!data.success) {
      // 使用新的错误处理机制
      const error = {
        response: {
          data: data,
        },
      };
      handleApiError(error, response.config);
      return Promise.reject(new Error(data.message || '请求失败'));
    }

    return response;
  },
  async error => {
    const originalRequest = error.config;

    console.error('Response error:', error);

    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // 如果是刷新token的请求失败，直接跳转登录
          if (originalRequest.url?.includes('/auth/refresh')) {
            toast.error('登录已过期，请重新登录');
            TokenManager.clearAuthStorage();
            window.location.href = '/login';
            break;
          }

          // 如果还没有尝试刷新token，则尝试刷新
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const newToken = await refreshTokenIfNeeded();
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              toast.error('登录已过期，请重新登录');
              TokenManager.clearAuthStorage();
              window.location.href = '/login';
              break;
            }
          }

          toast.error('登录已过期，请重新登录');
          TokenManager.clearAuthStorage();
          window.location.href = '/login';
          break;
        case 403:
          toast.error('没有权限访问该资源');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 429: {
          // 处理限流错误
          const retryAfter = error.response.headers['retry-after'];
          const rateLimitMessage =
            error.response.data?.message || '请求过于频繁，请稍后再试';
          toast.warning(
            retryAfter
              ? `${rateLimitMessage}（${retryAfter}秒后重试）`
              : rateLimitMessage
          );
          break;
        }
        case 500:
          // 使用新的错误处理机制
          handleApiError(error, originalRequest);
          break;
        default:
          // 使用新的错误处理机制
          handleApiError(error, originalRequest);
      }
    } else if (error.request) {
      // 对于推荐接口，不显示错误提示
      const isRecommendationApi =
        originalRequest?.url?.includes('/recommendation');
      if (!isRecommendationApi) {
        toast.error('网络连接失败，请检查网络设置');
      }
    } else {
      toast.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

// 通用请求方法
export const request = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig & { useCache?: boolean; cacheTtl?: number }
  ): Promise<ApiResponse<T>> => {
    const {
      useCache = false,
      cacheTtl = 5 * 60 * 1000,
      ...axiosConfig
    } = config || {};

    if (useCache) {
      const cacheKey = generateCacheKey(url, axiosConfig.params);
      return withCache(
        () => api.get(url, axiosConfig).then(res => res.data),
        cacheKey,
        cacheTtl
      );
    }

    return api.get(url, axiosConfig).then(res => res.data);
  },

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    api.post(url, data, config).then(res => res.data),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    api.put(url, data, config).then(res => res.data),

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => api.delete(url, config).then(res => res.data),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    api.patch(url, data, config).then(res => res.data),
};

// 文件上传方法
export const uploadFile = (
  file: File,
  onProgress?: (percent: number) => void
): Promise<ApiResponse<{ fileUrl: string; url?: string }>> => {
  const formData = new FormData();
  formData.append('file', file);

  return api
    .post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    })
    .then(res => res.data);
};

export default api;
