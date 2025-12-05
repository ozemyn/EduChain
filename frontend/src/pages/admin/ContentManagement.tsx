/* ===================================
   内容管理页面 - Content Management Page
   ===================================
   
   完整功能的内容管理系统
   使用全局样式系统，完整响应式设计
   
   ================================== */

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Typography,
  Row,
  Col,
  Statistic,
  Form,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExportOutlined,
  ReloadOutlined,
  FileTextOutlined,
  SearchOutlined,
  FilterOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './ContentManagement.css';

const { Search } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// 内容类型
interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
  uploaderId: number;
  uploaderName?: string;
  categoryId?: number;
  categoryName?: string;
  tags?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// 内容统计类型
interface ContentStats {
  knowledgeId: number;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  score: number;
}

// 内容类型图标映射
const TYPE_ICONS = {
  TEXT: <FileTextOutlined />,
  IMAGE: <PictureOutlined />,
  VIDEO: <VideoCameraOutlined />,
  PDF: <FilePdfOutlined />,
  LINK: <LinkOutlined />,
};

// 内容类型名称映射
const TYPE_NAMES = {
  TEXT: '文本',
  IMAGE: '图片',
  VIDEO: '视频',
  PDF: 'PDF',
  LINK: '链接',
};

/**
 * 内容管理页面组件
 */
const ContentManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<KnowledgeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<KnowledgeItem | null>(
    null
  );
  const [contentDetailVisible, setContentDetailVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [reviewForm] = Form.useForm();

  // 加载内容列表
  const loadContents = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockContents: KnowledgeItem[] = [
        {
          id: 1,
          title: 'React 18 新特性详解',
          content: '本文详细介绍了React 18的新特性...',
          type: 'TEXT',
          uploaderId: 1,
          uploaderName: '张三',
          categoryId: 1,
          categoryName: '前端开发',
          tags: 'React,JavaScript,前端',
          status: 1,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          title: 'TypeScript 高级类型应用',
          content: '深入探讨TypeScript的高级类型系统...',
          type: 'TEXT',
          uploaderId: 2,
          uploaderName: '李四',
          categoryId: 1,
          categoryName: '前端开发',
          tags: 'TypeScript,JavaScript',
          status: 2,
          createdAt: '2024-01-14T15:20:00Z',
          updatedAt: '2024-01-14T15:20:00Z',
        },
        {
          id: 3,
          title: '机器学习入门教程',
          content: '从零开始学习机器学习...',
          type: 'VIDEO',
          uploaderId: 1,
          uploaderName: '张三',
          categoryId: 2,
          categoryName: '人工智能',
          tags: '机器学习,AI,Python',
          status: 1,
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
        },
      ];

      setContents(mockContents);
      setTotal(mockContents.length);
    } catch (error) {
      console.error('Failed to load contents:', error);
      message.error('加载内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadContents();
  }, [
    currentPage,
    pageSize,
    searchKeyword,
    statusFilter,
    typeFilter,
    categoryFilter,
  ]);

  // 查看内容详情
  const handleViewContent = async (content: KnowledgeItem) => {
    setSelectedContent(content);
    setContentDetailVisible(true);

    try {
      const mockStats: ContentStats = {
        knowledgeId: content.id,
        viewCount: 1234,
        likeCount: 156,
        favoriteCount: 89,
        commentCount: 45,
        score: 8.5,
      };
      setContentStats(mockStats);
    } catch (error) {
      console.error('Failed to load content stats:', error);
    }
  };

  // 审核内容
  const handleReviewContent = (content: KnowledgeItem) => {
    setSelectedContent(content);
    reviewForm.resetFields();
    setReviewModalVisible(true);
  };

  // 提交审核结果
  const handleSubmitReview = async () => {
    try {
      const values = await reviewForm.validateFields();
      console.log('Review result:', values);

      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('审核结果已提交');
      setReviewModalVisible(false);
      loadContents();
    } catch (error) {
      console.error('Failed to submit review:', error);
      message.error('提交失败');
    }
  };

  // 删除内容
  const handleDeleteContent = async (contentId: number) => {
    try {
      console.log('Deleting content:', contentId);
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('内容删除成功');
      loadContents();
    } catch (error) {
      console.error('Failed to delete content:', error);
      message.error('删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的内容');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个内容吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          console.log('Batch deleting contents:', selectedRowKeys);
          await new Promise(resolve => setTimeout(resolve, 1000));

          message.success('批量删除成功');
          setSelectedRowKeys([]);
          loadContents();
        } catch (error) {
          console.error('Failed to batch delete:', error);
          message.error('批量删除失败');
        }
      },
    });
  };

  // 导出内容数据
  const handleExportContents = () => {
    message.info('导出功能开发中...');
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="default">草稿</Tag>;
      case 1:
        return <Tag color="green">已发布</Tag>;
      case 2:
        return <Tag color="orange">审核中</Tag>;
      case 3:
        return <Tag color="red">已拒绝</Tag>;
      case 4:
        return <Tag color="red">已删除</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列定义
  const columns: ColumnsType<KnowledgeItem> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title, record) => (
        <div>
          <Space>
            {TYPE_ICONS[record.type]}
            <Text
              strong
              className="content-title hover-scale"
              onClick={() => handleViewContent(record)}
            >
              {title}
            </Text>
          </Space>
          {record.tags && (
            <div className="content-tags">
              <Space size={4}>
                {record.tags.split(',').map((tag, index) => (
                  <Tag key={index} className="tag-item">
                    {tag.trim()}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '作者',
      key: 'author',
      width: 120,
      render: (_, record) => (
        <div>
          <div className="author-name">
            {record.uploaderName || `用户 ${record.uploaderId}`}
          </div>
          <div className="author-id">ID: {record.uploaderId}</div>
        </div>
      ),
    },
    {
      title: '分类',
      key: 'category',
      width: 120,
      render: (_, record) => (
        <Tag color="blue">{record.categoryName || '未分类'}</Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: keyof typeof TYPE_NAMES) => <Tag>{TYPE_NAMES[type]}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: status => getStatusTag(status),
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: date => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewContent(record)}
            className="hover-scale"
          >
            查看
          </Button>
          {record.status === 2 && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleReviewContent(record)}
              className="hover-scale"
            >
              审核
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            className="hover-scale"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个内容吗？"
            onConfirm={() => handleDeleteContent(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover-scale"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="content-management-page animate-fade-in">
      <div className="management-content container">
        {/* 页面头部 */}
        <header className="management-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <FileTextOutlined />
                内容管理
              </h1>
              <p className="page-subtitle">管理系统内容，审核用户发布</p>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <div className="management-main glass-card animate-fade-in-up delay-100">
          {/* 搜索和筛选 */}
          <div className="filter-section">
            <Space wrap size="middle">
              <Search
                placeholder="搜索标题或内容"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
                prefix={<SearchOutlined />}
                className="search-input"
              />
              <Select
                placeholder="选择状态"
                allowClear
                style={{ width: 120 }}
                value={statusFilter}
                onChange={setStatusFilter}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="0">草稿</Option>
                <Option value="1">已发布</Option>
                <Option value="2">审核中</Option>
                <Option value="3">已拒绝</Option>
                <Option value="4">已删除</Option>
              </Select>
              <Select
                placeholder="选择类型"
                allowClear
                style={{ width: 120 }}
                value={typeFilter}
                onChange={setTypeFilter}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="TEXT">文本</Option>
                <Option value="IMAGE">图片</Option>
                <Option value="VIDEO">视频</Option>
                <Option value="PDF">PDF</Option>
                <Option value="LINK">链接</Option>
              </Select>
              <Select
                placeholder="选择分类"
                allowClear
                style={{ width: 120 }}
                value={categoryFilter}
                onChange={setCategoryFilter}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="1">前端开发</Option>
                <Option value="2">人工智能</Option>
                <Option value="3">后端开发</Option>
              </Select>
            </Space>
          </div>

          {/* 操作按钮 */}
          <div className="action-section">
            <Space wrap>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={handleBatchDelete}
                disabled={selectedRowKeys.length === 0}
                className="glass-button hover-scale active-scale"
              >
                批量删除{' '}
                {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExportContents}
                className="glass-button hover-scale active-scale"
              >
                导出数据
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadContents}
                className="glass-button hover-scale active-scale"
              >
                刷新
              </Button>
            </Space>
          </div>

          {/* 内容表格 */}
          <div className="table-section">
            <Table
              columns={columns}
              dataSource={contents}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              scroll={{ x: 1200 }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 10);
                },
              }}
              className="content-table"
            />
          </div>
        </div>
      </div>

      {/* 内容详情抽屉 */}
      <Drawer
        title="内容详情"
        placement="right"
        width={800}
        open={contentDetailVisible}
        onClose={() => setContentDetailVisible(false)}
        className="content-detail-drawer"
      >
        {selectedContent && (
          <div className="content-detail-content">
            <Descriptions column={1} bordered className="content-descriptions">
              <Descriptions.Item label="标题">
                {selectedContent.title}
              </Descriptions.Item>
              <Descriptions.Item label="作者">
                {selectedContent.uploaderName ||
                  `用户 ${selectedContent.uploaderId}`}
              </Descriptions.Item>
              <Descriptions.Item label="分类">
                {selectedContent.categoryName || '未分类'}
              </Descriptions.Item>
              <Descriptions.Item label="类型">
                <Space>
                  {TYPE_ICONS[selectedContent.type]}
                  {TYPE_NAMES[selectedContent.type]}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="标签">
                {selectedContent.tags && (
                  <Space size={4}>
                    {selectedContent.tags.split(',').map((tag, index) => (
                      <Tag key={index}>{tag.trim()}</Tag>
                    ))}
                  </Space>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedContent.status)}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {dayjs(selectedContent.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {dayjs(selectedContent.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            <div className="content-body">
              <h4>内容</h4>
              <div className="content-text">
                <Paragraph>{selectedContent.content}</Paragraph>
              </div>
            </div>

            {contentStats && (
              <div className="content-stats">
                <h4>统计数据</h4>
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="浏览量"
                        value={contentStats.viewCount}
                      />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="点赞数"
                        value={contentStats.likeCount}
                      />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="收藏数"
                        value={contentStats.favoriteCount}
                      />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="评论数"
                        value={contentStats.commentCount}
                      />
                    </div>
                  </Col>
                </Row>
                <Row
                  gutter={[16, 16]}
                  style={{ marginTop: 'var(--spacing-md)' }}
                >
                  <Col span={6}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="质量评分"
                        value={contentStats.score}
                        precision={1}
                        suffix="/ 10"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 审核模态框 */}
      <Modal
        title="内容审核"
        open={reviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => setReviewModalVisible(false)}
        width={600}
        okText="提交"
        cancelText="取消"
        className="review-modal"
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item
            name="approved"
            label="审核结果"
            rules={[{ required: true, message: '请选择审核结果' }]}
          >
            <Select placeholder="请选择审核结果">
              <Option value={true}>审核通过</Option>
              <Option value={false}>审核拒绝</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="reason"
            label="审核意见"
            rules={[{ required: true, message: '请输入审核意见' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入审核意见"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentManagement;
