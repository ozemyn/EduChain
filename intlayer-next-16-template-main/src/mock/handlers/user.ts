/**
 * 用户相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import { mockUsers, mockUserStats } from '../data/users';

export const userHandlers = [
  // 根据 ID 获取用户信息
  http.get(`${API_BASE}/users/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const user = mockUsers.find(u => u.id === Number(id));

    if (user) {
      return HttpResponse.json(createSuccessResponse(user));
    }

    return HttpResponse.json(
      { success: false, message: '用户不存在', data: null },
      { status: 404 }
    );
  }),

  // 获取用户统计信息
  http.get(`${API_BASE}/users/:id/stats`, async ({ params }) => {
    await delay();
    const { id } = params;
    const stats = mockUserStats[Number(id)];
    return HttpResponse.json(createSuccessResponse(stats));
  }),

  // 获取当前用户统计
  http.get(`${API_BASE}/users/me/stats`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse(mockUserStats[2]));
  }),

  // 更新用户信息
  http.put(`${API_BASE}/users/me`, async ({ request }) => {
    await delay();
    const data = (await request.json()) as Record<string, unknown>;
    const user = { ...mockUsers[1], ...data, updatedAt: new Date().toISOString() };
    return HttpResponse.json(createSuccessResponse(user));
  }),

  // 修改密码
  http.put(`${API_BASE}/users/me/password`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 搜索用户
  http.get(`${API_BASE}/users/search`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filtered = mockUsers.filter(
      u =>
        u.username.toLowerCase().includes(keyword.toLowerCase()) ||
        u.fullName.toLowerCase().includes(keyword.toLowerCase())
    );

    const pageData = createPageResponse(filtered, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取所有用户
  http.get(`${API_BASE}/users`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const pageData = createPageResponse(mockUsers, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 根据用户名获取用户
  http.get(`${API_BASE}/users/username/:username`, async ({ params }) => {
    await delay();
    const { username } = params;
    const user = mockUsers.find(u => u.username === username);

    if (user) {
      return HttpResponse.json(createSuccessResponse(user));
    }

    return HttpResponse.json(
      { success: false, message: '用户不存在', data: null },
      { status: 404 }
    );
  }),
];
