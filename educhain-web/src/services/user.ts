/**
 * 用户服务
 */

import { request } from './api';
import type { PageRequest, PageResponse, User, UserStats, UserFollow } from '../types/api';

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
  school?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userService = {
  // 获取当前用户信息
  getCurrentUser: () => request.get<User>('/users/me'),

  // 更新用户信息
  updateProfile: (data: UpdateProfileRequest) =>
    request.put<User>('/users/me', data),

  // 修改密码
  changePassword: (data: ChangePasswordRequest) =>
    request.put('/users/me/password', data),

  // 获取当前用户统计
  getCurrentUserStats: () => request.get<UserStats>('/users/me/stats'),

  // 根据ID获取用户信息
  getUserById: (userId: number) => request.get<User>(`/users/${userId}`),

  // 根据用户名获取用户信息
  getUserByUsername: (username: string) =>
    request.get<User>(`/users/username/${username}`),

  // 获取用户统计信息
  getUserStats: (userId: number) =>
    request.get<UserStats>(`/users/${userId}/stats`),

  // 搜索用户
  searchUsers: (keyword: string, params?: PageRequest) =>
    request.get<PageResponse<User>>('/users/search', { keyword, ...params }),

  // 获取所有用户（管理员权限）
  getAllUsers: (params?: PageRequest) =>
    request.get<PageResponse<User>>('/users', params),

  // 根据角色获取用户（管理员权限）
  getUsersByRole: (role: string, params?: PageRequest) =>
    request.get<PageResponse<User>>(`/users/role/${role}`, params),

  // 更新用户状态（管理员权限）
  updateUserStatus: (userId: number, status: number) =>
    request.put(`/users/${userId}/status`, { status }),
};

export const followService = {
  // 关注用户
  followUser: (userId: number) => request.post('/users/follow', { userId }),

  // 取消关注
  unfollowUser: (userId: number) =>
    request.delete('/users/follow', { userId }),

  // 获取关注列表
  getFollowing: (userId?: number, params?: PageRequest) =>
    request.get<PageResponse<UserFollow>>('/users/following', { userId, ...params }),

  // 获取粉丝列表
  getFollowers: (userId?: number, params?: PageRequest) =>
    request.get<PageResponse<UserFollow>>('/users/followers', { userId, ...params }),

  // 检查是否关注
  checkFollowStatus: (userId: number) =>
    request.get<boolean>(`/users/follow/status/${userId}`),

  // 获取关注统计
  getFollowStats: (userId: number) =>
    request.get<{ followerCount: number; followingCount: number }>(
      `/users/follow/stats/${userId}`
    ),

  // 获取互相关注的用户
  getMutualFollows: (params?: PageRequest) =>
    request.get<PageResponse<User>>('/users/follow/mutual', params),

  // 获取推荐关注用户
  getRecommendedUsers: (limit: number = 10) =>
    request.get<User[]>('/users/follow/recommendations', { limit }),
};
