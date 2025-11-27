import React, { useState, useEffect } from 'react';
import {
  Card,
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
  Image,
  Typography,
  Row,
  Col,
  Statistic,
  Form,
  Switch,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExportOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { KnowledgeItem, KnowledgeStats } from '@/types/api';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// 内容状态枚举
const CONTENT_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  REVIEWING: 2,
  REJECTED: 3,
  DELETED: 4,
} as const;

// 内容类型图标映射
const TYPE_ICONS = {
  TEXT: <FileTextOutlined />,
  IMAGE: <PictureOutlined />,
  VIDEO: <VideoCameraOutlined />,
  PDF: <FilePdfOutlined />,
  LINK: <LinkOutlined />,
};

// 内容管理页面组件
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
  const [contentStats, setContentStats] = useState<KnowledgeStats | null>(null);
  const [reviewForm] = Form.useForm();

  // 加载内容列表
  const loadContents = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟内容数据
      const mockContents: KnowledgeItem[] = [
        {
          id: 1,
          title: 'React 18 新特性详解',
          content:
            '本文详细介绍了React 18的新特性，包括并发渲染、自动批处理、Suspense改进等...',
          type: 'TEXT',
          mediaUrls: [],
          linkUrl: undefined,
          uploaderId: 1,
          uploader: {
            id: 1,
            username: 'zhangsan',
            email: 'zhangsan@example.com',
            fullName: '张三',
            avatarUrl: undefined,
            school: '清华大学',
            level: 5,
            bio: '热爱学习的程序员',
            role: 'LEARNER',
            status: 1,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
          },
          categoryId: 1,
          category: {
            id: 1,
            name: '前端开发',
            description: '前端开发相关内容',
            parentId: undefined,
            sortOrder: 1,
            createdAt: '2024-01-01T00:00:00Z',
          },
          tags: 'React,JavaScript,前端',
          status: 1,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          title: 'TypeScript 高级类型应用',
          content:
            '深入探讨TypeScript的高级类型系统，包括泛型、条件类型、映射类型等...',
          type: 'TEXT',
          mediaUrls: [],
          linkUrl: undefined,
          uploaderId: 2,
          uploader: {
            id: 2,
            username: 'lisi',
            email: 'lisi@example.com',
            fullName: '李四',
            avatarUrl: undefined,
            school: '北京大学',
            level: 3,
            bio: '前端开发工程师',
            role: 'LEARNER',
            status: 1,
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-14T00:00:00Z',
          },
          categoryId: 1,
          category: {
            id: 1,
            name: '前端开发',
            description: '前端开发相关内容',
            parentId: undefined,
            sortOrder: 1,
            createdAt: '2024-01-01T00:00:00Z',
          },
          tags: 'TypeScript,JavaScript,类型系统',
          status: 2, // 审核中
          createdAt: '2024-01-14T15:20:00Z',
          updatedAt: '2024-01-14T15:20:00Z',
        },
        {
          id: 3,
          title: '机器学习入门教程',
          content:
            '从零开始学习机器学习，包括基本概念、算法原理、实践案例等...',
          type: 'VIDEO',
          mediaUrls: ['https://example.com/video1.mp4'],
          linkUrl: undefined,
          uploaderId: 1,
          uploader: {
            id: 1,
            username: 'zhangsan',
            email: 'zhangsan@example.com',
            fullName: '张三',
            avatarUrl: undefined,
            school: '清华大学',
            level: 5,
            bio: '热爱学习的程序员',
            role: 'LEARNER',
            status: 1,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
          },
          categoryId: 2,
          category: {
            id: 2,
            name: '人工智能',
            description: '人工智能相关内容',
            parentId: undefined,
            sortOrder: 2,
            createdAt: '2024-01-01T00:00:00Z',
          },
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

    // 加载内容统计数据
    try {
      // 模拟API调用
      const mockStats: KnowledgeStats = {
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

      // 模拟API调用
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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('内容删除成功');
      loadContents();
    } catch (error) {
      console.error('Failed to delete content:', error);
      message.error('删除失败');
    }
  };

  // 批量操作
  const handleBatchOperation = (
    operation: string,
    selectedRowKeys: React.Key[]
  ) => {
    console.log(`Batch ${operation}:`, selectedRowKeys);
    message.info(`批量${operation}功能开发中...`);
  };

  // 导出内容数据
  const handleExportContents = () => {
    message.info('导出功能开发中...');
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case CONTENT_STATUS.DRAFT:
        return <Tag color="default">草稿</Tag>;
      case CONTENT_STATUS.PUBLISHED:
        return <Tag color="green">已发布</Tag>;
      case CONTENT_STATUS.REVIEWING:
        return <Tag color="orange">审核中</Tag>;
      case CONTENT_STATUS.REJECTED:
        return <Tag color="red">已拒绝</Tag>;
      case CONTENT_STATUS.DELETED:
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
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={() => handleViewContent(record)}
            >
              {title}
            </Text>
          </Space>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {record.tags && (
              <Space size={4}>
                {record.tags.split(',').map((tag, index) => (
                  <Tag key={index}>{tag.trim()}</Tag>
                ))}
              </Space>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '作者',
      key: 'author',
      render: (_, record) => (
        <div>
          <div>{record.uploader.fullName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            @{record.uploader.username}
          </div>
        </div>
      ),
    },
    {
      title: '分类',
      key: 'category',
      render: (_, record) => (
        <Tag color="blue">{record.category?.name || '未分类'}</Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: type => {
        const typeMap = {
          TEXT: '文本',
          IMAGE: '图片',
          VIDEO: '视频',
          PDF: 'PDF',
          LINK: '链接',
        };
        return <Tag>{typeMap[type as keyof typeof typeMap]}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => getStatusTag(status),
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewContent(record)}
          >
            查看
          </Button>
          {record.status === CONTENT_STATUS.REVIEWING && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleReviewContent(record)}
            >
              审核
            </Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个内容吗？"
            onConfirm={() => handleDeleteContent(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: KnowledgeItem[]) => {
      console.log('Selected rows:', selectedRowKeys, selectedRows);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Search
              placeholder="搜索标题或内容"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchKeyword}
            />
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
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
            >
              <Option value="1">前端开发</Option>
              <Option value="2">人工智能</Option>
              <Option value="3">后端开发</Option>
            </Select>
            <Button icon={<ExportOutlined />} onClick={handleExportContents}>
              导出数据
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadContents}>
              刷新
            </Button>
          </Space>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Button onClick={() => handleBatchOperation('审核通过', [])}>
              批量审核通过
            </Button>
            <Button onClick={() => handleBatchOperation('审核拒绝', [])}>
              批量审核拒绝
            </Button>
            <Button danger onClick={() => handleBatchOperation('删除', [])}>
              批量删除
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={contents}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
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
        />
      </Card>

      {/* 内容详情抽屉 */}
      <Drawer
        title="内容详情"
        placement="right"
        width={800}
        open={contentDetailVisible}
        onClose={() => setContentDetailVisible(false)}
      >
        {selectedContent && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="标题">
                {selectedContent.title}
              </Descriptions.Item>
              <Descriptions.Item label="作者">
                {selectedContent.uploader.fullName} (@
                {selectedContent.uploader.username})
              </Descriptions.Item>
              <Descriptions.Item label="分类">
                {selectedContent.category?.name || '未分类'}
              </Descriptions.Item>
              <Descriptions.Item label="类型">
                <Space>
                  {TYPE_ICONS[selectedContent.type]}
                  {selectedContent.type}
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

            <div style={{ marginTop: '24px' }}>
              <h4>内容</h4>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              >
                <Paragraph>{selectedContent.content}</Paragraph>
              </div>
            </div>

            {selectedContent.mediaUrls &&
              selectedContent.mediaUrls.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4>媒体文件</h4>
                  <Space wrap>
                    {selectedContent.mediaUrls.map((url, index) => (
                      <Image
                        key={index}
                        width={100}
                        height={100}
                        src={url}
                        style={{ objectFit: 'cover' }}
                      />
                    ))}
                  </Space>
                </div>
              )}

            {selectedContent.linkUrl && (
              <div style={{ marginTop: '24px' }}>
                <h4>链接地址</h4>
                <a
                  href={selectedContent.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedContent.linkUrl}
                </a>
              </div>
            )}

            {contentStats && (
              <div style={{ marginTop: '24px' }}>
                <h4>统计数据</h4>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic title="浏览量" value={contentStats.viewCount} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="点赞数" value={contentStats.likeCount} />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="收藏数"
                      value={contentStats.favoriteCount}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="评论数"
                      value={contentStats.commentCount}
                    />
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '16px' }}>
                  <Col span={6}>
                    <Statistic
                      title="质量评分"
                      value={contentStats.score}
                      precision={1}
                      suffix="/ 10"
                    />
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

          <Form.Item
            name="notifyAuthor"
            label="通知作者"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentManagement;
