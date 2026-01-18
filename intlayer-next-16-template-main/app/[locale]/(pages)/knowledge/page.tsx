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
        {/* 背景装饰 */}
        <div className="knowledge-background">
          <div className="knowledge-blob knowledge-blob-1" />
          <div className="knowledge-blob knowledge-blob-2" />
          <div className="knowledge-blob knowledge-blob-3" />
        </div>

        {/* 英雄区域 */}
        <section className="knowledge-hero-section">
          <div className="hero-container container">
            {/* 徽章 */}
            <div className="hero-badge glass-badge motion-scale-in">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span>{content.hero.badge.value}</span>
            </div>

            {/* 标题 */}
            <h1 className="hero-title motion-slide-in-up motion-delay-100">
              <span className="hero-title-main text-gradient-blue">
                {content.hero.title.value}
              </span>
              <span className="hero-title-sub">
                {content.hero.subtitle.value}
              </span>
            </h1>

            {/* 描述 */}
            <p className="hero-description motion-slide-in-up motion-delay-150">
              {content.hero.description.value}
            </p>

            {/* 搜索框 */}
            <div className="hero-search-wrapper motion-slide-in-up motion-delay-200">
              <div className="hero-search-container glass-medium">
                <div className="hero-search-prefix">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={content.hero.searchPlaceholder.value}
                  className="hero-search-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) {
                        router.push(getLocalizedUrl(`/search?q=${encodeURIComponent(value)}`, locale));
                      }
                    }
                  }}
                />
                <button 
                  className="hero-search-button motion-hover-lift"
                  onClick={() => {
                    const input = document.querySelector('.hero-search-input') as HTMLInputElement;
                    if (input?.value.trim()) {
                      router.push(getLocalizedUrl(`/search?q=${encodeURIComponent(input.value)}`, locale));
                    }
                  }}
                >
                  <span>{content.hero.searchButton.value}</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 行动按钮 */}
            <div className="hero-actions motion-slide-in-up motion-delay-250">
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="hero-action-btn hero-action-primary motion-hover-lift"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {content.hero.exploreButton.value}
              </button>
              <button onClick={handleCreate} className="hero-action-btn hero-action-secondary motion-hover-scale">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {content.hero.createButton.value}
              </button>
            </div>

            {/* 统计数据 */}
            <div className="hero-stats motion-slide-in-up motion-delay-600">
              <div className="stat-item glass-light motion-hover-lift">
                <div className="stat-value">{pagination.total.toLocaleString()}</div>
                <div className="stat-label">{content.stats.total.value}</div>
              </div>
              <div className="stat-item glass-light motion-hover-lift motion-delay-100">
                <div className="stat-value">2,345</div>
                <div className="stat-label">{content.stats.contributors.value}</div>
              </div>
              <div className="stat-item glass-light motion-hover-lift motion-delay-200">
                <div className="stat-value">48</div>
                <div className="stat-label">{content.stats.categories.value}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 内容区域 */}
        <div className="page-container container">
          {/* 列表头部 */}
          <div className="list-header motion-slide-in-up motion-delay-300">
            <h2 className="list-title">{content.listSection.title.value}</h2>
            <div className="list-actions">
              <button 
                onClick={() => setShowFilter(!showFilter)} 
                className={`filter-toggle-btn glass-button ${showFilter ? 'active' : ''}`}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilter ? content.listSection.hideFilter.value : content.listSection.showFilter.value}
              </button>
            </div>
          </div>

          {/* 筛选器 - 可折叠 */}
          {showFilter && (
            <div className="filter-container motion-slide-in-up motion-delay-350">
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
                  {knowledgeList.map((knowledge, index) => (
                    <div 
                      key={knowledge.id} 
                      className="motion-slide-in-up"
                      style={{ animationDelay: `${400 + index * 50}ms` }}
                    >
                      <KnowledgeCard knowledge={knowledge} />
                    </div>
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
