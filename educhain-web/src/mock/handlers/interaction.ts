/**
 * 互动相关 Mock Handlers (点赞/收藏/浏览)
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import { mockInteractionStats, mockInteractions } from '../data/interactions';

export const interactionHandlers = [
  // 点赞
  http.post(`${API_BASE}/interactions/like/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const stats = mockInteractionStats[Number(id)];
    if (stats) {
      stats.likeCount++;
    }
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 取消点赞
  http.delete(`${API_BASE}/interactions/like/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const stats = mockInteractionStats[Number(id)];
    if (stats) {
      stats.likeCount = Math.max(0, stats.likeCount - 1);
    }
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 收藏
  http.post(`${API_BASE}/interactions/favorite/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const stats = mockInteractionStats[Number(id)];
    if (stats) {
      stats.favoriteCount++;
    }
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 取消收藏
  http.delete(`${API_BASE}/interactions/favorite/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const stats = mockInteractionStats[Number(id)];
    if (stats) {
      stats.favoriteCount = Math.max(0, stats.favoriteCount - 1);
    }
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 分享
  http.post(`${API_BASE}/interactions/share`, async ({ request }) => {
    await delay();
    const { knowledgeId } = (await request.json()) as { knowledgeId: number };
    const stats = mockInteractionStats[knowledgeId];
    if (stats) {
      stats.shareCount++;
    }
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 获取互动统计
  http.get(`${API_BASE}/interactions/stats/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const stats = mockInteractionStats[Number(id)];
    return HttpResponse.json(createSuccessResponse(stats));
  }),

  // 记录浏览行为
  http.post(`${API_BASE}/interactions/view/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const stats = mockInteractionStats[Number(id)];
    if (stats) {
      stats.viewCount++;
    }
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 检查用户互动状态
  http.get(`${API_BASE}/interactions/status/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const numId = Number(id);
    const status = {
      hasLiked: numId % 3 === 0,
      hasFavorited: numId % 5 === 0,
    };
    return HttpResponse.json(createSuccessResponse(status));
  }),

  // 获取用户互动记录
  http.get(`${API_BASE}/interactions/user`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;
    const type = url.searchParams.get('type');

    let items = mockInteractions.filter(i => i.userId === 2);
    if (type) {
      items = items.filter(i => i.interactionType === type);
    }

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取用户点赞列表
  http.get(`${API_BASE}/interactions/likes`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const items = mockInteractions.filter(
      i => i.userId === 2 && i.interactionType === 'LIKE'
    );

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取用户收藏列表
  http.get(`${API_BASE}/interactions/favorites`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const items = mockInteractions.filter(
      i => i.userId === 2 && i.interactionType === 'FAVORITE'
    );

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),
];
