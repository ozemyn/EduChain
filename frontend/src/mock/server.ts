/**
 * Mock 服务器配置
 * 使用 MSW 2.0 (Mock Service Worker) 拦截 API 请求
 */

import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import type { ApiResponse, PageResponse } from '@/types/api';
import { createErrorResponse } from './errorCodes';
import {
  mockUsers,
  mockUserStats,
  mockCategories,
  mockCategoryTree,
  mockKnowledgeItems,
  mockKnowledgeStats,
  mockComments,
  mockNotifications,
  mockInteractionStats,
  mockFollows,
  mockBlocks,
  mockBlockchainOverview,
  mockCertificates,
  mockHotKeywords,
  getFollowing,
  getFollowers,
  isFollowing,
  getCertificateByKnowledgeId,
  verifyCertificate,
  getUserSearchHistory,
  getSearchSuggestions,
} from './data';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// 辅助函数：创建成功响应
const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: '操作成功',
  data,
  timestamp: new Date().toISOString(),
});

// 辅助函数：创建分页响应（与后端Spring Data Page格式完全一致）
const createPageResponse = <T>(
  items: T[],
  page: number = 0,
  size: number = 10
): PageResponse<T> => {
  const start = page * size;
  const end = start + size;
  const content = items.slice(start, end);

  return {
    content,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    size,
    number: page,
    first: page === 0,
    last: end >= items.length,
    empty: items.length === 0,
    // 添加Spring Data Page的其他字段以确保完全一致
    numberOfElements: content.length,
    pageable: {
      sort: {
        sorted: false,
        unsorted: true,
        empty: true,
      },
      pageNumber: page,
      pageSize: size,
      offset: start,
      paged: true,
      unpaged: false,
    },
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
  };
};

