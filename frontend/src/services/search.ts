import { request } from './api';
import type { SearchRequest, KnowledgeItem, PageResponse } from '@/types/api';

export interface SearchSuggestion {
  keyword: string;
  count: number;
}

export interface HotKeyword {
  keyword: string;
  searchCount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SearchHistory {
  id: number;
  keyword: string;
  searchTime: string;
}

export interface AdvancedSearchRequest extends SearchRequest {
  tags?: string[];
  dateRange?: [string, string];
  author?: string;
}

export const searchService = {
  // 基础搜索
  search: (params: SearchRequest) =>
    request.post<PageResponse<KnowledgeItem>>('/search', params),

  // 高级搜索
  advancedSearch: (params: AdvancedSearchRequest) =>
    request.post<PageResponse<KnowledgeItem>>('/search/advanced', params),

  // 获取搜索建议
  getSuggestions: (keyword: string) =>
    request.get<SearchSuggestion[]>('/search/suggestions', {
      params: { keyword },
    }),

  // 获取热门关键词
  getHotKeywords: (limit: number = 10) =>
    request.get<HotKeyword[]>('/search/hot-keywords', {
      params: { limit },
    }),

  // 获取搜索历史
  getSearchHistory: (limit: number = 20) =>
    request.get<SearchHistory[]>('/search/history', {
      params: { limit },
    }),

  // 清除搜索历史
  clearSearchHistory: () => request.delete('/search/history'),

  // 删除单个搜索历史
  deleteSearchHistory: (id: number) => request.delete(`/search/history/${id}`),

  // 获取推荐内容
  getRecommendations: (userId?: number, limit: number = 10) =>
    request.get<KnowledgeItem[]>('/recommendations', {
      params: { userId, limit },
    }),

  // 获取个性化推荐
  getPersonalizedRecommendations: (limit: number = 10) =>
    request.get<KnowledgeItem[]>('/recommendations/personalized', {
      params: { limit },
    }),

  // 获取热门内容
  getTrendingContent: (
    timeRange: 'day' | 'week' | 'month' = 'week',
    limit: number = 10
  ) =>
    request.get<KnowledgeItem[]>('/recommendations/trending', {
      params: { timeRange, limit },
    }),

  // 获取相似内容推荐
  getSimilarContent: (knowledgeId: number, limit: number = 5) =>
    request.get<KnowledgeItem[]>(`/recommendations/similar/${knowledgeId}`, {
      params: { limit },
    }),

  // 推荐反馈
  submitRecommendationFeedback: (
    knowledgeId: number,
    feedback: 'like' | 'dislike' | 'not_interested'
  ) =>
    request.post('/recommendations/feedback', {
      knowledgeId,
      feedback,
    }),
};
