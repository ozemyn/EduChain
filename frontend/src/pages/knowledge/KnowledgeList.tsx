import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Pagination, 
  Spin, 
  Empty, 
  Button, 
  Space, 
  Typography,
  message,
  Modal
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KnowledgeCard, KnowledgeFilter } from '@/components/knowledge';
import type { KnowledgeItem } from '@/types';
import type { FilterValues } from '@/components/knowledge/KnowledgeFilter';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';

const { Title } = Typography;
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
  const loadKnowledgeList = async (page = 1, pageSize = 12, filterParams = filters) => {
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
    if (newFilters.categoryId) params.set('categoryId', String(newFilters.categoryId));
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

  // 处理点赞
  const handleLike = async (_knowledge: KnowledgeItem) => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    try {
      // 调用点赞API
      message.success('点赞成功');
      // 重新加载当前页数据
      loadKnowledgeList(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Like failed:', error);
      message.error('点赞失败');
    }
  };

  // 处理收藏
  const handleFavorite = async (_knowledge: KnowledgeItem) => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    try {
      // 调用收藏API
      message.success('收藏成功');
      // 重新加载当前页数据
      loadKnowledgeList(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Favorite failed:', error);
      message.error('收藏失败');
    }
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
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={2} style={{ margin: 0 }}>知识库</Title>
          {user && (
            <Link to="/knowledge/create">
              <Button type="primary" icon={<PlusOutlined />}>
                发布内容
              </Button>
            </Link>
          )}
        </Space>
      </div>

      <KnowledgeFilter
        onFilter={handleFilter}
        loading={loading}
      />

      <Spin spinning={loading}>
        {knowledgeList.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {knowledgeList.map(knowledge => (
                <Col key={knowledge.id} xs={24} sm={12} md={8} lg={6}>
                  <KnowledgeCard
                    knowledge={knowledge}
                    showActions={user?.id === knowledge.uploaderId}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onLike={handleLike}
                    onFavorite={handleFavorite}
                  />
                </Col>
              ))}
            </Row>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
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
          <Empty
            description="暂无知识内容"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            {user && (
              <Link to="/knowledge/create">
                <Button type="primary" icon={<PlusOutlined />}>
                  发布第一个内容
                </Button>
              </Link>
            )}
          </Empty>
        )}
      </Spin>
    </div>
  );
};

export default KnowledgeList;
