'use client';

import { useMemo } from 'react';
import { useIntlayer } from 'next-intlayer';
import './SearchSuggestion.css';

export interface SearchSuggestionItem {
  id: string;
  text: string;
  type: 'history' | 'hot' | 'suggestion';
  count?: number;
}

export interface SearchSuggestionProps {
  suggestions: SearchSuggestionItem[];
  history: string[];
  hotSearches: Array<{ keyword: string; count: number }>;
  onSelect: (text: string) => void;
  onClearHistory: () => void;
  visible: boolean;
}

export const SearchSuggestion: React.FC<SearchSuggestionProps> = ({
  suggestions,
  history,
  hotSearches,
  onSelect,
  onClearHistory,
  visible,
}) => {
  const content = useIntlayer('search-suggestion');

  // 使用 useMemo 优化计算
  const hasHistory = useMemo(() => history.length > 0, [history.length]);
  const hasHotSearches = useMemo(() => hotSearches.length > 0, [hotSearches.length]);
  const hasSuggestions = useMemo(() => suggestions.length > 0, [suggestions.length]);

  if (!visible) return null;

  return (
    <div 
      className="search-suggestion-container glass-card"
      role="listbox"
      aria-label="搜索建议列表"
    >
      {/* 搜索建议 */}
      {hasSuggestions && (
        <div className="suggestion-section">
          <div className="section-header">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h4>{content.suggestions}</h4>
          </div>
          <div className="suggestion-list">
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.text)}
                className="suggestion-item glass-button"
                role="option"
                aria-selected="false"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="suggestion-text">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索历史 */}
      {hasHistory && (
        <div className="suggestion-section">
          <div className="section-header">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h4>{content.history}</h4>
            <button onClick={onClearHistory} className="clear-history-btn">
              {content.clearHistory}
            </button>
          </div>
          <div className="history-list">
            {history.slice(0, 8).map((item, index) => (
              <button
                key={index}
                onClick={() => onSelect(item)}
                className="history-item glass-badge"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 热门搜索 */}
      {hasHotSearches && (
        <div className="suggestion-section">
          <div className="section-header">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
            <h4>{content.hotSearches}</h4>
          </div>
          <div className="hot-list">
            {hotSearches.slice(0, 10).map((item, index) => (
              <button
                key={index}
                onClick={() => onSelect(item.keyword)}
                className="hot-item glass-button"
              >
                <span className={`hot-rank rank-${index + 1}`}>{index + 1}</span>
                <span className="hot-text">{item.keyword}</span>
                <span className="hot-count">{item.count.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!hasSuggestions && !hasHistory && !hasHotSearches && (
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p>{content.empty}</p>
        </div>
      )}
    </div>
  );
};
