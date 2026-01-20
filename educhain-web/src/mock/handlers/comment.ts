/**
 * 评论相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import { mockComments } from '../data/comments';
import { mockUsers } from '../data/users';

export const commentHandlers = [
  // 获取评论列表
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

  // 获取评论详情
  http.get(`${API_BASE}/comments/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const comment = mockComments.find(c => c.id === Number(id));

    if (comment) {
      return HttpResponse.json(createSuccessResponse(comment));
    }

    return HttpResponse.json(
      { success: false, message: '评论不存在', data: null },
      { status: 404 }
    );
  }),

  // 创建评论
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
    return HttpResponse.json(createSuccessResponse(newComment), { status: 201 });
  }),

  // 更新评论
  http.put(`${API_BASE}/comments/:id`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const data = (await request.json()) as { content: string };
    const index = mockComments.findIndex(c => c.id === Number(id));

    if (index !== -1) {
      mockComments[index] = {
        ...mockComments[index],
        content: data.content,
      };
      return HttpResponse.json(createSuccessResponse(mockComments[index]));
    }

    return HttpResponse.json(
      { success: false, message: '评论不存在', data: null },
      { status: 404 }
    );
  }),

  // 删除评论
  http.delete(`${API_BASE}/comments/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const index = mockComments.findIndex(c => c.id === Number(id));

    if (index !== -1) {
      mockComments.splice(index, 1);
      return HttpResponse.json(createSuccessResponse(null));
    }

    return HttpResponse.json(
      { success: false, message: '评论不存在', data: null },
      { status: 404 }
    );
  }),

  // 获取评论回复
  http.get(`${API_BASE}/comments/:id/replies`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const replies = mockComments.filter(c => c.parentId === Number(id));
    const pageData = createPageResponse(replies, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取用户评论
  http.get(`${API_BASE}/comments/user`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const userComments = mockComments.filter(c => c.userId === 2);
    const pageData = createPageResponse(userComments, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),
];
