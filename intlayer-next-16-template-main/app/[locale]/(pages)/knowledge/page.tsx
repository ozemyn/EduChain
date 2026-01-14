'use client';

import { useState, useEffect } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { useRouter } from 'next/navigation';
import { getLocalizedUrl } from 'intlayer';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import { KnowledgeCard, KnowledgeFilter, type FilterValues } from '../../../../components/knowledge';
import { knowledgeService } from '@/services';
import type { KnowledgeItem } from '@/types';
import './page.css';

export default function KnowledgeListPage() {
  const content = useIntlayer('knowledge-list-page');
  const { locale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 8,
    total: 0,
    hasMore: true,
  });
  const [filters, setFilters] = useState<FilterValues>({});

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async (page = 1, newFilters?: FilterValues) => {
    try {
      setLoading(true);
      const currentFilters = newFilters || filters;
      
      // 使用高级搜索接口，支持所有筛选条件的组合
      const response = await knowledgeService.advancedSearch(
        {
          keyword: currentFilters.keyword,
          categoryId: currentFilters.categoryId,
          type: currentFilters.type,
          tags: currentFilters.tags,
        },
        {
          page: page - 1,
          size: pagination.pageSize,
          sort: currentFilters.sortBy || 'TIME',
        }
      );

      if (response.success && response.data) {
        // 分页器模式：直接替换数据
        setKnowledgeList(response.data.content || []);

        setPagination({
          page,
          pageSize: pagination.pageSize,
          total: response.data.totalElements || 0,
          hasMore: !response.data.last,
        });
      }
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    loadKnowledge(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    if (page !== pagination.page && !loading) {
      loadKnowledge(page, filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 生成页码数组
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const pages: (number | string)[] = [];
    const maxVisible = 7; // 最多显示7个页码
    const currentPage = pagination.page;

    if (totalPages === 0) return pages;

    if (totalPages <= maxVisible) {
      // 如果总页数小于等于最大可见数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总是显示第一页
      pages.push(1);

      // 计算当前页附近的页码范围
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // 如果当前页靠近开始，显示更多后面的页码
      if (currentPage <= 3) {
        endPage = Math.min(5, totalPages - 1);
      }

      // 如果当前页靠近结束，显示更多前面的页码
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 4);
      }

      // 添加左侧省略号
      if (startPage > 2) {
        pages.push('...');
      }

      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 添加右侧省略号
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // 总是显示最后一页
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleCreate = () => {
    router.push(getLocalizedUrl('/knowledge/create', locale));
  };

  return (
    <>
      <Navbar />

      <div className="knowledge-list-page">
        <div className="page-container container">
          {/* 页面头部 */}
          <div className="page-header glass-card">
            <div className="header-left">
              <div className="header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="header-content">
                <h1 className="page-title">{content.title}</h1>
                <p className="page-description">{content.description}</p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => setShowFilter(!showFilter)} 
                className={`filter-toggle-btn glass-button ${showFilter ? 'active' : ''}`}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilter ? content.hideFilter : content.showFilter}
              </button>
              <button onClick={handleCreate} className="create-btn glass-button hover-lift">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {content.createButton}
              </button>
            </div>
          </div>

          {/* 筛选器 - 可折叠 */}
          {showFilter && (
            <div className="filter-container">
              <KnowledgeFilter onFilter={handleFilter} loading={loading} />
            </div>
          )}

          {/* 知识列表 */}
          <div className="knowledge-list-content">
            {loading && pagination.page === 1 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>{content.loading}</p>
              </div>
            ) : knowledgeList.length === 0 ? (
              <div className="empty-state glass-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3>{content.empty}</h3>
                <p>{content.emptyDescription}</p>
              </div>
            ) : (
              <>
                <div className="knowledge-grid">
                  {knowledgeList.map((knowledge) => (
                    <KnowledgeCard key={knowledge.id} knowledge={knowledge} />
                  ))}
                </div>

                {/* 加载遮罩 */}
                {loading && pagination.page > 1 && (
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                  </div>
                )}

                {/* 分页器 */}
                {pagination.total > pagination.pageSize && (
                  <div className="pagination-wrapper">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      className="pagination-btn"
                      aria-label="Previous page"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {generatePageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`pagination-btn ${page === pagination.page ? 'active' : ''}`}
                          aria-label={`Page ${page}`}
                          aria-current={page === pagination.page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="pagination-ellipsis">
                          {page}
                        </span>
                      )
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasMore || loading}
                      className="pagination-btn"
                      aria-label="Next page"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
