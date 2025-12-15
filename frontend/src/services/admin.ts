/**
 * 管理员相关服务
 * 支持mock和生产环境自动切换
 */

import { request } from './api';
import type {
  ApiResponse,
  PageResponse,
  User,
  Category,
  CategoryDetail,
  KnowledgeItem,
} from '@/types/api';

// 仪表盘统计数据类型
export interface DashboardStats {
  totalUsers: number;
  totalKnowledge: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  activeUsers: number;
  newUsersToday: number;
  newKnowledgeToday: number;
  userGrowth: number;
  knowledgeGrowth: number;
}

// 热门内容类型
export interface PopularContent {
  id: number;
  shareCode: string;
  title: string;
  author: string;
  authorId: number;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  category: string;
}

// 活跃用户类型
export interface ActiveUser {
  id: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  level: number;
  contributionScore: number;
  lastActiveAt: string;
  todayActions: number;
}

// 用户详细统计信息
export interface UserDetailStats {
  knowledgeCount: number;
  likeCount: number;
  favoriteCount: number;
  followingCount: number;
  followerCount: number;
  viewCount: number;
  commentCount: number;
}

// 系统日志类型
export interface SystemLog {
  id: number;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  source: string;
  timestamp: string;
  details?: string;
}

// 操作日志类型
export interface OperationLog {
  id: number;
  adminId: number;
  adminName: string;
  operationType: string;
  operationTarget: string;
  operationDetails: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// 系统告警类型
export interface SystemAlert {
  id: number;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  createdAt: string;
  resolved: boolean;
  priority: 'high' | 'medium' | 'low';
}

// 系统性能指标
export interface SystemMetrics {
  cpu: {
    usage: number;
    trend: 'up' | 'down' | 'stable';
  };
  memory: {
    usage: number;
    total: number;
    trend: 'up' | 'down' | 'stable';
  };
  storage: {
    usage: number;
    total: number;
    trend: 'up' | 'down' | 'stable';
  };
  network: {
    inbound: number;
    outbound: number;
  };
}

/**
 * 管理员服务
 */
export const adminService = {
  // 获取仪表盘统计数据
  getDashboardStats: (): Promise<ApiResponse<DashboardStats>> =>
    request.get('/admin/dashboard/stats'),

  // 获取热门内容
  getPopularContent: (
    limit: number = 10
  ): Promise<ApiResponse<PopularContent[]>> =>
    request.get('/admin/dashboard/popular-content', {
      params: { limit },
    }),

  // 获取活跃用户
  getActiveUsers: (limit: number = 10): Promise<ApiResponse<ActiveUser[]>> =>
    request.get('/admin/dashboard/active-users', {
      params: { limit },
    }),

  // 获取系统告警
  getSystemAlerts: (
    resolved?: boolean
  ): Promise<ApiResponse<SystemAlert[]>> => {
    const params: Record<string, boolean> = {};
    if (resolved !== undefined) {
      params.resolved = resolved;
    }
    return request.get('/admin/dashboard/system-alerts', { params });
  },

  // 获取系统性能指标
  getSystemMetrics: (): Promise<ApiResponse<SystemMetrics>> =>
    request.get('/admin/dashboard/system-metrics'),

  // 标记告警为已处理
  resolveAlert: (alertId: number): Promise<ApiResponse<{ success: boolean }>> =>
    request.put(`/admin/dashboard/alerts/${alertId}/resolve`),

  // 获取用户列表
  getUsers: (params: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    status?: number;
  }): Promise<ApiResponse<PageResponse<User>>> =>
    request.get('/admin/users', { params }),

  // 更新用户状态
  updateUserStatus: (
    userId: number,
    status: number
  ): Promise<ApiResponse<void>> =>
    request.put(`/admin/users/${userId}/status`, { status }),

  // 重置用户密码
  resetUserPassword: (
    userId: number
  ): Promise<ApiResponse<{ newPassword: string }>> =>
    request.post(`/admin/users/${userId}/reset-password`),

  // 获取知识内容列表
  getKnowledgeList: (params: {
    page?: number;
    size?: number;
    search?: string;
    categoryId?: number;
    status?: number;
  }): Promise<ApiResponse<PageResponse<KnowledgeItem>>> =>
    request.get('/admin/knowledge', { params }),

