import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Button, Spin, message, Tag } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { blockchainService } from '@/services/blockchain';
import type { Block, Transaction } from '@/types/blockchain';
import type { ColumnsType } from 'antd/es/table';
import './BlockDetail.css';

const BlockDetail: React.FC = () => {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState<Block | null>(null);

  useEffect(() => {
    if (index) {
      loadBlock(parseInt(index));
    }
  }, [index]);

  const loadBlock = async (blockIndex: number) => {
    try {
      setLoading(true);
      const response = await blockchainService.getBlock(blockIndex);
      if (response.success && response.data) {
        setBlock(response.data);
      }
    } catch {
      message.error('加载区块详情失败');
    } finally {
      setLoading(false);
    }
  };

  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      render: (id: string) => <code className="hash-code">{id}</code>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '知识ID',
      dataIndex: 'knowledgeId',
      key: 'knowledgeId',
      render: (id?: number) => id || '-',
    },
    {
      title: '时间戳',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Transaction) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/blockchain/transaction/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="block-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!block) {
    return (
      <div className="block-detail-empty">
        <p>区块不存在</p>
        <Button onClick={() => navigate('/blockchain')}>返回</Button>
      </div>
    );
  }

  return (
    <div className="block-detail-page animate-fade-in">
      <div className="block-detail-content container">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/blockchain')}
          className="back-button glass-button"
        >
          返回
        </Button>

        <Card className="block-info-card glass-card" title="区块信息">
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item label="区块索引">
              <Tag color="blue">#{block.index}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="时间戳">
              {new Date(block.timestamp).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="区块哈希" span={2}>
              <code className="hash-code">{block.hash}</code>
            </Descriptions.Item>
            <Descriptions.Item label="前一区块哈希" span={2}>
              <code className="hash-code">{block.previousHash}</code>
            </Descriptions.Item>
            {block.merkleRoot && (
              <Descriptions.Item label="Merkle Root" span={2}>
                <code className="hash-code">{block.merkleRoot}</code>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="交易数量">
              {block.transactions?.length || 0}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          className="transactions-card glass-card"
          title="交易列表"
          style={{ marginTop: 16 }}
        >
          <Table
            columns={transactionColumns}
            dataSource={block.transactions}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default BlockDetail;
