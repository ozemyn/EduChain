import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Typography,
  Space,
  Button,
  Statistic,
  message,
  Breadcrumb,
  Spin,
} from 'antd';
import {
  FolderOutlined,
  BarChartOutlined,
  SettingOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CategoryTree, TagCloud } from '@/components/knowledge';
import type { Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Title, Text } = Typography;

interface CategoryStats {
  totalCategories: number;
  totalContent: number;
  topCategories: Array<{
    id: number;
    name: string;
    count: number;
  }>;
}

const CategoryManagement: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    totalContent: 0,
    topCategories: [],
  });

  // 加载分类数据
  const loadCategories = async () => {
    try {
      setLoading(true);

      // 模拟API调用
      const mockCategories: Category[] = [
        {
          id: 1,
          name: '前端开发',
          description: '前端相关技术和框架',
          sortOrder: 1,
          createdAt: '2024-01-01',
          knowledgeCount: 25,
          children: [
            {
              id: 11,
              name: 'React',
              description: 'React框架相关内容',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 10,
              parentId: 1,
            },
            {
              id: 12,
              name: 'Vue',
              description: 'Vue框架相关内容',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 8,
              parentId: 1,
            },
            {
              id: 13,
              name: 'Angular',
              description: 'Angular框架相关内容',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 7,
              parentId: 1,
            },
          ],
        },
        {
          id: 2,
          name: '后端开发',
          description: '后端相关技术和框架',
          sortOrder: 2,
          createdAt: '2024-01-01',
          knowledgeCount: 30,
          children: [
            {
              id: 21,
              name: 'Spring Boot',
              description: 'Spring Boot框架相关内容',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 15,
              parentId: 2,
            },
            {
              id: 22,
              name: 'Node.js',
              description: 'Node.js运行时相关内容',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 12,
              parentId: 2,
            },
            {
              id: 23,
              name: 'Django',
              description: 'Django框架相关内容',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 3,
              parentId: 2,
            },
          ],
        },
        {
          id: 3,
          name: '数据库',
          description: '数据库相关技术',
          sortOrder: 3,
          createdAt: '2024-01-01',
          knowledgeCount: 18,
          children: [
            {
              id: 31,
              name: 'MySQL',
              description: 'MySQL数据库相关内容',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 10,
              parentId: 3,
            },
            {
              id: 32,
              name: 'Redis',
              description: 'Redis缓存相关内容',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 5,
              parentId: 3,
            },
            {
              id: 33,
              name: 'MongoDB',
              description: 'MongoDB文档数据库相关内容',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 3,
              parentId: 3,
            },
          ],
        },
        {
          id: 4,
          name: '移动开发',
          description: '移动应用开发相关技术',
          sortOrder: 4,
          createdAt: '2024-01-01',
          knowledgeCount: 12,
          children: [
            {
              id: 41,
              name: 'React Native',
              description: 'React Native框架相关内容',
              sortOrder: 1,
              createdAt: '2024-01-01',
              knowledgeCount: 6,
              parentId: 4,
            },
            {
              id: 42,
              name: 'Flutter',
              description: 'Flutter框架相关内容',
              sortOrder: 2,
              createdAt: '2024-01-01',
              knowledgeCount: 4,
              parentId: 4,
            },
            {
              id: 43,
              name: 'iOS',
              description: 'iOS原生开发相关内容',
              sortOrder: 3,
              createdAt: '2024-01-01',
              knowledgeCount: 2,
              parentId: 4,
            },
          ],
        },
      ];

      setCategories(mockCategories);

      // 计算统计信息
      const totalCategories = countCategories(mockCategories);
      const totalContent = mockCategories.reduce(
        (sum, cat) => sum + (cat.knowledgeCount || 0),
        0
      );
      const topCategories = mockCategories
        .map(cat => ({
          id: cat.id,
          name: cat.name,
          count: cat.knowledgeCount || 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalCategories,
        totalContent,
        topCategories,
      });
    } catch (error) {
      console.error('Failed to load categories:', error);
      message.error('加载分类数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 递归计算分类总数
  const countCategories = (categories: Category[]): number => {
    return categories.reduce((count, category) => {
      return (
        count + 1 + (category.children ? countCategories(category.children) : 0)
      );
    }, 0);
  };

  // 处理分类选择
  const handleCategorySelect = (
    _categoryId: number | null,
    category: Category | null
  ) => {
    setSelectedCategory(category);
  };

  // 处理创建分类
  const handleCategoryCreate = async (
    parentId: number | null,
    categoryData: { name: string; description?: string }
  ) => {
    try {
      // 模拟API调用
      console.log('Creating category:', { parentId, ...categoryData });
      message.success('分类创建成功');

      // 重新加载分类数据
      await loadCategories();
    } catch (error) {
      console.error('Create category failed:', error);
      throw error;
    }
  };

  // 处理更新分类
  const handleCategoryUpdate = async (
    categoryId: number,
    categoryData: { name?: string; description?: string }
  ) => {
    try {
      // 模拟API调用
      console.log('Updating category:', { categoryId, ...categoryData });
      message.success('分类更新成功');

      // 重新加载分类数据
      await loadCategories();
    } catch (error) {
      console.error('Update category failed:', error);
      throw error;
    }
  };

  // 处理删除分类
  const handleCategoryDelete = async (categoryId: number) => {
    try {
      // 模拟API调用
      console.log('Deleting category:', categoryId);
      message.success('分类删除成功');

      // 重新加载分类数据
      await loadCategories();

      // 如果删除的是当前选中的分类，清除选择
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Delete category failed:', error);
      throw error;
    }
  };

  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    // 跳转到知识列表页面，并应用标签筛选
    window.open(`/knowledge?tags=${encodeURIComponent(tagName)}`, '_blank');
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="category-access-denied animate-fade-in">
        <div className="glass-card access-denied-card">
          <SettingOutlined className="access-denied-icon" />
          <Title level={3} className="access-denied-title">
            权限不足
          </Title>
          <Text type="secondary" className="access-denied-description">
            只有管理员可以访问分类管理页面
          </Text>
          <Link to="/knowledge">
            <Button
              type="primary"
              size="large"
              className="glass-button glass-strong hover-lift active-scale"
            >
              返回知识库
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-management-container animate-fade-in">
      {/* 背景装饰 */}
      <div className="category-background">
        <div className="category-blob category-blob-1" />
        <div className="category-blob category-blob-2" />
        <div className="category-blob category-blob-3" />
      </div>

      <div className="category-content">
        {/* 面包屑导航 */}
        <div className="category-breadcrumb glass-light animate-fade-in-up">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/knowledge" className="breadcrumb-link hover-scale">
                知识库
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-current">
              分类管理
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* 页面头部 */}
        <section className="category-header glass-light animate-fade-in-up delay-100">
          <div className="category-header-content">
            <div className="category-title-section">
              <h1 className="category-title gradient-text">
                <SettingOutlined />
                分类管理
              </h1>
              <p className="category-subtitle">
                管理知识分类体系，优化内容组织结构
              </p>
            </div>

            <div className="category-actions">
              <Link to="/knowledge">
                <Button
                  size="large"
                  className="glass-button hover-scale active-scale"
                >
                  返回知识库
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Spin spinning={loading}>
          <Row
            gutter={[24, 24]}
            className="category-main-content animate-fade-in-up delay-200"
          >
            {/* 左侧：分类树 */}
            <Col xs={24} lg={12}>
              <div className="category-tree-wrapper glass-card">
                <div className="tree-header">
                  <h2 className="tree-title">
                    <FolderOutlined />
                    分类结构
                  </h2>
                </div>
                <CategoryTree
                  categories={categories}
                  onCategorySelect={handleCategorySelect}
                  onCategoryCreate={handleCategoryCreate}
                  onCategoryUpdate={handleCategoryUpdate}
                  onCategoryDelete={handleCategoryDelete}
                  selectedCategoryId={selectedCategory?.id}
                  showActions={true}
                  showSearch={true}
                  showStats={true}
                />
              </div>
            </Col>

            {/* 右侧：统计信息和详情 */}
            <Col xs={24} lg={12}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: '100%' }}
              >
                {/* 统计信息 */}
                <div className="stats-card glass-card">
                  <div className="stats-header">
                    <h2 className="stats-title">
                      <BarChartOutlined />
                      统计概览
                    </h2>
                  </div>
                  <Row gutter={[16, 16]} className="stats-grid">
                    <Col span={8}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="总分类数"
                          value={stats.totalCategories}
                          prefix={<FolderOutlined />}
                          valueStyle={{ color: 'var(--accent-primary)' }}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="总内容数"
                          value={stats.totalContent}
                          prefix={<BarChartOutlined />}
                          valueStyle={{ color: 'var(--accent-success)' }}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="平均内容数"
                          value={
                            stats.totalCategories > 0
                              ? Math.round(
                                  stats.totalContent / stats.totalCategories
                                )
                              : 0
                          }
                          valueStyle={{ color: 'var(--accent-warning)' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* 热门分类 */}
                <div className="popular-categories-card glass-card">
                  <div className="popular-header">
                    <h2 className="popular-title">
                      <FolderOutlined />
                      热门分类
                    </h2>
                  </div>
                  <div className="popular-list">
                    {stats.topCategories.map((category, index) => (
                      <div
                        key={category.id}
                        className="popular-item glass-light hover-lift"
                      >
                        <div className="popular-rank">
                          <span className="rank-number">#{index + 1}</span>
                        </div>
                        <div className="popular-info">
                          <Text strong className="category-name">
                            {category.name}
                          </Text>
                          <Text type="secondary" className="category-count">
                            {category.count} 个内容
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 选中分类详情 */}
                {selectedCategory && (
                  <div className="category-detail-card glass-card animate-scale-in">
                    <div className="detail-header">
                      <h2 className="detail-title">
                        <FolderOutlined />
                        分类详情
                      </h2>
                    </div>
                    <div className="detail-content">
                      <div className="detail-item">
                        <Text strong className="detail-label">
                          分类名称
                        </Text>
                        <Text className="detail-value">
                          {selectedCategory.name}
                        </Text>
                      </div>
                      {selectedCategory.description && (
                        <div className="detail-item">
                          <Text strong className="detail-label">
                            分类描述
                          </Text>
                          <Text className="detail-value">
                            {selectedCategory.description}
                          </Text>
                        </div>
                      )}
                      <div className="detail-item">
                        <Text strong className="detail-label">
                          内容数量
                        </Text>
                        <Text className="detail-value">
                          {selectedCategory.knowledgeCount || 0} 个
                        </Text>
                      </div>
                      <div className="detail-item">
                        <Text strong className="detail-label">
                          创建时间
                        </Text>
                        <Text className="detail-value">
                          {new Date(
                            selectedCategory.createdAt
                          ).toLocaleDateString()}
                        </Text>
                      </div>
                      <div className="detail-item">
                        <Text strong className="detail-label">
                          排序顺序
                        </Text>
                        <Text className="detail-value">
                          {selectedCategory.sortOrder}
                        </Text>
                      </div>
                      {selectedCategory.children &&
                        selectedCategory.children.length > 0 && (
                          <div className="detail-item">
                            <Text strong className="detail-label">
                              子分类
                            </Text>
                            <div className="children-list">
                              {selectedCategory.children.map(child => (
                                <Button
                                  key={child.id}
                                  size="small"
                                  className="glass-badge hover-scale active-scale"
                                  onClick={() => setSelectedCategory(child)}
                                >
                                  {child.name} ({child.knowledgeCount || 0})
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      <div className="detail-actions">
                        <Link
                          to={`/knowledge?categoryId=${selectedCategory.id}`}
                        >
                          <Button
                            type="primary"
                            className="glass-button glass-strong hover-lift active-scale"
                          >
                            查看该分类下的内容
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </Space>
            </Col>
          </Row>

          {/* 标签云 */}
          <div className="tag-cloud-section animate-fade-in-up delay-300">
            <div className="tag-cloud-card glass-card">
              <div className="tag-cloud-header">
                <h2 className="tag-cloud-title">
                  <TagOutlined />
                  热门标签
                </h2>
              </div>
              <TagCloud
                onTagClick={handleTagClick}
                showSearch={true}
                showStats={true}
                maxTags={30}
                title=""
              />
            </div>
          </div>
        </Spin>
      </div>

      <style>{`
        /* ===== 分类管理页面样式 ===== */
        .category-management-container {
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        /* 权限拒绝页面 */
        .category-access-denied {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }

        .access-denied-card {
          text-align: center;
          padding: var(--spacing-3xl);
          border-radius: var(--liquid-border-radius-lg);
          max-width: 400px;
        }

        .access-denied-icon {
          font-size: 4rem;
          color: var(--text-quaternary);
          margin-bottom: var(--spacing-lg);
        }

        .access-denied-title {
          color: var(--text-primary);
          margin-bottom: var(--spacing-md) !important;
        }

        .access-denied-description {
          display: block;
          margin-bottom: var(--spacing-xl);
        }

        /* 背景装饰 */
        .category-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
        }

        .category-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: var(--blur-xl);
          animation: float 8s ease-in-out infinite;
        }

        .category-blob-1 {
          top: 10%;
          right: 5%;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, var(--primary-200) 0%, transparent 70%);
          animation-delay: 0s;
        }

        .category-blob-2 {
          top: 50%;
          left: 5%;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, var(--accent-success) 0%, transparent 70%);
          animation-delay: 3s;
        }

        .category-blob-3 {
          bottom: 20%;
          right: 30%;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, var(--accent-warning) 0%, transparent 70%);
          animation-delay: 6s;
        }

        /* 主要内容 */
        .category-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-lg);
        }

        .category-breadcrumb {
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--liquid-border-radius);
          margin-bottom: var(--spacing-xl);
        }

        .breadcrumb-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast) var(--ease-ios);
        }

        .breadcrumb-link:hover {
          color: var(--accent-primary);
        }

        .breadcrumb-current {
          color: var(--text-primary);
          font-weight: 500;
        }

        /* 页面头部 */
        .category-header {
          margin-bottom: var(--spacing-2xl);
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-xl);
        }

        .category-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }

        .category-title-section {
          flex: 1;
        }

        .category-title {
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

        .category-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .category-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        /* 主要内容区域 */
        .category-main-content {
          margin-bottom: var(--spacing-2xl);
        }

        /* 分类树包装器 */
        .category-tree-wrapper {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius-lg);
          height: fit-content;
        }

        .tree-header {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-light);
        }

        .tree-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        /* 统计卡片 */
        .stats-card {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius);
        }

        .stats-header {
          margin-bottom: var(--spacing-lg);
        }

        .stats-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .stats-grid {
          margin: 0;
        }

        .stat-item {
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          text-align: center;
          transition: all var(--transition-fast) var(--ease-ios);
        }

        /* 热门分类卡片 */
        .popular-categories-card {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius);
        }

        .popular-header {
          margin-bottom: var(--spacing-lg);
        }

        .popular-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .popular-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .popular-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .popular-rank {
          flex-shrink: 0;
        }

        .rank-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--accent-primary), var(--primary-600));
          color: var(--text-inverse);
          border-radius: 50%;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .popular-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-name {
          color: var(--text-primary);
        }

        .category-count {
          font-size: 0.875rem;
        }

        /* 分类详情卡片 */
        .category-detail-card {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius);
        }

        .detail-header {
          margin-bottom: var(--spacing-lg);
        }

        .detail-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .detail-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .detail-value {
          color: var(--text-primary);
        }

        .children-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }

        .detail-actions {
          margin-top: var(--spacing-md);
        }

        /* 标签云区域 */
        .tag-cloud-section {
          margin-top: var(--spacing-2xl);
        }

        .tag-cloud-card {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius-lg);
        }

        .tag-cloud-header {
          margin-bottom: var(--spacing-lg);
        }

        .tag-cloud-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .category-header-content {
            flex-direction: column;
            text-align: center;
          }

          .category-actions {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .category-content {
            padding: var(--spacing-md);
          }

          .category-header {
            padding: var(--spacing-xl);
          }

          .category-title {
            font-size: 2rem;
            justify-content: center;
          }

          .category-tree-wrapper,
          .stats-card,
          .popular-categories-card,
          .category-detail-card,
          .tag-cloud-card {
            padding: var(--spacing-lg);
          }

          .stats-grid .ant-col {
            margin-bottom: var(--spacing-md);
          }
        }

        @media (max-width: 640px) {
          .category-title {
            font-size: 1.75rem;
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .popular-item {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-sm);
          }

          .popular-info {
            flex-direction: column;
            gap: var(--spacing-xs);
          }

          .category-blob {
            display: none;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .category-management-container,
          .category-header,
          .category-main-content,
          .tag-cloud-section,
          .category-blob,
          .stat-item,
          .popular-item {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryManagement;
