'use client';

import { useState } from 'react';
import { useIntlayer } from 'next-intlayer';
import { KnowledgeCard } from '../../knowledge';
import type { KnowledgeItem } from '@/types';
import './SearchResults.css';

export interface SearchResultsProps {
  results: KnowledgeItem[];
  total: number;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  keyword?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  total,
  loading = false,
  hasMore = false,
  onLoadMore,
  keyword = '',
}) => {
  const content = useIntlayer('search-results');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 安全获取 aria-label
  const getAriaLabel = (key: 'grid' | 'list'): string => {
    const viewModeContent = content.viewMode[key];
    if (typeof viewModeContent === 'string') return viewModeContent;
    if (viewModeContent && typeof viewModeContent === 'object' && 'value' in viewModeContent) {
      return String(viewModeContent.value || '');
    }
    return key === 'grid' ? '网格视图' : '列表视图';
  };

  if (loading && results.length === 0) {
    return (
      <div className="search-results-container glass-card">
        <div className="loading-state" role="status" aria-live="polite">
          <div className="loading-spinner"></div>
          <p>{content.loading}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results-container glass-card">
        <div className="empty-state" role="status" aria-live="polite">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3>{content.empty}</h3>
          <p>{content.emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      {/* 结果头部 */}
      <div className="results-header glass-card">
        <div className="results-info">
          <h2>{content.results}</h2>
          <span className="results-count glass-badge">
            {content.found} {total.toLocaleString()} {content.items}
          </span>
        </div>
        <div className="view-mode-toggle">
          <button
            onClick={() => setViewMode('grid')}
            className={`view-mode-btn glass-button ${viewMode === 'grid' ? 'active' : ''}`}
            aria-label={getAriaLabel('grid')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`view-mode-btn glass-button ${viewMode === 'list' ? 'active' : ''}`}
            aria-label={getAriaLabel('list')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 结果列表 */}
      <div 
        className={viewMode === 'grid' ? 'results-grid' : 'results-list'}
        role="region"
        aria-label="搜索结果列表"
        aria-live="polite"
        aria-atomic="false"
      >
        {results.map((knowledge) => (
          <KnowledgeCard key={knowledge.id} knowledge={knowledge} />
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="load-more-btn glass-button"
          >
            {loading ? content.loading : content.loadMore}
          </button>
        </div>
      )}
    </div>
  );
};
