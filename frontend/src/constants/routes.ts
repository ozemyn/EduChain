// 路由路径常量
export const ROUTES = {
  // 公共路由
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',

  // 知识内容相关
  KNOWLEDGE: {
    LIST: '/knowledge',
    DETAIL: '/knowledge/:id',
    CREATE: '/knowledge/create',
    EDIT: '/knowledge/:id/edit',
  },

  // 用户相关
  USER: {
    PROFILE: '/profile',
    SETTINGS: '/profile/settings',
    FAVORITES: '/profile/favorites',
    FOLLOWING: '/profile/following',
    FOLLOWERS: '/profile/followers',
  },

  // 搜索
  SEARCH: '/search',

  // 分类
  CATEGORY: '/category/:id',

  // 标签
  TAG: '/tag/:name',

  // 管理员
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    KNOWLEDGE: '/admin/knowledge',
    CATEGORIES: '/admin/categories',
    TAGS: '/admin/tags',
    COMMENTS: '/admin/comments',
    STATISTICS: '/admin/statistics',
    LOGS: '/admin/logs',
  },
} as const;

// 路由标题
export const ROUTE_TITLES = {
  [ROUTES.HOME]: '首页',
  [ROUTES.LOGIN]: '登录',
  [ROUTES.REGISTER]: '注册',
  [ROUTES.NOT_FOUND]: '页面不存在',
  [ROUTES.FORBIDDEN]: '访问被拒绝',
  [ROUTES.KNOWLEDGE.LIST]: '知识库',
  [ROUTES.KNOWLEDGE.CREATE]: '发布内容',
  [ROUTES.USER.PROFILE]: '个人中心',
  [ROUTES.USER.SETTINGS]: '个人设置',
  [ROUTES.USER.FAVORITES]: '我的收藏',
  [ROUTES.USER.FOLLOWING]: '我的关注',
  [ROUTES.USER.FOLLOWERS]: '我的粉丝',
  [ROUTES.SEARCH]: '搜索结果',
  [ROUTES.ADMIN.DASHBOARD]: '管理后台',
  [ROUTES.ADMIN.USERS]: '用户管理',
  [ROUTES.ADMIN.KNOWLEDGE]: '内容管理',
  [ROUTES.ADMIN.CATEGORIES]: '分类管理',
  [ROUTES.ADMIN.TAGS]: '标签管理',
  [ROUTES.ADMIN.COMMENTS]: '评论管理',
  [ROUTES.ADMIN.STATISTICS]: '统计分析',
  [ROUTES.ADMIN.LOGS]: '系统日志',
} as const;

// 面包屑配置
export const BREADCRUMB_CONFIG = {
  [ROUTES.HOME]: [{ title: '首页' }],
  [ROUTES.KNOWLEDGE.LIST]: [
    { title: '首页', path: ROUTES.HOME },
    { title: '知识库' },
  ],
  [ROUTES.KNOWLEDGE.CREATE]: [
    { title: '首页', path: ROUTES.HOME },
    { title: '知识库', path: ROUTES.KNOWLEDGE.LIST },
    { title: '发布内容' },
  ],
  [ROUTES.USER.PROFILE]: [
    { title: '首页', path: ROUTES.HOME },
    { title: '个人中心' },
  ],
  [ROUTES.USER.SETTINGS]: [
    { title: '首页', path: ROUTES.HOME },
    { title: '个人中心', path: ROUTES.USER.PROFILE },
    { title: '个人设置' },
  ],
  [ROUTES.SEARCH]: [
    { title: '首页', path: ROUTES.HOME },
    { title: '搜索结果' },
  ],
} as const;
