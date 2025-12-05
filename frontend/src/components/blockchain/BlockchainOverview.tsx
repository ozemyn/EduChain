import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Spin, message } from 'antd';
import {
  BlockOutlined,
  TransactionOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { blockchainService } from '@/services/blockchain';
import type { BlockchainOverview as OverviewType } from '@/types/blockchain';
import './BlockchainOverview.css';

const BlockchainOverview: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewType | null>(null);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const response = await blockchainService.getOverview();
      if (response.success && response.data) {
        setOverview(response.data);
      }
    } catch {
      message.error('加载概览信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  if (loading && !overview) {
    return (
      <div className="overview-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="blockchain-overview">
      <div className="overview-header">
        <h2>区块链概览</h2>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadOverview}
          loading={loading}
          className="glass-button"
        >
          刷新
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card glass-card">
            <Statistic
              title="总区块数"
              value={overview?.totalBlocks || 0}
              prefix={<BlockOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card glass-card">
            <Statistic
              title="总交易数"
              value={overview?.totalTransactions || 0}
              prefix={<TransactionOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card glass-card">
            <Statistic
              title="最新区块"
              value={overview?.latestBlock?.index || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card glass-card">
            <Statistic
              title="链状态"
              value={overview?.chainValid ? '有效' : '无效'}
              prefix={<CheckCircleOutlined />}
              valueStyle={{
                color: overview?.chainValid ? '#52c41a' : '#ff4d4f',
              }}
            />
          </Card>
        </Col>
      </Row>

      {overview?.latestBlock && (
        <Card
          className="latest-block-card glass-card"
          style={{ marginTop: 16 }}
        >
          <h3>最新区块信息</h3>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <p>
                <strong>区块索引:</strong> {overview.latestBlock.index}
              </p>
            </Col>
            <Col span={24}>
              <p>
                <strong>区块哈希:</strong>{' '}
                <code>{overview.latestBlock.hash}</code>
              </p>
            </Col>
            <Col span={24}>
              <p>
                <strong>时间戳:</strong>{' '}
                {new Date(overview.latestBlock.timestamp).toLocaleString()}
              </p>
            </Col>
            <Col span={24}>
              <p>
                <strong>交易数量:</strong>{' '}
                {overview.latestBlock.transactionsCount}
              </p>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default BlockchainOverview;
