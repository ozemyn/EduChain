'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../../../components/layout/Navbar';
import Footer from '../../../../../../components/layout/Footer';
import './page.css';

interface BlockDetail {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  nonce: number;
  difficulty: number;
  miner: string;
  transactionCount: number;
  size: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: string;
  timestamp: string;
  contentHash: string;
  knowledgeId?: number;
  userId?: number;
  status: string;
}

export default function BlockDetailPage() {
  const content = useIntlayer('block-detail-page');
  const params = useParams();
  const router = useRouter();
  const blockId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [block, setBlock] = useState<BlockDetail | null>(null);

  useEffect(() => {
    if (blockId) {
      loadBlockDetail();
    }
  }, [blockId]);

  const loadBlockDetail = async () => {
    try {
      setLoading(true);
      // TODO: 调用实际API
      // 模拟数据
      setTimeout(() => {
        setBlock({
          index: parseInt(blockId),
          hash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          previousHash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toISOString(),
          nonce: Math.floor(Math.random() * 1000000),
          difficulty: 4,
          miner: 'EduChain Node ' + (Math.floor(Math.random() * 5) + 1),
          transactionCount: 5,
          size: 2048,
          transactions: Array.from({ length: 5 }, (_, i) => ({
            id: 'TX-' + Math.random().toString(36).substring(2, 15),
            type: ['KNOWLEDGE_CERTIFICATION', 'ACHIEVEMENT', 'COPYRIGHT'][Math.floor(Math.random() * 3)],
            timestamp: new Date(Date.now() - i * 1000).toISOString(),
            contentHash: '0x' + Math.random().toString(36).substring(2, 15),
            knowledgeId: Math.floor(Math.random() * 1000),
            userId: Math.floor(Math.random() * 100),
            status: 'confirmed',
          })),
        });
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Failed to load block detail:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleTransactionClick = (txId: string) => {
    router.push(`/blockchain/transaction/${txId}`);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      KNOWLEDGE_CERTIFICATION: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)' },
      ACHIEVEMENT: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)' },
      COPYRIGHT: { bg: 'rgba(168, 85, 247, 0.1)', color: 'rgb(168, 85, 247)' },
    };
    return colors[type as keyof typeof colors] || colors.KNOWLEDGE_CERTIFICATION;
  };

  const getTypeText = (type: string) => {
    const typeMap: Record<string, { zh: string; en: string }> = {
      KNOWLEDGE_CERTIFICATION: { zh: '知识存证', en: 'Knowledge Cert' },
      ACHIEVEMENT: { zh: '成就认证', en: 'Achievement' },
      COPYRIGHT: { zh: '版权登记', en: 'Copyright' },
    };
    return typeMap[type] || typeMap.KNOWLEDGE_CERTIFICATION;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="block-detail-page">
          <div className="block-background">
            <div className="block-blob block-blob-1" />
            <div className="block-blob block-blob-2" />
          </div>
          <div className="block-container container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{content.loading}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!block) {
    return (
      <>
        <Navbar />
        <div className="block-detail-page">
          <div className="block-background">
            <div className="block-blob block-blob-1" />
            <div className="block-blob block-blob-2" />
          </div>
          <div className="block-container container">
            <div className="empty-state glass-card">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>{content.notFound}</h3>
              <p>{content.notFoundDesc}</p>
              <button onClick={handleBack} className="back-btn glass-button hover-lift">
                {content.backBtn}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="block-detail-page">
        {/* 背景装饰 */}
        <div className="block-background">
          <div className="block-blob block-blob-1" />
          <div className="block-blob block-blob-2" />
        </div>

        <div className="block-container container">
          {/* 返回按钮 */}
          <button onClick={handleBack} className="back-button glass-button hover-lift">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {content.back}
          </button>

          {/* 区块信息卡片 */}
          <div className="block-info-card glass-card">
            <div className="card-header">
              <div className="header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="header-content">
                <h1 className="block-title">
                  {content.blockTitle} #{block.index}
                </h1>
                <p className="block-subtitle">{content.blockSubtitle}</p>
              </div>
              <div className="status-badge confirmed">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {content.confirmed}
              </div>
            </div>

            <div className="block-details">
              <div className="detail-row">
                <span className="detail-label">{content.details.hash}:</span>
                <code className="detail-value hash">{block.hash}</code>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.details.previousHash}:</span>
                <code className="detail-value hash">{block.previousHash}</code>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.details.timestamp}:</span>
                <span className="detail-value">
                  {new Date(block.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.details.nonce}:</span>
                <span className="detail-value">{block.nonce}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.details.difficulty}:</span>
                <span className="detail-value">{block.difficulty}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.details.miner}:</span>
                <span className="detail-value">{block.miner}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.details.size}:</span>
                <span className="detail-value">{block.size} bytes</span>
              </div>
            </div>
          </div>

          {/* 交易列表 */}
          <div className="transactions-section">
            <div className="section-header">
              <h2 className="section-title">
                {content.transactions.title} ({block.transactionCount})
              </h2>
              <p className="section-subtitle">{content.transactions.subtitle}</p>
            </div>

            <div className="transactions-list">
              {block.transactions.map((tx) => {
                const typeStyle = getTypeColor(tx.type);
                const typeText = getTypeText(tx.type);
                
                return (
                  <div
                    key={tx.id}
                    onClick={() => handleTransactionClick(tx.id)}
                    className="transaction-card glass-card hover-lift"
                  >
                    <div className="tx-header">
                      <div className="tx-id">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <code>{tx.id}</code>
                      </div>
                      <span
                        className="tx-type-badge"
                        style={{ background: typeStyle.bg, color: typeStyle.color }}
                      >
                        {typeText.zh}
                      </span>
                    </div>
                    <div className="tx-info">
                      <div className="tx-info-row">
                        <span className="tx-label">{content.transactions.contentHash}:</span>
                        <code className="tx-value">{tx.contentHash}</code>
                      </div>
                      <div className="tx-info-row">
                        <span className="tx-label">{content.transactions.timestamp}:</span>
                        <span className="tx-value">
                          {new Date(tx.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {tx.knowledgeId && (
                        <div className="tx-info-row">
                          <span className="tx-label">{content.transactions.knowledgeId}:</span>
                          <span className="tx-value">{tx.knowledgeId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
