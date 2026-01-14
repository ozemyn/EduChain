/**
 * Mock 配置常量
 */

// API 基础路径
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// 模拟网络延迟时间 (ms)
export const MOCK_DELAY = 100;

// 是否启用 Mock
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// 环境判断
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isBrowser = typeof window !== 'undefined';
