import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { blockchainService } from '@/services/blockchain';
import type { Block, Transaction } from '@/types/blockchain';
import type { ColumnsType } from 'antd/es/table';
import './BlockList.css';

const BlockList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadBlocks = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await blockchainService.getBlocks({
        page: page - 1,
        size: pageSize,
        sort: 'index,desc',
      });
      if (response.success && response.data) {
        setBlocks(response.data.content);
        setPagination({
          current: page,
          pageSize,
          total: response.data.totalElements,
        });
      }
    } catch {
      message.error('加载区块列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const columns: ColumnsType<Block> = [
    {
      title: '区块索引',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (index: number) => <Tag color="blue">#{index}</Tag>,
    },
    {
      title: '时间戳',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '交易数',
      dataIndex: 'transactions',
      key: 'transactionsCount',
      width: 100,
      render: (transactions: Transaction[]) => transactions?.length || 0,
    },
    {
      title: '区块哈希',
      dataIndex: 'hash',
      key: 'hash',
      ellipsis: true,
      render: (hash: string) => <code className="hash-code">{hash}</code>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Block) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/blockchain/block/${record.index}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="block-list">
      <Table
        columns={columns}
        dataSource={blocks}
        rowKey="index"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 个区块`,
          onChange: loadBlocks,
        }}
        className="block-table"
      />
    </div>
  );
};

export default BlockList;
