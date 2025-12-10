/* ===================================
   交易详情页面组件 - Transaction Detail Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 深色/浅色模式支持
   - 单列布局显示
   - 玻璃态效果
   
   ================================== */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Spin,
  message,
  Tag,
  Space,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { blockchainService } from '@/services/blockchain';
import type { Transaction } from '@/types/blockchain';
import './TransactionDetail.css';

/**
 * 交易详情页面组件
 */
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

  // 加载状态
  if (loading) {
    return (
      <div className="transaction-detail-page animate-fade-in">
        {/* 背景装饰 */}
        <div className="detail-background">
          <div className="detail-blob detail-blob-1" />
          <div className="detail-blob detail-blob-2" />
        </div>

        <div className="detail-content container">
          <div className="detail-loading glass-card">
            <Spin size="large" />
            <p>加载交易详情中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 交易不存在
  if (!transaction) {
    return (
      <div className="transaction-detail-page animate-fade-in">
        {/* 背景装饰 */}
        <div className="detail-background">
          <div className="detail-blob detail-blob-1" />
          <div className="detail-blob detail-blob-2" />
        </div>

        <div className="detail-content container">
          <div className="detail-error glass-card">
            <Alert
              message="交易不存在"
              description="未找到该交易记录，请检查交易ID是否正确"
              type="warning"
              showIcon
              className="glass-alert"
            />
            <Button
              type="primary"
              onClick={() => navigate('/blockchain')}
              className="glass-button glass-strong hover-lift active-scale"
              size="large"
            >
              返回区块链浏览器
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-detail-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="detail-background">
        <div className="detail-blob detail-blob-1" />
        <div className="detail-blob detail-blob-2" />
      </div>

      <div className="detail-content container">
        {/* 返回按钮 */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button glass-button hover-scale active-scale animate-fade-in-up"
          size="large"
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
            className="status-alert glass-alert animate-fade-in-up delay-100"
          />
        )}

        {/* 交易基本信息 */}
        <Card
          className="transaction-info-card glass-card animate-fade-in-up delay-200"
          title={
            <Space>
              <SafetyOutlined />
              <span>交易信息</span>
            </Space>
          }
        >
          <Descriptions
            column={1}
            bordered
            className="transaction-descriptions"
          >
            <Descriptions.Item label="交易ID">
              <code className="hash-code">{transaction.id}</code>
            </Descriptions.Item>

            <Descriptions.Item label="交易类型">
              <Tag
                color={getTypeColor(transaction.type)}
                icon={<SafetyOutlined />}
                className="type-tag"
              >
                {getTypeText(transaction.type)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="状态">
              <Tag
                color={
                  transaction.status === 'confirmed' ? 'success' : 'warning'
                }
                icon={
                  transaction.status === 'confirmed' ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
                className="status-tag"
              >
                {transaction.status === 'confirmed' ? '已确认' : '待确认'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="时间戳">
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
              <Descriptions.Item label="所在区块">
                <Space>
                  <Tag color="blue" className="block-tag">
                    #{transaction.blockIndex}
                  </Tag>
                  <Link to={`/blockchain/block/${transaction.blockIndex}`}>
                    <Button
                      type="link"
                      size="small"
                      className="link-button hover-scale"
                    >
                      查看区块详情
                    </Button>
                  </Link>
                </Space>
              </Descriptions.Item>
            )}

            {transaction.knowledgeId && (
              <Descriptions.Item label="关联知识">
                <Link to={`/knowledge/${transaction.knowledgeId}`}>
                  <Button
                    type="link"
                    size="small"
                    className="link-button hover-scale"
                  >
                    知识ID: {transaction.knowledgeId}
                  </Button>
                </Link>
              </Descriptions.Item>
            )}

            {transaction.userId && (
              <Descriptions.Item label="用户ID">
                {transaction.userId}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="内容哈希">
              <code className="hash-code">{transaction.contentHash}</code>
            </Descriptions.Item>

            {transaction.signature && (
              <Descriptions.Item label="数字签名">
                <code className="hash-code">{transaction.signature}</code>
              </Descriptions.Item>
            )}

            {transaction.publicKey && (
              <Descriptions.Item label="公钥">
                <code className="hash-code">{transaction.publicKey}</code>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* 元数据信息 */}
        {transaction.metadata &&
          Object.keys(transaction.metadata).length > 0 && (
            <Card
              className="metadata-card glass-card animate-fade-in-up delay-300"
              title={
                <Space>
                  <FileTextOutlined />
                  <span>元数据</span>
                </Space>
              }
            >
              <Descriptions
                column={1}
                bordered
                className="metadata-descriptions"
              >
                {Object.entries(transaction.metadata).map(([key, value]) => {
                  // 字段名中英文映射
                  const fieldNameMap: Record<string, string> = {
                    title: '标题',
                    author: '作者',
                    authorId: '作者ID',
                    category: '分类',
                    tags: '标签',
                    contentType: '内容类型',
                    contentLength: '内容长度',
                    version: '版本',
                    language: '语言',
                    certificationTime: '存证时间',
                    certificationReason: '存证原因',
                    ipfsHash: 'IPFS哈希',
                    fileSize: '文件大小',
                    mimeType: 'MIME类型',
                  };

                  const chineseLabel = fieldNameMap[key] || key;

                  return (
                    <Descriptions.Item key={key} label={chineseLabel}>
                      <span className="metadata-value">
                        {typeof value === 'object'
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </span>
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            </Card>
          )}
      </div>
    </div>
  );
};

export default TransactionDetail;
