'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { categoryService } from '@/services';
import type { Category } from '@/types/api';
import './KnowledgeFilter.css';

export interface FilterValues {
  keyword?: string;
  categoryId?: number;
  type?: string;
  sortBy?: string;
  tags?: string[];
}

interface KnowledgeFilterProps {
  onFilter: (filters: FilterValues) => void;
  loading?: boolean;
}

export const KnowledgeFilter: React.FC<KnowledgeFilterProps> = ({
  onFilter,
  loading = false,
}) => {
  const content = useIntlayer('knowledge-filter');
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // 加载分类数据
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (response.success && response.data) {
          // 只获取根分类（没有 parentId 的分类）
          const rootCategories = response.data.filter(cat => !cat.parentId);
          setCategories(rootCategories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  const contentTypes = [
    { label: content.types.all, value: '' },
    { label: content.types.text, value: 'TEXT' },
    { label: content.types.image, value: 'IMAGE' },
    { label: content.types.video, value: 'VIDEO' },
    { label: content.types.pdf, value: 'PDF' },
    { label: content.types.link, value: 'LINK' },
  ];

  const sortOptions = [
    { label: content.sort.latest, value: 'TIME' },
    { label: content.sort.popular, value: 'POPULARITY' },
    { label: content.sort.relevant, value: 'RELEVANCE' },
  ];

  const popularTags = [
    { key: 'JavaScript', label: 'JavaScript' },
    { key: 'React', label: 'React' },
    { key: 'Vue', label: 'Vue' },
    { key: 'Node.js', label: 'Node.js' },
    { key: 'Python', label: 'Python' },
    { key: 'Java', label: 'Java' },
    { key: 'Spring Boot', label: 'Spring Boot' },
    { key: 'MySQL', label: 'MySQL' },
    { key: 'Redis', label: 'Redis' },
    { key: 'algorithm', label: content.tags.algorithm },
    { key: 'dataStructure', label: content.tags.dataStructure },
    { key: 'frontend', label: content.tags.frontend },
    { key: 'backend', label: content.tags.backend },
    { key: 'fullstack', label: content.tags.fullstack },
    { key: 'mobile', label: content.tags.mobile },
    { key: 'ai', label: content.tags.ai },
    { key: 'ml', label: content.tags.ml },
    { key: 'dl', label: content.tags.dl },
  ];

  const handleFilterChange = (key: keyof FilterValues, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    handleFilterChange('tags', newTags);
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleClear = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    setSelectedTags([]);
    onFilter(clearedFilters);
  };

  useEffect(() => {
    if (filters.keyword !== undefined) {
      const timer = setTimeout(() => {
        onFilter(filters);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filters.keyword]);

  return (
    <div className="knowledge-filter glass-card">
      {/* 标题 */}
      <h3 className="filter-title">{content.title}</h3>

      {/* 第一行：搜索框 + 下拉选择器 */}
      <div className="filter-row-main">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={String(content.placeholders.search.value || content.placeholders.search)}
            value={filters.keyword || ''}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="filter-input glass-input"
          />
        </div>

        <select
          value={filters.categoryId || ''}
          onChange={(e) => handleFilterChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
          className="filter-select glass-input"
        >
          <option value="">{content.labels.category}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="filter-select glass-input"
        >
          {contentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy || 'TIME'}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="filter-select glass-input"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 第二行：热门标签 */}
      <div className="filter-tags-row">
        <label className="tags-label">{content.labels.tags}</label>
        <div className="tags-list">
          {popularTags.map((tag) => (
            <button
              key={tag.key}
              onClick={() => handleTagToggle(tag.key)}
              className={`tag-btn glass-badge ${
                selectedTags.includes(tag.key) ? 'active' : ''
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="filter-actions">
        <button
          onClick={handleClear}
          className="filter-btn glass-button"
          disabled={loading}
        >
          {content.actions.clear}
        </button>
        <button
          onClick={handleSearch}
          className="filter-btn glass-button primary"
          disabled={loading}
        >
          {content.actions.search}
        </button>
      </div>
    </div>
  );
};
