import { request } from './api';
import type { PageRequest, PageResponse } from '@/types/api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  sortOrder: number;
  createdAt: string;
  children?: Category[];
  knowledgeCount?: number;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
}

export const categoryService = {
  // 获取分类列表
  getCategories: (params?: PageRequest) =>
    request.get<PageResponse<Category>>('/categories', { params }),

  // 获取分类树
  getCategoryTree: () => request.get<CategoryTree[]>('/categories/tree'),

  // 获取分类详情
  getCategoryById: (id: number) => request.get<Category>(`/categories/${id}`),

  // 创建分类
  createCategory: (data: CreateCategoryRequest) =>
    request.post<Category>('/categories', data),

  // 更新分类
  updateCategory: (id: number, data: UpdateCategoryRequest) =>
    request.put<Category>(`/categories/${id}`, data),

  // 删除分类
  deleteCategory: (id: number) => request.delete(`/categories/${id}`),

  // 获取分类统计
  getCategoryStats: (id: number) =>
    request.get<{ knowledgeCount: number; totalViews: number }>(
      `/categories/${id}/stats`
    ),
};
