'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { categoryService } from '@/services';
import type { Category } from '@/types/api';
import './SearchFilter.css';

export interface SearchFilterValues {
  categoryId?: number;
  type?: string;
  sortBy?: string;
  dateRange?: string;
}

export interface SearchFilterProps {
  value: SearchFilterValues;
  onChange: (filters: SearchFilterValues) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ value, onChange }) => {
  const content = useIntlayer('search-filter');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (response.success && response.data) {
          const rootCategories = response.data.filter((cat) => !cat.parentId);
          setCategories(rootCategories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (key: keyof SearchFilterValues, val: string | number | undefined) => {
    onChange({ ...value, [key]: val });
  };

  const handleReset = () => {
    onChange({});
  };

  const types = [
    { label: content.types.all, value: '' },
    { label: content.types.text, value: 'TEXT' },
    { label: content.types.image, value: 'IMAGE' },
    { label: content.types.video, value: 'VIDEO' },
    { label: content.types.pdf, value: 'PDF' },
    { label: content.types.link, value: 'LINK' },
  ];

  const sortOptions = [
    { label: content.sortOptions.relevance, value: 'RELEVANCE' },
    { label: content.sortOptions.latest, value: 'TIME' },
    { label: content.sortOptions.popular, value: 'POPULARITY' },
  ];

  const dateOptions = [
    { label: content.dateOptions.all, value: '' },
    { label: content.dateOptions.today, value: 'today' },
    { label: content.dateOptions.week, value: 'week' },
    { label: content.dateOptions.month, value: 'month' },
    { label: content.dateOptions.year, value: 'year' },
  ];

  return (
    <div className="search-filter-container glass-card">
      <div className="filter-header">
        <h3>{content.title}</h3>
        <button onClick={handleReset} className="reset-btn glass-button">
          {content.reset}
        </button>
      </div>

      <div className="filter-groups-container">
        {/* 分类筛选 */}
        <div className="filter-group">
          <label className="filter-label">{content.category}</label>
          <select
            value={value.categoryId || ''}
            onChange={(e) =>
              handleChange('categoryId', e.target.value ? Number(e.target.value) : undefined)
            }
            className="filter-select glass-input"
          >
            <option value="">{content.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 类型筛选 */}
        <div className="filter-group">
          <label className="filter-label">{content.type}</label>
          <div className="filter-options">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => handleChange('type', type.value || undefined)}
                className={`filter-option glass-badge ${
                  (value.type || '') === type.value ? 'active' : ''
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排序方式 */}
        <div className="filter-group">
          <label className="filter-label">{content.sort}</label>
          <div className="filter-options">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChange('sortBy', option.value)}
                className={`filter-option glass-badge ${
                  (value.sortBy || 'RELEVANCE') === option.value ? 'active' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 时间范围 */}
        <div className="filter-group">
          <label className="filter-label">{content.date}</label>
          <div className="filter-options">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChange('dateRange', option.value || undefined)}
                className={`filter-option glass-badge ${
                  (value.dateRange || '') === option.value ? 'active' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
