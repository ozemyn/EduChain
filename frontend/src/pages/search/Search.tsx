/* ===================================
   搜索页面组件 - Search Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 知网风格的搜索界面
   - 左侧筛选 + 右侧结果
   - 高性能优化
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { Spin, Alert, BackTop, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import SearchInput from '@/components/search/SearchInput';
import SearchResults from '@/components/search/SearchResults';
import SearchFilters, {
  type SearchFiltersValue,
} from '@/components/search/SearchFilters';
import { searchService } from '@/services/search';
import type { KnowledgeItem } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';
import './Search.css';

const { Option } = Select;

/**
 * 搜索页面组件
 * 知网风格的搜索界面
 */
const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 状态管理
  const [results, setResults] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const keyword = searchParams.get('q') || '';
  const [filters, setFilters] = useState<SearchFiltersValue>({
    sortBy: 'RELEVANCE',
  });

  const debouncedKeyword = useDebounce(keyword, 300);

  // 从URL参数初始化筛选条件
  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const sortBy = searchParams.get('sortBy');
    const tags = searchParams.get('tags');

    setFilters({
      categoryId: categoryId ? Number(categoryId) : undefined,
      type: type || undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortBy: (sortBy as any) || 'RELEVANCE',
      tags: tags ? tags.split(',') : undefined,
    });
  }, [searchParams]);

  // 执行搜索
  const performSearch = async (page = 1, append = false) => {
    if (!debouncedKeyword.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchService.search({
        keyword: debouncedKeyword,
        ...filters,
        page: page - 1,
        size: 20,
      });

      const newResults = response.data.content;

      if (append) {
        setResults(prev => [...prev, ...newResults]);
      } else {
        setResults(newResults);
      }

      setTotal(response.data.totalElements);
      setHasMore(!response.data.last);
      setCurrentPage(page);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '搜索失败，请稍后重试');
      if (!append) {
        setResults([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // 关键词变化时搜索
  useEffect(() => {
    if (debouncedKeyword) {
      performSearch(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, filters]);

  // 处理搜索
  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('q', value);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  // 处理筛选条件变化
  const handleFiltersChange = (newFilters: SearchFiltersValue) => {
    setFilters(newFilters);

    const newParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== '' &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        if (Array.isArray(value)) {
          newParams.set(key, value.join(','));
        } else {
          newParams.set(key, String(value));
        }
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  // 重置筛选条件
  const handleFiltersReset = () => {
    const newParams = new URLSearchParams();
    if (keyword) {
      newParams.set('q', keyword);
    }
    setSearchParams(newParams);
  };

  // 加载更多
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      performSearch(currentPage + 1, true);
    }
  };

  return (
    <div className="search-page animate-fade-in">
      {/* 顶部搜索区域 */}
      <header className="search-header glass-light animate-fade-in-down">
        <div className="search-header-content container">
          <div className="search-box-wrapper">
            <SearchInput
              onSearch={handleSearch}
              showAdvanced={true}
              size="large"
              className="main-search-input"
            />
          </div>

          {keyword && (
            <div className="search-info animate-fade-in delay-100">
              <span className="search-keyword gradient-text">"{keyword}"</span>
              <span className="search-count">
                共找到 <strong>{total.toLocaleString()}</strong> 条结果
              </span>
            </div>
          )}
        </div>
      </header>

      {/* 主体内容区域 */}
      <main className="search-main">
        <div className="search-content container">
          <div className="search-layout">
            {/* 左侧筛选栏 */}
            <aside className="search-sidebar animate-fade-in-left delay-200">
              <div className="filters-panel glass-card">
                <div className="filters-header">
                  <SearchOutlined />
                  <h3>筛选条件</h3>
                </div>
                <SearchFilters
                  value={filters}
                  onChange={handleFiltersChange}
                  onReset={handleFiltersReset}
                  collapsed={false}
                />
              </div>
            </aside>

            {/* 右侧结果区域 */}
            <section className="search-results-area animate-fade-in-right delay-300">
              {/* 结果工具栏 */}
              <div className="results-toolbar glass-light">
                <div className="toolbar-left">
                  {keyword && (
                    <span className="results-summary">
                      搜索 "<span className="keyword-highlight">{keyword}</span>
                      " ，共 <strong>{total.toLocaleString()}</strong> 条结果
                    </span>
                  )}
                </div>
                <div className="toolbar-right">
                  <span className="sort-label">排序：</span>
                  <Select
                    value={filters.sortBy || 'RELEVANCE'}
                    onChange={value =>
                      handleFiltersChange({ ...filters, sortBy: value })
                    }
                    size="middle"
                    className="sort-select"
                  >
                    <Option value="RELEVANCE">相关性</Option>
                    <Option value="TIME">时间</Option>
                    <Option value="POPULARITY">热度</Option>
                  </Select>
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <Alert
                  message="搜索出错"
                  description={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError(null)}
                  className="error-alert animate-fade-in"
                />
              )}

              {/* 搜索结果列表 */}
              <div className="results-container">
                <Spin spinning={loading && results.length === 0}>
                  <SearchResults
                    results={results}
                    loading={loading}
                    keyword={keyword}
                    total={total}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                  />
                </Spin>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 返回顶部按钮 */}
      <BackTop className="back-top-button glass-button glass-strong hover-lift" />
    </div>
  );
};

export default Search;