  // 审核知识内容
  reviewKnowledge: (
    knowledgeId: number,
    status: number,
    reason?: string
  ): Promise<ApiResponse<void>> =>
    request.put(`/admin/knowledge/${knowledgeId}/review`, { status, reason }),

  // 删除知识内容
  deleteKnowledge: (knowledgeId: number): Promise<ApiResponse<void>> =>
    request.delete(`/admin/knowledge/${knowledgeId}`),

  // 获取系统日志
  getSystemLogs: (params: {
    page?: number;
    size?: number;
    level?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PageResponse<SystemLog>>> =>
    request.get('/admin/logs', { params }),

  // 获取操作日志
  getOperationLogs: (params: {
    page?: number;
    size?: number;
    adminId?: number;
    operationType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PageResponse<OperationLog>>> =>
    request.get('/admin/operation-logs', { params }),

  // ==================== 用户管理相关 ====================

  // 获取用户列表（管理员专用，包含更多信息）
  getAdminUsers: (params: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    status?: number;
  }): Promise<ApiResponse<PageResponse<User>>> =>
    request.get('/admin/users', { params }),

  // 创建用户
  createUser: (userData: {
    username: string;
    email: string;
    fullName: string;
    school?: string;
    role: 'LEARNER' | 'ADMIN';
    status: number;
    bio?: string;
    password: string;
  }): Promise<ApiResponse<User>> => request.post('/admin/users', userData),

  // 更新用户信息
  updateUser: (
    userId: number,
    userData: {
      username?: string;
      email?: string;
      fullName?: string;
      school?: string;
      role?: 'LEARNER' | 'ADMIN';
      status?: number;
      bio?: string;
    }
  ): Promise<ApiResponse<User>> =>
    request.put(`/admin/users/${userId}`, userData),

  // 删除用户
  deleteUser: (userId: number): Promise<ApiResponse<void>> =>
    request.delete(`/admin/users/${userId}`),

  // 批量删除用户
  batchDeleteUsers: (userIds: number[]): Promise<ApiResponse<void>> =>
    request.post('/admin/users/batch-delete', { userIds }),

  // 获取用户详细信息（包含统计数据）
  getUserDetail: (
    userId: number
  ): Promise<ApiResponse<User & { stats: UserDetailStats }>> =>
    request.get(`/admin/users/${userId}/detail`),

  // ==================== 分类管理相关 ====================

  // 获取分类列表（管理员专用，包含更多信息）
  getAdminCategories: (params?: {
    page?: number;
    size?: number;
    search?: string;
    parentId?: number;
  }): Promise<ApiResponse<PageResponse<Category>>> =>
    request.get('/admin/categories', { params }),

  // 获取分类树
  getCategoryTree: (): Promise<ApiResponse<Category[]>> =>
    request.get('/admin/categories/tree'),

  // 创建分类
  createCategory: (categoryData: {
    name: string;
    description?: string;
    parentId?: number;
    sortOrder?: number;
  }): Promise<ApiResponse<Category>> =>
    request.post('/admin/categories', categoryData),

  // 更新分类
  updateCategory: (
    categoryId: number,
    categoryData: {
      name?: string;
      description?: string;
      parentId?: number;
      sortOrder?: number;
    }
  ): Promise<ApiResponse<Category>> =>
    request.put(`/admin/categories/${categoryId}`, categoryData),

  // 删除分类
  deleteCategory: (categoryId: number): Promise<ApiResponse<void>> =>
    request.delete(`/admin/categories/${categoryId}`),

  // 批量删除分类
  batchDeleteCategories: (categoryIds: number[]): Promise<ApiResponse<void>> =>
    request.post('/admin/categories/batch-delete', { categoryIds }),

  // 移动分类（调整父分类或排序）
  moveCategory: (
    categoryId: number,
    targetParentId?: number,
    sortOrder?: number
  ): Promise<ApiResponse<void>> =>
    request.put(`/admin/categories/${categoryId}/move`, {
      parentId: targetParentId,
      sortOrder,
    }),

  // 获取分类详情（包含子分类和知识数量统计）
  getCategoryDetail: (
    categoryId: number
  ): Promise<ApiResponse<CategoryDetail>> =>
    request.get(`/admin/categories/${categoryId}/detail`),
};
