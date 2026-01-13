/**
 * 分类 Mock 数据
 * 包含完整的分类树结构
 */

import type { Category } from '@/types/api';

export const mockCategories: Category[] = [
  // 根分类
  {
    id: 1,
    name: '前端开发',
    description: '前端相关技术',
    parentId: undefined,
    sortOrder: 1,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 156,
  },
  {
    id: 2,
    name: '后端开发',
    description: '后端相关技术',
    parentId: undefined,
    sortOrder: 2,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 189,
  },
  {
    id: 3,
    name: '数据库',
    description: '数据库相关技术',
    parentId: undefined,
    sortOrder: 3,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 98,
  },
  {
    id: 4,
    name: '移动开发',
    description: '移动应用开发',
    parentId: undefined,
    sortOrder: 4,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 87,
  },
  {
    id: 5,
    name: '人工智能',
    description: 'AI 和机器学习',
    parentId: undefined,
    sortOrder: 5,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 134,
  },
  {
    id: 6,
    name: '云计算',
    description: '云服务和容器技术',
    parentId: undefined,
    sortOrder: 6,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 76,
  },
  {
    id: 7,
    name: '网络安全',
    description: '信息安全和网络安全',
    parentId: undefined,
    sortOrder: 7,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 65,
  },
  {
    id: 8,
    name: '区块链',
    description: '区块链技术和应用',
    parentId: undefined,
    sortOrder: 8,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 43,
  },

  // 前端开发子分类
  {
    id: 11,
    name: 'React',
    description: 'React 框架',
    parentId: 1,
    sortOrder: 1,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 58,
  },
  {
    id: 12,
    name: 'Vue',
    description: 'Vue 框架',
    parentId: 1,
    sortOrder: 2,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 52,
  },
  {
    id: 13,
    name: 'Angular',
    description: 'Angular 框架',
    parentId: 1,
    sortOrder: 3,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 28,
  },
  {
    id: 14,
    name: 'TypeScript',
    description: 'TypeScript 语言',
    parentId: 1,
    sortOrder: 4,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 18,
  },

  // 后端开发子分类
  {
    id: 21,
    name: 'Spring Boot',
    description: 'Spring Boot 框架',
    parentId: 2,
    sortOrder: 1,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 67,
  },
  {
    id: 22,
    name: 'Node.js',
    description: 'Node.js 运行时',
    parentId: 2,
    sortOrder: 2,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 54,
  },
  {
    id: 23,
    name: 'Django',
    description: 'Django 框架',
    parentId: 2,
    sortOrder: 3,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 38,
  },
  {
    id: 24,
    name: 'Go',
    description: 'Go 语言',
    parentId: 2,
    sortOrder: 4,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 30,
  },

  // 数据库子分类
  {
    id: 31,
    name: 'MySQL',
    description: 'MySQL 数据库',
    parentId: 3,
    sortOrder: 1,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 42,
  },
  {
    id: 32,
    name: 'Redis',
    description: 'Redis 缓存',
    parentId: 3,
    sortOrder: 2,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 35,
  },
  {
    id: 33,
    name: 'MongoDB',
    description: 'MongoDB 文档数据库',
    parentId: 3,
    sortOrder: 3,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 21,
  },

  // 移动开发子分类
  {
    id: 41,
    name: 'React Native',
    description: 'React Native 框架',
    parentId: 4,
    sortOrder: 1,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 32,
  },
  {
    id: 42,
    name: 'Flutter',
    description: 'Flutter 框架',
    parentId: 4,
    sortOrder: 2,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 38,
  },
  {
    id: 43,
    name: 'iOS',
    description: 'iOS 原生开发',
    parentId: 4,
    sortOrder: 3,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 17,
  },

  // 人工智能子分类
  {
    id: 51,
    name: '机器学习',
    description: '机器学习算法和应用',
    parentId: 5,
    sortOrder: 1,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 56,
  },
  {
    id: 52,
    name: '深度学习',
    description: '深度学习和神经网络',
    parentId: 5,
    sortOrder: 2,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 48,
  },
  {
    id: 53,
    name: '自然语言处理',
    description: 'NLP 技术',
    parentId: 5,
    sortOrder: 3,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 30,
  },

  // 云计算子分类
  {
    id: 61,
    name: 'Docker',
    description: 'Docker 容器技术',
    parentId: 6,
    sortOrder: 1,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 38,
  },
  {
    id: 62,
    name: 'Kubernetes',
    description: 'Kubernetes 容器编排',
    parentId: 6,
    sortOrder: 2,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 28,
  },
  {
    id: 63,
    name: 'AWS',
    description: 'Amazon Web Services',
    parentId: 6,
    sortOrder: 3,
    createdAt: '2025-12-01T00:00:00Z',
    knowledgeCount: 10,
  },
];

// 构建分类树
export const buildCategoryTree = (categories: Category[]): Category[] => {
  const categoryMap = new Map<number, Category>();
  const rootCategories: Category[] = [];

  // 创建映射
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // 构建树结构
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
};

export const mockCategoryTree = buildCategoryTree(mockCategories);
