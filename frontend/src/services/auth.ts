import { request } from './api';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
} from '@/types/api';

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
  logout: (userId: number) => request.post('/auth/logout', { userId }),

  // 获取当前用户信息
  getCurrentUser: () => request.get<User>('/users/me'),

  // 修改密码
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => request.put('/users/me/password', data),

  // 检查用户名是否可用
  checkUsername: (username: string) =>
    request.get<boolean>('/auth/check-username', { params: { username } }),

  // 检查邮箱是否可用
  checkEmail: (email: string) =>
    request.get<boolean>('/auth/check-email', { params: { email } }),

  // 获取活跃用户数量
  getActiveUserCount: () => request.get<number>('/auth/stats/active-users'),
};
