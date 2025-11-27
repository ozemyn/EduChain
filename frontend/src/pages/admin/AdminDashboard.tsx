import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  List,
  Avatar,
  Tag,
  Progress,
  Typography,
  Space,
  Button,
  DatePicker,
  Select,
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  TrophyOutlined,
  WarningOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

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

const AdminDashboard: React.FC = () => {
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
  });
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [timeRange, setTimeRange] = useState<string>('7d');

  // 模拟数据加载
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // 模拟API调用
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

    loadDashboardData();
  }, [dateRange, timeRange]);

  // 热门内容表格列定义
  const popularContentColumns: ColumnsType<PopularContent> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <Text strong style={{ color: '#1890ff', cursor: 'pointer' }}>
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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>管理后台</Title>
        <Space style={{ marginBottom: '16px' }}>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            style={{ width: 120 }}
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
          />
          <Button type="primary" icon={<LineChartOutlined />}>
            生成报表
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">今日新增: {stats.newUsersToday}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总内容数"
              value={stats.totalKnowledge}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">今日新增: {stats.newKnowledgeToday}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={stats.activeUsers}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 热门内容 */}
        <Col xs={24} lg={16}>
          <Card title="热门内容" extra={<Button type="link">查看更多</Button>}>
            <Table
              columns={popularContentColumns}
              dataSource={popularContent}
              rowKey="id"
              pagination={false}
              loading={loading}
              size="small"
            />
          </Card>
        </Col>

        {/* 活跃用户 */}
        <Col xs={24} lg={8}>
          <Card title="活跃用户" extra={<Button type="link">查看更多</Button>}>
            <List
              loading={loading}
              dataSource={activeUsers}
              renderItem={user => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={user.avatarUrl}
                        icon={!user.avatarUrl && <UserOutlined />}
                      />
                    }
                    title={
                      <Space>
                        {user.fullName}
                        <Tag color="blue">Lv.{user.level}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>贡献分: {user.contributionScore}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
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

      {/* 系统告警 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="系统告警" extra={<Button type="link">查看全部</Button>}>
            <List
              loading={loading}
              dataSource={systemAlerts}
              renderItem={alert => (
                <List.Item
                  actions={[
                    <Button
                      key="resolve"
                      type="link"
                      size="small"
                      disabled={alert.resolved}
                    >
                      {alert.resolved ? '已处理' : '标记已处理'}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <WarningOutlined
                        style={{
                          color:
                            alert.type === 'error'
                              ? '#ff4d4f'
                              : alert.type === 'warning'
                                ? '#faad14'
                                : '#1890ff',
                        }}
                      />
                    }
                    title={alert.title}
                    description={
                      <div>
                        <div>{alert.message}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
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

      {/* 系统性能 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} md={8}>
          <Card title="CPU 使用率">
            <Progress
              type="circle"
              percent={65}
              format={percent => `${percent}%`}
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="内存使用率">
            <Progress
              type="circle"
              percent={78}
              format={percent => `${percent}%`}
              strokeColor="#1890ff"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="存储使用率">
            <Progress
              type="circle"
              percent={85}
              format={percent => `${percent}%`}
              strokeColor="#faad14"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
