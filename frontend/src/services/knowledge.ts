import { request } from './api';
import type {
  KnowledgeItem,
  CreateKnowledgeRequest,
  PageResponse,
  PageRequest,
} from '@/types/api';

export interface UpdateKnowledgeRequest {
  title?: string;
  content?: string;
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
  mediaUrls?: string[];
  linkUrl?: string;
  categoryId?: number;
  tags?: string;
}

export interface KnowledgeVersion {
  id: number;
  knowledgeId: number;
  versionNumber: number;
  title: string;
  content: string;
  changeSummary?: string;
  createdAt: string;
  createdBy: number;
}

export interface VersionDiff {
  version1: KnowledgeVersion;
  version2: KnowledgeVersion;
  titleDiff?: string;
  contentDiff?: string;
}

export interface KnowledgeStatsResponse {
  totalKnowledge: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  todayCreated: number;
}

export interface UserKnowledgeStats {
  userId: number;
  totalKnowledge: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageScore: number;
}

export const knowledgeService = {
  // 获取知识列表
  getKnowledgeList: (
    params: PageRequest & { categoryId?: number; type?: string }
  ) => request.get<PageResponse<KnowledgeItem>>('/knowledge', { params }),

  // 获取知识详情（通过分享码）
  getKnowledgeByShareCode: (shareCode: string) =>
    request.get<KnowledgeItem>(`/knowledge/share/${shareCode}`),

  // 获取知识详情（通过ID，兼容旧版本）
  getKnowledgeById: (id: number) =>
    request.get<KnowledgeItem>(`/knowledge/${id}`),

  // 创建知识
  createKnowledge: (data: CreateKnowledgeRequest) =>
    request.post<KnowledgeItem>('/knowledge', data),

  // 创建知识（带文件上传）
  createKnowledgeWithFiles: (data: FormData) =>
    request.post<KnowledgeItem>('/knowledge/with-files', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // 更新知识
  updateKnowledge: (id: number, data: Partial<CreateKnowledgeRequest>) =>
    request.put<KnowledgeItem>(`/knowledge/${id}`, data),

  // 更新知识（带文件上传）
  updateKnowledgeWithFiles: (id: number, data: FormData) =>
    request.put<KnowledgeItem>(`/knowledge/${id}/with-files`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // 删除知识
  deleteKnowledge: (id: number) => request.delete(`/knowledge/${id}`),

  // 批量删除知识
  batchDeleteKnowledge: (ids: number[]) =>
    request.post('/knowledge/batch-delete', ids),

  // 恢复知识
  restoreKnowledge: (id: number) => request.put(`/knowledge/${id}/restore`),

  // 获取用户的知识内容
  getKnowledgeByUser: (userId: number, params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>(`/knowledge/user/${userId}`, {
      params,
    }),

  // 获取分类下的知识内容
  getKnowledgeByCategory: (categoryId: number, params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>(
      `/knowledge/category/${categoryId}`,
      { params }
    ),

  // 根据标签获取知识内容
  getKnowledgeByTag: (tag: string, params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>(`/knowledge/tag/${tag}`, {
      params,
    }),

  // 搜索知识
  searchKnowledge: (keyword: string, params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>('/knowledge/search', {
      params: { keyword, ...params },
    }),

  // 高级搜索
  advancedSearch: (filter: Record<string, unknown>, params: PageRequest) =>
    request.post<PageResponse<KnowledgeItem>>(
      '/knowledge/advanced-search',
      filter,
      { params }
    ),

  // 获取热门内容
  getPopularKnowledge: (params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>('/knowledge/popular', { params }),

  // 获取最新内容
  getLatestKnowledge: (params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>('/knowledge/latest', { params }),

  // 获取推荐内容
  getRecommendedKnowledge: (params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>('/knowledge/recommended', {
      params,
    }),

  // 获取相关内容
  getRelatedKnowledge: (id: number, limit: number = 10) =>
    request.get<KnowledgeItem[]>(`/knowledge/${id}/related`, {
      params: { limit },
    }),

  // 获取版本历史
  getVersionHistory: (id: number, params: PageRequest) =>
    request.get<PageResponse<KnowledgeVersion>>(`/knowledge/${id}/versions`, {
      params,
    }),

  // 获取指定版本
  getVersion: (id: number, versionNumber: number) =>
    request.get<KnowledgeVersion>(`/knowledge/${id}/versions/${versionNumber}`),

  // 恢复到指定版本
  restoreToVersion: (
    id: number,
    versionNumber: number,
    changeSummary?: string
  ) =>
    request.post<KnowledgeItem>(`/knowledge/${id}/restore-version`, null, {
      params: { versionNumber, changeSummary },
    }),

  // 比较版本差异
  compareVersions: (id: number, version1: number, version2: number) =>
    request.get<VersionDiff>(`/knowledge/${id}/compare-versions`, {
      params: { version1, version2 },
    }),

  // 保存草稿
  saveDraft: (data: CreateKnowledgeRequest) =>
    request.post<KnowledgeItem>('/knowledge/drafts', data),

  // 发布草稿
  publishDraft: (id: number) =>
    request.post<KnowledgeItem>(`/knowledge/${id}/publish`),

  // 获取用户草稿
  getUserDrafts: (params: PageRequest) =>
    request.get<PageResponse<KnowledgeItem>>('/knowledge/drafts', { params }),

  // 批量更新状态
  batchUpdateStatus: (ids: number[], status: number) =>
    request.post('/knowledge/batch-update-status', { ids, status }),

  // 获取知识内容统计
  getKnowledgeStats: () =>
    request.get<KnowledgeStatsResponse>('/knowledge/stats'),

  // 获取用户知识内容统计
  getUserKnowledgeStats: (userId: number) =>
    request.get<UserKnowledgeStats>(`/knowledge/user-stats/${userId}`),
};
