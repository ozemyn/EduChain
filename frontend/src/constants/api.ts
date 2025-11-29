// API相关常量
export const API_BASE_URL = '/api';

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // 用户相关
  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile',
    STATS: '/users/stats',
    FOLLOW: '/users/follow',
    FOLLOWERS: '/users/followers',
    FOLLOWING: '/users/following',
  },

  // 知识内容相关
  KNOWLEDGE: {
    LIST: '/knowledge',
    DETAIL: '/knowledge/:id',
    CREATE: '/knowledge',
    UPDATE: '/knowledge/:id',
    DELETE: '/knowledge/:id',
    HOT: '/knowledge/hot',
    RECOMMENDATIONS: '/knowledge/recommendations',
  },

  // 分类相关
  CATEGORIES: {
    LIST: '/categories',
    TREE: '/categories/tree',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },

  // 标签相关
  TAGS: {
    LIST: '/tags',
    HOT: '/tags/hot',
    CREATE: '/tags',
    UPDATE: '/tags/:id',
    DELETE: '/tags/:id',
  },

  // 评论相关
  COMMENTS: {
    LIST: '/comments',
    CREATE: '/comments',
    UPDATE: '/comments/:id',
    DELETE: '/comments/:id',
    REPLIES: '/comments/:id/replies',
  },

  // 互动相关
  INTERACTIONS: {
    LIKE: '/interactions/like',
    UNLIKE: '/interactions/unlike',
    FAVORITE: '/interactions/favorite',
    UNFAVORITE: '/interactions/unfavorite',
    STATS: '/interactions/stats/:id',
  },

  // 搜索相关
  SEARCH: {
    SEARCH: '/search',
    SUGGESTIONS: '/search/suggestions',
    HOT_KEYWORDS: '/search/hot-keywords',
    HISTORY: '/search/history',
  },

  // 通知相关
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread/count',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
  },

  // 文件相关
  FILES: {
    UPLOAD: '/files/upload',
    DELETE: '/files/:id',
  },

  // 统计相关
  STATISTICS: {
    PLATFORM: '/statistics/platform',
    USER: '/statistics/user/:id',
    KNOWLEDGE: '/statistics/knowledge/:id',
  },
} as const;

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000;
