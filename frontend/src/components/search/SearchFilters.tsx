import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Button, Space, Tag, Collapse } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { Category } from '@/types/api';
import { categoryService } from '@/services';
import dayjs from 'dayjs';
import styles from './SearchFilters.module.css';

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
    <div className={styles.filtersContent}>
      <div className={styles.filterRow}>
        <div className={styles.filterItem}>
          <label>学科分类</label>
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

        <div className={styles.filterItem}>
          <label>文献类型</label>
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
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterItem}>
          <label>发表时间</label>
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
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterItem}>
          <label>热门主题</label>
          <div className={styles.tagContainer}>
            {POPULAR_TAGS.slice(0, 8).map(tag => (
              <Tag
                key={tag}
                color={value.tags?.includes(tag) ? 'blue' : 'default'}
                onClick={() => handleTagToggle(tag)}
                className={styles.tagItem}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.filterActions}>
        <Button onClick={handleReset} size="small">
          重置筛选
        </Button>
      </div>
    </div>
  );

  if (collapsed) {
    return (
      <div className={`${styles.searchFilters} ${className}`}>
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
    <div className={`${styles.searchFilters} ${className}`}>
      {filtersContent}
    </div>
  );
};

export default SearchFilters;
