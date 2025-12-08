/* ===================================
   管理员仪表盘页面 - Admin Dashboard Page
   ===================================
   
   使用统一的服务层，自动适配mock和生产环境
   现代化设计，完整响应式支持
   
   ================================== */

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Statistic,
  Card,
  Table,
  List,
  Avatar,
  Tag,
  Progress,
  Button,
  Space,
  Typography,
  Select,
  DatePicker,
  message,
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  TrophyOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  LineChartOutlined,
  CommentOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RangePickerProps } from 'antd/es/date-picker';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ROUTES } from '@/constants/routes';
import {
  adminService,
  type DashboardStats,
  type PopularContent,
  type ActiveUser,
  type SystemAlert,
  type SystemMetrics,
} from '@/services/admin';
import './AdminDashboard.css';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 管理仪表盘页面组件
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [timeRange, setTimeRange] = useState<string>('7d');

  // 加载仪表盘数据
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 并行加载所有数据
      const [
        statsResponse,
        popularContentResponse,
        activeUsersResponse,
        systemAlertsResponse,
        systemMetricsResponse,
      ] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPopularContent(5),
        adminService.getActiveUsers(5),
        adminService.getSystemAlerts(false), // 只获取未处理的告警
        adminService.getSystemMetrics(),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (popularContentResponse.success) {
        setPopularContent(popularContentResponse.data);
      }

      if (activeUsersResponse.success) {
        setActiveUsers(activeUsersResponse.data);
      }

      if (systemAlertsResponse.success) {
        setSystemAlerts(systemAlertsResponse.data);
      }

      if (systemMetricsResponse.success) {
        setSystemMetrics(systemMetricsResponse.data);
      }
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
      message.error('加载仪表盘数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadDashboardData();
  }, [dateRange, timeRange]);

  // 热门内容表格列定义
  const popularContentColumns: ColumnsType<PopularContent> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: PopularContent) => (
        <Text
          strong
          className="content-title hover-scale"
          onClick={() => navigate(`/knowledge/${record.id}`)}
          style={{ cursor: 'pointer' }}
        >
          {title}
        </Text>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (author: string, record: PopularContent) => (
        <Text
          className="hover-scale"
          onClick={() => navigate(`/users/${record.authorId}`)}
          style={{ cursor: 'pointer', color: 'var(--primary-600)' }}
        >
          {author}
        </Text>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => (
        <Space>
          <EyeOutlined />
          {views.toLocaleString()}
        </Space>
      ),
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes: number) => (
        <Space>
          <HeartOutlined />
          {likes.toLocaleString()}
        </Space>
      ),
    },
    {
      title: '评论数',
      dataIndex: 'comments',
      key: 'comments',
      render: (comments: number) => (
        <Space>
          <CommentOutlined />
          {comments.toLocaleString()}
        </Space>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  // 时间范围变化处理
  const handleDateRangeChange: RangePickerProps['onChange'] = dates => {
    if (dates) {
      setDateRange([dates[0]!, dates[1]!]);
    }
  };

  // 时间范围快捷选择
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    const now = dayjs();
    let startDate = now;

    switch (value) {
      case '1d':
        startDate = now.subtract(1, 'day');
        break;
      case '7d':
        startDate = now.subtract(7, 'day');
        break;
      case '30d':
        startDate = now.subtract(30, 'day');
        break;
      case '90d':
        startDate = now.subtract(90, 'day');
        break;
      default:
        startDate = now.subtract(7, 'day');
    }

    setDateRange([startDate, now]);
  };

  // 处理告警解决
  const handleResolveAlert = async (alertId: number) => {
    try {
      const response = await adminService.resolveAlert(alertId);
      if (response.success) {
        setSystemAlerts(prev =>
          prev.map(alert =>
            alert.id === alertId ? { ...alert, resolved: true } : alert
          )
        );
        message.success('告警已标记为已处理');
      }
    } catch (error) {
      console.error('处理告警失败:', error);
      message.error('处理告警失败');
    }
  };

  // 获取告警图标
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <ExclamationCircleOutlined style={{ color: 'var(--accent-error)' }} />
        );
      case 'warning':
        return <WarningOutlined style={{ color: 'var(--accent-warning)' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: 'var(--accent-info)' }} />;
      case 'success':
        return (
          <CheckCircleOutlined style={{ color: 'var(--accent-success)' }} />
        );
      default:
        return <InfoCircleOutlined />;
    }
  };

  return (
    <div className="admin-dashboard-page animate-fade-in">
      <div className="dashboard-content container">
        {/* 页面头部 */}
        <header className="dashboard-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <Title level={2} className="page-title gradient-text">
                <TrophyOutlined />
                管理仪表盘
              </Title>
              <Text className="page-subtitle">系统概览与数据统计</Text>
            </div>
            <div className="header-actions">
              <Space>
                <Select
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  style={{ width: 120 }}
                  className="time-select"
                >
                  <Option value="1d">今天</Option>
                  <Option value="7d">最近7天</Option>
                  <Option value="30d">最近30天</Option>
                  <Option value="90d">最近90天</Option>
                </Select>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  format="YYYY-MM-DD"
                  className="date-picker"
                />
                <Button
                  type="primary"
                  icon={<LineChartOutlined />}
                  className="glass-button glass-strong hover-lift active-scale"
                >
                  生成报表
                </Button>
              </Space>
            </div>
          </div>
        </header>

        {/* 统计卡片 */}
        <Row
          gutter={[16, 16]}
          className="stats-section animate-fade-in-up delay-100"
        >
          <Col xs={24} sm={12} lg={6}>
            <div className="stat-card glass-card hover-lift">
              <Statistic
                title="总用户数"
                value={stats?.totalUsers || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: 'var(--accent-success)' }}
                loading={loading}
              />
              <div className="stat-footer">
                <Text type="secondary">
                  今日新增: {stats?.newUsersToday || 0}
                </Text>
                <span className="growth-indicator positive">
                  <ArrowUpOutlined />
                  {stats?.userGrowth?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="stat-card glass-card hover-lift">
              <Statistic
                title="总内容数"
                value={stats?.totalKnowledge || 0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: 'var(--accent-primary)' }}
                loading={loading}
              />
              <div className="stat-footer">
                <Text type="secondary">
                  今日新增: {stats?.newKnowledgeToday || 0}
                </Text>
                <span className="growth-indicator positive">
                  <ArrowUpOutlined />
                  {stats?.knowledgeGrowth?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="stat-card glass-card hover-lift">
              <Statistic
                title="总浏览量"
                value={stats?.totalViews || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: 'var(--primary-600)' }}
                loading={loading}
              />
              <div className="stat-footer">
                <Text type="secondary">
                  总点赞: {stats?.totalLikes?.toLocaleString() || 0}
                </Text>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="stat-card glass-card hover-lift">
              <Statistic
                title="活跃用户"
                value={stats?.activeUsers || 0}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: 'var(--primary-500)' }}
                loading={loading}
              />
              <div className="stat-footer">
                <Text type="secondary">
                  总评论: {stats?.totalComments?.toLocaleString() || 0}
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* 主要内容区域 */}
        <Row
          gutter={[16, 16]}
          className="main-content animate-fade-in-up delay-200"
        >
          {/* 热门内容 */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <span>热门内容</span>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  onClick={() => navigate(ROUTES.ADMIN.KNOWLEDGE)}
                  className="hover-scale"
                >
                  查看更多 →
                </Button>
              }
              className="content-card glass-card"
            >
              <Table
                columns={popularContentColumns}
                dataSource={popularContent}
                rowKey="id"
                pagination={false}
                loading={loading}
                size="small"
                className="content-table"
              />
            </Card>
          </Col>

          {/* 活跃用户 */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  <span>活跃用户</span>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  onClick={() => navigate(ROUTES.ADMIN.USERS)}
                  className="hover-scale"
                >
                  查看更多 →
                </Button>
              }
              className="users-card glass-card"
            >
              <List
                loading={loading}
                dataSource={activeUsers}
                renderItem={(user, index) => (
                  <List.Item className="user-item hover-lift">
                    <List.Item.Meta
                      avatar={
                        <div className="user-rank">
                          <span className="rank-number">#{index + 1}</span>
                        </div>
                      }
                      title={
                        <Space>
                          <Avatar
                            src={user.avatarUrl}
                            icon={!user.avatarUrl && <UserOutlined />}
                            size="small"
                          />
                          <span
                            className="user-name hover-scale"
                            onClick={() => navigate(`/users/${user.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            {user.fullName}
                          </span>
                          <Tag color="blue">Lv.{user.level}</Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div className="user-score">
                            贡献分: {user.contributionScore.toLocaleString()}
                          </div>
                          <Text type="secondary" className="user-time">
                            今日活动: {user.todayActions} 次
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* 系统状态 */}
        <Row
          gutter={[16, 16]}
          className="system-status animate-fade-in-up delay-300"
        >
          <Col xs={24} md={8}>
            <Card title="CPU 使用率" className="status-card glass-card">
              <div className="status-content">
                <Progress
                  type="circle"
                  percent={systemMetrics?.cpu.usage || 0}
                  strokeColor="var(--accent-success)"
                  className="status-progress"
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="内存使用率" className="status-card glass-card">
              <div className="status-content">
                <Progress
                  type="circle"
                  percent={systemMetrics?.memory.usage || 0}
                  strokeColor="var(--primary-600)"
                  className="status-progress"
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="存储使用率" className="status-card glass-card">
              <div className="status-content">
                <Progress
                  type="circle"
                  percent={systemMetrics?.storage.usage || 0}
                  strokeColor="var(--accent-warning)"
                  className="status-progress"
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* 系统告警 */}
        <Row
          gutter={[16, 16]}
          className="alerts-section animate-fade-in-up delay-400"
        >
          <Col span={24}>
            <Card
              title={
                <Space>
                  <WarningOutlined />
                  <span>系统告警</span>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  className="hover-scale"
                  onClick={() => navigate(ROUTES.ADMIN.LOGS)}
                >
                  查看全部 →
                </Button>
              }
              className="alerts-card glass-card"
            >
              <List
                loading={loading}
                dataSource={systemAlerts}
                renderItem={alert => (
                  <List.Item
                    className="alert-item hover-lift"
                    actions={[
                      <Button
                        key="resolve"
                        type="link"
                        size="small"
                        disabled={alert.resolved}
                        className="hover-scale"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        {alert.resolved ? '已处理' : '标记已处理'}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={getAlertIcon(alert.type)}
                      title={
                        <Space>
                          <span className="alert-title">{alert.title}</span>
                          <Tag
                            color={
                              alert.priority === 'high'
                                ? 'red'
                                : alert.priority === 'medium'
                                  ? 'orange'
                                  : 'blue'
                            }
                          >
                            {alert.priority === 'high'
                              ? '高'
                              : alert.priority === 'medium'
                                ? '中'
                                : '低'}
                          </Tag>
                          {alert.resolved && <Tag color="green">已处理</Tag>}
                        </Space>
                      }
                      description={
                        <div>
                          <div className="alert-message">{alert.message}</div>
                          <Text type="secondary" className="alert-time">
                            {dayjs(alert.createdAt).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
