'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { categoryService } from '@/services';
import type { Category } from '@/types';
import './Selector.css';

// 选择器模式
type SelectorMode = 'single' | 'multiple' | 'tags';

// 选项类型
interface Option {
  label: string;
  value: string | number;
  count?: number;
}

interface SelectorProps {
  // 模式：单选、多选、标签输入
  mode?: SelectorMode;
  
  // 值
  value?: string | number | string[] | number[];
  onChange?: (value: string | number | string[] | number[] | undefined) => void;
  
  // 选项（用于 single/multiple 模式）
  options?: Option[];
  
  // 自动加载分类（用于分类选择器）
  loadCategories?: boolean;
  
  // 标签相关（用于 tags 模式）
  maxTags?: number;
  popularTags?: string[];
  showPopular?: boolean;
  
  // 通用属性
  placeholder?: string;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
}

export const Selector: React.FC<SelectorProps> = ({
  mode = 'single',
  value,
  onChange,
  options: propOptions,
  loadCategories = false,
  maxTags = 10,
  popularTags = [],
  showPopular = false,
  placeholder,
  showCount = false,
  size = 'medium',
  className = '',
  disabled = false,
}) => {
  const content = useIntlayer('selector');
  const [options, setOptions] = useState<Option[]>(propOptions || []);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 标签模式的值处理
  const tags = mode === 'tags' && Array.isArray(value) ? value.map(String) : [];

  // 加载分类数据
  useEffect(() => {
    if (loadCategories) {
      loadCategoriesData();
    }
  }, [loadCategories]);

  // 更新选项
  useEffect(() => {
    if (propOptions) {
      setOptions(propOptions);
    }
  }, [propOptions]);

  const loadCategoriesData = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategoryTree();
      if (response.success && response.data) {
        const categoryOptions = response.data.map((cat: Category) => ({
          label: cat.name,
          value: cat.id,
          count: cat.knowledgeCount,
        }));
        setOptions(categoryOptions);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // 单选/多选模式的处理
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (mode === 'single') {
      const newValue = e.target.value ? (
        typeof options[0]?.value === 'number' ? Number(e.target.value) : e.target.value
      ) : undefined;
      onChange?.(newValue);
    }
  };

  // 标签模式的处理
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const addTag = (tag: string) => {
    if (tags.length >= maxTags) return;
    if (tags.includes(tag)) return;

    const newTags = [...tags, tag];
    onChange?.(newTags);
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    onChange?.(newTags);
  };

  // 渲染单选模式
  if (mode === 'single') {
    return (
      <div className={`selector selector-single ${className}`}>
        <select
          value={value as string | number || ''}
          onChange={handleSelectChange}
          className={`selector-select glass-input size-${size}`}
          disabled={loading || disabled}
        >
          <option value="">
            {loading ? String(content.loading.value || content.loading) : String(placeholder || content.placeholder.value || content.placeholder)}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {showCount && option.count !== undefined ? ` (${option.count})` : ''}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // 渲染标签模式
  if (mode === 'tags') {
    return (
      <div className={`selector selector-tags size-${size} ${className}`}>
        <div className="tag-input-wrapper glass-input">
          {tags.map((tag) => (
            <span key={tag} className="selected-tag glass-badge">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="remove-tag-btn"
                type="button"
                disabled={disabled}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={tags.length === 0 ? String(placeholder || content.tagsPlaceholder.value || content.tagsPlaceholder) : ''}
            className="tag-input"
            disabled={tags.length >= maxTags || disabled}
          />
        </div>

        {showPopular && tags.length < maxTags && popularTags.length > 0 && (
          <div className="popular-tags">
            <span className="popular-tags-label">{content.popularLabel}:</span>
            <div className="popular-tags-list">
              {popularTags
                .filter((tag) => !tags.includes(tag))
                .slice(0, 6)
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="popular-tag-btn glass-badge"
                    type="button"
                    disabled={disabled}
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
        )}

        {tags.length >= maxTags && (
          <p className="tag-limit-message">
            {content.limitMessage.replace('{max}', String(maxTags))}
          </p>
        )}
      </div>
    );
  }

  return null;
};

// 便捷导出：分类选择器
export const CategorySelector: React.FC<Omit<SelectorProps, 'mode' | 'loadCategories'>> = (props) => (
  <Selector mode="single" loadCategories {...props} />
);

// 便捷导出：标签选择器
export const TagSelector: React.FC<Omit<SelectorProps, 'mode'>> = (props) => (
  <Selector mode="tags" {...props} />
);
