import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Tag, Row, Col } from 'antd';
import {
  SearchOutlined,
  ClearOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { CategorySelector } from '@/components/knowledge';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Search } = Input;
const { Option } = Select;

interface KnowledgeFilterProps {
  onFilter: (filters: FilterValues) => void;
  loading?: boolean;
}

export interface FilterValues {
  keyword?: string;
  categoryId?: number;
  type?: string;
  sortBy?: string;
  tags?: string[];
}

const KnowledgeFilter: React.FC<KnowledgeFilterProps> = ({
  onFilter,
  loading = false,
}) => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const contentTypes = [
    { label: '全部类型', value: '' },
    { label: '文本', value: 'TEXT' },
    { label: '图片', value: 'IMAGE' },
    { label: '视频', value: 'VIDEO' },
    { label: 'PDF', value: 'PDF' },
    { label: '链接', value: 'LINK' },
  ];

  const sortOptions = [
    { label: '最新发布', value: 'TIME' },
    { label: '最受欢迎', value: 'POPULARITY' },
    { label: '相关性', value: 'RELEVANCE' },
  ];

  const popularTags = [
    'JavaScript',
    'React',
    'Vue',
    'Node.js',
    'Python',
    'Java',
    'Spring Boot',
    'MySQL',
    'Redis',
    '算法',
    '数据结构',
    '前端',
    '后端',
    '全栈',
    '移动开发',
    '人工智能',
    '机器学习',
    '深度学习',
  ];

  const handleFilterChange = (key: keyof FilterValues, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
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
    // 自动搜索当关键词变化时
    if (filters.keyword !== undefined) {
      const timer = setTimeout(() => {
        onFilter(filters);
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.keyword]);

  return (
    <div className="knowledge-filter-container glass-card">
      <div className="filter-header">
        <h3 className="filter-title">
          <FilterOutlined />
          筛选条件
        </h3>
      </div>

      <div className="filter-content">
        <Row gutter={[16, 16]} className="filter-controls">
          <Col xs={24} sm={12} md={8}>
            <div className="filter-item">
              <label className="filter-label">搜索内容</label>
              <Search
                placeholder="搜索知识内容..."
                value={filters.keyword}
                onChange={e => handleFilterChange('keyword', e.target.value)}
                onSearch={handleSearch}
                loading={loading}
                allowClear
                className="filter-search glass-input"
                size="large"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label className="filter-label">分类</label>
              <CategorySelector
                placeholder="选择分类"
                value={filters.categoryId}
                onChange={value => handleFilterChange('categoryId', value)}
                allowClear
                showCount
                className="filter-select glass-input"
                size="large"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <div className="filter-item">
              <label className="filter-label">内容类型</label>
              <Select
                placeholder="内容类型"
                value={filters.type}
                onChange={value => handleFilterChange('type', value)}
                className="filter-select glass-input"
                size="large"
              >
                {contentTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <div className="filter-item">
              <label className="filter-label">排序方式</label>
              <Select
                placeholder="排序方式"
                value={filters.sortBy || 'TIME'}
                onChange={value => handleFilterChange('sortBy', value)}
                className="filter-select glass-input"
                size="large"
              >
                {sortOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        <div className="filter-tags">
          <div className="tags-header">
            <span className="tags-label">热门标签</span>
          </div>
          <div className="tags-list">
            {popularTags.map(tag => (
              <Tag.CheckableTag
                key={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
                className={`filter-tag glass-badge hover-scale ${
                  selectedTags.includes(tag) ? 'tag-selected' : ''
                }`}
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            className="glass-button hover-scale active-scale"
            size="large"
          >
            清空筛选
          </Button>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
            className="glass-button glass-strong hover-lift active-scale primary-button"
            size="large"
          >
            搜索
          </Button>
        </div>
      </div>

      <style>{`
        /* ===== 知识筛选器样式 ===== */
        .knowledge-filter-container {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius-lg);
          margin-bottom: var(--spacing-xl);
          border: none !important;
          background: var(--glass-bg-medium) !important;
          backdrop-filter: var(--blur-md) !important;
          -webkit-backdrop-filter: var(--blur-md) !important;
          box-shadow: var(--glass-shadow-md) !important;
          border: 1px solid var(--glass-border) !important;
        }

        /* 筛选器头部 */
        .filter-header {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-light);
        }

        .filter-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        /* 筛选器内容 */
        .filter-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        /* 筛选控件 */
        .filter-controls {
          margin: 0;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .filter-search,
        .filter-select {
          width: 100%;
        }

        .glass-input .ant-input,
        .glass-input .ant-select-selector {
          background: var(--glass-bg-light) !important;
          border: 2px solid var(--border-color) !important;
          border-radius: var(--radius-md) !important;
          transition: all var(--transition-fast) var(--ease-ios) !important;
          backdrop-filter: var(--blur-sm) !important;
          -webkit-backdrop-filter: var(--blur-sm) !important;
        }

        .glass-input .ant-input:hover,
        .glass-input .ant-select-selector:hover {
          border-color: var(--accent-primary) !important;
          background: var(--glass-bg-medium) !important;
        }

        .glass-input .ant-input:focus,
        .glass-input .ant-select-focused .ant-select-selector {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 0 3px var(--primary-200) !important;
          background: var(--glass-bg-medium) !important;
        }

        /* 标签区域 */
        .filter-tags {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .tags-header {
          display: flex;
          align-items: center;
        }

        .tags-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .filter-tag {
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 500;
          background: var(--glass-bg-light);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast) var(--ease-ios);
          user-select: none;
        }

        .filter-tag:hover {
          background: var(--glass-bg-medium);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: scale(1.05);
        }

        .filter-tag.tag-selected {
          background: linear-gradient(135deg, var(--accent-primary), var(--primary-600));
          color: white;
          border-color: var(--accent-primary);
          box-shadow: var(--glass-shadow-sm);
        }

        .filter-tag.tag-selected:hover {
          background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
          transform: scale(1.05);
        }

        /* 操作按钮 */
        .filter-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .primary-button {
          background: linear-gradient(135deg, var(--accent-primary), var(--primary-600)) !important;
          border: none !important;
          color: white !important;
          font-weight: 600 !important;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .knowledge-filter-container {
            padding: var(--spacing-lg);
          }

          .filter-controls .ant-col {
            margin-bottom: var(--spacing-md);
          }

          .filter-actions {
            justify-content: center;
            flex-direction: column;
          }

          .filter-actions .glass-button {
            width: 100%;
            justify-content: center;
          }

          .tags-list {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .filter-title {
            font-size: 1.125rem;
            justify-content: center;
          }

          .filter-header {
            text-align: center;
          }

          .tags-header {
            justify-content: center;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .filter-tag,
          .glass-input .ant-input,
          .glass-input .ant-select-selector {
            transition: none !important;
            transform: none !important;
          }

          .filter-tag:hover,
          .filter-tag.tag-selected:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeFilter;
