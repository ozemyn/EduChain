import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Spin, Alert, BackTop } from 'antd';
import { useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/search/SearchInput';
import SearchResults from '@/components/search/SearchResults';
import SearchFilters, {
  type SearchFiltersValue,
} from '@/components/search/SearchFilters';
import { searchService } from '@/services/search';
import type { KnowledgeItem } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './Search.module.css';

const { Title } = Typography;

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
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>
            {keyword ? `"${keyword}" 的搜索结果` : '搜索知识内容'}
          </Title>
          <div className={styles.searchInputWrapper}>
            <SearchInput
              onSearch={handleSearch}
              showAdvanced={false}
              size="large"
            />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <SearchFilters
              value={filters}
              onChange={handleFiltersChange}
              onReset={handleFiltersReset}
              collapsed={false}
            />
          </Col>

          <Col xs={24} lg={18}>
            {error && (
              <Alert
                message="搜索出错"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: 16 }}
              />
            )}

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
          </Col>
        </Row>
      </div>

      <BackTop />
    </div>
  );
};

export default Search;
