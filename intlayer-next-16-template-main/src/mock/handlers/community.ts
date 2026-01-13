/**
 * 社区相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse } from '../utils/response';
import {
  mockCommunityFeed,
  mockDiscussions,
  mockActiveUsers,
  mockHotTopics,
  mockCommunityStats,
} from '../data/community';

export const communityHandlers = [
  // 获取社区动态聚合数据
  http.get(`${API_BASE}/community/feed`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse(mockCommunityFeed));
  }),

  // 获取热门讨论列表
  http.get(`${API_BASE}/community/discussions/hot`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    return HttpResponse.json(createSuccessResponse(mockDiscussions.slice(0, limit)));
  }),

  // 获取最新讨论列表
  http.get(`${API_BASE}/community/discussions/new`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    return HttpResponse.json(createSuccessResponse(mockDiscussions.slice(0, limit)));
  }),

  // 获取趋势讨论列表
  http.get(`${API_BASE}/community/discussions/trending`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    return HttpResponse.json(createSuccessResponse(mockDiscussions.slice(0, limit)));
  }),

  // 获取活跃用户列表
  http.get(`${API_BASE}/community/users/active`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    return HttpResponse.json(createSuccessResponse(mockActiveUsers.slice(0, limit)));
  }),

  // 获取热门话题标签
  http.get(`${API_BASE}/community/topics/hot`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    return HttpResponse.json(createSuccessResponse(mockHotTopics.slice(0, limit)));
  }),

  // 获取社区统计数据
  http.get(`${API_BASE}/community/stats`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse(mockCommunityStats));
  }),
];
