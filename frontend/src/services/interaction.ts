import { request } from './api';
import type { PageRequest, PageResponse } from '@/types/api';

export interface InteractionStats {
  knowledgeId: number;
  likeCount: number;
  favoriteCount: number;
  viewCount: number;
  commentCount: number;
  shareCount: number;
}

export interface UserInteraction {
  id: number;
  knowledgeId: number;
  userId: number;
  interactionType: 'LIKE' | 'FAVORITE' | 'VIEW' | 'SHARE';
  ipAddress?: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  knowledgeId: number;
  userId: number;
  parentId?: number;
  content: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  replies?: Comment[];
  replyCount?: number;
}

export interface CreateCommentRequest {
  knowledgeId: number;
  parentId?: number;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export const interactionService = {
  // 点赞
  like: (knowledgeId: number) =>
    request.post('/interactions/like', { knowledgeId }),

  // 取消点赞
  unlike: (knowledgeId: number) =>
    request.post('/interactions/unlike', { knowledgeId }),

  // 收藏
  favorite: (knowledgeId: number) =>
    request.post('/interactions/favorite', { knowledgeId }),

  // 取消收藏
  unfavorite: (knowledgeId: number) =>
    request.post('/interactions/unfavorite', { knowledgeId }),

  // 分享
  share: (knowledgeId: number) =>
    request.post('/interactions/share', { knowledgeId }),

  // 获取互动统计
  getInteractionStats: (knowledgeId: number) =>
    request.get<InteractionStats>(`/interactions/stats/${knowledgeId}`),

  // 获取用户互动记录
  getUserInteractions: (params: PageRequest & { type?: string }) =>
    request.get<PageResponse<UserInteraction>>('/interactions/user', {
      params,
    }),

  // 获取用户点赞列表
  getUserLikes: (params: PageRequest) =>
    request.get<PageResponse<UserInteraction>>('/interactions/likes', {
      params,
    }),

  // 获取用户收藏列表
  getUserFavorites: (params: PageRequest) =>
    request.get<PageResponse<UserInteraction>>('/interactions/favorites', {
      params,
    }),
};

export const commentService = {
  // 获取评论列表
  getComments: (knowledgeId: number, params?: PageRequest) =>
    request.get<PageResponse<Comment>>('/comments', {
      params: { knowledgeId, ...params },
    }),

  // 获取评论详情
  getCommentById: (id: number) => request.get<Comment>(`/comments/${id}`),

  // 创建评论
  createComment: (data: CreateCommentRequest) =>
    request.post<Comment>('/comments', data),

  // 更新评论
  updateComment: (id: number, data: UpdateCommentRequest) =>
    request.put<Comment>(`/comments/${id}`, data),

  // 删除评论
  deleteComment: (id: number) => request.delete(`/comments/${id}`),

  // 获取评论回复
  getCommentReplies: (commentId: number, params?: PageRequest) =>
    request.get<PageResponse<Comment>>(`/comments/${commentId}/replies`, {
      params,
    }),

  // 获取用户评论
  getUserComments: (params: PageRequest) =>
    request.get<PageResponse<Comment>>('/comments/user', { params }),
};
