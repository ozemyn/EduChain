/**
 * 工单相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import { mockTickets, mockTicketComments } from '../data/tickets';

export const ticketHandlers = [
  // 获取我的工单列表
  http.get(`${API_BASE}/tickets/my`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');

    let items = [...mockTickets];

    // 筛选状态
    if (status && status !== 'ALL') {
      items = items.filter(t => t.status === status);
    }

    // 筛选类型
    if (type && type !== 'ALL') {
      items = items.filter(t => t.type === type);
    }

    // 按创建时间倒序排序
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pageData = createPageResponse(items, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取工单详情
  http.get(`${API_BASE}/tickets/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const ticket = mockTickets.find(t => t.id === Number(id));

    if (ticket) {
      const comments = mockTicketComments.filter(c => c.ticketId === Number(id));
      const ticketDetail = {
        ...ticket,
        comments,
      };
      return HttpResponse.json(createSuccessResponse(ticketDetail));
    }

    return HttpResponse.json(
      { success: false, message: '工单不存在', data: null },
      { status: 404 }
    );
  }),

  // 创建工单
  http.post(`${API_BASE}/tickets`, async ({ request }) => {
    await delay();
    const data = (await request.json()) as Record<string, unknown>;
    const newTicket = {
      id: mockTickets.length + 1,
      ...data,
      status: 'OPEN',
      userId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTickets.push(newTicket as (typeof mockTickets)[0]);
    return HttpResponse.json(createSuccessResponse(newTicket), { status: 201 });
  }),

  // 更新工单状态
  http.put(`${API_BASE}/tickets/:id/status`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const data = (await request.json()) as { status: string };
    const index = mockTickets.findIndex(t => t.id === Number(id));

    if (index !== -1) {
      mockTickets[index] = {
        ...mockTickets[index],
        status: data.status as (typeof mockTickets)[0]['status'],
        updatedAt: new Date().toISOString(),
      };
      return HttpResponse.json(createSuccessResponse(mockTickets[index]));
    }

    return HttpResponse.json(
      { success: false, message: '工单不存在', data: null },
      { status: 404 }
    );
  }),

  // 添加评论
  http.post(`${API_BASE}/tickets/:id/comments`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const data = (await request.json()) as { content: string };
    const newComment = {
      id: mockTicketComments.length + 1,
      ticketId: Number(id),
      content: data.content,
      createdAt: new Date().toISOString(),
      userId: 2,
      userName: '用户',
      isStaff: false,
    };
    mockTicketComments.push(newComment);
    return HttpResponse.json(createSuccessResponse(newComment), { status: 201 });
  }),

  // 获取工单评论
  http.get(`${API_BASE}/tickets/:id/comments`, async ({ params, request }) => {
    await delay();
    const { id } = params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const comments = mockTicketComments.filter(c => c.ticketId === Number(id));
    const pageData = createPageResponse(comments, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),
];
