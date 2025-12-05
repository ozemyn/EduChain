/* ===================================
   分类管理页面组件 - Category Management Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 分类树管理
   - 统计数据展示
   - 标签云展示
   - 高性能优化
   - 仅管理员可访问
   
   ================================== */

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
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CategoryTree, TagCloud } from '@/components/knowledge';
import type { Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import './CategoryManagement.css';

const { Text } = Typography;

interface CategoryStats {
  totalCategories: number;
  totalContent: number;
  topCategories: Array<{
    id: number;
    name: string;
    count: number;
  }>;
}

/**
 * 分类管理页面组件
 */
const CategoryManagement: React.FC = () => {
  const { user } = useAuth();

  // 状态管理
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

      // 模拟API调用 - TODO: 替换为真实API
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
      console.log('Creating category:', { parentId, ...categoryData });
      message.success('分类创建成功');
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
      console.log('Updating category:', { categoryId, ...categoryData });
      message.success('分类更新成功');
      await loadCategories();
    } catch (error) {
      console.error('Update category failed:', error);
      throw error;
    }
  };

  // 处理删除分类
  const handleCategoryDelete = async (categoryId: number) => {
    try {
      console.log('Deleting category:', categoryId);
      message.success('分类删除成功');
      await loadCategories();

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
    window.open(`/knowledge?tags=${encodeURIComponent(tagName)}`, '_blank');
  };

  // 初始加载
  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 权限检查
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="category-access-denied animate-fade-in">
        <div className="access-denied-card glass-card">
          <SettingOutlined className="access-denied-icon" />
          <h3 className="access-denied-title">权限不足</h3>
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
    <div className="category-management-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="category-background">
        <div className="category-blob category-blob-1" />
        <div className="category-blob category-blob-2" />
        <div className="category-blob category-blob-3" />
      </div>

      <div className="category-content container">
        {/* ===================================
            面包屑导航 - Breadcrumb
            ================================== */}
        <div className="category-breadcrumb glass-light animate-fade-in-up">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to="/knowledge" className="breadcrumb-link hover-scale">
                    知识库
                  </Link>
                ),
              },
              {
                title: <span className="breadcrumb-current">分类管理</span>,
              },
            ]}
          />
        </div>

        {/* ===================================
            页面头部 - Page Header
            ================================== */}
        <header className="category-header glass-light animate-fade-in-up delay-100">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <SettingOutlined />
                分类管理
              </h1>
              <p className="page-subtitle">
                管理知识分类体系，优化内容组织结构
              </p>
            </div>

            <div className="header-actions">
              <Link to="/knowledge">
                <Button
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  className="glass-button hover-scale active-scale"
                >
                  返回知识库
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <Spin spinning={loading} size="large">
          {/* ===================================
              主要内容区域 - Main Content
              ================================== */}
          <Row
            gutter={[24, 24]}
            className="category-main-content animate-fade-in-up delay-200"
          >
            {/* 左侧：分类树 */}
            <Col xs={24} lg={12}>
              <div className="category-tree-card glass-card">
                <div className="card-header">
                  <h2 className="card-title">
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
                  <div className="card-header">
                    <h2 className="card-title">
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
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="总内容数"
                          value={stats.totalContent}
                          prefix={<BarChartOutlined />}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="平均内容"
                          value={
                            stats.totalCategories > 0
                              ? Math.round(
                                  stats.totalContent / stats.totalCategories
                                )
                              : 0
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* 热门分类 */}
                <div className="popular-card glass-card">
                  <div className="card-header">
                    <h2 className="card-title">
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
                  <div className="detail-card glass-card animate-scale-in">
                    <div className="card-header">
                      <h2 className="card-title">
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
                      <div className="detail-actions">
                        <Link
                          to={`/knowledge?categoryId=${selectedCategory.id}`}
                        >
                          <Button
                            type="primary"
                            className="glass-button glass-strong hover-lift active-scale"
                            block
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

          {/* ===================================
              标签云区域 - Tag Cloud Section
              ================================== */}
          <div className="tag-cloud-section animate-fade-in-up delay-300">
            <div className="tag-cloud-card glass-card">
              <div className="card-header">
                <h2 className="card-title">
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
    </div>
  );
};

export default CategoryManagement;
