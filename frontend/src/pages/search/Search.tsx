import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Alert, BackTop, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/search/SearchInput';
import SearchResults from '@/components/search/SearchResults';
import SearchFilters, {
  type SearchFiltersValue,
} from '@/components/search/SearchFilters';
import { searchService } from '@/services/search';
import type { KnowledgeItem } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate(); // 暂时不需要

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
        page: page - 1, // 后端从0开始
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

    // 更新URL参数
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
    <div className="cnki-search-container animate-fade-in">
      {/* 顶部搜索区域 - 类似知网的简洁头部 */}
      <div className="cnki-search-header">
        <div className="cnki-header-content">
          <div className="cnki-search-box">
            <SearchInput
              onSearch={handleSearch}
              showAdvanced={true}
              size="large"
              className="cnki-main-search"
            />
          </div>

          {keyword && (
            <div className="cnki-search-info">
              <span className="search-keyword">"{keyword}"</span>
              <span className="search-count">
                共找到 {total.toLocaleString()} 条结果
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="cnki-main-content">
        <div className="cnki-content-wrapper">
          <Row gutter={[0, 0]} className="cnki-layout">
            {/* 左侧筛选栏 - 类似知网的筛选面板 */}
            <Col xs={24} lg={5} className="cnki-sidebar">
              <div className="cnki-filters-panel">
                <SearchFilters
                  value={filters}
                  onChange={handleFiltersChange}
                  onReset={handleFiltersReset}
                  collapsed={false}
                />
              </div>
            </Col>

            {/* 右侧结果区域 */}
            <Col xs={24} lg={19} className="cnki-results-area">
              {/* 结果工具栏 */}
              <div className="cnki-results-toolbar">
                <div className="cnki-toolbar-left">
                  {keyword && (
                    <span className="results-summary">
                      搜索"{keyword}"，共 {total.toLocaleString()} 条结果
                    </span>
                  )}
                </div>
                <div className="cnki-toolbar-right">
                  <span className="sort-label">排序：</span>
                  <Select
                    value={filters.sortBy || 'RELEVANCE'}
                    onChange={value =>
                      handleFiltersChange({ ...filters, sortBy: value })
                    }
                    size="small"
                    className="cnki-sort-select"
                  >
                    <Select.Option value="RELEVANCE">相关性</Select.Option>
                    <Select.Option value="TIME">时间</Select.Option>
                    <Select.Option value="POPULARITY">热度</Select.Option>
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
                  className="cnki-error-alert"
                />
              )}

              {/* 搜索结果列表 */}
              <div className="cnki-results-container">
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
            </Col>
          </Row>
        </div>
      </div>

      <BackTop className="cnki-back-top" />
    </div>
  );
};

export default Search;

// 知网风格搜索页面样式
const cnkiSearchStyles = `
/* ===== 知网风格搜索页面样式 ===== */
.cnki-search-container {
  min-height: 100vh;
  background: var(--bg-secondary);
  font-family: var(--font-system);
}

/* 顶部搜索区域 */
.cnki-search-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-lg) 0;
  box-shadow: 0 1px 3px var(--glass-shadow);
}

.cnki-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.cnki-search-box {
  max-width: 800px;
  margin: 0 auto var(--spacing-md);
}

.cnki-main-search {
  width: 100%;
}

.cnki-search-info {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.search-keyword {
  color: var(--accent-primary);
  font-weight: 500;
  margin-right: var(--spacing-md);
}

.search-count {
  color: var(--text-tertiary);
}

/* 主体内容区域 */
.cnki-main-content {
  background: var(--bg-secondary);
  min-height: calc(100vh - 120px);
}

.cnki-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.cnki-layout {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px var(--glass-shadow);
  overflow: hidden;
}

/* 左侧筛选面板 */
.cnki-sidebar {
  border-right: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.cnki-filters-panel {
  padding: var(--spacing-lg);
  height: 100%;
}

/* 右侧结果区域 */
.cnki-results-area {
  background: var(--bg-primary);
}

/* 结果工具栏 */
.cnki-results-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.cnki-toolbar-left {
  flex: 1;
}

.results-summary {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.cnki-toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.sort-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.cnki-sort-select {
  min-width: 100px;
}

/* 错误提示 */
.cnki-error-alert {
  margin: var(--spacing-lg);
  border-radius: var(--radius-md);
}

/* 结果容器 */
.cnki-results-container {
  padding: var(--spacing-lg);
  min-height: 500px;
}

/* 返回顶部按钮 */
.cnki-back-top {
  background: var(--accent-primary) !important;
  border-radius: var(--radius-md) !important;
  box-shadow: 0 2px 8px var(--glass-shadow) !important;
  will-change: transform, box-shadow;
}

.cnki-back-top:hover {
  background: var(--primary-600) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--glass-shadow) !important;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .cnki-content-wrapper {
    padding: var(--spacing-md);
  }
  
  .cnki-layout {
    border-radius: 0;
  }
  
  .cnki-sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
}

@media (max-width: 768px) {
  .cnki-search-header {
    padding: var(--spacing-md) 0;
  }
  
  .cnki-header-content {
    padding: 0 var(--spacing-md);
  }
  
  .cnki-content-wrapper {
    padding: var(--spacing-sm);
  }
  
  .cnki-results-toolbar {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }
  
  .cnki-toolbar-right {
    width: 100%;
    justify-content: flex-end;
  }
  
  .cnki-filters-panel,
  .cnki-results-container {
    padding: var(--spacing-md);
  }
}

@media (max-width: 640px) {
  .cnki-search-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .search-keyword {
    margin-right: 0;
  }
}

/* 知网风格的简洁设计 - 性能优化：只对需要过渡的元素应用 */
.cnki-search-container .ant-card,
.cnki-search-container .ant-btn,
.cnki-search-container .ant-select-selector,
.cnki-result-item {
  transition: background-color var(--transition-fast) ease,
              border-color var(--transition-fast) ease,
              color var(--transition-fast) ease,
              transform var(--transition-fast) ease;
  will-change: background-color, border-color, color, transform;
}

.cnki-search-container .ant-card {
  border-radius: var(--radius-md);
  box-shadow: none;
  border: 1px solid var(--border-color);
}

.cnki-search-container .ant-card-head {
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.cnki-search-container .ant-select-selector {
  border-radius: var(--radius-sm) !important;
}

.cnki-search-container .ant-btn {
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.cnki-search-container .ant-btn-primary {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.cnki-search-container .ant-btn-primary:hover {
  background: var(--primary-600);
  border-color: var(--primary-600);
}

/* 性能优化 */
@media (prefers-reduced-motion: reduce) {
  .cnki-search-container * {
    transition: none !important;
    animation: none !important;
  }
}
`;

// 动态注入知网风格样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = cnkiSearchStyles;
  document.head.appendChild(styleElement);
}
