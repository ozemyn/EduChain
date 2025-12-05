/* ===================================
   区块链浏览器页面 - Blockchain Explorer Page
   ===================================
   
   特性：
   - 区块链概览展示
   - 区块列表展示
   - 搜索功能
   - 响应式设计
   
   ================================== */

import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
  BlockOutlined,
  SearchOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import {
  BlockchainOverview,
  BlockList,
  BlockchainSearch,
} from '@/components/blockchain';
import './BlockchainExplorer.css';

const { TabPane } = Tabs;

/**
 * 区块链浏览器主页面
 */
const BlockchainExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="blockchain-explorer-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="blockchain-background">
        <div className="blockchain-blob blockchain-blob-1" />
        <div className="blockchain-blob blockchain-blob-2" />
        <div className="blockchain-blob blockchain-blob-3" />
      </div>

      <div className="blockchain-content container">
        {/* ===================================
            页面头部 - Page Header
            ================================== */}
        <header className="blockchain-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <BlockOutlined />
                区块链浏览器
              </h1>
              <p className="page-subtitle">
                探索EduChain区块链，查看所有存证记录
              </p>
            </div>
          </div>
        </header>

        {/* ===================================
            主内容区域 - Main Content
            ================================== */}
        <main className="blockchain-main animate-fade-in-up delay-200">
          <div className="blockchain-tabs-container glass-card">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              className="blockchain-tabs"
            >
              <TabPane
                tab={
                  <span>
                    <BarChartOutlined />
                    概览
                  </span>
                }
                key="overview"
              >
                <div className="tab-content">
                  <BlockchainOverview />
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <BlockOutlined />
                    区块列表
                  </span>
                }
                key="blocks"
              >
                <div className="tab-content">
                  <BlockList />
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <SearchOutlined />
                    搜索
                  </span>
                }
                key="search"
              >
                <div className="tab-content">
                  <BlockchainSearch />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlockchainExplorer;
