/* ===================================
   管理仪表盘页面 - Admin Dashboard Page
   ===================================
   
   完整功能的管理后台仪表盘
   使用全局样式系统，完整响应式设计
   
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
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  LikeOutlined,
  TrophyOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  LineChartOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RangePickerProps } from 'antd/es/date-picker';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './AdminDashboard.css';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 统计数据类型
interface DashboardStats {
  totalUsers: number;
  totalKnowledge: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  activeUsers: number;
  newUsersToday: number;
  newKnowledgeToday: number;
  userGrowth: number;
  knowledgeGrowth: number;
}

// 热门内容类型
interface PopularContent {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
}

// 活跃用户类型
interface ActiveUser {
  id: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  level: number;
  contributionScore: number;
  lastActiveAt: string;
}

// 系统告警类型
interface SystemAlert {
  id: number;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}

/**
 * 管理仪表盘页面组件
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalKnowledge: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    activeUsers: 0,
    newUsersToday: 0,
    newKnowledgeToday: 0,
    userGrowth: 0,
    knowledgeGrowth: 0,
  });
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [timeRange, setTimeRange] = useState<string>('7d');

  // 加载仪表盘数据
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟统计数据
      setStats({
        totalUsers: 1234,
        totalKnowledge: 5678,
        totalViews: 123456,
        totalLikes: 23456,
        totalComments: 12345,
        activeUsers: 456,
        newUsersToday: 23,
        newKnowledgeToday: 45,
        userGrowth: 12.5,
        knowledgeGrowth: 8.3,
      });

      // 模拟热门内容
      setPopularContent([
        {
          id: 1,
          title: 'React 18 新特性详解',
          author: '张三',
          views: 1234,
          likes: 234,
          comments: 45,
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          title: 'TypeScript 高级类型应用',
          author: '李四',
          views: 987,
          likes: 156,
          comments: 32,
          createdAt: '2024-01-14',
        },
        {
          id: 3,
          title: 'Vue 3 Composition API 实践',
          author: '王五',
          views: 876,
          likes: 123,
          comments: 28,
          createdAt: '2024-01-13',
        },
      ]);

      // 模拟活跃用户
      setActiveUsers([
        {
          id: 1,
          username: 'zhangsan',
          fullName: '张三',
          avatarUrl: undefined,
          level: 5,
          contributionScore: 1234,
          lastActiveAt: '2024-01-15 14:30:00',
        },
        {
          id: 2,
          username: 'lisi',
          fullName: '李四',
          avatarUrl: undefined,
          level: 4,
          contributionScore: 987,
          lastActiveAt: '2024-01-15 13:45:00',
        },
        {
          id: 3,
          username: 'wangwu',
          fullName: '王五',
          avatarUrl: undefined,
          level: 3,
          contributionScore: 756,
          lastActiveAt: '2024-01-15 12:20:00',
        },
      ]);

      // 模拟系统告警
      setSystemAlerts([
        {
          id: 1,
          type: 'warning',
          title: '存储空间不足',
          message: '系统存储空间使用率已达到85%，请及时清理',
          createdAt: '2024-01-15 10:30:00',
          resolved: false,
        },
        {
          id: 2,
          type: 'info',
          title: '系统维护通知',
          message: '系统将于今晚23:00-01:00进行维护',
          createdAt: '2024-01-15 09:00:00',
          resolved: false,
        },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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
      render: (title: string) => (
        <Text strong className="content-title hover-scale">
          {title}
        </Text>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
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
          <LikeOutlined />
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

  return (
    <div className="admin-dashboard-page animate-fade-in">
      <div className="dashboard-content container">
        {/* 页面头部 */}
        <header className="dashboard-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <TrophyOutlined />
                管理仪表盘
              </h1>
              <p className="page-subtitle">系统概览与数据统计</p>
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
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: 'var(--accent-success)' }}
              />
              <div className="stat-footer">
                <Text type="secondary">今日新增: {stats.newUsersToday}</Text>
                <span className="growth-indicator positive">
                  <ArrowUpOutlined />
                  {stats.userGrowth}%
                </span>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="stat-card glass-card hover-lift">
              <Statistic
                title="总内容数"
                value={stats.totalKnowledge}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: 'var(--accent-primary)' }}
              />
              <div className="stat-footer">
                <Text type="secondary">
                  今日新增: {stats.newKnowledgeToday}
                </Text>
                <span className="growth-indicator positive">
                  <ArrowUpOutlined />
                  {stats.knowledgeGrowth}%
                </span>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="stat-card glass-card hover-lift">
              <Statistic
                title="总浏览量"
                value={stats.totalViews}
                prefix={<EyeOutlined />}
                valueStyle={{ color: 'var(--primary-600)' }}
              />
              <div className="stat-footer">
                <Text type="secondary">
                  总点赞: {stats.totalLikes.toLocaleString()}
                </Text>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="stat-card glass-card hover-lift">
              <Statistic
                title="活跃用户"
                value={stats.activeUsers}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: 'var(--primary-500)' }}
              />
              <div className="stat-footer">
                <Text type="secondary">
                  总评论: {stats.totalComments.toLocaleString()}
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
                  onClick={() => navigate('/admin/content')}
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
                  onClick={() => navigate('/admin/users')}
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
                          <span className="user-name">{user.fullName}</span>
                          <Tag color="blue">Lv.{user.level}</Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div className="user-score">
                            贡献分: {user.contributionScore.toLocaleString()}
                          </div>
                          <Text type="secondary" className="user-time">
                            最后活跃: {user.lastActiveAt}
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
                  percent={65}
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
                  percent={78}
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
                  percent={85}
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
                <Button type="link" className="hover-scale">
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
                      >
                        {alert.resolved ? '已处理' : '标记已处理'}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <WarningOutlined
                          className={`alert-icon ${alert.type}`}
                        />
                      }
                      title={<span className="alert-title">{alert.title}</span>}
                      description={
                        <div>
                          <div className="alert-message">{alert.message}</div>
                          <Text type="secondary" className="alert-time">
                            {alert.createdAt}
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
