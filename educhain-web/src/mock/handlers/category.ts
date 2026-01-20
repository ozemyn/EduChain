/**
 * 分类相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse } from '../utils/response';
import { mockCategories, mockCategoryTree } from '../data/categories';

export const categoryHandlers = [
  // 获取分类列表
  http.get(`${API_BASE}/categories`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse(mockCategories));
  }),

  // 获取分类树
  http.get(`${API_BASE}/categories/tree`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse(mockCategoryTree));
  }),

  // 获取分类详情
  http.get(`${API_BASE}/categories/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const category = mockCategories.find(c => c.id === Number(id));

    if (category) {
      return HttpResponse.json(createSuccessResponse(category));
    }

    return HttpResponse.json(
      { success: false, message: '分类不存在', data: null },
      { status: 404 }
    );
  }),

  // 获取分类统计
  http.get(`${API_BASE}/categories/:id/stats`, async ({ params }) => {
    await delay();
    const { id } = params;
    const category = mockCategories.find(c => c.id === Number(id));

    if (category) {
      return HttpResponse.json(
        createSuccessResponse({
          knowledgeCount: category.knowledgeCount || 0,
          totalViews: Math.floor(Math.random() * 10000) + 1000,
        })
      );
    }

    return HttpResponse.json(
      { success: false, message: '分类不存在', data: null },
      { status: 404 }
    );
  }),
];
