/**
 * 社区服务 - Community Service
 * 提供社区相关的API调用
 */

import api from './api';

/**
 * 讨论数据类型
 */
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

/**
 * 社区活跃用户数据类型
 */
export interface CommunityActiveUser {
  id: number;
  name: string;
  avatar: string;
  posts: number;
  likes: number;
  level: string;
  rank: number;
}

/**
 * 热门话题数据类型
 */
export interface HotTopic {
  name: string;
  count: number;
  color: string;
}

/**
 * 社区统计数据类型
 */
export interface CommunityStats {
  activeUsers: number;
  totalDiscussions: number;
  todayPosts: number;
  todayComments: number;
}

/**
 * 社区动态聚合数据类型
 */
export interface CommunityFeed {
  hotDiscussions: Discussion[];
  activeUsers: CommunityActiveUser[];
  hotTopics: HotTopic[];
  stats: CommunityStats;
}

/**
 * 社区服务类
 */
class CommunityService {
  /**
   * 获取社区动态聚合数据
   * 一次性获取社区页面所需的所有数据
   */
  async getCommunityFeed(): Promise<CommunityFeed> {
    const response = await api.get<CommunityFeed>('/community/feed');
    return response.data;
  }

  /**
   * 获取热门讨论列表
   * @param limit 返回数量，默认10
   */
  async getHotDiscussions(limit: number = 10): Promise<Discussion[]> {
    const response = await api.get<Discussion[]>('/community/discussions/hot', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取最新讨论列表
   * @param limit 返回数量，默认10
   */
  async getNewDiscussions(limit: number = 10): Promise<Discussion[]> {
    const response = await api.get<Discussion[]>('/community/discussions/new', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取趋势讨论列表
   * @param limit 返回数量，默认10
   */
  async getTrendingDiscussions(limit: number = 10): Promise<Discussion[]> {
    const response = await api.get<Discussion[]>(
      '/community/discussions/trending',
      {
        params: { limit },
      }
    );
    return response.data;
  }

  /**
   * 获取活跃用户列表
   * @param limit 返回数量，默认10
   */
  async getActiveUsers(limit: number = 10): Promise<CommunityActiveUser[]> {
    const response = await api.get<CommunityActiveUser[]>(
      '/community/users/active',
      {
        params: { limit },
      }
    );
    return response.data;
  }

  /**
   * 获取热门话题标签
   * @param limit 返回数量，默认10
   */
  async getHotTopics(limit: number = 10): Promise<HotTopic[]> {
    const response = await api.get<HotTopic[]>('/community/topics/hot', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取社区统计数据
   */
  async getCommunityStats(): Promise<CommunityStats> {
    const response = await api.get<CommunityStats>('/community/stats');
    return response.data;
  }
}

// 导出单例
export const communityService = new CommunityService();
export default communityService;
