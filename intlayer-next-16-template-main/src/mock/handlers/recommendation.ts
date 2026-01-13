/**
 * 推荐相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse } from '../utils/response';
import { mockKnowledgeItems, mockKnowledgeStats } from '../data/knowledge';

export const recommendationHandlers = [
  // 获取推荐内容
  http.get(`${API_BASE}/recommendations`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    const items = [...mockKnowledgeItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    return HttpResponse.json(createSuccessResponse(items));
  }),

  // 获取个性化推荐
  http.get(`${API_BASE}/recommendations/personalized`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    const items = [...mockKnowledgeItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    return HttpResponse.json(createSuccessResponse(items));
  }),

  // 获取热门内容
  http.get(`${API_BASE}/recommendations/trending`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    const items = [...mockKnowledgeItems]
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }))
      .sort((a, b) => {
        const scoreA = (a.stats?.viewCount || 0) + (a.stats?.likeCount || 0) * 3;
        const scoreB = (b.stats?.viewCount || 0) + (b.stats?.likeCount || 0) * 3;
        return scoreB - scoreA;
      })
      .slice(0, limit);

    return HttpResponse.json(createSuccessResponse(items));
  }),

  // 获取相似内容推荐
  http.get(`${API_BASE}/recommendations/similar/:id`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 5;

    const currentItem = mockKnowledgeItems.find(k => k.id === Number(id));
    const items = mockKnowledgeItems
      .filter(k => k.id !== Number(id) && k.categoryId === currentItem?.categoryId)
      .slice(0, limit)
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    return HttpResponse.json(createSuccessResponse(items));
  }),

  // 推荐反馈
  http.post(`${API_BASE}/recommendations/feedback`, async ({ request }) => {
    await delay();
    const body = (await request.json()) as {
      knowledgeId: number;
      feedback: 'like' | 'dislike' | 'not_interested';
    };

    console.log('推荐反馈:', body);

    return HttpResponse.json(
      createSuccessResponse({
        success: true,
        message: '反馈已记录',
      })
    );
  }),
];
