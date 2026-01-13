/**
 * 社区服务
 */

import { request } from './api';

export interface Discussion {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  authorId: number;
  replies: number;
  views: number;
  likes: number;
  time: string;
  createdAt: string;
  tags: string[];
  isHot: boolean;
}

export interface CommunityActiveUser {
  id: number;
  name: string;
  avatar: string;
  posts: number;
  likes: number;
  level: string;
  rank: number;
}

export interface HotTopic {
  name: string;
  count: number;
  color: string;
}

export interface CommunityStats {
  activeUsers: number;
  totalDiscussions: number;
  todayPosts: number;
  todayComments: number;
}

export interface CommunityFeed {
  hotDiscussions: Discussion[];
  activeUsers: CommunityActiveUser[];
  hotTopics: HotTopic[];
  stats: CommunityStats;
}

export const communityService = {
  // 获取社区动态聚合数据
  getCommunityFeed: () => request.get<CommunityFeed>('/community/feed'),

  // 获取热门讨论列表
  getHotDiscussions: (limit: number = 10) =>
    request.get<Discussion[]>('/community/discussions/hot', { limit }),

  // 获取最新讨论列表
  getNewDiscussions: (limit: number = 10) =>
    request.get<Discussion[]>('/community/discussions/new', { limit }),

  // 获取趋势讨论列表
  getTrendingDiscussions: (limit: number = 10) =>
    request.get<Discussion[]>('/community/discussions/trending', { limit }),

  // 获取活跃用户列表
  getActiveUsers: (limit: number = 10) =>
    request.get<CommunityActiveUser[]>('/community/users/active', { limit }),

  // 获取热门话题标签
  getHotTopics: (limit: number = 10) =>
    request.get<HotTopic[]>('/community/topics/hot', { limit }),

  // 获取社区统计数据
  getCommunityStats: () => request.get<CommunityStats>('/community/stats'),
};

export default communityService;
