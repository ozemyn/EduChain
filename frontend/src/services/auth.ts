import { request } from './api';
import type { LoginRequest, RegisterRequest, LoginResponse, User } from '@/types/api';

export const authService = {
  // 用户登录
  login: (data: LoginRequest) =>
    request.post<LoginResponse>('/auth/login', data),

  // 用户注册
  register: (data: RegisterRequest) =>
    request.post<User>('/auth/register', data),

  // 刷新token
  refreshToken: (refreshToken: string) =>
    request.post<LoginResponse>('/auth/refresh', { refreshToken }),

  // 登出
  logout: () => request.post('/auth/logout'),

  // 获取当前用户信息
  getCurrentUser: () => request.get<User>('/auth/me'),

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    request.post('/auth/change-password', data),
};
