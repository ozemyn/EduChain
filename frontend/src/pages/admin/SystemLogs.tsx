/* ===================================
   系统日志页面 - System Logs Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 日志筛选和搜索
   - 实时日志流
   - 现代化的 iOS 风格
   
   ================================== */

import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Drawer,
  Pagination,
  Switch,
} from 'antd';
import type { Dayjs } from 'dayjs';
import {
  FileTextOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ClearOutlined,
  EyeOutlined,
  CopyOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  BugOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import './SystemLogs.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface LogEntry {
  id: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  timestamp: string;
  source: string;
  user?: string;
  ip?: string;
  details?: Record<string, unknown>;
}

const SystemLogs: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [logLevel, setLogLevel] = useState<string>('all');
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const realtimeConsoleRef = useRef<HTMLDivElement>(null);

  // 模拟日志数据
  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      level: 'error',
      message: '数据库连接失败: Connection timeout after 30000ms',
      timestamp: '2024-12-05 14:32:15',
      source: 'DatabaseService',
      user: 'system',
      ip: '192.168.1.100',
      details: {
        errorCode: 'DB_TIMEOUT',
        database: 'educhain_main',
        retryCount: 3,
      },
    },
    {
      id: '2',
      level: 'warning',
      message: 'API 响应时间超过阈值: 2500ms > 2000ms',
      timestamp: '2024-12-05 14:30:42',
      source: 'APIGateway',
      user: 'user_1234',
      ip: '192.168.1.105',
      details: {
        endpoint: '/api/knowledge/list',
        responseTime: 2500,
        threshold: 2000,
      },
    },
    {
      id: '3',
      level: 'info',
      message: '用户登录成功',
      timestamp: '2024-12-05 14:28:30',
      source: 'AuthService',
      user: 'admin',
      ip: '192.168.1.101',
      details: {
        loginMethod: 'password',
        sessionId: 'sess_abc123',
      },
    },
    {
      id: '4',
      level: 'debug',
      message: '缓存命中: knowledge_list_page_1',
      timestamp: '2024-12-05 14:25:18',
      source: 'CacheService',
      details: {
        cacheKey: 'knowledge_list_page_1',
        ttl: 300,
      },
    },
  ]);

  // 日志统计
  const [stats] = useState({
    total: 15234,
    error: 45,
    warning: 128,
    info: 14892,
  });

  // 实时日志
  const [realtimeLogs, setRealtimeLogs] = useState<string[]>([
    '[14:32:15] INFO - System started successfully',
    '[14:32:16] DEBUG - Loading configuration from config.yml',
    '[14:32:17] INFO - Database connection established',
  ]);

  // 实时日志模拟
  useEffect(() => {
    if (!realtimeEnabled) return;

    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] ${
        ['INFO', 'DEBUG', 'WARNING'][Math.floor(Math.random() * 3)]
      } - ${['Request processed', 'Cache updated', 'User action logged'][Math.floor(Math.random() * 3)]}`;

      setRealtimeLogs(prev => [...prev, newLog].slice(-100)); // 保留最近100条

      // 自动滚动到底部
      if (realtimeConsoleRef.current) {
        realtimeConsoleRef.current.scrollTop =
          realtimeConsoleRef.current.scrollHeight;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [realtimeEnabled]);

  // 搜索和筛选
  const handleSearch = () => {
    setLoading(true);
    // TODO: 实际的搜索逻辑
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 重置筛选
  const handleReset = () => {
    setSearchText('');
    setLogLevel('all');
    setDateRange(null);
    setCurrentPage(1);
  };

  // 导出日志
  const handleExport = () => {
    // TODO: 实现日志导出功能
    console.log('Exporting logs...');
  };

  // 清空日志
  const handleClear = () => {
    // TODO: 实现清空日志功能
    console.log('Clearing logs...');
  };

  // 查看日志详情
  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log);
    setDrawerVisible(true);
  };

  // 复制日志
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 获取日志级别图标
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <CloseCircleOutlined />;
      case 'warning':
        return <WarningOutlined />;
      case 'info':
        return <InfoCircleOutlined />;
      case 'debug':
        return <BugOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  // 筛选后的日志
  const filteredLogs = logs.filter(log => {
    if (logLevel !== 'all' && log.level !== logLevel) return false;
    if (
      searchText &&
      !log.message.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;
    return true;
  });

  // 分页后的日志
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="system-logs-page animate-fade-in">
      <div className="logs-content">
        {/* 页面头部 */}
        <div className="logs-header glass-card">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">
                <FileTextOutlined className="page-title-icon" />
                系统日志
              </h1>
              <p className="page-subtitle">
                查看和管理系统运行日志 · 共 {stats.total.toLocaleString()}{' '}
                条记录
              </p>
            </div>
            <div className="header-actions">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                className="glass-button hover-scale active-scale"
              >
                导出日志
              </Button>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                danger
                className="glass-button hover-scale active-scale"
              >
                清空日志
              </Button>
            </div>
          </div>
        </div>

        {/* 日志筛选 */}
        <div className="logs-filters glass-card">
          <div className="filters-row">
            <div className="filter-item">
              <label className="filter-label">搜索关键词</label>
              <Input
                className="filter-input"
                placeholder="搜索日志内容..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </div>
            <div className="filter-item">
              <label className="filter-label">日志级别</label>
              <Select
                className="filter-select"
                value={logLevel}
                onChange={setLogLevel}
                style={{ width: '100%' }}
              >
                <Option value="all">全部</Option>
                <Option value="error">错误</Option>
                <Option value="warning">警告</Option>
                <Option value="info">信息</Option>
                <Option value="debug">调试</Option>
              </Select>
            </div>
            <div className="filter-item">
              <label className="filter-label">时间范围</label>
              <RangePicker
                className="filter-date-picker"
                value={dateRange}
                onChange={setDateRange}
                showTime
                style={{ width: '100%' }}
              />
            </div>
            <div className="filter-actions">
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleSearch}
                loading={loading}
                className="filter-button glass-button glass-strong hover-scale active-scale"
              >
                筛选
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                className="filter-button glass-button hover-scale active-scale"
              >
                重置
              </Button>
            </div>
          </div>
        </div>

        {/* 日志统计 */}
        <div className="logs-stats">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="stat-card glass-card hover-lift gpu-accelerated">
                <div className="stat-icon stat-total">
                  <FileTextOutlined />
                </div>
                <div className="stat-label">总日志数</div>
                <div className="stat-value">{stats.total.toLocaleString()}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="stat-card glass-card hover-lift gpu-accelerated delay-100">
                <div className="stat-icon stat-error">
                  <CloseCircleOutlined />
                </div>
                <div className="stat-label">错误</div>
                <div className="stat-value">{stats.error}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="stat-card glass-card hover-lift gpu-accelerated delay-200">
                <div className="stat-icon stat-warning">
                  <WarningOutlined />
                </div>
                <div className="stat-label">警告</div>
                <div className="stat-value">{stats.warning}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="stat-card glass-card hover-lift gpu-accelerated delay-300">
                <div className="stat-icon stat-info">
                  <InfoCircleOutlined />
                </div>
                <div className="stat-label">信息</div>
                <div className="stat-value">{stats.info.toLocaleString()}</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* 实时日志流 */}
        <div className="realtime-logs glass-card">
          <div className="realtime-header">
            <div className="realtime-title">
              {realtimeEnabled && <div className="realtime-indicator" />}
              实时日志流
            </div>
            <div className="realtime-controls">
              <Switch
                checked={realtimeEnabled}
                onChange={setRealtimeEnabled}
                checkedChildren="开启"
                unCheckedChildren="关闭"
              />
              <Button
                size="small"
                icon={<ClearOutlined />}
                onClick={() => setRealtimeLogs([])}
                className="glass-button"
              >
                清空
              </Button>
            </div>
          </div>
          <div className="realtime-console" ref={realtimeConsoleRef}>
            {realtimeLogs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--text-tertiary)',
                }}
              >
                暂无实时日志
              </div>
            ) : (
              realtimeLogs.map((log, index) => (
                <div key={index} className="realtime-log-line">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 日志列表 */}
        <div className="logs-list glass-card">
          <div className="logs-list-header">
            <h2 className="logs-list-title">日志记录</h2>
            <div className="logs-list-actions">
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleSearch}
                className="glass-button"
              >
                刷新
              </Button>
            </div>
          </div>

          {paginatedLogs.length === 0 ? (
            <div className="logs-empty">
              <div className="logs-empty-icon">
                <FileTextOutlined />
              </div>
              <div className="logs-empty-title">暂无日志记录</div>
              <div className="logs-empty-description">
                尝试调整筛选条件或等待新的日志生成
              </div>
            </div>
          ) : (
            <>
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="small"
              >
                {paginatedLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className={`log-item log-${log.level} animate-fade-in-up delay-${index * 50}`}
                  >
                    <div className="log-header">
                      <Tag className={`log-level-badge level-${log.level}`}>
                        {log.level}
                      </Tag>
                      <span className="log-time">
                        <ClockCircleOutlined /> {log.timestamp}
                      </span>
                    </div>
                    <div className="log-message">{log.message}</div>
                    <div className="log-details">
                      <div className="log-detail-item">
                        <span className="log-detail-label">来源:</span>
                        <span className="log-detail-value">{log.source}</span>
                      </div>
                      {log.user && (
                        <div className="log-detail-item">
                          <span className="log-detail-label">用户:</span>
                          <span className="log-detail-value">{log.user}</span>
                        </div>
                      )}
                      {log.ip && (
                        <div className="log-detail-item">
                          <span className="log-detail-label">IP:</span>
                          <span className="log-detail-value">{log.ip}</span>
                        </div>
                      )}
                    </div>
                    <div className="log-actions">
                      <Button
                        size="small"
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(log)}
                        className="log-action-button"
                      >
                        查看详情
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(log.message)}
                        className="log-action-button"
                      >
                        复制
                      </Button>
                    </div>
                  </div>
                ))}
              </Space>

              {/* 分页 */}
              <div className="logs-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredLogs.length}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showTotal={total => `共 ${total} 条`}
                />
              </div>
            </>
          )}
        </div>

        {/* 日志详情抽屉 */}
        <Drawer
          title="日志详情"
          placement="right"
          width={600}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          className="log-detail-drawer"
        >
          {selectedLog && (
            <div className="log-detail-content">
              <div className="log-detail-section">
                <h3 className="log-detail-section-title">
                  {getLevelIcon(selectedLog.level)} 基本信息
                </h3>
                <table className="log-detail-table">
                  <tbody>
                    <tr>
                      <td>日志级别</td>
                      <td>
                        <Tag
                          className={`log-level-badge level-${selectedLog.level}`}
                        >
                          {selectedLog.level}
                        </Tag>
                      </td>
                    </tr>
                    <tr>
                      <td>时间戳</td>
                      <td>{selectedLog.timestamp}</td>
                    </tr>
                    <tr>
                      <td>来源</td>
                      <td>{selectedLog.source}</td>
                    </tr>
                    {selectedLog.user && (
                      <tr>
                        <td>用户</td>
                        <td>{selectedLog.user}</td>
                      </tr>
                    )}
                    {selectedLog.ip && (
                      <tr>
                        <td>IP 地址</td>
                        <td>{selectedLog.ip}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="log-detail-section">
                <h3 className="log-detail-section-title">日志消息</h3>
                <div className="log-detail-code">{selectedLog.message}</div>
              </div>

              {selectedLog.details && (
                <div className="log-detail-section">
                  <h3 className="log-detail-section-title">详细信息</h3>
                  <div className="log-detail-code">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default SystemLogs;
