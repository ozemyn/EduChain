import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Spin, message, Tag, Space, Alert } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  SafetyOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { blockchainService } from '@/services/blockchain';
import type { Transaction } from '@/types/blockchain';
import './TransactionDetail.css';

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (id) {
      loadTransaction(id);
    }
  }, [id]);

  const loadTransaction = async (txId: string) => {
    try {
      setLoading(true);
      const response = await blockchainService.getTransaction(txId);
      if (response.success && response.data) {
        setTransaction(response.data);
      } else {
        message.error(response.message || '加载交易详情失败');
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
      message.error('加载交易详情失败');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      KNOWLEDGE_CERTIFICATION: 'blue',
      ACHIEVEMENT: 'green',
      COPYRIGHT: 'purple',
    };
    return typeMap[type] || 'default';
  };

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      KNOWLEDGE_CERTIFICATION: '知识存证',
      ACHIEVEMENT: '成就认证',
      COPYRIGHT: '版权登记',
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="transaction-detail-loading">
        <Spin size="large" tip="加载交易详情..." />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="transaction-detail-empty">
        <Alert
          message="交易不存在"
          description="未找到该交易记录，请检查交易ID是否正确"
          type="warning"
          showIcon
        />
        <Button
          type="primary"
          onClick={() => navigate('/blockchain')}
          style={{ marginTop: 16 }}
        >
          返回区块链浏览器
        </Button>
      </div>
    );
  }

  return (
    <div className="transaction-detail-page animate-fade-in">
      <div className="transaction-detail-content container">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button glass-button"
          style={{ marginBottom: 16 }}
        >
          返回
        </Button>

        {/* 交易状态提示 */}
        {transaction.status === 'confirmed' && (
          <Alert
            message="交易已确认"
            description="此交易已被打包到区块链中，具有不可篡改性"
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 交易基本信息 */}
        <Card
          className="transaction-info-card glass-card"
          title={
            <Space>
              <SafetyOutlined />
              <span>交易信息</span>
            </Space>
          }
          style={{ marginBottom: 16 }}
        >
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined />
                  <span>交易ID</span>
                </Space>
              }
              span={2}
            >
              <code className="hash-code">{transaction.id}</code>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <SafetyOutlined />
                  <span>交易类型</span>
                </Space>
              }
            >
              <Tag color={getTypeColor(transaction.type)} icon={<SafetyOutlined />}>
                {getTypeText(transaction.type)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <CheckCircleOutlined />
                  <span>状态</span>
                </Space>
              }
            >
              <Tag
                color={transaction.status === 'confirmed' ? 'success' : 'warning'}
                icon={
                  transaction.status === 'confirmed' ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              >
                {transaction.status === 'confirmed' ? '已确认' : '待确认'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <ClockCircleOutlined />
                  <span>时间戳</span>
                </Space>
              }
              span={2}
            >
              {new Date(transaction.timestamp).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </Descriptions.Item>

            {transaction.blockIndex !== undefined && (
              <Descriptions.Item
                label={
                  <Space>
                    <BlockOutlined />
                    <span>所在区块</span>
                  </Space>
                }
                span={2}
              >
                <Space>
                  <Tag color="blue">#{transaction.blockIndex}</Tag>
                  <Link to={`/blockchain/block/${transaction.blockIndex}`}>
                    <Button type="link" size="small">
                      查看区块详情
                    </Button>
                  </Link>
                </Space>
              </Descriptions.Item>
            )}

            {transaction.knowledgeId && (
              <Descriptions.Item
                label={
                  <Space>
                    <FileTextOutlined />
                    <span>关联知识</span>
                  </Space>
                }
              >
                <Link to={`/knowledge/${transaction.knowledgeId}`}>
                  <Button type="link" size="small">
                    知识ID: {transaction.knowledgeId}
                  </Button>
                </Link>
              </Descriptions.Item>
            )}

            {transaction.userId && (
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined />
                    <span>用户ID</span>
                  </Space>
                }
              >
                {transaction.userId}
              </Descriptions.Item>
            )}

            <Descriptions.Item
              label={
                <Space>
                  <SafetyOutlined />
                  <span>内容哈希</span>
                </Space>
              }
              span={2}
            >
              <code className="hash-code">{transaction.contentHash}</code>
            </Descriptions.Item>

            {transaction.signature && (
              <Descriptions.Item
                label={
                  <Space>
                    <SafetyOutlined />
                    <span>数字签名</span>
                  </Space>
                }
                span={2}
              >
                <code className="hash-code">{transaction.signature}</code>
              </Descriptions.Item>
            )}

            {transaction.publicKey && (
              <Descriptions.Item
                label={
                  <Space>
                    <SafetyOutlined />
                    <span>公钥</span>
                  </Space>
                }
                span={2}
              >
                <code className="hash-code">{transaction.publicKey}</code>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* 元数据信息 */}
        {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
          <Card
            className="metadata-card glass-card"
            title={
              <Space>
                <FileTextOutlined />
                <span>元数据</span>
              </Space>
            }
          >
            <Descriptions column={1} bordered>
              {Object.entries(transaction.metadata).map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransactionDetail;
