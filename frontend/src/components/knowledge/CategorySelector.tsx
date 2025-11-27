import React, { useState, useEffect } from 'react';
import { TreeSelect, Spin, Empty } from 'antd';
import type { Category } from '@/types';

interface CategorySelectorProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  showCount?: boolean;
  size?: 'small' | 'middle' | 'large';
}

interface TreeNode {
  title: string;
  value: number;
  key: number;
  children?: TreeNode[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  placeholder = '请选择分类',
  allowClear = true,
  disabled = false,
  showCount = false,
  size = 'middle',
}) => {
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // 加载分类数据
  const loadCategories = async () => {
    try {
      setLoading(true);

      // 模拟API调用
      const mockCategories: Category[] = [
        {
          id: 1,
          name: '前端开发',
          description: '前端相关技术',
          sortOrder: 1,
          createdAt: '2024-01-01',
          knowledgeCount: 25,
          children: [
            {
              id: 11,
              name: 'React',
              description: 'React框架',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 10,
              parentId: 1,
            },
            {
              id: 12,
              name: 'Vue',
              description: 'Vue框架',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 8,
              parentId: 1,
            },
            {
              id: 13,
              name: 'Angular',
              description: 'Angular框架',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 7,
              parentId: 1,
            },
          ],
        },
        {
          id: 2,
          name: '后端开发',
          description: '后端相关技术',
          sortOrder: 2,
          createdAt: '2024-01-01',
          knowledgeCount: 30,
          children: [
            {
              id: 21,
              name: 'Spring Boot',
              description: 'Spring Boot框架',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 15,
              parentId: 2,
            },
            {
              id: 22,
              name: 'Node.js',
              description: 'Node.js运行时',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 12,
              parentId: 2,
            },
            {
              id: 23,
              name: 'Django',
              description: 'Django框架',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 3,
              parentId: 2,
            },
          ],
        },
        {
          id: 3,
          name: '数据库',
          description: '数据库相关技术',
          sortOrder: 3,
          createdAt: '2024-01-01',
          knowledgeCount: 18,
          children: [
            {
              id: 31,
              name: 'MySQL',
              description: 'MySQL数据库',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 10,
              parentId: 3,
            },
            {
              id: 32,
              name: 'Redis',
              description: 'Redis缓存',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 5,
              parentId: 3,
            },
            {
              id: 33,
              name: 'MongoDB',
              description: 'MongoDB文档数据库',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 3,
              parentId: 3,
            },
          ],
        },
        {
          id: 4,
          name: '移动开发',
          description: '移动应用开发',
          sortOrder: 4,
          createdAt: '2024-01-01',
          knowledgeCount: 12,
          children: [
            {
              id: 41,
              name: 'React Native',
              description: 'React Native框架',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 6,
              parentId: 4,
            },
            {
              id: 42,
              name: 'Flutter',
              description: 'Flutter框架',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 4,
              parentId: 4,
            },
            {
              id: 43,
              name: 'iOS',
              description: 'iOS原生开发',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 2,
              parentId: 4,
            },
          ],
        },
      ];

      setTreeData(convertToTreeData(mockCategories));
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // 转换为TreeSelect需要的数据格式
  const convertToTreeData = (categories: Category[]): TreeNode[] => {
    return categories.map(category => ({
      title:
        showCount && category.knowledgeCount !== undefined
          ? `${category.name} (${category.knowledgeCount})`
          : category.name,
      value: category.id,
      key: category.id,
      children: category.children
        ? convertToTreeData(category.children)
        : undefined,
    }));
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TreeSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled}
      size={size}
      loading={loading}
      treeData={treeData}
      showSearch
      treeDefaultExpandAll
      filterTreeNode={(search, node) => {
        return (
          node.title?.toString().toLowerCase().includes(search.toLowerCase()) ||
          false
        );
      }}
      notFoundContent={
        loading ? (
          <Spin size="small" />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      }
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeNodeFilterProp="title"
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
    />
  );
};

export default CategorySelector;
