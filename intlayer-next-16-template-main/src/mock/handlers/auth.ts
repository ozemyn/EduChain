/**
 * 认证相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse } from '../utils/response';
import { createErrorResponse } from '../errors';
import {
  validateRequired,
  validateEmail,
  validateUsername,
  validateStringLength,
  validate,
} from '../utils/validation';
import { mockUsers } from '../data/users';

export const authHandlers = [
  // 用户登录
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay();
    const body = (await request.json()) as {
      usernameOrEmail: string;
      password: string;
    };
    const { usernameOrEmail, password } = body;

    const user = mockUsers.find(
      u =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
        password
    );

    if (user) {
      return HttpResponse.json(
        createSuccessResponse({
          accessToken: 'mock_access_token_' + user.id,
          refreshToken: 'mock_refresh_token_' + user.id,
          user,
          expiresIn: 3600,
        })
      );
    }

    return HttpResponse.json(createErrorResponse('INVALID_CREDENTIALS'), {
      status: 401,
    });
  }),

  // 用户注册
  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    await delay();
    const userData = (await request.json()) as {
      username: string;
      email: string;
      password: string;
      fullName: string;
      school?: string;
    };

    const validationError = validate(
      () => validateRequired(userData, ['username', 'email', 'password', 'fullName']),
      () => validateUsername(userData.username),
      () => validateEmail(userData.email),
      () => validateStringLength(userData.password, '密码', 6, 50),
      () => validateStringLength(userData.fullName, '姓名', 1, 50)
    );

    if (validationError) {
      return HttpResponse.json(validationError, { status: 400 });
    }

    const existingUser = mockUsers.find(
      u => u.username === userData.username || u.email === userData.email
    );

    if (existingUser) {
      if (existingUser.username === userData.username) {
        return HttpResponse.json(
          createErrorResponse('DUPLICATE_ENTRY', '用户名已存在'),
          { status: 400 }
        );
      } else {
        return HttpResponse.json(
          createErrorResponse('DUPLICATE_ENTRY', '邮箱已存在'),
          { status: 400 }
        );
      }
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      level: 1,
      role: 'LEARNER' as const,
      status: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser as (typeof mockUsers)[0]);
    return HttpResponse.json(createSuccessResponse(newUser), { status: 201 });
  }),

  // 获取当前用户信息
  http.get(`${API_BASE}/users/me`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse(mockUsers[1]));
  }),

  // 刷新 Token
  http.post(`${API_BASE}/auth/refresh`, async ({ request }) => {
    await delay();
    const body = (await request.json()) as { refreshToken: string };
    
    if (body.refreshToken) {
      return HttpResponse.json(
        createSuccessResponse({
          accessToken: 'mock_new_access_token',
          refreshToken: 'mock_new_refresh_token',
          expiresIn: 3600,
        })
      );
    }

    return HttpResponse.json(createErrorResponse('UNAUTHORIZED'), { status: 401 });
  }),

  // 检查用户名是否可用
  http.get(`${API_BASE}/auth/check-username`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    const exists = mockUsers.some(u => u.username === username);
    return HttpResponse.json(createSuccessResponse(!exists));
  }),

  // 检查邮箱是否可用
  http.get(`${API_BASE}/auth/check-email`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const exists = mockUsers.some(u => u.email === email);
    return HttpResponse.json(createSuccessResponse(!exists));
  }),
];
