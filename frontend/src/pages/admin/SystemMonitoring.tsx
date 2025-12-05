/* ===================================
   系统监控页面 - System Monitoring Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 实时数据监控
   - 现代化的 iOS 风格
   
   ================================== */

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Progress,
  Button,
  Switch,
  Space,
  Badge,
  Tag,
  Tooltip,
} from 'antd';
import {
  DashboardOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  CloudServerOutlined,
  ApiOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import './SystemMonitoring.css';

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  status: 'healthy' | 'warning' | 'error';
  trend: 'up' | 'down' | 'stable';
}

interface ServiceStatus {
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'warning';
  cpu: string;
  memory: string;
  uptime: string;
}

const SystemMonitoring: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 系统状态概览
  const [systemStatus] = useState({
    overall: 'healthy' as 'healthy' | 'warning' | 'error',
    uptime: '15天 8小时',
    activeUsers: 1234,
    requestsPerMin: 856,
  });

  // 性能指标
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU 使用率',
      value: 45,
      max: 100,
      status: 'healthy',
      trend: 'stable',
    },
    { name: '内存使用', value: 68, max: 100, status: 'warning', trend: 'up' },
    { name: '磁盘使用', value: 72, max: 100, status: 'warning', trend: 'up' },
    { name: '网络流量', value: 35, max: 100, status: 'healthy', trend: 'down' },
  ]);

  // 服务状态
  const [services] = useState<ServiceStatus[]>([
    {
      name: 'Web 服务器',
      description: 'Nginx 主服务',
      status: 'running',
      cpu: '12%',
      memory: '256MB',
      uptime: '15天',
    },
    {
      name: '应用服务',
      description: 'Spring Boot 应用',
      status: 'running',
      cpu: '28%',
      memory: '1.2GB',
      uptime: '15天',
    },
    {
      name: '数据库',
      description: 'PostgreSQL 数据库',
      status: 'running',
      cpu: '15%',
      memory: '512MB',
      uptime: '15天',
    },
    {
      name: '缓存服务',
      description: 'Redis 缓存',
      status: 'warning',
      cpu: '8%',
      memory: '128MB',
      uptime: '2小时',
    },
  ]);

  // 系统告警
  const [alerts] = useState([
    {
      type: 'warning',
      title: '内存使用率偏高',
      message: '当前内存使用率达到 68%，建议关注',
      time: '5分钟前',
    },
    {
      type: 'info',
      title: '系统更新可用',
      message: '检测到新版本 v2.1.0，建议在维护窗口期间更新',
      time: '1小时前',
    },
  ]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30秒刷新一次

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 手动刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // TODO: 实际的数据刷新逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdate(new Date());

      // 模拟数据更新
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: Math.min(
            metric.max,
            Math.max(0, metric.value + (Math.random() - 0.5) * 10)
          ),
        }))
      );
    } finally {
      setRefreshing(false);
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
      case 'stopped':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取进度条颜色
  const getProgressColor = (value: number) => {
    if (value < 60) return '#10b981';
    if (value < 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="system-monitoring-page animate-fade-in">
      <div className="monitoring-content">
        {/* 页面头部 */}
        <div className="monitoring-header glass-card">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">
                <DashboardOutlined className="page-title-icon" />
                系统监控
              </h1>
              <p className="page-subtitle">
                实时监控系统运行状态和性能指标 · 最后更新:{' '}
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="header-actions">
              <Button
                icon={<ReloadOutlined spin={refreshing} />}
                onClick={handleRefresh}
                loading={refreshing}
                className="refresh-button glass-button hover-scale active-scale"
              >
                刷新数据
              </Button>
              <div className="auto-refresh-switch">
                <span className="auto-refresh-label">自动刷新</span>
                <Switch checked={autoRefresh} onChange={setAutoRefresh} />
              </div>
            </div>
          </div>
        </div>

        {/* 系统状态概览 */}
        <div className="status-overview">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="status-card glass-card hover-lift gpu-accelerated">
                <div
                  className={`status-icon-wrapper status-${systemStatus.overall}`}
                >
                  <CheckCircleOutlined />
                </div>
                <div className="status-label">系统状态</div>
                <div className="status-value">
                  <Badge
                    status={getStatusColor(systemStatus.overall)}
                    text="运行正常"
                  />
                </div>
                <div className="status-description">所有核心服务运行正常</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="status-card glass-card hover-lift gpu-accelerated delay-100">
                <div className="status-icon-wrapper status-healthy">
                  <ThunderboltOutlined />
                </div>
                <div className="status-label">运行时间</div>
                <div className="status-value">{systemStatus.uptime}</div>
                <div className="status-description">系统持续稳定运行</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="status-card glass-card hover-lift gpu-accelerated delay-200">
                <div className="status-icon-wrapper status-healthy">
                  <ApiOutlined />
                </div>
                <div className="status-label">活跃用户</div>
                <div className="status-value">
                  {systemStatus.activeUsers.toLocaleString()}
                </div>
                <div className="status-description">当前在线用户数</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="status-card glass-card hover-lift gpu-accelerated delay-300">
                <div className="status-icon-wrapper status-healthy">
                  <CloudServerOutlined />
                </div>
                <div className="status-label">请求速率</div>
                <div className="status-value">
                  {systemStatus.requestsPerMin}/分钟
                </div>
                <div className="status-description">API 请求处理速率</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* 性能指标 */}
        <div className="performance-metrics">
          <div className="metrics-card glass-card">
            <div className="metrics-header">
              <h2 className="metrics-title">性能指标</h2>
              <span className="metrics-time">实时监控</span>
            </div>
            <Row gutter={[16, 16]}>
              {metrics.map((metric, index) => (
                <Col xs={24} sm={12} lg={6} key={metric.name}>
                  <div
                    className={`metric-item animate-fade-in-up delay-${400 + index * 100}`}
                  >
                    <div className="metric-header">
                      <span className="metric-name">{metric.name}</span>
                      <span className="metric-value">
                        {metric.value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="metric-progress">
                      <Progress
                        percent={metric.value}
                        strokeColor={getProgressColor(metric.value)}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                    <div className="metric-footer">
                      <span className="metric-status">
                        <Badge status={getStatusColor(metric.status)} />
                        {metric.status === 'healthy'
                          ? '正常'
                          : metric.status === 'warning'
                            ? '警告'
                            : '异常'}
                      </span>
                      <span className={`metric-trend trend-${metric.trend}`}>
                        {metric.trend === 'up' && <ArrowUpOutlined />}
                        {metric.trend === 'down' && <ArrowDownOutlined />}
                        {metric.trend === 'stable' && '稳定'}
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* 服务状态 */}
        <div className="services-status">
          <div className="services-card glass-card">
            <div className="metrics-header">
              <h2 className="metrics-title">服务状态</h2>
              <Space>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  className="glass-button"
                >
                  刷新
                </Button>
              </Space>
            </div>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {services.map((service, index) => (
                <div
                  key={service.name}
                  className={`service-item animate-fade-in-up delay-${600 + index * 100}`}
                >
                  <div
                    className={`service-status-indicator status-${service.status}`}
                  />
                  <div className="service-info">
                    <div className="service-name">{service.name}</div>
                    <div className="service-description">
                      {service.description}
                    </div>
                  </div>
                  <div className="service-metrics">
                    <div className="service-metric">
                      <div className="service-metric-label">CPU</div>
                      <div className="service-metric-value">{service.cpu}</div>
                    </div>
                    <div className="service-metric">
                      <div className="service-metric-label">内存</div>
                      <div className="service-metric-value">
                        {service.memory}
                      </div>
                    </div>
                    <div className="service-metric">
                      <div className="service-metric-label">运行时间</div>
                      <div className="service-metric-value">
                        {service.uptime}
                      </div>
                    </div>
                  </div>
                  <div className="service-actions">
                    <Tooltip title="重启服务">
                      <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        className="glass-button"
                      />
                    </Tooltip>
                    <Tooltip
                      title={
                        service.status === 'running' ? '停止服务' : '启动服务'
                      }
                    >
                      <Button
                        size="small"
                        icon={
                          service.status === 'running' ? (
                            <PauseCircleOutlined />
                          ) : (
                            <PlayCircleOutlined />
                          )
                        }
                        className="glass-button"
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </Space>
          </div>
        </div>

        {/* 系统告警 */}
        <div className="system-alerts">
          <div className="alerts-card glass-card">
            <div className="metrics-header">
              <h2 className="metrics-title">系统告警</h2>
              <Tag color="processing">{alerts.length} 条未处理</Tag>
            </div>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`alert-item animate-fade-in-up delay-${800 + index * 100}`}
                >
                  <div className={`alert-icon alert-${alert.type}`}>
                    {alert.type === 'error' && <CloseCircleOutlined />}
                    {alert.type === 'warning' && <WarningOutlined />}
                    {alert.type === 'info' && <CheckCircleOutlined />}
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">{alert.time}</div>
                  </div>
                  <div className="alert-actions">
                    <Button size="small" type="link">
                      查看详情
                    </Button>
                    <Button size="small" type="link">
                      忽略
                    </Button>
                  </div>
                </div>
              ))}
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;
