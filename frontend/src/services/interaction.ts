import { request } from './api';
import type {
  UserInteraction,
  InteractionStats,
  Comment,
  CommentWithReplies,
  CreateCommentRequest,
  UserFollow,
  FollowStats,
  Notification,
  PageResponse,
  PageRequest,
} from '@/types/api';

export const interactionService = {
  // 点赞相关
  likeKnowledge: (knowledgeId: number) =>
    request.post<void>(`/interactions/like/${knowledgeId}`),

  unlikeKnowledge: (knowledgeId: number) =>
    request.delete<void>(`/interactions/like/${knowledgeId}`),

  // 收藏相关
  favoriteKnowledge: (knowledgeId: number) =>
    request.post<void>(`/interactions/favorite/${knowledgeId}`),

  unfavoriteKnowledge: (knowledgeId: number) =>
    request.delete<void>(`/interactions/favorite/${knowledgeId}`),

  // 获取互动统计
  getInteractionStats: (knowledgeId: number) =>
    request.get<InteractionStats>(`/interactions/stats/${knowledgeId}`),

  // 获取用户的互动记录
  getUserInteractions: (
    userId: number,
    type: 'LIKE' | 'FAVORITE',
    params: PageRequest
  ) =>
    request.get<PageResponse<UserInteraction>>(`/interactions/user/${userId}`, {
      params: { type, ...params },
    }),

  // 评论相关
  getComments: (knowledgeId: number, params: PageRequest) =>
    request.get<PageResponse<CommentWithReplies>>(`/comments/${knowledgeId}`, {
      params,
    }),

  createComment: (data: CreateCommentRequest) =>
    request.post<Comment>('/comments', data),

  updateComment: (commentId: number, content: string) =>
    request.put<Comment>(`/comments/${commentId}`, { content }),

  deleteComment: (commentId: number) =>
    request.delete<void>(`/comments/${commentId}`),

  // 获取评论回复
  getCommentReplies: (commentId: number, params: PageRequest) =>
    request.get<PageResponse<Comment>>(`/comments/${commentId}/replies`, {
      params,
    }),

  // 关注相关
  followUser: (userId: number) => request.post<void>(`/follow/${userId}`),

  unfollowUser: (userId: number) => request.delete<void>(`/follow/${userId}`),

  getFollowStats: (userId: number) =>
    request.get<FollowStats>(`/follow/stats/${userId}`),

  getFollowing: (userId: number, params: PageRequest) =>
    request.get<PageResponse<UserFollow>>(`/follow/${userId}/following`, {
      params,
    }),

  getFollowers: (userId: number, params: PageRequest) =>
    request.get<PageResponse<UserFollow>>(`/follow/${userId}/followers`, {
      params,
    }),

  // 通知相关
  getNotifications: (params: PageRequest) =>
    request.get<PageResponse<Notification>>('/notifications', { params }),

  markNotificationAsRead: (notificationId: number) =>
    request.put<void>(`/notifications/${notificationId}/read`),

  markAllNotificationsAsRead: () =>
    request.put<void>('/notifications/read-all'),

  getUnreadNotificationCount: () =>
    request.get<{ count: number }>('/notifications/unread-count'),
};
