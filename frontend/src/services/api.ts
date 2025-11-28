import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
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

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 计算请求耗时
    const endTime = new Date();
    const duration = response.config.metadata?.startTime
      ? endTime.getTime() - response.config.metadata.startTime.getTime()
      : 0;
    console.log(`API ${response.config.url} took ${duration}ms`);

    const { data } = response;

    // 检查业务状态码
    if (!data.success) {
      // 对于推荐接口，不显示错误提示（数据为空是正常情况）
      const isRecommendationApi = response.config.url?.includes('/recommendation');
      if (!isRecommendationApi) {
        message.error(data.message || '请求失败');
      }
      return Promise.reject(new Error(data.message || '请求失败'));
    }

    return response;
  },
  async error => {
    const originalRequest = error.config;

    console.error('Response error:', error);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 如果是刷新token的请求失败，直接跳转登录
          if (originalRequest.url?.includes('/auth/refresh')) {
            message.error('登录已过期，请重新登录');
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
              message.error('登录已过期，请重新登录');
              TokenManager.clearAuthStorage();
              window.location.href = '/login';
              break;
            }
          }

          message.error('登录已过期，请重新登录');
          TokenManager.clearAuthStorage();
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          // 对于推荐接口，不显示错误提示
          const isRecommendationApi = originalRequest?.url?.includes('/recommendation');
          if (!isRecommendationApi) {
            message.error(data?.message || '网络错误，请稍后重试');
          }
      }
    } else if (error.request) {
      // 对于推荐接口，不显示错误提示
      const isRecommendationApi = originalRequest?.url?.includes('/recommendation');
      if (!isRecommendationApi) {
        message.error('网络连接失败，请检查网络设置');
      }
    } else {
      message.error('请求配置错误');
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
): Promise<ApiResponse<{ url: string }>> => {
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
