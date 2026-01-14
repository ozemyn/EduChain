'use client';

import { useState, useEffect, useRef } from 'react';
import { useIntlayer } from 'next-intlayer';
import './SearchInput.css';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  loading?: boolean;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  onFocus,
  onBlur,
  loading = false,
  placeholder,
}) => {
  const content = useIntlayer('search-input');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 安全获取 placeholder
  const getPlaceholder = (): string => {
    if (placeholder) return placeholder;
    const contentPlaceholder = content.placeholder;
    if (typeof contentPlaceholder === 'string') return contentPlaceholder;
    if (contentPlaceholder && typeof contentPlaceholder === 'object' && 'value' in contentPlaceholder) {
      return String(contentPlaceholder.value || '');
    }
    return '';
  };

  // 快捷键支持 (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`search-input-container ${isFocused ? 'focused' : ''}`}>
      <div className="search-input-wrapper glass-card">
        {/* 搜索图标 */}
        <div className="search-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={getPlaceholder()}
          className="search-input"
          disabled={loading}
        />

        {/* 快捷键提示 */}
        {!isFocused && !value && (
          <div className="search-shortcut">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </div>
        )}

        {/* 清除按钮 */}
        {value && (
          <button
            onClick={handleClear}
            className="clear-btn"
            aria-label={typeof content.clear === 'string' ? content.clear : String(content.clear.value || '清除')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* 搜索按钮 */}
        <button
          onClick={onSearch}
          className="search-btn glass-button"
          disabled={loading || !value}
        >
          {content.search}
        </button>
      </div>

      {/* 焦点光晕效果 */}
      {isFocused && <div className="search-glow"></div>}
    </div>
  );
};
