import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Space, 
  Button, 
  Statistic, 
  message,
  Breadcrumb,
  Spin
} from 'antd';
import { 
  FolderOutlined, 
  BarChartOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CategoryTree, TagCloud } from '@/components/knowledge';
import type { Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
              parentId: 1
            },
            { 
              id: 12, 
              name: 'Vue', 
              description: 'Vue框架相关内容', 
              sortOrder: 2, 
              createdAt: '2024-01-01', 
              knowledgeCount: 8,
              parentId: 1
            },
            { 
              id: 13, 
              name: 'Angular', 
              description: 'Angular框架相关内容', 
              sortOrder: 3, 
              createdAt: '2024-01-01', 
              knowledgeCount: 7,
              parentId: 1
            },
          ]
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
              parentId: 2
            },
            { 
              id: 22, 
              name: 'Node.js', 
              description: 'Node.js运行时相关内容', 
              sortOrder: 2, 
              createdAt: '2024-01-01', 
              knowledgeCount: 12,
              parentId: 2
            },
            { 
              id: 23, 
              name: 'Django', 
              description: 'Django框架相关内容', 
              sortOrder: 3, 
              createdAt: '2024-01-01', 
              knowledgeCount: 3,
              parentId: 2
            },
          ]
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
              parentId: 3
            },
            { 
              id: 32, 
              name: 'Redis', 
              description: 'Redis缓存相关内容', 
              sortOrder: 2, 
              createdAt: '2024-01-01', 
              knowledgeCount: 5,
              parentId: 3
            },
            { 
              id: 33, 
              name: 'MongoDB', 
              description: 'MongoDB文档数据库相关内容', 
              sortOrder: 3, 
              createdAt: '2024-01-01', 
              knowledgeCount: 3,
              parentId: 3
            },
          ]
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
              parentId: 4
            },
            { 
              id: 42, 
              name: 'Flutter', 
              description: 'Flutter框架相关内容', 
              sortOrder: 2, 
              createdAt: '2024-01-01', 
              knowledgeCount: 4,
              parentId: 4
            },
            { 
              id: 43, 
              name: 'iOS', 
              description: 'iOS原生开发相关内容', 
              sortOrder: 3, 
              createdAt: '2024-01-01', 
              knowledgeCount: 2,
              parentId: 4
            },
          ]
        },
      ];

      setCategories(mockCategories);
      
      // 计算统计信息
      const totalCategories = countCategories(mockCategories);
      const totalContent = mockCategories.reduce((sum, cat) => sum + (cat.knowledgeCount || 0), 0);
      const topCategories = mockCategories
        .map(cat => ({ id: cat.id, name: cat.name, count: cat.knowledgeCount || 0 }))
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
      return count + 1 + (category.children ? countCategories(category.children) : 0);
    }, 0);
  };

  // 处理分类选择
  const handleCategorySelect = (_categoryId: number | null, category: Category | null) => {
    setSelectedCategory(category);
  };

  // 处理创建分类
  const handleCategoryCreate = async (parentId: number | null, categoryData: { name: string; description?: string }) => {
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
  const handleCategoryUpdate = async (categoryId: number, categoryData: { name?: string; description?: string }) => {
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
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={3}>权限不足</Title>
        <Text type="secondary">只有管理员可以访问分类管理页面</Text>
        <div style={{ marginTop: 16 }}>
          <Link to="/knowledge">
            <Button type="primary">返回知识库</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to="/knowledge">知识库</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>分类管理</Breadcrumb.Item>
      </Breadcrumb>

      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={2} style={{ margin: 0 }}>
            <FolderOutlined style={{ marginRight: 8 }} />
            分类管理
          </Title>
          <Link to="/knowledge">
            <Button>返回知识库</Button>
          </Link>
        </Space>
      </div>

      <Spin spinning={loading}>
        <Row gutter={24}>
          {/* 左侧：分类树 */}
          <Col xs={24} lg={12}>
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
          </Col>

          {/* 右侧：统计信息和详情 */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* 统计信息 */}
              <Card title="统计概览" size="small">
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="总分类数"
                      value={stats.totalCategories}
                      prefix={<FolderOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="总内容数"
                      value={stats.totalContent}
                      prefix={<BarChartOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="平均内容数"
                      value={stats.totalCategories > 0 ? Math.round(stats.totalContent / stats.totalCategories) : 0}
                    />
                  </Col>
                </Row>
              </Card>

              {/* 热门分类 */}
              <Card title="热门分类" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {stats.topCategories.map((category, index) => (
                    <div 
                      key={category.id}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: index < stats.topCategories.length - 1 ? '1px solid #f0f0f0' : 'none'
                      }}
                    >
                      <Space>
                        <Text strong style={{ color: '#1890ff' }}>
                          #{index + 1}
                        </Text>
                        <Text>{category.name}</Text>
                      </Space>
                      <Text type="secondary">{category.count} 个内容</Text>
                    </div>
                  ))}
                </Space>
              </Card>

              {/* 选中分类详情 */}
              {selectedCategory && (
                <Card title="分类详情" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>分类名称：</Text>
                      <Text>{selectedCategory.name}</Text>
                    </div>
                    {selectedCategory.description && (
                      <div>
                        <Text strong>分类描述：</Text>
                        <Text>{selectedCategory.description}</Text>
                      </div>
                    )}
                    <div>
                      <Text strong>内容数量：</Text>
                      <Text>{selectedCategory.knowledgeCount || 0} 个</Text>
                    </div>
                    <div>
                      <Text strong>创建时间：</Text>
                      <Text>{new Date(selectedCategory.createdAt).toLocaleDateString()}</Text>
                    </div>
                    <div>
                      <Text strong>排序顺序：</Text>
                      <Text>{selectedCategory.sortOrder}</Text>
                    </div>
                    {selectedCategory.children && selectedCategory.children.length > 0 && (
                      <div>
                        <Text strong>子分类：</Text>
                        <div style={{ marginTop: 8 }}>
                          <Space wrap>
                            {selectedCategory.children.map(child => (
                              <Button 
                                key={child.id} 
                                size="small" 
                                type="dashed"
                                onClick={() => setSelectedCategory(child)}
                              >
                                {child.name} ({child.knowledgeCount || 0})
                              </Button>
                            ))}
                          </Space>
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: 16 }}>
                      <Link to={`/knowledge?categoryId=${selectedCategory.id}`}>
                        <Button type="primary" size="small">
                          查看该分类下的内容
                        </Button>
                      </Link>
                    </div>
                  </Space>
                </Card>
              )}
            </Space>
          </Col>
        </Row>

        {/* 标签云 */}
        <div style={{ marginTop: 24 }}>
          <TagCloud
            onTagClick={handleTagClick}
            showSearch={true}
            showStats={true}
            maxTags={30}
            title="热门标签"
          />
        </div>
      </Spin>
    </div>
  );
};

export default CategoryManagement;