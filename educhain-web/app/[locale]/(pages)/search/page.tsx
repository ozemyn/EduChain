'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import {
  SearchInput,
  SearchSuggestion,
  SearchFilter,
  SearchResults,
  type SearchFilterValues,
  type SearchSuggestionItem,
} from '../../../../components/search';
import { knowledgeService } from '@/services';
import type { KnowledgeItem } from '@/types';
import './page.css';

// 自定义 useDebounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchPageContent() {
  const content = useIntlayer('search-page');
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('q') || '';

  // 搜索状态
  const [keyword, setKeyword] = useState(initialKeyword);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 搜索结果
  const [results, setResults] = useState<KnowledgeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // 筛选条件
  const [filters, setFilters] = useState<SearchFilterValues>({
    sortBy: 'RELEVANCE',
  });

  // 搜索建议
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hotSearches, setHotSearches] = useState<Array<{ keyword: string; count: number }>>([]);

  // 使用 useDebounce 优化搜索建议
  const debouncedKeyword = useDebounce(keyword, 300);

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 加载热门搜索
  useEffect(() => {
    const loadHotSearches = async () => {
      // 模拟热门搜索数据
      await new Promise((resolve) => setTimeout(resolve, 100));
      setHotSearches([
        { keyword: 'React', count: 12580 },
        { keyword: 'Vue', count: 9876 },
        { keyword: 'JavaScript', count: 8765 },
        { keyword: 'TypeScript', count: 7654 },
        { keyword: 'Node.js', count: 6543 },
        { keyword: 'Python', count: 5432 },
        { keyword: 'Java', count: 4321 },
        { keyword: 'Spring Boot', count: 3210 },
        { keyword: 'MySQL', count: 2109 },
        { keyword: 'Redis', count: 1098 },
      ]);
    };

    loadHotSearches();
  }, []);

  // 搜索建议（使用防抖后的关键词）
  useEffect(() => {
    if (!debouncedKeyword || debouncedKeyword.length < 2) {
      setSuggestions([]);
      return;
    }

    const loadSuggestions = async () => {
      // 模拟搜索建议
      await new Promise((resolve) => setTimeout(resolve, 100));
      const mockSuggestions: SearchSuggestionItem[] = [
        { id: '1', text: `${debouncedKeyword} 教程`, type: 'suggestion' },
        { id: '2', text: `${debouncedKeyword} 实战`, type: 'suggestion' },
        { id: '3', text: `${debouncedKeyword} 面试题`, type: 'suggestion' },
        { id: '4', text: `${debouncedKeyword} 最佳实践`, type: 'suggestion' },
        { id: '5', text: `${debouncedKeyword} 源码分析`, type: 'suggestion' },
      ];
      setSuggestions(mockSuggestions);
    };

    loadSuggestions();
  }, [debouncedKeyword]);

  // 执行搜索
  const performSearch = useCallback(
    async (searchKeyword: string, searchPage = 1, searchFilters = filters) => {
      if (!searchKeyword.trim()) return;

      try {
        setLoading(true);
        setError('');

        const response = await knowledgeService.advancedSearch(
          {
            keyword: searchKeyword,
            categoryId: searchFilters.categoryId,
            type: searchFilters.type,
          },
          {
            page: searchPage - 1,
            size: 12,
            sort: searchFilters.sortBy || 'RELEVANCE',
          }
        );

        if (response.success && response.data) {
          const newResults = response.data.content || [];

          if (searchPage === 1) {
            setResults(newResults);
          } else {
            setResults((prev) => [...prev, ...newResults]);
          }

          setTotal(response.data.totalElements || 0);
          setHasMore(!response.data.last);
          setPage(searchPage);

          // 保存搜索历史
          const history = [
            searchKeyword,
            ...searchHistory.filter((h) => h !== searchKeyword),
          ].slice(0, 10);
          setSearchHistory(history);
          localStorage.setItem('searchHistory', JSON.stringify(history));
        } else {
          setError('搜索失败，请稍后重试');
        }
      } catch (err) {
        console.error('Search failed:', err);
        setError('搜索出错，请检查网络连接后重试');
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchHistory]
  );

  // 初始搜索
  useEffect(() => {
    if (initialKeyword) {
      performSearch(initialKeyword);
    }
  }, []);

  // 处理搜索
  const handleSearch = () => {
    if (keyword.trim()) {
      setShowSuggestion(false);
      performSearch(keyword, 1, filters);
    }
  };

  // 处理建议选择
  const handleSuggestionSelect = useCallback((text: string) => {
    setKeyword(text);
    setShowSuggestion(false);
    performSearch(text, 1, filters);
  }, [performSearch, filters]);

  // 处理筛选变化
  const handleFilterChange = useCallback((newFilters: SearchFilterValues) => {
    setFilters(newFilters);
    if (keyword.trim()) {
      performSearch(keyword, 1, newFilters);
    }
  }, [keyword, performSearch]);

  // 清空搜索历史
  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      performSearch(keyword, page + 1, filters);
    }
  }, [loading, hasMore, keyword, page, filters, performSearch]);

  return (
    <>
      <Navbar />

      <div className="search-page">
        <div className="page-content">
          {/* 页面头部 */}
          <div className="search-page-header glass-card motion-scale-in">
            <div className="header-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h1 className="page-title">{content.title}</h1>
            <p className="page-description">{content.description}</p>
          </div>

          {/* 搜索输入 */}
          <div className="search-input-section motion-slide-in-up motion-delay-200">
            <SearchInput
              value={keyword}
              onChange={setKeyword}
              onSearch={handleSearch}
              onFocus={() => setShowSuggestion(true)}
              onBlur={() => setTimeout(() => setShowSuggestion(false), 300)}
              loading={loading}
            />
            {/* 搜索建议 - 文档流布局，展开时把下面内容往下推 */}
            <SearchSuggestion
              suggestions={suggestions}
              history={searchHistory}
              hotSearches={hotSearches}
              onSelect={handleSuggestionSelect}
              onClearHistory={handleClearHistory}
              visible={showSuggestion}
            />
          </div>

          {/* 筛选器切换按钮（移动端） */}
          <div className="filter-toggle-section motion-slide-in-up motion-delay-300">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`filter-toggle-btn glass-button motion-hover-scale ${showFilter ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              {showFilter ? content.hideFilter : content.showFilter}
            </button>
          </div>

          {/* 主内容区域 */}
          <div className={`search-content ${!showFilter ? 'no-filter' : ''} motion-slide-in-up motion-delay-400`}>
            {/* 筛选器侧边栏 */}
            {showFilter && (
              <div className="filter-sidebar">
                <SearchFilter value={filters} onChange={handleFilterChange} />
              </div>
            )}

            {/* 搜索结果 */}
            <div className="results-section">
              {/* 错误提示 */}
              {error && (
                <div className="error-message glass-card motion-shake" style={{
                  padding: 'var(--spacing-xl)',
                  marginBottom: 'var(--spacing-xl)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-xl)',
                  color: 'rgb(239, 68, 68)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)'
                }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{ fontWeight: 600 }}>{error}</span>
                </div>
              )}
              
              <SearchResults
                results={results}
                total={total}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                keyword={keyword}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgb(254, 252, 253) 0%, rgb(253, 249, 251) 50%, rgb(252, 245, 248) 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(244, 114, 182, 0.2)',
            borderTopColor: 'rgb(244, 114, 182)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: 'rgb(64, 64, 64)', fontSize: '18px' }}>加载中...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