// 延迟函数，模拟网络延迟
const delay = (ms: number = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const setupMockServer = () => {
  const handlers = [
    // ==================== 认证相关 ====================
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

    http.post(`${API_BASE}/auth/register`, async ({ request }) => {
      await delay();
      const userData = (await request.json()) as {
        username: string;
        email: string;
        password: string;
        fullName: string;
        school?: string;
      };

      // 参数验证
      const {
        validateRequired,
        validateEmail,
        validateUsername,
        validateStringLength,
        validate,
      } = await import('./validation');

      const validationError = validate(
        () =>
          validateRequired(userData, [
            'username',
            'email',
            'password',
            'fullName',
          ]),
        () => validateUsername(userData.username),
        () => validateEmail(userData.email),
        () => validateStringLength(userData.password, '密码', 6, 50),
        () => validateStringLength(userData.fullName, '姓名', 1, 50)
      );

      if (validationError) {
        return HttpResponse.json(validationError, { status: 400 });
      }

      // 检查用户名和邮箱是否已存在
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

    http.get(`${API_BASE}/users/me`, async () => {
      await delay();
      return HttpResponse.json(createSuccessResponse(mockUsers[1]));
    }),

    // ==================== 用户相关 ====================
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

    http.get(`${API_BASE}/users/:id/stats`, async ({ params }) => {
      await delay();
      const { id } = params;
      const stats = mockUserStats[Number(id)];
      return HttpResponse.json(createSuccessResponse(stats));
    }),

    http.get(`${API_BASE}/users/me/stats`, async () => {
      await delay();
      return HttpResponse.json(createSuccessResponse(mockUserStats[2]));
    }),

    // ==================== 分类相关 ====================
    http.get(`${API_BASE}/categories`, async () => {
      await delay();
      return HttpResponse.json(createSuccessResponse(mockCategories));
    }),

    http.get(`${API_BASE}/categories/tree`, async () => {
      await delay();
      return HttpResponse.json(createSuccessResponse(mockCategoryTree));
    }),

    http.get(`${API_BASE}/categories/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const category = mockCategories.find(c => c.id === Number(id));
      return HttpResponse.json(createSuccessResponse(category));
    }),

    // ==================== 知识内容相关 ====================
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

      // 添加统计数据
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

      // 验证分享码格式
      const { isValidMockShareCode } = await import(
        './utils/shareCodeGenerator'
      );
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

    http.post(`${API_BASE}/knowledge`, async ({ request }) => {
      await delay();
      const data = (await request.json()) as Record<string, unknown>;
      const newKnowledge = {
        id: mockKnowledgeItems.length + 1,
        ...data,
        uploaderId: 2,
        uploaderName: '张三',
        uploaderAvatar:
          'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockKnowledgeItems.push(newKnowledge as (typeof mockKnowledgeItems)[0]);
      return HttpResponse.json(createSuccessResponse(newKnowledge), {
        status: 201,
      });
    }),

    http.get(`${API_BASE}/knowledge/popular`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;

      const items = [...mockKnowledgeItems]
        .map(item => ({
          ...item,
          stats: mockKnowledgeStats[item.id],
        }))
        .sort((a, b) => (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0));

      const pageData = createPageResponse(items, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.get(`${API_BASE}/knowledge/latest`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;

      const items = [...mockKnowledgeItems]
        .map(item => ({
          ...item,
          stats: mockKnowledgeStats[item.id],
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      const pageData = createPageResponse(items, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    // ==================== 评论相关 ====================
    http.get(`${API_BASE}/comments`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const knowledgeId = url.searchParams.get('knowledgeId');
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;

      let items = [...mockComments];

      if (knowledgeId) {
        items = items.filter(c => c.knowledgeId === Number(knowledgeId));
      }

      const pageData = createPageResponse(items, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.post(`${API_BASE}/comments`, async ({ request }) => {
      await delay();
      const data = (await request.json()) as Record<string, unknown>;
      const newComment = {
        id: mockComments.length + 1,
        ...data,
        userId: 2,
        user: mockUsers[1],
        status: 1,
        createdAt: new Date().toISOString(),
      };
      mockComments.push(newComment as (typeof mockComments)[0]);
      return HttpResponse.json(createSuccessResponse(newComment), {
        status: 201,
      });
    }),

    // ==================== 通知相关 ====================
    http.get(`${API_BASE}/notifications`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;
      const type = url.searchParams.get('type');
      const isRead = url.searchParams.get('isRead');

      let items = [...mockNotifications];

      if (type) {
        items = items.filter(n => n.type === type);
      }

      if (isRead !== null) {
        items = items.filter(n => n.isRead === (isRead === 'true'));
      }

      const pageData = createPageResponse(items, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.get(`${API_BASE}/notifications/unread/count`, async () => {
      await delay();
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      return HttpResponse.json(createSuccessResponse({ unreadCount }));
    }),

    http.put(`${API_BASE}/notifications/:id/read`, async ({ params }) => {
      await delay();
      const { id } = params;
      const notification = mockNotifications.find(n => n.id === Number(id));
      if (notification) {
        notification.isRead = true;
      }
      return HttpResponse.json(createSuccessResponse(notification));
    }),

    // 获取最近通知接口
    http.get(`${API_BASE}/notifications/recent`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;
      const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

      let notifications = [...mockNotifications];

      if (unreadOnly) {
        notifications = notifications.filter(n => !n.isRead);
      }

      // 按时间倒序排列，取最近的
      notifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const recentNotifications = notifications.slice(0, limit);

      return HttpResponse.json(createSuccessResponse(recentNotifications));
    }),

    // 获取通知统计接口
    http.get(`${API_BASE}/notifications/stats`, async () => {
      await delay();
      const totalNotifications = mockNotifications.length;
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      const readCount = totalNotifications - unreadCount;

      // 按类型统计
      const typeStats = mockNotifications.reduce(
        (acc, notification) => {
          acc[notification.type] = (acc[notification.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const stats = {
        totalNotifications,
        unreadCount,
        readCount,
        typeStats,
      };

      return HttpResponse.json(createSuccessResponse(stats));
    }),

    // ==================== 互动相关 ====================
    http.post(`${API_BASE}/interactions/like/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const stats = mockInteractionStats[Number(id)];
      if (stats) {
        stats.likeCount++;
      }
      return HttpResponse.json(createSuccessResponse({ success: true }));
    }),

    http.delete(`${API_BASE}/interactions/like/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const stats = mockInteractionStats[Number(id)];
      if (stats) {
        stats.likeCount = Math.max(0, stats.likeCount - 1);
      }
      return HttpResponse.json(createSuccessResponse({ success: true }));
    }),

    http.post(`${API_BASE}/interactions/favorite/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const stats = mockInteractionStats[Number(id)];
      if (stats) {
        stats.favoriteCount++;
      }
      return HttpResponse.json(createSuccessResponse({ success: true }));
    }),

    http.delete(`${API_BASE}/interactions/favorite/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const stats = mockInteractionStats[Number(id)];
      if (stats) {
        stats.favoriteCount = Math.max(0, stats.favoriteCount - 1);
      }
      return HttpResponse.json(createSuccessResponse({ success: true }));
    }),

    http.get(`${API_BASE}/interactions/stats/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const stats = mockInteractionStats[Number(id)];
      return HttpResponse.json(createSuccessResponse(stats));
    }),

    // 记录浏览行为接口
    http.post(`${API_BASE}/interactions/view/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const stats = mockInteractionStats[Number(id)];
      if (stats) {
        stats.viewCount++;
      }
      return HttpResponse.json(createSuccessResponse({ success: true }));
    }),

    // 检查用户互动状态接口
    http.get(`${API_BASE}/interactions/status/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      // 模拟用户互动状态（基于ID生成一致的随机状态）
      const numId = Number(id);
      const status = {
        hasLiked: numId % 3 === 0,
        hasFavorited: numId % 5 === 0,
      };
      return HttpResponse.json(createSuccessResponse(status));
    }),

    // ==================== 关注相关 ====================
    http.post(`${API_BASE}/users/follow`, async ({ request }) => {
      await delay();
      const body = (await request.json()) as { userId: number };
      const { userId } = body;
      const newFollow = {
        id: mockFollows.length + 1,
        followerId: 2,
        followingId: userId,
        createdAt: new Date().toISOString(),
      };
      mockFollows.push(newFollow);
      return HttpResponse.json(createSuccessResponse({ success: true }));
    }),

    http.delete(`${API_BASE}/users/follow`, async () => {
      await delay();
      return HttpResponse.json(createSuccessResponse({ success: true }));
    }),

    http.get(`${API_BASE}/users/following`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const userId = Number(url.searchParams.get('userId')) || 2;
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;

      const following = getFollowing(userId).map(f => ({
        ...f,
        following: mockUsers.find(u => u.id === f.followingId),
      }));

      const pageData = createPageResponse(following, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.get(`${API_BASE}/users/followers`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const userId = Number(url.searchParams.get('userId')) || 2;
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;

      const followers = getFollowers(userId).map(f => ({
        ...f,
        follower: mockUsers.find(u => u.id === f.followerId),
      }));

      const pageData = createPageResponse(followers, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.get(`${API_BASE}/users/follow/status/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const following = isFollowing(2, Number(id));
      return HttpResponse.json(createSuccessResponse(following));
    }),

    // ==================== 搜索相关 ====================
    http.post(`${API_BASE}/search`, async ({ request }) => {
      await delay();
      const body = (await request.json()) as {
        keyword: string;
        page?: number;
        size?: number;
      };
      const { keyword, page = 0, size = 10 } = body;

      // 参数验证
      const {
        validateRequired,
        validatePagination,
        validateSearchKeyword,
        validate,
      } = await import('./validation');

      const validationError = validate(
        () => validateRequired(body, ['keyword']),
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
        .map(item => ({
          ...item,
          stats: mockKnowledgeStats[item.id],
        }));

      const pageData = createPageResponse(items, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.get(`${API_BASE}/search/hot-keywords`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;
      const keywords = mockHotKeywords.slice(0, limit);
      return HttpResponse.json(createSuccessResponse(keywords));
    }),

    http.get(`${API_BASE}/search/suggestions`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const keyword = url.searchParams.get('keyword') || '';
      const suggestions = getSearchSuggestions(keyword);
      return HttpResponse.json(createSuccessResponse(suggestions));
    }),

    http.get(`${API_BASE}/search/history`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 20;
      const history = getUserSearchHistory(2, limit);
      return HttpResponse.json(createSuccessResponse(history));
    }),

    // 快速搜索接口
    http.get(`${API_BASE}/search/quick`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const keyword = url.searchParams.get('keyword') || '';
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 20;

      // 参数验证
      const { validateSearchKeyword, validatePagination, validate } =
        await import('./validation');

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
        .map(item => ({
          ...item,
          stats: mockKnowledgeStats[item.id],
        }));

      const pageData = createPageResponse(items, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    // 高级搜索接口
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
      const {
        keyword = '',
        categoryId,
        type,
        sortBy = 'RELEVANCE',
        page = 0,
        size = 20,
      } = body;

      let items = [...mockKnowledgeItems];

      // 关键词过滤
      if (keyword) {
        items = items.filter(
          item =>
            item.title.toLowerCase().includes(keyword.toLowerCase()) ||
            item.content.toLowerCase().includes(keyword.toLowerCase()) ||
            item.tags.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      // 分类过滤
      if (categoryId) {
        items = items.filter(item => item.categoryId === categoryId);
      }

      // 类型过滤
      if (type) {
        items = items.filter(item => item.type === type);
      }

      // 添加统计数据
      items = items.map(item => ({
        ...item,
        stats: mockKnowledgeStats[item.id],
      }));

      // 排序
      if (sortBy === 'TIME') {
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === 'POPULARITY') {
        items.sort(
          (a, b) => (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0)
        );
      }

      const pageData = createPageResponse(items, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    // 趋势关键词接口
    http.get(`${API_BASE}/search/trending-keywords`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 15;

      // 模拟趋势关键词（带趋势标识）
      const trendingKeywords = mockHotKeywords.slice(0, limit).map(keyword => ({
        ...keyword,
        trend: Math.random() > 0.5 ? 'up' : 'stable',
        changeRate: Math.floor(Math.random() * 50) + 10,
      }));

      return HttpResponse.json(createSuccessResponse(trendingKeywords));
    }),

    // ==================== 区块链相关 ====================
    http.get(`${API_BASE}/blockchain/overview`, async () => {
      await delay();
      return HttpResponse.json(createSuccessResponse(mockBlockchainOverview));
    }),

    http.get(`${API_BASE}/blockchain/blocks`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;

      const blocks = [...mockBlocks].reverse();
      const pageData = createPageResponse(blocks, page, size);

      return HttpResponse.json(
        createSuccessResponse({
          content: pageData.content,
          totalElements: pageData.totalElements,
          totalPages: pageData.totalPages,
          currentPage: page,
        })
      );
    }),

    http.get(`${API_BASE}/blockchain/blocks/:index`, async ({ params }) => {
      await delay();
      const { index } = params;
      const block = mockBlocks.find(b => b.index === Number(index));
      return HttpResponse.json(createSuccessResponse(block));
    }),

    http.get(`${API_BASE}/blockchain/transactions/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const { getTransactionById } = await import('./data/blockchain');

      const result = getTransactionById(id as string);

      if (!result) {
        return HttpResponse.json(
          { success: false, message: '交易不存在', data: null },
          { status: 404 }
        );
      }

      return HttpResponse.json(
        createSuccessResponse({
          ...result.transaction,
          blockIndex: result.blockIndex,
          status: 'confirmed',
        })
      );
    }),

    http.get(
      `${API_BASE}/blockchain/certificates/knowledge/:id`,
      async ({ params }) => {
        await delay();
        const { id } = params;
        const certificate = getCertificateByKnowledgeId(Number(id));
        return HttpResponse.json(createSuccessResponse(certificate));
      }
    ),

    http.get(
      `${API_BASE}/blockchain/certificates/:id/verify`,
      async ({ params }) => {
        await delay();
        const { id } = params;
        const result = verifyCertificate(id as string);
        return HttpResponse.json(createSuccessResponse(result));
      }
    ),

    http.post(`${API_BASE}/blockchain/certificates`, async ({ request }) => {
      await delay();
      const data = (await request.json()) as { knowledge_id: number };
      const newCert = {
        certificate_id: `cert_${mockCertificates.length + 1}`,
        knowledge_id: data.knowledge_id,
        block_index: mockBlocks.length,
        block_hash: mockBlocks[mockBlocks.length - 1].hash,
        content_hash: `hash_${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toISOString(),
        has_certificate: true,
        pdf_url: `/certificates/cert_${mockCertificates.length + 1}.pdf`,
        qr_code_url: `/qrcodes/cert_${mockCertificates.length + 1}.png`,
        verification_url: `https://educhain.com/verify/cert_${mockCertificates.length + 1}`,
        created_at: new Date().toISOString(),
      };
      mockCertificates.push(newCert);
      return HttpResponse.json(createSuccessResponse(newCert), { status: 201 });
    }),

    // 下载证书
    http.get(
      `${API_BASE}/blockchain/certificates/:id/download`,
      async ({ params }) => {
        await delay();
        const { id } = params;
        const cert = mockCertificates.find(c => c.certificate_id === id);

        if (!cert) {
          return HttpResponse.json(
            { success: false, message: '证书不存在', data: null },
            { status: 404 }
          );
        }

        // 获取对应的知识信息
        const knowledge = mockKnowledgeItems.find(
          k => k.id === cert.knowledge_id
        );

        // 获取对应的区块信息
        const block = mockBlocks.find(b => b.index === cert.block_index);

        // 获取对应的交易信息
        const transaction = block?.transactions.find(
          tx => tx.knowledgeId === cert.knowledge_id
        );

        // 生成包含真实数据的PDF内容
        const pdfContent = `
═══════════════════════════════════════════════════════════════
                    EduChain 区块链存证证书
═══════════════════════════════════════════════════════════════

证书编号: ${cert.certificate_id}
生成时间: ${cert.created_at ? new Date(cert.created_at).toLocaleString('zh-CN') : '未知'}

───────────────────────────────────────────────────────────────
                        知识内容信息
───────────────────────────────────────────────────────────────

知识标题: ${knowledge?.title || '未知标题'}
知识ID: ${cert.knowledge_id}
内容类型: ${knowledge?.type || 'TEXT'}
上传者: ${knowledge?.uploaderName || '未知用户'}
分类: ${knowledge?.categoryName || '未分类'}
标签: ${knowledge?.tags || '无'}
创建时间: ${knowledge?.createdAt ? new Date(knowledge.createdAt).toLocaleString('zh-CN') : '未知'}

───────────────────────────────────────────────────────────────
                        区块链存证信息
───────────────────────────────────────────────────────────────

存证时间: ${cert.timestamp ? new Date(cert.timestamp).toLocaleString('zh-CN') : '未知'}
区块索引: #${cert.block_index}
区块哈希: ${cert.block_hash}
内容哈希: ${cert.content_hash}

交易信息:
  交易ID: ${transaction?.id || '未知'}
  交易类型: ${transaction?.type || 'KNOWLEDGE_CERTIFICATION'}
  用户ID: ${transaction?.userId || '未知'}
  签名: ${transaction?.signature || '未知'}

───────────────────────────────────────────────────────────────
                        验证信息
───────────────────────────────────────────────────────────────

验证地址: ${cert.verification_url}
IPFS哈希: ${transaction?.metadata?.ipfsHash || '未知'}
文件大小: ${transaction?.metadata?.fileSize || '未知'}
MIME类型: ${transaction?.metadata?.mimeType || 'text/markdown'}

───────────────────────────────────────────────────────────────
                        法律声明
───────────────────────────────────────────────────────────────

本证书由EduChain区块链平台生成，记录了知识内容在区块链上的存证信息。
该存证具有以下特性：

1. 不可篡改性：内容哈希已永久记录在区块链上
2. 时间戳证明：存证时间由区块链网络共识确认
3. 公开验证：任何人都可以通过区块链浏览器验证
4. 法律效力：符合《电子签名法》等相关法律法规

证书生成平台: EduChain (https://educhain.com)
技术支持: 区块链存证技术
版本: v1.0

═══════════════════════════════════════════════════════════════
                    此证书具有法律效力
═══════════════════════════════════════════════════════════════
`;

        // 返回PDF文件流
        return new Response(pdfContent, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="EduChain_Certificate_${cert.certificate_id}.txt"`,
          },
        });
      }
    ),

    // 区块链搜索
    http.get(`${API_BASE}/blockchain/search`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';
      const searchType = url.searchParams.get('searchType') || 'block';
      const keyword = url.searchParams.get('keyword') || query;

      if (!keyword) {
        return HttpResponse.json(
          { success: false, message: '请输入搜索关键词', data: null },
          { status: 400 }
        );
      }

      const { getTransactionById } = await import('./data/blockchain');

      // 根据搜索类型进行搜索
      if (searchType === 'block' || !isNaN(Number(keyword))) {
        // 按区块索引搜索
        const blockIndex = Number(keyword);
        const block = mockBlocks.find(b => b.index === blockIndex);

        if (block) {
          return HttpResponse.json(
            createSuccessResponse({
              type: 'block',
              data: block,
            })
          );
        }
      }

      if (searchType === 'transaction' || searchType === 'knowledge') {
        // 按交易ID或知识ID搜索
        const result = getTransactionById(keyword);

        if (result) {
          return HttpResponse.json(
            createSuccessResponse({
              type: 'transaction',
              data: result.transaction,
            })
          );
        }
      }

      // 未找到结果
      return HttpResponse.json(
        createSuccessResponse({
          type: 'none',
          data: null,
        })
      );
    }),

    // ==================== 推荐相关 ====================
    http.get(`${API_BASE}/recommendations`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;

      const items = [...mockKnowledgeItems]
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
        .map(item => ({
          ...item,
          stats: mockKnowledgeStats[item.id],
        }));

      return HttpResponse.json(createSuccessResponse(items));
    }),

    http.get(
      `${API_BASE}/recommendations/personalized`,
      async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit')) || 10;

        // 个性化推荐：基于用户兴趣，这里简单模拟为随机推荐
        const items = [...mockKnowledgeItems]
          .sort(() => Math.random() - 0.5)
          .slice(0, limit)
          .map(item => ({
            ...item,
            stats: mockKnowledgeStats[item.id],
          }));

        return HttpResponse.json(createSuccessResponse(items));
      }
    ),

    http.get(`${API_BASE}/recommendations/trending`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;

      // 热门内容：按浏览量和点赞数排序
      const items = [...mockKnowledgeItems]
        .map(item => ({
          ...item,
          stats: mockKnowledgeStats[item.id],
        }))
        .sort((a, b) => {
          const scoreA =
            (a.stats?.viewCount || 0) + (a.stats?.likeCount || 0) * 3;
          const scoreB =
            (b.stats?.viewCount || 0) + (b.stats?.likeCount || 0) * 3;
          return scoreB - scoreA;
        })
        .slice(0, limit);

      return HttpResponse.json(createSuccessResponse(items));
    }),

    http.get(
      `${API_BASE}/recommendations/similar/:id`,
      async ({ params, request }) => {
        await delay();
        const { id } = params;
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit')) || 5;

        const currentItem = mockKnowledgeItems.find(k => k.id === Number(id));
        const items = mockKnowledgeItems
          .filter(
            k => k.id !== Number(id) && k.categoryId === currentItem?.categoryId
          )
          .slice(0, limit)
          .map(item => ({
            ...item,
            stats: mockKnowledgeStats[item.id],
          }));

        return HttpResponse.json(createSuccessResponse(items));
      }
    ),

    http.post(`${API_BASE}/recommendations/feedback`, async ({ request }) => {
      await delay();
      const body = (await request.json()) as {
        knowledgeId: number;
        feedback: 'like' | 'dislike' | 'not_interested';
      };

      console.log('推荐反馈:', body);

      // Mock: 直接返回成功
      return HttpResponse.json(
        createSuccessResponse({
          success: true,
          message: '反馈已记录',
        })
      );
    }),

    // ==================== 社区相关 ====================
    http.get(`${API_BASE}/community/feed`, async () => {
      await delay();
      const { mockCommunityFeed } = await import('./data/community');
      return HttpResponse.json(createSuccessResponse(mockCommunityFeed));
    }),

    http.get(`${API_BASE}/community/discussions/hot`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;
      const { mockDiscussions } = await import('./data/community');
      return HttpResponse.json(
        createSuccessResponse(mockDiscussions.slice(0, limit))
      );
    }),

    http.get(`${API_BASE}/community/discussions/new`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;
      const { mockDiscussions } = await import('./data/community');
      return HttpResponse.json(
        createSuccessResponse(mockDiscussions.slice(0, limit))
      );
    }),

    http.get(
      `${API_BASE}/community/discussions/trending`,
      async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit')) || 10;
        const { mockDiscussions } = await import('./data/community');
        return HttpResponse.json(
          createSuccessResponse(mockDiscussions.slice(0, limit))
        );
      }
    ),

    http.get(`${API_BASE}/community/users/active`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;
      const { mockActiveUsers } = await import('./data/community');
      return HttpResponse.json(
        createSuccessResponse(mockActiveUsers.slice(0, limit))
      );
    }),

    http.get(`${API_BASE}/community/topics/hot`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 10;
      const { mockHotTopics } = await import('./data/community');
      return HttpResponse.json(
        createSuccessResponse(mockHotTopics.slice(0, limit))
      );
    }),

    http.get(`${API_BASE}/community/stats`, async () => {
      await delay();
      const { mockCommunityStats } = await import('./data/community');
      return HttpResponse.json(createSuccessResponse(mockCommunityStats));
    }),

    // ==================== 管理员仪表盘相关 ====================
    http.get(`${API_BASE}/admin/dashboard/stats`, async () => {
      await delay();

      // 从现有Mock数据计算统计信息
      const { mockUsers } = await import('./data/users');
      const { mockKnowledgeItems, mockKnowledgeStats } = await import(
        './data/knowledge'
      );
      const { mockComments } = await import('./data/comments');

      // 计算统计数据
      const totalUsers = mockUsers.length;
      const totalKnowledge = mockKnowledgeItems.length;

      let totalViews = 0;
      let totalLikes = 0;
      Object.values(mockKnowledgeStats).forEach(stats => {
        totalViews += stats.viewCount || 0;
        totalLikes += stats.likeCount || 0;
      });

      const totalComments = mockComments.length;
      const activeUsers = mockUsers.filter(user => user.level >= 3).length;
      const newUsersToday = Math.floor(Math.random() * 10) + 15;
      const newKnowledgeToday = Math.floor(Math.random() * 8) + 12;
      const userGrowth = Math.random() * 20 + 5;
      const knowledgeGrowth = Math.random() * 15 + 3;

      const stats = {
        totalUsers,
        totalKnowledge,
        totalViews,
        totalLikes,
        totalComments,
        activeUsers,
        newUsersToday,
        newKnowledgeToday,
        userGrowth,
        knowledgeGrowth,
      };

      return HttpResponse.json(createSuccessResponse(stats));
    }),

    http.get(
      `${API_BASE}/admin/dashboard/popular-content`,
      async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit')) || 10;

        const { mockKnowledgeItems, mockKnowledgeStats } = await import(
          './data/knowledge'
        );
        const { mockUsers } = await import('./data/users');
        const { mockCategories } = await import('./data/categories');

        // 按浏览量排序获取热门内容
        const popularItems = mockKnowledgeItems
          .map(item => {
            const stats = mockKnowledgeStats[item.id];
            const author = mockUsers.find(user => user.id === item.uploaderId);
            const category = mockCategories.find(
              cat => cat.id === item.categoryId
            );

            return {
              id: item.id,
              title: item.title,
              author: author?.fullName || '未知用户',
              authorId: item.uploaderId,
              views: stats?.viewCount || 0,
              likes: stats?.likeCount || 0,
              comments: stats?.commentCount || 0,
              createdAt: item.createdAt.split('T')[0],
              category: category?.name || '未分类',
            };
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, limit);

        return HttpResponse.json(createSuccessResponse(popularItems));
      }
    ),

    http.get(
      `${API_BASE}/admin/dashboard/active-users`,
      async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit')) || 10;

        const { mockUsers, mockUserStats } = await import('./data/users');

        // 按贡献度排序获取活跃用户
        const activeUsersList = mockUsers
          .filter(user => user.role === 'LEARNER') // 排除管理员
          .map(user => {
            const stats = mockUserStats[user.id];
            const contributionScore =
              (stats?.knowledgeCount || 0) * 10 +
              (stats?.likeCount || 0) * 2 +
              (stats?.followerCount || 0) * 5;

            return {
              id: user.id,
              username: user.username,
              fullName: user.fullName,
              avatarUrl: user.avatarUrl,
              level: user.level,
              contributionScore,
              lastActiveAt: user.updatedAt,
              todayActions: Math.floor(Math.random() * 20) + 5,
            };
          })
          .sort((a, b) => b.contributionScore - a.contributionScore)
          .slice(0, limit);

        return HttpResponse.json(createSuccessResponse(activeUsersList));
      }
    ),

    http.get(
      `${API_BASE}/admin/dashboard/system-alerts`,
      async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const resolved = url.searchParams.get('resolved');

        // 生成系统告警数据
        const alerts = [
          {
            id: 1,
            type: 'warning' as const,
            title: '存储空间告警',
            message: '系统存储空间使用率已达到85%，建议及时清理日志文件',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            resolved: false,
            priority: 'high' as const,
          },
          {
            id: 2,
            type: 'info' as const,
            title: '系统维护通知',
            message:
              '系统将于今晚23:00-01:00进行例行维护，期间可能影响部分功能',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            resolved: false,
            priority: 'medium' as const,
          },
          {
            id: 3,
            type: 'success' as const,
            title: '备份任务完成',
            message: '今日凌晨的数据备份任务已成功完成，备份文件大小: 2.3GB',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            resolved: true,
            priority: 'low' as const,
          },
          {
            id: 4,
            type: 'error' as const,
            title: '数据库连接异常',
            message: '检测到数据库连接池出现异常，已自动重连，请关注系统稳定性',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            resolved: true,
            priority: 'high' as const,
          },
        ];

        let filteredAlerts = alerts;
        if (resolved !== null) {
          const resolvedBool = resolved === 'true';
          filteredAlerts = alerts.filter(
            alert => alert.resolved === resolvedBool
          );
        }

        return HttpResponse.json(createSuccessResponse(filteredAlerts));
      }
    ),

    http.get(`${API_BASE}/admin/dashboard/system-metrics`, async () => {
      await delay();

      const metrics = {
        cpu: {
          usage: 65,
          trend: 'stable' as const,
        },
        memory: {
          usage: 78,
          total: 16,
          trend: 'up' as const,
        },
        storage: {
          usage: 85,
          total: 500,
          trend: 'up' as const,
        },
        network: {
          inbound: 125.6,
          outbound: 89.3,
        },
      };

      return HttpResponse.json(createSuccessResponse(metrics));
    }),

    http.put(
      `${API_BASE}/admin/dashboard/alerts/:id/resolve`,
      async ({ params }) => {
        await delay();
        const { id } = params;
        console.log(`Resolving alert ${id}`);
        return HttpResponse.json(createSuccessResponse({ success: true }));
      }
    ),

    // ==================== 管理员用户管理相关 ====================
    http.get(`${API_BASE}/admin/users`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;
      const search = url.searchParams.get('search') || '';
      const role = url.searchParams.get('role') || '';
      const status = url.searchParams.get('status');

      const { mockUsers } = await import('./data/users');

      let filteredUsers = [...mockUsers];

      // 搜索过滤
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          user =>
            user.username.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.fullName.toLowerCase().includes(searchLower)
        );
      }

      // 角色过滤
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }

      // 状态过滤
      if (status !== null && status !== '') {
        filteredUsers = filteredUsers.filter(
          user => user.status === Number(status)
        );
      }

      const pageData = createPageResponse(filteredUsers, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.post(`${API_BASE}/admin/users`, async ({ request }) => {
      await delay();
      const userData = (await request.json()) as {
        username: string;
        email: string;
        fullName: string;
        school?: string;
        role: 'LEARNER' | 'ADMIN';
        status: number;
        bio?: string;
        password: string;
      };
      const { mockUsers } = await import('./data/users');

      const newUser = {
        id: Math.max(...mockUsers.map(u => u.id)) + 1,
        ...userData,
        level: 1, // 默认等级
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockUsers.push(newUser);
      return HttpResponse.json(createSuccessResponse(newUser), { status: 201 });
    }),

    http.put(`${API_BASE}/admin/users/:id`, async ({ params, request }) => {
      await delay();
      const { id } = params;
      const userData = (await request.json()) as {
        username?: string;
        email?: string;
        fullName?: string;
        school?: string;
        role?: 'LEARNER' | 'ADMIN';
        status?: number;
        bio?: string;
      };
      const { mockUsers } = await import('./data/users');

      const userIndex = mockUsers.findIndex(u => u.id === Number(id));
      if (userIndex === -1) {
        return HttpResponse.json(
          { success: false, message: '用户不存在', data: null },
          { status: 404 }
        );
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      return HttpResponse.json(createSuccessResponse(mockUsers[userIndex]));
    }),

    http.delete(`${API_BASE}/admin/users/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const { mockUsers } = await import('./data/users');

      const userIndex = mockUsers.findIndex(u => u.id === Number(id));
      if (userIndex === -1) {
        return HttpResponse.json(
          { success: false, message: '用户不存在', data: null },
          { status: 404 }
        );
      }

      mockUsers.splice(userIndex, 1);
      return HttpResponse.json(createSuccessResponse(null));
    }),

    http.post(`${API_BASE}/admin/users/batch-delete`, async ({ request }) => {
      await delay();
      const { userIds } = (await request.json()) as { userIds: number[] };
      const { mockUsers } = await import('./data/users');

      // 从数组中移除指定的用户
      for (let i = mockUsers.length - 1; i >= 0; i--) {
        if (userIds.includes(mockUsers[i].id)) {
          mockUsers.splice(i, 1);
        }
      }

      return HttpResponse.json(createSuccessResponse(null));
    }),

    http.get(`${API_BASE}/admin/users/:id/detail`, async ({ params }) => {
      await delay();
      const { id } = params;
      const { mockUsers, mockUserStats } = await import('./data/users');

      const user = mockUsers.find(u => u.id === Number(id));
      if (!user) {
        return HttpResponse.json(
          { success: false, message: '用户不存在', data: null },
          { status: 404 }
        );
      }

      const stats = mockUserStats[user.id] || {
        userId: user.id,
        knowledgeCount: 0,
        likeCount: 0,
        favoriteCount: 0,
        followingCount: 0,
        followerCount: 0,
        viewCount: 0,
      };

      return HttpResponse.json(createSuccessResponse({ ...user, stats }));
    }),

    // ==================== 管理员分类管理相关 ====================
    http.get(`${API_BASE}/admin/categories`, async ({ request }) => {
      await delay();
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 0;
      const size = Number(url.searchParams.get('size')) || 10;
      const search = url.searchParams.get('search') || '';
      const parentId = url.searchParams.get('parentId');

      const { mockCategories } = await import('./data/categories');

      let filteredCategories = [...mockCategories];

      // 搜索过滤
      if (search) {
        const searchLower = search.toLowerCase();
        filteredCategories = filteredCategories.filter(
          category =>
            category.name.toLowerCase().includes(searchLower) ||
            (category.description &&
              category.description.toLowerCase().includes(searchLower))
        );
      }

      // 父分类过滤
      if (parentId !== null && parentId !== '') {
        if (parentId === '0') {
          // 查询根分类
          filteredCategories = filteredCategories.filter(
            category => !category.parentId
          );
        } else {
          filteredCategories = filteredCategories.filter(
            category => category.parentId === Number(parentId)
          );
        }
      }

      const pageData = createPageResponse(filteredCategories, page, size);
      return HttpResponse.json(createSuccessResponse(pageData));
    }),

    http.get(`${API_BASE}/admin/categories/tree`, async () => {
      await delay();
      const { mockCategoryTree } = await import('./data/categories');
      return HttpResponse.json(createSuccessResponse(mockCategoryTree));
    }),

    http.post(`${API_BASE}/admin/categories`, async ({ request }) => {
      await delay();
      const categoryData = (await request.json()) as {
        name: string;
        description?: string;
        parentId?: number;
        sortOrder?: number;
      };
      const { mockCategories } = await import('./data/categories');

      const newCategory = {
        id: Math.max(...mockCategories.map(c => c.id)) + 1,
        ...categoryData,
        sortOrder: categoryData.sortOrder || mockCategories.length + 1,
        createdAt: new Date().toISOString(),
        knowledgeCount: 0,
      };

      mockCategories.push(newCategory);
      return HttpResponse.json(createSuccessResponse(newCategory), {
        status: 201,
      });
    }),

    http.put(
      `${API_BASE}/admin/categories/:id`,
      async ({ params, request }) => {
        await delay();
        const { id } = params;
        const categoryData = (await request.json()) as {
          name?: string;
          description?: string;
          parentId?: number;
          sortOrder?: number;
        };
        const { mockCategories } = await import('./data/categories');

        const categoryIndex = mockCategories.findIndex(
          c => c.id === Number(id)
        );
        if (categoryIndex === -1) {
          return HttpResponse.json(
            { success: false, message: '分类不存在', data: null },
            { status: 404 }
          );
        }

        mockCategories[categoryIndex] = {
          ...mockCategories[categoryIndex],
          ...categoryData,
        };

        return HttpResponse.json(
          createSuccessResponse(mockCategories[categoryIndex])
        );
      }
    ),

    http.delete(`${API_BASE}/admin/categories/:id`, async ({ params }) => {
      await delay();
      const { id } = params;
      const { mockCategories } = await import('./data/categories');

      const categoryIndex = mockCategories.findIndex(c => c.id === Number(id));
      if (categoryIndex === -1) {
        return HttpResponse.json(
          { success: false, message: '分类不存在', data: null },
          { status: 404 }
        );
      }

      // 检查是否有子分类
      const hasChildren = mockCategories.some(c => c.parentId === Number(id));
      if (hasChildren) {
        return HttpResponse.json(
          {
            success: false,
            message: '该分类下还有子分类，无法删除',
            data: null,
          },
          { status: 400 }
        );
      }

      mockCategories.splice(categoryIndex, 1);
      return HttpResponse.json(createSuccessResponse(null));
    }),

    http.post(
      `${API_BASE}/admin/categories/batch-delete`,
      async ({ request }) => {
        await delay();
        const { categoryIds } = (await request.json()) as {
          categoryIds: number[];
        };
        const { mockCategories } = await import('./data/categories');

        // 检查是否有子分类
        for (const categoryId of categoryIds) {
          const hasChildren = mockCategories.some(
            c => c.parentId === categoryId
          );
          if (hasChildren) {
            return HttpResponse.json(
              {
                success: false,
                message: '选中的分类中包含有子分类的项目，无法删除',
                data: null,
              },
              { status: 400 }
            );
          }
        }

        // 从数组中移除指定的分类
        for (let i = mockCategories.length - 1; i >= 0; i--) {
          if (categoryIds.includes(mockCategories[i].id)) {
            mockCategories.splice(i, 1);
          }
        }

        return HttpResponse.json(createSuccessResponse(null));
      }
    ),

    http.put(
      `${API_BASE}/admin/categories/:id/move`,
      async ({ params, request }) => {
        await delay();
        const { id } = params;
        const { parentId, sortOrder } = (await request.json()) as {
          parentId?: number;
          sortOrder?: number;
        };
        const { mockCategories } = await import('./data/categories');

        const categoryIndex = mockCategories.findIndex(
          c => c.id === Number(id)
        );
        if (categoryIndex === -1) {
          return HttpResponse.json(
            { success: false, message: '分类不存在', data: null },
            { status: 404 }
          );
        }

        // 检查是否会形成循环引用
        if (parentId) {
          let checkParent = mockCategories.find(c => c.id === parentId);
          while (checkParent) {
            if (checkParent.id === Number(id)) {
              return HttpResponse.json(
                {
                  success: false,
                  message: '不能将分类移动到自己的子分类下',
                  data: null,
                },
                { status: 400 }
              );
            }
            checkParent = mockCategories.find(
              c => c.id === checkParent!.parentId
            );
          }
        }

        mockCategories[categoryIndex] = {
          ...mockCategories[categoryIndex],
          parentId: parentId || undefined,
          sortOrder: sortOrder || mockCategories[categoryIndex].sortOrder,
        };

        return HttpResponse.json(
          createSuccessResponse(mockCategories[categoryIndex])
        );
      }
    ),

    http.get(`${API_BASE}/admin/categories/:id/detail`, async ({ params }) => {
      await delay();
      const { id } = params;
      const { mockCategories } = await import('./data/categories');

      const category = mockCategories.find(c => c.id === Number(id));
      if (!category) {
        return HttpResponse.json(
          { success: false, message: '分类不存在', data: null },
          { status: 404 }
        );
      }

      // 获取子分类
      const children = mockCategories.filter(c => c.parentId === category.id);

      // 计算总的知识数量（包含子分类）
      const getTotalKnowledgeCount = (categoryId: number): number => {
        const cat = mockCategories.find(c => c.id === categoryId);
        if (!cat) return 0;

        let total = cat.knowledgeCount || 0;
        const childCategories = mockCategories.filter(
          c => c.parentId === categoryId
        );
        for (const child of childCategories) {
          total += getTotalKnowledgeCount(child.id);
        }
        return total;
      };

      const totalKnowledgeCount = getTotalKnowledgeCount(category.id);

      return HttpResponse.json(
        createSuccessResponse({
          ...category,
          children,
          totalKnowledgeCount,
        })
      );
    }),
  ];

  const worker = setupWorker(...handlers);

  worker.start({
    onUnhandledRequest: 'bypass',
  });

  return worker;
};
