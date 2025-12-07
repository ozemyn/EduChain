/**
 * Mock 服务器配置
 * 使用 MSW 2.0 (Mock Service Worker) 拦截 API 请求
 */

import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import type { ApiResponse, PageResponse } from '@/types/api';
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

// 辅助函数：创建分页响应
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

      return HttpResponse.json(
        {
          success: false,
          message: '用户名或密码错误',
          data: null,
        },
        { status: 401 }
      );
    }),

    http.post(`${API_BASE}/auth/register`, async ({ request }) => {
      await delay();
      const userData = (await request.json()) as Record<string, unknown>;
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
  ];

  const worker = setupWorker(...handlers);

  worker.start({
    onUnhandledRequest: 'bypass',
  });

  return worker;
};
