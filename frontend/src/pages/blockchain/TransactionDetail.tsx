import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Spin, message, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
      }
    } catch {
      message.error('加载交易详情失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="transaction-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="transaction-detail-empty">
        <p>交易不存在</p>
        <Button onClick={() => navigate('/blockchain')}>返回</Button>
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
        >
          返回
        </Button>

        <Card className="transaction-info-card glass-card" title="交易信息">
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item label="交易ID" span={2}>
              <code className="hash-code">{transaction.id}</code>
            </Descriptions.Item>
            <Descriptions.Item label="交易类型">
              <Tag color="blue">{transaction.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="时间戳">
              {new Date(transaction.timestamp).toLocaleString()}
            </Descriptions.Item>
            {transaction.knowledgeId && (
              <Descriptions.Item label="知识ID">
                <Link to={`/knowledge/${transaction.knowledgeId}`}>
                  {transaction.knowledgeId}
                </Link>
              </Descriptions.Item>
            )}
            {transaction.userId && (
              <Descriptions.Item label="用户ID">
                {transaction.userId}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="内容哈希" span={2}>
              <code className="hash-code">{transaction.contentHash}</code>
            </Descriptions.Item>
            {transaction.signature && (
              <Descriptions.Item label="数字签名" span={2}>
                <code className="hash-code">{transaction.signature}</code>
              </Descriptions.Item>
            )}
            {transaction.metadata && (
              <Descriptions.Item label="元数据" span={2}>
                <pre className="metadata-code">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetail;
