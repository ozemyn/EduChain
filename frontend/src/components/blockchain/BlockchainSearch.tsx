import React, { useState } from 'react';
import { Input, Select, Button, Card, Empty, Spin, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { blockchainService } from '@/services/blockchain';
import type { Block, Transaction } from '@/types/blockchain';
import './BlockchainSearch.css';

const { Search } = Input;
const { Option } = Select;

const BlockchainSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<string>('block');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    block?: Block;
    transaction?: Transaction;
  } | null>(null);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('请输入搜索内容');
      return;
    }

    try {
      setLoading(true);
      const response = await blockchainService.search(value, searchType);
      if (response.success && response.data) {
        const data = response.data as { type: string; data: Block | Transaction | null };
        
        if (data.type === 'block' && data.data) {
          setResults({ block: data.data as Block });
        } else if (data.type === 'transaction' && data.data) {
          setResults({ transaction: data.data as Transaction });
        } else {
          setResults(null);
          message.info('未找到相关结果');
        }
      } else {
        setResults(null);
        message.info('未找到相关结果');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    if (results.block) {
      return (
        <Card className="result-card glass-card" title="区块信息">
          <p>
            <strong>区块索引:</strong> {results.block.index}
          </p>
          <p>
            <strong>区块哈希:</strong> <code>{results.block.hash}</code>
          </p>
          <p>
            <strong>时间戳:</strong>{' '}
            {new Date(results.block.timestamp).toLocaleString()}
          </p>
          <Button
            type="primary"
            onClick={() =>
              navigate(`/blockchain/block/${results.block?.index}`)
            }
          >
            查看详情
          </Button>
        </Card>
      );
    }

    if (results.transaction) {
      return (
        <Card className="result-card glass-card" title="交易信息">
          <p>
            <strong>交易ID:</strong> <code>{results.transaction.id}</code>
          </p>
          <p>
            <strong>类型:</strong> {results.transaction.type}
          </p>
          <p>
            <strong>时间戳:</strong>{' '}
            {new Date(results.transaction.timestamp).toLocaleString()}
          </p>
          <Button
            type="primary"
            onClick={() =>
              navigate(`/blockchain/transaction/${results.transaction?.id}`)
            }
          >
            查看详情
          </Button>
        </Card>
      );
    }

    return <Empty description="未找到相关结果" />;
  };

  return (
    <div className="blockchain-search">
      <Card className="search-card glass-card">
        <div className="search-input-group">
          <Select
            value={searchType}
            onChange={setSearchType}
            style={{ width: 150 }}
            className="search-type-select"
          >
            <Option value="block">区块索引</Option>
            <Option value="transaction">交易ID</Option>
            <Option value="knowledge">知识ID</Option>
          </Select>
          <Search
            placeholder={`请输入${
              searchType === 'block'
                ? '区块索引'
                : searchType === 'transaction'
                  ? '交易ID'
                  : '知识ID'
            }`}
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            loading={loading}
            className="search-input"
          />
        </div>
      </Card>

      <div className="search-results">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
};

export default BlockchainSearch;
