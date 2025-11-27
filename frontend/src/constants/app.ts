// 应用相关常量
export const APP_NAME = 'EduChain';
export const APP_DESCRIPTION = '教育知识共享平台';
export const APP_VERSION = '1.0.0';

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
} as const;

// 文件上传配置
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_ALL_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// 知识内容类型
export const KNOWLEDGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
  LINK: 'LINK',
} as const;

export const KNOWLEDGE_TYPE_LABELS = {
  [KNOWLEDGE_TYPES.TEXT]: '文本',
  [KNOWLEDGE_TYPES.IMAGE]: '图片',
  [KNOWLEDGE_TYPES.VIDEO]: '视频',
  [KNOWLEDGE_TYPES.PDF]: 'PDF',
  [KNOWLEDGE_TYPES.LINK]: '链接',
} as const;

// 用户角色
export const USER_ROLES = {
  LEARNER: 'LEARNER',
  ADMIN: 'ADMIN',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.LEARNER]: '学习者',
  [USER_ROLES.ADMIN]: '管理员',
} as const;

// 通知类型
export const NOTIFICATION_TYPES = {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT',
  FOLLOW: 'FOLLOW',
  SYSTEM: 'SYSTEM',
} as const;

export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPES.LIKE]: '点赞',
  [NOTIFICATION_TYPES.COMMENT]: '评论',
  [NOTIFICATION_TYPES.FOLLOW]: '关注',
  [NOTIFICATION_TYPES.SYSTEM]: '系统',
} as const;

// 搜索排序方式
export const SEARCH_SORT_OPTIONS = {
  RELEVANCE: 'RELEVANCE',
  TIME: 'TIME',
  POPULARITY: 'POPULARITY',
} as const;

export const SEARCH_SORT_LABELS = {
  [SEARCH_SORT_OPTIONS.RELEVANCE]: '相关性',
  [SEARCH_SORT_OPTIONS.TIME]: '时间',
  [SEARCH_SORT_OPTIONS.POPULARITY]: '热度',
} as const;

// 状态码
export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  DELETED: -1,
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
  URL: /^https?:\/\/.+/,
} as const;

// 默认头像
export const DEFAULT_AVATAR = '/images/default-avatar.png';

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限访问该资源',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据格式错误',
  UPLOAD_ERROR: '文件上传失败',
} as const;
