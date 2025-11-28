import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Pagination,
  Spin,
  Empty,
  Button,
  message,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KnowledgeCard, KnowledgeFilter } from '@/components/knowledge';
import type { KnowledgeItem } from '@/types';
import type { FilterValues } from '@/components/knowledge/KnowledgeFilter';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { confirm } = Modal;

const KnowledgeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterValues>({});

  // 从URL参数初始化筛选条件
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
    setPagination(prev => ({
      ...prev,
      current: page ? Number(page) : 1,
    }));
  }, [searchParams]);

  // 加载知识列表
  const loadKnowledgeList = async (
    page = 1,
    pageSize = 12,
    filterParams = filters
  ) => {
    try {
      setLoading(true);

      const params = {
        page: page - 1, // 后端从0开始
        size: pageSize,
        ...filterParams,
      };

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

    // 更新URL参数
    const params = new URLSearchParams();
    if (newFilters.keyword) params.set('keyword', newFilters.keyword);
    if (newFilters.categoryId)
      params.set('categoryId', String(newFilters.categoryId));
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);

    setSearchParams(params);
    loadKnowledgeList(1, pagination.pageSize, newFilters);
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    loadKnowledgeList(page, newPageSize);

    // 更新URL中的页码
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
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
      content: `确定要删除知识内容"${knowledge.title}"吗？`,
      okText: '确定',
      cancelText: '取消',
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

  useEffect(() => {
    loadKnowledgeList(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="knowledge-list-container animate-fade-in">
      {/* 背景装饰 */}
      <div className="knowledge-background">
        <div className="knowledge-blob knowledge-blob-1" />
        <div className="knowledge-blob knowledge-blob-2" />
        <div className="knowledge-blob knowledge-blob-3" />
      </div>

      {/* 页面头部 */}
      <section className="knowledge-header glass-light animate-fade-in-up">
        <div className="knowledge-header-content">
          <div className="knowledge-title-section">
            <h1 className="knowledge-title gradient-text">
              <BookOutlined />
              知识库
            </h1>
            <p className="knowledge-subtitle">探索无限知识，分享智慧结晶</p>
          </div>

          {user && (
            <div className="knowledge-actions">
              <Link to="/knowledge/create">
                <Button
                  type="primary"
                  icon={<RocketOutlined />}
                  size="large"
                  className="glass-button glass-strong hover-lift active-scale primary-button"
                >
                  发布内容
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 筛选器 */}
      <div className="knowledge-filter-wrapper animate-fade-in-up delay-100">
        <KnowledgeFilter onFilter={handleFilter} loading={loading} />
      </div>

      {/* 内容区域 */}
      <div className="knowledge-content animate-fade-in-up delay-200">
        <Spin spinning={loading}>
          {knowledgeList.length > 0 ? (
            <>
              <Row gutter={[24, 24]} className="knowledge-grid">
                {knowledgeList.map((knowledge, index) => (
                  <Col key={knowledge.id} xs={24} sm={12} md={8} lg={6}>
                    <div
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
                  </Col>
                ))}
              </Row>

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
      </div>

      <style>{`
        /* ===== 知识库列表页面样式 ===== */
        .knowledge-list-container {
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding: var(--spacing-lg);
        }

        /* 背景装饰 */
        .knowledge-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
        }

        .knowledge-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: var(--blur-xl);
          animation: float 8s ease-in-out infinite;
        }

        .knowledge-blob-1 {
          top: 5%;
          right: 10%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, var(--primary-200) 0%, transparent 70%);
          animation-delay: 0s;
        }

        .knowledge-blob-2 {
          top: 40%;
          left: 5%;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, var(--accent-success) 0%, transparent 70%);
          animation-delay: 3s;
        }

        .knowledge-blob-3 {
          bottom: 20%;
          right: 30%;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, var(--accent-warning) 0%, transparent 70%);
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }

        /* 页面头部 */
        .knowledge-header {
          margin-bottom: var(--spacing-2xl);
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-xl);
        }

        .knowledge-header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }

        .knowledge-title-section {
          flex: 1;
        }

        .knowledge-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 var(--spacing-sm);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .knowledge-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .knowledge-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .primary-button {
          background: linear-gradient(135deg, var(--accent-primary), var(--primary-600)) !important;
          border: none !important;
          color: white !important;
          font-weight: 600 !important;
        }

        /* 筛选器包装 */
        .knowledge-filter-wrapper {
          max-width: 1200px;
          margin: 0 auto var(--spacing-2xl);
        }

        /* 内容区域 */
        .knowledge-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .knowledge-grid {
          margin-bottom: var(--spacing-2xl);
        }

        .knowledge-card-wrapper {
          height: 100%;
        }

        .knowledge-card-wrapper .ant-card {
          height: 100%;
          border: none;
          background: var(--glass-bg-medium);
          backdrop-filter: var(--blur-md);
          -webkit-backdrop-filter: var(--blur-md);
          border-radius: var(--liquid-border-radius);
          box-shadow: var(--glass-shadow-md);
          transition: all var(--transition-base) var(--ease-spring-ios);
          border: 1px solid var(--glass-border);
        }

        .knowledge-card-wrapper .ant-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--glass-shadow-lg);
          background: var(--glass-bg-strong);
        }

        /* 分页器 */
        .knowledge-pagination {
          text-align: center;
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius);
          margin-top: var(--spacing-xl);
        }

        /* 空状态 */
        .knowledge-empty {
          text-align: center;
          padding: var(--spacing-3xl);
          border-radius: var(--liquid-border-radius-lg);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .knowledge-list-container {
            padding: var(--spacing-md);
          }

          .knowledge-header {
            padding: var(--spacing-xl);
          }

          .knowledge-header-content {
            flex-direction: column;
            text-align: center;
          }

          .knowledge-title {
            font-size: 2rem;
            justify-content: center;
          }

          .knowledge-actions {
            width: 100%;
            justify-content: center;
          }

          .knowledge-actions .glass-button {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 640px) {
          .knowledge-title {
            font-size: 1.75rem;
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .knowledge-blob {
            display: none;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .knowledge-list-container,
          .knowledge-header,
          .knowledge-content,
          .knowledge-card-wrapper,
          .knowledge-blob {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeList;
