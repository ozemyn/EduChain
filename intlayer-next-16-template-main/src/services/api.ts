/**
 * API 基础请求封装
 * 使用原生 fetch，适配 Next.js 环境
 */

import type { ApiResponse } from '@/types/api';
import { token as tokenUtil } from '@/lib';
import { API_CONFIG } from '@/config';

const { baseUrl: API_BASE_URL } = API_CONFIG;

// Token 刷新状态
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// 刷新 Token
const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const refreshToken = tokenUtil.getRefreshToken();
  if (!refreshToken) return null;

  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        tokenUtil.clearAuth();
        return null;
      }

      const data = await response.json();
      if (data.success && data.data) {
        tokenUtil.setTokens(data.data.accessToken, data.data.refreshToken);
        return data.data.accessToken;
      }
      return null;
    } catch {
      tokenUtil.clearAuth();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// 基础请求函数
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = tokenUtil.getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = { ...options, headers };

  try {
    let response = await fetch(url, config);

    // 401 时尝试刷新 Token
    if (response.status === 401 && accessToken) {
      const newToken = await refreshTokenIfNeeded();
      if (newToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...config, headers });
      } else {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('登录已过期，请重新登录');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// 请求方法封装
export const request = {
  get: <T = unknown>(
    endpoint: string,
    params?: Record<string, unknown> | object
  ): Promise<ApiResponse<T>> => {
    const queryString = params
      ? '?' +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return fetchWithAuth<T>(`${endpoint}${queryString}`, { method: 'GET' });
  },

  post: <T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    fetchWithAuth<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    fetchWithAuth<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    fetchWithAuth<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    fetchWithAuth<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
};

// 文件上传
export const uploadFile = async (
  file: File,
  onProgress?: (percent: number) => void
): Promise<ApiResponse<{ fileUrl: string; url?: string }>> => {
  const formData = new FormData();
  formData.append('file', file);

  const accessToken = tokenUtil.getAccessToken();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/files/upload`);

    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('上传失败'));
      }
    };

    xhr.onerror = () => reject(new Error('网络错误'));
    xhr.send(formData);
  });
};
