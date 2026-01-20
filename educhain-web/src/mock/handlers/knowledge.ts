/**
 * 知识内容相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import { isValidMockShareCode } from '../utils/shareCode';
import { mockKnowledgeItems, mockKnowledgeStats } from '../data/knowledge';
import { mockUsers } from '../data/users';

export const knowledgeHandlers = [
  // 获取知识列表
  http.get(`${API_BASE}/knowledge`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;
    const categoryId = url.searchParams.get('categoryId');

    let items = [...mockKnowledgeItems];

    if (categoryId) {
      items = items.filter(item => item.categoryId === Number(categoryId));
    }

    items = items.map(item => ({
      ...item,
      stats: mockKnowledgeStats[item.id],
    }));

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 通过分享码获取知识详情
  http.get(`${API_BASE}/knowledge/share/:shareCode`, async ({ params }) => {
    await delay();
    const { shareCode } = params;

    if (!isValidMockShareCode(shareCode as string)) {
      return HttpResponse.json(
        { success: false, message: '无效的分享码格式', data: null },
        { status: 400 }
      );
    }

    const knowledge = mockKnowledgeItems.find(k => k.shareCode === shareCode);

    if (knowledge) {
      return HttpResponse.json(
        createSuccessResponse({
          ...knowledge,
          stats: mockKnowledgeStats[knowledge.id],
        })
      );
    }

    return HttpResponse.json(
      { success: false, message: '内容不存在', data: null },
      { status: 404 }
    );
  }),

  // 通过 ID 获取知识详情
  http.get(`${API_BASE}/knowledge/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const knowledge = mockKnowledgeItems.find(k => k.id === Number(id));

    if (knowledge) {
      return HttpResponse.json(
        createSuccessResponse({
          ...knowledge,
          stats: mockKnowledgeStats[knowledge.id],
        })
      );
    }

    return HttpResponse.json(
      { success: false, message: '内容不存在', data: null },
      { status: 404 }
    );
  }),

  // 创建知识
  http.post(`${API_BASE}/knowledge`, async ({ request }) => {
    await delay();
    const data = (await request.json()) as Record<string, unknown>;
    const newKnowledge = {
      id: mockKnowledgeItems.length + 1,
      ...data,
      uploaderId: 2,
      uploaderName: '张三',
      uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
      status: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockKnowledgeItems.push(newKnowledge as (typeof mockKnowledgeItems)[0]);
    return HttpResponse.json(createSuccessResponse(newKnowledge), { status: 201 });
  }),

  // 更新知识
  http.put(`${API_BASE}/knowledge/:id`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const data = (await request.json()) as Record<string, unknown>;
    const index = mockKnowledgeItems.findIndex(k => k.id === Number(id));

    if (index !== -1) {
      mockKnowledgeItems[index] = {
        ...mockKnowledgeItems[index],
        ...data,
        updatedAt: new Date().toISOString(),
      } as (typeof mockKnowledgeItems)[0];
      return HttpResponse.json(createSuccessResponse(mockKnowledgeItems[index]));
    }

    return HttpResponse.json(
      { success: false, message: '内容不存在', data: null },
      { status: 404 }
    );
  }),

  // 删除知识
  http.delete(`${API_BASE}/knowledge/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const index = mockKnowledgeItems.findIndex(k => k.id === Number(id));

    if (index !== -1) {
      mockKnowledgeItems.splice(index, 1);
      return HttpResponse.json(createSuccessResponse(null));
    }

    return HttpResponse.json(
      { success: false, message: '内容不存在', data: null },
      { status: 404 }
    );
  }),

  // 获取热门内容
  http.get(`${API_BASE}/knowledge/popular`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const items = [...mockKnowledgeItems]
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }))
      .sort((a, b) => (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0));

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取最新内容
  http.get(`${API_BASE}/knowledge/latest`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const items = [...mockKnowledgeItems]
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取用户的知识内容
  http.get(`${API_BASE}/knowledge/user/:userId`, async ({ params, request }) => {
    await delay();
    const { userId } = params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const items = mockKnowledgeItems
      .filter(k => k.uploaderId === Number(userId))
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取分类下的知识内容
  http.get(`${API_BASE}/knowledge/category/:categoryId`, async ({ params, request }) => {
    await delay();
    const { categoryId } = params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const items = mockKnowledgeItems
      .filter(k => k.categoryId === Number(categoryId))
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取相关内容
  http.get(`${API_BASE}/knowledge/:id/related`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    const currentItem = mockKnowledgeItems.find(k => k.id === Number(id));
    const items = mockKnowledgeItems
      .filter(k => k.id !== Number(id) && k.categoryId === currentItem?.categoryId)
      .slice(0, limit)
      .map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    return HttpResponse.json(createSuccessResponse(items));
  }),

  // 搜索知识
  http.get(`${API_BASE}/knowledge/search`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;
    const sort = url.searchParams.get('sort') || 'TIME';

    // 搜索逻辑：匹配标题、内容、标签
    let items = mockKnowledgeItems.filter(item => {
      const searchText = keyword.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchText);
      const contentMatch = item.content?.toLowerCase().includes(searchText);
      const tagsMatch = item.tags?.toLowerCase().includes(searchText);
      
      return titleMatch || contentMatch || tagsMatch;
    }).map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    // 排序
    if (sort === 'TIME') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'POPULARITY') {
      items.sort((a, b) => (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0));
    } else if (sort === 'RELEVANCE') {
      // 相关性排序：标题匹配权重最高
      items.sort((a, b) => {
        const searchText = keyword.toLowerCase();
        const aScore = (a.title.toLowerCase().includes(searchText) ? 10 : 0) +
                      (a.content?.toLowerCase().includes(searchText) ? 5 : 0) +
                      (a.tags?.toLowerCase().includes(searchText) ? 3 : 0);
        const bScore = (b.title.toLowerCase().includes(searchText) ? 10 : 0) +
                      (b.content?.toLowerCase().includes(searchText) ? 5 : 0) +
                      (b.tags?.toLowerCase().includes(searchText) ? 3 : 0);
        return bScore - aScore;
      });
    }

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 高级搜索（支持多条件组合）
  http.post(`${API_BASE}/knowledge/advanced-search`, async ({ request }) => {
    await delay();
    const body = await request.json() as {
      keyword?: string;
      categoryId?: number;
      type?: string;
      tags?: string[];
      page?: number;
      size?: number;
      sort?: string;
    };

    const {
      keyword = '',
      categoryId,
      type,
      tags = [],
      page = 0,
      size = 10,
      sort = 'TIME',
    } = body;

    // 多条件筛选
    let items = mockKnowledgeItems.filter(item => {
      // 关键词匹配（标题、内容、标签）
      let keywordMatch = true;
      if (keyword) {
        const searchText = keyword.toLowerCase();
        keywordMatch = 
          item.title.toLowerCase().includes(searchText) ||
          item.content?.toLowerCase().includes(searchText) ||
          item.tags?.toLowerCase().includes(searchText);
      }

      // 分类匹配
      let categoryMatch = true;
      if (categoryId) {
        categoryMatch = item.categoryId === categoryId;
      }

      // 类型匹配
      let typeMatch = true;
      if (type) {
        typeMatch = item.type === type;
      }

      // 标签匹配（只要包含任一标签即可）
      let tagsMatch = true;
      if (tags.length > 0) {
        const itemTags = item.tags?.toLowerCase() || '';
        tagsMatch = tags.some(tag => itemTags.includes(tag.toLowerCase()));
      }

      return keywordMatch && categoryMatch && typeMatch && tagsMatch;
    }).map(item => ({ ...item, stats: mockKnowledgeStats[item.id] }));

    // 排序
    if (sort === 'TIME') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'POPULARITY') {
      items.sort((a, b) => (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0));
    } else if (sort === 'RELEVANCE') {
      // 相关性排序：标题匹配权重最高
      items.sort((a, b) => {
        const searchText = keyword.toLowerCase();
        const aScore = (a.title.toLowerCase().includes(searchText) ? 10 : 0) +
                      (a.content?.toLowerCase().includes(searchText) ? 5 : 0) +
                      (a.tags?.toLowerCase().includes(searchText) ? 3 : 0);
        const bScore = (b.title.toLowerCase().includes(searchText) ? 10 : 0) +
                      (b.content?.toLowerCase().includes(searchText) ? 5 : 0) +
                      (b.tags?.toLowerCase().includes(searchText) ? 3 : 0);
        return bScore - aScore;
      });
    }

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),
];
