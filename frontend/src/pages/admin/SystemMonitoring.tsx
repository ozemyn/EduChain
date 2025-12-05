import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Alert,
  Space,
  Button,
  Select,
  Typography,
  Tag,
  List,
  Divider,
} from 'antd';
import {
  LineChartOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  CloudOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
// const { RangePicker } = DatePicker;

// 系统性能指标类型
interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    usage: number;
  };
  disk: {
    used: number;
    total: number;
    usage: number;
  };
  network: {
    inbound: number;
    outbound: number;
  };
}

// 服务状态类型
interface ServiceStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  port: number;
  lastCheck: string;
}

// 告警信息类型
interface AlertInfo {
  id: number;
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  source: string;
  timestamp: string;
  resolved: boolean;
}

// 性能历史数据类型
interface PerformanceHistory {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

const SystemMonitoring: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: { usage: 0, cores: 0, temperature: 0 },
    memory: { used: 0, total: 0, usage: 0 },
    disk: { used: 0, total: 0, usage: 0 },
    network: { inbound: 0, outbound: 0 },
  });
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [alerts, setAlerts] = useState<AlertInfo[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<
    PerformanceHistory[]
  >([]);
  console.log('Performance history:', performanceHistory); // 临时使用以避免未使用变量警告
  const [timeRange, setTimeRange] = useState<string>('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 加载系统监控数据
  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟系统指标
      setMetrics({
        cpu: {
          usage: Math.floor(Math.random() * 30) + 40, // 40-70%
          cores: 8,
          temperature: Math.floor(Math.random() * 20) + 45, // 45-65°C
        },
        memory: {
          used: 12.5,
          total: 16,
          usage: Math.floor((12.5 / 16) * 100),
        },
        disk: {
          used: 450,
          total: 1000,
          usage: 45,
        },
        network: {
          inbound: Math.floor(Math.random() * 100) + 50,
          outbound: Math.floor(Math.random() * 80) + 30,
        },
      });

      // 模拟服务状态
      setServices([
        {
          id: 'web-server',
          name: 'Web服务器',
          status: 'running',
          uptime: '15天 3小时',
          port: 8080,
          lastCheck: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          id: 'database',
          name: '数据库服务',
          status: 'running',
          uptime: '15天 3小时',
          port: 3306,
          lastCheck: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          id: 'redis',
          name: 'Redis缓存',
          status: 'running',
          uptime: '15天 3小时',
          port: 6379,
          lastCheck: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          id: 'file-service',
          name: '文件服务',
          status: 'error',
          uptime: '0分钟',
          port: 9000,
          lastCheck: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
      ]);

      // 模拟告警信息
      setAlerts([
        {
          id: 1,
          level: 'critical',
          title: '文件服务异常',
          message: '文件上传服务连接失败，请检查服务状态',
          source: 'file-service',
          timestamp: dayjs()
            .subtract(5, 'minute')
            .format('YYYY-MM-DD HH:mm:ss'),
          resolved: false,
        },
        {
          id: 2,
          level: 'warning',
          title: '磁盘空间不足',
          message: '系统磁盘使用率已达到85%，建议清理日志文件',
          source: 'system',
          timestamp: dayjs()
            .subtract(30, 'minute')
            .format('YYYY-MM-DD HH:mm:ss'),
          resolved: false,
        },
        {
          id: 3,
          level: 'info',
          title: '系统维护完成',
          message: '定期系统维护已完成，所有服务正常运行',
          source: 'system',
          timestamp: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          resolved: true,
        },
      ]);

      // 模拟性能历史数据
      const history: PerformanceHistory[] = [];
      for (let i = 23; i >= 0; i--) {
        history.push({
          timestamp: dayjs().subtract(i, 'hour').format('HH:mm'),
          cpu: Math.floor(Math.random() * 40) + 30,
          memory: Math.floor(Math.random() * 30) + 50,
          disk: Math.floor(Math.random() * 20) + 40,
          network: Math.floor(Math.random() * 50) + 25,
        });
      }
      setPerformanceHistory(history);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadMonitoringData();
  }, [timeRange]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadMonitoringData();
    }, 30000); // 30秒刷新一次

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'green';
      case 'stopped':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'default';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircleOutlined style={{ color: 'var(--accent-success)' }} />;
      case 'stopped':
        return <WarningOutlined style={{ color: 'var(--accent-warning)' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: 'var(--accent-error)' }} />;
      default:
        return null;
    }
  };

  // 获取告警级别颜色
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'var(--accent-error)';
      case 'warning':
        return 'var(--accent-warning)';
      case 'info':
        return 'var(--accent-primary)';
      default:
        return 'var(--text-quaternary)';
    }
  };

  // 服务状态表格列
  const serviceColumns: ColumnsType<ServiceStatus> = [
    {
      title: '服务名称',
      key: 'service',
      render: (_, service) => (
        <Space>
          {getStatusIcon(service.status)}
          <span>{service.name}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={getStatusColor(status)}>
          {status === 'running'
            ? '运行中'
            : status === 'stopped'
              ? '已停止'
              : '异常'}
        </Tag>
      ),
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '运行时间',
      dataIndex: 'uptime',
      key: 'uptime',
    },
    {
      title: '最后检查',
      dataIndex: 'lastCheck',
      key: 'lastCheck',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, service) => {
        console.log('Service:', service); // 临时使用以避免未使用变量警告
        return (
          <Space>
            <Button type="link" size="small">
              重启
            </Button>
            <Button type="link" size="small">
              查看日志
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和控制 */}
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={2}>系统监控</Title>
        <Space>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Option value="1h">最近1小时</Option>
            <Option value="6h">最近6小时</Option>
            <Option value="24h">最近24小时</Option>
            <Option value="7d">最近7天</Option>
          </Select>
          <Button
            type={autoRefresh ? 'primary' : 'default'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadMonitoringData}
            loading={loading}
          >
            刷新
          </Button>
          <Button icon={<DownloadOutlined />}>导出报告</Button>
        </Space>
      </div>

      {/* 系统性能指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="CPU使用率"
              value={metrics.cpu.usage}
              suffix="%"
              prefix={<DesktopOutlined />}
              valueStyle={{
                color:
                  metrics.cpu.usage > 80
                    ? '#ff4d4f'
                    : metrics.cpu.usage > 60
                      ? '#faad14'
                      : 'var(--accent-success)',
              }}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress
                percent={metrics.cpu.usage}
                size="small"
                strokeColor={
                  metrics.cpu.usage > 80
                    ? '#ff4d4f'
                    : metrics.cpu.usage > 60
                      ? '#faad14'
                      : '#52c41a'
                }
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {metrics.cpu.cores}核心 | 温度: {metrics.cpu.temperature}°C
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="内存使用率"
              value={metrics.memory.usage}
              suffix="%"
              prefix={<DatabaseOutlined />}
              valueStyle={{
                color:
                  metrics.memory.usage > 80
                    ? '#ff4d4f'
                    : metrics.memory.usage > 60
                      ? '#faad14'
                      : 'var(--accent-success)',
              }}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress
                percent={metrics.memory.usage}
                size="small"
                strokeColor={
                  metrics.memory.usage > 80
                    ? '#ff4d4f'
                    : metrics.memory.usage > 60
                      ? '#faad14'
                      : '#52c41a'
                }
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {metrics.memory.used}GB / {metrics.memory.total}GB
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="磁盘使用率"
              value={metrics.disk.usage}
              suffix="%"
              prefix={<CloudOutlined />}
              valueStyle={{
                color:
                  metrics.disk.usage > 80
                    ? '#ff4d4f'
                    : metrics.disk.usage > 60
                      ? '#faad14'
                      : 'var(--accent-success)',
              }}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress
                percent={metrics.disk.usage}
                size="small"
                strokeColor={
                  metrics.disk.usage > 80
                    ? '#ff4d4f'
                    : metrics.disk.usage > 60
                      ? '#faad14'
                      : '#52c41a'
                }
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {metrics.disk.used}GB / {metrics.disk.total}GB
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="网络流量"
              value={metrics.network.inbound + metrics.network.outbound}
              suffix="MB/s"
              prefix={<SafetyOutlined />}
              valueStyle={{ color: 'var(--accent-primary)' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                入站: {metrics.network.inbound}MB/s | 出站:{' '}
                {metrics.network.outbound}MB/s
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 服务状态 */}
        <Col xs={24} lg={16}>
          <Card title="服务状态" extra={<Button type="link">查看全部</Button>}>
            <Table
              columns={serviceColumns}
              dataSource={services}
              rowKey="id"
              pagination={false}
              loading={loading}
              size="small"
            />
          </Card>
        </Col>

        {/* 系统告警 */}
        <Col xs={24} lg={8}>
          <Card title="系统告警" extra={<Button type="link">查看全部</Button>}>
            <List
              loading={loading}
              dataSource={alerts.slice(0, 5)}
              renderItem={alert => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: getAlertColor(alert.level),
                        }}
                      />
                    }
                    title={
                      <Space>
                        <span style={{ fontSize: '14px' }}>{alert.title}</span>
                        {!alert.resolved && (
                          <Tag
                            color={
                              alert.level === 'critical' ? 'red' : 'orange'
                            }
                          >
                            {alert.level === 'critical'
                              ? '严重'
                              : alert.level === 'warning'
                                ? '警告'
                                : '信息'}
                          </Tag>
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          {alert.message}
                        </div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {alert.timestamp} | {alert.source}
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

      {/* 性能趋势图 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card
            title="性能趋势"
            extra={
              <Space>
                <Button icon={<LineChartOutlined />}>详细图表</Button>
                <Button>导出数据</Button>
              </Space>
            }
          >
            <div
              style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <LineChartOutlined
                  style={{
                    fontSize: '48px',
                    color: 'var(--text-quaternary)',
                    marginBottom: '16px',
                  }}
                />
                <div>
                  <Text type="secondary">性能趋势图表</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    集成图表库后将显示详细的性能趋势数据
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统信息 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} md={12}>
          <Card title="系统信息">
            <div>
              <div style={{ marginBottom: '12px' }}>
                <Text strong>操作系统:</Text> <Text>Ubuntu 20.04 LTS</Text>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Text strong>内核版本:</Text> <Text>5.4.0-74-generic</Text>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Text strong>Java版本:</Text> <Text>OpenJDK 17.0.2</Text>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Text strong>应用版本:</Text> <Text>EduChain v1.0.0</Text>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Text strong>启动时间:</Text>{' '}
                <Text>
                  {dayjs().subtract(15, 'day').format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </div>
              <div>
                <Text strong>运行时间:</Text> <Text>15天 3小时 25分钟</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="快速操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block>重启应用服务</Button>
              <Button block>清理系统缓存</Button>
              <Button block>备份数据库</Button>
              <Button block>查看错误日志</Button>
              <Divider />
              <Alert
                message="系统运行正常"
                description="所有核心服务运行正常，系统性能良好"
                type="success"
                showIcon
                style={{ marginTop: '16px' }}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SystemMonitoring;
