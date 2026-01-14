'use client';

/**
 * Toast 通知 Hook
 * 统一的消息提示接口
 */

import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
}

// 简单的 toast 实现（可替换为 sonner/react-hot-toast 等）
function showToast(message: string, type: ToastType, _options?: ToastOptions) {
  // 这里可以集成任何 toast 库
  // 目前使用 console 作为占位，实际使用时替换
  const prefix = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  console.log(`${prefix[type]} ${message}`);

  // 实际项目中应该使用 toast 库如 sonner
}

export function useToast() {
  const success = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'success', options);
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'error', options);
  }, []);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'warning', options);
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'info', options);
  }, []);

  return { success, error, warning, info };
}
