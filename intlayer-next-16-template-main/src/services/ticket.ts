/**
 * 工单服务
 */

import { request } from './api';
import type { PageRequest, PageResponse } from '../types/api';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketType = 'BUG' | 'FEATURE' | 'QUESTION' | 'OTHER';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Ticket {
  id: number;
  title: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface TicketComment {
  id: number;
  ticketId: number;
  content: string;
  createdAt: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  isStaff: boolean;
}

export interface TicketDetail extends Ticket {
  comments: TicketComment[];
}

export interface CreateTicketRequest {
  title: string;
  type: TicketType;
  priority: TicketPriority;
  description: string;
  email: string;
}

export interface AddCommentRequest {
  content: string;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export const ticketService = {
  // 获取我的工单列表
  getMyTickets: (params?: PageRequest & { status?: TicketStatus; type?: TicketType }) =>
    request.get<PageResponse<Ticket>>('/tickets/my', params),

  // 获取工单详情
  getTicketById: (id: number) =>
    request.get<TicketDetail>(`/tickets/${id}`),

  // 创建工单
  createTicket: (data: CreateTicketRequest) =>
    request.post<Ticket>('/tickets', data),

  // 更新工单状态
  updateTicketStatus: (id: number, data: UpdateTicketStatusRequest) =>
    request.put<Ticket>(`/tickets/${id}/status`, data),

  // 添加评论
  addComment: (ticketId: number, data: AddCommentRequest) =>
    request.post<TicketComment>(`/tickets/${ticketId}/comments`, data),

  // 获取工单评论
  getTicketComments: (ticketId: number, params?: PageRequest) =>
    request.get<PageResponse<TicketComment>>(`/tickets/${ticketId}/comments`, params),
};
