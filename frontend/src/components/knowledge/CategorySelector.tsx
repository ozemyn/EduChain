import React, { useState, useEffect } from 'react';
import { TreeSelect, Spin, Empty, message } from 'antd';
import type { Category } from '@/types';
import { categoryService } from '@/services/category';

interface CategorySelectorProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  showCount?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
}

interface TreeNode {
  title: string;
  value: number;
  key: number;
  children?: TreeNode[];
}

const CategorySelector: React.FC<CategorySelectorProps> = React.memo(({
  value,
  onChange,
  placeholder = '请选择分类',
  allowClear = true,
  disabled = false,
  showCount = false,
  size = 'middle',
  className,
}) => {
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // 加载分类数据 - 从后端API获取
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategoryTree();
      const categories = response.data || [];
      setTreeData(convertToTreeData(categories));
    } catch (error) {
      console.error('Failed to load categories:', error);
      message.error('加载分类失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 转换为TreeSelect需要的数据格式
  const convertToTreeData = (categories: Category[]): TreeNode[] => {
    return categories.map(category => {
      // 适配后端返回的字段名（knowledgeItemCount 或 knowledgeCount）
      const categoryWithCount = category as Category & {
        knowledgeItemCount?: number;
      };
      const count =
        categoryWithCount.knowledgeItemCount ?? category.knowledgeCount;
      return {
        title:
          showCount && count !== undefined
            ? `${category.name} (${count})`
            : category.name,
        value: category.id,
        key: category.id,
        children: category.children
          ? convertToTreeData(category.children)
          : undefined,
      };
    });
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理值变化，确保返回数字类型
  const handleChange = (val: number | string | undefined) => {
    if (onChange) {
      // 将值转换为数字类型
      if (val === undefined || val === null || val === '') {
        onChange(undefined);
      } else {
        const numValue = typeof val === 'string' ? Number(val) : val;
        onChange(isNaN(numValue) ? undefined : numValue);
      }
    }
  };

  return (
    <TreeSelect
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled}
      size={size}
      loading={loading}
      treeData={treeData}
      showSearch
      treeDefaultExpandAll
      className={className}
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
      styles={{ popup: { root: { maxHeight: 400, overflow: 'auto' } } }}
      treeNodeFilterProp="title"
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
    />
  );
});

CategorySelector.displayName = 'CategorySelector';

export default CategorySelector;
