import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  DatePicker,
  Typography,
  Modal,
  Drawer,
  Descriptions,
  Alert,
  Tooltip,
  message,
} from 'antd';
import {
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ClearOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// 日志级别类型
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

// 日志类型
interface SystemLog {
  id: number;
  timestamp: string;
  level: LogLevel;
  logger: string;
  message: string;
  details?: string;
  userId?: number;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  duration?: number;
  stackTrace?: string;
}

// 日志统计类型
interface LogStats {
  total: number;
  info: number;
  warn: number;
  error: number;
  debug: number;
}

const SystemLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [loggerFilter, setLoggerFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [logDetailVisible, setLogDetailVisible] = useState(false);
  const [clearLogsModalVisible, setClearLogsModalVisible] = useState(false);
  const [logStats, setLogStats] = useState<LogStats>({
    total: 0,
    info: 0,
    warn: 0,
    error: 0,
    debug: 0,
  });

  // 加载日志数据
  const loadLogs = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟日志数据
      const mockLogs: SystemLog[] = [
        {
          id: 1,
          timestamp: dayjs()
            .subtract(5, 'minute')
            .format('YYYY-MM-DD HH:mm:ss.SSS'),
          level: 'ERROR',
          logger: 'com.example.educhain.service.FileUploadService',
          message: '文件上传失败: 连接超时',
          details: '尝试上传文件到云存储时发生连接超时错误',
          userId: 123,
          username: 'zhangsan',
          ipAddress: '192.168.1.100',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          requestId: 'req-123456789',
          duration: 5000,
          stackTrace:
            'java.net.SocketTimeoutException: Read timed out\n\tat java.net.SocketInputStream.socketRead0(Native Method)\n\tat java.net.SocketInputStream.socketRead(SocketInputStream.java:116)',
        },
        {
          id: 2,
          timestamp: dayjs()
            .subtract(10, 'minute')
            .format('YYYY-MM-DD HH:mm:ss.SSS'),
          level: 'WARN',
          logger: 'com.example.educhain.security.JwtAuthenticationFilter',
          message: '检测到可疑登录尝试',
          details: '来自IP 192.168.1.200的用户尝试使用无效token访问系统',
          ipAddress: '192.168.1.200',
          userAgent: 'curl/7.68.0',
          requestId: 'req-123456788',
          duration: 100,
        },
        {
          id: 3,
          timestamp: dayjs()
            .subtract(15, 'minute')
            .format('YYYY-MM-DD HH:mm:ss.SSS'),
          level: 'INFO',
          logger: 'com.example.educhain.controller.KnowledgeItemController',
          message: '用户创建知识内容成功',
          details: '用户zhangsan成功创建了标题为"React 18新特性"的知识内容',
          userId: 123,
          username: 'zhangsan',
          ipAddress: '192.168.1.100',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          requestId: 'req-123456787',
          duration: 250,
        },
        {
          id: 4,
          timestamp: dayjs()
            .subtract(20, 'minute')
            .format('YYYY-MM-DD HH:mm:ss.SSS'),
          level: 'DEBUG',
          logger: 'com.example.educhain.service.SearchService',
          message: '执行搜索查询',
          details: '搜索关键词: "React", 返回结果: 25条',
          userId: 456,
          username: 'lisi',
          ipAddress: '192.168.1.101',
          requestId: 'req-123456786',
          duration: 150,
        },
        {
          id: 5,
          timestamp: dayjs()
            .subtract(25, 'minute')
            .format('YYYY-MM-DD HH:mm:ss.SSS'),
          level: 'ERROR',
          logger: 'com.example.educhain.service.NotificationService',
          message: '发送邮件通知失败',
          details: 'SMTP服务器连接失败，无法发送邮件通知',
          requestId: 'req-123456785',
          stackTrace:
            'javax.mail.MessagingException: Could not connect to SMTP host\n\tat com.sun.mail.smtp.SMTPTransport.openServer(SMTPTransport.java:2118)',
        },
      ];

      setLogs(mockLogs);
      setTotal(mockLogs.length);

      // 模拟日志统计
      setLogStats({
        total: 1250,
        info: 800,
        warn: 200,
        error: 150,
        debug: 100,
      });
    } catch (error) {
      console.error('Failed to load logs:', error);
      message.error('加载日志失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadLogs();
  }, [
    currentPage,
    pageSize,
    searchKeyword,
    levelFilter,
    loggerFilter,
    dateRange,
  ]);

  // 查看日志详情
  const handleViewLogDetail = (log: SystemLog) => {
    setSelectedLog(log);
    setLogDetailVisible(true);
  };

  // 导出日志
  const handleExportLogs = () => {
    message.info('导出功能开发中...');
  };

  // 清理日志
  const handleClearLogs = () => {
    setClearLogsModalVisible(true);
  };

  // 确认清理日志
  const handleConfirmClearLogs = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('日志清理成功');
      setClearLogsModalVisible(false);
      loadLogs();
    } catch (error) {
      console.error('Failed to clear logs:', error);
      message.error('清理失败');
    }
  };

  // 日期范围变化处理
  const handleDateRangeChange: RangePickerProps['onChange'] = dates => {
    setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
  };

  // 获取日志级别颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'red';
      case 'WARN':
        return 'orange';
      case 'INFO':
        return 'blue';
      case 'DEBUG':
        return 'default';
      default:
        return 'default';
    }
  };

  // 获取日志级别图标
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'WARN':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'INFO':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'DEBUG':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return null;
    }
  };

  // 表格列定义
  const columns: ColumnsType<SystemLog> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: timestamp => (
        <Text style={{ fontSize: '12px', fontFamily: 'monospace' }}>
          {timestamp}
        </Text>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: level => (
        <Space>
          {getLevelIcon(level)}
          <Tag color={getLevelColor(level)}>{level}</Tag>
        </Space>
      ),
    },
    {
      title: '日志器',
      dataIndex: 'logger',
      key: 'logger',
      width: 200,
      render: logger => (
        <Tooltip title={logger}>
          <Text ellipsis style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            {logger.split('.').pop()}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      render: (message, record) => (
        <div>
          <Text ellipsis style={{ maxWidth: '300px' }}>
            {message}
          </Text>
          {record.username && (
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              用户: {record.username} | IP: {record.ipAddress}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: duration => (duration ? `${duration}ms` : '-'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, log) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewLogDetail(log)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>系统日志</Title>
      </div>

      {/* 日志统计 */}
      <div style={{ marginBottom: '16px' }}>
        <Space size="large">
          <div>
            <Text strong>总计: </Text>
            <Text>{logStats.total.toLocaleString()}</Text>
          </div>
          <div>
            <InfoCircleOutlined
              style={{ color: '#1890ff', marginRight: '4px' }}
            />
            <Text>信息: {logStats.info.toLocaleString()}</Text>
          </div>
          <div>
            <WarningOutlined style={{ color: '#faad14', marginRight: '4px' }} />
            <Text>警告: {logStats.warn.toLocaleString()}</Text>
          </div>
          <div>
            <CloseCircleOutlined
              style={{ color: '#ff4d4f', marginRight: '4px' }}
            />
            <Text>错误: {logStats.error.toLocaleString()}</Text>
          </div>
          <div>
            <CheckCircleOutlined
              style={{ color: '#52c41a', marginRight: '4px' }}
            />
            <Text>调试: {logStats.debug.toLocaleString()}</Text>
          </div>
        </Space>
      </div>

      <Card>
        {/* 搜索和筛选 */}
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Search
              placeholder="搜索日志消息或用户名"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchKeyword}
            />
            <Select
              placeholder="选择日志级别"
              allowClear
              style={{ width: 120 }}
              value={levelFilter}
              onChange={setLevelFilter}
            >
              <Option value="ERROR">错误</Option>
              <Option value="WARN">警告</Option>
              <Option value="INFO">信息</Option>
              <Option value="DEBUG">调试</Option>
            </Select>
            <Select
              placeholder="选择日志器"
              allowClear
              style={{ width: 200 }}
              value={loggerFilter}
              onChange={setLoggerFilter}
            >
              <Option value="FileUploadService">文件上传服务</Option>
              <Option value="JwtAuthenticationFilter">JWT认证过滤器</Option>
              <Option value="KnowledgeItemController">知识内容控制器</Option>
              <Option value="SearchService">搜索服务</Option>
              <Option value="NotificationService">通知服务</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: 350 }}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchKeyword('');
                setLevelFilter('');
                setLoggerFilter('');
                setDateRange(null);
              }}
            >
              清除筛选
            </Button>
          </Space>
        </div>

        {/* 操作按钮 */}
        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadLogs}
              loading={loading}
            >
              刷新
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportLogs}>
              导出日志
            </Button>
            <Button icon={<ClearOutlined />} danger onClick={handleClearLogs}>
              清理日志
            </Button>
          </Space>
        </div>

        {/* 日志表格 */}
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          size="small"
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
              setPageSize(size || 20);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 日志详情抽屉 */}
      <Drawer
        title="日志详情"
        placement="right"
        width={800}
        open={logDetailVisible}
        onClose={() => setLogDetailVisible(false)}
      >
        {selectedLog && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="时间戳">
                <Text style={{ fontFamily: 'monospace' }}>
                  {selectedLog.timestamp}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="日志级别">
                <Space>
                  {getLevelIcon(selectedLog.level)}
                  <Tag color={getLevelColor(selectedLog.level)}>
                    {selectedLog.level}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="日志器">
                <Text style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                  {selectedLog.logger}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="请求ID">
                {selectedLog.requestId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="用户信息">
                {selectedLog.username ? (
                  <div>
                    <div>用户名: {selectedLog.username}</div>
                    <div>用户ID: {selectedLog.userId}</div>
                  </div>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="客户端信息">
                {selectedLog.ipAddress && (
                  <div>
                    <div>IP地址: {selectedLog.ipAddress}</div>
                    {selectedLog.userAgent && (
                      <div style={{ marginTop: '4px' }}>
                        <Text style={{ fontSize: '12px' }}>
                          User-Agent: {selectedLog.userAgent}
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="执行耗时">
                {selectedLog.duration ? `${selectedLog.duration}ms` : '-'}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>日志消息</Title>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}
              >
                {selectedLog.message}
              </div>
            </div>

            {selectedLog.details && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>详细信息</Title>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}
                >
                  {selectedLog.details}
                </div>
              </div>
            )}

            {selectedLog.stackTrace && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>堆栈跟踪</Title>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fff2f0',
                    border: '1px solid #ffccc7',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 清理日志确认模态框 */}
      <Modal
        title="清理日志"
        open={clearLogsModalVisible}
        onOk={handleConfirmClearLogs}
        onCancel={() => setClearLogsModalVisible(false)}
        okText="确认清理"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Alert
          message="警告"
          description="此操作将永久删除所有历史日志数据，无法恢复。请确认是否继续？"
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <div>
          <Text>清理选项:</Text>
          <div style={{ marginTop: '8px' }}>
            <Space direction="vertical">
              <label>
                <input
                  type="radio"
                  name="clearOption"
                  value="all"
                  defaultChecked
                />
                <span style={{ marginLeft: '8px' }}>清理所有日志</span>
              </label>
              <label>
                <input type="radio" name="clearOption" value="old" />
                <span style={{ marginLeft: '8px' }}>只清理30天前的日志</span>
              </label>
              <label>
                <input type="radio" name="clearOption" value="level" />
                <span style={{ marginLeft: '8px' }}>只清理DEBUG级别日志</span>
              </label>
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SystemLogs;
