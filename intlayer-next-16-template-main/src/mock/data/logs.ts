/**
 * 日志 Mock 数据
 * 包含管理员日志和系统日志
 */

export interface AdminLog {
  id: number;
  adminId: number;
  adminUsername: string;
  operationType:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'APPROVE'
    | 'REJECT'
    | 'DISABLE'
    | 'ENABLE'
    | 'EXPORT'
    | 'IMPORT'
    | 'BACKUP'
    | 'RESTORE';
  targetType:
    | 'USER'
    | 'KNOWLEDGE_ITEM'
    | 'CATEGORY'
    | 'COMMENT'
    | 'TAG'
    | 'SYSTEM_CONFIG'
    | 'EXTERNAL_SOURCE'
    | 'NOTIFICATION'
    | 'LOG';
  targetId?: number;
  targetName?: string;
  operation: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent: string;
  result: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  errorMessage?: string;
  createdAt: string;
}

export interface SystemLog {
  id: number;
  logType: 'OPERATION' | 'ERROR' | 'SECURITY' | 'PERFORMANCE' | 'SYSTEM';
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  userId?: number;
  username?: string;
  operation: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  requestUrl?: string;
  requestMethod?: string;
  responseStatus?: number;
  executionTime?: number;
  exception?: string;
  createdAt: string;
}

// 管理员日志
export const mockAdminLogs: AdminLog[] = [
  {
    id: 1,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'APPROVE',
    targetType: 'KNOWLEDGE_ITEM',
    targetId: 1,
    targetName: 'React Hooks 完全指南',
    operation: '审核通过知识内容',
    description: '审核并通过了用户张三提交的知识内容',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2025-12-01T10:30:00Z',
  },
  {
    id: 2,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'UPDATE',
    targetType: 'USER',
    targetId: 15,
    targetName: '高六',
    operation: '更新用户等级',
    description: '将用户等级从 6 提升到 7',
    oldValue: '6',
    newValue: '7',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2025-12-15T14:00:00Z',
  },
  {
    id: 3,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'DELETE',
    targetType: 'COMMENT',
    targetId: 99,
    targetName: '违规评论',
    operation: '删除违规评论',
    description: '删除了包含不当内容的评论',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2025-12-20T09:30:00Z',
  },
  {
    id: 4,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'CREATE',
    targetType: 'CATEGORY',
    targetId: 50,
    targetName: '人工智能',
    operation: '创建新分类',
    description: '创建了新的一级分类：人工智能',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2025-12-25T11:00:00Z',
  },
  {
    id: 5,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'BACKUP',
    targetType: 'SYSTEM_CONFIG',
    operation: '系统备份',
    description: '执行了系统数据库备份',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2026-01-01T02:00:00Z',
  },
  {
    id: 6,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'DISABLE',
    targetType: 'USER',
    targetId: 50,
    targetName: '违规用户',
    operation: '禁用用户账号',
    description: '因违反社区规则，禁用了用户账号',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2026-01-02T15:30:00Z',
  },
  {
    id: 7,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'EXPORT',
    targetType: 'LOG',
    operation: '导出日志',
    description: '导出了最近 30 天的系统日志',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2026-01-03T10:00:00Z',
  },
  {
    id: 8,
    adminId: 1,
    adminUsername: 'admin',
    operationType: 'UPDATE',
    targetType: 'SYSTEM_CONFIG',
    operation: '更新系统配置',
    description: '更新了系统邮件服务器配置',
    oldValue: 'smtp.old.com',
    newValue: 'smtp.new.com',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    createdAt: '2026-01-04T14:20:00Z',
  },
];

// 系统日志
export const mockSystemLogs: SystemLog[] = [
  {
    id: 1,
    logType: 'OPERATION',
    level: 'INFO',
    userId: 2,
    username: 'zhangsan',
    operation: '用户登录',
    description: '用户成功登录系统',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    requestUrl: '/api/auth/login',
    requestMethod: 'POST',
    responseStatus: 200,
    executionTime: 245,
    createdAt: '2026-02-05T09:00:00Z',
  },
  {
    id: 2,
    logType: 'OPERATION',
    level: 'INFO',
    userId: 3,
    username: 'lisi',
    operation: '创建知识内容',
    description: '用户创建了新的知识内容',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    requestUrl: '/api/knowledge',
    requestMethod: 'POST',
    responseStatus: 201,
    executionTime: 567,
    createdAt: '2026-02-05T09:15:00Z',
  },
  {
    id: 3,
    logType: 'ERROR',
    level: 'ERROR',
    userId: 4,
    username: 'wangwu',
    operation: '文件上传',
    description: '文件上传失败：文件大小超过限制',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    requestUrl: '/api/files/upload',
    requestMethod: 'POST',
    responseStatus: 413,
    executionTime: 123,
    exception: 'FileSizeLimitExceededException: Maximum upload size exceeded',
    createdAt: '2026-02-05T09:30:00Z',
  },
  {
    id: 4,
    logType: 'SECURITY',
    level: 'WARN',
    userId: 10,
    username: 'chenyi',
    operation: '密码错误',
    description: '用户登录失败：密码错误（第 3 次尝试）',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    requestUrl: '/api/auth/login',
    requestMethod: 'POST',
    responseStatus: 401,
    executionTime: 189,
    createdAt: '2026-02-05T09:45:00Z',
  },
  {
    id: 5,
    logType: 'PERFORMANCE',
    level: 'WARN',
    operation: '慢查询',
    description: '数据库查询执行时间过长',
    requestUrl: '/api/knowledge/search',
    requestMethod: 'GET',
    responseStatus: 200,
    executionTime: 3456,
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 6,
    logType: 'SYSTEM',
    level: 'INFO',
    operation: '系统启动',
    description: '应用服务器启动成功',
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 7,
    logType: 'OPERATION',
    level: 'INFO',
    userId: 15,
    username: 'gaoliu',
    operation: '搜索',
    description: '用户执行了搜索操作',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    requestUrl: '/api/search',
    requestMethod: 'POST',
    responseStatus: 200,
    executionTime: 234,
    createdAt: '2026-02-05T10:15:00Z',
  },
  {
    id: 8,
    logType: 'ERROR',
    level: 'ERROR',
    operation: '数据库连接失败',
    description: '无法连接到数据库服务器',
    exception: 'SQLException: Connection timeout',
    createdAt: '2026-02-05T10:30:00Z',
  },
  {
    id: 9,
    logType: 'SECURITY',
    level: 'WARN',
    operation: 'SQL 注入尝试',
    description: '检测到可疑的 SQL 注入尝试',
    ipAddress: '192.168.1.200',
    userAgent: 'curl/7.64.1',
    requestUrl: '/api/knowledge?id=1 OR 1=1',
    requestMethod: 'GET',
    responseStatus: 400,
    createdAt: '2026-02-05T10:45:00Z',
  },
  {
    id: 10,
    logType: 'PERFORMANCE',
    level: 'INFO',
    operation: '缓存命中',
    description: 'Redis 缓存命中率: 95.6%',
    executionTime: 12,
    createdAt: '2026-02-05T11:00:00Z',
  },
];

// 获取管理员的操作日志
export const getAdminLogsByAdmin = (adminId: number) => {
  return mockAdminLogs.filter(log => log.adminId === adminId);
};

// 获取特定类型的系统日志
export const getSystemLogsByType = (logType: string) => {
  return mockSystemLogs.filter(log => log.logType === logType);
};

// 获取特定级别的系统日志
export const getSystemLogsByLevel = (level: string) => {
  return mockSystemLogs.filter(log => log.level === level);
};
