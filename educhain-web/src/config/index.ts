/**
 * 应用配置常量
 * 统一管理所有配置项
 */

// ============ 应用基础配置 ============
export const APP_CONFIG = {
  name: 'EduChain',
  description: '基于区块链存证的教育知识共享与智能检索系统',
  version: '1.0.0',
} as const;

// ============ API 配置 ============
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10000,
} as const;

// ============ 分页配置 ============
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// ============ 文件上传配置 ============
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  allowedDocTypes: ['application/pdf'],
} as const;

// ============ 业务枚举 ============
export const KNOWLEDGE_TYPE = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
  LINK: 'LINK',
} as const;

export const KNOWLEDGE_TYPE_LABEL: Record<string, string> = {
  TEXT: '文本',
  IMAGE: '图片',
  VIDEO: '视频',
  PDF: 'PDF',
  LINK: '链接',
};

export const USER_ROLE = {
  LEARNER: 'LEARNER',
  ADMIN: 'ADMIN',
} as const;

export const USER_ROLE_LABEL: Record<string, string> = {
  LEARNER: '学习者',
  ADMIN: '管理员',
};

export const NOTIFICATION_TYPE = {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT',
  FOLLOW: 'FOLLOW',
  SYSTEM: 'SYSTEM',
} as const;

export const SORT_TYPE = {
  RELEVANCE: 'RELEVANCE',
  TIME: 'TIME',
  POPULARITY: 'POPULARITY',
} as const;

export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  DELETED: -1,
} as const;

// ============ 存储键名 ============
export const STORAGE_KEY = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LOCALE: 'locale',
  DRAFT: 'knowledge_draft',
} as const;

// ============ 正则表达式 ============
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^1[3-9]\d{9}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
} as const;
