/* ===================================
   工单列表页面 - Ticket List Page
   ===================================
   
   特性：
   - 工单状态跟踪
   - 筛选和搜索
   - 详情查看
   - 状态更新
   
   ================================== */

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Descriptions,
  Timeline,
} from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockTickets, type Ticket } from '@/mock/data/tickets';
import './Resources.css';

const { Title, Text } = Typography;
const { Option } = Select;

const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // 状态配置
  const statusConfig = {
    pending: {
      color: 'default',
      text: '待处理',
      icon: <ClockCircleOutlined />,
    },
    processing: {
      color: 'processing',
      text: '处理中',
      icon: <ExclamationCircleOutlined />,
    },
    resolved: {
      color: 'success',
      text: '已解决',
      icon: <CheckCircleOutlined />,
    },
    closed: { color: 'error', text: '已关闭', icon: <CloseCircleOutlined /> },
  };

  // 优先级配置
  const priorityConfig = {
    low: { color: 'default', text: '普通' },
    medium: { color: 'orange', text: '紧急' },
    high: { color: 'red', text: '非常紧急' },
  };

  // 分类配置
  const categoryConfig = {
    account: '账户管理',
    content: '内容发布',
    blockchain: '区块链存证',
    settings: '系统设置',
    technical: '技术问题',
    billing: '计费问题',
    other: '其他问题',
  };

  // 过滤工单
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch =
      searchText === '' ||
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 查看工单详情
  const viewTicketDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailVisible(true);
  };

  // 表格列配置
  const columns = [
    {
      title: '工单号',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id: string) => (
        <Text code style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
          {id}
        </Text>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string, record: Ticket) => (
        <Button
          type="link"
          onClick={() => viewTicketDetail(record)}
          style={{ padding: 0, height: 'auto', textAlign: 'left' }}
        >
          {title}
        </Button>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Text style={{ color: 'var(--text-tertiary)' }}>
          {categoryConfig[category as keyof typeof categoryConfig]}
        </Text>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return <Tag className="priority-tag">{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag className="status-tag" icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (time: string) => (
        <Text style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          {time}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: unknown, record: Ticket) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => viewTicketDetail(record)}
          size="small"
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div className="resources-page animate-fade-in">
      <div className="resources-container container">
        {/* 页面头部 */}
        <header className="resources-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <FileTextOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            我的工单
          </Title>
          <Text style={{ color: 'var(--text-tertiary)' }}>
            查看和管理您提交的工单
          </Text>
        </header>

        {/* 操作区域 */}
        <Card className="glass-card animate-fade-in-up delay-100">
          <Space
            size="large"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <Space size="middle">
              <Input
                placeholder="搜索工单号或标题..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
                className="glass-input"
              />

              <Select
                placeholder="筛选状态"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
                className="glass-select"
              >
                <Option value="all">全部状态</Option>
                <Option value="pending">待处理</Option>
                <Option value="processing">处理中</Option>
                <Option value="resolved">已解决</Option>
                <Option value="closed">已关闭</Option>
              </Select>
            </Space>

            <Button
              type="primary"
              onClick={() => navigate('/ticket')}
              className="glass-button glass-strong"
            >
              提交新工单
            </Button>
          </Space>
        </Card>

        {/* 工单列表 */}
        <Card className="glass-card animate-fade-in-up delay-200">
          <Table
            columns={columns}
            dataSource={filteredTickets}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条工单`,
            }}
            locale={{
              emptyText: '暂无工单记录',
            }}
          />
        </Card>

        {/* 工单详情弹窗 */}
        <Modal
          title={
            <Space>
              <FileTextOutlined />
              <span>工单详情</span>
            </Space>
          }
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              关闭
            </Button>,
          ]}
          width={800}
        >
          {selectedTicket && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="工单号" span={2}>
                  <Text code>{selectedTicket.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="标题" span={2}>
                  {selectedTicket.title}
                </Descriptions.Item>
                <Descriptions.Item label="分类">
                  {
                    categoryConfig[
                      selectedTicket.category as keyof typeof categoryConfig
                    ]
                  }
                </Descriptions.Item>
                <Descriptions.Item label="优先级">
                  <Tag
                    color={
                      priorityConfig[
                        selectedTicket.priority as keyof typeof priorityConfig
                      ].color
                    }
                  >
                    {
                      priorityConfig[
                        selectedTicket.priority as keyof typeof priorityConfig
                      ].text
                    }
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag
                    color={
                      statusConfig[
                        selectedTicket.status as keyof typeof statusConfig
                      ].color
                    }
                    icon={
                      statusConfig[
                        selectedTicket.status as keyof typeof statusConfig
                      ].icon
                    }
                  >
                    {
                      statusConfig[
                        selectedTicket.status as keyof typeof statusConfig
                      ].text
                    }
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {selectedTicket.createTime}
                </Descriptions.Item>
                <Descriptions.Item label="问题描述" span={2}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedTicket.description}
                  </div>
                </Descriptions.Item>
              </Descriptions>

              {/* 处理进度 */}
              <Card title="处理进度" size="small">
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <Text strong>工单已提交</Text>
                          <br />
                          <Text style={{ color: 'var(--text-tertiary)' }}>
                            {selectedTicket.createTime}
                          </Text>
                        </div>
                      ),
                    },
                    ...(selectedTicket.status !== 'pending'
                      ? [
                          {
                            color: 'orange',
                            children: (
                              <div>
                                <Text strong>开始处理</Text>
                                <br />
                                <Text style={{ color: 'var(--text-tertiary)' }}>
                                  {selectedTicket.updateTime}
                                </Text>
                                {selectedTicket.response && (
                                  <>
                                    <br />
                                    <Text>{selectedTicket.response}</Text>
                                  </>
                                )}
                              </div>
                            ),
                          },
                        ]
                      : []),
                    ...(selectedTicket.status === 'resolved'
                      ? [
                          {
                            color: 'green',
                            children: (
                              <div>
                                <Text strong>问题已解决</Text>
                                <br />
                                <Text style={{ color: 'var(--text-tertiary)' }}>
                                  {selectedTicket.updateTime}
                                </Text>
                              </div>
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              </Card>
            </Space>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default TicketList;
