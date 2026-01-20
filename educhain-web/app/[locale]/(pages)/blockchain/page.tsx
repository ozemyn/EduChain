'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import './page.css';

interface BlockchainStats {
  totalBlocks: number;
  totalTransactions: number;
  totalCertificates: number;
  averageBlockTime: number;
}

interface Block {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  transactionCount: number;
  miner: string;
}

export default function BlockchainExplorerPage() {
  const content = useIntlayer('blockchain-explorer-page');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'blocks' | 'search'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'block' | 'transaction' | 'certificate'>('block');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: 调用实际API
      // 模拟数据
      setTimeout(() => {
        setStats({
          totalBlocks: 12567,
          totalTransactions: 45892,
          totalCertificates: 8934,
          averageBlockTime: 15.3,
        });

        setBlocks(
          Array.from({ length: 10 }, (_, i) => ({
            index: 12567 - i,
            hash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            previousHash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            timestamp: new Date(Date.now() - i * 15000).toISOString(),
            transactionCount: Math.floor(Math.random() * 10) + 1,
            miner: 'EduChain Node ' + (Math.floor(Math.random() * 5) + 1),
          }))
        );

        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Failed to load blockchain data:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // TODO: 实现搜索逻辑
    console.log('Searching:', searchType, searchQuery);
  };

  const handleBlockClick = (blockIndex: number) => {
    router.push(`/blockchain/block/${blockIndex}`);
  };

  return (
    <>
      <Navbar />

      <div className="blockchain-explorer-page">
        {/* 背景装饰 */}
        <div className="blockchain-background">
          <div className="blockchain-blob blockchain-blob-1" />
          <div className="blockchain-blob blockchain-blob-2" />
          <div className="blockchain-blob blockchain-blob-3" />
        </div>

        {/* 英雄区域 */}
        <section className="blockchain-hero-section">
          <div className="hero-container">
            {/* 徽章 */}
            <div className="hero-badge glass-badge motion-scale-in">
              <span>{content.hero.badge.value}</span>
            </div>

            {/* 标题 */}
            <h1 className="hero-title motion-slide-in-up motion-delay-100">
              <span className="hero-title-main text-gradient-cyan">
                {content.hero.title.value}
              </span>
              <span className="hero-title-sub">
                {content.hero.subtitle.value}
              </span>
            </h1>

            {/* 描述 */}
            <p className="hero-description motion-slide-in-up motion-delay-150">
              {content.hero.description.value}
            </p>

            {/* 行动按钮 */}
            <div className="hero-actions motion-slide-in-up motion-delay-200">
              <button 
                onClick={() => {
                  setActiveTab('blocks');
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }}
                className="hero-action-btn hero-action-primary motion-hover-lift"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {content.hero.exploreButton.value}
              </button>
              <button 
                onClick={() => {
                  setActiveTab('search');
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }}
                className="hero-action-btn hero-action-secondary motion-hover-scale"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {content.hero.searchButton.value}
              </button>
            </div>

            {/* 统计数据 */}
            {!loading && stats && (
              <div className="hero-stats motion-slide-in-up motion-delay-250">
                <div className="stat-item glass-light motion-hover-lift motion-slide-in-up motion-delay-300">
                  <div className="stat-value">{stats.totalBlocks.toLocaleString()}</div>
                  <div className="stat-label">{content.stats.totalBlocks.value}</div>
                </div>
                <div className="stat-item glass-light motion-hover-lift motion-slide-in-up motion-delay-350">
                  <div className="stat-value">{stats.totalTransactions.toLocaleString()}</div>
                  <div className="stat-label">{content.stats.totalTransactions.value}</div>
                </div>
                <div className="stat-item glass-light motion-hover-lift motion-slide-in-up motion-delay-400">
                  <div className="stat-value">{stats.totalCertificates.toLocaleString()}</div>
                  <div className="stat-label">{content.stats.totalCertificates.value}</div>
                </div>
                <div className="stat-item glass-light motion-hover-lift motion-slide-in-up motion-delay-450">
                  <div className="stat-value">{stats.averageBlockTime}s</div>
                  <div className="stat-label">{content.stats.avgBlockTime.value}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="page-content-wide">
          {/* 页面头部 - 移除，已被hero替代 */}

          {/* 标签页 */}
          <div className="blockchain-tabs glass-card">
            <button
              onClick={() => setActiveTab('overview')}
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {content.tabs.overview}
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`tab-btn ${activeTab === 'blocks' ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {content.tabs.blocks}
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {content.tabs.search}
            </button>
          </div>

          {/* 标签页内容 */}
          <div className="tab-content">
            {/* 概览标签 */}
            {activeTab === 'overview' && (
              <div className="overview-section">
                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>{content.loading}</p>
                  </div>
                ) : stats ? (
                  <div className="stats-grid">
                    <div className="stat-card glass-card">
                      <div className="stat-icon blocks">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <div className="stat-label">{content.stats.totalBlocks}</div>
                        <div className="stat-value">{stats.totalBlocks.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="stat-card glass-card">
                      <div className="stat-icon transactions">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <div className="stat-label">{content.stats.totalTransactions}</div>
                        <div className="stat-value">{stats.totalTransactions.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="stat-card glass-card">
                      <div className="stat-icon certificates">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <div className="stat-label">{content.stats.totalCertificates}</div>
                        <div className="stat-value">{stats.totalCertificates.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="stat-card glass-card">
                      <div className="stat-icon time">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <div className="stat-label">{content.stats.avgBlockTime}</div>
                        <div className="stat-value">{stats.averageBlockTime}s</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* 区块列表标签 */}
            {activeTab === 'blocks' && (
              <div className="blocks-section">
                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>{content.loading}</p>
                  </div>
                ) : (
                  <div className="blocks-list">
                    {blocks.map((block) => (
                      <div
                        key={block.index}
                        onClick={() => handleBlockClick(block.index)}
                        className="block-card glass-card motion-hover-lift"
                      >
                        <div className="block-header">
                          <div className="block-index">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>{content.blockLabel} #{block.index}</span>
                          </div>
                          <div className="block-time">
                            {new Date(block.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="block-info">
                          <div className="info-row">
                            <span className="info-label">{content.blockInfo.hash}:</span>
                            <code className="info-value hash">{block.hash}</code>
                          </div>
                          <div className="info-row">
                            <span className="info-label">{content.blockInfo.transactions}:</span>
                            <span className="info-value">{block.transactionCount}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">{content.blockInfo.miner}:</span>
                            <span className="info-value">{block.miner}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 搜索标签 */}
            {activeTab === 'search' && (
              <div className="search-section glass-card">
                <div className="search-header">
                  <h2>{content.search.title}</h2>
                  <p>{content.search.description}</p>
                </div>

                <div className="search-form">
                  <div className="search-type-selector">
                    <button
                      onClick={() => setSearchType('block')}
                      className={`type-btn ${searchType === 'block' ? 'active' : ''}`}
                    >
                      {content.search.types.block}
                    </button>
                    <button
                      onClick={() => setSearchType('transaction')}
                      className={`type-btn ${searchType === 'transaction' ? 'active' : ''}`}
                    >
                      {content.search.types.transaction}
                    </button>
                    <button
                      onClick={() => setSearchType('certificate')}
                      className={`type-btn ${searchType === 'certificate' ? 'active' : ''}`}
                    >
                      {content.search.types.certificate}
                    </button>
                  </div>

                  <div className="search-input-group">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder={String(content.search.placeholder.value || content.search.placeholder)}
                      className="search-input"
                    />
                    <button onClick={handleSearch} className="search-btn glass-button motion-hover-lift">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {content.search.searchBtn}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
