import { request } from './api';
import type {
  KnowledgeItem,
  CreateKnowledgeRequest,
  PageResponse,
  PageRequest,
  SearchRequest,
  SearchResult,
} from '@/types/api';

export const knowledgeService = {
  // 获取知识列表
  getKnowledgeList: (
    params: PageRequest & { categoryId?: number; type?: string }
  ) => request.get<PageResponse<KnowledgeItem>>('/knowledge', { params }),

  // 获取知识详情
  getKnowledgeById: (id: number) =>
    request.get<KnowledgeItem>(`/knowledge/${id}`),

  // 创建知识
  createKnowledge: (data: CreateKnowledgeRequest) =>
    request.post<KnowledgeItem>('/knowledge', data),

  // 更新知识
  updateKnowledge: (id: number, data: Partial<CreateKnowledgeRequest>) =>
    request.put<KnowledgeItem>(`/knowledge/${id}`, data),

  // 删除知识
  deleteKnowledge: (id: number) => request.delete(`/knowledge/${id}`),

  // 搜索知识
  searchKnowledge: (params: SearchRequest) =>
    request.get<SearchResult>('/search', { params }),

  // 获取推荐内容
  getRecommendations: (userId?: number) =>
    request.get<KnowledgeItem[]>('/knowledge/recommendations', {
      params: userId ? { userId } : {},
    }),

  // 获取热门内容
  getHotKnowledge: (params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>('/knowledge/hot', { params }),
};
