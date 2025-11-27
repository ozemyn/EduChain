import { request } from './api';
import type { Category } from '@/types/api';

export const categoryService = {
  // 获取所有分类（树形结构）
  getCategories: () => request.get<Category[]>('/categories'),

  // 获取分类详情
  getCategoryById: (id: number) => request.get<Category>(`/categories/${id}`),

  // 创建分类
  createCategory: (data: {
    name: string;
    description?: string;
    parentId?: number;
  }) => request.post<Category>('/categories', data),

  // 更新分类
  updateCategory: (
    id: number,
    data: { name?: string; description?: string; parentId?: number }
  ) => request.put<Category>(`/categories/${id}`, data),

  // 删除分类
  deleteCategory: (id: number) => request.delete(`/categories/${id}`),

  // 获取分类下的知识内容数量
  getCategoryStats: (id: number) =>
    request.get<{ knowledgeCount: number }>(`/categories/${id}/stats`),
};
