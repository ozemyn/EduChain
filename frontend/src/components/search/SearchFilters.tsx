import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Button, Space, Tag, Collapse } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { Category } from '@/types/api';
import { categoryService } from '@/services';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export interface SearchFiltersValue {
  categoryId?: number;
  type?: string;
  tags?: string[];
  dateRange?: [string, string];
  sortBy?: 'RELEVANCE' | 'TIME' | 'POPULARITY';
}

interface SearchFiltersProps {
  value?: SearchFiltersValue;
  onChange?: (filters: SearchFiltersValue) => void;
  onReset?: () => void;
  collapsed?: boolean;
  className?: string;
}

const CONTENT_TYPES = [
  { label: '全部类型', value: '' },
  { label: '文本', value: 'TEXT' },
  { label: '图片', value: 'IMAGE' },
  { label: '视频', value: 'VIDEO' },
  { label: 'PDF', value: 'PDF' },
  { label: '链接', value: 'LINK' },
];

const POPULAR_TAGS = [
  'JavaScript',
  'React',
  'Vue',
  'Node.js',
  'Python',
  'Java',
  '前端开发',
  '后端开发',
  '数据库',
  '算法',
  '设计模式',
  '机器学习',
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  value = {},
  onChange,
  onReset,
  collapsed = false,
  className,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof SearchFiltersValue,
    newValue: unknown
  ) => {
    const newFilters = { ...value, [key]: newValue };
    onChange?.(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = value.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    handleFilterChange('tags', newTags);
  };

  const handleReset = () => {
    onChange?.({});
    onReset?.();
  };

  const hasActiveFilters = Object.values(value).some(
    v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  );

  const renderCategoryOptions = (categories: Category[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <Option value={category.id}>
          {'　'.repeat(level)}
          {category.name}
        </Option>
        {category.children &&
          renderCategoryOptions(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  const filtersContent = (
    <div className="cnki-filters-content">
      {/* 分类筛选 */}
      <div className="cnki-filter-section">
        <h4 className="cnki-filter-label">学科分类</h4>
        <Select
          placeholder="选择分类"
          value={value.categoryId}
          onChange={val => handleFilterChange('categoryId', val)}
          allowClear
          loading={loading}
          size="small"
          style={{ width: '100%' }}
        >
          <Option value="">全部分类</Option>
          {renderCategoryOptions(categories)}
        </Select>
      </div>

      {/* 内容类型筛选 */}
      <div className="cnki-filter-section">
        <h4 className="cnki-filter-label">文献类型</h4>
        <Select
          placeholder="选择类型"
          value={value.type || ''}
          onChange={val => handleFilterChange('type', val)}
          size="small"
          style={{ width: '100%' }}
        >
          {CONTENT_TYPES.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      </div>

      {/* 发布时间筛选 */}
      <div className="cnki-filter-section">
        <h4 className="cnki-filter-label">发表时间</h4>
        <RangePicker
          placeholder={['开始时间', '结束时间']}
          value={
            value.dateRange && value.dateRange[0] && value.dateRange[1]
              ? [dayjs(value.dateRange[0]), dayjs(value.dateRange[1])]
              : undefined
          }
          onChange={(dates, dateStrings) =>
            handleFilterChange(
              'dateRange',
              dates && dates[0] && dates[1] ? dateStrings : undefined
            )
          }
          size="small"
          style={{ width: '100%' }}
        />
      </div>

      {/* 热门标签 */}
      <div className="cnki-filter-section">
        <h4 className="cnki-filter-label">热门主题</h4>
        <div className="cnki-tags-container">
          {POPULAR_TAGS.slice(0, 8).map(tag => (
            <Tag
              key={tag}
              color={value.tags?.includes(tag) ? 'blue' : 'default'}
              onClick={() => handleTagToggle(tag)}
              className="cnki-tag-item"
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );

  if (collapsed) {
    return (
      <div className={`cnki-filters-collapsed ${className}`}>
        <Collapse ghost>
          <Panel
            header={
              <Space>
                <FilterOutlined />
                高级筛选
                {hasActiveFilters && (
                  <Tag color="blue">
                    {
                      Object.values(value).filter(
                        v =>
                          v !== undefined &&
                          v !== '' &&
                          (Array.isArray(v) ? v.length > 0 : true)
                      ).length
                    }
                  </Tag>
                )}
              </Space>
            }
            key="filters"
          >
            {filtersContent}
          </Panel>
        </Collapse>
      </div>
    );
  }

  return (
    <div className={`cnki-filters-panel ${className}`}>
      <div className="cnki-filters-header">
        <h3 className="cnki-filters-title">
          <FilterOutlined />
          筛选条件
        </h3>
        {hasActiveFilters && (
          <Button
            type="link"
            size="small"
            onClick={handleReset}
            className="cnki-clear-all"
          >
            清空筛选
          </Button>
        )}
      </div>
      {filtersContent}
    </div>
  );
};

export default SearchFilters;

// 知网风格筛选面板样式
const cnkiFiltersStyles = `
.cnki-filters-panel {
  background: var(--bg-elevated);
  height: 100%;
}

.cnki-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.cnki-filters-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.cnki-clear-all {
  color: var(--accent-primary);
  font-size: 0.875rem;
  padding: 0;
}

.cnki-filters-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.cnki-filter-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.cnki-filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
}

.cnki-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.cnki-tag-item {
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  user-select: none;
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
}

.cnki-tag-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cnki-filters-collapsed {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .cnki-filters-panel {
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .cnki-filters-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .cnki-clear-all {
    align-self: flex-end;
  }
}
`;

// 动态注入筛选面板样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = cnkiFiltersStyles;
  document.head.appendChild(styleElement);
}
