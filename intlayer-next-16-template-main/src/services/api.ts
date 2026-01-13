/**
 * API 基础请求封装
 * 使用原生 fetch，适配 Next.js 环境
 */

import type { ApiResponse } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Token 管理
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

const setTokens = (token: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// 刷新 Token
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
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
        clearTokens();
        return null;
      }

      const data = await response.json();
      if (data.success && data.data) {
        setTokens(data.data.accessToken, data.data.refreshToken);
        return data.data.accessToken;
      }
      return null;
    } catch {
      clearTokens();
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
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(url, config);

    // 401 时尝试刷新 Token
    if (response.status === 401 && token) {
      const newToken = await refreshTokenIfNeeded();
      if (newToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...config, headers });
      } else {
        // 刷新失败，跳转登录
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
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return fetchWithAuth<T>(`${endpoint}${queryString}`, { method: 'GET' });
  },

  post: <T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> => {
    return fetchWithAuth<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: <T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> => {
    return fetchWithAuth<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: <T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> => {
    return fetchWithAuth<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch: <T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> => {
    return fetchWithAuth<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};

// 文件上传
export const uploadFile = async (
  file: File,
  onProgress?: (percent: number) => void
): Promise<ApiResponse<{ fileUrl: string; url?: string }>> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 使用 XMLHttpRequest 支持进度回调
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/files/upload`);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
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

// 导出 Token 管理函数
export { getToken, setTokens, clearTokens };
