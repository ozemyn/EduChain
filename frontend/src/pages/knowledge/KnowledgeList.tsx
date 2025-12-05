/* ===================================
   知识列表页面组件 - Knowledge List Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 筛选和搜索功能
   - 分页展示
   - 高性能优化
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { Pagination, Spin, Empty, Button, message, Modal } from 'antd';
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  RocketOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KnowledgeCard, KnowledgeFilter } from '@/components/knowledge';
import type { KnowledgeItem } from '@/types';
import type { FilterValues } from '@/components/knowledge/KnowledgeFilter';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import './KnowledgeList.css';

const { confirm } = Modal;

/**
 * 知识列表页面组件
 */
const KnowledgeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterValues>({});
  const [showFilter, setShowFilter] = useState(false);

  // 从 URL 参数初始化筛选条件
  useEffect(() => {
    const initialFilters: FilterValues = {};
    const keyword = searchParams.get('keyword');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const sortBy = searchParams.get('sortBy');
    const page = searchParams.get('page');

    if (keyword) initialFilters.keyword = keyword;
    if (categoryId) initialFilters.categoryId = Number(categoryId);
    if (type) initialFilters.type = type;
    if (sortBy) initialFilters.sortBy = sortBy;

    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, current: page ? Number(page) : 1 }));
  }, [searchParams]);

  // 加载知识列表
  const loadKnowledgeList = async (
    page = 1,
    pageSize = 12,
    filterParams = filters
  ) => {
    try {
      setLoading(true);
      const params = { page: page - 1, size: pageSize, ...filterParams };
      const response = await knowledgeService.getKnowledgeList(params);

      if (response.success && response.data) {
        setKnowledgeList(response.data.content);
        setPagination({
          current: page,
          pageSize,
          total: response.data.totalElements,
        });
      }
    } catch (error) {
      console.error('Failed to load knowledge list:', error);
      message.error('加载知识列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理筛选
  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.keyword) params.set('keyword', newFilters.keyword);
    if (newFilters.categoryId)
      params.set('categoryId', String(newFilters.categoryId));
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    setSearchParams(params);
    loadKnowledgeList(1, pagination.pageSize, newFilters);
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    loadKnowledgeList(page, newPageSize);
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理编辑
  const handleEdit = (knowledge: KnowledgeItem) => {
    navigate(`/knowledge/edit/${knowledge.id}`);
  };

  // 处理删除
  const handleDelete = (knowledge: KnowledgeItem) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除知识内容"${knowledge.title}"吗？此操作不可恢复。`,
      okText: '确定删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await knowledgeService.deleteKnowledge(knowledge.id);
          message.success('删除成功');
          loadKnowledgeList(pagination.current, pagination.pageSize);
        } catch (error) {
          console.error('Delete failed:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 初始加载
  useEffect(() => {
    loadKnowledgeList(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="knowledge-list-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="knowledge-background">
        <div className="knowledge-blob knowledge-blob-1" />
        <div className="knowledge-blob knowledge-blob-2" />
        <div className="knowledge-blob knowledge-blob-3" />
      </div>

      <div className="knowledge-content container">
        {/* ===================================
            页面头部 - Page Header
            ================================== */}
        <header className="knowledge-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <BookOutlined />
                知识库
              </h1>
              <p className="page-subtitle">探索无限知识，分享智慧结晶</p>
            </div>

            <div className="header-actions">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(!showFilter)}
                className="glass-button hover-scale active-scale"
                size="large"
              >
                {showFilter ? '隐藏筛选' : '显示筛选'}
              </Button>

              {user && (
                <Link to="/knowledge/create">
                  <Button
                    type="primary"
                    icon={<RocketOutlined />}
                    size="large"
                    className="glass-button glass-strong hover-lift active-scale"
                  >
                    发布内容
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* ===================================
            筛选器 - Filter Section
            ================================== */}
        {showFilter && (
          <section className="knowledge-filter-section glass-card animate-fade-in-up delay-100">
            <KnowledgeFilter onFilter={handleFilter} loading={loading} />
          </section>
        )}

        {/* ===================================
            知识列表 - Knowledge Grid
            ================================== */}
        <main className="knowledge-main animate-fade-in-up delay-200">
          <Spin spinning={loading} size="large">
            {knowledgeList.length > 0 ? (
              <>
                <div className="knowledge-grid">
                  {knowledgeList.map((knowledge, index) => (
                    <div
                      key={knowledge.id}
                      className="knowledge-card-wrapper animate-fade-in-up"
                      style={{ animationDelay: `${(index % 12) * 50}ms` }}
                    >
                      <KnowledgeCard
                        knowledge={knowledge}
                        showActions={user?.id === knowledge.uploaderId}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                </div>

                {/* 分页 */}
                <div className="knowledge-pagination glass-light">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    pageSizeOptions={['12', '24', '36', '48']}
                  />
                </div>
              </>
            ) : (
              <div className="knowledge-empty glass-card">
                <Empty
                  description="暂无知识内容"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  {user && (
                    <Link to="/knowledge/create">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        className="glass-button glass-strong hover-lift active-scale"
                      >
                        发布第一个内容
                      </Button>
                    </Link>
                  )}
                </Empty>
              </div>
            )}
          </Spin>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeList;
