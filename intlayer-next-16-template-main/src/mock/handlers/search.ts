/**
 * 搜索相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import { validateSearchKeyword, validatePagination, validate } from '../utils/validation';
import { mockKnowledgeItems, mockKnowledgeStats } from '../data/knowledge';
import { mockHotKeywords, getUserSearchHistory, getSearchSuggestions } from '../data/search';

export const searchHandlers = [
  // 基础搜索
  http.post(`${API_BASE}/search`, async ({ request }) => {
    await delay();
    const body = (await request.json()) as {
      keyword: string;
      page?: number;
      size?: number;
    };
    const { keyword, page = 0, size = 10 } = body;

    const validationError = validate(
      () => validateSearchKeyword(keyword),
      () => validatePagination(page, size)
    );

    if (validationError) {
      return HttpResponse.json(validationError, { status: 400 });
    }

    const items = mockKnowledgeItems
      .filter(
        item =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.content.toLowerCase().includes(keyword.toLowerCase()) ||
          item.tags.toLowerCase().includes(keyword.toLowerCase())
      )
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 高级搜索
  http.post(`${API_BASE}/search/advanced`, async ({ request }) => {
    await delay();
    const body = (await request.json()) as {
      keyword?: string;
      categoryId?: number;
      type?: string;
      sortBy?: string;
      page?: number;
      size?: number;
    };
    const { keyword = '', categoryId, type, sortBy = 'RELEVANCE', page = 0, size = 20 } = body;

    let items = [...mockKnowledgeItems];

    if (keyword) {
      items = items.filter(
        item =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.content.toLowerCase().includes(keyword.toLowerCase()) ||
          item.tags.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (categoryId) {
      items = items.filter(item => item.categoryId === categoryId);
    }

    if (type) {
      items = items.filter(item => item.type === type);
    }

    items = items.map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    if (sortBy === 'TIME') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'POPULARITY') {
      items.sort((a, b) => (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0));
    }

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取热门关键词
  http.get(`${API_BASE}/search/hot-keywords`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    const keywords = mockHotKeywords.slice(0, limit);
    return HttpResponse.json(createSuccessResponse(keywords));
  }),

  // 获取搜索建议
  http.get(`${API_BASE}/search/suggestions`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const suggestions = getSearchSuggestions(keyword);
    return HttpResponse.json(createSuccessResponse(suggestions));
  }),

  // 获取搜索历史
  http.get(`${API_BASE}/search/history`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 20;
    const history = getUserSearchHistory(2, limit);
    return HttpResponse.json(createSuccessResponse(history));
  }),

  // 清除搜索历史
  http.delete(`${API_BASE}/search/history`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 删除单个搜索历史
  http.delete(`${API_BASE}/search/history/:id`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),
];
